import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { FaSun, FaDatabase, FaCloudUploadAlt } from "react-icons/fa";
import Loading from "../components/Loading";

function Dashboard() {

    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);

    const [usage, setUsage] = useState({
        storageUsed: 0,
        files: 0,
        plan: "Free"
    });

    const [file, setFile] = useState(null);

    const token = localStorage.getItem("token");

    const MAX_STORAGE = 5120; // 5GB free plan


    const toggleMode = () => {
        setDarkMode(!darkMode);
    };


    // ================================
    // Fetch usage from backend
    // ================================
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
                plan: data.plan || "Free"
            });

        } catch (err) {

            console.log("Usage fetch error:", err);

        }

    };


    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetchUsage();

        setTimeout(() => {
            setLoading(false);
        }, 800); // delay

    }, []);;



    // ================================
    // Upload file
    // ================================
    const handleUpload = async () => {

        if (!file) {
            alert("Please select a file");
            return;
        }

        try {

            const formData = new FormData();
            formData.append("file", file);

            await API.post("/files/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("File uploaded successfully");

            setFile(null);

            fetchUsage(); // refresh dashboard

        } catch (err) {


            if (err.response) {
                alert(err.response.data.message);
            } else {
                alert("Upload failed");
            }

        }

    };


    const usagePercent = Math.min((Number(usage.storageUsed) / MAX_STORAGE) * 100, 100);


    const cardStyle = darkMode
        ? "bg-[#393E46] text-white"
        : "bg-white text-black";



    if (loading) {
        return <Loading />;
    }
    
    

    return (

        <div className={darkMode ? "flex min-h-screen bg-[#222831] text-white" : "flex min-h-screen bg-gray-100 text-black"}>


            {/* ================= SIDEBAR ================= */}

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
                        onClick={() => navigate("/dashboard")}
                        className={`p-3 rounded-lg text-left transition 
    ${location.pathname === "/dashboard"
                                ? "bg-[#00ADB5] text-white"
                                : "hover:bg-[#00ADB5] hover:text-white"}`}
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/files")}
                        className="p-3 rounded-lg text-left hover:bg-[#00ADB5] hover:text-white transition"
                    >
                        Files
                    </button>

                    <button
                        onClick={() => navigate("/billing")}
                        className="p-3 rounded-lg text-left hover:bg-[#00ADB5] hover:text-white transition"
                    >
                        Billing
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                        }}
                        className="p-3 rounded-lg text-left hover:bg-red-500 hover:text-white transition"
                    >
                        Logout
                    </button>

                </nav>

            </div>



            {/* ================= MAIN CONTENT ================= */}

            <div className="flex-1 p-10">

                <h1 className="text-3xl font-bold mb-8">
                    Dashboard
                </h1>



                {/* ================= STATS ================= */}

                <div className="grid md:grid-cols-3 gap-6 mb-10">

                    <div className={`${cardStyle} p-6 rounded-xl shadow-lg flex items-center gap-4`}>

                        <FaDatabase className="text-3xl text-[#00ADB5]" />

                        <div>
                            <p className="text-sm">Storage Used</p>
                            <p className="text-2xl font-bold text-[#00ADB5]">
                                {usage.storageUsed} MB
                            </p>
                        </div>

                    </div>


                    <div className={`${cardStyle} p-6 rounded-xl shadow-lg flex items-center gap-4`}>

                        <FaCloudUploadAlt className="text-3xl text-[#00ADB5]" />

                        <div>
                            <p className="text-sm">Files</p>
                            <p className="text-2xl font-bold text-[#00ADB5]">
                                {usage.files}
                            </p>
                        </div>

                    </div>


                    <div className={`${cardStyle} p-6 rounded-xl shadow-lg flex items-center gap-4`}>

                        <FaDatabase className="text-3xl text-[#00ADB5]" />

                        <div>
                            <p className="text-sm">Plan</p>
                            <p className="text-2xl font-bold text-[#00ADB5]">
                                {usage.plan}
                            </p>
                        </div>

                    </div>

                </div>



                {/* ================= UPLOAD ================= */}

                <div className={`${cardStyle} p-6 rounded-xl shadow-lg mb-8`}>

                    <h2 className="text-xl mb-4 flex items-center gap-2">
                        <FaCloudUploadAlt />
                        Upload File
                    </h2>

                    <div className="flex items-center gap-4">

                        <label className="bg-[#00ADB5] text-white px-5 py-2 rounded-lg cursor-pointer">
                            Choose File
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>

                        {file && (
                            <p className="text-sm text-gray-300">
                                Selected: {file.name}
                            </p>
                        )}

                        <button
                            onClick={handleUpload}
                            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-white"
                        >
                            Upload
                        </button>

                    </div>

                </div>



                {/* ================= STORAGE BAR ================= */}

                <div className={`${cardStyle} p-6 rounded-xl shadow-lg mb-10`}>

                    <h2 className="text-lg mb-4">
                        Storage Usage
                    </h2>

                    <div className="w-full bg-gray-400 rounded-full h-5">

                        <div
                            className="bg-[#00ADB5] h-5 rounded-full transition-all duration-500"
                            style={{ width: `${usagePercent}%` }}
                        ></div>

                    </div>

                    <p className="mt-3 text-sm">
                        {usage.storageUsed} GB / {MAX_STORAGE} GB
                    </p>

                </div>



                {/* ================= INFO CARDS ================= */}

                <div className="grid md:grid-cols-2 gap-6">

                    <div className={`${cardStyle} p-6 rounded-xl shadow-lg`}>

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4144/4144727.png"
                            className="w-24"
                        />

                        <p className="mt-4">
                            Store and manage your files securely with CloudDrive.
                        </p>

                    </div>


                    <div className={`${cardStyle} p-6 rounded-xl shadow-lg`}>

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
                            className="w-24"
                        />

                        <p className="mt-4">
                            Upload, download and manage files easily.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;