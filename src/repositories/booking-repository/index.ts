import { User, Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

function findBooking(userId: number) {
  const findBooking = prisma.booking.findFirst({
    where: { userId },
  });
  if (!findBooking) return;

  return findBooking;
}

async function createBookingOrFail(userId: number, roomId: number) {
  const findRoom = await prisma.room.findFirst({
    where: { id: roomId },
    include: { Booking: true },
  });
  const bookings = findRoom.Booking.length;
  const availableBookings = findRoom.capacity - bookings;

  if (availableBookings === 0) return;

  const createBooking = await prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });

  return createBooking;
}

async function updateBookingOrFail(userId: number, roomId: number, bookingId: number) {
  const findBooking = await prisma.booking.findFirst({
    where: { id: bookingId },
  });

  if (!findBooking || findBooking.userId !== userId) return;

  const findRoom = await prisma.room.findFirst({
    where: { id: roomId },
    include: { Booking: true },
  });
  const bookings = findRoom.Booking.length;
  const availableBookings = findRoom.capacity - bookings;

  if (availableBookings === 0) return;

  const updateBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { roomId },
  });

  return updateBooking;
}

const bookingRepository = {
  findBooking,
  createBookingOrFail,
  updateBookingOrFail,
};

export default bookingRepository;
