function createProcessTable() {
    const numProcesses = document.getElementById('num_processes').value;
    const table = document.createElement('table');
    table.setAttribute('id', 'process_table');
  
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Process</th><th>Burst Time</th><th>Priority</th>';
    table.appendChild(headerRow);
  
    for (let i = 0; i < numProcesses; i++) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>P${i}</td>
        <td><input type="number" id="burst_time_${i}" min="1"></td>
        <td><input type="number" id="priority_${i}" min="1"></td>
      `;
      table.appendChild(row);
    }
  
    const processTableDiv = document.getElementById('process_table');
    processTableDiv.innerHTML = ''; // Clear existing table content
    processTableDiv.appendChild(table);
  }
  
  function calculatePriority() {
    const numProcesses = document.getElementById('num_processes').value;
  
    const processInfo = [];
    for (let i = 0; i < numProcesses; i++) {
      const burstTimeInput = document.getElementById(`burst_time_${i}`);
      const burstTime = burstTimeInput.value ? parseInt(burstTimeInput.value) : 1;
      
      const priorityInput = document.getElementById(`priority_${i}`);
      const priority = priorityInput.value ? parseInt(priorityInput.value) : 1;
      
      processInfo.push({
        process: `P${i}`,
        burstTime: burstTime,
        priority: priority
      });
    }
  
    // Sort processes
    processInfo.sort((a, b) => a.priority - b.priority);
  
    // Calculate completion times
    let currentTime = 0;
    const completionTimes = [];
    for (const process of processInfo) {
      completionTimes.push(currentTime + process.burstTime);
      currentTime = completionTimes[completionTimes.length - 1];
    }
  
    // Calculate turnaround time and waiting time
    const processData = processInfo.map((process, index) => {
      const waitingTime = completionTimes[index] - process.burstTime;
      return {
        process: process.process,
        burstTime: process.burstTime,
        completionTime: completionTimes[index],
        waitingTime: waitingTime
      };
    });
  
    // Calculate average waiting time
    const totalWaitingTime = processData.reduce((acc, curr) => acc + curr.waitingTime, 0);
    const averageWaitingTime = totalWaitingTime / numProcesses;
  
    // Create the results
    const resultTable = document.createElement('table');
    resultTable.setAttribute('id', 'result_table');
  
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Process</th><th>Burst Time</th><th>Completion Time</th><th>Waiting Time</th>';
    resultTable.appendChild(headerRow);
    
    processData.forEach(process => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${process.process}</td>
        <td>${process.burstTime}</td>
        <td>${process.completionTime}</td>
        <td>${process.waitingTime}</td>
      `;
      resultTable.appendChild(row);
    });
  
    // Add a row for average waiting time
    const averageRow = document.createElement('tr');
    averageRow.innerHTML = `
      <td colspan="3">Average Waiting Time:</td>
      <td>${averageWaitingTime.toFixed(2)}%</td>
    `;
    resultTable.appendChild(averageRow);
  
    // Display results
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear existing content
    resultDiv.appendChild(resultTable);
  }