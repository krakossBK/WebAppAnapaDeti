using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAppAnapaDeti.AppCode;
using WebAppAnapaDeti.AppCode.Features.LogSites;
using WebAppAnapaDeti.AppCode.Features.Mail;
using WebAppAnapaDeti.DAL.Extensions;
using WebAppAnapaDeti.Models._ViewModels;
using WebAppAnapaDeti.Models._ViewModels.User;
using WebAppAnapaDeti.Models.Entities;
using WebAppAnapaDeti.Models.Enums;

namespace WebAppAnapaDeti.Controllers;

[Authorize]
public partial class UserController
{
    #region LOGIN Вход в систему

    [HttpGet(C.LoginUrl)]
    [AllowAnonymous]
    public IActionResult Login()
    {
        //ViewBag.L.HideHead = true; // так же надо будет настроить и Footer
        //ViewBag.L.HideFooter = true;
        var viewModel = new UserLoginViewModel()
        {
            Email = "",
            ErrorMessage = ""
        };
        ViewBag.Heading = "Вход";
        return View(viewModel);
    }

    //[AllowAnonymous]
    //[HttpPost(C.LoginUrl)]
    //public async Task<string> Login(string email, string password)
    //{
    //    ViewBag.L.HideHead = true; // так же надо будет настроить и Footer
    //    ViewBag.L.HideFooter = true;
    //    ViewBag.Heading = "Вход";

    //    if (string.IsNullOrEmpty(email))
    //        return "Некорректный email";
    //    if (string.IsNullOrEmpty(password))
    //        return "Некорректный пароль";
    //    if (email == null)
    //        return "Вы не указали емайл";
    //    if (password == null)
    //        return "Вы не указали пароль";

    //    // поверка на то что Юзер не числиться в удаленных
    //    var userLogin = _appContext.GetUserByEmailLogin(email);
    //    if (userLogin != null
    //        && userLogin.Deleted)
    //    {
    //        _logger.LogInformation("user.Id => {userLogin.Id}", userLogin.Id);
    //        _logger.LogInformation("user.Deleted => {userLogin.Deleted}", userLogin.Deleted);
    //        return $"User deleted";
    //    }

    //    // поверка на то что Юзер не числиться вообще
    //    var user = _appContext.GetUserByEmail(email);
    //    if (user == null)
    //        return $"User is not registered";

    //    if (user.Password != SecurityHelper.Encryption(password))
    //        return "Неверный пароль";

    //    if (!user.EmailConfirmed
    //        && user.ModerateResult == ModerateResults.Accepted)
    //        return $"get confirmation email again";

    //    if (user.ModerateResult != ModerateResults.Accepted)
    //        return "Пользователь на модерации";

    //    _sm.CurrentUser = user.Adapt<UserViewModel>();
    //    _sm.LoginTime = DateTime.Now;
    //    await Auth(user);
    //    SaveCookiesForSIWAuthToken(user.ShowInformationWindow);
    //    // после входа на сайт 
    //    // создать список всех Id полученные сообщения со статусом == отправлено sent = 0 
    //    List<int> sentMessageIds = [.. _appContext.GetMessagesOfMessageStatus(user.Id, (int)MessageStatuses.sent)
    //        .Select(m => m.Id)];
    //    if (sentMessageIds.Count != 0)
    //        _appContext.UpdateMessageStatus(sentMessageIds,
    //            (int)MessageStatuses
    //                .delivered); // обновить все полученные сообщения на статус = ДОСТАВЕНО delivered = 1
    //    return C.TextOk;
    //}

    ///// <summary>
    ///// Выполняет все необходимые действия для события успешного входа на сайт
    ///// </summary>
    //public async Task<IActionResult> LoginSuccuess(User user)
    //{
    //    _sm.CurrentUser = user.Adapt<UserViewModel>();
    //    _sm.LoginTime = DateTime.Now;
    //    await Auth(user);
    //    SaveCookiesForSIWAuthToken(user.ShowInformationWindow);
    //    // после входа на сайт 
    //    // создать список всех Id полученные сообщения со статусом == отправлено sent = 0 
    //    List<int> sentMessageIds = [.. _appContext.GetMessagesOfMessageStatus(user.Id, (int)MessageStatuses.sent).Select(m => m.Id)];
    //    if (sentMessageIds.Count != 0)
    //        _appContext.UpdateMessageStatus(sentMessageIds,
    //            (int)MessageStatuses
    //                .delivered); // обновить все полученные сообщения на статус = ДОСТАВЕНО delivered = 1

