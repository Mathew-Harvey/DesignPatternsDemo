using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DesignPatterns.Models;

namespace DesignPatterns.Controllers
{
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        [HttpGet("/")]
        public ActionResult Home()
        {
            // This could return some basic info or simply a message that the API is up and running
            return Ok(new { Message = "Welcome to the DesignPatterns API" });
        }

        // You might want to keep this action to handle errors in your API
        [HttpGet("/error")]
        public IActionResult Error()
        {
            return Problem(detail: "An unexpected error occurred.", statusCode: 500);
        }
    }
}
