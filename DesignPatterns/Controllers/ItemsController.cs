using Microsoft.AspNetCore.Mvc;
using DesignPatterns.Models; 
using DesignPatterns.Repositories; 
using System.Threading.Tasks;

namespace DesignPatterns.Controllers
{
    public class ItemsController : Controller
    {
        private readonly ItemRepository _itemRepository;

        public ItemsController(ItemRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

        // GET: Items
        public async Task<IActionResult> Index()
        {
            var items = await _itemRepository.GetAllAsync();
            return View(items);
        }

        // GET: Items/Details/5
        public async Task<IActionResult> Details(string id)
        {
            var item = await _itemRepository.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return View(item);
        }

        // GET: Items/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Items/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Description")] Item item)
        {
            if (ModelState.IsValid)
            {
                await _itemRepository.AddAsync(item);
                return RedirectToAction("Index", "Home");
            }
            return View(item);
        }

        // GET: Items/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            var item = await _itemRepository.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return View(item);
        }

        // POST: Items/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("Id,Name,Description")] Item item)
        {
            if (id != item.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                var success = await _itemRepository.UpdateAsync(id, item);
                if (!success)
                {
                    return NotFound(); // Or some other error handling
                }
                return RedirectToAction("Index", "Home");
            }
            return View(item);
        }

        // GET: Items/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            var item = await _itemRepository.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return View(item);
        }

        // POST: Items/Delete/5
        [HttpPost, ActionName("DeleteConfirmed")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var success = await _itemRepository.DeleteAsync(id);
            if (!success)
            {
                return NotFound(); // Or some other error handling
            }
            return RedirectToAction("Index", "Home");
        }
        
    }
}
