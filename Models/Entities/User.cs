using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebAppAnapaDeti.Models.Enums;

namespace WebAppAnapaDeti.Models.Entities;

/// <summary>
/// таблица с данными Юзеров
/// </summary>
[Table("users", Schema = "dbo")]
public class User
{
    /// <summary>
    /// Id записи ЮЗЕРА
    /// </summary>
    [Key, Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();
    [Column("password")]
    public required string Password { get; set; }
    /// <summary>
    /// Произвольное Имя пользователя
    /// </summary>
    [Column("contactname")]
    public required string ContactName { get; set; }
    /// <summary>
    /// емайл пользователя
    /// </summary>
    [Required(AllowEmptyStrings = false, ErrorMessage = @"Пожалуйста введите адрес электронной почты (e-mail)")]
    [RegularExpression(@"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}", ErrorMessage = "Некорректный адрес электронной почты (e-mail)")]
    [StringLength(50, ErrorMessage = @"Email должен быть меньше 50-ти символов")]
    [Column("email")]
    public required string Email { get; set; }

    [Column("created")]
    public DateTime Created { get; set; }
    [Column("emailconfirmed")]
    public bool EmailConfirmed { get; set; }
    [Column("subscribeuntildate")]
    public DateTime? SubscribeUntilDate { get; set; }
    [Column("deleted")]
    public bool Deleted { get; set; }
    [Column("moderateresultid")]
    public ModerateResults ModerateResult { get; set; }
    /// <summary>
    /// True or False => закрытый профиль
    /// </summary>
    [Column("closeprofile")]
    public bool CloseProfile { get; set; }
    /// <summary>
    /// Дата и время, когда пользователь был на сайте
    /// </summary>
    [Column("lastonline")]
    public DateTime LastOnline { get; set; }

    /// <summary>
    /// для подтверждения e-mail нового пользователя
    /// </summary>
    [Column("verificationcode")]
    public Guid VerificationCode { get; set; } = Guid.NewGuid();

    /// <summary>
    /// логотип пользователя
    /// </summary>
    [Column("userlogourl")]
    public required string UserLogoUrl { get; set; }

    /// <summary>
    /// Cookies["ASP.NET_SessionId"].Value пользователя
    /// </summary>
    [Column("generatesessionid")]
    public required string GenerateSessionID { get; set; }

    /// <summary>
    /// время входа нас сайт Пользователя
    /// для контроля времени работы на сайте
    /// </summary>
    [Column("lastonlinedate")]
    public DateTime LastOnlineDate { get; set; }


    /// <summary>
    /// Дата и время, когда пользователь загрузил для 
    /// проверки новый файл логотипа
    /// </summary>
    [Column("userlogodate")]
    public DateTime? UserLogoDate { get; set; }

    /// <summary>
    /// факт подтверждения логотипа пользователя
    /// </summary>
    [Column("moderateresultlogo")]
    public ModerateResults ModerateResultLogo { get; set; }

    /// <summary>
    /// Каждый клиент, подключающийся к концентратору, передает уникальный идентификатор соединения.  <br />
    /// Это значение можно получить в Context.ConnectionId свойстве контекста концентратора.
    /// </summary>
    [Column("connectionid")]
    public required string ConnectionId { get; set; }


    /// <summary>
    /// True or False =>  Разрешены ли Push уведомления <br />
    /// для подписки на пуш уведомления 
    /// </summary>
    [Column("pushprofile")]
    public bool PushProfile { get; set; }

    /// <summary>
    /// True or False => закрытый профиль для отправки сообщений на емайл
    /// </summary>
    [Column("emailalert")]
    public bool EmailAlert { get; set; }
}