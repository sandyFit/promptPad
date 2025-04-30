const permit = require('./permitClient');

async function setupPermitRoles() {
    console.log('Setting up Permit.io roles and permissions...');

    try {
        // Define the resources
        const resources = [
            { key: 'prompt', name: 'Prompt', description: 'User prompts' },
            { key: 'tag', name: 'Tag', description: 'Tags for prompts' },
            { key: 'tagSuggestion', name: 'Tag Suggestion', description: 'Suggestions for new tags' },
            { key: 'approval', name: 'Approval', description: 'Prompt approval workflow' },
            { key: 'user', name: 'User', description: 'User accounts' },
            { key: 'favorite', name: 'Favorite', description: 'User favorites' },
            { key: 'nsfwQueue', name: 'NSFW Queue', description: 'Pending prompts marked as NSFW' },
        ];

        for (const resource of resources) {
            await permit.api.resources.create({
                key: resource.key,
                name: resource.name,
                description: resource.description,
                actions: [
                    { key: 'create', name: 'Create' },
                    { key: 'read', name: 'Read' },
                    { key: 'update', name: 'Update' },
                    { key: 'delete', name: 'Delete' },
                    { key: 'review', name: 'Review' },
                    { key: 'approve', name: 'Approve' },
                    { key: 'reject', name: 'Reject' },
                    { key: 'list', name: 'List' },
                    { key: 'favorite', name: 'Favorite' },
                    { key: 'unfavorite', name: 'Unfavorite' },
                    { key: 'suggest', name: 'Suggest' },
                    { key: 'approveSuggestion', name: 'Approve Suggestion' },
                    { key: 'rejectSuggestion', name: 'Reject Suggestion' }
                ]
            });
        }

        // Define roles with their permissions
        const roles = [
            {
                key: 'viewer',
                name: 'Viewer',
                description: 'Can view and favorite published community prompts',
                permissions: [
                    { resource: 'prompt', action: 'read', condition: 'resource.tag != "NSFW"' },
                    { resource: 'tag', action: 'read' },
                    { resource: 'favorite', action: 'create' },
                    { resource: 'favorite', action: 'delete', condition: 'resource.ownerId == user.id' },
                ]
            },
            {
                key: 'contributor',
                name: 'Contributor',
                description: 'Can create and edit own prompts, can favorite community prompts, can suggest tags',
                permissions: [
                    { resource: 'prompt', action: 'create' },
                    { resource: 'prompt', action: 'read', condition: 'resource.ownerId == user.id || resource.tag != "NSFW"' },
                    { resource: 'prompt', action: 'update', condition: 'resource.ownerId == user.id && !(resource.tag == "NSFW")' },
                    { resource: 'prompt', action: 'delete', condition: 'resource.ownerId == user.id' },
                    { resource: 'tag', action: 'read' },
                    { resource: 'tagSuggestion', action: 'create' },
                    { resource: 'tagSuggestion', action: 'read' },
                    { resource: 'tagSuggestion', action: 'update', condition: 'resource.ownerId == user.id' },
                    { resource: 'tagSuggestion', action: 'delete', condition: 'resource.ownerId == user.id' },
                    { resource: 'approval', action: 'read', condition: 'resource.ownerId == user.id' },
                    { resource: 'favorite', action: 'create' },
                    { resource: 'favorite', action: 'read' },
                    { resource: 'favorite', action: 'update', condition: 'resource.ownerId == user.id' },
                    { resource: 'favorite', action: 'delete', condition: 'resource.ownerId == user.id' }
                ]
            },
            {
                key: 'moderator',
                name: 'Moderator',
                description: 'Can manage prompts and tags (approve, edit, delete), can favorite community prompts',
                permissions: [
                    { resource: 'prompt', action: 'read', condition: 'resource.tag != "NSFW"' },
                    { resource: 'prompt', action: 'update' },
                    { resource: 'tag', action: 'create' },
                    { resource: 'tag', action: 'read' },
                    { resource: 'tag', action: 'update' },
                    { resource: 'tagSuggestion', action: 'read' },
                    { resource: 'tagSuggestion', action: 'update' },
                    { resource: 'approval', action: 'create' },
                    { resource: 'approval', action: 'read' },
                    { resource: 'approval', action: 'update' },
                    { resource: 'favorite', action: 'create' },
                    { resource: 'favorite', action: 'read' },
                    { resource: 'favorite', action: 'delete' },
                ]
            },
            {
                key: 'admin',
                name: 'Admin',
                description: 'Has full access to all resources',
                permissions: [
                    { resource: 'prompt', action: 'create' },
                    { resource: 'prompt', action: 'read' },
                    { resource: 'prompt', action: 'update' },
                    { resource: 'prompt', action: 'delete' },
                    { resource: 'tag', action: 'create' },
                    { resource: 'tag', action: 'read' },
                    { resource: 'tag', action: 'update' },
                    { resource: 'tag', action: 'delete' },
                    { resource: 'tagSuggestion', action: 'create' },
                    { resource: 'tagSuggestion', action: 'read' },
                    { resource: 'tagSuggestion', action: 'update' },
                    { resource: 'tagSuggestion', action: 'delete' },
                    { resource: 'approval', action: 'create' },
                    { resource: 'approval', action: 'read' },
                    { resource: 'approval', action: 'update' },
                    { resource: 'approval', action: 'delete' },
                    { resource: 'user', action: 'create' },
                    { resource: 'user', action: 'read' },
                    { resource: 'user', action: 'update' },
                    { resource: 'user', action: 'delete' },
                    { resource: 'favorite', action: 'create' },
                    { resource: 'favorite', action: 'read' },
                    { resource: 'favorite', action: 'update' },
                    { resource: 'favorite', action: 'delete' },
                    { resource: 'nsfwQueue', action: 'review', condition: 'Date.now() - resource.createdAt < 172800000' },
                    { resource: 'nsfwQueue', action: 'approve' },
                    { resource: 'nsfwQueue', action: 'reject' }
                ]
            }
        ];

        for (const role of roles) {
            await permit.api.roles.create({
                key: role.key,
                name: role.name,
                description: role.description
            });

            for (const permission of role.permissions) {
                await permit.api.roles.assignPermissions(role.key, {
                    resource: permission.resource,
                    action: permission.action,
                    condition: permission.condition || undefined
                });
            }
        }

        console.log('✅ Successfully set up Permit.io roles and permissions!');
    } catch (error) {
        console.error('❌ Error setting up Permit.io:', error);
    }
}

setupPermitRoles()
    .then(() => console.log('🚀 Setup complete!'))
    .catch(err => console.error('⚠️ Setup failed:', err));
