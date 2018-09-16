const contracts = require("./contracts");
const request = require("request");

const processRecording = (req, res) => {
    request.post("https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US")

    const contract = "hi";
    const key = contracts.push({
        contract: contract
    }).key;

    res.send({
        contract: contract,
        key: key
    });
}

const generatePin = (req, res) => {
    const key = req.body.key;
    let valid = false;
    contracts.once("value", function(snapshot) {
        snapshot.forEach(s => {
            if(key && key === s.key) {
                valid = true;
                let pin = Math.round(Math.random() * 10000) + "";
                for(let i = 0; i < 4 - pin.length; i++) pin = "0" + pin;
        
                contracts.child(req.body.key).update({
                    pin: pin,
                    consent: {
                        user1: false,
                        user2: false
                    }
                });
        
                res.send({
                    pin: pin
                });
            }
        });
        if(!valid) {
            res.send("Key is invalid.");
        }
    });
}

const enterPin = (req, res) => {
    const pin = req.body.pin;
    let valid = false;
    contracts.once("value", function(snapshot) {
        snapshot.forEach(s => {
            if(pin === s.val().pin) {
                valid = true;
                res.send({
                    valid: true,
                    key: s.key
                });
            }
        });
        if(!valid) {
            res.send({
                valid: false
            });
        }
    });
}

const consent = (req, res) => {
    const key = req.body.key;
    const user = req.body.user;
    let valid = false;
    contracts.once("value", function(snapshot) {
        snapshot.forEach(s => {
            if(key && key === s.key) {
                valid = true;
        
                contracts.child(req.body.key).update({
                    consent: {
                        user1: (user === 1) || s.val().consent.user1,
                        user2: (user === 2) || s.val().consent.user2
                    }
                });
        
                res.send(s.val());
            }
        });
        if(!valid) {
            res.send("Key is invalid.");
        }
    });
}

module.exports = {
    processRecording,
    generatePin,
    enterPin,
    consent
}