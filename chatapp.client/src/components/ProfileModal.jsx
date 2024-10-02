import windowStyles from '../styles/window.module.css'
import styles from '../styles/userInfo.module.css'
import { useEffect, useState } from 'react'
import { getUserInfo } from '../services/UserService'

function ProfileModal({closeWindow, userName, isLoggedInUser}) {
    const [user, setUser] = useState({})
    useEffect(() => {
        function start() {
            getUserInfo(userName).then((response) => {
                if (response.success) {
                    setUser(response.userInfo)
                }
            })
        }
        start()
    }, [userName])
    if (user)
        return (
        <div className={windowStyles.window}>
            <div className={windowStyles.container}>
                <div className={windowStyles.header}>
                    <p className={`${windowStyles.title} ${styles.title}`}>Profile of {userName}</p>
                    <span className={`material-symbols-outlined ${windowStyles.close}`}  onClick={closeWindow}>close</span>
                </div>
                <div className={windowStyles.bigGroup}>
                    <div className={styles.profilePicture}>
                        <img src="https://picsum.photos/200/300" alt="Placeholder Image" />
                    </div>
                </div>
                <div className={styles.bigGroup}>
                    <div className={styles.left}>
                        <p className={styles.label}>Username:</p>
                        <p className={styles.label}>Email:</p>
                        <p className={styles.label}>First Name:</p>
                        <p className={styles.label}>Last Name:</p>
                        <p className={styles.label}>Description:</p>
                    </div>
                    <div className={styles.right}>
                        <p className={styles.value}>{user.userName}</p>
                        <p className={styles.value}>{user.email}</p>
                        <p className={styles.value}>{user.firstName}</p>
                        <p className={styles.value}>{user.lastName}</p>
                        <p className={styles.value}>{user.description}</p>
                    </div>
                </div>
                {!isLoggedInUser && <div className={`${styles.icon} ${styles.block}`}>
                    <p className={styles.label}>Block user</p>
                    <span className={`material-symbols-outlined`} onClick={closeWindow}>block</span>
                </div>}
                {isLoggedInUser && <div className={`${styles.icon} ${styles.edit}`}>
                    <p className={styles.label}>Edit your profile</p>
                    <span className={`material-symbols-outlined`} onClick={closeWindow}>edit</span>
                </div>}
            </div>
        </div>
    )
    else return null

}

export default ProfileModal