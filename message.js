'use strict';
// -------functional mas------------
if (window.screen.width > "838") {
    setTimeout(() => {
        feedBack.style.display = "block";
    }, 2000);
    setTimeout(() => {
        feedBack.style.right = "50px";
    }, 3000);
}

let feedBack_header = document.querySelector(".feedBack_header");
let feedBack = document.querySelector(".feedBack");
let write_message = document.querySelector(".write_message");

let fileInput = document.querySelector("#file");
let chosen_picture = document.querySelector(".chosen_picture");
let show_picture = document.querySelector(".show_picture");
let delete_picture_btn = document.querySelector(".delete_picture");

feedBack_header.addEventListener("click", () => {
    feedBack.classList.add("active");
    close__btn.classList.add("active");
    document.querySelector(".feedBack_header span").setAttribute("style", "font-size: 18px");
    write_message.focus();
});

let close__btn = document.querySelector(".close__btn");

close__btn.addEventListener("click", () => {
    feedBack.classList.remove("active");
    close__btn.classList.remove("active");
    document.querySelector(".feedBack_header span").removeAttribute("style");
});

let feedBack_body = document.querySelector(".feedBack_body");
let user_writed = document.querySelector(".user_writed");

function to_chat() {
    if (fileInput.files.length != 0) {
        user_writed.append(document.querySelector(".chosen_picture img"));
        delete_picture();
        scrollDown();
    }
    if (write_message.value.length != 0) {
        let p = document.createElement("p");
        p.innerHTML = write_message.value;
        user_writed.append(p);
        write_message.value = "";
        scrollDown();
    }
    write_message.focus();
}

function scrollDown() {
    feedBack_body.scrollTo(0, feedBack_body.scrollHeight);
}

// ------------send massege-------------

const form = document.querySelector("#form");

form.addEventListener("submit", to_send);
async function to_send(e) {
    e.preventDefault();
    if (localStorage.getItem("MessageUserInfo") === null) {
        show_form_list();
        return;
    }
    feedBack.classList.add("_sending");

    if (write_message.value.length != 0 || fileInput.files.length != 0) {
        let formData = new FormData(form);
        let registerList = JSON.parse(localStorage.getItem("MessageUserInfo"));
        for (let key in registerList) formData.append(key, registerList[key]);

        try {
            await Email.send({
                SecureToken: "a0dbb6f3-f6e6-4f85-82c7-5a7729bd5c78",
                To: 'boyakhchyan@gmail.com',
                From: "hovo91_91@mail.ru",
                Subject: "Adaptive-Menu: feedBack message",
                Body: JSON.stringify(localStorage.getItem("MessageUserInfo")) + Array.from(formData)[1],
            });
        } catch (error) {
            alert(error);
            feedBack.classList.remove("_sending");
        }
    }
    to_chat();
    feedBack.classList.remove("_sending");
}

// ------------validate oninput, onblur jamanak------------
let forChack = document.querySelectorAll("._forChack");
forChack.forEach(input => {
    input.oninput = () => {
        if (inputValidate(input)) {
            input.parentNode.classList.add("ok");
        } else {
            input.parentNode.classList.remove("ok");
        }
    }
    input.onblur = () => {
        if (input.value.length > 0 && !inputValidate(input)) {
            formAddError(input);
        }
    }
});
// ---------------------------------------------------
function formValidate() {
    let error = 0;
    forChack.forEach(input => {
        if (!inputValidate(input)) { // amen input@ stugeluc ete ka sxal error++
            formAddError(input);
            error++;
        }
    });
    return error;
}

function inputValidate(input) {
    formRemoveError(input); // stugeluc arach errorner@ zroiacnum enq
    if (input.value === "") {
        return false;
    } else if (input.getAttribute("type") === "number") {
        return telTest(input);
    } else if (input.getAttribute("type") === "email") {
        return emailTest(input);
    }
    return true;
}

function telTest(input) {
    if (input.value.length < 9) {
        return false;
    }
    return true;
}
function emailTest(input) {
    return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(input.value);
}

function formAddError(input) {
    input.classList.add("_error");
    input.parentNode.classList.add("_error");
}
function formRemoveError(input) {
    input.classList.remove("_error");
    input.parentNode.classList.remove("_error");
}

function show_form_list() {
    document.querySelector(".message_register_list").setAttribute("style", "display:block");
    document.querySelector(".writing__tools").classList.add("_close");
    new Audio("./audio/pop_up_004_45050.mp3").play();
    scrollDown();
}
function hidden_form_list() {
    document.querySelector(".message_register_list").removeAttribute("style");
    document.querySelector(".writing__tools").classList.remove("_close");
}

document.querySelector(".register_list_btn").onclick = saveMassegeUserInfo;

function saveMassegeUserInfo() {
    let error = formValidate();
    if (error === 0) {
        let userInfo = {
            name: "",
            Tel: "",
            Email: ""
        }
        for (let i = 0; i < forChack.length; i++) {
            let input = forChack[i];
            if (input.getAttribute("type") === "text") {
                userInfo.name = input.value;
            } else if (input.getAttribute("type") === "number") {
                userInfo.Tel = input.value;
            } else {
                userInfo.Email = input.value;
            }
        }
        localStorage.setItem("MessageUserInfo", JSON.stringify(userInfo));
        hidden_form_list();
        write_message.focus();
    }
}
// ------------------------file-----------------------------

fileInput.addEventListener("change", readFile);

function readFile() {
    let file = this.files[0];
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        alert("Թույլատրվում է միյաին նկար");
        fileInput.value = "";
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        alert("Նկարը պետկ է լինի 3-մբ ոչ ավել");
        return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
        chosen_picture.innerHTML = `<img src="${e.target.result}" alt="photo">`;
        show_picture.setAttribute("style", "transform: scale(1)");
    }
    reader.onerror = () => {
        alert("Տեղի է ունեցել սխալ, նկարը չի բեռնվել...");
    }
}

delete_picture_btn.addEventListener("click", delete_picture);

function delete_picture() {
    show_picture.removeAttribute("style");
    chosen_picture.innerHTML = "";
    fileInput.value = "";
}








