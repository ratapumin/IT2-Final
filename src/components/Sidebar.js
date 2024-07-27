import "./Sidebar.css";
function Sidebar() {


    return (
        <>

            <div  bg="dark" className="sidebar">
                <button className="kathong">
                    Kathong POS
                </button>

                <button className="textsidebar">
                    Products
                </button>
                <button className="textsidebar">
                    Owners
                </button>
                <button className="signout">
                    Sign Out
                </button>
            </div>

        </>
    );
}

export default Sidebar;
