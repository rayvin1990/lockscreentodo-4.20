
// Check for environment variables related to AI services
// This script needs to be run from the project root

console.log("Starting AI configuration check...");

// Check both root and apps/nextjs .env locations
const fs = require('fs');
const path = require('path');

function checkEnvFile(filePath) {
    if (fs.existsSync(filePath)) {
        console.log(`Found .env file at: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        let hasGLM = false;
        let hasParser = false;

        lines.forEach(line => {
            if (line.trim().startsWith('GLM_API_KEY=')) {
                const val = line.split('=')[1].trim();
                if (val && val.length > 0) hasGLM = true;
            }
            if (line.trim().startsWith('RESUME_PARSER_URL=')) {
                const val = line.split('=')[1].trim();
                if (val && val.length > 0) hasParser = true;
            }
        });

        console.log(`  GLM_API_KEY: ${hasGLM ? 'Set' : 'Not Set'}`);
        console.log(`  RESUME_PARSER_URL: ${hasParser ? 'Set' : 'Not Set'}`);
    } else {
        console.log(`No .env file found at: ${filePath}`);
    }
}

checkEnvFile(path.join(process.cwd(), '.env'));
checkEnvFile(path.join(process.cwd(), 'apps/nextjs/.env'));
