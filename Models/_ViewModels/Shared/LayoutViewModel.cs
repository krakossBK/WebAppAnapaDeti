using WebAppAnapaDeti.AppCode;


namespace WebAppAnapaDeti.Models._ViewModels.Shared;

public class LayoutViewModel()
{
    public required string CurrentUserId { get; set; }
    public required string CurrentUserContactName { get; set; }
    public required string Message { get; set; }
    public required string MessageColor { get; set; }
    public required bool ShowSearchbar { get; set; }
    /// <summary>
    /// Получает количество Заключенных Контрактов
    /// </summary>
    public int UnreadDealsHistoryCount { get; private set; }
    /// <summary>
    /// Получает количество Непрочитанных Сообщений
    /// </summary>
    public int MessageUnReadCount { get; private set; }
    public int? ChatBoxLastMessageId { get; set; }
    /// <summary>
    /// Является ли текущий пользователь технической поддержкой?
    /// </summary>
    public bool CurrentUserIsSupport { get; set; }
    public string CurrentUserIsSupportStr => CurrentUserIsSupport.ToString().ToLower();

    /// <summary>
    /// Скрыть шапку (в layout.cshtml)
    /// </summary>
    public bool HideHead { get; set; }
    /// <summary>
    /// Скрыть подвал (в layout.cshtml)
    /// </summary>
    public bool HideFooter { get; set; }
    /// <summary>
    /// Скрыть LeftMenu (в layout.cshtml)
    /// </summary>
    public bool HideLeftMenu { get; set; }
    /// <summary>
    /// Скрыть 
    /// document.querySelector('.main__full-section').classList.remove('lk');
    /// </summary>
    public bool HideClassLK { get; set; }

    public static LayoutViewModel GetLayoutViewModel(SM sm)
    {

        if (!string.IsNullOrEmpty(sm.CurrentUserId))
        {
            var result = new LayoutViewModel()
            {
                CurrentUserId = sm.CurrentUserId,
                CurrentUserContactName = sm.CurrentUserContactName,
                Message = sm.Message,
                MessageColor = sm.MessageColor,
                ShowSearchbar = true
            };
            return result;
        }
        else
        {
            var result = new LayoutViewModel()
            {
                CurrentUserId = "",
                CurrentUserContactName = "",
                Message = "",
                MessageColor = "",
                ShowSearchbar = true
            };
            return result;
        }
    }
}