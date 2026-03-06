'use strict';
const hrefOrigin = window.location.origin; //  javascript.info/url
const clickHandler = (document.ontouchstart !== null) ? 'click' : 'touchstart';
const log = console.log; // Мы часто будем выводить данные в консоль, поэтому создадим такую "утилиту": habr.com/ru/companies/macloud/articles/557422/
const logEr = console.error;
const validExtsImages = new Array(".png", ".jpeg", ".jpg", ".webp", ".heic", ".heif", ".avif");
const validExtsFiles = new Array(".rtf", ".doc", ".docx", ".odt", ".xls", ".xlsx", ".ods", ".pdf", ".txt", ".csv", ".zip", ".rar");
const validExtsAll = [...validExtsImages, ...validExtsFiles];
var searchBtnFilter = document.getElementById('search-btn-filter');
var searchBtnSubmit = document.getElementById('search-btn-submit');
var searchField = document.getElementById('search-field');
var bntClearSearchField = document.getElementById('bnt-clear-search-field');

var textOk = document.getElementById('textOk') !== null ? document.getElementById('textOk').value : "";
var textErrors = document.getElementById('textErrors') !== null ? document.getElementById('textErrors').value : "";
var textNo = document.getElementById('textNo') !== null ? document.getElementById('textNo').value : "";
var currentUserId = document.getElementById('currentUserId') !== null ? document.getElementById('currentUserId').value : 0;

if (window.location.pathname == '/registration' ||
    window.location.pathname.includes('/new-ad/') ||
    window.location.pathname.includes('/offer-edit/')) {

    // ✅ Start Set Town ID /registration || /new-ad || /offer-edit
    const $registerCity = document.querySelector('#register-city');
    const $townItemBtns = document.querySelectorAll('.category__item-btn');
    $townItemBtns.forEach(function (townItemBtn) {
        townItemBtn.addEventListener(clickHandler, function () {
            $registerCity.dataset.townId = townItemBtn.dataset.townId;
        })
    })
    /* END Set TownID ❌ ✓ ✓ ✓ /registration  ||  /new-ad ||  /offer-edit ❌ ✓ ✓ ✓  */
}

if (parseInt(currentUserId) > 0) {
    // ✅ Start обновить теги в меню  _LeftMenu.cshtml */
    function init() {
        if (document.querySelector('.lk-menu.lk-sidebar__menu') !== null) {
            const $ulMenu = document.querySelector('.lk-menu.lk-sidebar__menu');
            const $lkMenuLinks = $ulMenu.querySelectorAll('.lk-menu-link.lk-menu__link');
            $lkMenuLinks.forEach(function (item) {
                let pathName = window.location.pathname.split("/");
                let itemHref = item.getAttribute('href').substring(1);
                if (pathName[1] == itemHref) {
                    item.classList.add('lk-menu-link--active');
                    let itemParentEl = item.parentElement;
                    itemParentEl.innerHTML.replace('<a', '<div').replace('</a>', '</div>');
                }
            })

            if (document.querySelector('.lk-menu.lk-menu--mobile-row.lk__main-sidebar-menu') !== null) {
                $lkMenuLinks[0].classList.add('lk-menu-link--active');
                let itemElParent = $lkMenuLinks[0].parentElement;
                itemElParent.innerHTML.replace('<a', '<div').replace('</a>', '</div>');

                if (window.location.pathname.includes("subscribe")) {
                    const $menuLk = document.querySelector('.lk-menu.lk-menu--mobile-row.lk__main-sidebar-menu');
                    const $menuLkLinks = $menuLk.querySelectorAll('.lk-menu-link');
                    $menuLkLinks[2].classList.add("lk-menu-link--active");
                }
            }
        }

        if (document.querySelector('.profile-menu__list') !== null) {
            const $profileMenu = document.querySelector('.profile-menu__list');
            const $profileMenuLinks = $profileMenu.querySelectorAll('.profile-menu__link');
            $profileMenuLinks?.forEach(function (item) {
                let pathName = window.location.pathname.split("/");
                let itemHref = item.getAttribute('href').substring(1);
                if (pathName[1] == itemHref)
                    item.classList.add('profile-menu__link--active');
            })

            if (document.querySelector('.lk-menu.lk-menu--mobile-row.lk__main-sidebar-menu') !== null) {
                $profileMenuLinks[0].classList.add('profile-menu__link--active');
                if (window.location.pathname.includes("subscribe")) {
                    const $menuLk = document.querySelector('.lk-menu.lk-menu--mobile-row.lk__main-sidebar-menu');
                    const $menuLkLinks = $menuLk.querySelectorAll('.lk-menu-link');
                    $menuLkLinks[2].classList.add("lk-menu-link--active");
                }
            }
        }
        ////           ✅ 2025  krakoss fixme 

        if (document.querySelector('.header') !== null) {
            const $header = document.querySelector('.header');
            const width = window.innerWidth;
            const $lkSidebar = document.querySelector('.lk-sidebar');
            const $locOrigin = document.location.pathname;
            const $boolOrigin = $locOrigin === "/" ? true : $locOrigin === "/about" ? true : $locOrigin === "/rules" ? true : $locOrigin === "/help" ? true : false;
            if ($header.matches('.header--lk')
                && width > 991
                && $boolOrigin)
                $lkSidebar.style.visibility = 'hidden';
            else
                $lkSidebar?.removeAttribute('style');
        }
    }
    init();
    window.onload = init;
    window.addEventListener("resize", init);
}

function updateSize() {
    heightOutput.textContent = window.innerHeight;
    widthOutput.textContent = window.innerWidth;
}
// ✅ Start link-logout 

const $linkLogouts = document.querySelectorAll('.link-logout');
$linkLogouts.forEach((item) => {

    item.addEventListener(clickHandler, async function () {
        var url = `${hrefOrigin}/logout`;
        let response = await fetch(url, {
            method: 'POST'
        });
        if (response.ok) {
            let result = await response.text();
            if (result == textOk) {
                const $linkLogoutPopup = createPopup({
                    text: "Выход выполнен успешно, ждем Вас снова!",
                    btnText: "OK",
                    btnCallback: () => {
                        sessionStorage.clear(); //Clear sessionStorage
                        window.location.href = '/';
                        removePopup($linkLogoutPopup);
                    },
                });
            }
            else {
                unLockScreen();
                log(result);
            }

        } else {
            unLockScreen();
            log(`Ошибка HTTP: ${response.status}`);
        }
    })
})

// ✅ Отображение Окна Поиск с фильтрацией 
if (isValidElement(searchBtnFilter)) {
    searchBtnFilter.addEventListener(clickHandler, () => {
        const name = "search-filter";// $btn.dataset.popupName;
        const $popup = document.querySelector(`.popup[data-popup-name="${name}"`);
        if (!name || !$popup || $popup.classList.contains("popup--active"))
            return;
        openPopup($popup);

        firstBuidListFilterOkdps(); // search-filter.js
        let index = 0;
        changeTab(name, index) // main.js
    });
}

// ✅ Клик по кнопке Фильтр 
if (isValidElement(searchBtnSubmit)) {
    searchBtnSubmit.addEventListener(clickHandler, (event) => {
        event.preventDefault();
        let productName = searchField.value;
        let idFilter = searchBtnFilter.dataset.idFilter;
        let url = window.location;
        let urlParams = new URLSearchParams(url.search);
        if (urlParams.has('productName'))
            urlParams.delete('productName');
        let first = true;
        if (productName.length > 0) {
            let q = first ? '?' : '&';
            url += `${q}productName=${productName}`;
            first = false;
            bntClearSearchField.classList.add("input__clear-field--active");
            urlParams.append("productName", productName);

        }
        if (parseInt(idFilter) > 0) {
            let q = first ? '?' : '&';
            url += `${q}idFilter=${idFilter}`;
            first = false;
            urlParams.append("idFilter", idFilter);
        }

        //if (urlParams.has('isBuy'))
        //    urlParams.append("isBuy", isBuy); 
        //if (urlParams.has('okdpIdx'))
        //    urlParams.append("okdpIdx", okdpIdx);
        //if (urlParams.has('townIds'))
        //    urlParams.append("townIds");
        //if (urlParams.has('userIds'))
        //    urlParams.append("userIds");
        //if (urlParams.has('adStatusIds'))
        //    urlParams.append("adStatusIds"); 

        log(`goto to page -> ${url}`);
        window.location.href = urlParams.size > 0 ? `${hrefOrigin}/market/all?${urlParams}`
            : `${hrefOrigin}/market/all`;
    });

    bntClearSearchField.addEventListener(clickHandler, (event) => {
        event.preventDefault();
        searchField.value = "";
        bntClearSearchField.classList.remove("input__clear-field--active");
        const urlParams = new URLSearchParams(document.location.search);
        let idFilter = urlParams.has('idFilter')
            ? parseInt(urlParams.get('idFilter'))
            : 0;

        if (idFilter > 1) {
            let url = `${hrefOrigin}/market/all`;
            let first = true;
            let q = first ? '?' : '&';
            url += `${q}idFilter=${idFilter}`;
            first = false;
            log(`goto to page -> ${url}`);
            window.location.href = url;
        }
        else if (idFilter == 1) {
            let searchWord = searchField.value;
            const $useAdStatus = document.querySelector('.use-ad-status');
            const $filterList = document.querySelector(".lk-catalog__filter-list");
            let isBuy = $filterList.dataset.isBuy == "True"
                ? true
                : $filterList.dataset.isBuy == "False"
                    ? false
                    : null;
            let userIds = $filterList.dataset.userIds;
            let okdpIdxs = $filterList.dataset.okdpIdx;
            let townIds = $filterList.dataset.townIds;
            let adStatusId = $useAdStatus.dataset.adStatus;
            gotoSearch(searchWord, isBuy, okdpIdxs, townIds, userIds, adStatusId)
        }
        else
            window.location.href = `${hrefOrigin}/market/all`;
    });
}

function gotoSearch(searchWord, isBuy, okdpIdx, townIds, userIds, adStatusId) {

    let url = `${hrefOrigin}/market/all`;
    let first = true;
    let idFilter = 1;

    if (searchWord.length > 0) {
        let q = first ? '?' : '&';
        url += `${q}ProductName=${searchWord}`;
        first = false;
    }
    if (parseInt(idFilter) > 0) {
        let q = first ? '?' : '&';
        url += `${q}IdFilter=${idFilter}`;
        first = false;
    }
    if (isBuy !== null) {
        let q = first ? '?' : '&';
        url += `${q}IsBuy=${isBuy}`;
        first = false;
    }
    if (userIds.length > 0) {
        let q = first ? '?' : '&';
        url += `${q}UserIds=${userIds}`;
        first = false;
    }
    if (adStatusId.length > 0) {
        let q = first ? '?' : '&';
        url += `${q}AdStatusId=${adStatusId}`;
        first = false;
    }
    if (okdpIdx.length > 0) {
        let q = first ? '?' : '&';
        url += `${q}OkdpIdx=${okdpIdx}`;
        first = false;
    }
    if (townIds.length > 0) {
        let q = first ? '?' : '&';
        url += `${q}TownIds=${townIds}`;
        first = false;
    }
    log(`goto to page -> ${url}`);
    window.location.href = url;
}


// ✅ Start Выбор вида объявления
const $btnAdPlacement = document.querySelector("#ad-placement");
$btnAdPlacement?.addEventListener(clickHandler, () => {

    if (parseInt(currentUserId) > 0) {
        const $selectTypeAdBtns = document.querySelectorAll(".ad-placement__btn");
        adPlacement($selectTypeAdBtns);
    }
    else
        location.href = `/login/`;
});

