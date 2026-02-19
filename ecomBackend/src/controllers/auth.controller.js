import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    //get data from request body
    const {name, email, password} = req.body;

    //validate input
    if(!name || !email || !password) {
        return res.status(400).json({
            msg: "All fields are required!!"
        })
    }

    //validate email
    const existingUser = await prisma.user.findUnique({where: {email}});

    if(existingUser){
        return res.status(409).json({
            msg: "User already exits!!"
        })
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

    //return res
    return res.status(201).json({
        msg: "User created Successfully",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
}


export const login = async (req, res) => {
    //extract email pass
    const {email, password} = req.body;

    //validate input
    if(!email || !password) {
        return res.status(400).json({
            msg: "All fields are required!!"
        })
    }

    //find user by email
    const user = await prisma.user.findUnique({where: {email}});

    if(!user) {
        return res.status(401).json({
            msg: "Invalid credentials!!"
        })
    }

    //compare password
    const comparePass = await bcrypt.compare(password, user.password);

    if(!comparePass) {
        return res.status(401).json({
            msg: "Invalid credentials!!"
        })
    }

    //generate token
    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.SECRET_KEY,
        {expiresIn: "1d"}
    )

    //return res
    return res.status(200).json({
        msg: "User Logged In Successfully",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
}
