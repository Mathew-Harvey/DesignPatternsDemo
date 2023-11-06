using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class PrinterHub : Hub
{
    // This method can be called by clients to send a new print job
    public async Task SendPrintJob(string jobName)
    {
        // You might add logic here to enqueue the job to the server-side printer queue

        // Notify all clients that a new job has been added
        await Clients.All.SendAsync("NewJobReceived", jobName);
    }

    // This method can be called from the server to notify clients that a job is processed
    public async Task JobProcessed(string jobName)
    {
        // Notify all clients that a job has been processed
        await Clients.All.SendAsync("JobProcessed", jobName);
    }

    // This method can be called from the server to update the entire queue status
    public async Task UpdateQueue(string[] queue)
    {
        // Notify all clients with the updated queue
        await Clients.All.SendAsync("QueueUpdated", queue);
    }

    // Additional methods for other real-time interactions can be added here
}
