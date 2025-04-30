const prisma = require('../prisma/prismaClient');

/**
 * Middleware to require authentication for protected routes
 */
function requireAuth(req, res, next) {
    try {
        const token = req.cookies.session;

        if (!token) {
            return res.status(401).json({
                code: 'AUTH_REQUIRED',
                error: 'Unauthorized',
                message: 'Authentication required',
            });
        }

        return prisma.session.findUnique({
            where: { token },
            include: { user: true },
        })
            .then(session => {
                if (!session) {
                    res.clearCookie('session');
                    return res.status(401).json({
                        code: 'SESSION_NOT_FOUND',
                        error: 'Invalid session',
                        message: 'Session not found',
                    });
                }

                if (session.expiresAt < new Date()) {
                    // Clean up expired session
                    return prisma.session.delete({
                        where: { id: session.id },
                    })
                        .then(() => {
                            res.clearCookie('session');
                            return res.status(401).json({
                                code: 'SESSION_EXPIRED',
                                error: 'Invalid session',
                                message: 'Session expired',
                            });
                        });
                }

                // Set user info on request object for downstream use
                req.user = {
                    id: session.user.id,
                    email: session.user.email,
                    username: session.user.username,
                    role: session.user.role,
                };

                req.session = {
                    id: session.id,
                    token: session.token,
                };

                return next();
            })
            .catch(error => {
                console.error('Error in requireAuth middleware:', error);
                return res.status(500).json({
                    code: 'AUTH_INTERNAL_ERROR',
                    error: 'Internal Server Error',
                    message: 'An error occurred during authentication.',
                });
            });
    } catch (error) {
        console.error('Error in requireAuth middleware:', error);
        return res.status(500).json({
            code: 'AUTH_INTERNAL_EXCEPTION',
            error: 'Internal Server Error',
            message: 'An error occurred during authentication.',
        });
    }
}

/**
 * Middleware to check if user has required role
 * @param {string|string[]} roles - Single role or array of roles that have access
 */
function requireRole(roles) {
    return (req, res, next) => {
        // First ensure the user is authenticated
        requireAuth(req, res, (err) => {
            if (err) return next(err);

            // Convert single role to array for consistent handling
            const allowedRoles = Array.isArray(roles) ? roles : [roles];

            // Check if user's role is in the allowed roles
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    code: 'FORBIDDEN',
                    error: 'Access denied',
                    message: 'You do not have permission to access this resource',
                });
            }

            next();
        });
    };
}

module.exports = { requireAuth, requireRole };
