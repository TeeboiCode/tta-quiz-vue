function displayResults() {
    const resultsBody = document.getElementById('resultsBody');
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    
    resultsBody.innerHTML = results.map((result, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${result.name}</td>
            <td>${result.score}/${result.total}</td>
            <td>${result.percentage}%</td>
            <td>${result.date}</td>
        </tr>
    `).join('');
}

// Load results when page loads
window.addEventListener('load', displayResults); 