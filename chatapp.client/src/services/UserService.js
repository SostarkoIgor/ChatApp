import axios from "axios"
import { getToken } from "../services/TokenService"

const source = "https://localhost:7109"


export async function getUsersByUsername(userName) {
    try {
        let response = await axios.get(source + '/api/User/getUsers?userName='+userName, {
            headers: {
                Authorization: 'Bearer ' + getToken()
            }
        })
        return {
            success: true,
            users: response.data.users
        }
    } catch (error) {
        return {
            success: false
        }
    }
}

export async function getUserInfo(userName){
    try{
        let response = await axios.get(source + '/api/User/userInfo/'+userName, {
            headers: {
                Authorization: 'Bearer ' + getToken()
            }
        })
        return {
            success: true,
            userInfo: response.data
        }
    }
    catch(error){
        return {
            success: false
        }
    }
}

export async function blockUser(userName){
    try{
        let response = await axios.post(source + '/api/User/blockUser',
            {
                UserName: userName
            },
            {
            headers: {
                Authorization: 'Bearer ' + getToken()
            }
        })
        return {
            success: true
        }
    }
    catch(error){
        return {
            success: false
        }
    }
}