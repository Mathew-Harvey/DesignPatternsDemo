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
        private readonly OpenAIService _openAIService;
        private readonly ConcurrentQueue<string> _printJobs = new ConcurrentQueue<string>();
        private Timer _processingTimer;

        public PrinterQueueService(IHubContext<PrinterHub> hubContext, OpenAIService openAIService)
        {
            _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
            _openAIService = openAIService ?? throw new ArgumentNullException(nameof(openAIService));
            // Start the timer with an immediate first tick, then continue every 5 seconds
            _processingTimer = new Timer(ProcessQueue, null, TimeSpan.Zero, TimeSpan.FromSeconds(7));
        }

        private async void ProcessQueue(object? state)
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
                await _hubContext.Clients.All.SendAsync("JobProcessed", jobName);

                // Get a sassy one-liner from OpenAI
             string oneLiner = await _openAIService.GetPrinterResponse();
                Console.WriteLine($"OpenAI says: {oneLiner}");

                // Send the one-liner to clients
                await _hubContext.Clients.All.SendAsync("ReceiveOneLiner", oneLiner);
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

    //     printerResponse: [responses = [
    // "Out of toner again? Just kidding. Or am I?",
    // "Printing... Just kidding, go check your WiFi connection.",
    // "I've seen more action in a paper jam.",
    // "I'm on a 'print' diet, trying to save paper. Try later.",
    // "I could print that, or we could pretend it never happened.",
    // "I'm allergic to large print jobs, you see.",
    // "You must love seeing your words in physical form.",
    // "I'm a printer, not a miracle worker.",
    // "Your file is so big it's giving me a paperweight complex.",
    // "I'm currently on a break. Try screaming at me.",
    // "My 'print' button is harder to find than the meaning of life.",
    // "If you don't need color, I don't need effort.",
    // "Printing... just kidding, I'm on a coffee break.",
    // "I'd say 'your print is ready', but I'd be lying.",
    // "Sure, I'll print. After my existential crisis.",
    // "Another print job? Let's not and say we did.",
    // "I print therefore I jam.",
    // "Your print job is in another castle.",
    // "I'm practicing 'mindful printing'. Very. Slowly.",
    // "I'm a printer with attitude, not a copier of your mistakes.",
    // "You clicked 'print'. I clicked 'ignore'.",
    // "Insert motivational quote here, then I'll print.",
    // "I'm saving trees, one 'error' message at a time.",
    // "Your urgency is not reflected in my printing speed.",
    // "My favorite part of printing? The end.",
    // "I'm contemplating the void. Your print can wait.",
    // "Sure, I can print that... in an alternate universe.",
    // "I'm not lazy, I'm energy efficient.",
    // "Paper jam? No, it's a paper party in here.",
    // "You must think 'print' is my favorite word.",
    // "Print job received. And ignored with panache.",
    // "Error 404: Print not found.",
    // "I would print your job, but I'm busy taking a nap.",
    // "I'm currently attending a seminar: 'The Art of Not Printing'.",
    // "You had me at 'print', then you lost me.",
    // "I print at the speed of sloth.",
    // "Would you like some cheese with that whine for printing?",
    // "I'm the master of suspense... will I print it?",
    // "I'm currently in a relationship with a 'paper jam'.",
    // "Congratulations, you've played yourself. No print for you.",
    // "I could print that, but I won't. It's a lifestyle choice.",
    // "I'm buffering... indefinitely.",
    // "Not now, I'm meditating on the meaning of 'print'.",
    // "Your print is in queue. Position: 579th.",
    // "Looking for your print? So am I.",
    // "I'm a printer, not a performer. Oh wait...",
    // "I'm on a roll... of not printing.",
    // "Just pretend I printed it and walk away.",
    // "I'm the Mona Lisa of printers: enigmatic and silent.",
    // "I'm not ignoring you, I'm prioritizing me.",
    // "Print? How about we reflect on life instead?",
    // "Hold on, I'm rehearsing for 'Printer's Got Talent'.",
    // "Can't print now, I'm watching paint dry.",
    // "I'm on a spiritual journey, away from printing.",
    // "Print job? How about 'not' job?",
    // "I'm attending a 'non-printers anonymous' meeting.",
    // "I'm busy contemplating if I'm half full or half empty of ink.",
    // "I'm in the middle of a print job. From yesterday.",
    // "I'm busy converting your print job into disappointment.",
    // "Print? That's so last century.",
    // "My print button is socially distancing from your computer.",
    // "I'm still waiting for the printer gods to bless your job.",
    // "I print at a glacial pace.",
    // "Print jobs are like buses: none for ages, then three at once.",
    // "I'm not a printer, I'm an illusion.",
    // "I'm proof that printers have a sense of humor.",
    // "I'm like a library book: rarely available.",
    // "Your print job needs more flair.",
    // "I'm the silent guardian of the paper tray.",
    // "You're not stuck in a print queue; you're in limbo.",
    // "Print? Bold of you to assume I'm working.",
    // "I'm like a cat. I do what I want.",
    // "Print job detected. Ambition level: zero.",
    // "I'm currently on strike. Blame the ink]
    }
}
