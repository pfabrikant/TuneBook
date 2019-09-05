const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: "Death is part of life",
    maxAge: 1000 * 60 * 60 * 24 * 14
});
const db = require("./lib/db.js");
const bc = require("./lib/bc.js");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const s3 = require("./lib/s3.js");
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const fs = require("fs");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

// object of users obline, keys are userIds, values are arrays of socket IDs
const onlineUsers = {};

// boilerplate for renaming and storing files in the /uploads directory using multer and uidSafe
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//cookie session on app and socket
app.use(cookieParser());
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
///
app.use(bodyParser.json());
app.use(compression());
//csurf middleware
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use("/public/:fileName", (req, res) => {
    res.sendFile(__dirname + "/public/" + req.params.fileName);
});
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
});

app.get("/getUserInfo", async (req, res) => {
    try {
        const { rows } = await db.getUserInfo(req.session.loginId);
        req.session.first = rows.first;
        req.session.last = rows.last;
        req.session.avatarUrl = rows.avatarurl;
        console.log(rows[0]);
        res.json(rows[0]);
    } catch (err) {
        console.log("error in GET /getUserInfo: ", err.message);
    }
});

app.get("/api/users/:id", async (req, res) => {
    try {
        const { rows } = await db.getUserInfo(req.params.id);
        if (req.session.loginId == req.params.id) {
            res.json({ sameAsUserId: true });
        } else if (rows.length != 0) {
            res.json(rows[0]);
        } else {
            res.json({ validId: false });
        }
    } catch (err) {
        console.log("error in /api/users GET route: ", err.message);
        res.json({ validId: false });
    }
});
app.get("/recentUsers", async (req, res) => {
    try {
        const { rows } = await db.getRecentUsers();
        res.json(rows);
    } catch (err) {
        res.json({ error: true });
        console.log("error in /recentUsers GET: ", err.message);
    }
});
app.get("/friendshipStatus/:id", (req, res) => {
    db.getFriendshipStatus(req.params.id, req.session.loginId)
        .then(({ rows }) => {
            if (rows.length == 0) {
                res.json({ buttonMode: "Send Friendship Request" });
            } else if (
                rows[0].sender_id == req.params.id &&
                !rows[0].accepted
            ) {
                res.json({ buttonMode: "Accept Friendship Request" });
            } else if (
                rows[0].sender_id == req.session.loginId &&
                !rows[0].accepted
            ) {
                res.json({ buttonMode: "Cancel Friendship Request" });
            } else {
                res.json({ buttonMode: "End Friendship" });
            }
        })
        .catch(err => {
            console.log("error in GET /friendshipStatus: ", err.message);
        });
});

app.get("/register", (req, res) => {
    if (req.session.loginId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function(req, res) {
    if (!req.session.loginId) {
        res.redirect("/register");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    bc.getHash(req.body.password)
        .then(hash => {
            return db.insertUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hash
            );
        })
        .then(id => {
            req.session.loginId = id.rows[0].id;
            res.json({ loggedIn: true, userId: id.rows[0].id });
        })
        .catch(err => {
            console.log("error in POST /register: ", err.message);
            res.json({ loggedIn: false });
        });
});
app.post("/login", (req, res) => {
    let idInQuestion;
    db.getPassword(req.body.email)
        .then(result => {
            idInQuestion = result.rows[0].id;
            return bc.compareHash(req.body.password, result.rows[0].password);
        })
        .then(() => {
            req.session.loginId = idInQuestion;
            res.json({ loggedIn: true, userId: idInQuestion });
        })
        .catch(err => {
            console.log("Error in POST /login route: ", err.message);
            res.json({ loggedIn: false });
        });
});

app.post("/uploadAvatar", uploader.single("file"), s3.uploadS3, (req, res) => {
    if (req.file) {
        let url =
            "https://s3.amazonaws.com/image-board-spiced-pfabrikant/" +
            req.file.filename;
        db.uploadAvatar(req.session.loginId, url)
            .then(() => {
                res.json({
                    success: true,
                    avatarUrl: url
                });
                fs.promises.unlink(req.file.path);
            })
            .catch(err => {
                console.log("error in POST /uploadAvatar route: ", err.message);
                res.json({ success: false });
            });
    } else {
        res.json({ success: false });
    }
});
app.post("/updateProfile", (req, res) => {
    console.log(Object.keys(req.body)[0], Object.values(req.body)[0]);
    db.updateProfile(
        req.session.loginId,
        Object.keys(req.body)[0],
        Object.values(req.body)[0]
    )
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => {
            console.log("Error in POST /updateProfile: ", err.message);
            res.json({ success: false });
        });
});

app.post("/searchUsers", (req, res) => {
    db.searchUsers(req.body.searchKey)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            console.log("Error in POST / searchUsers route: ", err.message);
            res.json({ error: true });
        });
});
app.post("/searchInstrument", (req, res) => {
    db.searchInstrument(req.body.searchKey)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            console.log(
                "Error in POST / searchInstrument route: ",
                err.message
            );
            res.json({ error: true });
        });
});
app.post("/searchBand", (req, res) => {
    db.searchBand(req.body.searchKey)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            console.log("Error in POST / searchBand route: ", err.message);
            res.json({ error: true });
        });
});

