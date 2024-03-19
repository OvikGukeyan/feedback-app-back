import express from 'express';
import mongoosr from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { replyCreateValidation, commentCreateValidation, feedbackCreatekValidation, loginValidation, registerValidation } from './validations.js';

import { FeedbackController, UserController, CommentController, ReplyController } from './controllers/index.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';


mongoosr

    .connect(process.env.MONGODB_URI)

    // .connect('mongodb+srv://admin:cjh0RTbuioCIBQ3f@cluster0.dbo7krm.mongodb.net/feedbackApp?retryWrites=true&w=majority')
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

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', upload.single('image'), async (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/feedbacks/:feedbackId/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);
app.post('/comments/:commentId/replies', checkAuth, replyCreateValidation, handleValidationErrors, ReplyController.create);
app.delete('/comments/:commentId', checkAuth, CommentController.remove);
app.delete('/replies/:replyId', checkAuth, ReplyController.remove);

app.post('/feedbacks/:feedbackId/upvote', checkAuth, FeedbackController.upvote)

app.get('/feedbacks', FeedbackController.getAll);
app.get('/feedbacks/:id', FeedbackController.getOne);
app.post('/feedbacks', checkAuth, feedbackCreatekValidation, handleValidationErrors, FeedbackController.create);
app.delete('/feedbacks/:id', checkAuth, FeedbackController.remove);
app.patch('/feedbacks/:id', checkAuth, feedbackCreatekValidation, handleValidationErrors, FeedbackController.update);


app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('server OK')
});

