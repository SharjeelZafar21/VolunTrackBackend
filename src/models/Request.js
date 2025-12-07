import mongoose, { mongo } from "mongoose"

const requestSchema = new mongoose.Schema({
    eventId: {type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    status: {type: String, enum: ["requested", "accepted", "rejected"], default: "requested"},
    impactScore: {type: Number, min: 1, max: 10}
},{timestamps: true});

export default mongoose.model("Request", requestSchema);