import { Link, useHistory } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../auth';

export default function WelcomeScreen() {
    const { auth } = useContext(AuthContext);
    const history = useHistory();

    const handleDemoLogin = () => {
        auth.loginDemoUser();
    }

    const handleGuestAccess = () => {
        if (auth.loggedIn) {
            auth.logoutUser("/songs/");
        } else {
            history.push("/songs/");
        }
    }

    return (
        <div className="welcome-container">
            <span className="welcome-title">StereoFM</span>
            <div className="welcome-logo"></div>

            <div className="welcome-buttons-container">
                <div className="welcome-buttons-row">
                    <Link to="/login" className="welcome-button">
                        Login
                    </Link>
                    <Link to="/register" className="welcome-button">
                        Create Account
                    </Link>
                </div>
                <div onClick={handleDemoLogin} className="welcome-button demo-button">
                    Use Demo Account
                </div>
                <div onClick={handleGuestAccess} className="guest-link">
                    Continue as Guest
                </div>

            </div>
        </div>
    )
}