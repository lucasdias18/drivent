import { Ticket, Enrollment, Payment } from '@prisma/client';
import { prisma } from '@/config';
import { unauthorizedError } from '@/errors';
import { Data } from '@/services/payments-service';

async function getPayment(userId: number, ticketId: number) {
  const ticket = await prisma.ticket.findFirst({
    where: { id: ticketId },
  });

  if (!ticket) return;

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: userId },
  });

  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  return await prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function createPayment(userId: number, cardData: Data) {
  const ticket = await prisma.ticket.findFirst({
    where: { id: cardData.ticketId },
  });

  if (!ticket) return;

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: userId },
  });

  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  const findPrice = await prisma.ticketType.findFirst({
    where: { id: ticket.ticketTypeId },
  });

  const payment = await prisma.payment.create({
    data: {
      ticketId: cardData.ticketId,
      value: findPrice.price,
      cardIssuer: cardData.cardData.issuer,
      cardLastDigits: cardData.cardData.number.toString().slice(-4),
    },
  });

  await prisma.ticket.update({
    where: { id: cardData.ticketId },
    data: { status: 'PAID' },
  });

  return payment;
}

const paymentsRepository = {
  getPayment,
  createPayment,
};

export default paymentsRepository;
