import styles from '../styles/auth.module.css'
import { useState } from 'react'
import { Login as login } from '../services/AuthSerivce'

export default function Login() {
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitForm = async (e) => {
        e.preventDefault()
        let response = await login(email, password)
        if (response.success) {
            //window.location.href = '/'
            console.log(response)
        }
        else {
            setMessage("Error with login.")
        }
    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={submitForm}>
                <h1>Login</h1>
                <div className={styles.group}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input type="email" id="email" placeholder="Email" className={styles.input} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className={styles.group}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input type="password" id="password" placeholder="Password" className={styles.input} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit" className={styles.button}>Login</button>
            </form>
        </div>
    )
}