namespace WebAppAnapaDeti.Models.Enums
{
    public enum CompanionStatuses
    {
        /// <summary>
        /// Запрос отправлен
        /// </summary>
        Sent = 1,
        /// <summary>
        /// Отказано
        /// </summary>
        Denied = 2,
        /// <summary>
        /// Запрос подтвержден
        /// </summary>
        Confirmed = 3,
        /// <summary>
        /// Пользователь удалил самостоятельно клиента из списка Друзей
        /// </summary>
        IsDelete = 4
    }
}