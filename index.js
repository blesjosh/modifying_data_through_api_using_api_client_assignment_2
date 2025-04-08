const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const MenuItem = require("./schema.js");

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { dbName: "restaurantDB" })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.post("/menu", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const newMenuItem = await MenuItem.create({ name, description, price });
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ error: "Error creating menu item" });
  }
});

app.get("/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Error fetching menu items" });
  }
});

app.put("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true, runValidators: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ error: "Error updating menu item" });
  }
});

app.delete("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting menu item" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
