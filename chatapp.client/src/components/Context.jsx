import { createContext, useState } from "react"

export const AppContext = createContext()

export const Context = ({ children }) => {
    const [privateKey, setPrivateKey] = useState(null)
    const [roles, setRoles] = useState(null)
    const [email, setEmail] = useState(null)

    const [userKeys, setUserKeys] = useState({})

    const addUserKey = (key) => {
        setUserKeys({ ...userKeys, [key]: true })
    }
    
    

    return (
        <AppContext.Provider value={{ privateKey, setPrivateKey, roles, setRoles, email, setEmail, userKeys, setUserKeys, addUserKey }}>
            {children}
        </AppContext.Provider>
    )
}