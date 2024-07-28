function takeRequest() {
    // Get the value from the input field
    var RequestList = document.getElementById("items").value;

    // Print the value to the console
    console.log('Items:', RequestList);

    // Prevent form submission
    window.location.href= "Testing.HTML";
    return false;
}
