using WebAppAnapaDeti.DAL;
using WebAppAnapaDeti.DAL.Extensions;
using WebAppAnapaDeti.Models.Entities;
using MediatR;


namespace WebAppAnapaDeti.AppCode.Features.LogSites
{
    public abstract class LogSiteCreate
    {
        public record Command(int LogTypeId,
                         string Message) : IRequest<int>;

        public class Handler(
            IAppDbContext appContext,
            ILogger<Handler> logger
            ) : IRequestHandler<Command, int>
        {
            public async Task<int> Handle(Command request, CancellationToken ct)
            {

                try
                {

                    LogSite logSite = new()
                    {
                        LogTypeId = request.LogTypeId,
                        Message = request.Message
                    };
                    await Task.Delay(100, ct);
                    return appContext.AddLogSite(logSite);// Добавление данных logSite

                }
                catch (Exception ex)
                {
                    logger.LogError(ex.Message);
                    return 0;
                }
            }
        }
    }
}
