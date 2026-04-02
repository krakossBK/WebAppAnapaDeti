'use strict';

//  ✅ 2025  krakoss
// class main-js => указывает только на те elements которые обрабатывает данный код 

/* Helpers */
function createElem(type, className, options) {
    const $elem = document.createElement(type);
    $elem.className = className;
    for (let key in options) {
        $elem[key] = options[key];
    }

    return $elem;
}

/* Validate patterns */
const validatePatterns = [
    {
        name: "empty",
        defaultMessage: "Поле не может быть пустым",
        validate: (value) => {
            if (value.length < 1) {
                return false;
            }

            return true;
        },
    },
    {
        name: "phone",
        defaultMessage: "Некорректный номер телефона",
        validate: (value) => {
            if (!/(?:\+|\d)[\d\-\(\) ]{16,}\d/g.test(value)) {
                return false;
            }

            return true;
        },
    },
    {
        name: "phone-optional",
        defaultMessage: "Некорректный номер телефона",
        validate: (value) => {
            if (value === "") {
                return true;
            }

            if (!/(?:\+|\d)[\d\-\(\) ]{16,}\d/g.test(value)) {
                return false;
            }

            return true;
        },
    },
    {
        name: "email",
        defaultMessage: "Некорректный email",
        validate: (value) => {
            return String(value)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        },
    },
    {
        name: "password",
        defaultMessage: "Некорректный пароль",
        validate: (value) => {
            if (value.length < 6 || value.length > 24) {
                return false;
            }

            const hasDigit = /\d/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(value);
            const hasLatinLetter = /[a-zA-Z]/.test(value);

            if (!hasDigit || !hasSpecialChar || !hasLatinLetter) {
                return false;
            }

            return true;
        },
    },
    {
        name: "password-length",
        defaultMessage: "Некорректный пароль",
        validate: (value) => {
            if (value.length < 6 || value.length > 24) {
                return false;
            }

            return true;
        },
    },
    {
        name: "code",
        defaultMessage: "Неверный код",
        validate: (value) => {
            if (value.length < 6 || value.length > 6) {
                return false;
            }

            return true;
        },
    },
];

/* Form */
const $forms = document.querySelectorAll(".js-form");
$forms.forEach(($form) => {
    $form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validateFields($form)) {
        }
        else {
            // const formData = new FormData($form);
            // for (var pair of formData.entries()) {
            //   log(pair[0] + ", " + pair[1]);
            // }

            const successFormEvent = new CustomEvent("formSuccess", {
                detail: {
                    form: $form,
                },
            });
            document.dispatchEvent(successFormEvent);

            if ($form.dataset.formNoClear === undefined) {
                clearInputs($inputs);

                const $selects = $form.querySelectorAll(".select");
                clearSelects($selects);

                const $submit = $form.querySelector(".js-form-submit");
                if ($submit && $submit.dataset.disableEmpty !== undefined) {
                    $submit.disabled = true;
                }
            }
        }
    });

    const $inputs = $form.querySelectorAll(".input");
    $inputs.forEach(($input) => formInputHandler($input, $form));

    const $simpleSelects = $form.querySelectorAll(".simple-select");
    $simpleSelects.forEach(($simpleSelect) => formSimpleSelectHandler($simpleSelect, $form));

    /* Form steps */
    const $steps = $form.querySelectorAll(".form__step");
    const $stepsRoutes = $form.querySelectorAll(".form__steps-route");
    let stepValue = 0;
    let stepsLength = $stepsRoutes.length;
    const $stepsNextBtns = $form.querySelectorAll(".form__steps-btn--next");
    $stepsNextBtns.forEach(($btn) => {
        $btn.addEventListener("click", () => {
            if (stepValue >= stepsLength - 1) {
                return;
            }

            if (!validateFields($steps[stepValue])) {
                return;
            }

            stepValue++;

            const $activeRoute = $form.querySelector(".form__steps-route--active");
            $activeRoute.classList.remove("form__steps-route--active");

            const $activeStep = $form.querySelector(".form__step--active");
            $activeStep.classList.remove("form__step--active");

            $steps[stepValue].classList.add("form__step--active");

            $stepsRoutes[stepValue].classList.add("form__steps-route--active");

            const $formText = $form.querySelector(".form__text");
            if ($formText) {
                if (stepValue === 1) {
                    $formText.textContent = "Заполните данные организации";
                } else if (stepValue === 0) {
                    $formText.textContent = "Добро пожаловать! Заполните свои данные";
                }
            }
        });
    });

    const $stepsPrevBtns = $form.querySelectorAll(".form__steps-btn--prev");
    $stepsPrevBtns.forEach(($btn) => {
        $btn.addEventListener("click", () => {
            if (stepValue <= 0) {
                return;
            }

            stepValue--;

            const $activeRoute = $form.querySelector(".form__steps-route--active");
            $activeRoute.classList.remove("form__steps-route--active");

            const $activeStep = $form.querySelector(".form__step--active");
            $activeStep.classList.remove("form__step--active");

            $steps[stepValue].classList.add("form__step--active");

            $stepsRoutes[stepValue].classList.add("form__steps-route--active");

            const $formText = $form.querySelector(".form__text");
            if ($formText) {
                if (stepValue === 1) {
                    $formText.textContent = "Заполните данные организации";
                } else if (stepValue === 0) {
                    $formText.textContent = "Добро пожаловать! Заполните свои данные";
                }
            }
        });
    });
});

