import type React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import DrugTable from "@/components/DrugTable";
import theme from "@/lib/theme";
import type { jest } from "@jest/globals";

const mockFetch = global.fetch as jest.Mock<typeof fetch>;

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const mockDrugs = [
  {
    id: 1,
    code: "0006-0568",
    name: "vorinostat (ZOLINZA)",
    company: "Merck Sharp & Dohme Corp.",
    launchDate: "14.02.2004",
  },
  {
    id: 2,
    code: "68828-192",
    name: "Avobenzone, Octinoxate, Octisalate, Octocrylene (CC Cream)",
    company: "Jafra cosmetics International",
    launchDate: "02.02.2011",
  },
];

const mockCompanies = [
  "Merck Sharp & Dohme Corp.",
  "Jafra cosmetics International",
];

describe("DrugTable Component with MongoDB Atlas", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("filters drugs by company", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockCompanies }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockDrugs }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [mockDrugs[0]],
        }),
      } as Response);

    render(
      <TestWrapper>
        <DrugTable />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Showing 2 drugs")).toBeInTheDocument();
    });

    const companySelect = screen.getByLabelText("Filter by Company");
    fireEvent.mouseDown(companySelect);

    const companyOption = screen.getByRole("option", { name: "Merck Sharp & Dohme Corp." });
    fireEvent.click(companyOption);


    await waitFor(() => {
      expect(
        screen.getByText("Showing 1 drug from Merck Sharp & Dohme Corp.")
      ).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/drugs?company=Merck%20Sharp%20%26%20Dohme%20Corp."
    );
  });
});
