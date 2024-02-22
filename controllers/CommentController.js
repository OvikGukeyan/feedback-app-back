import CommentModel from '../models/Comment.js';
import FeedbackModel from '../models/Feedback.js';
import ReplyModel from '../models/Reply.js';



export const create = async (req, res) => {
    try {
        const feedbackId = req.params.feedbackId
        const doc = new CommentModel({
            content: req.body.content,
            user: req.userId,
            feedbackId: req.params.feedbackId
        });
        const comment = await doc.save();
        const updatedFeedback = await FeedbackModel.findByIdAndUpdate(feedbackId, { $push: { comments: comment._id }, $inc: { commentsCount: 1 } }, { new: true })
            .populate([{
                path: 'comments',
                populate: [{
                    path: 'replies',
                    populate: {
                        path: 'user',
                        select: '-passwordHash'
                    }
                },
                {
                    path: 'user',
                    select: '-passwordHash'
                }]
            },
            {
                path: 'user',
                select: '-passwordHash'
            }
            ])
            .exec();
        res.json(updatedFeedback)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to create comment'
        })
    }
};

export const remove = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const commentToDelete = await CommentModel.findById(commentId);
        if (!commentToDelete) {
            return res.status(500).json({
                message: 'Comment not found'
            })
        };
        const UpdatedFeedback = await FeedbackModel.findByIdAndUpdate(
            commentToDelete.feedbackId,
            { $pull: { comments: commentId }, $inc: { commentsCount: -(1 + commentToDelete.replies.length) } }, { new: true }
        )
        .populate([{
            path: 'comments',
            populate: [{
                path: 'replies',
                populate: {
                    path: 'user',
                    select: '-passwordHash'
                }
            },
            {
                path: 'user',
                select: '-passwordHash'
            }]
        },
        {
            path: 'user',
            select: '-passwordHash'
        }
        ])
        .exec();
        if (!UpdatedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        };
        await ReplyModel.deleteMany({ _id: { $in: commentToDelete.replies } })
        await commentToDelete.deleteOne();
        res.json(
            UpdatedFeedback
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to remove comment'
        })
    }
}