import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Results from "./pages/Results";
import History from "./pages/History";
import Register from "./pages/Register.jsx";

function App() {

    return (

        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Login/>} />

                <Route path="/home" element={<Home />} />

                <Route path="/results" element={<Results />} />

                <Route path="/history" element={<History />} />
                <Route path="/register" element={<Register />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;