var x =10;

function retrievePasswords() {
    var passwordField = document.getElementById('password');
    passwordField.addEventListener('input', checkPasswords)
    var cpasswordField = document.getElementById('cpassword');
    cpasswordField.addEventListener('input', checkPasswords)

}

function checkPasswords() {
    var passwordField = document.getElementById('password').value;
    var cpasswordField = document.getElementById('cpassword').value;

/*
    console.log("password length:", passwordField.length); //just for debugging and checking if it workde
    console.log("cpassword length:", cpasswordField.length);// dont need this anymore.
*/
    if(cpasswordField.length >= 1)
    if (passwordField == cpasswordField) {
        console.log("works");
        x=11;
    } else {
        console.log("not work");
        x=9;
    }
}





