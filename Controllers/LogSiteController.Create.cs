using WebAppAnapaDeti.AppCode.Features.LogSites;
using Microsoft.AspNetCore.Mvc;

namespace WebAppAnapaDeti.Controllers;

public partial class LogSiteController
{
    [HttpPost("/create-log")]
    public async Task<int> CreateLogSite(LogSiteCreate.Command command)
    {
        try
        {
            return await _mediator.Send(command);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "async Task<int> CreateLogSite");
            return 0;
        }
    }
}

/*
 
public partial class
partial - ключевое слово в C# позволяет разбить определение класса, структуры или интерфейса на несколько файлов. 
Эта функция особенно полезна для больших классов, 
автоматически сгенерированного кода или когда несколько разработчиков работают над одним классом. 
Во время компиляции все части частного класса объединяются компилятором в один класс.


 */