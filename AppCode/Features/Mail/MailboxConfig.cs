using MailKit.Security;
using MimeKit;

namespace WebAppAnapaDeti.AppCode.Features.Mail;

public record MailboxConfig
{
    public Guid Id { get; set; }
    public required string From { get; set; }
    public required string Host { get; set; }
    public int Port { get; set; }
    public string? Login { get; set; }
    public string? Password { get; set; }

    public SecureSocketOptions Ssl { get; set; } = SecureSocketOptions.None; //.Auto;

    public MailboxAddress FromAddress() => MailboxAddress.Parse(From);
}