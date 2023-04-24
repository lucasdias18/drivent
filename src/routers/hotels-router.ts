import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getRoomsHotel } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getRoomsHotel);

export { hotelsRouter };
