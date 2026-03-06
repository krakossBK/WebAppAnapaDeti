namespace WebAppAnapaDeti.AppCode;

public class C /*C - Сокращение от Constants, чтобы меньше места в коде занимало и было нагляднее*/
{
  
    /// <summary>
    ///  => 10
    /// </summary>
    public static int ChatBoxMaxDialogs => 10;

    /// <summary>
    ///  => 5
    /// </summary>
    public static int ChatBoxSecondsBetweenMessagesRefresh => 5;

    /// <summary>
    /// количество записей на одну страницу ItemsPerPage => 10
    /// </summary>
    public static int ItemsPerPage => 10;

    /// <summary>
    /// количество записей на одну страницу в админ панели Объявления  ItemsAdPage => 100
    /// </summary>
    public static int ItemsAdPage => 100;

    /// <summary>
    /// количество записей на одну страницу ItemsPerpartnersPage => 12
    /// </summary>
    public static int ItemsPerpartnersPage => 10;

    /// <summary>
    /// количество записей на одну страницу ItemsPerPageAds => 16
    /// для просмотра количества объявлений на странице Ads/Index
    /// </summary>
    public static int ItemsPerPageAds => 16;

    /// <summary>
    /// количество записей на одну страницу ОКПД  => 30
    /// </summary>
    public static int ItemsOkdpPage => 30;

    /// <summary>
    /// Заявку на участие можно отправлять только по активному объявлению
    /// </summary>
    public static string RequestForJoinAdAdStatusesPublished => "Заявку для участия в процедуре можно отправить только когда статус у объявления - Активно";

    /// <summary>
    /// Это закрытое объявление. Вы уже отправили заявку для допуска к участию.<br />
    /// Ждите ответ от организатора
    /// </summary>
    public static string RequestForJoinAdAlreadySentMessage => "Это закрытое объявление. Вы уже отправили заявку для допуска к участию. Ждите ответ от организатора";

    /// <summary>
    /// Это закрытое объявление.<br />
    /// Организатор отклонил вашу заявку
    /// </summary>
    public static string RequestForJoinAdDeclinedMessage => "Это закрытое объявление. Организатор отклонил вашу заявку";

    /// <summary>
    /// (расчёт по курсу rates)
    /// </summary>
    public static string CurrenciesCalculation => "(расчёт по курсу rates)";

    /// <summary>
    /// Текст добавляемого сообщения при очистке ВСЕХ сообщений из чата <br />
    /// => "         "
    /// </summary>
    public static string MessageTextEmpty => "         ";

    /// <summary>
    /// После того как новый пользователь зарегистрировался - автоматически отправить ему уведомление в чат от пользователя Тех. Поддержка <br />
    ///  => "Хорошо, что Вы теперь с нами. Если нужна помощь, обращайтесь."
    /// </summary>
    public static string WelcomeText => "Хорошо, что Вы теперь с нами. Если нужна помощь, обращайтесь.";

    /// <summary>
    /// Ссылка на фото Удаленного пользователя
    /// </summary>
    public static string UrlIcoDeleteUser => "/ico/delete_user.svg";

    #region Данные по количеству и времени начала и количестве часов для отправки Писем на емайл Потенциальных клиентов

    /// <summary>
    /// час начала отправки писем <br />
    /// startDaySendEmail = C.MoscowDateTime; <br />
    /// C.StartHourSendEmail = startDaySendEmail.Hour; <br />
    /// то есть: <br />
    /// C.StartHourSendEmail = C.MoscowDateTime.Hour;
    /// </summary>
    public static int StartHourSendEmail { get; set; }

    /// <summary>
    /// количество отправок писем за одни сутки <br />
    ///  EmailToDay => 8 штук  <br />
    ///  то есть не более 8 => значит всего 7 штук
    /// </summary>
    public static int EmailToDay => 8;

