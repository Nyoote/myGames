import Game from "../models/game-schema.model.js";

export const getGames = async (req, res) => {
    try {
        const {
            titre,
            genre,
            plateforme,
            termine,
            annee_min,
            annee_max,
        } = req.query;

        const filter = {};

        if (titre) {
            filter.titre = { $regex: titre, $options: "i" };
        }

        if (genre) {
            filter.genre = { $regex: genre, $options: "i" };
        }

        if (plateforme) {
            filter.plateforme = { $regex: plateforme, $options: "i" };
        }

        if (typeof termine !== "undefined") {
            if (termine === "true") filter.termine = true;
            else if (termine === "false") filter.termine = false;
        }

        if (annee_min || annee_max) {
            filter.annee_sortie = {};
            if (annee_min) filter.annee_sortie.$gte = Number(annee_min);
            if (annee_max) filter.annee_sortie.$lte = Number(annee_max);
        }

        const games = await Game.find(filter).sort({ createdAt: -1 });
        res.status(200).json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error, cannot find games" });
    }
};

export const getGameById = async (req, res) => {
    const { id } = req.params;

    try {
        const game = await Game.findById(id);

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        res.status(200).json(game);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching game",
            error: error.message,
        });
    }
};


export const addGame = async (req, res) => {
    const {
        titre,
        genre,
        plateforme,
        editeur,
        developpeur,
        annee_sortie,
        metacritic_score,
        temps_jeu_heures,
        termine,
    } = req.body;

    try {
        const existingGame = await Game.findOne({ titre, plateforme });
        if (existingGame) {
            return res
                .status(409)
                .json({ field: "titre", error: "Game already exists for this platform" });
        }

        const newGame = new Game({
            titre,
            genre,
            plateforme,
            editeur,
            developpeur,
            annee_sortie,
            metacritic_score,
            temps_jeu_heures,
            termine,
        });

        await newGame.save();

        res.status(201).json({ message: "Game created successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

export const updateGame = async (req, res) => {
    const { id } = req.params;
    const {
        titre,
        genre,
        plateforme,
        editeur,
        developpeur,
        annee_sortie,
        metacritic_score,
        temps_jeu_heures,
        termine,
    } = req.body;

    try {
        const game = await Game.findOne({ _id: id });

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        if (typeof titre !== "undefined") game.titre = titre;
        if (typeof genre !== "undefined") game.genre = genre;
        if (typeof plateforme !== "undefined") game.plateforme = plateforme;
        if (typeof editeur !== "undefined") game.editeur = editeur;
        if (typeof developpeur !== "undefined") game.developpeur = developpeur;
        if (typeof annee_sortie !== "undefined") game.annee_sortie = annee_sortie;
        if (typeof metacritic_score !== "undefined") game.metacritic_score = metacritic_score;
        if (typeof temps_jeu_heures !== "undefined") game.temps_jeu_heures = temps_jeu_heures;
        if (typeof termine !== "undefined") game.termine = termine;

        if (typeof titre !== "undefined" || typeof plateforme !== "undefined") {
            const existingGame = await Game.findOne({
                _id: { $ne: id },
                titre: game.titre,
                plateforme: game.plateforme,
            });

            if (existingGame) {
                return res
                    .status(409)
                    .json({
                        field: "titre",
                        error: "Game with this title and platform already exists",
                    });
            }
        }

        const updatedGame = await game.save();

        res.status(200).json({
            message: "Game updated successfully",
            game: updatedGame,
        });
    } catch (error) {
        console.error(error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation error while updating game",
                error: error.message,
                errors: error.errors,
            });
        }

        res.status(500).json({
            message: "Error updating game",
            error: error.message,
        });
    }
};

export const deleteGame = async (req, res) => {
    const { id } = req.params;

    try {
        const game = await Game.findOneAndDelete({ _id: id });

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        res.status(200).json({
            message: "Game deleted successfully",
            game,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error deleting game",
            error: error.message,
        });
    }
};
