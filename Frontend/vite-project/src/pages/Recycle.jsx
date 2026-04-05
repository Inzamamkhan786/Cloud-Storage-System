import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import { FaSun, FaTrashRestore, FaTrash, FaFileAlt } from "react-icons/fa";
import Loading from "../components/Loading";

function Recycle() {

    const navigate = useNavigate();
    const location = useLocation();

    const [darkMode, setDarkMode] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchRecycleFiles();

        setTimeout(() => {
            setLoading(false);
        }, 800);

    }, []);

    const fetchRecycleFiles = async () => {

        try {

            const res = await API.get("/files/recycle-bin");
            setFiles(res.data.files);

        } catch (error) {
            console.log(error);
        }

    };

    const restoreFile = async (id) => {

        try {

            await API.post(`/files/restore/${id}`);
            fetchRecycleFiles();

        } catch (error) {
            console.log(error);
        }

    };

    const permanentDelete = async (id) => {

        try {

            await API.delete(`/files/permanent-delete/${id}`);
            fetchRecycleFiles();

        } catch (error) {
            console.log(error);
        }

    };

    const toggleMode = () => {
        setDarkMode(!darkMode);
    };

    const formatSize = (bytes) => {

        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";

        return (bytes / (1024 * 1024)).toFixed(2) + " MB";

    };

    if (loading) {
        return <Loading />;
    }

    return (

        <div className={darkMode ? "flex min-h-screen bg-[#222831] text-white" : "flex min-h-screen bg-gray-100 text-gray-900"}>


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
                        onClick={() => navigate("/Profile")}
                        className="p-3 rounded-lg text-left hover:bg-[#00ADB5] hover:text-white transition transform hover:scale-105"
                    >
                        Profile
                    </button>

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
                        className={`p-3 rounded-lg text-left transition 
                        ${location.pathname === "/files"
                                ? "bg-[#00ADB5] text-white"
                                : "hover:bg-[#00ADB5] hover:text-white"}`}
                    >
                        Files
                    </button>

                    <button
                        onClick={() => navigate("/billing")}
                        className={`p-3 rounded-lg text-left transition 
                        ${location.pathname === "/billing"
                                ? "bg-[#00ADB5] text-white"
                                : "hover:bg-[#00ADB5] hover:text-white"}`}
                    >
                        Billing
                    </button>

                    <button
                        onClick={() => navigate("/recycle-bin")}
                        className={`p-3 rounded-lg text-left transition 
                        ${location.pathname === "/recycle-bin"
                                ? "bg-[#00ADB5] text-white"
                                : "hover:bg-[#00ADB5] hover:text-white"}`}
                    >
                        Recycle Bin
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
                    Recycle Bin (Auto delete after 10 days)
                </h1>

                {files.length === 0 ? (

                    <div className="text-center mt-20">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                            className="w-32 mx-auto mb-6"
                        />

                        <p className="text-lg text-gray-400">
                            Recycle bin is empty
                        </p>

                    </div>

                ) : (

                    <div className={darkMode ?
                        "bg-[#393E46] rounded-xl shadow-lg p-6"
                        :
                        "bg-white rounded-xl shadow-lg p-6"}>

                        <table className="w-full">

                            <thead>

                                <tr className="border-b border-gray-600 text-left">

                                    <th className="py-3">File</th>
                                    <th className="py-3">Size</th>
                                    <th className="py-3">Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {files.map((file) => (

                                    <tr
                                        key={file.id}
                                        className="border-b border-gray-700 hover:bg-[#00ADB5] hover:text-white transition"
                                    >

                                        <td className="py-4 flex items-center gap-3">

                                            <FaFileAlt className="text-[#00ADB5]" />

                                            {file.file_name}

                                        </td>

                                        <td>
                                            {formatSize(file.size_bytes)}
                                        </td>

                                        <td className="flex gap-3 py-3">

                                            <button
                                                onClick={() => restoreFile(file.id)}
                                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition"
                                            >
                                                <FaTrashRestore />
                                                Restore
                                            </button>

                                            <button
                                                onClick={() => permanentDelete(file.id)}
                                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                                            >
                                                <FaTrash />
                                                Delete Forever
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}

export default Recycle;