function validateFields($form) {
    let isError = false;

    const $passwordsMatch = $form.querySelector(".js-passwords-match");
    if ($passwordsMatch) {
        const $passwordFirst = $passwordsMatch.querySelectorAll(".input")[0];
        const $passwordSecond = $passwordsMatch.querySelectorAll(".input")[1];
        const $passwordFirstField = $passwordFirst.querySelector(".input__field");
        const $passwordSecondField = $passwordSecond.querySelector(".input__field");
        if ($passwordFirstField.value !== $passwordSecondField.value) {
            const $passwordSecondError = $passwordSecond.querySelector(`.input__error`);
            $passwordSecondError.innerText = "Пароли должны совпадать";
            $passwordSecond.classList.add("input--error");
            isError = true;
        }
    }

    const $inputs = $form.querySelectorAll(".input");
    $inputs.forEach(($input, i) => {
        let isValidated = true;
        if (
            !validateItem({
                $item: $input,
                itemErrorClass: "input--error",
                fieldClass: "input__field",
                fieldFileClass: "input__field-file",
                errorLabelClass: "input__error",
            })
        ) {
            isError = true;
            isValidated = false;
        }

        const $field = $input.querySelector(".input__field");
        const isNeedConfirm = isValidated && $input.classList.contains("input--confirm") && !$input.classList.contains("input--confirmed");
        if ($field && $field.value !== "" && isNeedConfirm) {
            $input.classList.add("input--error");

            const $error = $input.querySelector(".input__error");
            if ($error) {
                $error.innerText = $input.dataset.confirmErrorText;
            }

            isError = true;
        }
    });

    const $selects = $form.querySelectorAll(".select");
    $selects.forEach(($select) => {
        if (
            !validateItem({
                $item: $select,
                itemErrorClass: "select--error",
                fieldClass: "select__field",
                errorLabelClass: "select__error",
            })
        ) {
            isError = true;
        }
    });

    return !isError;
}
function validateItem({ $item, itemErrorClass, fieldClass, fieldFileClass, errorLabelClass }) {
    const $field = $item.querySelector(`.${fieldClass}`) || $item.querySelector(`.${fieldFileClass}`);

    if (!$field) {
        return true;
    }

    const $error = $item.querySelector(`.${errorLabelClass}`);
    const validateType = $field.dataset.validate;

    if ($field.disabled) {
        return true;
    }

    const pattern = validatePatterns.find((pattern) => pattern.name === validateType);
    if (validateType && !pattern.validate($field.value)) {
        $item.classList.add(itemErrorClass);

        if ($error) {
            $error.innerText = $field.dataset.validateText || pattern.defaultMessage;
        }

        return false;
    }

    return true;
}
function getScrollbarWidth() {
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
}
function lockBody(lockBy = "") {
    const scrollbarWidthPX = `${getScrollbarWidth()}px`;

    document.body.classList.add("body--lock");
    document.body.style.paddingRight = scrollbarWidthPX;
    document.body.dataset.lockedBy = lockBy;

    const $absoluteElems = document.querySelectorAll(".lk__fixed-btn-box, .header");
    $absoluteElems.forEach(($elem) => ($elem.style.paddingRight = scrollbarWidthPX));
}

