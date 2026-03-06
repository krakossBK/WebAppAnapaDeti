var siteUrl = document.getElementById('siteUrl').value;
var siteUrlClear = document.getElementById('siteUrlClear').value;
var textOk = document.getElementById('textOk').value;


// ✅ CustomAlert  => Custom JS Alert
// https://codepen.io/nishanc/pen/NWWPdZE
function CustomAlert() {
    this.alert = function (message, title) {
        document.body.innerHTML +=`
            <div id = "dialogoverlay">
            </div>
            <div id="dialogbox" class="slit-in-vertical">
                <div>
                    <div id="dialogboxhead"></div>
                    <div id="dialogboxbody"></div>
                    <div id="dialogboxfoot"></div>
                </div>
            </div>`;

        let dialogoverlay = document.getElementById('dialogoverlay');
        let dialogbox = document.getElementById('dialogbox');

        let winH = window.innerHeight;
        dialogoverlay.style.height = winH + "px";

        dialogbox.style.top = "150px";

        dialogoverlay.style.display = "block";
        dialogbox.style.display = "block";

        document.getElementById('dialogboxhead').style.display = 'block';

        if (typeof title === 'undefined')
            document.getElementById('dialogboxhead').style.display = 'none';
        else
            document.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + title;

        document.getElementById('dialogboxbody').innerHTML = message;
        document.getElementById('dialogboxfoot').innerHTML = '<button class="pure-material-button-contained active" onclick="customAlert.ok()">OK</button>';
    }

    this.ok = function () {
        document.getElementById('dialogbox').remove();
        document.getElementById('dialogoverlay').remove();
    }
}

let customAlert = new CustomAlert();
// ✅ CustomAlert  => Custom JS Alert

// ✅ START Category =>  обработка данных Category
var bodySite = document.querySelector('#bodySite'); // bodySite
let openPopupButtons = document.querySelectorAll('.create-popup'); // Кнопки для показа окна;
let closePopupButton;

// Показ всплывающего окна при клике Создание Категории
function createpopUp() {
    bodySite.innerHTML += `
<div class="popup__bg" id="popupWindows">
    <div class="popup">
        <span class="close-popup" onclick="deletePopUp()"></span>
        <div>
          <label>
            <input type="text" id="categoryName">
            <div class="label__text">
               Наименование категории
            </div>
          </label>
          <label>
            <input type="text" id="categoryDescription">
            <div class="label__text">
                Описание категории
            </div>
          </label>
         </div>
         <div class="btnSave" onclick="saveCategory()">сохранить</div>
    </div>
</div>  `;

    this.deletePopUp = function () {
        document.getElementById('popupWindows').remove();
    }

    this.saveCategory = function () {
        let nameCategoryName = document.getElementById('categoryName').value;
        let nameCategoryDescription = document.getElementById('categoryDescription').value;

        const nameCategoryNameLenght = nameCategoryName.lenght;
        const nameCategoryDescriptionLenght = nameCategoryDescription.lenght;

        debugger;

        if (nameCategoryName === null || nameCategoryName == "") {
            customAlert.alert('Вы не указали Наименование категории.', siteUrl);
            return false;
        }
        else {
            if (nameCategoryNameLenght < 3) {
                customAlert.alert('Длинна Наименование категории меньше 3 символов.', siteUrl);
                return false;
            }
        }
        if (nameCategoryDescription === null || nameCategoryDescription == "") {
            customAlert.alert('Вы не указали Описание категории.', siteUrl);
            return false;
        }
        else {
            if (nameCategoryDescriptionLenght < 3) {
                customAlert.alert('Длинна Описание категории меньше 3 символов.', siteUrl);
                return false;
            }
        }

        let formData = new FormData();
        formData.append('CategoryName', nameCategoryName);
        formData.append('CategoryDescription', nameCategoryDescription);

        CreateCategory(formData);
    }
}

CreateCategory = async function (formData) {    
    var url = siteUrl + 'Root/CreateCategory';
    let response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    if (response.ok) {
        let result = await response.text();
        if (result == textOk) {
            document.getElementById('popupWindows').remove();
            document.location.reload();
        }
        else
            customAlert.alert('Указаны не все данные.', siteUrl);
    } else
        console.log("Ошибка HTTP: " + response.status);
}

