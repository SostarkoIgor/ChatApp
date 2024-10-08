import windowStyles from '../styles/window.module.css'
import userStyles from '../styles/user.module.css'
import { useState, useContext } from 'react'
import { getUsersByUsername } from '../services/UserService'
import { startConvo } from '../services/ConvoService'
import { AppContext } from '../components/Context'

function SearchUsers({closeWindow}) {
    const {conversations, addConversation, selectedConvo, setSelectedConvo, addPublicKeyIfNotPresent, deleteConvoMessages} = useContext(AppContext)
    const [searchValue, setSearchValue] = useState('')
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState('')
    const search = () => {
        getUsersByUsername(searchValue).then((response) => {
            if (response.success) {
                setUsers(response.users)
                setMessage('')
            }
            else {
                setMessage("Error fetching users.")
            }
        })
    }

    const startConversation = async (user) => {
        let convo = conversations.find(convo => {
            const userNames = convo.otherConvoUsers.map(user => user.userName);
            return userNames.includes(user) && userNames.length === 2;
        })
        if (convo !== undefined) {
            setSelectedConvo(convo.convoId)
            closeWindow()
            return
        }
        let response = await startConvo(user)
        if (response.success) {
            console.log(response)
            deleteConvoMessages(-1)
            addConversation(response.convo)
            setSelectedConvo(response.convo.convoId)
            await addPublicKeyIfNotPresent(response.convo.otherConvoUsers[0].userName, response.convo.otherConvoUsers[0].publicKey)
            await addPublicKeyIfNotPresent(response.convo.otherConvoUsers[1].userName, response.convo.otherConvoUsers[1].publicKey)
            console.log(conversations)
        }
        closeWindow()
    }

    return (
        <div className={windowStyles.window} onClick={()=>{}/*(e)=>{e.stopPropagation(); closeWindow();}*/}>
            <div className={windowStyles.container}>
                <div className={windowStyles.header}>
                    <div className={windowStyles.title}>Search Users</div>
                    <span className={`material-symbols-outlined ${windowStyles.close}`}  onClick={closeWindow}>close</span>
                </div>
                
                <div className={windowStyles.bigGroup}>
                    <input type="text" className={windowStyles.input} placeholder='Enter username' onChange={(e) => setSearchValue(e.target.value)}/>
                    <button className={`${windowStyles.button} labelWithIcon`} onClick={search}>
                        <span className={`material-symbols-outlined`}>search</span>
                        <span>Search</span>
                    </button>
                </div>
                {message.length>0 &&
                    <div className={windowStyles.message}>{message}</div>
                }
                <div className={windowStyles.users}>
                    {users.map((user) => {
                        return (
                            <div className={userStyles.user} key={user.username}>
                                <div></div>
                                <div className={userStyles.leftContainer}>
                                    <div className={userStyles.profilePic}>
                                        <img src="https://picsum.photos/200/300" alt="Placeholder Image" />
                                    </div>
                                    <div className={userStyles.username}>{user.username}</div>
                                </div>
                                <div className={userStyles.leftContainer}>
                                    <span className={`material-symbols-outlined ${userStyles.startConvo}`} title='Send message' onClick={() => startConversation(user.username)}>
                                        message
                                    </span>
                                    <span className={`material-symbols-outlined ${userStyles.blockUser}`} title='Block user'>block</span>
                                </div>
                                <div></div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SearchUsers