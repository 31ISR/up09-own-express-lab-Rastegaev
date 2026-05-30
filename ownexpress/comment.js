
console.log("привет")
const button = document.querySelector('.comment-submit')
const nameState = document.getElementById('12').textContent;
const container = document.querySelector('#commentsContainer')

async function addComment() {
    const textComment = document.querySelector('.comment-text').value;

    try {
        const response = await fetch("https://vigilant-succotash-695p645wqxq4c4q4w-3001.app.github.dev/api/comment", {
            method: "POST",
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "textComment": textComment,
                "nameState": nameState
            })
        })
        console.log(response)
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.error('Ошибка соединения:', error);
        alert('Не удалось соединиться с сервером');
    }
}
button.addEventListener('click', addComment);

async function getComment() {
    try {
        const response = await fetch(`https://vigilant-succotash-695p645wqxq4c4q4w-3001.app.github.dev/api/comment/${nameState}`, {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        });

        const newsArray = await response.json();

        newsArray.forEach((item, index) => {
            const html = `
            <div class="comment-item">
              <div class="comment-avatar">👤</div>
              <div class="comment-body">
                <span class="comment-author">${item.userName}</span>
                <p class="comment-message">${item.textComment}</p>
              </div>
            </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        console.log('✅ Новости загружены');

    } catch (error) {
        console.error('Ошибка соединения:', error);
        alert('Не удалось соединиться с сервером');

    }
}
getComment()