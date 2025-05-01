const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');


router.post(
    '/tags',
    requireAuth,
    tagController.createTag
);

// Tag suggestion routes
router.post(
    '/tag-suggestions',
    requireAuth,
    tagController.createTagSuggestion
);

router.put(
    '/tag-suggestions/:id',
    requireAuth,
    tagController.updateTagSuggestion
);

router.get(
    '/tag-suggestions',
    requireAuth,
    tagController.getAllTagSuggestions
);

router.get(
    '/tag-suggestions/:id',
    requireAuth,
    tagController.getTagSuggestionById
);

module.exports = router;
