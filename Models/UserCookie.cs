namespace WebAppAnapaDeti.Models
{
    public class UserCookie
    {
        /// <summary>
        /// емайл пользователя <br />
        /// используется для входа в систему
        /// </summary>
        public required string Email { get; set; }
        /// <summary>
        /// хеш пароля пользователя <br />
        /// используется для входа в систему
        /// </summary>
        public required string HashPassword { get; set; }
        /// <summary>
        /// AuthToken пользователя  var _authToken = getCookie("AuthToken");<br />
        /// используется для проверки на отображение PUSH
        /// </summary>
        public string? AuthToken { get; internal set; }
    }
}