import { Payment } from '@prisma/client';
import { badRequestError, notFoundError } from '@/errors';
import paymentsRepository from '@/repositories/payments-repository';

async function getPaymentService(userId: number, ticketId: number) {
  if (!ticketId) throw badRequestError();

  const findPayment = await paymentsRepository.getPayment(userId, ticketId);

  if (!findPayment) throw notFoundError();

  // if (findPayment.Enrollment.userId !== userId) throw unauthorizedError();

  return findPayment;
}

async function createPaymentService(data: Data, userId: number) {
  const payment = await paymentsRepository.createPayment(userId, data);

  if (!payment) throw notFoundError();

  return payment;
}

export type Data = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

// type Data = {
// 	issuer: string,
//     number: number,
//     name: string,
//     expirationDate: Date,
//     cvv: number
// }

export type PaymentParams = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

const paymentsService = {
  getPaymentService,
  createPaymentService,
};

export default paymentsService;
