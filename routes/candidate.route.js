import { Router } from "express";
import { Candidate } from "../models/candidate.model.js";
import { User } from "../models/user.model.js";

const router = Router();

const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user.role === 'admin'
    } catch (error) {
        return false
    }
}

// POST route to add a candidate
router.post('/', async (req, res) => {
    try {
        if (! await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: "User has not admin role" });
        }

        // Assuming the req body contains the candidate data
        const data = req.body;

        // Create a new Candidate document using the Mongoose Model
        const newCandidate = new Candidate(data);

        // Save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved');

        res.status(201).json({ response: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.put('/:candidateId', async (req, res) => {
    try {
        if (! await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: "User has not admin role" });
        }

        // extract the id from the URL parameter
        const candidateId = req.params.candidateId;

        // updated data for the candidate
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
            new: true, // return the updated document
            runValidators: true, // run mongoose validation
        })

        if (!response) {
            return res.status(404).json({ error: "Candidate not found" })
        }

        console.log("Candidate data updated");

        res.status(200).json(response);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server error" })
    }
})


router.delete('/:candidateId', async (req, res) => {
    try {
        if (! await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: "User has not admin role" });
        }

        const candidateId = req.params.candidateId;

        const response = await Candidate.findByIdAndDelete(candidateId)

        if (!response) {
            return res.status(404).json({ error: "Candidate not found" })
        }

        console.log('candidate deleted');

        res.status(200).json(response)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server error" })
    }
})

export default router;