function adPlacement($selectTypeAdBtns) {
    const $adPlacementTitle = document.querySelector("#ad-placement-title");
    const $adPlacementBack = document.querySelector(".ad-placement__header-back");
    const $selectAdBtns = document.querySelectorAll(".ad-placement__btn.finish-select-ad");
    let availableForAllUsers = true;
    let withLimitedUser = false;
    let isBuy = false;
    let auction = false;
    $selectTypeAdBtns.forEach(($selectTypeAdBtn) => {
        $selectTypeAdBtn.addEventListener(clickHandler, () => {
            $adPlacementTitle.innerHTML = "Размещение объявления";
            if ($selectTypeAdBtn.dataset.isBuy !== undefined) {
                isBuy = $selectTypeAdBtn.dataset.isBuy;
                $adPlacementTitle.innerHTML = "Выбор процедуры";
            }

            if ($selectTypeAdBtn.dataset.auction !== undefined) {
                auction = $selectTypeAdBtn.dataset.auction;
                $adPlacementTitle.innerHTML = "Запрос предложений";
                $adPlacementBack.dataset.adTitle = "Выбор процедуры";
            }

            if ($selectTypeAdBtn.dataset.availableForAllUsers !== undefined) {
                availableForAllUsers = $selectTypeAdBtn.dataset.availableForAllUsers;
                $adPlacementTitle.innerHTML = "Запрос предложений";
                $adPlacementBack.dataset.adTitle = "Выбор процедуры";
            }

            if ($selectTypeAdBtn.dataset.withLimitedUser !== undefined) {
                withLimitedUser = $selectTypeAdBtn.dataset.withLimitedUser;
                $adPlacementTitle.innerHTML = "Запрос предложений";
                $adPlacementBack.dataset.adTitle = "Выбор процедуры";
            }
        });
    });
    $adPlacementBack.addEventListener(clickHandler, () => {
        if ($adPlacementBack.dataset.adTitle == "Выбор процедуры"
            && $adPlacementTitle.innerHTML == "Выбор процедуры")
            $adPlacementTitle.innerHTML = "Размещение объявления";
        else if ($adPlacementBack.dataset.adTitle == "Выбор процедуры"
            && $adPlacementTitle.innerHTML == "Запрос предложений")
            $adPlacementTitle.innerHTML = "Выбор процедуры";
        else
            $adPlacementTitle.innerHTML = $adPlacementBack.dataset.adTitle;
    });   
    $selectAdBtns.forEach(($selectAdBtn) => {
        $selectAdBtn.addEventListener(clickHandler, async (e) => {
            e.preventDefault();
            lockScreen(" "); // включить заставку
            try {
                log(`isBuy  -> ${isBuy}`);
                log(`auction -> ${auction}`);
                log(`availableForAllUsers  -> ${availableForAllUsers}`);
                log(`withLimitedUser  -> ${withLimitedUser}`);

                var url = `${hrefOrigin}/select-type-ad`;
                let formData = new FormData();
                formData.append('isbuy', isBuy);
                formData.append('availableForAllUsers', availableForAllUsers);
                formData.append('withLimitedUser', withLimitedUser);
                let response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    let result = parseInt(await response.text());
                    if (result > 0) {
                        location.href = `/new-ad/${result}`;
                    }
                    else {
                        unLockScreen();
                        log(result);
                    }
                }
                else {
                    unLockScreen();
                    log("Ошибка HTTP: " + response.status);
                }
            }
            catch (e) {
                unLockScreen();
                console.error(e)
                createConfirmPopupAlert(`Ошибка. ${e.status ?? e}`);
            }
        });
    });
}

// ✅  All Functions
function loadJS(target, url) {
    // ✅ Is there a native javascript equivalent to jquery .load() ✓ ✓ ✓
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        target.innerHTML = r.responseText;
    };
    r.send();
}


function createConfirmPopupAlert(data) {
    //  ✅  alert ✓ ✓ ✓
    const $popup = createPopup({
        text: data,
        btnText: "OK",
        btnCallback: () => {
            removePopup($popup);
        },
    });
}
function createConfirmPopupAlertInput(data) {
    //  ✅  alert &&  inputT ✓ ✓ ✓
    const $popup = createPopup({
        text: data,
        btnText: "OK",
        inputText: true,
        btnCallback: () => {
            removePopup($popup);
        },
    });
}
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

function createConfirmPopupAlertHref(data, href) {
    //  ✅  alert and goto hRef✓ ✓ ✓
    const $popup = createPopup({
        text: data,
        btnText: "OK",
        btnCallback: () => {
            removePopup($popup);
            location.href = href;
        },
    });
}

function LocationReload() {
    setTimeout(
        function () {
            location.reload();
        }, 200
    );
};


Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}

const _ = (el) => {
    return document.getElementById(el);
}

const cbConvertToBool = (el) => {
    return el.checked ? true : false;
}

const ReplaceNewline = (inputString) => {

    //  ✅  переход на новую строку ✓ ✓ ✓
    var newline = String.fromCharCode(13, 10);
    var rnBr;
    if (inputString.includes("<br />"))
        rnBr = "<br />";
    else if (inputString.includes("<br>"))
        rnBr = "<br>";
    else
        rnBr = "\n";
    return ReplaceAll(inputString, rnBr, newline.toString());
}
const ReplaceAll = (str, find, replace) => {
    return str.replace(new RegExp(find, 'g'), replace);
}

const getValueUseDDL = (e) => {
    let result = e.childElementCount !== 0 ? e.options[e.selectedIndex].value : e.getAttribute('data-name');
    return parseInt(result);
}

function getDiffDays(startDate, endDate) {
    let dStartDate = startDate.substring(0, 10).split(".");
    let dEndDate = endDate.substring(0, 10).split(".");
    let dateStartDate = new Date(dStartDate[2], parseInt(dStartDate[1]) - 1, dStartDate[0]);
    let dateEndDate = new Date(dEndDate[2], parseInt(dEndDate[1]) - 1, dEndDate[0]);
    let diffDays = parseInt((dateEndDate - dateStartDate) / (1000 * 60 * 60 * 24), 10);
    return diffDays;
}
function MathRoundFloatJS(inputString) {
    return Math.round(inputString * 100) / 100;
}
// https://stackoverflow.com/questions/9453421/how-to-round-float-numbers-in-javascript

function CurrencyFormatHtmlRub(inputString) {
    return inputString.toLocaleString('ru-RU', { maximumFractionDigits: 2, style: 'currency', currency: 'Rub' });
}
function CurrencyFormatHtml(inputString) {
    return inputString.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "A").replaceAll("A", " ").replace(".", ",");
}
function ParseFloatJS(inputString) {
    return inputString.length > 0 ? parseFloat(inputString.toString().replace(",", ".").replaceAll(" ", "")) : 0;
}
function formatNumber(n) {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " "); // format number 1234567,89 to 1 234 567,89

}

// проверить что только цифры 
function containsOnlyNumbers(str) {
    var _str = str.replaceAll(".", "");
    return /^[0-9]+$/.test(_str);
}
// проверить что в конце точка 
function containsOnlyEndPoint(str) {
    let bool = str.endsWith('.');
    log(`containsOnlyEndPoint(${str}) -> ${bool}`);
    return bool;
}

function formatCurrency(input) {
    // format number 1234567,89 to 1 234 567,89
    var input_val = input.value;
    if (input_val === "") { return; }

    var original_len = input_val.length;
    var caret_pos = input.selectionStart;

    if (input_val.indexOf(",") >= 0) {
        var decimal_pos = input_val.indexOf(",");
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);

        left_side = formatNumber(left_side);
        right_side = formatNumber(right_side);
        right_side = right_side.substring(0, 2);
        input_val = left_side + "," + right_side;

    } else
        input_val = formatNumber(input_val);
    input.value = input_val;

    var updated_len = input_val.length;

    caret_pos = updated_len - original_len + caret_pos;

    input.setSelectionRange(caret_pos, caret_pos);
}

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

// ✅ START заставка при загрузке документов
function FadeIn(el) {
    document.querySelector(el).style.display = 'block';
}

const lockScreen = (_content) => {
    let content = _content !== undefined ? (_content.length > 0 ? _content : "") : "";
    document.body.insertAdjacentHTML('afterend', '<div class="file-upload-overlay" id="choiceImages"></div><div class="file-upload-loader"><div class="file-upload-wrapper"><div class="file-upload-h1 loader"></div><div class="file-upload-text">' + content + '</div></div></div>');
    FadeIn('.file-upload-overlay');
    FadeIn('.file-upload-loader');
}

const unLockScreen = () => {
    if (document.getElementById('choiceImages') !== null) {
        var arr = document.getElementsByClassName('file-upload-overlay');
        for (var k = 0; k < arr.length; k++) {
            arr[k].remove();
        }
        var arrAll = document.getElementsByClassName('file-upload-loader');
        for (var k = 0; k < arrAll.length; k++) {
            arrAll[k].remove();
        }
    }
}

const lockScreenElement = (element) => {
    element.insertAdjacentHTML('afterend', '<div class="file-upload-overlay" id="choiceImages"></div><div class="file-upload-loader"><div class="file-upload-wrapper"><div class="file-upload-h1 loader"></div></div></div>');
    FadeIn('.file-upload-overlay');
    FadeIn('.file-upload-loader');
}

/* END заставка при загрузке документов  ✓ ✓ ✓  */

const resultIsDigitTochka = (str) => {
    // ✅   проверить ввод на число и точку
    return (/[\d.,:]/.test(str)) ? true : false;
}

const addDaysTo = (date, hours) => {
    // ✅  увеличить дату на заднное количество часов
    return new Date(date.getTime() + hours * 3600000 * 24);
}

const addHoursTo = (date, hours) => {
    // ✅  увеличить дату на заднное количество часов
    return new Date(date.getTime() + hours * 3600000);
}

const removeHoursTo = (date, hours) => {
    // ✅  уменьшить дату на заднное количество часов
    return new Date(date.getTime() - hours * 3600000);
}


const getUriWithParam = (baseUrl, params) => {
    const Url = new URL(baseUrl);
    const urlParams = new URLSearchParams(Url.search);
    for (const key in params) {
        if (params[key] !== undefined) {
            urlParams.set(key, params[key]);
        }
    }
    Url.search = urlParams.toString();
    return Url.toString();
};

const getTwoDigits = (value) => value < 10 ? `0${value}` : value;

const getDateMsk = (setDate) => {
    var now = new Date(setDate);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var dateTime = getTwoDigits(day) + '.' + getTwoDigits(month) + '.' + year;
    // 29.09.2024
    return dateTime;
}

const getDateTimeMsk = (setDate) => {
    var now = new Date(setDate);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var dateTime = getTwoDigits(day) + '.' + getTwoDigits(month) + '.' + year + ' ' + getTwoDigits(hour) + ':' + getTwoDigits(minute) + ' мск';
    // 29.09.2024 06:39 мск
    return dateTime;
}
const getLocalDateMessage = (setDate) => {
    //let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //console.log(localTimeZone);

    // 29.09.2024 6:39 преобразовать дату к текущей дате пользователя для сообщений
    var dateMessage = setDate;
    var offset = new Date().getTimezoneOffset() * 60000;
    var localDateMessage = new Date(dateMessage.trim());
    var milliseconds = localDateMessage.getMilliseconds();
    localDateMessage.setMilliseconds(milliseconds - offset);
    return localDateMessage;
}
function getLocalDateTimeMessage(setDate) {
    //let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //console.log(localTimeZone);

    var dt = new Date(setDate);
    var minutes = dt.getTimezoneOffset();
    dt = new Date(dt.getTime() + minutes * 60000);
    return dt;
}

const getDayMonthMsg = (setDate) => {
    // 12 мая
    var now = new Date(setDate);
    let monthName = now.toLocaleString('default', { month: 'long' });
    let nameMonth;
    if (monthName.endsWith('ь'))
        nameMonth = monthName.replaceAll("ь", "я");
    else if (monthName.endsWith('й'))
        nameMonth = monthName.replaceAll("й", "я");
    else if (monthName.endsWith('т'))
        nameMonth = monthName.replaceAll("т", "та");
    var dayName = now.getDate();
    var dateDayMonth = getTwoDigits(dayName) + ' ' + nameMonth;
    return dateDayMonth;
}

const getTimeMsg = (setDate) => {
    // 6:39
    var now = new Date(setDate);
    var hour = now.getHours();
    var minute = now.getMinutes();
    var dateTime = getTwoDigits(hour) + ':' + getTwoDigits(minute);
    return dateTime;
}
const getMskTime = (setDate) => {
    // 6:55
    var now = new Date(setDate);
    var hour = now.getHours();
    var minute = now.getMinutes();
    let roundedMinutes = Math.round(minute / 5) * 5;
    if (roundedMinutes > 55) {
        roundedMinutes = 55;
    }
    var dateTime = getTwoDigits(hour) + ':' + getTwoDigits(roundedMinutes);
    return dateTime;
}
const minutesDiff = (dateServer, dateSelect) => {
    var timeDiff = dateSelect.getTime() - dateServer.getTime();
    var diffMinutes = Math.ceil(timeDiff / (1000 * 60));
    return diffMinutes;
}

