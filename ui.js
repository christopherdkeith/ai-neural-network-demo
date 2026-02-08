// ===================================
// USER INTERFACE CONTROL
// ===================================
// This file handles all UI interactions, chart visualization,
// and coordinating between the perceptron algorithm and display.

// Global UI variables
var chart;
var trainingData = [];
var isTraining = false;
var trainingInterval;
var learningRate = 0.1;

// Target square parameters
var squareCenterX = 0;     // Center x-coordinate
var squareCenterY = 0;     // Center y-coordinate
var squareWidth = 0.8;     // Width of the square
var squareHeight = 0.8;    // Height of the square

// Calculate square boundaries
function getSquareBounds() {
    return {
        left: squareCenterX - squareWidth / 2,
        right: squareCenterX + squareWidth / 2,
        top: squareCenterY + squareHeight / 2,
        bottom: squareCenterY - squareHeight / 2
    };
}

// Initialize the Highcharts visualization
function initChart() {
    chart = Highcharts.chart('chart-container', {
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            events: {
                click: function(e) {
                    // Only allow clicking if network has been trained
                    if (hiddenNodes[0].weightY === 0) {
                        alert('Please train the network first before testing new points!');
                        return;
                    }
                    
                    // Get click coordinates relative to the chart axes
                    var xValue = e.xAxis[0].value;
                    var yValue = e.yAxis[0].value;
                    
                    // Calculate the CORRECT label based on target square
                    var bounds = getSquareBounds();
                    var isInside = (xValue > bounds.left && 
                                   xValue < bounds.right && 
                                   yValue > bounds.bottom && 
                                   yValue < bounds.top);
                    var correctLabel = isInside ? 1 : -1;
                    
                    // Make prediction using the neural network
                    var prediction = predict(xValue, yValue);
                    
                    // Determine which series to add the point to
                    // Series: 0=Inside, 1=Outside, 2=Target, 3-6=Learned Edges, 7=Test+1, 8=Test-1, 9=TestWrong
                    var seriesIndex;
                    if (prediction === correctLabel) {
                        // Correct prediction - add to green or blue diamond series
                        seriesIndex = prediction === 1 ? 7 : 8;
                    } else {
                        // Wrong prediction - add to red diamond series
                        seriesIndex = 9;
                    }
                    
                    chart.series[seriesIndex].addPoint([xValue, yValue], true);
                }
            }
        },
        title: {
            text: 'Neural Network Learning - Square Classification'
        },
        xAxis: {
            title: { text: 'X Coordinate' },
            min: -1,
            max: 1,
            gridLineWidth: 1
        },
        yAxis: {
            title: { text: 'Y Coordinate' },
            min: -1,
            max: 1
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    symbol: 'circle'
                }
            },
            line: {
                marker: {
                    enabled: false
                }
            }
        },
        series: [
            {
                name: 'Inside Square (+1)',
                color: '#4CAF50',
                data: []
            },
            {
                name: 'Outside Square (-1)',
                color: '#2196F3',
                data: []
            },
            {
                name: 'Target Square',
                type: 'line',
                color: '#f44336',
                lineWidth: 2,
                data: [],
                enableMouseTracking: false,
                dataLabels: {
                    enabled: false
                }
            },
            {
                name: 'Learned Top Edge',
                type: 'line',
                color: '#FF9800',
                lineWidth: 2,
                dashStyle: 'Dash',
                data: [],
                enableMouseTracking: false,
                marker: { enabled: false }
            },
            {
                name: 'Learned Bottom Edge',
                type: 'line',
                color: '#FF9800',
                lineWidth: 2,
                dashStyle: 'Dash',
                data: [],
                enableMouseTracking: false,
                marker: { enabled: false }
            },
            {
                name: 'Learned Left Edge',
                type: 'line',
                color: '#FF9800',
                lineWidth: 2,
                dashStyle: 'Dash',
                data: [],
                enableMouseTracking: false,
                marker: { enabled: false }
            },
            {
                name: 'Learned Right Edge',
                type: 'line',
                color: '#FF9800',
                lineWidth: 2,
                dashStyle: 'Dash',
                data: [],
                enableMouseTracking: false,
                marker: { enabled: false }
            },
            {
                name: 'Test Point (Predicted +1)',
                color: '#4CAF50',
                data: [],
                marker: {
                    symbol: 'diamond',
                    radius: 8,
                    lineWidth: 2,
                    lineColor: '#000000'
                },
                tooltip: {
                    pointFormatter: function() {
                        var x = this.x;
                        var y = this.y;
                        var prediction = predict(x, y);
                        return '<b>Test Point</b><br/>' +
                               'Coordinates: (' + x.toFixed(2) + ', ' + y.toFixed(2) + ')<br/>' +
                               '<b>Network Prediction: Inside (+1)</b> (correct)';
                    }
                }
            },
            {
                name: 'Test Point (Predicted -1)',
                color: '#2196F3',
                data: [],
                marker: {
                    symbol: 'diamond',
                    radius: 8,
                    lineWidth: 2,
                    lineColor: '#000000'
                },
                tooltip: {
                    pointFormatter: function() {
                        var x = this.x;
                        var y = this.y;
                        var prediction = predict(x, y);
                        return '<b>Test Point</b><br/>' +
                               'Coordinates: (' + x.toFixed(2) + ', ' + y.toFixed(2) + ')<br/>' +
                               '<b>Network Prediction: Outside (-1)</b> (correct)';
                    }
                }
            },
            {
                name: 'Test Point (WRONG)',
                color: '#f44336',
                data: [],
                marker: {
                    symbol: 'diamond',
                    radius: 8,
                    lineWidth: 2,
                    lineColor: '#000000'
                },
                tooltip: {
                    pointFormatter: function() {
                        var x = this.x;
                        var y = this.y;
                        var prediction = predict(x, y);
                        // Calculate correct label
                        var bounds = getSquareBounds();
                        var isInside = (x > bounds.left && x < bounds.right && y > bounds.bottom && y < bounds.top);
                        var correctLabel = isInside ? 'Inside' : 'Outside';
                        return '<b>Test Point (WRONG)</b><br/>' +
                               'Coordinates: (' + x.toFixed(2) + ', ' + y.toFixed(2) + ')<br/>' +
                               '<b>Network Prediction: ' + (prediction === 1 ? 'Inside' : 'Outside') + '</b><br/>' +
                               '<span style="color: #f44336">Correct: ' + correctLabel + '</span>';
                    }
                }
            }
        ]
    });
}

