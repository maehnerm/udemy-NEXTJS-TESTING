import { render, screen } from "@testing-library/react";

import { Reservation } from "@/components/reservations/Reservation";

test("reservation page shows the correct number of seats", async () => {
  render(<Reservation showId={0} submitPurchase={jest.fn()} />);

  const seatCountText = await screen.findByText(/10 seats left/i);
  expect(seatCountText).toBeInTheDocument();
});