// Показ всплывающего окна при клике Редактирование Категории
function editpopUp(event) {
    const el = event;
    let id = el.getAttribute('data-id');

    bodySite.innerHTML += `
<div class="popup__bg" id="popupWindows">
    <div class="popup">
        <span class="close-popup" onclick="deletePopUp()"></span>
        <div>
          <label>
            <input type="text" id="categoryName">
            <div class="label__text">
               Наименование категории
            </div>
          </label>
          <label>
            <input type="text" id="categoryDescription">
            <div class="label__text">
                Описание категории
            </div>
          </label>
         </div>
         <div class="btnSave" onclick="editCategory()">редактировать</div>
    </div>
</div>  `;
    let tr = el.closest('tr');
    let catname = tr.querySelector('.catname');
    let nameCategoryName = document.getElementById('categoryName');
    nameCategoryName.value = catname.innerHTML;
    let descriptionName = tr.querySelector('.description');
    let nameCategoryDescription = document.getElementById('categoryDescription');;
    nameCategoryDescription.value = descriptionName.innerHTML;


    this.deletePopUp = function () {
        document.getElementById('popupWindows').remove();
    }

    this.editCategory = function () {
        const nameCategoryNameLenght = nameCategoryName.value.lenght;
        const nameCategoryDescriptionLenght = nameCategoryDescription.value.lenght;

        //debugger;

        if (nameCategoryName === null || nameCategoryName == "") {
            customAlert.alert('Вы не указали Наименование категории.', siteUrl);
            return false;
        }
        else {
            if (nameCategoryNameLenght < 3) {
                customAlert.alert('Длинна Наименование категории меньше 3 символов.', siteUrl);
                return false;
            }
        }
        if (nameCategoryDescription === null || nameCategoryDescription == "") {
            customAlert.alert('Вы не указали Описание категории.', siteUrl);
            return false;
        }
        else {
            if (nameCategoryDescriptionLenght < 3) {
                customAlert.alert('Длинна Описание категории меньше 3 символов.', siteUrl);
                return false;
            }
        }

        let formData = new FormData();
        formData.append('id', id);
        formData.append('CategoryName', nameCategoryName.value);
        formData.append('CategoryDescription', nameCategoryDescription.value);

        EditCategory(formData);
    }
}
EditCategory = async function (formData) {
    var url = siteUrl + 'Root/EditCategory';
    let response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    if (response.ok) {
        let result = await response.text();
        if (result == textOk) {
            document.getElementById('popupWindows').remove();
            document.location.reload();
        }
        else
            customAlert.alert('Указаны не все данные.', siteUrl);
    } else
        console.log("Ошибка HTTP: " + response.status);
}

// Показ всплывающего окна при клике Удалении Категории
function deletepopUp(event) {
    const el = event;
    let id = el.getAttribute('data-id');

    bodySite.innerHTML += `
<div class="popup__bg" id="popupWindows">
    <div class="popup">
        <span class="close-popup" onclick="deletePopUp()"></span>
        <div>
          <label>
            <span id="categoryName"></span>
            <div class="label__text">
               Наименование категории
            </div>
          </label>
          <label>
            <span id="categoryDescription"></span>
            <div class="label__text">
                Описание категории
            </div>
          </label>
         </div>
         <div class="btnSave" onclick="deleteCategory()">удалить</div>
    </div>
</div>  `;
    let tr = el.closest('tr');
    let catname = tr.querySelector('.catname');
    let categoryName = document.getElementById('categoryName');
    categoryName.innerHTML = catname.innerHTML;
    let descriptionName = tr.querySelector('.description');
    let categoryDescription = document.getElementById('categoryDescription');;
    categoryDescription.innerHTML = descriptionName.innerHTML;


    this.deletePopUp = function () {
        document.getElementById('popupWindows').remove();
    }

    this.deleteCategory = function () {
        let formData = new FormData();
        formData.append('id', id);
        DeleteCategory(formData);
    }
}
DeleteCategory = async function (formData) {
    var url = siteUrl + 'Root/DeleteCategory';
    let response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    if (response.ok) {
        let result = await response.text();
        if (result == textOk) {
            document.getElementById('popupWindows').remove();
            document.location.reload();
        }
        else
            customAlert.alert('Указаны не все данные.', siteUrl);
    } else
        console.log("Ошибка HTTP: " + response.status);
}

// ✅ END Category =>  обработка данных Category

