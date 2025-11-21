import { Router } from "express";
import {
    addGame,
    getGames,
    getGameById,
    updateGame,
    deleteGame,
} from "../controllers/game.controller.js";
import { requireAuth } from "../middleware/requireAuth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: CRUD pour gérer les jeux vidéo (requiert authentification)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - titre
 *         - genre
 *         - plateforme
 *         - editeur
 *         - developpeur
 *         - annee_sortie
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *           description: Identifiant unique généré par MongoDB
 *           example: 67027a81b57dcbf7298a0f88
 *         user:
 *           type: string
 *           readOnly: true
 *           description: ID de l'utilisateur propriétaire du jeu
 *           example: 67112a92b8d1234abc987def
 *         titre:
 *           type: string
 *           example: "The Legend of Zelda: Breath of the Wild"
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Action", "Aventure", "RPG"]
 *         plateforme:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Nintendo Switch"]
 *         editeur:
 *           type: string
 *           example: "Nintendo"
 *         developpeur:
 *           type: string
 *           example: "Nintendo EPD"
 *         annee_sortie:
 *           type: number
 *           example: 2017
 *         metacritic_score:
 *           type: number
 *           example: 97
 *         temps_jeu_heures:
 *           type: number
 *           example: 85
 *         termine:
 *           type: boolean
 *           example: true
 *         date_ajout:
 *           type: string
 *           format: date-time
 *           description: Date d'ajout du jeu
 *         date_modification:
 *           type: string
 *           format: date-time
 *           description: Dernière date de modification
 */

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Lister tous les jeux de l'utilisateur authentifié
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des jeux
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       500:
 *         description: Erreur serveur
 *
 *   post:
 *     summary: Ajouter un nouveau jeu
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - genre
 *               - plateforme
 *               - editeur
 *               - developpeur
 *               - annee_sortie
 *             properties:
 *               titre:
 *                 type: string
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               plateforme:
 *                 type: array
 *                 items:
 *                   type: string
 *               editeur:
 *                 type: string
 *               developpeur:
 *                 type: string
 *               annee_sortie:
 *                 type: number
 *               metacritic_score:
 *                 type: number
 *               temps_jeu_heures:
 *                 type: number
 *               termine:
 *                 type: boolean
 *           example:
 *             titre: "The Legend of Zelda: Breath of the Wild"
 *             genre: ["Action", "Aventure", "RPG"]
 *             plateforme: ["Nintendo Switch"]
 *             editeur: "Nintendo"
 *             developpeur: "Nintendo EPD"
 *             annee_sortie: 2017
 *             metacritic_score: 97
 *             temps_jeu_heures: 85
 *             termine: true
 *     responses:
 *       201:
 *         description: Jeu créé avec succès
 *       409:
 *         description: Jeu déjà existant
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Obtenir un jeu spécifique
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du jeu à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jeu trouvé
 *       404:
 *         description: Jeu non trouvé
 *       500:
 *         description: Erreur serveur
 *
 *   put:
 *     summary: Mettre à jour un jeu
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du jeu à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: Jeu mis à jour avec succès
 *       404:
 *         description: Jeu non trouvé
 *       500:
 *         description: Erreur serveur
 *
 *   delete:
 *     summary: Supprimer un jeu
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du jeu à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jeu supprimé avec succès
 *       404:
 *         description: Jeu non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.use(requireAuth);

router.get("/getGames", getGames);
router.get("/games/:id", getGameById);
router.post("/addGame", addGame);
router.patch("/updateGame/:id", updateGame);
router.delete("/deleteGame/:id", deleteGame);

export default router;
