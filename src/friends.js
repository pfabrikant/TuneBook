import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unFriend, acceptFriend, cancelRequest, openMessanger} from './actions';
import {Link} from 'react-router-dom';
import {socket} from './socket';



export function Friends (){
    const dispatch = useDispatch();

    const loggedInUserDetails = useSelector (state=> state && state.loggedInUserDetails
    );
    const friends = useSelector (state=>{
        return state && state.friends && state.friends.filter(friend=>friend.accepted&&friend.id!=loggedInUserDetails.id);
    });
    const ignorers = useSelector (state=>{
        return state && state.friends && state.friends.filter(friend=> friend.sender_id==loggedInUserDetails.id && friend.receiver_id==friend.id && !friend.accepted);
    });
    const requesters = useSelector (state => {
        return state && state.friends && state.friends.filter(friend=>friend.sender_id!= loggedInUserDetails.id&&friend.sender_id==friend.id&&!friend.accepted);
    });
    const messanger = useSelector ( state => {
        return state && state.openMessanger;
    });
    const messages = useSelector ( state=>{
        return state && state.privateMessages;
    });
    const privateMessagesRef = useRef();
    const textAreaRef = useRef();
    let val;
    

    async function openMessageContainer (id, first, last, url) {
        await dispatch(openMessanger(id, first, last, url));
        privateMessagesRef.current && privateMessagesRef.current.scrollIntoView({behavior:'smooth'});
    }
    function sendMessage (){
        socket.emit("newPm",{receiver_id:messanger.id, sender_id:loggedInUserDetails.id, message:val, avatarurl:loggedInUserDetails.avatarurl, first:loggedInUserDetails.first, last:loggedInUserDetails.last});
        console.log(textAreaRef.current.value);
        textAreaRef.current.value ='';
    }


    return (
        <div>
            {friends && friends.length>0 && <h2> My friends </h2>}
            <div className="friends">
                {friends && friends.map(
                    friend=>
                        <div  key={friend.id}>
                            <Link className= "memberlinks" to={'/users/'+ friend.id}>
                                <div className="friend">
                                    <img src={friend.avatarurl} alt={friend.first +' '+friend.last}/>
                                    <h3> {friend.first + ' ' + friend.last} </h3>
                                </div>
                            </Link>
                            <button className="pm" onClick={()=>dispatch(unFriend(friend.id))}>Unfriend</button>
                            <button className="pm" onClick={()=>openMessageContainer(friend.id, friend.first, friend.last, friend.avatarurl)}> Send Private Message </button>
                        </div>

                )}
            </div>
            {requesters && requesters.length>0 &&<h2> You have friend requests from: </h2>}
            <div className="friends">
                {requesters && requesters.map(
                    requester=> (
                        <div  key={requester.id}>
                            <Link className= "memberlinks" to={'/users/'+ requester.id}>
                                <div className="friend" >
                                    <img src={requester.avatarurl} alt={requester.first +' '+requester.last}/>
                                    <h3> {requester.first + ' ' + requester.last} </h3>
                                </div>
                            </Link>
                            <button onClick={()=>dispatch(acceptFriend(requester.id))}>Accept Friendship</button>
                        </div>
                    )
                )}
            </div>
            {ignorers && ignorers.length>0 && <h2> Friend requests sent to: </h2> }
            <div className="friends">
                {ignorers && ignorers.map(
                    ignorer=> (
                        <div  key={ignorer.id}>
                            <Link className= "memberlinks" to={'/users/'+ ignorer.id} key={ignorer.id}>
                                <div className="friend" >
                                    <img src={ignorer.avatarurl} alt={ignorer.first +' '+ignorer.last}/>
                                    <h3> {ignorer.first + ' ' + ignorer.last} </h3>
                                </div>
                            </Link>
                            <button onClick={()=>dispatch(cancelRequest(ignorer.id))}>Cancel Request</button>
                        </div>
                    )
                )}
            </div>
            <div>
                {messanger&& messanger!=null &&
                <React.Fragment>
                    <div className="reference" ref={privateMessagesRef}></div>
                    <h3> My private conversation with {messanger.first+" "+messanger.last}</h3>
                    <div className="messanger">
                        <div className="chat-container">
                            {messages && messages.map((message)=>{
                                if(message.conversationId==messanger.id){
                                    return  <div className="flexi-chat private" key={message.id.toString()}>
                                        <Link className= "memberlinks" to={'/users/'+ message.user_id}>
                                            <div className="chat" id="private">
                                                <img src={message.avatarurl} alt={message.first +' '+message.last}/>
                                                <h3> {message.first + ' ' + message.last} </h3>
                                            </div>
                                        </Link>
                                        <div>
                                            <p>{message.message}</p>
                                            <h2> Sent at {message.created_at}</h2>
                                        </div>
                                    </div>;
                                }
                            })}
                        </div>
                    </div>
                    <div className="pm-input">
                        <textarea onChange={e=>val=e.target.value} type="text" placeholder="type your message here" ref={textAreaRef}></textarea>
                        <button onClick={sendMessage}>Send</button>
                    </div>


                </React.Fragment >}
            </div>
        </div>
    );
}
