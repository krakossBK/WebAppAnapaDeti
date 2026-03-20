const cookieV2 = document.querySelector('.cookie-v-2');

if (cookieV2) {
    if (localStorage.getItem('cookie_v_2') === 'hidden') {
        cookieV2.classList.add('hidden');
    } else {
        cookieV2.classList.remove('hidden');
    }

    cookieV2.addEventListener('click', (event) => {
        const isButton = event.target.classList.contains('cookie-v-2__button');
        if (isButton) {
            event.currentTarget.classList.add('hidden');
            localStorage.setItem('cookie_v_2', 'hidden');
        }
    });
}
