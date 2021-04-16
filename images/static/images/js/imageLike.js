likeBtn = $('#like-btn');
link = likeBtn.getAttribute('data-link');
imageId = likeBtn.getAttribute('data-id');
imageAction = likeBtn.getAttribute('data-action');

likeBtn.addEventListener('click', async () => {
    const data = await postData(link, {
        id: imageId,
        action: imageAction
    });
    if (data.status === 'ok') {
        const likeBtn = $('#like-btn');
        let preAction = likeBtn.getAttribute('data-action');
        likeBtn.setAttribute(
            'data-action',
            preAction === 'like' ? 'unlike' : 'like'
        );
        likeBtn.textContent = preAction === 'like' ? 'unlike' : 'like';
        const totalLikeSpan = $('.total-likes');
        let prevLikesTotal = parseInt(totalLikeSpan.textContent);
        totalLikeSpan.textContent = preAction === 'like' ? prevLikesTotal + 1 : prevLikesTotal - 1;
    }
});