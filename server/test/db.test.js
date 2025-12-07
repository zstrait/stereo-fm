import { beforeAll, beforeEach, afterEach, afterAll, expect, test } from 'vitest';
const { db } = require('../index.js');

/**
 * Executed once before all tests are performed.
 */
beforeAll(async () => {
    await db.connect();
});

/**
 * Executed before each test is performed.
 */
beforeEach(async () => {
    await db.clear();
});

/**
 * Executed after each test is performed.
 */
afterEach(() => {
});

/**
 * Executed once after all tests are performed.
 */
afterAll(async () => {
    await db.close();
});


// THE REST OF YOUR TEST SHOULD BE PUT BELOW

test('Test 1) Creating a new user', async () => {
    const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: `testuser_${Date.now()}@test.com`,
        passwordHash: 'testpassword'
    };
    const user = await db.createUser(userData);

    expect(user).toBeDefined();

    expect(user.firstName).toBe(userData.firstName);
    expect(user.lastName).toBe(userData.lastName);
    expect(user.email).toBe(userData.email);

    expect(user.id).toBeDefined();
    expect(user._id).toBeDefined();
    expect(String(user.id)).toEqual(String(user._id));
});


test('Test 2) Getting a user by email', async () => {
    const userData = {
        firstName: 'FindMe',
        lastName: 'ByEmail',
        email: `findme_${Date.now()}@test.com`,
        passwordHash: 'findmepass'
    };
    const user = await db.createUser(userData);
    const foundUser = await db.getUserByEmail(userData.email);

    expect(foundUser).toBeDefined();
    expect(String(foundUser.id)).toEqual(String(user.id));
    expect(foundUser.email).toBe(userData.email);
});


test('Test 3) Getting a user by ID', async () => {
    const userData = {
        firstName: 'FindMe',
        lastName: 'ByID',
        email: `findmebyid_${Date.now()}@test.com`,
        passwordHash: 'findmepass'
    };
    const user = await db.createUser(userData);
    const foundUser = await db.getUserById(user.id);

    expect(foundUser).toBeDefined();
    expect(String(foundUser.id)).toEqual(String(user.id));
    expect(foundUser.email).toBe(userData.email);
});


test('Test 4) Creating a new playlist', async () => {
    const userData = {
        firstName: 'Playlist',
        lastName: 'Owner',
        email: `owner_${Date.now()}@test.com`,
        passwordHash: 'ownerpass'
    };
    const user = await db.createUser(userData);
    const playlistData = {
        name: 'My Test Playlist',
        ownerEmail: user.email,
        songs: []
    };
    const playlist = await db.createPlaylist(playlistData, user);

    expect(playlist).toBeDefined();
    expect(playlist.name).toBe(playlistData.name);
    expect(playlist.ownerEmail).toBe(user.email);
    expect(playlist.songs.length).toBe(0);
    expect(playlist.id).toBeDefined();
});


test('Test 5) Getting a playlist by ID', async () => {
    const userData = {
        firstName: 'FindPlaylist',
        lastName: 'Owner',
        email: `findplaylist_${Date.now()}@test.com`,
        passwordHash: 'pw'
    };
    const user = await db.createUser(userData);
    const playlistData = {
        name: 'Playlist To Find',
        ownerEmail: user.email,
        songs: []
    };
    const playlist = await db.createPlaylist(playlistData, user);
    const foundPlaylist = await db.getPlaylistById(playlist.id);

    expect(foundPlaylist).toBeDefined();
    expect(String(foundPlaylist.id)).toEqual(String(playlist.id));
    expect(foundPlaylist.name).toBe(playlistData.name);
});


test('Test 6) Getting playlist pairs for a user', async () => {
    const userData = {
        firstName: 'Pairs',
        lastName: 'Owner',
        email: `pairs_${Date.now()}@test.com`,
        passwordHash: 'pw'
    };
    const user = await db.createUser(userData);
    const playlistData1 = {
        name: 'Playlist One',
        ownerEmail: user.email,
        songs: []
    };
    const p1 = await db.createPlaylist(playlistData1, user);
    const playlistData2 = {
        name: 'Playlist Two',
        ownerEmail: user.email,
        songs: []
    };
    const p2 = await db.createPlaylist(playlistData2, user);

    const pairs = await db.getPlaylistPairs(user);

    expect(pairs).toBeDefined();
    expect(pairs).toHaveLength(2);
    expect(pairs).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                name: 'Playlist One',
                _id: p1.id
            }),
            expect.objectContaining({
                name: 'Playlist Two',
                _id: p2.id
            })
        ])
    );
});


test('Test 7) Getting all playlists', async () => {
    const userData1 = {
        firstName: 'User',
        lastName: 'One',
        email: `userone_${Date.now()}@test.com`,
        passwordHash: 'pw1'
    };
    const user1 = await db.createUser(userData1);
    const playlistData1 = {
        name: 'User One Playlist',
        ownerEmail: user1.email,
        songs: []
    };
    await db.createPlaylist(playlistData1, user1);

    const userData2 = {
        firstName: 'User',
        lastName: 'Two',
        email: `usertwo_${Date.now()}@test.com`,
        passwordHash: 'pw2'
    };
    const user2 = await db.createUser(userData2);
    const playlistData2 = {
        name: 'User Two Playlist',
        ownerEmail: user2.email,
        songs: []
    };
    await db.createPlaylist(playlistData2, user2);

    const allPlaylists = await db.getPlaylists();

    expect(allPlaylists).toBeDefined();
    expect(allPlaylists).toHaveLength(2);
});


test('Test 8) Updating a playlist', async () => {
    const userData = {
        firstName: 'Update',
        lastName: 'Owner',
        email: `update_${Date.now()}@test.com`,
        passwordHash: 'pw'
    };
    const user = await db.createUser(userData);
    const playlistData = {
        name: 'Original Name',
        ownerEmail: user.email,
        songs: []
    };
    const playlist = await db.createPlaylist(playlistData, user);

    const updatedData = {
        name: 'Updated Name',
        ownerEmail: user.email,
        songs: [
            {
                title: 'New Song',
                artist: 'Test Artist',
                year: 2024,
                youTubeId: '123'
            }
        ]
    };

    await db.updatePlaylist(playlist.id, updatedData);
    const updatedPlaylist = await db.getPlaylistById(playlist.id);

    expect(updatedPlaylist).toBeDefined();
    expect(updatedPlaylist.name).toBe('Updated Name');
    expect(updatedPlaylist.songs).toHaveLength(1);
    expect(updatedPlaylist.songs[0].title).toBe('New Song');
});


test('Test 9) Deleting a playlist', async () => {
    const userData = {
        firstName: 'Delete',
        lastName: 'Owner',
        email: `delete_${Date.now()}@test.com`,
        passwordHash: 'pw'
    };
    const user = await db.createUser(userData);
    const playlistData = {
        name: 'Playlist To Delete',
        ownerEmail: user.email,
        songs: []
    };
    const playlist = await db.createPlaylist(playlistData, user);

    await db.deletePlaylist(playlist.id);

    const foundPlaylist = await db.getPlaylistById(playlist.id);

    expect(foundPlaylist).toBeNull();
});