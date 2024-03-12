import { render, screen } from "@testing-library/react";
import { UserReservations } from "@/components/user/UserReservations";

test("user reservations shows correct pruchase button text", async () => {
  render(<UserReservations userId={1} />);
  const purchaseButton = await screen.findByRole("button", {
    name: /purchase more tickets/i,
  });
  expect(purchaseButton).toBeInTheDocument();
});

test("user reservations page has 'purchase tickets' button and 'Your tickets' heading is not displaying if user has no reservations", async () => {
  render(<UserReservations userId={0} />);
  const purchaseButton = await screen.findByRole("button", {
    name: /purchase tickets/i,
  });
  expect(purchaseButton).toBeInTheDocument();

  const heading = screen.queryByRole("heading", { name: "Your tickets" });
  expect(heading).not.toBeInTheDocument();
});
