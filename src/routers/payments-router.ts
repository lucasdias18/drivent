import { Router } from 'express';
import { createPayment, getPayments } from '@/controllers/payments-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { paymentSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter
  .get('/', getPayments)
  .all('/*', authenticateToken)
  //   .get('/', getEnrollmentByUser)
  .post('/process', validateBody(paymentSchema), createPayment);

export { paymentsRouter };
