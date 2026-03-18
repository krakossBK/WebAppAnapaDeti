namespace WebAppAnapaDeti.Models._ViewModels.User;

public class UserLoginViewModel
{
    public required string Email { get; set; }

    public required string ErrorMessage { get; set; }

    /// <summary>
    /// Отправлен ли email пользователю со ссылкой для подтверждения входа (двухфакторная авторизация)
    /// </summary>
    public bool SendedEmailFor2FactorAuthorization { get; set; }
}