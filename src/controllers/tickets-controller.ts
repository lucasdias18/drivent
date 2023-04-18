// import { postTicketsService } from "@/services/tickets-service";
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { getTicketsByUser, getTicketsTypesService } from '@/services/tickets-service';

export async function getTicketsTypes(req: Request, res: Response) {
  try {
    const ticketsTypes = await getTicketsTypesService();

    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };

  try {
    const tickets = await getTicketsByUser(userId);

    return tickets;
  } catch (error) {
    res.sendStatus(httpStatus.NO_CONTENT);
  }
}

// export async function postTickets(req: Request, res: Response) {
//     const { ticketTypeId } = req.body as { ticketTypeId: number }

//     try {
//         await postTicketsService(ticketTypeId)
//     }
//     catch (error) {
//         res.sendStatus(httpStatus.NO_CONTENT)
//     }
// }
