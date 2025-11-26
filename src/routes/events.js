import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Event from "../models/Event.js";
const router = express.Router();

//routes to get my-events

router.get("/my-events", authMiddleware, async (req, res) =>{
    try{
        const events = await Event.find({ organizerId: req.user.id});
        res.json({events});
    }
    catch(err){
        res.status(500).json({message: "Error fetching events"});
    }
});

//routes to post events
router.post("/create", authMiddleware, async (req, res)=>{
    try{
        const {title, description, location, date, skillsRequired } = req.body;

        const events = await Event.create({
            title,
            description,
            location,
            date,
            skillsRequired,
            organizerId: req.user.id,
        });

        res.status(201).json({message: "Event created successfully", events});
    }catch(err){
        console.error("Event creation error: ", err);
        res.status(500).json({message: "Error creating event"});
    }
});

export default router;