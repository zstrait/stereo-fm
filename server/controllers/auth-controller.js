const { db } = require('../index.js');
const auth = require('../auth')
const bcrypt = require('bcryptjs')
const fs = require('fs');
const path = require('path');
const Playlist = require('../db/mongodb/models/playlist-model');
const Song = require('../db/mongodb/models/song-model');

getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        const loggedInUser = await db.getUserById(userId);
        if (!loggedInUser) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "User not found"
            });
        }

        return res.status(200).json({
            loggedIn: true,
            user: {
                userName: loggedInUser.userName,
                email: loggedInUser.email,
                avatar: loggedInUser.avatar
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await db.getUserByEmail(email);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                userName: existingUser.userName,
                email: existingUser.email,
                avatar: existingUser.avatar
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

registerUser = async (req, res) => {
    try {
        const { userName, email, password, passwordVerify, avatar } = req.body;

        if (!userName || !email || !password || !passwordVerify || !avatar) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }

        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }

        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        const savedUser = await db.createUser({ userName, email, passwordHash, avatar });
        const token = auth.signToken(savedUser._id);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                userName: savedUser.userName,
                email: savedUser.email,
                avatar: savedUser.avatar
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

updateUser = async (req, res) => {
    try {
        const userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(401).json({ errorMessage: "Unauthorized" });
        }

        const { email } = req.params;
        const { userName, password, passwordVerify, avatar } = req.body;

        if (!userName || !avatar) {
            return res.status(400).json({ errorMessage: "Please enter all required fields." });
        }

        let updateData = {
            userName: userName,
            avatar: avatar
        };

        if (password && password.length > 0) {
            if (password.length < 8) {
                return res.status(400).json({ errorMessage: "Please enter a password of at least 8 characters." });
            }
            if (password !== passwordVerify) {
                return res.status(400).json({ errorMessage: "Please enter the same password twice." });
            }

            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const passwordHash = await bcrypt.hash(password, salt);

            updateData.passwordHash = passwordHash;
        }

        const loggedInUser = await db.getUserById(userId);
        if (loggedInUser.email !== email) {
            return res.status(401).json({ errorMessage: "Unauthorized" });
        }

        const updatedUser = await db.updateUser(email, updateData);

        return res.status(200).json({
            success: true,
            user: {
                userName: updatedUser.userName,
                email: updatedUser.email,
                avatar: updatedUser.avatar
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

async function setupDemoAccount(demoUser) {
    const demoEmail = demoUser.email;

    await Playlist.deleteMany({ ownerEmail: demoEmail });
    await Song.deleteMany({ ownerEmail: demoEmail });
    demoUser.playlists = [];

    const dataPath = path.resolve(__dirname, '../test/data/demo/demoData.json');
    if (!fs.existsSync(dataPath)) throw new Error("Missing demoData.json at " + dataPath);
    const demoData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const playlistsToInsert = [];
    const createdSongsMap = new Map();

    for (const playlistDef of demoData.playlists) {
        const songIds = [];

        for (const songDef of playlistDef.songs) {
            const uniqueKey = `${songDef.title}-${songDef.artist}`;
            let songId;

            if (createdSongsMap.has(uniqueKey)) {
                songId = createdSongsMap.get(uniqueKey);
            } else {
                const newSong = await db.createSong({
                    title: songDef.title,
                    artist: songDef.artist,
                    year: songDef.year,
                    youTubeId: songDef.youTubeId,
                    ownerEmail: demoEmail,
                    listens: Math.floor(Math.random() * 50),
                    playlists: 1
                });
                songId = newSong._id;
                createdSongsMap.set(uniqueKey, songId);
            }
            songIds.push(songId);
        }

        songIds.sort(() => 0.5 - Math.random());

        playlistsToInsert.push({
            name: playlistDef.name,
            ownerEmail: demoEmail,
            ownerName: demoUser.userName,
            ownerAvatar: demoUser.avatar,
            songs: songIds,
            listenerIds: [],
            published: true
        });
    }

    const createdPlaylists = await Playlist.insertMany(playlistsToInsert);

    demoUser.playlists = createdPlaylists.map(p => p._id);
    await demoUser.save();
}

loginDemoUser = async (req, res) => {
    console.log("Attempting Demo Login...");
    try {
        const demoEmail = "demo@stereo.fm";

        let demoUser = await db.getUserByEmail(demoEmail);
        if (!demoUser) {
            console.log("Creating new Demo User...");
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash("demopassword", salt);

            const pfpPath = path.resolve(__dirname, '../test/data/demo/demo-pfp.png');
            let demoAvatar = "";
            if (fs.existsSync(pfpPath)) {
                demoAvatar = `data:image/png;base64,${fs.readFileSync(pfpPath).toString('base64')}`;
            }

            demoUser = await db.createUser({
                userName: "Demo User",
                email: demoEmail,
                passwordHash: passwordHash,
                avatar: demoAvatar
            });
        }

        await setupDemoAccount(demoUser);

        const token = auth.signToken(demoUser._id);
        console.log("Demo Login Successful");

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                userName: demoUser.userName,
                email: demoUser.email,
                avatar: demoUser.avatar
            }
        });

    } catch (err) {
        console.error("DEMO LOGIN ERROR:", err);
        res.status(500).json({ errorMessage: "Server Error: " + err.message });
    }
}

module.exports = {
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser,
    updateUser,
    loginDemoUser
}