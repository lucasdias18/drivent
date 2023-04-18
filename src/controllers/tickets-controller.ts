// import { postTicketsService } from "@/services/tickets-service";
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { getTicketsByUser, getTicketsTypesService, postTicketsService } from '@/services/tickets-service';

export async function getTicketsTypes(req: Request, res: Response) {
  try {
    const ticketsTypes = await getTicketsTypesService();
    // console.log(ticketsTypes)

    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  // console.log(userId)

  try {
    const tickets = await getTicketsByUser(userId);
    // console.log(tickets)

    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body as { ticketTypeId: number };
  const { userId } = req as { userId: number };
  // console.log(userId)

  try {
    const createTicket = await postTicketsService(ticketTypeId, userId);
    // console.log(createTicket)

    return res.status(httpStatus.CREATED).send(createTicket);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
