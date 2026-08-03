import { sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
export const aiTask = sqliteTable('ai_task', {
	taskId: integer('task_id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').notNull(),
	type: text('type').default('').notNull(),
	status: integer('status').default(0).notNull(),
	input: text('input').default('{}').notNull(),
	output: text('output').default('{}').notNull(),
	model: text('model').default(''),
	tokenUsed: integer('token_used').default(0).notNull(),
	createTime: text('create_time').default(sql`CURRENT_TIMESTAMP`).notNull(),
	finishTime: text('finish_time')
});
export default aiTask
