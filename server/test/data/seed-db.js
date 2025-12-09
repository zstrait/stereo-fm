const mongoose = require('mongoose');
const User = require('../../db/mongodb/models/user-model');
const Song = require('../../db/mongodb/models/song-model');
const Playlist = require('../../db/mongodb/models/playlist-model');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'usersData.json'), 'utf-8'));
const songsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'songsData.json'), 'utf-8'));

async function seedDB() {
    try {
        await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
        console.log('Connected to MongoDB for Seeding...');

        // clear db 
        await User.deleteMany({});
        await Song.deleteMany({});
        await Playlist.deleteMany({});
        console.log('Database Cleared.');

        // create users 
        const salt = await bcrypt.genSalt(10);
        const avatarsDir = path.join(__dirname, 'avatars');
        const userMap = new Map();

        for (let i = 0; i < usersData.length; i++) {
            const userData = usersData[i];
            const passwordHash = await bcrypt.hash(userData.password, salt);

            const imageIndex = (i % 10) + 1;
            const imagePath = path.join(avatarsDir, `avatar${imageIndex}.png`);

            let avatarBase64 = "";
            try {
                if (fs.existsSync(imagePath)) {
                    const imageBuffer = fs.readFileSync(imagePath);
                    avatarBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
                } else {
                    console.warn(`Warning: ${imagePath} not found.`);
                }
            } catch (err) {
                console.error(`Error reading ${imagePath}:`, err);
            }

            const user = new User({
                userName: userData.userName,
                email: userData.email,
                passwordHash: passwordHash,
                avatar: avatarBase64
            });

            const savedUser = await user.save();
            userMap.set(savedUser.email, savedUser);
        }
        console.log(`Created ${usersData.length} Users.`);

        // create songs (Your code, with one addition)
        const catalogSongs = await Song.insertMany(songsData);
        console.log(`Inserted ${songsData.length} Songs into the Catalog.`);

        // create playlists
        for (const user of userMap.values()) {
            const numPlaylists = Math.floor(Math.random() * 3) + 2;

            for (let i = 1; i <= numPlaylists; i++) {
                const numSongsInPlaylist = Math.floor(Math.random() * 121) + 10;
                const randomSongs = catalogSongs.sort(() => 0.5 - Math.random()).slice(0, numSongsInPlaylist);
                const songIds = randomSongs.map(s => s._id);

                const playlist = new Playlist({
                    name: `${user.userName}'s Mix #${i}`,
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
            }
            await user.save();
        }

        console.log(`Finished creating playlists.`);
        console.log("Database Seeding Complete!");
        process.exit();

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seedDB();