function unlockBody() {
    document.body.classList.remove("body--lock");
    document.body.style.paddingRight = "";
    document.body.removeAttribute("data-locked-by");

    const $absoluteElems = document.querySelectorAll(".lk__fixed-btn-box, .header");
    $absoluteElems.forEach(($elem) => ($elem.style.paddingRight = ""));
}

function isLockedBody() {
    return document.body.classList.contains("body--lock");
}

function getLockedBodyBy() {
    return document.body.dataset.lockedBy;
}


function formInputHandler($input, $form) {
    const $field = $input.querySelector(".input__field");


    $field?.addEventListener("click", () => {
        log(`isSafari -> ${isSafari}`);
        $input.classList.remove("input--error");
    });

    $field?.addEventListener("focus", () => {
        log(`isSafari -> ${isSafari}`);
        $input.classList.remove("input--error");
        const $passwordsMatch = $input.closest(".js-passwords-match");
        if (!$passwordsMatch) {
            return;
        }

        const $passwordSecond = $passwordsMatch.querySelectorAll(".input")[1];
        const $passwordSecondError = $passwordSecond.querySelector(`.input__error`);
        if ($passwordSecondError.innerText === "Пароли должны совпадать") {
            $passwordSecond.classList.remove("input--error");
        }
    });

    $field?.addEventListener("input", () => {
        if ($input.classList.contains("select__input")) {
            return;
        }

        const validateType = $field.dataset.validate;
        const pattern = validatePatterns.find((pattern) => pattern.name === validateType);
        if (validateType && pattern.validate($field.value)) {
            $input.classList.add("input--validated");
        } else if (validateType) {
            $input.classList.remove("input--validated");
        }

        const $submit = $form.querySelector(".js-form-submit");
        if ($submit?.dataset.disableEmpty !== undefined) {
            submitDisableHandler($form);
        }

        setTimeout(() => {
            if ($input.dataset.confirmedValue === $field.value) {
                $input.classList.add("input--confirmed");
            } else {
                $input.classList.remove("input--confirmed");
            }
        });
    });

    const $fieldFile = $input.querySelector(".input__field-file");
    const $btnFile = $input.querySelector(".input__file .file-input__btn");
    const $btnDeleteFile = $input.querySelector(".input__file .file-input__info-delete");
    $btnFile?.addEventListener("click", () => $input.classList.remove("input--error"));
    $btnDeleteFile?.addEventListener("click", () => $input.classList.remove("input--error"));
    $fieldFile?.addEventListener("change", () => {
        const $submit = $form.querySelector(".js-form-submit");
        if ($submit?.dataset.disableEmpty !== undefined) {
            submitDisableHandler($form);
        }
    });
}
const $eyeBtns = document.querySelectorAll(".input__eye-btn");
$eyeBtns.forEach(($eyeBtn) => {
    $eyeBtn.addEventListener("click", () => {
        $eyeBtn.classList.toggle("input__eye-btn--active");

        const $field = $eyeBtn.closest(".input").querySelector(".input__field");
        const type = $field.getAttribute("type") === "password" ? "text" : "password";
        $field.setAttribute("type", type);
    });
});