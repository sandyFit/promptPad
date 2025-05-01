const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');
const { requireAuth, requireRole, checkOwnership } = require('../middlewares/authMiddleware');

// Verify controller methods exist
const requiredMethods = [
    'getAllPrompts',
    'getPromptById',
    'createPrompt',
    'updatePrompt',
    'deletePrompt',
    'approvePrompt'
];

requiredMethods.forEach(method => {
    if (typeof promptController[method] !== 'function') {
        throw new Error(`promptController.${method} is not a function`);
    }
});

// Public routes (still require authentication)
router.get('/', requireAuth, promptController.getAllPrompts);
router.get('/:id', requireAuth, promptController.getPromptById);

// Contributor routes
router.post(
    '/',
    requireAuth,
    requireRole('CONTRIBUTOR'),
    promptController.createPrompt
);

// Protected routes with ownership check
router.put(
    '/:id',
    requireAuth,
    requireRole('CONTRIBUTOR'),
    checkOwnership('prompt'),
    promptController.updatePrompt
);

router.delete(
    '/:id',
    requireAuth,
    requireRole('CONTRIBUTOR'),
    checkOwnership('prompt'),
    promptController.deletePrompt
);

// Moderator routes
router.post(
    '/:id/approve',
    requireAuth,
    requireRole('MODERATOR'),
    promptController.approvePrompt
);

module.exports = router;
