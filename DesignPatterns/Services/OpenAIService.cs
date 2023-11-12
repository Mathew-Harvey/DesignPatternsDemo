using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

public class OpenAIService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public OpenAIService(HttpClient httpClient, string apiKey)
    {
        _httpClient = httpClient;
        _apiKey = apiKey;
    }

    public async Task<string> GetPrinterResponse()
    {
        var messages = new List<Message>
        {
            new Message
            {
                role = "system",
                content = "You are an office printer, you love douglas adams and have dry sarcastic wit and dark humor. Give me a short one liner that you might say back to someone asking you to print. It should be brief enough to fit in a speech bubble"

            }
            // Additional messages can be added here if needed
        };

        return await GetChatResponseAsync(messages);
    }

    public async Task<string> GetChatResponseAsync(List<Message> messages)
    {
        var data = new
        {
            model = "gpt-3.5-turbo",
            messages = messages.Select(m => new { m.role, m.content }).ToList()
        };

        var content = new StringContent(JsonSerializer.Serialize(data), System.Text.Encoding.UTF8, "application/json");
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

        var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"OpenAI API Error: {errorContent}");
            return "Oops! I encountered an issue and couldn't generate a response.";
        }

        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Raw response from OpenAI: {responseString}"); // Log the raw response
        var result = JsonSerializer.Deserialize<ChatResponse>(responseString);

        // Write the AI's response to the console
        string aiResponse = result?.Choices?.FirstOrDefault()?.Message?.content ?? string.Empty;
        Console.WriteLine($"AI Response: {aiResponse}");

        return aiResponse;
    }

    public class Message
    {
        public string role { get; set; }
        public string content { get; set; }
    }

    private class ChatResponse
    {
        public List<Choice> Choices { get; set; }
    }

    private class Choice
    {
        public Message Message { get; set; }
    }
}
