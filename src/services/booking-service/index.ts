import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getBookingService(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function postBookingService(userId: number, roomId: number) {
  const room = await hotelRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.createBookingOrFail(userId, roomId);
  if (!booking) throw notFoundError();

  return booking;
}

async function updateBookingService(userId: number, roomId: number, bookingId: number) {
  const room = await hotelRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const update = await bookingRepository.updateBookingOrFail(userId, roomId, bookingId);
  if (!update) throw forbiddenError();

  return update;
}

const bookingService = {
  getBookingService,
  postBookingService,
  updateBookingService,
};

export default bookingService;
