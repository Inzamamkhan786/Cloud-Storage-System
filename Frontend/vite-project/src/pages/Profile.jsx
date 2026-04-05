import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { FaUser, FaEnvelope, FaDatabase, FaSun } from "react-icons/fa";

function Profile() {

    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(false);

    const [user, setUser] = useState({
        name: "",
        email: "",
        plan: "Basic"
    });

    const toggleMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {

        try {

            const res = await API.get("/user/profile");

            console.log(res.data);

            setUser(res.data);

        } catch (err) {
            console.log(err);
        }

    };

    const cardStyle = darkMode
        ? "bg-[#393E46] text-white"
        : "bg-white text-black";

    return (

        <div className={darkMode ? "flex min-h-screen bg-[#222831] text-white" : "flex min-h-screen bg-gray-100 text-black"}>

            {/* Sidebar */}

            <div className={darkMode ? "w-64 bg-[#393E46] p-6 text-white" : "w-64 bg-white shadow-lg p-6 text-black"}>

                <div className="flex justify-between items-center mb-10">

                    <h1 className="text-2xl font-bold text-[#00ADB5]">
                        CloudDrive
                    </h1>

                    <FaSun
                        className="cursor-pointer hover:rotate-180 transition duration-500"
                        onClick={toggleMode}
                    />

                </div>

                <nav className="flex flex-col gap-3">

                    <button
                        className="p-3 rounded-lg bg-[#00ADB5] text-white text-left"
                    >
                        Profile
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-3 rounded-lg hover:bg-[#00ADB5] hover:text-white text-left"
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/files")}
                        className="p-3 rounded-lg hover:bg-[#00ADB5] hover:text-white text-left"
                    >
                        Files
                    </button>

                    <button
                        onClick={() => navigate("/billing")}
                        className="p-3 rounded-lg hover:bg-[#00ADB5] hover:text-white text-left"
                    >
                        Billing
                    </button>

                    <button
                        onClick={() => navigate("/recycle-bin")}
                        className="p-3 rounded-lg hover:bg-[#00ADB5] hover:text-white text-left"
                    >
                        Recycle Bin
                    </button>

                    

                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                        }}
                        className="p-3 rounded-lg hover:bg-red-500 hover:text-white text-left"
                    >
                        Logout
                    </button>

                </nav>

            </div>


            {/* Main Content */}

            <div className="flex-1 p-10">

                <h1 className="text-3xl font-bold mb-8">
                    Profile
                </h1>


                <div className="grid md:grid-cols-3 gap-6">

                    {/* Name */}

                    <div className={`${cardStyle} p-6 rounded-xl shadow-lg flex items-center gap-4`}>

                        <FaUser className="text-3xl text-[#00ADB5]" />

                        <div>
                            <p className="text-sm">Name</p>
                            <p className="text-2xl font-bold text-[#00ADB5]">
                                {user.name || "Loading..."}
                            </p>
                        </div>

                    </div>


                    {/* Email */}

                    <div className={`${cardStyle} p-6 rounded-xl shadow-lg flex items-center gap-4`}>

                        <FaEnvelope className="text-3xl text-[#00ADB5]" />

                        <div>
                            <p className="text-sm">Email</p>
                            <p className="text-2xl font-bold text-[#00ADB5]">
                                {user.email || "Loading..."}
                            </p>
                        </div>

                    </div>


                    {/* Plan */}

                    <div className={`${cardStyle} p-6 rounded-xl shadow-lg flex items-center gap-4`}>

                        <FaDatabase className="text-3xl text-[#00ADB5]" />

                        <div>
                            <p className="text-sm">Plan</p>
                            <p className="text-2xl font-bold text-[#00ADB5]">
                                {user.plan}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Profile;