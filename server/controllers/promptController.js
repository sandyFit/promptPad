const prisma = require('../prisma/prismaClient');
const { z } = require('zod');

const GetAllPromptsSchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
});

const GetPromptByIdSchema = z.object({
    id: z.string(),
});

const CreatePromptSchema = z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
});

const UpdatePromptSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

const DeletePromptSchema = z.object({
    id: z.string(),
});


const getAllPrompts = async (req, res) => {
    try {
        const { page, limit, search } = GetAllPromptsSchema.parse(req.query);
        const prompts = await prisma.prompt.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where: {
                title: {
                    contains: search,
                },
            },
        });
        res.json(prompts);
    } catch (err) {
        console.error('Get all prompts error:', err);
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
            error: 'Something went wrong during get all prompts'
        });
    }
};
const getPromptById = async (req, res) => {
    try {
        const { id } = GetPromptByIdSchema.parse(req.params);
        const prompt = await prisma.prompt.findUnique({
            where: { id },
        });
        if (!prompt) {
            return res.status(404).json({
                error: 'Prompt not found',
            });
        }
        res.json(prompt);
    } catch (err) {
        console.error('Get prompt by ID error:', err);
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
            error: 'Something went wrong getting this prompt Details'
        });
    }
};

const createPrompt = async (req, res) => {
    try {
        const { title, description, tags } = CreatePromptSchema.parse(req.body);
        const newPrompt = await prisma.prompt.create({
            data: {
                title,
                description,
                tags: {
                    connectOrCreate: tags.map(tag => ({
                        where: { name: tag },
                        create: { name: tag },
                    })),
                },
            },
        });
        res.status(201).json(newPrompt);
    } catch (err) {
        console.error('Create prompt error:', err);
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
            error: 'Something went wrong while creating this prompt'
        });
    }
};

const updatePrompt = async (req, res) => {
    try {
        const { id, title, description, tags } = UpdatePromptSchema.parse(req.body);
        const updatedPrompt = await prisma.prompt.update({
            where: { id },
            data: {
                title,
                description,
                tags: {
                    connectOrCreate: tags.map(tag => ({
                        where: { name: tag },
                        create: { name: tag },
                    })),
                },
            },
        });
        res.json(updatedPrompt);
    } catch (err) {
        console.error('Update prompt error:', err);
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
            error: 'Something went wrong while updating this prompt'
        });
    }
};

const deletePrompt = async (req, res) => {
    try {
        const { id } = DeletePromptSchema.parse(req.params);
        await prisma.prompt.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (err) {
        console.error('Delete prompt error:', err);
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
            error: 'Something went wrong while deleting this prompt'
        });
    }
};

const approvePrompt = async (req, res) => {
    try {
        const { id } = GetPromptByIdSchema.parse(req.params);
        const approvedPrompt = await prisma.prompt.update({
            where: { id },
            data: {
                status: 'approved',
            },
        });
        res.json(approvedPrompt);
    } catch (err) {
        console.error('Approve prompt error:', err);
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
            error: 'Something went wrong while approving this prompt'
        });
    }
};


module.exports = {
    getAllPrompts,
    getPromptById,
    createPrompt,
    updatePrompt,
    deletePrompt,
    approvePrompt,
};
