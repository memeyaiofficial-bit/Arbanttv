import { pgTable, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const transactionStatusEnum = pgEnum('transaction_status', [
  'pending',
  'success',
  'failed',
  'cancelled',
]);

export const transactionTypeEnum = pgEnum('transaction_type', [
  'playlist_purchase',
  'creator_subscription',
]);

export const transactions = pgTable('transactions', {
  id:                 text('id').primaryKey(),
  userId:             text('user_id').references(() => users.id, { onDelete: 'set null' }),
  checkoutRequestId:  text('checkout_request_id').unique().notNull(),
  merchantRequestId:  text('merchant_request_id'),
  phoneNumber:        text('phone_number').notNull(),
  amount:             integer('amount').notNull(),
  fullName:           text('full_name').notNull(),
  email:              text('email').notNull(),
  accountReference:   text('account_reference').notNull(),
  type:               transactionTypeEnum('type').notNull(),
  status:             transactionStatusEnum('status').default('pending').notNull(),
  mpesaReceiptNumber: text('mpesa_receipt_number'),
  resultCode:         integer('result_code'),
  resultDesc:         text('result_desc'),
  createdAt:          timestamp('created_at').defaultNow().notNull(),
  updatedAt:          timestamp('updated_at').defaultNow().notNull(),
});

export type Transaction    = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
