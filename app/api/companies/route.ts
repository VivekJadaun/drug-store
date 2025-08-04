import { NextResponse } from "next/server"
import { getCompanies } from "@/lib/database"

/**
 * GET /api/companies
 * Returns list of all unique company names for filter dropdown
 */
export async function GET() {
  try {
    const companies = await getCompanies()

    return NextResponse.json({
      success: true,
      data: companies,
      count: companies.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch companies",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
