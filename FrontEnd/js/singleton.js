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
    animate()
});

connection.on("JobProcessed", function (jobName) {
    console.log(`Job processed: ${jobName}`);
    // Remove the job from the queue display
    removeJobFromQueue(jobName);
});

// function sendPrintJob(userName) {
//     const jobName = `${userName}'s job`;
//     console.log(`${userName} is sending a print job to the printer...`);
    
//     const requestBody = {
//         job:jobName
//     };

//     // API call to enqueue a print job
//     fetch('http://localhost:3000/api/printer/enqueue', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody), // Adjust according to your API's expected format
//     })
//     .then(response => {
//         const contentType = response.headers.get("content-type");
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         } else if(contentType && contentType.includes("application/json")) {
//             return response.json();
//         } else {
//             return response.text();
//         }
//     })
//     .then(data => {
//         console.log(`Response from server: ${data}`);
//     })
//     .catch(error => {
//         console.error('Error sending print job:', error);
//     });
// }

function updateQueueDisplay(jobDescription) {
    // Update the UI to show the new job in the queue
    const queueList = document.getElementById('queueList');
    queueList.textContent = queueList.textContent === 'No jobs in queue.'
        ? jobDescription
        : queueList.textContent + ', ' + jobDescription;
        
  
        
}

function removeJobFromQueue(jobName) {
    const queueList = document.getElementById('queueList');
    const jobs = queueList.textContent.split(', ').filter(j => j !== jobName);
    queueList.textContent = jobs.length > 0 ? jobs.join(', ') : 'No jobs in queue.';
}


