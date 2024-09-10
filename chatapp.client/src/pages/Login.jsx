import styles from '../styles/auth.module.css'
import { useState, useContext } from 'react'
import { Login as login } from '../services/AuthService'
import { setToken } from '../services/TokenService'
import { AppContext } from '../components/Context'
import { useNavigate } from 'react-router-dom'
import ChangeAppMode from '../components/ChangeAppMode'

//login page component
export default function Login() {
    //app context
    const appContext = useContext(AppContext)

    //error message
    const [message, setMessage] = useState('')

    //login data from user
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate=useNavigate()

    const submitForm = async (e) => {
        e.preventDefault()
        let response = await login(email, password)
        if (response.success) {
            //we store token, private key and iv and salt to cookie
            //since we keep decrypted private key in ram, with each refresh it will be deleted
            //so we can read encrypted key from cookie and decrypt it
            setToken(response.token, response.stringData.privateEncryptedKey, response.stringData.iv, response.stringData.salt)
            appContext.setPrivateKey(response.privateKey)
            appContext.setEmail(response.email)
            appContext.setRoles(response.roles)
            console.log(response)
            navigate('/')
        }
        else {
            setMessage("Error with login.")
        }
    }

    //we return login form
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={submitForm}>
                <p className={styles.title}>Login</p>
                <div className={styles.group}>
                    <div className={styles.labelWithIcon}>
                        <span className="material-symbols-outlined">mail</span>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                    </div>
                    <input type="email" id="email" placeholder="Email" className={styles.input} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className={styles.group}>
                <div className={styles.labelWithIcon}>
                        <span className="material-symbols-outlined">password</span>
                        <label htmlFor="password" className={styles.label}>Password</label>
                    </div>
                    
                    <input type="password" id="password" placeholder="Password" className={styles.input} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit" className={styles.button}>Login</button>
                {message.length > 0 && <p className={styles.message}>{message}</p>}
                <p className={styles.linkContainer}>Don't have an account? <a className={styles.link} onClick={() => navigate('/register')}>Register</a></p>
                <div className={styles.group}>
                    <ChangeAppMode></ChangeAppMode>
                </div>
            </form>
        </div>
    )
}