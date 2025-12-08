import YouTube from 'react-youtube';

export default function YouTubePlayer({ videoId }) {
    const opts = {
        height: '219px',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    if (!videoId) {
        return <div style={{
            width: '100%',
            height: '219px',
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
        }}>
            (Select a Song to Play)
        </div>
    }

    return <YouTube videoId={videoId} opts={opts} />;
}