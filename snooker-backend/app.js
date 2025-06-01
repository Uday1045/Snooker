const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const playerRoutes = require('./routes/players');
const matchRoutes = require('./routes/matches');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);


connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));