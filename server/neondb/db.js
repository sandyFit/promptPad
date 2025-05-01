require("dotenv").config();
const http = require("http");
const { neon } = require("@neondatabase/serverless");

// Add error handling for database connection
const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
    try {
        const result = await sql`SELECT version()`;
        const { version } = result[0];
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(version);
    } catch (error) {
        console.error('Database connection error:', error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            error: 'Database connection failed',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        }));
    }
};

const server = http.createServer(requestHandler);

server.on('error', (error) => {
    console.error('Server error:', error);
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
