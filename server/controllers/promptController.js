const prisma = require('../prisma/prismaClient');
const { z } = require('zod');

// Validation schemas
const GetAllPromptsSchema = z.object({
    page: z.coerce.number().positive().optional().default(1),
    limit: z.coerce.number().positive().max(100).optional().default(10),
    search: z.string().min(1).max(100).optional(),
    tags: z.array(z.string()).or(z.string()).optional().transform(val =>
        typeof val === 'string' ? [val] : val
    ),
    isPublished: z.preprocess(
        val => val === 'true' ? true : val === 'false' ? false : val,
        z.boolean().optional()
    )
});

const GetPromptByIdSchema = z.object({
    id: z.string().uuid()
});

const CreatePromptSchema = z.object({
    title: z.string().min(3).max(100),
    content: z.string().min(10).max(5000),
    summary: z.string().min(10).max(300),
    tags: z.array(z.string().min(1).max(50)).min(1).max(5),
    isPublished: z.boolean().optional().default(false)
});

const UpdatePromptSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(3).max(100).optional(),
    content: z.string().min(10).max(5000).optional(),
    summary: z.string().min(10).max(300).optional(),
    tags: z.array(z.string().min(1).max(50)).min(1).max(5).optional(),
    isPublished: z.boolean().optional()
});

