import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found, redirecting...");
                window.location.href = "/login";
                return;
            }

            try {
                const response = await axios.get(`${backendUrl}/api/protected-route`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
        </div>
    );
};

export default Dashboard;
