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
    promptController.createTagSuggestion
);

router.put(
    '/tag-suggestions/:id',
    requireAuth,
    promptController.updateTagSuggestion
);