    /// <summary>
    /// количество отправляемых писем в течении одного часа == 100 штук
    /// </summary>
    public static int EmailToOneHour => 100; // количество писем в течении одного часа

    #endregion

    public static string SpanAuto => "(авто)";

    public static string ContractAccept => "Вы заключили контракт. Спецификация с подтвержденными условиями сохранена в истории сделок. Процедура завершена.";
    public static string ContractRefuse => "Вы отказались от заключения контракта. Ваше предложение автоматически удалено.";

    /// <summary>
    ///  string DuplicateProduct => "duplicate Product"
    /// </summary>
    public static string DuplicateProduct => "duplicate Product";

    /// <summary>
    ///  string DuplicateProductDraft => "duplicate ProductDraft"
    /// </summary>
    public static string DuplicateProductDraft => "duplicate Product Draft";

    /// <summary>
    ///  string Ok AdPublished Save Or AdDraft
    /// </summary>
    public static string SaveAdPublishedOrAdDraft => "Ok AdPublished Save Or AdDraft";
    /// <summary>
    ///  string Ok AdModeration Save
    /// </summary>
    public static string SaveAdModeration => "Ok AdModeration Save";

    /// <summary>
    ///  string Ok  UpdateActiveToDateDay Save
    /// </summary>
    public static string SaveUpdateActiveToDateDay => "Ok  Update Only ActiveToDateDay Save";

    /// <summary>
    ///  string Ok  UpdateOffers  Save
    /// </summary>
    public static string SaveUpdateOffers => "Ok  Update Offers  Save";

    /// <summary>
    /// Текст добавляемого сообщения при удачной проверке на условия <br />
    /// TextOk => "ok";
    /// </summary>
    public static string TextOk => "ok";

    /// <summary>
    /// Текст добавляемого сообщения при ошибке <br />
    /// TextErrors => "error";
    /// </summary>
    public static string TextErrors => "error";

    /// <summary>
    /// Текст добавляемого сообщения при удачной проверке на условия email <br />
    /// TextYes => "yes";
    /// </summary>
    public static string TextYes => "yes";
    /// <summary>
    /// Текст добавляемого сообщения при результате НЕТ  <br />
    /// TextNo => "no";
    /// </summary>
    public static string TextNo => "no";

    /// <summary>
    ///  string удален с сайта самостоятельно => "RemovedFromSite"
    /// </summary>
    public static string RemovedFromSite => "RemovedFromSite";

    /// <summary>
    /// Текст добавляемого сообщения если Организатор внес изменения в объявление<br />
    /// TextSenderUpdateAd => "Организатор внес изменения в объявление. Обновите страницу";
    /// </summary>
    public static string TextSenderUpdateAd => "Организатор внес изменения в объявление. Обновите страницу";

    /// <summary>
    /// Текст добавляемого сообщения если Организатор удалил объявление<br />
    /// TextSenderDeleteAd => "Ошибка, объявление было удалено организатором. Обновите страницу";
    /// </summary>
    public static string TextSenderDeleteAd => "Ошибка, объявление было удалено организатором. Обновите страницу";

    /// <summary>
    /// Текст добавляемого сообщения если Admin разрешил публикацию Объявление<br />
    /// TextAdminAcceptedAd => "Ошибка. Ваше объявление было одобрено модератором и опубликовано. Страница будет перезагружена.";
    /// </summary>
    public static string TextAdminAcceptedAd => "Ошибка. Ваше объявление было одобрено модератором и опубликовано. Страница будет перезагружена.";

    /// <summary>
    /// Текст добавляемого сообщения если Admin удалил Объявление<br />
    /// TextAdminDeclinedAd => "Ошибка. Ваше объявление уже было удалено модератором из-за нарушения правил. Страница будет перезагружена.";
    /// </summary>
    public static string TextAdminDeclinedAd => "Ошибка. Ваше объявление было удалено модератором из-за нарушения правил. Страница будет перезагружена.";

