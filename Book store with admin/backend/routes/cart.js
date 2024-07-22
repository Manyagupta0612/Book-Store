const router=require("express").Router();
const User=require("../models/user");
const authenticateToken = require("./userAuth");

router.put("/add-to-cart", authenticateToken, async(req,res)=>{
    try{
        const{bookid, id}=req.headers;
        const userData=await User.findById(id);
        const isBookFavourited=await userData.cart.includes(bookid);
        if(isBookFavourited)
            {
                return res.json({
                    status:"Success",
                    message:"Book is already in cart"
                });
            }
            await User.findByIdAndUpdate(id,{
                $push: {cart: bookid},
            });
            
            return res.status(200).json({
                message:"Book added to cart",
            });

    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})

router.put("/delete-from-cart/:bookid", authenticateToken, async(req,res)=>{
    try{
        const{bookid}=req.params;
        const{id}=req.headers;
        const userData=await User.findById(id);
        await User.findByIdAndUpdate(id,{
            $pull: {cart: bookid},
        });
        return res.json({
            status:"Success",
            message:"Book removed from cart"
        });
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})

router.get("/get-user-cart", authenticateToken, async(req,res)=>{
    try{
        const {id}=req.headers;
        const userData=await User.findById(id).populate("cart");
        const favouriteBooks=userData.favourites;
        const cart=userData.cart.reverse();

          return res.json({
            status:"Success",
        data:cart});
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})

module.exports=router;