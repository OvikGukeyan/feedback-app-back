import CommentModel from '../models/Comment.js';
import FeedbackModel from '../models/Feedback.js';
import ReplyModel from '../models/Reply.js';



export const create = async(req, res) => {
    try {
        const feedbackId = req.params.feedbackId
        const doc = new CommentModel({
            content: req.body.content,
            user: req.userId
        });
        const comment = await doc.save();
        const updatedFeedback = await FeedbackModel.findByIdAndUpdate(feedbackId, { $push: { comments: comment._id } }, { new: true });
        res.json({updatedFeedback} )
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to create comment'
        })
    }
};