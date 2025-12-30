import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import authRequestSender from './requests'

const AuthContext = createContext();

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await authRequestSender.getLoggedIn();
        if (response.status === 200) {
            const responseData = await response.json();
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: responseData.loggedIn,
                    user: responseData.user
                }
            });
        }
    }

    auth.registerUser = async function (userName, email, password, passwordVerify, avatar) {
        try {
            const response = await authRequestSender.registerUser(userName, email, password, passwordVerify, avatar);
            const responseData = await response.json();

            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: responseData.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                });
                history.push("/login");
                auth.loginUser(email, password);
            }
            else {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: auth.user,
                        loggedIn: false,
                        errorMessage: responseData.errorMessage
                    }
                });
            }
        } catch (error) {
            console.error("Network error during registration:", error);
        }
    }

    auth.updateUser = async function (email, userData) {
        try {
            const response = await authRequestSender.updateUser(email, userData);
            if (response.status === 200) {
                const responseData = await response.json();
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: true,
                        user: responseData.user
                    }
                });
                history.goBack();
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }

    auth.loginUser = async function (email, password) {
        try {
            const response = await authRequestSender.loginUser(email, password);
            const responseData = await response.json();

            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: responseData.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                })
                history.push("/");
            }
            else {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: auth.user,
                        loggedIn: false,
                        errorMessage: responseData.errorMessage
                    }
                })
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    auth.logoutUser = async function () {
        const response = await authRequestSender.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };