import React, {useState} from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    IconButton,
    InputAdornment,
    Link as MuiLink,
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import {loginUser} from "../Api/authentification.js";
import SnackbarAlert from "../Components/SnackbarAlert.jsx";

export default function Login() {
    const [formData, setFormData] = useState({email: "", password: ""});
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [snackbarAlertOpen, setSnackbarAlertOpen] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((p) => ({...p, [e.target.name]: e.target.value}));
        setErrors((p) => ({...p, [e.target.name]: ""}));
        setServerError("");
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = "Email required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.password.trim()) newErrors.password = "Password required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) return;

        try {
            const res = await loginUser(formData);
            localStorage.setItem("token", res.token);
            setSnackbarAlertOpen(true);
            setTimeout(() => navigate("/games"), 1000);
        } catch (err) {
            const data = err?.response?.data;
            if (!data) {
                setServerError("Network error, cannot connect to the server");
            } else {
                const msg = data.error || data.message || "Invalid email or password";
                setServerError(msg);
                setErrors({email: "", password: ""});
            }
        }
    };

    return (
        <Container maxWidth="xs" sx={{mt: 8}}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                autoComplete="off"
                sx={{display: "flex", flexDirection: "column", gap: 2}}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Se connecter
                </Typography>

                {serverError && <Alert severity="error" aria-live="polite">{serverError}</Alert>}

                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                />

                <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword((s) => !s)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button variant="contained" color="primary" type="submit">
                    Se connecter
                </Button>

                <Typography variant="body2" align="center">
                    Pas de compte ?{" "}
                    <MuiLink component={Link} to="/register" underline="hover">
                        Créer un compte
                    </MuiLink>
                </Typography>
            </Box>

            <SnackbarAlert
                open={snackbarAlertOpen}
                onClose={() => setSnackbarAlertOpen(false)}
                message="Logged in successfully"
                severity="success"
            />
        </Container>
    );
}