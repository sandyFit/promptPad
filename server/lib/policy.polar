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
