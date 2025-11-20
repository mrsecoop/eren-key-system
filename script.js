// -------------------------
//  Firebase Setup
// -------------------------

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxSCXZa5At1Yv-Pwnu6_reAAar3tACgAg",
  authDomain: "eren-key-system.firebaseapp.com",
  databaseURL: "https://eren-key-system-default-rtdb.firebaseio.com",
  projectId: "eren-key-system",
  storageBucket: "eren-key-system.firebasestorage.app",
  messagingSenderId: "816117014648",
  appId: "1:816117014648:web:a829dc2d257488558acd8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = firebase.database();

// -------------------------
//  Generate Key
// -------------------------

function randomString(len) {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let s = "";
    for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}

document.getElementById("gen12").onclick = () => {
    let key = "EREN" + randomString(15);
    let expireTime = Date.now() + (12 * 60 * 60 * 1000);

    db.ref("keys/" + key).set({
        key: key,
        expires: expireTime,
        banned: false
    });

    alert("Generated Key:\n" + key);
    loadAllKeys();
};

// -------------------------
//  Search Key
// -------------------------

document.getElementById("searchKey").oninput = () => {
    let val = document.getElementById("searchKey").value;
    if (val.length < 3) {  
        document.getElementById("searchResult").innerHTML = "";  
        return;
    }

    db.ref("keys/" + val).once("value", snap => {
        if (snap.exists()) {
            let d = snap.val();
            document.getElementById("searchResult").innerHTML =
                `<div class='keybox'>
                    <p><b>${d.key}</b></p>
                    <p>Expires: ${new Date(d.expires).toLocaleString()}</p>
                    <p>Status: ${d.banned ? "❌ Banned" : "✔ Active"}</p>
                    <button onclick="banKey('${d.key}')">Ban</button>
                    <button onclick="deleteKey('${d.key}')">Delete</button>
                </div>`;
        } else {
            document.getElementById("searchResult").innerHTML = "<p>No key found</p>";
        }
    });
};

// -------------------------
//  Delete Key
// -------------------------

function deleteKey(key) {
    db.ref("keys/" + key).remove();
    alert("Key deleted: " + key);
    loadAllKeys();
}

// -------------------------
//  Ban Key
// -------------------------

function banKey(key) {
    db.ref("keys/" + key).update({ banned: true });
    alert("Key banned: " + key);
    loadAllKeys();
}

// -------------------------
//  Load All Keys
// -------------------------

function loadAllKeys() {
    db.ref("keys").on("value", snap => {
        let box = document.getElementById("allKeys");
        box.innerHTML = "";

        snap.forEach(child => {
            let d = child.val();
            box.innerHTML +=
                `<div class='keybox'>
                    <b>${d.key}</b><br>
                    Expires: ${new Date(d.expires).toLocaleString()}<br>
                    Status: ${d.banned ? "❌ Banned" : "✔ Active"}<br>
                    <button onclick="banKey('${d.key}')">Ban</button>
                    <button onclick="deleteKey('${d.key}')">Delete</button>
                </div>`;
        });
    });
}

loadAllKeys();
