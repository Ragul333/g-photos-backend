// src/app.js
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    dotenv.config({ path: '.env.development' });
} else if (env === 'production') {
    dotenv.config({ path: '.env.production' });
}

const connectDB = require('./config/db');
const globalErrorHandler = require('./middlewares/error.middleware');
const routes = require('./routes');


class App {
    constructor() {
        this.app = express();
        this.initializeDatabase();
        this.setMiddlewares();
        this.setRoutes();
        this.setErrorHandling();
    }

    initializeDatabase() {
        connectDB(); // Connect to MongoDB
    }

    setMiddlewares() {
        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

    }

    setRoutes() {
        this.app.use('/api/v1', routes);
        this.app.use('/uploads', express.static(path.join(__dirname, 'my-photo-bucket')));
    }

    setErrorHandling() {
        this.app.use(globalErrorHandler);
    }

    listen(port = process.env.PORT || 5000) {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }

    getInstance() {
        return this.app;
    }
}

module.exports = App;
