using Microsoft.AspNetCore.Mvc;
using DesignPatterns.Services; // Assuming PrinterQueueService is in the Services namespace
using System.Threading.Tasks;
using DesignPatterns.Models;

namespace DesignPatterns.Controllers // Corrected namespace
{
    [ApiController]
    [Route("api/printer")]
    public class PrinterController : ControllerBase
    {


    // POST api/printer/enqueue
    [HttpPost("enqueue")]
    public async Task<IActionResult> EnqueueJob([FromBody] PrintJob printJob)
    {
        if (printJob == null || string.IsNullOrWhiteSpace(printJob.Job))
        {
            return BadRequest("Print job is required.");
        }

        await PrinterQueueService.Instance.EnqueueJob(printJob.Job);
        return Ok($"Job '{printJob.Job}' enqueued.");
    }


        // GET api/printer/jobs
        [HttpGet("jobs")]
        public IActionResult GetJobs()
        {
            var jobs = PrinterQueueService.Instance.GetJobs();
            return Ok(jobs);
        }
    }
}
