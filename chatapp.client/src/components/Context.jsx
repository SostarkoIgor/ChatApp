import { createContext, useState } from "react"
import { convertFromBase64ToPublicRSAKey } from '../services/AuthAndKeyService'

export const AppContext = createContext()

export const Context = ({ children }) => {
    const [privateKey, setPrivateKey] = useState(null)
    const [roles, setRoles] = useState(null)
    const [email, setEmail] = useState(null)

    const [userKeys, setUserKeys] = useState({})
    const [conversations, setConversations] = useState([])

    const [selectedConvo, setSelectedConvo] = useState(null)

    const addUserKey = (key, user) => {
        if (!userKeys[user]) 
            setUserKeys({ ...userKeys, [user]: key })
    }

    const addConversation = (conversation_) => {
        setConversations([...conversations, conversation_])
    }



    const reset= ()=> {
        setPrivateKey(null)
        setRoles(null)
        setEmail(null)
        setUserKeys({})
        setConversations([])
        setSelectedConvo(null)
    }
    
    const addPublicKeyIfNotPresent = async (user, key) => {
        if (!userKeys[user]) {
            userKeys[user]=await convertFromBase64ToPublicRSAKey(key)
        }
    }

    return (
        <AppContext.Provider
        value={{ privateKey, setPrivateKey, roles, setRoles, email, setEmail, userKeys,
        setUserKeys, addUserKey, conversations, setConversations, addConversation,
        selectedConvo, setSelectedConvo, reset, addPublicKeyIfNotPresent }}>
            {children}
        </AppContext.Provider>
    )
}