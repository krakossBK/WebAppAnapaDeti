using MediatR;

namespace WebAppAnapaDeti.AppCode.Features.Mail;

public record SendMailCommand(string To,
    string Subject, 
    string? HtmlBody = null, 
    string? TextBody = null) : IRequest
{
    public List<MailFile> Attachments { get; set; } = [];
    public List<string> Cc { get; set; } = [];

    public string? Config { get; set; }
}

public record MailFile(string Name, 
    byte[] Body, 
    string ContentType)
{
    public static async Task<MailFile> From(string name, 
        Stream stream, 
        string? contentType = null)
    {
        using var ms = new MemoryStream();
        await stream.CopyToAsync(ms);

        return new MailFile(name, ms.ToArray(), contentType);
    }
}