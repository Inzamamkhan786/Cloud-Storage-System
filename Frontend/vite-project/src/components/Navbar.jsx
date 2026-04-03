import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

    return (

        <div style={{ marginBottom: "30px" }}>

            <Link to="/dashboard" style={{ marginRight: "20px" }}>
                Dashboard
            </Link>

            <Link to="/files" style={{ marginRight: "20px" }}>
                Files
            </Link>

            <Link to="/billing" style={{ marginRight: "20px" }}>
                Billing
            </Link>

            <button onClick={logout}>
                Logout
            </button>

        </div>

    );

}

export default Navbar;