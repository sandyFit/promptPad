
const prisma = require('../prisma/prismaClient');

export async function requireAuth(req, res, next) {
    try {
        const token = req.cookies.session;

        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required',
            });
        }

        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!session) {
            res.clearCookie('session');
            return res.status(401).json({
                error: 'Invalid session',
                message: 'Session not found',
            });
        }

        if (session.expiresAt < new Date()) {
            await prisma.session.delete({
                where: { id: session.id },
            });
            res.clearCookie('session');
            return res.status(401).json({
                error: 'Invalid session',
                message: 'Session expired',
            });
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role,
        };

        req.session = {
            id: session.id,
            token: session.token,
        };

        return next();
    } catch (error) {
        console.error('Error in requireAuth middleware:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An error occurred while processing your request.',
        });
    }
}
