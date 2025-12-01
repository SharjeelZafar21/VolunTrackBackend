import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Event from "../models/Event.js";
import Request from "../models/Request.js";
import User from "../models/user.js";
const router = express.Router();

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

//routes to get organizer events

router.get("/my-events", authMiddleware, async (req, res) =>{
    try{
        const events = await Event.find({ organizerId: req.user.id})
        .populate("joinedVolunteers", "name email");
        res.json({events});
    }
    catch(err){
        res.status(500).json({message: "Error fetching events"});
    }
});

//routes to get all events

router.get("/all-events", async (req, res)=>{
    try{
        const events = await Event.find().sort({ createdAt: -1 });
        res.json({events});
    }catch(err){
        console.error("Error fetching events:", err);
        res.status(500).json({message: "Error fetching events"})
    }
});

//request to join event
router.post("/request/:eventId", authMiddleware, async (req, res)=>{
    try{
        const {eventId} = req.params;
        const event = await Event.findById(eventId);
        if(!event) return res.status(404).json({message: "Event not found"});

        //organizer can't join their own event
        if(event.organizerId.toString()===  req.user.id){
            return res.status(400).json({message: "Organizer cannot join the event"});
        }

        //check if already joined
        if(event.joinedVolunteers && event.joinedVolunteers.includes(req.user.id)){
            return res.status(400).json({message: "You already joined the event"});
        }

        //check if already requested
        let existing = await Request.findOne({ eventId, userId: req.user.id});
        if(existing){
            return res.status(400).json({message: "You already requested for the event"});
        }

        const request = await Request.create({ eventId, userId: req.user.id});
        res.status(201).json({message: "Request Submitted", request});
    }catch (err){
        console.error("request create error",err);
        res.status(500).json({message: "Server error"});
        
    }
})

//Get requested events of volunteer
router.get("/requests/myEvents", authMiddleware, async (req, res)=>{
    try{
        const requests = await Request.find({userId: req.user.id})
        .populate("eventId")
        .sort({createdAt: -1});
        res.json({requests});
    }catch (err){
        console.error("request fetching error",err);
        res.status(500).json({message: "Error fetching request"});
        
    }
})

//organizer getting the request of volunteers
router.get("/requests", authMiddleware, async(req, res)=>{
    try{
        //ensure user is organizer
        if (req.user.role !== "organizer"){
            return res.status(403).json({message: "Access denied"});
        }

        //Find events belonging to organizer 
        const events = await Event.find({organizerId: req.user.id}).select("_id");
        const eventIds = events.map((e) =>e._id);


        const requests = await Request.find({ eventId: { $in: eventIds}, status: "requested"})
        .populate("eventId")
        .populate("userId", "name email");
        res.json({requests});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Error fetching organizer requests"});
        
    }
})

//organizer approve request
router.post("/requests/:requestId/approve", authMiddleware, async(req, res)=>{
    try{
        if(req.user.role !== "organizer") return res.status(400).json({message: "Access denied"});

        const request = await Request.findById(req.params.requestId).populate("eventId");
        if(!request) return res.status(404).json({message: "Request not found"});

        // ensure organizer own the event
        if(request.eventId.organizerId.toString() !== req.user.id){
            return res.status(403).json({message: "Not authorized for this request"});
        }

        //update status
        request.status = "accepted";
        await request.save();

        //add volunteer to  joined volunteers
        const event = await Event.findById(request.eventId._id);
        event.joinedVolunteers = event.joinedVolunteers || [];
        if(!event.joinedVolunteers.includes(request.userId)){
            event.joinedVolunteers.push(request.userId);
            await event.save();
        }

        res.json({message: "Request approved", request, event});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Error approving request"});
        
    }
});

//organizer reject request
router.post("/requests/:requestId/reject", authMiddleware, async(req, res) =>{
    try{
        if(req.user.role !== "organizer") return res.status(403).json({message: "Acess denied"});

        const request = await Request.findById(req.params.requestId).populate("eventId");
        if(!request) return res.status(404).json({message: "Request not found"});

        // ensure organizer own the event
        if(request.eventId.organizerId.toString() !== req.user.id){
            return res.status(403).json({message: "Not authorized for this request"});
        }

        request.status = "rejected";
        await request.save();

        res.json({message: "Requested rejection", request});
    }catch (err){
        console.error(err);
        res.status(500).json({message: "Error rejecting request"});
    }
})
export default router;