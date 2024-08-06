import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from '../user/UserContext';
import { useNavigate } from 'react-router-dom';

function Protected() {
    const { user, setUser } = useUser()
    const navigate = useNavigate();
    const [token, setToken] = useState();

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            setToken(token);
        } else {
            navigate("/");
        }
    }, [token, navigate]);

    useEffect(() => {
        const protectedData = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    navigate("/");
                    return;
                }
                const res = await axios.get('http://localhost:5000/api/protected', {
                    headers: {
                        'authorization': token
                    },
                });
                console.log(res.data)
                setUser(res.data);

                if (res.data.role_type === 'A') {
                    navigate('/products');
                } else if (res.data.role_type === 'E' || res.data.role_type === 'O') {
                    navigate('/orders');
                } else {
                    navigate('/about');
                }
            } catch (error) {
                console.error('Error fetching protected data', error);
                if (error.response && error.response.status === 403) {
                    localStorage.removeItem('jwt')
                    navigate('/')
                } else {
                    console.error('An unexpected error occurred:', error.message);
                }
            }
        };

        protectedData();

    }, [setUser, navigate])

    return (
        <div>
            <h1>Protected page</h1>
            {user && (
                <div>
                    <p>User ID: {user.user_id}</p>
                    <p>First Name: {user.user_fname}</p>
                    <p>Last Name: {user.user_lname}</p>
                    <p>Phone: {user.user_tel}</p>
                    <p>ID Card: {user.user_id_card}</p>
                    <p>Role Type: {user.role_type}</p>
                    <p>Status: {user.user_status}</p>
                </div>
            )}
        </div>
    );
}

export default Protected;