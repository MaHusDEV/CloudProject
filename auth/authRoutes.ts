import express from "express";
import bcrypt from "bcrypt";
import { getUsersCollection } from "../database";
import { redirectIfLogged,requireLogin } from "./authMiddleware";

const router = express.Router();

router.get("/login",redirectIfLogged,(req,res)=>{
    res.render("login",{error: null});
});
//Login control
router.post("/login",async(req,res) =>{
    const users = getUsersCollection();
    const { username, password } = req.body;

    const user = await users.findOne({username});
    if(!user){
        return res.render("login",{error : "User not found"});
    }
    const match = await bcrypt.compare(password,user.password);
    if(!match){
        return res.render("login", { error : "Invalid password"});
    }
    req.session.user = { username: user.username, role: user.role};
    res.redirect("/");
});
router.get("/register", async (req,res)=>{
    res.render("register",{error: null});
});
router.post("/register", async (req ,res)=>{
    const users = getUsersCollection();
    const { username , password} =  req.body;

    const exists = await users.findOne({username});
    if(exists){
        return res.render("register",{ error : "Username already exists"});
    }

    const hashed = await bcrypt.hash(password,10);
    await users.insertOne({
        username,
        password: hashed,
        role: "USER"
    });
    res.redirect("/login");
});
router.get("/logout",requireLogin,(req,res)=>{
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

export default router;