import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {

    useEffect(() => {
    }, [])

    
    return (<>
    
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register></Register>} />
                <Route path="/login" element={<Login></Login>} />
                <Route path="/register" element={<Register></Register>} />
            </Routes>
        </BrowserRouter>
    </>)
    
    
}

export default App;