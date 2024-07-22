const router=require("express").Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken");
const authenticationToken=require("./userAuth");
const Book=require("../models/book");

router.post("/add-book", authenticationToken, async(req,res)=>{
    try{
        const {id}=req.headers;
        const user=await User.findById(id);
        if(user.role!="admin")
            {
                return res.status(400).json({message:"You are not having access to perform admin work"});
            }
        const book=new Book({
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language,
        })
        await book.save();
        res.status(200).json({message:"Book added successfully"});
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})

router.put("/update-book", authenticationToken, async(req,res)=>{
    try{
        const {bookid}=req.headers;
        
        await Book.findByIdAndUpdate(bookid,{
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language,
        });

        return res.status(200).json({message:"Book updated successfully"});
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})

router.delete("/delete-book", authenticationToken, async(req,res)=>{
    try{
        const {bookid}=req.headers;
        
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({message:"Book deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})

router.get("/get-all-books", async(req,res)=>{
    try{
        const books=await Book.find().sort({createdAt: -1});
        return res.json({
            status: "Success",
            data:books,
        });
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
});

router.get("/get-recent-books", async(req,res)=>{
    try{
        const books=await Book.find().sort({createdAt: -1}).limit(4);
        return res.json({
            status: "Success",
            data:books,
        });
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
});

router.get("/get-book-by-id/:id", async(req,res)=>{
    try{
        const { id } = req.params;
        const book=await Book.findById(id);
        return res.json({
            status: "Success",
            data:book,
        });
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
});

module.exports=router;