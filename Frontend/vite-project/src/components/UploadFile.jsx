import { useState } from "react";
import API from "../api/api";

function UploadFile() {

    const [file, setFile] = useState(null);

    const handleUpload = async () => {

        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("token");

        try {

            await API.post("/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });

            alert("File uploaded successfully");
            window.location.reload();

        } catch (error) {

            console.log(error.response?.data);
            alert("Upload failed");

        }
    };

    return (
        <div>

            <h2>Upload File</h2>

            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={handleUpload}>
                Upload
            </button>

        </div>
    );
}

export default UploadFile;