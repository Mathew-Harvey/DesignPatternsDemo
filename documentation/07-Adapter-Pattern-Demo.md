# Session 7: Implementing the Adapter Pattern Demo

## Goal
Implement the Adapter pattern to allow objects with incompatible interfaces to collaborate. This pattern is useful for integrating third-party libraries or legacy systems without modifying the original code.

## Pseudocode
```csharp
// The 'Adaptee' class, which has a different interface
public class LegacyReportGenerator {
    public string GenerateReportData() {
        return "Report data in legacy format";
    }
}

// The 'ITarget' interface, which is used by the client code
public interface IReportTarget {
    string GetReportData();
}

// The 'Adapter' class, which makes the Adaptee's interface compatible with the ITarget interface
public class ReportAdapter : IReportTarget {
    private LegacyReportGenerator legacyGenerator;

    public ReportAdapter(LegacyReportGenerator legacyGenerator) {
        this.legacyGenerator = legacyGenerator;
    }

    public string GetReportData() {
        // Convert the legacy format to the one expected by the client
        string legacyData = legacyGenerator.GenerateReportData();
        return $"Adapted Report Data: {legacyData}";
    }
}

// AdapterDemoController.cs
public class AdapterDemoController : Controller {
    public IActionResult Index() {
        LegacyReportGenerator legacyGenerator = new LegacyReportGenerator();
        IReportTarget adapter = new ReportAdapter(legacyGenerator);

        string reportData = adapter.GetReportData();
        ViewBag.ReportData = reportData;
        
        return View();
    }
}

```

Tasks
Define a LegacyReportGenerator class, representing an existing or third-party system with an incompatible interface.
Create an IReportTarget interface that the client expects to use.
Implement a ReportAdapter class that wraps the LegacyReportGenerator and presents the interface the client expects.
Develop an AdapterDemoController that demonstrates using the Adapter to access the functionality of the LegacyReportGenerator.
Hosting Solution
Maintain development locally to ensure the adapter correctly bridges the interface gap.
Evaluate application readiness for deployment on Heroku/Azure and GitHub Pages, making necessary adjustments for hosting environments.
Expected Outcome
A web page that effectively demonstrates the use of the Adapter pattern, allowing the client to interact with legacy code or third-party libraries seamlessly.
Clear illustration of the adapter’s role in translating calls between the client and the system being adapted.
Time Allocation
Development of the legacy system adapter: 1 hour.
Controller and routing setup: 1 hour.
Creation and styling of the demo interface: 1 hour.
Testing and troubleshooting: 1 hour.
vbnet
Copy code

The seventh session illustrates the use of the Adapter pattern, which is critical for integrating systems with disparate interfaces. Up next, we'll explore the eighth design pattern demonstration.
Save to grepper



User
next
ChatGPT
The final session focuses on the Composite pattern. Here's the Markdown file detailing how to build a demonstration for it.

08-Composite-Pattern-Demo.md

markdown
Copy code
# Session 8: Implementing the Composite Pattern Demo

## Goal
Showcase the Composite pattern, which allows clients to treat individual objects and compositions of objects uniformly. It is particularly useful for representing part-whole hierarchies.

## Pseudocode
```csharp
// Component base class
public abstract class FileSystemComponent {
    public string Name { get; set; }
    public abstract void Display(int depth);
}

// Leaf
public class File : FileSystemComponent {
    public File(string name) {
        Name = name;
    }

    public override void Display(int depth) {
        Console.WriteLine(new String('-', depth) + Name);
    }
}

// Composite
public class Directory : FileSystemComponent {
    private List<FileSystemComponent> _children = new List<FileSystemComponent>();

    public Directory(string name) {
        Name = name;
    }

    public void Add(FileSystemComponent component) {
        _children.Add(component);
    }

    public override void Display(int depth) {
        Console.WriteLine(new String('-', depth) + Name);

        foreach (FileSystemComponent component in _children) {
            component.Display(depth + 2);
        }
    }
}

// CompositeDemoController.cs
public class CompositeDemoController : Controller {
    public IActionResult Index() {
        // Create a file tree
        Directory root = new Directory("Root");
        root.Add(new File("File1.txt"));
        
        Directory subDirectory = new Directory("SubDirectory");
        subDirectory.Add(new File("File2.txt"));
        subDirectory.Add(new File("File3.txt"));

        root.Add(subDirectory);
        
        // Use a StringBuilder and a recursive helper function to gather display string
        StringBuilder displayBuilder = new StringBuilder();
        root.Display(0, displayBuilder);
        ViewBag.FileTreeDisplay = displayBuilder.ToString();
        
        return View();
    }
}
```
## Tasks
Implement a FileSystemComponent abstract class representing both files and directories.
Create File and Directory classes that inherit from FileSystemComponent.
The Directory class should be able to store children of type FileSystemComponent, which can be both File and Directory instances.
Build a CompositeDemoController to create a directory tree and display it.
## Hosting Solution
Finalize local development, ensuring that the composite structure operates as intended.
Deploy the web application through Heroku/Azure and use GitHub Pages for static content, adjusting for any hosting-specific configurations.
## Expected Outcome
A web page that dynamically illustrates the Composite pattern, with the ability to display a nested file system structure.
## Time Allocation
Development of the legacy system adapter: 1 hour.
Controller and routing setup: 1 hour.
Creation and styling of the demo interface: 1 hour.
Testing and troubleshooting: 1 hour.
