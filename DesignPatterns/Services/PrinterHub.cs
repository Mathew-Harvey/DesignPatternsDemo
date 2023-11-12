using DesignPatterns.Services;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class PrinterHub : Hub
{
    private readonly OpenAIService _openAIService;
    private readonly PrinterQueueService _printerQueueService;

    public PrinterHub(OpenAIService openAIService, PrinterQueueService printerQueueService)
    {
        _openAIService = openAIService;
        _printerQueueService = printerQueueService;
    }

    // Call this method from the client to get the sassy response
    public async Task GetSassyPrinterResponse()
    {
        var response = await _openAIService.GetPrinterResponse();
        await Clients.Caller.SendAsync("ReceiveSassyResponse", response);
    }
}
