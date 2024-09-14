import { createContext, useState } from "react"

export const AppContext = createContext()

export const Context = ({ children }) => {
    const [privateKey, setPrivateKey] = useState(null)
    const [roles, setRoles] = useState(null)
    const [email, setEmail] = useState(null)

    const [userKeys, setUserKeys] = useState({})
    const [conversations, setConversations] = useState([])

    const [selectedConvo, setSelectedConvo] = useState(null)

    const addUserKey = (key) => {
        setUserKeys({ ...userKeys, [key]: true })
    }

    const addConversation = (conversation_) => {
        setConversations([...conversations, conversation_])
    }
    
    

    return (
        <AppContext.Provider
        value={{ privateKey, setPrivateKey, roles, setRoles, email, setEmail, userKeys,
        setUserKeys, addUserKey, conversations, setConversations, addConversation,
        selectedConvo, setSelectedConvo }}>
            {children}
        </AppContext.Provider>
    )
}