import { useContext, useEffect } from 'react'
import { AppContext } from '../components/Context'
import { decryptMessage, encryptMessage } from '../services/AuthAndKeyService'
import styles from '../styles/chatWindow.module.css'
import { useState } from 'react'
import { sendMessageToConvo } from '../services/ConvoService'

function formatDate(date) {
    const messageDate = new Date(date);
    const now = new Date();
    const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const monthAndTimeWithoutYear = messageDate.toLocaleDateString('default', { month: 'numeric', day: 'numeric' }) + ' ' + timeString;
    const dateString = messageDate.toLocaleDateString();
    if (messageDate.getDate() === now.getDate() && messageDate.getMonth() === now.getMonth() && messageDate.getFullYear() === now.getFullYear()) {
        return timeString;
    } else if (messageDate.getFullYear()===now.getFullYear()) {
        return monthAndTimeWithoutYear;
    }
    else {
        return dateString;
    }
}

function ChatWindow() {
    const { privateKey, userKeys, setPrivateKey, conversations, 
        setConversations, selectedConvo, setSelectedConvo, addUserKey,
        username, convoMessages, setConvoMessages, addMessageToConvo, addConvo, sendMessageToConvoSigR
    } = useContext(AppContext)

    const [message, setMessage] = useState('')

    const sendMessage = async () => {
        console.log(convoMessages)
        let selectedConvo_ = conversations.find(x => x.convoId == selectedConvo)
        console.log(selectedConvo_)
        console.log(conversations)

        for (let i = 0; i < selectedConvo_.otherConvoUsers.length; i++){
            
            let encryptedMessage = await encryptMessage(userKeys[selectedConvo_.otherConvoUsers[i].userName], message)

            let convoResponse = await sendMessageToConvo(
                {
                ConvoId:selectedConvo_.convoId,
                TextCrypted: encryptedMessage,
                ReceiverUsername: selectedConvo_.otherConvoUsers[i].userName
                }
            )
            console.log(convoResponse)
            if (convoResponse.success && selectedConvo==-1){
                selectedConvo_.convoId = convoResponse.convoId
            }
            if (convoResponse.success && selectedConvo_.otherConvoUsers[i].userName != username){
                console.log(convoResponse.message, selectedConvo_.otherConvoUsers[i].userName)
                sendMessageToConvoSigR(convoResponse.message, selectedConvo_.otherConvoUsers[i].userName);
            }
            if (convoResponse.success){
                setMessage('')
            }
            
        }
        console.log(conversations)
    }

    if (selectedConvo === null) {
        return (<div className={styles.container}></div>)
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {conversations.find(x => x.convoId == selectedConvo)?.otherConvoUsers.filter(user => user.userName != username).map(user => user.userName)}
            </div>
            <div className={styles.body}>
                <div className={styles.messages}>
                    {convoMessages[selectedConvo]?.map((message, index) => (
                        <div className={styles.messageContainer} key={index}>
                            <div className={`${styles.message} ${message.senderUsername != username ? styles.messageFromOtherUser : styles.messageFromLoggedInUser}`}>
                                <div className={styles.messageText}> {message.message} </div>
                                <div className={styles.messageTime}>{formatDate(message.sentAt)}</div>
                            </div>
                        </div>
                        
                    ))}
                </div>
           
                <div className={styles.footer}>
                    <input type="text" className={styles.input} onChange={(e) => setMessage(e.target.value)}/>
                    <button className={`${styles.button} labelWithIcon`} onClick={sendMessage}>
                        <span className={`material-symbols-outlined`}>send</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow