import styles from '../styles/convoList.module.css'
import userStyles from '../styles/user.module.css'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../components/Context'
import { getConversations, getConvoMessages } from '../services/ConvoService'
import { decryptMessage } from '../services/AuthAndKeyService'
import { getBlockedUsers, unblockUser } from '../services/UserService'

const formatDate = (date) => {
    const messageDate = new Date(date); // Convert input to a Date object (local time)
    const now = new Date(); // Current date in local time

    // Helper function to check if the given date is today
    const isToday = (someDate) => {
        return someDate.getDate() === now.getDate() &&
            someDate.getMonth() === now.getMonth() &&
            someDate.getFullYear() === now.getFullYear();
    };

    // Helper function to check if the given date is yesterday
    const isYesterday = (someDate) => {
        const yesterday = new Date(now); // Clone current date
        yesterday.setDate(now.getDate() - 1); // Move date back by one day
        return someDate.getDate() === yesterday.getDate() &&
            someDate.getMonth() === yesterday.getMonth() &&
            someDate.getFullYear() === yesterday.getFullYear();
    };

    // Format the time (HH:mm) for the local time zone
    const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Format the full date (with year, month, and day)
    const dateString = messageDate.toLocaleDateString();

    // Check if the date is today
    if (isToday(messageDate)) {
        return timeString; // Return only the time (e.g., "14:57")
    } 
    // Check if the date is yesterday
    else if (isYesterday(messageDate)) {
        return "Yesterday"; // Return "Yesterday" if the date matches yesterday
    } 
    // If the date is neither today nor yesterday, return the full date
    else {
        //replaces / with .
        return dateString.replace(/\//g, '.');; // Return the formatted date (e.g., "19.9.2024")
    }
};


export default function ConvoList() {

    const { privateKey, userKeys, setPrivateKey, conversations, setConversations, selectedConvo,
        setSelectedConvo, addUserKey, addPublicKeyIfNotPresent, username, isLoaded, setIsLoaded,
        convoMessages, setConvoMessages, addMessageToConvo, addConvo, changeLastMessage,
        blockedUsers, setBlockedUsers} = useContext(AppContext)

    const [filter, setFilter] = useState('')

    const [showBlockedUsers, setShowBlockedUsers] = useState(false)

    const displayName=(users)=>{
        return users.filter(user=>user.userName!==username).map(user=>user.userName).join(', ')
    }

    useEffect(() => {
        async function start() {
            if (conversations.length == 0){
                const response = await getConversations()
                if (response.success){
                    for (let i = 0; i < response.conversations.length; i++) {
                        for (let j = 0; j < response.conversations[i].otherConvoUsers.length; j++)
                            await addPublicKeyIfNotPresent(response.conversations[i].otherConvoUsers[j].userName, response.conversations[i].otherConvoUsers[j].publicKey)
                        response.conversations[i].lastMessage.message = await decryptMessage(privateKey, response.conversations[i].lastMessage.messageCrypted)
                        
                    }
                    setConversations(response.conversations)
                    console.log(response.conversations)
                    setIsLoaded(true)
                }
            }
        }

        
            start()
    }, [])

    const loadBlockedUsersIfNotLoaded = async () => {
        if (blockedUsers==null) {
            const response = await getBlockedUsers()
            if (response.success) {
                setBlockedUsers(response.blockedUsers)
            }
        }
    }
    const selectUserFromList = async (convoId) => {
        setSelectedConvo(convoId)
        if (convoMessages[convoId] == undefined){  
            let convoMessages_=await getConvoMessages(convoId)
            if (convoMessages_.success){
                for (let i = 0; i < convoMessages_.messages.length; i++) {
                    convoMessages_.messages[i].message = await decryptMessage(privateKey, convoMessages_.messages[i].encryptedMessage)
                }
            }
            console.log(convoMessages_)
            console.log(convoMessages)
            addConvo(convoId, convoMessages_.messages)
        }
        console.log(convoMessages)
    }

    if (!isLoaded) return null
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <div className={styles.title}>{showBlockedUsers ? 'Blocked Users' : 'Conversations'}</div>
                    <div className={styles.icons}>
                        <span className={`material-symbols-outlined ${styles.icon} ${!showBlockedUsers ? '': styles.hidden}`}>add_comment</span>
                        <span className={`material-symbols-outlined ${styles.icon} ${!showBlockedUsers ? '': styles.hidden}`}>group_add</span>
                        <span className={`material-symbols-outlined ${styles.icon}`} onClick={() => { loadBlockedUsersIfNotLoaded(); setShowBlockedUsers(!showBlockedUsers);}}>block</span>
                    </div>
                </div>
                <div className={`${styles.headerContainer} ${styles.searchContainer}`}>
                    <input type="text" placeholder="Search" className={styles.input} value={filter} onChange={(e) => setFilter(e.target.value)}/>
                    {filter.length > 0 && <span className='material-symbols-outlined' onClick={() => setFilter('')} style={{cursor: 'pointer'}}>close</span>}
                    {filter.length == 0 && <span className='material-symbols-outlined'>search</span>}
                </div>
            </div>
            <div className={styles.conversations}>
                {!showBlockedUsers && conversations
                .sort((a, b) => {
                    
                    if (!a.lastMessage && b.lastMessage) return -1;
                    if (a.lastMessage && !b.lastMessage) return 1;

                    
                    if (a.lastMessage && b.lastMessage) {
                        return new Date(b.lastMessage.messageSentAt) - new Date(a.lastMessage.messageSentAt);
                    }

                    return 0;
                })
                .map((conversation, index) => {
                    if (conversation==null || conversation.otherConvoUsers==null || !displayName(conversation.otherConvoUsers).includes(filter)) return <></>
                    return (
                        <div className={`${userStyles.user} ${selectedConvo === conversation.convoId ? userStyles.selected : ''}`} key={index} onClick={()=>selectUserFromList(conversation.convoId)}>
                            <div className={userStyles.leftContainer}>
                                <div className={userStyles.profilePic}>
                                    <img src="https://picsum.photos/200/300" alt="Placeholder Image" />
                                </div>
                                <div className={`${userStyles.userGroup}`}>
                                    <div className={userStyles.username}>{displayName(conversation.otherConvoUsers)}</div>
                                    <div className={userStyles.lastMessage}>
                                        {conversation.lastMessage && conversation.lastMessage.message ?
                                            <>
                                            {conversation.lastMessage.message.length > 20 
                                            ? conversation.lastMessage.message.substring(0, 17) + "..." 
                                            : conversation.lastMessage.message}
                                            </>
                                            :<></>
                                        }
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div className={userStyles.sentAt}>
                                <div>
                                    {conversation.lastMessage && conversation.lastMessage.message ?
                                        <>{formatDate(conversation.lastMessage.messageSentAt)}</>
                                        :<></>
                                    }
                                </div>
                                <div>
                                    {conversation.lastMessage && conversation.lastMessage.isRead ?
                                        <span className={`material-symbols-outlined ${userStyles.isRead}`}>check_circle</span>
                                        :<span className={`material-symbols-outlined ${userStyles.isNotRead}`}>notifications</span>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })
                }

                {showBlockedUsers && blockedUsers && blockedUsers.map((user, index) => {
                    if (!filter || filter.length == 0 || user.includes(filter))
                    return (
                        <div className={`${userStyles.unblockUser}`} key={index}>
                            <div className={userStyles.leftContainer}>
                                <div className={`${userStyles.userGroup}`}>
                                    <div className={userStyles.username}>{user}</div>
                                </div>
                            </div>
                            <div className={userStyles.unblockContainer}  onClick={() => unblockUser(user)}>
                                <p>Unblock user</p>
                                <span className={`material-symbols-outlined ${userStyles.icon}`} placeholder="unblock">block</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}