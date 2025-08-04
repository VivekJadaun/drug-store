import { MongoClient, type Db, type Collection, ServerApiVersion } from "mongodb"

// MongoDB Atlas connection configuration
let client: MongoClient
let db: Db

/**
 * Interface representing a drug document in MongoDB
 */
export interface Drug {
  _id?: string
  id: number
  code: string
  genericName: string
  brandName: string
  company: string
  launchDate: string
  createdAt?: Date
}

/**
 * Interface for drug data as displayed in the UI
 */
export interface DrugDisplay {
  id: number
  code: string
  name: string // Combined generic and brand name
  company: string
  launchDate: string // Formatted date
}

/**
 * Connect to MongoDB Atlas database
 */
async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db
  }

  try {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not defined. Please set up MongoDB Atlas connection string.")
    }

    // Validate that it's an Atlas connection string
    if (!uri.includes("mongodb+srv://")) {
      console.warn("⚠️  Warning: Connection string doesn't appear to be MongoDB Atlas. For production, use Atlas.")
    }

    // MongoDB Atlas client configuration
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
      },
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // bufferMaxEntries: 0, // Disable mongoose buffering
      // bufferCommands: false, // Disable mongoose buffering
    })

    await client.connect()

    // Verify connection
    await client.db("admin").command({ ping: 1 })

    db = client.db("druginfo")
    console.log("✅ Successfully connected to MongoDB Atlas!")

    return db
  } catch (error) {
    console.error("❌ MongoDB Atlas connection error:", error)
    throw new Error("Failed to connect to MongoDB Atlas")
  }
}

/**
 * Get the drugs collection
 */
async function getDrugsCollection(): Promise<Collection<Drug>> {
  const database = await connectToDatabase()
  return database.collection<Drug>("drugs")
}

/**
 * Fetch all drugs from MongoDB with optional company filtering
 * Results are ordered by launch date (descending)
 */
export async function getDrugs(companyFilter?: string): Promise<Drug[]> {
  try {
    const collection = await getDrugsCollection()

    // Build query filter
    const filter: any = {}
    if (companyFilter && companyFilter !== "all") {
      filter.company = companyFilter
    }

    // Fetch drugs with sorting by launch date (newest first)
    const drugs = await collection.find(filter).sort({ launchDate: -1 }).toArray()

    return drugs
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Failed to fetch drugs from database")
  }
}

/**
 * Get all unique company names for the filter dropdown
 */
export async function getCompanies(): Promise<string[]> {
  try {
    const collection = await getDrugsCollection()

    const pipeline = [
      {
        $group: {
          _id: "$company",
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    const companies = result
      .map((doc) => doc._id)
      .filter((company) => company != null);

    return companies;
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Failed to fetch companies from database")
  }
}

/**
 * Transform database drug document to display format
 */
export function transformDrugForDisplay(drug: Drug): DrugDisplay {
  return {
    id: drug.id,
    code: drug.code,
    name: `${drug.genericName} (${drug.brandName})`,
    company: drug.company,
    launchDate: formatDate(drug.launchDate),
  }
}

/**
 * Format ISO date string to DD.MM.YYYY format
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

/**
 * Initialize database with indexes for better performance
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const collection = await getDrugsCollection()

    // Create indexes for better query performance
    await collection.createIndex({ company: 1 })
    await collection.createIndex({ launchDate: -1 })
    await collection.createIndex({ code: 1 }, { unique: true })

    console.log("✅ Database indexes created")
  } catch (error) {
    console.error("❌ Error creating indexes:", error)
    throw error
  }
}

/**
 * Seed database with drug data
 */
export async function seedDatabase(drugData: any[]): Promise<void> {
  try {
    const collection = await getDrugsCollection()

    // Clear existing data
    await collection.deleteMany({})

    // Transform and insert data
    const transformedData = drugData.map((drug, index) => ({
      id: index + 1,
      code: drug.code,
      genericName: drug.genericName,
      brandName: drug.brandName,
      company: drug.company,
      launchDate: drug.launchDate,
      createdAt: new Date(),
    }))

    await collection.insertMany(transformedData)

    console.log(`✅ Seeded database with ${transformedData.length} drug records`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  }
}

/**
 * Close database connection
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close()
    console.log("✅ MongoDB connection closed")
  }
}