const selectDate = (selectedDate, specifiedTime) => {
    // преобразования указанной даты и времени (10.10.2024 13:15) из строки
    let _year = selectedDate.substring(6, 10);
    let _month = selectedDate.substring(3, 5);
    let _day = selectedDate.substring(0, 2);
    let _hour = specifiedTime.value != undefined ? specifiedTime.value.substring(0, 2) : specifiedTime.substring(0, 2);
    let _minute = specifiedTime.value != undefined ? specifiedTime.value.substring(3, 5) : specifiedTime.substring(3, 5);
    return new Date(_year, _month - 1, _day, _hour, _minute);
}
const selectLongDate = (selectedDate, specifiedTime) => {
    //преобразования указанной даты (Thu Oct 10 2024 13:15:00 GMT+0300 (Москва, стандартное время)) и времени (13:15) из строки 
    var now = new Date(selectedDate);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    let _hour = specifiedTime.value != undefined ? specifiedTime.value.substring(0, 2) : specifiedTime.substring(0, 2);
    let _minute = specifiedTime.value != undefined ? specifiedTime.value.substring(3, 5) : specifiedTime.substring(3, 5);
    return new Date(year, month - 1, day, _hour, _minute);
}
const checkDates = (selectedDate) => {
    // 06.10.2024 08:20 мск
    // log(`👉️ const checkDates = (${selectedDate})`);
    let _year = selectedDate.substring(6, 10);
    let _month = selectedDate.substring(3, 5);
    let _day = selectedDate.substring(0, 2);
    let _hour = selectedDate.substring(11, 13);
    let _minute = selectedDate.substring(14, 16);
    let checkDate = new Date(_year, _month - 1, _day, _hour, _minute);
    // log(`👉️ return checkDates = (${checkDate})`);
    return checkDate;
}
const getDateToMsk = (selectedDate) => {
    // 06.10.2024 08:20 мск
    let _year = selectedDate.substring(6, 10);
    let _month = selectedDate.substring(3, 5);
    let _day = selectedDate.substring(0, 2);
    let _hour = selectedDate.substring(11, 13);
    let _minute = selectedDate.substring(14, 16);
    let checkDate = new Date(_year, _month - 1, _day, _hour, _minute);
    let originalOffset = parseInt(checkDate.toString().slice(28, 29) + (checkDate.toString().slice(29, 31) * 60 + + checkDate.toString().slice(31, 33))) * 60000;
    let output = new Date(Date.parse(checkDate) + originalOffset).toISOString().slice(0, -1);
    // Tue Jan 28 2025 19:31:46 GMT+0300 (Москва, стандартное время)
    // log(`👉️ return getDateToMsk = (${output})`);
    return output;
}

const getDateTimeToMsk = (selectedDate, selectedTime) => {
    // 06.10.2024
    // 08: 20 
    let _year = selectedDate.substring(6, 10);
    let _month = selectedDate.substring(3, 5);
    let _day = selectedDate.substring(0, 2);
    let _hour = selectedTime.substring(0, 2);
    let _minute = selectedTime.substring(3, 5);
    let checkDate = new Date(_year, _month - 1, _day, _hour, _minute);
    let originalOffset = parseInt(checkDate.toString().slice(28, 29) + (checkDate.toString().slice(29, 31) * 60 + + checkDate.toString().slice(31, 33))) * 60000;
    let output = new Date(Date.parse(checkDate) + originalOffset).toISOString().slice(0, -1);
    // Tue Jan 28 2025 19:31:46 GMT+0300 (Москва, стандартное время)
    // log(`👉️ return getDateToMsk = (${output})`);
    return output;
}


const getDateToMskBase = (selectedDate) => {
    // 06.10.2024 08:20:00
    let _year = selectedDate.substring(6, 10);
    let _month = selectedDate.substring(3, 5);
    let _day = selectedDate.substring(0, 2);
    if (selectedDate.length == 19) {
        let _hour = selectedDate.substring(11, 13);
        let _minute = selectedDate.substring(14, 16);
        let _second = selectedDate.substring(17, 19);
        let checkDate = new Date(_year, _month - 1, _day, _hour, _minute, _second);
        let originalOffset = parseInt(checkDate.toString().slice(28, 29) + (checkDate.toString().slice(29, 31) * 60 + + checkDate.toString().slice(31, 33))) * 60000;
        let output = new Date(Date.parse(checkDate) + originalOffset).toISOString().slice(0, -1);
        // Tue Jan 28 2025 19:31:46 GMT+0300 (Москва, стандартное время)
        // log(`👉️ return getDateToMskBase = (${output})`);
        return output;
    }
    else {
        let _hour = "0" + selectedDate.substring(11, 12);
        let _minute = selectedDate.substring(13, 15);
        let _second = selectedDate.substring(16, 18);
        let checkDate = new Date(_year, _month - 1, _day, _hour, _minute, _second);
        let originalOffset = parseInt(checkDate.toString().slice(28, 29) + (checkDate.toString().slice(29, 31) * 60 + + checkDate.toString().slice(31, 33))) * 60000;
        let output = new Date(Date.parse(checkDate) + originalOffset).toISOString().slice(0, -1);
        // Tue Jan 28 2025 19:31:46 GMT+0300 (Москва, стандартное время)
        // log(`👉️ return getDateToMskBase = (${output})`);
        return output;
    }
}


const getDateTimerToMsk = (selectedDate) => {
    // 16.03.2025, 17:39:17
    let _year = selectedDate.substring(6, 10);
    let _month = selectedDate.substring(3, 5);
    let _day = selectedDate.substring(0, 2);
    let _hour = selectedDate.substring(12, 14);
    let _minute = selectedDate.substring(15, 17);
    let _second = selectedDate.substring(18, 20);
    let checkDate = new Date(_year, _month - 1, _day, _hour, _minute, _second);
    // Tue Jan 28 2025 19:31:46 GMT+0300 (Москва, стандартное время)
    // log(`👉️ return getDateTimerToMsk = (${checkDate})`);
    return checkDate;
}

const getLocalDateMessageSend = (setDate) => {
    // Tue Jan 28 2025 19:31:46 GMT+0300 (Москва, стандартное время)
    // to => 06.10.2024 08:20
    // ru.stackoverflow.com/questions/1257622
    var dateMessage = new Date(Date.parse(setDate)).toISOString().slice(0, -1);
    // 29.09.2024 6:39 преобразовать дату к текущей дате пользователя для сообщений
    var offset = new Date().getTimezoneOffset() * 60000;
    var localDateMessage = new Date(dateMessage.trim());
    var milliseconds = localDateMessage.getMilliseconds();
    localDateMessage.setMilliseconds(milliseconds - offset);
    return localDateMessage;
}

const formatDate = (date) => {
    // Tue Jan 28 2025 19:31:46 GMT+0300 (Москва, стандартное время)
    // to => 06.10.2024 08:20
    // ru.stackoverflow.com/questions/1257622
    return new Date(Date.parse(date)).toISOString().slice(0, -1);
};

const formatDateRu = (date) => {
    // Tue Jan 28 2025 19:31:46 GMT+0300 (Москва, стандартное время)
    let ruDate = new Intl.DateTimeFormat("ru").format(date);  // to => 06.10.2024
    return ruDate;
};

const formatDateTakingTimeZone = (date) => {
    // Tue Jan 28 2025 19:31:46 GMT+0300 (Москва, стандартное время)
    // to => 06.10.2024 08:20
    // ru.stackoverflow.com/questions/1257622
    let originalOffset = parseInt(date.slice(28, 29) + (date.slice(29, 31) * 60 + date.slice(31, 33))) * 60000;
    return new Date(Date.parse(date) + originalOffset).toISOString().slice(0, -1);
};

const ticksToDate = (ticks) => {
    //ticks находятся в нановремени; перевести в микровремя
    var ticksToMicrotime = ticks / 10000;
    //ticks записываются с 1/1/1; получите разницу микровремени с 1/1/1/ по 1/1/1970
    var epochMicrotimeDiff = Math.abs(new Date(Date.UTC(0, 0, 1)).setFullYear(1));
    //новая дата — это тики, преобразованные в микровремя, за вычетом разницы с микровременем эпохи
    var tickDate = new Date(ticksToMicrotime - epochMicrotimeDiff);
    log(tickDate); //=>>  Date Sat Mar 15 2025 11:20:00 GMT+0300 (Москва, стандартное время)
    return tickDate;
}

const ticksToDateToISOString = (ticks) => {
    //ticks находятся в нановремени; перевести в микровремя
    var ticksToMicrotime = ticks / 10000;
    //ticks записываются с 1/1/1; получите разницу микровремени с 1/1/1/ по 1/1/1970
    var epochMicrotimeDiff = Math.abs(new Date(Date.UTC(0, 0, 1)).setFullYear(1));
    //новая дата — это тики, преобразованные в микровремя, за вычетом разницы с микровременем эпохи
    var tickDate = new Date(ticksToMicrotime - epochMicrotimeDiff);
    //log(tickDate); =>>  Date Sat Mar 15 2025 11:20:00 GMT+0300 (Москва, стандартное время)
    //log(tickDate.toISOString()); =>> 2025-03-15T08:20:00.000Z
    return tickDate.toISOString();
}


const dateToTicks = (date) => {
    const epochOffset = 621355968000000000;
    const ticksPerMillisecond = 10000;

    const ticks =
        date.getTime() * ticksPerMillisecond + epochOffset;

    return ticks;
}

// ✅ Or get a Date object with the specified Time zone
// bobbyhadz.com/blog/javascript-initialize-date-with-timezone
function changeTimeZone(date, timeZone) {
    if (typeof date === 'string') {
        return new Date(
            new Date(date).toLocaleString('en-US', {
                timeZone,
            }),
        );
    }
    return new Date(
        date.toLocaleString('en-US', {
            timeZone,
        }),
    );
}
function setDateMinMax(_date) {
    let moscowDate = changeTimeZone(new Date(), 'Europe/Moscow');
    let returnDate = dateToTicks(new Date(_date)) - dateToTicks(moscowDate) > 0 ? new Date(_date) : moscowDate;
    return returnDate;
}

function setDateISO(_date, _time) {
    // doka.guide/js/intl-datetimeformat/?ysclid=m8h799oy1k412401205
    const dateOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }
    const formattedDate =
        new Intl.DateTimeFormat('en-ca', dateOptions).format(_date);

    const timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h24',
    }

    const formattedTime =
        new Intl.DateTimeFormat('en-ca', timeOptions).format(_date);

    const dateTime
        = `${formattedDate}T${_time}:00:000`
    // return  2023-05-29T15:00:00Z
    return dateTime;
}
function setDateISO8601(_date) {
    const dateOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }
    const formattedDate =
        new Intl.DateTimeFormat('en-ca', dateOptions).format(_date);

    const timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h24',
    }

    const formattedTime =
        new Intl.DateTimeFormat('en-ca', timeOptions).format(_date);

    const dateTime
        = `${formattedDate}T${formattedTime}:000`
    // return  2023-05-29T15:00:000
    return dateTime;
}
function getTimeStamp(_date) {
    // 👇️ Formatted as 2025-03-20T13:59:47:000
    const [dateComponents, timeComponents] = _date.split('T');
    const [year, month, day] = dateComponents.split('-');
    const [hours, minutes, seconds, milliseconds] = timeComponents.split(':');
    const date = new Date(
        +year,
        month - 1,
        +day,
        +hours,
        +minutes,
        +seconds,
    );
    const timestamp = date.getTime();
    return timestamp;
}



function sleep(ms) {
    // выполнение задержки выполнения запроса 
    return new Promise(resolve => setTimeout(resolve, ms));
}

const debounce = (func, delay) => {
    // выполнение задержки выполнения запроса 
    let inDebounce;
    return function () {
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(this, arguments), delay);
    };
};

function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');
    for (var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');
        // Set its contents:
        item.appendChild(document.createTextNode(array[i]));
        // Add it to the list:
        list.appendChild(item);
    }
    // Finally, return the constructed list:
    return list;
}
/*
var options = [
        set0 = ['Option 1','Option 2'],
        set1 = ['First Option','Second Option','Third Option']
    ];

    // Add the contents of options[0] to #foo:
document.getElementById('foo').appendChild(makeUL(options[0]));
*/

function DataURLToBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], { type: contentType });
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
}

async function imageStringToWebp(photo) {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(photo);
            var dataUrl;
            reader.onload = async function () {
                const dataUrlResult = reader.result;
                log(dataUrlResult);
                var img = document.createElement("img");
                const base64Data = dataUrlResult.split(",")[1];
                log(dataUrlResult.split(",")[0]);
                const webpBase64 = base64Data.toString("base64");
                const webpDataUrl = `data:image/webp;base64,${webpBase64}`;
                img.onload = function () {
                    var MAX_WIDTH = 1200;
                    var width = img.width;
                    var height = img.height;
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = height * (MAX_WIDTH / width);
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_WIDTH) {
                            width = width * (MAX_WIDTH / height);
                            height = MAX_WIDTH;
                        }
                    }
                    var canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'medium';
                    ctx.drawImage(img, 0, 0, width, height);
                    dataUrl = canvas.toDataURL(photo.type);
                    log(dataUrl);
                    resolve(dataUrl);
                }
                img.src = webpDataUrl;
            }
            reader.onerror = function () {
                log(reader.error);
            };

        }
        catch (err) {
            reject(new Error('imageStringToWebp(photo) conversion failed'));
            console.error(err);
        }
    });
}
function isAVIF(file) { // check file extension since windows returns blank mime for avif
    let x = file.type ? file.type.split('image/').pop() : file.name.split('.').pop().toLowerCase();
    return x == 'avif';
}
function isHEIC(file) { // check file extension since windows returns blank mime for heic
    let x = file.type ? file.type.split('image/').pop() : file.name.split('.').pop().toLowerCase();
    return x == 'heic' || x == 'heif';
}

