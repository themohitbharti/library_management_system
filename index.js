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

// let posts = [
//   {
//     id: 1,
//     title: "The Rise of Decentralized Finance",
//     content:
//       "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
//     author: "Alex Thompson",
//     date: "2023-08-01T10:00:00Z",
//   },
//   {
//     id: 2,
//     title: "The Impact of Artificial Intelligence on Modern Businesses",
//     content:
//       "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
//     author: "Mia Williams",
//     date: "2023-08-05T14:30:00Z",
//   },
//   {
//     id: 3,
//     title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
//     content:
//       "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
//     author: "Samuel Green",
//     date: "2023-08-10T09:15:00Z",
//   },
// ];

// let lastId = 3;


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


// app.get("/books",async(req,res)=>{
//     const allbooks = await books.find({});
//     res.json(allbooks);
//     console.log(allbooks);
// });


// app.get("/posts/:id",(req,res)=>{
//    const id= req.params.id;
//    const postbyid=posts.find((post)=> post.id==id);
//    res.json(postbyid);
// });


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


// app.patch("/posts/:id",(req,res)=>{

//   const post = posts.find((p) => p.id === parseInt(req.params.id));
//   if (!post) return res.status(404).json({ message: "Post not found" });
//   if (req.body.title) post.title = req.body.title;
//   if (req.body.content) post.content = req.body.content;
//   if (req.body.author) post.author = req.body.author;

//   res.json(post);
// });





// app.delete("/posts/:id",(req,res)=>{
//   const id= req.params.id;
//   const postind=posts.findIndex((post)=> post.id==id);
//   if (postind === -1) return res.status(404).json({ message: "Post not found" });
//   posts.splice(postind,1);
//   res.json({message:"post deleted"});
// });


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
  



  



app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
