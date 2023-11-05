# Session 8: Implementing the Decorator Pattern

# Session 5: Decorator Pattern

## Goal
Implement the Decorator pattern to dynamically add new functionalities to objects without altering their structure.

## Pseudocode
```csharp
// Define the Component interface
public interface IBeverage {
    string GetDescription();
    double GetCost();
}

// Implement the ConcreteComponent class
public class Coffee : IBeverage {
    public string GetDescription() => "Coffee";
    public double GetCost() => 1.99;
}

// Create the Decorator base class
public abstract class BeverageDecorator : IBeverage {
    protected IBeverage _beverage;

    public BeverageDecorator(IBeverage beverage) {
        _beverage = beverage;
    }

    public virtual string GetDescription() => _beverage.GetDescription();
    public virtual double GetCost() => _beverage.GetCost();
}

// Implement ConcreteDecorators
public class MilkDecorator : BeverageDecorator {
    public MilkDecorator(IBeverage beverage) : base(beverage) {}

    public override string GetDescription() => $"{_beverage.GetDescription()}, Milk";
    public override double GetCost() => _beverage.GetCost() + 0.50;
}

// More decorators like SugarDecorator, ChocolateDecorator can be added

```

## Tasks
Create an interface for the core functionality.
Implement the core object(s) following the interface.
Create a decorator abstract class that implements the interface and contains a reference to an object of the same interface.
Implement decorator classes that add functionalities to the core objects.
Set up a controller endpoint that demonstrates adding decorators to a base object and returns the result.
User Story
As a user, when I visit the Decorator pattern page, I should be able to select different add-ons for my coffee and see the updated description and cost dynamically.

## Hosting Solution
Continue using local development and consider deploying to Heroku or Azure as previously discussed.

## Expected Outcome
A clear demonstration of the Decorator pattern where users can interact with the system to add features (decorators) to a base object.

## Time Allocation
Interface and core class setup: 1 hour.
Decorator classes implementation: 1 hour.
Endpoint creation and business logic: 1 hour.
Frontend UI for interaction and dynamic display: 1 hour.
