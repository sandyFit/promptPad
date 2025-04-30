const prisma = require('../prisma/prismaClient');
const { z } = require('zod');

const GetAllTagsSchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
});
const GetTagByIdSchema = z.object({
    id: z.string(),
});
const CreateTagSchema = z.object({
    name: z.string(),
    description: z.string(),
});
const UpdateTagSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
});
const DeleteTagSchema = z.object({
    id: z.string(),
});

const getAllTags = async (req, res) => {
    try {
        const { page, limit, search } = GetAllTagsSchema.parse(req.query);
        const tags = await prisma.tag.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where: {
                name: {
                    contains: search,
                },
            },
        });
        res.json(tags);
    } catch (err) {
        console.error('Get all tags error:', err);
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
            error: 'Something went wrong during get all tags'
        });
    }
};

const getTagById = async (req, res) => {
    try {
        const { id } = GetTagByIdSchema.parse(req.params);
        const tag = await prisma.tag.findUnique({
            where: { id },
        });
        if (!tag) {
            return res.status(404).json({
                error: 'Tag not found',
            });
        }
        res.json(tag);
    } catch (err) {
        console.error('Get tag by ID error:', err);
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
            error: 'Something went wrong getting this tag Details'
        });
    }
};

const createTag = async (req, res) => {
    try {
        const { name, description } = CreateTagSchema.parse(req.body);
        const newTag = await prisma.tag.create({
            data: {
                name,
                description,
            },
        });
        res.status(201).json(newTag);
    } catch (err) {
        console.error('Create tag error:', err);
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
            error: 'Something went wrong while creating this tag'
        });
    }
};

const updateTag = async (req, res) => {
    try {
        const { id, name, description } = UpdateTagSchema.parse(req.body);
        const updatedTag = await prisma.tag.update({
            where: { id },
            data: {
                name,
                description,
            },
        });
        res.json(updatedTag);
    } catch (err) {
        console.error('Update tag error:', err);
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
            error: 'Something went wrong while updating this tag'
        });
    }
};

const deleteTag = async (req, res) => {
    try {
        const { id } = DeleteTagSchema.parse(req.params);
        await prisma.tag.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (err) {
        console.error('Delete tag error:', err);
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
            error: 'Something went wrong while deleting this tag'
        });
    }
};

const approveTag = async (req, res) => {
    try {
        const { id } = GetTagByIdSchema.parse(req.params);
        const tag = await prisma.tag.update({
            where: { id },
            data: {
                approved: true,
            },
        });
        res.json(tag);
    } catch (err) {
        console.error('Approve tag error:', err);
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
            error: 'Something went wrong while approving this tag'
        });
    }
};


module.exports = {
    getAllTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag,
    approveTag
};
