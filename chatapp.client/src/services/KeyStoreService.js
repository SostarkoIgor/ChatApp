import Cookies from 'js-cookie'

export function getKey() {
    return Cookies.get('privateKey')
}

export function getIV(){
    return Cookies.get('iv')
}

export function getSalt(){
    return Cookies.get('salt')
}
