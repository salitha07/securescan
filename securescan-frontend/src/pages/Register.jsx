import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/bg2.jpg";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8080/auth/register",
                {
                    name,
                    email,
                    password
                }
            );

            alert(response.data);

            navigate("/home");

        } catch (error) {

            console.error(error);
            alert("Registration failed");
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
                            Create Account
                        </h1>

                        <p className="text-gray-300 mt-2">
                            Join SecureScan
                        </p>

                    </div>

                    <form onSubmit={handleRegister}>

                        <div className="mb-4">

                            <label className="block text-gray-200 mb-2">
                                Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="block text-gray-200 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                                required
                            />

                        </div>

                        <div className="mb-6">

                            <label className="block text-gray-200 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 transition p-3 rounded-lg text-white font-semibold"
                        >
                            Register
                        </button>

                    </form>

                    <div className="text-center mt-6">

                        <p className="text-gray-300">
                            Already have an account?
                        </p>

                        <Link
                            to="/login"
                            className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                            Sign In
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;