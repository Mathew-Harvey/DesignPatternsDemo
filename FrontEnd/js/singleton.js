let printJobs = [];

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:3000/printerhub") // Update with the correct URL to your SignalR hub
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Start the connection.
connection.start()
    .then(() => console.log("Connected to SignalR hub!"))
    .catch(err => console.error("SignalR Connection Error: ", err));

connection.on("ReceiveOneLiner", function (message) {
    console.log("The printer says: ", message);

 // Find the speech balloon and the paragraph within it
 const speechBalloon = document.querySelector('.speech-balloon');
 const oneLinerElement = speechBalloon.querySelector('.cartoony-text');

 // Update the text of the paragraph element
 oneLinerElement.textContent = message;

 // Make the speech balloon visible
 speechBalloon.style.display = 'block';

 setTimeout(() => {
    speechBalloon.style.display = 'none';
}, 5000);
});



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
    updateQueuePositions(jobName);
});

// Function to update the queue positions of jobs on the canvas
function updateQueuePositions() {
    let queueOffset = 10; // Space between queued jobs at the printer
    let nextQueuePosition = printerPos.y + queueOffset; // Initial y-position for the first job in the queue

    printJobs.forEach(job => {
        if (job.status === 'queued') {
            // Update the y-position of the queued job.
            job.y = nextQueuePosition;
            // Calculate the next y-position for the subsequent job.
            nextQueuePosition += job.height + queueOffset;
        }
    });
    // Redraw the canvas to reflect the new positions of the jobs
    drawScene();
    printJobs.forEach(job => {
        if (job.status !== 'completed') {
            ctx.drawImage(job.img, job.x, job.y, job.width, job.height);
        }
    });
}
// Function to update the display of the print queue
function updateQueueDisplay(jobDescription) {
    const queueList = document.getElementById('queueList');
    queueList.textContent = queueList.textContent === 'No jobs in queue.'
        ? jobDescription
        : queueList.textContent + ', ' + jobDescription;
}

function removeJobFromQueue(jobName) {
    const queueList = document.getElementById('queueList');
    const jobsText = queueList.textContent.split(', ').filter(j => j !== jobName);
    queueList.textContent = jobsText.length > 0 ? jobsText.join(', ') : 'No jobs in queue.';
    // Remove the job from the array and canvas
    const jobIndex = printJobs.findIndex(job => job.JobName === jobName);
    if (jobIndex !== -1) {
        printJobs.splice(jobIndex, 1); // Remove the job from the array
        // If the queue is empty, clear the canvas of job images
        if (queueList.textContent === 'No jobs in queue.') {
            clearCanvasOfJobs();
        } else {
            updateQueuePositions();
        }
    }
}
function requestOneLinerPrinterResponse() {
    connection.invoke("ReceiveOneLiner").catch(function (err) {
        return console.error(err.toString());
    });
}

