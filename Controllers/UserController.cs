using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebAppAnapaDeti.AppCode;
using WebAppAnapaDeti.DAL;

namespace WebAppAnapaDeti.Controllers;

[Authorize]
public partial class UserController : Controller
{
    private readonly SM _sm;
    private readonly UserHelper _userHelper;
    private readonly LogSiteHelper _logSiteHelper;
    private readonly ILogger<UserController> _logger;
    private readonly IAppDbContext _appContext;
    private readonly IMediator _mediator;
    private readonly AppSettings _appSettings;

    public UserController(SM sm,
        UserHelper userHelper,
                          LogSiteHelper logSiteHelper,
                          IWebHostEnvironment env,
                          ILogger<UserController> logger,
                          IOptions<AppSettings> appSettings,
                          IAppDbContext appContext,
                          IMediator mediator)
    {
        ArgumentNullException.ThrowIfNull(env);
        ArgumentNullException.ThrowIfNull(appSettings);
        _sm = sm ?? throw new ArgumentNullException(nameof(sm));
        _userHelper = userHelper ?? throw new ArgumentNullException(nameof(userHelper));
        _logSiteHelper = logSiteHelper ?? throw new ArgumentNullException(nameof(userHelper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _appContext = appContext ?? throw new ArgumentNullException(nameof(appContext));
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _appSettings = appSettings.Value;
    }
    public IActionResult Index()
    {
        return View();
    }
}
