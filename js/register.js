let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
// let adminAccount = JSON.parse(localStorage.getItem("adminAccount")) || {};
let adminAccount = null;
if(!localStorage.getItem("adminAccount")) {
    adminAccount = {email: "admin123@gmail.com", password: "Admin@12345", role: "admin"};
    localStorage.setItem("adminAccount", JSON.stringify(adminAccount));
} else {
    adminAccount = JSON.parse(localStorage.getItem("adminAccount"));
}

// makeSecurityAnswer = () => {
//     let 
// }

checkOutAndRegister = function () {
    console.log(adminAccount);
    let fullname = document.getElementById("fullname").value;
    let inputEmail = document.getElementById("email").value;
    let inputPassword = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    let printMistake = document.getElementById("mistake");
    printMistake.innerHTML = "";
    // let flag = true;

    if(fullname === "") {
        printMistake.innerHTML = "Fullname cannot empty!!";
        return;
    }

    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regexEmail.test(inputEmail)) {
        printMistake.innerHTML = "Invalid email!!";
        return;
    }

    let isExisted = false;
    if(inputEmail === adminAccount.email) {
        isExisted = true;
    }
    if (isExisted) {
        printMistake.innerHTML = "Email already exists!! ";
        return;
    }

    isExisted = accounts.some(account => account.email === inputEmail);
    if (isExisted) {
        printMistake.innerHTML = "Email already exists!! ";
        return;
    }

    if (confirmPassword !== inputPassword) {
        printMistake.innerHTML = "Confirm password wrong!!";
        return;
    }

    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regexPassword.test(inputPassword)) {
        printMistake.innerHTML = "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 number, and 1 special character!!";
        return;
    }

    let answer = prompt("Set a recovery phrase. It will be used to reset your password if needed");
    // accounts.push({id: ++accounts.length, fullname: fullname, email: inputEmail, password: inputPassword, securityAnswer: answer});
    let newId = accounts.length + 1;
    accounts.push({id: newId, fullname: fullname, email: inputEmail, password: inputPassword, role: "member", securityAnswer: answer, avatarUrl: ""});
    localStorage.setItem("accounts", JSON.stringify(accounts));
    // alert("Register successfully!! Please Login");
    const myModal = new bootstrap.Modal(document.getElementById('alertModal'));
    document.getElementById('alertModalBody').innerHTML = "Register successfully!! Please Login";
    myModal.show();
    document.getElementById('closeModal').addEventListener('click', function () {
        myModal.hide();
        location.href = '../pages/login.html';
    });
}