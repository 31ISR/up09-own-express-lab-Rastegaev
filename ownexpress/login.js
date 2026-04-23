const email = document.querySelector("#email")
const pass = document.querySelector("#pass")
const loginButton = document.querySelector("#loginButton")

async function login() {
    const emailText = email.value;
    const passText = pass.value;
    
    console.log('Отправка:', emailText, passText);
    
    try {
        const response = await fetch("https://zany-winner-975xvj5wv9652pvqp-3001.app.github.dev/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailText,
                password: passText,
            })
        });
        
        const data = await response.json();
        console.log('Ответ сервера:', data);
        alert(123)
        
        
        if (response.ok) { 
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.role));
            }
            if(data.role === "admin"){
                window.location.href = "admin.html"; 
                return   
            }else if(data.role == "user"){
                window.location.href = "index.html";
                return
            }else{
                window.location.href = "register.html";
                return
            }
            
            
            
        } else {
           
            alert(data.error || 'Ошибка входа');
        }
        
    } catch (error) {
        console.error('Ошибка соединения:', error);
        alert('Не удалось соединиться с сервером');
    }
}
loginButton.addEventListener('click', login)