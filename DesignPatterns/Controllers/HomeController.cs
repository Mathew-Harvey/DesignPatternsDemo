using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DesignPatterns.Models;
using DesignPatterns.Repositories;
using System.Threading.Tasks;

namespace DesignPatterns.Controllers
{

    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ItemRepository _itemRepository;

        public HomeController(ILogger<HomeController> logger, ItemRepository itemRepository)
        {
            _logger = logger;
            _itemRepository = itemRepository;
        }


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public async Task<IActionResult> Index()
        {
            var items = await _itemRepository.GetAllAsync();
            // Ensure items is not null. If items is null, initialize it to an empty list.
            if (items == null)
            {
                items = new List<Item>();
            }
            return View(items);
        }

    }
}