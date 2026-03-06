namespace WebAppAnapaDeti.Models.Enums
{
    /// <summary>
    /// Статус сообщения <br />
    /// ✅ sent = 0 сообщения со статусом ОТПРАВЛЕНО <br />
    /// ✅ delivered = 1 сообщения со статусом ДОСТАВЛЕНО <br />
    /// ✅ readed = 2 сообщения со статусом ПРОЧИТАНО
    /// </summary>
    public enum MessageStatuses
    {
        /// <summary>
        /// ✅ sent = 0 сообщения со статусом ОТПРАВЛЕНО
        /// </summary>
        sent = 0,
        /// <summary>
        /// ✅ delivered = 1сообщения со статусом ДОСТАВЛЕНО
        /// </summary>
        delivered = 1,
        /// <summary>
        /// ✅ readed = 2 сообщения со статусом ПРОЧИТАНО
        /// </summary>
        readed = 2
    }
}