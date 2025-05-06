let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
// localStorage.setItem("isLogIn")
let isLogIn = "";

let adminAccount = null;
if (!localStorage.getItem("adminAccount")) {
    adminAccount = { email: "admin123@gmail.com", password: "Admin@12345", role: "admin" };
    localStorage.setItem("adminAccount", JSON.stringify(adminAccount));
} else {
    adminAccount = JSON.parse(localStorage.getItem("adminAccount"));
}

checkOutAndLogin = function () {
    let inputEmail = document.getElementById("email").value;
    let inputPassword = document.getElementById("password").value;
    let printMistake = document.getElementById("mistake");

    //kiem? tra tai khaon thuong`
    let account = accounts.find(account => account.email === inputEmail && account.password === inputPassword);

    if (account) {
        printMistake.innerHTML = "";
        sessionStorage.setItem("isLogIn", JSON.stringify(account.email));
        sessionStorage.setItem("userLogIn", JSON.stringify(account.role));
        // alert("Login success!!");
        const myModal = new bootstrap.Modal(document.getElementById('alertModal'));
        document.getElementById('alertModalBody').innerHTML = "Đăng nhập thành công!!";
        myModal.show();
        document.getElementById('closeModal').addEventListener('click', function () {
            myModal.hide();
            location.href = '../pages/project-management.html';
        });
    } else {
        printMistake.innerHTML = "Password incorrect or account not exists!!";
    }

    //kiem? tra xem co' phai? admin hay khong
    if (inputEmail === adminAccount.email && inputPassword === adminAccount.password) {
        printMistake.innerHTML = "";
        sessionStorage.setItem("isLogIn", JSON.stringify(adminAccount.role));
        sessionStorage.setItem("userLogIn", JSON.stringify("ADMIN"));
        // alert("login success!!");
        const myModal = new bootstrap.Modal(document.getElementById('alertModal'));
        document.getElementById('alertModalBody').innerHTML = "Đăng nhập thành công!!";
        myModal.show();
        document.getElementById('closeModal').addEventListener('click', function () {
            myModal.hide();
            location.href = '../pages/project-management.html';
        });
    }
}


forgotPass = function () {
    if (confirm("Are you sure to reset your password ???")) {
        let answer = prompt("Please enter recovery phrase: ");
        let found = accounts.find(account => account.securityAnswer === answer);
        if (found) {
            found.securityAnswer = prompt("Enter your new password: ", found.securityAnswer);
            alert("Password changed!!");
        } else {
            alert("Security answer incorrect!!!");
        }
    }
}
