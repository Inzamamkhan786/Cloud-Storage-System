import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {

        try {

            const res = await API.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");

        } catch (err) {

            alert("Invalid credentials");

        }

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-[#222831] px-4">

            <div className="w-full max-w-md bg-[#393E46] p-8 rounded-xl shadow-2xl">

                <h1 className="text-3xl font-bold text-center text-[#EEEEEE] mb-8">
                    Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg mb-4 bg-[#EEEEEE] text-[#222831] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg mb-6 bg-[#EEEEEE] text-[#222831] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-[#00ADB5] text-white py-3 rounded-lg font-semibold hover:bg-[#019ca3] transition duration-200"
                >
                    Login
                </button>

                <p className="text-center text-[#EEEEEE] mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-[#00ADB5] hover:underline"
                    >
                        Signup
                    </Link>
                </p>

            </div>

        </div>

    );
}

export default Login;