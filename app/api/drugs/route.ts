import { type NextRequest, NextResponse } from "next/server"
import { getDrugs, transformDrugForDisplay } from "@/lib/database"

/**
 * GET /api/drugs
 * Returns drug data with optional company filtering
 * Query parameters:
 * - company: Filter by company name (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyFilter = searchParams.get("company")

    // Fetch drugs from MongoDB
    const drugs = await getDrugs(companyFilter || undefined)

    // Transform data for frontend consumption
    const transformedDrugs = drugs.map(transformDrugForDisplay)

    return NextResponse.json({
      success: true,
      data: transformedDrugs,
      count: transformedDrugs.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch drug data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
