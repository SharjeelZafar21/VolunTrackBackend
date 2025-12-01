import mongoose from "mongoose"


const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    date: {type: Date, required: true},

    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    skillsRequired: {
        type: [String],
        default: [],
    },

    joinedVolunteers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],


    createdAt: {type: Date, default: Date.now},
});

export default mongoose.model("Event", eventSchema);