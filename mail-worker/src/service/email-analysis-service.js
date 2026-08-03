import orm from '../entity/orm';
import emailAnalysis from '../entity/email-analysis';
import email from '../entity/email';
import { and, eq, desc, inArray, gte, sql } from 'drizzle-orm';
import { analysisConst, isDel } from '../const/entity-const';
import aiService from './ai-service';
import platformService from './platform-service';
import identityService from './identity-service';
import securityService from './security-service';
import settingService from './setting-service';
import emailUtils from '../utils/email-utils';

const emailAnalysisService = {

	async analyzeEmail(c, emailRow) {

		try {

			const setting = await settingService.query(c);

			if (setting.aiAnalysisStatus === 0) {
				return null;
			}

			if (!emailRow.userId) {
				return null;
			}

			const existing = await this.selectByEmailId(c, emailRow.emailId);
			if (existing) {
				return existing;
			}

			const text = aiService.cleanText(emailRow.text || emailRow.content, 800);
			const subject = emailRow.subject || '';
			const sendEmail = emailRow.sendEmail || '';
			const senderName = emailRow.name || '';

			if (!subject && !text) {
				return null;
			}

			const messages = [
				{
					role: 'system',
					content: '你是一个数字身份管理助手。分析邮件并返回JSON。只返回JSON，不要其他内容。'
				},
				{
					role: 'user',
					content: `分析以下邮件，提取信息：

发件人: ${sendEmail}
发件名: ${senderName}
主题: ${subject}
正文: ${text}

返回JSON格式:
{
  "category": "register/verify/security/bill/update/marketing/social",
  "summary": "一句话摘要(中文)",
  "platform_name": "平台名(如GitHub,无则空)",
  "platform_domain": "平台域名(无则空)",
  "platform_category": "dev/ai/saas/social/cloud/web3/finance/shop/news/other",
  "is_new_identity": true/false,
  "confidence": 0.0-1.0,
  "key_info": {
    "action_required": "需要操作的内容(无则空)",
    "deadline": "截止时间(无则空)",
    "amount": "金额(无则空)"
  }
}`
				}
			];

			const aiResult = await aiService.chatWithJSON(c, messages, {
				temperature: 0.2,
				maxTokens: 512
			});

			if (!aiResult.json) {
				return null;
			}

			const analysis = aiResult.json;

			let platformId = 0;
			if (analysis.platform_domain) {
				const platformRow = await platformService.findOrCreate(
					c,
					analysis.platform_name || senderName,
					analysis.platform_domain,
					analysis.platform_category
				);
				platformId = platformRow.platformId;
			}

			let identityId = 0;
			let isNewIdentity = 0;

			if (emailRow.accountId && platformId) {
				const identityList = await identityService.findByPlatform(c, emailRow.userId, platformId);
				if (identityList.length > 0) {
					identityId = identityList[0].identityId;
					await identityService.updateLastActiveTime(c, identityId);
				} else {
					isNewIdentity = 1;
				}
			} else if (emailRow.accountId) {
				const identityList = await identityService.findByIdentityEmail(c, emailRow.userId, emailRow.toEmail);
				if (identityList) {
					identityId = identityList.identityId;
					await identityService.updateLastActiveTime(c, identityId);
				} else {
					isNewIdentity = 1;
				}
			}

			const analysisRow = await orm(c).insert(emailAnalysis).values({
				emailId: emailRow.emailId,
				userId: emailRow.userId,
				category: analysis.category || '',
				summary: analysis.summary || '',
				keyInfo: JSON.stringify(analysis.key_info || {}),
				platformId: platformId,
				identityId: identityId,
				isNewIdentity: isNewIdentity,
				confidence: analysis.confidence || 0
			}).returning().get();

			if (analysis.category === analysisConst.category.SECURITY && emailRow.userId) {
				await securityService.scanEmail(c, emailRow, analysis, platformId, identityId);
			}

			return analysisRow;

		} catch (e) {
			console.error('邮件AI分析失败:', e);
			return null;
		}
	},

	selectByEmailId(c, emailId) {
		return orm(c).select().from(emailAnalysis).where(eq(emailAnalysis.emailId, emailId)).get();
	},

	async listByUserId(c, params, userId) {

		let { category, size } = params;
		size = Number(size) || 20;

		if (size > 50) {
			size = 50;
		}

		const conditions = [
			eq(emailAnalysis.userId, userId)
		];

		if (category) {
			conditions.push(eq(emailAnalysis.category, category));
		}

		return await orm(c).select({
			...emailAnalysis,
			subject: email.subject,
			sendEmail: email.sendEmail,
			emailName: email.name,
			toEmail: email.toEmail,
			createTime: email.createTime,
			unread: email.unread
		}).from(emailAnalysis)
			.leftJoin(email, eq(emailAnalysis.emailId, email.emailId))
			.where(and(...conditions))
			.orderBy(desc(emailAnalysis.createTime))
			.limit(size)
			.all();
	},

	async listNewIdentity(c, userId) {

		return await orm(c).select({
			...emailAnalysis,
			subject: email.subject,
			sendEmail: email.sendEmail,
			emailName: email.name,
			toEmail: email.toEmail,
			createTime: email.createTime
		}).from(emailAnalysis)
			.leftJoin(email, eq(emailAnalysis.emailId, email.emailId))
			.where(and(
				eq(emailAnalysis.userId, userId),
				eq(emailAnalysis.isNewIdentity, 1)
			))
			.orderBy(desc(emailAnalysis.createTime))
			.limit(20)
			.all();
	},

	async confirmIdentity(c, params, userId) {

		const { analysisId, name, category, purpose, remark } = params;

		const analysisRow = await orm(c).select().from(emailAnalysis)
			.where(eq(emailAnalysis.analysisId, analysisId)).get();

		if (!analysisRow || analysisRow.userId !== userId) {
			return;
		}

		const emailRow = await orm(c).select().from(email)
			.where(eq(email.emailId, analysisRow.emailId)).get();

		const identityRow = await identityService.add(c, {
			name: name,
			platformId: analysisRow.platformId,
			accountId: emailRow?.accountId || 0,
			identityEmail: emailRow?.toEmail || '',
			category: category,
			purpose: purpose || '',
			remark: remark || '',
			registerTime: emailRow?.createTime
		}, userId);

		await orm(c).update(emailAnalysis).set({
			identityId: identityRow.identityId,
			isNewIdentity: 0
		}).where(eq(emailAnalysis.analysisId, analysisId)).run();

		return identityRow;
	},

	async statsByCategory(c, userId) {

		return await orm(c).select({
			category: emailAnalysis.category,
			total: sql`count(*)`
		}).from(emailAnalysis)
			.where(eq(emailAnalysis.userId, userId))
			.groupBy(emailAnalysis.category)
			.all();
	},

	async analyzeBatch(c, userId) {

		const analyzedEmailIds = await orm(c).select({ emailId: emailAnalysis.emailId })
			.from(emailAnalysis).all();
		const analyzedIds = analyzedEmailIds.map(item => item.emailId);

		const unanalyzed = await orm(c).select().from(email)
			.where(and(
				eq(email.userId, userId),
				eq(email.type, 0),
				eq(email.isDel, isDel.NORMAL),
				analyzedIds.length > 0 ? sql`${email.emailId} NOT IN (${sql.join(analyzedIds.map(id => sql`${id}`), sql`,`)})` : sql`1=1`
			))
			.orderBy(desc(email.emailId))
			.limit(20)
			.all();

		for (const emailRow of unanalyzed) {
			await this.analyzeEmail(c, emailRow);
		}

		return { analyzed: unanalyzed.length };
	}
};

export default emailAnalysisService;
