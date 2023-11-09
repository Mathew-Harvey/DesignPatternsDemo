using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

namespace DesignPatterns.Services
{
    public class PrinterQueueService : IDisposable
    {
        private readonly IHubContext<PrinterHub> _hubContext;
        private readonly ConcurrentQueue<string> _printJobs = new ConcurrentQueue<string>();
        private Timer _processingTimer;

        public PrinterQueueService(IHubContext<PrinterHub> hubContext)
        {
            _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
            // Start the timer with an immediate first tick, then continue every 5 seconds
            _processingTimer = new Timer(ProcessQueue, null, TimeSpan.Zero, TimeSpan.FromSeconds(7));
        }

        private void ProcessQueue(object? state)
        {
            if (_printJobs.IsEmpty)
            {
                // No jobs to process
                return;
            }

            if (_printJobs.TryDequeue(out var jobName))
            {
                // Simulate job processing
                Console.WriteLine($"Processing job: {jobName}");

                // Notify clients that the job is processed
                _hubContext.Clients.All.SendAsync("JobProcessed", jobName).GetAwaiter().GetResult();
            }
        }

        public async Task EnqueueJob(string jobName)
        {
            _printJobs.Enqueue(jobName);
            await _hubContext.Clients.All.SendAsync("NewJobEnqueued", jobName);
        }

        public IEnumerable<string> GetJobs()
        {
            return _printJobs;
        }

        // Dispose pattern for cleaning up the Timer
        public void Dispose()
        {
            _processingTimer?.Dispose();
        }
    }
}
