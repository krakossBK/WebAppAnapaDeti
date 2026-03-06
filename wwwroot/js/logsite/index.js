'use strict';

const $typeLog = document.querySelector("#type-log");
const $messageLog = document.querySelector("#message-log"); 


// Обрабатываем переключение видимости `dialog`
document.querySelector("dialog").addEventListener("toggle", async (e) =>  {
    // Ничего не делаем, если видимость переключается программно
    if (!(e.source instanceof HTMLButtonElement)) return;

    let answer = e.source.dataset.answer == "ok"
        ? true
        : false;
    // Нас интересуют только кнопки закрытия
    if (answer) { 
        let url = `${hrefOrigin}/create-log`;
        let formData = new FormData();
        formData.append('LogTypeId', $typeLog.value);
        formData.append('Message', $messageLog.value);
        log(url);
        let response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            let result = await response.text();
            log(result)
            alert("Предложение успешно");

        }
        else
            log(`Ошибка HTTP: ${response.status}`);

    }
});



