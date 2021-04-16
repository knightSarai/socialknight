let imageListPage = 1;
let empty_page = false;
let block_request = false;

const handleScroll = async (elem = document.documentElement) => {
    const scrollableHeight = elem.scrollHeight - elem.clientHeight;
    const RATIO = 0.1;
    const scrolledEnough = (elem.scrollTop / scrollableHeight) > RATIO;

    if (scrolledEnough && !empty_page && !block_request) {
        block_request = true;
        imageListPage++;
        const data = await getHTML('/images/', {page: imageListPage});
        if (data === '') empty_page = true;
        else {
            const domImageList = $('#image-list');
            const doc = stringToHTML(data);
            doc
                .querySelectorAll('.image')
                .forEach(img => {
                    domImageList.append(img);
                });
            block_request = false;
        }
    }
    selectPageImagesAndAnimate();

};

const animateImages = img => {
    setTimeout(() => !img.classList.contains('animate') && img.classList.add('animate'), 100);
};

const selectPageImagesAndAnimate = () => {
    document
        .querySelectorAll('.image')
        .forEach(animateImages);
};

(function () {
    window.addEventListener('scroll', () => handleScroll());
    selectPageImagesAndAnimate();
})();


