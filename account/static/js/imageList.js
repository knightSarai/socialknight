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

const postData = async (url = '', data = {}) => {
    try {
        let response = await fetch(url, {
            method: 'POST',
            is_ajax:true,
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
let page = 1;
let empty_page = false;
let block_request = false;

const container = document.querySelector('.container');

window.addEventListener('scroll', async () => {
    const {scrollHeight, scrollTop, clientHeight} = document.documentElement;
    let scrolledEnough = scrollTop + clientHeight > scrollHeight - 100;
    if (scrolledEnough && !empty_page && !block_request) {
        block_request = true;
        page++;
        const data = await postData(link, {page});
        if (data === '') empty_page = true;
        else {
            block_request = false;
            $('#image-list').append(data);
        }
    }
});