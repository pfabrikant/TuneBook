import instance from '../lib/axios';
//action creator getFriends
export async function getFriends ({rows}){
    return {
        type: "GET_FRIENDS",
        friends: rows
    };
}

export async function unFriend (id) {
    try {
        await instance.post("/friendshipStatus", {buttonMode:"End Friendship", id:id});
        return {
            type:"UNFRIEND",
            id:id
        };
    } catch (err){ console.log("Error in action creator unFriend: ", err.message);
    }
}
export async function acceptFriend (id) {
    try {
        await instance.post("/friendshipStatus", {buttonMode:"Accept Friendship Request", id:id});
        return {
            type: "ACCEPT_FRIEND",
            id:id
        };
    } catch (err){console.log("Error in action creator acceptFriend: ",err.message);}
}
export async function cancelRequest (id) {
    try {
        await instance.post("/friendshipStatus", {buttonMode:"Cancel Friendship Request", id:id});
        return {
            type: "CANCEL_REQUEST",
            id:id
        };
    } catch (err){console.log("Error in action creator cancelRequest: ",err.message);}
}

export function updateChatMessages ({rows}){
    return {
        type: "UPDATE_CHAT_MESSAGES",
        data:rows
    };
}
export function addChatMessage (obj){
    return {
        type:"ADD_CHAT_MESSAGE",
        message:obj
    };
}

export function addOnlineUsers({rows}){
    return {
        type:"ADD_ONLINE_USERS",
        data:rows
    };
}
export function removeOnlineUser(id){
    return {
        type:"REMOVE_ONLINE_USER",
        id:id
    };
}
export function addNewOnlineUser(obj){
    return {
        type: "ADD_NEW_ONLINE_USER",
        data: obj
    };
}
export function openMessanger (id, first, last, url){
    return {
        type:"OPEN_MESSANGER",
        id:id,
        first:first,
        last:last,
        url:url
    };
}
export function updatePrivateMessages({rows}){
    return {
        type:"UPDATE_PRIVATE_MESSAGES",
        data:rows
    };
}
export function updateLoggedinUserDetails ({rows}){
    return {
        type:"UPDATE_LOGGED_IN_USER_DETAILS",
        data:rows[0]
    };
}
export function updateNewPm (obj){
    return {
        type:"UPDATE_NEW_PM",
        data:obj
    };
}
