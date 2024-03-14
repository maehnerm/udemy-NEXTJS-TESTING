it("skips client-site bundle, confirming the data comes from the ISR cache", () => {
  cy.request("/bands")
    .its("body")
    .then((html) => {
      // remove the application code bundle
      const staticHtml = html.replace(/<script.*?>.*?<\/script>/gm, "");
      cy.state("document").write(staticHtml);
    });

  cy.findByRole("heading", { name: /the wandering bunnies/i }).should("exist");
  cy.findByRole("heading", { name: /shamrock pete/i }).should("exist");
  cy.findByRole("heading", { name: /the joyous nun riot/i }).should("exist");
});
