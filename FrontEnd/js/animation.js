document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('officeCanvas');
    const ctx = canvas.getContext('2d');

    // Load your sprites for each desk
    const backgroundFloor = new Image();
    const deskImgOne = new Image();
    const deskImgTwo = new Image();
    const deskImgThree = new Image();
    const printerImg = new Image();
    const documentImg = new Image();

    // Set the source for your images
    backgroundFloor.src = '../assetsSinglton/floor.png';
    deskImgOne.src = '../assetsSinglton/deskOne.png';
    deskImgTwo.src = '../assetsSinglton/deskTwo.png';
    deskImgThree.src = '../assetsSinglton/deskThree.png';
    printerImg.src = '../assetsSinglton/printer.png';
    documentImg.src = '../assetsSinglton/document.png';

    // Promises to track the loading of each image
    const loadFloor = new Promise((resolve) => { backgroundFloor.onload = resolve; });
    const loadDeskOne = new Promise((resolve) => { deskImgOne.onload = resolve; });
    const loadDeskTwo = new Promise((resolve) => { deskImgTwo.onload = resolve; });
    const loadDeskThree = new Promise((resolve) => { deskImgThree.onload = resolve; });
    const loadPrinter = new Promise((resolve) => { printerImg.onload = resolve; });
    const loadDocument = new Promise((resolve) => { documentImg.onload = resolve; });

    // Wait for all images to load before starting the animation
    Promise.all([loadFloor, loadDeskOne, loadDeskTwo, loadDeskThree, loadPrinter, loadDocument]).then(() => {
        animate(); // Start the animation loop when all images are ready
    });

    // Positions and states
    const floorPos = { x: 0, y: 0 }
    const desks = [
        { x: 300, y: 450, img: deskImgOne },
        { x: 300, y: 100, img: deskImgTwo },
        { x: 600, y: 150, img: deskImgThree }
    ]; // Example desk positions with associated images
    const printerPos = { x: 50, y: 250 };
    let printJobs = [];

    function addPrintJobToCanvas(jobName, jobData) {
        // Create a new print job object with a unique identifier, jobName
        const job = {
            x: jobData.x,
            y: jobData.y,
            id: jobName, // Unique identifier for the job

            // x: desks[deskIndex].x + desks[deskIndex].img.width / 2, // Initial X position
            // y: desks[deskIndex].y + desks[deskIndex].img.height / 2, // Initial Y position
            img: documentImg, // The image to represent the document/job
            width: documentImg.width, // The width of the job image
            height: documentImg.height // The height of the job image
        };

        // Add the new job object to the global printJobs array
        printJobs.push(job);

        // Log the action for debugging purposes
        console.log(`Added job to canvas: ${jobName}`);
    }

    // Expose the addPrintJobToCanvas function globally so it can be called from other scripts
    window.addPrintJobToCanvas = addPrintJobToCanvas;

    // Function to draw the static parts of the scene
    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.drawImage(backgroundFloor, floorPos.x, floorPos.y); // Draw Floor

        // Draw desks
        desks.forEach(desk => {
            ctx.drawImage(desk.img, desk.x, desk.y);
        });

        // Draw printer
        ctx.drawImage(printerImg, printerPos.x, printerPos.y);

        // Draw wires from each desk to the printer
        desks.forEach(desk => {
            ctx.beginPath();
            ctx.moveTo(desk.x + desk.img.width / 2, desk.y + desk.img.height / 2.5); // Start at the center of the desk
            ctx.lineTo(printerPos.x + printerImg.width / 2, printerPos.y + printerImg.height / 2); // End at the center of the printer
            ctx.strokeStyle = '#000'; // Wire color
            ctx.lineWidth = 2; // Wire thickness
            ctx.stroke();
        });
    }

    // Function to animate the documents moving to the printer
    function animateJobs() {
        printJobs.forEach((job, index) => {

            if (job.status === 'waiting') {
                // Calculate the direction to the printer
                const toPrinterX = printerPos.x - job.x;
                const toPrinterY = printerPos.y - job.y;
                const distanceToPrinter = Math.sqrt(toPrinterX * toPrinterX + toPrinterY * toPrinterY);

                // Normalize and move the job towards the printer if it's not already there
                if (distanceToPrinter > 5) { // If not within 5 pixels of the printer
                    const normX = toPrinterX / distanceToPrinter;
                    const normY = toPrinterY / distanceToPrinter;
                    job.x += normX; // Move by one unit vector step towards the printer
                    job.y += normY; // Move by one unit vector step towards the printer
                } else {
                    // Once the job reaches the printer, remove it from the printJobs array
                    printJobs.splice(index, 1);
                }
                if (distanceToPrinter <= 5 && job.status === 'waiting') {
                    job.status = 'processing';
                    startProcessingJobOnServer(job.id);
                }
                if (distanceToPrinter <= 5) {
                    // Mark the job as being processed and line it up in front of the printer
                    job.status = 'processing';
                    job.x = printerPos.x; // Adjust as necessary to line up in front of the printer
                    job.y = printerPos.y; // Adjust as necessary to line up in front of the printer
                    // Send an API call to the backend to process the job
                    processPrintJob(job.id);
                }
            }
            // Draw the job on the canvas at its new position
            if (job.status !== 'completed') {
                ctx.drawImage(documentImg, job.x, job.y, documentImg.width / 2, documentImg.height / 2);
            }
        });
    }

    // Main animation loop
    function animate() {
        drawScene();
        animateJobs();
        requestAnimationFrame(animate);
    }
    canvas.addEventListener('click', function (event) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Check if the click is within the bounds of any desk
        desks.forEach((desk, index) => {
            if (clickX >= desk.x && clickX <= desk.x + desk.img.width &&
                clickY >= desk.y && clickY <= desk.y + desk.img.height) {
                enqueuePrintJob(index);
            }
        });
    });
    // Function to add a print job to the canvas animation
    window.enqueuePrintJob = function (deskIndex) {
        const desk = desks[deskIndex];
        const jobName = `Job from desk ${deskIndex + 1}`;
        const requestBody = {
            Job: jobName,
            DeskX: desk.x, // These should match the PrintJob model on the backend
            DeskY: desk.y
        };
    
        // API call to enqueue a print job
        fetch('http://localhost:3000/api/printer/enqueue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                const contentType = response.headers.get("content-type");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else if (contentType && contentType.includes("application/json")) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                console.log(`Response from server: ${data}`);
            })
            .catch(error => {
                console.error('Error sending print job:', error);
            });
    }
    function removePrintJobFromCanvas(jobName) {
        // Find the job with the given name and remove it from the array
        printJobs = printJobs.filter(job => job.id !== jobName);

        // You can also log the removal for debugging purposes
        console.log(`Removed job from canvas: ${jobName}`);
    }

    // Function to send an API call to the backend to process the job
    function processPrintJob(jobId) {
        // API call to process the print job
        fetch(`http://localhost:3000/api/printer/process/${jobId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Job ${jobId} is being processed by the server.`);
            })
            .catch(error => {
                console.error('Error processing print job:', error);
            });
    }

    // Function to remove a print job from the canvas when it's completed
    window.removePrintJobFromCanvas = function (jobId) {
        const job = printJobs.find(j => j.id === jobId);
        if (job) {
            job.status = 'completed';
        }
        // You might want to remove the job from the array or leave it to fade out, etc.
    }

// Establish a connection to the SignalR hub
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/printerHub")
    .build();

connection.start().catch(err => console.error('Error starting SignalR connection:', err));

// Call this function when a job reaches the printer to start processing
function startProcessingJobOnServer(jobName) {
    connection.invoke("StartProcessingJob", jobName).catch(err => console.error('Error invoking StartProcessingJob:', err));

}
connection.on("NewJobEnqueued", function (jobData) {
    // Now jobData is an object that contains JobName, DeskX, and DeskY
    console.log(`New job enqueued: ${jobData.JobName}`);

    // Call a function to handle the new job - make sure this function exists and is defined
    addPrintJobToCanvas(jobData.JobName, jobData.DeskX, jobData.DeskY);
});

connection.on("JobProcessed", function (jobName) {
    window.removePrintJobFromCanvas(jobName);
});
    // Click event listener for the canvas
    canvas.addEventListener('click', function (event) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Check if the click is within the bounds of any desk
        desks.forEach((desk, index) => {
            if (clickX >= desk.x && clickX <= desk.x + desk.img.width &&
                clickY >= desk.y && clickY <= desk.y + desk.img.height) {
                enqueuePrintJob(index);
            }
        });
    });
});