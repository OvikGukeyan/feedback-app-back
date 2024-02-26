import ReplyModel from '../models/Reply.js';
import CommentModel from '../models/Comment.js';
import FeedbackModel from '../models/Feedback.js'

export const create = async (req, res) => {
    try {
        const doc = new ReplyModel({
            content: req.body.content,
            replyingTo: req.body.replyingTo,
            user: req.userId,
            commentId: req.params.commentId ,
            feedbackId: req.body.feedbackId
        });
        const reply = await doc.save();
        await FeedbackModel.findByIdAndUpdate(reply.feedbackId, { $inc: { commentsCount: 1 } });
        const updatedComment = await CommentModel.findByIdAndUpdate(reply.commentId, { $push: { replies: reply._id } }, { new: true })
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
        res.json(updatedComment)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to create comment'
        })
    }
};

export const remove = async (req, res) => {
    try {
        const replyId = req.params.replyId;
        const replyToDelete = await ReplyModel.findById(replyId);
        if (!replyToDelete) {
            return res.status(500).json({
                message: 'Reply not found'
            })
        };
        const UpdatedComment = await CommentModel.findByIdAndUpdate(
            replyToDelete.commentId,
            { $pull: { replies: replyId } }, { new: true }
        )
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
        .exec();
        if (!UpdatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        };
        await replyToDelete.deleteOne();
        await FeedbackModel.findByIdAndUpdate(replyToDelete.feedbackId, {$inc: { commentsCount: -1 }})
        res.json(
            UpdatedComment
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to remove reply'
        })
    }
};