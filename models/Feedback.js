import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        upvotes: {
            type: Number,
            default: 0
        },
        category: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'suggestion'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        coments: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Feedback', FeedbackSchema)