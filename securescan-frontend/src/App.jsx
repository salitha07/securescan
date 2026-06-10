import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Results from "./pages/Results";
import History from "./pages/History";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (


        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Login/>} />

                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

                <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />

                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;