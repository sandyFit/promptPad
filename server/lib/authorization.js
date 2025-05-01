// lib/authorization.js
const { Oso } = require('oso');
const oso = new Oso();

// Load classes for type checking
class User {
    constructor(data) {
        this.id = data.id;
        this.role = data.role;
        // Include other necessary fields here
    }
}

class Prompt {
    constructor(data) {
        this.id = data.id;
        this.contributorId = data.contributorId;
        this.isPublished = data.isPublished;
        this.contributor = data.contributor;
    }
}

// Register classes with OSO
oso.registerClass(User);
oso.registerClass(Prompt);

// Load policy file
const policyRules = `
# Base role permissions
has_permission(user: User, "read") if user.role in ["VIEWER", "CONTRIBUTOR", "MODERATOR", "ADMIN"];
has_permission(user: User, "create") if user.role in ["CONTRIBUTOR", "MODERATOR", "ADMIN"];
has_permission(user: User, "moderate") if user.role in ["MODERATOR", "ADMIN"];

# Prompt-specific permissions
# Contributors: own prompts only
allow(user: User, action, prompt: Prompt) if
    action in ["edit", "delete"] and
    user.role = "CONTRIBUTOR" and
    prompt.contributorId = user.id;

# Moderators: all prompts except admin's
allow(user: User, action, prompt: Prompt) if
    action in ["edit", "delete", "moderate"] and
    user.role = "MODERATOR" and
    prompt.contributor.role != "ADMIN";

# Admins: full access
allow(user: User, action, prompt: Prompt) if
    user.role = "ADMIN";

# Public access for published prompts
allow(user: User, "read", prompt: Prompt) if
    prompt.isPublished = true or
    prompt.contributorId = user.id;
`;

oso.loadStr(policyRules);

/**
 * Check if user is allowed to perform action on resource
 * @param {Object} user - User object from request
 * @param {String} action - Action being performed
 * @param {Object} resource - Resource being accessed
 * @returns {Promise<boolean>} - Whether action is allowed
 */
async function isAllowed(user, action, resource) {
    if (!user) return false;

    try {
        // Convert plain objects to class instances if needed
        const userObj = user instanceof User ? user : new User(user);

        // If checking general permission without specific resource
        if (!resource) {
            return await oso.isAllowed(userObj, action);
        }

        // Convert resource to appropriate class instance
        let resourceObj;
        if (resource.constructor.name === 'Prompt' || resource.title !== undefined) {
            resourceObj = resource instanceof Prompt ? resource : new Prompt(resource);
        } else {
            resourceObj = resource; // Use as-is for other resource types
        }

        return await oso.isAllowed(userObj, action, resourceObj);
    } catch (error) {
        console.error('Authorization error:', error);
        return false;
    }
}

module.exports = { oso, isAllowed };
