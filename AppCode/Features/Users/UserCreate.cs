using MediatR;
using Microsoft.Extensions.Options;
using WebAppAnapaDeti.AppCode.Features.Mail;
using WebAppAnapaDeti.DAL;
using WebAppAnapaDeti.DAL.Extensions;
using WebAppAnapaDeti.Models._ViewModels;
using WebAppAnapaDeti.Models.Entities;


namespace WebAppAnapaDeti.AppCode.Features.Users;

public abstract class UserCreate
{
    public record Command(User User) : IRequest<bool>;

    public class Handler(
        IAppDbContext appContext,
        ILogger<Handler> logger,
        IMediator mediator,
        LogSiteHelper logSiteHelper,
        IOptions<AppSettings> options
        ) : IRequestHandler<Command, bool>
    {
        public async Task<bool> Handle(Command request, CancellationToken ct)
        {
            try
            {
                bool result = false;
                string id = appContext.AddUser(request.User);
                if (!string.IsNullOrEmpty(id))
                    result = await MediatorSendMail(request.User.Email, request.User.VerificationCode, ct);
                if (result)
                {
                    LogSiteViewModel logSiteViewModel = new()
                    {
                        LogTypeId = 1,
                        Message = "await MediatorSendMail - " + request.User.Email
                    };

                    await logSiteHelper.CreateLogSiteViewModel(logSiteViewModel);
                }
                return result;
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return false;
            }
        }

        public async Task<bool> MediatorSendMail(string email, Guid verificationCode, CancellationToken ct)
        {
            try
            {
                #region Потдверждение почтого ящика нового ЮЗЕРА
                string subscription = $"{options.Value.WebAddress}{C.ConfirmEmailUrl}?code={Convert.ToString(verificationCode)}";
                string sendTo = email;
                string subject = "Подтверждение регистрации";
                string body = $"Уважаемый новый пользователь<br/><br/>Для завершения регистрации Вам необходимо подтвердить адрес своей электронной почты.<br/>Для этого перейдите по ссылке - <a href=\'{subscription}'>Подтвердить адрес своей электронной почты</a>.<br/><br/><i>С уважением, aнапа.дети</i>";
                await mediator.Send(new SendMailCommand(sendTo, subject, body), ct);
                #endregion
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return false;
            }

        }
    }
}