import windowStyles from '../styles/window.module.css'
import { useState } from 'react'
import { getUsersByUsername } from '../services/UserService'
function SearchUsers({closeWindow}) {
    const [searchValue, setSearchValue] = useState('')
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState('')
    const search = () => {
        getUsersByUsername(searchValue).then((response) => {
            if (response.success) {
                console.log(response)
                setUsers(response.users)
                setMessage('')
            }
            else {
                setMessage("Error fetching users.")
            }
        })
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
                            <div className={windowStyles.user} key={user.username}>
                                <div className={windowStyles.userGroup}>
                                    <div className={windowStyles.profilePic}>
                                        <img src="https://picsum.photos/200/300" alt="Placeholder Image" />
                                    </div>
                                    <div className={windowStyles.username}>{user.username}</div>
                                </div>
                                <div className={windowStyles.userGroup}>
                                    <span className={`material-symbols-outlined ${windowStyles.action}`}>message</span>
                                    <span className={`material-symbols-outlined ${windowStyles.action}`}>block</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SearchUsers