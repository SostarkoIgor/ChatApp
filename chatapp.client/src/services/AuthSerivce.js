import axios from "axios"

const source = "https://localhost:7109"
export async function Register(Username, Password, FirstName, LastName, Description, Email) {
    const { publicKeyBase64, privateKeyBase64NotEncrypted } = await getAndFormatKey();
    const { iv, encryptedData, salt } = await encryptPrivateKey(privateKeyBase64NotEncrypted, Password);

    console.log("Public Key (Base64):", publicKeyBase64);
    console.log("Encrypted Private Key (Base64):", window.btoa(String.fromCharCode(...new Uint8Array(encryptedData))));

    const response = await axios.post(source+'/api/auth/register', {
        Username: Username,
        Password: Password, // Lozinka se šalje zajedno sa šifrovanim privatnim ključem. Razmotrite sigurnosne aspekte!
        FirstName: FirstName,
        LastName: LastName,
        Description: Description,
        Email: Email,
        PublicKey: publicKeyBase64,
        EncryptedPrivateKey: window.btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
        IV: window.btoa(String.fromCharCode(...new Uint8Array(iv))),
        Salt: window.btoa(String.fromCharCode(...new Uint8Array(salt)))
    })

    return response.status
}


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
    );
}


async function formatKey(keyPair) {
    async function exportKey(key, isPrivate = false) {
        const exported = await window.crypto.subtle.exportKey(
            isPrivate ? "pkcs8" : "spki",
            key
        );

        return window.btoa(String.fromCharCode(...new Uint8Array(exported)));
    }

    const publicKeyBase64 = await exportKey(keyPair.publicKey, false);
    const privateKeyBase64 = await exportKey(keyPair.privateKey, true);
    return { publicKeyBase64, privateKeyBase64 };
}


async function getAndFormatKey() {
    const keyPair = await generateKeyPair();
    const { publicKeyBase64, privateKeyBase64 } = await formatKey(keyPair);
    return { publicKeyBase64, privateKeyBase64 };
}


async function encryptPrivateKey(privateKeyBase64NotEncrypted, password) {
    const salt= generateRandomSalt()
    const derivedKey = await deriveKeyFromPassword(password, salt)
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

    return {
        iv: iv,
        encryptedData: new Uint8Array(encryptedData),
        salt: salt
    }
}

async function deriveKeyFromPassword(password, salt) {
    const encoder = new TextEncoder();
    
    const passwordKey = encoder.encode(password);
    
    const baseKey = await window.crypto.subtle.importKey(
        'raw',
        passwordKey,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    
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
    );

    return derivedKey;
}

function generateRandomSalt() {
    return window.crypto.getRandomValues(new Uint8Array(16)); // Koristi slučajni salt
}
