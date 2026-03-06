using WebAppAnapaDeti.AppCode;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAppAnapaDeti.Models.Entities;

[Table("logs", Schema = "dbo")]
public class LogSite
{
    [Key, Column("id")]
    public int Id { get; set; }
    [Column("logtypeid")]
    public int LogTypeId { get; set; }
    [Column("timemsk")]
    public DateTime TimeMsk { get; set; } = C.MoscowDateTime;
    [Column("message")]
    public required string Message { get; set; }
}
