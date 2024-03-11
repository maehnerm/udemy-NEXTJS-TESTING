import { render, screen } from "@testing-library/react";

import BandComponent from "@/pages/bands/[bandId]";
import { readFakeData } from "../__mocks__/fakeData";

test("band page displays the correct band information", async () => {
  const { fakeBands } = await readFakeData();
  render(<BandComponent band={fakeBands[0]} error={null} />);

  const heading = screen.getByRole("heading", {
    name: /the wandering bunnies/i,
  });
  expect(heading).toBeInTheDocument();
});

test("Band page displays correct error message if band could not be displayed", () => {
  render(<BandComponent band={null} error="Everything is fine" />);

  const error = screen.getByRole("heading", {
    name: /everything is fine/i,
  });

  expect(error).toBeInTheDocument();
});
