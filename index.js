import express from 'express';
import jwt from 'jsonwebtoken';
import mongoosr from 'mongoose';
import bcrypt from 'bcrypt'

import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';

import UserModel from './models/Users.js';

mongoosr
    .connect('mongodb+srv://admin:cjh0RTbuioCIBQ3f@cluster0.dbo7krm.mongodb.net/feedbackApp?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({
                message: 'Wrong email or password'
            })
        };
        const isValidPass = bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Wrong email or password'
            });
        };

        const { passwordHash, ...userData } = user._doc

        const token = jwt.sign({
            _id: user._id
        },
            'secret123',
            {
                expiresIn: '30d'
            })

        res.json({ ...userData, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to login'
        })
    }
})

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        };

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        });

        const user = await doc.save();

        const { passwordHash, ...userData } = user._doc

        const token = jwt.sign({
            _id: user._id
        },
            'secret123',
            {
                expiresIn: '30d'
            })

        res.json({ ...userData, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to register'
        })
    }
})


app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('server OK')
});
