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

// Enhanced security headers with CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "apis.google.com",
        "*.googleapis.com",
        "accounts.google.com",
        "*.gstatic.com",
        "https://apis.google.com",
        "https://*.googleapis.com",
        "https://accounts.google.com",
        "https://*.gstatic.com"
      ],
      scriptSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "apis.google.com",
        "*.googleapis.com",
        "accounts.google.com",
        "*.gstatic.com",
        "https://apis.google.com",
        "https://*.googleapis.com",
        "https://accounts.google.com",
        "https://*.gstatic.com"
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "*.googleapis.com", "https://*.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "*.googleapis.com", "*.gstatic.com"],
      connectSrc: ["'self'", "*.googleapis.com", "accounts.google.com", "https://*.googleapis.com", "https://accounts.google.com"],
      fontSrc: ["'self'", "data:", "https:", "*.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "*.googleapis.com", "accounts.google.com", "https://*.googleapis.com", "https://accounts.google.com"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'", "blob:"],
      formAction: ["'self'", "accounts.google.com", "https://accounts.google.com"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Middleware
app.use(cors());
app.use(express.json());

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
    
    app.listen(availablePort, () => {
      console.log(`Server is running on port ${availablePort}`);
      if (availablePort !== preferredPort) {
        console.log(`Note: Port ${preferredPort} was in use, using port ${availablePort} instead`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 