import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Authorize from './components/Authorize'
import HomePage from './pages/HomePage'
import { Context } from './components/Context'

function App() {

    useEffect(() => {
    }, [])

    
    return (<>
    <Context>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Authorize><HomePage></HomePage></Authorize>} />
                <Route path="/login" element={<Login></Login>} />
                <Route path="/register" element={<Register></Register>} />
            </Routes>
        </BrowserRouter>
    </Context>
    </>)
    
    
}

export default App;