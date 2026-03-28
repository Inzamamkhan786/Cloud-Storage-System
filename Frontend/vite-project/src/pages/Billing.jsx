import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { FaSun, FaFileInvoiceDollar } from "react-icons/fa";
import Loading from "../components/Loading";


function Billing() {

    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(false);
    const [billing, setBilling] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetchBilling(); // or fetchBilling()

        setTimeout(() => {
            setLoading(false);
        }, 800);

    }, []);

    const fetchBilling = async () => {

        try {

            const res = await API.get("/billing/invoice", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBilling(res.data.billing);
            setTotalCost(res.data.total_cost);

        } catch (error) {

            console.log(error);

        }
    };


    const toggleMode = () => {
        setDarkMode(!darkMode);
    };


    if (loading) {
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
                        className="p-3 rounded-lg text-left hover:bg-[#00ADB5] hover:text-white transition transform hover:scale-105"
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/files")}
                        className="p-3 rounded-lg text-left hover:bg-[#00ADB5] hover:text-white transition transform hover:scale-105"
                    >
                        Files
                    </button>

                    <button
                        onClick={() => navigate("/billing")}
                        className="p-3 rounded-lg text-left bg-[#00ADB5] text-white"
                    >
                        Billing
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                        }}
                        className="p-3 rounded-lg text-left hover:bg-red-500 hover:text-white transition transform hover:scale-105"
                    >
                        Logout
                    </button>

                </nav>

            </div>



            {/* Main Content */}

            <div className="flex-1 p-10">

                <div className="flex items-center gap-3 mb-8">

                    <FaFileInvoiceDollar className="text-3xl text-[#00ADB5]" />

                    <h1 className="text-3xl font-bold">
                        Billing Dashboard
                    </h1>

                </div>



                {/* Total Cost Card */}

                <div className={darkMode ?
                    "bg-[#393E46] p-6 rounded-xl shadow-lg mb-10 flex items-center justify-between"
                    :
                    "bg-white p-6 rounded-xl shadow-lg mb-10 flex items-center justify-between"}>

                    <div>

                        <p className="text-sm text-gray-400">
                            Total Usage Cost
                        </p>

                        <h2 className="text-3xl font-bold text-[#00ADB5]">
                            ₹ {totalCost}
                        </h2>

                    </div>

                    <FaFileInvoiceDollar className="text-4xl text-[#00ADB5]" />

                </div>



                {/* Billing Table */}

                <div className={darkMode ?
                    "bg-[#393E46] p-6 rounded-xl shadow-lg"
                    :
                    "bg-white p-6 rounded-xl shadow-lg"}>

                    <h2 className="text-xl mb-6">
                        Usage Breakdown
                    </h2>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b border-gray-600 text-left">

                                    <th className="py-3">Operation</th>
                                    <th className="py-3">Requests</th>
                                    <th className="py-3">Total MB</th>
                                    <th className="py-3">Cost (₹)</th>

                                </tr>

                            </thead>

                            <tbody>

                                {billing.map((item, index) => (

                                    <tr
                                        key={index}
                                        className="border-b border-gray-700 hover:bg-[#00ADB5] hover:text-white transition"
                                    >

                                        <td className="py-3 font-medium">
                                            {item.operation}
                                        </td>

                                        <td className="py-3">
                                            {item.requests}
                                        </td>

                                        <td className="py-3">
                                            {item.total_MB}
                                        </td>

                                        <td className="py-3 text-[#ff0000] font-semibold">
                                            ₹ {item.cost}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Billing;
