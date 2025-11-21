import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Alert
} from "@mui/material";
import { fetchStats } from "../Api/games.js";

export default function Stats() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchStats();
                setStats(data);
            } catch (e) {
                setError(e?.response?.data?.message || "Unable to load stats");
            }
        };

        loadStats();
    }, []);

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Game Statistics
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!stats ? (
                <Alert severity="info">Loading statistics...</Alert>
            ) : (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Stat</strong></TableCell>
                                <TableCell><strong>Value</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <TableRow>
                                <TableCell>Total Games</TableCell>
                                <TableCell>{stats.totalGames}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Finished Games</TableCell>
                                <TableCell>{stats.finishedGames}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Unfinished Games</TableCell>
                                <TableCell>{stats.unfinishedGames}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Total Playtime</TableCell>
                                <TableCell>{stats.totalPlaytime} h</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Average Metacritic</TableCell>
                                <TableCell>
                                    {stats.avgMetacritic ?? "N/A"}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Favorite Games</TableCell>
                                <TableCell>{stats.favoriteCount}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Container>
    );
}
