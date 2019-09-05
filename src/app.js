//the container Component for logged-in users

import React from "react";
import { Header } from "./header";
import { SearchUsers, SearchInstrument, SearchBand } from "./search";
import instance from "../lib/axios";
import { Profile, OtherUsersProfiles } from "./profile";
import { Route, BrowserRouter } from "react-router-dom";
import { Friends } from "./friends";
import { Chat } from "./chat";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            openUploader: false
        };
        this.toggleDiv = this.toggleDiv.bind(this);
        this.onChange = this.onChange.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }
    toggleDiv(bool) {
        this.setState({ openUploader: bool });
    }
    onChange(url) {
        this.setState({ avatarUrl: url });
        console.log(this.state);
    }
    updateProfile(bio, instrument, band) {
        if (bio) {
            this.setState({ bio: bio });
        }
        if (instrument) {
            this.setState({ instrument: instrument });
        }
        if (band) {
            this.setState({ band: band });
        }
    }
    async componentDidMount() {
        try {
            const { data } = await instance.get("/getUserInfo");
            this.setState(data);
        } catch (err) {
            console.log("error in componentDidMount of App: ", err);
        }
    }
    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Header
                            first={this.state.first}
                            last={this.state.last}
                            avatarUrl={
                                this.state.avatarurl || "../public/avatar.jpg"
                            }
                            toggleDiv={this.toggleDiv}
                            openUploader={this.state.openUploader}
                            onChange={this.onChange}
                        />

                        <Route
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <Profile
                                        last={this.state.last}
                                        avatarUrl={
                                            this.state.avatarurl ||
                                            "../public/avatar.jpg"
                                        }
                                        toggleDiv={this.toggleDiv}
                                        openUploader={this.state.openUploader}
                                        onChange={this.onChange}
                                        bio={this.state.bio}
                                        instrument={this.state.instrument}
                                        band={this.state.band}
                                        updateProfile={this.updateProfile}
                                        first={this.state.first}
                                    />
                                );
                            }}
                        />
                        <Route
                            path="/users/:id"
                            component={OtherUsersProfiles}
                        />
                        <Route path="/search-users" component={SearchUsers} />
                        <Route
                            path="/search-instruments"
                            component={SearchInstrument}
                        />
                        <Route path="/search-bands" component={SearchBand} />
                        <Route path="/friends" component={Friends} />
                        <Route path="/chat" component={Chat} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
