const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(express.json());
app.use(cors());

const { connectDB } = require('./config/dbConnect');
connectDB();

const studRoutes = require('./routes/student');
const mentRoutes = require('./routes/mentor');


app.use('/student',studRoutes );
app.use('/mentor',mentRoutes );


app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`);
});
