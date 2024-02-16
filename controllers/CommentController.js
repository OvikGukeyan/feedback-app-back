import CommentModel from '../models/Comment.js';
import Feedback from '../models/Feedback.js';
import Reply from '../models/Reply.js';



export const create = async(req, res) => {
    try {
        const feedbackId = req.params.feedbackId
        const doc = new CommentModel({
            content: req.body.content,
            user: req.userId
        });
        const comment = await doc.save();
        const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, { $push: { comments: comment._id } }, { new: true });
        console.log(updatedFeedback)
        res.json({comment, updatedFeedback} )
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to create comment'
        })
    }
};