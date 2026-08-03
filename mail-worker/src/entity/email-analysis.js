import { sqliteTable, text, integer, real} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
export const emailAnalysis = sqliteTable('email_analysis', {
	analysisId: integer('analysis_id').primaryKey({ autoIncrement: true }),
	emailId: integer('email_id').notNull(),
	userId: integer('user_id').notNull(),
	category: text('category').default('').notNull(),
	summary: text('summary').default('').notNull(),
	keyInfo: text('key_info').default('{}').notNull(),
	platformId: integer('platform_id').default(0).notNull(),
	identityId: integer('identity_id').default(0).notNull(),
	isNewIdentity: integer('is_new_identity').default(0).notNull(),
	confidence: real('confidence').default(0).notNull(),
	createTime: text('create_time').default(sql`CURRENT_TIMESTAMP`).notNull()
});
export default emailAnalysis
