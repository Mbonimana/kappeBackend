"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUI = exports.swaggerSpec = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUI = swagger_ui_express_1.default;
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load the OpenAPI YAML spec
const openapiPath = path_1.default.join(__dirname, "openapi.yaml");
const swaggerSpec = js_yaml_1.default.load(fs_1.default.readFileSync(openapiPath, "utf8"));
exports.swaggerSpec = swaggerSpec;
