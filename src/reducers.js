// reducer function for redux state

export function reducer(state = {}, action) {
    if (action.type == "GET_FRIENDS") {
        return {
            ...state,
            friends: action.friends
        };
    }
    if (action.type == "UNFRIEND") {
        return {
            ...state,
            friends: state.friends.filter(friend => friend.id != action.id)
        };
    }
    if (action.type == "ACCEPT_FRIEND") {
        return {
            ...state,
            friends: state.friends.map(friend => {
                if (friend.id == action.id) {
                    friend.accepted = true;
                    return friend;
                } else {
                    return friend;
                }
            })
        };
    }
    if (action.type == "CANCEL_REQUEST") {
        return {
            ...state,
            friends: state.friends.filter(friend => friend.id != action.id)
        };
    }
    if (action.type == "UPDATE_CHAT_MESSAGES") {
        return {
            ...state,
            chatMessages: action.data.reverse()
        };
    }
    if (action.type == "ADD_CHAT_MESSAGE") {
        let arr = state.chatMessages.slice();
        if (arr.length >= 10) {
            arr.shift();
        }
        arr.push(action.message);
        return {
            ...state,
            chatMessages: arr
        };
    }
    if (action.type == "ADD_ONLINE_USERS") {
        return {
            ...state,
            onlineUsers: action.data
        };
    }
    if (action.type == "REMOVE_ONLINE_USER") {
        return {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                onlineUser => onlineUser.id != action.id
            )
        };
    }
    if (action.type == "ADD_NEW_ONLINE_USER") {
        return { ...state, onlineUsers: [...state.onlineUsers, action.data] };
    }
    if (action.type == "OPEN_MESSANGER") {
        return {
            ...state,
            openMessanger: {
                id: action.id,
                first: action.first,
                last: action.last,
                avatarurl: action.url
            }
        };
    }

    if (action.type == "UPDATE_PRIVATE_MESSAGES") {
        const data = action.data.map(message => {
            if (message.user_id == state.loggedInUserDetails.id) {
                return { ...message, conversationId: message.receiver_id };
            } else {
                return { ...message, conversationId: message.user_id };
            }
        });
        return { ...state, privateMessages: data };
    }
    if (action.type == "UPDATE_LOGGED_IN_USER_DETAILS") {
        return {
            ...state,
            loggedInUserDetails: action.data
        };
    }
    if (action.type == "UPDATE_NEW_PM") {
        if (action.data.sender_id == state.loggedInUserDetails.id) {
            action.data.conversationId = action.data.receiver_id;
        }
        if (action.data.receiver_id == state.loggedInUserDetails.id) {
            action.data.conversationId = action.data.sender_id;
        }
        return {
            ...state,
            privateMessages: [...state.privateMessages, action.data]
        };
    }
    return {};
}
