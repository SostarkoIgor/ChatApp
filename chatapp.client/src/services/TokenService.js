import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

//checks if token is expired and valid
export function isValidToken(token) {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (e) {
        return false;
    }
}

//sets token in cookies
export function setToken(token, encryptedPrivateKeyBase64, ivBase64, saltBase64) {
    try {
        const decoded = jwtDecode(token);
        const expires = new Date(decoded.exp * 1000);
        Cookies.set('token', token, {
            expires: expires, //cookie expires when token does
            secure: true,
            sameSite: 'Strict',
        });
        Cookies.set('privateKey', encryptedPrivateKeyBase64, {
            expires: expires, //cookie expires when token does
            secure: true,
            sameSite: 'Strict',
        });
        Cookies.set('iv', ivBase64, {
            expires: expires, //cookie expires when token does
            secure: true,
            sameSite: 'Strict',
        });
        Cookies.set('salt', saltBase64, {
            expires: expires, //cookie expires when token does
            secure: true,
            sameSite: 'Strict',
        });
    } catch (e) {
        console.error('Invalid token, cannot set cookie.');
    }
}

//fetch token
export function getToken() {
    return Cookies.get('token');
}

//delete token
export function removeToken() {
    Cookies.remove('token');
    Cookies.remove('privateKey');
    Cookies.remove('iv');
    Cookies.remove('salt');
}

//extracts mail from token
export function extractEmail() {
    try {
        const decoded = jwtDecode(getToken());
        return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
    } catch (e) {
        return null;
    }
}

//extracts roles from token
export function extractRoles() {
    try {
        const decoded = jwtDecode(getToken());
        return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (e) {
        return null;
    }
}
