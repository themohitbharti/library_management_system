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


// app.get("/posts",(req,res)=>{
//   res.json(posts);
//   console.log(posts);
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

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
