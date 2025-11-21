import { Router } from "express";
import {getCurrentUser, users} from "../controllers/user.controller.js";
import {requireAuth} from "../middleware/requireAuth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *           description: Automatically generated MongoDB user ID
 *           example: 6702845b9b47fceabc123456
 *         username:
 *           type: string
 *           description: The username of the user
 *           example: johndoe
 *         email:
 *           type: string
 *           description: The user's unique email address
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           writeOnly: true
 *           description: The user's hashed password
 *           example: $2b$10$9eZ5rP7Jj0sCtpZbq5sCneFFfSP5iC/1e0NqPY6gQUkT7hB29eGgK
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date of creation
 *           example: "2025-10-06T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *           example: "2025-10-06T11:00:00.000Z"
 */

/**
 * @swagger
 * /api/getUsers:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all registered users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Error, cannot find users
 */

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized or invalid token
 */


router.get("/getUsers", users);
router.get("/me", requireAuth, getCurrentUser);

export default router;