var x = 10;
var submitButton;

function retrievePasswords() {
    var passwordField = document.getElementById('password');
    passwordField.addEventListener('input', checkPasswords);
    var cpasswordField = document.getElementById('cpassword');
    cpasswordField.addEventListener('input', checkPasswords);
    submitButton = document.querySelector('input[type="submit"]');

    submitButton.disabled = true;
}

function checkPasswords() {
    var passwordField = document.getElementById('password').value;
    var cpasswordField = document.getElementById('cpassword').value;
    var cpasswordInput = document.getElementById('cpassword');
    var errorMessage = document.getElementById('error-message');

    /*
        console.log("password length:", passwordField.length); //just for debugging and checking if it works
        console.log("cpassword length:", cpasswordField.length);// don't need this anymore.
    */
    if (cpasswordField.length >= 1) {
        if (passwordField === cpasswordField) {
            console.log("works");
            cpasswordInput.style.borderColor = 'green';
            errorMessage.style.display = 'none';
            submitButton.disabled = false;
            x = 11;
        } else {
            console.log("not work");
            cpasswordInput.style.borderColor = 'red';
            errorMessage.style.display = 'block';
            submitButton.disabled = true;
            x = 9;
        }
    } else {
        submitButton.disabled = true;
    }
}
