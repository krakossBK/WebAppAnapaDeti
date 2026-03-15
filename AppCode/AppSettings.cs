using System.ComponentModel.DataAnnotations;
using WebAppAnapaDeti.AppCode.Features.Mail;

namespace WebAppAnapaDeti.AppCode;

public class AppSettings
{
    [Required]
    /// <summary> Id "пользователя" Техническая поддержка </summary>
    public int SupportUserId { get; set; }
    /// <summary>
    /// адрес сайта - анапа.дети
    /// </summary>
    public required string WebAddress { get; set; }
    /// <summary>
    ///  WebAddress + "/"
    /// </summary>
    public string SiteUrl => WebAddress + "/";
    [Required] 
    public required string AdminUserIds { get; set; }
    [Required]
    public required Dictionary<string, MailboxConfig> MailboxConfigs { get; set; }
}
