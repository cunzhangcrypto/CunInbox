import orm from '../entity/orm';
import identity from '../entity/identity';
import platform from '../entity/platform';
import account from '../entity/account';
import { and, eq, desc, like, or, count, sql } from 'drizzle-orm';
import { isDel, identityConst } from '../const/entity-const';
import BizError from '../error/biz-error';

const identityService = {

	async list(c, params, userId) {

		let { category, status, keyword } = params;

		const conditions = [
			eq(identity.userId, userId),
			eq(identity.isDel, isDel.NORMAL)
		];

		if (category) {
			conditions.push(eq(identity.category, category));
		}

		if (status !== undefined && status !== '') {
			conditions.push(eq(identity.status, Number(status)));
		}

		if (keyword) {
			conditions.push(or(
				like(identity.name, `%${keyword}%`),
				like(identity.identityEmail, `%${keyword}%`)
			));
		}

		return await orm(c).select({
			...identity,
			platformName: platform.name,
			platformIcon: platform.icon,
			platformDomain: platform.domain
		}).from(identity)
			.leftJoin(platform, eq(identity.platformId, platform.platformId))
			.where(and(...conditions))
			.orderBy(desc(identity.createTime))
			.all();
	},

	async listWithStats(c, userId) {

		const list = await this.list(c, {}, userId);

		const stats = await orm(c).select({
			category: identity.category,
			total: count()
		}).from(identity)
			.where(and(
				eq(identity.userId, userId),
				eq(identity.isDel, isDel.NORMAL)
			))
			.groupBy(identity.category)
			.all();

		return { list, stats };
	},

	selectById(c, identityId, userId) {
		return orm(c).select({
			...identity,
			platformName: platform.name,
			platformIcon: platform.icon,
			platformDomain: platform.domain,
			platformUrl: platform.officialUrl
		}).from(identity)
			.leftJoin(platform, eq(identity.platformId, platform.platformId))
			.where(and(
				eq(identity.identityId, identityId),
				eq(identity.userId, userId),
				eq(identity.isDel, isDel.NORMAL)
			)).get();
	},

	async add(c, params, userId) {

		const { name, platformId, accountId, identityEmail, category, registerTime, purpose, remark } = params;

		if (!name) {
			throw new BizError('身份名称不能为空');
		}

		const identityRow = await orm(c).insert(identity).values({
			userId: userId,
			platformId: platformId || 0,
			accountId: accountId || 0,
			identityEmail: identityEmail || '',
			name: name,
			category: category || 'other',
			status: identityConst.status.ACTIVE,
			registerTime: registerTime || null,
			purpose: purpose || '',
			remark: remark || ''
		}).returning().get();

		if (accountId) {
			await orm(c).update(account).set({
				identityId: identityRow.identityId,
				aliasType: identityConst.aliasType.ALIAS
			}).where(eq(account.accountId, accountId)).run();
		}

		return identityRow;
	},

	async update(c, params, userId) {

		const { identityId, name, platformId, accountId, identityEmail, category, status, registerTime, purpose, remark } = params;

		const identityRow = await this.selectById(c, identityId, userId);

		if (!identityRow) {
			throw new BizError('身份记录不存在');
		}

		await orm(c).update(identity).set({
			name, platformId: platformId || 0, accountId: accountId || 0,
			identityEmail, category, status: status !== undefined ? status : identityRow.status,
			registerTime, purpose, remark
		}).where(eq(identity.identityId, identityId)).run();

		if (accountId && accountId !== identityRow.accountId) {
			await orm(c).update(account).set({
				identityId: identityId,
				aliasType: identityConst.aliasType.ALIAS
			}).where(eq(account.accountId, accountId)).run();
		}
	},

	async delete(c, params, userId) {

		const { identityId } = params;

		const identityRow = await this.selectById(c, identityId, userId);

		if (!identityRow) {
			throw new BizError('身份记录不存在');
		}

		await orm(c).update(identity).set({ isDel: isDel.DELETE })
			.where(eq(identity.identityId, identityId)).run();

		if (identityRow.accountId) {
			await orm(c).update(account).set({
				identityId: 0,
				aliasType: identityConst.aliasType.MAIN
			}).where(eq(account.accountId, identityRow.accountId)).run();
		}
	},

	async setStatus(c, params, userId) {

		const { identityId, status } = params;

		const identityRow = await this.selectById(c, identityId, userId);

		if (!identityRow) {
			throw new BizError('身份记录不存在');
		}

		await orm(c).update(identity).set({ status: status })
			.where(eq(identity.identityId, identityId)).run();
	},

	async findByIdentityEmail(c, userId, identityEmail) {
		return await orm(c).select().from(identity).where(and(
			eq(identity.userId, userId),
			eq(identity.identityEmail, identityEmail),
			eq(identity.isDel, isDel.NORMAL)
		)).get();
	},

	async findByPlatform(c, userId, platformId) {
		return await orm(c).select().from(identity).where(and(
			eq(identity.userId, userId),
			eq(identity.platformId, platformId),
			eq(identity.isDel, isDel.NORMAL)
		)).all();
	},

	async updateLastActiveTime(c, identityId) {
		await orm(c).update(identity).set({ lastActiveTime: sql`CURRENT_TIMESTAMP` })
			.where(eq(identity.identityId, identityId)).run();
	},

	async checkInactiveIdentities(c, userId, days = 90) {

		const date = new Date();
		date.setDate(date.getDate() - days);
		const threshold = date.toISOString();

		return await orm(c).update(identity).set({ status: identityConst.status.INACTIVE })
			.where(and(
				eq(identity.userId, userId),
				eq(identity.status, identityConst.status.ACTIVE),
				sql`(last_active_time IS NOT NULL AND last_active_time < ${threshold})`
			)).returning().all();
	}
};

export default identityService;
