const router=require("express").Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const authenticationToken=require("./userAuth");

//Sign-Up
router.post("/sign-up",async(req,res)=>{
    try{
        const{username,email,password,address}=req.body;

        //check username length
        if(username.length<4)
            {
                return res.status(400).json({message:"Username length should be more than 4"});
            }

            //check username already exists or not
            const existingUser=await User.findOne({username:username});
            if(existingUser)
            {
                return res.status(404).json({message:"Username already exists"})
            }
            const existingEmail=await User.findOne({email:email});
            if(existingEmail)
            {
                return res.status(404).json({message:"Email already exists"})
            }
            if(password.length<=5)
            {
                return res.status(404).json({message:"Pssword length smaller than 6"})
            }
            
            const hashedPassword=await bcrypt.hash(password,10);
            const newUser=new User({
                username:username,
                email:email,
                password:hashedPassword,
                address:address,
            });
            await newUser.save();
            return res.status(200).json({message:"SignUp successfuly"});

    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})

//Login
router.post("/login",async(req,res)=>{
    try{
        const{username,password}=req.body;
        
        const existingUser= await User.findOne({username});
        if(!existingUser)
            {
                res.status(400).json({message:"Invalid credentials"});
            }
            const isMatch = await bcrypt.compare(password, existingUser.password);

        if (isMatch) {
            const authClaims=[
                {name: existingUser.username},
                {role: existingUser.role},
            ];
            const token=jwt.sign({authClaims}, "bookstore123",{
                expiresIn:"30d",
            });
            res.status(200).json({
                id:existingUser._id,
                role:existingUser.role,
                token:token,
            });
        } else {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})

// get user information
router.get("/getuserinfo", authenticationToken, async(req,res)=>{
    try{
        const {id}= req.headers;
        const data=await User.findById(id).select('-password');
        return res.status(200).json(data);
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})

//update address
router.put("/update-address", authenticationToken, async(req,res)=>{
    try{
        const { id }= req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address });
        return res.status(200).json({ message: "Address updated successfully "});
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
})
module.exports=router;