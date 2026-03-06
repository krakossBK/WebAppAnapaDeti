using System.Diagnostics;
using MediatR;

namespace WebAppAnapaDeti.Infrastructure.Behaviors;

public class LoggingPipelineBehavior<TRequest, TResponse>(
    ILogger<LoggingPipelineBehavior<TRequest, 
        TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IBaseRequest
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        logger.LogInformation("{Type}, run", typeof(TRequest).FullName);

        var sw = Stopwatch.StartNew();
        var result = await next(cancellationToken);

        logger.LogInformation("{Type}, end, {Elapsed}", typeof(TRequest).FullName, sw.Elapsed);

        return result;
    }
}

/* 

[10:01:22 INF] MContract.AppCode.Features.Files.GetFileRealPath+Query, run
[10:01:23 INF] MContract.AppCode.Features.Files.GetFileRealPath+Query, end, 00:00:00.6378994
 
 */