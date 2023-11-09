using Microsoft.AspNetCore.Mvc;
using DesignPatterns.Services;
using System.Threading.Tasks;
using DesignPatterns.Models;

namespace DesignPatterns.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrinterController : ControllerBase
    {
        private readonly PrinterQueueService _printerQueueService;

        public PrinterController(PrinterQueueService printerQueueService)
        {
            _printerQueueService = printerQueueService;
        }

        // POST api/printer/enqueue
        [HttpPost("enqueue")]
        public async Task<IActionResult> EnqueueJob([FromBody] PrintJob printJob)
        {
            if (printJob == null || string.IsNullOrWhiteSpace(printJob.JobName))
            {
                return BadRequest("Print job is required.");
            }

            await _printerQueueService.EnqueueJob(printJob.JobName);
            return Ok(new { Message = $"Job '{printJob.JobName}' enqueued.", JobName = printJob.JobName });
        }

        // GET api/printer/jobs
        [HttpGet("jobs")]
        public IActionResult GetJobs()
        {
            var jobs = _printerQueueService.GetJobs();
            return Ok(jobs);
        }
    }
}
