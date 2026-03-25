import { render } from "@testing-library/react";

// importing the month details component to test
import MonthDetails from "../pages/day-month-details-page/MonthDetails";

// first argument is the name of the test, second argument is a function that contains the test
test("", () => {
  render(<MonthDetails />);

  const monthDetailsElement = screen.getByText("heading");
  expect(monthDetailsElement).toBeInTheDocument();
});
