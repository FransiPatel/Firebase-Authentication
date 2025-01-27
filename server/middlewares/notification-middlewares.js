// Middleware to handle CORS
const handleCors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
};

// Middleware to handle 404 errors
const handleNotFound = (req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
};

// Middleware to handle general errors
const handleError = (error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
        },
    });
};

module.exports = {
    handleCors,
    handleNotFound,
    handleError,
  };
  