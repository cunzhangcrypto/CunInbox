import orm from '../entity/orm';
import securityEvent from '../entity/security-event';
import { and, eq, desc, sql, count } from 'drizzle-orm';
import { securityConst } from '../const/entity-const';
import aiService from './ai-service';

const SECURITY_KEYWORDS = {
	password_change: ['password', '密码', '重置密码', 'change password', 'reset password', '修改密码'],
	abnormal_login: ['new device', '新设备', '新登录', 'unusual activity', '异常登录', 'new login', 'sign-in from'],
	data_breach: ['breach', 'leak', '泄露', '数据泄露', 'compromised', 'security incident']
};

const securityService = {

	async scanEmail(c, emailRow, analysis, platformId, identityId) {

		try {

			const subject = (emailRow.subject || '').toLowerCase();
			const text = aiService.cleanText(emailRow.text || emailRow.content, 500).toLowerCase();
			const combined = subject + ' ' + text;

			let ruleType = null;
			let ruleMatched = false;

			for (const [type, keywords] of Object.entries(SECURITY_KEYWORDS)) {
				if (keywords.some(kw => combined.includes(kw.toLowerCase()))) {
					ruleType = type;
					ruleMatched = true;
					break;
				}
			}

			if (!ruleMatched) {
				return null;
			}

			const riskLevel = this.calculateRiskLevel(combined, analysis.confidence || 0.5);

			const title = this.buildEventTitle(ruleType, emailRow.name || emailRow.sendEmail);

			const suggestion = await this.generateSuggestion(c, ruleType, emailRow, riskLevel);

			const eventRow = await orm(c).insert(securityEvent).values({
				userId: emailRow.userId,
				emailId: emailRow.emailId,
				identityId: identityId || 0,
				type: ruleType,
				riskLevel: riskLevel,
				title: title,
				description: analysis.summary || emailRow.subject || '',
				suggestion: suggestion,
				status: securityConst.status.UNPROCESSED
			}).returning().get();

			return eventRow;

		} catch (e) {
			console.error('安全扫描失败:', e);
			return null;
		}
	},

	calculateRiskLevel(text, aiConfidence) {

		const highRiskKeywords = ['urgent', '紧急', 'immediately', 'verify your account', 'suspended', 'verify identity', '确认身份'];
		const hasHighRisk = highRiskKeywords.some(kw => text.includes(kw.toLowerCase()));

		if (hasHighRisk && aiConfidence >= 0.6) {
			return securityConst.riskLevel.HIGH;
		}

		if (aiConfidence >= 0.7 || hasHighRisk) {
			return securityConst.riskLevel.MEDIUM;
		}

		return securityConst.riskLevel.LOW;
	},

	buildEventTitle(type, sender) {
		const titles = {
			password_change: `${sender} 密码变更通知`,
			abnormal_login: `${sender} 检测到新登录`,
			data_breach: `${sender} 数据安全事件`,
			phishing: `疑似钓鱼邮件: ${sender}`,
			suspicious: `可疑邮件: ${sender}`
		};
		return titles[type] || `安全事件: ${sender}`;
	},

	async generateSuggestion(c, type, emailRow, riskLevel) {

		const suggestions = {
			password_change: riskLevel >= securityConst.riskLevel.HIGH
				? '建议立即核实是否本人操作，如非本人请尽快修改密码并启用两步验证。'
				: '请确认密码修改是否为本人操作。',
			abnormal_login: riskLevel >= securityConst.riskLevel.HIGH
				? '检测到异常登录，建议立即检查账号安全设置，修改密码并查看登录设备列表。'
				: '检测到新设备登录，请确认是否为本人操作。',
			data_breach: '建议立即更改该平台密码，并检查其他使用相同密码的账号。',
			phishing: '请勿点击邮件中的链接或下载附件，建议直接删除该邮件。',
			suspicious: '请谨慎处理该邮件，不要轻易点击链接或提供个人信息。'
		};

		return suggestions[type] || '请关注此安全提醒。';
	},

	async list(c, params, userId) {

		let { riskLevel, status, size } = params;
		size = Number(size) || 20;

		if (size > 50) {
			size = 50;
		}

		const conditions = [eq(securityEvent.userId, userId)];

		if (riskLevel !== undefined && riskLevel !== '') {
			conditions.push(eq(securityEvent.riskLevel, Number(riskLevel)));
		}

		if (status !== undefined && status !== '') {
			conditions.push(eq(securityEvent.status, Number(status)));
		}

		return await orm(c).select().from(securityEvent)
			.where(and(...conditions))
			.orderBy(desc(securityEvent.createTime))
			.limit(size)
			.all();
	},

	async stats(c, userId) {

		const total = await orm(c).select({ total: count() })
			.from(securityEvent).where(eq(securityEvent.userId, userId)).get();

		const unprocessed = await orm(c).select({ total: count() })
			.from(securityEvent).where(and(
				eq(securityEvent.userId, userId),
				eq(securityEvent.status, securityConst.status.UNPROCESSED)
			)).get();

		const highRisk = await orm(c).select({ total: count() })
			.from(securityEvent).where(and(
				eq(securityEvent.userId, userId),
				eq(securityEvent.riskLevel, securityConst.riskLevel.HIGH),
				eq(securityEvent.status, securityConst.status.UNPROCESSED)
			)).get();

		return {
			total: total.total,
			unprocessed: unprocessed.total,
			highRisk: highRisk.total
		};
	},

	async setStatus(c, params, userId) {

		const { eventId, status } = params;

		await orm(c).update(securityEvent).set({ status: status })
			.where(and(
				eq(securityEvent.eventId, eventId),
				eq(securityEvent.userId, userId)
			)).run();
	}
};

export default securityService;
