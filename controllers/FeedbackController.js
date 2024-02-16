import { json } from "express";
import FeedbackModel from "../models/Feedback.js";

export const create = async (req, res) => {
    try {
        const doc = new FeedbackModel({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            user: req.userId
        });

        const feedback = await doc.save();
        res.json(feedback)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to create feedback'
        })
    }
};

export const getAll = async (req, res) => {
    try {
        const feedbacks = await FeedbackModel.find()
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
        res.json(feedbacks)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to get feedbacks'
        })
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const feedback = await FeedbackModel.findById(postId)
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

        if (!feedback) {
            return res.status(404).json({
                message: 'Feedback not found'
            });
        }

        res.json(feedback);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to get feedback'
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const result = await FeedbackModel.findByIdAndDelete(postId);
        if (!result) {
            return res.status(500).json({
                message: 'Feedback not found'
            })
        }
        res.json({
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to remove feedback'
        })
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await FeedbackModel.findByIdAndUpdate(postId, {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            user: req.userId
        })

        res.json({
            success: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to update feedback'
        })
    }
}

