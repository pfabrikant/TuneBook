import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import Welcome from "./welcome";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { reducer } from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { initializeSocket } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
const elem = (
    <Provider store={store}>
        <App />
    </Provider>
);

var element;
if (window.location.pathname == "/register") {
    element = <Welcome />;
} else {
    //initialize socket if user is logged in
    initializeSocket(store);
    element = elem;
}
ReactDOM.render(element, document.querySelector("main"));
