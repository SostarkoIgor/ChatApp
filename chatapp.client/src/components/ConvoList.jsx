import styles from '../styles/convoList.module.css'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../components/Context'
import { getConversations } from '../services/ConvoService'


export default function ConvoList() {

    const { privateKey, userKeys, setPrivateKey, conversations, setConversations } = useContext(AppContext)


    useEffect(() => {
        async function start() {
            const response = await getConversations()
            if (response.success)

                setConversations(response.conversations)


            console.log(conversations)
        }

        start()
    }, [])


    return (
        <div className={styles.container}>
            <div className={styles.title}>Conversations</div>
            <div className={styles.conversations}>
                {conversations.map((conversation, index) => {
                    return (
                        <div className={styles.conversation} key={index}>
                            <div className={styles.conversationGroup}>
                                <div className={styles.profilePic}>
                                    <img src="https://picsum.photos/200/300" alt="Placeholder Image" />
                                </div>
                                <div className={styles.username}>{conversation.otherConvoUsers[0].userName}</div>
                            </div>
                            <div className={styles.conversationGroup}>
                                <div className={styles.lastMessage}>
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