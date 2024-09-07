import styles from '../styles/auth.module.css'
import { useState } from 'react'
import { Register as register } from '../services/AuthSerivce'
export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [description, setDescription] = useState('')
    const [email, setEmail] = useState('')

    const [message, setMessage] = useState('')

    const submitForm = async (e) => {
        e.preventDefault()
        let response = await register(username, password, firstName, lastName, description, email)
        if (response.success) {
            //window.location.href = '/login'
        }
        else {
            setMessage("Error registering.")
        }
        
    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={submitForm}>
                <h1>Register</h1>
                <div className={styles.group}>
                    <label htmlFor="username" className={styles.label}>Username</label>
                    <input type="text" placeholder="Username" id="username" className={styles.input} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className={styles.group}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input type="password" placeholder="Password" id="password" className={styles.input} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className={styles.group}>
                    <label htmlFor="firstName" className={styles.label}>First Name</label>
                    <input type="text" placeholder="First Name" id="firstName" className={styles.input} onChange={(e) => setFirstName(e.target.value)}/>
                </div>
                <div className={styles.group}>
                    <label htmlFor="lastName" className={styles.label}>Last Name</label>
                    <input type="text" placeholder="Last Name" id="lastName" className={styles.input} onChange={(e) => setLastName(e.target.value)}/>
                </div>
                <div className={styles.group}>
                    <label htmlFor="description" className={styles.label}>Description</label>
                    <input type="text" placeholder="Description" id="description" className={styles.input} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className={styles.group}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input type="email" placeholder="Email" id="email" className={styles.input} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className={styles.group}>
                    <button type="submit" className={styles.button}>Register</button>
                </div>
                <p className={styles.message}>{message}</p>
            </form>
        </div>
    )
}