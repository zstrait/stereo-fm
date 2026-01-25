const mongoose = require('mongoose');
const User = require('../../db/mongodb/models/user-model');
const Song = require('../../db/mongodb/models/song-model');
const Playlist = require('../../db/mongodb/models/playlist-model');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const songsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'songsData.json'), 'utf-8'));

const realisticUsernames = [
    'xXSilentKnightXx', 'NotoriousN8', 'ToxicWaffle', 'PixelatedDreams',
    'GhostInTheMachine', 'RamenNinja', 'LunarEclipse42', 'VoidWalker_',
    'NeonSamurai', 'FrozenPhoenix', 'TurboSquid', 'MysticViper',
    'QuantumLeap88', 'ShadowPuppet', 'ElectricJellyfish', 'RetroRanger',
    'VelvetThunder', 'NightmareKing', 'PhantomRider', 'LazyPenguin',
    'ObsidianWolf', 'InfiniteVoid', 'ToxicRose', 'HyperNova_',
    'SilverFox99', 'WickedWhisper', 'IronMaiden_', 'PsychoKitty',
    'VintageVandal', 'NeonGhost_', 'FrostbiteFury', 'VelvetVenom',
    'QuantumPhantom', 'LunarWolf_', 'TurboViper', 'MidnightRaven_',
    'ShadowHunter_', 'ElectricWizard', 'PhoenixRising_', 'GhostlyWhisper',
    'ToxicEnergy', 'NeonSpectre', 'VoidHunter_', 'FrozenFlame',
    'HyperWolf_', 'ObsidianKnight', 'InfiniteRose', 'SilverVenom',
    'WickedPhoenix', 'IronSpectre_', 'PsychoViper', 'VintagePhantom'
];

const playlistNamePatterns = [
    () => `${pickRandom(['My', 'The', 'Ultimate', 'Essential', 'Best'])} ${pickRandom(['Sunday', 'Monday', 'Weekend', 'Late Night', 'Morning', 'Evening'])} ${pickRandom(['Playlist', 'Mix', 'Vibes', 'Jams', 'Tunes'])}`,
    () => `${pickRandom(['Workout', 'Study', 'Driving', 'Cooking', 'Cleaning', 'Running', 'Gaming', 'Reading', 'Working', 'Coding'])} ${pickRandom(['Music', 'Beats', 'Soundtrack', 'Sessions', 'Playlist'])}`,
    () => `${pickRandom(['Chill', 'Sad', 'Happy', 'Angry', 'Calm', 'Energetic', 'Melancholy', 'Euphoric', 'Nostalgic', 'Dreamy'])} ${pickRandom(['Vibes', 'Feels', 'Mood', 'Energy', 'Moments', 'Hours'])}`,
    () => `${pickRandom(['Indie', 'Rock', 'Pop', 'Jazz', 'Electronic', 'Hip Hop', 'R&B', 'Country', 'Folk', 'Classical'])} ${pickRandom(['Essentials', 'Favorites', 'Classics', 'Gems', 'Deep Cuts', 'Discoveries'])}`,
    () => `${pickRandom(['Summer', 'Winter', 'Fall', 'Spring'])} ${pickRandom(['Vibes', 'Playlist', 'Feels', 'Soundtrack', 'Anthems', 'Essentials'])}`,
    () => `${pickRandom(['Rainy Day', 'Road Trip', 'Coffee Shop', 'Night Drive', 'Beach Day', 'Mountain Hike', 'City Lights', 'Sunset', 'Sunrise'])} ${pickRandom(['Playlist', 'Mix', 'Soundtrack', 'Vibes', 'Music'])}`,
    () => `${pickRandom(['Liked', 'Favorite', 'Best', 'Top', 'Recent'])} ${pickRandom(['Songs', 'Tracks', 'Tunes', 'Music', 'Jams'])}`,
    () => `${pickRandom(['Songs', 'Music', 'Tracks'])} ${pickRandom(['I Love', 'That Slap', 'On Repeat', 'I Cant Stop Playing', 'That Hit Different'])}`,
    () => `${pickRandom(['Late', 'Early', 'Midnight', '3am', 'Dawn'])} ${pickRandom(['Drives', 'Thoughts', 'Vibes', 'Sessions', 'Feelings'])}`,
    () => `${pickRandom(['Best of', 'Top Songs of', 'My', 'Favorite'])} ${2020 + Math.floor(Math.random() * 5)}`,
    () => pickRandom(['Repeat', 'Obsessed', 'Discovered', 'Rotation', 'Queue', 'Shuffle', 'Flow', 'Escape', 'Focus', 'Unwind', 'Hype', 'Relax', 'Explore', 'Discover'])
];

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getImageBase64 = (filePath) => {
    if (fs.existsSync(filePath)) {
        const imageBuffer = fs.readFileSync(filePath);
        return `data:image/png;base64,${imageBuffer.toString('base64')}`;
    }
    return "";
};

