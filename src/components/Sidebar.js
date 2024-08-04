import "./Sidebar.css";
import { Link } from 'react-router-dom';
import { useLogout } from '../components/Logout'; // นำเข้าฟังก์ชัน useLogout

function Sidebar() {
    const handleLogout = useLogout(); // ใช้ custom hook

    return (
        <>
            <div className="sidebar">
                <button className="kathong">
                    Kathong POS
                </button>

                <Link to="/products" className="textsidebar">
                    Products
                </Link>
                <Link to="/owners" className="textsidebar">
                    Owners
                </Link>
                <button className="signout" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        </>
    );
}

export default Sidebar;
