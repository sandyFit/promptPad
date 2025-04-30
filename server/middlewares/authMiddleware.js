const prisma = require('../prisma/prismaClient');

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

module.exports = { requireAuth };