function removePrintJobFromCanvas(jobName) {
    // Filter out the completed job
    printJobs = printJobs.filter(job => job.JobName !== jobName);
    drawScene();  // Redraw the scene to update the canvas
    // Redraw remaining jobs
    printJobs.forEach(job => {
        if (job.status !== 'completed') {
            ctx.drawImage(job.img, job.x, job.y, job.width, job.height);
        }
    });
    requestOneLinerPrinterResponse()
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
    const personOne = new Image();
    const personTwo = new Image();
    const personThree = new Image();
    const compOne = new Image();
    const compTwo = new Image();
    const compThree = new Image();
    const coffeeCup = new Image();


    // Set the source for your images
    backgroundFloor.src = '../assetsSinglton/floor.png';
    deskImgOne.src = '../assetsSinglton/deskOne.png';
    deskImgTwo.src = '../assetsSinglton/deskTwo.png';
    deskImgThree.src = '../assetsSinglton/deskThree.png';
    printerImg.src = '../assetsSinglton/printer.png';
    documentImg.src = '../assetsSinglton/document.png';
    personOne.src = '../assetsSinglton/personThree.png';
    personTwo.src = '../assetsSinglton/personOne.png';
    personThree.src = '../assetsSinglton/personTwo.png';
    compOne.src = '../assetsSinglton/compTwo.png';
    compTwo.src = '../assetsSinglton/compThree.png';
    compThree.src = '../assetsSinglton/compOne.png';
    coffeeCup.src = '../assetsSinglton/coffeeCup.png';

    // Promises to track the loading of each image
    const loadFloor = new Promise((resolve) => { backgroundFloor.onload = resolve; });
    const loadDeskOne = new Promise((resolve) => { deskImgOne.onload = resolve; });
    const loadDeskTwo = new Promise((resolve) => { deskImgTwo.onload = resolve; });
    const loadDeskThree = new Promise((resolve) => { deskImgThree.onload = resolve; });
    const loadPrinter = new Promise((resolve) => { printerImg.onload = resolve; });
    const loadDocument = new Promise((resolve) => { documentImg.onload = resolve; });
    const loadPersonOne = new Promise((resolve) => { personOne.onload = resolve; });
    const loadPersonTwo = new Promise((resolve) => { personTwo.onload = resolve; });
    const loadPersonThree = new Promise((resolve) => { personThree.onload = resolve; });
    const loadCompOne = new Promise((resolve) => { compOne.onload = resolve; });
    const loadCompTwo = new Promise((resolve) => { compTwo.onload = resolve; });
    const loadCompThree = new Promise((resolve) => { compThree.onload = resolve; });
    const loadCoffeeCup = new Promise((resolve) => { coffeeCup.onload = resolve; });

    // Wait for all images to load before starting the animation
    Promise.all([
        loadFloor,
        loadDeskOne,
        loadDeskTwo,
        loadDeskThree,
        loadPrinter,
        loadDocument,
        loadPersonOne,
        loadPersonTwo,
        loadPersonThree,
        loadCompOne,
        loadCompTwo,
        loadCompThree,
        loadCoffeeCup
    ]).then(() => {
        animate(); // Start the animation loop when all images are ready
    });

    // Positions and states
    const floorPos = { x: 0, y: 0 };
    const comps = [
        { x: 365, y: 420, img: compOne },
        { x: 359, y: 90, img: compTwo },
        { x: 620, y: 205, img: compThree },
    ]
    const desks = [
        { x: 300, y: 450, img: deskImgOne },
        { x: 300, y: 100, img: deskImgTwo },
        { x: 600, y: 150, img: deskImgThree },
    ];


    const persons = [
        { x: 354, y: 455, img: personOne },
        { x: 359, y: 50, img: personTwo },
        { x: 640, y: 170, img: personThree },
    ];
    const printerPos = { x: 50, y: 250 };
    const coffeeCupPos = { x: 630, y: 270 }

    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScene();
        animateJobs();
        peopleTyping();
        requestAnimationFrame(animate);
    }

    // Function to draw the static parts of the scene
    function drawScene() {
        ctx.drawImage(backgroundFloor, floorPos.x, floorPos.y);
        desks.forEach(desk => {
            ctx.drawImage(desk.img, desk.x, desk.y);
        });
        persons.forEach(person => {
            ctx.drawImage(person.img, person.x, person.y);
        });
        comps.forEach(comp => {
            ctx.drawImage(comp.img, comp.x, comp.y);
        });
        ctx.drawImage(printerImg, printerPos.x, printerPos.y);
        ctx.drawImage(coffeeCup, coffeeCupPos.x, coffeeCupPos.y)
    }
    function peopleTyping() {
        const typingAmplitude = 1; // Maximum pixel movement
        const typingSpeedMin = 100; // Minimum speed of typing animation in milliseconds
        const typingSpeedMax = 200; // Maximum speed of typing animation in milliseconds
        const typingPauseMin = 500; // Minimum pause between typing bursts in milliseconds
        const typingPauseMax = 2000; // Maximum pause between typing bursts in milliseconds

        // This loop will create a natural typing effect by moving the image up and down
        persons.forEach(person => {
            // Toggle the typing offset between -1 and 1 pixels to simulate a subtle typing effect
            if (person.isTyping) {
                person.typingOffset = person.typingOffset || 0;
                person.typingDirection = person.typingDirection || 1;
                person.typingOffset += person.typingDirection;
                person.y += person.typingDirection; // Apply the offset to the y position

                // Change direction if amplitude is reached
                if (Math.abs(person.typingOffset) > typingAmplitude) {
                    person.typingDirection *= -1;
                }
            }
        });

        // After altering the positions, redraw the scene to reflect the changes
        drawScene();

        // Randomly decide to pause typing
        if (Math.random() > 0.7) {
            // Introduce a pause in typing
            persons.forEach(person => {
                person.isTyping = false;
            });

            // Determine how long to pause before typing again
            const typingPause = Math.floor(Math.random() * (typingPauseMax - typingPauseMin + 1) + typingPauseMin);
            setTimeout(() => {
                persons.forEach(person => {
                    person.isTyping = true;
                });
                peopleTyping();
            }, typingPause);
        } else {
            // Continue typing without pause
            const typingSpeed = Math.floor(Math.random() * (typingSpeedMax - typingSpeedMin + 1) + typingSpeedMin);
            setTimeout(peopleTyping, typingSpeed);
        }
    }

    // Initialize typing
    persons.forEach(person => {
        person.isTyping = true; // Start everyone typing
    });


    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        peopleTyping();
        drawScene();
        animateJobs();
        requestAnimationFrame(animate);
    }
    // Function to animate the documents moving to the printer
    function animateJobs() {
        let queueOffset = 25; // Space between queued jobs at the printer
        let nextQueuePosition = printerPos.x + queueOffset; // Y position for the first job in the queue

        printJobs.forEach(job => {
            if (job.status === 'waiting' || job.status === 'moving') {
                const toPrinterX = printerPos.x - job.x;
                const toPrinterY = printerPos.y - job.y;
                const distanceToPrinter = Math.sqrt(toPrinterX ** 2 + toPrinterY ** 2);

                if (distanceToPrinter > 5) { // Adjust as necessary for how close a job can get to the printer
                    const normX = toPrinterX / distanceToPrinter;
                    const normY = toPrinterY / distanceToPrinter;
                    job.x += normX * 1.5; // Adjust speed if necessary
                    job.y += normY * 1.5; // Adjust speed if necessary
                    job.status = 'moving';
                } else {
                    job.status = 'queued';
                }
            }

            if (job.status === 'queued') {
                job.x = nextQueuePosition;
                nextQueuePosition += job.height + queueOffset; // Update next position
            }

            // Draw the job at its current position
            ctx.drawImage(job.img, job.x, job.y, job.width, job.height);
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
                const jobName = `Job from desk ${index + 1}`;
                animateDoc(desk.x, desk.y, jobName);
                enqueuePrintJob(index, jobName);
            }
        });
    });

    function animateDoc(deskX, deskY, jobName) {
        const newJob = {
            x: deskX,
            y: deskY,
            img: documentImg,
            width: documentImg.width,
            height: documentImg.height,
            status: 'waiting',
            JobName: jobName,
        };
        printJobs.push(newJob);
    }

    function enqueuePrintJob(deskIndex, jobName) {
        const desk = desks[deskIndex];
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
