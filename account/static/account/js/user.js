const followBtn = $('#follow-btn');
const link = followBtn.getAttribute('data-link');
const userID = followBtn.getAttribute('data-id');
const userAction = followBtn.getAttribute('data-action');

followBtn.addEventListener('click', async () => {
    const data = await getJson(link, {
        id: userID,
        action: userAction
    });
    if (data.status === 'ok') {
        const followBtn = $('#follow-btn');
        const preAction = followBtn.getAttribute('data-action');
        followBtn.setAttribute(
            'data-action',
            preAction === 'follow' ? 'unfollow' : 'follow'
        );
        followBtn.textContent = preAction === 'follow' ? 'unfollow' : 'follow';
        const totalFollowerSpan = $('.follower-count .total');
        let prevFollowerTotal = parseInt(totalFollowerSpan.textContent);
        totalFollowerSpan.textContent = preAction === 'follow' ? prevFollowerTotal + 1 : prevFollowerTotal - 1;
    }
});