using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DesignPatterns.Services
{
    public class PrinterQueueService : IDisposable
    {
        private static readonly Lazy<PrinterQueueService> _instance = new Lazy<PrinterQueueService>(() => new PrinterQueueService());
        private IHubContext<PrinterHub> _hubContext;
        private readonly Queue<string> _printJobs = new Queue<string>();
        private Timer _processingTimer;

        private PrinterQueueService()
        {
            // Start the timer with an immediate first tick, then continue every 5 seconds
            _processingTimer = new Timer(ProcessQueue, null, TimeSpan.Zero, TimeSpan.FromSeconds(5));
        }

        public static PrinterQueueService Instance => _instance.Value;

        public void SetHubContext(IHubContext<PrinterHub> hubContext)
        {
            _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        }

        private void ProcessQueue(object? state)
        {
            if (_printJobs.Count == 0)
            {
                // No jobs to process
                return;
            }

            // Dequeue and process the job
            var jobName = _printJobs.Dequeue();

            // Simulate job processing
            Console.WriteLine($"Processing job: {jobName}");

            // Notify clients that the job is processed
            _hubContext.Clients.All.SendAsync("JobProcessed", jobName).GetAwaiter().GetResult();
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
