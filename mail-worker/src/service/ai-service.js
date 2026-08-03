import { aiProviderConst } from '../const/entity-const';
import settingService from './setting-service';
import BizError from '../error/biz-error';

const WORKERS_AI_MODEL = '@cf/meta/llama-3.1-8b-instruct';

const aiService = {

	/**
	 * 主入口：按主用 provider 调用，失败时按规则尝试降级
	 * 返回 result 上附加 provider / fallback 字段，用于 UI 显示
	 */
	async chat(c, messages, options = {}) {

		const setting = await settingService.query(c);

		const provider = setting.aiProvider;
		const model = setting.aiModel || 'deepseek-chat';
		const apiKey = setting.aiApiKey;
		const baseUrl = setting.aiBaseUrl || 'https://api.deepseek.com';

		// 降级配置：仅当主用 Workers AI 且启用降级、配置了备用 Key 时才生效
		const fallbackEnabled = setting.aiFallbackStatus === 0
			&& provider === aiProviderConst.WORKERS_AI
			&& !!setting.aiFallbackApiKey;

		try {

			let result;

			if (provider === aiProviderConst.WORKERS_AI) {
				result = await this.runWorkersAI(c, messages, options);
			} else if (provider === aiProviderConst.DEEPSEEK || provider === aiProviderConst.CUSTOM) {
				if (!apiKey) {
					throw new BizError('AI API Key 未配置');
				}
				result = await this.runOpenAICompatible(baseUrl, apiKey, model, messages, options);
			} else {
				result = await this.runWorkersAI(c, messages, options);
			}

			return {
				...result,
				provider: provider,
				providerName: this.providerLabel(provider, model),
				fallback: false
			};

		} catch (e) {

			// 不符合降级条件，直接抛错
			if (!fallbackEnabled) {
				throw e;
			}

			console.warn('[AI] 主用 Workers AI 失败，降级到备用模型:', e.message);
			const fbResult = await this.runOpenAICompatible(
				setting.aiFallbackBaseUrl || 'https://api.deepseek.com',
				setting.aiFallbackApiKey,
				setting.aiFallbackModel || 'deepseek-chat',
				messages,
				options
			);

			return {
				...fbResult,
				provider: provider,
				providerName: this.providerLabel(provider, setting.aiFallbackModel, true),
				fallback: true,
				fallbackReason: e.message
			};
		}
	},

	/**
	 * 生成 UI 显示用的 provider 标签
	 * @param {number} provider 0=Workers AI 1=DeepSeek 2=自定义
	 * @param {string} model 模型名
	 * @param {boolean} fallback 是否处于降级状态
	 */
	providerLabel(provider, model, fallback = false) {
		if (provider === aiProviderConst.WORKERS_AI) {
			return fallback ? `降级: ${model || 'deepseek-chat'}` : 'Workers AI (免费)';
		}
		if (provider === aiProviderConst.DEEPSEEK) {
			return `DeepSeek: ${model || 'deepseek-chat'}`;
		}
		return `自定义: ${model || 'deepseek-chat'}`;
	},

	async runWorkersAI(c, messages, options = {}) {

		if (!c.env.AI) {
			throw new BizError('Workers AI 未绑定，请在 wrangler.toml 配置 AI binding 或切换为 DeepSeek');
		}

		const model = options.model || WORKERS_AI_MODEL;

		const response = await c.env.AI.run(model, {
			messages: messages,
			temperature: options.temperature ?? 0.3,
			max_tokens: options.maxTokens ?? 1024
		});

		return {
			content: response.response || '',
			model: model,
			tokenUsed: 0
		};
	},

	async runOpenAICompatible(baseUrl, apiKey, model, messages, options = {}) {

		const url = baseUrl.replace(/\/$/, '') + '/v1/chat/completions';

		const body = {
			model: model,
			messages: messages,
			temperature: options.temperature ?? 0.3,
			max_tokens: options.maxTokens ?? 1024
		};

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const errText = await response.text();
			throw new BizError(`AI调用失败: ${response.status} ${errText}`);
		}

		const data = await response.json();

		return {
			content: data.choices?.[0]?.message?.content || '',
			model: model,
			tokenUsed: data.usage?.total_tokens || 0
		};
	},

	async chatWithJSON(c, messages, options = {}) {

		const result = await this.chat(c, messages, options);

		let parsed = null;
		try {
			const content = result.content.trim();
			const jsonStr = this.extractJSON(content);
			parsed = JSON.parse(jsonStr);
		} catch (e) {
			console.warn('AI返回JSON解析失败:', result.content);
		}

		return {
			...result,
			json: parsed
		};
	},

	extractJSON(text) {
		text = text.trim();
		if (text.startsWith('```')) {
			text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
		}
		const start = text.indexOf('{');
		const end = text.lastIndexOf('}');
		if (start !== -1 && end !== -1 && end > start) {
			return text.substring(start, end + 1);
		}
		return text;
	},

	cleanText(text, maxLen = 800) {
		if (!text) {
			return '';
		}
		text = text.replace(/<[^>]+>/g, ' ');
		text = text.replace(/\s+/g, ' ').trim();
		if (text.length > maxLen) {
			text = text.substring(0, maxLen);
		}
		return text;
	}
};

export default aiService;
