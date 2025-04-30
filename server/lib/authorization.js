import { Oso } from "oso";
import { Prompt, User } from "@prisma/client"; 

const oso = new Oso();

await oso.registerClass(User);
await oso.registerClass(Prompt);

// Load your .polar policy
await oso.loadFiles(["./lib/policy.polar"]);

export default oso;
