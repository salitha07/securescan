import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/bg2.jpg";


function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:8080/auth/login",
                {
                    email,
                    password
                }
            );

            setError("");

            navigate("/");

        } catch (err) {

            setError(
                err.response?.data || "Login failed"
            );
        }


    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url(${bgImage})`
            }}
        >
            <div className="absolute inset-0 bg-black/70"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white">
                            SecureScan
                        </h1>

                        <p className="text-gray-300 mt-2">
                            Vulnerability Scanner Platform
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>

                        <div className="mb-5">
                            <label className="block text-gray-200 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2
                                ${
                                    error
                                        ? "border border-red-500 focus:ring-red-500"
                                        : "border border-white/20 focus:ring-blue-500"
                                }`}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-200 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2
                                ${
                                    error
                                        ? "border border-red-500 focus:ring-red-500"
                                        : "border border-white/20 focus:ring-blue-500"
                                }`}
                            />
                        </div>

                        {error && (
                            <div className="mb-4 bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white font-semibold"
                        >
                            Sign In
                        </button>

                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-300">
                            Don't have an account?
                        </p>

                        <Link
                            to="/register"
                            className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                            Create Account
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;