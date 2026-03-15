using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebAppAnapaDeti.AppCode;
using WebAppAnapaDeti.Models._ViewModels;

namespace WebAppAnapaDeti.Controllers;

public partial class LogSiteController(
    ILogger<LogSiteController> logger,
    LogSiteHelper logSiteHelper,
    IMediator mediator
    ) : Controller
{
    private readonly ILogger<LogSiteController> _logger = logger;
    private readonly LogSiteHelper _logSiteHelper = logSiteHelper;
    private readonly IMediator _mediator = mediator;


    [HttpGet("/log-site")]
    public async Task<IActionResult> Index()
    {
        LogSiteIndexViewModel viewModel = new()
        {
            LogSites = await _logSiteHelper.GetLogSites()
        };
        ViewBag.Heading = "log-site";
        return View(viewModel);
    }
}

/*
 
public partial class
partial - ключевое слово в C# позволяет разбить определение класса, структуры или интерфейса на несколько файлов. 
Эта функция особенно полезна для больших классов, 
автоматически сгенерированного кода или когда несколько разработчиков работают над одним классом. 
Во время компиляции все части частного класса объединяются компилятором в один класс.


 */