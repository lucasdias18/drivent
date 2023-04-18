import { Router } from 'express';
import { getTickets, getTicketsTypes, postTickets } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';
// import { getEnrollmentByUser, postCreateOrUpdateEnrollment, getAddressFromCEP } from '@/controllers';
// import { createEnrollmentSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.get('/', getTickets).all('/*', authenticateToken).get('/types', getTicketsTypes).post('/', postTickets);

export { ticketsRouter };
