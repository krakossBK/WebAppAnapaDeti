namespace WebAppAnapaDeti.AppCode;

public class C /*C - Сокращение от Constants, чтобы меньше места в коде занимало и было нагляднее*/
{
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
  
    public static string SpanAuto => "(авто)";

    /// <summary>
    /// Текст добавляемого сообщения при удачной проверке на условия <br />
    /// TextOk => "ok";
    /// </summary>
    public static string TextOk => "ok";

    /// <summary>
    /// Текст добавляемого сообщения при ошибке <br />
    /// TextErrors => "error";
    /// </summary>
    public static string TextError => "error";

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
    /// Тип сообщения  ->> отправленное  <br />
    /// "outgoing"
    /// </summary>
    public const string MessageTypeOut = "outgoing";
    /// <summary>
    /// Тип сообщения  ->> полученное  <br />
    /// "incoming"
    /// </summary>
    public const string MessageTypeInc = "incoming";



    /// <summary>
    /// email website SupportEmail <br />
    /// admin@xn--80aaa4cl.xn--d1acj3b
    /// </summary>
    public static string SupportEmail => "admin@xn--80aaa4cl.xn--d1acj3b"; //admin@xn--80aaa4cl.xn--d1acj3b //admin@анапа-дети; 

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
    /// ссылка на страницу Регистрации 
    ///  "/registration"
    /// </summary>
    public const string FinishRegistrationUrl = "/finish-registration";

    /// <summary>
    /// ссылка на страницу входа <br />
    ///  "/login"
    /// </summary>
    public const string LoginUrl = "/login";

    /// <summary>
    /// ссылка на страницу подтверждения емайл при регистрации  <br />
    ///  "/confirm-email"
    /// </summary>
    public const string ConfirmEmailUrl = "/confirm-email";

    #endregion

    public const string DisplayNone = " display_none";
}