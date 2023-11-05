# Session 3: Implementing the Factory Method Pattern Demo

## Goal
Implement a page that uses the Factory Method pattern to create different types of responses based on user input. This will demonstrate the pattern's use in creating objects without specifying the exact class of object that will be created.

## Pseudocode
```csharp
// Define an interface for creating an object in ResponseFactory.cs
public interface IResponseFactory {
    IResponse CreateResponse(string type);
}

// Concrete classes implementing the IResponse interface
public class SuccessResponse : IResponse {
    public string Message { get; } = "Success";
}

public class ErrorResponse : IResponse {
    public string Message { get; } = "Error";
}

// Concrete factory class in ResponseFactory.cs
public class ResponseFactory : IResponseFactory {
    public IResponse CreateResponse(string type) {
        switch (type) {
            case "success":
                return new SuccessResponse();
            case "error":
                return new ErrorResponse();
            default:
                throw new ArgumentException("Invalid type", nameof(type));
        }
    }
}

// FactoryDemoController.cs
public class FactoryDemoController : Controller {
    private readonly IResponseFactory _responseFactory;

    public FactoryDemoController(IResponseFactory responseFactory) {
        _responseFactory = responseFactory;
    }

    public IActionResult Index(string responseType) {
        IResponse response = _responseFactory.CreateResponse(responseType);
        return View(response);
    }
}

```

## Tasks
Define the IResponseFactory interface and ResponseFactory class.
Implement concrete SuccessResponse and ErrorResponse classes.
Create a FactoryDemoController that uses ResponseFactory to serve responses.
Develop the view for the Factory Method pattern that allows users to request different response types and see the resulting object.
## Hosting Solution
Continue local development and testing.
Update deployment plans for Heroku/Azure and GitHub Pages as necessary, ensuring that the web app's dynamic components are deployable.
## Expected Outcome
A working demo page for the Factory Method pattern, capable of dynamically creating different response objects based on user interaction.
A clear illustration of how the Factory Method can provide flexibility and decouple object creation in a web application.
## Time Allocation
Implementation of the interface and classes: 1.5 hours.
Controller logic and routing: 1 hour.
View development and interactive elements: 1 hour.
Integration testing and refinement: 0.5 hours.
