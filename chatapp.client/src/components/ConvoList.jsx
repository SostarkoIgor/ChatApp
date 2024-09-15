import styles from '../styles/convoList.module.css'
import userStyles from '../styles/user.module.css'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../components/Context'
import { getConversations } from '../services/ConvoService'
import { decryptMessage } from '../services/AuthAndKeyService'


export default function ConvoList() {

    const { privateKey, userKeys, setPrivateKey, conversations, setConversations, selectedConvo, setSelectedConvo, addUserKey, addPublicKeyIfNotPresent, username } = useContext(AppContext)

    const formatDate = (date) => {
            const messageDate = new Date(date);
            const now = new Date();

            
            const isToday = (someDate) => {
                return someDate.getDate() === now.getDate() &&
                    someDate.getMonth() === now.getMonth() &&
                    someDate.getFullYear() === now.getFullYear();
            };

            const isYesterday = (someDate) => {
                const yesterday = new Date(now);
                yesterday.setDate(now.getDate() - 1);
                return someDate.getDate() === yesterday.getDate() &&
                    someDate.getMonth() === yesterday.getMonth() &&
                    someDate.getFullYear() === yesterday.getFullYear();
            };

            
            const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateString = messageDate.toLocaleDateString();

            if (isToday(messageDate)) {
                return timeString; // Format: 14:57
            } else if (isYesterday(messageDate)) {
                return "Yesterday";
            } else {
                return dateString;
            }
    	}

    const displayName=(users)=>{
        return users.filter(user=>user.userName!==username).map(user=>user.userName).join(', ')
    }

    useEffect(() => {
        async function start() {
            if (conversations.length == 0){
                const response = await getConversations()
                console.log(response)
                if (response.success){
                    for (let i = 0; i < response.conversations.length; i++) {
                        console.log(response.conversations[i].otherConvoUsers[0].publicKey)
                        for (let j = 0; j < response.conversations[i].otherConvoUsers.length; j++)
                            await addPublicKeyIfNotPresent(response.conversations[i].otherConvoUsers[j].userName, response.conversations[i].otherConvoUsers[j].publicKey)
                        response.conversations[i].lastMessage.message = await decryptMessage(privateKey, response.conversations[i].lastMessage.messageCrypted)
                    }
                    setConversations(response.conversations)
                }
            }
        }

        start()
    }, [])



    return (
        <div className={styles.container}>
            {/* <div className={styles.title}>Conversations</div> */}
            <div className={styles.conversations}>
                {conversations.map((conversation, index) => {
                    return (
                        <div className={userStyles.user} key={index} onClick={() => setSelectedConvo(conversation.convoId)}>
                            <div className={userStyles.userGroup}>
                                <div className={userStyles.profilePic}>
                                    <img src="https://picsum.photos/200/300" alt="Placeholder Image" />
                                </div>
                                <div className={userStyles.username}>{displayName(conversation.otherConvoUsers)}</div>
                            </div>
                            <div className={userStyles.userGroup}>
                                <div className={userStyles.lastMessage}>
                                {conversation.lastMessage.message.length > 10 
                                ? conversation.lastMessage.message.substring(0, 7) + "..." 
                                : conversation.lastMessage.message}
                                </div>
                            </div>
                            <div className={styles.sentAt}>
                                {formatDate(conversation.lastMessage.messageSentAt)}
                            </div>
                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}