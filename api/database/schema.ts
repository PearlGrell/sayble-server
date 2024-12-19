import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  password: text('password'),
  dob: text('dob').notNull(),
  image: text('image').notNull(),
  isVerified: integer('is_verified').default(0).notNull(),
  isLoggedIn: integer('is_logged_in').default(0).notNull(),
  otp: text('otp'),
  salt: text('salt'),
  tempPassword: text('temp_password'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP').notNull(),
});