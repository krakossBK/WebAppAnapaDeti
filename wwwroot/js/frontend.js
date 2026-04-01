'use strict';
const $adForm = document.querySelector('[name="ad-form"]');// 20250516  krakoss
const $offerForm = document.querySelector('[name="offer-form"]');// 20250516  krakoss

if ($adForm !== null) {
    const $offerMainFilesList = document.querySelectorAll(".offer-main__files");
    $offerMainFilesList.forEach(($offerMainFiles) => {
        const $offerMain = $offerMainFiles.closest(".offer-main");
        const $offerMainFilesEmpty = $offerMain.querySelector(".offer-main__empty--files");

        const $offerTabsHeaderBtnFileField = $offerMain?.querySelector(".offer-main__tabs-header-btn--files .btn__file-field");
        let $offerMainFilesItems = $offerMainFiles.querySelectorAll(".offer-main__file");
        let $totalSize = 0;

        $offerTabsHeaderBtnFileField?.addEventListener("change", async (evnt) => {
            const $files = $offerTabsHeaderBtnFileField.files;

            validUploadFiles($files, validExtsFiles)
                .then(data => {
                    try {
                        log(`validUploadFiles -> ${data}`)
                        if (data) {
                            filesSizeAll($files)
                                .then(data => {
                                    try {
                                        if (data) {
                                            filesSizeDB()
                                                .then(result => {
                                                    try {
                                                        log(`filesSize -> ${data}`);
                                                        log(`filesSizeDB -> ${result}`);

                                                        $totalSize = parseInt(data) + parseInt(result);
                                                        // 60 000 000 == 60 mB;
                                                        if (parseInt($totalSize) < 60000000) {
                                                            log(`alles ser gut  Max Size -> ${$totalSize}`);
                                                            const fileList = [...$files];
                                                            log(fileList);
                                                            evnt.preventDefault();
                                                            fileList.forEach(function (file) {
                                                                sendFile(file);
                                                            });
                                                            //uploadFile($files);
                                                        }
                                                        else {
                                                            log(`Over Max Size -> ${$totalSize}`);
                                                            const $filesSizeAllPopup = createPopup({
                                                                text: 'Вы превысили максимально допустимый размер файлов для одного объявления в 60 мБ',
                                                                btnText: "OK",
                                                                btnCallback: () => {
                                                                    removePopup($filesSizeAllPopup);
                                                                    clearUnputFiles($offerTabsHeaderBtnFileField);
                                                                    return;
                                                                },
                                                            });
                                                        }

                                                    }
                                                    catch (err) {
                                                        unLockScreen();
                                                        console.error(err);
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error(error);
                                                });
                                        }
                                    }
                                    catch (err) {
                                        unLockScreen();
                                        console.error(err);
                                    }
                                })
                                .catch(error => {
                                    unLockScreen();
                                    console.error(error);
                                });
                        }
                    }
                    catch (err) {
                        unLockScreen();
                        console.error(err);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });

        async function uploadFile($files) {
            try {
                if ($files.length == 0) {
                    throw new Error('No file selected');
                }
                else {
                    lockScreen();
                    const $adIdTemp = $adForm.dataset.adId;
                    for (var i = 0; i < $files.length; i++) {
                        // костыль работает Waiting 1 sec нужен для создания разметки добавленного файла
                        await sleep(1500);
                        let file = $files[i];
                        let data = new FormData();
                        data.append('adId', parseInt($adIdTemp));
                        data.append('file', file);
                        let response = await fetch(`${hrefOrigin}/market/upload-file`, {
                            method: 'POST',
                            credentials: 'same-origin',
                            body: data
                        });
                        if (response.status != 200)
                            throw new Error('HTTP response code != 200');

                        var result = await response.text();
                        if (result.includes(textOk)) {
                            var resultInfo = result.split(',');
                            let fileName = resultInfo[1];
                            let guidName = resultInfo[3];
                            const $offerFile = createOfferFile(fileName, guidName);
                            $offerMainFiles.append($offerFile);
                            $offerMainFilesItems = $offerMainFiles.querySelectorAll(".offer-main__file");
                            offerMainEmptyHandler($offerMainFiles, $offerMainFilesItems, $offerMainFilesEmpty); // Обработчик отображение/скрытия блока "Данные не заполнены"
                            log(`фaйл загружен -> ${fileName}`);
                        }
                    }
                    unLockScreen();
                    $offerTabsHeaderBtnFileField.value = '';
                }
            }
            catch (e) {
                unLockScreen();
                log({ error: 1, message: e.message });
            }
        }

        async function sendFile(file) {
            try {
                lockScreen();
                // костыль работает Waiting 1 sec нужен для создания разметки добавленного файла
                await sleep(1500);
                let data = new FormData();
                data.append('adId', parseInt($adForm.dataset.adId));
                data.append('file', file);
                let response = await fetch(`${hrefOrigin}/market/upload-file`, {
                    method: 'POST',
                    credentials: 'same-origin',
                    body: data
                });
                if (response.status != 200)
                    throw new Error('HTTP response code != 200');

                let result = await response.text();
                if (result.includes(textOk)) {
                    let resultInfo = result.split(',');
                    let fileName = resultInfo[1];
                    let guidName = resultInfo[3];
                    const $offerFile = createOfferFile(fileName, guidName);
                    $offerMainFiles.append($offerFile);
                    $offerMainFilesItems = $offerMainFiles.querySelectorAll(".offer-main__file");
                    offerMainEmptyHandler($offerMainFiles, $offerMainFilesItems, $offerMainFilesEmpty); // Обработчик отображение/скрытия блока "Данные не заполнены"
                    log(`фaйл загружен -> ${fileName}`);
                }

                unLockScreen();
                $offerTabsHeaderBtnFileField.value = '';
            }
            catch (e) {
                unLockScreen();
                log({ error: 1, message: e.message });
            }
        }

        const filesSizeDB = async () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const adIdTemp = $adForm.dataset.adId;
                    var url = `${hrefOrigin}/market/sum-size-files-db`;
                    let formData = new FormData();
                    formData.append('adId', parseInt(adIdTemp));
                    let response = await fetch(url, {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        let result = await response.text();
                        log(`filesSizeDB ${result}`);
                        resolve(parseInt(result));
                    } else
                        log("Ошибка HTTP: " + response.status);
                }
                catch (err) {
                    reject(err);
                    unLockScreen();
                }
            })
        }

        const clearUnputFiles = ($offerTabsHeaderBtnFileField) => {
            $totalSize = 0;
            $offerTabsHeaderBtnFileField.value = [];
        }

        const fileDelete = async (guidName) => {
            return new Promise(async (resolve, reject) => {
                try {
                    var url = `${hrefOrigin}/market/delete-file`;
                    let formData = new FormData();
                    formData.append('guidName', guidName);
                    let response = await fetch(url, {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        let result = await response.text();
                        log(`fileDelete (${guidName}) ${result}`);
                        if (result == textOk)
                            resolve(true);
                        else
                            resolve(false);
                        unLockScreen();
                    } else {
                        unLockScreen();
                        log(`Ошибка HTTP: ${response.status}`);
                    }
                }
                catch (err) {
                    reject(err);
                    unLockScreen();
                }
            })
        }
        $adForm.addEventListener(clickHandler, (event) => {
            if (event.target.classList.contains('file__delete')) {
                let offerMainFile = event.target.closest('.offer-main__file');
                let guidName = offerMainFile.dataset.guidName;
                fileDelete(guidName);
                offerMainFile.remove();
                $offerMainFilesItems = $offerMainFiles.querySelectorAll(".offer-main__file");
                offerMainEmptyHandler($offerMainFiles, $offerMainFilesItems, $offerMainFilesEmpty);// Обработчик отображение/скрытия блока "Данные не заполнены"
            }
        });
    });

    /* -->  images <-- */

    const $offerMainImagesList = document.querySelectorAll(".offer-main__images");
    $offerMainImagesList.forEach(($offerMainImages) => {
        const $offerMain = $offerMainImages.closest(".offer-main");
        const $offerImagesList = $offerMain.querySelector(".offer-images__list");
        const $offerMainImagesEmpty = $offerMain.querySelector(".offer-main__empty--images");
        const $offerTabsHeaderBtnImageField = $offerMain?.querySelector(".offer-main__tabs-header-btn--images .btn__file-field.js-ad-add-img");
        let $offerMainImagesItems = $offerMainImages.querySelectorAll(".offer-main__images");
        let $totalImgSize = 0;
        let countUploadImg;
        let imagesLength;

        $offerTabsHeaderBtnImageField?.addEventListener("change", async function () {
            const $images = $offerTabsHeaderBtnImageField.files;
            imagesLength = $images.length;
            countUploadImg = 0;
            validUploadFiles($images, validExtsImages)
                .then(data => {
                    lockScreen();
                    try {
                        if (data) {
                            imagesSizeAll($images)
                                .then(data => {
                                    try {
                                        if (data) {
                                            imagesSizeDB()
                                                .then(result => {
                                                    try {
                                                        $totalImgSize = parseInt(data) + parseInt(result);
                                                        if (parseInt($totalImgSize) < 100000000) {
                                                            const imageList = [...$images];
                                                            log(imageList);
                                                            uploadImg($images);
                                                        }
                                                        else {
                                                            const $imagesSizeAllPopup = createPopup({
                                                                text: 'Вы превысили максимально допустимый размер загружаемых файлов для одного объявления в 100 мБ',
                                                                btnText: "OK",
                                                                btnCallback: () => {
                                                                    removePopup($imagesSizeAllPopup);
                                                                    clearUnputImages($offerTabsHeaderBtnImageField);
                                                                    unLockScreen();
                                                                    return;
                                                                },
                                                            });
                                                        }
                                                    }
                                                    catch (err) {
                                                        unLockScreen();
                                                        console.error(err);
                                                    }
                                                })
                                                .catch(error => {
                                                    unLockScreen();
                                                    console.error(error);
                                                });
                                        }
                                    }
                                    catch (err) {
                                        unLockScreen();
                                        console.error(err);
                                    }
                                })
                                .catch(error => {
                                    unLockScreen();
                                    console.error(error);
                                });
                        }
                        else
                            unLockScreen();
                    }
                    catch (err) {
                        unLockScreen();
                        console.error(err);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });

        async function uploadImg($images) {
            return new Promise(async (resolve, reject) => {
                try {
                    if ($images.length == 0)
                        throw new Error('No file selected');
                    else {
                        for (var i = 0; i < $images.length; i++) {
                            await sleep(1500);// костыль работает Waiting 1 sec нужен для создания разметки добавленного рисунка
                            let image = $images[i];
                            imageSize(image)
                                .then(resultSize => {
                                    // 15 000 000 == 15 mB;
                                    if (resultSize < 15100000) {
                                        if (isHEIC(image)) {
                                            // convert any heic (and do any other prep) before uploading the image
                                            convertHeicToJpg(image)
                                                .then(data => {
                                                    log(`convertHeicToJpg(image)`);
                                                    log(data);
                                                    try {
                                                        imageResize(data);
                                                        resolve(true);
                                                    }
                                                    catch (err) {
                                                        unLockScreen();
                                                        log({ error: 1, message: err.message });
                                                    }
                                                })
                                                .catch(error => {
                                                    unLockScreen();
                                                    console.error(error);
                                                });
                                        }
                                        else if (isAVIF(image)) {
                                            imageStringToWebp(image).then(data => {
                                                log(`isAVIF(image)`);
                                                log(data);
                                                try {
                                                    imageResize(data);
                                                    resolve(true);
                                                }
                                                catch (err) {
                                                    unLockScreen();
                                                    log({ error: 1, message: err.message });
                                                }
                                            })
                                                .catch(error => {
                                                    unLockScreen();
                                                    console.error(error);
                                                });
                                        }
                                        else {
                                            imageResize(image);
                                            resolve(true);
                                        }
                                    }
                                    else {
                                        unLockScreen();
                                        console.error(`${resultSize} > 15100000`);
                                        const $imgSizePopup = createPopup({
                                            text: 'Вы превысили максимально допустимый размер загружаемого файла в 15 мБ',
                                            btnText: "OK",
                                            btnCallback: () => {
                                                removePopup($imgSizePopup);
                                                clearUnputImages($offerTabsHeaderBtnImageField);
                                                unLockScreen();
                                                return;
                                            },
                                        });
                                    }
                                })
                                .catch(error => {
                                    unLockScreen();
                                    console.error(error);
                                });


                        }
                    }
                    unLockScreen();
                    resolve(false);
                }
                catch (err) {
                    reject(err);
                    unLockScreen();
                    log({ error: 1, message: err.message });
                }
            });
        }


        async function uploadCompressedImage(imagestring) {
            const $adId = $adForm.dataset.adId;
            let groupId;
            let formData = new FormData();
            formData.append('dataImage', imagestring);
            formData.append('adId', parseInt($adId));

            let response = await fetch(`${hrefOrigin}/market/upload-photo`, {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            });
            if (response.status != 200)
                throw new Error('HTTP response code != 200');

            var result = await response.text();
            countUploadImg++;
            if (result.includes(textOk)) {
                var imgInfon = result.split(',');
                groupId = imgInfon[1];
                const $offerImage = createOfferImage(groupId, imagestring);
                $offerImagesList.append($offerImage);
                $offerMainImagesItems = $offerImagesList.querySelectorAll(".offer-images__item");
                offerMainEmptyHandler($offerMainImages, $offerMainImagesItems, $offerMainImagesEmpty);// Обработчик отображение/скрытия блока "Данные не заполнены"

            }
            if (countUploadImg == imagesLength) {
                unLockScreen(); $offerTabsHeaderBtnImageField.value = '';
                let offerImagesItem = $offerImagesList.firstElementChild;
                if (isValidElement(offerImagesItem)) {
                    let btnSetMain = offerImagesItem.querySelector(".make-main-photo");
                    photoSetMain(btnSetMain);
                }
                //let photoIsMain = $offerImagesList.querySelectorAll('.photo-is-main');
                //if (photoIsMain.length == 0) {
                //    setMainPhoto(groupId)
                //        .then(data => {
                //            try {
                //                //  2025  krakoss  надо доработать код назначения Главного фото 
                //                if (data) {
                //                    let photoIsMainBtns = $offerImagesList.querySelectorAll(`[data-guid-name="${groupId}"]`);
                //                    photoIsMainBtns.forEach((item) => {
                //                        if (!item.classList.contains('offer-img__delete')) {
                //                            item.classList.remove('make-main-photo');
                //                            item.classList.add('photo-is-main');
                //                            let offerImageItem = item.closest('.offer-images__item');
                //                            $offerImagesList.prepend(offerImageItem);
                //                        }
                //                    })
                //                }
                //            }
                //            catch (err) {
                //                unLockScreen();
                //                console.error(err);
                //            }
                //        })
                //        .catch(error => {
                //            unLockScreen();
                //            console.error(error);
                //        });
                //}
            }

        }

        async function imagesSizeAll($images) {
            return new Promise(async (resolve, reject) => {
                try {
                    var total = [].slice.call($images).map(function (x) {
                        return x.size || x.fileSize;
                    }).reduce(function (a, b) {
                        return a + b;
                    }, 0);

                    resolve(total);
                }
                catch (err) {
                    unLockScreen();
                    reject(err);
                }
            })
        }

        async function imagesSizeDB() {
            return new Promise(async (resolve, reject) => {
                try {
                    const adIdTemp = $adForm.dataset.adId;
                    var url = `${hrefOrigin}/market/sum-size-photos-db`;
                    let formData = new FormData();
                    formData.append('adId', parseInt(adIdTemp));
                    let response = await fetch(url, {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        let result = await response.text();
                        resolve(parseInt(result));
                    } else
                        log("Ошибка HTTP: " + response.status);
                }
                catch (err) {
                    unLockScreen();
                    reject(err);
                }
            })
        }

        function clearUnputImages($offerTabsHeaderBtnImageField) {
            $totalImgSize = 0;
            $offerTabsHeaderBtnImageField.value = [];
        }

        function imageResize(image) {
            try {
                var reader = new FileReader();
                var dataUrl;
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
                        uploadCompressedImage(webpImg, width, height);
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


        Fancybox.bind('[data-fancybox="gallery"]', {
            Slideshow: {
                playOnStart: true,
            },
        });

        async function photoDelete(guidName) {
            return new Promise(async (resolve, reject) => {
                try {
                    var url = `${hrefOrigin}/market/delete-new-photo`;
                    let formData = new FormData();
                    formData.append('guidName', guidName);
                    let response = await fetch(url, {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        let result = await response.text();
                        log(`photoDelete (${guidName}) ${result}`);
                        if (result == textOk) {
                            let offerImagesItem = $offerImagesList.firstElementChild;
                            if (isValidElement(offerImagesItem)) {
                                let btnSetMain = offerImagesItem.querySelector(".make-main-photo");
                                photoSetMain(btnSetMain);
                            }
                            resolve(true);
                        }
                        else
                            resolve(false);
                        unLockScreen();
                    } else
                        log(`Ошибка HTTP: ${response.status}`);
                }
                catch (err) {
                    reject(err);
                    unLockScreen();
                }
            })
        }

        $offerImagesList.addEventListener(clickHandler, function (event) {
            log(event.target);
            if (event.target.classList.contains('make-main-photo')) {
                photoSetMain(event.target);
            }
            if (event.target.classList.contains('offer-img__delete')
                || event.target.classList.contains('actual-img__delete')) {
                let offerImageItem = event.target.closest('.offer-images__item');
                let guidName = offerImageItem.dataset.guidName;
                log(guidName);
                photoDelete(guidName);
                offerImageItem.remove();
                $offerMainImagesItems = $offerImagesList.querySelectorAll(".offer-images__item");
                offerMainEmptyHandler($offerMainImages, $offerMainImagesItems, $offerMainImagesEmpty);// Обработчик отображение/скрытия блока "Данные не заполнены"
            }
        })

        async function photoSetMain(eTarget) {
            if (eTarget == null)
                return;
            let btnSetMain = eTarget;
            let offerImageItem = btnSetMain.closest('.offer-images__item');
            let guidName = offerImageItem.dataset.guidName;
            setMainPhoto(guidName)
                .then(data => {
                    try {
                        if (data) {
                            let photoIsMainBtns = $offerImagesList.querySelectorAll('.photo-is-main');
                            photoIsMainBtns.forEach((item) => {
                                item.classList.remove("photo-is-main");
                                item.classList.add("make-main-photo");

                            })
                            btnSetMain.classList.remove('make-main-photo');
                            btnSetMain.classList.add('photo-is-main');
                            $offerImagesList.prepend(offerImageItem);
                        }
                    }
                    catch (err) {
                        unLockScreen();
                        console.error(err);
                    }
                })
                .catch(error => {
                    unLockScreen();
                    console.error(error);
                });
        }

        async function setMainPhoto(guidName) {
            return new Promise(async (resolve, reject) => {
                try {
                    var url = `${hrefOrigin}/market/make-photo-main`;
                    let formData = new FormData();
                    formData.append('guidName', guidName);
                    let response = await fetch(url, {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        let result = await response.text();
                        if (result == textOk)
                            resolve(true);
                        else
                            resolve(false);
                        unLockScreen();
                    } else
                        log(`Ошибка HTTP: ${response.status}`);
                }
                catch (err) {
                    reject(err);
                    unLockScreen();
                }
            })
        }
    });

    const $offerMainCommentsList = document.querySelectorAll(".offer-main__comment");

    $offerMainCommentsList.forEach(($offerMainComments) => {
        const $offerMain = $offerMainComments.closest(".offer-main");
        const $offerMainCommentsEmpty = $offerMain.querySelector(".offer-main__empty--comment");

        if ($offerMainCommentsEmpty && $offerMainComments.innerText.trim() === "")
            $offerMainCommentsEmpty.classList.add("offer-main__empty--show");
        else if ($offerMainCommentsEmpty)
            $offerMainCommentsEmpty.style.display = 'none';
    });

    function createOfferFile(nameFile, guidName) {
        const $offerFile = createElem("div", "file file--success offer-main__file");
        $offerFile.dataset.guidName = guidName;
        const $linkA = createElem("a", "file__name");
        $linkA.innerHTML = nameFile;

        const $delete = createElem("button", "file__delete");
        $offerFile.append($linkA);
        $offerFile.append($delete);
        return $offerFile;
    }

    function createOfferImage(groupid, imagestring) {
        const $offerImage = createElem("div", "offer-img offer-images__item");
        $offerImage.dataset.guidName = groupid;

        const $photo = createElem("img", "offer-img__main");
        $photo.src = imagestring;
        $photo.dataset.url = imagestring;
        $photo.alt = "фото";
        $photo.dataset.fancybox = "gallery";
        const $delete = createElem("button", "offer-img__delete");

        const $iconDelete = createElem("img", "actual-img__delete");
        $iconDelete.src = `${hrefOrigin}/img/icons/exit-blue-500.svg`;
        $iconDelete.alt = "";

        const $setMain = createElem("button", "make-main-photo");
        const $iconSetMain = createElem("img", "");
        $iconSetMain.alt = "";

        $offerImage.append($photo);
        $offerImage.append($delete);
        $delete.append($iconDelete);
        $offerImage.append($setMain);
        $setMain.append($iconSetMain);

        return $offerImage;
    }

    function verifyData(data) { }
}

if ($offerForm !== null) {
    const $offerMainFilesList = document.querySelectorAll(".offer-main__files");
    $offerMainFilesList.forEach(($offerMainFiles) => {
        const $offerMain = $offerMainFiles.closest(".offer-main");
        const $offerMainFilesEmpty = $offerMain.querySelector(".offer-main__empty--files");

        const $offerTabsHeaderBtnFileField = $offerMain?.querySelector(".offer-main__tabs-header-btn--files .btn__file-field");
        let $offerMainFilesItems = $offerMainFiles.querySelectorAll(".offer-main__file");
        let $totalSize = 0;

        $offerTabsHeaderBtnFileField?.addEventListener("change", async () => {
            const $files = $offerTabsHeaderBtnFileField.files;

            validUploadFiles($files, validExtsFiles)
                .then(data => {
                    try {
                        log(`validUploadFiles -> ${data}`)
                        if (data) {
                            filesSizeAll($files)
                                .then(data => {
                                    try {
                                        if (data) {
                                            filesSizeDB()
                                                .then(result => {
                                                    try {
                                                        log(`filesSize -> ${data}`);
                                                        log(`filesSizeDB -> ${result}`);

                                                        $totalSize = parseInt(data) + parseInt(result);
                                                        // 60 000 000 == 60 mB;
                                                        if (parseInt($totalSize) < 60000000) {
                                                            log(`alles ser gut  Max Size -> ${$totalSize}`);
                                                            const fileList = [...$files];
                                                            log(fileList);
                                                            uploadFile($files);
                                                        }
                                                        else {
                                                            log(`Over Max Size ->  ${$totalSize}`);
                                                            const $filesSizeAllPopup = createPopup({
                                                                text: 'Вы превысили максимально допустимый размер файлов для одного объявления в 60 мБ',
                                                                btnText: "OK",
                                                                btnCallback: () => {
                                                                    removePopup($filesSizeAllPopup);
                                                                    clearUnputFiles($offerTabsHeaderBtnFileField);
                                                                    return;
                                                                },
                                                            });
                                                        }

                                                    }
                                                    catch (err) {
                                                        unLockScreen();
                                                        console.error(err);
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error(error);
                                                });
                                        }
                                    }
                                    catch (err) {
                                        unLockScreen();
                                        console.error(err);
                                    }
                                })
                                .catch(error => {
                                    unLockScreen();
                                    console.error(error);
                                });
                        }
                    }
                    catch (err) {
                        unLockScreen();
                        console.error(err);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });
        async function uploadFile($files) {
            try {
                if ($files.length == 0) {
                    throw new Error('No file selected');
                }
                else {
                    lockScreen();
                    let adId = parseInt($offerForm.dataset.adId);
                    let offerId = parseInt($offerForm.dataset.adId);
                    for (var i = 0; i < $files.length; i++) {
                        let file = $files[i];
                        let data = new FormData();
                        data.append('adId', adId);
                        data.append('offerId', offerId);
                        data.append('file', file);
                        let response = await fetch(`${hrefOrigin}/market/upload-file`, {
                            method: 'POST',
                            credentials: 'same-origin',
                            body: data
                        });
                        if (response.status != 200)
                            throw new Error('HTTP response code != 200');

                        var result = await response.text();
                        if (result.includes(textOk)) {
                            var resultInfo = result.split(',');
                            let fileName = resultInfo[1];
                            let guidName = resultInfo[3];
                            const $offerFile = createOfferFile(fileName, guidName);
                            $offerMainFiles.append($offerFile);
                            $offerMainFilesItems = $offerMainFiles.querySelectorAll(".offer-main__file");
                            offerMainEmptyHandler($offerMainFiles, $offerMainFilesItems, $offerMainFilesEmpty); // Обработчик отображение/скрытия блока "Данные не заполнены"
                            log(`фaйл загружен -> ${fileName}`);
                        }
                    }
                    unLockScreen();
                    $offerTabsHeaderBtnFileField.value = '';
                }
            }
            catch (e) {
                unLockScreen();
                log({ error: 1, message: e.message });
            }
        }

        const filesSizeDB = async () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const adIdTemp = $offerForm.dataset.adId;
                    var url = `${hrefOrigin}/market/sum-size-files-db`;
                    let formData = new FormData();
                    formData.append('adId', parseInt(adIdTemp));
                    let response = await fetch(url, {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        let result = await response.text();
                        log(`filesSizeDB ${result}`);
                        resolve(parseInt(result));
                    } else
                        log("Ошибка HTTP: " + response.status);
                }
                catch (err) {
                    reject(err);
                    unLockScreen();
                }
            })
        }

        const clearUnputFiles = ($offerTabsHeaderBtnFileField) => {
            $totalSize = 0;
            $offerTabsHeaderBtnFileField.value = [];
        }

        const fileDelete = async (guidName) => {
            return new Promise(async (resolve, reject) => {
                try {
                    var url = `${hrefOrigin}/market/delete-file`;
                    let formData = new FormData();
                    formData.append('guidName', guidName);
                    let response = await fetch(url, {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        let result = await response.text();
                        log(`fileDelete (${guidName}) ${result}`);
                        if (result == textOk)
                            resolve(true);
                        else
                            resolve(false);
                        unLockScreen();
                    } else {
                        unLockScreen();
                        log(`Ошибка HTTP: ${response.status}`);
                    }
                }
                catch (err) {
                    reject(err);
                    unLockScreen();
                }
            })
        }

        $offerForm.addEventListener(clickHandler, (event) => {
            if (event.target.classList.contains('file__delete')) {
                let offerMainFile = event.target.closest('.offer-main__file');
                let guidName = offerMainFile.dataset.guidName;
                fileDelete(guidName);
                offerMainFile.remove();
                $offerMainFilesItems = $offerMainFiles.querySelectorAll(".offer-main__file");
                offerMainEmptyHandler($offerMainFiles, $offerMainFilesItems, $offerMainFilesEmpty);// Обработчик отображение/скрытия блока "Данные не заполнены"
            }
        });
    });


    const $offerMainCommentsList = document.querySelectorAll(".offer-main__comment");

    $offerMainCommentsList.forEach(($offerMainComments) => {
        const $offerMain = $offerMainComments.closest(".offer-main");
        const $offerMainCommentsEmpty = $offerMain.querySelector(".offer-main__empty--comment");

        if ($offerMainCommentsEmpty && $offerMainComments.innerText.trim() === "")
            $offerMainCommentsEmpty.classList.add("offer-main__empty--show");
        else if ($offerMainCommentsEmpty)
            $offerMainCommentsEmpty.style.display = 'none';
    });

    function createOfferFile(nameFile, guidName) {
        const $offerFile = createElem("div", "file file--success offer-main__file");
        $offerFile.dataset.guidName = guidName;
        const $linkA = createElem("a", "file__name");
        $linkA.innerHTML = nameFile;

        const $delete = createElem("button", "file__delete");
        $offerFile.append($linkA);
        $offerFile.append($delete);
        return $offerFile;
    }
}