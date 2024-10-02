import styles from '../styles/navbar.module.css'
import ChangeAppMode from './ChangeAppMode'
import { Logout } from '../services/AuthAndKeyService'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../components/Context'
import { useContext, useState } from 'react'
import SearchUsers from './SearchUsers'
import ProfileModal from './ProfileModal'

function Navbar() {
    const navigate = useNavigate()
    const appContext = useContext(AppContext)

    return (<>
    {appContext.isSearchModalOpen && <SearchUsers closeWindow={() => appContext.setIsSearchModalOpen(false)} />}
    {appContext.isProfileModalOpen && <ProfileModal closeWindow={() => appContext.setIsProfileModalOpen(false)} userName={appContext.modalProfileUsername} isLoggedInUser={appContext.modalProfileIsLoggedInUser} /> }
    <div className={styles.navbar}>
        <div className={`${styles.logo} labelWithIcon`}>
            <span className="material-symbols-outlined">chat</span>
            <span>ChatApp</span>
        </div>
        <div className={styles.centerNavBar}>
            <div className={`${styles.navItem} labelWithIcon`}>
                <span className="material-symbols-outlined">home</span>
                <span className={styles.navBarLabel}>Home</span>
            </div>
            <div className={`${styles.navItem} labelWithIcon`} onClick={() => appContext.setIsSearchModalOpen(true)}>
                <span className="material-symbols-outlined">search</span>
                <span className={styles.navBarLabel}>Search</span>
            </div>
            <div className={`${styles.navItem} labelWithIcon`} onClick={() => {appContext.setIsProfileModalOpen(true); appContext.setModalProfileUsername(appContext.username); appContext.setModalProfileIsLoggedInUser(true);}}>
                <span className="material-symbols-outlined">account_circle</span>
                <span className={styles.navBarLabel}>Profile</span>
            </div>
            <div className={`${styles.navItem} labelWithIcon`} onClick={() => { Logout(); appContext.reset(); navigate('/login');}}>
                <span className="material-symbols-outlined">logout</span>
                <span className={styles.navBarLabel}>Logout</span>
            </div>
        </div>
        <ChangeAppMode></ChangeAppMode>
    </div>
    </>)
}

export default Navbar