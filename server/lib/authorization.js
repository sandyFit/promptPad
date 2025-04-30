const { Oso } = require("oso");
const path = require("path");

const oso = new Oso();

(async () => {
    await oso.loadFiles([path.join(__dirname, "policy.polar")]);
})();

module.exports = oso;
