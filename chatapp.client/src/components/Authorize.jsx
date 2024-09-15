import { useContext, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isValidToken, getToken, removeToken } from '../services/TokenService'
import Navbar from '../components/Navbar'
import { AppContext } from '../components/Context'
import { extractEmail, extractRoles, extractUsername } from '../services/TokenService'
import { decryptPrivateKey } from '../services/AuthAndKeyService'
import { getIV, getSalt, getKey } from '../services/KeyStoreService'

function Authorize({ children }) {
  const { setPrivateKey, setRoles, setEmail, roles, email, privateKey, username, setUsername } = useContext(AppContext)
  const token = getToken()
  const key = getKey()
  const iv = getIV()
  const salt = getSalt()

  const navigate = useNavigate()

  useEffect(() => {
    async function start(){
      
      if (token && isValidToken(token)){
        if (email === null) setEmail(extractEmail(token))
        if (roles === null) setRoles(extractRoles(token))
        if (username === null) setUsername(extractUsername(token))
        if (key && salt && iv && privateKey === null){
          navigate('/reenterPassword')
        }
        else if (!key || !salt || !iv ){
          removeToken()
          navigate('/login')
        }
      }
    }

    start()
  }, [])

  if (token && isValidToken(token)){
    return (
    <>
      <Navbar/>
      {children}
    </>)
  }
  else{
    removeToken()
    return <Navigate to="/login" />
  }
}

export default Authorize