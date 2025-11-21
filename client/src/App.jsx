import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import Games from "./Pages/Games.jsx";
import PublicRoute from "./Routes/PublicRoute.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";
import Header from "./Components/Header.jsx";
import FallbackRedirect from "./Routes/FallbackRedirect.jsx";
import Stats from "./Pages/Stats.jsx";

const App = () => {
    return (
        <>
            <Header/>
            <Routes>
                <Route element={<PublicRoute/>}>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/" element={<Navigate to="/register" replace/>}/>
                </Route>

                <Route element={<PrivateRoute/>}>
                    <Route path="/games" element={<Games />}/>
                    <Route path="/stats" element={<Stats />}/>
                </Route>
                <Route path="*" element={<FallbackRedirect />}/>
            </Routes>
        </>
    )
}

export default App
