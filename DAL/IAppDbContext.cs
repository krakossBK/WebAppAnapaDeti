using WebAppAnapaDeti.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace WebAppAnapaDeti.DAL;

/// <summary>
/// interface - интерфейс для <br>
/// работы с СУБД </br>
/// </summary>
public interface IAppDbContext
{
    DatabaseFacade Database { get; }
    ChangeTracker ChangeTracker { get; }

    /// <summary>
    /// создать запись в СУБД
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="model">модель данных</param>
    /// <returns></returns>
    T Store<T>(T model) where T : class;

    /// <summary>
    /// обновить запись в СУБД
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="model">модель данных</param>
    /// <returns></returns>
    bool UpdateVm<T>(T model) where T : class;

    /// <summary>
    /// Получить данные из базы по запросу 
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    IQueryable<T> Query<T>() where T : class;

    /// <summary>
    /// создать запись в СУБД Асинхронно
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="model">модель данных</param>
    /// <returns></returns>
    Task<T> StoreAsync<T>(T model) where T : class;

    /// <summary>
    /// обновить запись в СУБД Асинхронно
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="model">модель данных</param>
    /// <returns></returns>
    Task<bool> UpdateVmAsync<T>(T model) where T : class;

    DbSet<LogSite> LogSites { get; }

}