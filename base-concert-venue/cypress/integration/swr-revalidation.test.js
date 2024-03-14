import { generateNewReservation } from "../../__tests__/__mocks__/fakeData/newReservation";
import { generateRandomId } from "../../lib/features/reservations/utils";

const ONE_SECOND = 1000;
const THIRTY_SECONDS = 30 * ONE_SECOND;
const FIFTEEN_SECONDS = 15 * ONE_SECOND;

it("should refresh the shows page after 30 seconds", () => {
  cy.clock();
  cy.task("db:reset").visit("/shows");

  // there should be only one sold-out show
  cy.findAllByText(/sold out/i).should("have.length", 1);

  // buy all the tickets from the first show (id 0, 10 seats available)
  const newReservation = generateNewReservation({
    reservationId: generateRandomId(),
    showId: 0,
    seatCount: 10,
  });

  cy.task("addReservation", newReservation);

  // advance the time (less than 30 seconds interval) and check again
  cy.tick(ONE_SECOND);
  cy.findAllByText(/sold out/i).should("have.length", 1);

  // advance clock by 30 seconds; now additional show should display
  cy.tick(THIRTY_SECONDS);
  cy.findAllByText(/sold out/i).should("have.length", 2);
});

it("should refresh the reservation page after 15 seconds", () => {
  cy.clock();
  cy.task("db:reset").visit("/reservations/0");

  cy.findByRole("main").within(() =>
    cy.findByRole("button", { name: /sign in/i }).click()
  );

  // there should be ten seats available for reservation
  cy.findByText(/10 seats left/i).should("exist");

  // buy 2 tickets from the show (id 0, 10 seats available)
  const newReservation = generateNewReservation({
    reservationId: generateRandomId(),
    showId: 0,
    seatCount: 2,
  });

  cy.task("addReservation", newReservation);

  // advance the clock by 1 second; there should still be 10 seats available
  cy.tick(ONE_SECOND);
  cy.findByText(/10 seats left/i).should("exist");

  // advance the clock by 15 seconds; there should only be 8 seats available
  cy.tick(FIFTEEN_SECONDS);
  cy.findByText(/8 seats left/i).should("exist");
});
