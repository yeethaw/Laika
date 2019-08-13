const database = firebase.database().ref();
const bcrypt = dcodeIO.bcrypt;

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email https://www.googleapis.com/auth/presentations.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}


async function onSuccess(googleUser) {
    let profile = googleUser.getBasicProfile();
    const value = {
        email: profile.getEmail(),
        password: "",
        name: profile.getName(),
        imageURL: profile.getImageUrl()
    }
    let myVal = await database.child("users").orderByChild('email').equalTo(profile.getEmail()).once("value");
    myVal = myVal.val();
    if (!myVal) {
        database.child("users").push(value);
    }
    for (key in myVal) {
        sessionStorage.setItem('userKey', key);
    }
    for (key in googleUser) {
        if (googleUser[key].access_token != undefined) {
            localStorage.setItem('access_token', googleUser[key].access_token);
        }
    }
    sessionStorage.setItem('profilePic', profile.getImageUrl());
    window.location.href = "host.html";
}

function onFailure(error) {
    console.log(error);
}

document.querySelector("#submit_button").addEventListener("click", signInEmail);

let notSameError = document.getElementById('error');

async function signInEmail(event) {
    event.preventDefault();
    let email = document.querySelector("#emailInput").value;
    let myVal = await database.child("users").orderByChild('email').equalTo(email).once("value");
    myVal = myVal.val();
    if (!myVal) {
        notSame("Incorrect email address.");
    } else {
        let inputPassword = document.querySelector("#passwordInput").value;
        let userPassword;
        for (key in myVal) {
            userPassword = myVal[key].password;
        }
        if (bcrypt.compareSync(inputPassword, userPassword)) {
            for (key in myVal) {
                sessionStorage.setItem('userKey', key);
            }
            window.location.href = "host.html";
        } else {
            notSame("Incorrect Password");
        }
    }
}

function hash(value) {
    let salt = bcrypt.genSaltSync(10);
    let hashVal = bcrypt.hashSync(value, salt);
    return hashVal;
}

function notSame(p) {
    notSameError.innerText = `${p}`;
    notSameError.class = "error";
    box.prepend(notSameError);
}