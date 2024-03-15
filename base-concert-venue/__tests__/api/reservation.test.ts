import { testApiHandler } from "next-test-api-route-handler";

import { validateToken } from "@/lib/auth/utils";
import reservationsHandler from "@/pages/api/reservations/[reservationId]";
import usersReservationsHandler from "@/pages/api/users/[userId]/reservations";

jest.mock("@/lib/auth/utils");
const mockedValidateToken = validateToken as jest.Mock;

test("POST /api/reservations creates a new reservation assosiated with the user", async () => {
  await testApiHandler({
    handler: reservationsHandler,
    paramsPatcher: (params) => {
      // eslint-disable-next-line no-param-reassign
      params.reservationId = 1234;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ seatCount: 2, userId: 1, showId: 0 }),
      });
      expect(res.status).toBe(201);
    },
  });

  await testApiHandler({
    handler: usersReservationsHandler,
    paramsPatcher: (params) => {
      // eslint-disable-next-line no-param-reassign
      params.userId = 1;
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: "GET" });
      expect(res.status).toBe(200);

      const json = await res.json();

      expect(json.userReservations).toHaveLength(3);
    },
  });
});

test("POST /api/reservations/[reservationID] returns 401 status when not authorized", async () => {
  mockedValidateToken.mockResolvedValue(false);

  await testApiHandler({
    handler: reservationsHandler,
    paramsPatcher: (params) => {
      // eslint-disable-next-line no-param-reassign
      params.reservationId = 1234;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ seatCount: 2, userId: 1, showId: 0 }),
      });

      // expect unauthorized
      expect(res.status).toBe(401);
    },
  });
});
