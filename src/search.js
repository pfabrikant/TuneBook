//The three search Comnponents

import React, { useState, useEffect } from "react";
import instance from "../lib/axios";
import { Link } from "react-router-dom";

export function SearchUsers() {
    const [newUsers, setNewUsers] = useState([]);
    const [searchInput, setSearchInput] = useState([]);
    const [error, searchUsers, sendSearchInput] = useSendSearchInput(
        "/searchUsers",
        { searchKey: searchInput }
    );
    const [serverError, setServerError] = useState(false);
    useEffect(() => {
        instance
            .get("/recentUsers")
            .then(({ data }) => {
                if (!data.error) {
                    setNewUsers(data);
                } else {
                    setServerError(true);
                }
            })
            .catch(err => {
                console.log("error in useEffect of SearchUsers: ", err.message);
            });
    }, []);
    return (
        <div className="searchusers">
            {searchUsers.length == 0 && (
                <div className="newUsers">
                    {" "}
                    <h2> Check out the newest members of TuneBook: </h2>
                    {serverError && (
                        <h2>
                            {" "}
                            Sorry, we currently experience some problem with our
                            servers, please try again later{" "}
                        </h2>
                    )}
                    {newUsers.map(newUser => (
                        <Link
                            className="memberlinks"
                            to={"/users/" + newUser.id}
                            key={newUser.id}
                        >
                            <div className="members">
                                <img
                                    src={newUser.avatarurl}
                                    alt={newUser.first + " " + newUser.last}
                                />
                                <h3> {newUser.first + " " + newUser.last} </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            {error && (
                <h2>
                    {" "}
                    Oops! We could not find any matches for your search term{" "}
                </h2>
            )}
            <input
                type="text"
                placeholder="Your Search Here"
                onChange={e => setSearchInput(e.target.value)}
            />
            <button onClick={sendSearchInput}> Go! </button>
            {searchUsers.length > 0 && !error && (
                <div>
                    <h2> Here are the musicians who match your search: </h2>
                    {searchUsers.map(searchUser => (
                        <Link
                            className="memberlinks"
                            to={"/users/" + searchUser.id}
                            key={searchUser.id}
                        >
                            <div className="members">
                                <img
                                    src={searchUser.avatarurl}
                                    alt={
                                        searchUser.first + " " + searchUser.last
                                    }
                                />
                                <h3>
                                    {" "}
                                    {searchUser.first +
                                        " " +
                                        searchUser.last}{" "}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export function SearchInstrument() {
    const [searchInput, setSearchInput] = useState([]);
    const [error, searchedInstruments, sendSearchInput] = useSendSearchInput(
        "/searchInstrument",
        { searchKey: searchInput }
    );
    return (
        <div className="searchusers">
            <h3> Search for musicians who play a specific instrument: </h3>
            {error && (
                <h2>
                    {" "}
                    Oops! We could not find any matches for your search term{" "}
                </h2>
            )}
            <input
                type="text"
                placeholder="Your Search Here"
                onChange={e => setSearchInput(e.target.value)}
            />
            <button onClick={sendSearchInput}> Go! </button>
            {searchedInstruments.length > 0 && !error && (
                <div>
                    <h2> Here are the musicians who match your search: </h2>
                    {searchedInstruments.map(searchedInstrument => (
                        <Link
                            className="memberlinks"
                            to={"/users/" + searchedInstrument.id}
                            key={searchedInstrument.id}
                        >
                            <div className="members">
                                <img
                                    src={searchedInstrument.avatarurl}
                                    alt={
                                        searchedInstrument.first +
                                        " " +
                                        searchedInstrument.last
                                    }
                                />
                                <h3>
                                    {" "}
                                    {searchedInstrument.first +
                                        " " +
                                        searchedInstrument.last}{" "}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export function SearchBand() {
    const [searchInput, setSearchInput] = useState([]);
    const [error, searchedBands, sendSearchInput] = useSendSearchInput(
        "/searchBand",
        { searchKey: searchInput }
    );
    return (
        <div className="searchusers">
            <h3> Search for musicians who play in a specific band: </h3>
            {error && (
                <h2>
                    {" "}
                    Oops! We could not find any matches for your search term{" "}
                </h2>
            )}
            <input
                type="text"
                placeholder="Your Search Here"
                onChange={e => setSearchInput(e.target.value)}
            />
            <button onClick={sendSearchInput}> Go! </button>
            {searchedBands.length > 0 && !error && (
                <div>
                    <h2> Here are the musicians who match your search: </h2>
                    {searchedBands.map(searchedBand => (
                        <Link
                            className="memberlinks"
                            to={"/users/" + searchedBand.id}
                            key={searchedBand.id}
                        >
                            <div className="members">
                                <img
                                    src={searchedBand.avatarurl}
                                    alt={
                                        searchedBand.first +
                                        " " +
                                        searchedBand.last
                                    }
                                />
                                <h3>
                                    {" "}
                                    {searchedBand.first +
                                        " " +
                                        searchedBand.last}{" "}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

// My first self made hook
export function useSendSearchInput(url, val) {
    const [error, setError] = useState(false);
    const [results, setResults] = useState([]);
    async function sendSearchInput() {
        try {
            const { data } = await instance.post(url, val);
            if (data.length == 0) {
                setError(true);
            } else if (data.error) {
                setError(true);
            } else {
                setError(false);
                setResults(data);
            }
        } catch (err) {
            console.log(
                "Error in useSendSearchInput hook function in" +
                    url +
                    "component: ",
                err.message
            );
        }
    }
    return [error, results, sendSearchInput];
}
