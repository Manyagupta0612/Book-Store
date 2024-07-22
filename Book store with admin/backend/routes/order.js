const router=require("express").Router();
const authenticateToken = require("./userAuth");
const Book=require("../models/book");
const Order=require("../models/order");
const User=require("../models/user");

//place order
router.post("/place-order", authenticateToken, async(req,res)=>{
    try{
        const { id }= req.headers;
        const { order }= req.body;

        for (const orderData of order){
            const newOrder=new Order({ user: id, book:orderData._id});
            const orderDataFromDb= await newOrder.save();

            //saving Order in user model
            await User.findByIdAndUpdate(id, {
                $push : { orders: orderDataFromDb._id},
            });

            //Clearing cart
            await User.findByIdAndUpdate(id, {
                $pull : { cart: orderData._id},
            });
        }

        return res.json({
            status:"Success",
            message:"Order placed successfully",
        });
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})

router.get("/get-order-history", authenticateToken, async(req,res)=>{
    try{
        const {id}=req.headers;
        const userData=await User.findById(id).populate({
            path:"orders",
            populate:{path: "book"},
        });

        const ordersData=userData.orders.reverse();
        return res.json({
            status: "Success",
            data: ordersData,
        })
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})

router.get("/get-all-orders", authenticateToken, async(req,res)=>{
    try{
        const userData = await Order.find().populate({
            path: "book",
        }).populate({
            path:"user",
        }).sort({createdAt: -1});

        return res.json({
            status: "Success",
            data: userData,
        });
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }

})

router.put("/update-status/:id", authenticateToken, async(req,res)=>{
    try{
        const {id}=req.params;//id= order id
        await Order.findByIdAndUpdate(id,{ status: req.body.status});
        return res.json({
            status: "Success",
            message: "Status updated successfully",
        });
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})
module.exports=router;