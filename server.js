const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Create Express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB (replace 'your-mongodb-uri' with the actual connection string)
mongoose
  .connect(
    `mongodb+srv://cse2252:zaOmNmfZ8NHqTN6K@cluster0.hlzaati.mongodb.net/cse2252?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define the Book schema and model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  department: String,
  ID: String,
});

const Book = mongoose.model("Book", bookSchema);

// Define the Express router for /books endpoint
const bookRouter = express.Router();

// GET /books
bookRouter.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /books/:id
bookRouter.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /books
bookRouter.post("/post", async (req, res) => {
  try {
    //   const { title, author, department, ID } = req.body;
    const { users } = req.body;
    console.log(req.body);
    // const book = new Book({ title, author, department, ID });
    const book = new Book(users);
    console.log(book);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /books/:id
bookRouter.put("/put/:id", async (req, res) => {
  try {
    const { title, author, department, ID } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, department, ID },
      { new: true }
    );
    if (updatedBook) {
      res.json(updatedBook);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /books/:id
bookRouter.delete("/del/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (deletedBook) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Register the bookRouter with the base URL '/library/books'
app.use("/library/books", bookRouter);

// Start the server
app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
