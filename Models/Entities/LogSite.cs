using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAppAnapaDeti.Models.Entities;

[Table("logs", Schema = "dbo")]
public class LogSite
{
    [Key, Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();
    [Column("logtypeid")]
    public int LogTypeId { get; set; }
    [Column("timemsk")]
    public DateTime TimeMsk { get; set; } = DateTime.Now.ToUniversalTime(); //C.MoscowDateTime;
    [Column("message")]
    public required string Message { get; set; }
}