function loadScript(url, callback) {
    var script = document.querySelectorAll('script');
    for (var i = 0; i < script.length; i++) {
        if (script[i].src === url) {
            script = script[i];
            if (!script.readyState && !script.onload) {
                callback();
            } else { // script not loaded so wait up to 10 seconds
                var secs = 0, thisInterval = setInterval(function () {
                    secs++;
                    if (!script.readyState && !script.onload) {
                        clearInterval(thisInterval);
                        callback();
                    } else if (secs == 10) {
                        clearInterval(thisInterval);
                        log('could not load ' + url);
                    }
                }, 1000);
            }
            return;
        }
    }
    script = document.createElement('script');
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                callback();
            }
        }
    } else {
        script.onload = function () {
            script.onload = null;
            callback();
        }
    }
    script.src = url;
}
function convertHeicToJpg(file) {
    return new Promise(function (resolve) {
        loadScript('https://cdn.jsdelivr.net/npm/heic2any@0.0.3/dist/heic2any.min.js', function () {
            heic2any({
                blob: file,
                toType: "image/jpg"
            }).then(function (convertedFile) {
                convertedFile.name = file.name.substring(0, file.name.lastIndexOf('.')) + '.jpeg';
                log(convertedFile);
                resolve(convertedFile);
            });
        });
    });
}
async function saveLog(log) {
    var url = `${hrefOrigin}/market/photo-log`;
    let formData = new FormData();
    formData.append('log', log);

    let response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    if (response.ok) {
        let result = await response.text();
        if (result == 'ok')
            log("ok");
        else
            log(result);
    } else
        log("Ошибка HTTP: " + response.status);

}

function containsStringArray(arr, element) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].toLowerCase() === element.toLowerCase())
            return true;
    }
    return false;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)

    //const userEmail = "userEmail@example.com"
    //if (validateEmail(userEmail)) {
    //    alert("Email Registration Successful")
    //}
    //else {
    //    alert("Please Enter The Correct Email")
    //}
}
function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
        var key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});

    /*

    var people = [
                    { name: 'Alice', age: 21 },
                    { name: 'Max', age: 20 },
                    { name: 'Jane', age: 20 }
                ];

    var groupedPeople = groupBy(people, 'age');
        // groupedPeople is:
            // { 
            //   20: [
            //     { name: 'Max', age: 20 }, 
            //     { name: 'Jane', age: 20 }
            //   ], 
            //   21: [{ name: 'Alice', age: 21 }] 
            // }


     */
}

const groupArrayBy = (arr, key) => {
    const initialValue = {};
    return arr.reduce((acc, cval) => {
        const myAttribute = cval[key];
        acc[myAttribute] = [...(acc[myAttribute] || []), cval]
        return acc;
    }, initialValue);
};

function createConfirmPopupLogin(textMsg) {
    const $popup = createPopup({
        text: textMsg,
        btnText: "OK",
        btnCallback: () => {
            removePopup($popup);
        },
    });
}

function removeItemOnceArray(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function removeItemOnceString(string, value) {
    const arr = string.split(',');
    removeItemOnceArray(arr, value);
    string = arr.map(num => `${num}`).join();
    return string;
    /*
     value = 17
     string = 1,16,17,18,2,3
     Array(6) = [ "1", "16", "17", "18", "2", "3" ]
     
     return string = 1,16,18,2,3
    */
}

const compareArrays = (a, b) => {
    if (a.length !== b.length)
        return false;
    else {
        // Comparing each element of your array
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
    /*
    let array1 = [21, null, 33];
    let array2 = [21, 22, 23];
    let array3 = [21, undefined, 33];
    let array4 = [21, 22, 23];

    console.log(compareArrays(array1, array2)); //false
    console.log(compareArrays(array1, array3)); //false
    console.log(compareArrays(array2, array4)); //true
    
    */
};

//const differenceArrays = array1.reduce((acc, item) => {
//    if (!array2.includes(item)) {
//        acc.push(item);
//    }
//    return acc;
//}, []);
/*
    const array1 = [1, 2, 3, 4, 5];
    const array2 = [3, 4, 5, 6, 7];
    console.log(difference); // Output: [1, 2]
 */

function arrDiffInt(a1, a2) {
    var a = [], diff = [];
    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]])
            delete a[a2[i]];
        else
            a[a2[i]] = true;
    }
    for (var k in a) {
        diff.push(parseInt(k));
    }
    return diff;
    /*
    console.log(arr_diff(['a', 'b'], ['a', 'b', 'c', 'd']));
    console.log(arr_diff("abcd", "abcde"));
    console.log(arr_diff("zxc", "zxc"));
    */
}
function arrDiffString(a1, a2) {
    var a = [], diff = [];
    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]])
            delete a[a2[i]];
        else
            a[a2[i]] = true;
    }
    for (var k in a) {
        diff.push(k);
    }
    return diff;
    /*
    console.log(arr_diff(['a', 'b'], ['a', 'b', 'c', 'd']));
    console.log(arr_diff("abcd", "abcde"));
    console.log(arr_diff("zxc", "zxc"));
    */
}



function isTrueArrayInArray(arr, arr2) {
    return arr.every(i => arr2.includes(i));

    /*
    log(isTrue([1, 2, 3], [1, 2, 3])); == true
    log(isTrue([1, 2, 3], [1, 2, 3, 4])); == true
    log(isTrue([1, 2, 3], [1, 2])); == false
    */
}

function containsIntArray(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (parseInt(a[i]) === parseInt(obj))
            return true;
    }
    return false;
}

const clearArray = (array) => {
    // очистить массив
    while (array.length > 0) {
        array.pop();
    }
}

function arrayMessageResult(arr) {
    // массив сообщений Messages
    let i = 0;
    var r = "";
    for (i < arr.length; i++;) {
        r += arr[i]
    }
    return r
}

const removeAllChildrenElements = (node) => {
    // Remove all the children DOM elements in div
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}


