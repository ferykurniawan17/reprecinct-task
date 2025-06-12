const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("Testing database connection...");

    // Test basic connection
    await prisma.$connect();
    console.log("✅ Successfully connected to the database");

    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Database query test successful:", result);

    // Test table access (if Attribute table exists)
    try {
      const count = await prisma.attribute.count();
      console.log(`✅ Attribute table accessible. Current count: ${count}`);
    } catch (error) {
      console.log("⚠️  Attribute table not found or not migrated yet");
    }
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error:", error.message);

    if (error.message.includes("ENOTFOUND")) {
      console.error("💡 Check your DATABASE_URL hostname");
    } else if (error.message.includes("authentication")) {
      console.error("💡 Check your DATABASE_URL username/password");
    } else if (error.message.includes("timeout")) {
      console.error("💡 Check your network connection and security groups");
    }
  } finally {
    await prisma.$disconnect();
    console.log("Database connection closed");
  }
}

testConnection();
