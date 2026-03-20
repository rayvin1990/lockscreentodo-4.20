import { appRouter } from "./packages/api/src/root.js";

console.log("=== tRPC Router Structure Check ===\n");

// Check if resume router exists
console.log("1. Checking if 'resume' router exists...");
if (appRouter._def.procedures["resume.getMasterResume"]) {
  console.log("   ✅ resume.getMasterResume exists");
  console.log("   Type:", appRouter._def.procedures["resume.getMasterResume"]._type);
} else {
  console.log("   ❌ resume.getMasterResume NOT FOUND");
}

if (appRouter._def.procedures["resume.parseResume"]) {
  console.log("   ✅ resume.parseResume exists");
  console.log("   Type:", appRouter._def.procedures["resume.parseResume"]._type);
} else {
  console.log("   ❌ resume.parseResume NOT FOUND");
}

console.log("\n2. All resume procedures:");
Object.keys(appRouter._def.procedures)
  .filter(key => key.startsWith("resume."))
  .forEach(key => {
    console.log(`   - ${key} (${appRouter._def.procedures[key]._type})`);
  });