    //    return RedirectToAction("MyProfile", "User");
    //}

    //public void SaveCookiesForSIWAuthToken(bool showInformationWindow)
    //{
    //    HttpContext.Response.Cookies.Delete("siw");
    //    string _showInformationWindow = showInformationWindow ? "false" : "true";
    //    HttpContext.Session.SetString("siw", _showInformationWindow);


    //    HttpContext.Response.Cookies.Delete("AuthToken");
    //    string guid = Guid.NewGuid().ToString();
    //    HttpContext.Session.SetString("AuthToken", guid);

    //    // now create a new cookie with this guid value
    //    Response.SaveCookiesAuthToken(guid, _showInformationWindow);
    //}

    //[HttpPost("/logout")]
    //public IActionResult Logout()
    //{
    //    LogoutInternal();

    //    return Ok(C.TextOk);
    //}

    #endregion

    #region 2025 krakoss Подтверждение входа переходом по ссылке из письма

    /// <summary>
    /// Подтверждение входа переходом по ссылке из письма 
    /// </summary>
    /// <param name="code">code</param>
    /// <returns></returns>
    [HttpGet(C.ConfirmEmailUrl)]
    [AllowAnonymous]
    public async Task<IActionResult> LoginConfirmByLinkFromEmail(string code)
    {
        await Task.CompletedTask;
        //ViewBag.L.HideHead = true;
        //ViewBag.L.HideFooter = true;
        UserLoginConfirmByLinkFromEmailViewModel viewModel = new()
        {
            ErrorMessage = "Общая ошибка сайта. Админ уже работает над её устранением."
        };
        bool isValid = Guid.TryParse(code, out _);
        if (!isValid)
            return View(viewModel.ErrorMessage = "Передан неверный токен");

        var user = _appContext.GetUserByToken(code);
        if (user == null)
            return View(viewModel.ErrorMessage = "Не найден пользователь");

        if (!user.EmailConfirmed)
        {
            _appContext.UpdateUserEmailConfirmed(user.Id, true, true); // запишем в БД данные о событии успешного подтверждения Email адреса и включим подписку на емайл
            _appContext.UpdateUserModerateResult(user.Id, (int)ModerateResults.Accepted); // запишем в БД новый статус у Usera           
            _appContext.UpdateVerificationCode(user.Id, Guid.NewGuid()); // запишем в БД новый VerificationCode у Usera 
        }

        /* Запишем в БД данные о событии успешной авторизации через переход по ссылке в письме
        AddUserLoginEvent(user.Id);
        */


        //if (user.Id != C.SupportUserId)
        //{
        //    // После того как новый пользователь зарегистрировался - автоматически отправить ему уведомление в чат от пользователя Тех. Поддержка
        //    // 20230515 После того как новый пользователь зарегистрировался - автоматически отправить ему уведомление в чат от пользователя Тех. Поддержка со следующим текстом:
        //    // Хорошо, что Вы теперь с нами.Если нужна помощь, обращайтесь
        //    var roomId = _roumsHelper.NewRoomId(C.SupportUserId, user.Id, C.MessageAdIdMNullValue);
        //    var message = new Message
        //    {
        //        SenderId = C.SupportUserId,
        //        RecipientId = user.Id,
        //        Text = C.WelcomeText,
        //        TextHtml = C.WelcomeText,
        //        IsRead = false,
        //        RoomId = roomId
        //    };
        //    await _userHelper.AddMessage(message);
        //}


        //выполняет все необходимые действия для события успешного входа на сайт
        /*
        return await LoginSuccuess(user);
        */
        return Signup();
    }

    #endregion

    //#region Подтверждение входа переходом по ссылке из письма при использовании нового браузера

    ///// <summary>
    ///// Подтверждение входа переходом по ссылке из письма при использовании нового браузера 
    ///// </summary>
    ///// <param name="token">6 цифр</param>
    ///// <returns></returns>
    //[HttpGet("/user/login-event")]
    //[AllowAnonymous]
    //public async Task<IActionResult> LoginConfirmByLoginEvent(string code)
    //{
    //    ViewBag.L.HideHead = true;
    //    ViewBag.L.HideFooter = true;
    //    ViewBag.Title = "Подтверждение входа";

