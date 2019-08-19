if (sessionStorage.getItem('userKey') == null || sessionStorage.getItem('userKey') == "null") {
    window.location.href = "login.html";
}

const database = firebase.database().ref();

// The Browser API key obtained from the Google API Console.
// Replace with your own Browser API key, or your own key.
let developerKey = 'AIzaSyD0msy8Z6zMOuDZ-wueD4OQH8QmOvVSKqs';

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
let clientId = "780573681276-utmb6i5jv861stne84qvm0s0d40sib1t.apps.googleusercontent.com"

// Replace with your own project number from console.developers.google.com.
// See "Project number" under "IAM & Admin" > "Settings"
let appId = "1093238211073";

// Scope to use to access user's Drive items.
let scopes = [''];

let pickerApiLoaded = false;
let oauthToken;

// Use the Google API Loader script to load the google.picker script.
function loadPicker() {
    gapi.load('auth', { 'callback': onAuthApiLoad });
    gapi.load('picker', { 'callback': onPickerApiLoad });
}

function onAuthApiLoad() {
    window.gapi.auth.authorize({
            'client_id': clientId,
            'scope': scopes,
            'immediate': false
        },
        handleAuthResult);
}

function onPickerApiLoad() {
    pickerApiLoaded = true;
    createPicker();
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}

// Create and render a Picker object for searching images.
function createPicker() {
    if (pickerApiLoaded && oauthToken) {
        let view = new google.picker.View(google.picker.ViewId.PRESENTATIONS);
        let picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(appId)
            .setOAuthToken(oauthToken)
            .addView(view)
            .addView(new google.picker.DocsUploadView())
            .setDeveloperKey(developerKey)
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    }
}

// A simple callback implementation.
function pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
        let fileId = data.docs[0].id;
        let myAccessKey = Math.floor(Math.random() * 9000000 + 1000000);
        let pushData = {
            userID: localStorage.getItem('userKey'),
            fileID: fileId,
            accessToken: localStorage.getItem('access_token'),
            currentSlideNum: 0,
            slideURL: null,
            accessKey: myAccessKey //creating a 7-digit access key
        }
        database.child("meds").push(pushData);
        sessionStorage.setItem('medID', fileId)
        sessionStorage.setItem('accessKey', myAccessKey);
        sessionStorage.setItem('currentmed', "0")
        window.location.href = "addMeds.html"
    }
}

