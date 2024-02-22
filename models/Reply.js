import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    replyingTo: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    feedbackId: {
        type: String,
        required: true
    },
    commentId: {
        type: String,
        required: true
    }

},
    {
        timestamps: true
    }
);

export default mongoose.model('Reply', ReplySchema)