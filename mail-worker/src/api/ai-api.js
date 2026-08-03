import app from '../hono/hono';
import emailAnalysisService from '../service/email-analysis-service';
import digestService from '../service/digest-service';
import aiService from '../service/ai-service';
import settingService from '../service/setting-service';
import identityService from '../service/identity-service';
import result from '../model/result';
import userContext from '../security/user-context';

app.get('/ai/status', async (c) => {
	const setting = await settingService.query(c);
	const provider = setting.aiProvider;
	const hasWorkersAI = !!c.env?.AI;
	const fallbackEnabled = setting.aiFallbackStatus === 0
		&& provider === 0
		&& !!setting.aiFallbackApiKey;

	// 主用模型标签
	let primaryLabel;
	if (provider === 0) {
		primaryLabel = hasWorkersAI ? 'Workers AI (免费)' : 'Workers AI (未绑定)';
	} else if (provider === 1) {
		primaryLabel = `DeepSeek: ${setting.aiModel || 'deepseek-chat'}`;
	} else {
		primaryLabel = `自定义: ${setting.aiModel || 'deepseek-chat'}`;
	}

	// 备用模型标签
	let fallbackLabel = '';
	if (fallbackEnabled) {
		fallbackLabel = `${setting.aiFallbackModel || 'deepseek-chat'} @ ${setting.aiFallbackBaseUrl || 'https://api.deepseek.com'}`;
	}

	return c.json(result.ok({
		provider: provider,
		primaryLabel,
		primaryModel: setting.aiModel || 'deepseek-chat',
		primaryBaseUrl: setting.aiBaseUrl || 'https://api.deepseek.com',
		hasWorkersAI,
		fallbackEnabled,
		fallbackLabel,
		fallbackModel: setting.aiFallbackModel || 'deepseek-chat',
		fallbackBaseUrl: setting.aiFallbackBaseUrl || 'https://api.deepseek.com'
	}));
});

app.get('/ai/analysis/list', async (c) => {
	const list = await emailAnalysisService.listByUserId(c, c.req.query(), userContext.getUserId(c));
	return c.json(result.ok(list));
});

app.get('/ai/analysis/newIdentity', async (c) => {
	const list = await emailAnalysisService.listNewIdentity(c, userContext.getUserId(c));
	return c.json(result.ok(list));
});

app.post('/ai/analysis/confirmIdentity', async (c) => {
	const data = await emailAnalysisService.confirmIdentity(c, await c.req.json(), userContext.getUserId(c));
	return c.json(result.ok(data));
});

app.post('/ai/analysis/batch', async (c) => {
	const data = await emailAnalysisService.analyzeBatch(c, userContext.getUserId(c));
	return c.json(result.ok(data));
});

app.get('/ai/analysis/stats', async (c) => {
	const data = await emailAnalysisService.statsByCategory(c, userContext.getUserId(c));
	return c.json(result.ok(data));
});

app.get('/ai/digest/list', async (c) => {
	const list = await digestService.list(c, c.req.query(), userContext.getUserId(c));
	return c.json(result.ok(list));
});

app.post('/ai/digest/generate', async (c) => {
	const data = await digestService.generateDaily(c, userContext.getUserId(c), c.req.query('date'));
	return c.json(result.ok(data));
});

app.post('/ai/chat', async (c) => {

	const { message, context } = await c.req.json();
	const userId = userContext.getUserId(c);

	const identities = await identityService.list(c, {}, userId);

	const systemContent = `你是CunInbox的AI助手，帮助用户管理数字身份和邮件。

用户当前有${identities.list?.length || 0}个数字身份记录。

用户问题: ${message}

请用简洁的中文回答，帮助用户管理他们的数字身份、邮箱和安全。`;

	const messages = [
		{ role: 'system', content: systemContent },
		{ role: 'user', content: message }
	];

	const aiResult = await aiService.chat(c, messages, {
		temperature: 0.6,
		maxTokens: 1024
	});

	// 同时返回 provider 信息，让前端显示当前使用哪个模型 / 是否降级
	return c.json(result.ok({
		reply: aiResult.content,
		timestamp: Date.now(),
		provider: aiResult.provider,
		providerName: aiResult.providerName,
		fallback: aiResult.fallback || false,
		fallbackReason: aiResult.fallbackReason || ''
	}));
});
