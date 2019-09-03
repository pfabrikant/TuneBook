import React, {useRef, useEffect} from 'react';
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom';

import {socket} from './socket';


export function Chat (){
    const messages = useSelector(state=>{
        return state&&state.chatMessages;
    });

    const lastMessageRef = useRef();
    const textAreaRef = useRef();

    let val;
    useEffect(()=>{
        lastMessageRef.current.scrollIntoView({behavior:'smooth'});
        textAreaRef.current.value ='';
    },[messages]);


    function sendMessage(){
        socket.emit("messageSent",val);

    }
    return (
        <div className="chat-component">
            <h3> TuneChat </h3>
            <div className="flex">
                <div className="chat-container">
                    {messages && messages.map((message)=>{
                        return  <div className="flexi-chat" key={message.messageid.toString()}>
                            <Link className= "memberlinks" to={'/users/'+ message.usersid}>
                                <div className="chat">
                                    <img src={message.avatarurl} alt={message.first +' '+message.last}/>
                                    <h3> {message.first + ' ' + message.last} </h3>
                                </div>
                            </Link>
                            <div>
                                <p>{message.message}</p>
                                <h2> Posted at {message.created_at}</h2>
                            </div>
                        </div>;
                    })}
                    <div ref={lastMessageRef}></div>
                </div>
                <div>
                    <OnlineUsers />
                </div>
            </div>
            <div>
                <textarea onChange={e=>val=e.target.value} type="text" placeholder="type your message here" ref={textAreaRef}></textarea>
                <button onClick={sendMessage}>Post</button>
            </div>
        </div>
    );

}
export function OnlineUsers (){
    const onlineUsers = useSelector ((state)=>{
        return state&&state.onlineUsers;
    });
    return (<div className="online">
        <h2> Musicians Online: </h2>
        {onlineUsers&&onlineUsers.map(user=>{
            return <Link  key={user.id} className= "memberlinks" to={'/users/'+ user.id}>
                <div className="online-user" >
                    <img id="green" src="../public/green.png" alt="green circle"/>
                    <img src={user.avatarurl} alt={user.first+" "+ user.last}/>
                    <h3> {user.first+" "+user.last}</h3>
                </div>
            </Link>;

        })}
    </div>);

}
