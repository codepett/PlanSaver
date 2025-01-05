document.getElementById('savingForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Get the form data
    const totalAmount = parseFloat(document.getElementById('total_amount').value);
    const years = parseInt(document.getElementById('years').value);
  
    // Generate the saving plan
    const savingPlan = generateSavingPlan(totalAmount, years);
  
    // Display the saving plan in HTML
    displaySavingPlan(savingPlan, totalAmount, years);
  
    // Show the download PDF button
    document.getElementById('downloadPdf').style.display = 'inline-block';
  
    // Add event listener to download the PDF when clicked
    document.getElementById('downloadPdf').addEventListener('click', function() {
      downloadAsPDF(savingPlan, totalAmount, years);
    });
  });
  
  // Function to generate the saving plan
  function generateSavingPlan(totalAmount, years) {
    const totalWeeks = years * 52;
    const randomValues = Array.from({ length: totalWeeks }, () => Math.random());
    const sumOfRandoms = randomValues.reduce((sum, value) => sum + value, 0);
  
    if (sumOfRandoms === 0) {
      return Array(totalWeeks).fill(Math.round(totalAmount / totalWeeks));
    }
  
    const scaleFactor = totalAmount / sumOfRandoms;
    const weeklySavings = randomValues.map(value => Math.round(value * scaleFactor));
  
    let currentSum = weeklySavings.reduce((sum, value) => sum + value, 0);
    const difference = Math.round(totalAmount - currentSum);
    if (weeklySavings.length > 0) {
      weeklySavings[weeklySavings.length - 1] += difference;
    }
  
    return weeklySavings;
  }
  
  // Function to display the saving plan in HTML
  function displaySavingPlan(savingPlan, totalAmount, years) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    let tableHtml = `
      <h2>Your Saving Plan: Total Amount: ${totalAmount} over ${years} years</h2>
      <table style="border-collapse: collapse; width: 100%; font-size: 12px;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 8px;">Month</th>
            <th style="border: 1px solid #000; padding: 8px;">Week 1</th>
            <th style="border: 1px solid #000; padding: 8px;">Week 2</th>
            <th style="border: 1px solid #000; padding: 8px;">Week 3</th>
            <th style="border: 1px solid #000; padding: 8px;">Week 4</th>
          </tr>
        </thead>
        <tbody>
    `;
  
    for (let monthIndex = 0; monthIndex < years * 12; monthIndex++) {
      const monthName = months[monthIndex % 12];
      const startWeek = monthIndex * 4;
      const endWeek = startWeek + 4;
      const weeks = savingPlan.slice(startWeek, endWeek);
  
      tableHtml += `
        <tr>
          <td style='border: 1px solid #000; padding: 8px;'>${monthName}</td>
          ${weeks.map(amount => `<td style='border: 1px solid #000; padding: 8px;'>${amount}$</td>`).join('')}
        </tr>
      `;
    }
  
    tableHtml += `</tbody></table>`;
    document.getElementById('savingPlanOutput').innerHTML = tableHtml;
  }
  
  // Function to download the saving plan as a PDF
  function downloadAsPDF(savingPlan, totalAmount, years) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`Savings Plan: ${totalAmount} for ${years} years`, 10, 20);
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    let y = 30;
    doc.setFontSize(10);
    
    // Add headers to the PDF
    doc.text('Month', 10, y);
    doc.text('Week 1', 60, y);
    doc.text('Week 2', 100, y);
    doc.text('Week 3', 140, y);
    doc.text('Week 4', 180, y);
  
    y += 10;
  
    // Loop through the months and weeks
    for (let monthIndex = 0; monthIndex < years * 12; monthIndex++) {
      const monthName = months[monthIndex % 12];
      const startWeek = monthIndex * 4;
      const endWeek = startWeek + 4;
      const weeks = savingPlan.slice(startWeek, endWeek);
  
      doc.text(monthName, 10, y);
      weeks.forEach((amount, i) => {
        doc.text(`${amount}$`, 60 + (i * 40), y);
      });
      
      y += 10;
  
      if (y > 270) { // Add a new page if the content exceeds the page height
        doc.addPage();
        y = 20;
      }
    }
  
    doc.save('saving_plan.pdf');
  }
  