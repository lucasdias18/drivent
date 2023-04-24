import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel, createRoom } from '../factories/hotels-factory';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when hotel doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 when ticket isnt paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, 'RESERVED');

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      if (ticketType.isRemote === true) {
        expect(response.body).toEqual(httpStatus.PAYMENT_REQUIRED);
      }
    });

    it('should respond with status 402 when ticket doesnt include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      if (ticketType.includesHotel !== true) {
        expect(response.body).toEqual(httpStatus.PAYMENT_REQUIRED);
      }
    });

    it('should respond with status 200 and with hotels data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      await createRoom(hotel.id);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt,
        updatedAt: hotel.updatedAt,
      });
    });
  });
});

// describe('GET /tickets/types', () => {
//     it('should respond with status 401 if no token is given', async () => {
//       const response = await server.get('/tickets/types');

//       expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//     });

//     it('should respond with status 401 if given token is not valid', async () => {
//       const token = faker.lorem.word();

//       const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//     });

//     it('should respond with status 401 if there is no session for given token', async () => {
//       const userWithoutSession = await createUser();
//       const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

//       const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//     });

//     describe('when token is valid', () => {
//       it('should respond with empty array when there are no ticket types created', async () => {
//         const token = await generateValidToken();

//         const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

//         expect(response.body).toEqual([]);
//       });

//       it('should respond with status 200 and with existing TicketTypes data', async () => {
//         const token = await generateValidToken();

//         const ticketType = await createTicketType();

//         const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(httpStatus.OK);
//         expect(response.body).toEqual([
//           {
//             id: ticketType.id,
//             name: ticketType.name,
//             price: ticketType.price,
//             isRemote: ticketType.isRemote,
//             includesHotel: ticketType.includesHotel,
//             createdAt: ticketType.createdAt.toISOString(),
//             updatedAt: ticketType.updatedAt.toISOString(),
//           },
//         ]);
//       });
//     });
//   });

// describe('POST /tickets', () => {
//   it('should respond with status 401 if no token is given', async () => {
//     const response = await server.post('/tickets');

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   it('should respond with status 401 if given token is not valid', async () => {
//     const token = faker.lorem.word();

//     const response = await server.post('/tickets').set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   it('should respond with status 401 if there is no session for given token', async () => {
//     const userWithoutSession = await createUser();
//     const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

//     const response = await server.post('/tickets').set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   describe('when token is valid', () => {
//     it('should respond with status 400 when ticketTypeId is not present in body', async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       await createEnrollmentWithAddress(user);
//       await createTicketType();

//       const response = await server.post('/tickets').set('Authorization', `Bearer ${token}`).send({});

//       expect(response.status).toEqual(httpStatus.BAD_REQUEST);
//     });

//     it('should respond with status 404 when user doesnt have enrollment yet', async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const ticketType = await createTicketType();

//       const response = await server
//         .post('/tickets')
//         .set('Authorization', `Bearer ${token}`)
//         .send({ ticketTypeId: ticketType.id });

//       expect(response.status).toEqual(httpStatus.NOT_FOUND);
//     });

//     it('should respond with status 201 and with ticket data', async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const enrollment = await createEnrollmentWithAddress(user);
//       const ticketType = await createTicketType();

//       const response = await server
//         .post('/tickets')
//         .set('Authorization', `Bearer ${token}`)
//         .send({ ticketTypeId: ticketType.id });

//       expect(response.status).toEqual(httpStatus.CREATED);
//       expect(response.body).toEqual({
//         id: expect.any(Number),
//         status: TicketStatus.RESERVED,
//         ticketTypeId: ticketType.id,
//         enrollmentId: enrollment.id,
//         TicketType: {
//           id: ticketType.id,
//           name: ticketType.name,
//           price: ticketType.price,
//           isRemote: ticketType.isRemote,
//           includesHotel: ticketType.includesHotel,
//           createdAt: ticketType.createdAt.toISOString(),
//           updatedAt: ticketType.updatedAt.toISOString(),
//         },
//         createdAt: expect.any(String),
//         updatedAt: expect.any(String),
//       });
//     });

//     it('should insert a new ticket in the database', async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       await createEnrollmentWithAddress(user);
//       const ticketType = await createTicketType();

//       const beforeCount = await prisma.ticket.count();

//       await server.post('/tickets').set('Authorization', `Bearer ${token}`).send({ ticketTypeId: ticketType.id });

//       const afterCount = await prisma.ticket.count();

//       expect(beforeCount).toEqual(0);
//       expect(afterCount).toEqual(1);
//     });
//   });
// });
