const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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

const Expense = mongoose.model("Expense", {
  name: String,
  amount: Number,
});

app.get("/api/expenses", async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

app.post("/api/expenses", async (req, res) => {
  const { name, amount } = req.body;
  const expense = new Expense({ name, amount });
  await expense.save();
  res.status(201).json(expense);
});

app.delete("/api/expenses/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
