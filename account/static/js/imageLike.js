const $ = element => document.querySelector(element);

const getCookie = name => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

let csrftoken = getCookie('csrftoken');

const postDate = async (url = '', data = {}) => {
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return response.json();
    } catch (err) {
        throw new Error(err);
    }

};


likeBtn = $('#like-btn');
link = likeBtn.getAttribute('data-link');
imageId = likeBtn.getAttribute('data-id');
imageAction = likeBtn.getAttribute('data-action');

const postData = {
    id: imageId,
    action: imageAction
};

likeBtn.addEventListener('click', async () => {
    const data = await postDate(link, postData);
    if (data.status === 'ok') {
        const likeBtn = $('#like-btn')
        let preAction = likeBtn.getAttribute('data-action');
        likeBtn.setAttribute(
            'data-action',
            preAction === 'like' ? 'unlike' : 'like'
        );
        likeBtn.textContent = preAction === 'like' ? 'unlike' : 'like';
        const totalLikeSpan = $('.total-likes')
        let prevLikesTotal = parseInt(totalLikeSpan.textContent)
        console.log(prevLikesTotal);
        totalLikeSpan.textContent = preAction === 'like' ? prevLikesTotal + 1 : prevLikesTotal - 1

    }
});