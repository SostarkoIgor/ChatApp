import { useContext } from 'react'
import { AppContext } from '../components/Context'
import { decryptMessage, encryptMessage } from '../services/AuthAndKeyService'
import styles from '../styles/chatWindow.module.css'
import { useState } from 'react'
import { sendMessageToConvo } from '../services/ConvoService'

function ChatWindow() {
    const { privateKey, userKeys, setPrivateKey, conversations, 
        setConversations, selectedConvo, setSelectedConvo, addUserKey,

    } = useContext(AppContext)

    const [message, setMessage] = useState('')

    const sendMessage = async () => {
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
            if (convoResponse.success &&selectedConvo==-1){
                selectedConvo_.convoId = convoResponse.convoId
            }
            
        }
        console.log(conversations)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>Chat</div>
            <div className={styles.body}>
                <input type="text" className={styles.input} onChange={(e) => setMessage(e.target.value)}/>
                <button className={styles.button} onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default ChatWindow