import { createContext, useState } from "react"

export const ProfilContext = createContext();

export function ProfilContextProvider(props) {

    const [monProfil, setMonProfil] = useState({
        id: "",
        email: "",
        token: ""
    });

    function monProfilLogin(id, email) {
        setMonProfil({ id: id, email: email });
    }

    function monProfilLogout() {
        setMonProfil({ id: "", email: "" });
    }

    return <ProfilContext.Provider value={{ monProfil, monProfilLogin, monProfilLogout }}>
        {props.children}
    </ProfilContext.Provider>
}