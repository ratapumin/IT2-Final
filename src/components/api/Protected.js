import axios from "axios";
import { useEffect, useState } from "react";

function Protected() {
    const [message, setMessage] = useState('');
    const [user_id, setUserID] = useState('');

    useEffect(() => {
        const protectedData = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const res = await axios.get('http://localhost:5000/api/protected', {
                    headers: {
                        'Authorization': token
                    },
                });
                setUserID(res.data.user_id);
                setMessage(res.data.message);
            } catch (error) {
                console.error('Error fetching protected data', error);
            }
        };

        protectedData();
        window.location.href='/coffee'
    }, []);

    return (
        <div>
            <h1>Protected page</h1>
            <p>{message} {user_id}</p>
        </div>
    );
}

export default Protected;