import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    role: {
      type: String,
      enum: ["volunteer", "organizer"],
      required: true
    },
    skills: [String],
    interest: [String],
    completedEvents:[{
      eventId: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
      impactScore: {type: Number, default: 0}
    }]
}, {timestamps: true});

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

export default mongoose.model('User', UserSchema);
