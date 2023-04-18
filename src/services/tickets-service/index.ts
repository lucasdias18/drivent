import { notFoundError, unauthorizedError } from '@/errors';
import ticketRepository from '@/repositories/tickets-repository';

export async function getTicketsTypesService() {
  return ticketRepository.findTicketsTypes();
}

export async function getTicketsByUser(userId: number) {
  if (!userId) throw unauthorizedError();
  console.log(userId);

  const ticketUser = await ticketRepository.findTicketsByUser(userId);

  if (!ticketUser) throw notFoundError();

  return ticketUser;
}

export async function postTicketsService(ticketTypeId: number, userId: number) {
  const createTicket = await ticketRepository.createTicketOrFail(ticketTypeId, userId);

  if (!createTicket) throw notFoundError();

  return {
    id: createTicket.id,
    status: createTicket.status,
    ticketTypeId: createTicket.ticketTypeId,
    enrollmentId: createTicket.enrollmentId,
    TicketType: createTicket.ticketType,
    createdAt: createTicket.createdAt,
    updatedAt: createTicket.updatedAt,
  };
}