    /// <summary>
    /// Текст добавляемого сообщения если Admin разрешил публикацию Объявление а Организатор хочет открыть его для внеснния изменений <br />
    /// TextAdminAcceptedAdEdit => "Ошибка. Ваше объявление было одобрено модератором и опубликовано. Обновите страницу.";
    /// </summary>
    public static string TextAdminAcceptedAdEdit => "Ошибка. Ваше объявление было одобрено модератором и опубликовано. Обновите страницу.";

    /// <summary>
    /// Текст добавляемого сообщения если Admin удалил Объявление а Организатор хочет открыть его для внеснния изменений <br />
    /// TextAdminDeclinedAdEdit => "Ошибка. Ваше объявление уже было удалено модератором из-за нарушения правил. Обновите страницу.";
    /// </summary>
    public static string TextAdminDeclinedAdEdit => "Ошибка. Ваше объявление было удалено модератором из-за нарушения правил. Обновите страницу.";

    /// <summary>
    /// Час для выполнения действий с объявлениями по МСК<br />
    /// Ч+ ... 12
    /// </summary>
    public static string ChtHour => "12";

    /// <summary>
    /// Час для выполнения действий с объявлениями по UTC<br />
    /// Ч+ ... 9
    /// </summary>
    public static int ChtHourUTC => 9;

    /// <summary>
    /// Час для выполнения действий Подведение итого до по МСК<br />
    /// Ч+ ... 18
    /// </summary>
    public static string ChtCummarizing => "18";

    /// <summary>
    /// Минута для выполнения действий с объявлениями по МСК<br />
    /// Ч+ ... 00
    /// </summary>
    public static string ChtMinute => "00";

    /// <summary>
    /// Минута для выполнения действий с объявлениями по UTC<br />
    /// Ч+ ... 00
    /// </summary>
    public static int ChtMinuteUTC => 0;

    /// <summary>
    /// Минута для выполнения действий Подведение итого до по МСК<br />
    /// Ч+ ... 00
    /// </summary>
    public static string ChtMinuteCummarizing => "00";

    /// <summary>
    /// Час для выполнения действий с предложениями  по МСК<br />
    /// Ч+ ... 23
    /// </summary>
    public static string ChtHourOffer => "23";

    /// <summary>
    /// Час для выполнения действий с предложениями  по UTC<br />
    /// Ч+ ... 20
    /// </summary>
    public static int ChtHourOfferUTC => 20;

    /// <summary>
    /// Минута для выполнения действий с предложениями по МСК<br />
    /// Ч+ ... 59
    /// </summary>
    public static string ChtMinuteOffer => "59";

    /// <summary>
    /// Минута для выполнения действий с предложениями по UTC<br />
    /// Ч+ ... 59
    /// </summary>
    public static int ChtMinuteOfferUTC => 59;

    /// <summary>
    /// Вы до {sendContractDate} мск не приняли решение по отправленному <br />
    /// время отмены   контракта
    /// </summary>
    public static string ContractCancellationTime => " 23:59";

    /// <summary>
    /// Это открытое объявление с ограниченным участием. <br />
    /// Вы уже отправили заявку для допуска к участию. <br />
    /// Ждите ответ от организатора
    /// </summary>
    public static string RequestForJoinAdAlreadySentMessageWithLimitedUser => "Вы уже отправили заявку для допуска к участию. Ждите ответ от организатора.";

    /// <summary>
    /// Это объявление с ограниченным участием. <br />
    /// Организатор отклонил вашу заявку
    /// </summary>
    public static string RequestForJoinAdDeclinedMessageWithLimitedUser => "Это объявление с ограниченным участием. Организатор отклонил вашу заявку";

    /// <summary>
    /// время изменения статуса == то есть 9:00 часов UTC
    /// это соответствует 12:00 часов по МСК 
    /// </summary>
    public static int HourUpdateAd => 9; // время изменения статуса == то есть 9 часов UTC

