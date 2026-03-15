using WebAppAnapaDeti.DAL;
using WebAppAnapaDeti.DAL.Extensions;
using WebAppAnapaDeti.Models._ViewModels;
using MediatR;

namespace WebAppAnapaDeti.AppCode;

public class LogSiteHelper(IAppDbContext appContext,
                                IMediator mediator)
{
    private readonly IAppDbContext _appContext = appContext;
    private readonly IMediator _mediator = mediator;


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