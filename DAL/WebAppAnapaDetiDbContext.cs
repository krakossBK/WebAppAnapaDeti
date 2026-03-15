using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace WebAppAnapaDeti.DAL;

public partial class WebAppAnapaDetiDbContext(DbContextOptions<WebAppAnapaDetiDbContext> options) : DbContext(options), IAppDbContext
{
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder) =>
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WebAppAnapaDetiDbContext).Assembly);

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        //  stackoverflow.com/questions/65990565/how-to-prevent-ef-core-5-from-creating-a-savepoint-when-saving
        //optionsBuilder.ConfigureWarnings(w => w.Ignore(SqlServerEventId.SavepointsDisabledBecauseOfMARS));
        /*
        var dbConfig = Configurer.Config.MessageDbConfig;
        optionsBuilder.UseNpgsql(new NpgsqlConnectionStringBuilder
        {
            Database = dbConfig.DbName,
            Username = dbConfig.Username,
            Password = dbConfig.Password,
            Host = dbConfig.Host,
            Port = dbConfig.Port,
            Pooling = dbConfig.Pooling
        }.ConnectionString,
         optionsBuilder => optionsBuilder.SetPostgresVersion(Version.Parse("14.4")));

        base.OnConfiguring(optionsBuilder);
        */
    }


    /// <summary>
    /// Создать новую запись
    /// </summary>
    /// <typeparam name="T">Models.Entities</typeparam>
    /// <param name="model">Models.Entities</param>
    /// <returns>Models.Entities</returns>
    public T Store<T>(T model) where T : class
    {
        Set<T>().Add(model);
        SaveChanges();
        return model;
    }

    /// <summary>
    /// Обновить запись
    /// </summary>
    /// <typeparam name="T">Models.Entities</typeparam>
    /// <param name="model">Models.Entities</param>
    /// <returns>Models.Entities</returns>
    public bool UpdateVm<T>(T model) where T : class
    {
        Set<T>().Attach(model).State = EntityState.Modified;
        SaveChanges();
        return true;
    }

    /// <summary>
    /// Выполнить запрос к Models.Entities
    /// </summary>
    /// <typeparam name="T">Models.Entities</typeparam>
    /// <returns>Set<T></returns>
    public IQueryable<T> Query<T>() where T : class => Set<T>()
        .AsNoTrackingWithIdentityResolution()
        .AsSplitQuery();


    /// <summary>
    /// Создать новую запись Асинхронно 
    /// </summary>
    /// <typeparam name="T">Models.Entities</typeparam>
    /// <param name="model">Models.Entities</param>
    /// <returns>Models.Entities</returns>
    public async Task<T> StoreAsync<T>(T model) where T : class
    {
        Set<T>().Add(model);
        await SaveChangesAsync();
        return model;
    }

    /// <summary>
    /// Обновить запись Асинхронно 
    /// </summary>
    /// <typeparam name="T">Models.Entities</typeparam>
    /// <param name="model">Models.Entities</param>
    /// <returns>Models.Entities</returns>
    public async Task<bool> UpdateVmAsync<T>(T model) where T : class
    {
        Set<T>().Attach(model).State = EntityState.Modified;
        await SaveChangesAsync();
        return true;
    }
}