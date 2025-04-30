# Roles
allow(user: User, "read", prompt: Prompt) if true;

allow(user: User, "favorite", prompt: Prompt) if true;

# Contributor can create/edit/delete their own prompts
allow(user: User, action, prompt: Prompt) if
    action in ["create", "edit", "delete"] and
    user.role = "CONTRIBUTOR" and
    prompt.author_id = user.id;

# Contributors can become moderators after 20 approved prompts
allow(user: User, "moderate", prompt: Prompt) if
    user.role = "CONTRIBUTOR" and
    user.approved_prompt_count >= 20;

# Moderators can moderate regular prompts
allow(user: User, "moderate", prompt: Prompt) if
    user.role = "MODERATOR" and
    prompt.is_nsfw = false;

# Admin can moderate any prompt
allow(user: User, "moderate", prompt: Prompt) if
    user.role = "ADMIN";

# Only admin can approve NSFW prompts
allow(user: User, "approve", prompt: Prompt) if
    user.role = "ADMIN" and
    prompt.is_nsfw = true;
