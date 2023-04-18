import { Router } from 'express';
import { getTickets, getTicketsTypes, postTickets } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/', getTickets).get('/types', getTicketsTypes).post('/', postTickets);

export { ticketsRouter };
