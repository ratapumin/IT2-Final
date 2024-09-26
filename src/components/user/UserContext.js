import { createContext, useContext, useState } from "react";

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    console.log('user',user)

    return (<>
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    </>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};