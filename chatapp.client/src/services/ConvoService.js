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

        return {
            success: true,
            conversations: response.data
        }
    } catch (error) {
        return {
            success: false
        }
    }
}

export async function startConvo(userName) {
    try{
        let response = await axios.get(source + '/api/Conversations/'+userName, {
            headers: {
                Authorization: 'Bearer ' + getToken()
            }
        })
        return {
            success: true,
            convo: response.data
        }
    }
    catch(error){
        return {
            success: false
        }
    }
}

export async function sendMessageToConvo(message) {
    try{
        let response = await axios.post(source + '/api/Message', message, {
            headers: {
                Authorization: 'Bearer ' + getToken()
            }
        })
        return {
            success: true,
            convoId: response.data
        }
    }
    catch(error){
        return {
            success: false
        }
    }
}