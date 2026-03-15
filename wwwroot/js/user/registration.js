'use strict';

function validate(form) {
    var reason = "";

    if (form.contactname.value == "" || /[^a-zA-z]/.test(form.contactname.value))
        reason += "Ошибка имени ";
    if (form.passwd.value == "" || /[^0-9]/.test(form.passwd.value))
        reason += "Ошибка пароля ";
    if (form.email.value == "" || /[^a-zA-z]@/.test(form.email.value))
        reason += "Ошибка email ";
    if (reason == "")
        return true;
    else {
        alert(reason);
        return false;
    }
}



