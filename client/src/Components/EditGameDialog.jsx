import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    TextField,
    Button,
    Alert,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { updateGame } from "../Api/games.js";

export default function EditGameDialog({ open, onClose, onSuccess, game }) {
    const [formData, setFormData] = useState({
        titre: "",
        genre: "",
        plateforme: "",
        editeur: "",
        developpeur: "",
        annee_sortie: "",
        metacritic_score: "",
        temps_jeu_heures: "",
        termine: false,
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open && game) {
            setFormData({
                titre: game.titre || "",
                genre: Array.isArray(game.genre) ? game.genre.join(", ") : "",
                plateforme: Array.isArray(game.plateforme)
                    ? game.plateforme.join(", ")
                    : "",
                editeur: game.editeur || "",
                developpeur: game.developpeur || "",
                annee_sortie: game.annee_sortie ?? "",
                metacritic_score:
                    game.metacritic_score === null ||
                    typeof game.metacritic_score === "undefined"
                        ? ""
                        : game.metacritic_score,
                temps_jeu_heures:
                    typeof game.temps_jeu_heures === "number"
                        ? game.temps_jeu_heures
                        : "",
                termine: !!game.termine,
            });
            setErrors({});
            setServerError("");
        }
    }, [open, game]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((prev) => ({ ...prev, [name]: "" }));
        setServerError("");
    };

    const validate = () => {
        const newErrors = {};
        const currentYear = new Date().getFullYear() + 1;

        if (!formData.titre.trim()) newErrors.titre = "Title is required";
        if (!formData.genre.trim()) newErrors.genre = "At least one genre is required";
        if (!formData.plateforme.trim())
            newErrors.plateforme = "At least one platform is required";
        if (!formData.editeur.trim()) newErrors.editeur = "Publisher is required";
        if (!formData.developpeur.trim())
            newErrors.developpeur = "Developer is required";

        if (!formData.annee_sortie) {
            newErrors.annee_sortie = "Release year is required";
        } else {
            const year = Number(formData.annee_sortie);
            if (Number.isNaN(year)) {
                newErrors.annee_sortie = "Release year must be a number";
            } else if (year < 1950 || year > currentYear) {
                newErrors.annee_sortie = `Release year must be between 1950 and ${currentYear}`;
            }
        }

        if (formData.metacritic_score !== "") {
            const score = Number(formData.metacritic_score);
            if (Number.isNaN(score) || score < 0 || score > 100) {
                newErrors.metacritic_score = "Metacritic score must be between 0 and 100";
            }
        }

        if (formData.temps_jeu_heures !== "") {
            const hours = Number(formData.temps_jeu_heures);
            if (Number.isNaN(hours) || hours < 0) {
                newErrors.temps_jeu_heures = "Play time must be a positive number";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        if (!submitting) onClose?.();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) return;
        if (!game?._id) {
            setServerError("Game ID is missing");
            return;
        }

        setSubmitting(true);

        const payload = {
            titre: formData.titre.trim(),
            genre: formData.genre
                .split(",")
                .map((g) => g.trim())
                .filter(Boolean),
            plateforme: formData.plateforme
                .split(",")
                .map((p) => p.trim())
                .filter(Boolean),
            editeur: formData.editeur.trim(),
            developpeur: formData.developpeur.trim(),
            annee_sortie: Number(formData.annee_sortie),
            metacritic_score:
                formData.metacritic_score === ""
                    ? undefined
                    : Number(formData.metacritic_score),
            temps_jeu_heures:
                formData.temps_jeu_heures === ""
                    ? 0
                    : Number(formData.temps_jeu_heures),
            termine: formData.termine,
        };

        try {
            await updateGame(game._id, payload);
            onSuccess?.();
            onClose?.();
        } catch (err) {
            const data = err?.response?.data;
            if (!data) {
                setServerError("Network error, cannot connect to the server");
            } else if (data.field && data.error) {
                setErrors((prev) => ({ ...prev, [data.field]: data.error }));
            } else if (data.errors && typeof data.errors === "object") {
                setErrors((prev) => ({ ...prev, ...data.errors }));
            } else {
                const msg =
                    data.error || data.message || "Error, cannot update game";
                setServerError(msg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit game</DialogTitle>
            <DialogContent>
                <Stack
                    component="form"
                    autoComplete="off"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1, gap: 2 }}
                >
                    {serverError && (
                        <Alert severity="error" aria-live="polite">
                            {serverError}
                        </Alert>
                    )}

                    <TextField
                        label="Title"
                        name="titre"
                        value={formData.titre}
                        onChange={handleChange}
                        error={!!errors.titre}
                        helperText={errors.titre}
                        required
                    />

                    <TextField
                        label="Genre (comma separated)"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        error={!!errors.genre}
                        helperText={errors.genre}
                        required
                    />

                    <TextField
                        label="Platform (comma separated)"
                        name="plateforme"
                        value={formData.plateforme}
                        onChange={handleChange}
                        error={!!errors.plateforme}
                        helperText={errors.plateforme}
                        required
                    />

                    <TextField
                        label="Publisher"
                        name="editeur"
                        value={formData.editeur}
                        onChange={handleChange}
                        error={!!errors.editeur}
                        helperText={errors.editeur}
                        required
                    />

                    <TextField
                        label="Developer"
                        name="developpeur"
                        value={formData.developpeur}
                        onChange={handleChange}
                        error={!!errors.developpeur}
                        helperText={errors.developpeur}
                        required
                    />

                    <TextField
                        label="Release year"
                        name="annee_sortie"
                        type="number"
                        value={formData.annee_sortie}
                        onChange={handleChange}
                        error={!!errors.annee_sortie}
                        helperText={errors.annee_sortie}
                        required
                    />

                    <TextField
                        label="Metacritic score"
                        name="metacritic_score"
                        type="number"
                        value={formData.metacritic_score}
                        onChange={handleChange}
                        error={!!errors.metacritic_score}
                        helperText={errors.metacritic_score}
                        inputProps={{ min: 0, max: 100 }}
                    />

                    <TextField
                        label="Play time (hours)"
                        name="temps_jeu_heures"
                        type="number"
                        value={formData.temps_jeu_heures}
                        onChange={handleChange}
                        error={!!errors.temps_jeu_heures}
                        helperText={errors.temps_jeu_heures}
                        inputProps={{ min: 0 }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="termine"
                                checked={formData.termine}
                                onChange={handleChange}
                            />
                        }
                        label="Finished"
                    />

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                        sx={{ mt: 1, mb: 1 }}
                    >
                        <Button onClick={handleClose} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={submitting}>
                            Save
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
