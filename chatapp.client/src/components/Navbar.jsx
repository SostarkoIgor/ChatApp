import styles from '../styles/navbar.module.css'
import ChangeAppMode from './ChangeAppMode'
import { Logout } from '../services/AuthService'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    return (<>
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
            <div className={`${styles.navItem} labelWithIcon`}>
                <span className="material-symbols-outlined">search</span>
                <span className={styles.navBarLabel}>Search</span>
            </div>
            <div className={`${styles.navItem} labelWithIcon`}>
                <span className="material-symbols-outlined">account_circle</span>
                <span className={styles.navBarLabel}>Profile</span>
            </div>
            <div className={`${styles.navItem} labelWithIcon`} onClick={() => { Logout(); navigate('/login');}}>
                <span className="material-symbols-outlined">logout</span>
                <span className={styles.navBarLabel}>Logout</span>
            </div>
        </div>
        <ChangeAppMode></ChangeAppMode>
    </div>
    </>)
}

export default Navbar