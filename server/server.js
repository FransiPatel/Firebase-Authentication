const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth-routes');
const { handleCors, handleError, handleNotFound } = require('./middlewares/notification-middlewares');

dotenv.config();
const app = express();

// Parse incoming requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Apply CORS middleware
app.use(handleCors);

// Register routes
app.use(authRoutes);

// Handle 404 errors
app.use(handleNotFound);

// Handle other errors
app.use(handleError);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
