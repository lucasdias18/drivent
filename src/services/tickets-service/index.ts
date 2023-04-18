import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/tickets-repository';

export async function getTicketsTypesService() {
  return ticketRepository.findTicketsTypes();
}

export async function getTicketsByUser(userId: number) {
  const ticketUser = await ticketRepository.findTicketsByUser(userId);

  if (!ticketUser) throw notFoundError();

  return ticketUser;
}

export async function postTicketsService(ticketTypeId: number, userId: number) {
  const createTicket = await ticketRepository.createTicketOrFail(ticketTypeId, userId);

  if (!createTicket) throw notFoundError();

  return createTicket;
}
