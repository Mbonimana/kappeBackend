// swagger.ts (or swagger.js if not using TypeScript)
import swaggerUI from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";

// Load the OpenAPI YAML spec
const openapiPath = path.join(__dirname, "openapi.yaml");
const swaggerSpec = yaml.load(fs.readFileSync(openapiPath, "utf8")) as Record<string, any>;

export { swaggerSpec, swaggerUI };
