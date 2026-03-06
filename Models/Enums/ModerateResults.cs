namespace WebAppAnapaDeti.Models.Enums
{
    /// <summary>
    /// Результат модерации
    /// </summary>
    public enum ModerateResults
	{
		/// <summary>
		/// Не проверено
		/// </summary>
		NotChecked = 0,
		/// <summary>
		/// Принято
		/// </summary>
		Accepted = 1,
		/// <summary>
		/// Отклонено
		/// </summary>
		Declined = 2,
		/// <summary>
		/// Не соответствует закону
		/// </summary>
		Unduly = 3
	}
}