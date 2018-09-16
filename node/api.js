const contracts = require("./contracts");
const request = require("request");

let contract = null;

const processRecording = (req, res) => {
    const options = {
        url: "https://api.rev.ai/revspeech/v1beta/jobs",
        method: "POST",
        headers: {
            Authorization: "Bearer 01TCZQw9bq1GKIlxdFeCTqTo0KDKBMg3QMBlx1NyiokWMhUkYOlHyWznHcvY4gVMo_c_NmoK6tVm6i0fSePs8HTpV5IPw",
            "Content-Type": "application/json"
        },
        form: {
            data: {
                media_url: "https://support.rev.com/hc/en-us/article_attachments/200043975/FTC_Sample_1_-_Single.mp3",
                callback_url: "https://convotract.appspot.com:8080/transcribed"
            } 
        }
    }

    request(options, (err, res, body) => {
        let t = setInterval(() => {
            if(contract !== null) {
                clearInterval(t);
                const key = contracts.push({
                    contract: contract
                }).key;
                res.send({
                    contract: contract,
                    key: key
                })
            }
        }, 1000);
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
                    key: s.key,
                    contract: s.val().contract
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

const transcribed = (req, res) => {
    const options = {
        url: "https://api.rev.ai/revspeech/v1beta/jobs/" + req.body.id + "/transcript",
        method: "GET",
        headers: {
            Authorization: "Bearer 01TCZQw9bq1GKIlxdFeCTqTo0KDKBMg3QMBlx1NyiokWMhUkYOlHyWznHcvY4gVMo_c_NmoK6tVm6i0fSePs8HTpV5IPw",
            "Content-Type": "text/plain",
            Accept: "text/plain"
        }
    }

    request(options, (err, res, body) => {
        let text = "";
        body.split("\n").forEach(line => {
            text += line.replace(/(.+ \d\d:\d\d )/g, "") + " ";
        });
        const options2 = {
            url: "http://40.76.8.113/fill_out",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            form: {
                data: {
                    text: text
                }
            }
        }
        request(options2, (err2, res2, body2) => {
            contract = body2.text
        });
    });
}

module.exports = {
    processRecording,
    generatePin,
    enterPin,
    consent,
    transcribed
}