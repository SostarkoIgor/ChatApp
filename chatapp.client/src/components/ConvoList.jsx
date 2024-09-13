import styles from '../styles/convoList.module.css'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../components/Context'
import { getConversations } from '../services/ConvoService'


export default function ConvoList() {
    const [conversations, setConversations] = useState(null)

    const { privateKey, userKeys, setPrivateKey } = useContext(AppContext)


    useEffect(() => {
        async function start() {
            setConversations(await getConversations())
        }

        start()
    }, [])


    return (
        <div className={styles.container}>
            <div className={styles.title}>Conversations</div>
            <div className={styles.conversations}>
                {conversations}
            </div>
        </div>
    )
}