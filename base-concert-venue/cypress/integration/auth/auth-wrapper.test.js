it("runs the auth flow for successful login to protected reservations page", () => {
  // visit reservations page for first show (id 0)
  cy.task("db:reset").visit("/reservations/0");

  // check for sign in form
  cy.findByRole("heading", { name: /sign in to your account/i }).should(
    "exist"
  );

  // check that there is no otopn to purchase tickets
  cy.findByRole("button", { name: /purchase/i }).should("not.exist");

  // enter valid sign-in credentials
  cy.findByLabelText(/email address/i)
    .clear()
    .type(Cypress.env("TEST_USER_EMAIL"));

  cy.findByLabelText(/password/i)
    .clear()
    .type(Cypress.env("TEST_PASSWORD"));

  // sumbit the form
  cy.findByRole("main").within(() => {
    cy.findByRole("button", { name: /sign in/i }).click();
  });

  // check for purchase button and band name
  cy.findByRole("button", { name: /purchase/i }).should("exist");
  cy.findByRole("heading", { name: /the wandering bunnies/i }).should("exist");

  // check for the email and sign-out button in the navbar
  cy.findByRole("button", { name: Cypress.env("TEST_USER_EMAIL") }).should(
    "exist"
  );
  cy.findByRole("button", { name: /sign out/i }).should("exist");

  // check that sign-in button does NOT exist
  cy.findByRole("button", { name: /sign in/i }).should("not.exist");
});

it("runs the auth flow for a non-successful and successful login to users page", () => {
  // visit the user page
  cy.task("db:reset").visit("/user");

  // check for sign in form
  cy.findByRole("heading", { name: /sign in to your account/i }).should(
    "exist"
  );

  // check that there is NO welcome message
  cy.findByRole("heading", {
    name: /welcome/i,
  }).should("not.exist");

  // sign in with invalid credentials
  cy.findByLabelText(/email address/i)
    .clear()
    .type("test@test.testhjhds");

  cy.findByLabelText(/password/i)
    .clear()
    .type("jjlkjdstest");

  cy.findByRole("main").within(() => {
    cy.findByRole("button", { name: /sign in/i }).click();
  });

  // check for the sign in form again and there is the correct error message
  cy.findByRole("heading", { name: /sign in to your account/i }).should(
    "exist"
  );
  cy.findByText(/sign in failed/i).should("exist");

  // check that no protected info shows
  cy.findByText(Cypress.env("TEST_USER_EMAIL")).should("not.exist");

  // sign in with valid credentials
  cy.findByLabelText(/email address/i)
    .clear()
    .type(Cypress.env("TEST_USER_EMAIL"));
  cy.findByLabelText(/password/i)
    .clear()
    .type(Cypress.env("TEST_PASSWORD"));
  cy.findByRole("main").within(() => {
    cy.findByRole("button", { name: /sign in/i }).click();
  });

  // check for the orininaly requested page
  cy.findByRole("heading", {
    name: /welcome/i,
  }).should("exist");

  cy.findByRole("heading", {
    name: /your tickets/i,
  }).should("exist");

  // check for email and sign-out button in navbar
  cy.findByRole("button", { name: Cypress.env("TEST_USER_EMAIL") }).should(
    "exist"
  );
  cy.findByRole("button", { name: /sign out/i }).should("exist");
  cy.findByRole("button", { name: /sign in/i }).should("not.exist");
});

it("redirects to sign-in for protected pages", () => {
  cy.fixture("protected-pages.json").then((urls) => {
    urls.forEach(($url) => {
      cy.visit($url);

      cy.findByLabelText(/email address/i).should("exist");
      cy.findByLabelText(/password/i).should("exist");
    });
  });
});

it("does NOT show the sign-in page if already signed-in", () => {
  cy.task("db:reset").signIn(
    Cypress.env("TEST_USER_EMAIL"),
    Cypress.env("TEST_PASSWORD")
  );

  // access the tickets page for the first show
  cy.visit("/reservations/0");

  // make sure there is no sign-in page
  cy.findByRole("heading", { name: /sign in to your account/i }).should(
    "not.exist"
  );

  // make sure the purchase button shows
  cy.findByRole("button", { name: /purchase/i }).should("exist");
});
