import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-black/20 backdrop-blur-md absolute top-0 left-0 w-full z-50 text-white p-4 border-b border-white/10">

            <div className="max-w-6xl mx-auto flex justify-between items-center">

                <h1 className="text-2xl font-bold">
                    SecureScan
                </h1>

                <div className="flex gap-6 items-center">

                    <Link
                        to="/home"
                        className="hover:text-blue-400"
                    >
                        Home
                    </Link>

                    <Link
                        to="/history"
                        className="hover:text-blue-400"
                    >
                        History
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;