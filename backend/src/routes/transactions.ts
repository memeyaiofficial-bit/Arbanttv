import { Router } from 'express';
import * as transactionsController from '../controllers/transactions';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/roles';
import { transactionCreateSchema, transactionUpdateSchema, transactionIdSchema } from '../validations/transactions';

const router = Router();

router.post('/', authenticate, validate(transactionCreateSchema), transactionsController.createTransaction);
router.get('/', authenticate, transactionsController.getTransactions);
router.get('/:id', authenticate, validate(transactionIdSchema), transactionsController.getTransactionById);
router.put('/:id', authenticate, requireAdmin, validate(transactionUpdateSchema), transactionsController.updateTransaction);
router.delete('/:id', authenticate, requireAdmin, validate(transactionIdSchema), transactionsController.deleteTransaction);

export default router;
