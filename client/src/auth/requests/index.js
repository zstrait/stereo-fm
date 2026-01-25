export const getLoggedIn = () => {
    return fetch('https://stereofm-backend.onrender.com/auth/loggedIn/', {
        credentials: 'include',
    });
}
export const loginUser = (email, password) => {
    return fetch('https://stereofm-backend.onrender.com/auth/login/', {
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
    return fetch('https://stereofm-backend.onrender.com/auth/logout/', {
        credentials: 'include',
    });
}

export const registerUser = (userName, email, password, passwordVerify, avatar) => {
    return fetch('https://stereofm-backend.onrender.com/auth/register/', {
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
    return fetch(`https://stereofm-backend.onrender.com/auth/user/${email}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData)
    });
}

export const loginDemoUser = () => {
    return fetch('https://stereofm-backend.onrender.com/auth/login-demo/', {
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
