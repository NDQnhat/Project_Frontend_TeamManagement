let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

// makeSecurityAnswer = () => {
//     let 
// }

checkOutAndRegister = function () {
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

    let isExisted = accounts.some(account => account.email === inputEmail);
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

    accounts.push({ email: inputEmail, password: inputPassword, securityAnswer: answer});
    localStorage.setItem("accounts", JSON.stringify(accounts));
    alert("Register successfully!! Please Login");
    location.href = '../../pages/authen/login_page.html';
}