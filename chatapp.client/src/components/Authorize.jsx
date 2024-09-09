import { useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { isValidToken, getToken, removeToken } from '../services/TokenService'
import Navbar from '../components/Navbar'
import { AppContext } from '../components/Context'
import { extractEmail, extractRoles } from '../services/TokenService'
import { decryptPrivateKey } from '../services/AuthService'
import { getIV, getSalt, getKey } from '../services/KeyStoreService'

function Authorize({ children }) {
  const { setPrivateKey, setRoles, setEmail, roles, email, privateKey } = useContext(AppContext)
  const token = getToken()
  const key = getKey()
  const iv = getIV()
  const salt = getSalt()

  useEffect(() => {
    async function start(){
      
      if (token && isValidToken(token)){
        if (email === null) setEmail(extractEmail(token))
        if (roles === null) setRoles(extractRoles(token))
        if (key && salt && iv && privateKey === null){
          let password=window.prompt("Please enter your password")
          if (password){
            let key_=await decryptPrivateKey(key, password, iv, salt)
            setPrivateKey(key_)
          }
        }
        else if (!key || !salt || !iv ){
          removeToken()
          window.location.href = '/login'
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