    /// <summary>
    /// Срок активности объявления - то есть 21 день
    /// </summary>
    public static int AdActivityPeriod => 21; // Срок активности объявления - то есть 21 день 

    /// <summary>
    /// Срок активности объявления - то есть 504 часа (21 день)
    /// </summary>
    public static int AdActivityPeriodHour => 504; // Срок активности объявления то есть 504 часа (21 день)

    /// <summary>
    /// Срок активности объявления - то есть 30240 минуты или 504 часа (21 день)
    /// </summary>
    public static int AdActivityPeriodMinutes => 30240; // Срок активности объявления то есть 30240 минуты или 504 часа (21 день)

    //период активности кода подтверждения номера телефона. 150 - это 2.5 (минуты) *60 
    public static int PhoneCodeLive => 150;

    /// <summary>
    /// ДЛЯ УЧАСТИЯ В АКУЦИОНАХ И ПОДАЧИ ПРЕДЛОЖЕНИЙ ТРЕБУЕТСЯ РЕПУТАЦИЯ
    /// </summary>
    public const int REPUTATION_REQUIRED_TO_BID = 10;

    /// <summary>
    /// МАКСИМАЛЬНО ДОПУСТИМАЯ ПРОДОЛЖИТЕЛЬНОСТЬ АУЦИОНА
    /// </summary>
    public const double MAXIMUM_ALLOWED_DURATION = 10;

    /// <summary>
    /// Признак того что Сообщение не привзяно к Объявлению <br />
    /// то есть AdIdM == 0
    /// </summary>
    public static int MessageAdIdMNullValue => 0; // AdIdM == 0 



    /// <summary>
    /// Единица измерения ->> смешанная  <br />
    /// для товаров в Объявлении 
    /// </summary>
    public const string UnitMixed = "смешанная";

    /// <summary>
    /// Тип сообщения  ->> отправленное  <br />
    /// "outgoing"
    /// </summary>
    public const string MessageTypeOut = "outgoing";
    /// <summary>
    /// Тип сообщения  ->> полученное  <br />
    /// "incoming"
    /// </summary>
    public const string MessageTypeInc = "incoming";



