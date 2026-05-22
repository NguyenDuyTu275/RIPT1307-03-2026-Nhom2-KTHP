import { generateApi } from 'swagger-typescript-api';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!globalThis.structuredClone) {
  globalThis.structuredClone = (val) => JSON.parse(JSON.stringify(val));
}

async function run() {
  try {
    console.log("Fetching Swagger documentation from Backend...");
    const response = await axios.get("http://localhost:8080/v3/api-docs");
    const swaggerSpec = response.data;

    const tempPath = path.resolve(__dirname, "./swagger-temp.json");
    fs.writeFileSync(tempPath, JSON.stringify(swaggerSpec, null, 2));
    console.log("Downloaded Swagger specification locally.");

    console.log("Generating TypeScript API Client...");
    await generateApi({
      name: "api-generated.ts",
      output: path.resolve(__dirname, "./src"),
      input: tempPath,
      httpClientType: "axios",
    });

    // Clean up temporary file
    fs.unlinkSync(tempPath);
    console.log("API generated successfully! File created at: ./src/api-generated.ts");
  } catch (error) {
    console.error("Generation failed:", error.message || error);
  }
}

run();
