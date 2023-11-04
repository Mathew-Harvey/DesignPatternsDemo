# Session 5: Implementing the Builder Pattern Demo

## Goal
Showcase the Builder pattern to construct a complex object step by step, providing a way to build objects without exposing the construction logic and allowing the same construction process to create different representations.

## Pseudocode
```csharp
// The 'Product' class
public class Report {
    public string Title { get; set; }
    public string Content { get; set; }
    // Other necessary fields and properties
}

// The 'Builder' abstract class
public abstract class ReportBuilder {
    protected Report report;
    
    public void CreateNewReport() {
        report = new Report();
    }
    
    public Report GetReport() {
        return report;
    }
    
    public abstract void SetReportTitle();
    public abstract void SetReportContent();
    // Other necessary steps
}

// Concrete builders implementing the ReportBuilder abstract class
public class FinancialReportBuilder : ReportBuilder {
    public override void SetReportTitle() {
        report.Title = "Financial Report";
    }
    
    public override void SetReportContent() {
        report.Content = "This is the financial report content.";
    }
    // Implement other steps...
}

public class MarketingReportBuilder : ReportBuilder {
    public override void SetReportTitle() {
        report.Title = "Marketing Report";
    }
    
    public override void SetReportContent() {
        report.Content = "This is the marketing report content.";
    }
    // Implement other steps...
}

// The 'Director' class
public class ReportDirector {
    private ReportBuilder builder;
    
    public ReportDirector(ReportBuilder builder) {
        this.builder = builder;
    }
    
    public void ConstructReport() {
        builder.CreateNewReport();
        builder.SetReportTitle();
        builder.SetReportContent();
        // Other necessary steps...
    }
    
    public Report GetReport() {
        return builder.GetReport();
    }
}

// BuilderDemoController.cs
public class BuilderDemoController : Controller {
    public IActionResult Index(string reportType) {
        ReportBuilder builder = reportType switch {
            "financial" => new FinancialReportBuilder(),
            "marketing" => new MarketingReportBuilder(),
            _ => throw new ArgumentException("Invalid report type", nameof(reportType)),
        };
        
        ReportDirector director = new ReportDirector(builder);
        director.ConstructReport();
        Report report = director.GetReport();
        
        return View(report);
    }
}

```


We'll proceed to the fifth Markdown file, which will guide you through incorporating the Builder pattern into your web application.

05-Builder-Pattern-Demo.md

markdown
Copy code
# Session 5: Implementing the Builder Pattern Demo

## Goal
Showcase the Builder pattern to construct a complex object step by step, providing a way to build objects without exposing the construction logic and allowing the same construction process to create different representations.

## Pseudocode
```csharp
// The 'Product' class
public class Report {
    public string Title { get; set; }
    public string Content { get; set; }
    // Other necessary fields and properties
}

// The 'Builder' abstract class
public abstract class ReportBuilder {
    protected Report report;
    
    public void CreateNewReport() {
        report = new Report();
    }
    
    public Report GetReport() {
        return report;
    }
    
    public abstract void SetReportTitle();
    public abstract void SetReportContent();
    // Other necessary steps
}

// Concrete builders implementing the ReportBuilder abstract class
public class FinancialReportBuilder : ReportBuilder {
    public override void SetReportTitle() {
        report.Title = "Financial Report";
    }
    
    public override void SetReportContent() {
        report.Content = "This is the financial report content.";
    }
    // Implement other steps...
}

public class MarketingReportBuilder : ReportBuilder {
    public override void SetReportTitle() {
        report.Title = "Marketing Report";
    }
    
    public override void SetReportContent() {
        report.Content = "This is the marketing report content.";
    }
    // Implement other steps...
}

// The 'Director' class
public class ReportDirector {
    private ReportBuilder builder;
    
    public ReportDirector(ReportBuilder builder) {
        this.builder = builder;
    }
    
    public void ConstructReport() {
        builder.CreateNewReport();
        builder.SetReportTitle();
        builder.SetReportContent();
        // Other necessary steps...
    }
    
    public Report GetReport() {
        return builder.GetReport();
    }
}

// BuilderDemoController.cs
public class BuilderDemoController : Controller {
    public IActionResult Index(string reportType) {
        ReportBuilder builder = reportType switch {
            "financial" => new FinancialReportBuilder(),
            "marketing" => new MarketingReportBuilder(),
            _ => throw new ArgumentException("Invalid report type", nameof(reportType)),
        };
        
        ReportDirector director = new ReportDirector(builder);
        director.ConstructReport();
        Report report = director.GetReport();
        
        return View(report);
    }
}
```
## Tasks
Define the Report class to act as the 'Product'.
Create an abstract ReportBuilder class that defines the steps needed to build a report.
Implement concrete builder classes for different types of reports (e.g., FinancialReportBuilder, MarketingReportBuilder).
Develop a ReportDirector class that uses the builders to construct reports.
Build a BuilderDemoController and associated view that lets users create different types of reports using the Builder pattern.
## Hosting Solution
Continue local development and thorough testing.
Assess the app for deployment readiness and identify any necessary modifications for deployment on Heroku/Azure and GitHub Pages.
## Expected Outcome
A web page that demonstrates the Builder pattern, allowing users to construct different types of reports with a consistent construction process.
Clear separation of the construction process and the representation of the object to be built, showing the flexibility of the Builder pattern.
## Time Allocation
Implementation of builders and product class: 1.5 hours.
Setup of the ReportDirector and its integration with builders: 1 hour.
Creation and styling of the interactive demo view: 1 hour.
Final testing and quality assurance: 0.5 hours.
