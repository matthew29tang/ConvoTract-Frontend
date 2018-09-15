const admin = require('firebase-admin');

const serviceAccount = require('./convotract-firebase-adminsdk-t8hyl-91be36beb3.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://convotract.firebaseio.com'
});
var db = admin.database();
var ref = db.ref("/contracts");

module.exports = ref;