const logoSupport = () => {
    // ✅   Logo Svg Support
    var svgSupport = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgSupport.setAttribute('width', '26');
    svgSupport.setAttribute('height', '26');
    svgSupport.setAttribute('viewBox', '0 0 26 26');
    svgSupport.setAttribute('fill', 'none');

    var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path1.setAttribute('d', 'M13 0C10.4288 0 7.91543 0.762437 5.77759 2.1909C3.63975 3.61935 1.97351 5.64968 0.989572 8.02512C0.0056327 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5995 25.9944 17.9749 25.0104C20.3503 24.0265 22.3807 22.3603 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9964 9.5533 24.6256 6.24882 22.1884 3.81163C19.7512 1.37445 16.4467 0.00363977 13 0ZM13 24C10.8244 24 8.69767 23.3549 6.88873 22.1462C5.07979 20.9375 3.66989 19.2195 2.83733 17.2095C2.00477 15.1995 1.78693 12.9878 2.21137 10.854C2.63581 8.72022 3.68345 6.7602 5.22183 5.22183C6.76021 3.68345 8.72022 2.6358 10.854 2.21136C12.9878 1.78692 15.1995 2.00476 17.2095 2.83733C19.2195 3.66989 20.9375 5.07979 22.1462 6.88873C23.3549 8.69767 24 10.8244 24 13C23.9967 15.9164 22.8367 18.7123 20.7745 20.7745C18.7123 22.8367 15.9164 23.9967 13 24ZM15 19C15 19.2652 14.8946 19.5196 14.7071 19.7071C14.5196 19.8946 14.2652 20 14 20C13.4696 20 12.9609 19.7893 12.5858 19.4142C12.2107 19.0391 12 18.5304 12 18V13C11.7348 13 11.4804 12.8946 11.2929 12.7071C11.1054 12.5196 11 12.2652 11 12C11 11.7348 11.1054 11.4804 11.2929 11.2929C11.4804 11.1054 11.7348 11 12 11C12.5304 11 13.0391 11.2107 13.4142 11.5858C13.7893 11.9609 14 12.4696 14 13V18C14.2652 18 14.5196 18.1054 14.7071 18.2929C14.8946 18.4804 15 18.7348 15 19ZM11 7.5C11 7.20333 11.088 6.91332 11.2528 6.66665C11.4176 6.41997 11.6519 6.22771 11.926 6.11418C12.2001 6.00065 12.5017 5.97094 12.7926 6.02882C13.0836 6.0867 13.3509 6.22956 13.5607 6.43934C13.7704 6.64912 13.9133 6.91639 13.9712 7.20736C14.0291 7.49834 13.9994 7.79994 13.8858 8.07403C13.7723 8.34811 13.58 8.58238 13.3334 8.7472C13.0867 8.91203 12.7967 9 12.5 9C12.1022 9 11.7206 8.84196 11.4393 8.56066C11.158 8.27936 11 7.89782 11 7.5Z');
    path1.setAttribute('fill', '#3C5EC4');

    svgSupport.append(path1);
    return svgSupport;
}
const logoSuccess = () => {
    // ✅   Logo Svg Success
    var svgSuccess = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgSuccess.setAttribute('width', '30');
    svgSuccess.setAttribute('height', '32');
    svgSuccess.setAttribute('viewBox', '0 0 30 32');
    svgSuccess.setAttribute('fill', 'none');

    var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path1.setAttribute('d', 'M21.875 24.75C21.53 24.75 21.25 25.03 21.25 25.375C21.25 25.72 21.53 26 21.875 26C22.22 26 22.5 25.72 22.5 25.375C22.5 25.03 22.22 24.75 21.875 24.75Z');
    path1.setAttribute('fill', '#1CA854');

    var path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path2.setAttribute('d', 'M23.4139 22.7289L20.4433 21.7389L19.3768 19.606C20.3376 18.6281 21.0046 17.3342 21.2296 15.9847L21.3626 15.1875H22.5C23.5339 15.1875 24.375 14.3464 24.375 13.3125V9.375C24.375 4.20563 20.1694 0 15 0C9.81738 0 5.625 4.19356 5.625 9.375V13.3125C5.625 14.1272 6.14756 14.822 6.875 15.08V15.8125C6.875 16.8464 7.71613 17.6875 8.75 17.6875H9.29887C9.56903 18.2759 9.92208 18.8226 10.3472 19.3109C10.4359 19.4125 10.5278 19.5113 10.6226 19.6072L9.55675 21.7389L6.58606 22.729C3.132 23.8808 0.625 27.5169 0.625 31.375C0.625 31.7202 0.904813 32 1.25 32H28.75C29.0951 32 29.375 31.7202 29.375 31.375C29.375 27.5169 26.8681 23.8807 23.4139 22.7289ZM23.125 13.3125C23.125 13.6571 22.8446 13.9375 22.5 13.9375H21.5461C21.705 12.7069 21.8109 11.3973 21.8534 10.1075C21.8547 10.0711 21.8557 10.0358 21.8568 10H23.125V13.3125ZM7.5 13.9375C7.15538 13.9375 6.875 13.6571 6.875 13.3125V10H8.14363C8.14569 10.0652 8.14787 10.1307 8.15031 10.1966L8.15056 10.2033V10.2039C8.19431 11.4584 8.29881 12.7339 8.45406 13.9374H7.5V13.9375ZM8.75 16.4375C8.40538 16.4375 8.125 16.1571 8.125 15.8125V15.1875H8.63737L8.77038 15.9849C8.79596 16.1368 8.82685 16.2878 8.863 16.4375H8.75ZM8.12606 8.75H6.89875C7.21531 4.56119 10.7111 1.25 15 1.25C19.2699 1.25 22.781 4.56075 23.1012 8.75H21.874C21.829 5.29831 19.0182 2.5 15.5594 2.5H14.4407C10.982 2.5 8.171 5.29831 8.12606 8.75ZM14.4406 3.75H15.5594C18.3599 3.75 20.6266 6.04069 20.625 8.83813C20.625 9.03481 20.6234 9.20606 20.6201 9.36187L20.6201 9.368L19.8383 9.25631C17.7146 8.95306 15.7093 7.95044 14.1919 6.43306C14.0747 6.31587 13.9158 6.25002 13.75 6.25C12.0715 6.25 10.4648 7.01475 9.40263 8.30675C9.66438 5.76181 11.8158 3.75 14.4406 3.75ZM10.1587 16.4375C9.84587 15.3967 9.48787 12.3342 9.40875 10.3717L10.2499 9.25006C11.0225 8.22031 12.2244 7.5805 13.503 7.50706C15.1853 9.10806 17.3617 10.1653 19.6616 10.4937L20.5817 10.6252C20.5202 11.9305 20.3945 13.2404 20.2144 14.4451L20.2143 14.4463C20.157 14.8336 20.1119 15.0829 19.9966 15.7791C19.6656 17.7644 18.1842 19.5597 16.2287 20.0486C15.422 20.2495 14.5783 20.2495 13.7716 20.0486C12.5506 19.7434 11.4309 18.8985 10.7084 17.6875H11.9825C12.2405 18.4149 12.9352 18.9375 13.75 18.9375H15C16.0359 18.9375 16.875 18.0985 16.875 17.0625C16.875 16.0286 16.0339 15.1875 15 15.1875H13.75C12.9171 15.1875 12.2326 15.7255 11.9814 16.4375H10.1587ZM13.6974 21.3135C14.1257 21.404 14.5623 21.4497 15 21.45C15.3419 21.45 15.6839 21.4214 16.0221 21.3659L14.9177 22.5338L13.6974 21.3135ZM14.0584 23.4424L12.0761 25.5388C11.5299 24.4934 11.0622 23.4088 10.6768 22.294L11.4212 20.8051L14.0584 23.4424ZM18.4729 20.5934L19.3231 22.2939C18.9377 23.4091 18.4699 24.494 17.9236 25.5397L15.8019 23.418L18.4729 20.5934ZM13.125 17.0625C13.125 16.7174 13.4049 16.4375 13.75 16.4375H15C15.3446 16.4375 15.625 16.7179 15.625 17.0625C15.625 17.4076 15.3451 17.6875 15 17.6875H13.75C13.4054 17.6875 13.125 17.4071 13.125 17.0625ZM1.9 30.75C2.14769 27.6538 4.20825 24.8396 6.98138 23.9148L9.61225 23.0381C10.0949 24.3724 10.69 25.6633 11.3912 26.8968L11.3947 26.9031L11.3947 26.9032C11.9101 27.8088 12.4815 28.6813 13.1055 29.5157L13.8744 30.75H1.9ZM15 30.1929L14.1524 28.8321C14.1429 28.8168 14.1327 28.802 14.122 28.7876C13.6156 28.1118 13.1456 27.4095 12.7137 26.6838L14.9427 24.3266L17.2913 26.6752C16.8582 27.404 16.3865 28.1091 15.8781 28.7875C15.8475 28.8283 15.8909 28.764 15 30.1929ZM16.1256 30.75L16.8944 29.5158C17.5233 28.675 18.0987 27.7955 18.6172 26.8825C18.6203 26.877 18.6233 26.8714 18.6264 26.8659L18.6275 26.8639C19.3207 25.6403 19.9095 24.3605 20.3878 23.0381L23.0186 23.9148C25.7917 24.8396 27.8523 27.6538 28.1 30.75H16.1256Z');
    path2.setAttribute('fill', '#1CA854');

    var path3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path3.setAttribute('d', 'M26.2222 28.2207C25.8045 27.3846 25.1927 26.6419 24.4529 26.0727C24.1793 25.8622 23.7869 25.9134 23.5765 26.187C23.366 26.4606 23.4171 26.853 23.6907 27.0635C24.2816 27.5181 24.7702 28.1114 25.1039 28.7793C25.2585 29.0886 25.6341 29.2131 25.9423 29.0591C26.2511 28.9049 26.3764 28.5295 26.2222 28.2207Z');
    path3.setAttribute('fill', '#1CA854');

    svgSuccess.appendChild(path1);
    svgSuccess.appendChild(path2);
    svgSuccess.appendChild(path3);
    return svgSuccess;
}
const logoDeleteUser = () => {
    // ✅   Logo Delete User
    var svgDeleteUser = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDeleteUser.setAttribute('width', '31');
    svgDeleteUser.setAttribute('height', '22');
    svgDeleteUser.setAttribute('viewBox', '0 0 26 22');
    svgDeleteUser.setAttribute('fill', 'none');

    var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path1.setAttribute('d', 'M28.12 10.8837C28.12 10.6185 28.0146 10.3641 27.8271 10.1766C27.6395 9.98904 27.3852 9.88368 27.12 9.88368C26.8548 9.88368 26.6004 9.98904 26.4129 10.1766L24.9987 11.5908L23.5844 10.1766C23.3969 9.98904 23.1425 9.88368 22.8773 9.88368C22.6121 9.88368 22.3578 9.98904 22.1702 10.1766C21.9827 10.3641 21.8773 10.6185 21.8773 10.8837C21.8773 11.1489 21.9827 11.4033 22.1702 11.5908L23.5844 13.005L22.1702 14.4192C21.9827 14.6068 21.8773 14.8611 21.8773 15.1263C21.8773 15.3915 21.9827 15.6459 22.1702 15.8334C22.3578 16.021 22.6121 16.1263 22.8773 16.1263C23.1425 16.1263 23.3969 16.021 23.5844 15.8334L24.9987 14.4192L26.4129 15.8334C26.6004 16.021 26.8548 16.1263 27.12 16.1263C27.3852 16.1263 27.6395 16.021 27.8271 15.8334C28.0146 15.6459 28.12 15.3915 28.12 15.1263C28.12 14.8611 28.0146 14.6068 27.8271 14.4192L26.4129 13.005L27.8271 11.5908C28.0146 11.4033 28.12 11.1489 28.12 10.8837Z');
    path1.setAttribute('fill', '#3C5EC4');

    var path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path2.setAttribute('d', 'M22.7659 20.3613C22.9367 20.5645 23.0197 20.8272 22.9967 21.0916C22.9737 21.356 22.8466 21.6005 22.6434 21.7713C22.4402 21.942 22.1775 22.025 21.9131 22.002C21.6486 21.979 21.4042 21.852 21.2334 21.6488C18.7184 18.6538 15.2609 17.005 11.4997 17.005C7.73843 17.005 4.28093 18.6538 1.76593 21.6488C1.59519 21.8518 1.35079 21.9787 1.08648 22.0016C0.82217 22.0244 0.559607 21.9414 0.35655 21.7706C0.153494 21.5999 0.0265778 21.3555 0.00372184 21.0912C-0.0191342 20.8269 0.0639422 20.5643 0.234675 20.3613C2.10218 18.1388 4.42468 16.56 7.00593 15.715C5.43831 14.7386 4.23133 13.2783 3.56759 11.5548C2.90386 9.83142 2.81949 7.93871 3.32724 6.16307C3.83499 4.38742 4.90724 2.82545 6.38176 1.71347C7.85629 0.60149 9.65286 0 11.4997 0C13.3465 0 15.1431 0.60149 16.6176 1.71347C18.0921 2.82545 19.1644 4.38742 19.6721 6.16307C20.1799 7.93871 20.0955 9.83142 19.4318 11.5548C18.768 13.2783 17.561 14.7386 15.9934 15.715C18.5747 16.56 20.8972 18.1388 22.7659 20.3613ZM11.4997 15.005C12.7853 15.005 14.042 14.6238 15.1109 13.9096C16.1798 13.1953 17.0129 12.1802 17.5049 10.9924C17.9969 9.80472 18.1256 8.49779 17.8748 7.23691C17.624 5.97604 17.0049 4.81785 16.0959 3.90881C15.1868 2.99976 14.0286 2.3807 12.7678 2.12989C11.5069 1.87909 10.2 2.00781 9.01223 2.49978C7.82451 2.99175 6.80935 3.82487 6.09512 4.89379C5.38089 5.96271 4.99968 7.21942 4.99968 8.505C5.00166 10.2283 5.68712 11.8804 6.90567 13.099C8.12423 14.3176 9.77638 15.003 11.4997 15.005Z');
    path2.setAttribute('fill', '#3C5EC4');

    svgDeleteUser.appendChild(path1);
    svgDeleteUser.appendChild(path2);
    return svgDeleteUser;
}
const logoUserEmpty = () => {
    // ✅ Logo User Empty
    var svgUserEmpty = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgUserEmpty.setAttribute('width', '31');
    svgUserEmpty.setAttribute('height', '22');
    svgUserEmpty.setAttribute('viewBox', '0 0 26 22');
    svgUserEmpty.setAttribute('fill', 'none');

    var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path1.setAttribute('d', 'M22.7659 20.3613C22.9367 20.5645 23.0197 20.8272 22.9967 21.0916C22.9737 21.356 22.8466 21.6005 22.6434 21.7713C22.4402 21.942 22.1775 22.025 21.9131 22.002C21.6486 21.979 21.4042 21.852 21.2334 21.6488C18.7184 18.6538 15.2609 17.005 11.4997 17.005C7.73843 17.005 4.28093 18.6538 1.76593 21.6488C1.59519 21.8518 1.35079 21.9787 1.08648 22.0016C0.82217 22.0244 0.559607 21.9414 0.35655 21.7706C0.153494 21.5999 0.0265778 21.3555 0.00372184 21.0912C-0.0191342 20.8269 0.0639422 20.5643 0.234675 20.3613C2.10218 18.1388 4.42468 16.56 7.00593 15.715C5.43831 14.7386 4.23133 13.2783 3.56759 11.5548C2.90386 9.83142 2.81949 7.93871 3.32724 6.16307C3.83499 4.38742 4.90724 2.82545 6.38176 1.71347C7.85629 0.60149 9.65286 0 11.4997 0C13.3465 0 15.1431 0.60149 16.6176 1.71347C18.0921 2.82545 19.1644 4.38742 19.6721 6.16307C20.1799 7.93871 20.0955 9.83142 19.4318 11.5548C18.768 13.2783 17.561 14.7386 15.9934 15.715C18.5747 16.56 20.8972 18.1388 22.7659 20.3613ZM11.4997 15.005C12.7853 15.005 14.042 14.6238 15.1109 13.9096C16.1798 13.1953 17.0129 12.1802 17.5049 10.9924C17.9969 9.80472 18.1256 8.49779 17.8748 7.23691C17.624 5.97604 17.0049 4.81785 16.0959 3.90881C15.1868 2.99976 14.0286 2.3807 12.7678 2.12989C11.5069 1.87909 10.2 2.00781 9.01223 2.49978C7.82451 2.99175 6.80935 3.82487 6.09512 4.89379C5.38089 5.96271 4.99968 7.21942 4.99968 8.505C5.00166 10.2283 5.68712 11.8804 6.90567 13.099C8.12423 14.3176 9.77638 15.003 11.4997 15.005Z');
    path1.setAttribute('fill', '#f70202');

    svgUserEmpty.appendChild(path1);
    return svgUserEmpty;
}
const logoAdEmpty = () => {
    // ✅ Logo Ad Empty
    var svgAdEmpty = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgAdEmpty.setAttribute('width', '17');
    svgAdEmpty.setAttribute('height', '14');
    svgAdEmpty.setAttribute('viewBox', '0 0 17 14');
    svgAdEmpty.setAttribute('fill', 'none');

    var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path1.setAttribute('d', 'M15 0H1.25C0.918479 0 0.600537 0.131696 0.366116 0.366116C0.131696 0.600537 0 0.918479 0 1.25V12.5C0 12.8315 0.131696 13.1495 0.366116 13.3839C0.600537 13.6183 0.918479 13.75 1.25 13.75H15C15.3315 13.75 15.6495 13.6183 15.8839 13.3839C16.1183 13.1495 16.25 12.8315 16.25 12.5V1.25C16.25 0.918479 16.1183 0.600537 15.8839 0.366116C15.6495 0.131696 15.3315 0 15 0ZM15 1.25V9.27734L12.9633 7.24141C12.8472 7.1253 12.7094 7.0332 12.5577 6.97037C12.406 6.90753 12.2435 6.87519 12.0793 6.87519C11.9151 6.87519 11.7526 6.90753 11.6009 6.97037C11.4492 7.0332 11.3114 7.1253 11.1953 7.24141L9.63281 8.80391L6.19531 5.36641C5.96092 5.13216 5.6431 5.00058 5.31172 5.00058C4.98034 5.00058 4.66252 5.13216 4.42813 5.36641L1.25 8.54453V1.25H15ZM1.25 10.3125L5.3125 6.25L11.5625 12.5H1.25V10.3125ZM15 12.5H13.3305L10.518 9.6875L12.0805 8.125L15 11.0453V12.5ZM9.375 4.6875C9.375 4.50208 9.42998 4.32082 9.533 4.16665C9.63601 4.01248 9.78243 3.89232 9.95373 3.82136C10.125 3.75041 10.3135 3.73184 10.4954 3.76801C10.6773 3.80419 10.8443 3.89348 10.9754 4.02459C11.1065 4.1557 11.1958 4.32275 11.232 4.5046C11.2682 4.68646 11.2496 4.87496 11.1786 5.04627C11.1077 5.21757 10.9875 5.36399 10.8333 5.467C10.6792 5.57002 10.4979 5.625 10.3125 5.625C10.0639 5.625 9.8254 5.52623 9.64959 5.35041C9.47377 5.1746 9.375 4.93614 9.375 4.6875Z');
    path1.setAttribute('fill', '#3C5EC4');

    svgAdEmpty.appendChild(path1);
    return svgAdEmpty;
}
const btnSendFile = () => {
    // ✅ File Send Btn
    var svgSendFile = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgSendFile.setAttribute('width', '15');
    svgSendFile.setAttribute('height', '18');
    svgSendFile.setAttribute('viewBox', '0 0 15 18');
    svgSendFile.setAttribute('fill', 'none');

    var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path1.setAttribute('d', 'M14.3517 8.5854L14.3518 8.58551C14.4063 8.63993 14.4495 8.70455 14.479 8.77568C14.5085 8.84681 14.5236 8.92306 14.5236 9.00006C14.5236 9.07706 14.5085 9.15331 14.479 9.22444C14.4495 9.29557 14.4063 9.36019 14.3518 9.41461L14.3518 9.41462L7.94164 15.8209L7.94163 15.8209C7.12834 16.6341 6.02532 17.0909 4.87523 17.0908C3.72513 17.0907 2.62217 16.6338 1.80898 15.8205C0.995794 15.0072 0.53899 13.9042 0.539063 12.7541C0.539135 11.604 0.996078 10.501 1.80937 9.68784L1.80957 9.68763L9.56407 1.81907C9.56412 1.81902 9.56417 1.81898 9.56422 1.81893C10.1427 1.23987 10.9276 0.914314 11.7461 0.91388C12.5647 0.913446 13.35 1.23822 13.9291 1.81676C14.5083 2.3953 14.8339 3.1802 14.8343 3.99881C14.8348 4.81742 14.51 5.60268 13.9315 6.18183L13.9313 6.18201L6.17522 14.0506C6.17518 14.0506 6.17513 14.0507 6.17509 14.0507C5.83019 14.3955 5.36244 14.5892 4.87472 14.5892C4.38693 14.5892 3.91913 14.3955 3.57421 14.0506C3.2293 13.7056 3.03553 13.2378 3.03553 12.7501C3.03553 12.2623 3.2293 11.7945 3.57422 11.4496L3.57443 11.4493L10.0822 4.8384L10.0823 4.83841L10.0829 4.83771C10.1363 4.7807 10.2007 4.73495 10.272 4.70316C10.3434 4.67138 10.4205 4.65419 10.4986 4.65262C10.5767 4.65105 10.6544 4.66512 10.727 4.69401C10.7996 4.7229 10.8657 4.76602 10.9214 4.82083C10.9771 4.87565 11.0213 4.94105 11.0513 5.0132C11.0813 5.08534 11.0966 5.16276 11.0963 5.24091C11.096 5.31905 11.08 5.39634 11.0494 5.46823C11.0187 5.54011 10.974 5.60514 10.9179 5.65949L10.9172 5.66017L4.40893 12.2778C4.40886 12.2779 4.4088 12.2779 4.40874 12.278C4.34691 12.3394 4.29777 12.4123 4.2641 12.4927C4.23041 12.5731 4.21288 12.6594 4.21254 12.7466C4.21219 12.8339 4.22903 12.9203 4.26208 13.001C4.29514 13.0817 4.34377 13.1551 4.40519 13.217C4.46662 13.2789 4.53963 13.3281 4.62008 13.3618C4.70052 13.3955 4.78681 13.4131 4.87403 13.4134C4.96125 13.4138 5.04767 13.3969 5.12838 13.3639C5.20909 13.3308 5.2825 13.2822 5.34442 13.2208L5.34472 13.2205L13.1 5.35583C13.1 5.3558 13.1 5.35576 13.1001 5.35573C13.4596 4.99691 13.6618 4.50997 13.6624 4.00203C13.6629 3.49404 13.4616 3.00665 13.1028 2.64708C12.7439 2.2875 12.2569 2.0852 11.749 2.08468C11.241 2.08415 10.7536 2.28545 10.394 2.64428L10.3938 2.64451L2.64087 10.5099C2.64082 10.51 2.64078 10.51 2.64073 10.5101C2.34672 10.8036 2.1134 11.1522 1.95409 11.536C1.79476 11.9198 1.71258 12.3312 1.71225 12.7468C1.71192 13.1623 1.79344 13.5739 1.95217 13.9579C2.11089 14.342 2.3437 14.691 2.63731 14.9851C2.93092 15.2792 3.27958 15.5125 3.66337 15.6719C4.04717 15.8312 4.4586 15.9134 4.87415 15.9137C5.28971 15.914 5.70127 15.8325 6.08532 15.6738C6.46937 15.5151 6.8184 15.2823 7.11247 14.9886L7.11249 14.9886L13.5233 8.58247C13.6336 8.47306 13.7828 8.41191 13.9381 8.41246C14.0935 8.41301 14.2422 8.47521 14.3517 8.5854ZM14.5151 9.2394C14.4836 9.31527 14.4375 9.3842 14.3794 9.44225L13.4958 8.55475C13.6134 8.43804 13.7726 8.37281 13.9383 8.37339C14.1039 8.37398 14.2626 8.44033 14.3794 8.55787C14.4375 8.61592 14.4836 8.68485 14.5151 8.76072C14.5465 8.8366 14.5627 8.91792 14.5627 9.00006C14.5627 9.08219 14.5465 9.16352 14.5151 9.2394Z');
    path1.setAttribute('fill', '#3C5EC4');
    path1.setAttribute('stroke', '#3C5EC4');
    path1.setAttribute('stroke-width', '0.078125');

    svgSendFile.appendChild(path1);
    return svgSendFile;
}

