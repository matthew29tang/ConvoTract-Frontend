import axios from "axios";

const ADDRESS = "https://convotract.appspot.com/";

const ajax = (url, data, callback = null, contentType = null) => {
    const args = contentType === null ? [ADDRESS + url, data] : [ADDRESS + url, data , {header: {"Content-Type": contentType}}];
    return axios.post(...args).then(result => {
        if(callback !== null) callback(result.data);
    });
    
}

const API = {
    processRecording: (url, callback) => {
        const body = new FormData();
        body.append("file", {
            uri: url,
            name: "recording"
        });
        return ajax("processRecording", body, null, "multipart/form-data");
        
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
    consent: (key, user, fullName, callback) => {
        ajax("consent", {
            key: key,
            user: user,
            fullName: fullName
        });
    }
}

export { API }