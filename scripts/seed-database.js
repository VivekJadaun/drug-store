const fs = require("fs")
const path = require("path")
const { MongoClient } = require("mongodb")
require("dotenv").config({ path: ".env.local" })

/**
 * Script to seed MongoDB Atlas with drug data from JSON file
 * This script connects to MongoDB Atlas and populates the database
 */
async function seedMongoDBAtlas() {
  let client

  try {
    // Read environment variables
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is required");
    }

    // Validate Atlas connection string
    if (!mongoUri.includes("mongodb+srv://")) {
      console.warn(
        "⚠️  Warning: This doesn't appear to be a MongoDB Atlas connection string"
      );
      console.log(
        "Expected format: mongodb+srv://username:password@cluster.mongodb.net/"
      );
    }

    // Read the drug data JSON file
    const drugDataPath = path.join(process.cwd(), "drugData.json");
    const drugData = JSON.parse(fs.readFileSync(drugDataPath, "utf8"));

    // Connect to MongoDB Atlas
    console.log("🔌 Connecting to MongoDB Atlas...");
    client = new MongoClient(mongoUri, {
      serverApi: {
        version: "1",
        strict: false,
        deprecationErrors: true,
      },
    });

    await client.connect();

    // Verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB Atlas successfully!");

    const db = client.db("druginfo");
    const collection = db.collection("drugs");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    const deleteResult = await collection.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} existing documents`);

    // Transform and prepare data for MongoDB
    const transformedData = drugData.map((drug, index) => ({
      id: index + 1,
      code: drug.code,
      genericName: drug.genericName,
      brandName: drug.brandName,
      company: drug.company,
      launchDate: drug.launchDate,
      createdAt: new Date(),
    }));

    // Insert data in batches for better performance with Atlas
    console.log("📥 Inserting drug data into Atlas...");
    const batchSize = 100;
    for (let i = 0; i < transformedData.length; i += batchSize) {
      const batch = transformedData.slice(i, i + batchSize);
      await collection.insertMany(batch);
      console.log(
        `   Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          transformedData.length / batchSize
        )}`
      );
    }

    // Create indexes for better performance on Atlas
    console.log("🔍 Creating database indexes on Atlas...");
    await collection.createIndex({ company: 1 }, { name: "company_index" });
    await collection.createIndex(
      { launchDate: -1 },
      { name: "launch_date_index" }
    );
    await collection.createIndex(
      { code: 1 },
      { unique: true, name: "code_unique_index" }
    );

    console.log(
      `✅ Successfully seeded MongoDB Atlas with ${transformedData.length} drug records`
    );

    // Atlas-specific statistics
    console.log("📊 MongoDB Atlas Database Statistics:");
    const stats = await db.stats();
    // Get indexes using aggregation instead of listIndexes for better compatibility
    const indexStats = await collection
      .aggregate([{ $indexStats: {} }])
      .toArray();

    console.log(`   - Database: ${db.databaseName}`);
    console.log(`   - Collections: ${stats.collections}`);
    console.log(
      `   - Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(
      `   - Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(`   - Indexes: ${indexStats.length}`);

    // Verify data
    const count = await collection.countDocuments();
    const sampleDrug = await collection.findOne();
    console.log(`   - Total documents: ${count}`);
    console.log(
      `   - Sample document: ${sampleDrug?.genericName} (${sampleDrug?.brandName})`
    );

    console.log("\n🎉 MongoDB Atlas setup complete!");
    console.log(
      "🌐 Your data is now stored in the cloud and ready for production!"
    );
  } catch (error) {
    console.error("❌ Error seeding MongoDB Atlas:", error)
    if (error.message.includes("authentication")) {
      console.log("\n💡 Authentication Error Solutions:")
      console.log("1. Check your username and password in the connection string")
      console.log("2. Ensure your IP address is whitelisted in Atlas Network Access")
      console.log("3. Verify your database user has read/write permissions")
    }
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log("🔌 MongoDB Atlas connection closed")
    }
  }
}

// Run the script if called directly
if (require.main === module) {
  seedMongoDBAtlas()
}

module.exports = { seedMongoDBAtlas }
