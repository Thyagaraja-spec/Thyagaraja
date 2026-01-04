import express from "express";
import itemModel from "./item.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authorize from "./newAuth.mjs";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, role, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new itemModel({
      username,
      role,
      password: hashPassword
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful..." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await itemModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, //payload for token user id and role
      "shakthivelk",
      { expiresIn: "20m" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//authorize(["user"]),
//  POST new item
router.post("/",authorize(["admin"]),async (req, res) => {
  const { name, category, price } = req.body; // Destructure fields from request body as per Schema
  try {
    const item = new itemModel({ name, category, price }); //change fields as per Schema
    await item.save();

    res.status(201).json({ message: "New record added", data: item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
//  UPDATE item
router.put("/:id",authorize(["admin"]), async (req, res) => {
  try {
    const item = await itemModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Updated successfully", data: item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
//  DELETE item
router.delete("/:id",authorize(["admin"]),async (req, res) => {
  try {
    const item = await itemModel.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Deleted successfully", data: item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
