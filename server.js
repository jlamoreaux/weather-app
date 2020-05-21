const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();
const app = express();

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
  next();
});

app.use("/", routes);

const listening = () => {
    console.log(`We are up and running! Listening on port ${process.env.PORT}`);
}

app.listen(process.env.PORT, listening)

module.exports = app;
