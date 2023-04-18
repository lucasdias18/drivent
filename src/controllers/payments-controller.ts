import { Response } from 'express';
import httpStatus from 'http-status';
import { badRequestError } from '@/errors';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService, { Data } from '@/services/payments-service';

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  const ticketId = Number(req.query.ticketId) as number;

  try {
    const findPayment = await paymentsService.getPaymentService(userId, ticketId);
    // console.log(findPayment)
    return res.status(httpStatus.OK).send(findPayment);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  const data = req.body as unknown;
  if (typeof data !== 'object' || data === null || !('ticketId' in data) || !('cardData' in data)) {
    throw badRequestError();
  }
  const validatedData = data as Data;

  try {
    const postPayment = await paymentsService.createPaymentService(validatedData, userId);
    console.log(postPayment);
    return res.status(httpStatus.OK).send(postPayment);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
