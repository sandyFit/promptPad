const oso = require("../lib/authorization");

const authorize = (action, getResource) => {
    return async (req, res, next) => {
        const user = req.user; // Set by your `requireAuth` middleware
        const resource = await getResource(req);

        const isAllowed = await oso.isAllowed(user, action, resource);
        if (!isAllowed) {
            return res.status(403).json({ error: "Forbidden" });
        }

        next();
    };
};

module.exports = authorize;