// Controller methods with validation
const promptController = {
    getAllPrompts: async (req, res) => {
        try {
            const validatedQuery = GetAllPromptsSchema.parse(req.query);
            const { page, limit, search, tags, isPublished } = validatedQuery;

            const where = {
                isPublished: isPublished ?? true,
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { content: { contains: search, mode: 'insensitive' } },
                        { summary: { contains: search, mode: 'insensitive' } }
                    ]
                }),
                ...(tags?.length > 0 && {
                    tags: {
                        some: {
                            tag: {
                                name: { in: tags }
                            }
                        }
                    }
                })
            };

            const [prompts, total] = await prisma.$transaction([
                prisma.prompt.findMany({
                    where,
                    include: {
                        contributor: {
                            select: {
                                id: true,
                                username: true,
                                role: true
                            }
                        },
                        tags: {
                            include: {
                                tag: true
                            }
                        }
                    },
                    skip: (page - 1) * limit,
                    take: limit
                }),
                prisma.prompt.count({ where })
            ]);

            res.json({
                prompts,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Validation error',
                    details: error.errors
                });
            }
            console.error('Get all prompts error:', error);
            res.status(500).json({ error: 'Failed to fetch prompts' });
        }
    },

    getPromptById: async (req, res) => {
        try {
            const { id } = GetPromptByIdSchema.parse(req.params);

            const prompt = await prisma.prompt.findUnique({
                where: { id },
                include: {
                    contributor: {
                        select: {
                            id: true,
                            username: true,
                            role: true
                        }
                    },
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            });

            if (!prompt) {
                return res.status(404).json({ error: 'Prompt not found' });
            }

            res.json(prompt);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Invalid prompt ID',
                    details: error.errors
                });
            }
            console.error('Get prompt by ID error:', error);
            res.status(500).json({ error: 'Failed to fetch prompt' });
        }
    },

    createPrompt: async (req, res) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    error: 'Authentication required',
                    message: 'User ID not found in request'
                });
            }

            const validatedData = CreatePromptSchema.parse(req.body);

            // First, create the prompt
            const prompt = await prisma.prompt.create({
                data: {
                    title: validatedData.title,
                    content: validatedData.content,
                    summary: validatedData.summary,
                    isPublished: validatedData.isPublished ?? false,
                    contributorId: req.user.id,
                },
                include: {
                    contributor: true,
                }
            });

            // Then, connect tags one by one
            const tagPromises = validatedData.tags.map(tagName =>
                prisma.tag.upsert({
                    where: { name: tagName },
                    create: { name: tagName },
                    update: {}
                }).then(tag =>
                    prisma.promptTag.create({
                        data: {
                            promptId: prompt.id,
                            tagId: tag.id
                        }
                    })
                )
            );

            await Promise.all(tagPromises);

            // Get the complete prompt with tags for the response
            const promptWithTags = await prisma.prompt.findUnique({
                where: { id: prompt.id },
                include: {
                    contributor: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            });

            res.status(201).json(promptWithTags);
        } catch (error) {
            console.error('Create prompt error:', error);

            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Validation error',
                    details: error.errors
                });
            }

            if (error.code === 'P2002') {
                return res.status(409).json({
                    error: 'Duplicate entry',
                    message: 'A prompt with this title already exists'
                });
            }

            res.status(500).json({
                error: 'Failed to create prompt',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    updatePrompt: async (req, res) => {
        try {
            const { id } = GetPromptByIdSchema.parse(req.params);
            const validatedData = UpdatePromptSchema.parse({
                id,
                ...req.body
            });

            // First update the prompt
            const promptUpdate = await prisma.prompt.update({
                where: { id },
                data: {
                    title: validatedData.title,
                    content: validatedData.content,
                    summary: validatedData.summary,
                    isPublished: validatedData.isPublished
                },
                include: {
                    contributor: true
                }
            });

            // If tags were provided, update them
            if (validatedData.tags) {
                // Delete all existing tags for this prompt
                await prisma.promptTag.deleteMany({
                    where: { promptId: id }
                });

                // Add the new tags
                const tagPromises = validatedData.tags.map(tagName =>
                    prisma.tag.upsert({
                        where: { name: tagName },
                        create: { name: tagName },
                        update: {}
                    }).then(tag =>
                        prisma.promptTag.create({
                            data: {
                                promptId: id,
                                tagId: tag.id
                            }
                        })
                    )
                );

                await Promise.all(tagPromises);
            }

            // Get the updated prompt with all relations
            const updatedPrompt = await prisma.prompt.findUnique({
                where: { id },
                include: {
                    contributor: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            });

            res.json(updatedPrompt);
        } catch (error) {
            console.error('Update prompt error:', error);

            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Validation error',
                    details: error.errors
                });
            }

            if (error.code === 'P2025') {
                return res.status(404).json({
                    error: 'Not found',
                    message: 'Prompt not found'
                });
            }

            res.status(500).json({
                error: 'Failed to update prompt',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    deletePrompt: async (req, res) => {
        try {
            const { id } = GetPromptByIdSchema.parse(req.params);

            await prisma.prompt.delete({ where: { id } });
            res.json({ message: 'Prompt deleted successfully' });
        } catch (error) {
            console.error('Delete prompt error:', error);

            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Invalid prompt ID',
                    details: error.errors
                });
            }

            if (error.code === 'P2025') {
                return res.status(404).json({
                    error: 'Not found',
                    message: 'Prompt not found'
                });
            }

            res.status(500).json({
                error: 'Failed to delete prompt',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    approvePrompt: async (req, res) => {
        try {
            const { id } = GetPromptByIdSchema.parse(req.params);

            const prompt = await prisma.prompt.update({
                where: { id },
                data: { isPublished: true }
            });

            res.json(prompt);
        } catch (error) {
            console.error('Approve prompt error:', error);

            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Invalid prompt ID',
                    details: error.errors
                });
            }

            if (error.code === 'P2025') {
                return res.status(404).json({
                    error: 'Not found',
                    message: 'Prompt not found'
                });
            }

            res.status(500).json({
                error: 'Failed to approve prompt',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    rejectPrompt: async (req, res) => {
        try {
            const { id } = GetPromptByIdSchema.parse(req.params);

            const prompt = await prisma.prompt.update({
                where: { id },
                data: { isPublished: false }
            });

            res.json(prompt);
        } catch (error) {
            console.error('Reject prompt error:', error);

            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Invalid prompt ID',
                    details: error.errors
                });
            }

            if (error.code === 'P2025') {
                return res.status(404).json({
                    error: 'Not found',
                    message: 'Prompt not found'
                });
            }

            res.status(500).json({
                error: 'Failed to reject prompt',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = promptController;
