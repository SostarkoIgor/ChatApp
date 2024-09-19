import { createContext, useState, useEffect } from "react"
import { convertFromBase64ToPublicRSAKey, decryptMessage } from '../services/AuthAndKeyService'
import { HubConnectionBuilder } from "@microsoft/signalr"
import { getToken } from "../services/TokenService"

export const AppContext = createContext()

export const Context = ({ children }) => {
    const [privateKey, setPrivateKey] = useState(null)
    const [roles, setRoles] = useState(null)
    const [email, setEmail] = useState(null)

    const [username, setUsername] = useState(null)

    const [userKeys, setUserKeys] = useState({})
    const [conversations, setConversations] = useState([])

    const [selectedConvo, setSelectedConvo] = useState(null)

    const [isLoaded, setIsLoaded] = useState(false)

    const [convoMessages, setConvoMessages] = useState({})

    const [hubConnection, setHubConnection] = useState(null)

    useEffect(() => {  
        async function start() {  
            if (isLoaded) {
                const newHubConnection = new HubConnectionBuilder().withUrl("https://localhost:7109/hub",
                    {
                        accessTokenFactory: () => getToken(),
                    }
                ).build()
                newHubConnection.serverTimeoutInMilliseconds = 1000 * 60 * 2;
                newHubConnection.keepAliveIntervalInMilliseconds = 1000 * 30;
                newHubConnection.start()
                    .then(() => console.log('Connected!'))
                    .catch(err => console.log('Connection failed: ', err));

                    newHubConnection.on('ReceiveMessage', async (convoId, message) => {
                        message = await decryptMessage(privateKey, message);
                        console.log(message, convoId)
                        console.log("aaaaaaaaaaaaaaaaaaa")
                        console.log(convoMessages)
                        addMessageToConvo(convoId, {
                            message: message,
                            sentAt: new Date()
                        });

                });

                setHubConnection(newHubConnection);
            }
        }
        start();
            return () => {
                if (hubConnection)
                    hubConnection.stop();
            }
        }
    , [isLoaded])

    const sendMessageToConvoSigR = async (message, convoId, user) => {
        console.log("send message", message, convoId, user, hubConnection)
        if (hubConnection) {
            try {
                await hubConnection.invoke('SendMessage', user, {
                    ConvoId: convoId,
                    Message: message
                });
            } catch (err) {
                console.error('Error sending message: ', err);
            }
        }
    }

    const addUserKey = (key, user) => {
        if (!userKeys[user]) 
            setUserKeys({ ...userKeys, [user]: key })
    }

    const addConversation = (conversation_) => {
        setConversations([...conversations, conversation_])
    }

    const addMessageToConvo = (convoId, message) => {
        console.log(convoMessages)
        setConvoMessages( convoMessages => ({ ...convoMessages, [convoId]: [...convoMessages[convoId], message] }));
        console.log(convoMessages)
        console.log(convoId, message)	
    }

    const addConvo = (convoId, conversation) => {
        setConvoMessages( convoMessages => ({ ...convoMessages, [convoId]: conversation }))
    }



    const reset= ()=> {
        setPrivateKey(null)
        setRoles(null)
        setEmail(null)
        setUserKeys({})
        setConversations([])
        setSelectedConvo(null)
        setUsername(null)
        setIsLoaded(false)
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
        selectedConvo, setSelectedConvo, reset, addPublicKeyIfNotPresent, username, setUsername,
        isLoaded, setIsLoaded, convoMessages, setConvoMessages, addMessageToConvo, addConvo, sendMessageToConvoSigR }}>
            {children}
        </AppContext.Provider>
    )
}