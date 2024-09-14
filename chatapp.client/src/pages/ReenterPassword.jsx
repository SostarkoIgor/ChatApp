import { decryptPrivateKey } from '../services/AuthAndKeyService'
import { getIV, getSalt, getKey } from '../services/KeyStoreService'
import { useState, useContext, useEffect } from 'react'
import styles from '../styles/auth.module.css'
import { AppContext } from '../components/Context'
import ChangeAppMode from '../components/ChangeAppMode'
import { extractEmail } from '../services/TokenService'
import { useNavigate } from 'react-router-dom'
function ReenterPassword() {

    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const [email, setEmail] = useState(null)

    useEffect(() => {
        async function start(){
            setEmail(extractEmail())
        }

        start()
    }, [])

    const navigate=useNavigate()

    const { setPrivateKey } = useContext(AppContext)
    const submitForm = async (e) => {
        e.preventDefault()
          if (password){
            try{
                let key_=await decryptPrivateKey(getKey(), password, getIV(), getSalt())
                setPrivateKey(key_)
                navigate('/')
            }
            catch(err){
                setMessage("Incorrect password!")
            }
          }
          else{
            setMessage("Enter password!")
          }
        
    }
    
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={submitForm}>
                <p className={styles.title}>Enter password</p>
                <div className={styles.group}>
                    <div className={styles.labelWithIcon}>
                        <span className="material-symbols-outlined">mail</span>
                        <label htmlFor="email" className={styles.label}>
                            For email:<br/> {email}
                        </label>
                    </div>
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
                <p className={styles.linkContainer}>Use another account? <a className={styles.link} onClick={() => navigate('/login')}>Login</a></p>
                <div className={`${styles.group} ${styles.changeMode}`}>
                    <ChangeAppMode />
                </div>
            </form>
        </div>
    )
}

export default ReenterPassword