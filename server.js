const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const connectDB = require("./config/db");
const dotenv = require('dotenv');

dotenv.config();
// Routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL in production
    credentials: true,
}));
app.use(express.json());
connectDB();
// Ensure 'uploads' directory exists
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
}
app.use('/uploads', express.static(uploadsPath));

// Swagger Documentation
const swaggerDocument = require('./swagger/swagger.json');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// MongoDB URI and Port Configuration
// const MONGO_URI = "mongodb+srv://rakeshreddy9971:woSh0azjTXntJ2Ap@cluster0.yhxen.mongodb.net/car-management";
const PORT = 5000; // Set the port here

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`listening on port http://localhost:${PORT}}`));
    })
    .catch((err) => console.error('Database connection error:', err));
