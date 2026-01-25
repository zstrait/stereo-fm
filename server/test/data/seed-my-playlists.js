const mongoose = require('mongoose');
const User = require('../../db/mongodb/models/user-model');
const Song = require('../../db/mongodb/models/song-model');
const Playlist = require('../../db/mongodb/models/playlist-model');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const MY_EMAIL = "zstraight82@gmail.com";
const DATA_FILE = "myPlaylists.json";

async function seedMyPlaylists() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to MongoDB...');

        const user = await User.findOne({ email: MY_EMAIL });
        if (!user) {
            console.error(`User with email ${MY_EMAIL} not found! Please register first.`);
            process.exit(1);
        }
        console.log(`Found user: ${user.userName}`);

        const dataPath = path.join(__dirname, DATA_FILE);
        if (!fs.existsSync(dataPath)) {
            console.error(`Data file not found at ${dataPath}`);
            process.exit(1);
        }
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        let playlistsAdded = 0;
        const createdSongsMap = new Map();

        for (const playlistDef of data.playlists) {
            console.log(`Creating playlist: ${playlistDef.name}...`);
            const songIds = [];

            for (const songDef of playlistDef.songs) {
                const uniqueKey = `${songDef.title}-${songDef.artist}`;
                let songId;

                if (createdSongsMap.has(uniqueKey)) {
                    songId = createdSongsMap.get(uniqueKey);
                } else {
                    let existingSong = await Song.findOne({
                        ownerEmail: MY_EMAIL,
                        title: songDef.title,
                        artist: songDef.artist
                    });

                    if (existingSong) {
                        songId = existingSong._id;
                    } else {
                        const newSong = await Song.create({
                            title: songDef.title,
                            artist: songDef.artist,
                            year: songDef.year,
                            youTubeId: songDef.youTubeId,
                            ownerEmail: MY_EMAIL,
                            listens: 0,
                            playlists: 1
                        });
                        songId = newSong._id;
                    }
                    createdSongsMap.set(uniqueKey, songId);
                }
                songIds.push(songId);
            }
            songIds.sort(() => 0.5 - Math.random());
            const playlist = new Playlist({
                name: playlistDef.name,
                ownerEmail: MY_EMAIL,
                ownerName: user.userName,
                ownerAvatar: user.avatar,
                songs: songIds,
                listenerIds: [],
                published: true,
            });

            const savedPlaylist = await playlist.save();
            user.playlists.push(savedPlaylist._id);

            await Song.updateMany({ _id: { $in: songIds } }, { $inc: { playlists: 1 } });

            playlistsAdded++;
        }

        await user.save();

        console.log(`Success! Added ${playlistsAdded} playlists to ${user.userName}.`);
        process.exit();

    } catch (error) {
        console.error("Error seeding playlists:", error);
        process.exit(1);
    }
}

seedMyPlaylists();