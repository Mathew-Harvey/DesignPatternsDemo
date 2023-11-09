using System.ComponentModel.DataAnnotations;

namespace DesignPatterns.Models
{
    public class PrintJob
    {
        public string? Job { get; set; }
                  
        public int DeskX { get; set; }
        
        public int DeskY { get; set; }

        [Required]
        public string JobName { get; set; }
        

    }
}
