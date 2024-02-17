import ReplyModel from '../models/Reply.js';
import CommentModel from '../models/Comment.js';


export const create = async(req, res) => {
    try {
        const commentId = req.params.commentId
        const doc = new ReplyModel({
            content: req.body.content,
            user: req.userId
        });
        const reply = await doc.save();
        const updatedFeedback = await CommentModel.findByIdAndUpdate(commentId, { $push: { replies: reply._id } }, { new: true });
        res.json({updatedFeedback} )
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to create comment'
        })
    }
}