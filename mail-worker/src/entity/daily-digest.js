import { sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
export const dailyDigest = sqliteTable('daily_digest', {
	digestId: integer('digest_id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').notNull(),
	digestDate: text('digest_date').notNull(),
	content: text('content').default('').notNull(),
	importantCount: integer('important_count').default(0).notNull(),
	emailIds: text('email_ids').default('[]').notNull(),
	createTime: text('create_time').default(sql`CURRENT_TIMESTAMP`).notNull()
});
export default dailyDigest
