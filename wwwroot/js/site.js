'use strict';
const hrefOrigin = window.location.origin; //  javascript.info/url
const log = console.log; // Мы часто будем выводить данные в консоль, поэтому создадим такую "утилиту": habr.com/ru/companies/macloud/articles/557422/
const logEr = console.error;

let burger = document.getElementById("burger");
let overlay = document.getElementById("listmenu");
const $headerNavLink = document.querySelector(".nav-link.text-dark");
let showMenu = false;
overlay.classList.add("display_none");

burger.addEventListener("click", () => {
    showMenu = !showMenu;
    let navh1 = $headerNavLink.parentElement;
    if (showMenu) {
        burger.classList.add("active");
        overlay.classList.remove("display_none");
        gsap.to(overlay, 1, {
            clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
            ease: "expo.in"
        });
        navh1.classList.add("white");
        $headerNavLink.classList.add("text-dark-red");
    } else {
        burger.classList.remove("active");
        gsap.to(overlay, 1, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            ease: "expo.out",
            onComplete: () => (overlay.classList.add("display_none"))
        });
        $headerNavLink.classList.remove("text-dark-red");
        navh1.classList.remove("white");
    }
});
