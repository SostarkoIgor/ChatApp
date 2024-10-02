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

    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

    const [modalProfileUsername, setModalProfileUsername] = useState(null)
    const [modalProfileIsLoggedInUser, setModalProfileIsLoggedInUser] = useState(false)

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
                        console.log(convoId, message)
                        message.message = await decryptMessage(privateKey, message.encryptedMessage);
                            addConversation({
                                convoId: convoId,
                                otherConvoUsers: [
                                    {
                                        userName:message.senderUsername,
                                        publicKey: null
                                    },
                                    {
                                        userName:message.receiverUsername,
                                        publicKey: null
                                    }
                                ],
                                lastMessage: {
                                    message: message.message,
                                    messageCrypted: message.encryptedMessage,
                                    messageRead: message.isRead,
                                    messageSentAt: message.sentAt
                                }
                            })
                        addMessageToConvo(convoId, message);
                        changeLastMessage(convoId, {
                            message: message.message,
                            messageCrypted: message.encryptedMessage,
                            messageRead: message.isRead,
                            messageSentAt: message.sentAt
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

    const sendMessageToConvoSigR = async (message, user) => {
        console.log("send message", message, user, hubConnection)
        if (hubConnection) {
            try {
                await hubConnection.invoke('SendMessage', user, message);
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
        setConversations(oldConversations=>{
            if (oldConversations.find(x => x.convoId === conversation_.convoId)) {
                return oldConversations
            }
            let newConversations=oldConversations.filter(x => x.convoId !== conversation_.convoId)
            return [...newConversations, conversation_]
        })
    }

    const changeLastMessage = (convoId, newLastMessage) => {
        setConversations(prevConversations =>
            prevConversations.map(convo => {
              if (convo.convoId === convoId) {
                return {
                  ...convo,
                  lastMessage: {
                    ...convo.lastMessage,  // Spread the old lastMessage object to retain unchanged fields
                    ...newLastMessage      // Override fields in lastMessage with the new data
                  }
                };
              }
              return convo; // If convoId doesn't match, return the convo unchanged
            })
          );
    }

    const addMessageToConvo = (convoId, message) => {
        setConvoMessages(prevConvoMessages => {
            console.log(prevConvoMessages); // Always logs the latest state
    
            // If the conversation doesn't exist, initialize it with the new message
            if (!prevConvoMessages?.[convoId]) {
                return { ...prevConvoMessages, [convoId]: [message] };
            }
            
            // If the conversation exists, append the new message to the existing array
            return { 
                ...prevConvoMessages, 
                [convoId]: [...prevConvoMessages[convoId], message] 
            };
        });
    }

    const addConvo = (convoId, conversation) => {
        setConvoMessages(convoMessages => { 
            if (!convoMessages[convoId]) {
                return { ...convoMessages, [convoId]: conversation }
            }
            else return convoMessages
        })
    }

    const deleteConvoMessages = (convoId) => {
        setConvoMessages(prevConvoMessages => {
            const newConvoMessages = { ...prevConvoMessages }; // Copy the current convoMessages state
            delete newConvoMessages[convoId]; // Remove the messages for the convoId
            return newConvoMessages; // Update state
        })
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
        isLoaded, setIsLoaded, convoMessages, setConvoMessages, addMessageToConvo, addConvo, sendMessageToConvoSigR,
        changeLastMessage, deleteConvoMessages, isSearchModalOpen, setIsSearchModalOpen, isProfileModalOpen, setIsProfileModalOpen,
        modalProfileUsername, setModalProfileUsername, modalProfileIsLoggedInUser, setModalProfileIsLoggedInUser }}>
            {children}
        </AppContext.Provider>
    )
}