// Function to create the process table dynamically
function createProcessTable() {
    const numProcesses = document.getElementById('num_processes').value;
    
    const table = document.createElement('table');
    table.setAttribute('id', 'process_table');

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Process</th><th>Arrival Time</th><th>Burst Time</th>';
    table.appendChild(headerRow);
  
    // Create rows for process input
    for (let i = 0; i < numProcesses; i++) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>P${i}</td>
        <td><input type="number" id="arrival_time_${i}" min="0"></td>
        <td><input type="number" id="burst_time_${i}" min="1"></td>
      `;
      table.appendChild(row);
    }
  
    // Add the table
    const processTableDiv = document.getElementById('process_table');
    processTableDiv.innerHTML = ''; // Clear existing table content
    processTableDiv.appendChild(table);
}


function calculateSRTF() {
    const numProcesses = document.getElementById('num_processes').value;
  
    // Get arrival times and burst times
    const arrivalTimes = [];
    const burstTimes = [];
    for (let i = 0; i < numProcesses; i++) {
        const arrivalTimeInput = document.getElementById(`arrival_time_${i}`);
        const arrivalTime = arrivalTimeInput.value ? parseInt(arrivalTimeInput.value) : 0;
        arrivalTimes.push(arrivalTime);

        const burstTimeInput = document.getElementById(`burst_time_${i}`);
        const burstTime = burstTimeInput.value ? parseInt(burstTimeInput.value) : 1;
        burstTimes.push(burstTime);
    }

    let allPositive = true;
    for (const burstTime of burstTimes) {
        if (burstTime <= 0) {
            allPositive = false;
            break;
        }
    }

    if (!allPositive) {
        document.getElementById('result').innerHTML = 'Error: All burst times must be positive.';
        return;
    }


    const processData = [];
    for (let i = 0; i < numProcesses; i++) {
        processData.push({
            process: `P${i}`,
            arrivalTime: arrivalTimes[i],
            burstTime: burstTimes[i],
            remainingTime: burstTimes[i],
            completionTime: 0, 
        });
    }

    // Initialize variables for time tracking
    let currentTime = 0;
    let completedProcesses = 0;
    const waitingTimes = new Array(numProcesses).fill(0);
    const turnaroundTimes = new Array(numProcesses).fill(0);

    // Loop until all processes are completed
    while (completedProcesses < numProcesses) {
        let minRemainingTime = Infinity;
        let selectedProcessIndex = -1;

        // Find the process with the minimum remaining time at current time
        for (let i = 0; i < numProcesses; i++) {
            if (processData[i].arrivalTime <= currentTime && processData[i].remainingTime < minRemainingTime && processData[i].remainingTime > 0) {
                minRemainingTime = processData[i].remainingTime;
                selectedProcessIndex = i;
            }
        }

        // If no process is selected, move to the next arrival time
        if (selectedProcessIndex === -1) {
            currentTime++;
            continue;
        }

        // Execute the selected process for 1 unit of time
        processData[selectedProcessIndex].remainingTime--;
        currentTime++;

        // If the process is completed, update completion time and waiting time
        if (processData[selectedProcessIndex].remainingTime === 0) {
            completedProcesses++;
            const processIndex = selectedProcessIndex;
            processData[processIndex].completionTime = currentTime;
            waitingTimes[processIndex] = processData[processIndex].completionTime - processData[processIndex].arrivalTime - processData[processIndex].burstTime;
            turnaroundTimes[processIndex] = processData[processIndex].completionTime - processData[processIndex].arrivalTime;
        }
    }

    // Calculate average waiting time and turnaround time
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    for (let i = 0; i < numProcesses; i++) {
        totalWaitingTime += waitingTimes[i];
        totalTurnaroundTime += turnaroundTimes[i];
    }
    const averageWaitingTime = totalWaitingTime / numProcesses;
    const averageTurnaroundTime = totalTurnaroundTime / numProcesses;

    // Display results
    displayResults(processData, waitingTimes, turnaroundTimes, averageWaitingTime, averageTurnaroundTime);
}

// Function to display the results
function displayResults(processData, waitingTimes, turnaroundTimes, averageWaitingTime, averageTurnaroundTime) {
    // Create the results table element
    const resultTable = document.createElement('table');
    resultTable.setAttribute('id', 'result_table');

    // Create the table header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Completion Time</th><th>Waiting Time</th><th>Turnaround Time</th>';
    resultTable.appendChild(headerRow);

    // Create rows for results
    for (let i = 0; i < processData.length; i++) {
        const row = document.createElement('tr');

        // Create cells for each data item
        const processCell = document.createElement('td');
        processCell.textContent = processData[i].process;
        row.appendChild(processCell);

        const arrivalTimeCell = document.createElement('td');
        arrivalTimeCell.textContent = processData[i].arrivalTime;
        row.appendChild(arrivalTimeCell);

        const burstTimeCell = document.createElement('td');
        burstTimeCell.textContent = processData[i].burstTime;
        row.appendChild(burstTimeCell);

        const completionTimeCell = document.createElement('td');
        completionTimeCell.textContent = processData[i].completionTime;
        row.appendChild(completionTimeCell);

        const waitingTimeCell = document.createElement('td');
        waitingTimeCell.textContent = waitingTimes[i];
        row.appendChild(waitingTimeCell);

        const turnaroundTimeCell = document.createElement('td');
        turnaroundTimeCell.textContent = turnaroundTimes[i];
        row.appendChild(turnaroundTimeCell);

        // Append the row to the table
        resultTable.appendChild(row);
    }

    // Add a row for average waiting time
    const averageWaitingRow = document.createElement('tr');
    averageWaitingRow.innerHTML = `
        <td colspan="4">Average Waiting Time:</td>
        <td colspan="2">${averageWaitingTime.toFixed(2)}%</td>
    `;
    resultTable.appendChild(averageWaitingRow);

    // Add a row for average turnaround time
    const averageTurnaroundRow = document.createElement('tr');
    averageTurnaroundRow.innerHTML = `
        <td colspan="4">Average Turnaround Time:</td>
        <td colspan="2">${averageTurnaroundTime.toFixed(2)}%</td>
    `;
    resultTable.appendChild(averageTurnaroundRow);

    // Display results by adding the table to the result div
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear existing content
    resultDiv.appendChild(resultTable);
}