const btnSendMessage = () => {
    // ✅ Message Send Btn
    var svgSendMessage = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgSendMessage.setAttribute('width', '16');
    svgSendMessage.setAttribute('height', '18');
    svgSendMessage.setAttribute('viewBox', '0 0 16 18');
    svgSendMessage.setAttribute('fill', 'none');

    var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path1.setAttribute('d', 'M14.97 7.68607L14.9999 7.70316L15.0021 7.7003C15.176 7.80514 15.3209 7.95214 15.4233 8.12793C15.5314 8.31359 15.5882 8.52469 15.5878 8.73955C15.5875 8.95441 15.5299 9.1653 15.4211 9.35057C15.3123 9.53585 15.1562 9.68884 14.9687 9.79385L14.9684 9.79402L1.84979 17.2978C1.66669 17.4016 1.45991 17.4564 1.24944 17.4568C1.05581 17.4567 0.865024 17.4102 0.693082 17.3212C0.521114 17.2321 0.373017 17.1031 0.261217 16.945C0.149418 16.7868 0.0771771 16.6042 0.0505569 16.4123C0.0239368 16.2205 0.0437136 16.0251 0.108228 15.8425L0.108232 15.8425L0.108405 15.842L2.50137 8.7584L2.5056 8.7459L2.50137 8.73339L0.108404 1.65058L0.108406 1.65058L0.108265 1.65017C0.026931 1.41788 0.01831 1.16632 0.0835503 0.92901C0.148791 0.691696 0.284794 0.479895 0.473443 0.321825C0.662091 0.163755 0.894426 0.0669209 1.1395 0.0442237C1.38453 0.0215299 1.63066 0.0740286 1.84511 0.194726C1.84514 0.194744 1.84517 0.194761 1.8452 0.194779L14.97 7.68607ZM1.21068 16.2417L1.20248 16.3178L1.26893 16.2798L14.3939 8.76652L14.4533 8.73255L14.3939 8.69868L1.26888 1.21197L1.13786 1.13723L1.21549 1.26512L1.21526 1.26516L1.2172 1.2709L3.53595 8.1334L3.54493 8.15996H3.57296H8.12452C8.27992 8.15996 8.42896 8.22169 8.53884 8.33158C8.64873 8.44146 8.71046 8.5905 8.71046 8.7459C8.71046 8.9013 8.64873 9.05033 8.53884 9.16022C8.42896 9.2701 8.27992 9.33183 8.12452 9.33183H3.57296H3.54494L3.53596 9.35837L1.21252 16.224L1.20976 16.2322L1.21068 16.2407V16.2417Z');
    path1.setAttribute('fill', 'white');
    path1.setAttribute('stroke', 'white');
    path1.setAttribute('stroke-width', '0.078125');

    svgSendMessage.appendChild(path1);
    return svgSendMessage;
}

function stylistChangeOver(elem, countNameClass) {
    // ✅ remove last class
    let castMembers = elem.className.split(' ');
    if (castMembers.length > countNameClass)
        castMembers.splice(-1);
    elem.className = castMembers.join(' ');
}
const elemScrollbarInit = (elem) => {
    if (!Scrollbar.has(elem))
        Scrollbar.init(elem);
}



// ✅ START установка звукового оповещения при получении Сообщений
var newMessageAudio = new Audio('/Audio/NewMessageAudio.mp4');// сигнал для всех страниц кроме СООБЩЕНИЙ
var newAudioMessage = new Audio('/Audio/Notify.mp4');// сигнал когда активно окно (стр.) СООБЩЕНИЙ
var chatSound;
const $notification = document.getElementById('notification');

if (typeof chatSound === 'undefined' && localStorage.getItem('chatSound') == null) {
    chatSound = 'true';
    localStorage.setItem('chatSound', chatSound);
}
else
    chatSound = localStorage.getItem('chatSound');

// JavaScript
// Wrap the native DOM audio element play function and handle any autoplay errors
Audio.prototype.play = (function (play) {
    return function () {
        var audio = this,
            args = arguments,
            promise = play.apply(audio, args);
        if (promise !== undefined) {
            promise.catch(_ => {
                // Autoplay was prevented. This is optional, but add a button to start playing.
                var el = document.createElement("button");
                el.innerHTML = "Play";
                el.addEventListener("click", function () { play.apply(audio, args); });
                this.parentNode.insertBefore(el, this.nextSibling)
            });
        }
    };
})(Audio.prototype.play);

function playNewMessageAudio(RoomId) {
    if (chatSound == 'true') {
        let roomid = 0;
        if (document.getElementById('messages-section') !== null)
            roomid = parseInt(document.getElementById('messages-section').dataset.roomId);
        log(`playNewMessageAudio(${RoomId}) ->> ${roomid}`);
        $notification.src = roomid == parseInt(RoomId) ? '/Audio/Notify.mp4' : '/Audio/NewMessageAudio.mp4';

        // in the js code unmute the audio once the event happened => в коде js включить звук после того, как событие произошло
        $notification.muted = false;
        $notification.play();
        $notification.autoplay = true;
    }
}
/* End Мини__Чат Звонок  ✓ ✓ ✓ ❌ */
// ✅ START установка звукового оповещения при получении Сообщений
////localStorage.setItem('chatSound', chatSound);
////if (chatSound == 'true') {
////    $('#sound__chat').addClass('yes').removeClass('no');
////    $('#sound__messages').addClass('yes').removeClass('no');
////}
////else {
////    $('#sound__chat').addClass('no').removeClass('yes');
////    $('#sound__messages').addClass('no').removeClass('yes');
////}
/* END при переходе между страницами ВКЛ ВЫКЛ ЗВУК  ✓ ✓ ✓  ❌ */

// ✅  Start ОКНО ДИАЛОГИ ВКЛ ВЫКЛ ЗВУК
////$(document).on('click', '#sound__chat', function () {
////    //log('Установленное значение chatSound было => ' + chatSound);
////    if (chatSound == 'true') {
////        $(this).addClass('no').removeClass('yes');
////        $('#sound__messages').addClass('no').removeClass('yes');
////        chatSound = 'false';
////        localStorage.setItem('chatSound', chatSound);
////        //log('chatSound изменили на false => ' + chatSound);
////    } else {
////        $(this).addClass('yes').removeClass('no');
////        $('#sound__messages').addClass('yes').removeClass('no');
////        chatSound = 'true';
////        playNewMessageAudio();
////        localStorage.setItem('chatSound', chatSound);
////        //log('chatSound изменили на true => ' + chatSound);
////    }
////});
////$(document).on('click', '#sound__messages', function () {
////    //log('Установленное значение chatSound было => ' + chatSound);
////    if (chatSound == 'true') {
////        $(this).addClass('no').removeClass('yes');
////        $('#sound__chat').addClass('no').removeClass('yes');
////        chatSound = 'false';
////        localStorage.setItem('chatSound', chatSound);
////        //log('chatSound изменили на false => ' + chatSound);
////    } else {
////        $(this).addClass('yes').removeClass('no');
////        $('#sound__chat').addClass('yes').removeClass('no');
////        chatSound = 'true';
////        playNewMessageAudio();
////        localStorage.setItem('chatSound', chatSound);
////        //log('chatSound изменили на true => ' + chatSound);

////    }
////});
/* End ОКНО ДИАЛОГИ ВКЛ ВЫКЛ ЗВУК  ✓ ✓ ✓ ❌ */
/*  установка звукового оповещения при получении Сообщений  ✓ ✓ ✓ ❌ */

// ✅ START изменение Высоты textArea
function resizeHeightArea(textAreaThis) {
    textAreaThis.style.height = '44px';
    if (textAreaThis.scrollHeight > textAreaThis.clientHeight) {
        textAreaThis.style.height = textAreaThis.scrollHeight + 'px';
    }
}

window.addEventListener('load', function () {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(function (textAreaThis) {
        textAreaThis.addEventListener('input', function () {
            resizeHeightArea(this);
        });
    });
});
/* End изменение Высоты textArea  ✓ ✓ ✓ ❌ */

