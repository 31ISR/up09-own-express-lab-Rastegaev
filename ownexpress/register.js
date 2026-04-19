const username = document.querySelector('#username')
const email = document.querySelector('#email')
const pass = document.querySelector('#pass')
const registerButton = document.querySelector('#registerBtn')
async function register() {
    const name = username.value;
    const emailText = email.value;
    const passText = pass.value;
    console.log(
        name, emailText, passText
    )
    try {
        const response = await fetch("https://8tfvph95-3001.euw.devtunnels.ms/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": name,
                "email": emailText,
                "password": passText,
                "role": "user"
            })
        })
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.error(error)
    }
    window.location.href="login.html"
}
registerButton.addEventListener('click', register)