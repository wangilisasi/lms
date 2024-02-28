const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Mathematics" },
        { name: "Geography" },
        { name: "Physics" },
        { name: "Englis" },
        { name: "Swahili" },
      ],
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database category", error);
  } finally {
    await database.$disconnect();
  }
}

main();
