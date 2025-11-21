import { Router } from "express";
import {helloWorld} from "../controllers/defaultApp.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Default
 *   description: Basic test route for API availability
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a simple Hello World message
 *     tags: [Default]
 *     responses:
 *       200:
 *         description: Successful response with greeting message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Hello World!"
 */

router.get("/", helloWorld);

export default router;