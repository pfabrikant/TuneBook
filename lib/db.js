//module with methods to update and retrieve data from POSTGRESQL DATABASE_URL

var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/tunebook"
);

exports.insertUser = function(first, last, email, password) {
    return db.query(
        "INSERT INTO users (first,last,email,password) VALUES ($1,$2,$3,$4) RETURNING id",
        [first, last, email, password]
    );
};
exports.getPassword = function(email) {
    return db.query(`SELECT id, password FROM users WHERE email='${email}'`);
};
exports.getUserInfo = function(id) {
    return db.query(`SELECT * FROM users WHERE id= ${id}`);
};
exports.uploadAvatar = function(id, url) {
    return db.query(`UPDATE users SET avatarUrl = '${url}' WHERE id = ${id}`);
};
exports.updateProfile = function(id, column, value) {
    return db.query(`Update users set ${column} = '${value}' WHERE id = ${id}`);
};
exports.getRecentUsers = function() {
    return db.query(
        "SELECT id, first, last, avatarUrl FROM users ORDER BY id DESC LIMIT 3"
    );
};
exports.searchUsers = function(key) {
    return db.query(
        "SELECT id, first, last, avatarUrl FROM users WHERE first ILIKE $1 OR last ILIKE $1",
        [key + "%"]
    );
};
exports.searchInstrument = function(key) {
    return db.query(
        "SELECT id, first, last, avatarUrl FROM users WHERE instrument ILIKE $1",
        ["%" + key + "%"]
    );
};

exports.searchBand = function(key) {
    return db.query(
        "SELECT id, first, last, avatarUrl FROM users WHERE band ILIKE $1",
        ["%" + key + "%"]
    );
};
exports.getFriendshipStatus = function(owner_id, viewer_id) {
    return db.query(
        "SELECT * FROM friendships WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1)",
        [owner_id, viewer_id]
    );
};
exports.insertFriendship = function(sender, receiver) {
    return db.query(
        `INSERT INTO friendships (sender_id,receiver_id) VALUES (${sender}, ${receiver})`
    );
};
exports.confirmFriendship = function(sender, receiver) {
    return db.query(
        `UPDATE friendships SET accepted = true WHERE receiver_id=${receiver} AND sender_id=${sender}`
    );
};
exports.cancelFriendshipRequest = function(sender, receiver) {
    return db.query(
        `DELETE FROM friendships WHERE sender_id=${sender} AND receiver_id=${receiver}`
    );
};
exports.deleteFriendship = function(firstId, secondId) {
    return db.query(
        `DELETE FROM friendships WHERE (receiver_id=${firstId} AND sender_id=${secondId}) OR (receiver_id=${secondId} AND sender_id=${firstId})`
    );
};
exports.getFriends = function(id) {
    return db.query(`SELECT users.id, first, last, avatarUrl, accepted, sender_id, receiver_id
         FROM friendships
         JOIN users
        ON (accepted = false AND receiver_id= ${id} AND sender_id=users.id)
OR (accepted = false AND sender_id=${id} AND receiver_id=users.id)
        OR (accepted = true AND sender_id=${id} AND receiver_id=users.id)
        OR (accepted = true AND receiver_id =${id} AND sender_id=users.id)`);
};
exports.getChatMessages = function() {
    return db.query(`SELECT message,chatMessages.created_at, first,last, avatarUrl, chatMessages.id AS messageId, users.id AS usersId
         FROM chatMessages
         JOIN users ON sender_id=users.id ORDER BY chatMessages.id DESC LIMIT  10`);
};
exports.addChatMessage = function(id, text) {
    return db.query(
        `INSERT INTO chatMessages (sender_id,message) Values ($1,$2) RETURNING id AS messageId, sender_id AS usersId, created_at`,
        [id, text]
    );
};
exports.getUsersInfo = function(arr) {
    return db.query(
        `SELECT id, avatarUrl, first,last FROM users WHERE id= ANY($1)`,
        [arr]
    );
};
exports.getPrivateMessages = function(id) {
    return db.query(`SELECT privateMessages.id, users.id AS user_id, receiver_id, message,  avatarUrl, first, last, privateMessages.created_at, seen FROM privateMessages
                    JOIN users
                    ON (sender_id=users.id AND (receiver_id=${id} OR sender_id=${id}))
                    ORDER BY privateMessages.id ASC`);
};
exports.addPrivateMessage = function(receiver, sender, text) {
    return db.query(
        `INSERT INTO privateMessages (receiver_id, sender_id, message) VALUES ($1, $2, $3) RETURNING id, created_at`,
        [receiver, sender, text]
    );
};
exports.pmUnseen = function(id, bool) {
    return db.query(
        `UPDATE privateMessages SET seen = '${bool}' WHERE id = ${id}`
    );
};
