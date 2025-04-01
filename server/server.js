const express = require('express');
const dotenv = require('dotenv');
const appRoutes = require('./src/routes/appRoutes');
const cors = require("cors"); 

dotenv.config(); 

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());

app.use('/api', appRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  }).on('error', (err) => {
    console.error('Error starting server:', err);
});
