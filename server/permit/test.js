require('dotenv').config();
const { Permit } = require('permitio');
const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

const permit = new Permit({
    pdp: 'https://cloudpdp.api.permit.io',
    token: process.env.PERMIT_API_KEY,
    debug: true
});

// Create middleware for role verification
const checkRole = (role) => async (req, res, next) => {
    try {
        const permitted = await permit.check(req.user.key, role, 'document');
        if (!permitted) {
            return res.status(403).json({
                error: 'Access denied',
                requiredRole: role,
                userRoles: req.user.roles
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            error: 'Error checking role permissions',
            details: error.message
        });
    }
};

// Auth middleware
app.use(async (req, res, next) => {
    try {
        const userKey = 'john.doe@example.com';
        let user;

        try {
            user = await permit.api.getUser(userKey);
            console.log('User exists:', user);

            if (!user.roles || user.roles.length === 0) {
                console.log('Assigning roles...');
                // Assign multiple roles for testing
                const rolesToAssign = ['viewer', 'contributor'];
                
                for (const role of rolesToAssign) {
                    await permit.api.assignRole({
                        user: userKey,
                        role: role,
                        tenant: 'default'
                    });
                }
                
                user = await permit.api.getUser(userKey);
            }
        } catch (error) {
            console.log('Creating new user...');
            await permit.api.createUser({
                key: userKey,
                email: 'john.doe@example.com',
                first_name: 'John',
                last_name: 'Doe'
            });

            await permit.api.assignRole({
                user: userKey,
                role: 'viewer',
                tenant: 'default'
            });

            user = await permit.api.getUser(userKey);
        }

        req.user = {
            key: user.key,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            roles: user.roles
        };

        next();
    } catch (error) {
        console.error('Permit.io initialization error:', error);
        res.status(500).json({ error: 'Permission check failed.' });
    }
});

// Test endpoints for different roles
app.get('/', async (req, res) => {
    res.json({
        message: 'Welcome to the API',
        user: req.user
    });
});

app.get('/viewer', checkRole('view'), (req, res) => {
    res.json({
        message: 'Viewer content',
        user: req.user
    });
});

app.get('/contributor', checkRole('create'), (req, res) => {
    res.json({
        message: 'Contributor content',
        user: req.user
    });
});

app.get('/moderator', checkRole('moderate'), (req, res) => {
    res.json({
        message: 'Moderator content',
        user: req.user
    });
});

app.get('/admin', checkRole('admin'), (req, res) => {
    res.json({
        message: 'Admin content',
        user: req.user
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log('Available test endpoints:');
    console.log('- GET / (public)');
    console.log('- GET /viewer (requires viewer role)');
    console.log('- GET /contributor (requires contributor role)');
    console.log('- GET /moderator (requires moderator role)');
    console.log('- GET /admin (requires admin role)');
});



