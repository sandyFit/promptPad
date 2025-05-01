// middlewares/osoAuthMiddleware.js
const { isAllowed } = require("../lib/authorization");
const prisma = require('../prisma/prismaClient');

/**
 * Creates an authorization middleware for a specific action
 * 
 * @param {string} action - The action to authorize (read, create, edit, delete, moderate)
 * @param {Function} getResource - Function to retrieve resource (default: extract ID from params)
 * @returns {Function} Express middleware function
 */
const authorize = (action, getResource) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            // If no user is set, user is not authenticated
            if (!user) {
                return res.status(401).json({
                    code: 'AUTH_REQUIRED',
                    error: 'Unauthorized',
                    message: 'Authentication required'
                });
            }

            // For actions that don't need a specific resource (like "create")
            if (!getResource) {
                const isAuthorized = await isAllowed(user, action);
                if (!isAuthorized) {
                    return res.status(403).json({
                        code: 'FORBIDDEN',
                        error: 'Access denied',
                        message: `You don't have permission to ${action}`
                    });
                }
                return next();
            }

            // Get the resource to check permissions against
            let resource;
            try {
                resource = await getResource(req);
            } catch (error) {
                console.error('Error retrieving resource:', error);
                return res.status(404).json({
                    code: 'NOT_FOUND',
                    error: 'Resource not found',
                    message: 'The requested resource could not be found'
                });
            }

            // No resource found
            if (!resource) {
                return res.status(404).json({
                    code: 'NOT_FOUND',
                    error: 'Resource not found',
                    message: 'The requested resource could not be found'
                });
            }

            // Check if user is allowed to perform action on resource
            const isAuthorized = await isAllowed(user, action, resource);
            if (!isAuthorized) {
                return res.status(403).json({
                    code: 'FORBIDDEN',
                    error: 'Access denied',
                    message: `You don't have permission to ${action} this resource`
                });
            }

            // Store resource in request for later use
            const resourceType = resource.constructor.name.toLowerCase();
            req[resourceType] = resource;

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({
                code: 'SERVER_ERROR',
                error: 'Internal server error',
                message: 'An error occurred during authorization'
            });
        }
    };
};

/**
 * Common resource retrievers for use with the authorize middleware
 */
const resourceRetrievers = {
    /**
     * Retrieves a prompt by ID from the request parameters
     */
    prompt: async (req) => {
        const id = req.params.id;
        if (!id) return null;

        return await prisma.prompt.findUnique({
            where: { id },
            include: { contributor: true }
        });
    },

    /**
     * Retrieves a tag by ID from the request parameters
     */
    tag: async (req) => {
        const id = req.params.id;
        if (!id) return null;

        return await prisma.tag.findUnique({
            where: { id }
        });
    }
};

module.exports = { authorize, resourceRetrievers };
