const container = document.querySelector(".grid");

async function news() {
    try {
        const response = await fetch("https://8tfvph95-3001.euw.devtunnels.ms/api/admin/news", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        
        const newsArray = await response.json();
        
        newsArray.forEach((item, index) => {
            const html = `
                <a href="${item.name}.html">
                    <article class="news-card" data-category="ai">
                        <img src="img/${item.secondary_image}" alt="${item.title}">
                        <div class="content">
                            <h3>${item.title}</h3>
                            <p>${item.excerpt}</p>
                            <span>Подробнее →</span>
                        </div>
                    </article>
                </a>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
        
        console.log('✅ Новости загружены');
        
    } catch (error) {
        console.error('Ошибка соединения:', error);
        alert('Не удалось соединиться с сервером');
    }
}

news();