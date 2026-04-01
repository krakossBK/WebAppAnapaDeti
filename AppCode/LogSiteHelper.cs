using MediatR;
using WebAppAnapaDeti.AppCode.Features.LogSites;
using WebAppAnapaDeti.AppCode.Features.Users;
using WebAppAnapaDeti.DAL;
using WebAppAnapaDeti.DAL.Extensions;
using WebAppAnapaDeti.Models._ViewModels;
using WebAppAnapaDeti.Models.Entities;

namespace WebAppAnapaDeti.AppCode;

public class LogSiteHelper(IAppDbContext appContext,
                                IMediator mediator)
{
    private readonly IAppDbContext _appContext = appContext;
    private readonly IMediator _mediator = mediator;

    /// <summary>
    /// Создание записи
    /// </summary>
    /// <param name="logSiteViewModel">LogSiteViewModel </param>
    /// <returns>true OR false</returns>
    public async Task<bool> CreateLogSiteViewModel(LogSiteViewModel logSiteViewModel)
    {
        return await _mediator.Send(new LogSiteCreate.Command(logSiteViewModel.LogTypeId, logSiteViewModel.Message));
        /*

        internal: компоненты класса или структуры доступен из любого места кода в той же сборке, однако он недоступен для других программ и сборок.

        internal  ключевое слово в C# — это модификатор доступа, используемый для ограничения доступа к типам и их членам внутри одной сборки. 
        Это означает, что любой тип или элемент, помеченный как внутренний, может быть доступен только по коду внутри той же сборки,
        а не из других ассемблеров.
         */
    }


    /// <summary>
    /// создать список записей
    /// </summary>
    /// <returns>List<LogSite></returns>
    public async Task<List<LogSiteViewModel>> GetLogSites()
        => await Task.Run(_appContext.GetLogSites);


    /// <summary>
    /// Отобразить одну запись
    /// </summary>
    /// <param name="id">id записи</param>
    /// <returns>LogViewModel</returns>
    public async Task<LogSiteViewModel> GetLogSiteViewModel(string id)
        => await Task.Run(() => _appContext.GetLogSite(id));



    /// <summary>
    /// Удаление записи
    /// </summary>
    /// <param name="id">id записи</param>
    /// <returns>true OR false</returns>
    public async Task<bool> DeleteLoSiteg(string id)
        => await Task.Run(() => _appContext.DeleteLogSite(id));
}