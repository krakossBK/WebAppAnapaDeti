using WebAppAnapaDeti.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace WebAppAnapaDeti.DAL;

public partial class ChatFreCoreDbContext
{
    public virtual DbSet<LogSite> LogSites { get; set; }
}