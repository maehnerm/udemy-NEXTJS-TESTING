it("displays Shows page after clicking 'purchase more tickets' button", () => {
  // sign-in
  cy.task("db:reset").signIn(
    Cypress.env("TEST_USER_EMAIL"),
    Cypress.env("TEST_PASSWORD")
  );

  // visit the user page
  cy.findByRole("button", { name: /purchase more tickets/i })
    .should("exist")
    .click();

  // confirm we end up on the shows page
  cy.findByRole("heading", { name: /upcoming shows/i }).should("exist");
});
