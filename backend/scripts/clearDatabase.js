const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://nyads2023:8NwxcApVxWBszMdR@cluster0.rptdubu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your DB name

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to DB");

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      try {
        await collection.deleteMany({});
        console.log(`Cleared ${collection.collectionName}`);
      } catch (err) {
        console.error(`Error clearing ${collection.collectionName}:`, err);
      }
    }

    await mongoose.disconnect();
    console.log("Disconnected and cleaned.");
    process.exit();
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });
