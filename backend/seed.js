require("dotenv").config();
const mongoose = require("mongoose");
const Item = require("./models/Item");

const SEED_ITEMS = [
  {
    itemId: "petal_succulent",
    name: "Petal Succulent",
    emoji: "🪴",
    description: "A cozy pastel-pot succulent",
    price: 15,
    category: "plants",
  },
  {
    itemId: "cloud_fern",
    name: "Cloud Fern",
    emoji: "🌿",
    description: "Soft trailing fern",
    price: 20,
    category: "plants",
  },
  {
    itemId: "lavender_sprig",
    name: "Lavender Sprig",
    emoji: "🪻",
    description: "Fragrant purple bloom",
    price: 35,
    category: "plants",
  },
  {
    itemId: "periwinkle_bloom",
    name: "Periwinkle Bloom",
    emoji: "🌸",
    description: "Delicate blue-violet blossom",
    price: 30,
    category: "plants",
  },
  {
    itemId: "blush_rose",
    name: "Blush Rose",
    emoji: "🌹",
    description: "Soft pink garden rose",
    price: 40,
    category: "plants",
  },
  {
    itemId: "moonlit_orchid",
    name: "Moonlit Orchid",
    emoji: "🌷",
    description: "Rare lilac orchid",
    price: 45,
    category: "plants",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const item of SEED_ITEMS) {
      await Item.findOneAndUpdate({ itemId: item.itemId }, item, {
        upsert: true,
        new: true,
      });
      console.log(`Seeded: ${item.name}`);
    }

    console.log("Done seeding shop items");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
