import ConvoList from '../components/ConvoList'
import styles from '../styles/homePage.module.css'
function HomePage() {
    return (<>
    <div className={styles.container}>
        <ConvoList></ConvoList>
    </div>
    </>)
}

export default HomePage