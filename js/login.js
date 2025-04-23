let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

checkOutAndLogin = function () {
    let inputEmail = document.getElementById("email").value;
    let inputPassword = document.getElementById("password").value;
    let printMistake = document.getElementById("mistake");

    if (accounts.some(account => account.email === inputEmail) && accounts.some(account => account.password === inputPassword)) {
        alert("login success!!");
        printMistake.innerHTML = "";
        location.href = '../pages/admin/project_management.html';
    } else {
        printMistake.innerHTML = "Password incorrect or account not exists!!";
    }
}

forgotPass = function () {
    if (confirm("Are you sure to reset your password ???")) {
        let answer = prompt("Please enter recovery phrase: ");
        let found = accounts.find(account => account.securityAnswer === answer);
        if(found) {
            found.securityAnswer = prompt("Enter your new password: ", found.securityAnswer);
            alert("Password changed!!");
        } else {
            alert("Security answer incorrect!!!");
        }
    }
}
