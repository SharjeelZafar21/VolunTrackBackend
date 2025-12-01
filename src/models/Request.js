import mongoose, { mongo } from "mongoose"

const requestSchema = new mongoose.Schema({
    eventId: {type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    status: {type: String, enum: ["requested", "accepted", "rejected"], default: "requested"},
},{timestamps: true});

export default mongoose.model("Request", requestSchema);