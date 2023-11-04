<img src="02-Singleton.webp" alt="Singleton" width="300"/>
# Session 2: Implementing the Singleton Pattern Demo

## Goal
Develop a page within the web application that demonstrates the Singleton design pattern. This page will show how the Singleton instance is created and accessed.

## Pseudocode
```csharp
// Extend the existing Singleton for logging purposes in LoggerSingleton.cs
public sealed class LoggerSingleton {
    private static readonly LoggerSingleton _instance = new LoggerSingleton();
    private List<string> _logMessages = new List<string>();

    private LoggerSingleton() { }

    public static LoggerSingleton Instance {
        get {
            return _instance;
        }
    }

    public void LogMessage(string message) {
        _logMessages.Add(message);
    }

    public IEnumerable<string> GetLogMessages() {
        return _logMessages.AsReadOnly();
    }
}

// SingletonDemoController.cs
public class SingletonDemoController : Controller {
    public IActionResult Index() {
        // Use LoggerSingleton to log a message
        LoggerSingleton.Instance.LogMessage("SingletonDemo page visited at " + DateTime.Now.ToString());
        // Pass log messages to the view
        return View(LoggerSingleton.Instance.GetLogMessages());
    }
}
```
## Tasks
Implement the LoggerSingleton class with thread-safety considerations.
Create a new controller SingletonDemoController with an Index action.
Develop the view for the Singleton pattern, displaying the log messages.
Ensure the Singleton instance is used to log messages every time the page is accessed.
## Hosting Solution
Continue using localhost for development.
Prepare for Heroku/Azure deployment, ensuring environment variables are set for MongoDB credentials.
Ensure the frontend can be deployed on GitHub Pages if static, or consider Heroku/Azure for dynamic content.
## Expected Outcome
A Singleton pattern demo page that logs and displays visit timestamps.
Clear understanding of how the Singleton pattern works in a real-world scenario.
## Time Allocation
LoggerSingleton implementation: 1 hour.
Controller and routing for Singleton page: 1 hour.
View development for Singleton logging: 1 hour.
Testing and refinement: 1 hour.
