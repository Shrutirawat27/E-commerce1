const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('./user.model');
const generateToken = require('../middleware/generateToken');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;
        //console.log(req.body)
        const user = new User({email, username, password});
        await user.save();
        res.status(201).send({message: "User registered successfully!"})
    } catch (error){
        console.error("Error registering user", error);
        res.status(500).send({message: "Error registering user", })
    }
})

// login user endpoint
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    //console.log(email, password)
    try {
        const user = await User.findOne({email});
    if(!user) {
        return res.status(404).send({message: "User not found"})
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
        return res.status(401).send({message: "Password not match"})
    }
    const token = await generateToken(user._id);
    //console.log("token", token)

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    })

    res.status(200).send({message: "Logged in successfully!",token, user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role, 
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession
    }})
    } catch (error) {
        console.error("Error logging user", error);
        res.status(500).send({message: "Error logging user", })
    }
})

// admin credentials
router.post('/admin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Replace the below logic with actual admin authentication
    if (email === process.env.admin_email && password === process.env.admin_password) {
        const token = jwt.sign({ email, password }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({success:true, token})
        //return res.status(200).json({ message: 'Admin login successful' });
    } else {
        res.json({success:false, message:""})
        //return res.status(401).json({ message: 'Invalid credentials' });
    }
});


// all users
/*router.get("/users", verifyToken, async(req, res) => {
     res.send({message: "Protected users"})
})
     */

// logout endpoint
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).send({message: "Logged out successfully!"})
})

// delete a user
router.delete("/users/:_id", async (req, res) => {
    try {
       const {_id} = req.params;
       const user = await User.findByIdAndDelete(_id);
       if(!user) {
        return res.status(404).send({message: "User not found"})
       }
       res.status(200).send({message: "User deleted successfully"})
    } catch (error) {
        console.error("Error deleting user", error);
        res.status(500).send({message: "Error deleting user", })
    }
}); 

// get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "id email role").sort({createdAt: -1});
        res.status(200).send(users)
    } catch (error) {
        console.error("Error fetching user", error);
        res.status(500).send({message: "Error fetching user", })
    }
});

// update user role
router.put("/users/:_id", async (req, res) => {
    try {
        const {_id} = req.params;
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(_id, {role}, {new: true});
        if(!user) {
            return res.status(404).send({message: "user not found"})
        }
        res.status(200).send({message: "User role updated successfully", user})
    } catch (error) {
        console.error("Error updating user role", error);
        res.status(500).send({message: "Error updating user role", })
    }
})

// edit or update profile
router.patch("/edit-profile", async (req, res) => {
    try {
        const {userId, username, profileImage, bio, profession} = req.body;
        if(!userId) {
            return res.status(400).send({message: "User ID is required"})
        }
        const user = await User.findById(userId);
        //console.log(user)
        if(!user) {
            return res.status(400).send({message: "User not found"});
        }

        // update profile
        if(username !== undefined) user.username = username;
        if(profileImage !== undefined) user.profileImage = profileImage;
        if(bio !== undefined) user.bio = bio;
        if(profession !== undefined) user.profession = profession;

        await user.save();
        res.status(200).send({message: "Profile updated successfully!", user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role, 
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession
        },
    });

    } catch (error) {
        console.log("Error updating user profile", error);
        res.status(500).send({message: "Error updating user profile" })
    }
})

module.exports = router;