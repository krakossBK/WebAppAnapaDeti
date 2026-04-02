using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using WebAppAnapaDeti.AppCode;
using WebAppAnapaDeti.AppCode.Features.Mail;
using WebAppAnapaDeti.AppCode.Temp;
using WebAppAnapaDeti.DAL;
using WebAppAnapaDeti.DAL.Extensions;
using WebAppAnapaDeti.Models.Entities;

namespace WebAppAnapaDeti.Controllers;

[AllowAnonymous, EmptyViewBag]
public partial class UserAuthController(
    SM sm,
    IMediator mediator,
    UserHelper userHelper,
    ILogger<UserAuthController> logger,
    IAppDbContext appContext) : Controller
{
    private readonly SM _sm = sm;
    private readonly IMediator _mediator = mediator;
    private readonly UserHelper _userHelper = userHelper;
    private readonly ILogger _logger = logger;
    private readonly IAppDbContext _appContext = appContext;

    #region Проверка нового ЮЗЕРА на уникальность по e-mail

    /// <summary> Unique Email </summary>
    [HttpPost("unique-email")]
    public string UniqueEmail(string newEmail) =>
        _appContext.IsUserEmailUnique(newEmail, false) == false
        ? C.TextError
        : C.TextOk;

    #endregion

    #region Проверка нового UnregisteredUsers на уникальность по e-mail

    [HttpGet]
    public string UniqueUnregisteredUsers(string email)
    {
        /*  проверяем существование пользователя в базе данных с только что введенным e-mail
          если такого пользователя нет то ничего не делаем
          если есть то сообщаем пользователю об этом
          блокируем внесение данных ...
      */
        return _appContext.Query<User>().Any(a => a.Email == email)
            ? "true"
            : "false";
    }

    #endregion


    [HttpGet("/help")]
    public IActionResult Help()
    {
        //var viewModel = new UserHelpViewModel
        //{
        //    HelpSections = [.. _appContext.GetHelpSections().OrderBy(o => o.Sort)]
        //};

        //var helpTextsAll = _appContext.GetHelpTexts();
        //foreach (var helpSection in viewModel.HelpSections)
        //{
        //    helpSection.HelpTexts = [.. helpTextsAll.Where(_ => _.HelpSectionId == helpSection.Id)];
        //}

        //ViewBag.L.HideHead = true;
        return View(/*viewModel*/);
    }

    [HttpGet]
    public IActionResult Feedback()
    {
        //var viewModel = new UserFeedbackViewModel()
        //{
        //    CurrentUserId = _sm.CurrentUserId
        //};

        return View(/*viewModel*/);
    }

    [HttpGet]
    public string GetMediaType(string file)
    {
        string fileExt = Path.GetExtension(file).ToLower().Replace(".", "");
        return fileExt switch
        {
            "pdf" => MediaTypeNames.Application.Pdf,
            "rtf" => MediaTypeNames.Application.Rtf,
            "zip" => MediaTypeNames.Application.Zip,
            "gif" => MediaTypeNames.Image.Gif,
            "jpeg" => MediaTypeNames.Image.Jpeg,
            "jpg" => MediaTypeNames.Image.Jpeg,
            "tiff" => MediaTypeNames.Image.Tiff,
            "png" => "image/png",
            _ => MediaTypeNames.Application.Octet,
        };
    }

    [HttpPost]
    public async Task<string> FeedbackSave(string text, string name, string email)
    {
        var currentUser = _sm.CurrentUser;

        if (currentUser != null) //если пользователь зарегистрирован
        {
            //#region отправляем сообщение пользователю "Техническая поддержка"

            //var roomId = _roumsHelper.NewRoomId(currentUser.Id, C.SupportUserId, C.MessageAdIdMNullValue);
            //var message = new Message
            //{
            //    SenderId = currentUser.Id,
            //    RecipientId = C.SupportUserId,
            //    Text = text,
            //    RoomId = roomId
            //};
            //await _userHelper.AddMessage(message, false);

            //// wtf????
            //if (Request is { Form.Files.Count: > 0 }) //если пользователь прикрепил файл
            //{
            //    throw new NotImplementedException();
            //    //отправляем файл также сообщением пользователю "Техническая поддержка"
            //    // var filesController = new FilesController() { ControllerContext = ControllerContext };
            //    // var boolRead = false; // статус - Не прочитано - так как это отправка файла в адрес тЕхподдЕржки
            //    // filesController.UploadFiles(C.SupportUserId, adidm, boolRead);
            //}

            //#endregion

            /* */

            #region отправка письма на почту тех. поддержке

            //20220411 krakoss Тема: поступило обращение от Авторизованного пользователя Внутри: название Организации, имя представителя, номер телефона                
            text =
                $"Сообщение от {currentUser.ContactName} <br/>{text}";
            var attachments = new List<MailFile>();
            if (Request != null && Request.Form.Files != null &&
                Request.Form.Files.Count > 0) //если пользователь прикрепил файл
            {
                for (int i = 0; i < Request.Form.Files.Count; i++)
                {
                    var file = Request.Form.Files[i];
                    var mediaType = GetMediaType(file.FileName);
                    var attachment = await MailFile.From(file.FileName, file.OpenReadStream(), mediaType);
                    attachments.Add(attachment);
                }
            }

            try
            {
                await _mediator.Send(new SendMailCommand(C.SupportEmail, "Поступило обращение от Авторизованного пользователя", text) { Attachments = attachments });
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

            #endregion
        }
        else //пользователь не зарегистрирован
        {
            #region отправка письма на почту тех. поддержке

            text = $"Сообщение от неавторизованного пользователя {name} (email: {email}):<br/>{text}";

            var attachments = new List<MailFile>();
            if (Request != null && Request.Form.Files != null &&
                Request.Form.Files.Count > 0) //если пользователь прикрепил файл
            {
                for (int i = 0; i < Request.Form.Files.Count; i++)
                {
                    var file = Request.Form.Files[i];
                    var mediaType = GetMediaType(file.FileName);
                    var attachment = await MailFile.From(file.FileName, file.OpenReadStream(), mediaType);
                    attachments.Add(attachment);
                }
            }

            try
            {
                await _mediator.Send(new SendMailCommand(C.SupportEmail, "Поступило обращение от Неавторизованного пользователя", text) { Attachments = attachments });
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

            #endregion
        }

        return C.TextOk;
    }

}