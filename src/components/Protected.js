import axios from "axios";
import { useEffect, useState } from "react";

function Protected() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const protectedData = async () => {
            try {
                const token = localStorage.getItem('jwt')
                const res = await axios.get('http://localhost:3000/protected', {
                    headers: {
                        'Authorization': token
                    }
                })
                setMessage(res.data.message)
            } catch (error) {
                console.error('Error protected data', error)
            }
        }
        protectedData();
    }, [])

    return (
        <div>
            <h1> Protected page</h1>
            <p>{message}</p>
        </div>
    )
}
export default Protected;