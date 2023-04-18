import { TicketType, Ticket, Enrollment } from '@prisma/client';
import { prisma } from '@/config';

async function findTicketsTypes() {
  return prisma.ticketType.findMany();
}

async function findTicketsByUser(userId: number) {
  const findEnrollment = await prisma.enrollment.findFirst({
    where: { userId },
  });
  const enrollmentUser: number = findEnrollment.id;

  const ticketUser = await prisma.ticket.findFirst({
    where: { enrollmentId: enrollmentUser },
  });

  if (!ticketUser) return;

  const ticketType = await prisma.ticketType.findFirst({
    where: { id: ticketUser.ticketTypeId },
  });

  return { ...ticketUser, ...ticketType };
}

const ticketRepository = {
  findTicketsTypes,
  findTicketsByUser,
};

export default ticketRepository;