    //    var viewModel = new UserLoginConfirmByLinkFromEmailViewModel();

    //    if (string.IsNullOrEmpty(code))
    //        return View(viewModel.ErrorMessage = "Передан неверный токен");

    //    var user = _appContext.GetUserByToken(code);

    //    if (user == null)
    //        return View(viewModel.ErrorMessage = "Не найден пользователь");

    //    if (!user.EmailConfirmed)
    //        _appContext.UpdateUserEmailConfirmed(user.Id, true, true); // запишем в БД данные о событии успешного подтверждения Email адреса и включим подписку на емайл 

    //    AddUserLoginEvent(user.Id);

    //    //выполняет все необходимые действия для события успешного входа на сайт
    //    return await LoginSuccuess(user);
    //}

    //#endregion

    //#region Запишем в БД данные о событии успешной авторизации через переход по ссылке в письме

    //public void AddUserLoginEvent(int id)
    //{
    //    var userLoginEvent = new UserLoginEvent()
    //    {
    //        UserId = id,
    //        IP = HttpContext.Connection.RemoteIpAddress?.ToString() ??
    //             HttpContext.Connection.LocalIpAddress?.ToString(),
    //        BrowserName = Request.Headers[HeaderNames.UserAgent],
    //        Created = DateTime.Now.ToUniversalTime()
    //    };

    //    _appContext.AddUserLoginEvent(userLoginEvent);
    //}

    //#endregion

    //#region 2025 krakoss Отправка запроса для подтверждения входа с Кодом из 6 цифр /user/resend-email
    //[HttpGet("/user/resend-email")]
    //public async Task<string> SendConfirmLinkToEmail(string email)
    //{
    //    string verificationCode = Convert.ToString(Guid.NewGuid());
    //    var dbUser = _appContext.GetUserByEmail(email);
    //    if (dbUser == null)
    //        return "Пользователя с данным именем " + email +
    //               " не существует. Проверьте правильность ввода или зарегистрируйтесь.";
    //    else
    //    {
    //        if (!_appContext.UpdateVerificationCode(dbUser.Id, verificationCode))
    //            return "Ошибка отправки почты на  Ваш e-mail - " + email;
    //        else
    //        {
    //            try
    //            {
    //                string sendTo = dbUser.Email;

    //                #region Отправка письма

    //                string confirmLoginLink =
    //                    $"{C.SiteUrl}confirm-browser?userId={dbUser.Id}&verificationCode={verificationCode}";
    //                string subject = "Пожалуйста подтвердите вход на сайт";
    //                string body = @"Уважаемый пользователь,<br/> <br/> " +
    //                              @"Вы получили это письмо, потому что в Ваш аккаунт была совершена попытка входа с нового устройства (либо изменился ip-адрес). <br/><br/> " +
    //                              @"В целях безопасности, подтвердите свою личность переходом по следующей ссылке - <a href=""" +
    //                              confirmLoginLink + @""">войти на сайт</a>.<br/><br/> " +
    //                              @"Если это произошло без Вашего ведома, настоятельно рекомендуем при следующей авторизации сменить пароль от аккаунта.<br/><br/> " +
    //                              @"<i>С уважением, M-Contract</i>";

    //                // отправляем письмо на адрес SupportEmail об успешной регистрации со ссылкой на профиль организации
    //                await _mediator.Send(new SendMailCommand(sendTo, subject, body));

    //                #endregion

    //                return C.TextOk;
    //            }
    //            catch (Exception ex)
    //            {
    //                return "почта не может быть доставлена" + ex.ToString();
    //            }
    //        }
    //    }
    //}
    //#endregion

    //#region 2025 krakoss Отправка запроса для подтверждения входа с Кодом из 6 цифр /user/resend-code

    //[HttpGet("/user/resend-code")]
    //public async Task<string> ResendCodeToEmail(string email)
    //{
    //    string verificationCode = Convert.ToString(Guid.NewGuid());
    //    var dbUser = _appContext.GetUserByEmail(email);
    //    if (dbUser == null)
    //        return "Пользователя с данным именем " + email +
    //               " не существует. Проверьте правильность ввода или зарегистрируйтесь.";
    //    else
    //    {
    //        if (!_appContext.UpdateVerificationCode(dbUser.Id, verificationCode))
    //            return "Ошибка отправки почты на  Ваш e-mail - " + email;
    //        else
    //        {
    //            try
    //            {
    //                string sendTo = dbUser.Email;

