const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://budget-tracker-1-c0wb.onrender.com",
    credentials: true,
  })
);

mongoose.connect(
  "mongodb+srv://shivam-9461:Abcd@cluster0.f1n8w0m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// JWT Secret
const JWT_SECRET =
  "abe6cc832f3052a6efad824ae907e23accd7c46d5406931fb0a8966a702279e3e67643ce11d034bdb1ecc858e1d0bee9353eb7c5e6607e86094c067bad7e3b00";

// User Schema
const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String,
});

// Expense Schema
const Expense = mongoose.model("Expense", {
  name: String,
  amount: Number,
  userId: String,
});

// Register Route
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.json({ token });
});

// Middleware to check auth
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Expenses APIs
// GET all expenses for logged-in user
app.get("/api/expenses", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).json({ message: "Server error while fetching expenses" });
  }
});

// POST a new expense
app.post("/api/expenses", authMiddleware, async (req, res) => {
  try {
    const { name, amount } = req.body;

    // Simple validation
    if (!name || !amount) {
      return res.status(400).json({ message: "Name and amount are required" });
    }

    const expense = new Expense({
      name,
      amount,
      userId: req.userId, // from authMiddleware
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error adding expense:", error.message);
    res.status(500).json({ message: "Server error while adding expense" });
  }
});

app.delete("/api/expenses/:id", authMiddleware, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
