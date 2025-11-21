import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
    {
        titre: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        genre: {
            type: [String],
            required: true,
            default: [],
        },
        plateforme: {
            type: [String],
            required: true,
            default: [],
        },
        editeur: {
            type: String,
            required: true,
            trim: true,
        },
        developpeur: {
            type: String,
            required: true,
            trim: true,
        },
        annee_sortie: {
            type: Number,
            required: true,
            min: 1950,
            max: new Date().getFullYear() + 1,
        },
        metacritic_score: {
            type: Number,
            min: 0,
            max: 100,
            default: null,
        },
        temps_jeu_heures: {
            type: Number,
            min: 0,
            default: 0,
        },
        termine: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);

gameSchema.index({titre: 1, plateforme: 1}, {unique: true});

export default mongoose.model("Game", gameSchema);
