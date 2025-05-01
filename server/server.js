const express = require('express');
const cookieParser = require('cookie-parser');
const prisma = require('./prisma/prismaClient');
const authRoutes = require('./routes/authRoutes');
const promptRoutes = require('./routes/promptRoutes');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

// Database connection with retry logic
const connectWithRetry = async (retries = MAX_RETRIES) => {
    try {
        await prisma.$connect();
        console.log('🔌 Database connected successfully');
        app.locals.dbConnected = true;
        return true;
    } catch (error) {
        console.error(`❌ Database connection attempt failed (${MAX_RETRIES - retries + 1}/${MAX_RETRIES}):`, error);

        if (retries > 1) {
            console.log(`⏳ Retrying in ${RETRY_DELAY / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return connectWithRetry(retries - 1);
        }

        throw error;
    }
};

// Database connection check middleware
app.use(async (req, res, next) => {
    try {
        if (!app.locals.dbConnected) {
            await connectWithRetry();
        }
        // Ping database to ensure connection is still alive
        await prisma.$queryRaw`SELECT 1`;
        next();
    } catch (error) {
        console.error('❌ Database connection error:', error);
        app.locals.dbConnected = false;
        return res.status(503).json({
            error: 'Database connection failed',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined,
            retry: true
        });
    }
});

// Enhanced health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const start = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        const latency = Date.now() - start;

        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: {
                status: 'connected',
                latency: `${latency}ms`
            },
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            database: {
                status: 'disconnected',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
});

// Security middleware
app.use(helmet());

// Configure CORS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5177',
        'http://localhost:5178',
        'http://localhost:5179',
    ],

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/prompts', require('./routes/promptRoutes'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.url} not found`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing HTTP server and database connection...');
    await prisma.$disconnect();
    process.exit(0);
});

// Update server startup
const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectWithRetry();

        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
            console.log(`📝 Health check available at http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
