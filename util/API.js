import axios from "axios";

const ADDRESS = "localhost:8080/";

const ajax = (url, data, callback) => {
    axios.post(ADDRESS + url, data).then(result => {
        callback(result.data);
    });
}

const API = {
    processRecording: (url, callback) => {
        ajax("processRecording", {
            url: url
        });
    },
    generatePin: (key, callback) => {
        ajax("generatePin", {
            key: key
        });
    },
    enterPin: (pin, callback) => {
        ajax("enterPin", {
            pin: pin
        });
    },
    consent: (key, user, callback) => {
        ajax("consent", {
            key: key,
            user: user
        });
    }
}

export { API }