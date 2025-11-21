import {AppBar, Toolbar, Typography, Button, Box} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../Hooks/useAuthentification.js";
import {useEffect, useState} from "react";
import {getCurrentUser} from "../Api/authentification.js";

export default function Header() {
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();
    const [username, setUsername] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            getCurrentUser()
                .then((data) => setUsername(data.username))
                .catch(() => setUsername(""));
        }
    });

    if (!isAuthenticated) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <AppBar position="static" color="primary" sx={{mb: 3}}>
            <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
                <Box>
                    <Typography variant="h6">{username}</Typography>
                </Box>
                <Button variant="outlined" color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
}