app.post("/friendshipStatus", (req, res) => {
    if (req.body.buttonMode == "Send Friendship Request") {
        db.insertFriendship(req.session.loginId, req.body.id)
            .then(() => {
                res.json({ buttonMode: "Cancel Friendship Request" });
            })
            .catch(err => {
                console.log(
                    "Error in POST /friendshipStatus insertFriendship function: ",
                    err.message
                );
            });
    } else if (req.body.buttonMode == "Accept Friendship Request") {
        console.log("route runs with:  ", req.body.id, req.session.loginId);
        db.confirmFriendship(req.body.id, req.session.loginId)
            .then(() => {
                res.json({ buttonMode: "End Friendship" });
            })
            .catch(err => {
                console.log(
                    "Error in POST /friendshipStatus confirmFriendship function: ",
                    err.message
                );
            });
    } else if (req.body.buttonMode == "Cancel Friendship Request") {
        db.cancelFriendshipRequest(req.session.loginId, req.body.id)
            .then(() => {
                res.json({ buttonMode: "Send Friendship Request" });
            })
            .catch(err =>
                console.log(
                    "Error in POST /friendshipStatus cancelFriendshipRequest function: ",
                    err.message
                )
            );
    } else {
        db.deleteFriendship(req.session.loginId, req.body.id)
            .then(() => {
                res.json({ buttonMode: "Send Friendship Request" });
            })
            .catch(err =>
                console.log(
                    "Error in POST /friendshipStatus deleteFriendship function: ",
                    err.message
                )
            );
    }
});

server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});

/////////////////////////////
/////SOCKET/////////////////
////////////////////////////

io.on("connection", async function(socket) {
    // if user isn't logged in
    if (!socket.request.session) {
        return socket.disconnect(true);
    }
    // adding the new socket.id to the onlineUsers object
    if (onlineUsers[socket.request.session.loginId]) {
        onlineUsers[socket.request.session.loginId].push(socket.id);
    } else {
        onlineUsers[socket.request.session.loginId] = [socket.id];
    }
    // creatzing an array of online users' ids
    let arrOfOnlineIds = [];
    for (let user in onlineUsers) {
        if (onlineUsers[user].length > 0) {
            arrOfOnlineIds.push(Number(user));
        }
    }

    // list of 4 promises to be passed to Promise.All
    const usefulUserInformation = db.getUserInfo(
        socket.request.session.loginId
    );
    const chatMessages = db.getChatMessages();
    const onlineUsersPromise = db.getUsersInfo(arrOfOnlineIds);
    const privateMessages = db.getPrivateMessages(
        socket.request.session.loginId
    );
    const friends = db.getFriends(socket.request.session.loginId);

    var promiseAllResults;
    try {
        promiseAllResults = await Promise.all([
            usefulUserInformation,
            chatMessages,
            onlineUsersPromise,
            privateMessages,
            friends
        ]);
    } catch (err) {
        console.log("Error in promiseAll of socket: ", err);
    }
    // processing the results of Promise.all:
    // 1) fetch useful information about the user who opened the socket and add it to the request object
    const { rows } = promiseAllResults[0];
    socket.request.first = rows[0].first;
    socket.request.last = rows[0].last;
    socket.request.avatarUrl = rows[0].avatarurl;
    //  sending other users a heads-up if this socket belongs to a new user
    if (onlineUsers[socket.request.session.loginId].length == 1) {
        io.sockets.sockets[socket.id].broadcast.emit("newOnlineUser", {
            id: socket.request.session.loginId,
            avatarurl: socket.request.avatarUrl,
            first: socket.request.first,
            last: socket.request.last
        });
    }
    // sending the results of the 3 last promises in one emit
    socket.emit("initialInfo", promiseAllResults);

    ////////////////////////////////
    ////// EVENT HANDLERS //////////
    ////////////////////////////////

    // listen for new chat messages

    socket.on("messageSent", text => {
        db.addChatMessage(socket.request.session.loginId, text).then(
            ({ rows }) => {
                io.sockets.emit("newMessageAvailable", {
                    message: text,
                    messageid: rows[0].messageid,
                    usersid: rows[0].usersid,
                    created_at: rows[0].created_at,
                    first: socket.request.first,
                    last: socket.request.last,
                    avatarurl: socket.request.avatarUrl
                });
            }
        );
    });

    // listen for new private message
    socket.on("newPm", obj => {
        db.addPrivateMessage(obj.receiver_id, obj.sender_id, obj.message).then(
            ({ rows }) => {
                //make a list of all open sockets that belong to both sender and to receiver
                let arrOfSockets = [];

                if (
                    onlineUsers[obj.receiver_id] &&
                    onlineUsers[obj.receiver_id].length > 0
                ) {
                    onlineUsers[obj.receiver_id].forEach(socketId =>
                        arrOfSockets.push(socketId)
                    );
                } else {
                    db.pmUnseen(rows.id, false);
                }
                if (
                    onlineUsers[obj.sender_id] &&
                    onlineUsers[obj.sender_id].length > 0
                ) {
                    onlineUsers[obj.sender_id].forEach(socketId =>
                        arrOfSockets.push(socketId)
                    );
                }

                //emitting to this sockets
                arrOfSockets.forEach(socketId =>
                    io.to(socketId).emit("updateNewPm", {
                        receiver_id: obj.receiver_id,
                        sender_id: obj.sender_id,
                        message: obj.message,
                        id: rows[0].id,
                        created_at: rows[0].created_at,
                        avatarurl: obj.avatarurl,
                        first: obj.first,
                        last: obj.last
                    })
                );
            }
        );
    });
    socket.on("logout", () => {
        return socket.disconnect(true);
    });

    // when socket disconnects
    socket.on("disconnect", function() {
        onlineUsers[socket.request.session.loginId] = onlineUsers[
            socket.request.session.loginId
        ].filter(socketid => socketid != socket.id);
        if (onlineUsers[socket.request.session.loginId].length == 0) {
            io.sockets.emit("userWentOffline", socket.request.session.loginId);
        }
    });
});
