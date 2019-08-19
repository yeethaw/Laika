const database = firebase.database().ref();
const bcrypt = dcodeIO.bcrypt;

window.onbeforeunload = function(e) {
    gapi.auth2.getAuthInstance().signOut();
};

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
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

document.querySelector("#submit_button").addEventListener("click", signUpEmail);
let box;
let notSameError = document.createElement('p');

async function signUpEmail(event) {
    event.preventDefault();
    let email = document.querySelector("#emailInput").value;
    let myVal = await database.child("users").orderByChild('email').equalTo(email).once("value");
    box = document.querySelector('#wrong');

    myVal = myVal.val();
    if (myVal) {
        notSame('Email already exists.');
    } else if (document.querySelector("#firstName").value.length == 0 || document.querySelector("#lastName").value.length == 0) {
        notSame('Invalid Name');
    } else if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(document.querySelector("#firstName").value) && /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(document.querySelector("#lastName").value))) {
        notSame('Invalid Name');
    } else if (!(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
            .test(email))) {
        notSame('Invalid email address.');
    } else if (document.querySelector("#passwordInput").value.length < 6) {
        notSame('Your password needs to be at least 6 characters.');
    } else if (document.querySelector("#passwordInput").value != document.querySelector("#passwordConfirm").value) {
        notSame('Your passwords don\'t match.');
    } else {
        const value = {
            email: document.querySelector("#emailInput").value,
            password: hash(document.querySelector("#passwordInput").value),
            name: `${document.querySelector("#firstName").value} ${document.querySelector("#lastName").value}`,
            imageURL: 'assets/default.png'
        }
        database.child("users").push(value);
        for (key in myVal) {
            sessionStorage.setItem('userKey', key);
        }
        sessionStorage.setItem('profilePic', 'assets/default.png');
        window.location.href = "host.html";
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
