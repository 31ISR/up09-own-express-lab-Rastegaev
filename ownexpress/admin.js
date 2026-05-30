const button = document.getElementById("buttonSubmit")
async function newState() {
    try {
        const nameState = document.getElementById("namestate").value;
        const title = document.getElementById("title").value;
        const excerpt = document.getElementById("excerpt").value;
        const content = document.getElementById("content").value;
        const mainImage = document.getElementById("mainImage").files[0];
        const secondaryImage = document.getElementById("secondaryImage").files[0]
        const formData = new FormData();
        formData.append('nameState', nameState);
        formData.append('title', title);
        formData.append('excerpt', excerpt);
        formData.append('content', content);
        formData.append('mainImage', mainImage);
        formData.append('secondaryImage', secondaryImage);

        const response = await fetch("https://vigilant-succotash-695p645wqxq4c4q4w-3001.app.github.dev/api/admin/news", {
            method: "POST",
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
        });
        const data = await response.json();
        console.log('Ответ:', data);

        if (response.ok) {
            alert('✅ Новость создана!');
        } else {
            alert('❌ Ошибка: ' + data.error);
        }
    } catch (error) {
        console.error('Ошибка соединения:', error);
        alert('Не удалось соединиться с сервером');
    }

}
button.addEventListener('click', newState)