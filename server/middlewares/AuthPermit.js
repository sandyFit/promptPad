const permit = require('./permitClient');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Check if a user has permission to perform an action on a resource
 * @param {string} resource - The resource type (e.g., 'prompt', 'tag')
 * @param {string} action - The action to perform (e.g., 'create', 'read', 'update', 'delete')
 * @returns {Function} Express middleware
 */
const checkPermission = (resource, action) => async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                code: 'AUTH_REQUIRED',
                error: 'Unauthorized',
                message: 'Authentication required',
            });
        }

        let context = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        if (req.params.id) {
            if (resource === 'prompt') {
                const prompt = await prisma.prompt.findUnique({
                    where: { id: req.params.id }
                });

                if (!prompt) {
                    return res.status(404).json({
                        code: 'RESOURCE_NOT_FOUND',
                        error: 'Prompt not found',
                        message: 'The requested prompt does not exist.',
                    });
                }

                context.resource = {
                    id: prompt.id,
                    ownerId: prompt.contributorId
                };
            } else if (resource === 'tag' || resource === 'tagSuggestion') {
                const tagSuggestion = await prisma.tagSuggestion.findUnique({
                    where: { id: req.params.id }
                });

                if (!tagSuggestion) {
                    return res.status(404).json({
                        code: 'RESOURCE_NOT_FOUND',
                        error: `${resource} not found`,
                        message: `The requested ${resource} does not exist.`,
                    });
                }

                context.resource = {
                    id: tagSuggestion.id,
                    ownerId: tagSuggestion.userId
                };
            }

            // TODO: Add more resource types 
        }

        const permitted = await permit.check(user.id, action, resource, context);

        if (!permitted) {
            return res.status(403).json({
                code: 'PERMISSION_DENIED',
                error: 'Insufficient permissions',
                message: `You do not have permission to ${action} this ${resource}.`,
            });
        }

        next();
    } catch (error) {
        console.error(`🚨 Permission check failed for ${action} on ${resource}:`, error);
        return res.status(500).json({
            code: 'PERMISSION_CHECK_ERROR',
            error: 'Internal Server Error',
            message: 'An error occurred while checking permissions.',
        });
    }
};

module.exports = { checkPermission };

