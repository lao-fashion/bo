import * as fs from 'fs';
import * as path from 'path';

function loadEnv(mode: string): Record<string, string> {
    // Determine the correct .env file based on the mode
    const envFilePath = path.resolve(__dirname, `.env.${mode}`);

    if (!fs.existsSync(envFilePath)) {
        throw new Error(`Environment file not found: ${envFilePath}`);
    }

    const envFileContents = fs.readFileSync(envFilePath, 'utf8');
    const lines = envFileContents.split('\n');
    const envVars: Record<string, string> = {};

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            const [key, value] = trimmedLine.split('=');
            envVars[key] = value;
        }
    }

    return envVars;
}

export default loadEnv;