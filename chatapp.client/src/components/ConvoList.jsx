import styles from '../styles/convoList.module.css'
import userStyles from '../styles/user.module.css'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../components/Context'
import { getConversations } from '../services/ConvoService'


export default function ConvoList() {

    const { privateKey, userKeys, setPrivateKey, conversations, setConversations, selectedConvo, setSelectedConvo } = useContext(AppContext)


    useEffect(() => {
        async function start() {
            if (conversations.length == 0){
                const response = await getConversations()
                if (response.success)
                    setConversations(response.conversations)
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
                                <div className={userStyles.username}>{conversation.otherConvoUsers[0].userName}</div>
                            </div>
                            <div className={userStyles.userGroup}>
                                <div className={userStyles.lastMessage}>
                                    {conversation.lastMessage}
                                </div>
                            </div>
                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}