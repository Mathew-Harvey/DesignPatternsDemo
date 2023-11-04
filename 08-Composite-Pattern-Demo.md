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
The user interface should clearly show the part-whole hierarchy as presented by the Composite pattern.
## Time Allocation
Implementing composite and leaf classes: 1.5 hours.
Developing the controller logic: 1 hour.
Creating a view that visualizes the directory structure: 1 hour.
Polishing and final testing: 0.5 hours.
