const express = require('express');

const app = express();
const router = express.Router();
// plugins
const bodyParser = require('body-parser');
const cors = require('cors');
const EmailValidator = require('email-deep-validator');
const emailValidator = new EmailValidator();
// use plugin
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8090;

// Set PORT
app.set("PORT", PORT);

router.get('/', function (req, res) {
    res.json({ message: 'Welcome to our api!' });
});

router.get('/email/check/:email', (req, res) => {
    const email = req.params.email;

    if (email) {
        // send request
        emailValidator.verify(email)
            .then(doc => {
                return res.status(200)
                    .json({
                        status: 200,
                        data: doc
                    });
            })
            .catch(err => {
                return res.status(200)
                    .json({
                        status: 500,
                        error: err

                    });
            });;
    } else {
        // failed
        return res.status(404)
            .json({ status: 404, message: 'Bad data! email not found.' });
    }
});

app.use('/api', router);
app.listen(PORT, () => {
    console.log(`server started at Port:${PORT}`);
});