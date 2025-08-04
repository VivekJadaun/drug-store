import { NextResponse } from "next/server"
import { seedDatabase, initializeDatabase } from "@/lib/database"
import drugData from "@/drugData.json"

/**
 * POST /api/seed
 * Seeds the database with drug data
 * This endpoint can be used to initialize or reset the database
 */
export async function POST() {
  try {
    // Only allow seeding in development or with proper authorization
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          success: false,
          error: "Seeding not allowed in production",
        },
        { status: 403 },
      )
    }

    // Initialize database and seed with data
    await initializeDatabase()
    await seedDatabase(drugData)

    return NextResponse.json({
      success: true,
      message: `Database seeded with ${drugData.length} drug records`,
      count: drugData.length,
    })
  } catch (error) {
    console.error("Seed API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed database",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
