import express from 'express';
import mongoosr from 'mongoose';

import { feedbackCreatekValidation, loginValidation, registerValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as FeedbackController from './controllers/FeedbackController.js'


mongoosr
    .connect('mongodb+srv://admin:cjh0RTbuioCIBQ3f@cluster0.dbo7krm.mongodb.net/feedbackApp?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me',checkAuth , UserController.getMe);

app.get('/feedbacks', FeedbackController.getAll);
app.get('/feedbacks/:id', FeedbackController.getOne);
app.delete('/feedbacks/:id', checkAuth, FeedbackController.remove);
app.patch('/feedbacks/:id', checkAuth, FeedbackController.update);


app.post('/feedbacks', checkAuth, feedbackCreatekValidation ,FeedbackController.create)


app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('server OK')
});

