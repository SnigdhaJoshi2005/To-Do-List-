require("dotenv").config();
const mongoose = require("mongoose");
const Item = require("./models/Item");

const SEED_ITEMS = [
  {
    itemId: "pilea",
    name: "Pilea",
    emoji: "🌼",
    image: "pilea",
    description: "Round coin-leaf plant",
    price: 40,
    levelRequired: 1,
    category: "plants",
  },
  {
    itemId: "snake_plant",
    name: "Snake Plant",
    emoji: "🌿",
    image: "snakeplant",
    description: "Tall upright striped leaves",
    price: 50,
    levelRequired: 1,
    category: "plants",
  },
  {
    itemId: "zebra_haworthia",
    name: "Zebra Haworthia",
    emoji: "🪴",
    image: "zebrahaworthia",
    description: "White-striped rosette succulent",
    price: 40,
    levelRequired: 1,
    category: "plants",
  },
  {
    itemId: "rosemary",
    name: "Rosemary",
    emoji: "🌿",
    image: "rosemary",
    description: "Fragrant herb sprigs",
    price: 30,
    levelRequired: 1,
    category: "plants",
  },
  {
    itemId: "begonia",
    name: "Begonia",
    emoji: "🌸",
    image: "begonia",
    description: "Colorful foliage with flowers",
    price: 60,
    levelRequired: 2,
    category: "plants",
  },
  {
    itemId: "pear_cactus",
    name: "Pear Cactus",
    emoji: "🌵",
    image: "pearcactus",
    description: "Round padded cactus",
    price: 60,
    levelRequired: 2,
    category: "plants",
  },
  {
    itemId: "caladium",
    name: "Caladium",
    emoji: "🍃",
    image: "caladium",
    description: "Arrow-shaped heart leaves",
    price: 70,
    levelRequired: 2,
    category: "plants",
  },
  {
    itemId: "coleus",
    name: "Coleus",
    emoji: "🌿",
    image: "coleus",
    description: "Vivid patterned leaves",
    price: 70,
    levelRequired: 2,
    category: "plants",
  },
  {
    itemId: "peace_lily",
    name: "Peace Lily",
    emoji: "🌷",
    image: "peacelily",
    description: "Elegant white blooms",
    price: 90,
    levelRequired: 3,
    category: "plants",
  },
  {
    itemId: "dieffenbachia",
    name: "Dieffenbachia",
    emoji: "🪴",
    image: "dieffenbachia",
    description: "Large variegated leaves",
    price: 100,
    levelRequired: 3,
    category: "plants",
  },
  {
    itemId: "christmas_cactus",
    name: "Christmas Cactus",
    emoji: "🌺",
    image: "christmascactus",
    description: "Winter-blooming cascade",
    price: 130,
    levelRequired: 4,
    category: "plants",
  },
  {
    itemId: "string_of_dolphins",
    name: "String of Dolphins",
    emoji: "🐬",
    image: "stringsofdolphins",
    description: "Leaping dolphin-shaped vines",
    price: 150,
    levelRequired: 4,
    category: "plants",
  },
  {
    itemId: "monstera",
    name: "Monstera",
    emoji: "🪴",
    image: "monstera",
    description: "Iconic split-leaf plant",
    price: 200,
    levelRequired: 5,
    category: "plants",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const validIds = SEED_ITEMS.map((i) => i.itemId);

    for (const item of SEED_ITEMS) {
      await Item.findOneAndUpdate({ itemId: item.itemId }, item, {
        upsert: true,
        new: true,
      });
      console.log(`Seeded: ${item.name}`);
    }

    const removed = await Item.deleteMany({ itemId: { $nin: validIds } });
    console.log(`Removed old items: ${removed.deletedCount}`);

    console.log("Done seeding shop items");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
