import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { FaSun, FaDownload, FaTrash, FaFileAlt } from "react-icons/fa";
import Loading from "../components/Loading";

function Files() {

    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasDuplicates, setHasDuplicates] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetchFiles(); // or fetchBilling()
        checkDuplicates();

        setTimeout(() => {
            setLoading(false);
        }, 800);

    }, []);


    const fetchFiles = async () => {

        try {

            const res = await API.get("/files/my-files", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setFiles(res.data.files);

        } catch (error) {

            console.log(error);

        }

    };

    const fetchUsage = async () => {
        try {

            const res = await API.get("/billing/usage");

            console.log("Usage response:", res.data);

        } catch (error) {
            console.log("Usage fetch error:", error);
        }
    };

    const toggleMode = () => {
        setDarkMode(!darkMode);
    };

    const deleteFile = async (id) => {

        try {

            await API.delete(`/files/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });


            fetchFiles();

        } catch (error) {

            console.log(error);

        }

    };

    const downloadFile = async (id, fileName) => {

        try {

            const response = await API.get(`/files/download/${id}`, {
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchUsage();

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", fileName);

            document.body.appendChild(link);
            link.click();

            link.remove();

        } catch (error) {

            console.log(error);

        }

    };

    const formatSize = (bytes) => {

        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";

        return (bytes / (1024 * 1024)).toFixed(2) + " MB";

    };


    const checkDuplicates = async () => {

        try {

            const res = await API.get("/files/duplicates", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setHasDuplicates(res.data.hasDuplicates);

        } catch (error) {
            console.log(error);
        }

    };

    
    const deleteDuplicates = async () => {

        console.log("Delete clicked");

        try {

            const res = await API.delete("/files/delete-duplicates");

            console.log(res.data);

            alert("Duplicates deleted successfully");

            fetchFiles();
            checkDuplicates();

        } catch (error) {

            console.log("DELETE ERROR:", error);

        }

    };


    if(loading){
        return <Loading />;
    }

    return (

        <div className={darkMode ? "flex min-h-screen bg-[#222831] text-white" : "flex min-h-screen bg-gray-100 text-gray-900"}>


            {/* Sidebar */}

            <div className={darkMode ? "w-64 bg-[#393E46] p-6" : "w-64 bg-white shadow-lg p-6"}>

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
                        className="p-3 rounded-lg text-left hover:bg-[#00ADB5] hover:text-white transition"
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/files")}
                        className="p-3 rounded-lg text-left bg-[#00ADB5] text-white"
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



            {/* Main Content */}

           

            <div className="flex-1 p-10">

                {hasDuplicates && (
                    <div className="bg-yellow-400 text-black p-4 rounded-lg mb-6 shadow-md">
                        ⚠ Duplicate files detected — Delete to save storage

                        <button
                            onClick={deleteDuplicates}
                            className="ml-4 bg-red-500 px-4 py-2 rounded-lg"
                        >
                            Delete All
                        </button>

                    </div>
                )}


                <h1 className="text-3xl font-bold mb-8">
                    Uploaded Files
                </h1>


                {files.length === 0 ? (

                    <div className="text-center mt-20">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                            className="w-32 mx-auto mb-6"
                        />

                        <p className="text-lg text-gray-400">
                            No files uploaded yet
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
                                                onClick={() => downloadFile(file.id, file.file_name)}
                                                className="flex items-center gap-2 bg-[#00ADB5] hover:bg-[#019aa1] px-4 py-2 rounded-lg transition"
                                            >
                                                <FaDownload />
                                                Download
                                            </button>

                                            <button
                                                onClick={() => deleteFile(file.id)}
                                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                                            >
                                                <FaTrash />
                                                Delete
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

export default Files;