async function validUploadFiles($files, exts) {
    let validFiles = 0;
    let notValidFiles = [];
    return new Promise(async (resolve, reject) => {
        try {
            for (var i = 0; i < $files.length; i++) {
                let file = $files[i];
                const $fileName = file.name;
                const $fileExt = $fileName.substring($fileName.lastIndexOf('.'));
                if (exts.indexOf($fileExt) < 0) {
                    validFiles++;
                    notValidFiles.push($fileName);
                }
            }
            let result = validFiles == 0
                ? true
                : false;
            if (!result) {
                let strNotValidFiles = notValidFiles.join("<br>");
                let textMessage = validFiles == 1 ? 'Ошибка. Выбран недопустимый формат файла - ' : 'Ошибка. Выбран недопустимый формат файлов: <br>';
                const $filesValidPopup = createPopup({
                    text: textMessage + strNotValidFiles,
                    btnText: "OK",
                    btnCallback: () => {
                        removePopup($filesValidPopup);
                        clearUnputFiles($offerTabsHeaderBtnFileField);
                        return;
                    },
                });
            }
            resolve(result);
        }
        catch (err) {
            reject(err);
            unLockScreen();
        }
    });
}

async function filesValid($files, exts) {
    let validFiles = 0;
    let notValidFiles = [];
    return new Promise(async (resolve, reject) => {
        try {
            for (var i = 0; i < $files.length; i++) {
                let file = $files[i];
                const $fileName = file.name;
                const $fileExt = $fileName.substring($fileName.lastIndexOf('.'));
                if (exts.indexOf($fileExt) < 0) {
                    validFiles++;
                    notValidFiles.push($fileName);
                }
            }
            let result = validFiles == 0 ? true : false;
            if (!result) {
                let strNotValidFiles = notValidFiles.join("<br>");
                let textMessage = validFiles == 1 ? 'Ошибка. Выбран недопустимый формат файла - ' : 'Ошибка. Выбран недопустимый формат файлов: <br>';
                const $filesValidPopup = createPopup({
                    text: textMessage + strNotValidFiles,
                    btnText: "OK",
                    btnCallback: () => {
                        removePopup($filesValidPopup);
                        clearUnputFiles($offerTabsHeaderBtnFileField);
                        return;
                    },
                });
            }
            resolve(result);
        }
        catch (err) {
            reject(err);
            unLockScreen();
        }
    });
}

async function imagesValid($images, exts) {
    let validImages = 0;
    let notValidImages = [];
    return new Promise(async (resolve, reject) => {
        try {
            for (var i = 0; i < $images.length; i++) {
                let image = $images[i];
                const $imageName = image.name;
                const $imageExt = $imageName.substring($imageName.lastIndexOf('.'));
                if (exts.indexOf($imageExt) < 0) {
                    validImages++;
                    notValidImages.push($imageName);
                }
            }
            let result = validImages == 0 ? true : false;
            if (!result) {
                let strNotValidImages = notValidImages.join("<br>");
                let textMessage = validImages == 1 ? 'Ошибка. Выбран недопустимый формат файла - ' : 'Ошибка. Выбран недопустимый формат файлов: <br>';
                const $imagesValidPopup = createPopup({
                    text: textMessage + strNotValidImages,
                    btnText: "OK",
                    btnCallback: () => {
                        removePopup($imagesValidPopup);
                        clearUnputFiles($offerTabsHeaderBtnImageField);
                        return;
                    },
                });
            }
            resolve(result);
        }
        catch (err) {
            unLockScreen();
            reject(err);
        }
    })
}

// ✅ START получить размер всех загружаемых файлов
const filesSizeAll = async ($files) => {
    return new Promise(async (resolve, reject) => {
        try {
            var total = [].slice.call($files).map(function (x) {
                return x.size || x.fileSize;
            }).reduce(function (a, b) {
                return a + b;
            }, 0);

            resolve(total);
        }
        catch (err) {
            reject(err);
            unLockScreen();
        }
    })
}
/*  получить размер всех загружаемых файлов  ✓ ✓ ✓ ❌ */

// ✅ START получить размер  файла с фотографией
const imageSize = async (image) => {
    return new Promise(async (resolve, reject) => {
        try {
            var total = image.size || image.fileSize;
            resolve(total);
        }
        catch (err) {
            unLockScreen();
            reject(err);
        }
    })
}
/*  получить размер  файла с фотографией  ✓ ✓ ✓ ❌ */

// ✅  Сжатие файлов с рисунками (фотографий)
async function uploadImgChat(image) {
    return new Promise(async (resolve, reject) => {
        try {
            imageSize(image)
                .then(data => {
                    let resultSize = data;
                    try {
                        // 15 000 000 == 15 mB;
                        if (data < 15100000) {
                            if (isHEIC(image)) {
                                // convert any heic (and do any other prep) before uploading the image
                                convertHeicToJpg(image)
                                    .then(data => {
                                        log(`convertHeicToJpg(image)`);
                                        log(data);
                                        try {
                                            resizeImgChat(data)
                                                .then(stringImage => {
                                                    try {
                                                        if (stringImage != false)
                                                            resolve(stringImage);
                                                    }
                                                    catch (err) {
                                                        reject(false);
                                                        unLockScreen();
                                                        console.error(err);
                                                    }
                                                })
                                                .catch(error => {
                                                    reject(false);
                                                    unLockScreen();
                                                    console.error(error);
                                                });
                                        }
                                        catch (err) {
                                            reject(false);
                                            unLockScreen();
                                            console.error(err.message);
                                        }
                                    })
                                    .catch(error => {
                                        reject(false);
                                        unLockScreen();
                                        console.error(error);
                                    });
                            }
                            else if (isAVIF(image)) {
                                imageStringToWebp(image).then(data => {
                                    log(`isAVIF(image)`);
                                    log(data);
                                    try {
                                        resizeImgChat(data)
                                            .then(stringImage => {
                                                try {
                                                    if (stringImage != false)
                                                        resolve(stringImage);
                                                }
                                                catch (err) {
                                                    reject(false);
                                                    unLockScreen();
                                                    console.error(err);
                                                }
                                            })
                                            .catch(error => {
                                                reject(false);
                                                unLockScreen();
                                                console.error(error);
                                            });
                                    }
                                    catch (err) {
                                        reject(false);
                                        unLockScreen();
                                        console.error(err.message);
                                    }
                                })
                                    .catch(error => {
                                        reject(false);
                                        unLockScreen();
                                        console.error(error);
                                    });
                            }
                            else {
                                resizeImgChat(image)
                                    .then(stringImage => {
                                        try {
                                            if (stringImage != false)
                                                resolve(stringImage);
                                        }
                                        catch (err) {
                                            reject(false);
                                            unLockScreen();
                                            console.error(err);
                                        }
                                    })
                                    .catch(error => {
                                        reject(false);
                                        unLockScreen();
                                        console.error(error);
                                    });
                            }
                        }
                        else {
                            reject(false);
                            unLockScreen();
                            console.error(`${resultSize} > 15100000`);
                            const $imgSizePopup = createPopup({
                                text: 'Вы превысили максимально допустимый размер загружаемого файла в 15 мБ',
                                btnText: "OK",
                                btnCallback: () => {
                                    removePopup($imgSizePopup);
                                    unLockScreen();
                                    return;
                                },
                            });
                        }
                    }
                    catch (err) {
                        reject(false);
                        unLockScreen();
                        console.error(err);
                    }
                })
                .catch(error => {
                    reject(false);
                    unLockScreen();
                    console.error(error);
                });
        }
        catch (err) {
            reject(false);
            unLockScreen();
            log(err.message);
        }
    });
}

const resizeImgChat = async (image) => {
    return new Promise(async (resolve, reject) => {
        try {
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.createElement("img");
                img.onload = function () {
                    var MAX_WIDTH = 1900;
                    var width = img.width;
                    var height = img.height;
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = height * (MAX_WIDTH / width);
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_WIDTH) {
                            width = width * (MAX_WIDTH / height);
                            height = MAX_WIDTH;
                        }
                    }
                    var canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'medium';
                    ctx.drawImage(img, 0, 0, width, height);
                    const webpImg = ctx.canvas.toDataURL("image/webp", 0.75);
                    resolve(webpImg);
                }
                img.src = e.target.result;
            }
            reader.onerror = function (e) {
                reject(false);
                console.error("Файл не может быть прочитан! код " + e.target.error);
            };
            reader.readAsDataURL(image);
        }
        catch (err) {
            unLockScreen();
            reject(false);
            console.error(err);
        }
    })
}


function _resize__Img__Chat(image) {
    try {
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = document.createElement("img");
            img.onload = function () {
                var MAX_WIDTH = 1900;
                var width = img.width;
                var height = img.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = height * (MAX_WIDTH / width);
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_WIDTH) {
                        width = width * (MAX_WIDTH / height);
                        height = MAX_WIDTH;
                    }
                }
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'medium';
                ctx.drawImage(img, 0, 0, width, height);
                const webpImg = ctx.canvas.toDataURL("image/webp", 0.75);
                log("                           .webpImg");
                log(webpImg);
                return webpImg;

            }
            img.src = e.target.result;
        }
        reader.onerror = function (e) {
            console.error("Файл не может быть прочитан! код " + e.target.error);
        };
        reader.readAsDataURL(image);
    }
    catch (err) {
        unLockScreen();
        console.error(err);
    }
}
/* Сжатие файлов с рисунками (фотографий)  ✓ ✓ ✓ ❌ */
// ✅  Delete Data - Срок поставки до
function RemoveErrorAdTransferOfGoods(item) {
    item.classList.remove('input--error');
    let spanInputError = item.querySelector(".input__error");
    spanInputError.textContent = "";
}
/* Delete Data - Срок поставки до ❌ */

/* Сжатие файлов с рисунками (фотографий)  ✓ ✓ ✓ ❌ */

// ✅ Функция выделить из числа единицы, десятки, сотни
function splitToDigits(number) {
    // Возвращает массив цифр, по индексу 0 — единицы, 1 — десятки и так далее
    // var a = 261;
    // var digits = splitToDigits(a);

    var digits = [];
    while (number) {
        digits.push(number % 10);
        number = Math.floor(number / 10);
    }
    return digits;
    // console.log(digits[0]); == 1 
    // console.log(digits[1]); == 6
    // console.log(digits[2]); == 2
}
/* Функция выделить из числа единицы, десятки, сотни  ✓ ✓ ✓ ❌ */

function wordCategory(items) {
    if (items == 0)
        return;

    let word = `${items} категори`;
    if (items == 1)
        word += "я";
    if (items > 1
        && items < 5)
        word += "и";
    if (items > 4
        && items < 21)
        word += "й";
    let oneLetter = 1;
    let fourLetter = 4;
    let fiveLetter = 5;

    if (items > 20) {
        let tens = splitToDigits(items)[1];

        let oneLetterTens = parseInt(tens + "" + oneLetter);
        let fourLetterTens = parseInt(tens + "" + fourLetter);
        let fiveLetterTens = parseInt(tens + "" + fiveLetter);

        if (items == oneLetterTens)
            word += "я";
        if (items > oneLetterTens
            && items < fiveLetterTens)
            word += "и";
        if (items > fourLetterTens
            && items < oneLetterTens + 10)
            word += "й";
    }
    return word;
}
function wordRegion(items) {
    let word = `${items} регион`;
    if (items > 1
        && items < 5)
        word += "а";
    if (items > 4
        && items < 21)
        word += "ов";
    let oneLetter = 1;
    let fourLetter = 4;
    let fiveLetter = 5;

    if (items > 20) {
        let tens = splitToDigits(items)[1];

        let oneLetterTens = parseInt(tens + "" + oneLetter);
        let fourLetterTens = parseInt(tens + "" + fourLetter);
        let fiveLetterTens = parseInt(tens + "" + fiveLetter);

        if (items > oneLetterTens
            && items < fiveLetterTens)
            word += "а";
        if (items > fourLetterTens
            && items < oneLetterTens + 10)
            word += "ов";
    }

    return word;
}
function wordTown(items) {
    let word = `${items} город`;
    if (items > 1
        && items < 5)
        word += "а";
    if (items > 4
        && items < 21)
        word += "ов";
    let oneLetter = 1;
    let fourLetter = 4;
    let fiveLetter = 5;

    if (items > 20) {
        let tens = splitToDigits(items)[1];

        let oneLetterTens = parseInt(tens + "" + oneLetter);
        let fourLetterTens = parseInt(tens + "" + fourLetter);
        let fiveLetterTens = parseInt(tens + "" + fiveLetter);

        if (items > oneLetterTens
            && items < fiveLetterTens)
            word += "а";
        if (items > fourLetterTens
            && items < oneLetterTens + 10)
            word += "ов";
    }

    return word;
}

function unsubSelect(checkbox) {
    let categoriesItem = checkbox.closest('.categories__item');
    let spanOne = categoriesItem.querySelector(".okpd-one");
    spanOne?.classList.remove("sub-select-one-level");
    let categoryItem = checkbox.closest('div[data-level="2"]');
    let spanTwo = categoryItem.querySelector(".okpd-two");
    spanTwo?.classList.remove("sub-select-two-level");
}

function isValidElement(el) {
    return (typeof el !== "undefined" && el)
        ? true
        : false;
}

const comparingArray = (...arrays) => {
    let arraysReduce = arrays.reduce((includ, current) =>
        Array.from(new Set(includ.filter((a) => current.includes(a)))));

    let countArraysReduce = arraysReduce.length;
    let booArraysReduce = countArraysReduce > 0 ? true : false;

    //log(arraysReduce);
    //log(countArraysReduce);
    //log(booArraysReduce);

    return booArraysReduce;
}

