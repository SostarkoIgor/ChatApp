import styles from '../styles/auth.module.css'
import { useState } from 'react'
import { Register as register } from '../services/AuthService'
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ChangeAppMode from '../components/ChangeAppMode'
export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [description, setDescription] = useState('')
    const [email, setEmail] = useState('')

    const [message, setMessage] = useState('')

    const navigate = useNavigate()

    const submitForm = async (e) => {
        e.preventDefault()
        let response = await register(username, password, firstName, lastName, description, email)
        if (response.success) {
            navigate('/login')
        }
        else {
            setMessage("Error registering.")
        }
        
    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={submitForm}>
                <p className={styles.title}>Register</p>
                <div className={styles.bigGroup}>
                    <div className={styles.group}>
                        <div className={styles.labelWithIcon}>
                            <span className="material-symbols-outlined">mood</span>
                            <label htmlFor="username" className={styles.label}>Username</label>
                        </div>
                        <input type="text" placeholder="Username" id="username" className={styles.input} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.labelWithIcon}>
                            <span className="material-symbols-outlined">key</span>
                            <label htmlFor="password" className={styles.label}>Password</label>
                        </div>
                        <input type="password" placeholder="Password" id="password" className={styles.input} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                </div>
                <div className={styles.bigGroup}>
                    <div className={styles.group}>
                        <div className={styles.labelWithIcon}>
                            <span className="material-symbols-outlined">person</span>
                            <label htmlFor="firstName" className={styles.label}>First Name</label>
                        </div>
                        <input type="text" placeholder="First Name" id="firstName" className={styles.input} onChange={(e) => setFirstName(e.target.value)}/>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.labelWithIcon}>
                            <span className="material-symbols-outlined">person</span>
                            <label htmlFor="lastName" className={styles.label}>Last Name</label>
                        </div>
                        <input type="text" placeholder="Last Name" id="lastName" className={styles.input} onChange={(e) => setLastName(e.target.value)}/>
                    </div>
                </div>
                <div className={styles.group}>
                    <div className={styles.labelWithIcon}>
                        <span className="material-symbols-outlined">description</span>
                        <label htmlFor="description" className={styles.label}>Description</label>
                    </div>
                    <input type="text" placeholder="Description" id="description" className={styles.input} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className={styles.group}>
                    <div className={styles.labelWithIcon}>
                        <span className="material-symbols-outlined">mail</span>
                        <label htmlFor="email" className={styles.label}>Email</label>
                    </div>
                    <input type="email" placeholder="Email" id="email" className={styles.input} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <button type="submit" className={styles.button}>Register</button>
                {message.length > 0 && <p className={styles.message}>{message}</p>}
                <p className={styles.linkContainer}>Already have an account? <a onClick={(e) => navigate('/login')} className={styles.link}>Login</a></p>
                <div className={styles.group}>
                    <ChangeAppMode />
                </div>
            </form>
        </div>
    )
}