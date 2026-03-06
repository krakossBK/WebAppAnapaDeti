using WebAppAnapaDeti.Models._ViewModels;
using WebAppAnapaDeti.Models.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace WebAppAnapaDeti.DAL.Extensions;

public static class LogQueryExtensions
{
    /// <summary>
    /// Получение списка LogSites
    /// </summary>
    /// <param name="context">IAppDbContext context</param>
    /// <returns>List<LogSiteViewModel></returns>
    public static List<LogSiteViewModel> GetLogSites(this IAppDbContext context)
        => [.. context.Query<LogSite>()
                      .OrderBy(o => o.TimeMsk)
                      .ProjectToType<LogSiteViewModel>()];

    /// <summary>
    /// Добавление новой записи
    /// </summary>
    /// <param name="context">IAppDbContext context</param>
    /// <param name="logSite">LogSite logSite</param>
    /// <returns>Id созданного записи</returns>
    public static int AddLogSite(this IAppDbContext context, LogSite logSite)
        => context.Store(logSite).Id;

    /// <summary>
    /// Получить данные записи по его Id
    /// </summary>
    /// <param name="id">ID записи</param>
    /// <returns> LOG </returns>
    /// <exception cref="Exception"></exception>
    public static LogSiteViewModel GetLogSite(this IAppDbContext context, int id) 
        => context.Query<LogSite>()
                  .FirstOrDefault(f => f.Id == id)
                  .Adapt<LogSiteViewModel>();

    /// <summary>
    /// Удаление записи
    /// </summary>
    /// <param name="context">IAppDbContext context</param>
    /// <param name="id">ID Log</param>
    /// <returns>true OR false</returns>
    public static bool DeleteLogSite(this IAppDbContext context, int id)
        => context.Query<LogSite>()
                  .Where(w => w.Id == id)
                  .ExecuteDelete() > 0;

}