import { Enrollment, Ticket, Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

export async function getHotelsRepository() {
  const hotels = await prisma.hotel.findMany();
  return hotels;
}

export async function findRoomsByHotelId(hotelId: number) {
  const rooms = await prisma.hotel.findFirst({
    where: { id: hotelId },
  });
  return rooms;
}
