import axios from "axios"

const source = "https://localhost:7109"

//method used to register a new user
export async function Register(Username, Password, FirstName, LastName, Description, Email) {
    //we generate a public and private key pair
    //other users use this public key to encrypt messages sent to this user, and user uses this private key to decrypt messages received from others
    const { publicKeyBase64, privateKeyBase64 } = await getAndFormatKey()

    //we encrypt the private key using symetric encryption with key derived from the password
    //this way we can encrypt the private key with the password in the future
    //we do this because private keys should never be stored in plain text, only user to whom im belongs should be able to decrypt and use it
    const { iv, encryptedPrivateKeyBase64, salt } = await encryptPrivateKey(privateKeyBase64, Password);
    let response
    try{
        //we call api enpoint for registration
        response = await axios.post(source+'/api/Auth/register', {
            Username: Username,
            Password: Password,
            FirstName: FirstName,
            LastName: LastName,
            Description: Description,
            Email: Email,
            PublicKey: publicKeyBase64,
            EncryptedPrivateKey: encryptedPrivateKeyBase64,
            IV: window.btoa(String.fromCharCode(... new Uint8Array(iv))),
            Salt: window.btoa(String.fromCharCode(... new Uint8Array(salt)))
            
        })
        return response.status
    }catch(err){
        console.log(err)
    }
}

//method that generates par of rsa keys
function generateKeyPair() {
    return window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]), // 65537
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    )
}

//formating keys in base64 string
async function formatKey(keyPair) {

    //exports key in specific format for private/public key and then encodes it into base64 string
    async function exportKey(key, isPrivate = false) {
        const exported = await window.crypto.subtle.exportKey(
            isPrivate ? "pkcs8" : "spki",
            key
        )

        return window.btoa(String.fromCharCode(...new Uint8Array(exported)))
    }

    const publicKeyBase64 = await exportKey(keyPair.publicKey, false);
    const privateKeyBase64 = await exportKey(keyPair.privateKey, true);
    return { publicKeyBase64, privateKeyBase64 };
}

//generates key pair and formats it to base64
async function getAndFormatKey() {
    const keyPair = await generateKeyPair();
    const { publicKeyBase64, privateKeyBase64 } = await formatKey(keyPair)
    return { publicKeyBase64, privateKeyBase64 }
}

//as private key can not be stored in plain text, we encrypt it using symetric encryption with key derived from the password
async function encryptPrivateKey(privateKeyBase64NotEncrypted, password) {
    //we generate random salt and use it to derive key from password
    const salt= generateRandomSalt()
    const derivedKey = await deriveKeyFromPassword(password, salt)
    //we encrypt private key with derived key, we ned iv for that
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encoder = new TextEncoder()
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        derivedKey,
        encoder.encode(privateKeyBase64NotEncrypted)
    )

    //console.log(encryptedData, privateKeyBase64NotEncrypted)
    return {
        iv: iv,
        //we convert encryptedData to base64 string
        encryptedPrivateKeyBase64: window.btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
        salt: salt
    }
}

//function for deriving key from password
async function deriveKeyFromPassword(password, salt) {

    const encoder = new TextEncoder()

    //we convert to bytes
    const passwordKey = encoder.encode(password)
    
    //we generate base key using password
    const baseKey = await window.crypto.subtle.importKey(
        'raw',
        passwordKey,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    )
    
    //we derive key from base key and salt
    const derivedKey = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
    )

    return derivedKey;
}

function generateRandomSalt() {
    return window.crypto.getRandomValues(new Uint8Array(16)); //we generate random salt
}
