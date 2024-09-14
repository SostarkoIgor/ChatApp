import { useEffect, useState, createContext } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Authorize from './components/Authorize'
import HomePage from './pages/HomePage'
import { Context } from './components/Context'
import ReenterPassword from './pages/ReenterPassword'


export const ThemeContext = createContext()

function App() {

    const [ darkMode, setDarkMode ] = useState(true)

    useEffect(() => {
        document.body.className = darkMode ? 'dark' : 'light'
    }, [darkMode])

    
    return (<>
    <Context>
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Authorize><HomePage></HomePage></Authorize>} />
                <Route path="/login" element={<Login></Login>} />
                <Route path="/register" element={<Register></Register>} />
                <Route path="/reenterPassword" element={<ReenterPassword></ReenterPassword>} />
            </Routes>
        </BrowserRouter>
        </ThemeContext.Provider>
    </Context>
    </>)
    
    
}

export default App;