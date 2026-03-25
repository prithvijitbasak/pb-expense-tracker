import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

// ✅ Mock DayMonthDetails
vi.mock("./DayMonthDetails", () => ({
  default: () => <div data-testid="mock-day-month">Mocked</div>,
}));

// ✅ Mock router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: () => [
      {
        get: () => "2025-03-20",
      },
    ],
  };
});

import DayDetails from "../pages/day-month-details-page/DayDetails";

test("renders DayDetails", () => {
  const queryClient = new QueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <DayDetails />
    </QueryClientProvider>
  );

  expect(screen.findByAllText("expenses-card-container")).toBeInTheDocument();
});
