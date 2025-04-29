const { Permit } = require("@permitio/permit");
require("dotenv").config();

const permit = new Permit({
    pdp: "https://cloudpdp.api.permit.io", 
    token: process.env.PERMIT_API_KEY, 
    debug: process.env.NODE_ENV !== "production",
});

module.exports = permit;
