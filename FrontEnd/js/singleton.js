let printJobs = [];

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:3000/printerhub") // Update with the correct URL to your SignalR hub
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Start the connection.
connection.start()
    .then(() => console.log("Connected to SignalR hub!"))
    .catch(err => console.error("SignalR Connection Error: ", err));

connection.on("NewJobEnqueued", function (jobName) {
    console.log(`New job enqueued: ${jobName}`);
    // Update the queue display with the new job
    updateQueueDisplay(jobName);
    animate(); // Call the animate function to handle new jobs
});

connection.on("JobProcessed", function (jobName) {
    console.log(`Job processed: ${jobName}`);
    // Remove the job from the queue display
    removeJobFromQueue(jobName);
});

// Function to update the display of the print queue
function updateQueueDisplay(jobDescription) {
    const queueList = document.getElementById('queueList');
    queueList.textContent = queueList.textContent === 'No jobs in queue.'
        ? jobDescription
        : queueList.textContent + ', ' + jobDescription;
}

// Function to remove a print job from the canvas and queue
function removeJobFromQueue(jobName) {
    const queueList = document.getElementById('queueList');
    const jobs = queueList.textContent.split(', ').filter(j => j !== jobName);
    queueList.textContent = jobs.length > 0 ? jobs.join(', ') : 'No jobs in queue.';
    removePrintJobFromCanvas(jobName); // Update the canvas when a job is processed
}

// Function to remove a print job from the canvas when processed
function removePrintJobFromCanvas(jobName) {
    const jobIndex = printJobs.findIndex(job => job.id === jobName);
    if (jobIndex !== -1) {
        printJobs[jobIndex].status = 'completed'; // Mark the job as completed
    }
    // Filter out the completed jobs after updating their status
    printJobs = printJobs.filter(job => job.status !== 'completed');
}

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
    const floorPos = { x: 0, y: 0 };
    const desks = [
        { x: 300, y: 450, img: deskImgOne },
        { x: 300, y: 100, img: deskImgTwo },
        { x: 600, y: 150, img: deskImgThree }
    ];
    const printerPos = { x: 50, y: 250 };

    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScene();
        animateJobs();
        requestAnimationFrame(animate);
    }

    // Function to draw the static parts of the scene
    function drawScene() {
        ctx.drawImage(backgroundFloor, floorPos.x, floorPos.y);
        desks.forEach(desk => {
            ctx.drawImage(desk.img, desk.x, desk.y);
        });
        ctx.drawImage(printerImg, printerPos.x, printerPos.y);
    }

    // Function to animate the documents moving to the printer
    function animateJobs() {
        printJobs.forEach(job => {
            if (job.status === 'waiting' || job.status === 'moving') {
                const toPrinterX = printerPos.x - job.x;
                const toPrinterY = printerPos.y - job.y;
                const distanceToPrinter = Math.sqrt(toPrinterX ** 2 + toPrinterY ** 2);

                if (distanceToPrinter > 1) {
                    const normX = toPrinterX / distanceToPrinter;
                    const normY = toPrinterY / distanceToPrinter;
                    job.x += normX * 0.8;
                    job.y += normY * 0.8;
                    job.status = 'moving';
                    ctx.drawImage(job.img, job.x, job.y, job.width, job.height);
                } else {
                    job.status = 'at_printer';
                }
            }
        });
    }

    // Click event listener for the canvas
    canvas.addEventListener('click', function (event) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        desks.forEach((desk, index) => {
            if (clickX >= desk.x && clickX <= desk.x + desk.img.width &&
                clickY >= desk.y && clickY <= desk.y + desk.img.height) {
                animateDoc(desk.x, desk.y);
                enqueuePrintJob(index);
            }
        });
    });

    function animateDoc(deskX, deskY) {
        const newJob = {
            x: deskX,
            y: deskY,
            img: documentImg,
            width: documentImg.width,
            height: documentImg.height,
            status: 'waiting'
        };
        printJobs.push(newJob);
    }

    function enqueuePrintJob(deskIndex) {
        const desk = desks[deskIndex];
        const jobName = `Job from desk ${deskIndex + 1}`;
        const requestBody = {
            JobName: jobName
        };
        fetch('http://localhost:3000/api/printer/enqueue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
            .then(handleResponse)
            .catch(handleError);
    }

    function handleResponse(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
            return response.json().then((data) => {
                throw new Error(`Error from server: ${JSON.stringify(data)}`);
            });
        }
        return response.json();
    }

    function handleError(error) {
        console.error('Fetch error:', error);
    }
});
