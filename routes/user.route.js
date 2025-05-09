import { Router } from "express";
import { generateToken, jwtAuthMiddleware } from "../jwt.js";
import { User } from "../models/user.model.js";


const router = Router();

// POST router to add a User
router.post('/signup', async (req, res) => {
    try {
        // Assuming the req body contains the user data
        const data = req.body;

        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: "Admin user already exists" });
        }

        // Validate Aadhar Card Number must have exactly 12 digit
        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        // Create a new User document using the Mongoose Model
        const newUser = new User(data);

        // Save the user to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id,
        }

        console.log(JSON.stringify(payload));

        const token = generateToken(payload);
        console.log('Token is', token);

        res.status(200).json({ response: response, token: token })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Login route
router.post('/login', async (req, res) => {
    try {
        // Extract the aadhar card and password from req body
        const { aadharCardNumber, password } = req.body;

        // Check if aadharCardNumber or password is missing
        if (!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }

        // Find the aadharCardNumber in the database
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

        // If user does not have aadharcardNumber , return error
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid aadharCardNumber or password" });
        }

        // generate token 
        const payload = {
            id: user.id
        }

        const token = generateToken(payload)

        // return token as response
        res.json({ token })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById({ userId });

        res.status(200).json({ user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// 
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        // Extract the id from the token
        const userId = req.user.id;

        // Extract the current and new password from req body
        const { currentPassword, newPassword } = req.body;

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        // Find the user by userId in the database
        const user = await User.findById(userId);

        // If password , return error
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: "Invalid aadharCardNumber or password" });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log('Password updated successfully');

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

export default router;