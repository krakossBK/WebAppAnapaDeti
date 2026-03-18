using System.Diagnostics;
using WebAppAnapaDeti.Models;
using Microsoft.AspNetCore.Mvc;

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

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
