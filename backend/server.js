const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const enrollmentRoutes = require('./routes/enrollment');

const app = express();

// CORS configuration - MUST BE FIRST
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow any localhost origin during development
        if (origin.startsWith('http://localhost:')) {
            console.log('Allowing origin:', origin);
            return callback(null, true);
        }
        
        // Log the origin for debugging
        console.log('Request origin:', origin);
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Health check endpoint - MUST BE SECOND
app.get('/health', (req, res) => {
    console.log('Health check request received from:', req.headers.origin);
    res.status(200).json({ 
        status: 'ok',
        port: process.env.PORT || 5000,
        timestamp: new Date().toISOString()
    });
});

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"],
            fontSrc: ["'self'", "data:", "https:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'"],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["'self'", "blob:"],
            formAction: ["'self'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Basic middleware
app.use(express.json());
app.use(compression());
app.use(morgan('dev'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/talkfusion_enrollment';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/enrollments', enrollmentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Function to find an available port
const findAvailablePort = async (startPort) => {
    const net = require('net');
    
    const isPortAvailable = (port) => {
        return new Promise((resolve) => {
            const server = net.createServer();
            
            server.once('error', () => {
                resolve(false);
            });
            
            server.once('listening', () => {
                server.close();
                resolve(true);
            });
            
            server.listen(port);
        });
    };
    
    let port = startPort;
    while (!(await isPortAvailable(port))) {
        port++;
    }
    return port;
};

// Start server with port fallback
const startServer = async () => {
    try {
        const preferredPort = process.env.PORT || 5000;
        const availablePort = await findAvailablePort(preferredPort);
        
        // Create a .env file with the actual port being used
        try {
            fs.writeFileSync('.env', `PORT=${availablePort}\n`);
        } catch (error) {
            console.warn('Warning: Could not write to .env file:', error.message);
        }
        
        // Also write the port to a file in the frontend directory
        try {
            const frontendPortFile = path.join(__dirname, '../prelaunch-enrollment-app/src/config/server-port.json');
            fs.writeFileSync(frontendPortFile, JSON.stringify({ port: availablePort }));
        } catch (error) {
            console.warn('Warning: Could not write to frontend config file:', error.message);
        }
        
        app.listen(availablePort, () => {
            console.log(`Server is running on port ${availablePort}`);
            console.log(`API URL: http://localhost:${availablePort}/api`);
            if (availablePort !== preferredPort) {
                console.log(`Note: Port ${preferredPort} was in use, using port ${availablePort} instead`);
            }
            console.log('CORS enabled for all localhost origins during development');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 