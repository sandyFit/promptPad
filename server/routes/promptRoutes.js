const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');
const { requireAuth } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/AuthPermit');

// Prompt Routes

// Public routes - only require authentication
router.get('/prompts', requireAuth, promptController.getAllPrompts);
router.get('/prompts/:id', requireAuth, promptController.getPromptById);

// Protected routes - require both authentication and authorization
// Create a new prompt - any authenticated user with 'create' permission on 'prompt' resource
router.post(
    '/prompts',
    requireAuth,
    checkPermission('prompt', 'create'),
    promptController.createPrompt
);

// Update a prompt - requires ownership check or admin permission
router.put(
    '/prompts/:id',
    requireAuth,
    checkPermission('prompt', 'update'),
    promptController.updatePrompt
);

// Delete a prompt - requires ownership check or admin permission
router.delete(
    '/prompts/:id',
    requireAuth,
    checkPermission('prompt', 'delete'),
    promptController.deletePrompt
);

// Approval workflow - only moderators or admins
router.post(
    '/prompts/:id/approve',
    requireAuth,
    checkPermission('approval', 'create'),
    promptController.approvePrompt
);

// Tag management routes
router.post(
    '/tags',
    requireAuth,
    checkPermission('tag', 'create'),
    promptController.createTag
);

// Tag suggestion routes
router.post(
    '/tag-suggestions',
    requireAuth,
    checkPermission('tagSuggestion', 'create'),
    promptController.createTagSuggestion
);

router.put(
    '/tag-suggestions/:id',
    requireAuth,
    checkPermission('tagSuggestion', 'update'),
    promptController.updateTagSuggestion
);

module.exports = router;
