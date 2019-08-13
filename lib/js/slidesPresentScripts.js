if (sessionStorage.getItem('presentationID') == null || sessionStorage.getItem('presentationID') == "null") {
    window.location.href = "landing.html";
}

const database = firebase.database().ref();

let myVal;
let length;
let slideUrl;
let imageElement;

// Client ID and API key from the Developer Console
let CLIENT_ID = "1093238211073-kie44ss39m3e0ubj1g50nr5lv4t4r4rv.apps.googleusercontent.com";
let API_KEY = 'AIzaSyD0msy8Z6zMOuDZ-wueD4OQH8QmOvVSKqs';

// Array of API discovery doc URLs for APIs used by the quickstart
let DISCOVERY_DOCS = ["https://slides.googleapis.com/$discovery/rest?version=v1"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
let SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly';


/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
        console.log(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        listSlides();
    } else {
        handleAuthClick();
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 * Prints the number of slides and elements in a sample presentation:
 * https://docs.google.com/presentation/d/1EAYk18WDjIG-zp_0vLm3CsfQh_i8eXc67Jo2O9C6Vuc/edit
 */
function listSlides() {
    gapi.client.slides.presentations.get({
        presentationId: sessionStorage.getItem('presentationID')
    }).then(function(response) {
        firebaseCommands();
        let presentation = response.result;
        length = presentation.slides.length;
        gapi.client.slides.presentations.pages.getThumbnail({
            presentationId: sessionStorage.getItem('presentationID'),
            pageObjectId: presentation.slides[sessionStorage.getItem('currentSlide')].objectId,
        }).then(function(response) {
            const res = JSON.parse(response.body);
            slideUrl = res.contentUrl;
            imageElement = document.createElement("img");
            imageElement.id = "presImg";
            imageElement.title = presentation.title;
            imageElement.src = slideUrl;
            document.querySelector("body").appendChild(imageElement);
            p = document.createElement("p");
            p.innerHTML = `Your access code is ${sessionStorage.getItem('accessKey')}`
            document.querySelector("body").appendChild(p);
        }, function(response) {
            console.log('Error: ' + response.result.error.message);
        });
    }, function(response) {
        console.log('Error: ' + response.result.error.message);
    });
}

async function firebaseCommands() {
    myVal = await database.child("presentations").orderByChild('accessKey').equalTo(parseInt(sessionStorage.getItem('accessKey'))).once("value");
    myVal = myVal.val();
    console.log(myVal);
    for (key in myVal) {
        sessionStorage.setItem('firebasePresentationKey', key);
        sessionStorage.setItem('currentSlide', myVal[key].currentSlideNum);
    }
}

function previousSlide() {
    if (sessionStorage.getItem('currentSlide') > 0) {
        firebase.database().ref(`presentations/${sessionStorage.getItem('firebasePresentationKey')}/currentSlideNum`).set((parseInt(sessionStorage.getItem('currentSlide')) - 1).toString());
        sessionStorage.setItem('currentSlide', ((parseInt(sessionStorage.getItem('currentSlide')) - 1).toString()));
    } else {
        console.log("Invalid input.");
    }
}

function nextSlide() {
    if (sessionStorage.getItem('currentSlide') < length - 1) {
        firebase.database().ref(`presentations/${sessionStorage.getItem('firebasePresentationKey')}/currentSlideNum`).set((parseInt(sessionStorage.getItem('currentSlide')) + 1).toString());
        sessionStorage.setItem('currentSlide', ((parseInt(sessionStorage.getItem('currentSlide')) + 1).toString()));
    } else {
        console.log("Invalid input.");
    }
}

firebase.database().ref(`presentations/${sessionStorage.getItem('firebasePresentationKey')}`).on('child_changed', updatePage);

async function updatePage() {
    gapi.client.slides.presentations.get({
        presentationId: sessionStorage.getItem('presentationID')
    }).then(function(response) {
        firebaseCommands();
        let presentation = response.result;
        length = presentation.slides.length;
        gapi.client.slides.presentations.pages.getThumbnail({
            presentationId: sessionStorage.getItem('presentationID'),
            pageObjectId: presentation.slides[sessionStorage.getItem('currentSlide')].objectId,
        }).then(function(response) {
            const res = JSON.parse(response.body);
            slideUrl = res.contentUrl;
            imageElement.src = slideUrl;
        }, function(response) {
            console.log('Error: ' + response.result.error.message);
        });
    }, function(response) {
        console.log('Error: ' + response.result.error.message);
    });
}

function signOut() {
    gapi.auth2.getAuthInstance().signOut();
    sessionStorage.setItem('presentationID', null);
    sessionStorage.setItem('currentSlide', null);
    sessionStorage.setItem('firebasePresentationKey', null);
    sessionStorage.setItem('accessKey', null);
    sessionStorage.setItem('userKey', null);
    sessionStorage.setItem('profilePic', null);
    localStorage.setItem('access_token', null);
    localStorage.setItem('userKey', null);
    window.location.href = "index.html";
}