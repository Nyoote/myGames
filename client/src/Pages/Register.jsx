import React, {useState} from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Link as MuiLink,
    InputAdornment,
    IconButton,
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {registerUser} from "../Api/authentification.js";
import SnackbarAlert from "../Components/SnackbarAlert.jsx";

export default function Register() {
    const [formData, setFormData] = useState({username: "", email: "", password: ""});
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
        if (!formData.username.trim()) newErrors.username = "Username required";
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
            await registerUser(formData);
            setSnackbarAlertOpen(true);
            setFormData({username: "", email: "", password: ""});
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            const data = err?.response?.data;
            if (!data) {
                setServerError("Network error, cannot connect to the server");
            }
            if (data.field && data.error) {
                return setErrors((p) => ({...p, [data.field]: data.error}));
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
                    Créer un compte
                </Typography>

                {serverError && <Alert severity="error" aria-live="polite">{serverError}</Alert>}
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    required
                />

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
                    S’inscrire
                </Button>

                <Typography variant="body2" align="center">
                    Vous avez déjà un compte ?{" "}
                    <MuiLink component={Link} to="/login" underline="hover">
                        Se connecter
                    </MuiLink>
                </Typography>
            </Box>

            <SnackbarAlert
                open={snackbarAlertOpen}
                onClose={() => setSnackbarAlertOpen(false)}
                message="Account created successfully"
                severity="success"
            />
        </Container>
    );
}
