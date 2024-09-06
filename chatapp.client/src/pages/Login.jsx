import styles from '../styles/auth.module.css'

export default function Login() {
    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <h1>Login</h1>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input type="email" placeholder="Email" className={styles.input}/>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input type="password" placeholder="Password" className={styles.input}/>
                <button type="submit" className={styles.button}>Login</button>
            </form>
        </div>
    )
}