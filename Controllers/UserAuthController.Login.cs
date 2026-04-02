using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using WebAppAnapaDeti.AppCode;
using WebAppAnapaDeti.AppCode.Features.Mail;
using WebAppAnapaDeti.DAL.Extensions;
using WebAppAnapaDeti.Models._ViewModels.User;
using WebAppAnapaDeti.Models.Entities;

namespace WebAppAnapaDeti.Controllers;

public partial class UserAuthController
{
    #region Повторная отправка запроса для подтверждения регистрации

    [HttpPost("/user/resend-email")]
    public async Task<string> ResendEmail(string email)
    {

        Guid verificationCode = Guid.NewGuid();
        var dbUser = _appContext.GetUserByEmail(email);

        if (dbUser == null)
            return $"Пользователя с данным именем {email} не существует. " +
                   $"Проверьте правильность ввода или зарегистрируйтесь.";
            
        var idUser = dbUser.Id;

        if (!_appContext.UpdateVerificationCode(idUser, verificationCode))
            return $"Ошибка отправки почты на  Ваш e-mail - {email}";
            
        var sendTo = dbUser.Email;

        string subscription = $"{_sm.GetCurrentUrl()}/confirm-email?code={verificationCode}";
        var subject = "Повторное подтверждение регистрации";
        var body = "Уважаемый пользователь," + "<br/>" + "<br/>" +
                   "Вам необходимо подтвердить данные Вашего почтового ящика" + "<br/>" + "<br/>" +
                   "для подтверждения - перейдите по ссылке - <a href=\'" + subscription +
                   "'>Подтвердить e-mail</a>. <br/>"
                   + "<br/>" + "<i>" + "С уважением, анапа.дети" + "</i>";
        await _mediator.Send(new SendMailCommand(sendTo, subject, body));
        return $"Письмо подтверждения отправлено повторно на Ваш e-mail - {sendTo}";
    }
    #endregion

    #region Отправка запроса - напоминаем пароль
    [HttpGet("/user/pass-resend")]
    public async Task<ActionResult<string>> ResendPassword(string email)
    {
        Guid verificationCode = Guid.NewGuid();

        var dbUser = _appContext.Query<User>()
            .AsNoTracking()
            .Where(u => u.Email == email)
            .Select(u => new
            {
                u.Id,
                u.VerificationCode,
                u.Email
            })
            .FirstOrDefault();
        
        if (dbUser == null)
            return $"Пользователя с данным именем (логином) {email} не существует. Проверьте правильность ввода или зарегистрируйтесь.";
            
        if (!_appContext.UpdateVerificationCode(dbUser.Id, verificationCode))
            return $"Ошибка отправки почты на  Ваш e-mail - {email}";
            
        string sendTo = dbUser.Email;
        string subscription = $"{_sm.GetCurrentUrl()}/repassword?token={verificationCode}";
        string subject = "Восстановление доступа";
        string body = "Уважаемый пользователь," + "<br/>" + "<br/>" +
                      "Для восстановления доступа - перейдите по ссылке - " + "<a href=\'" + subscription +
                      "'>Восстановить пароль</a>." + "<br/>"
                      + "<br/>" + "<i>" + "С уважением, анапа.дети" + "</i>"
                      + "<br/>" + "<br/>" +
                      "Если это письмо пришло Вам ошибочно - просто проигнорируйте его";
        await _mediator.Send(new SendMailCommand(sendTo, subject, body));
        return "Для восстановления доступа - перейдите по ссылке в письме, отправленном на Ваш e-mail - " +
               sendTo;
    }
    #endregion

    #region Задать новый пароль получение письма с токеном
    [HttpGet("/repassword")]
    public IActionResult ResetPassword(string token)
    {
        if (string.IsNullOrEmpty(token))
            return RedirectToAction("Index", "Home");

        var user = _appContext.GetUserByToken(token);
        if (user == null)
            return RedirectToAction("Index", "Home");

        ViewBag.ContactName = user.ContactName;
        if (!string.IsNullOrEmpty(HttpContext.Session.GetString("client")))
            _ = JsonSerializer.Deserialize<UserViewModel>(HttpContext.Session.GetString("client"));
        else
            HttpContext.Session.SetString("client", JsonSerializer.Serialize(user));

        return View();
    }

    [HttpPost("/repassword")]
    public string ResetPassword(string? token, string passwd)
    {
        if (string.IsNullOrEmpty(token))
            return C.TextError;

        var user = _appContext.GetUserByToken(token);
        Guid verificationCode = Guid.NewGuid();
        return _appContext.UpdateUserResetPassword(user.Id, verificationCode, SecurityHelper.Encryption(passwd))
            ? C.TextOk 
            : C.TextError;
    }
    #endregion
}