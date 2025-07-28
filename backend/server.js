const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://shivam-9461:Abcd@cluster0.f1n8w0m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// User Schema
const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String,
});

const JWT_SECRET =
  "96f56cef7d9ecd3ec1bec699294c8edd3f1d863e9ec0748b8866397615ff3e4c3f497ac28d00e4abf892d1b4a7d046ccbf49c017946472066916e8a87e5e427e";

// Expense Schema
const Expense = mongoose.model("Expense", {
  name: String,
  amount: Number,
  userId: String,
});

// Register Route
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
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

  const token = jwt.sign({ userId: user._id }, "secretkey");
  res.json({ token });
});

// Middleware to check auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, "secretkey");
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Expenses APIs
app.get("/api/expenses", authMiddleware, async (req, res) => {
  const expenses = await Expense.find({ userId: req.userId });
  res.json(expenses);
});

app.post("/api/expenses", authMiddleware, async (req, res) => {
  const { name, amount } = req.body;
  const expense = new Expense({ name, amount, userId: req.userId });
  await expense.save();
  res.status(201).json(expense);
});

app.delete("/api/expenses/:id", authMiddleware, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
