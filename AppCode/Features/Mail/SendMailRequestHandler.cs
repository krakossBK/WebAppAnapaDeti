using MailKit.Net.Smtp;
using MediatR;
using Microsoft.Extensions.Options;
using MimeKit;

namespace WebAppAnapaDeti.AppCode.Features.Mail;

public class SendMailRequestHandler(ILogger<SendMailRequestHandler> logger,
                                    IOptions<AppSettings> options) : IRequestHandler<SendMailCommand>
{
    public async Task Handle(SendMailCommand request, CancellationToken ct)
    {
        if (!options.Value.MailboxConfigs.TryGetValue(request.Config ?? "info", out MailboxConfig? mailbox))
            throw new Exception($"mailbox ({request.Config ?? "info"}) не настроен");

        if (!mailbox.Host.Contains("local"))
        {
            var email = new MimeMessage();
            email.From.Add(mailbox.FromAddress());
            email.To.Add(MailboxAddress.Parse(request.To));

            foreach (var ccEmail in request.Cc)
                email.Cc.Add(MailboxAddress.Parse(ccEmail));

            email.Subject = request.Subject;
            var builder = new BodyBuilder();

            foreach (var file in request.Attachments)
                builder.Attachments.Add(file.Name, file.Body, ContentType.Parse(file.ContentType));

            if (request.TextBody != null)
                builder.TextBody = request.TextBody;

            if (request.HtmlBody != null)
                builder.HtmlBody = request.HtmlBody;

            email.Body = builder.ToMessageBody();
            using var smtp = new SmtpClient();
            smtp.ServerCertificateValidationCallback = (_, _, _, _) => true;

            await smtp.ConnectAsync(mailbox.Host, mailbox.Port, mailbox.Ssl, ct);

            try
            {
                await smtp.AuthenticateAsync(mailbox.Login ?? "", mailbox.Password ?? "", ct);
            }
            catch (Exception e)
            {
                logger.LogError(e, "{Message} {Mailbox}:{Port}", e.Message, mailbox.Host, mailbox.Port);
            }

            await smtp.SendAsync(email, ct);
            await smtp.DisconnectAsync(true, ct);
        }
    }
}