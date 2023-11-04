# Session 6: Implementing the Prototype Pattern Demo

## Goal
Demonstrate the Prototype pattern, which involves creating new objects by copying existing ones, allowing you to add any modified details as needed.

## Pseudocode
```csharp
// Prototype abstract class
public abstract class DocumentPrototype {
    public abstract DocumentPrototype Clone();
    public abstract string Display();
}

// Concrete prototype
public class ReportDocument : DocumentPrototype {
    public string Content { get; set; }

    public ReportDocument(string content) {
        Content = content;
    }

    // Implementing the Clone method
    public override DocumentPrototype Clone() {
        return this.MemberwiseClone() as DocumentPrototype;
    }

    public override string Display() {
        return $"Report Content: {Content}";
    }
}

// PrototypeDemoController.cs
public class PrototypeDemoController : Controller {
    // Simulate a "database" of documents
    private Dictionary<string, DocumentPrototype> documents = new Dictionary<string, DocumentPrototype>();

    public PrototypeDemoController() {
        // Initialize with a default document
        documents.Add("default", new ReportDocument("Default report content"));
    }

    public IActionResult Clone(string id) {
        if (!documents.ContainsKey(id)) {
            return NotFound("Document not found");
        }

        // Clone the existing document
        DocumentPrototype clonedDocument = documents[id].Clone();
        // Simulate saving the cloned document with a new ID
        var newId = Guid.NewGuid().ToString();
        documents.Add(newId, clonedDocument);

        return View("Display", newId);
    }

    public IActionResult Display(string id) {
        if (!documents.ContainsKey(id)) {
            return NotFound("Document not found");
        }

        // Display the document content
        return Content(documents[id].Display());
    }
}

```

## Tasks
Create an abstract DocumentPrototype class with a Clone method.
Implement a concrete ReportDocument class that clones itself.
Setup a PrototypeDemoController that simulates a document database and cloning operation.
Design views that let users clone and view documents.
## Hosting Solution
Continue development locally to ensure that the cloning process is working correctly.
After confirming the functionality, consider deploying the application to Heroku/Azure and GitHub Pages for wider accessibility.
## Expected Outcome
A web page that illustrates the Prototype pattern through the cloning of document objects.
Users should be able to clone existing documents and see the results immediately.
## Time Allocation
Setup of prototype classes and cloning mechanism: 1.5 hours.
Controller logic and routing for cloning operation: 1 hour.
Views for cloning and displaying cloned documents: 1 hour.
Final testing and refinements: 0.5 hours.
