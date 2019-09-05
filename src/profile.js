import React, { useState, useEffect } from "react";
import { Avatar } from "./header";
import { BioEditor, InstrumentEditor, BandEditor } from "./profileEditor";
import instance from "../lib/axios";

// the own profiule component - showing as default for logged in users, contains all the information about the user#
// as well as features to update each section of the profile

export function Profile(props) {
    return (
        <div className="profile">
            <div>
                <Avatar
                    last={props.last}
                    avatarUrl={props.avatarUrl}
                    first={props.first}
                    onChange={props.onChange}
                    toggleDiv={props.toggleDiv}
                    openUploader={props.openUploader}
                />
                <h3>{props.first + " " + props.last}</h3>
            </div>
            <div className="editors">
                <BioEditor
                    bio={props.bio}
                    updateProfile={props.updateProfile}
                />
                <InstrumentEditor
                    instrument={props.instrument}
                    updateProfile={props.updateProfile}
                />
                <BandEditor
                    band={props.band}
                    updateProfile={props.updateProfile}
                />
            </div>
        </div>
    );
}

// a component that shows other user's profiles
export class OtherUsersProfiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = { validId: true };
    }
    async componentDidMount() {
        const id = this.props.match.params.id;
        const { data } = await instance.get(`/api/users/${id}`);
        if (data.sameAsUserId) {
            this.props.history.push("/");
        }
        if (data.validId) {
            console.log("invalid ID in OtherUsersProfiles(componentDidMount)");
            this.setState({ validId: false });
        }
        this.setState(data);
    }
    render() {
        if (!this.state.validId) {
            return (
                <div className="error">
                    {" "}
                    <h2>We could not find the requested profile, sorry!</h2>
                </div>
            );
        }
        return (
            <div className="profile">
                <div>
                    <Avatar
                        last={this.state.last}
                        avatarUrl={this.state.avatarurl}
                        first={this.state.first}
                    />
                    <h3>{this.state.first + " " + this.state.last}</h3>
                    <FriendButton id={this.props.match.params.id} />
                </div>
                <div className="editors">
                    <div>
                        <div>
                            {this.state.bio && (
                                <div>
                                    {" "}
                                    <h4> bio: </h4> <p> {this.state.bio} </p>
                                </div>
                            )}
                            {this.state.instrument && (
                                <div>
                                    {" "}
                                    <h4> Instruments: </h4>{" "}
                                    <p> {this.state.instrument} </p>
                                </div>
                            )}
                            {this.state.band && (
                                <div>
                                    {" "}
                                    <h4> band: </h4> <p> {this.state.band} </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// a dynamic button component that appears on other user's profiles.
// changes its message and function according to the current relationship
// between the logged-in user and the current displayed profile
export function FriendButton(props) {
    const [buttonMode, setButtonMode] = useState();
    useEffect(() => {
        instance
            .get(`/friendshipStatus/${props.id}`)
            .then(({ data }) => {
                setButtonMode(data.buttonMode);
            })
            .catch(err => {
                console.log(
                    "Error in FriendButton's useEffect function: ",
                    err.message
                );
            });
    }, [props.id]);
    function updateStatus() {
        instance
            .post(`/friendshipStatus`, { buttonMode: buttonMode, id: props.id })
            .then(({ data }) => {
                setButtonMode(data.buttonMode);
            })
            .catch(err => {
                console.log(
                    "Error in updateStatus function in FriendButton component: ",
                    err.message
                );
            });
    }
    return <button onClick={updateStatus}>{buttonMode}</button>;
}
