using WebAppAnapaDeti.DAL;
using WebAppAnapaDeti.DAL.Extensions;
using WebAppAnapaDeti.Models._ViewModels;
// using MediatR;

namespace WebAppAnapaDeti.AppCode.Features.LogSites
{
    public abstract class LogSites
    {
        public class Handler(IAppDbContext appContext
                                    //,
                                    //IMediator _mediator,
                                    //ILogger<LogSiteViewModel> logger
                                    )
        {
            public async Task<List<LogSiteViewModel>> Handle(CancellationToken ct)
            {
                List<LogSiteViewModel> viewModel = await Task.Run(appContext.GetLogSites, ct);
                return viewModel;
            }
        }
    }
}