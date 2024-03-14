import "@testing-library/cypress/add-commands";

Cypress.Commands.add("resetDbAndResetIsrCache", () => {
  cy.task("db:reset");
  const secret = Cypress.env("REVALIDATION_SECRET");

  cy.request("GET", `/api/revalidate?secret=${secret}`);
});

Cypress.Commands.add("signIn", (email, password) => {
  // note: for many auth systems, this would POST to an API rather than going through UI sign-up flow
  cy.visit("/auth/signin");
  // fill out the sign-in form
  cy.findByLabelText(/email address/i)
    .clear()
    .type(email);
  cy.findByLabelText(/password/i)
    .clear()
    .type(password);

  cy.findByRole("main").within(() => {
    cy.findByRole("button", { name: /sign in/i }).click();
  });

  // check for welcome message
  cy.findByRole("heading", { name: /welcome/i }).should("exist");
});
