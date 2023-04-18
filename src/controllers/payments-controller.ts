import { Response } from 'express';
import httpStatus from 'http-status';
import { badRequestError } from '@/errors';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService, { Data } from '@/services/payments-service';

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  const ticketId = Number(req.query.ticketId) as number;
  // console.log(userId)

  try {
    const findPayment = await paymentsService.getPaymentService(userId, ticketId);
    // console.log(findPayment)
    return res.status(httpStatus.OK).send(findPayment);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'BAD_REQUEST') {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  console.log(userId);
  const data = req.body as Data;

  try {
    const postPayment = await paymentsService.createPaymentService(data, userId);
    console.log(postPayment);
    return res.status(httpStatus.OK).send(postPayment);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
