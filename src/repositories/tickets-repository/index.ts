import { TicketType, Ticket, Enrollment } from '@prisma/client';
import { prisma } from '@/config';

async function findTicketsByUser(userId: number) {
  const findEnrollment = await prisma.enrollment.findFirst({
    where: { userId },
  });

  if (!findEnrollment) return;

  const enrollmentUser: number = findEnrollment.id;

  const ticketUser = await prisma.ticket.findFirst({
    where: { enrollmentId: enrollmentUser },
  });

  if (!ticketUser) return;

  const ticketType = await prisma.ticketType.findFirst({
    where: { id: ticketUser.ticketTypeId },
  });

  return { ...ticketUser, ticketType: ticketType };
}

async function findTicketsTypes() {
  return prisma.ticketType.findMany();
}

async function createTicketOrFail(ticketTypeId: number, userId: number) {
  const findEnrollment = await prisma.enrollment.findFirst({
    where: { userId },
  });
  // console.log(findEnrollment)

  if (!findEnrollment) return;

  const ticketType = await prisma.ticketType.findFirst({
    where: { id: ticketTypeId },
  });

  if (!ticketType) return;

  const enrollmentUser: number = findEnrollment.id;

  const createTicket = await prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId: ticketTypeId,
      enrollmentId: enrollmentUser,
    },
  });
  // console.log(createTicket);

  return { ...createTicket, ticketType: ticketType };
}

const ticketRepository = {
  findTicketsByUser,
  findTicketsTypes,
  createTicketOrFail,
};

export default ticketRepository;
