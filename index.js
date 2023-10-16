import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 8000;


mongoose.connect('mongodb://127.0.0.1:27017/booksdb')
.then(() => console.log("mongodb connected"))
.catch((err)=> console.log("mongo error",err));




const bookSchema = new mongoose.Schema({
  name:{
     type: String,
     required:true,
  },

  isbn_no:{
    type: String,
    required:true,
 },

 author_name:{
  type: String,
  
 },
 genre:{
    type: String,
    
   },
 inventory:{
    type: Number,
    
   },
  publication_year:{
    type: String,
    
   },


});

const books= mongoose.model("bookdetails",bookSchema);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/books", async (req, res) => {
    const isbn = req.query.isbn_no;
    if (isbn) {
        try {
            const book = await books.findOne({ isbn_no: isbn });
        
            if (!book) {
              return res.status(404).json({ error: 'Book not found' });
            }
        
            return res.status(200).json({ book });
          } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: 'Internal server error' });
          }
    } else {
      // If no inventory query parameter, return all books
      try {
        const allbooks = await books.find({});
        res.json({ allbooks });
        console.log("All Books:", allbooks);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  });




app.post("/books",async(req,res)=>{
  const result= await books.create( {
     
     name:req.body.name,
     isbn_no:req.body.isbn_no,
     author_name: req.body.author_name,
     genre:req.body.genre,
     inventory:req.body.inventory,
     publication_year:req.body.publication_year,
     
  });

  console.log("result is",result);
  return res.status(201).json(result);

  
});










app.delete("/books/:isbn_no", async (req, res) => {
    const isbn_no = req.params.isbn_no;
  
    try {
      const deletedbook = await books.findOneAndDelete({ isbn_no });
      
      if (!deletedbook) {
        return res.status(404).json({ message: "book not found" });
      }
  
      res.json({ message: "book deleted", deletedbook });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });


  app.get("/books/find_books_needed", async (req, res) => {
    
    const n = parseInt(req.query.inventory); // Parse n from the query string
    
    try {
      const book = await books.find({ inventory: { $lt: n } });
      res.json({ book });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });


  app.get("/books/unavailable_books", async (req, res) => {
    try {
      const unavailableBooks = await books.find({ inventory: 0 });
      res.json({ unavailableBooks });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });


  app.put("/books/:isbn_no", async (req, res) => {
    const isbn = req.params.isbn_no;
  
  
    try {
      const updatedBook = await books.findOneAndUpdate(
        { isbn_no: isbn },
        req.body,
        { new: true }
      );
  
      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      res.json({ message: "Book updated", updatedBook });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  

//   app.get("/book", async (req, res) => {
//     const isbn = req.query.isbn_no;
  
  
//     try {
//       const book = await books.findOne({ isbn_no: isbn });
  
//       if (!book) {
//         return res.status(404).json({ error: 'Book not found' });
//       }
  
//       return res.status(200).json({ book });
//     } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   });


app.patch("/books/:isbn_no", async (req, res) => {
    const isbn = req.params.isbn_no;
    
    const updatedFields = req.body.genre;
    
   
    try {
      const updatedBook = await books.findOneAndUpdate(
        { isbn_no: isbn },
        { $set: { genre: updatedFields} },
        { new: true }
      );
  
      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      res.json({ message: "Book updated", updatedBook });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  

  app.get("/books/issue_book/:isbn_no", async (req, res) => {
    const isbn = req.params.isbn_no;
  
    
  
    try {
      // Find the book by ISBN
      const book = await books.findOne({ isbn_no: isbn });
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      if (book.inventory <= 0) {
        return res.status(400).json({ message: "Book is out of stock" });
      }
  
      // Decrement the inventory by 1
      book.inventory -= 1;
      await book.save();
  
      res.json({ message: "Book inventory decremented", updatedBook: book });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  
 



  



app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
