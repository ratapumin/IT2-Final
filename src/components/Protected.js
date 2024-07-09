import axios from "axios";
import { useEffect } from "react";

function Protected() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        try {
            const protectedData = async () => {
                const req = await axios.get('http://localhost:3000/protected', {
                    headers: {
                        'Authorization': token
                    }
                })
            }
            setMessage(res.data.message)
        } catch {
            console.error('Error protected data', error)
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