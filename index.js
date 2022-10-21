console.log('hi');

let emailDiv = document.querySelector('#email')
let messageDiv = document.querySelector('#message')
let passwordDiv = document.querySelector('#password')
let registerMessageDiv = document.querySelector('#register-message')


let submitButton = document.querySelector('#submitForm')

submitButton.addEventListener('click', ()=>{
    let email = emailDiv.value
    let message = messageDiv.value
    let password = passwordDiv.value

    // console.log(email);
    // console.log(message);
    let detail = {email, message, password}
    if (password.length < 8) {
        registerMessageDiv.innerText = 'Please input a password with at least 8 words'
        return
    }
    registerMessageDiv.innerText = "Congrat! registration successful"
    console.log(detail);
})