function parentIdx(idx) {
    let iDx = idx.length > 9
        ? idx.substring(0, 10)
        : idx.length > 8
            ? idx.substring(0, 9)
            : idx.length > 6
                ? idx.substring(0, 7)
                : idx.length > 5
                    ? idx.substring(0, 6)
                    : idx;
    return iDx;
}

function createArrOkdpIdx(checkbox) {
    let arrOkdpIdx = [];
    let level = parseInt(checkbox.dataset.level);
    let categoryIitem = checkbox.closest(".category.category__item");
    let categoryContent = categoryIitem.querySelector(".category__content");
    let checkBoxChilds = [];
    if (isValidElement(categoryContent))
        checkBoxChilds = categoryContent.querySelectorAll(".checkbox__input");
    switch (level) {
        case 3:
            arrOkdpIdx.push(checkbox.dataset.idx);
            let childIdxsArr4 = checkbox.dataset.childIdxs.split(",");
            arrOkdpIdx = [...arrOkdpIdx, ...childIdxsArr4]; // добавляет элементы второго в первый
            checkBoxChilds.forEach(function (checkBoxChild) {
                let okdpIdx = checkBoxChild.dataset.idx;
                if (!containsStringArray(arrOkdpIdx, okdpIdx))
                    arrOkdpIdx.push(okdpIdx);
                if (parseInt(checkBoxChild.dataset.level) == 6) {
                    let childIdxsArr7 = checkBoxChild.dataset.childIdxs.split(",");
                    arrOkdpIdx = [...arrOkdpIdx, ...childIdxsArr7]; // добавляет элементы второго в первый 
                }
            });
            break
        case 4:
            arrOkdpIdx.push(checkbox.dataset.idx);
            let childIdxsArr5 = checkbox.dataset.childIdxs.split(",");
            arrOkdpIdx = [...arrOkdpIdx, ...childIdxsArr5]; // добавляет элементы второго в первый 
            checkBoxChilds.forEach(function (checkBoxChild) {
                let okdpIdx = checkBoxChild.dataset.idx;
                if (!containsStringArray(arrOkdpIdx, okdpIdx))
                    arrOkdpIdx.push(okdpIdx);
                if (parseInt(checkBoxChild.dataset.level) == 6) {
                    let childIdxsArr7 = checkBoxChild.dataset.childIdxs.split(",");
                    arrOkdpIdx = [...arrOkdpIdx, ...childIdxsArr7]; // добавляет элементы второго в первый 
                }
            });
            break
        case 5:
            arrOkdpIdx.push(checkbox.dataset.idx);
            let childIdxsArr6 = checkbox.dataset.childIdxs.split(",");
            arrOkdpIdx = [...arrOkdpIdx, ...childIdxsArr6]; // добавляет элементы второго в первый
            checkBoxChilds.forEach(function (checkBoxChild) {
                let okdpIdx = checkBoxChild.dataset.idx;
                if (!containsStringArray(arrOkdpIdx, okdpIdx))
                    arrOkdpIdx.push(okdpIdx);
                if (parseInt(checkBoxChild.dataset.level) == 6) {
                    let childIdxsArr7 = checkBoxChild.dataset.childIdxs.split(",");
                    arrOkdpIdx = [...arrOkdpIdx, ...childIdxsArr7]; // добавляет элементы второго в первый 
                }
            });
            break
        case 6:
            arrOkdpIdx.push(checkbox.dataset.idx);
            let childIdxsArr7 = checkbox.dataset.childIdxs.split(",");
            arrOkdpIdx = [...arrOkdpIdx, ...childIdxsArr7]; // добавляет элементы второго в первый 
            break
        case 7:
            arrOkdpIdx.push(checkbox.dataset.idx);
            break
    }

    log(arrOkdpIdx);

    return arrOkdpIdx;
}

/* 
✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅

 ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅

   ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ 
   */


// ✅  All Classes 
class Ad {
    constructor(
        Id,
        SenderId,
        FullName,
        Description,
        CityId,
        DeliveryType,
        DeliveryAddress,
        DeliveryLoadType,
        DeliveryWay,
        TermsOfPayments,
        DefermentPeriod,
        PartialPrepayment,
        Nds,
        NdsRate,
        IsBuy,
        AvailableForAllUsers,
        WithLimitedUser,
        OffersVisibleToOtherUsers,
        RankOffersVisible,
        UsersVisibleBestPriceOffers,
        PartOffersAllowed,
        UseCert,
        ActiveToDate,
        DateSummarizing,
        DateSellBuy,
        AddressByPosition,
        UnitByPosition,
        SendMailSupportEmail,
        DateSellBuyNumberDay,
        SellBuyNumberDay
    ) {
        this.Id = Id;
        this.SenderId = SenderId;
        this.FullName = FullName;
        this.Description = Description;
        this.CityId = CityId;
        this.DeliveryType = DeliveryType;
        this.DeliveryAddress = DeliveryAddress;
        this.DeliveryLoadType = DeliveryLoadType;
        this.DeliveryWay = DeliveryWay; // ✅ 2025  krakoss  Способ доставки Any = 0, Не выбрано
        this.TermsOfPayments = TermsOfPayments;
        this.DefermentPeriod = DefermentPeriod;
        this.PartialPrepayment = PartialPrepayment;
        this.Nds = Nds;
        this.NdsRate = NdsRate;
        this.IsBuy = IsBuy;
        this.AvailableForAllUsers = AvailableForAllUsers;
        this.WithLimitedUser = WithLimitedUser;
        this.OffersVisibleToOtherUsers = OffersVisibleToOtherUsers;
        this.RankOffersVisible = RankOffersVisible;
        this.UsersVisibleBestPriceOffers = UsersVisibleBestPriceOffers;
        this.PartOffersAllowed = PartOffersAllowed;
        this.UseCert = UseCert;
        this.ActiveToDate = ActiveToDate;
        this.DateSummarizing = DateSummarizing;
        this.DateSellBuy = DateSellBuy;
        this.AddressByPosition = AddressByPosition;
        this.UnitByPosition = UnitByPosition;
        this.SendMailSupportEmail = SendMailSupportEmail;
        this.DateSellBuyNumberDay = DateSellBuyNumberDay;
        this.SellBuyNumberDay = SellBuyNumberDay;
    }
}

class AdProduct {
    constructor(
        ProductDescription,
        AdId,
        Weight,
        PricePerWeight,
        Currency,
        Unit,
        EachProductAddress,
        OkdpCategoryId,
        OkdpCategoryIdx,
        TownId
    ) {
        this.ProductDescription = ProductDescription;
        this.AdId = AdId;
        this.Weight = Weight;
        this.PricePerWeight = PricePerWeight;
        this.Currency = Currency;
        this.Unit = Unit;
        this.EachProductAddress = EachProductAddress;
        this.OkdpCategoryId = OkdpCategoryId;
        this.OkdpCategoryIdx = OkdpCategoryIdx;
        this.TownId = TownId;
    }
}

class AdProductEdit {
    constructor(
        Id,
        ProductDescription,
        AdId,
        Weight,
        PricePerWeight,
        Currency,
        Unit,
        EachProductAddress,
        OkdpCategoryId,
        OkdpCategoryIdx,
        TownId
    ) {
        this.Id = Id;
        this.ProductDescription = ProductDescription;
        this.AdId = AdId;
        this.Weight = Weight;
        this.PricePerWeight = PricePerWeight;
        this.Currency = Currency;
        this.Unit = Unit;
        this.EachProductAddress = EachProductAddress;
        this.OkdpCategoryId = OkdpCategoryId;
        this.OkdpCategoryIdx = OkdpCategoryIdx;
        this.TownId = TownId;
    }
}
class Offer {
    constructor(
        id,
        senderId,
        dateOfPosting,
        cityId,
        deliveryType,
        deliveryAddress,
        deliveryLoadType,
        deliveryWay,
        termsOfPayments,
        defermentPeriod,
        nds,
        activeUntilDate,
        conutUntilDay,
        comment,
        modified,
        moderateResult,
        offerStatus,
        contractStatus,
        contractSendDate,
        isSendedExpiredMessage,
        showInDealsHistory,
        currencyRateToAccepted,
        whyNeedHumanModeration,
        sendContractDate,
        isReadDealsHistory,
        sumProductOffer,
        partialPrepayment,
        ndsRate,
        adId,
        offerAddressByPosition
    ) {
        this.Id = id;
        this.SenderId = senderId;
        this.DateOfPosting = dateOfPosting;
        this.CityId = cityId;
        this.DeliveryType = deliveryType;
        this.DeliveryAddress = deliveryAddress;
        this.DeliveryLoadType = deliveryLoadType;
        this.DeliveryWay = deliveryWay; // ✅ 2025  krakoss  Способ доставки Any = 0, Не выбрано
        this.TermsOfPayments = termsOfPayments;
        this.DefermentPeriod = defermentPeriod;
        this.Nds = nds;
        this.ActiveUntilDate = activeUntilDate;
        this.ConutUntilDay = conutUntilDay;
        this.Comment = comment;
        this.Modified = modified;
        this.ModerateResult = moderateResult;
        this.OfferStatus = offerStatus;
        this.ContractStatus = contractStatus;
        this.ContractSendDate = contractSendDate;
        this.IsSendedExpiredMessage = isSendedExpiredMessage;
        this.ShowInDealsHistory = showInDealsHistory;
        this.CurrencyRateToAccepted = currencyRateToAccepted;
        this.WhyNeedHumanModeration = whyNeedHumanModeration;
        this.SendContractDate = sendContractDate;
        this.IsReadDealsHistory = isReadDealsHistory;
        this.SumProductOffer = sumProductOffer;
        this.PartialPrepayment = partialPrepayment;
        this.NdsRate = ndsRate;
        this.AdId = adId,
            this.OfferAddressByPosition = offerAddressByPosition
    }
}

class OfferEdit {
    constructor(
        id,
        senderId,
        adId,
        cityId,
        deliveryType,
        deliveryAddress,
        deliveryLoadType,
        deliveryWay,
        termsOfPayments,
        defermentPeriod,
        partialPrepayment,
        nds,
        activeUntilDate,
        conutUntilDay,
        comment,
        sumProductOffer
    ) {
        this.Id = id;
        this.SenderId = senderId;
        this.AdId = adId,
            this.CityId = cityId;
        this.DeliveryType = deliveryType;
        this.DeliveryAddress = deliveryAddress;
        this.DeliveryLoadType = deliveryLoadType;
        this.DeliveryWay = deliveryWay; // ✅ 2025  krakoss  Способ доставки Any = 0, Не выбрано
        this.TermsOfPayments = termsOfPayments;
        this.DefermentPeriod = defermentPeriod;
        this.PartialPrepayment = partialPrepayment;
        this.Nds = nds;
        this.ActiveUntilDate = activeUntilDate;
        this.ConutUntilDay = conutUntilDay;
        this.Comment = comment;
        this.SumProductOffer = sumProductOffer;
    }
}


class ProductOffer {
    constructor(
        id,
        offerId,
        productId,
        pricePerWeight,
        contracted,
        eachOfferProductAddress,
        eachSumPriceProductOffer,
        townId
    ) {
        this.Id = id;
        this.OfferId = offerId;
        this.ProductId = productId;
        this.PricePerWeight = pricePerWeight;
        this.Сontracted = contracted;
        this.EachOfferProductAddress = eachOfferProductAddress;
        this.EachSumPriceProductOffer = eachSumPriceProductOffer;
        this.TownId = townId;
    }
}
class NewProductOffer {
    constructor(
        productId,
        pricePerWeight,
        eachOfferProductAddress,
        eachSumPriceProductOffer,
        townId
    ) {
        this.ProductId = productId;
        this.PricePerWeight = pricePerWeight;
        this.EachOfferProductAddress = eachOfferProductAddress;
        this.EachSumPriceProductOffer = eachSumPriceProductOffer;
        this.TownId = townId;
    }
}

class FileView {
    constructor
        (
            id,
            guidName
        ) {
        this.Id = id;
        this.GuidName = guidName;
    }
}

class PhotoView {
    constructor
        (
            id,
            fileNameWithExtension
        ) {
        this.Id = id;
        this.FileNameWithExtension = fileNameWithExtension;
    }
}
class OkdpPush {
    constructor
        (
            id,
            idx,
            parenid,
            level,
            name
        ) {
        this.Id = id;
        this.Idx = idx;
        this.ParenId = parenid;
        this.Level = level;
        this.Name = name;
    }
}

class RegionPush {
    constructor
        (
            id,
            idSTown,
            name
        ) {
        this.Id = id;
        this.IdSTown = idSTown;
        this.Name = name;
    }
}
class TownPush {
    constructor
        (
            id,
            regionId,
            name
        ) {
        this.Id = id;
        this.RegionId = regionId;
        this.Name = name;
    }
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