    //                #region Отправка письма

    //                string confirmLoginLink =
    //                    $"{C.SiteUrl}confirm-browser?userId={dbUser.Id}&verificationCode={verificationCode}";
    //                string subject = "Пожалуйста подтвердите вход на сайт";
    //                string body = @"Уважаемый пользователь,<br/> <br/> " +
    //                              @"Вы получили это письмо, потому что в Ваш аккаунт была совершена попытка входа с нового устройства (либо изменился ip-адрес). <br/><br/> " +
    //                              @"В целях безопасности, подтвердите свою личность переходом по следующей ссылке - <a href=""" +
    //                              confirmLoginLink + @""">войти на сайт</a>.<br/><br/> " +
    //                              @"Если это произошло без Вашего ведома, настоятельно рекомендуем при следующей авторизации сменить пароль от аккаунта.<br/><br/> " +
    //                              @"<i>С уважением, M-Contract</i>";

    //                // отправляем письмо на адрес SupportEmail об успешной регистрации со ссылкой на профиль организации
    //                await _mediator.Send(new SendMailCommand(sendTo, subject, body));

    //                #endregion

    //                return C.TextOk;
    //            }
    //            catch (Exception ex)
    //            {
    //                return "почта не может быть доставлена" + ex.ToString();
    //            }
    //        }
    //    }
    //}
    //#endregion

    #region Регистрация нового ЮЗЕРА

    [HttpGet(C.RegistrationUrl)]
    [AllowAnonymous]
    public IActionResult Signup()
    {
        //ViewBag.L.HideHead = true; // так же надо будет настроить и Footer
        //ViewBag.L.HideFooter = true;
        ViewBag.Heading = "Регистрация";
        return View();
    }

    [HttpPost(C.RegistrationUrl)]
    [AllowAnonymous]
    public async Task<string> Signup(User userA, CancellationToken ct)
    {
        // так же необхолимо выполнить запросы на уникальность Email нового Юзера
        if (!_appContext.IsUserEmailUnique(userA.Email.Trim(), false))
          {
            LogSiteViewModel logSiteViewModel = new()
            {
                LogTypeId = 1,
                Message = "IsUserEmailUnique - NO " + userA.Email
            };

            await _logSiteHelper.CreateLogSiteViewModel(logSiteViewModel);
            return C.TextError; 
        }

        User user = new()
        {
            Email = userA.Email.Trim(),
            Password = SecurityHelper.Encryption(userA.Password.Trim()),
            ContactName = userA.ContactName,
            UserLogoUrl = C.NoLogoImageUrl,
            GenerateSessionID = "",
            ConnectionId = "",
            Created = DateTime.UtcNow.Add(new TimeSpan(3, 0, 0)),
            LastOnline = DateTime.UtcNow.Add(new TimeSpan(3, 0, 0))
        };

        bool IsRegistered = await _userHelper.CreateUserAndSendEmail(user); // Добавление пользователя в БД в таблицу Users
        if (IsRegistered)
        {
            LogSiteViewModel logSiteViewModel = new()
            {
                LogTypeId = 1,
                Message = "IsRegistered - " + user.Email
            };

           await _logSiteHelper.CreateLogSiteViewModel(logSiteViewModel);
            // отправляем письмо на адрес SupportEmail об успешной регистрации new User
            return await SendEmailNewUser(user.Email, user.ContactName, ct)
                    ? C.TextOk
                    : C.TextError;
        }

        return C.TextError;
    }


    public async Task<bool> SendEmailNewUser(string email, string contactName, CancellationToken ct)
    {
        try
        {
            // отправляем письмо на адрес SupportEmail об успешной регистрации со ссылкой на профиль организации
            await _mediator.Send(new SendMailCommand(C.SupportEmail,
                "Новый пользователь зарегистрировался",
                $"Новый пользователь {email}, {contactName}"), ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return false;
        }
    }



    [HttpGet(C.FinishRegistrationUrl)]
    [AllowAnonymous]
    public IActionResult SignupFinish()
    {
        //ViewBag.L.HideHead = true;
        //ViewBag.L.HideFooter = true;
        ViewBag.Heading = "Регистрация";
        return View();
    }

    #endregion
}
