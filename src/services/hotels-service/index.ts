import { badRequestError, notFoundError, unauthorizedError } from '@/errors';
import { paymentRequired } from '@/errors/payment-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { findRoomsByHotelId, getHotelsRepository } from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

export async function getHotelsService(userId: number) {
  if (!userId) throw unauthorizedError();

  const findUser = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!findUser) throw notFoundError();

  const findTicket = await ticketsRepository.findTicketByEnrollmentId(findUser.id);

  if (!findTicket) throw notFoundError();

  if (
    findTicket.status !== 'PAID' ||
    findTicket.TicketType.includesHotel !== true ||
    findTicket.TicketType.isRemote === true
  ) {
    throw paymentRequired();
  }

  const hotels = await getHotelsRepository();

  if (!hotels) throw notFoundError();

  return hotels;
}

export async function getRoomsHotelService(userId: number, hotelId: number) {
  // if (!userId) throw badRequestError()

  const findUser = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!findUser) throw notFoundError();

  const findTicket = await ticketsRepository.findTicketByEnrollmentId(findUser.id);

  if (!findTicket) throw notFoundError();

  if (
    findTicket.status !== 'PAID' ||
    findTicket.TicketType.includesHotel !== true ||
    findTicket.TicketType.isRemote === true
  ) {
    throw paymentRequired();
  }

  const rooms = await findRoomsByHotelId(hotelId);

  return rooms;
}
