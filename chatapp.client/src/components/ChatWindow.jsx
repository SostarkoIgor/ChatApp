import { useContext, useEffect } from 'react'
import { AppContext } from '../components/Context'
import { decryptMessage, encryptMessage } from '../services/AuthAndKeyService'
import styles from '../styles/chatWindow.module.css'
import { useState, useRef } from 'react'
import { sendMessageToConvo } from '../services/ConvoService'

function formatDate(date) {
    // Convert the input date to a local time Date object (assuming input is in UTC ISO format)
    const messageDate = new Date(date);
    const now = new Date();  // Get the current date in local time

    // Format the time (HH:mm) for the local time zone
    const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Format the month and day without the year (e.g., MM/DD or DD/MM, depending on locale)
    const monthAndTimeWithoutYear = messageDate.toLocaleDateString('default', { month: 'numeric', day: 'numeric' }) + ' ' + timeString;

    // Format the full date (with year)
    const dateString = messageDate.toLocaleDateString();

    // Check if the message date is today (same day, month, and year)
    if (
        messageDate.getDate() === now.getDate() &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getFullYear() === now.getFullYear()
    ) {
        // If the date is today, return only the time
        return timeString;
    } 
    // Check if the message date is in the same year
    else if (messageDate.getFullYear() === now.getFullYear()) {
        // If it's the same year, return month, day, and time (without the year)
        return monthAndTimeWithoutYear;
    } 
    else {
        // If it's a different year, return the full date
        return dateString;
    }
}



function ChatWindow() {
    const { privateKey, userKeys, setPrivateKey, conversations, 
        setConversations, selectedConvo, setSelectedConvo, addUserKey,
        username, convoMessages, setConvoMessages, addMessageToConvo, addConvo, sendMessageToConvoSigR,
        changeLastMessage
    } = useContext(AppContext)

    const [message, setMessage] = useState('')

    const chatRef = useRef(null)
    
    const scrollToBottom = () => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }

    useEffect(() => {
        scrollToBottom()
      }, [convoMessages, selectedConvo])

    const sendMessage = async () => {
        if (message === '') return
        let selectedConvo_ = conversations.find(x => x.convoId == selectedConvo)
    

        for (let i = 0; i < selectedConvo_.otherConvoUsers.length; i++){
            
            let encryptedMessage = await encryptMessage(userKeys[selectedConvo_.otherConvoUsers[i].userName], message)

            let convoResponse = await sendMessageToConvo(
                {
                ConvoId:selectedConvo_.convoId,
                TextCrypted: encryptedMessage,
                ReceiverUsername: selectedConvo_.otherConvoUsers[i].userName
                }
            )
            if (convoResponse.success && selectedConvo==-1){
                selectedConvo_.convoId = convoResponse.convoId
            }
            if (convoResponse.success && selectedConvo_.otherConvoUsers[i].userName != username){
                sendMessageToConvoSigR(convoResponse.message, selectedConvo_.otherConvoUsers[i].userName);
            }
            if (convoResponse.success && selectedConvo_.otherConvoUsers[i].userName == username){
                convoResponse.message.message=message
                console.log(selectedConvo)
                console.log(selectedConvo_)
                //addMessageToConvo(convoResponse.convoId, convoResponse.message);
                addMessageToConvo(selectedConvo, convoResponse.message);
            }
            if (convoResponse.success){
                changeLastMessage(selectedConvo, {
                    message: message,
                    messageCrypted: encryptedMessage,
                    messageRead: true,
                    messageSentAt: convoResponse.message.sentAt
                })
                setMessage('')
            }

            
        }
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
                <div className={styles.messages} ref={chatRef}>
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
                    <input type="text" className={styles.input} value={message} onChange={(e) => setMessage(e.target.value)}/>
                    <button className={`${styles.button} labelWithIcon`} onClick={sendMessage}>
                        <span className={`material-symbols-outlined`}>send</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow