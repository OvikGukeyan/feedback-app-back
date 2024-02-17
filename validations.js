import { body } from "express-validator";

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
];

export const registerValidation = [
    body('email', 'Invalid E-mail').isEmail(),
    body('password', 'Title must have at least five characters').isLength({min: 5}),
    body('fullName', 'Name must have at least three characters').isLength({min: 3}),
    body('userName', 'Name must have at least three characters').isLength({min: 3}),
    body('avatarUrl').optional(),
];

export const feedbackCreatekValidation = [
    body('title', 'Title must have at least three characters').isLength({min: 3}).isString(),
    body('category').isString(),
    body('description', 'Detail must have at least five characters').isLength({min: 5}).isString(),
];

export const commentCreateValidation = [
    body('content').isLength({min: 10, max: 255}).isString()
]

