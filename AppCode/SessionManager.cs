using Mapster;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using WebAppAnapaDeti.DAL;
using WebAppAnapaDeti.DAL.Extensions;
using WebAppAnapaDeti.Models._ViewModels.User;

namespace WebAppAnapaDeti.AppCode;

public interface IUserContext
{
    string CurrentUserId { get; }
    UserViewModel? CurrentUser { get; set; }
}

public class SM(IHttpContextAccessor hca, IAppDbContext appContext) : IUserContext
{
    private readonly IAppDbContext _appContext = appContext;
    private readonly HttpContext _httpContext = hca.HttpContext!;



    public bool IsChatBoxSilent
    {
        get => _httpContext.Session.Get("IsChatBoxSilent") != null;
        set => _httpContext.Session.Set("IsChatBoxSilent", []);
    }


    public UserViewModel? CurrentUser
    {
        get
        {
            if (string.IsNullOrEmpty(CurrentUserId))
                return null;

            var result = _appContext.GetUser(CurrentUserId);
            if (result == null)
                _httpContext.Session.Clear();
            return result;
        }
        set
        {
            if (value != null)
                CurrentUserContactName = value.ContactName;
            else
                _httpContext.Session.Remove("CurrentUserContactName");
        }
    }

    /// <summary> _httpContext.Session["CurrentUserId"] != null </summary>
    public string CurrentUserId => _httpContext == null
                ? ""
                : !string.IsNullOrEmpty(_httpContext.Session.GetString("CurrentUserId"))
                    ? _httpContext.Session.GetString("CurrentUserId")
                    : "";


    public string CurrentUserContactName
    {
        get
        {
            var currentUserContactName = _httpContext.Session.GetString("CurrentUserContactName");
            if (currentUserContactName != null)
                return currentUserContactName;

            if (string.IsNullOrEmpty(CurrentUserId))
                return "";

            _httpContext.Session.SetString("CurrentUserContactName", CurrentUser.ContactName);
            return CurrentUser.ContactName;
        }
        set => _httpContext.Session.SetString("CurrentUserContactName", value);
    }


    public DateTime LoginTime
    {
        get => _httpContext.Session.GetObject<DateTime?>("LoginTime") ?? new DateTime(1900, 1, 1);
        set => _httpContext.Session.SetObject("LoginTime", value);
    }

    public string Message
    {
        get => _httpContext.Session.GetAndRemove("Message");
        set => _httpContext.Session.SetString("Message", value);
    }

    public string MessageColor
    {
        get => _httpContext.Session.GetAndRemove("MessageColor");
        set => _httpContext.Session.SetString("MessageColor", value);
    }
    public string GetCurrentUrl()
    {
        return _httpContext.Request.Host.Value.ToString();
    }
}