// Generate random training data points
function generateTrainingData() {
    var numPoints = parseInt(document.getElementById('num-points').value);
    trainingData = [];
    
    // Get square boundaries
    var bounds = getSquareBounds();
    
    for (var i = 0; i < numPoints; i++) {
        // Random x and y between -1 and 1
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        
        // Check if point is inside the square
        // Point is inside if it's within all four boundaries
        var isInside = (x > bounds.left && 
                       x < bounds.right && 
                       y > bounds.bottom && 
                       y < bounds.top);
        
        // Classification: +1 if point is inside square, -1 if outside
        var classification = isInside ? 1 : -1;
        
        trainingData.push({ x: x, y: y, classification: classification });
    }
    
    updateChart();
}

// Start training process
function startTraining() {
    if (isTraining) return;
    
    learningRate = parseFloat(document.getElementById('learning-rate').value);
    isTraining = true;
    
    // Update button states
    document.getElementById('start-btn').disabled = true;
    document.getElementById('stop-btn').disabled = false;
    
    // Train one round every 500ms for visualization
    trainingInterval = setInterval(function() {
        trainOneRound();
    }, 500);
}

// Stop training process
function stopTraining() {
    isTraining = false;
    if (trainingInterval) {
        clearInterval(trainingInterval);
    }
    // Update button states
    document.getElementById('start-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
}

// Reset perceptron and display
function reset() {
    stopTraining();
    resetPerceptron();
    updateDisplay();
    updateChart();
}

// Generate new data points
function generateNewData() {
    stopTraining();
    trainingRound = 0;
    generateTrainingData();
    updateDisplay();
}

// Update target square when user changes parameters
function updateTargetSquare() {
    stopTraining();
    squareCenterX = parseFloat(document.getElementById('square-center-x').value);
    squareCenterY = parseFloat(document.getElementById('square-center-y').value);
    squareWidth = parseFloat(document.getElementById('square-width').value);
    squareHeight = parseFloat(document.getElementById('square-height').value);
    
    // Regenerate training data with new target square
    trainingRound = 0;
    generateTrainingData();
    updateDisplay();
}

// Update all display values in the UI
function updateDisplay() {
    document.getElementById('training-round').textContent = trainingRound;
    
    // Display all 4 hidden nodes
    for (var i = 0; i < hiddenNodes.length; i++) {
        var node = hiddenNodes[i];
        document.getElementById('node' + i + '-wx').textContent = node.weightX.toFixed(3);
        document.getElementById('node' + i + '-wy').textContent = node.weightY.toFixed(3);
        document.getElementById('node' + i + '-bias').textContent = node.bias.toFixed(3);
    }
    
    // Calculate accuracy
    var correct = 0;
    for (var i = 0; i < trainingData.length; i++) {
        var point = trainingData[i];
        if (predict(point.x, point.y) === point.classification) {
            correct++;
        }
    }
    var accuracy = trainingData.length > 0 ? (correct / trainingData.length * 100) : 0;
    var wrong = trainingData.length - correct;
    
    document.getElementById('accuracy').textContent = accuracy.toFixed(1) + '%';
    document.getElementById('correct').textContent = correct;
    document.getElementById('wrong').textContent = wrong;
}

// Update chart with current data and square boundaries
function updateChart() {
    var insidePoints = [];
    var outsidePoints = [];
    
    // Separate points by their classification
    for (var i = 0; i < trainingData.length; i++) {
        var point = trainingData[i];
        if (point.classification === 1) {
            insidePoints.push([point.x, point.y]);
        } else {
            outsidePoints.push([point.x, point.y]);
        }
    }
    
    // Calculate target square boundary (closed rectangle)
    var bounds = getSquareBounds();
    var targetSquareData = [
        [bounds.left, bounds.bottom],
        [bounds.right, bounds.bottom],
        [bounds.right, bounds.top],
        [bounds.left, bounds.top],
        [bounds.left, bounds.bottom]  // Close the square
    ];
    
    // Calculate learned edges from network nodes
    // Each node learns a separating line (may be diagonal)
    var learnedTopData = [];
    var learnedBottomData = [];
    var learnedLeftData = [];
    var learnedRightData = [];
    
    // Show learned edges if training has started
    if (trainingRound > 0) {
        var topNode = hiddenNodes[0];
        var bottomNode = hiddenNodes[1];
        var leftNode = hiddenNodes[2];
        var rightNode = hiddenNodes[3];
        
        // For each node, draw the decision boundary line across the chart
        // Decision boundary: weightX * x + weightY * y + bias = 0
        // Solve for y: y = -(weightX * x + bias) / weightY
        
        // Top edge decision boundary
        if (topNode.weightY !== 0) {
            for (var x = -1; x <= 1; x += 0.1) {
                var y = -(topNode.weightX * x + topNode.bias) / topNode.weightY;
                learnedTopData.push([x, y]);
            }
        }
        
        // Bottom edge decision boundary
        if (bottomNode.weightY !== 0) {
            for (var x = -1; x <= 1; x += 0.1) {
                var y = -(bottomNode.weightX * x + bottomNode.bias) / bottomNode.weightY;
                learnedBottomData.push([x, y]);
            }
        }
        
        // Left edge decision boundary
        if (leftNode.weightY !== 0) {
            for (var x = -1; x <= 1; x += 0.1) {
                var y = -(leftNode.weightX * x + leftNode.bias) / leftNode.weightY;
                learnedLeftData.push([x, y]);
            }
        }
        
        // Right edge decision boundary
        if (rightNode.weightY !== 0) {
            for (var x = -1; x <= 1; x += 0.1) {
                var y = -(rightNode.weightX * x + rightNode.bias) / rightNode.weightY;
                learnedRightData.push([x, y]);
            }
        }
    }
    
    // Update all chart series
    chart.series[0].setData(insidePoints, false);
    chart.series[1].setData(outsidePoints, false);
    chart.series[2].setData(targetSquareData, false);
    chart.series[3].setData(learnedTopData, false);
    chart.series[4].setData(learnedBottomData, false);
    chart.series[5].setData(learnedLeftData, false);
    chart.series[6].setData(learnedRightData, false);
    
    chart.redraw();
}

// Initialize on page load
window.onload = function() {
    // Read initial square parameter values from inputs
    squareCenterX = parseFloat(document.getElementById('square-center-x').value);
    squareCenterY = parseFloat(document.getElementById('square-center-y').value);
    squareWidth = parseFloat(document.getElementById('square-width').value);
    squareHeight = parseFloat(document.getElementById('square-height').value);
    
    initChart();
    generateTrainingData();
    updateDisplay();
};
