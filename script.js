let circle = 'O';
let cross = 'X';
let currentPlayer = circle;

let fields = [
    null,
    null,
    null,
    null, 
    null,
    null,
    null, 
    null,
    null,
];

const winningCombinations = [
    [0, 1, 2],  // Row 1
    [3, 4, 5],  // Row 2
    [6, 7, 8],  // Row 3
    [0, 3, 6],  // Column 1
    [1, 4, 7],  // Column 2
    [2, 5, 8],  // Column 3
    [0, 4, 8],  // Diagonal
    [2, 4, 6]   // Diagonal
];

function handleClick(index) {
    if (!fields[index]) {
        fields[index] = currentPlayer;

        let cell = document.getElementById(`cell-${index}`);
        cell.innerHTML = currentPlayer === circle ? generateCircleSVG() : generateCrossSVG();

        cell.onclick = null;

        const winningCombination = checkWinner(currentPlayer);
        if (winningCombination) {
            drawWinningLine(winningCombination);  // Draws the winning line
        } else if (fields.every(field => field !== null)) {
            // All fields are filled, it's a draw
            document.getElementById('resetButton').style.display = 'block';
        }else {
            currentPlayer = currentPlayer === circle ? cross : circle;
        }
    }
}

// Check if there's a winner
function checkWinner(player) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] === player && fields[b] === player && fields[c] === player) {
            return combination;  // Return the winning combination
        }
    }
    return null;  // No winner
}

// Draw a line over the winning cells
function drawWinningLine(combination) {
    let startCell = document.getElementById(`cell-${combination[0]}`);
    let endCell = document.getElementById(`cell-${combination[2]}`);
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "300");
    svg.setAttribute("height", "300");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";

    let x1 = startCell.offsetLeft + 50;  // Center x1 position
    let y1 = startCell.offsetTop + 50;   // Center y1 position
    let x2 = endCell.offsetLeft + 50;    // Center x2 position
    let y2 = endCell.offsetTop + 50;     // Center y2 position

    // Adjust for [2, 5, 8] combination by shifting 1% to the right
    if (combination.toString() === "2,5,8","1,4,7") {
        x1 += startCell.offsetWidth * 0.05;
        x2 += endCell.offsetWidth * 0.05;    
    }

    if (combination.toString() === "2,4,6") {
        x1 -= startCell.offsetWidth * 0.05;
        x2 -= endCell.offsetWidth * 0.05;    
    }

    if (combination.toString() === "0,1,2") {
        y1 -= startCell.offsetWidth * 0.03;
        y2 -= endCell.offsetWidth * 0.03;    
    }

    line.setAttribute("x1", x1);  // Corrected x1 position
    line.setAttribute("y1", y1);  // Corrected y1 position
    line.setAttribute("x2", x2);  // Corrected x2 position
    line.setAttribute("y2", y2);  // Corrected y2 position
    line.setAttribute("stroke", "red");
    line.setAttribute("stroke-width", "10");

    svg.appendChild(line);
    document.getElementById('content').style.position = 'relative';  // Ensure the parent container is relative
    document.getElementById('content').appendChild(svg);

    document.getElementById('resetButton').style.display = 'block';
}




function render() {
    let tableHtml = '<table>';

    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = fields[index] ? fields[index] : '';
            
            tableHtml += `<td id="cell-${index}" onclick="handleClick(${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }

    tableHtml += '</table>';
    document.getElementById('content').innerHTML = tableHtml;
}

function resetGame() {
    // Reset the fields array
    fields = [
        null,
        null,
        null,
        null, 
        null,
        null,
        null, 
        null,
        null,
    ];

    // Clear the SVG winning line if it exists
    let svg = document.querySelector('svg');
    if (svg) {
        svg.remove();  // Remove the winning line
    }

    // Set the current player to circle to start fresh
    currentPlayer = circle;

    document.getElementById('resetButton').style.display = 'none';

    render()
}

render();

function generateCircleSVG() {
    return `
    <svg width="95%" height="95%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" stroke="#00B0EF" stroke-width="15" fill="none">
            <animate attributeName="stroke-dasharray" from="0,251" to="251,0" dur="1s" fill="freeze" />
        </circle>
    </svg>
    `;
}

function generateCrossSVG() {
    return `
    <svg width="95%" height="95%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="10" x2="90" y2="90" stroke="#FFC000" stroke-width="20" stroke-linecap="round">
            <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="0.8s" fill="freeze" />
        </line>
        <line x1="90" y1="10" x2="10" y2="90" stroke="#FFC000" stroke-width="20" stroke-linecap="round">
            <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="0.8s" fill="freeze" />
        </line>
    </svg>
    `;
}
