import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };

  try {
    const result = await bookingService.getBookingService(userId);

    return res.send(result);
  } catch (error) {
    if (error.name === 'notFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  const { roomId } = req.body as { roomId: number };

  try {
    const result = await bookingService.postBookingService(userId, roomId);

    return res.send(result);
  } catch (error) {
    if (error.name === 'notFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'forbiddenError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  const { roomId } = req.body as { roomId: number };
  const { bookingId } = req.params;

  try {
    const booking = await bookingService.updateBookingService(userId, roomId, Number(bookingId));

    return booking;
  } catch (error) {
    if (error.name === 'notFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'forbiddenError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
