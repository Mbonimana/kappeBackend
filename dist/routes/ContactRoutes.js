"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ContactController_1 = require("../controllers/ContactController");
const contactRouter = (0, express_1.default)();
contactRouter.post('/createContact', ContactController_1.createContact);
exports.default = contactRouter;
