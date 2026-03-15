using WebAppAnapaDeti.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace WebAppAnapaDeti.DAL;

public partial class WebAppAnapaDetiDbContext
{
    public virtual DbSet<LogSite> LogSites { get; set; }

    public virtual DbSet<User> Users { get; set; }
}