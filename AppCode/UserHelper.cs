using MediatR;
using WebAppAnapaDeti.AppCode.Features.Users;
using WebAppAnapaDeti.DAL;
using WebAppAnapaDeti.DAL.Extensions;
using WebAppAnapaDeti.Models._ViewModels.User;
using WebAppAnapaDeti.Models.Entities;

namespace WebAppAnapaDeti.AppCode
{
    public class UserHelper(IAppDbContext appContext,
                                IMediator mediator)
    {
        private readonly IAppDbContext _appContext = appContext;
        private readonly IMediator _mediator = mediator;

        /// <summary>
        /// создать список записей
        /// </summary>
        /// <returns>List<User></returns>
        public async Task<List<UserViewModel>> GetUsers()
        => await Task.Run(_appContext.GetUsers);


        /// <summary>
        /// Отобразить одну запись
        /// </summary>
        /// <param name="id">id записи</param>
        /// <returns>UserViewModel</returns>
        public async Task<UserViewModel> GetUserVM(string id)
        => await Task.Run(() => _appContext.GetUser(id));



        /// <summary>
        /// Удаление записи
        /// </summary>
        /// <param name="id">id записи</param>
        /// <returns>true OR false</returns>
        public async Task<bool> DeleteUser(string id)
            => await Task.Run(() => _appContext.DeleteUser(id));

        /// <summary>
        /// Создание записи
        /// </summary>
        /// <param name="user">User </param>
        /// <returns>true OR false</returns>
        internal async Task<bool> CreateUserAndSendEmail(User user)
        {
            return await _mediator.Send(new UserCreate.Command(user));
            /*
             
            internal: компоненты класса или структуры доступен из любого места кода в той же сборке, однако он недоступен для других программ и сборок.

            internal  ключевое слово в C# — это модификатор доступа, используемый для ограничения доступа к типам и их членам внутри одной сборки. 
            Это означает, что любой тип или элемент, помеченный как внутренний, может быть доступен только по коду внутри той же сборки,
            а не из других ассемблеров.
             */
        }
    }
}
