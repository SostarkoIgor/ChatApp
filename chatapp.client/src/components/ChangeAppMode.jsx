import { useContext, useState } from "react"
import { ThemeContext } from "../App"
import styles from '../styles/modeToggle.module.css'
function ChangeAppMode() {

    const theme = useContext(ThemeContext)

    return (
        <>
            <div className={theme.darkMode ? styles.dark : styles.light} onClick={() => theme.setDarkMode(!theme.darkMode)}>
                
                <span className={"material-symbols-outlined"} style={{visibility: theme.darkMode ? 'hidden' : 'visible'}}>dark_mode</span> 
                
                <span className={"material-symbols-outlined"} style={{visibility: theme.darkMode ? 'visible' : 'hidden'}}>sunny</span>
                
            </div>
        </>
    )
}

export default ChangeAppMode