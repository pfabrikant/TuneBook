// header container component

import React from "react";
import instance from "../lib/axios";
import { Link } from "react-router-dom";
// import { socket } from "./socket";
// import { useSelector } from 'react-redux';

export function Header(props) {
    // async function logout (){

    //     socket.emit("logout");
    //     const success = await instance.get("/logout");
    //     console.log(success);
    //     if (success.data.logout){
    //         window.location.pathname=="/register";
    //     }
    //
    // }

    // const pm = useSelector(state=>{
    //     state&&state.privateMessages;
    // });

    return (
        <div className="relative">
            <div className="header">
                <Link to="/">
                    <div className="headerLogo">
                        <img src="../public/logo.png" alt="logo" />
                        <h4> TuneBook </h4>
                    </div>
                </Link>
                <div className="navbar">
                    <Link to="/chat">
                        {" "}
                        <h4>Chat |</h4>
                    </Link>
                    <Link to="/friends">
                        {" "}
                        <h4>Friends |</h4>
                    </Link>
                    <Link to="/search-bands">
                        {" "}
                        <h4>Search by Band |</h4>{" "}
                    </Link>
                    <Link to="/search-instruments">
                        {" "}
                        <h4>Search by Instrument |</h4>{" "}
                    </Link>
                    <Link to="/search-users">
                        {" "}
                        <h4>Search Musicians |</h4>{" "}
                    </Link>
                    <a href="/logout">
                        <h4> logout </h4>
                    </a>
                    <Avatar
                        avatarUrl={props.avatarUrl}
                        first={props.first}
                        last={props.last}
                        toggleDiv={props.toggleDiv}
                    />
                </div>
            </div>
            {props.openUploader && (
                <Uploader
                    onChange={props.onChange}
                    toggleDiv={props.toggleDiv}
                />
            )}
        </div>
    );
}

export function Avatar(props) {
    return (
        <div className="avatar">
            <img
                src={props.avatarUrl}
                alt={props.first + " " + props.last}
                onClick={() => {
                    props.toggleDiv(true);
                }}
            />
        </div>
    );
}

class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.uploadFile = this.uploadFile.bind(this);
    }
    uploadFile(e) {
        let self = this;
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append("file", file);
        instance
            .post("/uploadAvatar", formData)
            .then(({ data }) => {
                if (data.success) {
                    self.props.onChange(data.avatarUrl);
                    self.props.toggleDiv(false);
                }
            })
            .catch(err => {
                console.log("error in post /uploads axios", err.message);
            });
    }
    render() {
        return (
            <div className="outerUploader">
                <div className="innerUploader">
                    <div
                        id="x"
                        onClick={() => {
                            this.props.toggleDiv(false);
                        }}
                    >
                        X
                    </div>
                    <h3> Would you like to update your profile picture? </h3>
                    <label htmlFor="avatar">
                        {" "}
                        Submit Image{" "}
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            onChange={this.uploadFile}
                        />
                    </label>
                </div>
            </div>
        );
    }
}
