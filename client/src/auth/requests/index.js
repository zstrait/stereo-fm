export const getLoggedIn = () => {
    return fetch('http://localhost:4000/auth/loggedIn/', {
        credentials: 'include',
    });
}
export const loginUser = (email, password) => {
    return fetch('http://localhost:4000/auth/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
}
export const logoutUser = () => {
    return fetch('http://localhost:4000/auth/logout/', {
        credentials: 'include',
    });
}

export const registerUser = (userName, email, password, passwordVerify, avatar) => {
    return fetch('http://localhost:4000/auth/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            userName: userName,
            email: email,
            password: password,
            passwordVerify: passwordVerify,
            avatar: avatar
        })
    });
}

export const updateUser = (email, userData) => {
    return fetch(`http://localhost:4000/auth/user/${email}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData)
    });
}

export const loginDemoUser = () => {
    return fetch('http://localhost:4000/auth/login-demo/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
}

const apis = {
    getLoggedIn,
    loginUser,
    loginDemoUser,
    logoutUser,
    registerUser,
    updateUser
}

export default apis
