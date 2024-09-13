import axios from "axios"
import { getToken } from "../services/TokenService"

const source = "https://localhost:7109"
export async function getConversations() {
    try {
        let response = await axios.get(source + '/api/Conversations', {
            headers: {
                Authorization: 'Bearer ' + getToken()
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
    }
}