import orm from '../entity/orm';
import platform from '../entity/platform';
import { eq, or, like, and } from 'drizzle-orm';

const platformService = {

	async list(c, params = {}) {

		const { keyword, category } = params;

		const conditions = [];

		if (category) {
			conditions.push(eq(platform.category, category));
		}

		if (keyword) {
			conditions.push(or(
				like(platform.name, `%${keyword}%`),
				like(platform.domain, `%${keyword}%`)
			));
		}

		const query = orm(c).select().from(platform);

		if (conditions.length > 0) {
			query.where(conditions.length > 1 ? and(...conditions) : conditions[0]);
		}

		return await query.orderBy(platform.name).all();
	},

	selectById(c, platformId) {
		return orm(c).select().from(platform).where(eq(platform.platformId, platformId)).get();
	},

	async selectByDomain(c, domain) {
		return await orm(c).select().from(platform).where(like(platform.domain, `%${domain}%`)).all();
	},

	async add(c, params) {
		return await orm(c).insert(platform).values({
			name: params.name,
			domain: params.domain || '',
			category: params.category || 'other',
			icon: params.icon || '',
			description: params.description || '',
			officialUrl: params.officialUrl || '',
			isSystem: 0
		}).returning().get();
	},

	async update(c, params) {
		const { platformId, name, domain, category, icon, description, officialUrl } = params;
		await orm(c).update(platform).set({
			name, domain, category, icon, description, officialUrl
		}).where(eq(platform.platformId, platformId)).run();
	},

	async findOrCreate(c, name, domain, category) {
		let platformRow = await orm(c).select().from(platform).where(
			like(platform.domain, `%${domain}%`)
		).get();

		if (!platformRow) {
			platformRow = await this.add(c, {
				name: name,
				domain: domain,
				category: category || 'other'
			});
		}

		return platformRow;
	}
};

export default platformService;
