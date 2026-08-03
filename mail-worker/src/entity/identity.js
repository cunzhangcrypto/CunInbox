import { sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
export const identity = sqliteTable('identity', {
	identityId: integer('identity_id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').notNull(),
	platformId: integer('platform_id').default(0).notNull(),
	accountId: integer('account_id').default(0).notNull(),
	identityEmail: text('identity_email').default('').notNull(),
	name: text('name').default('').notNull(),
	category: text('category').default('other').notNull(),
	status: integer('status').default(0).notNull(),
	registerTime: text('register_time'),
	lastActiveTime: text('last_active_time'),
	purpose: text('purpose').default(''),
	remark: text('remark').default(''),
	isDel: integer('is_del').default(0).notNull(),
	createTime: text('create_time').default(sql`CURRENT_TIMESTAMP`).notNull()
});
export default identity
