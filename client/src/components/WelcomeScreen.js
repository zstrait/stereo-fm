import { Link } from 'react-router-dom';

export default function WelcomeScreen() {
    return (
        <>
            <div className="welcome-container">
                <span className="welcome-title">Playlister</span>
                <div className="welcome-logo"></div>
                <div className="welcome-buttons-container">
                    <Link to="/" className="welcome-button">Continue as Guest</Link>
                    <Link to="/login" className="welcome-button">Login</Link>
                    <Link to="/register" className="welcome-button">Create Account</Link>
                </div>
            </div>
        </>
    )
}