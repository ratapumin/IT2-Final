import { useUser } from '../components/user/UserContext';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        setUser(null);
        navigate("/");
    };

    return handleLogout;
};
