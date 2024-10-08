require("dotenv").config();


const mongoose = require('mongoose');


mongoose.connect(process.env.ConnectionString);

const User = require("./models/user.model")
const Note = require("./models/note.model")

const express = require("express");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 8000;

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities')

app.use(express.json());

// app.use(
//     cors({
//         origin: "*",
//     })
// );

app.use(
    cors({
        origin: "https://notevault-app-ui.onrender.com", // Allow only your frontend domain
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // if you're using cookies or HTTP authentication
    })
);

app.get("/", (req, res) => {
    res.json({data: "Hello Pankaj"})
})


app.post('/create-account', async (req, res) => {
    const {fullName, email, password} = req.body;
    if(!fullName){
        return res
            .status(400)
            .json({error: true, message: "Full Name is Required"});
    }

    if(!email){
        return res.status(400).json({error: true, message: "Email is required"});
    }


    if(!password){
        return res.status(400).json({error: true, message: "Password is required"});
    }

    const isUser = await User.findOne({email: email});
    if(isUser){
        return res.json({error: true, message: "User already exist"});
    }

    const user = new User({
        fullName,
        email,
        password,
    })

    await user.save();

    const accesstoken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    })

    return res.json({
        error: false,
        user,
        accesstoken,
        message: "Registration Successful",

    })
})

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if(!email){
        return res.status(400).json({error: true, message: "Email is required"});
    }

    if(!password){
        return res.status(400).json({error: true, message: "Password is required"});
    }

    const userInfo = await User.findOne({email: email});

    if(!userInfo){
        return res.status(400).json({error: true, message: "User not found"});
    }

    if(userInfo.email == email && userInfo.password == password){
       const user = { user: userInfo} 
       const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m"
       });
       return res.json({
        error: false,
        message: "Login Successfull",
        email,
        accesstoken,
       })
    }else{
        return res.status(400).json({error: true, message: "Invalid Credentials"});
    }
})

//Get user
app.get('/get-user', authenticateToken, async (req, res) => {
    const {user} = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if(!isUser){
        return res.sendStatus(401);
    }


    return res.json({
        user: {fullName: isUser.fullName, email: isUser.email, "_id": isUser._id, CreatedOn: isUser.createdOn},
        message: "",
    })
});

// add note
app.post('/add-note',authenticateToken, async (req, res) => {
    const {title, content, tags} = req.body;
    const {user} = req.user;

    if(!title){
        return res.status(400).json({error: true, message: "Title is required"});
    }

    if(!content){
        return res.status(400).json({error: true, message: "Content is required"});
    }

    try{
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        })

        await note.save();
         return res.json({
            error: false,
            note,
            message: "Note added successfully"
         })
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }

})

app.put('/edit-note/:noteId',authenticateToken, async (req, res) => {
    const nodeId = req.params.noteId;
    const {title, content, tags, isPinned} = req.body;

    const {user} = req.user;

    if(!title && !content && !tags){
        return res.status(400).json({error: true, message: "No Changes provided"})
    }

    try{
        const note = await Note.findOne({ _id: nodeId, userId: user._id })

        if(!note){
            return res.status(404).json({error: true, message: "Note not found"})
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note Updated Successfully",
        });
    }catch(error){
        return res.status(500).json({
            error: true,
            message : "Internal Server Error"
        });
    }
})

//get all note
app.get('/get-all-notes', authenticateToken, async (req, res) => {
     const {user} = req.user;

     try{
        const notes = await Note.find({userId : user._id}).sort({isPinned: -1});

        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully"
        })
     }catch(error){
        return res.status(500).json({
            error: error,
            message: "Internal Server Error"
        })
     }
});

// delete node
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const noteId =  req.params.noteId;

    const {user} = req.user;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user._id});
        if(!note){
            return res.status(404).json({error: true, message: "Note not found"})
        }

        await Note.deleteOne({_id: noteId, userId: user._id});

        return res.json({
            error: false,
            message: "Note Delete Successfully"
        });
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        })
    }



});

//update isPinned Value
app.put('/update-note-pinned/:noteId', authenticateToken, async (req, res) => {
    const nodeId = req.params.noteId;
    const {isPinned} = req.body;

    const {user} = req.user;


    try{
        const note = await Note.findOne({ _id: nodeId, userId: user._id })

        if(!note){
            return res.status(404).json({error: true, message: "Note not found"})
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note Updated Successfully",
        });
    }catch(error){
        return res.status(500).json({
            error: true,
            message : "Internal Server Error"
        });
    }
});

// Search Notes
app.get('/search-notes/', authenticateToken, async (req, res) => {
    const {user} = req.user;
    const {query} = req.query;

    if(!query){
        return res.status(400).json({
            error: true,
            message: "Search query is required"
        });
    }

    try{
        const matchingNotes = await Note.find({userId: user._id, $or: [
            {title: { $regex: new RegExp(query, "i")}},
            {content: { $regex: new RegExp(query, "i")}},
        ],
    });

    return res.json({
        error: false,
        notes: matchingNotes,
        message: "Notes matching the search query retrieved successfully"
    });
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
});


app.listen(port);

module.exports = app;
