import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        avatarUrl: {
            type: String,
            default: "/uploads/default_avatar.png"
        },
        upvoted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Feedback'
        }]
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', UserSchema)