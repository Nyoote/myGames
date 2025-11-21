import {useEffect, useState} from "react";
import {
    Container, Typography, Button, Table, TableHead, TableRow, TableCell,
    TableBody, Paper, IconButton, Alert, Stack, Tooltip, TextField
} from "@mui/material";
import {Edit, Delete, Add, Search} from "@mui/icons-material";
import {deleteGame, fetchGames, toggleFavoriteGame} from "../Api/games.js";
import SnackbarAlert from "../Components/SnackbarAlert.jsx";
import AddGameDialog from "../Components/AddGameDialog.jsx";
import ConfirmDeleteDialog from "../Components/ConfirmDeleteDialog.jsx";
import EditGameDialog from "../Components/EditGameDialog.jsx";
import {Star, StarBorder} from "@mui/icons-material";
import {FormControlLabel, Checkbox} from "@mui/material";

export default function Games() {
    const [games, setGames] = useState([]);
    const [error, setError] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [snack, setSnack] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [editGame, setEditGame] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

    const [filters, setFilters] = useState({
        titre: "",
        genre: "",
        plateforme: "",
        favori: false,
    });

    const loadGames = async (overrideFilters = null) => {
        setError("");

        const activeFilters = overrideFilters ?? filters;

        const cleaned = {};
        if (activeFilters.titre?.trim()) cleaned.titre = activeFilters.titre.trim();
        if (activeFilters.genre?.trim()) cleaned.genre = activeFilters.genre.trim();
        if (activeFilters.plateforme?.trim()) cleaned.plateforme = activeFilters.plateforme.trim();
        if (activeFilters.favori) cleaned.favori = "true";

        try {
            const data = await fetchGames(cleaned);
            setGames(data);
        } catch (e) {
            setError(e?.response?.data?.message || "Unable to load games");
        }
    };

    useEffect(() => {
        loadGames();
    }, []);

    const handleAdded = async () => {
        await loadGames({});
        setSnack({message: "Game added successfully", severity: "success"});
    };

    const openEditDialog = (game) => {
        setEditGame(game);
        setOpenEdit(true);
    };

    const handleEdited = async () => {
        await loadGames();
        setSnack({message: "Game updated successfully", severity: "success"});
    };

    const askDelete = (game) => {
        setSelectedGame(game);
        setOpenDelete(true);
    };

    const confirmDelete = async () => {
        if (!selectedGame) return;
        try {
            await deleteGame(selectedGame._id);
            setOpenDelete(false);
            setSelectedGame(null);
            await loadGames();
            setSnack({message: "Game deleted successfully", severity: "success"});
        } catch (e) {
            setOpenDelete(false);
            setSelectedGame(null);
            setSnack({
                message: e?.response?.data?.message || "Error while deleting game",
                severity: "error",
            });
        }
    };

    const handleFilterChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        await loadGames(filters);
    };

    const handleResetFilters = async () => {
        const empty = {titre: "", genre: "", plateforme: "", favori: false};
        setFilters(empty);
        await loadGames(empty);
    };

    const handleToggleFavorite = async (game) => {
        try {
            await toggleFavoriteGame(game._id);
            await loadGames();
        } catch (e) {
            setSnack({
                message: "Error while toggling favorite",
                severity: "error",
            });
        }
    };


    return (
        <Container maxWidth="md" sx={{mt: 4, mb: 6}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
                <Typography variant="h5">My Games</Typography>
                <Button variant="contained" startIcon={<Add/>} onClick={() => setOpenAdd(true)}>
                    Add Game
                </Button>
            </Stack>

            <Paper variant="outlined" sx={{p: 2, mb: 2}}>
                <form onSubmit={handleSearchSubmit}>
                    <Stack
                        direction={{xs: "column", sm: "row"}}
                        spacing={2}
                        alignItems={{xs: "stretch", sm: "flex-end"}}
                    >
                        <TextField
                            label="Title"
                            name="titre"
                            value={filters.titre}
                            onChange={handleFilterChange}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="Genre"
                            name="genre"
                            value={filters.genre}
                            onChange={handleFilterChange}
                            size="small"
                            fullWidth
                            placeholder="e.g. RPG"
                        />
                        <TextField
                            label="Platform"
                            name="plateforme"
                            value={filters.plateforme}
                            onChange={handleFilterChange}
                            size="small"
                            fullWidth
                            placeholder="e.g. PC"
                        />

                        <Stack direction="row" spacing={1} alignItems="center">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="favori"
                                        checked={filters.favori}
                                        onChange={handleFilterChange}
                                        size="small"
                                    />
                                }
                                label="Favorites only"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Search/>}
                            >
                                Search
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={handleResetFilters}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Paper>

            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

            <Paper variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Titre</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Plateforme</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {games.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Alert severity="info">No games found</Alert>
                                </TableCell>
                            </TableRow>
                        ) : (
                            games.map((g) => (
                                <TableRow key={g._id} hover>
                                    <TableCell>{g.titre}</TableCell>
                                    <TableCell>
                                        {Array.isArray(g.genre) ? g.genre.join(", ") : g.genre}
                                    </TableCell>
                                    <TableCell>
                                        {Array.isArray(g.plateforme)
                                            ? g.plateforme.join(", ")
                                            : g.plateforme}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <span>
                                                <IconButton size="small" onClick={() => openEditDialog(g)}>
                                                    <Edit fontSize="small"/>
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <span>
                                                <IconButton size="small" color="error" onClick={() => askDelete(g)}>
                                                    <Delete fontSize="small"/>
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title={g.favori ? "Remove from favorites" : "Add to favorites"}>
                                            <span>
                                                <IconButton size="small" onClick={() => handleToggleFavorite(g)}>
                                                    {g.favori ? (
                                                        <Star color="warning" fontSize="small"/>
                                                    ) : (
                                                        <StarBorder fontSize="small"/>
                                                    )}
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <AddGameDialog
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSuccess={handleAdded}
            />

            <EditGameDialog
                open={openEdit}
                onClose={() => {
                    setOpenEdit(false);
                    setEditGame(null);
                }}
                onSuccess={handleEdited}
                game={editGame}
            />

            <ConfirmDeleteDialog
                open={openDelete}
                onClose={() => {
                    setOpenDelete(false);
                    setSelectedGame(null);
                }}
                onConfirm={confirmDelete}
                game={selectedGame}
            />

            <SnackbarAlert
                open={!!snack}
                onClose={() => setSnack(null)}
                message={snack?.message}
                severity={snack?.severity || "success"}
            />
        </Container>
    );
}
