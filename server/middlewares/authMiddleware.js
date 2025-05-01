const prisma = require('../prisma/prismaClient');

// Role hierarchy definition
const ROLE_HIERARCHY = {
    'ADMIN': ['MODERATOR', 'CONTRIBUTOR', 'VIEWER'],
    'MODERATOR': ['CONTRIBUTOR', 'VIEWER'],
    'CONTRIBUTOR': ['VIEWER'],
    'VIEWER': []
};

// Error codes for consistent error handling
const AUTH_ERRORS = {
    NO_TOKEN: {
        code: 'AUTH_REQUIRED',
        status: 401,
        error: 'Unauthorized',
        message: 'Authentication required'
    },
    SESSION_NOT_FOUND: {
        code: 'SESSION_NOT_FOUND',
        status: 401,
        error: 'Invalid session',
        message: 'Session not found'
    },
    SESSION_EXPIRED: {
        code: 'SESSION_EXPIRED',
        status: 401,
        error: 'Invalid session',
        message: 'Session expired'
    }
};

/**
 * Middleware to require authentication for protected routes
 */
function requireAuth(req, res, next) {
    try {
        const token = req.cookies.session;

        if (!token) {
            return res.status(AUTH_ERRORS.NO_TOKEN.status).json(AUTH_ERRORS.NO_TOKEN);
        }

        return prisma.session.findUnique({
            where: { token },
            include: { user: true },
        })
            .then(session => {
                if (!session) {
                    res.clearCookie('session');
                    return res.status(AUTH_ERRORS.SESSION_NOT_FOUND.status).json(AUTH_ERRORS.SESSION_NOT_FOUND);
                }

                if (session.expiresAt < new Date()) {
                    // Clean up expired session
                    return prisma.session.delete({
                        where: { id: session.id },
                    })
                        .then(() => {
                            res.clearCookie('session');
                            return res.status(AUTH_ERRORS.SESSION_EXPIRED.status).json(AUTH_ERRORS.SESSION_EXPIRED);
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
        const userRole = req.user?.role;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        const hasPermission = allowedRoles.some(role =>
            userRole === role || ROLE_HIERARCHY[userRole]?.includes(role)
        );

        if (!hasPermission) {
            return res.status(403).json({
                code: 'FORBIDDEN',
                error: 'Access denied',
                message: `Required role: ${allowedRoles.join(' or ')}`
            });
        }

        next();
    };
}

/**
 * Middleware to check ownership of a resource
 * @param {string} resourceType - Type of resource to check ownership for
 */
function checkOwnership(resourceType = 'prompt') {
    return async (req, res, next) => {
        try {
            const resource = await prisma[resourceType].findUnique({
                where: { id: req.params.id },
                include: { contributor: true }
            });

            if (!resource) {
                return res.status(404).json({
                    code: 'NOT_FOUND',
                    error: 'Resource not found',
                    message: `${resourceType} not found`
                });
            }

            // Admin has full access
            if (req.user.role === 'ADMIN') {
                req[resourceType] = resource;
                return next();
            }

            // Moderators can manage all except admin content
            if (req.user.role === 'MODERATOR' && resource.contributor.role !== 'ADMIN') {
                req[resourceType] = resource;
                return next();
            }

            // Contributors can only manage their own content
            if (resource.contributorId !== req.user.id) {
                return res.status(403).json({
                    code: 'FORBIDDEN',
                    error: 'Access denied',
                    message: 'You can only manage your own content'
                });
            }

            req[resourceType] = resource;
            next();
        } catch (error) {
            console.error(`Error in checkOwnership middleware:`, error);
            res.status(500).json({
                code: 'SERVER_ERROR',
                error: 'Server error',
                message: 'An error occurred while checking resource ownership'
            });
        }
    };
}

module.exports = { requireAuth, requireRole, checkOwnership };
