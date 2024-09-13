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