import axios from "axios";

// creating an axios instance that automaticlly includes the csurf token in every http request
var instance = axios.create({
    xsrfCookieName: "mytoken",
    xsrfHeaderName: "csrf-token"
});

export default instance;
