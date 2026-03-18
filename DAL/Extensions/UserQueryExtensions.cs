using Mapster;
using Microsoft.EntityFrameworkCore;
using WebAppAnapaDeti.Models._ViewModels.User;
using WebAppAnapaDeti.Models.Entities;
using WebAppAnapaDeti.Models.Enums;

namespace WebAppAnapaDeti.DAL.Extensions;

public static class UserQueryExtensions
{
    /// <summary>
    /// Получение списка Users
    /// </summary>
    /// <param name="context">IAppDbContext context</param>
    /// <returns>List<UserViewModel></returns>
    public static List<UserViewModel> GetUsers(this IAppDbContext context)
        => [.. context.Query<User>()
                  .OrderBy(o => o.Id)
                  .ProjectToType<UserViewModel>()];

    /// <summary>
    /// Добавление новой записи
    /// </summary>
    /// <param name="context">IAppDbContext context</param>
    /// <param name="user">User user</param>
    /// <returns>Id созданного записи</returns>
    public static string AddUser(this IAppDbContext context, User user)
        => context.Store(user).Id.ToString().ToUpper();

    /// <summary>
    /// Получить данные записи по его Id
    /// </summary>
    /// <param name="id">ID записи</param>
    /// <returns> User </returns>
    /// <exception cref="Exception"></exception>
    public static UserViewModel GetUser(this IAppDbContext context, string id)
        => context.Query<User>()
                  .FirstOrDefault(f => f.Id.Equals(Guid.Parse(id)))
                  .Adapt<UserViewModel>();

    /// <summary>
    /// Удаление записи
    /// </summary>
    /// <param name="context">IAppDbContext context</param>
    /// <param name="id">ID User</param>
    /// <returns>true OR false</returns>
    public static bool DeleteUser(this IAppDbContext context, string id)
        => context.Query<User>()
                  .Where(w => w.Id.Equals(Guid.Parse(id)))
                  .ExecuteDelete() > 0;


    /// <summary>
    /// проверить уникальность емайл при входе на сайт<br />
    /// у последнего по Id  юзера с этим емайл 
    /// </summary>
    /// <param name="context">appDbContext</param>
    /// <param name="email">email</param>
    /// <returns>User</returns>
    public static User? GetUserByEmailLogin(this IAppDbContext context, string email) => context.Query<User>()
        .OrderBy(f => f.Id)
        .LastOrDefault(f => f.Email == email);

    public static bool IsUserEmailUnique(this IAppDbContext context, string email, bool removedFromSite) => context.Query<User>()
        .Where(w => w.Deleted == removedFromSite)
        .All(f => f.Email != email);

    /// <summary>
    /// Получить данные User по GUID отправленному ему в письме 
    /// </summary>
    /// <param name="context">this IAppDbContext context</param>
    /// <param name="guidString"> GUID VerificationCode</param>
    /// <returns>User</returns>
    public static User? GetUserByToken(this IAppDbContext context, string guidString) => context.Query<User>()
       .FirstOrDefault(f => f.VerificationCode.Equals(Guid.Parse(guidString)));

    /// <summary>
    /// запишем в БД данные о событии успешного подтверждения Email адреса и включим подписку на емайл 
    /// </summary>
    /// <param name="context">this IAppDbContext context</param>
    /// <param name="userId">Guid userId</param>
    /// <param name="emailConfirmed">bool emailConfirmed</param>
    /// <param name="emailAlert">bool emailAlert</param>
    /// <returns>true OR false</returns>
    public static bool UpdateUserEmailConfirmed(this IAppDbContext context, Guid userId, bool emailConfirmed, bool emailAlert) => context.Query<User>()
        .Where(w => w.Id == userId)
        .ExecuteUpdate(e => e
            .SetProperty(p => p.EmailConfirmed, emailConfirmed)
            .SetProperty(p => p.EmailAlert, emailAlert)) > 0;

    /// <summary>
    /// установить статус у Юзера что он принят в список пользователей сайта 
    /// </summary>
    /// <param name="context">this IAppDbContext context</param>
    /// <param name="userId">Guid userId</param>
    /// <param name="moderateResultId">int moderateResultId</param>
    /// <returns>true OR false</returns>
    public static bool UpdateUserModerateResult(this IAppDbContext context, Guid userId, int moderateResultId) => context.Query<User>()
       .Where(w => w.Id == userId)
       .ExecuteUpdate(e => e
           .SetProperty(p => p.ModerateResult, (ModerateResults)moderateResultId)) > 0;

    /// <summary>
    /// запишем в БД запишем в БД новый VerificationCode у Usera
    /// </summary>
    /// <param name="context">this IAppDbContext context</param>
    /// <param name="userId">Guid userId</param>
    /// <param name="guidString">Guid guidString</param>
    /// <returns>true OR false</returns>
    public static bool UpdateVerificationCode(this IAppDbContext context,
                                              Guid userId,
                                              Guid guidString) => context.Query<User>()
        .Where(w => w.Id == userId)
        .ExecuteUpdate(e => e
            .SetProperty(p => p.VerificationCode,  guidString)) > 0;
}
