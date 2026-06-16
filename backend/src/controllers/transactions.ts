import { Request, Response, NextFunction } from 'express';
import * as transactionsService from '../services/transactions';
import { extractUser } from '../utils/supabase';

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const transaction = await transactionsService.createTransactionService(req.body, authUser);
    res.status(201).json({ success: true, data: transaction });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const transaction = await transactionsService.findTransactionByIdService(req.params.id as string, authUser);
    if (!transaction) {
      res.status(404).json({ success: false, error: 'Transaction not found' });
      return;
    }
    res.status(200).json({ success: true, data: transaction });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const allTransactions = await transactionsService.findAllTransactionsService(limit, offset, authUser);
    res.status(200).json({ success: true, data: allTransactions });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const transaction = await transactionsService.updateTransactionService(req.params.id as string, req.body, authUser);
    res.status(200).json({ success: true, data: transaction });
  } catch (error: any) {
    if (error.status === 403 || error.status === 404) {
      res.status(error.status).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const transaction = await transactionsService.deleteTransactionService(req.params.id as string, authUser);
    res.status(200).json({ success: true, data: transaction });
  } catch (error: any) {
    if (error.status === 403 || error.status === 404) {
      res.status(error.status).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};
