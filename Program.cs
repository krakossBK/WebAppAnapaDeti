using WebAppAnapaDeti.AppCode;
using WebAppAnapaDeti.DAL;
using WebAppAnapaDeti.Infrastructure.Behaviors;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
//using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Text.Encodings.Web;
using System.Text.Unicode;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
IServiceCollection services = builder.Services;

services.AddHealthChecks();  //metanit.com/sharp/aspnet6/18.1.php
services.AddControllersWithViews()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.PropertyNamingPolicy = null);
services.AddSingleton(HtmlEncoder.Create(UnicodeRanges.BasicLatin, UnicodeRanges.Cyrillic));

services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
        options.SlidingExpiration = true;
        options.LoginPath = "/Login";
        options.AccessDeniedPath = "/Login/";
    })
    .AddBearerToken();

services.AddDistributedMemoryCache();
services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
});


services.AddHttpContextAccessor();

// добавление кэширования
services.AddMemoryCache();
services.AddOutputCache();
// добавление кэширования

services
    .AddDbContext<ChatFreCoreDbContext>(
        options => options.UseNpgsql(builder.Configuration.GetConnectionString("connStr"), c => c
                .UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)
                .MigrationsAssembly(typeof(Program).Assembly))
            //todo fixme
            .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
            //.UseLazyLoadingProxies()
            .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
            .EnableDetailedErrors()
            .EnableSensitiveDataLogging()
    )
    .AddScoped<IAppDbContext, ChatFreCoreDbContext>();

services.AddMediatR(config =>
{
    config.RegisterServicesFromAssemblyContaining<Program>();
    config.AddOpenBehavior(typeof(LoggingPipelineBehavior<,>));
});

services.AddDistributedMemoryCache();
services.AddSession();

TypeAdapterConfig.GlobalSettings.Scan(AppDomain.CurrentDomain.GetAssemblies());
services.AddSingleton(TypeAdapterConfig.GlobalSettings);

services.AddScoped<LogSiteHelper>();



services.AddControllers();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    //////// обработка ошибок HTTP
    //////app.UseStatusCodePages(async statusCodeContext =>
    //////{
    //////    var response = statusCodeContext.HttpContext.Response;
    //////    var path = statusCodeContext.HttpContext.Request.Path;

    //////    response.ContentType = "text/plain; charset=UTF-8";
    //////    if (response.StatusCode == 403)
    //////    {
    //////        await response.WriteAsync($"Path: {path}. Access Denied ");
    //////    }
    //////    else if (response.StatusCode == 404)
    //////    {
    //////        await response.WriteAsync($"Resource {path} Not Found");
    //////    }
    //////});

    app.UseDeveloperExceptionPage();
    //app.UseExceptionHandler("/Error");
    //app.UseStatusCodePagesWithReExecute("/Error/{0}");
}

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.UseSession();

app.Map("/error/{statusCode}", (int statusCode) => $"Error. Status Code: {statusCode}");

app.MapHealthChecks("/health"); //metanit.com/sharp/aspnet6/18.1.php
app.MapDefaultControllerRoute();

app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
);

app.Run();