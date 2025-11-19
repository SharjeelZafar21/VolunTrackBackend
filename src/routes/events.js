import express, { Router } from "express";
import auth from "../middleware/auth";
import Event from "../models/event";
const router = express.Router();

//routes to get my-events

router.get("/my-events", auth, async (req, res) =>{
    try{
        const events = await Event.find({ organizerId: req.user.id});
        res.json({events});
    }
    catch(err){
        res.status(500).json({message: "Error fetching events"});
    }
});

//routes to post events
router.post("/createEvent", auth, async (req, res)=>{
    try{
        const {title, description, location, date, skillsRequired } = req.body;

        const event = await Event.create({
            title,
            description,
            location,
            date,
            skillsRequired,
            organizerId: req.user.id,
        });

        res.status(201).json({message: "Event created successfully", event});
    }catch(err){
        console.error("Event creation error: ", err);
        res.status(500).json({message: "Error creating event"});
    }
});

export default router;