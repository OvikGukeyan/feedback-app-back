import ReplyModel from '../models/Reply.js';
import CommentModel from '../models/Comment.js';
import FeedbackModel from '../models/Feedback.js'

export const create = async (req, res) => {
    try {
        const feedbackId = req.body.feedbackId
        const commentId = req.params.commentId
        const doc = new ReplyModel({
            content: req.body.content,
            replyingTo: req.body.replyingTo,
            user: req.userId
        });
        const reply = await doc.save();
        const updatedFeedback = await FeedbackModel.findByIdAndUpdate(feedbackId, { $inc: { commentsCount: 1 } });
        const updatedComment = await CommentModel.findByIdAndUpdate(commentId, { $push: { replies: reply._id } }, { new: true })
            .populate([{
                path: 'replies',
                populate: {
                    path: 'user',
                    select: '-passwordHash'
                }
            },
            {
                path: 'user',
                select: '-passwordHash'
            }])
        res.json({ updatedComment })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to create comment'
        })
    }
}