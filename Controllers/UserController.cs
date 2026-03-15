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

    private readonly UserHelper _userHelper;
    private readonly ILogger<UserController> _logger;
    private readonly IAppDbContext _appContext;
    private readonly IMediator _mediator;
    private readonly AppSettings _appSettings;

    public UserController(UserHelper userHelper,
                          IWebHostEnvironment env,
                          ILogger<UserController> logger,
                          IOptions<AppSettings> appSettings,
                          IAppDbContext appContext,
                          IMediator mediator)
    {
        ArgumentNullException.ThrowIfNull(env);
        ArgumentNullException.ThrowIfNull(appSettings);
        _userHelper = userHelper ?? throw new ArgumentNullException(nameof(userHelper));
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
