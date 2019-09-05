// A module containing the components that are responsible for updating the different sections of the
// user's profile. Those components are imported by the 'profile' comnponent.

import React from "react";
import instance from "../lib/axios";

export class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { edit: false, error: false };
        this.sendBio = this.sendBio.bind(this);
        this.updateTextarea = this.updateTextarea.bind(this);
        this.openEditor = this.openEditor.bind(this);
    }

    sendBio() {
        const self = this;
        instance
            .post("/updateProfile", { bio: self.state.draftBio })
            .then(({ data }) => {
                if (data.success) {
                    self.props.updateProfile(self.state.draftBio, null, null);
                    self.setState({
                        edit: false
                    });
                }
            })
            .catch(err => {
                self.setState({ error: true });
                console.log(
                    "error in sendBio function in BioEditor component: ",
                    err.message
                );
            });
    }
    updateTextarea(e) {
        this.setState({ draftBio: e.target.value });
    }
    openEditor() {
        this.setState({ edit: true });
    }
    render() {
        return (
            <div>
                {this.state.error && (
                    <p>
                        {" "}
                        Unfortunately something went wrong! Please try again!
                    </p>
                )}
                {!this.state.edit && (
                    <div>
                        {(typeof this.props.bio == "string" ||
                            typeof this.props.bio == "undefined") && (
                            <div>
                                {" "}
                                <h4> My bio: </h4> <p> {this.props.bio} </p>
                                <button onClick={this.openEditor}>
                                    {" "}
                                    Edit Your Bio{" "}
                                </button>
                            </div>
                        )}
                        {typeof this.props.bio == "object" && (
                            <div>
                                <button onClick={this.openEditor}>
                                    {" "}
                                    Add a Bio{" "}
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {this.state.edit && (
                    <div>
                        {" "}
                        <p> Add or change your bio here:</p>
                        <textarea
                            defaultValue={this.props.bio}
                            onChange={this.updateTextarea}
                        ></textarea>
                        <button onClick={this.sendBio}>Submit</button>
                    </div>
                )}
            </div>
        );
    }
}

export class BandEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { edit: false, error: false };
        this.sendBand = this.sendBand.bind(this);
        this.updateTextarea = this.updateTextarea.bind(this);
        this.openEditor = this.openEditor.bind(this);
    }
    sendBand() {
        console.log("sendband runs");
        const self = this;
        instance
            .post("/updateProfile", { band: self.state.draftBand })
            .then(({ data }) => {
                if (data.success) {
                    self.props.updateProfile(null, null, self.state.draftBand);
                    self.setState({
                        edit: false
                    });
                }
            })
            .catch(err => {
                self.setState({ error: true });
                console.log(
                    "error in sendBand function in BandEditor component: ",
                    err.message
                );
            });
    }
    updateTextarea(e) {
        this.setState({ draftBand: e.target.value });
    }
    openEditor() {
        this.setState({ edit: true });
    }
    render() {
        return (
            <div>
                {this.state.error && (
                    <p>
                        {" "}
                        Unfortunately something went wrong! Please try again!
                    </p>
                )}
                {!this.state.edit && (
                    <div>
                        {(typeof this.props.band == "string" ||
                            typeof this.props.band == "undefined") && (
                            <div>
                                {" "}
                                <h4> My bands: </h4>
                                <p> {this.props.band} </p>
                                <button onClick={this.openEditor}>
                                    {" "}
                                    Edit Your Bands{" "}
                                </button>
                            </div>
                        )}
                        {typeof this.props.band == "object" && (
                            <div>
                                <button onClick={this.openEditor}>
                                    {" "}
                                    Add bands you play with{" "}
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {this.state.edit && (
                    <div>
                        {" "}
                        <p> Add or change your bands here:</p>
                        <textarea
                            defaultValue={this.props.band}
                            onChange={this.updateTextarea}
                        ></textarea>
                        <button onClick={this.sendBand}>Submit</button>
                    </div>
                )}
            </div>
        );
    }
}
export class InstrumentEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { edit: false, error: false };
        this.sendInstrument = this.sendInstrument.bind(this);
        this.updateTextarea = this.updateTextarea.bind(this);
        this.openEditor = this.openEditor.bind(this);
    }
    sendInstrument() {
        const self = this;
        instance
            .post("/updateProfile", { instrument: self.state.draftInstrument })
            .then(({ data }) => {
                if (data.success) {
                    self.props.updateProfile(
                        null,
                        self.state.draftInstrument,
                        null
                    );
                    self.setState({
                        edit: false
                    });
                }
            })
            .catch(err => {
                self.setState({ error: true });
                console.log(
                    "error in sendInstrument function in InstrumentEditor component: ",
                    err.message
                );
            });
    }
    updateTextarea(e) {
        this.setState({ draftInstrument: e.target.value });
    }
    openEditor() {
        this.setState({ edit: true });
    }
    render() {
        return (
            <div>
                {this.state.error && (
                    <p>
                        {" "}
                        Unfortunately something went wrong! Please try again!
                    </p>
                )}
                {!this.state.edit && (
                    <div>
                        {(typeof this.props.instrument == "string" ||
                            typeof this.props.instrument == "undefined") && (
                            <div>
                                {" "}
                                <h4> My Instruments: </h4>
                                <p> {this.props.instrument} </p>
                                <button onClick={this.openEditor}>
                                    {" "}
                                    Edit Your Instruments{" "}
                                </button>
                            </div>
                        )}
                        {typeof this.props.instrument == "object" && (
                            <div>
                                <button onClick={this.openEditor}>
                                    {" "}
                                    Add Instrument/s you play on{" "}
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {this.state.edit && (
                    <div>
                        {" "}
                        <p> Add or change your instruments here:</p>
                        <textarea
                            defaultValue={this.props.instrument}
                            onChange={this.updateTextarea}
                        ></textarea>
                        <button onClick={this.sendInstrument}>Submit</button>
                    </div>
                )}
            </div>
        );
    }
}
