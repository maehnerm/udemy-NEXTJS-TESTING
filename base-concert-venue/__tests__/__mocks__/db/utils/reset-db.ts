import { readFakeData } from "@/__tests__/__mocks__/fakeData";

import { filenames, writeJSONToFile } from "@/lib/db/db-utils";

export const resetDB = async () => {
  // failsafe against resetting the production db!
  const safeToReset =
    process.env.NODE_ENV === "test" || process.env.CYPRESS_baseUrl;

  if (!safeToReset) {
    console.log(
      "WARNING: database reset unavailable outside test environments!"
    );
    return;
  }

  const { fakeBands, fakeReservations, fakeShows, fakeUsers } =
    await readFakeData();
  // overwrite data in files
  await Promise.all([
    writeJSONToFile(filenames.bands, fakeBands),
    writeJSONToFile(filenames.reservations, fakeReservations),
    writeJSONToFile(filenames.shows, fakeShows),
    writeJSONToFile(filenames.users, fakeUsers),
  ]);
};
