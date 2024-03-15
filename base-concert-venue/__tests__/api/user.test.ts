import { testApiHandler } from "next-test-api-route-handler";

import { validateToken } from "@/lib/auth/utils";
import usersReservationsHandler from "@/pages/api/users/[userId]/reservations";
import userAuthHandler from "@/pages/api/users/index";

jest.mock("@/lib/auth/utils");
const mockedValidateToken = validateToken as jest.Mock;

test("POST /api/users receives token with correct credentials", async () => {
  await testApiHandler({
    handler: userAuthHandler,
    test: async ({ fetch }) => {
      const res = await fetch({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "test@test.test",
          password: "test",
        }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json).toHaveProperty("user");
      expect(json.user.id).toEqual(1);
      expect(json.user.email).toEqual("test@test.test");
      expect(json.user).toHaveProperty("token");
    },
  });
});

test("GET /api/user/[userId]/reservations returns correct number of reservations", async () => {
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
      expect(json.userReservations).toHaveLength(2);
    },
  });
});

test("GET /api/user/[userID]/reservation returns empty array for user without any reservations", async () => {
  await testApiHandler({
    handler: usersReservationsHandler,
    paramsPatcher: (params) => {
      // eslint-disable-next-line no-param-reassign
      params.userId = 1234;
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: "GET" });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.userReservations).toHaveLength(0);
    },
  });
});

test("GET /api/user/[userID]/reservation returns 401 status when unauthorized", async () => {
  mockedValidateToken.mockResolvedValue(false);
  await testApiHandler({
    handler: usersReservationsHandler,
    paramsPatcher: (params) => {
      // eslint-disable-next-line no-param-reassign
      params.userId = 1;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: "GET",
      });
      expect(res.status).toBe(401);
    },
  });
});