    /*


    SmtpClient smtpServer = new SmtpClient("smtp.m-contract.ru", 25)
        {
            Port = 25,
            Credentials = new NetworkCredential("info@m-contract.ru", "N0TvIe0b8U"),
            Timeout = 50000,
            EnableSsl = false
        };

        var message = GetMessage(sendTo, subject, body, "info@m-contract.ru");

        Адрес:     support@m-contract.ru
        IMAP:      imap-1.1gb.ru    (IMAP: порт 143, IMAPs: порт 993)
        SMTP:      imap-1.1gb.ru    (SMTP: порт 25,  SMTPs: порт 465)
        POP3:      imap-1.1gb.ru    (POP3: порт 110, POP3s: порт 995)
        Web-mail:  http://webmail.1gb.ru
        (войти в RoundCube: http://webmail.1gb.ru/?a=MOSUu1376rcPcM4osS%2FEKwHzbcWkiegu&b=e04e8a&webmail=2)
        (безопасно: https://www.1gb.ru/webmail/?a=MOSUu1376rcPcM4osS%2FEKwHzbcWkiegu&b=e04e8a&webmail=2)
        учетная запись (логин): u526800
        пароль:    3ba56b9a9a
        активна:   да

     //SmtpClient smtpServer = new SmtpClient("imap-1.1gb.ru", 25)
        //{
        //    Port = 25,
        //    Credentials = new NetworkCredential("u526800", "3ba56b9a9a"),
        //    Timeout = 50000,
        //    EnableSsl = false
        //};

        //var message = GetMessage(sendTo, subject, body, "support@m-contract.ru");



     support@m-contract.ru ->> 1GB.RU

    public static string HostEmail = "imap-1.1gb.ru";
    public static int PortEmail = 25;
    public static string NetworkCredentialUserName = "u526800";
    public static string NetworkCredentialPassword = "3ba56b9a9a";
    public static string FromUserEmail = "support@m-contract.ru";
    public static string Pop3Email = "imap-1.1gb.ru";
    public static string SmptEmail = "imap-1.1gb.ru";
    public static string IpString = " ... *** ??? *** ... ";                   // Server_Session(Socket socket)


    Проблема решена путем замены клиента Smtp на Mailkit.
    Microsoft теперь не рекомендует использовать клиент System.Net.Mail Smtp
    из-за проблем с безопасностью, вместо этого вам следует использовать MailKit.
    Использование Mailkit дало мне более четкие сообщения об ошибках,
    которые я мог понять и найти основную причину проблемы (проблема с лицензией).

    Вот как я реализовал SmtpClient с MailKit

    int port = 587;
    string host = "smtp.office365.com";
    string username = "smtp.out@mail.com";
    string password = "password";
    string mailFrom = "noreply@mail.com";
    string mailTo = "mailto@mail.com";
    string mailTitle = "Testtitle";
    string mailMessage = "Testmessage";

    var message = new MimeMessage();
    message.From.Add(new MailboxAddress(mailFrom));
    message.To.Add(new MailboxAddress(mailTo));
    message.Subject = mailTitle;
    message.Body = new TextPart("plain") { Text = mailMessage };

    using (var client = new SmtpClient())
    {
        client.Connect(host , port, SecureSocketOptions.StartTls);
        client.Authenticate(username, password);

        client.Send(message);
        client.Disconnect(true);
    }




*/
    //public const string HostEmail = "smtp.m-contract.ru";
    //public const int PortEmail = 25;
    //public const string NetworkCredentialUserName = "info@m-contract.ru";
    //public const string NetworkCredentialPassword = "N0TvIe0b8U";
    //public const string FromUserEmail = "info@m-contract.ru";
    //public const string Pop3Email = " "; // ??? ........... ****   ....   ??? 
    //public const string SmptEmail = "smtp.m-contract.ru";
    //public const string IpString = "81.177.160.163"; // Server_Session(Socket socket)

    
    /// <summary>
    /// email website developer <br />
    /// krakoss@mail.ru
    /// </summary>
    public static string MiddleWebSiteDeveloperEmail => "krakoss@mail.ru";

    public static int NotificationsSystemUserId { get; set; }
    public static int SupportUserId { get; set; }

    public const string RoleAdmin = "Admin";

