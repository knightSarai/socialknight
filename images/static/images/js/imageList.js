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