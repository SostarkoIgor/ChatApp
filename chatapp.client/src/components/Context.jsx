import { createContext, useState } from "react"

export const PrivateKeyContext = createContext()

export const Context = ({ children }) => {
    const [privateKey, setPrivateKey] = useState(null)

    return (
        <PrivateKeyContext.Provider value={{ privateKey, setPrivateKey }}>
            {children}
        </PrivateKeyContext.Provider>
    )
}