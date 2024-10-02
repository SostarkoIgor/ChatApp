import { useContext, useEffect } from 'react'
import { AppContext } from '../components/Context'
import { decryptMessage, encryptMessage, fetchUserKey } from '../services/AuthAndKeyService'
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
        return monthAndTimeWithoutYear.replace(/\//g, '.');
    } 
    else {
        // If it's a different year, return the full date
        return dateString.replace(/\//g, '.');;
    }
}



function ChatWindow() {
    const { privateKey, userKeys, setPrivateKey, conversations, 
        setConversations, selectedConvo, setSelectedConvo, addUserKey,
        username, convoMessages, setConvoMessages, addMessageToConvo, addConvo, sendMessageToConvoSigR,
        changeLastMessage, isProfileModalOpen, setIsProfileModalOpen, setModalProfileUsername, setModalProfileIsLoggedInUser
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
        console.log(selectedConvo_)
    

        for (let i = 0; i < selectedConvo_.otherConvoUsers.length; i++){
            if (userKeys[selectedConvo_.otherConvoUsers[i].userName] === undefined){
                let key=await fetchUserKey(selectedConvo_.otherConvoUsers[i].userName)
                userKeys[selectedConvo_.otherConvoUsers[i].userName]=key
            }
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
                console.log(selectedConvo_.otherConvoUsers[i].userName)
                sendMessageToConvoSigR(convoResponse.message, selectedConvo_.otherConvoUsers[i].userName);
            }
            if (convoResponse.success && selectedConvo_.otherConvoUsers[i].userName == username){
                convoResponse.message.message=message
                console.log(selectedConvo)
                console.log(selectedConvo_)
                addMessageToConvo(convoResponse.convoId, convoResponse.message);
                setSelectedConvo(convoResponse.convoId)
                changeLastMessage(convoResponse.convoId, {
                    message: message,
                    messageCrypted: encryptedMessage,
                    messageRead: true,
                    messageSentAt: convoResponse.message.sentAt
                })
            }
            if (convoResponse.success){
                setMessage('')
            }

            
        }
    }

    if (selectedConvo === null) {
        return (<div className={`${styles.emptyContainer} ${styles.hideWhenSmallScreen}`}>
            <p className={styles.title}>Select a conversation</p>
            <p className={styles.subtitle}>
                To get started, select a conversation or start a new one
                <br/>
                by searching for users by username
            </p>

        </div>)
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={`material-symbols-outlined ${styles.backArrow}`} onClick={() => setSelectedConvo(null)}>arrow_back</span>
                <div className={styles.profilePic}>
                    <img src="https://picsum.photos/200/300" alt="Placeholder Image" />
                </div>
                <div className={styles.username} onClick={() => {setModalProfileUsername(conversations.find(x => x.convoId == selectedConvo)?.otherConvoUsers.filter(user => user.userName != username)[0].userName); setModalProfileIsLoggedInUser(false); setIsProfileModalOpen(true); }}>                    
                    {conversations.find(x => x.convoId == selectedConvo)?.otherConvoUsers.filter(user => user.userName != username).map(user => user.userName)}
                </div>
            </div>
            <div className={styles.body}>
                <div className={styles.messages} ref={chatRef}>
                    {convoMessages[selectedConvo]?.map((message, index) => (
                        
                            
                            <div className={styles.messageContainer} key={index}>
                                
                                <div className={`${styles.message} ${message.senderUsername != username ? styles.messageFromOtherUser : styles.messageFromLoggedInUser}`}>
                                    {message.senderUsername != username &&
                                    <p className={styles.senderUsername}>{message.senderUsername}</p>}
                                    <div className={`${styles.messageContent} ${message.senderUsername != username ? styles.messageFromOtherUser : styles.messageFromLoggedInUser}`}>
                                        <div className={styles.messageText}> {message.message} </div>
                                        <div className={styles.messageTime}>{formatDate(message.sentAt)}</div>
                                    </div>
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