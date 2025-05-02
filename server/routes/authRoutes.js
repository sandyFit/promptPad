const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const prisma = require('../prisma/prismaClient');
const { requireAuth } = require('../middlewares/authMiddleware');
const router = express.Router();
const { z } = require('zod');

// Helper function to generate unique username
const generateUniqueUsername = async (baseUsername) => {
    let username = baseUsername;
    let counter = 1;

    while (true) {
        // Check if username exists
        const existing = await prisma.user.findUnique({
            where: { username }
        });

        if (!existing) {
            return username;
        }

        // If username exists, append number and try again
        username = `${baseUsername}${counter}`;
        counter++;
    }
};

const signUpSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    username: z.string().optional(),
    role: z
        .string()
        .transform(val => val.toUpperCase())
        .refine(val => ['ADMIN', 'VIEWER', 'CONTRIBUTOR', 'MODERATOR'].includes(val), {
            message: 'Invalid role'
        })
        .optional()

})

// Register
router.post('/register', async (req, res) => {
    try {
        const user = signUpSchema.safeParse(req.body);
        if (!user.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: user.error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                })),
            });
        }
        const { email, password, username: rawUsername, role: userRole } = user.data;


        // Input sanitization
        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedPassword = password.trim();
        const baseUsername = rawUsername?.trim() || sanitizedEmail.split('@')[0];

        // Generate unique username
        const username = await generateUniqueUsername(baseUsername);
        const role = userRole?.toUpperCase() || 'VIEWER'; // Default role

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({
                error: 'Email already registered'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(sanitizedPassword, salt);

        // Create the user
        const newUser = await prisma.user.create({
            data: {
                email: sanitizedEmail,
                username,
                passwordHash: hashed,
                role: role?.toUpperCase() || 'VIEWER'
            }
        });

        // Create session
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

        await prisma.session.create({
            data: {
                token,
                userId: newUser.id,
                expiresAt
            }
        });

        res.cookie('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
        });

        res.json({
            message: 'Signed up successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role
            }
        });

    } catch (err) {
        console.error('Signup error:', err);

        if (err.code === 'P2002') {
            const field = err.meta?.target[0];
            return res.status(400).json({
                error: `This ${field} is already taken`
            });
        }

        if (err instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: err.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                })),
            });
        }

        return res.status(500).json({
            error: 'Something went wrong during sign-up'
        });
    }

});

const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Log In
router.post('/login', async (req, res) => {
    try {
        const result = signInSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                })),
            });
        }

        const { email, password } = result.data;

        // Input sanitization
        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedPassword = password.trim();

        // Input validation
        if (!sanitizedEmail || !sanitizedPassword) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find the user
        const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        // Check if the password is correct
        const valid = await bcrypt.compare(sanitizedPassword, user.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        // Create session
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

        await prisma.session.create({
            data: {
                token,
                userId: user.id,
                expiresAt
            }
        });

        // Cookie-based auth 
        res.cookie('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
        });

        res.json({
            message: 'Logged in',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Signin error:', err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: err.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                })),
            });
        }
        return res.status(500).json({
            error: 'Something went wrong during sign-in'
        });
    }
});

// Log Out
router.post('/logout', async (req, res) => {
    try {
        const token = req.cookies.session;
        if (token) {
            await prisma.session.delete({
                where: { token }
            });
            res.clearCookie('session');
        }
        res.json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Signout error:', error);
        return res.status(500).json({
            error: 'Failed to logout'
        });
    }
});

// Get Current User
router.get('/me', requireAuth, async (req, res) => {
    try {
        // Since requireAuth middleware populates req.user, we can just return it
        return res.json({
            message: 'Current user',
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role,
                username: req.user.username
            }
        });
    } catch (error) {
        console.log('Error getting current user:', error);
        return res.status(500).json({
            error: 'Failed to get current user',
            details: error.message
        });
    }
});

module.exports = router;
