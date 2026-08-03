import { sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
export const securityEvent = sqliteTable('security_event', {
	eventId: integer('event_id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').notNull(),
	emailId: integer('email_id').default(0).notNull(),
	identityId: integer('identity_id').default(0).notNull(),
	type: text('type').default('').notNull(),
	riskLevel: integer('risk_level').default(0).notNull(),
	title: text('title').default('').notNull(),
	description: text('description').default('').notNull(),
	suggestion: text('suggestion').default('').notNull(),
	status: integer('status').default(0).notNull(),
	createTime: text('create_time').default(sql`CURRENT_TIMESTAMP`).notNull()
});
export default securityEvent
