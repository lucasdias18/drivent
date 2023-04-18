import { Router } from 'express';
import { createPayment, getPayments } from '@/controllers/payments-controller';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPayments).post('/process', createPayment);

export { paymentsRouter };
