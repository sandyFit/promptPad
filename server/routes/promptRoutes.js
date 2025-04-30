const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');
const { requireAuth } = require('../middleware/authMiddleware');
const authorize = require('../middleware/osoAuthMiddleware');
const prisma = require('../prisma/prismaClient');
const { z } = require('zod');

// Prompt Routes

// Public routes - only require authentication
router.get('/prompts', requireAuth, promptController.getAllPrompts);
router.get('/prompts/:id', requireAuth, promptController.getPromptById);

// Protected routes - require both authentication and authorization
// Create a new prompt - any authenticated user with 'create' permission on 'prompt' resource
router.post(
    '/prompts',
    requireAuth,
    authorize("create"),
    promptController.createPrompt
);

// Update a prompt - requires ownership check or admin permission
router.put(
    '/prompts/:id',
    requireAuth,
    authorize("edit", async (req) => {
        const id = req.params.id;
        return await prisma.prompt.findUnique({ where: { id } });
    }),
    promptController.updatePrompt
);

// Delete a prompt - requires ownership check or admin permission
router.delete(
    '/prompts/:id',
    requireAuth,
    authorize("delete", async (req) => {
        const id = req.params.id;
        return await prisma.prompt.findUnique({ where: { id } });
    }),
    promptController.deletePrompt
);

// Approve prompt (moderator or admin)
router.post(
    '/prompts/:id/approve',
    requireAuth,
    authorize("approve", async (req) => {
        const id = req.params.id;
        return await prisma.prompt.findUnique({ where: { id } });
    }),
    promptController.approvePrompt
);

module.exports = router;
