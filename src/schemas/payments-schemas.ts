import Joi from 'joi';
import { PaymentParams } from '@/services/payments-service';

export const paymentSchema = Joi.object<PaymentParams>({
  ticketId: Joi.number().required(),
  value: Joi.number().required(),
  cardIssuer: Joi.string().valid('VISA', 'MASTERCARD').required(), //VISA | MASTERCARD
  cardLastDigits: Joi.string().required(),
});
