const input = document.getElementById("fname");
const inputValue = input.value;
console.log(inputValue);

function takeName() {
    // Get the values from the input fields
    var firstName = document.getElementById("fname").value;
    var lastName = document.getElementById("lname").value;

    // Print the values to the console
    console.log('First name:', firstName);
    console.log('Last name:', lastName);

    window.location.href= "Testing.HTML";
    return false; // Prevent form from submitting

}