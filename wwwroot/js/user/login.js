'use strict';

var errorMessage;
if (document.querySelector('#errorMessage') !== null)
    errorMessage = document.querySelector('#errorMessage').value;
const $formMainLogin = document.querySelector('#form-main-login');
const $linkReSendPassword = $formMainLogin.querySelector('#link-resend-password');
const $linkLogin = $formMainLogin.querySelector('#link-login');
const $emailUser = $formMainLogin.querySelector('#email');
const $passwordUser = $formMainLogin.querySelector('#login-password');


$linkLogin.addEventListener("click", async () => {
    if (validateFields($formMainLogin)) {
        var url = '/login';
        let formData = new FormData();
        formData.append('email', $emailUser.value);
        formData.append('password', $passwordUser.value);

        let response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            let result = await response.text();
            if (result == textOk)
                window.location.href = '/my';
            else {
                log(result);
                let errorMessage = result;
                validateFields($formMainLogin);
                let email = $emailUser.value;
                log(`emailUserValue ->> ${email}`)
                if (errorMessage.includes("Вы не подтвердили Ваш e-mail. Хотите получить письмо подтверждения повторно?")) {
                    const $emailVerivy = createPopup({
                        text: "Вы не подтвердили Ваш E-mail. Хотите получить письмо подтверждения повторно?",
                        btnText: "Отменить",
                        btnCallback: () => {
                            log("cancel");
                            removePopup($emailVerivy);
                        },
                        btnDangerText: "Отправить повторно",
                        btnDangerCallback: () => {
                            log("delete");
                            removePopup($emailVerivy);
                            ReSendEmail(email);
                        },
                    });
                }
                else if (errorMessage != textError) {
                    if (errorMessage.includes("User is not registered"))
                        LoadPageRegistration(email);
                    if (errorMessage.includes("User deleted"))
                        ReAccess(email);
                    if (errorMessage.includes("get confirmation email again"))
                        ReSendCode(email);
                    if (errorMessage.includes("Некорректный пароль")) {
                        showError($passwordUser, "Некорректный пароль");
                        createConfirmPopupLogin("Некорректный пароль");
                    }
                    if (errorMessage.includes("Неверный пароль")) {
                        showError($passwordUser, "Неверный пароль");
                        createConfirmPopupLogin("Неверный пароль");
                    }
                    if (errorMessage.includes("Пользователь на модерации")) {
                        showError($emailUser, "Пользователь на модерации");
                        createConfirmPopupLogin("Пользователь на модерации");
                    }
                    $passwordUser.value = '';
                }
            }

        } else
            log(`Ошибка HTTP: ${response.status}`);
    }
    else {
        log(`$passwordUser.value ${$passwordUser.value}`);

        if (!String($emailUser.value).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            showError($emailUser, "Некорректный E-mail");
            createConfirmPopupLogin("Некорректный E-mail");
        }
        else if ($passwordUser.value.length < 6 || $passwordUser.value.length > 24) {
            showError($passwordUser, "Некорректный пароль");
            createConfirmPopupLogin("Некорректный пароль");
        }
        else if ($passwordUser.value.length < 0) {
            showError($passwordUser, "Некорректный пароль");
            createConfirmPopupLogin("Некорректный пароль");
        }
    }
})

const ReSendEmail = async (email) => {
    var url = '/user/resend-email?email=' + email;
    let response = await fetch(url, {
        method: 'POST'
    });
    if (response.ok)
        createConfirmPopupLogin('Письмо подтверждения отправлено повторно. Для завершения регистрации перейдите по ссылке, указанной в письме.');
    else
        log(`Ошибка HTTP: ${response.status}`);
}

const ReSendCode = async (email) => {
    const $reSendCode = createPopup({
        text: "<br>Вы не подтвердили Ваш E-mail.<br> Хотите получить письмо подтверждения повторно?",
        btnText: "Отправить",
        btnCallback: async () => {
            log("ReSendCode");
            removePopup($reSendCode);
            var url = '/user/resend-email?email=' + email;
            let response = await fetch(url, {
                method: 'POST'
            });
            if (response.ok)
                createConfirmPopupLogin("<br>Проверочное письмо отправлено<br> на Ваш E-mail: <b>" + email + "</b>");
            else
                log(`Ошибка HTTP: ${response.status}`);
        },
        btnDangerText: "Отменить",
        btnDangerCallback: () => {
            log("Отменить");
            removePopup($reSendCode);
        },
    });
}

const LoadPageRegistration = (email) => {
    const $loadPageRegistration = createPopup({
        text: "<br>Пользователь не зарегистрирован <br>E-mail: <b>" + email + "</b>",
        btnText: "Зарегистрироваться",
        btnCallback: () => {
            log("LoadPageRegistration");
            removePopup($loadPageRegistration);
            location.href = "/registration";
        },
        btnDangerText: "Отменить",
        btnDangerCallback: () => {
            log("Отменить");
            removePopup($loadPageRegistration);
        },
    });

}
const ReAccess = (email) => {
    const $loadReAccess = createPopup({
        text: "<br>Пользователь удалил свой профиль <br>E-mail: <b>" + email + "</b>",
        btnText: "Восстановить доступ",
        btnCallback: () => {
            log("ReAccess");
            removePopup($loadReAccess);
            location.href = "/registration";
        },
        btnDangerText: "Отменить",
        btnDangerCallback: () => {
            log("Отменить");
            removePopup($loadReAccess);
        },
    });
}

const ReSendPassword = async (email) => {
    var url = '/user/pass-resend?email=' + email;
    let response = await fetch(url, {
        method: 'GET'
    });
    if (response.ok) {
        let result = await response.text();
        createConfirmPopupLogin(result);
    } else
        log(`Ошибка HTTP: ${response.status}`);
}


$linkReSendPassword.addEventListener("click", async () => {
    validateFields($formMainLogin);
    if (!$emailUser) {
        const $errorReSendPassword = createPopup({
            text: "Вы не указали емайл.",
            btnText: "OK",
            btnCallback: () => {
                validateFields($formMainLogin);
                removePopup($errorReSendPassword);
            },
        });
    }
    else
        ReSendPassword($emailUser.value);
})