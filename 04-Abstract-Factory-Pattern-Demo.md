# Session 4: Implementing the Abstract Factory Pattern Demo

## Goal
Implement a page that demonstrates the Abstract Factory pattern, which allows the creation of families of related or dependent objects without specifying their concrete classes.

## Pseudocode
```csharp
// Abstract factories define methods to create different types of objects
public interface IWidgetFactory {
    IButton CreateButton();
    ITextbox CreateTextbox();
}

// Concrete factories implement those methods to create specific object families
public class DarkThemeWidgetFactory : IWidgetFactory {
    public IButton CreateButton() => new DarkButton();
    public ITextbox CreateTextbox() => new DarkTextbox();
}

public class LightThemeWidgetFactory : IWidgetFactory {
    public IButton CreateButton() => new LightButton();
    public ITextbox CreateTextbox() => new LightTextbox();
}

// Abstract product interfaces define methods that the products must implement
public interface IButton { string Render(); }
public interface ITextbox { string Render(); }

// Concrete products implement the product interfaces for a specific variant
public class DarkButton : IButton { public string Render() => "Dark Button"; }
public class LightButton : IButton { public string Render() => "Light Button"; }
public class DarkTextbox : ITextbox { public string Render() => "Dark Textbox"; }
public class LightTextbox : ITextbox { public string Render() => "Light Textbox"; }

// AbstractFactoryDemoController.cs
public class AbstractFactoryDemoController : Controller {
    public IActionResult Index(string theme) {
        IWidgetFactory widgetFactory = theme switch {
            "dark" => new DarkThemeWidgetFactory(),
            "light" => new LightThemeWidgetFactory(),
            _ => throw new ArgumentException("Invalid theme", nameof(theme)),
        };
        
        var button = widgetFactory.CreateButton();
        var textbox = widgetFactory.CreateTextbox();

        // Pass the rendered button and textbox to the view
        return View((button.Render(), textbox.Render()));
    }
}
```

## Tasks
Define IWidgetFactory, IButton, and ITextbox interfaces.
Implement two concrete factories (DarkThemeWidgetFactory and LightThemeWidgetFactory) that create dark and light themed UI elements.
Create concrete Button and Textbox classes for each theme.
Develop an AbstractFactoryDemoController to handle the creation and rendering of UI elements based on the theme.
Build a view that allows users to switch between themes and see the corresponding UI elements created by the factories.
## Hosting Solution
Continue development locally for testing all interactive components.
Evaluate the application for any adjustments required before deploying to Heroku/Azure and GitHub Pages.
## Expected Outcome
A page illustrating the Abstract Factory pattern, capable of generating entire sets of UI elements that belong to different theme families.
Enhanced understanding of how Abstract Factory pattern can be used for managing families of related objects without tying code to specific classes.
## Time Allocation
Interface and class structure implementation: 1.5 hours.
Controller logic for theme management: 1 hour.
Interactive view for theme selection and display: 1 hour.
Testing and ensuring seamless theme transition: 0.5 hours.
