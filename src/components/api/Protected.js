import axios from "axios";
import { useEffect } from "react";
import { useUser } from '../user/UserContext';
import { useNavigate } from 'react-router-dom';

function Protected() {
    const { user, setUser } = useUser()
    const navigate = useNavigate();

    useEffect(() => {
        const protectedData = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const res = await axios.get('http://localhost:5000/api/protected', {
                    headers: {
                        'authorization': token
                    },
                });
                console.log(res.data)
                setUser(res.data);
                if (user.role_type === 'A') {
                    navigate('/products')
                }
                else if (user.role_type === 'E'||user.role_type === 'O') {
                    navigate('/coffee');
                } else {
                    navigate('/about')
                }
            } catch (error) {
                console.error('Error fetching protected data', error);
            }
        };

        protectedData();

    }, [user, setUser, navigate])

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