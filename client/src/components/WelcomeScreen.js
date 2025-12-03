export default function WelcomeScreen() {
    return (
        <>
            <div className="welcome-container">
                <span className="welcome-title">Playlister</span>
                <div className="welcome-logo"></div>
                <div className="welcome-buttons-container">
                    <button className="welcome-button">Continue as Guest</button>
                    <button className="welcome-button">Login</button>
                    <button className="welcome-button">Create Account</button>
                </div>
            </div>
        </>
    )
}