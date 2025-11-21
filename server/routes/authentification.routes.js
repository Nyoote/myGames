import { Router } from "express";
import { register, login } from "../controllers/authentification.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
     *               - password
     *             properties:
     *               username:
     *                 type: string
     *                 example: johndoe
     *               email:
     *                 type: string
     *                 example: johndoe@example.com
     *               password:
     *                 type: string
     *                 example: strongpassword123
     *     responses:
     *       201:
     *         description: User created successfully
     *       400:
     *         description: User already exists or invalid data
     */

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login a user and receive a JWT token
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 example: johndoe@example.com
     *               password:
     *                 type: string
     *                 example: strongpassword123
     *     responses:
     *       200:
     *         description: Login successful, returns JWT token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Login successful
     *                 token:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *       400:
     *         description: Invalid email or password
     *       500:
     *         description: Server error
     */

router.post("/register", register);
router.post("/login", login);

export default router;
