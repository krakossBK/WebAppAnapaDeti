using WebAppAnapaDeti.DAL;
using WebAppAnapaDeti.DAL.Extensions;
using WebAppAnapaDeti.Models.Entities;
using MediatR;


namespace WebAppAnapaDeti.AppCode.Features.LogSites
{
    public abstract class LogSiteCreate
    {
        public record Command(int LogTypeId,
                              string Message) : IRequest<bool>;

        public class Handler(
            IAppDbContext appContext,
            ILogger<Handler> logger
            ) : IRequestHandler<Command, bool>
        {
            public async Task<bool> Handle(Command request, CancellationToken ct)
            {
                try
                {
                    bool result = false;
                    LogSite logSite = new()
                    {
                        LogTypeId = request.LogTypeId,
                        Message = request.Message
                    };
                    await Task.Delay(100, ct);
                    string id= appContext.AddLogSite(logSite);// Добавление данных logSite
                    if (!string.IsNullOrEmpty(id))
                        result = true;
                    return result;
                }
                catch (Exception ex)
                {
                    logger.LogError(ex.Message);
                    return false;
                }
            }
        }
    }
}
