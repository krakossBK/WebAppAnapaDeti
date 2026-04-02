'use strict';
const hrefOrigin = window.location.origin; //  javascript.info/url
const log = console.log; // Мы часто будем выводить данные в консоль, поэтому создадим такую "утилиту": habr.com/ru/companies/macloud/articles/557422/
const logEr = console.error;
var textOk = "ok";
var textError = "error";
var textNo = "no";
//var currentUserId = document.getElementById('currentUserId') !== null ? document.getElementById('currentUserId').value : "";

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

function showError(item, content) {
    //  отображение Ошибок
    const $divParent = item.parentElement;
    const $divInput = $divParent.parentElement;
    const $spanError = $divParent.nextElementSibling;
    $divInput.classList.add('input--error');
    $spanError.textContent = content;
}
function hideError(item) {
    // отображение Ошибок
    const $divParent = item.parentElement;
    const $divInput = $divParent.parentElement;
    const $spanError = $divParent.nextElementSibling;
    $divInput.classList.remove('input--error');
    $spanError.textContent = "";
}

/**
 * 
 * @param {any} textMsg
 */
function createConfirmPopupLogin(textMsg) {
    const $popup = createPopup({
        text: textMsg,
        btnText: "OK",
        btnCallback: () => {
            removePopup($popup);
        },
    });
}
/**
 * 
 * @param {any} textMsg
 */
function createConfirmPopupAlert(textMsg) {
    //  ✅  alert ✓ ✓ ✓
    const $popup = createPopup({
        text: textMsg,
        btnText: "OK",
        btnCallback: () => {
            removePopup($popup);
        },
    });
}
/**
 * 
 * @param {any} textMsg
 */
function createConfirmPopupAlertInput(textMsg) {
    //  ✅  alert &&  inputT ✓ ✓ ✓
    const $popup = createPopup({
        text: textMsg,
        btnText: "OK",
        inputText: true,
        btnCallback: () => {
            removePopup($popup);
        },
    });
}
/**
 * 
 * @param {any} textError
 * @param {any} textNull
 * @param {any} itemError
 * @param {any} messageError
 */
function createConfirmPopupAlertShowError(textError, textNull, itemError, messageError) {
    //  ✅  alert ✓ ✓ ✓
    const $popup = createPopup({
        text: textError,
        btnText: "OK",
        btnCallback: () => {
            removePopup($popup);
            textNull = '';
            showError(itemError, messageError);
            return false;
        },
    });

}

/**
 * 
 * @param {any} textMsg
 * @param {any} href
 */
function createConfirmPopupAlertHref(textMsg, href) {
    //  ✅  alert and goto hRef✓ ✓ ✓
    const $popup = createPopup({
        text: textMsg,
        btnText: "OK",
        btnCallback: () => {
            removePopup($popup);
            location.href = href;
        },
    });
}
//********************************************************** */

let isFireFox = false;
let isEdge = false;
let isChrome = false;
let isSafari = false;
let isYandex = false;
var navAppName = "navAppName";// navigator.appName;
var navAppVersion = "1.0";// navigator.appVersion;

function checkBrowser() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|yabrowser|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edg|YaBrowser)\/(\d+)/);
        if (tem != null)
            return { name: tem[1].replace('OPR', 'Opera'), version: tem[2] };
    }

    M = M[2] ? [M[1], M[2]] : [navAppName, navAppVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null)
        M.splice(1, 1, tem[1]);
    return { name: M[0], version: M[1] };
}
var browserSpecs = checkBrowser();

if (browserSpecs.name === 'Edg')
    isEdge = true;
if (browserSpecs.name === 'Opera' ||
    browserSpecs.name === 'Chrome') {
    isChrome = true;
}
if (browserSpecs.name === 'YaBrowser')
    isYandex = true;
if (browserSpecs.name === 'Firefox')
    isFireFox = true;
if (browserSpecs.name === 'Safari')
    isSafari = true;