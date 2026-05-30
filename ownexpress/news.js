const container = document.querySelector(".grid");

async function news() {
    try {
        const response = await fetch("https://vigilant-succotash-695p645wqxq4c4q4w-3001.app.github.dev/api/admin/news", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
                
            },
        });
        
        const newsArray = await response.json();
        
        newsArray.forEach((item, index) => {
            const html = `
            <article class="news-card" data-category="ai">
            <img src="img/${item.secondary_image}" alt="${item.title}">
            <div class="content">
            <h3>${item.title}</h3>
            <p>${item.excerpt}</p>
            <a href="${item.name}.html">
                            <span>Подробнее →</span>
                            </a>
                            <br>
                            ${JSON.parse(localStorage.getItem("user"))?.role == "admin" ? `<button class="btn--delete" data-id="${item.id}">Удалить</button>
                            <br>
                            <button data-id="${item.id}" onclick="">редактировать</button>` : ""}
                            
                        </div>
                    </article>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
        
        const deleteButton = document.querySelectorAll(".btn--delete")
        console.log(deleteButton);
        
        deleteButton.forEach(el=>{
            el.addEventListener('click', handleDelete)
        })
        console.log('✅ Новости загружены');
        
    } catch (error) {
        console.error('Ошибка соединения:', error);
        alert('Не удалось соединиться с сервером');
    }
}

news();

async function handleDelete(event) {
    console.log(event);
    
    try {
        const response = await fetch(`https://vigilant-succotash-695p645wqxq4c4q4w-3001.app.github.dev/api/admin/news/${event.target.dataset.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + localStorage.getItem('token')
            },
            
        });
        const data = await response.json();
        console.log('Ответ сервера:', data);
    
    }catch (error) {
        console.error('Ошибка соединения:', error);
        alert('Не удалось соединиться с сервером');
    }
}