    /// <summary>
    /// получение времени по МОСКВЕ
    /// </summary>
    public static DateTime MoscowDateTime
    {
        get
        {
            TimeZoneInfo moscowTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Russian Standard Time");
            DateTime moscowDateTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, moscowTimeZone);
            return moscowDateTime;
        }
    }


    /// <summary>
    /// Заглушка логотипа
    /// </summary>
    public const string NoLogoImageUrl = "/img/icons/user-sharing.svg";

    /// <summary>
    /// заглушка Объявления
    /// </summary>
    public const string NoImageUrl = "/img/icons/img-blue-500.svg";

    /// <summary>
    /// запрещенные к загрузке расширения у файлов
    /// </summary>
    public const string DeniedExtensions = "exe,js,bat,cmd,vbs,pif,com,application,msi,msp,gadget,scr,hta,msc,cpl,jar,vb,vbe,msh1xml,msh2xml,mshxml,msh1,msh2,msh,psc1,psc2,ps1,ps1xml,ps2xml,wsh,wsc,wsf,ws,jse,lnk,inf,scf,dotm,docm,xlsm,xlam,xltm,ppsm,ppam,sldm,potm,  pptm";

    public const string ImgType = "png,jpeg,jpg,webp,heic,heif,avif";
    public const string DocType = "rtf,doc,docx,odt,xls,xlsx,ods,pdf,txt,csv,zip,rar";

    #region Урлы, используемые в проекте   
    /// <summary>
    /// ссылка на страницу Регистрации 
    ///  "/registration"
    /// </summary>
    public const string RegistrationUrl = "/registration";
    /// <summary>
    /// ссылка на страницу входа <br />
    ///  "/login"
    /// </summary>
    public const string LoginUrl = "/login";

    /// <summary>
    /// ссылка на страницу в личном кабинете <br />
    ///  "/my"
    /// </summary    
    public const string MyProfileUrl = "/my";

    /// <summary>
    /// ссылка на страницу Черный список в личном кабинете <br />
    ///  "/blacklist"
    /// </summary    
    public const string MyProfileBlackListUrl = "/user/blacklist";

    /// <summary>
    /// ссылка на страницу Сообщения ->> <br />
    ///  "/dialogs"
    /// </summary    
    public const string DialogstUrl = "/dialogs";
    /// <summary>
    /// ссылка на страницу Сообщения в личном кабинете ->>   <br />
    ///  "dialogs"
    /// </summary    
    public const string DialogstUrlClear = "dialogs";

    /// <summary>
    /// ссылка на страницу Все объявления ->> <br />
    ///  "/market/all"
    /// </summary    
    public const string MarketAll = "/market/all";
    /// <summary>
    /// ссылка на страницу Объявления ->> <br />
    ///  "/market/view/"
    /// </summary    
    public const string MarketView = "/market/view/";
    /// <summary>
    /// ссылка на страницу редактирвоания Объявления ->> <br />
    ///  "/market/edit-record/"
    /// </summary    
    public const string MarketEditRecord = "/market/edit-record/";

    /// <summary>
    /// ссылка на страницу Избранное в личном кабинете ->> <br />
    ///  "/favorites"
    /// </summary    
    public const string FavoritesUrl = "/favorites";

    /// <summary>
    /// ссылка на страницу История Сделок в личном кабинете ->> <br />
    ///  "/deals-history"
    /// </summary    
    public const string DealsHistoryUrl = "/deals-history";

    /// <summary>
    /// ссылка на страницу Мои предложения в личном кабинете ->> <br />
    ///  "/my-offers"
    /// </summary    
    public const string MyOffersUrl = "/my-offers";

    /// <summary>
    /// ссылка на страницу Предложения  ->> <br />
    ///  "/my-offers
    /// </summary    
    public const string OfferUrl = "/offer";
    /// <summary>
    /// ссылка на страницу Редактировать предложения в личном кабинете ->> <br />
    ///  "/offer-edit"
    /// </summary    
    public const string MyOfferEditUrl = "/offer-edit/";

    /// <summary>
    /// ссылка на страницу Редактировать подписки в личном кабинете ->> <br />
    ///  "/user/subscribe-edit/"
    /// </summary    
    public const string MySubscribeAdsEditUrl = "/user/subscribe-edit/";

    /// <summary>
    /// ссылка получить список ИД городов одного региона ->> <br />
    ///  "/user/region-towns/"
    /// </summary    
    public const string RegionTownsUrl = "/user/region-towns/";

    /// <summary>
    /// ссылка на страницу Партнеры в личном кабинете ->> <br />
    ///  "partners"
    /// </summary    
    public const string PartnersUrl = "/partners";

    /// <summary>
    /// ссылка на страницу companie в личном кабинете ->> <br />
    ///  "companie"
    /// </summary    
    public const string CompanieUrl = "/companie";

    /// <summary>
    /// ссылка на страницу Платежи в личном кабинете ->> <br />
    ///  "payments"
    /// </summary    
    public const string PaymentsUrl = "/payments";

    /// <summary>
    /// ссылка на страницу ModerateAds в Admin ->> <br />
    ///  "companie"
    /// </summary    
    public const string ModerateAdsUrl = "/moderate-ads";

    public const string DisplayNone = " display_none";

    /// <summary>
    /// обозначение строки  календ. дн. ->> CalendarDay
    /// </summary>
    public const string CalendarDay = "  календ. дн.";

    #endregion
}