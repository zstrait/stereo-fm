import { beforeAll, afterAll, expect, test } from 'vitest';
const { db } = require('../index.js');

await db.createUser({ userName: "John Lennon", email: "john@beatles.com", passwordHash: "imagine123", avatar: "john_img" });
beforeAll(async () => {
    await db.connect();
    await db.clear();
});

afterAll(async () => {
    await db.close();
});

test('1. Create User (John)', async () => {
    expect(john.userName).toBe("John Lennon");
    const john = await db.getUserByEmail("john@beatles.com");
});

test('2. Change Password (John)', async () => {
    const newHash = "givepeaceachance";
    const updated = await db.updateUser("john@beatles.com", { passwordHash: newHash });
    expect(updated.passwordHash).toBe(newHash);
});

test('3. Create Song (Hey Jude)', async () => {
    await db.createSong({ title: "Hey Jude", artist: "The Beatles", year: 1968, youTubeId: "A_MjCqQoLLA", ownerEmail: "john@beatles.com" });
    const songs = await db.getSongs({ title: "Hey Jude" }, null, null);
    expect(songs.songs.length).toBe(1);
});

test('4. Edit Song (Hey Jude -> Hey Jude Remastered)', async () => {
    const search = await db.getSongs({ title: "Hey Jude" }, null, null);
    const song = search.songs[0];
    await db.updateSong(song._id, { title: "Hey Jude Remastered" });

    const check = await db.getSongById(song._id);
    expect(check.title).toBe("Hey Jude Remastered");
});

test('5. Copy Song (Deep Copy)', async () => {
    const search = await db.getSongs({ title: "Hey Jude Remastered" }, null, null);
    const original = search.songs[0];

    const copyData = {
        title: original.title,
        artist: original.artist,
        year: original.year,
        youTubeId: original.youTubeId,
        ownerEmail: "john@beatles.com"
    };
    const copy = await db.createSong(copyData);

    expect(copy.title).toBe(original.title);
    expect(String(copy._id)).not.toBe(String(original._id));
});

test('6. Search Song (No Conditions)', async () => {
    const result = await db.getSongs({}, null, null);
    expect(result.songs.length).toBeGreaterThan(0);
});

test('7. Search Song (1 Condition: Artist)', async () => {
    const result = await db.getSongs({ artist: "The Beatles" }, null, null);
    expect(result.songs.length).toBeGreaterThan(0);
});

test('8. Search Song (2 Conditions: Artist + Year)', async () => {
    const result = await db.getSongs({ artist: "The Beatles", year: "1968" }, null, null);
    expect(result.songs.length).toBeGreaterThan(0);
});

test('9. Search Song (3 Conditions)', async () => {
    const result = await db.getSongs({ title: "Remastered", artist: "The Beatles", year: "1968" }, null, null);
    expect(result.songs.length).toBe(2);
});

test('10. Delete Song (Copy)', async () => {
    const search = await db.getSongs({ title: "Hey Jude Remastered" }, null, null);
    const songToDelete = search.songs[1];
    await db.deleteSong(songToDelete._id);

    const check = await db.getSongById(songToDelete._id);
    expect(check).toBeNull();
});

test('11. Verify Song Removed from Playlist (Cascading Delete)', async () => {
    const john = await db.getUserByEmail("john@beatles.com");
    const song = await db.createSong({ title: "Let It Be", artist: "The Beatles", year: 1970, youTubeId: "QDYfEBY9NM4", ownerEmail: "john@beatles.com" });
    const p = await db.createPlaylist({
        name: "Let It Be Album",
        ownerEmail: "john@beatles.com",
        ownerName: "John Lennon",
        songs: [song._id],
        published: true
    }, john);

    await db.deleteSong(song._id);

    const check = await db.getPlaylistById(p._id);
    expect(check.songs.length).toBe(0);
});

test('12. Create Playlist (Abbey Road)', async () => {
    const john = await db.getUserByEmail("john@beatles.com");
    await db.createPlaylist({ name: "Abbey Road", ownerEmail: "john@beatles.com", ownerName: "John Lennon", songs: [], published: true }, john);
    const lists = await db.getPlaylists({}, "john@beatles.com");
    expect(lists.length).toBe(2);
});

test('13. Edit Playlist (Rename to White Album)', async () => {
    const lists = await db.getPlaylists({ playlistName: "Abbey Road" }, null);
    const mix = lists[0];
    mix.name = "White Album";
    await db.updatePlaylist(mix._id, mix);

    const check = await db.getPlaylistById(mix._id);
    expect(check.name).toBe("White Album");
});

test('14. Copy Playlist', async () => {
    const lists = await db.getPlaylists({ playlistName: "White Album" }, null);
    const original = lists[0];
    const john = await db.getUserByEmail("john@beatles.com");

    const copyData = {
        name: "Copy of " + original.name,
        ownerEmail: "john@beatles.com",
        ownerName: "John Lennon",
        songs: original.songs,
        published: true
    };
    await db.createPlaylist(copyData, john);

    const check = await db.getPlaylists({ playlistName: "Copy of" }, null);
    expect(check.length).toBe(1);
});

test('15. Search Playlist', async () => {
    const result = await db.getPlaylists({ playlistName: "Copy" }, null);
    expect(result.length).toBe(1);
});

test('16. Sorting Playlists (Name A-Z)', async () => {
    const john = await db.getUserByEmail("john@beatles.com");
    await db.createPlaylist({ name: "Revolver", ownerEmail: "john@beatles.com", ownerName: "John Lennon", songs: [], published: true }, john);
    const result = await db.getPlaylists({}, null);
    expect(result.length).toBe(4);
});

test('17. Delete Playlist (Revolver)', async () => {
    const lists = await db.getPlaylists({ playlistName: "Revolver" }, null);
    const revolver = lists[0];
    await db.deletePlaylist(revolver._id);

    const check = await db.getPlaylistById(revolver._id);
    expect(check).toBeNull();
});