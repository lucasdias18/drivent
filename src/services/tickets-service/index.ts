import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/tickets-repository';

// export async function postTicketsService(ticketTypeId: number) {
//     const findTicketType = await ticketRepository.findTicketTypeById(ticketTypeId)

//     const
// }

export async function getTicketsTypesService() {
  return ticketRepository.findTicketsTypes();
}

export async function getTicketsByUser(userId: number) {
  const ticketUser = await ticketRepository.findTicketsByUser(userId);

  if (!ticketUser) throw notFoundError();

  return ticketUser;
}
