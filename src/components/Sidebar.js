import "./Sidebar.css";
import { Link } from 'react-router-dom';


function Sidebar() {


    return (
        <>

            <div bg="dark" className="sidebar">
                <button className="kathong">
                    Kathong POS
                </button>

                <Link to="/products" className="textsidebar">
                    Products
                </Link>
                <Link to="/owners" className="textsidebar">
                    Owners
                </Link>
                <button className="signout">
                    Sign Out
                </button>
            </div>

        </>
    );
}

export default Sidebar;
