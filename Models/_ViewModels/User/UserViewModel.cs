using System.ComponentModel.DataAnnotations;
using WebAppAnapaDeti.Models.Enums;

namespace WebAppAnapaDeti.Models._ViewModels.User;

public class UserViewModel
{
    /// <summary>
    /// Id записи ЮЗЕРА
    /// </summary>
    public Guid Id { get; set; }
    public required string Password { get; set; }
    /// <summary>
    /// Произвольное Имя пользователя
    /// </summary>
    public required string ContactName { get; set; }
    /// <summary>
    /// емайл пользователя
    /// </summary>
    [Required(AllowEmptyStrings = false, ErrorMessage = @"Пожалуйста введите адрес электронной почты (e-mail)")]
    [RegularExpression(@"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}", ErrorMessage = "Некорректный адрес электронной почты (e-mail)")]
    [StringLength(50, ErrorMessage = @"Email должен быть меньше 50-ти символов")]
    public required string Email { get; set; }
    public List<Entities.User>? Companions { get; set; }
    public DateTime Created { get; set; }
    public bool EmailConfirmed { get; set; }
    public DateTime? SubscribeUntilDate { get; set; }
    public bool Deleted { get; set; }
    public ModerateResults ModerateResult { get; set; }
    /// <summary>
    /// True or False => закрытый профиль
    /// </summary>
    public bool CloseProfile { get; set; }
    /// <summary>
    /// Дата и время, когда пользователь был на сайте
    /// </summary>
    public DateTime LastOnline { get; set; }
    /// <summary>
    /// для подтверждения e-mail нового пользователя
    /// </summary>
    public Guid VerificationCode { get; set; }
    /// <summary>
    /// логотип пользователя
    /// </summary>
    public required string UserLogoUrl { get; set; }
    /// <summary>
    /// Cookies["ASP.NET_SessionId"].Value пользователя
    /// </summary>
    public required string GenerateSessionID { get; set; }
    /// <summary>
    /// время входа нас сайт Пользователя
    /// для контроля времени работы на сайте
    /// </summary>
    public DateTime LastOnlineDate { get; set; }
    /// <summary>
    /// Дата и время, когда пользователь загрузил для 
    /// проверки новый файл логотипа
    /// </summary>
    public DateTime? UserLogoDate { get; set; }
    /// <summary>
    /// факт подтверждения логотипа пользователя
    /// </summary>
    public ModerateResults ModerateResultLogo { get; set; }
    /// <summary>
    /// Каждый клиент, подключающийся к концентратору, передает уникальный идентификатор соединения.  <br />
    /// Это значение можно получить в Context.ConnectionId свойстве контекста концентратора.
    /// </summary>
    public required string ConnectionId { get; set; }
    /// <summary>
    /// True or False =>  Разрешены ли Push уведомления <br />
    /// для подписки на пуш уведомления 
    /// </summary>
    public bool PushProfile { get; set; }
    /// <summary>
    /// True or False => закрытый профиль для отправки сообщений на емайл
    /// </summary>
    public bool EmailAlert { get; set; }
}
