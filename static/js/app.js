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

const getJson = async (url = '', data = {}) => {
    try {
        let response = await makePostRequest(url, data);
        return response.json();
    } catch (err) {
        throw new Error(err);
    }
};

const getHTML = async (url = '', data = {}) => {
    try {
        let response = await makePostRequest(url, data);
        return response.text();
    } catch (err) {
        throw new Error(err);
    }
};

const makePostRequest = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrftoken,
            'Content-Type': 'application/json',
            'x-requested-with': 'XMLHttpRequest',
        },
        body: JSON.stringify(data)
    });
};

const stringToHTML = str => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};