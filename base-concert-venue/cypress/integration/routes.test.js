import { generateNewBand } from "../../__tests__/__mocks__/fakeData/newBand";
import { generateRandomId } from "../../lib/features/reservations/utils";

it("shows the correct heading when navigating to shows route", () => {
  cy.visit("/");
  cy.findByRole("button", { name: /shows/i }).click();
  cy.findByRole("heading", { name: /upcoming shows/i }).should("exist");
});

it("shows the correct heading when navigating to bands route", () => {
  cy.visit("/");
  cy.findByRole("button", { name: /bands/i }).click();
  cy.findByRole("heading", { name: /our illustrious performers/i }).should(
    "exist"
  );
});

it("displays the correct band name for a band route that exist at build time", () => {
  cy.task("db:reset").visit("/bands/1");
  cy.findByRole("heading", { name: /shamrock pete/i }).should("exist");
});

it("displays the correct error message for a band rout that does NOT exist at build time", () => {
  cy.task("db:reset").visit("/bands/1234");
  cy.findByText(/error: band not found/i).should("exist");
});

it("displays name for band that was NOT present at build time", () => {
  const bandId = generateRandomId();
  const newBand = generateNewBand(bandId);
  cy.task("db:reset").task("addBand", newBand).visit(`/bands/${bandId}`);
  cy.findByRole("heading", { name: /Avalanche of Cheese/i }).should("exist");
});
