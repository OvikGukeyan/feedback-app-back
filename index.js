import express from 'express';
import mongoosr from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { feedbackCreatekValidation, loginValidation, registerValidation } from './validations.js';

import {FeedbackController, UserController} from './controllers/index.js'; 

import {handleValidationErrors, checkAuth} from './utils/index.js';


mongoosr
    .connect('mongodb+srv://admin:cjh0RTbuioCIBQ3f@cluster0.dbo7krm.mongodb.net/feedbackApp?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me',checkAuth , UserController.getMe);

app.post('/upload', upload.single('image'), async(req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/feedbacks', FeedbackController.getAll);
app.get('/feedbacks/:id', FeedbackController.getOne);
app.post('/feedbacks', checkAuth, feedbackCreatekValidation , handleValidationErrors, FeedbackController.create);
app.delete('/feedbacks/:id', checkAuth, FeedbackController.remove);
app.patch('/feedbacks/:id', checkAuth, feedbackCreatekValidation , handleValidationErrors, FeedbackController.update);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('server OK')
});

