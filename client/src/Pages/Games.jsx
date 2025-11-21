import {useEffect, useState} from "react";
import {
    Container, Typography, Button, Table, TableHead, TableRow, TableCell,
    TableBody, Paper, IconButton, Alert, Stack, Tooltip
} from "@mui/material";
import {Edit, Delete, Add} from "@mui/icons-material";
import {deleteGame, fetchGames} from "../Api/games.js";
import SnackbarAlert from "../Components/SnackbarAlert.jsx";
import AddGameDialog from "../Components/AddGameDialog.jsx";
import ConfirmDeleteDialog from "../Components/ConfirmDeleteDialog.jsx";
import EditGameDialog from "../Components/EditGameDialog.jsx";

export default function Games() {
    const [games, setGames] = useState([]);
    const [error, setError] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [snack, setSnack] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [editGame, setEditGame] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

    const loadGames = async () => {
        setError("");
        try {
            const data = await fetchGames();
            setGames(data);
            console.log(data);
        } catch (e) {
            setError(e?.response?.data?.message || "Unable to load games");
        }
    };

    useEffect(() => {
        loadGames();
    }, []);

    const handleAdded = async () => {
        await loadGames();
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

    return (
        <Container maxWidth="md" sx={{mt: 4, mb: 6}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
                <Typography variant="h5">My Games</Typography>
                <Button variant="contained" startIcon={<Add/>} onClick={() => setOpenAdd(true)}>
                    Add Game
                </Button>
            </Stack>

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
                                    <Alert severity="info">No games yet</Alert>
                                </TableCell>
                            </TableRow>
                        ) : (
                            games.map((g) => (
                                <TableRow key={g._id} hover>
                                    <TableCell>{g.titre}</TableCell>
                                    <TableCell>{g.genre}</TableCell>
                                    <TableCell>{g.plateforme}</TableCell>
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
