import { sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
export const platform = sqliteTable('platform', {
	platformId: integer('platform_id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	domain: text('domain').default('').notNull(),
	category: text('category').default('other').notNull(),
	icon: text('icon').default(''),
	description: text('description').default(''),
	officialUrl: text('official_url').default(''),
	isSystem: integer('is_system').default(0).notNull(),
	createTime: text('create_time').default(sql`CURRENT_TIMESTAMP`).notNull()
});
export default platform
