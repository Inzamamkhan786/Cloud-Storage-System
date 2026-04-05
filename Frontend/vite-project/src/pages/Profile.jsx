import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { FaUser, FaEnvelope, FaDatabase, FaSun } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Profile() {

    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(false);
    const [fileStats, setFileStats] = useState([]);

    const [user, setUser] = useState({
        name: "",
        email: "",
        plan: "Basic"
    });

    const [usage, setUsage] = useState({
        storageUsed: 0,
        files: 0,
        plan: "Basic"
    });

    const token = localStorage.getItem("token");

    const MAX_STORAGE = 5; // 5GB (Basic plan)

    const COLORS = ["#00ADB5", "#FF6B6B", "#FFD93D", "#6BCB77"];

    const toggleMode = () => {
        setDarkMode(!darkMode);
    };

    const fetchUsage = async () => {

        try {

            const res = await API.get("/billing/usage", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Usage response:", res.data);

            const data = res.data;

            setUsage({
                storageUsed: parseFloat(data.storageUsed) || 0,
                files: parseInt(data.files) || 0,
                plan: data.plan || "Basic"
            });

        } catch (err) {

            console.log("Usage fetch error:", err);

        }





        try {

            const res = await API.get("/billing/usage-num", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = res.data;

            setFileStats(data.fileStats);

        } catch (err) {

            console.log("Usage fetch error:", err);

        }

    };



    useEffect(() => {
        fetchProfile();


        fetchUsage();


    }, []);



    const fetchProfile = async () => {

        try {

            const res = await API.get("/user/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(res.data);

            setUser(res.data);

        } catch (err) {
            console.log(err);
        }

    };

    // const usagePercent = Math.min(
    //     ((usage.storageUsed / 1024) / MAX_STORAGE) * 100,
    //     100
    // );

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


                
                                {/* ================= PIE CHARTS ================= */}
                
                                <div className={`${cardStyle} p-6 rounded-xl shadow-lg mb-10 mt-10`}>
                
                                    <h2 className="text-lg mb-4">
                                        Storage Breakdown
                                    </h2>
                
                                    <div className="flex justify-center">
                
                                        <PieChart width={500} height={300}>
                                            <Pie
                                                data={fileStats}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                fill="#00ADB5"
                                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                            >
                                                {fileStats.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                
                                    </div>
                
                             </div>


                <div className="grid md:grid-cols-4 gap-4 mb-8">

                    <div className={`${cardStyle} p-4 rounded-xl shadow-lg`}>
                        <h3>Photos</h3>
                        <p>{fileStats.find(f => f.name === "Images")?.value || 0}</p>
                    </div>

                    <div className={`${cardStyle} p-4 rounded-xl shadow-lg`}>
                        <h3>Videos</h3>
                        <p>{fileStats.find(f => f.name === "Videos")?.value || 0}</p>
                    </div>

                    <div className={`${cardStyle} p-4 rounded-xl shadow-lg`}>
                        <h3>PDF</h3>
                        <p>{fileStats.find(f => f.name === "Docs")?.value || 0}</p>
                    </div>

                    <div className={`${cardStyle} p-4 rounded-xl shadow-lg`}>
                        <h3>Others</h3>
                        <p>{fileStats.find(f => f.name === "Others")?.value || 0}</p>
                    </div>

                </div>

            </div>

        </div>

    );

}

export default Profile;
