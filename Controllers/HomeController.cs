using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebAppAnapaDeti.Models;

namespace WebAppAnapaDeti.Controllers
{
    public class HomeController(ILogger<HomeController> logger) : Controller
    {
        private readonly ILogger<HomeController> _logger = logger;

        public IActionResult Index()
        {
            _logger.LogInformation("Index");
            return View();
        }
        public IActionResult Contacts()
        {
            _logger.LogInformation("Contacts");
            return View();
        }
        [HttpGet("/politika-konfidentsialnosti")]
        [AllowAnonymous]
        public IActionResult PolitikaPDn()
        {
            _logger.LogInformation("PolitikaPDN");
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