const usedUsernames = new Set();
const getUniqueUsername = () => {
    const available = realisticUsernames.filter(name => !usedUsernames.has(name));
    
    if (available.length === 0) {
        const base = pickRandom(realisticUsernames);
        let variation;
        let attempts = 0;
        do {
            variation = `${base}${getRandomInt(1, 999)}`;
            attempts++;
        } while (usedUsernames.has(variation) && attempts < 1000);
        usedUsernames.add(variation);
        return variation;
    }
    
    const chosen = pickRandom(available);
    usedUsernames.add(chosen);
    return chosen;
};

const usedPlaylistNames = new Set();
const getUniquePlaylistName = () => {
    let name;
    let attempts = 0;
    
    do {
        const generator = pickRandom(playlistNamePatterns);
        name = generator();
        attempts++;
        if (attempts > 50 && usedPlaylistNames.has(name)) {
            const suffixes = ['v2', 'v3', 'pt. 2', 'II', 'updated'];
            name = `${name} ${pickRandom(suffixes)}`;
        }
    } while (usedPlaylistNames.has(name) && attempts < 100);
    
    usedPlaylistNames.add(name);
    return name;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to MongoDB for Seeding...');

        await User.deleteMany({});
        await Song.deleteMany({});
        await Playlist.deleteMany({});
        console.log('Database Cleared.');

        const songsWithStats = songsData.map(song => ({
            ...song,
            listens: getRandomInt(0, 1000),
            playlists: 0,
            ownerEmail: "admin@stereo.fm" 
        }));
        
        const savedSongs = await Song.insertMany(songsWithStats);
        console.log(`Inserted ${savedSongs.length} Songs into the Catalog.`);


        const avatarPaths = [];
        const serverAvatarsDir = path.join(__dirname, 'avatars');
        console.log('Looking for avatars in:', serverAvatarsDir);
        for (let i = 1; i <= 10; i++) {
            const avatarPath = path.join(serverAvatarsDir, `avatar${i}.png`);
            if (fs.existsSync(avatarPath)) {
                avatarPaths.push(avatarPath);
                console.log(`Found: avatar${i}.png`);
            }
        }

        const clientAvatarsDir = path.join(__dirname, '../../../client/src/images/default-pfps');
        console.log('Looking for pfps in:', clientAvatarsDir);
        for (let i = 1; i <= 12; i++) {
            const pfpPath = path.join(clientAvatarsDir, `pfp${i}.png`);
            if (fs.existsSync(pfpPath)) {
                avatarPaths.push(pfpPath);
                console.log(`Found: pfp${i}.png`);
            }
        }
        
        if (avatarPaths.length === 0) {
            console.error('ERROR: No avatar images found! Please check the paths.');
            console.error('Script location:', __dirname);
            process.exit(1);
        }
        
        console.log(`Found ${avatarPaths.length} avatar images to distribute.`);

        const salt = await bcrypt.genSalt(10);
        const users = [];

        for (let i = 0; i < 20; i++) {
            const userName = getUniqueUsername();
            
            const avatarPath = pickRandom(avatarPaths);
            const avatarBase64 = getImageBase64(avatarPath);

            const user = new User({
                userName: userName,
                email: `${userName.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
                passwordHash: await bcrypt.hash("password123", salt),
                avatar: avatarBase64,
                playlists: []
            });

            const savedUser = await user.save();
            users.push(savedUser);
        }
        console.log(`Created ${users.length} Unique Users with realistic usernames.`);

        let totalPlaylists = 0;

        for (const user of users) {
            const numPlaylists = getRandomInt(2, 5);

            for (let i = 0; i < numPlaylists; i++) {
                const name = getUniquePlaylistName();
                const numSongs = getRandomInt(15, 120);
                const randomSongs = [...savedSongs].sort(() => 0.5 - Math.random()).slice(0, numSongs);
                const songIds = randomSongs.map(s => s._id);

                const playlist = new Playlist({
                    name: name,
                    ownerEmail: user.email,
                    ownerName: user.userName,
                    ownerAvatar: user.avatar,
                    songs: songIds,
                    listenerIds: [],
                    published: true,
                });

                const savedPlaylist = await playlist.save();
                user.playlists.push(savedPlaylist._id);
                
                await Song.updateMany({ _id: { $in: songIds } }, { $inc: { playlists: 1 } });
                
                totalPlaylists++;
            }
            await user.save();
        }

        console.log(`Finished creating ${totalPlaylists} unique playlists.`);
        console.log(`Playlist names used: ${usedPlaylistNames.size}`);
        console.log(`Usernames used: ${usedUsernames.size}`);
        console.log("Database Seeding Complete!");
        process.exit();

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seedDB();