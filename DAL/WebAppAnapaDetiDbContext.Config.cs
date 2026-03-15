using Microsoft.EntityFrameworkCore;

namespace WebAppAnapaDeti.DAL;

public partial class WebAppAnapaDetiDbContext
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Cyrillic_General_CI_AS");

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}