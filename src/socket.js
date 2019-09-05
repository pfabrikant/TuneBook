// a module exporting a method that initializes a socket on client's side

import * as io from "socket.io-client";
import {
    updateChatMessages,
    addChatMessage,
    addOnlineUsers,
    removeOnlineUser,
    addNewOnlineUser,
    updatePrivateMessages,
    updateLoggedinUserDetails,
    getFriends,
    updateNewPm
} from "./actions";

export let socket;
export function initializeSocket(store) {
    if (!socket) {
        socket = io.connect();
    }

    socket.on("initialInfo", async arr => {
        store.dispatch(updateLoggedinUserDetails(arr[0]));
        store.dispatch(updateChatMessages(arr[1]));
        store.dispatch(addOnlineUsers(arr[2]));
        store.dispatch(updatePrivateMessages(arr[3]));
        store.dispatch(getFriends(arr[4]));
    });

    socket.on("newMessageAvailable", data => {
        store.dispatch(addChatMessage(data));
    });

    socket.on("userWentOffline", id => {
        store.dispatch(removeOnlineUser(id));
    });

    socket.on("newOnlineUser", obj => {
        store.dispatch(addNewOnlineUser(obj));
    });
    socket.on("updateNewPm", obj => {
        store.dispatch(updateNewPm(obj));
    });
}
