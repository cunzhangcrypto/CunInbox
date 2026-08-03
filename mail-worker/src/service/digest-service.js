import orm from '../entity/orm';
import dailyDigest from '../entity/daily-digest';
import email from '../entity/email';
import emailAnalysis from '../entity/email-analysis';
import { and, eq, desc, gte, lte, sql } from 'drizzle-orm';
import { emailConst, isDel, analysisConst } from '../const/entity-const';
import aiService from './ai-service';
import dayjs from 'dayjs';

const digestService = {

	async generateDaily(c, userId, date) {

		const day = date || dayjs().format('YYYY-MM-DD');

		const existing = await this.getByDate(c, userId, day);
		if (existing) {
			return existing;
		}

		const startOfDay = day + ' 00:00:00';
		const endOfDay = day + ' 23:59:59';

		const emails = await orm(c).select({
			emailId: email.emailId,
			subject: email.subject,
			sendEmail: email.sendEmail,
			name: email.name,
			toEmail: email.toEmail,
			createTime: email.createTime,
			summary: emailAnalysis.summary,
			category: emailAnalysis.category
		}).from(email)
			.leftJoin(emailAnalysis, eq(email.emailId, emailAnalysis.emailId))
			.where(and(
				eq(email.userId, userId),
				eq(email.type, emailConst.type.RECEIVE),
				eq(email.isDel, isDel.NORMAL),
				gte(email.createTime, startOfDay),
				lte(email.createTime, endOfDay)
			))
			.orderBy(desc(email.createTime))
			.limit(50)
			.all();

		if (emails.length === 0) {
			return null;
		}

		const importantEmails = emails.filter(item =>
			item.category === analysisConst.category.SECURITY ||
			item.category === analysisConst.category.BILL ||
			item.category === analysisConst.category.VERIFY
		);

		const emailListText = emails.map((item, idx) =>
			`${idx + 1}. [${item.category || '其他'}] ${item.name}: ${item.subject} (${item.summary || '无摘要'})`
		).join('\n');

		const messages = [
			{
				role: 'system',
				content: '你是CunInbox的AI助手，负责生成每日邮件摘要。用简洁的中文输出。'
			},
			{
				role: 'user',
				content: `以下是用户${day}收到的邮件列表，请生成一份每日摘要：

${emailListText}

输出格式：
今日重要信息：
1. [分类] 简要描述
2. ...

今日概览：共X封邮件，其中重要邮件Y封。`
			}
		];

		const aiResult = await aiService.chat(c, messages, {
			temperature: 0.4,
			maxTokens: 1024
		});

		const digestRow = await orm(c).insert(dailyDigest).values({
			userId: userId,
			digestDate: day,
			content: aiResult.content,
			importantCount: importantEmails.length,
			emailIds: JSON.stringify(emails.map(item => item.emailId))
		}).returning().get();

		return digestRow;
	},

	async getByDate(c, userId, date) {
		return await orm(c).select().from(dailyDigest).where(and(
			eq(dailyDigest.userId, userId),
			eq(dailyDigest.digestDate, date)
		)).get();
	},

	async list(c, params, userId) {

		let { size } = params;
		size = Number(size) || 10;

		if (size > 30) {
			size = 30;
		}

		return await orm(c).select().from(dailyDigest)
			.where(eq(dailyDigest.userId, userId))
			.orderBy(desc(dailyDigest.digestDate))
			.limit(size)
			.all();
	},

	async generateForAllUsers(c, env) {

		const users = await env.db.prepare(`SELECT DISTINCT user_id FROM email WHERE type = 0 AND is_del = 0 AND create_time >= ?`).bind(dayjs().format('YYYY-MM-DD') + ' 00:00:00').all();

		const date = dayjs().format('YYYY-MM-DD');

		for (const userRow of users.results) {
			try {
				const ctx = { env: env, req: { header: () => '' } };
				await this.generateDaily({ env }, userRow.user_id, date);
			} catch (e) {
				console.error(`用户${userRow.user_id}摘要生成失败:`, e);
			}
		}
	}
};

export default digestService;
