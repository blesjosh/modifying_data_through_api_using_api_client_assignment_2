const express = require('express');
const { resolve } = require('path');
const dotenv = require('dotenv');
const MenuItem = require('./model/MenuItem');
const connectedDatabase = require('./database');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('static'));

connectedDatabase();

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).send("Please provide all the fields");
    }

    const newMenu = new MenuItem({ name, description, price });
    await newMenu.save();

    res.status(201).send("Item Added Successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).send("Please provide all the fields");
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).send("Menu item not found");
    }

    res.status(200).send("Item Updated Successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return res.status(404).send("Menu item not found");
    }

    res.status(200).send("Item Deleted Successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});