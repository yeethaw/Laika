if (sessionStorage.getItem('userKey') == null) {
    window.location.href = "login.html";
}

let database = firebase.database().ref()


let userPic = document.querySelector("#userPic");
userPic.src = sessionStorage.getItem("profilePic");