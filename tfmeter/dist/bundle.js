(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
function classifyBYOData(numSamples, noise) {
    var points = [];
    return points;
}
exports.classifyBYOData = classifyBYOData;
function classifyTwoGaussData(numSamples, noise) {
    var points = [];
    var variance = 0.5;
    var dNoise = dSNR(noise);
    function genGauss(cx, cy, label) {
        for (var i = 0; i < numSamples / 2; i++) {
            var noiseX = normalRandom(0, variance * dNoise);
            var noiseY = normalRandom(0, variance * dNoise);
            var signalX = normalRandom(cx, variance);
            var signalY = normalRandom(cy, variance);
            var x = signalX + noiseX;
            var y = signalY + noiseY;
            points.push({ x: x, y: y, label: label });
        }
    }
    genGauss(2, 2, 1);
    genGauss(-2, -2, -1);
    return points;
}
exports.classifyTwoGaussData = classifyTwoGaussData;
function classifySpiralData(numSamples, noise) {
    var dNoise = dSNR(noise);
    var points = [];
    var n = numSamples / 2;
    function genSpiral(deltaT, label) {
        for (var i = 0; i < n; i++) {
            var r = i / n * 5;
            var r2 = r * r;
            var t = 1.75 * i / n * 2 * Math.PI + deltaT;
            var noiseX = normalRandom(0, r * dNoise);
            var noiseY = normalRandom(0, r * dNoise);
            var x = r * Math.sin(t) + noiseX;
            var y = r * Math.cos(t) + noiseY;
            points.push({ x: x, y: y, label: label });
        }
    }
    genSpiral(0, 1);
    genSpiral(Math.PI, -1);
    return points;
}
exports.classifySpiralData = classifySpiralData;
function classifyCircleData(numSamples, noise) {
    var dNoise = dSNR(noise);
    var points = [];
    var radius = 5;
    for (var i = 0; i < numSamples / 2; i++) {
        var r = randUniform(0, radius * 0.5);
        var r2 = r * r;
        var angle = randUniform(0, 2 * Math.PI);
        var x = r * Math.sin(angle);
        var y = r * Math.cos(angle);
        var noiseX = normalRandom(0, 1 / radius * dNoise);
        var noiseY = normalRandom(0, 1 / radius * dNoise);
        x += noiseX;
        y += noiseY;
        var label = 1;
        points.push({ x: x, y: y, label: label });
    }
    for (var i = 0; i < numSamples / 2; i++) {
        var r = randUniform(radius * 0.7, radius);
        var rr2 = r * r;
        var angle = randUniform(0, 2 * Math.PI);
        var x = r * Math.sin(angle);
        var y = r * Math.cos(angle);
        var noiseX = normalRandom(0, 1 / radius * dNoise);
        var noiseY = normalRandom(0, 1 / radius * dNoise);
        x += noiseX;
        y += noiseY;
        var label = -1;
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
exports.classifyCircleData = classifyCircleData;
function classifyXORData(numSamples, noise) {
    var dNoise = dSNR(noise);
    var stdSignal = 5;
    function getXORLabel(p) {
        return p.x * p.y >= 0 ? 1 : -1;
    }
    var points = [];
    for (var i = 0; i < numSamples; i++) {
        var x = randUniform(-stdSignal, stdSignal);
        var padding = 0.3;
        x += x > 0 ? padding : -padding;
        var y = randUniform(-stdSignal, stdSignal);
        y += y > 0 ? padding : -padding;
        var varianceSignal = stdSignal * stdSignal;
        var noiseX = normalRandom(0, varianceSignal * dNoise);
        var noiseY = normalRandom(0, varianceSignal * dNoise);
        var label = getXORLabel({ x: x + noiseX, y: y + noiseY });
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
exports.classifyXORData = classifyXORData;
function regressPlane(numSamples, noise) {
    var dNoise = dSNR(noise);
    var radius = 6;
    var r2 = radius * radius;
    var labelScale = d3.scale.linear()
        .domain([-10, 10])
        .range([-1, 1]);
    var getLabel = function (x, y) { return labelScale(x + y); };
    var points = [];
    for (var i = 0; i < numSamples; i++) {
        var x = randUniform(-radius, radius);
        var y = randUniform(-radius, radius);
        var noiseX = normalRandom(0, r2 * dNoise);
        var noiseY = normalRandom(0, r2 * dNoise);
        var label = getLabel(x + noiseX, y + noiseY);
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
exports.regressPlane = regressPlane;
function regressGaussian(numSamples, noise) {
    var dNoise = dSNR(noise);
    var points = [];
    var labelScale = d3.scale.linear()
        .domain([0, 2])
        .range([1, 0])
        .clamp(true);
    var gaussians = [
        [-4, 2.5, 1],
        [0, 2.5, -1],
        [4, 2.5, 1],
        [-4, -2.5, -1],
        [0, -2.5, 1],
        [4, -2.5, -1]
    ];
    function getLabel(x, y) {
        var label = 0;
        gaussians.forEach(function (_a) {
            var cx = _a[0], cy = _a[1], sign = _a[2];
            var newLabel = sign * labelScale(dist({ x: x, y: y }, { x: cx, y: cy }));
            if (Math.abs(newLabel) > Math.abs(label)) {
                label = newLabel;
            }
        });
        return label;
    }
    var radius = 6;
    var r2 = radius * radius;
    for (var i = 0; i < numSamples; i++) {
        var x = randUniform(-radius, radius);
        var y = randUniform(-radius, radius);
        var noiseX = normalRandom(0, r2 * dNoise);
        var noiseY = normalRandom(0, r2 * dNoise);
        var label = getLabel(x + noiseX, y + noiseY);
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
exports.regressGaussian = regressGaussian;
function shuffle(array) {
    var counter = array.length;
    var temp = 0;
    var index = 0;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
}
exports.shuffle = shuffle;
function log2(x) {
    return Math.log(x) / Math.log(2);
}
function log10(x) {
    return Math.log(x) / Math.log(10);
}
function signalOf(x) {
    return log2(1 + Math.abs(x));
}
function dSNR(x) {
    return 1 / Math.pow(10, x / 10);
}
function randUniform(a, b) {
    return Math.random() * (b - a) + a;
}
function normalRandom(mean, variance) {
    if (mean === void 0) { mean = 0; }
    if (variance === void 0) { variance = 1; }
    var v1, v2, s;
    do {
        v1 = 2 * Math.random() - 1;
        v2 = 2 * Math.random() - 1;
        s = v1 * v1 + v2 * v2;
    } while (s > 1);
    var result = Math.sqrt(-2 * Math.log(s) / s) * v1;
    return mean + Math.sqrt(variance) * result;
}
function dist(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

},{}],2:[function(require,module,exports){
"use strict";
var NUM_SHADES = 64;
var HeatMap = (function () {
    function HeatMap(width, numSamples, xDomain, yDomain, container, userSettings) {
        this.settings = { showAxes: false, noSvg: false };
        this.numSamples = numSamples;
        var height = width;
        var padding = userSettings.showAxes ? 20 : 0;
        if (userSettings != null) {
            for (var prop in userSettings) {
                this.settings[prop] = userSettings[prop];
            }
        }
        this.xScale = d3.scale.linear()
            .domain(xDomain)
            .range([0, width - 2 * padding]);
        this.yScale = d3.scale.linear()
            .domain(yDomain)
            .range([height - 2 * padding, 0]);
        var tmpScale = d3.scale.linear()
            .domain([0, .5, 1])
            .range(["#0877bd", "#e8eaeb", "#f59322"])
            .clamp(true);
        var colors = d3.range(0, 1 + 1E-9, 1 / NUM_SHADES).map(function (a) {
            return tmpScale(a);
        });
        this.color = d3.scale.quantize()
            .domain([-1, 1])
            .range(colors);
        container = container.append("div")
            .style({
            width: width + "px",
            height: height + "px",
            position: "relative",
            top: "-" + padding + "px",
            left: "-" + padding + "px"
        });
        this.canvas = container.append("canvas")
            .attr("width", numSamples)
            .attr("height", numSamples)
            .style("width", (width - 2 * padding) + "px")
            .style("height", (height - 2 * padding) + "px")
            .style("position", "absolute")
            .style("top", padding + "px")
            .style("left", padding + "px");
        if (!this.settings.noSvg) {
            this.svg = container.append("svg").attr({
                "width": width,
                "height": height
            }).style({
                "position": "absolute",
                "left": "0",
                "top": "0"
            }).append("g")
                .attr("transform", "translate(" + padding + "," + padding + ")");
            this.svg.append("g").attr("class", "train");
            this.svg.append("g").attr("class", "test");
        }
        if (this.settings.showAxes) {
            var xAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient("bottom");
            var yAxis = d3.svg.axis()
                .scale(this.yScale)
                .orient("right");
            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height - 2 * padding) + ")")
                .call(xAxis);
            this.svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + (width - 2 * padding) + ",0)")
                .call(yAxis);
        }
    }
    HeatMap.prototype.updateTestPoints = function (points) {
        if (this.settings.noSvg) {
            throw Error("Can't add points since noSvg=true");
        }
        this.updateCircles(this.svg.select("g.test"), points);
    };
    HeatMap.prototype.updatePoints = function (points) {
        if (this.settings.noSvg) {
            throw Error("Can't add points since noSvg=true");
        }
        this.updateCircles(this.svg.select("g.train"), points);
    };
    HeatMap.prototype.updateBackground = function (data, discretize) {
        var dx = data[0].length;
        var dy = data.length;
        if (dx !== this.numSamples || dy !== this.numSamples) {
            throw new Error("The provided data matrix must be of size " +
                "numSamples X numSamples");
        }
        var context = this.canvas.node().getContext("2d");
        var image = context.createImageData(dx, dy);
        for (var y = 0, p = -1; y < dy; ++y) {
            for (var x = 0; x < dx; ++x) {
                var value = data[x][y];
                if (discretize) {
                    value = (value >= 0 ? 1 : -1);
                }
                var c = d3.rgb(this.color(value));
                image.data[++p] = c.r;
                image.data[++p] = c.g;
                image.data[++p] = c.b;
                image.data[++p] = 160;
            }
        }
        context.putImageData(image, 0, 0);
    };
    HeatMap.prototype.updateCircles = function (container, points) {
        var _this = this;
        var xDomain = this.xScale.domain();
        var yDomain = this.yScale.domain();
        points = points.filter(function (p) {
            return p.x >= xDomain[0] && p.x <= xDomain[1]
                && p.y >= yDomain[0] && p.y <= yDomain[1];
        });
        var selection = container.selectAll("circle").data(points);
        selection.enter().append("circle").attr("r", 3);
        selection
            .attr({
            cx: function (d) { return _this.xScale(d.x); },
            cy: function (d) { return _this.yScale(d.y); }
        })
            .style("fill", function (d) { return _this.color(d.label); });
        selection.exit().remove();
    };
    return HeatMap;
}());
exports.HeatMap = HeatMap;
function reduceMatrix(matrix, factor) {
    if (matrix.length !== matrix[0].length) {
        throw new Error("The provided matrix must be a square matrix");
    }
    if (matrix.length % factor !== 0) {
        throw new Error("The width/height of the matrix must be divisible by " +
            "the reduction factor");
    }
    var result = new Array(matrix.length / factor);
    for (var i = 0; i < matrix.length; i += factor) {
        result[i / factor] = new Array(matrix.length / factor);
        for (var j = 0; j < matrix.length; j += factor) {
            var avg = 0;
            for (var k = 0; k < factor; k++) {
                for (var l = 0; l < factor; l++) {
                    avg += matrix[i + k][j + l];
                }
            }
            avg /= (factor * factor);
            result[i / factor][j / factor] = avg;
        }
    }
    return result;
}
exports.reduceMatrix = reduceMatrix;

},{}],3:[function(require,module,exports){
"use strict";
var AppendingLineChart = (function () {
    function AppendingLineChart(container, lineColors) {
        this.data = [];
        this.minY = Number.MAX_VALUE;
        this.maxY = Number.MIN_VALUE;
        this.lineColors = lineColors;
        this.numLines = lineColors.length;
        var node = container.node();
        var totalWidth = node.offsetWidth;
        var totalHeight = node.offsetHeight;
        var margin = { top: 2, right: 0, bottom: 2, left: 2 };
        var width = totalWidth - margin.left - margin.right;
        var height = totalHeight - margin.top - margin.bottom;
        this.xScale = d3.scale.linear()
            .domain([0, 0])
            .range([0, width]);
        this.yScale = d3.scale.linear()
            .domain([0, 0])
            .range([height, 0]);
        this.svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        this.paths = new Array(this.numLines);
        for (var i = 0; i < this.numLines; i++) {
            this.paths[i] = this.svg.append("path")
                .attr("class", "line")
                .style({
                "fill": "none",
                "stroke": lineColors[i],
                "stroke-width": "1.5px"
            });
        }
    }
    AppendingLineChart.prototype.reset = function () {
        this.data = [];
        this.redraw();
        this.minY = Number.MAX_VALUE;
        this.maxY = Number.MIN_VALUE;
    };
    AppendingLineChart.prototype.addDataPoint = function (dataPoint) {
        var _this = this;
        if (dataPoint.length !== this.numLines) {
            throw Error("Length of dataPoint must equal number of lines");
        }
        dataPoint.forEach(function (y) {
            _this.minY = Math.min(_this.minY, y);
            _this.maxY = Math.max(_this.maxY, y);
        });
        this.data.push({ x: this.data.length + 1, y: dataPoint });
        this.redraw();
    };
    AppendingLineChart.prototype.redraw = function () {
        var _this = this;
        this.xScale.domain([1, this.data.length]);
        this.yScale.domain([this.minY, this.maxY]);
        var getPathMap = function (lineIndex) {
            return d3.svg.line()
                .x(function (d) { return _this.xScale(d.x); })
                .y(function (d) { return _this.yScale(d.y[lineIndex]); });
        };
        for (var i = 0; i < this.numLines; i++) {
            this.paths[i].datum(this.data).attr("d", getPathMap(i));
        }
    };
    return AppendingLineChart;
}());
exports.AppendingLineChart = AppendingLineChart;

},{}],4:[function(require,module,exports){
"use strict";
var Node = (function () {
    function Node(id, activation, initZero) {
        this.inputLinks = [];
        this.bias = 0.1;
        this.outputs = [];
        this.trueLearningRate = 0;
        this.outputDer = 0;
        this.inputDer = 0;
        this.accInputDer = 0;
        this.numAccumulatedDers = 0;
        this.id = id;
        this.activation = activation;
        if (initZero) {
            this.bias = 0;
        }
    }
    Node.prototype.updateOutput = function () {
        this.totalInput = this.bias;
        for (var j = 0; j < this.inputLinks.length; j++) {
            var link = this.inputLinks[j];
            this.totalInput += link.weight * link.source.output;
        }
        this.output = this.activation.output(this.totalInput);
        return this.output;
    };
    return Node;
}());
exports.Node = Node;
var Errors = (function () {
    function Errors() {
    }
    return Errors;
}());
Errors.SQUARE = {
    error: function (output, target) {
        return 0.5 * Math.pow(output - target, 2);
    },
    der: function (output, target) { return output - target; }
};
exports.Errors = Errors;
Math.tanh = Math.tanh || function (x) {
    if (x === Infinity) {
        return 1;
    }
    else if (x === -Infinity) {
        return -1;
    }
    else {
        var e2x = Math.exp(2 * x);
        return (e2x - 1) / (e2x + 1);
    }
};
var Activations = (function () {
    function Activations() {
    }
    return Activations;
}());
Activations.TANH = {
    output: function (x) { return Math.tanh(x); },
    der: function (x) {
        var output = Activations.TANH.output(x);
        return 1 - output * output;
    }
};
Activations.RELU = {
    output: function (x) { return Math.max(0, x); },
    der: function (x) { return x <= 0 ? 0 : 1; }
};
Activations.SIGMOID = {
    output: function (x) { return 1 / (1 + Math.exp(-x)); },
    der: function (x) {
        var output = Activations.SIGMOID.output(x);
        return output * (1 - output);
    }
};
Activations.LINEAR = {
    output: function (x) { return x; },
    der: function (x) { return 1; }
};
Activations.SINX = {
    output: function (x) { return Math.sin(x); },
    der: function (x) { return Math.cos(x); }
};
exports.Activations = Activations;
var RegularizationFunction = (function () {
    function RegularizationFunction() {
    }
    return RegularizationFunction;
}());
RegularizationFunction.L1 = {
    output: function (w) { return Math.abs(w); },
    der: function (w) { return w < 0 ? -1 : (w > 0 ? 1 : 0); }
};
RegularizationFunction.L2 = {
    output: function (w) { return 0.5 * w * w; },
    der: function (w) { return w; }
};
exports.RegularizationFunction = RegularizationFunction;
var Link = (function () {
    function Link(source, dest, regularization, initZero) {
        this.weight = Math.random() - 0.5;
        this.isDead = false;
        this.errorDer = 0;
        this.accErrorDer = 0;
        this.numAccumulatedDers = 0;
        this.trueLearningRate = 0;
        this.id = source.id + "-" + dest.id;
        this.source = source;
        this.dest = dest;
        this.regularization = regularization;
        if (initZero) {
            this.weight = 0;
        }
    }
    return Link;
}());
exports.Link = Link;
function buildNetwork(networkShape, activation, outputActivation, regularization, inputIds, initZero) {
    var numLayers = networkShape.length;
    var id = 1;
    var network = [];
    for (var layerIdx = 0; layerIdx < numLayers; layerIdx++) {
        var isOutputLayer = layerIdx === numLayers - 1;
        var isInputLayer = layerIdx === 0;
        var currentLayer = [];
        network.push(currentLayer);
        var numNodes = networkShape[layerIdx];
        for (var i = 0; i < numNodes; i++) {
            var nodeId = id.toString();
            if (isInputLayer) {
                nodeId = inputIds[i];
            }
            else {
                id++;
            }
            var node = new Node(nodeId, isOutputLayer ? outputActivation : activation, initZero);
            currentLayer.push(node);
            if (layerIdx >= 1) {
                for (var j = 0; j < network[layerIdx - 1].length; j++) {
                    var prevNode = network[layerIdx - 1][j];
                    var link = new Link(prevNode, node, regularization, initZero);
                    prevNode.outputs.push(link);
                    node.inputLinks.push(link);
                }
            }
        }
    }
    return network;
}
exports.buildNetwork = buildNetwork;
function forwardProp(network, inputs) {
    var inputLayer = network[0];
    if (inputs.length !== inputLayer.length) {
        throw new Error("The number of inputs must match the number of nodes in" +
            " the input layer");
    }
    for (var i = 0; i < inputLayer.length; i++) {
        var node = inputLayer[i];
        node.output = inputs[i];
    }
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            node.updateOutput();
        }
    }
    return network[network.length - 1][0].output;
}
exports.forwardProp = forwardProp;
function backProp(network, target, errorFunc) {
    var outputNode = network[network.length - 1][0];
    outputNode.outputDer = errorFunc.der(outputNode.output, target);
    for (var layerIdx = network.length - 1; layerIdx >= 1; layerIdx--) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            node.inputDer = node.outputDer * node.activation.der(node.totalInput);
            node.accInputDer += node.inputDer;
            node.numAccumulatedDers++;
        }
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            for (var j = 0; j < node.inputLinks.length; j++) {
                var link = node.inputLinks[j];
                if (link.isDead) {
                    continue;
                }
                link.errorDer = node.inputDer * link.source.output;
                link.accErrorDer += link.errorDer;
                link.numAccumulatedDers++;
            }
        }
        if (layerIdx === 1) {
            continue;
        }
        var prevLayer = network[layerIdx - 1];
        for (var i = 0; i < prevLayer.length; i++) {
            var node = prevLayer[i];
            node.outputDer = 0;
            for (var j = 0; j < node.outputs.length; j++) {
                var output = node.outputs[j];
                node.outputDer += output.weight * output.dest.inputDer;
            }
        }
    }
}
exports.backProp = backProp;
function updateWeights(network, learningRate, regularizationRate) {
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            if (node.numAccumulatedDers > 0) {
                node.trueLearningRate = node.accInputDer / node.numAccumulatedDers;
                node.bias -= learningRate * node.trueLearningRate;
                node.accInputDer = 0;
                node.numAccumulatedDers = 0;
            }
            for (var j = 0; j < node.inputLinks.length; j++) {
                var link = node.inputLinks[j];
                if (link.isDead) {
                    continue;
                }
                var regulDer = link.regularization ?
                    link.regularization.der(link.weight) : 0;
                if (link.numAccumulatedDers > 0) {
                    link.trueLearningRate = link.accErrorDer / link.numAccumulatedDers;
                    link.weight = link.weight - learningRate * link.trueLearningRate;
                    var newLinkWeight = link.weight -
                        (learningRate * regularizationRate) * regulDer;
                    if (link.regularization === RegularizationFunction.L1 &&
                        link.weight * newLinkWeight < 0) {
                        link.weight = 0;
                        link.isDead = true;
                    }
                    else {
                        link.weight = newLinkWeight;
                    }
                    link.accErrorDer = 0;
                    link.numAccumulatedDers = 0;
                }
            }
        }
    }
}
exports.updateWeights = updateWeights;
function forEachNode(network, ignoreInputs, accessor) {
    for (var layerIdx = ignoreInputs ? 1 : 0; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            accessor(node);
        }
    }
}
exports.forEachNode = forEachNode;
function getOutputNode(network) {
    return network[network.length - 1][0];
}
exports.getOutputNode = getOutputNode;

},{}],5:[function(require,module,exports){
"use strict";
var nn = require("./nn");
var heatmap_1 = require("./heatmap");
var state_1 = require("./state");
var dataset_1 = require("./dataset");
var linechart_1 = require("./linechart");
var mainWidth;
function mtrunc(v) {
    v = +v;
    return (v - v % 1) || (!isFinite(v) || v === 0 ? v : v < 0 ? -0 : 0);
}
function log2(x) {
    return Math.log(x) / Math.log(2);
}
function log10(x) {
    return Math.log(x) / Math.log(10);
}
function signalOf(x) {
    return log2(1 + Math.abs(x));
}
function SNR(x) {
    return 10 * log10(x);
}
d3.select(".more button").on("click", function () {
    var position = 800;
    d3.transition()
        .duration(1000)
        .tween("scroll", scrollTween(position));
});
function scrollTween(offset) {
    return function () {
        var i = d3.interpolateNumber(window.pageYOffset ||
            document.documentElement.scrollTop, offset);
        return function (t) {
            scrollTo(0, i(t));
        };
    };
}
var RECT_SIZE = 30;
var BIAS_SIZE = 5;
var NUM_SAMPLES_CLASSIFY = 500;
var NUM_SAMPLES_REGRESS = 1200;
var DENSITY = 100;
var MAX_NEURONS = 32;
var MAX_HLAYERS = 10;
var REQ_CAP_ROUNDING = -1;
var HoverType;
(function (HoverType) {
    HoverType[HoverType["BIAS"] = 0] = "BIAS";
    HoverType[HoverType["WEIGHT"] = 1] = "WEIGHT";
})(HoverType || (HoverType = {}));
var INPUTS = {
    "x": { f: function (x, y) { return x; }, label: "X_1" },
    "y": { f: function (x, y) { return y; }, label: "X_2" },
    "xSquared": { f: function (x, y) { return x * x; }, label: "X_1^2" },
    "ySquared": { f: function (x, y) { return y * y; }, label: "X_2^2" },
    "xTimesY": { f: function (x, y) { return x * y; }, label: "X_1X_2" },
    "sinX": { f: function (x, y) { return Math.sin(x); }, label: "sin(X_1)" },
    "sinY": { f: function (x, y) { return Math.sin(y); }, label: "sin(X_2)" }
};
var HIDABLE_CONTROLS = [
    ["Show test data", "showTestData"],
    ["Discretize output", "discretize"],
    ["Play button", "playButton"],
    ["Step button", "stepButton"],
    ["Reset button", "resetButton"],
    ["Rate scale factor", "learningRate"],
    ["Learning rate", "trueLearningRate"],
    ["Activation", "activation"],
    ["Regularization", "regularization"],
    ["Regularization rate", "regularizationRate"],
    ["Problem type", "problem"],
    ["Which dataset", "dataset"],
    ["Ratio train data", "percTrainData"],
    ["Noise level", "noise"],
    ["Batch size", "batchSize"],
    ["# of hidden layers", "numHiddenLayers"],
];
var Player = (function () {
    function Player() {
        this.timerIndex = 0;
        this.isPlaying = false;
        this.callback = null;
    }
    Player.prototype.playOrPause = function () {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.pause();
        }
        else {
            this.isPlaying = true;
            if (iter === 0) {
                simulationStarted();
            }
            this.play();
        }
    };
    Player.prototype.onPlayPause = function (callback) {
        this.callback = callback;
    };
    Player.prototype.play = function () {
        this.pause();
        this.isPlaying = true;
        if (this.callback) {
            this.callback(this.isPlaying);
        }
        this.start(this.timerIndex);
    };
    Player.prototype.pause = function () {
        this.timerIndex++;
        this.isPlaying = false;
        if (this.callback) {
            this.callback(this.isPlaying);
        }
    };
    Player.prototype.start = function (localTimerIndex) {
        var _this = this;
        d3.timer(function () {
            if (localTimerIndex < _this.timerIndex) {
                return true;
            }
            oneStep();
            return false;
        }, 0);
    };
    return Player;
}());
var state = state_1.State.deserializeState();
state.getHiddenProps().forEach(function (prop) {
    if (prop in INPUTS) {
        delete INPUTS[prop];
    }
});
var boundary = {};
var selectedNodeId = null;
var xDomain = [-6, 6];
var heatMap = new heatmap_1.HeatMap(300, DENSITY, xDomain, xDomain, d3.select("#heatmap"), { showAxes: true });
var linkWidthScale = d3.scale.linear()
    .domain([0, 5])
    .range([1, 10])
    .clamp(true);
var colorScale = d3.scale.linear()
    .domain([-1, 0, 1])
    .range(["#0877bd", "#e8eaeb", "#f59322"])
    .clamp(true);
var iter = 0;
var trainData = [];
var testData = [];
var network = null;
var lossTrain = 0;
var lossTest = 0;
var trueLearningRate = 0;
var totalCapacity = 0;
var generalization = 0;
var trainClassesAccuracy = [];
var testClassesAccuracy = [];
var player = new Player();
var lineChart = new linechart_1.AppendingLineChart(d3.select("#linechart"), ["#777", "black"]);
function getReqCapacity(points) {
    var rounding = REQ_CAP_ROUNDING;
    var energy = [];
    var numRows = points.length;
    var numCols = 2;
    var result = 0;
    var retval = [];
    var class1 = -666;
    var numclass1 = 0;
    for (var i = 0; i < numRows; i++) {
        var x = points[i].x / 1.0;
        var y = points[i].y / 1.0;
        var result_1 = (x + y) / 1.0;
        if (rounding != -1) {
            result_1 = mtrunc(result_1 * Math.pow(10, rounding)) / Math.pow(10, rounding);
        }
        var eVal = result_1;
        var label = points[i].label;
        energy.push({ eVal: eVal, label: label });
        if (class1 == -666) {
            class1 = label;
        }
        if (label == class1) {
            numclass1++;
        }
    }
    energy.sort(function (a, b) {
        return a.eVal - b.eVal;
    });
    var curLabel = energy[0].label;
    var changes = 0;
    for (var i = 0; i < energy.length; i++) {
        if (energy[i].label != curLabel) {
            changes++;
            curLabel = energy[i].label;
        }
    }
    var clusters = 0;
    clusters = changes + 1;
    var mincuts = 0;
    mincuts = Math.ceil(log2(clusters));
    var sugCapacity = mincuts * numCols;
    var maxCapacity = changes * (numCols + 1) + changes;
    retval.push(sugCapacity);
    retval.push(maxCapacity);
    return retval;
}
function numberOfUnique(dataset) {
    var count = 0;
    var uniqueDict = {};
    dataset.forEach(function (point) {
        var key = "" + point.x + point.y + point.label;
        if (!(key in uniqueDict)) {
            count += 1;
            uniqueDict[key] = 1;
        }
    });
    return count;
}
function makeGUI() {
    d3.select("#reset-button").on("click", function () {
        reset();
        userHasInteracted();
        d3.select("#play-pause-button");
    });
    d3.select("#play-pause-button").on("click", function () {
        userHasInteracted();
        player.playOrPause();
    });
    player.onPlayPause(function (isPlaying) {
        d3.select("#play-pause-button").classed("playing", isPlaying);
    });
    d3.select("#next-step-button").on("click", function () {
        player.pause();
        userHasInteracted();
        if (iter === 0) {
            simulationStarted();
        }
        oneStep();
    });
    d3.select("#data-regen-button").on("click", function () {
        generateData();
        parametersChanged = true;
    });
    var dataThumbnails = d3.selectAll("canvas[data-dataset]");
    dataThumbnails.on("click", function () {
        var newDataset = state_1.datasets[this.dataset.dataset];
        var datasetKey = state_1.getKeyFromValue(state_1.datasets, newDataset);
        if (newDataset === state.dataset && datasetKey != "byod") {
            return;
        }
        state.dataset = newDataset;
        if (datasetKey === "byod") {
            state.byod = true;
            d3.select("#inputFormBYOD").html("<input type='file' accept='.csv' id='inputFileBYOD'>");
            dataThumbnails.classed("selected", false);
            d3.select(this).classed("selected", true);
            $("#inputFileBYOD").click();
            var inputBYOD = d3.select("#inputFileBYOD");
            inputBYOD.on("change", function (event) {
                var reader = new FileReader();
                var name = this.files[0].name;
                reader.onload = function (event) {
                    var points = [];
                    var target = event.target;
                    var data = target.result;
                    var s = data.split("\n");
                    for (var i = 0; i < s.length; i++) {
                        var ss = s[i].split(",");
                        if (ss.length != 3)
                            break;
                        var x_1 = ss[0];
                        var y = ss[1];
                        var label = ss[2];
                        points.push({ x: x_1, y: y, label: label });
                    }
                    dataset_1.shuffle(points);
                    var splitIndex = Math.floor(points.length * state.percTrainData / 100);
                    trainData = points.slice(0, splitIndex);
                    testData = points.slice(splitIndex);
                    heatMap.updatePoints(trainData);
                    heatMap.updateTestPoints(state.showTestData ? testData : []);
                    state.sugCapacity = getReqCapacity(trainData)[0];
                    state.maxCapacity = getReqCapacity(trainData)[1];
                    d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
                    d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
                    d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
                    parametersChanged = true;
                    reset();
                };
                reader.readAsText(this.files[0]);
            });
        }
        else {
            state.byod = false;
            dataThumbnails.classed("selected", false);
            d3.select(this).classed("selected", true);
            state.noise = 35;
            generateData();
            var points = [];
            for (var i = 0; i < trainData.length; i++) {
                points.push(trainData[i]);
            }
            for (var i = 0; i < testData.length; i++) {
                points.push(testData[i]);
            }
            state.sugCapacity = getReqCapacity(trainData)[0];
            state.maxCapacity = getReqCapacity(trainData)[1];
            d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
            d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
            d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
            parametersChanged = true;
            reset();
        }
    });
    var datasetKey = state_1.getKeyFromValue(state_1.datasets, state.dataset);
    d3.select("canvas[data-dataset=" + datasetKey + "]")
        .classed("selected", true);
    var regDataThumbnails = d3.selectAll("canvas[data-regDataset]");
    regDataThumbnails.on("click", function () {
        var newDataset = state_1.regDatasets[this.dataset.regdataset];
        if (newDataset === state.regDataset) {
            return;
        }
        state.regDataset = newDataset;
        state.sugCapacity = getReqCapacity(trainData)[0];
        state.maxCapacity = getReqCapacity(trainData)[1];
        regDataThumbnails.classed("selected", false);
        d3.select(this).classed("selected", true);
        generateData();
        parametersChanged = true;
        reset();
    });
    var regDatasetKey = state_1.getKeyFromValue(state_1.regDatasets, state.regDataset);
    d3.select("canvas[data-regDataset=" + regDatasetKey + "]")
        .classed("selected", true);
    d3.select("#add-layers").on("click", function () {
        if (state.numHiddenLayers >= MAX_HLAYERS) {
            return;
        }
        state.networkShape[state.numHiddenLayers] = 2;
        state.numHiddenLayers++;
        parametersChanged = true;
        reset();
    });
    d3.select("#remove-layers").on("click", function () {
        if (state.numHiddenLayers <= 0) {
            return;
        }
        state.numHiddenLayers--;
        state.networkShape.splice(state.numHiddenLayers);
        parametersChanged = true;
        reset();
    });
    var showTestData = d3.select("#show-test-data").on("change", function () {
        state.showTestData = this.checked;
        state.serialize();
        userHasInteracted();
        heatMap.updateTestPoints(state.showTestData ? testData : []);
    });
    showTestData.property("checked", state.showTestData);
    var discretize = d3.select("#discretize").on("change", function () {
        state.discretize = this.checked;
        state.serialize();
        userHasInteracted();
        updateUI();
    });
    discretize.property("checked", state.discretize);
    var percTrain = d3.select("#percTrainData").on("input", function () {
        state.percTrainData = this.value;
        d3.select("label[for='percTrainData'] .value").text(this.value);
        generateData();
        d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
        d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
        d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
        parametersChanged = true;
        reset();
    });
    percTrain.property("value", state.percTrainData);
    d3.select("label[for='percTrainData'] .value").text(state.percTrainData);
    function humanReadableInt(n) {
        return n.toFixed(0);
    }
    var noise = d3.select("#noise").on("input", function () {
        state.noise = this.value;
        d3.select("label[for='true-noiseSNR'] .value").text(this.value);
        generateData();
        d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
        d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
        d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
        parametersChanged = true;
        reset();
    });
    noise.property("value", state.noise);
    d3.select("label[for='true-noiseSNR'] .value").text(state.noise);
    d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
    d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
    d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
    var batchSize = d3.select("#batchSize").on("input", function () {
        state.batchSize = this.value;
        d3.select("label[for='batchSize'] .value").text(this.value);
        d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
        d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
        d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
        parametersChanged = true;
        reset();
    });
    batchSize.property("value", state.batchSize);
    d3.select("label[for='batchSize'] .value").text(state.batchSize);
    d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
    d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
    d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
    var activationDropdown = d3.select("#activations").on("change", function () {
        state.activation = state_1.activations[this.value];
        parametersChanged = true;
        reset();
    });
    activationDropdown.property("value", state_1.getKeyFromValue(state_1.activations, state.activation));
    var learningRate = d3.select("#learningRate").on("change", function () {
        state.learningRate = this.value;
        state.serialize();
        userHasInteracted();
        parametersChanged = true;
    });
    learningRate.property("value", state.learningRate);
    var regularDropdown = d3.select("#regularizations").on("change", function () {
        state.regularization = state_1.regularizations[this.value];
        parametersChanged = true;
        reset();
    });
    regularDropdown.property("value", state_1.getKeyFromValue(state_1.regularizations, state.regularization));
    var regularRate = d3.select("#regularRate").on("change", function () {
        state.regularizationRate = +this.value;
        parametersChanged = true;
        reset();
    });
    regularRate.property("value", state.regularizationRate);
    var problem = d3.select("#problem").on("change", function () {
        state.problem = state_1.problems[this.value];
        generateData();
        drawDatasetThumbnails();
        parametersChanged = true;
        reset();
    });
    problem.property("value", state_1.getKeyFromValue(state_1.problems, state.problem));
    var x = d3.scale.linear().domain([-1, 1]).range([0, 144]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues([-1, 0, 1])
        .tickFormat(d3.format("d"));
    d3.select("#colormap g.core").append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,10)")
        .call(xAxis);
    window.addEventListener("resize", function () {
        var newWidth = document.querySelector("#main-part")
            .getBoundingClientRect().width;
        if (newWidth !== mainWidth) {
            mainWidth = newWidth;
            drawNetwork(network);
            updateUI(true);
        }
    });
    if (state.hideText) {
        d3.select("#article-text").style("display", "none");
        d3.select("div.more").style("display", "none");
        d3.select("header").style("display", "none");
    }
}
function updateBiasesUI(network) {
    nn.forEachNode(network, true, function (node) {
        d3.select("rect#bias-" + node.id).style("fill", colorScale(node.bias));
    });
}
function updateWeightsUI(network, container) {
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            for (var j = 0; j < node.inputLinks.length; j++) {
                var link = node.inputLinks[j];
                container.select("#link" + link.source.id + "-" + link.dest.id)
                    .style({
                    "stroke-dashoffset": -iter / 3,
                    "stroke-width": linkWidthScale(Math.abs(link.weight)),
                    "stroke": colorScale(link.weight)
                })
                    .datum(link);
            }
        }
    }
}
function drawNode(cx, cy, nodeId, isInput, container, node) {
    var x = cx - RECT_SIZE / 2;
    var y = cy - RECT_SIZE / 2;
    var nodeGroup = container.append("g").attr({
        "class": "node",
        "id": "node" + nodeId,
        "transform": "translate(" + x + "," + y + ")"
    });
    nodeGroup.append("rect").attr({
        x: 0,
        y: 0,
        width: RECT_SIZE,
        height: RECT_SIZE
    });
    var activeOrNotClass = state[nodeId] ? "active" : "inactive";
    if (isInput) {
        var label = INPUTS[nodeId].label != null ? INPUTS[nodeId].label : nodeId;
        var text = nodeGroup.append("text").attr({
            "class": "main-label",
            x: -10,
            y: RECT_SIZE / 2, "text-anchor": "end"
        });
        if (/[_^]/.test(label)) {
            var myRe = /(.*?)([_^])(.)/g;
            var myArray = void 0;
            var lastIndex = void 0;
            while ((myArray = myRe.exec(label)) != null) {
                lastIndex = myRe.lastIndex;
                var prefix = myArray[1];
                var sep = myArray[2];
                var suffix = myArray[3];
                if (prefix) {
                    text.append("tspan").text(prefix);
                }
                text.append("tspan")
                    .attr("baseline-shift", sep === "_" ? "sub" : "super")
                    .style("font-size", "9px")
                    .text(suffix);
            }
            if (label.substring(lastIndex)) {
                text.append("tspan").text(label.substring(lastIndex));
            }
        }
        else {
            text.append("tspan").text(label);
        }
        nodeGroup.classed(activeOrNotClass, true);
    }
    if (!isInput) {
        nodeGroup.append("rect").attr({
            id: "bias-" + nodeId,
            x: -BIAS_SIZE - 2,
            y: RECT_SIZE - BIAS_SIZE + 3,
            width: BIAS_SIZE,
            height: BIAS_SIZE
        })
            .on("mouseenter", function () {
            updateHoverCard(HoverType.BIAS, node, d3.mouse(container.node()));
        })
            .on("mouseleave", function () {
            updateHoverCard(null);
        });
    }
    var div = d3.select("#network").insert("div", ":first-child").attr({
        "id": "canvas-" + nodeId,
        "class": "canvas"
    })
        .style({
        position: "absolute",
        left: x + 3 + "px",
        top: y + 3 + "px"
    })
        .on("mouseenter", function () {
        selectedNodeId = nodeId;
        div.classed("hovered", true);
        nodeGroup.classed("hovered", true);
        updateDecisionBoundary(network, false);
        heatMap.updateBackground(boundary[nodeId], state.discretize);
    })
        .on("mouseleave", function () {
        selectedNodeId = null;
        div.classed("hovered", false);
        nodeGroup.classed("hovered", false);
        updateDecisionBoundary(network, false);
        heatMap.updateBackground(boundary[nn.getOutputNode(network).id], state.discretize);
    });
    if (isInput) {
        div.on("click", function () {
            state[nodeId] = !state[nodeId];
            parametersChanged = true;
            reset();
        });
        div.style("cursor", "pointer");
    }
    if (isInput) {
        div.classed(activeOrNotClass, true);
    }
    var nodeHeatMap = new heatmap_1.HeatMap(RECT_SIZE, DENSITY / 10, xDomain, xDomain, div, { noSvg: true });
    div.datum({ heatmap: nodeHeatMap, id: nodeId });
}
function drawNetwork(network) {
    var svg = d3.select("#svg");
    svg.select("g.core").remove();
    d3.select("#network").selectAll("div.canvas").remove();
    d3.select("#network").selectAll("div.plus-minus-neurons").remove();
    var padding = 3;
    var co = d3.select(".column.output").node();
    var cf = d3.select(".column.features").node();
    var width = co.offsetLeft - cf.offsetLeft;
    svg.attr("width", width);
    var node2coord = {};
    var container = svg.append("g")
        .classed("core", true)
        .attr("transform", "translate(" + padding + "," + padding + ")");
    var numLayers = network.length;
    var featureWidth = 118;
    var layerScale = d3.scale.ordinal()
        .domain(d3.range(1, numLayers - 1))
        .rangePoints([featureWidth, width - RECT_SIZE], 0.7);
    var nodeIndexScale = function (nodeIndex) { return nodeIndex * (RECT_SIZE + 25); };
    var calloutThumb = d3.select(".callout.thumbnail").style("display", "none");
    var calloutWeights = d3.select(".callout.weights").style("display", "none");
    var idWithCallout = null;
    var targetIdWithCallout = null;
    var cx = RECT_SIZE / 2 + 50;
    var nodeIds = Object.keys(INPUTS);
    var maxY = nodeIndexScale(nodeIds.length);
    nodeIds.forEach(function (nodeId, i) {
        var cy = nodeIndexScale(i) + RECT_SIZE / 2;
        node2coord[nodeId] = { cx: cx, cy: cy };
        drawNode(cx, cy, nodeId, true, container);
    });
    for (var layerIdx = 1; layerIdx < numLayers - 1; layerIdx++) {
        var numNodes = network[layerIdx].length;
        var cx_1 = layerScale(layerIdx) + RECT_SIZE / 2;
        maxY = Math.max(maxY, nodeIndexScale(numNodes));
        addPlusMinusControl(layerScale(layerIdx), layerIdx);
        for (var i = 0; i < numNodes; i++) {
            var node_1 = network[layerIdx][i];
            var cy_1 = nodeIndexScale(i) + RECT_SIZE / 2;
            node2coord[node_1.id] = { cx: cx_1, cy: cy_1 };
            drawNode(cx_1, cy_1, node_1.id, false, container, node_1);
            var numNodes_1 = network[layerIdx].length;
            var nextNumNodes = network[layerIdx + 1].length;
            if (idWithCallout == null &&
                i === numNodes_1 - 1 &&
                nextNumNodes <= numNodes_1) {
                calloutThumb.style({
                    display: null,
                    top: 20 + 3 + cy_1 + "px",
                    left: cx_1 + "px"
                });
                idWithCallout = node_1.id;
            }
            for (var j = 0; j < node_1.inputLinks.length; j++) {
                var link = node_1.inputLinks[j];
                var path = drawLink(link, node2coord, network, container, j === 0, j, node_1.inputLinks.length).node();
                var prevLayer = network[layerIdx - 1];
                var lastNodePrevLayer = prevLayer[prevLayer.length - 1];
                if (targetIdWithCallout == null &&
                    i === numNodes_1 - 1 &&
                    link.source.id === lastNodePrevLayer.id &&
                    (link.source.id !== idWithCallout || numLayers <= 5) &&
                    link.dest.id !== idWithCallout &&
                    prevLayer.length >= numNodes_1) {
                    var midPoint = path.getPointAtLength(path.getTotalLength() * 0.7);
                    calloutWeights.style({
                        display: null,
                        top: midPoint.y + 5 + "px",
                        left: midPoint.x + 3 + "px"
                    });
                    targetIdWithCallout = link.dest.id;
                }
            }
        }
    }
    cx = width + RECT_SIZE / 2;
    var node = network[numLayers - 1][0];
    var cy = nodeIndexScale(0) + RECT_SIZE / 2;
    node2coord[node.id] = { cx: cx, cy: cy };
    for (var i = 0; i < node.inputLinks.length; i++) {
        var link = node.inputLinks[i];
        drawLink(link, node2coord, network, container, i === 0, i, node.inputLinks.length);
    }
    svg.attr("height", maxY);
    var height = Math.max(getRelativeHeight(calloutThumb), getRelativeHeight(calloutWeights), getRelativeHeight(d3.select("#network")));
    d3.select(".column.features").style("height", height + "px");
}
function getRelativeHeight(selection) {
    var node = selection.node();
    return node.offsetHeight + node.offsetTop;
}
function addPlusMinusControl(x, layerIdx) {
    var div = d3.select("#network").append("div")
        .classed("plus-minus-neurons", true)
        .style("left", x - 10 + "px");
    var i = layerIdx - 1;
    var firstRow = div.append("div").attr("class", "ui-numNodes" + layerIdx);
    firstRow.append("button")
        .attr("class", "mdl-button mdl-js-button mdl-button--icon")
        .on("click", function () {
        var numNeurons = state.networkShape[i];
        if (numNeurons >= MAX_NEURONS) {
            return;
        }
        state.networkShape[i]++;
        parametersChanged = true;
        reset();
    })
        .append("i")
        .attr("class", "material-icons")
        .text("add");
    firstRow.append("button")
        .attr("class", "mdl-button mdl-js-button mdl-button--icon")
        .on("click", function () {
        var numNeurons = state.networkShape[i];
        if (numNeurons <= 1) {
            return;
        }
        state.networkShape[i]--;
        parametersChanged = true;
        reset();
    })
        .append("i")
        .attr("class", "material-icons")
        .text("remove");
    var suffix = state.networkShape[i] > 1 ? "s" : "";
    div.append("div").text(state.networkShape[i] + " neuron" + suffix);
}
function updateHoverCard(type, nodeOrLink, coordinates) {
    var hovercard = d3.select("#hovercard");
    if (type == null) {
        hovercard.style("display", "none");
        d3.select("#svg").on("click", null);
        return;
    }
    d3.select("#svg").on("click", function () {
        hovercard.select(".value").style("display", "none");
        var input = hovercard.select("input");
        input.style("display", null);
        input.on("input", function () {
            if (this.value != null && this.value !== "") {
                if (type === HoverType.WEIGHT) {
                    nodeOrLink.weight = +this.value;
                }
                else {
                    nodeOrLink.bias = +this.value;
                }
                updateUI();
            }
        });
        input.on("keypress", function () {
            if (d3.event.keyCode === 13) {
                updateHoverCard(type, nodeOrLink, coordinates);
            }
        });
        input.node().focus();
    });
    var value = (type === HoverType.WEIGHT) ?
        nodeOrLink.weight :
        nodeOrLink.bias;
    var name = (type === HoverType.WEIGHT) ? "Weight" : "Bias";
    hovercard.style({
        "left": coordinates[0] + 20 + "px",
        "top": coordinates[1] + "px",
        "display": "block"
    });
    hovercard.select(".type").text(name);
    hovercard.select(".value")
        .style("display", null)
        .text(value.toPrecision(2));
    hovercard.select("input")
        .property("value", value.toPrecision(2))
        .style("display", "none");
}
function drawLink(input, node2coord, network, container, isFirst, index, length) {
    var line = container.insert("path", ":first-child");
    var source = node2coord[input.source.id];
    var dest = node2coord[input.dest.id];
    var datum = {
        source: {
            y: source.cx + RECT_SIZE / 2 + 2,
            x: source.cy
        },
        target: {
            y: dest.cx - RECT_SIZE / 2,
            x: dest.cy + ((index - (length - 1) / 2) / length) * 12
        }
    };
    var diagonal = d3.svg.diagonal().projection(function (d) { return [d.y, d.x]; });
    line.attr({
        "marker-start": "url(#markerArrow)",
        "class": "link",
        id: "link" + input.source.id + "-" + input.dest.id,
        d: diagonal(datum, 0)
    });
    container.append("path")
        .attr("d", diagonal(datum, 0))
        .attr("class", "link-hover")
        .on("mouseenter", function () {
        updateHoverCard(HoverType.WEIGHT, input, d3.mouse(this));
    }).on("mouseleave", function () {
        updateHoverCard(null);
    });
    return line;
}
function updateDecisionBoundary(network, firstTime) {
    if (firstTime) {
        boundary = {};
        nn.forEachNode(network, true, function (node) {
            boundary[node.id] = new Array(DENSITY);
        });
        for (var nodeId in INPUTS) {
            boundary[nodeId] = new Array(DENSITY);
        }
    }
    var xScale = d3.scale.linear().domain([0, DENSITY - 1]).range(xDomain);
    var yScale = d3.scale.linear().domain([DENSITY - 1, 0]).range(xDomain);
    var i = 0, j = 0;
    for (i = 0; i < DENSITY; i++) {
        if (firstTime) {
            nn.forEachNode(network, true, function (node) {
                boundary[node.id][i] = new Array(DENSITY);
            });
            for (var nodeId in INPUTS) {
                boundary[nodeId][i] = new Array(DENSITY);
            }
        }
        for (j = 0; j < DENSITY; j++) {
            var x = xScale(i);
            var y = yScale(j);
            var input = constructInput(x, y);
            nn.forwardProp(network, input);
            nn.forEachNode(network, true, function (node) {
                boundary[node.id][i][j] = node.output;
            });
            if (firstTime) {
                for (var nodeId in INPUTS) {
                    boundary[nodeId][i][j] = INPUTS[nodeId].f(x, y);
                }
            }
        }
    }
}
function getLearningRate(network) {
    var trueLearningRate = 0;
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            trueLearningRate += node.trueLearningRate;
        }
    }
    return trueLearningRate;
}
function getTotalCapacity(network) {
    var totalCapacity = 0;
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        totalCapacity += currentLayer.length;
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            totalCapacity += node.inputLinks.length;
        }
    }
    return totalCapacity;
}
function getLoss(network, dataPoints) {
    var loss = 0;
    for (var i = 0; i < dataPoints.length; i++) {
        var dataPoint = dataPoints[i];
        var input = constructInput(dataPoint.x, dataPoint.y);
        var output = nn.forwardProp(network, input);
        loss += nn.Errors.SQUARE.error(output, dataPoint.label);
    }
    return loss / dataPoints.length * 100;
}
function getNumberOfCorrectClassifications(network, dataPoints) {
    var correctlyClassified = 0;
    for (var i = 0; i < dataPoints.length; i++) {
        var dataPoint = dataPoints[i];
        var input = constructInput(dataPoint.x, dataPoint.y);
        var output = nn.forwardProp(network, input);
        var prediction = (output > 0) ? 1 : -1;
        var correct = (prediction === dataPoint.label) ? 1 : 0;
        correctlyClassified += correct;
    }
    return correctlyClassified;
}
function getNumberOfEachClass(network, dataPoints) {
    var firstClass = 0;
    var secondClass = 0;
    for (var i = 0; i < dataPoints.length; i++) {
        var dataPoint = dataPoints[i];
        firstClass += (dataPoint.label === -1) ? 1 : 0;
        secondClass += (dataPoint.label === 1) ? 1 : 0;
    }
    return [firstClass, secondClass];
}
function getAccuracyForEachClass(network, dataPoints) {
    var firstClassCorrect = 0;
    var secondClassCorrect = 0;
    for (var i = 0; i < dataPoints.length; i++) {
        var dataPoint = dataPoints[i];
        var input = constructInput(dataPoint.x, dataPoint.y);
        var output = nn.forwardProp(network, input);
        var prediction = (output > 0) ? 1 : -1;
        var isCorrect = prediction === dataPoint.label;
        if (isCorrect) {
            if (dataPoint.label === -1) {
                firstClassCorrect += 1;
            }
            else {
                secondClassCorrect += 1;
            }
        }
    }
    var classesCount = getNumberOfEachClass(network, dataPoints);
    return [firstClassCorrect / classesCount[0], secondClassCorrect / classesCount[1]];
}
function updateUI(firstStep) {
    if (firstStep === void 0) { firstStep = false; }
    updateWeightsUI(network, d3.select("g.core"));
    updateBiasesUI(network);
    updateDecisionBoundary(network, firstStep);
    var selectedId = selectedNodeId != null ?
        selectedNodeId : nn.getOutputNode(network).id;
    heatMap.updateBackground(boundary[selectedId], state.discretize);
    d3.select("#network").selectAll("div.canvas")
        .each(function (data) {
        data.heatmap.updateBackground(heatmap_1.reduceMatrix(boundary[data.id], 10), state.discretize);
    });
    function zeroPad(n) {
        var pad = "000000";
        return (pad + n).slice(-pad.length);
    }
    function addCommas(s) {
        return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function humanReadable(n) {
        return n.toFixed(4);
    }
    function humanReadableInt(n) {
        return n.toFixed(0);
    }
    function signalOf(n) {
        return Math.log(1 + Math.abs(n));
    }
    var log2 = 1.0 / Math.log(2.0);
    var bitLossTest = lossTest;
    var bitLossTrain = lossTrain;
    var bitTrueLearningRate = signalOf(trueLearningRate) * log2;
    var bitGeneralization = generalization;
    d3.select("#loss-train").text(humanReadable(bitLossTrain));
    d3.select("#loss-test").text(humanReadable(bitLossTest));
    d3.select("#generalization").text(humanReadable(bitGeneralization));
    d3.select("#train-accuracy-first").text(humanReadable(trainClassesAccuracy[0]));
    d3.select("#train-accuracy-second").text(humanReadable(trainClassesAccuracy[1]));
    d3.select("#test-accuracy-first").text(humanReadable(testClassesAccuracy[0]));
    d3.select("#test-accuracy-second").text(humanReadable(testClassesAccuracy[1]));
    d3.select("#iter-number").text(addCommas(zeroPad(iter)));
    d3.select("#total-capacity").text(humanReadableInt(totalCapacity));
    lineChart.addDataPoint([lossTrain, lossTest]);
}
function constructInputIds() {
    var result = [];
    for (var inputName in INPUTS) {
        if (state[inputName]) {
            result.push(inputName);
        }
    }
    return result;
}
function constructInput(x, y) {
    var input = [];
    for (var inputName in INPUTS) {
        if (state[inputName]) {
            input.push(INPUTS[inputName].f(x, y));
        }
    }
    return input;
}
function oneStep() {
    iter++;
    trainData.forEach(function (point, i) {
        var input = constructInput(point.x, point.y);
        nn.forwardProp(network, input);
        nn.backProp(network, point.label, nn.Errors.SQUARE);
        if ((i + 1) % state.batchSize === 0) {
            nn.updateWeights(network, state.learningRate, state.regularizationRate);
        }
    });
    trueLearningRate = getLearningRate(network);
    totalCapacity = getTotalCapacity(network);
    lossTrain = getLoss(network, trainData);
    lossTest = getLoss(network, testData);
    var numberOfCorrectTrainClassifications = getNumberOfCorrectClassifications(network, trainData);
    var numberOfCorrectTestClassifications = getNumberOfCorrectClassifications(network, testData);
    generalization = (numberOfCorrectTrainClassifications + numberOfCorrectTestClassifications) / totalCapacity;
    trainClassesAccuracy = getAccuracyForEachClass(network, trainData);
    testClassesAccuracy = getAccuracyForEachClass(network, testData);
    console.log(trainClassesAccuracy[0] + " & " + testClassesAccuracy[0]);
    console.log(trainClassesAccuracy[1] + " & " + testClassesAccuracy[1]);
    updateUI();
}
function getOutputWeights(network) {
    var weights = [];
    for (var layerIdx = 0; layerIdx < network.length - 1; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            for (var j = 0; j < node.outputs.length; j++) {
                var output = node.outputs[j];
                weights.push(output.weight);
            }
        }
    }
    return weights;
}
exports.getOutputWeights = getOutputWeights;
function reset(onStartup) {
    if (onStartup === void 0) { onStartup = false; }
    lineChart.reset();
    state.serialize();
    if (!onStartup) {
        userHasInteracted();
    }
    player.pause();
    var suffix = state.numHiddenLayers !== 1 ? "s" : "";
    d3.select("#layers-label").text("Hidden layer" + suffix);
    d3.select("#num-layers").text(state.numHiddenLayers);
    iter = 0;
    var numInputs = constructInput(0, 0).length;
    var shape = [numInputs].concat(state.networkShape).concat([1]);
    var outputActivation = (state.problem === state_1.Problem.REGRESSION) ?
        nn.Activations.LINEAR : nn.Activations.TANH;
    network = nn.buildNetwork(shape, state.activation, outputActivation, state.regularization, constructInputIds(), state.initZero);
    trueLearningRate = getLearningRate(network);
    totalCapacity = getTotalCapacity(network);
    lossTest = getLoss(network, testData);
    lossTrain = getLoss(network, trainData);
    var numberOfCorrectTrainClassifications = getNumberOfCorrectClassifications(network, trainData);
    var numberOfCorrectTestClassifications = getNumberOfCorrectClassifications(network, testData);
    generalization = (numberOfCorrectTrainClassifications + numberOfCorrectTestClassifications) / totalCapacity;
    trainClassesAccuracy = getAccuracyForEachClass(network, trainData);
    testClassesAccuracy = getAccuracyForEachClass(network, testData);
    drawNetwork(network);
    updateUI(true);
}
function initTutorial() {
    if (state.tutorial == null || state.tutorial === "" || state.hideText) {
        return;
    }
    d3.selectAll("article div.l--body").remove();
    var tutorial = d3.select("article").append("div")
        .attr("class", "l--body");
    d3.html("tutorials/" + state.tutorial + ".html", function (err, htmlFragment) {
        if (err) {
            throw err;
        }
        tutorial.node().appendChild(htmlFragment);
        var title = tutorial.select("title");
        if (title.size()) {
            d3.select("header h1").style({
                "margin-top": "20px",
                "margin-bottom": "20px"
            })
                .text(title.text());
            document.title = title.text();
        }
    });
}
function drawDatasetThumbnails() {
    function renderThumbnail(canvas, dataGenerator) {
        var w = 100;
        var h = 100;
        canvas.setAttribute("width", w);
        canvas.setAttribute("height", h);
        var context = canvas.getContext("2d");
        var data = dataGenerator(200, 50);
        data.forEach(function (d) {
            context.fillStyle = colorScale(d.label);
            context.fillRect(w * (d.x + 6) / 12, h * (-d.y + 6) / 12, 4, 4);
        });
        d3.select(canvas.parentNode).style("display", null);
    }
    d3.selectAll(".dataset").style("display", "none");
    if (state.problem === state_1.Problem.CLASSIFICATION) {
        for (var dataset in state_1.datasets) {
            var canvas = document.querySelector("canvas[data-dataset=" + dataset + "]");
            var dataGenerator = state_1.datasets[dataset];
            renderThumbnail(canvas, dataGenerator);
        }
    }
    if (state.problem === state_1.Problem.REGRESSION) {
        for (var regDataset in state_1.regDatasets) {
            var canvas = document.querySelector("canvas[data-regDataset=" + regDataset + "]");
            var dataGenerator = state_1.regDatasets[regDataset];
            renderThumbnail(canvas, dataGenerator);
        }
    }
}
function hideControls() {
    var hiddenProps = state.getHiddenProps();
    hiddenProps.forEach(function (prop) {
        var controls = d3.selectAll(".ui-" + prop);
        if (controls.size() === 0) {
            console.warn("0 html elements found with class .ui-" + prop);
        }
        controls.style("display", "none");
    });
    var hideControls = d3.select(".hide-controls");
    HIDABLE_CONTROLS.forEach(function (_a) {
        var text = _a[0], id = _a[1];
        var label = hideControls.append("label")
            .attr("class", "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect");
        var input = label.append("input")
            .attr({
            type: "checkbox",
            "class": "mdl-checkbox__input"
        });
        if (hiddenProps.indexOf(id) === -1) {
            input.attr("checked", "true");
        }
        input.on("change", function () {
            state.setHideProperty(id, !this.checked);
            state.serialize();
            userHasInteracted();
            d3.select(".hide-controls-link")
                .attr("href", window.location.href);
        });
        label.append("span")
            .attr("class", "mdl-checkbox__label label")
            .text(text);
    });
    d3.select(".hide-controls-link")
        .attr("href", window.location.href);
}
function generateData(firstTime) {
    if (firstTime === void 0) { firstTime = false; }
    if (!firstTime) {
        state.seed = Math.random().toFixed(8);
        state.serialize();
        userHasInteracted();
    }
    Math.seedrandom(state.seed);
    var numSamples = (state.problem === state_1.Problem.REGRESSION) ?
        NUM_SAMPLES_REGRESS : NUM_SAMPLES_CLASSIFY;
    var generator;
    var data = [];
    if (state.byod) {
    }
    if (!state.byod) {
        generator = state.problem === state_1.Problem.CLASSIFICATION ? state.dataset : state.regDataset;
        data = generator(numSamples, state.noise);
        dataset_1.shuffle(data);
        var splitIndex = Math.floor(data.length * state.percTrainData / 100);
        trainData = data.slice(0, splitIndex);
        testData = data.slice(splitIndex);
    }
    state.sugCapacity = getReqCapacity(trainData)[0];
    state.maxCapacity = getReqCapacity(trainData)[1];
    d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
    d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
    d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
    heatMap.updatePoints(trainData);
    heatMap.updateTestPoints(state.showTestData ? testData : []);
}
var firstInteraction = true;
var parametersChanged = false;
function userHasInteracted() {
    if (!firstInteraction) {
        return;
    }
    firstInteraction = false;
    var page = "index";
    if (state.tutorial != null && state.tutorial !== "") {
        page = "/v/tutorials/" + state.tutorial;
    }
    ga("set", "page", page);
    ga("send", "pageview", { "sessionControl": "start" });
}
function simulationStarted() {
    ga("send", {
        hitType: "event",
        eventCategory: "Starting Simulation",
        eventAction: parametersChanged ? "changed" : "unchanged",
        eventLabel: state.tutorial == null ? "" : state.tutorial
    });
    parametersChanged = false;
}
function simulateClick(elem) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    elem.dispatchEvent(evt);
}
drawDatasetThumbnails();
makeGUI();
generateData(true);
reset(true);
hideControls();

},{"./dataset":1,"./heatmap":2,"./linechart":3,"./nn":4,"./state":6}],6:[function(require,module,exports){
"use strict";
var nn = require("./nn");
var dataset = require("./dataset");
var HIDE_STATE_SUFFIX = "_hide";
exports.activations = {
    "relu": nn.Activations.RELU,
    "tanh": nn.Activations.TANH,
    "sigmoid": nn.Activations.SIGMOID,
    "linear": nn.Activations.LINEAR,
    "sinx": nn.Activations.SINX
};
exports.regularizations = {
    "none": null,
    "L1": nn.RegularizationFunction.L1,
    "L2": nn.RegularizationFunction.L2
};
exports.datasets = {
    "circle": dataset.classifyCircleData,
    "xor": dataset.classifyXORData,
    "gauss": dataset.classifyTwoGaussData,
    "spiral": dataset.classifySpiralData,
    "byod": dataset.classifyBYOData
};
exports.regDatasets = {
    "reg-plane": dataset.regressPlane,
    "reg-gauss": dataset.regressGaussian
};
function getKeyFromValue(obj, value) {
    for (var key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
    return undefined;
}
exports.getKeyFromValue = getKeyFromValue;
function endsWith(s, suffix) {
    return s.substr(-suffix.length) === suffix;
}
function getHideProps(obj) {
    var result = [];
    for (var prop in obj) {
        if (endsWith(prop, HIDE_STATE_SUFFIX)) {
            result.push(prop);
        }
    }
    return result;
}
var Type;
(function (Type) {
    Type[Type["STRING"] = 0] = "STRING";
    Type[Type["NUMBER"] = 1] = "NUMBER";
    Type[Type["ARRAY_NUMBER"] = 2] = "ARRAY_NUMBER";
    Type[Type["ARRAY_STRING"] = 3] = "ARRAY_STRING";
    Type[Type["BOOLEAN"] = 4] = "BOOLEAN";
    Type[Type["OBJECT"] = 5] = "OBJECT";
})(Type = exports.Type || (exports.Type = {}));
var Problem;
(function (Problem) {
    Problem[Problem["CLASSIFICATION"] = 0] = "CLASSIFICATION";
    Problem[Problem["REGRESSION"] = 1] = "REGRESSION";
})(Problem = exports.Problem || (exports.Problem = {}));
exports.problems = {
    "classification": Problem.CLASSIFICATION,
    "regression": Problem.REGRESSION
};
var State = (function () {
    function State() {
        this.totalCapacity = 0.0;
        this.reqCapacity = 2;
        this.maxCapacity = 0;
        this.sugCapacity = 0;
        this.lossCapacity = 0;
        this.trueLearningRate = 0.0;
        this.learningRate = 1.0;
        this.regularizationRate = 0;
        this.showTestData = false;
        this.noise = 35;
        this.batchSize = 10;
        this.discretize = false;
        this.tutorial = null;
        this.percTrainData = 50;
        this.activation = nn.Activations.SIGMOID;
        this.regularization = null;
        this.problem = Problem.CLASSIFICATION;
        this.initZero = false;
        this.hideText = false;
        this.collectStats = false;
        this.numHiddenLayers = 1;
        this.hiddenLayerControls = [];
        this.networkShape = [1];
        this.x = true;
        this.y = true;
        this.xTimesY = false;
        this.xSquared = false;
        this.ySquared = false;
        this.cosX = false;
        this.sinX = false;
        this.cosY = false;
        this.sinY = false;
        this.byod = false;
        this.data = [];
        this.dataset = dataset.classifyTwoGaussData;
        this.regDataset = dataset.regressPlane;
    }
    State.deserializeState = function () {
        var map = {};
        for (var _i = 0, _a = window.location.hash.slice(1).split("&"); _i < _a.length; _i++) {
            var keyvalue = _a[_i];
            var _b = keyvalue.split("="), name_1 = _b[0], value = _b[1];
            map[name_1] = value;
        }
        var state = new State();
        function hasKey(name) {
            return name in map && map[name] != null && map[name].trim() !== "";
        }
        function parseArray(value) {
            return value.trim() === "" ? [] : value.split(",");
        }
        State.PROPS.forEach(function (_a) {
            var name = _a.name, type = _a.type, keyMap = _a.keyMap;
            switch (type) {
                case Type.OBJECT:
                    if (keyMap == null) {
                        throw Error("A key-value map must be provided for state " +
                            "variables of type Object");
                    }
                    if (hasKey(name) && map[name] in keyMap) {
                        state[name] = keyMap[map[name]];
                    }
                    break;
                case Type.NUMBER:
                    if (hasKey(name)) {
                        state[name] = +map[name];
                    }
                    break;
                case Type.STRING:
                    if (hasKey(name)) {
                        state[name] = map[name];
                    }
                    break;
                case Type.BOOLEAN:
                    if (hasKey(name)) {
                        state[name] = (map[name] === "false" ? false : true);
                    }
                    break;
                case Type.ARRAY_NUMBER:
                    if (name in map) {
                        state[name] = parseArray(map[name]).map(Number);
                    }
                    break;
                case Type.ARRAY_STRING:
                    if (name in map) {
                        state[name] = parseArray(map[name]);
                    }
                    break;
                default:
                    throw Error("Encountered an unknown type for a state variable");
            }
        });
        getHideProps(map).forEach(function (prop) {
            state[prop] = (map[prop] === "true");
        });
        state.numHiddenLayers = state.networkShape.length;
        if (state.seed == null) {
            state.seed = Math.random().toFixed(5);
        }
        Math.seedrandom(state.seed);
        return state;
    };
    State.prototype.serialize = function () {
        var _this = this;
        var props = [];
        State.PROPS.forEach(function (_a) {
            var name = _a.name, type = _a.type, keyMap = _a.keyMap;
            var value = _this[name];
            if (value == null) {
                return;
            }
            if (type === Type.OBJECT) {
                value = getKeyFromValue(keyMap, value);
            }
            else if (type === Type.ARRAY_NUMBER || type === Type.ARRAY_STRING) {
                value = value.join(",");
            }
            props.push(name + "=" + value);
        });
        getHideProps(this).forEach(function (prop) {
            props.push(prop + "=" + _this[prop]);
        });
        window.location.hash = props.join("&");
    };
    State.prototype.getHiddenProps = function () {
        var result = [];
        for (var prop in this) {
            if (endsWith(prop, HIDE_STATE_SUFFIX) && String(this[prop]) === "true") {
                result.push(prop.replace(HIDE_STATE_SUFFIX, ""));
            }
        }
        return result;
    };
    State.prototype.setHideProperty = function (name, hidden) {
        this[name + HIDE_STATE_SUFFIX] = hidden;
    };
    return State;
}());
State.PROPS = [
    { name: "activation", type: Type.OBJECT, keyMap: exports.activations },
    {
        name: "regularization",
        type: Type.OBJECT,
        keyMap: exports.regularizations
    },
    { name: "batchSize", type: Type.NUMBER },
    { name: "dataset", type: Type.OBJECT, keyMap: exports.datasets },
    { name: "regDataset", type: Type.OBJECT, keyMap: exports.regDatasets },
    { name: "learningRate", type: Type.NUMBER },
    { name: "trueLearningRate", type: Type.NUMBER },
    { name: "regularizationRate", type: Type.NUMBER },
    { name: "noise", type: Type.NUMBER },
    { name: "networkShape", type: Type.ARRAY_NUMBER },
    { name: "seed", type: Type.STRING },
    { name: "showTestData", type: Type.BOOLEAN },
    { name: "discretize", type: Type.BOOLEAN },
    { name: "percTrainData", type: Type.NUMBER },
    { name: "x", type: Type.BOOLEAN },
    { name: "y", type: Type.BOOLEAN },
    { name: "xTimesY", type: Type.BOOLEAN },
    { name: "xSquared", type: Type.BOOLEAN },
    { name: "ySquared", type: Type.BOOLEAN },
    { name: "cosX", type: Type.BOOLEAN },
    { name: "sinX", type: Type.BOOLEAN },
    { name: "cosY", type: Type.BOOLEAN },
    { name: "sinY", type: Type.BOOLEAN },
    { name: "collectStats", type: Type.BOOLEAN },
    { name: "tutorial", type: Type.STRING },
    { name: "problem", type: Type.OBJECT, keyMap: exports.problems },
    { name: "initZero", type: Type.BOOLEAN },
    { name: "hideText", type: Type.BOOLEAN }
];
exports.State = State;

},{"./dataset":1,"./nn":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5ucG0vX25weC83MzcxMi9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGF0YXNldC50cyIsInNyYy9oZWF0bWFwLnRzIiwic3JjL2xpbmVjaGFydC50cyIsInNyYy9ubi50cyIsInNyYy9wbGF5Z3JvdW5kLnRzIiwic3JjL3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQytDQSx5QkFBZ0MsVUFBa0IsRUFBRSxLQUFhO0lBQ2hFLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUM7SUFpQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDZixDQUFDO0FBbkNELDBDQW1DQztBQVFELDhCQUFxQyxVQUFrQixFQUFFLEtBQWE7SUFDckUsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztJQUM3QixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFHbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXpCLGtCQUFrQixFQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWE7UUFDdEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDaEQsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDaEQsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6QyxJQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxHQUFHLE9BQU8sR0FB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R0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDbEQsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELENBQUMsSUFBSSxNQUFNLENBQUM7UUFDWixDQUFDLElBQUksTUFBTSxDQUFDO1FBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBR0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFHMUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFD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LElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDdEMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQ2xDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUNsQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDbEMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQ2xDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUMxQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDckMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxnQkFBUSxFQUFDO0lBQ3RELEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUN0QyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7Q0FDdEMsQ0FBQztBQW5DUyxzQkFBSyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuLyoqXG4gKiBBIHR3byBkaW1lbnNpb25hbCBleGFtcGxlOiB4IGFuZCB5IGNvb3JkaW5hdGVzIHdpdGggdGhlIGxhYmVsLlxuICovXG5leHBvcnQgdHlwZSBFeGFtcGxlMkQgPSB7XG5cdHg6IG51bWJlcixcblx0eTogbnVtYmVyLFxuXHRsYWJlbDogbnVtYmVyXG59O1xuXG50eXBlIFBvaW50ID0ge1xuXHRcdHg6IG51bWJlcixcblx0XHR5OiBudW1iZXJcblx0fTtcblxuZXhwb3J0IHR5cGUgRGF0YUdlbmVyYXRvciA9IChudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpID0+IEV4YW1wbGUyRFtdO1xuXG5pbnRlcmZhY2UgSFRNTElucHV0RXZlbnQgZXh0ZW5kcyBFdmVudCB7XG5cdHRhcmdldDogSFRNTElucHV0RWxlbWVudCAmIEV2ZW50VGFyZ2V0O1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIENMQVNTSUZJQ0FUSU9OXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBCcmluZyBZb3VyIE93biBEYXRhXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5QllPRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdC8vIEFXRyBOb2lzZSBWYXJpYW5jZSA9IFNpZ25hbCAvIDEwXihTTlJkQi8xMClcblx0Ly8gfiB2YXIgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cblx0Ly8gfiB2YXIgZGF0YTtcblxuXHQvLyB+IHZhciBpbnB1dEJZT0QgPSBkMy5zZWxlY3QoXCIjaW5wdXRGaWxlQllPRFwiKTtcblx0Ly8gfiBpbnB1dEJZT0Qub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkgLy86IEV4YW1wbGUyRFtdXG5cdC8vIH4ge1xuXHQvLyB+IHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHQvLyB+IHZhciBuYW1lID0gdGhpcy5maWxlc1swXS5uYW1lO1xuXHQvLyB+IHJlYWRlci5yZWFkQXNUZXh0KHRoaXMuZmlsZXNbMF0pO1xuXHQvLyB+IHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldmVudClcblx0Ly8gfiB7XG5cdC8vIH4gdmFyIHRhcmdldDogYW55ID0gZXZlbnQudGFyZ2V0O1xuXHQvLyB+IGRhdGEgPSB0YXJnZXQucmVzdWx0O1xuXHQvLyB+IGxldCBzID0gZGF0YS5zcGxpdChcIlxcblwiKTtcblx0Ly8gfiBmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspXG5cdC8vIH4ge1xuXHQvLyB+IGxldCBzcyA9IHNbaV0uc3BsaXQoXCIsXCIpO1xuXHQvLyB+IGlmIChzcy5sZW5ndGggIT0gMykgYnJlYWs7XG5cdC8vIH4gbGV0IHggPSBzc1swXTtcblx0Ly8gfiBsZXQgeSA9IHNzWzFdO1xuXHQvLyB+IGxldCBsYWJlbCA9IHNzWzJdO1xuXHQvLyB+IHBvaW50cy5wdXNoKHt4LHksbGFiZWx9KTtcblx0Ly8gfiBjb25zb2xlLmxvZyhwb2ludHNbaV0ueCtcIixcIitwb2ludHNbaV0ueStcIixcIitwb2ludHNbaV0ubGFiZWwpO1xuXHQvLyB+IH1cblx0Ly8gfiBjb25zb2xlLmxvZyhcIjgxIGRhdGFzZXQudHM6IHBvaW50cy5sZW5ndGggPSBcIiArIHBvaW50cy5sZW5ndGgpO1xuXHQvLyB+IH07XG5cdC8vIH4gY29uc29sZS5sb2coXCI4MyBkYXRhc2V0LnRzOiBwb2ludHMubGVuZ3RoID0gXCIgKyBwb2ludHMubGVuZ3RoKTtcblx0Ly8gfiB9KTtcblx0Ly8gfiBjb25zb2xlLmxvZyhcIjg1IGZpbGVuYW1lOiBcIiArIG5hbWUpO1xuXHQvLyB+IGNvbnNvbGUubG9nKFwiODYgZGF0YXNldC50czogcG9pbnRzLmxlbmd0aCA9IFwiICsgcG9pbnRzLmxlbmd0aCk7XG5cdHJldHVybiBwb2ludHM7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gQ0xBU1NJRlkgR0FVU1NJQU4gQ0xVU1RFUlNcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlUd29HYXVzc0RhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRsZXQgdmFyaWFuY2UgPSAwLjU7XG5cblx0Ly8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuXHRsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cblx0ZnVuY3Rpb24gZ2VuR2F1c3MoY3g6IG51bWJlciwgY3k6IG51bWJlciwgbGFiZWw6IG51bWJlcikge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlcyAvIDI7IGkrKykge1xuXHRcdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCB2YXJpYW5jZSAqIGROb2lzZSk7XG5cdFx0XHRsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIHZhcmlhbmNlICogZE5vaXNlKTtcblx0XHRcdGxldCBzaWduYWxYID0gbm9ybWFsUmFuZG9tKGN4LCB2YXJpYW5jZSk7XG5cdFx0XHRsZXQgc2lnbmFsWSA9IG5vcm1hbFJhbmRvbShjeSwgdmFyaWFuY2UpO1xuXHRcdFx0bGV0IHggPSBzaWduYWxYICsgbm9pc2VYO1xuXHRcdFx0bGV0IHkgPSBzaWduYWxZICsgbm9pc2VZO1xuXHRcdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdFx0fVxuXHR9XG5cblx0Z2VuR2F1c3MoMiwgMiwgMSk7IC8vIEdhdXNzaWFuIHdpdGggcG9zaXRpdmUgZXhhbXBsZXMuXG5cdGdlbkdhdXNzKC0yLCAtMiwgLTEpOyAvLyBHYXVzc2lhbiB3aXRoIG5lZ2F0aXZlIGV4YW1wbGVzLlxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBDTEFTU0lGWSBTUElSQUxcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5U3BpcmFsRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cblx0Ly8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuXHRsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0bGV0IG4gPSBudW1TYW1wbGVzIC8gMjtcblxuXHRmdW5jdGlvbiBnZW5TcGlyYWwoZGVsdGFUOiBudW1iZXIsIGxhYmVsOiBudW1iZXIpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuXHRcdFx0bGV0IHIgPSBpIC8gbiAqIDU7XG5cdFx0XHRsZXQgcjIgPSByICogcjtcblx0XHRcdGxldCB0ID0gMS43NSAqIGkgLyBuICogMiAqIE1hdGguUEkgKyBkZWx0YVQ7XG5cdFx0XHRsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIHIgKiBkTm9pc2UpO1xuXHRcdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCByICogZE5vaXNlKTtcblx0XHRcdGxldCB4ID0gciAqIE1hdGguc2luKHQpICsgbm9pc2VYO1xuXHRcdFx0bGV0IHkgPSByICogTWF0aC5jb3ModCkgKyBub2lzZVk7XG5cdFx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0XHR9XG5cdH1cblxuXHRnZW5TcGlyYWwoMCwgMSk7IC8vIFBvc2l0aXZlIGV4YW1wbGVzLlxuXHRnZW5TcGlyYWwoTWF0aC5QSSwgLTEpOyAvLyBOZWdhdGl2ZSBleGFtcGxlcy5cblx0cmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy8gQ0xBU1NJRlkgQ0lSQ0xFXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlDaXJjbGVEYXRhKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6IEV4YW1wbGUyRFtdIHtcblx0Ly8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuXHRsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0bGV0IHJhZGl1cyA9IDU7XG5cblx0Ly8gR2VuZXJhdGUgcG9zaXRpdmUgcG9pbnRzIGluc2lkZSB0aGUgY2lyY2xlLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXMgLyAyOyBpKyspIHtcblx0XHRsZXQgciA9IHJhbmRVbmlmb3JtKDAsIHJhZGl1cyAqIDAuNSk7XG5cdFx0Ly8gV2UgYXNzdW1lIHJeMiBhcyB0aGUgdmFyaWFuY2Ugb2YgdGhlIFNpZ25hbFxuXHRcdGxldCByMiA9IHIgKiByO1xuXHRcdGxldCBhbmdsZSA9IHJhbmRVbmlmb3JtKDAsIDIgKiBNYXRoLlBJKTtcblx0XHRsZXQgeCA9IHIgKiBNYXRoLnNpbihhbmdsZSk7XG5cdFx0bGV0IHkgPSByICogTWF0aC5jb3MoYW5nbGUpO1xuXHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgMSAvIHJhZGl1cyAqIGROb2lzZSk7XG5cdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCAxIC8gcmFkaXVzICogZE5vaXNlKTtcblx0XHR4ICs9IG5vaXNlWDtcblx0XHR5ICs9IG5vaXNlWTtcblx0XHRsZXQgbGFiZWwgPSAxO1xuXHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHR9XG5cblx0Ly8gR2VuZXJhdGUgbmVnYXRpdmUgcG9pbnRzIG91dHNpZGUgdGhlIGNpcmNsZS5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzIC8gMjsgaSsrKSB7XG5cdFx0bGV0IHIgPSByYW5kVW5pZm9ybShyYWRpdXMgKiAwLjcsIHJhZGl1cyk7XG5cblx0XHQvLyBXZSBhc3N1bWUgcl4yIGFzIHRoZSB2YXJpYW5jZSBvZiB0aGUgU2lnbmFsXG5cdFx0bGV0IHJyMiA9IHIgKiByO1xuXHRcdGxldCBhbmdsZSA9IHJhbmRVbmlmb3JtKDAsIDIgKiBNYXRoLlBJKTtcblx0XHRsZXQgeCA9IHIgKiBNYXRoLnNpbihhbmdsZSk7XG5cdFx0bGV0IHkgPSByICogTWF0aC5jb3MoYW5nbGUpO1xuXHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgMSAvIHJhZGl1cyAqIGROb2lzZSk7XG5cdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCAxIC8gcmFkaXVzICogZE5vaXNlKTtcblx0XHR4ICs9IG5vaXNlWDtcblx0XHR5ICs9IG5vaXNlWTtcblx0XHRsZXQgbGFiZWwgPSAtMTtcblx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0fVxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBDTEFTU0lGWSBYT1Jcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeVhPUkRhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXHQvLyBBV0cgTm9pc2UgVmFyaWFuY2UgPSBTaWduYWwgLyAxMF4oU05SZEIvMTApXG5cdGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHQvLyBTdGFuZGFyZCBkZXZpYXRpb24gb2YgdGhlIHNpZ25hbFxuXHRsZXQgc3RkU2lnbmFsID0gNTtcblxuXHRmdW5jdGlvbiBnZXRYT1JMYWJlbChwOiBQb2ludCkge1xuXHRcdHJldHVybiBwLnggKiBwLnkgPj0gMCA/IDEgOiAtMTtcblx0fVxuXG5cdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlczsgaSsrKSB7XG5cdFx0bGV0IHggPSByYW5kVW5pZm9ybSgtc3RkU2lnbmFsLCBzdGRTaWduYWwpO1xuXHRcdGxldCBwYWRkaW5nID0gMC4zO1xuXHRcdHggKz0geCA+IDAgPyBwYWRkaW5nIDogLXBhZGRpbmc7ICAvLyBQYWRkaW5nLlxuXHRcdGxldCB5ID0gcmFuZFVuaWZvcm0oLXN0ZFNpZ25hbCwgc3RkU2lnbmFsKTtcblx0XHR5ICs9IHkgPiAwID8gcGFkZGluZyA6IC1wYWRkaW5nO1xuXG5cdFx0bGV0IHZhcmlhbmNlU2lnbmFsID0gc3RkU2lnbmFsICogc3RkU2lnbmFsO1xuXHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgdmFyaWFuY2VTaWduYWwgKiBkTm9pc2UpO1xuXHRcdGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgdmFyaWFuY2VTaWduYWwgKiBkTm9pc2UpO1xuXHRcdGxldCBsYWJlbCA9IGdldFhPUkxhYmVsKHt4OiB4ICsgbm9pc2VYLCB5OiB5ICsgbm9pc2VZfSk7XG5cdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdH1cblx0cmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy8gUkVHUkVTU0lPTlxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZnVuY3Rpb24gcmVncmVzc1BsYW5lKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6IEV4YW1wbGUyRFtdIHtcblx0bGV0IGROb2lzZSA9IGRTTlIobm9pc2UpO1xuXHRsZXQgcmFkaXVzID0gNjtcblx0bGV0IHIyID0gcmFkaXVzICogcmFkaXVzO1xuXHRsZXQgbGFiZWxTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0LmRvbWFpbihbLTEwLCAxMF0pXG5cdFx0LnJhbmdlKFstMSwgMV0pO1xuXHRsZXQgZ2V0TGFiZWwgPSAoeCwgeSkgPT4gbGFiZWxTY2FsZSh4ICsgeSk7XG5cblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzOyBpKyspIHtcblx0XHRsZXQgeCA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XG5cdFx0bGV0IHkgPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpO1xuXHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgcjIgKiBkTm9pc2UpO1xuXHRcdGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgcjIgKiBkTm9pc2UpO1xuXHRcdGxldCBsYWJlbCA9IGdldExhYmVsKHggKyBub2lzZVgsIHkgKyBub2lzZVkpO1xuXHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHR9XG5cdHJldHVybiBwb2ludHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdyZXNzR2F1c3NpYW4obnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXHRsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0bGV0IGxhYmVsU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdC5kb21haW4oWzAsIDJdKVxuXHRcdC5yYW5nZShbMSwgMF0pXG5cdFx0LmNsYW1wKHRydWUpO1xuXG5cdGxldCBnYXVzc2lhbnMgPVxuXHRcdFtcblx0XHRcdFstNCwgMi41LCAxXSxcblx0XHRcdFswLCAyLjUsIC0xXSxcblx0XHRcdFs0LCAyLjUsIDFdLFxuXHRcdFx0Wy00LCAtMi41LCAtMV0sXG5cdFx0XHRbMCwgLTIuNSwgMV0sXG5cdFx0XHRbNCwgLTIuNSwgLTFdXG5cdFx0XTtcblxuXHRmdW5jdGlvbiBnZXRMYWJlbCh4LCB5KSB7XG5cdFx0Ly8gQ2hvb3NlIHRoZSBvbmUgdGhhdCBpcyBtYXhpbXVtIGluIGFicyB2YWx1ZS5cblx0XHRsZXQgbGFiZWwgPSAwO1xuXHRcdGdhdXNzaWFucy5mb3JFYWNoKChbY3gsIGN5LCBzaWduXSkgPT4ge1xuXHRcdFx0bGV0IG5ld0xhYmVsID0gc2lnbiAqIGxhYmVsU2NhbGUoZGlzdCh7eCwgeX0sIHt4OiBjeCwgeTogY3l9KSk7XG5cdFx0XHRpZiAoTWF0aC5hYnMobmV3TGFiZWwpID4gTWF0aC5hYnMobGFiZWwpKSB7XG5cdFx0XHRcdGxhYmVsID0gbmV3TGFiZWw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGxhYmVsO1xuXHR9XG5cblx0bGV0IHJhZGl1cyA9IDY7XG5cdGxldCByMiA9IHJhZGl1cyAqIHJhZGl1cztcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzOyBpKyspIHtcblx0XHRsZXQgeCA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XG5cdFx0bGV0IHkgPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpO1xuXHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgcjIgKiBkTm9pc2UpO1xuXHRcdGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgcjIgKiBkTm9pc2UpO1xuXHRcdGxldCBsYWJlbCA9IGdldExhYmVsKHggKyBub2lzZVgsIHkgKyBub2lzZVkpO1xuXHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHR9XG5cblx0cmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy8gQUNDRVNTT1JZIEZVTkNUSU9OU1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gKiBTaHVmZmxlcyB0aGUgYXJyYXkgdXNpbmcgRmlzaGVyLVlhdGVzIGFsZ29yaXRobS4gVXNlcyB0aGUgc2VlZHJhbmRvbVxuICogbGlicmFyeSBhcyB0aGUgcmFuZG9tIGdlbmVyYXRvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNodWZmbGUoYXJyYXk6IGFueVtdKTogdm9pZCB7XG5cdGxldCBjb3VudGVyID0gYXJyYXkubGVuZ3RoO1xuXHRsZXQgdGVtcCA9IDA7XG5cdGxldCBpbmRleCA9IDA7XG5cdC8vIFdoaWxlIHRoZXJlIGFyZSBlbGVtZW50cyBpbiB0aGUgYXJyYXlcblx0d2hpbGUgKGNvdW50ZXIgPiAwKSB7XG5cdFx0Ly8gUGljayBhIHJhbmRvbSBpbmRleFxuXHRcdGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY291bnRlcik7XG5cdFx0Ly8gRGVjcmVhc2UgY291bnRlciBieSAxXG5cdFx0Y291bnRlci0tO1xuXHRcdC8vIEFuZCBzd2FwIHRoZSBsYXN0IGVsZW1lbnQgd2l0aCBpdFxuXHRcdHRlbXAgPSBhcnJheVtjb3VudGVyXTtcblx0XHRhcnJheVtjb3VudGVyXSA9IGFycmF5W2luZGV4XTtcblx0XHRhcnJheVtpbmRleF0gPSB0ZW1wO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxvZzIoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coMik7XG59XG5cbmZ1bmN0aW9uIGxvZzEwKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGgubG9nKDEwKTtcbn1cblxuZnVuY3Rpb24gc2lnbmFsT2YoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIGxvZzIoMSArIE1hdGguYWJzKHgpKTtcbn1cblxuZnVuY3Rpb24gZFNOUih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gMSAvIE1hdGgucG93KDEwLCB4IC8gMTApO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBzYW1wbGUgZnJvbSBhIHVuaWZvcm0gW2EsIGJdIGRpc3RyaWJ1dGlvbi5cbiAqIFVzZXMgdGhlIHNlZWRyYW5kb20gbGlicmFyeSBhcyB0aGUgcmFuZG9tIGdlbmVyYXRvci5cbiAqL1xuZnVuY3Rpb24gcmFuZFVuaWZvcm0oYTogbnVtYmVyLCBiOiBudW1iZXIpIHtcblx0cmV0dXJuIE1hdGgucmFuZG9tKCkgKiAoYiAtIGEpICsgYTtcbn1cblxuLyoqXG4gKiBTYW1wbGVzIGZyb20gYSBub3JtYWwgZGlzdHJpYnV0aW9uLiBVc2VzIHRoZSBzZWVkcmFuZG9tIGxpYnJhcnkgYXMgdGhlXG4gKiByYW5kb20gZ2VuZXJhdG9yLlxuICpcbiAqIEBwYXJhbSBtZWFuIFRoZSBtZWFuLiBEZWZhdWx0IGlzIDAuXG4gKiBAcGFyYW0gdmFyaWFuY2UgVGhlIHZhcmlhbmNlLiBEZWZhdWx0IGlzIDEuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbFJhbmRvbShtZWFuID0gMCwgdmFyaWFuY2UgPSAxKTogbnVtYmVyIHtcblx0bGV0IHYxOiBudW1iZXIsIHYyOiBudW1iZXIsIHM6IG51bWJlcjtcblx0ZG8ge1xuXHRcdHYxID0gMiAqIE1hdGgucmFuZG9tKCkgLSAxO1xuXHRcdHYyID0gMiAqIE1hdGgucmFuZG9tKCkgLSAxO1xuXHRcdHMgPSB2MSAqIHYxICsgdjIgKiB2Mjtcblx0fSB3aGlsZSAocyA+IDEpO1xuXG5cdGxldCByZXN1bHQgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhzKSAvIHMpICogdjE7XG5cdHJldHVybiBtZWFuICsgTWF0aC5zcXJ0KHZhcmlhbmNlKSAqIHJlc3VsdDtcbn1cblxuLyoqIFJldHVybnMgdGhlIGV1Y2xpZGVhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHMgaW4gc3BhY2UuICovXG5mdW5jdGlvbiBkaXN0KGE6IFBvaW50LCBiOiBQb2ludCk6IG51bWJlciB7XG5cdGxldCBkeCA9IGEueCAtIGIueDtcblx0bGV0IGR5ID0gYS55IC0gYi55O1xuXHRyZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbn1cbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5pbXBvcnQge0V4YW1wbGUyRH0gZnJvbSBcIi4vZGF0YXNldFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEhlYXRNYXBTZXR0aW5ncyB7XG5cdFtrZXk6IHN0cmluZ106IGFueTtcblx0c2hvd0F4ZXM/OiBib29sZWFuO1xuXHRub1N2Zz86IGJvb2xlYW47XG59XG5cbi8qKiBOdW1iZXIgb2YgZGlmZmVyZW50IHNoYWRlcyAoY29sb3JzKSB3aGVuIGRyYXdpbmcgYSBncmFkaWVudCBoZWF0bWFwICovXG5jb25zdCBOVU1fU0hBREVTID0gNjQ7XG5cbi8qKlxuKiBEcmF3cyBhIGhlYXRtYXAgdXNpbmcgY2FudmFzLiBVc2VkIGZvciBzaG93aW5nIHRoZSBsZWFybmVkIGRlY2lzaW9uXG4qIGJvdW5kYXJ5IG9mIHRoZSBjbGFzc2lmaWNhdGlvbiBhbGdvcml0aG0uIENhbiBhbHNvIGRyYXcgZGF0YSBwb2ludHNcbiogdXNpbmcgYW4gc3ZnIG92ZXJsYXllZCBvbiB0b3Agb2YgdGhlIGNhbnZhcyBoZWF0bWFwLlxuKi9cbmV4cG9ydCBjbGFzcyBIZWF0TWFwIHtcblx0cHJpdmF0ZSBzZXR0aW5nczogSGVhdE1hcFNldHRpbmdzID0ge3Nob3dBeGVzOiBmYWxzZSwgbm9Tdmc6IGZhbHNlfTtcblx0cHJpdmF0ZSB4U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XG5cdHByaXZhdGUgeVNjYWxlOiBkMy5zY2FsZS5MaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xuXHRwcml2YXRlIG51bVNhbXBsZXM6IG51bWJlcjtcblx0cHJpdmF0ZSBjb2xvcjogZDMuc2NhbGUuUXVhbnRpemU8c3RyaW5nPjtcblx0cHJpdmF0ZSBjYW52YXM6IGQzLlNlbGVjdGlvbjxhbnk+O1xuXHRwcml2YXRlIHN2ZzogZDMuU2VsZWN0aW9uPGFueT47XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0d2lkdGg6IG51bWJlciwgbnVtU2FtcGxlczogbnVtYmVyLCB4RG9tYWluOiBbbnVtYmVyLCBudW1iZXJdLFxuXHRcdHlEb21haW46IFtudW1iZXIsIG51bWJlcl0sIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sXG5cdFx0dXNlclNldHRpbmdzPzogSGVhdE1hcFNldHRpbmdzKSB7XG5cdFx0dGhpcy5udW1TYW1wbGVzID0gbnVtU2FtcGxlcztcblx0XHRsZXQgaGVpZ2h0ID0gd2lkdGg7XG5cdFx0bGV0IHBhZGRpbmcgPSB1c2VyU2V0dGluZ3Muc2hvd0F4ZXMgPyAyMCA6IDA7XG5cblx0XHRpZiAodXNlclNldHRpbmdzICE9IG51bGwpIHtcblx0XHRcdC8vIG92ZXJ3cml0ZSB0aGUgZGVmYXVsdHMgd2l0aCB0aGUgdXNlci1zcGVjaWZpZWQgc2V0dGluZ3MuXG5cdFx0XHRmb3IgKGxldCBwcm9wIGluIHVzZXJTZXR0aW5ncykge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzW3Byb3BdID0gdXNlclNldHRpbmdzW3Byb3BdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMueFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKHhEb21haW4pXG5cdFx0LnJhbmdlKFswLCB3aWR0aCAtIDIgKiBwYWRkaW5nXSk7XG5cblx0XHR0aGlzLnlTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0LmRvbWFpbih5RG9tYWluKVxuXHRcdC5yYW5nZShbaGVpZ2h0IC0gMiAqIHBhZGRpbmcsIDBdKTtcblxuXHRcdC8vIEdldCBhIHJhbmdlIG9mIGNvbG9ycy5cblx0XHRsZXQgdG1wU2NhbGUgPSBkMy5zY2FsZS5saW5lYXI8c3RyaW5nLCBzdHJpbmc+KClcblx0XHQuZG9tYWluKFswLCAuNSwgMV0pXG5cdFx0LnJhbmdlKFtcIiMwODc3YmRcIiwgXCIjZThlYWViXCIsIFwiI2Y1OTMyMlwiXSlcblx0XHQuY2xhbXAodHJ1ZSk7XG5cdFx0Ly8gRHVlIHRvIG51bWVyaWNhbCBlcnJvciwgd2UgbmVlZCB0byBzcGVjaWZ5XG5cdFx0Ly8gZDMucmFuZ2UoMCwgZW5kICsgc21hbGxfZXBzaWxvbiwgc3RlcClcblx0XHQvLyBpbiBvcmRlciB0byBndWFyYW50ZWUgdGhhdCB3ZSB3aWxsIGhhdmUgZW5kL3N0ZXAgZW50cmllcyB3aXRoXG5cdFx0Ly8gdGhlIGxhc3QgZWxlbWVudCBiZWluZyBlcXVhbCB0byBlbmQuXG5cdFx0bGV0IGNvbG9ycyA9IGQzLnJhbmdlKDAsIDEgKyAxRS05LCAxIC8gTlVNX1NIQURFUykubWFwKGEgPT4ge1xuXHRcdFx0cmV0dXJuIHRtcFNjYWxlKGEpO1xuXHRcdH0pO1xuXHRcdHRoaXMuY29sb3IgPSBkMy5zY2FsZS5xdWFudGl6ZTxzdHJpbmc+KClcblx0XHQuZG9tYWluKFstMSwgMV0pXG5cdFx0LnJhbmdlKGNvbG9ycyk7XG5cblx0XHRjb250YWluZXIgPSBjb250YWluZXIuYXBwZW5kKFwiZGl2XCIpXG5cdFx0LnN0eWxlKFxuXHRcdHtcblx0XHRcdHdpZHRoOiBgJHt3aWR0aH1weGAsXG5cdFx0XHRoZWlnaHQ6IGAke2hlaWdodH1weGAsXG5cdFx0XHRwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuXHRcdFx0dG9wOiBgLSR7cGFkZGluZ31weGAsXG5cdFx0XHRsZWZ0OiBgLSR7cGFkZGluZ31weGBcblx0XHR9KTtcblx0XHR0aGlzLmNhbnZhcyA9IGNvbnRhaW5lci5hcHBlbmQoXCJjYW52YXNcIilcblx0XHQuYXR0cihcIndpZHRoXCIsIG51bVNhbXBsZXMpXG5cdFx0LmF0dHIoXCJoZWlnaHRcIiwgbnVtU2FtcGxlcylcblx0XHQuc3R5bGUoXCJ3aWR0aFwiLCAod2lkdGggLSAyICogcGFkZGluZykgKyBcInB4XCIpXG5cdFx0LnN0eWxlKFwiaGVpZ2h0XCIsIChoZWlnaHQgLSAyICogcGFkZGluZykgKyBcInB4XCIpXG5cdFx0LnN0eWxlKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKVxuXHRcdC5zdHlsZShcInRvcFwiLCBgJHtwYWRkaW5nfXB4YClcblx0XHQuc3R5bGUoXCJsZWZ0XCIsIGAke3BhZGRpbmd9cHhgKTtcblxuXHRcdGlmICghdGhpcy5zZXR0aW5ncy5ub1N2Zykge1xuXHRcdFx0dGhpcy5zdmcgPSBjb250YWluZXIuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXG5cdFx0XHR7XG5cdFx0XHRcdFwid2lkdGhcIjogd2lkdGgsXG5cdFx0XHRcdFwiaGVpZ2h0XCI6IGhlaWdodFxuXHRcdFx0fSkuc3R5bGUoXG5cdFx0XHR7XG5cdFx0XHRcdC8vIE92ZXJsYXkgdGhlIHN2ZyBvbiB0b3Agb2YgdGhlIGNhbnZhcy5cblx0XHRcdFx0XCJwb3NpdGlvblwiOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdFwibGVmdFwiOiBcIjBcIixcblx0XHRcdFx0XCJ0b3BcIjogXCIwXCJcblx0XHRcdH0pLmFwcGVuZChcImdcIilcblx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHtwYWRkaW5nfSwke3BhZGRpbmd9KWApO1xuXG5cdFx0XHR0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBcInRyYWluXCIpO1xuXHRcdFx0dGhpcy5zdmcuYXBwZW5kKFwiZ1wiKS5hdHRyKFwiY2xhc3NcIiwgXCJ0ZXN0XCIpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNldHRpbmdzLnNob3dBeGVzKSB7XG5cdFx0XHRsZXQgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUodGhpcy54U2NhbGUpXG5cdFx0XHQub3JpZW50KFwiYm90dG9tXCIpO1xuXG5cdFx0XHRsZXQgeUF4aXMgPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUodGhpcy55U2NhbGUpXG5cdFx0XHQub3JpZW50KFwicmlnaHRcIik7XG5cblx0XHRcdHRoaXMuc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ4IGF4aXNcIilcblx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwke2hlaWdodCAtIDIgKiBwYWRkaW5nfSlgKVxuXHRcdFx0LmNhbGwoeEF4aXMpO1xuXG5cdFx0XHR0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0XHQuYXR0cihcImNsYXNzXCIsIFwieSBheGlzXCIpXG5cdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICh3aWR0aCAtIDIgKiBwYWRkaW5nKSArIFwiLDApXCIpXG5cdFx0XHQuY2FsbCh5QXhpcyk7XG5cdFx0fVxuXHR9XG5cblx0dXBkYXRlVGVzdFBvaW50cyhwb2ludHM6IEV4YW1wbGUyRFtdKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuc2V0dGluZ3Mubm9TdmcpIHtcblx0XHRcdHRocm93IEVycm9yKFwiQ2FuJ3QgYWRkIHBvaW50cyBzaW5jZSBub1N2Zz10cnVlXCIpO1xuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZUNpcmNsZXModGhpcy5zdmcuc2VsZWN0KFwiZy50ZXN0XCIpLCBwb2ludHMpO1xuXHR9XG5cblx0dXBkYXRlUG9pbnRzKHBvaW50czogRXhhbXBsZTJEW10pOiB2b2lkIHtcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5ub1N2Zykge1xuXHRcdFx0dGhyb3cgRXJyb3IoXCJDYW4ndCBhZGQgcG9pbnRzIHNpbmNlIG5vU3ZnPXRydWVcIik7XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlQ2lyY2xlcyh0aGlzLnN2Zy5zZWxlY3QoXCJnLnRyYWluXCIpLCBwb2ludHMpO1xuXHR9XG5cblx0dXBkYXRlQmFja2dyb3VuZChkYXRhOiBudW1iZXJbXVtdLCBkaXNjcmV0aXplOiBib29sZWFuKTogdm9pZCB7XG5cdFx0bGV0IGR4ID0gZGF0YVswXS5sZW5ndGg7XG5cdFx0bGV0IGR5ID0gZGF0YS5sZW5ndGg7XG5cblx0XHRpZiAoZHggIT09IHRoaXMubnVtU2FtcGxlcyB8fCBkeSAhPT0gdGhpcy5udW1TYW1wbGVzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFwiVGhlIHByb3ZpZGVkIGRhdGEgbWF0cml4IG11c3QgYmUgb2Ygc2l6ZSBcIiArXG5cdFx0XHRcdFwibnVtU2FtcGxlcyBYIG51bVNhbXBsZXNcIik7XG5cdFx0fVxuXG5cdFx0Ly8gQ29tcHV0ZSB0aGUgcGl4ZWwgY29sb3JzOyBzY2FsZWQgYnkgQ1NTLlxuXHRcdGxldCBjb250ZXh0ID0gKHRoaXMuY2FudmFzLm5vZGUoKSBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRcdGxldCBpbWFnZSA9IGNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKGR4LCBkeSk7XG5cblx0XHRmb3IgKGxldCB5ID0gMCwgcCA9IC0xOyB5IDwgZHk7ICsreSkge1xuXHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBkeDsgKyt4KSB7XG5cdFx0XHRcdGxldCB2YWx1ZSA9IGRhdGFbeF1beV07XG5cdFx0XHRcdGlmIChkaXNjcmV0aXplKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSAodmFsdWUgPj0gMCA/IDEgOiAtMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IGMgPSBkMy5yZ2IodGhpcy5jb2xvcih2YWx1ZSkpO1xuXHRcdFx0XHRpbWFnZS5kYXRhWysrcF0gPSBjLnI7XG5cdFx0XHRcdGltYWdlLmRhdGFbKytwXSA9IGMuZztcblx0XHRcdFx0aW1hZ2UuZGF0YVsrK3BdID0gYy5iO1xuXHRcdFx0XHRpbWFnZS5kYXRhWysrcF0gPSAxNjA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcblx0fVxuXG5cdHByaXZhdGUgdXBkYXRlQ2lyY2xlcyhjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+LCBwb2ludHM6IEV4YW1wbGUyRFtdKSB7XG5cdFx0Ly8gS2VlcCBvbmx5IHBvaW50cyB0aGF0IGFyZSBpbnNpZGUgdGhlIGJvdW5kcy5cblx0XHRsZXQgeERvbWFpbiA9IHRoaXMueFNjYWxlLmRvbWFpbigpO1xuXHRcdGxldCB5RG9tYWluID0gdGhpcy55U2NhbGUuZG9tYWluKCk7XG5cdFx0cG9pbnRzID0gcG9pbnRzLmZpbHRlcihwID0+IHtcblx0XHRcdHJldHVybiBwLnggPj0geERvbWFpblswXSAmJiBwLnggPD0geERvbWFpblsxXVxuXHRcdFx0JiYgcC55ID49IHlEb21haW5bMF0gJiYgcC55IDw9IHlEb21haW5bMV07XG5cdFx0fSk7XG5cblx0XHQvLyBBdHRhY2ggZGF0YSB0byBpbml0aWFsbHkgZW1wdHkgc2VsZWN0aW9uLlxuXHRcdGxldCBzZWxlY3Rpb24gPSBjb250YWluZXIuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEocG9pbnRzKTtcblxuXHRcdC8vIEluc2VydCBlbGVtZW50cyB0byBtYXRjaCBsZW5ndGggb2YgcG9pbnRzIGFycmF5LlxuXHRcdHNlbGVjdGlvbi5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKS5hdHRyKFwiclwiLCAzKTtcblxuXHRcdC8vIFVwZGF0ZSBwb2ludHMgdG8gYmUgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb24uXG5cdFx0c2VsZWN0aW9uXG5cdFx0LmF0dHIoXG5cdFx0e1xuXHRcdFx0Y3g6IChkOiBFeGFtcGxlMkQpID0+IHRoaXMueFNjYWxlKGQueCksXG5cdFx0XHRjeTogKGQ6IEV4YW1wbGUyRCkgPT4gdGhpcy55U2NhbGUoZC55KSxcblx0XHR9KVxuXHRcdC5zdHlsZShcImZpbGxcIiwgZCA9PiB0aGlzLmNvbG9yKGQubGFiZWwpKTtcblxuXHRcdC8vIFJlbW92ZSBwb2ludHMgaWYgdGhlIGxlbmd0aCBoYXMgZ29uZSBkb3duLlxuXHRcdHNlbGVjdGlvbi5leGl0KCkucmVtb3ZlKCk7XG5cdH1cbn0gIC8vIENsb3NlIGNsYXNzIEhlYXRNYXAuXG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VNYXRyaXgobWF0cml4OiBudW1iZXJbXVtdLCBmYWN0b3I6IG51bWJlcik6IG51bWJlcltdW10ge1xuXHRpZiAobWF0cml4Lmxlbmd0aCAhPT0gbWF0cml4WzBdLmxlbmd0aCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBwcm92aWRlZCBtYXRyaXggbXVzdCBiZSBhIHNxdWFyZSBtYXRyaXhcIik7XG5cdH1cblx0aWYgKG1hdHJpeC5sZW5ndGggJSBmYWN0b3IgIT09IDApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgd2lkdGgvaGVpZ2h0IG9mIHRoZSBtYXRyaXggbXVzdCBiZSBkaXZpc2libGUgYnkgXCIgK1xuXHRcdFwidGhlIHJlZHVjdGlvbiBmYWN0b3JcIik7XG5cdH1cblx0bGV0IHJlc3VsdDogbnVtYmVyW11bXSA9IG5ldyBBcnJheShtYXRyaXgubGVuZ3RoIC8gZmFjdG9yKTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgubGVuZ3RoOyBpICs9IGZhY3Rvcikge1xuXHRcdHJlc3VsdFtpIC8gZmFjdG9yXSA9IG5ldyBBcnJheShtYXRyaXgubGVuZ3RoIC8gZmFjdG9yKTtcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5sZW5ndGg7IGogKz0gZmFjdG9yKSB7XG5cdFx0XHRsZXQgYXZnID0gMDtcblx0XHRcdC8vIFN1bSBhbGwgdGhlIHZhbHVlcyBpbiB0aGUgbmVpZ2hib3Job29kLlxuXHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBmYWN0b3I7IGsrKykge1xuXHRcdFx0XHRmb3IgKGxldCBsID0gMDsgbCA8IGZhY3RvcjsgbCsrKSB7XG5cdFx0XHRcdFx0YXZnICs9IG1hdHJpeFtpICsga11baiArIGxdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRhdmcgLz0gKGZhY3RvciAqIGZhY3Rvcik7XG5cdFx0XHRyZXN1bHRbaSAvIGZhY3Rvcl1baiAvIGZhY3Rvcl0gPSBhdmc7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG50eXBlIERhdGFQb2ludCA9IHtcblx0eDogbnVtYmVyO1xuXHR5OiBudW1iZXJbXTtcbn07XG5cbi8qKlxuICogQSBtdWx0aS1zZXJpZXMgbGluZSBjaGFydCB0aGF0IGFsbG93cyB5b3UgdG8gYXBwZW5kIG5ldyBkYXRhIHBvaW50c1xuICogYXMgZGF0YSBiZWNvbWVzIGF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEFwcGVuZGluZ0xpbmVDaGFydCB7XG5cdHByaXZhdGUgbnVtTGluZXM6IG51bWJlcjtcblx0cHJpdmF0ZSBkYXRhOiBEYXRhUG9pbnRbXSA9IFtdO1xuXHRwcml2YXRlIHN2ZzogZDMuU2VsZWN0aW9uPGFueT47XG5cdHByaXZhdGUgeFNjYWxlOiBkMy5zY2FsZS5MaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xuXHRwcml2YXRlIHlTY2FsZTogZDMuc2NhbGUuTGluZWFyPG51bWJlciwgbnVtYmVyPjtcblx0cHJpdmF0ZSBwYXRoczogQXJyYXk8ZDMuU2VsZWN0aW9uPGFueT4+O1xuXHRwcml2YXRlIGxpbmVDb2xvcnM6IHN0cmluZ1tdO1xuXG5cdHByaXZhdGUgbWluWSA9IE51bWJlci5NQVhfVkFMVUU7XG5cdHByaXZhdGUgbWF4WSA9IE51bWJlci5NSU5fVkFMVUU7XG5cblx0Y29uc3RydWN0b3IoY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55PiwgbGluZUNvbG9yczogc3RyaW5nW10pIHtcblx0XHR0aGlzLmxpbmVDb2xvcnMgPSBsaW5lQ29sb3JzO1xuXHRcdHRoaXMubnVtTGluZXMgPSBsaW5lQ29sb3JzLmxlbmd0aDtcblx0XHRsZXQgbm9kZSA9IGNvbnRhaW5lci5ub2RlKCkgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0bGV0IHRvdGFsV2lkdGggPSBub2RlLm9mZnNldFdpZHRoO1xuXHRcdGxldCB0b3RhbEhlaWdodCA9IG5vZGUub2Zmc2V0SGVpZ2h0O1xuXHRcdGxldCBtYXJnaW4gPSB7dG9wOiAyLCByaWdodDogMCwgYm90dG9tOiAyLCBsZWZ0OiAyfTtcblx0XHRsZXQgd2lkdGggPSB0b3RhbFdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG5cdFx0bGV0IGhlaWdodCA9IHRvdGFsSGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cblx0XHR0aGlzLnhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHQuZG9tYWluKFswLCAwXSlcblx0XHRcdC5yYW5nZShbMCwgd2lkdGhdKTtcblxuXHRcdHRoaXMueVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdC5kb21haW4oWzAsIDBdKVxuXHRcdFx0LnJhbmdlKFtoZWlnaHQsIDBdKTtcblxuXHRcdHRoaXMuc3ZnID0gY29udGFpbmVyLmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxuXHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG5cdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke21hcmdpbi5sZWZ0fSwke21hcmdpbi50b3B9KWApO1xuXG5cdFx0dGhpcy5wYXRocyA9IG5ldyBBcnJheSh0aGlzLm51bUxpbmVzKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtTGluZXM7IGkrKykge1xuXHRcdFx0dGhpcy5wYXRoc1tpXSA9IHRoaXMuc3ZnLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxpbmVcIilcblx0XHRcdFx0LnN0eWxlKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFwiZmlsbFwiOiBcIm5vbmVcIixcblx0XHRcdFx0XHRcdFwic3Ryb2tlXCI6IGxpbmVDb2xvcnNbaV0sXG5cdFx0XHRcdFx0XHRcInN0cm9rZS13aWR0aFwiOiBcIjEuNXB4XCJcblx0XHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRyZXNldCgpIHtcblx0XHR0aGlzLmRhdGEgPSBbXTtcblx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdHRoaXMubWluWSA9IE51bWJlci5NQVhfVkFMVUU7XG5cdFx0dGhpcy5tYXhZID0gTnVtYmVyLk1JTl9WQUxVRTtcblx0fVxuXG5cdGFkZERhdGFQb2ludChkYXRhUG9pbnQ6IG51bWJlcltdKSB7XG5cdFx0aWYgKGRhdGFQb2ludC5sZW5ndGggIT09IHRoaXMubnVtTGluZXMpIHtcblx0XHRcdHRocm93IEVycm9yKFwiTGVuZ3RoIG9mIGRhdGFQb2ludCBtdXN0IGVxdWFsIG51bWJlciBvZiBsaW5lc1wiKTtcblx0XHR9XG5cdFx0ZGF0YVBvaW50LmZvckVhY2goeSA9PiB7XG5cdFx0XHR0aGlzLm1pblkgPSBNYXRoLm1pbih0aGlzLm1pblksIHkpO1xuXHRcdFx0dGhpcy5tYXhZID0gTWF0aC5tYXgodGhpcy5tYXhZLCB5KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuZGF0YS5wdXNoKHt4OiB0aGlzLmRhdGEubGVuZ3RoICsgMSwgeTogZGF0YVBvaW50fSk7XG5cdFx0dGhpcy5yZWRyYXcoKTtcblx0fVxuXG5cdHByaXZhdGUgcmVkcmF3KCkge1xuXHRcdC8vIEFkanVzdCB0aGUgeCBhbmQgeSBkb21haW4uXG5cdFx0dGhpcy54U2NhbGUuZG9tYWluKFsxLCB0aGlzLmRhdGEubGVuZ3RoXSk7XG5cdFx0dGhpcy55U2NhbGUuZG9tYWluKFt0aGlzLm1pblksIHRoaXMubWF4WV0pO1xuXHRcdC8vIEFkanVzdCBhbGwgdGhlIDxwYXRoPiBlbGVtZW50cyAobGluZXMpLlxuXHRcdGxldCBnZXRQYXRoTWFwID0gKGxpbmVJbmRleDogbnVtYmVyKSA9PiB7XG5cdFx0XHRyZXR1cm4gZDMuc3ZnLmxpbmU8RGF0YVBvaW50PigpXG5cdFx0XHRcdC54KGQgPT4gdGhpcy54U2NhbGUoZC54KSlcblx0XHRcdFx0LnkoZCA9PiB0aGlzLnlTY2FsZShkLnlbbGluZUluZGV4XSkpO1xuXHRcdH07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUxpbmVzOyBpKyspIHtcblx0XHRcdHRoaXMucGF0aHNbaV0uZGF0dW0odGhpcy5kYXRhKS5hdHRyKFwiZFwiLCBnZXRQYXRoTWFwKGkpKTtcblx0XHR9XG5cdH1cbn1cbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuLyoqXG4gKiBBIG5vZGUgaW4gYSBuZXVyYWwgbmV0d29yay4gRWFjaCBub2RlIGhhcyBhIHN0YXRlXG4gKiAodG90YWwgaW5wdXQsIG91dHB1dCwgYW5kIHRoZWlyIHJlc3BlY3RpdmVseSBkZXJpdmF0aXZlcykgd2hpY2ggY2hhbmdlc1xuICogYWZ0ZXIgZXZlcnkgZm9yd2FyZCBhbmQgYmFjayBwcm9wYWdhdGlvbiBydW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBOb2RlIHtcblx0aWQ6IHN0cmluZztcblx0LyoqIExpc3Qgb2YgaW5wdXQgbGlua3MuICovXG5cdGlucHV0TGlua3M6IExpbmtbXSA9IFtdO1xuXHRiaWFzID0gMC4xO1xuXHQvKiogTGlzdCBvZiBvdXRwdXQgbGlua3MuICovXG5cdG91dHB1dHM6IExpbmtbXSA9IFtdO1xuXHR0b3RhbElucHV0OiBudW1iZXI7XG5cdG91dHB1dDogbnVtYmVyO1xuXG5cdHRydWVMZWFybmluZ1JhdGUgPSAwO1xuXHQvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyBub2RlJ3Mgb3V0cHV0LiAqL1xuXHRvdXRwdXREZXIgPSAwO1xuXHQvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyBub2RlJ3MgdG90YWwgaW5wdXQuICovXG5cdGlucHV0RGVyID0gMDtcblx0LyoqXG5cdCAqIEFjY3VtdWxhdGVkIGVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIHRoaXMgbm9kZSdzIHRvdGFsIGlucHV0IHNpbmNlXG5cdCAqIHRoZSBsYXN0IHVwZGF0ZS4gVGhpcyBkZXJpdmF0aXZlIGVxdWFscyBkRS9kYiB3aGVyZSBiIGlzIHRoZSBub2RlJ3Ncblx0ICogYmlhcyB0ZXJtLlxuXHQgKi9cblx0YWNjSW5wdXREZXIgPSAwO1xuXHQvKipcblx0ICogTnVtYmVyIG9mIGFjY3VtdWxhdGVkIGVyci4gZGVyaXZhdGl2ZXMgd2l0aCByZXNwZWN0IHRvIHRoZSB0b3RhbCBpbnB1dFxuXHQgKiBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG5cdCAqL1xuXHRudW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuXHQvKiogQWN0aXZhdGlvbiBmdW5jdGlvbiB0aGF0IHRha2VzIHRvdGFsIGlucHV0IGFuZCByZXR1cm5zIG5vZGUncyBvdXRwdXQgKi9cblx0YWN0aXZhdGlvbjogQWN0aXZhdGlvbkZ1bmN0aW9uO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IG5vZGUgd2l0aCB0aGUgcHJvdmlkZWQgaWQgYW5kIGFjdGl2YXRpb24gZnVuY3Rpb24uXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBhY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb24sIGluaXRaZXJvPzogYm9vbGVhbikge1xuXHRcdHRoaXMuaWQgPSBpZDtcblx0XHR0aGlzLmFjdGl2YXRpb24gPSBhY3RpdmF0aW9uO1xuXHRcdGlmIChpbml0WmVybykge1xuXHRcdFx0dGhpcy5iaWFzID0gMDtcblx0XHR9XG5cdH1cblxuXHQvKiogUmVjb21wdXRlcyB0aGUgbm9kZSdzIG91dHB1dCBhbmQgcmV0dXJucyBpdC4gKi9cblx0dXBkYXRlT3V0cHV0KCk6IG51bWJlciB7XG5cdFx0Ly8gU3RvcmVzIHRvdGFsIGlucHV0IGludG8gdGhlIG5vZGUuXG5cdFx0dGhpcy50b3RhbElucHV0ID0gdGhpcy5iaWFzO1xuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRsZXQgbGluayA9IHRoaXMuaW5wdXRMaW5rc1tqXTtcblx0XHRcdHRoaXMudG90YWxJbnB1dCArPSBsaW5rLndlaWdodCAqIGxpbmsuc291cmNlLm91dHB1dDtcblx0XHR9XG5cdFx0dGhpcy5vdXRwdXQgPSB0aGlzLmFjdGl2YXRpb24ub3V0cHV0KHRoaXMudG90YWxJbnB1dCk7XG5cdFx0cmV0dXJuIHRoaXMub3V0cHV0O1xuXHR9XG59XG5cbi8qKlxuICogQW4gZXJyb3IgZnVuY3Rpb24gYW5kIGl0cyBkZXJpdmF0aXZlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yRnVuY3Rpb24ge1xuXHRlcnJvcjogKG91dHB1dDogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcikgPT4gbnVtYmVyO1xuXHRkZXI6IChvdXRwdXQ6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpID0+IG51bWJlcjtcbn1cblxuLyoqIEEgbm9kZSdzIGFjdGl2YXRpb24gZnVuY3Rpb24gYW5kIGl0cyBkZXJpdmF0aXZlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY3RpdmF0aW9uRnVuY3Rpb24ge1xuXHRvdXRwdXQ6IChpbnB1dDogbnVtYmVyKSA9PiBudW1iZXI7XG5cdGRlcjogKGlucHV0OiBudW1iZXIpID0+IG51bWJlcjtcbn1cblxuLyoqIEZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgYSBwZW5hbHR5IGNvc3QgZm9yIGEgZ2l2ZW4gd2VpZ2h0IGluIHRoZSBuZXR3b3JrLiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uIHtcblx0b3V0cHV0OiAod2VpZ2h0OiBudW1iZXIpID0+IG51bWJlcjtcblx0ZGVyOiAod2VpZ2h0OiBudW1iZXIpID0+IG51bWJlcjtcbn1cblxuLyoqIEJ1aWx0LWluIGVycm9yIGZ1bmN0aW9ucyAqL1xuZXhwb3J0IGNsYXNzIEVycm9ycyB7XG5cdHB1YmxpYyBzdGF0aWMgU1FVQVJFOiBFcnJvckZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRlcnJvcjogKG91dHB1dDogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcikgPT5cblx0XHRcdFx0MC41ICogTWF0aC5wb3cob3V0cHV0IC0gdGFyZ2V0LCAyKSxcblx0XHRcdGRlcjogKG91dHB1dDogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcikgPT4gb3V0cHV0IC0gdGFyZ2V0XG5cdFx0fTtcbn1cblxuLyoqIFBvbHlmaWxsIGZvciBUQU5IICovXG4oTWF0aCBhcyBhbnkpLnRhbmggPSAoTWF0aCBhcyBhbnkpLnRhbmggfHwgZnVuY3Rpb24gKHgpIHtcblx0aWYgKHggPT09IEluZmluaXR5KSB7XG5cdFx0cmV0dXJuIDE7XG5cdH0gZWxzZSBpZiAoeCA9PT0gLUluZmluaXR5KSB7XG5cdFx0cmV0dXJuIC0xO1xuXHR9IGVsc2Uge1xuXHRcdGxldCBlMnggPSBNYXRoLmV4cCgyICogeCk7XG5cdFx0cmV0dXJuIChlMnggLSAxKSAvIChlMnggKyAxKTtcblx0fVxufTtcblxuLyoqIEJ1aWx0LWluIGFjdGl2YXRpb24gZnVuY3Rpb25zICovXG5leHBvcnQgY2xhc3MgQWN0aXZhdGlvbnMge1xuXHRwdWJsaWMgc3RhdGljIFRBTkg6IEFjdGl2YXRpb25GdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0b3V0cHV0OiB4ID0+IChNYXRoIGFzIGFueSkudGFuaCh4KSxcblx0XHRcdGRlcjogeCA9PiB7XG5cdFx0XHRcdGxldCBvdXRwdXQgPSBBY3RpdmF0aW9ucy5UQU5ILm91dHB1dCh4KTtcblx0XHRcdFx0cmV0dXJuIDEgLSBvdXRwdXQgKiBvdXRwdXQ7XG5cdFx0XHR9XG5cdFx0fTtcblx0cHVibGljIHN0YXRpYyBSRUxVOiBBY3RpdmF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogeCA9PiBNYXRoLm1heCgwLCB4KSxcblx0XHRcdGRlcjogeCA9PiB4IDw9IDAgPyAwIDogMVxuXHRcdH07XG5cdHB1YmxpYyBzdGF0aWMgU0lHTU9JRDogQWN0aXZhdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHggPT4gMSAvICgxICsgTWF0aC5leHAoLXgpKSxcblx0XHRcdGRlcjogeCA9PiB7XG5cdFx0XHRcdGxldCBvdXRwdXQgPSBBY3RpdmF0aW9ucy5TSUdNT0lELm91dHB1dCh4KTtcblx0XHRcdFx0cmV0dXJuIG91dHB1dCAqICgxIC0gb3V0cHV0KTtcblx0XHRcdH1cblx0XHR9O1xuXHRwdWJsaWMgc3RhdGljIExJTkVBUjogQWN0aXZhdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHggPT4geCxcblx0XHRcdGRlcjogeCA9PiAxXG5cdFx0fTtcblx0cHVibGljIHN0YXRpYyBTSU5YOiBBY3RpdmF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogeCA9PiBNYXRoLnNpbih4KSxcblx0XHRcdGRlcjogeCA9PiBNYXRoLmNvcyh4KVxuXHRcdH07XG59XG5cbi8qKiBCdWlsZC1pbiByZWd1bGFyaXphdGlvbiBmdW5jdGlvbnMgKi9cbmV4cG9ydCBjbGFzcyBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uIHtcblx0cHVibGljIHN0YXRpYyBMMTogUmVndWxhcml6YXRpb25GdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0b3V0cHV0OiB3ID0+IE1hdGguYWJzKHcpLFxuXHRcdFx0ZGVyOiB3ID0+IHcgPCAwID8gLTEgOiAodyA+IDAgPyAxIDogMClcblx0XHR9O1xuXHRwdWJsaWMgc3RhdGljIEwyOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHcgPT4gMC41ICogdyAqIHcsXG5cdFx0XHRkZXI6IHcgPT4gd1xuXHRcdH07XG59XG5cbi8qKlxuICogQSBsaW5rIGluIGEgbmV1cmFsIG5ldHdvcmsuIEVhY2ggbGluayBoYXMgYSB3ZWlnaHQgYW5kIGEgc291cmNlIGFuZFxuICogZGVzdGluYXRpb24gbm9kZS4gQWxzbyBpdCBoYXMgYW4gaW50ZXJuYWwgc3RhdGUgKGVycm9yIGRlcml2YXRpdmVcbiAqIHdpdGggcmVzcGVjdCB0byBhIHBhcnRpY3VsYXIgaW5wdXQpIHdoaWNoIGdldHMgdXBkYXRlZCBhZnRlclxuICogYSBydW4gb2YgYmFjayBwcm9wYWdhdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIExpbmsge1xuXHRpZDogc3RyaW5nO1xuXHRzb3VyY2U6IE5vZGU7XG5cdGRlc3Q6IE5vZGU7XG5cdHdlaWdodCA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG5cdGlzRGVhZCA9IGZhbHNlO1xuXHQvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyB3ZWlnaHQuICovXG5cdGVycm9yRGVyID0gMDtcblx0LyoqIEFjY3VtdWxhdGVkIGVycm9yIGRlcml2YXRpdmUgc2luY2UgdGhlIGxhc3QgdXBkYXRlLiAqL1xuXHRhY2NFcnJvckRlciA9IDA7XG5cdC8qKiBOdW1iZXIgb2YgYWNjdW11bGF0ZWQgZGVyaXZhdGl2ZXMgc2luY2UgdGhlIGxhc3QgdXBkYXRlLiAqL1xuXHRudW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuXHRyZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbjtcblxuXHR0cnVlTGVhcm5pbmdSYXRlID0gMDtcblxuXHQvKipcblx0ICogQ29uc3RydWN0cyBhIGxpbmsgaW4gdGhlIG5ldXJhbCBuZXR3b3JrIGluaXRpYWxpemVkIHdpdGggcmFuZG9tIHdlaWdodC5cblx0ICpcblx0ICogQHBhcmFtIHNvdXJjZSBUaGUgc291cmNlIG5vZGUuXG5cdCAqIEBwYXJhbSBkZXN0IFRoZSBkZXN0aW5hdGlvbiBub2RlLlxuXHQgKiBAcGFyYW0gcmVndWxhcml6YXRpb24gVGhlIHJlZ3VsYXJpemF0aW9uIGZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgdGhlXG5cdCAqICAgICBwZW5hbHR5IGZvciB0aGlzIHdlaWdodC4gSWYgbnVsbCwgdGhlcmUgd2lsbCBiZSBubyByZWd1bGFyaXphdGlvbi5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNvdXJjZTogTm9kZSwgZGVzdDogTm9kZSxcblx0XHRcdFx0cmVndWxhcml6YXRpb246IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24sIGluaXRaZXJvPzogYm9vbGVhbikge1xuXHRcdHRoaXMuaWQgPSBzb3VyY2UuaWQgKyBcIi1cIiArIGRlc3QuaWQ7XG5cdFx0dGhpcy5zb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy5kZXN0ID0gZGVzdDtcblx0XHR0aGlzLnJlZ3VsYXJpemF0aW9uID0gcmVndWxhcml6YXRpb247XG5cdFx0aWYgKGluaXRaZXJvKSB7XG5cdFx0XHR0aGlzLndlaWdodCA9IDA7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQnVpbGRzIGEgbmV1cmFsIG5ldHdvcmsuXG4gKlxuICogQHBhcmFtIG5ldHdvcmtTaGFwZSBUaGUgc2hhcGUgb2YgdGhlIG5ldHdvcmsuIEUuZy4gWzEsIDIsIDMsIDFdIG1lYW5zXG4gKiAgIHRoZSBuZXR3b3JrIHdpbGwgaGF2ZSBvbmUgaW5wdXQgbm9kZSwgMiBub2RlcyBpbiBmaXJzdCBoaWRkZW4gbGF5ZXIsXG4gKiAgIDMgbm9kZXMgaW4gc2Vjb25kIGhpZGRlbiBsYXllciBhbmQgMSBvdXRwdXQgbm9kZS5cbiAqIEBwYXJhbSBhY3RpdmF0aW9uIFRoZSBhY3RpdmF0aW9uIGZ1bmN0aW9uIG9mIGV2ZXJ5IGhpZGRlbiBub2RlLlxuICogQHBhcmFtIG91dHB1dEFjdGl2YXRpb24gVGhlIGFjdGl2YXRpb24gZnVuY3Rpb24gZm9yIHRoZSBvdXRwdXQgbm9kZXMuXG4gKiBAcGFyYW0gcmVndWxhcml6YXRpb24gVGhlIHJlZ3VsYXJpemF0aW9uIGZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgYSBwZW5hbHR5XG4gKiAgICAgZm9yIGEgZ2l2ZW4gd2VpZ2h0IChwYXJhbWV0ZXIpIGluIHRoZSBuZXR3b3JrLiBJZiBudWxsLCB0aGVyZSB3aWxsIGJlXG4gKiAgICAgbm8gcmVndWxhcml6YXRpb24uXG4gKiBAcGFyYW0gaW5wdXRJZHMgTGlzdCBvZiBpZHMgZm9yIHRoZSBpbnB1dCBub2Rlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTmV0d29yayhcblx0bmV0d29ya1NoYXBlOiBudW1iZXJbXSwgYWN0aXZhdGlvbjogQWN0aXZhdGlvbkZ1bmN0aW9uLFxuXHRvdXRwdXRBY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb24sXG5cdHJlZ3VsYXJpemF0aW9uOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uLFxuXHRpbnB1dElkczogc3RyaW5nW10sIGluaXRaZXJvPzogYm9vbGVhbik6IE5vZGVbXVtdIHtcblx0bGV0IG51bUxheWVycyA9IG5ldHdvcmtTaGFwZS5sZW5ndGg7XG5cdGxldCBpZCA9IDE7XG5cdC8qKiBMaXN0IG9mIGxheWVycywgd2l0aCBlYWNoIGxheWVyIGJlaW5nIGEgbGlzdCBvZiBub2Rlcy4gKi9cblx0bGV0IG5ldHdvcms6IE5vZGVbXVtdID0gW107XG5cdGZvciAobGV0IGxheWVySWR4ID0gMDsgbGF5ZXJJZHggPCBudW1MYXllcnM7IGxheWVySWR4KyspIHtcblx0XHRsZXQgaXNPdXRwdXRMYXllciA9IGxheWVySWR4ID09PSBudW1MYXllcnMgLSAxO1xuXHRcdGxldCBpc0lucHV0TGF5ZXIgPSBsYXllcklkeCA9PT0gMDtcblx0XHRsZXQgY3VycmVudExheWVyOiBOb2RlW10gPSBbXTtcblx0XHRuZXR3b3JrLnB1c2goY3VycmVudExheWVyKTtcblx0XHRsZXQgbnVtTm9kZXMgPSBuZXR3b3JrU2hhcGVbbGF5ZXJJZHhdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtTm9kZXM7IGkrKykge1xuXHRcdFx0bGV0IG5vZGVJZCA9IGlkLnRvU3RyaW5nKCk7XG5cdFx0XHRpZiAoaXNJbnB1dExheWVyKSB7XG5cdFx0XHRcdG5vZGVJZCA9IGlucHV0SWRzW2ldO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWQrKztcblx0XHRcdH1cblx0XHRcdGxldCBub2RlID0gbmV3IE5vZGUobm9kZUlkLFxuXHRcdFx0XHRpc091dHB1dExheWVyID8gb3V0cHV0QWN0aXZhdGlvbiA6IGFjdGl2YXRpb24sIGluaXRaZXJvKTtcblx0XHRcdGN1cnJlbnRMYXllci5wdXNoKG5vZGUpO1xuXHRcdFx0aWYgKGxheWVySWR4ID49IDEpIHtcblx0XHRcdFx0Ly8gQWRkIGxpbmtzIGZyb20gbm9kZXMgaW4gdGhlIHByZXZpb3VzIGxheWVyIHRvIHRoaXMgbm9kZS5cblx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBuZXR3b3JrW2xheWVySWR4IC0gMV0ubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRsZXQgcHJldk5vZGUgPSBuZXR3b3JrW2xheWVySWR4IC0gMV1bal07XG5cdFx0XHRcdFx0bGV0IGxpbmsgPSBuZXcgTGluayhwcmV2Tm9kZSwgbm9kZSwgcmVndWxhcml6YXRpb24sIGluaXRaZXJvKTtcblx0XHRcdFx0XHRwcmV2Tm9kZS5vdXRwdXRzLnB1c2gobGluayk7XG5cdFx0XHRcdFx0bm9kZS5pbnB1dExpbmtzLnB1c2gobGluayk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIG5ldHdvcms7XG59XG5cbi8qKlxuICogUnVucyBhIGZvcndhcmQgcHJvcGFnYXRpb24gb2YgdGhlIHByb3ZpZGVkIGlucHV0IHRocm91Z2ggdGhlIHByb3ZpZGVkXG4gKiBuZXR3b3JrLiBUaGlzIG1ldGhvZCBtb2RpZmllcyB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIG5ldHdvcmsgLSB0aGVcbiAqIHRvdGFsIGlucHV0IGFuZCBvdXRwdXQgb2YgZWFjaCBub2RlIGluIHRoZSBuZXR3b3JrLlxuICpcbiAqIEBwYXJhbSBuZXR3b3JrIFRoZSBuZXVyYWwgbmV0d29yay5cbiAqIEBwYXJhbSBpbnB1dHMgVGhlIGlucHV0IGFycmF5LiBJdHMgbGVuZ3RoIHNob3VsZCBtYXRjaCB0aGUgbnVtYmVyIG9mIGlucHV0XG4gKiAgICAgbm9kZXMgaW4gdGhlIG5ldHdvcmsuXG4gKiBAcmV0dXJuIFRoZSBmaW5hbCBvdXRwdXQgb2YgdGhlIG5ldHdvcmsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkUHJvcChuZXR3b3JrOiBOb2RlW11bXSwgaW5wdXRzOiBudW1iZXJbXSk6IG51bWJlciB7XG5cdGxldCBpbnB1dExheWVyID0gbmV0d29ya1swXTtcblx0aWYgKGlucHV0cy5sZW5ndGggIT09IGlucHV0TGF5ZXIubGVuZ3RoKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIG51bWJlciBvZiBpbnB1dHMgbXVzdCBtYXRjaCB0aGUgbnVtYmVyIG9mIG5vZGVzIGluXCIgK1xuXHRcdFx0XCIgdGhlIGlucHV0IGxheWVyXCIpO1xuXHR9XG5cdC8vIFVwZGF0ZSB0aGUgaW5wdXQgbGF5ZXIuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBub2RlID0gaW5wdXRMYXllcltpXTtcblx0XHRub2RlLm91dHB1dCA9IGlucHV0c1tpXTtcblx0fVxuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Ly8gVXBkYXRlIGFsbCB0aGUgbm9kZXMgaW4gdGhpcyBsYXllci5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRub2RlLnVwZGF0ZU91dHB1dCgpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbmV0d29ya1tuZXR3b3JrLmxlbmd0aCAtIDFdWzBdLm91dHB1dDtcbn1cblxuLyoqXG4gKiBSdW5zIGEgYmFja3dhcmQgcHJvcGFnYXRpb24gdXNpbmcgdGhlIHByb3ZpZGVkIHRhcmdldCBhbmQgdGhlXG4gKiBjb21wdXRlZCBvdXRwdXQgb2YgdGhlIHByZXZpb3VzIGNhbGwgdG8gZm9yd2FyZCBwcm9wYWdhdGlvbi5cbiAqIFRoaXMgbWV0aG9kIG1vZGlmaWVzIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgbmV0d29yayAtIHRoZSBlcnJvclxuICogZGVyaXZhdGl2ZXMgd2l0aCByZXNwZWN0IHRvIGVhY2ggbm9kZSwgYW5kIGVhY2ggd2VpZ2h0XG4gKiBpbiB0aGUgbmV0d29yay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJhY2tQcm9wKG5ldHdvcms6IE5vZGVbXVtdLCB0YXJnZXQ6IG51bWJlciwgZXJyb3JGdW5jOiBFcnJvckZ1bmN0aW9uKTogdm9pZCB7XG5cdC8vIFRoZSBvdXRwdXQgbm9kZSBpcyBhIHNwZWNpYWwgY2FzZS4gV2UgdXNlIHRoZSB1c2VyLWRlZmluZWQgZXJyb3Jcblx0Ly8gZnVuY3Rpb24gZm9yIHRoZSBkZXJpdmF0aXZlLlxuXHRsZXQgb3V0cHV0Tm9kZSA9IG5ldHdvcmtbbmV0d29yay5sZW5ndGggLSAxXVswXTtcblx0b3V0cHV0Tm9kZS5vdXRwdXREZXIgPSBlcnJvckZ1bmMuZGVyKG91dHB1dE5vZGUub3V0cHV0LCB0YXJnZXQpO1xuXG5cdC8vIEdvIHRocm91Z2ggdGhlIGxheWVycyBiYWNrd2FyZHMuXG5cdGZvciAobGV0IGxheWVySWR4ID0gbmV0d29yay5sZW5ndGggLSAxOyBsYXllcklkeCA+PSAxOyBsYXllcklkeC0tKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdC8vIENvbXB1dGUgdGhlIGVycm9yIGRlcml2YXRpdmUgb2YgZWFjaCBub2RlIHdpdGggcmVzcGVjdCB0bzpcblx0XHQvLyAxKSBpdHMgdG90YWwgaW5wdXRcblx0XHQvLyAyKSBlYWNoIG9mIGl0cyBpbnB1dCB3ZWlnaHRzLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdG5vZGUuaW5wdXREZXIgPSBub2RlLm91dHB1dERlciAqIG5vZGUuYWN0aXZhdGlvbi5kZXIobm9kZS50b3RhbElucHV0KTtcblx0XHRcdG5vZGUuYWNjSW5wdXREZXIgKz0gbm9kZS5pbnB1dERlcjtcblx0XHRcdG5vZGUubnVtQWNjdW11bGF0ZWREZXJzKys7XG5cdFx0fVxuXG5cdFx0Ly8gRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gZWFjaCB3ZWlnaHQgY29taW5nIGludG8gdGhlIG5vZGUuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBub2RlLmlucHV0TGlua3MubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0bGV0IGxpbmsgPSBub2RlLmlucHV0TGlua3Nbal07XG5cdFx0XHRcdGlmIChsaW5rLmlzRGVhZCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpbmsuZXJyb3JEZXIgPSBub2RlLmlucHV0RGVyICogbGluay5zb3VyY2Uub3V0cHV0O1xuXHRcdFx0XHRsaW5rLmFjY0Vycm9yRGVyICs9IGxpbmsuZXJyb3JEZXI7XG5cdFx0XHRcdGxpbmsubnVtQWNjdW11bGF0ZWREZXJzKys7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChsYXllcklkeCA9PT0gMSkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGxldCBwcmV2TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4IC0gMV07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gcHJldkxheWVyW2ldO1xuXHRcdFx0Ly8gQ29tcHV0ZSB0aGUgZXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gZWFjaCBub2RlJ3Mgb3V0cHV0LlxuXHRcdFx0bm9kZS5vdXRwdXREZXIgPSAwO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBub2RlLm91dHB1dHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0bGV0IG91dHB1dCA9IG5vZGUub3V0cHV0c1tqXTtcblx0XHRcdFx0bm9kZS5vdXRwdXREZXIgKz0gb3V0cHV0LndlaWdodCAqIG91dHB1dC5kZXN0LmlucHV0RGVyO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIHdlaWdodHMgb2YgdGhlIG5ldHdvcmsgdXNpbmcgdGhlIHByZXZpb3VzbHkgYWNjdW11bGF0ZWQgZXJyb3JcbiAqIGRlcml2YXRpdmVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlV2VpZ2h0cyhuZXR3b3JrOiBOb2RlW11bXSwgbGVhcm5pbmdSYXRlOiBudW1iZXIsIHJlZ3VsYXJpemF0aW9uUmF0ZTogbnVtYmVyKSB7XG5cdGZvciAobGV0IGxheWVySWR4ID0gMTsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aDsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHQvLyBVcGRhdGUgdGhlIG5vZGUncyBiaWFzLlxuXHRcdFx0aWYgKG5vZGUubnVtQWNjdW11bGF0ZWREZXJzID4gMCkge1xuXHRcdFx0XHRub2RlLnRydWVMZWFybmluZ1JhdGUgPSBub2RlLmFjY0lucHV0RGVyIC8gbm9kZS5udW1BY2N1bXVsYXRlZERlcnM7XG5cdFx0XHRcdG5vZGUuYmlhcyAtPSBsZWFybmluZ1JhdGUgKiBub2RlLnRydWVMZWFybmluZ1JhdGU7IC8vIG5vZGUuYWNjSW5wdXREZXIgLyBub2RlLm51bUFjY3VtdWxhdGVkRGVycztcblx0XHRcdFx0bm9kZS5hY2NJbnB1dERlciA9IDA7XG5cdFx0XHRcdG5vZGUubnVtQWNjdW11bGF0ZWREZXJzID0gMDtcblx0XHRcdH1cblx0XHRcdC8vIFVwZGF0ZSB0aGUgd2VpZ2h0cyBjb21pbmcgaW50byB0aGlzIG5vZGUuXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcblx0XHRcdFx0aWYgKGxpbmsuaXNEZWFkKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IHJlZ3VsRGVyID0gbGluay5yZWd1bGFyaXphdGlvbiA/XG5cdFx0XHRcdFx0bGluay5yZWd1bGFyaXphdGlvbi5kZXIobGluay53ZWlnaHQpIDogMDtcblx0XHRcdFx0aWYgKGxpbmsubnVtQWNjdW11bGF0ZWREZXJzID4gMCkge1xuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgd2VpZ2h0IGJhc2VkIG9uIGRFL2R3LlxuXHRcdFx0XHRcdGxpbmsudHJ1ZUxlYXJuaW5nUmF0ZSA9IGxpbmsuYWNjRXJyb3JEZXIgLyBsaW5rLm51bUFjY3VtdWxhdGVkRGVycztcblx0XHRcdFx0XHRsaW5rLndlaWdodCA9IGxpbmsud2VpZ2h0IC0gbGVhcm5pbmdSYXRlICogbGluay50cnVlTGVhcm5pbmdSYXRlO1xuXG5cdFx0XHRcdFx0Ly8gRnVydGhlciB1cGRhdGUgdGhlIHdlaWdodCBiYXNlZCBvbiByZWd1bGFyaXphdGlvbi5cblx0XHRcdFx0XHRsZXQgbmV3TGlua1dlaWdodCA9IGxpbmsud2VpZ2h0IC1cblx0XHRcdFx0XHRcdChsZWFybmluZ1JhdGUgKiByZWd1bGFyaXphdGlvblJhdGUpICogcmVndWxEZXI7XG5cdFx0XHRcdFx0aWYgKGxpbmsucmVndWxhcml6YXRpb24gPT09IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24uTDEgJiZcblx0XHRcdFx0XHRcdGxpbmsud2VpZ2h0ICogbmV3TGlua1dlaWdodCA8IDApIHtcblx0XHRcdFx0XHRcdC8vIFRoZSB3ZWlnaHQgY3Jvc3NlZCAwIGR1ZSB0byB0aGUgcmVndWxhcml6YXRpb24gdGVybS4gU2V0IGl0IHRvIDAuXG5cdFx0XHRcdFx0XHRsaW5rLndlaWdodCA9IDA7XG5cdFx0XHRcdFx0XHRsaW5rLmlzRGVhZCA9IHRydWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxpbmsud2VpZ2h0ID0gbmV3TGlua1dlaWdodDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bGluay5hY2NFcnJvckRlciA9IDA7XG5cdFx0XHRcdFx0bGluay5udW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbi8qKiBJdGVyYXRlcyBvdmVyIGV2ZXJ5IG5vZGUgaW4gdGhlIG5ldHdvcmsvICovXG5leHBvcnQgZnVuY3Rpb24gZm9yRWFjaE5vZGUobmV0d29yazogTm9kZVtdW10sIGlnbm9yZUlucHV0czogYm9vbGVhbixcblx0XHRcdFx0XHRcdFx0YWNjZXNzb3I6IChub2RlOiBOb2RlKSA9PiBhbnkpIHtcblx0Zm9yIChsZXQgbGF5ZXJJZHggPSBpZ25vcmVJbnB1dHMgPyAxIDogMDsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aDsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRhY2Nlc3Nvcihub2RlKTtcblx0XHR9XG5cdH1cbn1cblxuLyoqIFJldHVybnMgdGhlIG91dHB1dCBub2RlIGluIHRoZSBuZXR3b3JrLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE91dHB1dE5vZGUobmV0d29yazogTm9kZVtdW10pIHtcblx0cmV0dXJuIG5ldHdvcmtbbmV0d29yay5sZW5ndGggLSAxXVswXTtcbn1cbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmRlY2xhcmUgdmFyICQ6IGFueTtcblxuaW1wb3J0ICogYXMgbm4gZnJvbSBcIi4vbm5cIjtcbmltcG9ydCB7SGVhdE1hcCwgcmVkdWNlTWF0cml4fSBmcm9tIFwiLi9oZWF0bWFwXCI7XG5pbXBvcnQge1xuXHRTdGF0ZSxcblx0ZGF0YXNldHMsXG5cdHJlZ0RhdGFzZXRzLFxuXHRhY3RpdmF0aW9ucyxcblx0cHJvYmxlbXMsXG5cdHJlZ3VsYXJpemF0aW9ucyxcblx0Z2V0S2V5RnJvbVZhbHVlLFxuXHRQcm9ibGVtXG59IGZyb20gXCIuL3N0YXRlXCI7XG5pbXBvcnQge0V4YW1wbGUyRCwgc2h1ZmZsZSwgRGF0YUdlbmVyYXRvcn0gZnJvbSBcIi4vZGF0YXNldFwiO1xuaW1wb3J0IHtBcHBlbmRpbmdMaW5lQ2hhcnR9IGZyb20gXCIuL2xpbmVjaGFydFwiO1xuXG5sZXQgbWFpbldpZHRoO1xuXG50eXBlIGVuZXJneVR5cGUgPSB7XG5cdGVWYWw6IG51bWJlcixcblx0bGFiZWw6IG51bWJlclxufTtcblxuZnVuY3Rpb24gbXRydW5jKHY6IG51bWJlcikge1xuXHR2ID0gK3Y7XG5cdHJldHVybiAodiAtIHYgJSAxKSB8fCAoIWlzRmluaXRlKHYpIHx8IHYgPT09IDAgPyB2IDogdiA8IDAgPyAtMCA6IDApO1xufVxuXG5mdW5jdGlvbiBsb2cyKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGgubG9nKDIpO1xufVxuXG5mdW5jdGlvbiBsb2cxMCh4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZygxMCk7XG59XG5cbmZ1bmN0aW9uIHNpZ25hbE9mKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiBsb2cyKDEgKyBNYXRoLmFicyh4KSk7XG59XG5cbmZ1bmN0aW9uIFNOUih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gMTAgKiBsb2cxMCh4KTtcbn1cblxuLy8gTW9yZSBzY3JvbGxpbmdcbmQzLnNlbGVjdChcIi5tb3JlIGJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0bGV0IHBvc2l0aW9uID0gODAwO1xuXHRkMy50cmFuc2l0aW9uKClcblx0XHQuZHVyYXRpb24oMTAwMClcblx0XHQudHdlZW4oXCJzY3JvbGxcIiwgc2Nyb2xsVHdlZW4ocG9zaXRpb24pKTtcbn0pO1xuXG5mdW5jdGlvbiBzY3JvbGxUd2VlbihvZmZzZXQpIHtcblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgaSA9IGQzLmludGVycG9sYXRlTnVtYmVyKHdpbmRvdy5wYWdlWU9mZnNldCB8fFxuXHRcdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCwgb2Zmc2V0KTtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdHNjcm9sbFRvKDAsIGkodCkpO1xuXHRcdH07XG5cdH07XG59XG5cbmNvbnN0IFJFQ1RfU0laRSA9IDMwO1xuY29uc3QgQklBU19TSVpFID0gNTtcbmNvbnN0IE5VTV9TQU1QTEVTX0NMQVNTSUZZID0gNTAwO1xuY29uc3QgTlVNX1NBTVBMRVNfUkVHUkVTUyA9IDEyMDA7XG5jb25zdCBERU5TSVRZID0gMTAwO1xuXG5jb25zdCBNQVhfTkVVUk9OUyA9IDMyO1xuY29uc3QgTUFYX0hMQVlFUlMgPSAxMDtcblxuLy8gUm91bmRpbmcgb2ZmIG9mIHRyYWluaW5nIGRhdGEuIFVzZWQgYnkgZ2V0UmVxQ2FwYWNpdHlcbmNvbnN0IFJFUV9DQVBfUk9VTkRJTkcgPSAtMTtcblxuZW51bSBIb3ZlclR5cGUge1xuXHRCSUFTLCBXRUlHSFRcbn1cblxuaW50ZXJmYWNlIElucHV0RmVhdHVyZSB7XG5cdGY6ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gbnVtYmVyO1xuXHRsYWJlbD86IHN0cmluZztcbn1cblxubGV0IElOUFVUUzogeyBbbmFtZTogc3RyaW5nXTogSW5wdXRGZWF0dXJlIH0gPSB7XG5cdFwieFwiOiB7ZjogKHgsIHkpID0+IHgsIGxhYmVsOiBcIlhfMVwifSxcblx0XCJ5XCI6IHtmOiAoeCwgeSkgPT4geSwgbGFiZWw6IFwiWF8yXCJ9LFxuXHRcInhTcXVhcmVkXCI6IHtmOiAoeCwgeSkgPT4geCAqIHgsIGxhYmVsOiBcIlhfMV4yXCJ9LFxuXHRcInlTcXVhcmVkXCI6IHtmOiAoeCwgeSkgPT4geSAqIHksIGxhYmVsOiBcIlhfMl4yXCJ9LFxuXHRcInhUaW1lc1lcIjoge2Y6ICh4LCB5KSA9PiB4ICogeSwgbGFiZWw6IFwiWF8xWF8yXCJ9LFxuXHRcInNpblhcIjoge2Y6ICh4LCB5KSA9PiBNYXRoLnNpbih4KSwgbGFiZWw6IFwic2luKFhfMSlcIn0sXG5cdFwic2luWVwiOiB7ZjogKHgsIHkpID0+IE1hdGguc2luKHkpLCBsYWJlbDogXCJzaW4oWF8yKVwifSxcbn07XG5cbmxldCBISURBQkxFX0NPTlRST0xTID1cblx0W1xuXHRcdFtcIlNob3cgdGVzdCBkYXRhXCIsIFwic2hvd1Rlc3REYXRhXCJdLFxuXHRcdFtcIkRpc2NyZXRpemUgb3V0cHV0XCIsIFwiZGlzY3JldGl6ZVwiXSxcblx0XHRbXCJQbGF5IGJ1dHRvblwiLCBcInBsYXlCdXR0b25cIl0sXG5cdFx0W1wiU3RlcCBidXR0b25cIiwgXCJzdGVwQnV0dG9uXCJdLFxuXHRcdFtcIlJlc2V0IGJ1dHRvblwiLCBcInJlc2V0QnV0dG9uXCJdLFxuXHRcdFtcIlJhdGUgc2NhbGUgZmFjdG9yXCIsIFwibGVhcm5pbmdSYXRlXCJdLFxuXHRcdFtcIkxlYXJuaW5nIHJhdGVcIiwgXCJ0cnVlTGVhcm5pbmdSYXRlXCJdLFxuXHRcdFtcIkFjdGl2YXRpb25cIiwgXCJhY3RpdmF0aW9uXCJdLFxuXHRcdFtcIlJlZ3VsYXJpemF0aW9uXCIsIFwicmVndWxhcml6YXRpb25cIl0sXG5cdFx0W1wiUmVndWxhcml6YXRpb24gcmF0ZVwiLCBcInJlZ3VsYXJpemF0aW9uUmF0ZVwiXSxcblx0XHRbXCJQcm9ibGVtIHR5cGVcIiwgXCJwcm9ibGVtXCJdLFxuXHRcdFtcIldoaWNoIGRhdGFzZXRcIiwgXCJkYXRhc2V0XCJdLFxuXHRcdFtcIlJhdGlvIHRyYWluIGRhdGFcIiwgXCJwZXJjVHJhaW5EYXRhXCJdLFxuXHRcdFtcIk5vaXNlIGxldmVsXCIsIFwibm9pc2VcIl0sXG5cdFx0W1wiQmF0Y2ggc2l6ZVwiLCBcImJhdGNoU2l6ZVwiXSxcblx0XHRbXCIjIG9mIGhpZGRlbiBsYXllcnNcIiwgXCJudW1IaWRkZW5MYXllcnNcIl0sXG5cdF07XG5cbmNsYXNzIFBsYXllciB7XG5cdHByaXZhdGUgdGltZXJJbmRleCA9IDA7XG5cdHByaXZhdGUgaXNQbGF5aW5nID0gZmFsc2U7XG5cdHByaXZhdGUgY2FsbGJhY2s6IChpc1BsYXlpbmc6IGJvb2xlYW4pID0+IHZvaWQgPSBudWxsO1xuXG5cdC8qKiBQbGF5cy9wYXVzZXMgdGhlIHBsYXllci4gKi9cblx0cGxheU9yUGF1c2UoKSB7XG5cdFx0aWYgKHRoaXMuaXNQbGF5aW5nKSB7XG5cdFx0XHR0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5wYXVzZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmlzUGxheWluZyA9IHRydWU7XG5cdFx0XHRpZiAoaXRlciA9PT0gMCkge1xuXHRcdFx0XHRzaW11bGF0aW9uU3RhcnRlZCgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5wbGF5KCk7XG5cdFx0fVxuXHR9XG5cblx0b25QbGF5UGF1c2UoY2FsbGJhY2s6IChpc1BsYXlpbmc6IGJvb2xlYW4pID0+IHZvaWQpIHtcblx0XHR0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdH1cblxuXHRwbGF5KCkge1xuXHRcdHRoaXMucGF1c2UoKTtcblx0XHR0aGlzLmlzUGxheWluZyA9IHRydWU7XG5cdFx0aWYgKHRoaXMuY2FsbGJhY2spIHtcblx0XHRcdHRoaXMuY2FsbGJhY2sodGhpcy5pc1BsYXlpbmcpO1xuXHRcdH1cblx0XHR0aGlzLnN0YXJ0KHRoaXMudGltZXJJbmRleCk7XG5cdH1cblxuXHRwYXVzZSgpIHtcblx0XHR0aGlzLnRpbWVySW5kZXgrKztcblx0XHR0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuXHRcdGlmICh0aGlzLmNhbGxiYWNrKSB7XG5cdFx0XHR0aGlzLmNhbGxiYWNrKHRoaXMuaXNQbGF5aW5nKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0YXJ0KGxvY2FsVGltZXJJbmRleDogbnVtYmVyKSB7XG5cdFx0ZDMudGltZXIoKCkgPT4ge1xuXHRcdFx0aWYgKGxvY2FsVGltZXJJbmRleCA8IHRoaXMudGltZXJJbmRleCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTsgIC8vIERvbmUuXG5cdFx0XHR9XG5cdFx0XHRvbmVTdGVwKCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7ICAvLyBOb3QgZG9uZS5cblx0XHR9LCAwKTtcblx0fVxufVxuXG5sZXQgc3RhdGUgPSBTdGF0ZS5kZXNlcmlhbGl6ZVN0YXRlKCk7XG5cbi8vIEZpbHRlciBvdXQgaW5wdXRzIHRoYXQgYXJlIGhpZGRlbi5cbnN0YXRlLmdldEhpZGRlblByb3BzKCkuZm9yRWFjaChwcm9wID0+IHtcblx0aWYgKHByb3AgaW4gSU5QVVRTKSB7XG5cdFx0ZGVsZXRlIElOUFVUU1twcm9wXTtcblx0fVxufSk7XG5cbmxldCBib3VuZGFyeTogeyBbaWQ6IHN0cmluZ106IG51bWJlcltdW10gfSA9IHt9O1xubGV0IHNlbGVjdGVkTm9kZUlkOiBzdHJpbmcgPSBudWxsO1xuLy8gUGxvdCB0aGUgaGVhdG1hcC5cbmxldCB4RG9tYWluOiBbbnVtYmVyLCBudW1iZXJdID0gWy02LCA2XTtcbmxldCBoZWF0TWFwID1cblx0bmV3IEhlYXRNYXAoMzAwLCBERU5TSVRZLCB4RG9tYWluLCB4RG9tYWluLCBkMy5zZWxlY3QoXCIjaGVhdG1hcFwiKSxcblx0XHR7c2hvd0F4ZXM6IHRydWV9KTtcbmxldCBsaW5rV2lkdGhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdC5kb21haW4oWzAsIDVdKVxuXHQucmFuZ2UoWzEsIDEwXSlcblx0LmNsYW1wKHRydWUpO1xubGV0IGNvbG9yU2NhbGUgPSBkMy5zY2FsZS5saW5lYXI8c3RyaW5nPigpXG5cdC5kb21haW4oWy0xLCAwLCAxXSlcblx0LnJhbmdlKFtcIiMwODc3YmRcIiwgXCIjZThlYWViXCIsIFwiI2Y1OTMyMlwiXSlcblx0LmNsYW1wKHRydWUpO1xubGV0IGl0ZXIgPSAwO1xubGV0IHRyYWluRGF0YTogRXhhbXBsZTJEW10gPSBbXTtcbmxldCB0ZXN0RGF0YTogRXhhbXBsZTJEW10gPSBbXTtcbmxldCBuZXR3b3JrOiBubi5Ob2RlW11bXSA9IG51bGw7XG5sZXQgbG9zc1RyYWluID0gMDtcbmxldCBsb3NzVGVzdCA9IDA7XG5sZXQgdHJ1ZUxlYXJuaW5nUmF0ZSA9IDA7XG5sZXQgdG90YWxDYXBhY2l0eSA9IDA7XG5sZXQgZ2VuZXJhbGl6YXRpb24gPSAwO1xubGV0IHRyYWluQ2xhc3Nlc0FjY3VyYWN5ID0gW107XG5sZXQgdGVzdENsYXNzZXNBY2N1cmFjeSA9IFtdO1xubGV0IHBsYXllciA9IG5ldyBQbGF5ZXIoKTtcbmxldCBsaW5lQ2hhcnQgPSBuZXcgQXBwZW5kaW5nTGluZUNoYXJ0KGQzLnNlbGVjdChcIiNsaW5lY2hhcnRcIiksXG5cdFtcIiM3NzdcIiwgXCJibGFja1wiXSk7XG5cbmZ1bmN0aW9uIGdldFJlcUNhcGFjaXR5KHBvaW50czogRXhhbXBsZTJEW10pOiBudW1iZXJbXSB7XG5cblx0bGV0IHJvdW5kaW5nID0gUkVRX0NBUF9ST1VORElORztcblx0bGV0IGVuZXJneTogZW5lcmd5VHlwZVtdID0gW107XG5cdGxldCBudW1Sb3dzOiBudW1iZXIgPSBwb2ludHMubGVuZ3RoO1xuXHRsZXQgbnVtQ29sczogbnVtYmVyID0gMjtcblx0bGV0IHJlc3VsdDogbnVtYmVyID0gMDtcblx0bGV0IHJldHZhbDogbnVtYmVyW10gPSBbXTtcblxuXHRsZXQgY2xhc3MxID0gLTY2Njtcblx0bGV0IG51bWNsYXNzMTogbnVtYmVyID0gMDtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1Sb3dzOyBpKyspIHtcblx0XHRsZXQgeDogbnVtYmVyID0gcG9pbnRzW2ldLnggLyAxLjA7XG5cdFx0bGV0IHk6IG51bWJlciA9IHBvaW50c1tpXS55IC8gMS4wO1xuXHRcdGxldCByZXN1bHQ6IG51bWJlciA9ICh4ICsgeSkgLyAxLjA7XG5cdFx0Ly8gfiBjb25zb2xlLmxvZyhcIng6IFwiICsgeCArIFwiXFx0eTogXCIgKyB5ICsgXCJcXHRyZXN1bHRbXCIgKyBpICsgXCJdOiBcIiArIHJlc3VsdCk7XG5cdFx0aWYgKHJvdW5kaW5nICE9IC0xKSB7XG5cdFx0XHRyZXN1bHQgPSBtdHJ1bmMocmVzdWx0ICogTWF0aC5wb3coMTAsIHJvdW5kaW5nKSkgLyBNYXRoLnBvdygxMCwgcm91bmRpbmcpO1xuXHRcdH1cblx0XHRsZXQgZVZhbDogbnVtYmVyID0gcmVzdWx0O1xuXHRcdGxldCBsYWJlbDogbnVtYmVyID0gcG9pbnRzW2ldLmxhYmVsO1xuXHRcdGVuZXJneS5wdXNoKHtlVmFsLCBsYWJlbH0pO1xuXHRcdGlmIChjbGFzczEgPT0gLTY2Nikge1xuXHRcdFx0Y2xhc3MxID0gbGFiZWw7XG5cdFx0fVxuXHRcdGlmIChsYWJlbCA9PSBjbGFzczEpIHtcblx0XHRcdG51bWNsYXNzMSsrO1xuXHRcdH1cblx0fVxuXG5cblx0ZW5lcmd5LnNvcnQoXG5cdFx0ZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRcdHJldHVybiBhLmVWYWwgLSBiLmVWYWw7XG5cdFx0fVxuXHQpO1xuXG5cdGxldCBjdXJMYWJlbCA9IGVuZXJneVswXS5sYWJlbDtcblx0bGV0IGNoYW5nZXMgPSAwO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZW5lcmd5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKGVuZXJneVtpXS5sYWJlbCAhPSBjdXJMYWJlbCkge1xuXHRcdFx0Y2hhbmdlcysrO1xuXHRcdFx0Y3VyTGFiZWwgPSBlbmVyZ3lbaV0ubGFiZWw7XG5cdFx0fVxuXHR9XG5cblx0bGV0IGNsdXN0ZXJzOiBudW1iZXIgPSAwO1xuXHRjbHVzdGVycyA9IGNoYW5nZXMgKyAxO1xuXG5cdGxldCBtaW5jdXRzOiBudW1iZXIgPSAwO1xuXHRtaW5jdXRzID0gTWF0aC5jZWlsKGxvZzIoY2x1c3RlcnMpKTtcblxuXHRsZXQgc3VnQ2FwYWNpdHkgPSBtaW5jdXRzICogbnVtQ29scztcblx0bGV0IG1heENhcGFjaXR5ID0gY2hhbmdlcyAqIChudW1Db2xzICsgMSkgKyBjaGFuZ2VzO1xuXG5cdHJldHZhbC5wdXNoKHN1Z0NhcGFjaXR5KTtcblx0cmV0dmFsLnB1c2gobWF4Q2FwYWNpdHkpO1xuXG5cblx0cmV0dXJuIHJldHZhbDtcbn1cblxuLy8gfiBsZXQgbXlEYXRhOiBFeGFtcGxlMkRbXSA9IFtdO1xuZnVuY3Rpb24gbnVtYmVyT2ZVbmlxdWUoZGF0YXNldDogRXhhbXBsZTJEW10pIHtcblx0bGV0IGNvdW50OiBudW1iZXIgPSAwO1xuXHRsZXQgdW5pcXVlRGljdDogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xuXHRkYXRhc2V0LmZvckVhY2gocG9pbnQgPT4ge1xuXHRcdGxldCBrZXk6IHN0cmluZyA9IFwiXCIgKyBwb2ludC54ICsgcG9pbnQueSArIHBvaW50LmxhYmVsO1xuXHRcdGlmICghKGtleSBpbiB1bmlxdWVEaWN0KSkge1xuXHRcdFx0Y291bnQgKz0gMTtcblx0XHRcdHVuaXF1ZURpY3Rba2V5XSA9IDE7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGNvdW50O1xufVxuXG5mdW5jdGlvbiBtYWtlR1VJKCkge1xuXHRkMy5zZWxlY3QoXCIjcmVzZXQtYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdHJlc2V0KCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRkMy5zZWxlY3QoXCIjcGxheS1wYXVzZS1idXR0b25cIik7XG5cdH0pO1xuXG5cdGQzLnNlbGVjdChcIiNwbGF5LXBhdXNlLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHQvLyBDaGFuZ2UgdGhlIGJ1dHRvbidzIGNvbnRlbnQuXG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRwbGF5ZXIucGxheU9yUGF1c2UoKTtcblx0fSk7XG5cblx0cGxheWVyLm9uUGxheVBhdXNlKGlzUGxheWluZyA9PiB7XG5cdFx0ZDMuc2VsZWN0KFwiI3BsYXktcGF1c2UtYnV0dG9uXCIpLmNsYXNzZWQoXCJwbGF5aW5nXCIsIGlzUGxheWluZyk7XG5cdH0pO1xuXG5cdGQzLnNlbGVjdChcIiNuZXh0LXN0ZXAtYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdHBsYXllci5wYXVzZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0aWYgKGl0ZXIgPT09IDApIHtcblx0XHRcdHNpbXVsYXRpb25TdGFydGVkKCk7XG5cdFx0fVxuXHRcdG9uZVN0ZXAoKTtcblx0fSk7XG5cblx0ZDMuc2VsZWN0KFwiI2RhdGEtcmVnZW4tYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGdlbmVyYXRlRGF0YSgpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0fSk7XG5cblx0bGV0IGRhdGFUaHVtYm5haWxzID0gZDMuc2VsZWN0QWxsKFwiY2FudmFzW2RhdGEtZGF0YXNldF1cIik7XG5cdGRhdGFUaHVtYm5haWxzLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCBuZXdEYXRhc2V0ID0gZGF0YXNldHNbdGhpcy5kYXRhc2V0LmRhdGFzZXRdO1xuXHRcdGxldCBkYXRhc2V0S2V5ID0gZ2V0S2V5RnJvbVZhbHVlKGRhdGFzZXRzLCBuZXdEYXRhc2V0KTtcblxuXHRcdGlmIChuZXdEYXRhc2V0ID09PSBzdGF0ZS5kYXRhc2V0ICYmIGRhdGFzZXRLZXkgIT0gXCJieW9kXCIpIHtcblx0XHRcdHJldHVybjsgLy8gTm8tb3AuXG5cdFx0fVxuXG5cdFx0c3RhdGUuZGF0YXNldCA9IG5ld0RhdGFzZXQ7XG5cblxuXHRcdGlmIChkYXRhc2V0S2V5ID09PSBcImJ5b2RcIikge1xuXG5cdFx0XHRzdGF0ZS5ieW9kID0gdHJ1ZTtcblx0XHRcdGQzLnNlbGVjdChcIiNpbnB1dEZvcm1CWU9EXCIpLmh0bWwoXCI8aW5wdXQgdHlwZT0nZmlsZScgYWNjZXB0PScuY3N2JyBpZD0naW5wdXRGaWxlQllPRCc+XCIpO1xuXHRcdFx0ZGF0YVRodW1ibmFpbHMuY2xhc3NlZChcInNlbGVjdGVkXCIsIGZhbHNlKTtcblx0XHRcdGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cdFx0XHQkKFwiI2lucHV0RmlsZUJZT0RcIikuY2xpY2soKTtcblxuXHRcdFx0Ly8gZDMuc2VsZWN0KFwiI25vaXNlXCIpLnZhbHVlKHN0YXRlLm5vaXNlKTtcblx0XHRcdC8vIH4gJChcIiNub2lzZVwiKS5zbGlkZXIoXCJkaXNhYmxlXCIpO1xuXG5cdFx0XHRsZXQgaW5wdXRCWU9EID0gZDMuc2VsZWN0KFwiI2lucHV0RmlsZUJZT0RcIik7XG5cdFx0XHRpbnB1dEJZT0Qub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0XHRsZXQgbmFtZSA9IHRoaXMuZmlsZXNbMF0ubmFtZTtcblx0XHRcdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRcdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdFx0XHRcdFx0bGV0IHRhcmdldDogYW55ID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0XHRcdGxldCBkYXRhID0gdGFyZ2V0LnJlc3VsdDtcblx0XHRcdFx0XHRsZXQgcyA9IGRhdGEuc3BsaXQoXCJcXG5cIik7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRsZXQgc3MgPSBzW2ldLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHRcdGlmIChzcy5sZW5ndGggIT0gMykgYnJlYWs7XG5cdFx0XHRcdFx0XHRsZXQgeCA9IHNzWzBdO1xuXHRcdFx0XHRcdFx0bGV0IHkgPSBzc1sxXTtcblx0XHRcdFx0XHRcdGxldCBsYWJlbCA9IHNzWzJdO1xuXHRcdFx0XHRcdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdFx0XHRcdFx0XHQvLyB+IGNvbnNvbGUubG9nKHBvaW50c1tpXS54K1wiLFwiK3BvaW50c1tpXS55K1wiLFwiK3BvaW50c1tpXS5sYWJlbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNodWZmbGUocG9pbnRzKTtcblx0XHRcdFx0XHQvLyBTcGxpdCBpbnRvIHRyYWluIGFuZCB0ZXN0IGRhdGEuXG5cdFx0XHRcdFx0bGV0IHNwbGl0SW5kZXggPSBNYXRoLmZsb29yKHBvaW50cy5sZW5ndGggKiBzdGF0ZS5wZXJjVHJhaW5EYXRhIC8gMTAwKTtcblx0XHRcdFx0XHR0cmFpbkRhdGEgPSBwb2ludHMuc2xpY2UoMCwgc3BsaXRJbmRleCk7XG5cdFx0XHRcdFx0dGVzdERhdGEgPSBwb2ludHMuc2xpY2Uoc3BsaXRJbmRleCk7XG5cblx0XHRcdFx0XHRoZWF0TWFwLnVwZGF0ZVBvaW50cyh0cmFpbkRhdGEpO1xuXHRcdFx0XHRcdGhlYXRNYXAudXBkYXRlVGVzdFBvaW50cyhzdGF0ZS5zaG93VGVzdERhdGEgPyB0ZXN0RGF0YSA6IFtdKTtcblxuXG5cdFx0XHRcdFx0Ly8gfiBzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHBvaW50cylbMF07XG5cdFx0XHRcdFx0Ly8gfiBzdGF0ZS5tYXhDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHBvaW50cylbMV07XG5cdFx0XHRcdFx0c3RhdGUuc3VnQ2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzBdO1xuXHRcdFx0XHRcdHN0YXRlLm1heENhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkodHJhaW5EYXRhKVsxXTtcblx0XHRcdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRcdFx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdFx0XHRcdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRcdFx0XHRcdC8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdFx0XHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRyZXNldCgpO1xuXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVhZGVyLnJlYWRBc1RleHQodGhpcy5maWxlc1swXSk7XG5cdFx0XHR9KTtcblxuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0YXRlLmJ5b2QgPSBmYWxzZTtcblx0XHRcdC8vIH4gZDMuc2VsZWN0KFwiI2lucHV0Rm9ybUJZT0RcIikuaHRtbChcIlwiKTtcblx0XHRcdC8vICQoXCIjbm9pc2VcIikuZGlzYWJsZWQgPSBmYWxzZTtcblxuXHRcdFx0ZGF0YVRodW1ibmFpbHMuY2xhc3NlZChcInNlbGVjdGVkXCIsIGZhbHNlKTtcblx0XHRcdGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cdFx0XHRzdGF0ZS5ub2lzZSA9IDM1OyAvLyBTTlJkQlxuXG5cblx0XHRcdGdlbmVyYXRlRGF0YSgpO1xuXG5cdFx0XHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmFpbkRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0cG9pbnRzLnB1c2godHJhaW5EYXRhW2ldKTtcblx0XHRcdH1cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGVzdERhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0cG9pbnRzLnB1c2godGVzdERhdGFbaV0pO1xuXHRcdFx0fVxuXHRcdFx0Ly8gfiBzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHBvaW50cylbMF07XG5cdFx0XHQvLyB+IHN0YXRlLm1heENhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkocG9pbnRzKVsxXTtcblx0XHRcdHN0YXRlLnN1Z0NhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkodHJhaW5EYXRhKVswXTtcblx0XHRcdHN0YXRlLm1heENhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkodHJhaW5EYXRhKVsxXTtcblx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbWF4Q2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5tYXhDYXBhY2l0eSk7XG5cdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRcdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXG5cdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRyZXNldCgpO1xuXHRcdH1cblxuXHR9KTtcblxuXHRsZXQgZGF0YXNldEtleSA9IGdldEtleUZyb21WYWx1ZShkYXRhc2V0cywgc3RhdGUuZGF0YXNldCk7XG5cdC8vIFNlbGVjdCB0aGUgZGF0YXNldCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG5cdGQzLnNlbGVjdChgY2FudmFzW2RhdGEtZGF0YXNldD0ke2RhdGFzZXRLZXl9XWApXG5cdFx0LmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcblxuXHRsZXQgcmVnRGF0YVRodW1ibmFpbHMgPSBkMy5zZWxlY3RBbGwoXCJjYW52YXNbZGF0YS1yZWdEYXRhc2V0XVwiKTtcblx0cmVnRGF0YVRodW1ibmFpbHMub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IG5ld0RhdGFzZXQgPSByZWdEYXRhc2V0c1t0aGlzLmRhdGFzZXQucmVnZGF0YXNldF07XG5cdFx0aWYgKG5ld0RhdGFzZXQgPT09IHN0YXRlLnJlZ0RhdGFzZXQpIHtcblx0XHRcdHJldHVybjsgLy8gTm8tb3AuXG5cdFx0fVxuXHRcdHN0YXRlLnJlZ0RhdGFzZXQgPSBuZXdEYXRhc2V0O1xuXHRcdHN0YXRlLnN1Z0NhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkodHJhaW5EYXRhKVswXTtcblx0XHRzdGF0ZS5tYXhDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMV07XG5cdFx0cmVnRGF0YVRodW1ibmFpbHMuY2xhc3NlZChcInNlbGVjdGVkXCIsIGZhbHNlKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xuXHRcdGdlbmVyYXRlRGF0YSgpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRsZXQgcmVnRGF0YXNldEtleSA9IGdldEtleUZyb21WYWx1ZShyZWdEYXRhc2V0cywgc3RhdGUucmVnRGF0YXNldCk7XG5cdC8vIFNlbGVjdCB0aGUgZGF0YXNldCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG5cdGQzLnNlbGVjdChgY2FudmFzW2RhdGEtcmVnRGF0YXNldD0ke3JlZ0RhdGFzZXRLZXl9XWApXG5cdFx0LmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcblxuXG5cdGQzLnNlbGVjdChcIiNhZGQtbGF5ZXJzXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlmIChzdGF0ZS5udW1IaWRkZW5MYXllcnMgPj0gTUFYX0hMQVlFUlMpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0c3RhdGUubmV0d29ya1NoYXBlW3N0YXRlLm51bUhpZGRlbkxheWVyc10gPSAyO1xuXHRcdHN0YXRlLm51bUhpZGRlbkxheWVycysrO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRkMy5zZWxlY3QoXCIjcmVtb3ZlLWxheWVyc1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAoc3RhdGUubnVtSGlkZGVuTGF5ZXJzIDw9IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0c3RhdGUubnVtSGlkZGVuTGF5ZXJzLS07XG5cdFx0c3RhdGUubmV0d29ya1NoYXBlLnNwbGljZShzdGF0ZS5udW1IaWRkZW5MYXllcnMpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRsZXQgc2hvd1Rlc3REYXRhID0gZDMuc2VsZWN0KFwiI3Nob3ctdGVzdC1kYXRhXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5zaG93VGVzdERhdGEgPSB0aGlzLmNoZWNrZWQ7XG5cdFx0c3RhdGUuc2VyaWFsaXplKCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRoZWF0TWFwLnVwZGF0ZVRlc3RQb2ludHMoc3RhdGUuc2hvd1Rlc3REYXRhID8gdGVzdERhdGEgOiBbXSk7XG5cdH0pO1xuXG5cdC8vIENoZWNrL3VuY2hlY2sgdGhlIGNoZWNrYm94IGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS5cblx0c2hvd1Rlc3REYXRhLnByb3BlcnR5KFwiY2hlY2tlZFwiLCBzdGF0ZS5zaG93VGVzdERhdGEpO1xuXG5cdGxldCBkaXNjcmV0aXplID0gZDMuc2VsZWN0KFwiI2Rpc2NyZXRpemVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLmRpc2NyZXRpemUgPSB0aGlzLmNoZWNrZWQ7XG5cdFx0c3RhdGUuc2VyaWFsaXplKCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHR1cGRhdGVVSSgpO1xuXHR9KTtcblx0Ly8gQ2hlY2svdW5jaGVjayB0aGUgY2hlY2JveCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG5cdGRpc2NyZXRpemUucHJvcGVydHkoXCJjaGVja2VkXCIsIHN0YXRlLmRpc2NyZXRpemUpO1xuXG5cdGxldCBwZXJjVHJhaW4gPSBkMy5zZWxlY3QoXCIjcGVyY1RyYWluRGF0YVwiKS5vbihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5wZXJjVHJhaW5EYXRhID0gdGhpcy52YWx1ZTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3BlcmNUcmFpbkRhdGEnXSAudmFsdWVcIikudGV4dCh0aGlzLnZhbHVlKTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblx0cGVyY1RyYWluLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUucGVyY1RyYWluRGF0YSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0ncGVyY1RyYWluRGF0YSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnBlcmNUcmFpbkRhdGEpO1xuXG5cdGZ1bmN0aW9uIGh1bWFuUmVhZGFibGVJbnQobjogbnVtYmVyKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gbi50b0ZpeGVkKDApO1xuXHR9XG5cblx0bGV0IG5vaXNlID0gZDMuc2VsZWN0KFwiI25vaXNlXCIpLm9uKFwiaW5wdXRcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLm5vaXNlID0gdGhpcy52YWx1ZTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3RydWUtbm9pc2VTTlInXSAudmFsdWVcIikudGV4dCh0aGlzLnZhbHVlKTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRub2lzZS5wcm9wZXJ0eShcInZhbHVlXCIsIHN0YXRlLm5vaXNlKTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSd0cnVlLW5vaXNlU05SJ10gLnZhbHVlXCIpLnRleHQoc3RhdGUubm9pc2UpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cblx0bGV0IGJhdGNoU2l6ZSA9IGQzLnNlbGVjdChcIiNiYXRjaFNpemVcIikub24oXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0c3RhdGUuYmF0Y2hTaXplID0gdGhpcy52YWx1ZTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHRoaXMudmFsdWUpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbWF4Q2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5tYXhDYXBhY2l0eSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHRcdHJlc2V0KCk7XG5cdH0pO1xuXHRiYXRjaFNpemUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5iYXRjaFNpemUpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLmJhdGNoU2l6ZSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbWF4Q2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5tYXhDYXBhY2l0eSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblxuXG5cdGxldCBhY3RpdmF0aW9uRHJvcGRvd24gPSBkMy5zZWxlY3QoXCIjYWN0aXZhdGlvbnNcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLmFjdGl2YXRpb24gPSBhY3RpdmF0aW9uc1t0aGlzLnZhbHVlXTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cdGFjdGl2YXRpb25Ecm9wZG93bi5wcm9wZXJ0eShcInZhbHVlXCIsIGdldEtleUZyb21WYWx1ZShhY3RpdmF0aW9ucywgc3RhdGUuYWN0aXZhdGlvbikpO1xuXG5cdGxldCBsZWFybmluZ1JhdGUgPSBkMy5zZWxlY3QoXCIjbGVhcm5pbmdSYXRlXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5sZWFybmluZ1JhdGUgPSB0aGlzLnZhbHVlO1xuXHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHR9KTtcblxuXHRsZWFybmluZ1JhdGUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5sZWFybmluZ1JhdGUpO1xuXG5cdGxldCByZWd1bGFyRHJvcGRvd24gPSBkMy5zZWxlY3QoXCIjcmVndWxhcml6YXRpb25zXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5yZWd1bGFyaXphdGlvbiA9IHJlZ3VsYXJpemF0aW9uc1t0aGlzLnZhbHVlXTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0cmVndWxhckRyb3Bkb3duLnByb3BlcnR5KFwidmFsdWVcIiwgZ2V0S2V5RnJvbVZhbHVlKHJlZ3VsYXJpemF0aW9ucywgc3RhdGUucmVndWxhcml6YXRpb24pKTtcblxuXHRsZXQgcmVndWxhclJhdGUgPSBkMy5zZWxlY3QoXCIjcmVndWxhclJhdGVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLnJlZ3VsYXJpemF0aW9uUmF0ZSA9ICt0aGlzLnZhbHVlO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblx0cmVndWxhclJhdGUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5yZWd1bGFyaXphdGlvblJhdGUpO1xuXG5cdGxldCBwcm9ibGVtID0gZDMuc2VsZWN0KFwiI3Byb2JsZW1cIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLnByb2JsZW0gPSBwcm9ibGVtc1t0aGlzLnZhbHVlXTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblx0XHRkcmF3RGF0YXNldFRodW1ibmFpbHMoKTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cdHByb2JsZW0ucHJvcGVydHkoXCJ2YWx1ZVwiLCBnZXRLZXlGcm9tVmFsdWUocHJvYmxlbXMsIHN0YXRlLnByb2JsZW0pKTtcblxuXHQvLyBBZGQgc2NhbGUgdG8gdGhlIGdyYWRpZW50IGNvbG9yIG1hcC5cblx0bGV0IHggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWy0xLCAxXSkucmFuZ2UoWzAsIDE0NF0pO1xuXHRsZXQgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG5cdFx0LnNjYWxlKHgpXG5cdFx0Lm9yaWVudChcImJvdHRvbVwiKVxuXHRcdC50aWNrVmFsdWVzKFstMSwgMCwgMV0pXG5cdFx0LnRpY2tGb3JtYXQoZDMuZm9ybWF0KFwiZFwiKSk7XG5cdGQzLnNlbGVjdChcIiNjb2xvcm1hcCBnLmNvcmVcIikuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ4IGF4aXNcIilcblx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDEwKVwiKVxuXHRcdC5jYWxsKHhBeGlzKTtcblxuXHQvLyBMaXN0ZW4gZm9yIGNzcy1yZXNwb25zaXZlIGNoYW5nZXMgYW5kIHJlZHJhdyB0aGUgc3ZnIG5ldHdvcmsuXG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xuXHRcdGxldCBuZXdXaWR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbi1wYXJ0XCIpXG5cdFx0XHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cdFx0aWYgKG5ld1dpZHRoICE9PSBtYWluV2lkdGgpIHtcblx0XHRcdG1haW5XaWR0aCA9IG5ld1dpZHRoO1xuXHRcdFx0ZHJhd05ldHdvcmsobmV0d29yayk7XG5cdFx0XHR1cGRhdGVVSSh0cnVlKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIEhpZGUgdGhlIHRleHQgYmVsb3cgdGhlIHZpc3VhbGl6YXRpb24gZGVwZW5kaW5nIG9uIHRoZSBVUkwuXG5cdGlmIChzdGF0ZS5oaWRlVGV4dCkge1xuXHRcdGQzLnNlbGVjdChcIiNhcnRpY2xlLXRleHRcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0XHRkMy5zZWxlY3QoXCJkaXYubW9yZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdGQzLnNlbGVjdChcImhlYWRlclwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJpYXNlc1VJKG5ldHdvcms6IG5uLk5vZGVbXVtdKSB7XG5cdG5uLmZvckVhY2hOb2RlKG5ldHdvcmssIHRydWUsIG5vZGUgPT4ge1xuXHRcdGQzLnNlbGVjdChgcmVjdCNiaWFzLSR7bm9kZS5pZH1gKS5zdHlsZShcImZpbGxcIiwgY29sb3JTY2FsZShub2RlLmJpYXMpKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVdlaWdodHNVSShuZXR3b3JrOiBubi5Ob2RlW11bXSwgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55Pikge1xuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Ly8gVXBkYXRlIGFsbCB0aGUgbm9kZXMgaW4gdGhpcyBsYXllci5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcblx0XHRcdFx0Y29udGFpbmVyLnNlbGVjdChgI2xpbmske2xpbmsuc291cmNlLmlkfS0ke2xpbmsuZGVzdC5pZH1gKVxuXHRcdFx0XHRcdC5zdHlsZShcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XCJzdHJva2UtZGFzaG9mZnNldFwiOiAtaXRlciAvIDMsXG5cdFx0XHRcdFx0XHRcdFwic3Ryb2tlLXdpZHRoXCI6IGxpbmtXaWR0aFNjYWxlKE1hdGguYWJzKGxpbmsud2VpZ2h0KSksXG5cdFx0XHRcdFx0XHRcdFwic3Ryb2tlXCI6IGNvbG9yU2NhbGUobGluay53ZWlnaHQpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5kYXR1bShsaW5rKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gZHJhd05vZGUoY3g6IG51bWJlciwgY3k6IG51bWJlciwgbm9kZUlkOiBzdHJpbmcsIGlzSW5wdXQ6IGJvb2xlYW4sIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sIG5vZGU/OiBubi5Ob2RlKSB7XG5cdGxldCB4ID0gY3ggLSBSRUNUX1NJWkUgLyAyO1xuXHRsZXQgeSA9IGN5IC0gUkVDVF9TSVpFIC8gMjtcblxuXHRsZXQgbm9kZUdyb3VwID0gY29udGFpbmVyLmFwcGVuZChcImdcIikuYXR0cihcblx0XHR7XG5cdFx0XHRcImNsYXNzXCI6IFwibm9kZVwiLFxuXHRcdFx0XCJpZFwiOiBgbm9kZSR7bm9kZUlkfWAsXG5cdFx0XHRcInRyYW5zZm9ybVwiOiBgdHJhbnNsYXRlKCR7eH0sJHt5fSlgXG5cdFx0fSk7XG5cblx0Ly8gRHJhdyB0aGUgbWFpbiByZWN0YW5nbGUuXG5cdG5vZGVHcm91cC5hcHBlbmQoXCJyZWN0XCIpLmF0dHIoXG5cdFx0e1xuXHRcdFx0eDogMCxcblx0XHRcdHk6IDAsXG5cdFx0XHR3aWR0aDogUkVDVF9TSVpFLFxuXHRcdFx0aGVpZ2h0OiBSRUNUX1NJWkUsXG5cdFx0fSk7XG5cblx0bGV0IGFjdGl2ZU9yTm90Q2xhc3MgPSBzdGF0ZVtub2RlSWRdID8gXCJhY3RpdmVcIiA6IFwiaW5hY3RpdmVcIjtcblx0aWYgKGlzSW5wdXQpIHtcblx0XHRsZXQgbGFiZWwgPSBJTlBVVFNbbm9kZUlkXS5sYWJlbCAhPSBudWxsID8gSU5QVVRTW25vZGVJZF0ubGFiZWwgOiBub2RlSWQ7XG5cdFx0Ly8gRHJhdyB0aGUgaW5wdXQgbGFiZWwuXG5cdFx0bGV0IHRleHQgPSBub2RlR3JvdXAuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFxuXHRcdFx0e1xuXHRcdFx0XHRjbGFzczogXCJtYWluLWxhYmVsXCIsXG5cdFx0XHRcdHg6IC0xMCxcblx0XHRcdFx0eTogUkVDVF9TSVpFIC8gMiwgXCJ0ZXh0LWFuY2hvclwiOiBcImVuZFwiXG5cdFx0XHR9KTtcblx0XHRpZiAoL1tfXl0vLnRlc3QobGFiZWwpKSB7XG5cdFx0XHRsZXQgbXlSZSA9IC8oLio/KShbX15dKSguKS9nO1xuXHRcdFx0bGV0IG15QXJyYXk7XG5cdFx0XHRsZXQgbGFzdEluZGV4O1xuXHRcdFx0d2hpbGUgKChteUFycmF5ID0gbXlSZS5leGVjKGxhYmVsKSkgIT0gbnVsbCkge1xuXHRcdFx0XHRsYXN0SW5kZXggPSBteVJlLmxhc3RJbmRleDtcblx0XHRcdFx0bGV0IHByZWZpeCA9IG15QXJyYXlbMV07XG5cdFx0XHRcdGxldCBzZXAgPSBteUFycmF5WzJdO1xuXHRcdFx0XHRsZXQgc3VmZml4ID0gbXlBcnJheVszXTtcblx0XHRcdFx0aWYgKHByZWZpeCkge1xuXHRcdFx0XHRcdHRleHQuYXBwZW5kKFwidHNwYW5cIikudGV4dChwcmVmaXgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRleHQuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcImJhc2VsaW5lLXNoaWZ0XCIsIHNlcCA9PT0gXCJfXCIgPyBcInN1YlwiIDogXCJzdXBlclwiKVxuXHRcdFx0XHRcdC5zdHlsZShcImZvbnQtc2l6ZVwiLCBcIjlweFwiKVxuXHRcdFx0XHRcdC50ZXh0KHN1ZmZpeCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAobGFiZWwuc3Vic3RyaW5nKGxhc3RJbmRleCkpIHtcblx0XHRcdFx0dGV4dC5hcHBlbmQoXCJ0c3BhblwiKS50ZXh0KGxhYmVsLnN1YnN0cmluZyhsYXN0SW5kZXgpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGV4dC5hcHBlbmQoXCJ0c3BhblwiKS50ZXh0KGxhYmVsKTtcblx0XHR9XG5cdFx0bm9kZUdyb3VwLmNsYXNzZWQoYWN0aXZlT3JOb3RDbGFzcywgdHJ1ZSk7XG5cdH1cblx0aWYgKCFpc0lucHV0KSB7XG5cdFx0Ly8gRHJhdyB0aGUgbm9kZSdzIGJpYXMuXG5cdFx0bm9kZUdyb3VwLmFwcGVuZChcInJlY3RcIikuYXR0cihcblx0XHRcdHtcblx0XHRcdFx0aWQ6IGBiaWFzLSR7bm9kZUlkfWAsXG5cdFx0XHRcdHg6IC1CSUFTX1NJWkUgLSAyLFxuXHRcdFx0XHR5OiBSRUNUX1NJWkUgLSBCSUFTX1NJWkUgKyAzLFxuXHRcdFx0XHR3aWR0aDogQklBU19TSVpFLFxuXHRcdFx0XHRoZWlnaHQ6IEJJQVNfU0laRSxcblx0XHRcdH0pXG5cdFx0XHQub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dXBkYXRlSG92ZXJDYXJkKEhvdmVyVHlwZS5CSUFTLCBub2RlLCBkMy5tb3VzZShjb250YWluZXIubm9kZSgpKSk7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHVwZGF0ZUhvdmVyQ2FyZChudWxsKTtcblx0XHRcdH0pO1xuXHR9XG5cblx0Ly8gRHJhdyB0aGUgbm9kZSdzIGNhbnZhcy5cblx0bGV0IGRpdiA9IGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLmluc2VydChcImRpdlwiLCBcIjpmaXJzdC1jaGlsZFwiKS5hdHRyKFxuXHRcdHtcblx0XHRcdFwiaWRcIjogYGNhbnZhcy0ke25vZGVJZH1gLFxuXHRcdFx0XCJjbGFzc1wiOiBcImNhbnZhc1wiXG5cdFx0fSlcblx0XHQuc3R5bGUoXG5cdFx0XHR7XG5cdFx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdGxlZnQ6IGAke3ggKyAzfXB4YCxcblx0XHRcdFx0dG9wOiBgJHt5ICsgM31weGBcblx0XHRcdH0pXG5cdFx0Lm9uKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzZWxlY3RlZE5vZGVJZCA9IG5vZGVJZDtcblx0XHRcdGRpdi5jbGFzc2VkKFwiaG92ZXJlZFwiLCB0cnVlKTtcblx0XHRcdG5vZGVHcm91cC5jbGFzc2VkKFwiaG92ZXJlZFwiLCB0cnVlKTtcblx0XHRcdHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmFsc2UpO1xuXHRcdFx0aGVhdE1hcC51cGRhdGVCYWNrZ3JvdW5kKGJvdW5kYXJ5W25vZGVJZF0sIHN0YXRlLmRpc2NyZXRpemUpO1xuXHRcdH0pXG5cdFx0Lm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzZWxlY3RlZE5vZGVJZCA9IG51bGw7XG5cdFx0XHRkaXYuY2xhc3NlZChcImhvdmVyZWRcIiwgZmFsc2UpO1xuXHRcdFx0bm9kZUdyb3VwLmNsYXNzZWQoXCJob3ZlcmVkXCIsIGZhbHNlKTtcblx0XHRcdHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmFsc2UpO1xuXHRcdFx0aGVhdE1hcC51cGRhdGVCYWNrZ3JvdW5kKGJvdW5kYXJ5W25uLmdldE91dHB1dE5vZGUobmV0d29yaykuaWRdLCBzdGF0ZS5kaXNjcmV0aXplKTtcblx0XHR9KTtcblx0aWYgKGlzSW5wdXQpIHtcblx0XHRkaXYub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzdGF0ZVtub2RlSWRdID0gIXN0YXRlW25vZGVJZF07XG5cdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRyZXNldCgpO1xuXHRcdH0pO1xuXHRcdGRpdi5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIik7XG5cdH1cblx0aWYgKGlzSW5wdXQpIHtcblx0XHRkaXYuY2xhc3NlZChhY3RpdmVPck5vdENsYXNzLCB0cnVlKTtcblx0fVxuXHRsZXQgbm9kZUhlYXRNYXAgPSBuZXcgSGVhdE1hcChSRUNUX1NJWkUsIERFTlNJVFkgLyAxMCwgeERvbWFpbiwgeERvbWFpbiwgZGl2LCB7bm9Tdmc6IHRydWV9KTtcblx0ZGl2LmRhdHVtKHtoZWF0bWFwOiBub2RlSGVhdE1hcCwgaWQ6IG5vZGVJZH0pO1xufVxuXG4vLyBEcmF3IG5ldHdvcmtcbmZ1bmN0aW9uIGRyYXdOZXR3b3JrKG5ldHdvcms6IG5uLk5vZGVbXVtdKTogdm9pZCB7XG5cdGxldCBzdmcgPSBkMy5zZWxlY3QoXCIjc3ZnXCIpO1xuXHQvLyBSZW1vdmUgYWxsIHN2ZyBlbGVtZW50cy5cblx0c3ZnLnNlbGVjdChcImcuY29yZVwiKS5yZW1vdmUoKTtcblx0Ly8gUmVtb3ZlIGFsbCBkaXYgZWxlbWVudHMuXG5cdGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLnNlbGVjdEFsbChcImRpdi5jYW52YXNcIikucmVtb3ZlKCk7XG5cdGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLnNlbGVjdEFsbChcImRpdi5wbHVzLW1pbnVzLW5ldXJvbnNcIikucmVtb3ZlKCk7XG5cblx0Ly8gR2V0IHRoZSB3aWR0aCBvZiB0aGUgc3ZnIGNvbnRhaW5lci5cblx0bGV0IHBhZGRpbmcgPSAzO1xuXHRsZXQgY28gPSBkMy5zZWxlY3QoXCIuY29sdW1uLm91dHB1dFwiKS5ub2RlKCkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cdGxldCBjZiA9IGQzLnNlbGVjdChcIi5jb2x1bW4uZmVhdHVyZXNcIikubm9kZSgpIGFzIEhUTUxEaXZFbGVtZW50O1xuXHRsZXQgd2lkdGggPSBjby5vZmZzZXRMZWZ0IC0gY2Yub2Zmc2V0TGVmdDtcblx0c3ZnLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XG5cblx0Ly8gTWFwIG9mIGFsbCBub2RlIGNvb3JkaW5hdGVzLlxuXHRsZXQgbm9kZTJjb29yZDogeyBbaWQ6IHN0cmluZ106IHsgY3g6IG51bWJlciwgY3k6IG51bWJlciB9IH0gPSB7fTtcblx0bGV0IGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0LmNsYXNzZWQoXCJjb3JlXCIsIHRydWUpXG5cdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3BhZGRpbmd9LCR7cGFkZGluZ30pYCk7XG5cdC8vIERyYXcgdGhlIG5ldHdvcmsgbGF5ZXIgYnkgbGF5ZXIuXG5cdGxldCBudW1MYXllcnMgPSBuZXR3b3JrLmxlbmd0aDtcblx0bGV0IGZlYXR1cmVXaWR0aCA9IDExODtcblx0bGV0IGxheWVyU2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsPG51bWJlciwgbnVtYmVyPigpXG5cdFx0LmRvbWFpbihkMy5yYW5nZSgxLCBudW1MYXllcnMgLSAxKSlcblx0XHQucmFuZ2VQb2ludHMoW2ZlYXR1cmVXaWR0aCwgd2lkdGggLSBSRUNUX1NJWkVdLCAwLjcpO1xuXHRsZXQgbm9kZUluZGV4U2NhbGUgPSAobm9kZUluZGV4OiBudW1iZXIpID0+IG5vZGVJbmRleCAqIChSRUNUX1NJWkUgKyAyNSk7XG5cblxuXHRsZXQgY2FsbG91dFRodW1iID0gZDMuc2VsZWN0KFwiLmNhbGxvdXQudGh1bWJuYWlsXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdGxldCBjYWxsb3V0V2VpZ2h0cyA9IGQzLnNlbGVjdChcIi5jYWxsb3V0LndlaWdodHNcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0bGV0IGlkV2l0aENhbGxvdXQgPSBudWxsO1xuXHRsZXQgdGFyZ2V0SWRXaXRoQ2FsbG91dCA9IG51bGw7XG5cblx0Ly8gRHJhdyB0aGUgaW5wdXQgbGF5ZXIgc2VwYXJhdGVseS5cblx0bGV0IGN4ID0gUkVDVF9TSVpFIC8gMiArIDUwO1xuXHRsZXQgbm9kZUlkcyA9IE9iamVjdC5rZXlzKElOUFVUUyk7XG5cdGxldCBtYXhZID0gbm9kZUluZGV4U2NhbGUobm9kZUlkcy5sZW5ndGgpO1xuXHRub2RlSWRzLmZvckVhY2goKG5vZGVJZCwgaSkgPT4ge1xuXHRcdGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKGkpICsgUkVDVF9TSVpFIC8gMjtcblx0XHRub2RlMmNvb3JkW25vZGVJZF0gPSB7Y3gsIGN5fTtcblx0XHRkcmF3Tm9kZShjeCwgY3ksIG5vZGVJZCwgdHJ1ZSwgY29udGFpbmVyKTtcblx0fSk7XG5cblx0Ly8gRHJhdyB0aGUgaW50ZXJtZWRpYXRlIGxheWVycy5cblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG51bUxheWVycyAtIDE7IGxheWVySWR4KyspIHtcblx0XHRsZXQgbnVtTm9kZXMgPSBuZXR3b3JrW2xheWVySWR4XS5sZW5ndGg7XG5cdFx0bGV0IGN4ID0gbGF5ZXJTY2FsZShsYXllcklkeCkgKyBSRUNUX1NJWkUgLyAyO1xuXHRcdG1heFkgPSBNYXRoLm1heChtYXhZLCBub2RlSW5kZXhTY2FsZShudW1Ob2RlcykpO1xuXHRcdGFkZFBsdXNNaW51c0NvbnRyb2wobGF5ZXJTY2FsZShsYXllcklkeCksIGxheWVySWR4KTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG51bU5vZGVzOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gbmV0d29ya1tsYXllcklkeF1baV07XG5cdFx0XHRsZXQgY3kgPSBub2RlSW5kZXhTY2FsZShpKSArIFJFQ1RfU0laRSAvIDI7XG5cdFx0XHRub2RlMmNvb3JkW25vZGUuaWRdID0ge2N4LCBjeX07XG5cdFx0XHRkcmF3Tm9kZShjeCwgY3ksIG5vZGUuaWQsIGZhbHNlLCBjb250YWluZXIsIG5vZGUpO1xuXG5cdFx0XHQvLyBTaG93IGNhbGxvdXQgdG8gdGh1bWJuYWlscy5cblx0XHRcdGxldCBudW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHhdLmxlbmd0aDtcblx0XHRcdGxldCBuZXh0TnVtTm9kZXMgPSBuZXR3b3JrW2xheWVySWR4ICsgMV0ubGVuZ3RoO1xuXHRcdFx0aWYgKGlkV2l0aENhbGxvdXQgPT0gbnVsbCAmJlxuXHRcdFx0XHRpID09PSBudW1Ob2RlcyAtIDEgJiZcblx0XHRcdFx0bmV4dE51bU5vZGVzIDw9IG51bU5vZGVzKSB7XG5cdFx0XHRcdGNhbGxvdXRUaHVtYi5zdHlsZShcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBudWxsLFxuXHRcdFx0XHRcdFx0dG9wOiBgJHsyMCArIDMgKyBjeX1weGAsXG5cdFx0XHRcdFx0XHRsZWZ0OiBgJHtjeH1weGBcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0aWRXaXRoQ2FsbG91dCA9IG5vZGUuaWQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIERyYXcgbGlua3MuXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcblx0XHRcdFx0bGV0IHBhdGg6IFNWR1BhdGhFbGVtZW50ID0gZHJhd0xpbmsobGluaywgbm9kZTJjb29yZCwgbmV0d29yayxcblx0XHRcdFx0XHRjb250YWluZXIsIGogPT09IDAsIGosIG5vZGUuaW5wdXRMaW5rcy5sZW5ndGgpLm5vZGUoKSBhcyBhbnk7XG5cdFx0XHRcdC8vIFNob3cgY2FsbG91dCB0byB3ZWlnaHRzLlxuXHRcdFx0XHRsZXQgcHJldkxheWVyID0gbmV0d29ya1tsYXllcklkeCAtIDFdO1xuXHRcdFx0XHRsZXQgbGFzdE5vZGVQcmV2TGF5ZXIgPSBwcmV2TGF5ZXJbcHJldkxheWVyLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRpZiAodGFyZ2V0SWRXaXRoQ2FsbG91dCA9PSBudWxsICYmXG5cdFx0XHRcdFx0aSA9PT0gbnVtTm9kZXMgLSAxICYmXG5cdFx0XHRcdFx0bGluay5zb3VyY2UuaWQgPT09IGxhc3ROb2RlUHJldkxheWVyLmlkICYmXG5cdFx0XHRcdFx0KGxpbmsuc291cmNlLmlkICE9PSBpZFdpdGhDYWxsb3V0IHx8IG51bUxheWVycyA8PSA1KSAmJlxuXHRcdFx0XHRcdGxpbmsuZGVzdC5pZCAhPT0gaWRXaXRoQ2FsbG91dCAmJlxuXHRcdFx0XHRcdHByZXZMYXllci5sZW5ndGggPj0gbnVtTm9kZXMpIHtcblx0XHRcdFx0XHRsZXQgbWlkUG9pbnQgPSBwYXRoLmdldFBvaW50QXRMZW5ndGgocGF0aC5nZXRUb3RhbExlbmd0aCgpICogMC43KTtcblx0XHRcdFx0XHRjYWxsb3V0V2VpZ2h0cy5zdHlsZShcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogbnVsbCxcblx0XHRcdFx0XHRcdFx0dG9wOiBgJHttaWRQb2ludC55ICsgNX1weGAsXG5cdFx0XHRcdFx0XHRcdGxlZnQ6IGAke21pZFBvaW50LnggKyAzfXB4YFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGFyZ2V0SWRXaXRoQ2FsbG91dCA9IGxpbmsuZGVzdC5pZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIERyYXcgdGhlIG91dHB1dCBub2RlIHNlcGFyYXRlbHkuXG5cdGN4ID0gd2lkdGggKyBSRUNUX1NJWkUgLyAyO1xuXHRsZXQgbm9kZSA9IG5ldHdvcmtbbnVtTGF5ZXJzIC0gMV1bMF07XG5cdGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKDApICsgUkVDVF9TSVpFIC8gMjtcblx0bm9kZTJjb29yZFtub2RlLmlkXSA9IHtjeCwgY3l9O1xuXHQvLyBEcmF3IGxpbmtzLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2ldO1xuXHRcdGRyYXdMaW5rKGxpbmssIG5vZGUyY29vcmQsIG5ldHdvcmssIGNvbnRhaW5lciwgaSA9PT0gMCwgaSxcblx0XHRcdG5vZGUuaW5wdXRMaW5rcy5sZW5ndGgpO1xuXHR9XG5cdC8vIEFkanVzdCB0aGUgaGVpZ2h0IG9mIHRoZSBzdmcuXG5cdHN2Zy5hdHRyKFwiaGVpZ2h0XCIsIG1heFkpO1xuXG5cdC8vIEFkanVzdCB0aGUgaGVpZ2h0IG9mIHRoZSBmZWF0dXJlcyBjb2x1bW4uXG5cdGxldCBoZWlnaHQgPSBNYXRoLm1heChcblx0XHRnZXRSZWxhdGl2ZUhlaWdodChjYWxsb3V0VGh1bWIpLFxuXHRcdGdldFJlbGF0aXZlSGVpZ2h0KGNhbGxvdXRXZWlnaHRzKSxcblx0XHRnZXRSZWxhdGl2ZUhlaWdodChkMy5zZWxlY3QoXCIjbmV0d29ya1wiKSlcblx0KTtcblx0ZDMuc2VsZWN0KFwiLmNvbHVtbi5mZWF0dXJlc1wiKS5zdHlsZShcImhlaWdodFwiLCBoZWlnaHQgKyBcInB4XCIpO1xufVxuXG5mdW5jdGlvbiBnZXRSZWxhdGl2ZUhlaWdodChzZWxlY3Rpb246IGQzLlNlbGVjdGlvbjxhbnk+KSB7XG5cdGxldCBub2RlID0gc2VsZWN0aW9uLm5vZGUoKSBhcyBIVE1MQW5jaG9yRWxlbWVudDtcblx0cmV0dXJuIG5vZGUub2Zmc2V0SGVpZ2h0ICsgbm9kZS5vZmZzZXRUb3A7XG59XG5cbmZ1bmN0aW9uIGFkZFBsdXNNaW51c0NvbnRyb2woeDogbnVtYmVyLCBsYXllcklkeDogbnVtYmVyKSB7XG5cdGxldCBkaXYgPSBkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5hcHBlbmQoXCJkaXZcIilcblx0XHQuY2xhc3NlZChcInBsdXMtbWludXMtbmV1cm9uc1wiLCB0cnVlKVxuXHRcdC5zdHlsZShcImxlZnRcIiwgYCR7eCAtIDEwfXB4YCk7XG5cblx0bGV0IGkgPSBsYXllcklkeCAtIDE7XG5cdGxldCBmaXJzdFJvdyA9IGRpdi5hcHBlbmQoXCJkaXZcIikuYXR0cihcImNsYXNzXCIsIGB1aS1udW1Ob2RlcyR7bGF5ZXJJZHh9YCk7XG5cdGZpcnN0Um93LmFwcGVuZChcImJ1dHRvblwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtZGwtYnV0dG9uIG1kbC1qcy1idXR0b24gbWRsLWJ1dHRvbi0taWNvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGxldCBudW1OZXVyb25zID0gc3RhdGUubmV0d29ya1NoYXBlW2ldO1xuXHRcdFx0aWYgKG51bU5ldXJvbnMgPj0gTUFYX05FVVJPTlMpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c3RhdGUubmV0d29ya1NoYXBlW2ldKys7XG5cdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRyZXNldCgpO1xuXHRcdH0pXG5cdFx0LmFwcGVuZChcImlcIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibWF0ZXJpYWwtaWNvbnNcIilcblx0XHQudGV4dChcImFkZFwiKTtcblxuXHRmaXJzdFJvdy5hcHBlbmQoXCJidXR0b25cIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibWRsLWJ1dHRvbiBtZGwtanMtYnV0dG9uIG1kbC1idXR0b24tLWljb25cIilcblx0XHQub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRsZXQgbnVtTmV1cm9ucyA9IHN0YXRlLm5ldHdvcmtTaGFwZVtpXTtcblx0XHRcdGlmIChudW1OZXVyb25zIDw9IDEpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c3RhdGUubmV0d29ya1NoYXBlW2ldLS07XG5cdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRyZXNldCgpO1xuXHRcdH0pXG5cdFx0LmFwcGVuZChcImlcIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibWF0ZXJpYWwtaWNvbnNcIilcblx0XHQudGV4dChcInJlbW92ZVwiKTtcblxuXHRsZXQgc3VmZml4ID0gc3RhdGUubmV0d29ya1NoYXBlW2ldID4gMSA/IFwic1wiIDogXCJcIjtcblx0ZGl2LmFwcGVuZChcImRpdlwiKS50ZXh0KHN0YXRlLm5ldHdvcmtTaGFwZVtpXSArIFwiIG5ldXJvblwiICsgc3VmZml4KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSG92ZXJDYXJkKHR5cGU6IEhvdmVyVHlwZSwgbm9kZU9yTGluaz86IG5uLk5vZGUgfCBubi5MaW5rLCBjb29yZGluYXRlcz86IFtudW1iZXIsIG51bWJlcl0pIHtcblx0bGV0IGhvdmVyY2FyZCA9IGQzLnNlbGVjdChcIiNob3ZlcmNhcmRcIik7XG5cdGlmICh0eXBlID09IG51bGwpIHtcblx0XHRob3ZlcmNhcmQuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0XHRkMy5zZWxlY3QoXCIjc3ZnXCIpLm9uKFwiY2xpY2tcIiwgbnVsbCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGQzLnNlbGVjdChcIiNzdmdcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aG92ZXJjYXJkLnNlbGVjdChcIi52YWx1ZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdGxldCBpbnB1dCA9IGhvdmVyY2FyZC5zZWxlY3QoXCJpbnB1dFwiKTtcblx0XHRpbnB1dC5zdHlsZShcImRpc3BsYXlcIiwgbnVsbCk7XG5cdFx0aW5wdXQub24oXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodGhpcy52YWx1ZSAhPSBudWxsICYmIHRoaXMudmFsdWUgIT09IFwiXCIpIHtcblx0XHRcdFx0aWYgKHR5cGUgPT09IEhvdmVyVHlwZS5XRUlHSFQpIHtcblx0XHRcdFx0XHQobm9kZU9yTGluayBhcyBubi5MaW5rKS53ZWlnaHQgPSArdGhpcy52YWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQobm9kZU9yTGluayBhcyBubi5Ob2RlKS5iaWFzID0gK3RoaXMudmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dXBkYXRlVUkoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRpbnB1dC5vbihcImtleXByZXNzXCIsICgpID0+IHtcblx0XHRcdGlmICgoZDMuZXZlbnQgYXMgYW55KS5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0XHR1cGRhdGVIb3ZlckNhcmQodHlwZSwgbm9kZU9yTGluaywgY29vcmRpbmF0ZXMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdChpbnB1dC5ub2RlKCkgYXMgSFRNTElucHV0RWxlbWVudCkuZm9jdXMoKTtcblx0fSk7XG5cdGxldCB2YWx1ZSA9ICh0eXBlID09PSBIb3ZlclR5cGUuV0VJR0hUKSA/XG5cdFx0KG5vZGVPckxpbmsgYXMgbm4uTGluaykud2VpZ2h0IDpcblx0XHQobm9kZU9yTGluayBhcyBubi5Ob2RlKS5iaWFzO1xuXHRsZXQgbmFtZSA9ICh0eXBlID09PSBIb3ZlclR5cGUuV0VJR0hUKSA/IFwiV2VpZ2h0XCIgOiBcIkJpYXNcIjtcblx0aG92ZXJjYXJkLnN0eWxlKFxuXHRcdHtcblx0XHRcdFwibGVmdFwiOiBgJHtjb29yZGluYXRlc1swXSArIDIwfXB4YCxcblx0XHRcdFwidG9wXCI6IGAke2Nvb3JkaW5hdGVzWzFdfXB4YCxcblx0XHRcdFwiZGlzcGxheVwiOiBcImJsb2NrXCJcblx0XHR9KTtcblx0aG92ZXJjYXJkLnNlbGVjdChcIi50eXBlXCIpLnRleHQobmFtZSk7XG5cdGhvdmVyY2FyZC5zZWxlY3QoXCIudmFsdWVcIilcblx0XHQuc3R5bGUoXCJkaXNwbGF5XCIsIG51bGwpXG5cdFx0LnRleHQodmFsdWUudG9QcmVjaXNpb24oMikpO1xuXHRob3ZlcmNhcmQuc2VsZWN0KFwiaW5wdXRcIilcblx0XHQucHJvcGVydHkoXCJ2YWx1ZVwiLCB2YWx1ZS50b1ByZWNpc2lvbigyKSlcblx0XHQuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbn1cblxuZnVuY3Rpb24gZHJhd0xpbmsoXG5cdGlucHV0OiBubi5MaW5rLCBub2RlMmNvb3JkOiB7IFtpZDogc3RyaW5nXTogeyBjeDogbnVtYmVyLCBjeTogbnVtYmVyIH0gfSxcblx0bmV0d29yazogbm4uTm9kZVtdW10sIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sXG5cdGlzRmlyc3Q6IGJvb2xlYW4sIGluZGV4OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKSB7XG5cdGxldCBsaW5lID0gY29udGFpbmVyLmluc2VydChcInBhdGhcIiwgXCI6Zmlyc3QtY2hpbGRcIik7XG5cdGxldCBzb3VyY2UgPSBub2RlMmNvb3JkW2lucHV0LnNvdXJjZS5pZF07XG5cdGxldCBkZXN0ID0gbm9kZTJjb29yZFtpbnB1dC5kZXN0LmlkXTtcblx0bGV0IGRhdHVtID0ge1xuXHRcdHNvdXJjZTpcblx0XHRcdHtcblx0XHRcdFx0eTogc291cmNlLmN4ICsgUkVDVF9TSVpFIC8gMiArIDIsXG5cdFx0XHRcdHg6IHNvdXJjZS5jeVxuXHRcdFx0fSxcblx0XHR0YXJnZXQ6XG5cdFx0XHR7XG5cdFx0XHRcdHk6IGRlc3QuY3ggLSBSRUNUX1NJWkUgLyAyLFxuXHRcdFx0XHR4OiBkZXN0LmN5ICsgKChpbmRleCAtIChsZW5ndGggLSAxKSAvIDIpIC8gbGVuZ3RoKSAqIDEyXG5cdFx0XHR9XG5cdH07XG5cdGxldCBkaWFnb25hbCA9IGQzLnN2Zy5kaWFnb25hbCgpLnByb2plY3Rpb24oZCA9PiBbZC55LCBkLnhdKTtcblx0bGluZS5hdHRyKFxuXHRcdHtcblx0XHRcdFwibWFya2VyLXN0YXJ0XCI6IFwidXJsKCNtYXJrZXJBcnJvdylcIixcblx0XHRcdGNsYXNzOiBcImxpbmtcIixcblx0XHRcdGlkOiBcImxpbmtcIiArIGlucHV0LnNvdXJjZS5pZCArIFwiLVwiICsgaW5wdXQuZGVzdC5pZCxcblx0XHRcdGQ6IGRpYWdvbmFsKGRhdHVtLCAwKVxuXHRcdH0pO1xuXG5cdC8vIEFkZCBhbiBpbnZpc2libGUgdGhpY2sgbGluayB0aGF0IHdpbGwgYmUgdXNlZCBmb3Jcblx0Ly8gc2hvd2luZyB0aGUgd2VpZ2h0IHZhbHVlIG9uIGhvdmVyLlxuXHRjb250YWluZXIuYXBwZW5kKFwicGF0aFwiKVxuXHRcdC5hdHRyKFwiZFwiLCBkaWFnb25hbChkYXR1bSwgMCkpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxpbmstaG92ZXJcIilcblx0XHQub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHVwZGF0ZUhvdmVyQ2FyZChIb3ZlclR5cGUuV0VJR0hULCBpbnB1dCwgZDMubW91c2UodGhpcykpO1xuXHRcdH0pLm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0dXBkYXRlSG92ZXJDYXJkKG51bGwpO1xuXHR9KTtcblx0cmV0dXJuIGxpbmU7XG59XG5cbi8qKlxuICogR2l2ZW4gYSBuZXVyYWwgbmV0d29yaywgaXQgYXNrcyB0aGUgbmV0d29yayBmb3IgdGhlIG91dHB1dCAocHJlZGljdGlvbilcbiAqIG9mIGV2ZXJ5IG5vZGUgaW4gdGhlIG5ldHdvcmsgdXNpbmcgaW5wdXRzIHNhbXBsZWQgb24gYSBzcXVhcmUgZ3JpZC5cbiAqIEl0IHJldHVybnMgYSBtYXAgd2hlcmUgZWFjaCBrZXkgaXMgdGhlIG5vZGUgSUQgYW5kIHRoZSB2YWx1ZSBpcyBhIHNxdWFyZVxuICogbWF0cml4IG9mIHRoZSBvdXRwdXRzIG9mIHRoZSBuZXR3b3JrIGZvciBlYWNoIGlucHV0IGluIHRoZSBncmlkIHJlc3BlY3RpdmVseS5cbiAqL1xuXG5mdW5jdGlvbiB1cGRhdGVEZWNpc2lvbkJvdW5kYXJ5KG5ldHdvcms6IG5uLk5vZGVbXVtdLCBmaXJzdFRpbWU6IGJvb2xlYW4pIHtcblx0aWYgKGZpcnN0VGltZSkge1xuXHRcdGJvdW5kYXJ5ID0ge307XG5cdFx0bm4uZm9yRWFjaE5vZGUobmV0d29yaywgdHJ1ZSwgbm9kZSA9PiB7XG5cdFx0XHRib3VuZGFyeVtub2RlLmlkXSA9IG5ldyBBcnJheShERU5TSVRZKTtcblx0XHR9KTtcblx0XHQvLyBHbyB0aHJvdWdoIGFsbCBwcmVkZWZpbmVkIGlucHV0cy5cblx0XHRmb3IgKGxldCBub2RlSWQgaW4gSU5QVVRTKSB7XG5cdFx0XHRib3VuZGFyeVtub2RlSWRdID0gbmV3IEFycmF5KERFTlNJVFkpO1xuXHRcdH1cblx0fVxuXHRsZXQgeFNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCBERU5TSVRZIC0gMV0pLnJhbmdlKHhEb21haW4pO1xuXHRsZXQgeVNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFtERU5TSVRZIC0gMSwgMF0pLnJhbmdlKHhEb21haW4pO1xuXG5cdGxldCBpID0gMCwgaiA9IDA7XG5cdGZvciAoaSA9IDA7IGkgPCBERU5TSVRZOyBpKyspIHtcblx0XHRpZiAoZmlyc3RUaW1lKSB7XG5cdFx0XHRubi5mb3JFYWNoTm9kZShuZXR3b3JrLCB0cnVlLCBub2RlID0+IHtcblx0XHRcdFx0Ym91bmRhcnlbbm9kZS5pZF1baV0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XG5cdFx0XHR9KTtcblx0XHRcdC8vIEdvIHRocm91Z2ggYWxsIHByZWRlZmluZWQgaW5wdXRzLlxuXHRcdFx0Zm9yIChsZXQgbm9kZUlkIGluIElOUFVUUykge1xuXHRcdFx0XHRib3VuZGFyeVtub2RlSWRdW2ldID0gbmV3IEFycmF5KERFTlNJVFkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKGogPSAwOyBqIDwgREVOU0lUWTsgaisrKSB7XG5cdFx0XHQvLyAxIGZvciBwb2ludHMgaW5zaWRlIHRoZSBjaXJjbGUsIGFuZCAwIGZvciBwb2ludHMgb3V0c2lkZSB0aGUgY2lyY2xlLlxuXHRcdFx0bGV0IHggPSB4U2NhbGUoaSk7XG5cdFx0XHRsZXQgeSA9IHlTY2FsZShqKTtcblx0XHRcdGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KHgsIHkpO1xuXHRcdFx0bm4uZm9yd2FyZFByb3AobmV0d29yaywgaW5wdXQpO1xuXHRcdFx0bm4uZm9yRWFjaE5vZGUobmV0d29yaywgdHJ1ZSwgbm9kZSA9PiB7XG5cdFx0XHRcdGJvdW5kYXJ5W25vZGUuaWRdW2ldW2pdID0gbm9kZS5vdXRwdXQ7XG5cdFx0XHR9KTtcblx0XHRcdGlmIChmaXJzdFRpbWUpIHtcblx0XHRcdFx0Ly8gR28gdGhyb3VnaCBhbGwgcHJlZGVmaW5lZCBpbnB1dHMuXG5cdFx0XHRcdGZvciAobGV0IG5vZGVJZCBpbiBJTlBVVFMpIHtcblx0XHRcdFx0XHRib3VuZGFyeVtub2RlSWRdW2ldW2pdID0gSU5QVVRTW25vZGVJZF0uZih4LCB5KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBnZXRMZWFybmluZ1JhdGUobmV0d29yazogbm4uTm9kZVtdW10pOiBudW1iZXIge1xuXHRsZXQgdHJ1ZUxlYXJuaW5nUmF0ZSA9IDA7XG5cblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdC8vIFVwZGF0ZSBhbGwgdGhlIG5vZGVzIGluIHRoaXMgbGF5ZXIuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0dHJ1ZUxlYXJuaW5nUmF0ZSArPSBub2RlLnRydWVMZWFybmluZ1JhdGU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0cnVlTGVhcm5pbmdSYXRlO1xufVxuXG5mdW5jdGlvbiBnZXRUb3RhbENhcGFjaXR5KG5ldHdvcms6IG5uLk5vZGVbXVtdKTogbnVtYmVyIHtcblx0bGV0IHRvdGFsQ2FwYWNpdHkgPSAwO1xuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0dG90YWxDYXBhY2l0eSArPSBjdXJyZW50TGF5ZXIubGVuZ3RoO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdHRvdGFsQ2FwYWNpdHkgKz0gbm9kZS5pbnB1dExpbmtzLmxlbmd0aDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRvdGFsQ2FwYWNpdHk7XG59XG5cbmZ1bmN0aW9uIGdldExvc3MobmV0d29yazogbm4uTm9kZVtdW10sIGRhdGFQb2ludHM6IEV4YW1wbGUyRFtdKTogbnVtYmVyIHtcblx0bGV0IGxvc3MgPSAwO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFQb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgZGF0YVBvaW50ID0gZGF0YVBvaW50c1tpXTtcblx0XHRsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dChkYXRhUG9pbnQueCwgZGF0YVBvaW50LnkpO1xuXHRcdGxldCBvdXRwdXQgPSBubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XG5cdFx0bG9zcyArPSBubi5FcnJvcnMuU1FVQVJFLmVycm9yKG91dHB1dCwgZGF0YVBvaW50LmxhYmVsKTtcblx0fVxuXHRyZXR1cm4gbG9zcyAvIGRhdGFQb2ludHMubGVuZ3RoICogMTAwO1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXJPZkNvcnJlY3RDbGFzc2lmaWNhdGlvbnMobmV0d29yazogbm4uTm9kZVtdW10sIGRhdGFQb2ludHM6IEV4YW1wbGUyRFtdKTogbnVtYmVyIHtcblx0bGV0IGNvcnJlY3RseUNsYXNzaWZpZWQgPSAwO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFQb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgZGF0YVBvaW50ID0gZGF0YVBvaW50c1tpXTtcblx0XHRsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dChkYXRhUG9pbnQueCwgZGF0YVBvaW50LnkpO1xuXHRcdGxldCBvdXRwdXQgPSBubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XG5cdFx0bGV0IHByZWRpY3Rpb24gPSAob3V0cHV0ID4gMCkgPyAxIDogLTE7XG5cdFx0bGV0IGNvcnJlY3QgPSAocHJlZGljdGlvbiA9PT0gZGF0YVBvaW50LmxhYmVsKSA/IDEgOiAwO1xuXHRcdGNvcnJlY3RseUNsYXNzaWZpZWQgKz0gY29ycmVjdFxuXHR9XG5cblx0cmV0dXJuIGNvcnJlY3RseUNsYXNzaWZpZWQ7XG59XG5cbmZ1bmN0aW9uIGdldE51bWJlck9mRWFjaENsYXNzKG5ldHdvcms6IG5uLk5vZGVbXVtdLCBkYXRhUG9pbnRzOiBFeGFtcGxlMkRbXSk6IG51bWJlcltdIHtcblx0bGV0IGZpcnN0Q2xhc3M6IG51bWJlciA9IDA7XG5cdGxldCBzZWNvbmRDbGFzczogbnVtYmVyID0gMDtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhUG9pbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IGRhdGFQb2ludCA9IGRhdGFQb2ludHNbaV07XG5cdFx0Zmlyc3RDbGFzcyArPSAoZGF0YVBvaW50LmxhYmVsID09PSAtMSkgPyAxIDogMDtcblx0XHRzZWNvbmRDbGFzcyArPSAoZGF0YVBvaW50LmxhYmVsID09PSAxKSA/IDEgOiAwO1xuXHR9XG5cdHJldHVybiBbZmlyc3RDbGFzcywgc2Vjb25kQ2xhc3NdO1xufVxuXG5mdW5jdGlvbiBnZXRBY2N1cmFjeUZvckVhY2hDbGFzcyhuZXR3b3JrOiBubi5Ob2RlW11bXSwgZGF0YVBvaW50czogRXhhbXBsZTJEW10pOiBudW1iZXJbXSB7XG5cdGxldCBmaXJzdENsYXNzQ29ycmVjdDogbnVtYmVyID0gMDtcblx0bGV0IHNlY29uZENsYXNzQ29ycmVjdDogbnVtYmVyID0gMDtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhUG9pbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IGRhdGFQb2ludCA9IGRhdGFQb2ludHNbaV07XG5cdFx0bGV0IGlucHV0ID0gY29uc3RydWN0SW5wdXQoZGF0YVBvaW50LngsIGRhdGFQb2ludC55KTtcblx0XHRsZXQgb3V0cHV0ID0gbm4uZm9yd2FyZFByb3AobmV0d29yaywgaW5wdXQpO1xuXHRcdGxldCBwcmVkaWN0aW9uID0gKG91dHB1dCA+IDApID8gMSA6IC0xO1xuXHRcdGxldCBpc0NvcnJlY3QgPSBwcmVkaWN0aW9uID09PSBkYXRhUG9pbnQubGFiZWw7XG5cdFx0aWYgKGlzQ29ycmVjdCl7XG5cdFx0XHRpZiAoZGF0YVBvaW50LmxhYmVsID09PSAtMSl7XG5cdFx0XHRcdGZpcnN0Q2xhc3NDb3JyZWN0ICs9IDE7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2Vjb25kQ2xhc3NDb3JyZWN0ICs9IDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblx0bGV0IGNsYXNzZXNDb3VudDogbnVtYmVyW10gPSBnZXROdW1iZXJPZkVhY2hDbGFzcyhuZXR3b3JrLCBkYXRhUG9pbnRzKTtcblx0cmV0dXJuIFtmaXJzdENsYXNzQ29ycmVjdC9jbGFzc2VzQ291bnRbMF0sIHNlY29uZENsYXNzQ29ycmVjdC9jbGFzc2VzQ291bnRbMV1dO1xufVxuXG5cblxuZnVuY3Rpb24gdXBkYXRlVUkoZmlyc3RTdGVwID0gZmFsc2UpIHtcblx0Ly8gVXBkYXRlIHRoZSBsaW5rcyB2aXN1YWxseS5cblx0dXBkYXRlV2VpZ2h0c1VJKG5ldHdvcmssIGQzLnNlbGVjdChcImcuY29yZVwiKSk7XG5cdC8vIFVwZGF0ZSB0aGUgYmlhcyB2YWx1ZXMgdmlzdWFsbHkuXG5cdHVwZGF0ZUJpYXNlc1VJKG5ldHdvcmspO1xuXHQvLyBHZXQgdGhlIGRlY2lzaW9uIGJvdW5kYXJ5IG9mIHRoZSBuZXR3b3JrLlxuXHR1cGRhdGVEZWNpc2lvbkJvdW5kYXJ5KG5ldHdvcmssIGZpcnN0U3RlcCk7XG5cdGxldCBzZWxlY3RlZElkID0gc2VsZWN0ZWROb2RlSWQgIT0gbnVsbCA/XG5cdFx0c2VsZWN0ZWROb2RlSWQgOiBubi5nZXRPdXRwdXROb2RlKG5ldHdvcmspLmlkO1xuXHRoZWF0TWFwLnVwZGF0ZUJhY2tncm91bmQoYm91bmRhcnlbc2VsZWN0ZWRJZF0sIHN0YXRlLmRpc2NyZXRpemUpO1xuXG5cdC8vIFVwZGF0ZSBhbGwgZGVjaXNpb24gYm91bmRhcmllcy5cblx0ZDMuc2VsZWN0KFwiI25ldHdvcmtcIikuc2VsZWN0QWxsKFwiZGl2LmNhbnZhc1wiKVxuXHRcdC5lYWNoKGZ1bmN0aW9uIChkYXRhOiB7IGhlYXRtYXA6IEhlYXRNYXAsIGlkOiBzdHJpbmcgfSkge1xuXHRcdFx0ZGF0YS5oZWF0bWFwLnVwZGF0ZUJhY2tncm91bmQocmVkdWNlTWF0cml4KGJvdW5kYXJ5W2RhdGEuaWRdLCAxMCksIHN0YXRlLmRpc2NyZXRpemUpO1xuXHRcdH0pO1xuXG5cdGZ1bmN0aW9uIHplcm9QYWQobjogbnVtYmVyKTogc3RyaW5nIHtcblx0XHRsZXQgcGFkID0gXCIwMDAwMDBcIjtcblx0XHRyZXR1cm4gKHBhZCArIG4pLnNsaWNlKC1wYWQubGVuZ3RoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZENvbW1hcyhzOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdHJldHVybiBzLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIFwiLFwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGh1bWFuUmVhZGFibGUobjogbnVtYmVyKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gbi50b0ZpeGVkKDQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaHVtYW5SZWFkYWJsZUludChuOiBudW1iZXIpOiBzdHJpbmcge1xuXHRcdHJldHVybiBuLnRvRml4ZWQoMCk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaWduYWxPZihuOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdHJldHVybiBNYXRoLmxvZygxICsgTWF0aC5hYnMobikpO1xuXHR9XG5cblx0Ly8gVXBkYXRlIHRydWUgbGVhcm5pbmcgcmF0ZSBsb3NzIGFuZCBpdGVyYXRpb24gbnVtYmVyLlxuXHQvLyBUaGVzZSBhcmUgYWxsIGJpdCByYXRlcywgaGVuY2UgdGhleSBhcmUgY2hhbm5lbCBzaWduYWxzXG5cdGxldCBsb2cyID0gMS4wIC8gTWF0aC5sb2coMi4wKTtcblx0bGV0IGJpdExvc3NUZXN0ID0gbG9zc1Rlc3Q7XG5cdGxldCBiaXRMb3NzVHJhaW4gPSBsb3NzVHJhaW47XG5cdGxldCBiaXRUcnVlTGVhcm5pbmdSYXRlID0gc2lnbmFsT2YodHJ1ZUxlYXJuaW5nUmF0ZSkgKiBsb2cyO1xuXHRsZXQgYml0R2VuZXJhbGl6YXRpb24gPSBnZW5lcmFsaXphdGlvbjtcblxuXG5cdGQzLnNlbGVjdChcIiNsb3NzLXRyYWluXCIpLnRleHQoaHVtYW5SZWFkYWJsZShiaXRMb3NzVHJhaW4pKTtcblx0ZDMuc2VsZWN0KFwiI2xvc3MtdGVzdFwiKS50ZXh0KGh1bWFuUmVhZGFibGUoYml0TG9zc1Rlc3QpKTtcblx0ZDMuc2VsZWN0KFwiI2dlbmVyYWxpemF0aW9uXCIpLnRleHQoaHVtYW5SZWFkYWJsZShiaXRHZW5lcmFsaXphdGlvbikpO1xuXHRkMy5zZWxlY3QoXCIjdHJhaW4tYWNjdXJhY3ktZmlyc3RcIikudGV4dChodW1hblJlYWRhYmxlKHRyYWluQ2xhc3Nlc0FjY3VyYWN5WzBdKSk7XG5cdGQzLnNlbGVjdChcIiN0cmFpbi1hY2N1cmFjeS1zZWNvbmRcIikudGV4dChodW1hblJlYWRhYmxlKHRyYWluQ2xhc3Nlc0FjY3VyYWN5WzFdKSk7XG5cdGQzLnNlbGVjdChcIiN0ZXN0LWFjY3VyYWN5LWZpcnN0XCIpLnRleHQoaHVtYW5SZWFkYWJsZSh0ZXN0Q2xhc3Nlc0FjY3VyYWN5WzBdKSk7XG5cdGQzLnNlbGVjdChcIiN0ZXN0LWFjY3VyYWN5LXNlY29uZFwiKS50ZXh0KGh1bWFuUmVhZGFibGUodGVzdENsYXNzZXNBY2N1cmFjeVsxXSkpO1xuXHRkMy5zZWxlY3QoXCIjaXRlci1udW1iZXJcIikudGV4dChhZGRDb21tYXMoemVyb1BhZChpdGVyKSkpO1xuXHRkMy5zZWxlY3QoXCIjdG90YWwtY2FwYWNpdHlcIikudGV4dChodW1hblJlYWRhYmxlSW50KHRvdGFsQ2FwYWNpdHkpKTtcblx0bGluZUNoYXJ0LmFkZERhdGFQb2ludChbbG9zc1RyYWluLCBsb3NzVGVzdF0pO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RJbnB1dElkcygpOiBzdHJpbmdbXSB7XG5cdGxldCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cdGZvciAobGV0IGlucHV0TmFtZSBpbiBJTlBVVFMpIHtcblx0XHRpZiAoc3RhdGVbaW5wdXROYW1lXSkge1xuXHRcdFx0cmVzdWx0LnB1c2goaW5wdXROYW1lKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0SW5wdXQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXJbXSB7XG5cdGxldCBpbnB1dDogbnVtYmVyW10gPSBbXTtcblx0Zm9yIChsZXQgaW5wdXROYW1lIGluIElOUFVUUykge1xuXHRcdGlmIChzdGF0ZVtpbnB1dE5hbWVdKSB7XG5cdFx0XHRpbnB1dC5wdXNoKElOUFVUU1tpbnB1dE5hbWVdLmYoeCwgeSkpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIG9uZVN0ZXAoKTogdm9pZCB7XG5cdGl0ZXIrKztcblx0dHJhaW5EYXRhLmZvckVhY2goKHBvaW50LCBpKSA9PiB7XG5cdFx0bGV0IGlucHV0ID0gY29uc3RydWN0SW5wdXQocG9pbnQueCwgcG9pbnQueSk7XG5cdFx0bm4uZm9yd2FyZFByb3AobmV0d29yaywgaW5wdXQpO1xuXHRcdG5uLmJhY2tQcm9wKG5ldHdvcmssIHBvaW50LmxhYmVsLCBubi5FcnJvcnMuU1FVQVJFKTtcblx0XHRpZiAoKGkgKyAxKSAlIHN0YXRlLmJhdGNoU2l6ZSA9PT0gMCkge1xuXHRcdFx0bm4udXBkYXRlV2VpZ2h0cyhuZXR3b3JrLCBzdGF0ZS5sZWFybmluZ1JhdGUsIHN0YXRlLnJlZ3VsYXJpemF0aW9uUmF0ZSk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBDb21wdXRlIHRoZSBsb3NzLlxuXHR0cnVlTGVhcm5pbmdSYXRlID0gZ2V0TGVhcm5pbmdSYXRlKG5ldHdvcmspO1xuXHR0b3RhbENhcGFjaXR5ID0gZ2V0VG90YWxDYXBhY2l0eShuZXR3b3JrKTtcblxuXHRsb3NzVHJhaW4gPSBnZXRMb3NzKG5ldHdvcmssIHRyYWluRGF0YSk7XG5cdGxvc3NUZXN0ID0gZ2V0TG9zcyhuZXR3b3JrLCB0ZXN0RGF0YSk7XG5cblx0bGV0IG51bWJlck9mQ29ycmVjdFRyYWluQ2xhc3NpZmljYXRpb25zOiBudW1iZXIgPSBnZXROdW1iZXJPZkNvcnJlY3RDbGFzc2lmaWNhdGlvbnMobmV0d29yaywgdHJhaW5EYXRhKTtcblx0bGV0IG51bWJlck9mQ29ycmVjdFRlc3RDbGFzc2lmaWNhdGlvbnM6IG51bWJlciA9IGdldE51bWJlck9mQ29ycmVjdENsYXNzaWZpY2F0aW9ucyhuZXR3b3JrLCB0ZXN0RGF0YSk7XG5cdGdlbmVyYWxpemF0aW9uID0gKG51bWJlck9mQ29ycmVjdFRyYWluQ2xhc3NpZmljYXRpb25zKyBudW1iZXJPZkNvcnJlY3RUZXN0Q2xhc3NpZmljYXRpb25zKS90b3RhbENhcGFjaXR5O1xuXG5cdC8vbGV0IHRyYWluQ2xhc3Nlc0NvdW50OiBudW1iZXJbXSA9IGdldE51bWJlck9mRWFjaENsYXNzKG5ldHdvcmssIHRyYWluRGF0YSk7XG5cdC8vbGV0IHRlc3RDbGFzc2VzQ291bnQ6IG51bWJlcltdID0gZ2V0TnVtYmVyT2ZFYWNoQ2xhc3MobmV0d29yaywgdGVzdERhdGEpO1xuXHQvL2NvbnNvbGUubG9nKHRyYWluQ2xhc3Nlc0NvdW50KTtcblx0Ly9jb25zb2xlLmxvZyh0ZXN0Q2xhc3Nlc0NvdW50KTtcblx0dHJhaW5DbGFzc2VzQWNjdXJhY3kgPSBnZXRBY2N1cmFjeUZvckVhY2hDbGFzcyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuXHR0ZXN0Q2xhc3Nlc0FjY3VyYWN5ID0gZ2V0QWNjdXJhY3lGb3JFYWNoQ2xhc3MobmV0d29yaywgdGVzdERhdGEpO1xuXHRjb25zb2xlLmxvZyh0cmFpbkNsYXNzZXNBY2N1cmFjeVswXSArIFwiICYgXCIgKyB0ZXN0Q2xhc3Nlc0FjY3VyYWN5WzBdKTtcblx0Y29uc29sZS5sb2codHJhaW5DbGFzc2VzQWNjdXJhY3lbMV0gKyBcIiAmIFwiICsgdGVzdENsYXNzZXNBY2N1cmFjeVsxXSk7XG5cblx0dXBkYXRlVUkoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE91dHB1dFdlaWdodHMobmV0d29yazogbm4uTm9kZVtdW10pOiBudW1iZXJbXSB7XG5cdGxldCB3ZWlnaHRzOiBudW1iZXJbXSA9IFtdO1xuXHRmb3IgKGxldCBsYXllcklkeCA9IDA7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGggLSAxOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5vdXRwdXRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGxldCBvdXRwdXQgPSBub2RlLm91dHB1dHNbal07XG5cdFx0XHRcdHdlaWdodHMucHVzaChvdXRwdXQud2VpZ2h0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHdlaWdodHM7XG59XG5cbmZ1bmN0aW9uIHJlc2V0KG9uU3RhcnR1cCA9IGZhbHNlKSB7XG5cdGxpbmVDaGFydC5yZXNldCgpO1xuXHRzdGF0ZS5zZXJpYWxpemUoKTtcblx0aWYgKCFvblN0YXJ0dXApIHtcblx0XHR1c2VySGFzSW50ZXJhY3RlZCgpO1xuXHR9XG5cdHBsYXllci5wYXVzZSgpO1xuXG5cdGxldCBzdWZmaXggPSBzdGF0ZS5udW1IaWRkZW5MYXllcnMgIT09IDEgPyBcInNcIiA6IFwiXCI7XG5cdGQzLnNlbGVjdChcIiNsYXllcnMtbGFiZWxcIikudGV4dChcIkhpZGRlbiBsYXllclwiICsgc3VmZml4KTtcblx0ZDMuc2VsZWN0KFwiI251bS1sYXllcnNcIikudGV4dChzdGF0ZS5udW1IaWRkZW5MYXllcnMpO1xuXG5cblx0Ly8gTWFrZSBhIHNpbXBsZSBuZXR3b3JrLlxuXHRpdGVyID0gMDtcblx0bGV0IG51bUlucHV0cyA9IGNvbnN0cnVjdElucHV0KDAsIDApLmxlbmd0aDtcblx0bGV0IHNoYXBlID0gW251bUlucHV0c10uY29uY2F0KHN0YXRlLm5ldHdvcmtTaGFwZSkuY29uY2F0KFsxXSk7XG5cdGxldCBvdXRwdXRBY3RpdmF0aW9uID0gKHN0YXRlLnByb2JsZW0gPT09IFByb2JsZW0uUkVHUkVTU0lPTikgP1xuXHRcdG5uLkFjdGl2YXRpb25zLkxJTkVBUiA6IG5uLkFjdGl2YXRpb25zLlRBTkg7XG5cdG5ldHdvcmsgPSBubi5idWlsZE5ldHdvcmsoc2hhcGUsIHN0YXRlLmFjdGl2YXRpb24sIG91dHB1dEFjdGl2YXRpb24sXG5cdFx0c3RhdGUucmVndWxhcml6YXRpb24sIGNvbnN0cnVjdElucHV0SWRzKCksIHN0YXRlLmluaXRaZXJvKTtcblx0dHJ1ZUxlYXJuaW5nUmF0ZSA9IGdldExlYXJuaW5nUmF0ZShuZXR3b3JrKTtcblx0dG90YWxDYXBhY2l0eSA9IGdldFRvdGFsQ2FwYWNpdHkobmV0d29yayk7XG5cdGxvc3NUZXN0ID0gZ2V0TG9zcyhuZXR3b3JrLCB0ZXN0RGF0YSk7XG5cdGxvc3NUcmFpbiA9IGdldExvc3MobmV0d29yaywgdHJhaW5EYXRhKTtcblxuXHRsZXQgbnVtYmVyT2ZDb3JyZWN0VHJhaW5DbGFzc2lmaWNhdGlvbnM6IG51bWJlciA9IGdldE51bWJlck9mQ29ycmVjdENsYXNzaWZpY2F0aW9ucyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuXHRsZXQgbnVtYmVyT2ZDb3JyZWN0VGVzdENsYXNzaWZpY2F0aW9uczogbnVtYmVyID0gZ2V0TnVtYmVyT2ZDb3JyZWN0Q2xhc3NpZmljYXRpb25zKG5ldHdvcmssIHRlc3REYXRhKTtcblx0Z2VuZXJhbGl6YXRpb24gPSAobnVtYmVyT2ZDb3JyZWN0VHJhaW5DbGFzc2lmaWNhdGlvbnMgKyBudW1iZXJPZkNvcnJlY3RUZXN0Q2xhc3NpZmljYXRpb25zKS90b3RhbENhcGFjaXR5O1xuXHRcblx0dHJhaW5DbGFzc2VzQWNjdXJhY3kgPSBnZXRBY2N1cmFjeUZvckVhY2hDbGFzcyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuXHR0ZXN0Q2xhc3Nlc0FjY3VyYWN5ID0gZ2V0QWNjdXJhY3lGb3JFYWNoQ2xhc3MobmV0d29yaywgdGVzdERhdGEpO1xuXHRcblx0ZHJhd05ldHdvcmsobmV0d29yayk7XG5cdHVwZGF0ZVVJKHRydWUpO1xufVxuXG5mdW5jdGlvbiBpbml0VHV0b3JpYWwoKSB7XG5cdGlmIChzdGF0ZS50dXRvcmlhbCA9PSBudWxsIHx8IHN0YXRlLnR1dG9yaWFsID09PSBcIlwiIHx8IHN0YXRlLmhpZGVUZXh0KSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdC8vIFJlbW92ZSBhbGwgb3RoZXIgdGV4dC5cblx0ZDMuc2VsZWN0QWxsKFwiYXJ0aWNsZSBkaXYubC0tYm9keVwiKS5yZW1vdmUoKTtcblx0bGV0IHR1dG9yaWFsID0gZDMuc2VsZWN0KFwiYXJ0aWNsZVwiKS5hcHBlbmQoXCJkaXZcIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibC0tYm9keVwiKTtcblx0Ly8gSW5zZXJ0IHR1dG9yaWFsIHRleHQuXG5cdGQzLmh0bWwoYHR1dG9yaWFscy8ke3N0YXRlLnR1dG9yaWFsfS5odG1sYCwgKGVyciwgaHRtbEZyYWdtZW50KSA9PiB7XG5cdFx0aWYgKGVycikge1xuXHRcdFx0dGhyb3cgZXJyO1xuXHRcdH1cblx0XHR0dXRvcmlhbC5ub2RlKCkuYXBwZW5kQ2hpbGQoaHRtbEZyYWdtZW50KTtcblx0XHQvLyBJZiB0aGUgdHV0b3JpYWwgaGFzIGEgPHRpdGxlPiB0YWcsIHNldCB0aGUgcGFnZSB0aXRsZSB0byB0aGF0LlxuXHRcdGxldCB0aXRsZSA9IHR1dG9yaWFsLnNlbGVjdChcInRpdGxlXCIpO1xuXHRcdGlmICh0aXRsZS5zaXplKCkpIHtcblx0XHRcdGQzLnNlbGVjdChcImhlYWRlciBoMVwiKS5zdHlsZShcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwibWFyZ2luLXRvcFwiOiBcIjIwcHhcIixcblx0XHRcdFx0XHRcIm1hcmdpbi1ib3R0b21cIjogXCIyMHB4XCIsXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50ZXh0KHRpdGxlLnRleHQoKSk7XG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlLnRleHQoKTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBkcmF3RGF0YXNldFRodW1ibmFpbHMoKSB7XG5cdGZ1bmN0aW9uIHJlbmRlclRodW1ibmFpbChjYW52YXMsIGRhdGFHZW5lcmF0b3IpIHtcblx0XHRsZXQgdyA9IDEwMDtcblx0XHRsZXQgaCA9IDEwMDtcblx0XHRjYW52YXMuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgdyk7XG5cdFx0Y2FudmFzLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBoKTtcblx0XHRsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cdFx0bGV0IGRhdGEgPSBkYXRhR2VuZXJhdG9yKDIwMCwgNTApOyAvLyBOUE9JTlRTLCBOT0lTRVxuXG5cdFx0ZGF0YS5mb3JFYWNoKFxuXHRcdFx0ZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBjb2xvclNjYWxlKGQubGFiZWwpO1xuXHRcdFx0XHQvLyB+IGNvbnRleHQuZmlsbFJlY3QodyAqIChkLnggKyA2KSAvIDEyLCBoICogKC1kLnkgKyA2KSAvIDEyLCA0LCA0KTtcblx0XHRcdFx0Y29udGV4dC5maWxsUmVjdCh3ICogKGQueCArIDYpIC8gMTIsIGggKiAoLWQueSArIDYpIC8gMTIsIDQsIDQpO1xuXHRcdFx0fSk7XG5cdFx0ZDMuc2VsZWN0KGNhbnZhcy5wYXJlbnROb2RlKS5zdHlsZShcImRpc3BsYXlcIiwgbnVsbCk7XG5cdH1cblxuXHRkMy5zZWxlY3RBbGwoXCIuZGF0YXNldFwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXG5cdGlmIChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OKSB7XG5cdFx0Zm9yIChsZXQgZGF0YXNldCBpbiBkYXRhc2V0cykge1xuXHRcdFx0bGV0IGNhbnZhczogYW55ID1cblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2FudmFzW2RhdGEtZGF0YXNldD0ke2RhdGFzZXR9XWApO1xuXHRcdFx0bGV0IGRhdGFHZW5lcmF0b3IgPSBkYXRhc2V0c1tkYXRhc2V0XTtcblxuXHRcdFx0cmVuZGVyVGh1bWJuYWlsKGNhbnZhcywgZGF0YUdlbmVyYXRvcik7XG5cblxuXHRcdH1cblx0fVxuXHRpZiAoc3RhdGUucHJvYmxlbSA9PT0gUHJvYmxlbS5SRUdSRVNTSU9OKSB7XG5cdFx0Zm9yIChsZXQgcmVnRGF0YXNldCBpbiByZWdEYXRhc2V0cykge1xuXHRcdFx0bGV0IGNhbnZhczogYW55ID1cblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2FudmFzW2RhdGEtcmVnRGF0YXNldD0ke3JlZ0RhdGFzZXR9XWApO1xuXHRcdFx0bGV0IGRhdGFHZW5lcmF0b3IgPSByZWdEYXRhc2V0c1tyZWdEYXRhc2V0XTtcblx0XHRcdHJlbmRlclRodW1ibmFpbChjYW52YXMsIGRhdGFHZW5lcmF0b3IpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBoaWRlQ29udHJvbHMoKSB7XG5cdC8vIFNldCBkaXNwbGF5Om5vbmUgdG8gYWxsIHRoZSBVSSBlbGVtZW50cyB0aGF0IGFyZSBoaWRkZW4uXG5cdGxldCBoaWRkZW5Qcm9wcyA9IHN0YXRlLmdldEhpZGRlblByb3BzKCk7XG5cdGhpZGRlblByb3BzLmZvckVhY2gocHJvcCA9PiB7XG5cdFx0bGV0IGNvbnRyb2xzID0gZDMuc2VsZWN0QWxsKGAudWktJHtwcm9wfWApO1xuXHRcdGlmIChjb250cm9scy5zaXplKCkgPT09IDApIHtcblx0XHRcdGNvbnNvbGUud2FybihgMCBodG1sIGVsZW1lbnRzIGZvdW5kIHdpdGggY2xhc3MgLnVpLSR7cHJvcH1gKTtcblx0XHR9XG5cdFx0Y29udHJvbHMuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0fSk7XG5cblx0Ly8gQWxzbyBhZGQgY2hlY2tib3ggZm9yIGVhY2ggaGlkYWJsZSBjb250cm9sIGluIHRoZSBcInVzZSBpdCBpbiBjbGFzc3JvbVwiXG5cdC8vIHNlY3Rpb24uXG5cdGxldCBoaWRlQ29udHJvbHMgPSBkMy5zZWxlY3QoXCIuaGlkZS1jb250cm9sc1wiKTtcblx0SElEQUJMRV9DT05UUk9MUy5mb3JFYWNoKChbdGV4dCwgaWRdKSA9PiB7XG5cdFx0bGV0IGxhYmVsID0gaGlkZUNvbnRyb2xzLmFwcGVuZChcImxhYmVsXCIpXG5cdFx0XHQuYXR0cihcImNsYXNzXCIsIFwibWRsLWNoZWNrYm94IG1kbC1qcy1jaGVja2JveCBtZGwtanMtcmlwcGxlLWVmZmVjdFwiKTtcblx0XHRsZXQgaW5wdXQgPSBsYWJlbC5hcHBlbmQoXCJpbnB1dFwiKVxuXHRcdFx0LmF0dHIoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0eXBlOiBcImNoZWNrYm94XCIsXG5cdFx0XHRcdFx0Y2xhc3M6IFwibWRsLWNoZWNrYm94X19pbnB1dFwiLFxuXHRcdFx0XHR9KTtcblx0XHRpZiAoaGlkZGVuUHJvcHMuaW5kZXhPZihpZCkgPT09IC0xKSB7XG5cdFx0XHRpbnB1dC5hdHRyKFwiY2hlY2tlZFwiLCBcInRydWVcIik7XG5cdFx0fVxuXHRcdGlucHV0Lm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHN0YXRlLnNldEhpZGVQcm9wZXJ0eShpZCwgIXRoaXMuY2hlY2tlZCk7XG5cdFx0XHRzdGF0ZS5zZXJpYWxpemUoKTtcblx0XHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0XHRkMy5zZWxlY3QoXCIuaGlkZS1jb250cm9scy1saW5rXCIpXG5cdFx0XHRcdC5hdHRyKFwiaHJlZlwiLCB3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cdFx0fSk7XG5cdFx0bGFiZWwuYXBwZW5kKFwic3BhblwiKVxuXHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcIm1kbC1jaGVja2JveF9fbGFiZWwgbGFiZWxcIilcblx0XHRcdC50ZXh0KHRleHQpO1xuXHR9KTtcblx0ZDMuc2VsZWN0KFwiLmhpZGUtY29udHJvbHMtbGlua1wiKVxuXHRcdC5hdHRyKFwiaHJlZlwiLCB3aW5kb3cubG9jYXRpb24uaHJlZik7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlRGF0YShmaXJzdFRpbWUgPSBmYWxzZSkge1xuXHRpZiAoIWZpcnN0VGltZSkge1xuXHRcdC8vIENoYW5nZSB0aGUgc2VlZC5cblx0XHRzdGF0ZS5zZWVkID0gTWF0aC5yYW5kb20oKS50b0ZpeGVkKDgpO1xuXHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdH1cblx0TWF0aC5zZWVkcmFuZG9tKHN0YXRlLnNlZWQpO1xuXHRsZXQgbnVtU2FtcGxlcyA9IChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLlJFR1JFU1NJT04pID9cblx0XHROVU1fU0FNUExFU19SRUdSRVNTIDogTlVNX1NBTVBMRVNfQ0xBU1NJRlk7XG5cblx0bGV0IGdlbmVyYXRvcjtcblx0bGV0IGRhdGE6IEV4YW1wbGUyRFtdID0gW107XG5cblx0aWYgKHN0YXRlLmJ5b2QpIHtcblx0XHQvLyB+IGZvciAobGV0IGkgPSAwOyBpIDwgdHJhaW5EYXRhLmxlbmd0aDsgaSsrKVxuXHRcdC8vIH4ge1xuXHRcdC8vIH4gZGF0YVtpXS5wdXNoKHRyYWluRGF0YVtpXSk7XG5cdFx0Ly8gfiB9XG5cdFx0Ly8gfiBmb3IgKGxldCBpID0gdHJhaW5EYXRhLmxlbmd0aDsgaSA8IHRyYWluRGF0YS5sZW5ndGgrdGVzdERhdGEubGVuZ3RoOyBpKyspXG5cdFx0Ly8gfiB7XG5cdFx0Ly8gfiBsZXQgaiA9IGkgLSB0cmFpbkRhdGEubGVuZ3RoO1xuXHRcdC8vIH4gZGF0YVtpXS5wdXNoKHRlc3REYXRhW2pdKTtcblx0XHQvLyB+IH1cblxuXHRcdC8vIH4gc2h1ZmZsZShkYXRhKTtcblx0XHQvLyB+IGxldCBzcGxpdEluZGV4ID0gTWF0aC5mbG9vcihkYXRhLmxlbmd0aCAqIHN0YXRlLnBlcmNUcmFpbkRhdGEvMTAwKTtcblx0XHQvLyB+IHRyYWluRGF0YSA9IGRhdGEuc2xpY2UoMCwgc3BsaXRJbmRleCk7XG5cdFx0Ly8gfiB0ZXN0RGF0YSA9IGRhdGEuc2xpY2Uoc3BsaXRJbmRleCk7XG5cdH1cblxuXHRpZiAoIXN0YXRlLmJ5b2QpIHtcblx0XHRnZW5lcmF0b3IgPSBzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OID8gc3RhdGUuZGF0YXNldCA6IHN0YXRlLnJlZ0RhdGFzZXQ7XG5cdFx0ZGF0YSA9IGdlbmVyYXRvcihudW1TYW1wbGVzLCBzdGF0ZS5ub2lzZSk7XG5cblx0XHRzaHVmZmxlKGRhdGEpO1xuXHRcdC8vIFNwbGl0IGludG8gdHJhaW4gYW5kIHRlc3QgZGF0YS5cblx0XHRsZXQgc3BsaXRJbmRleCA9IE1hdGguZmxvb3IoZGF0YS5sZW5ndGggKiBzdGF0ZS5wZXJjVHJhaW5EYXRhIC8gMTAwKTtcblx0XHR0cmFpbkRhdGEgPSBkYXRhLnNsaWNlKDAsIHNwbGl0SW5kZXgpO1xuXHRcdHRlc3REYXRhID0gZGF0YS5zbGljZShzcGxpdEluZGV4KTtcblx0fVxuXHRzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMF07XG5cdHN0YXRlLm1heENhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkodHJhaW5EYXRhKVsxXTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXG5cdGhlYXRNYXAudXBkYXRlUG9pbnRzKHRyYWluRGF0YSk7XG5cdGhlYXRNYXAudXBkYXRlVGVzdFBvaW50cyhzdGF0ZS5zaG93VGVzdERhdGEgPyB0ZXN0RGF0YSA6IFtdKTtcblxufVxuXG5sZXQgZmlyc3RJbnRlcmFjdGlvbiA9IHRydWU7XG5sZXQgcGFyYW1ldGVyc0NoYW5nZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gdXNlckhhc0ludGVyYWN0ZWQoKSB7XG5cdGlmICghZmlyc3RJbnRlcmFjdGlvbikge1xuXHRcdHJldHVybjtcblx0fVxuXHRmaXJzdEludGVyYWN0aW9uID0gZmFsc2U7XG5cdGxldCBwYWdlID0gXCJpbmRleFwiO1xuXHRpZiAoc3RhdGUudHV0b3JpYWwgIT0gbnVsbCAmJiBzdGF0ZS50dXRvcmlhbCAhPT0gXCJcIikge1xuXHRcdHBhZ2UgPSBgL3YvdHV0b3JpYWxzLyR7c3RhdGUudHV0b3JpYWx9YDtcblx0fVxuXHRnYShcInNldFwiLCBcInBhZ2VcIiwgcGFnZSk7XG5cdGdhKFwic2VuZFwiLCBcInBhZ2V2aWV3XCIsIHtcInNlc3Npb25Db250cm9sXCI6IFwic3RhcnRcIn0pO1xufVxuXG5mdW5jdGlvbiBzaW11bGF0aW9uU3RhcnRlZCgpIHtcblx0Z2EoXCJzZW5kXCIsXG5cdFx0e1xuXHRcdFx0aGl0VHlwZTogXCJldmVudFwiLFxuXHRcdFx0ZXZlbnRDYXRlZ29yeTogXCJTdGFydGluZyBTaW11bGF0aW9uXCIsXG5cdFx0XHRldmVudEFjdGlvbjogcGFyYW1ldGVyc0NoYW5nZWQgPyBcImNoYW5nZWRcIiA6IFwidW5jaGFuZ2VkXCIsXG5cdFx0XHRldmVudExhYmVsOiBzdGF0ZS50dXRvcmlhbCA9PSBudWxsID8gXCJcIiA6IHN0YXRlLnR1dG9yaWFsXG5cdFx0fSk7XG5cdHBhcmFtZXRlcnNDaGFuZ2VkID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHNpbXVsYXRlQ2xpY2soZWxlbSAvKiBNdXN0IGJlIHRoZSBlbGVtZW50LCBub3QgZDMgc2VsZWN0aW9uICovKSB7XG5cdGxldCBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIk1vdXNlRXZlbnRzXCIpO1xuXHRldnQuaW5pdE1vdXNlRXZlbnQoXG5cdFx0XCJjbGlja1wiLCAvKiB0eXBlICovXG5cdFx0dHJ1ZSwgLyogY2FuQnViYmxlICovXG5cdFx0dHJ1ZSwgLyogY2FuY2VsYWJsZSAqL1xuXHRcdHdpbmRvdywgLyogdmlldyAqL1xuXHRcdDAsIC8qIGRldGFpbCAqL1xuXHRcdDAsIC8qIHNjcmVlblggKi9cblx0XHQwLCAvKiBzY3JlZW5ZICovXG5cdFx0MCwgLyogY2xpZW50WCAqL1xuXHRcdDAsIC8qIGNsaWVudFkgKi9cblx0XHRmYWxzZSwgLyogY3RybEtleSAqL1xuXHRcdGZhbHNlLCAvKiBhbHRLZXkgKi9cblx0XHRmYWxzZSwgLyogc2hpZnRLZXkgKi9cblx0XHRmYWxzZSwgLyogbWV0YUtleSAqL1xuXHRcdDAsIC8qIGJ1dHRvbiAqL1xuXHRcdG51bGwpOyAvKiByZWxhdGVkVGFyZ2V0ICovXG5cdGVsZW0uZGlzcGF0Y2hFdmVudChldnQpO1xufVxuXG5kcmF3RGF0YXNldFRodW1ibmFpbHMoKTtcbi8vIGluaXRUdXRvcmlhbCgpO1xubWFrZUdVSSgpO1xuZ2VuZXJhdGVEYXRhKHRydWUpO1xucmVzZXQodHJ1ZSk7XG5oaWRlQ29udHJvbHMoKTtcbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuaW1wb3J0ICogYXMgbm4gZnJvbSBcIi4vbm5cIjtcbmltcG9ydCAqIGFzIGRhdGFzZXQgZnJvbSBcIi4vZGF0YXNldFwiO1xuaW1wb3J0IHtFeGFtcGxlMkQsIHNodWZmbGUsIERhdGFHZW5lcmF0b3J9IGZyb20gXCIuL2RhdGFzZXRcIjtcblxuLyoqIFN1ZmZpeCBhZGRlZCB0byB0aGUgc3RhdGUgd2hlbiBzdG9yaW5nIGlmIGEgY29udHJvbCBpcyBoaWRkZW4gb3Igbm90LiAqL1xuY29uc3QgSElERV9TVEFURV9TVUZGSVggPSBcIl9oaWRlXCI7XG5cbi8qKiBBIG1hcCBiZXR3ZWVuIG5hbWVzIGFuZCBhY3RpdmF0aW9uIGZ1bmN0aW9ucy4gKi9cbmV4cG9ydCBsZXQgYWN0aXZhdGlvbnM6IHsgW2tleTogc3RyaW5nXTogbm4uQWN0aXZhdGlvbkZ1bmN0aW9uIH0gPSB7XG5cdFwicmVsdVwiOiBubi5BY3RpdmF0aW9ucy5SRUxVLFxuXHRcInRhbmhcIjogbm4uQWN0aXZhdGlvbnMuVEFOSCxcblx0XCJzaWdtb2lkXCI6IG5uLkFjdGl2YXRpb25zLlNJR01PSUQsXG5cdFwibGluZWFyXCI6IG5uLkFjdGl2YXRpb25zLkxJTkVBUixcblx0XCJzaW54XCI6IG5uLkFjdGl2YXRpb25zLlNJTlhcbn07XG5cbi8qKiBBIG1hcCBiZXR3ZWVuIG5hbWVzIGFuZCByZWd1bGFyaXphdGlvbiBmdW5jdGlvbnMuICovXG5leHBvcnQgbGV0IHJlZ3VsYXJpemF0aW9uczogeyBba2V5OiBzdHJpbmddOiBubi5SZWd1bGFyaXphdGlvbkZ1bmN0aW9uIH0gPSB7XG5cdFwibm9uZVwiOiBudWxsLFxuXHRcIkwxXCI6IG5uLlJlZ3VsYXJpemF0aW9uRnVuY3Rpb24uTDEsXG5cdFwiTDJcIjogbm4uUmVndWxhcml6YXRpb25GdW5jdGlvbi5MMlxufTtcblxuLyoqIEEgbWFwIGJldHdlZW4gZGF0YXNldCBuYW1lcyBhbmQgZnVuY3Rpb25zIHRoYXQgZ2VuZXJhdGUgY2xhc3NpZmljYXRpb24gZGF0YS4gKi9cbmV4cG9ydCBsZXQgZGF0YXNldHM6IHsgW2tleTogc3RyaW5nXTogZGF0YXNldC5EYXRhR2VuZXJhdG9yIH0gPSB7XG5cdFwiY2lyY2xlXCI6IGRhdGFzZXQuY2xhc3NpZnlDaXJjbGVEYXRhLFxuXHRcInhvclwiOiBkYXRhc2V0LmNsYXNzaWZ5WE9SRGF0YSxcblx0XCJnYXVzc1wiOiBkYXRhc2V0LmNsYXNzaWZ5VHdvR2F1c3NEYXRhLFxuXHRcInNwaXJhbFwiOiBkYXRhc2V0LmNsYXNzaWZ5U3BpcmFsRGF0YSxcblx0XCJieW9kXCI6IGRhdGFzZXQuY2xhc3NpZnlCWU9EYXRhXG59O1xuXG4vKiogQSBtYXAgYmV0d2VlbiBkYXRhc2V0IG5hbWVzIGFuZCBmdW5jdGlvbnMgdGhhdCBnZW5lcmF0ZSByZWdyZXNzaW9uIGRhdGEuICovXG5leHBvcnQgbGV0IHJlZ0RhdGFzZXRzOiB7IFtrZXk6IHN0cmluZ106IGRhdGFzZXQuRGF0YUdlbmVyYXRvciB9ID0ge1xuXHRcInJlZy1wbGFuZVwiOiBkYXRhc2V0LnJlZ3Jlc3NQbGFuZSxcblx0XCJyZWctZ2F1c3NcIjogZGF0YXNldC5yZWdyZXNzR2F1c3NpYW5cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRLZXlGcm9tVmFsdWUob2JqOiBhbnksIHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuXHRmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG5cdFx0aWYgKG9ialtrZXldID09PSB2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIGtleTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZW5kc1dpdGgoczogc3RyaW5nLCBzdWZmaXg6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gcy5zdWJzdHIoLXN1ZmZpeC5sZW5ndGgpID09PSBzdWZmaXg7XG59XG5cbmZ1bmN0aW9uIGdldEhpZGVQcm9wcyhvYmo6IGFueSk6IHN0cmluZ1tdIHtcblx0bGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblx0Zm9yIChsZXQgcHJvcCBpbiBvYmopIHtcblx0XHRpZiAoZW5kc1dpdGgocHJvcCwgSElERV9TVEFURV9TVUZGSVgpKSB7XG5cdFx0XHRyZXN1bHQucHVzaChwcm9wKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgZGF0YSB0eXBlIG9mIGEgc3RhdGUgdmFyaWFibGUuIFVzZWQgZm9yIGRldGVybWluaW5nIHRoZVxuICogKGRlKXNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5leHBvcnQgZW51bSBUeXBlIHtcblx0U1RSSU5HLFxuXHROVU1CRVIsXG5cdEFSUkFZX05VTUJFUixcblx0QVJSQVlfU1RSSU5HLFxuXHRCT09MRUFOLFxuXHRPQkpFQ1Rcbn1cblxuZXhwb3J0IGVudW0gUHJvYmxlbSB7XG5cdENMQVNTSUZJQ0FUSU9OLFxuXHRSRUdSRVNTSU9OXG59XG5cbmV4cG9ydCBsZXQgcHJvYmxlbXMgPSB7XG5cdFwiY2xhc3NpZmljYXRpb25cIjogUHJvYmxlbS5DTEFTU0lGSUNBVElPTixcblx0XCJyZWdyZXNzaW9uXCI6IFByb2JsZW0uUkVHUkVTU0lPTlxufTtcblxuZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eSB7XG5cdG5hbWU6IHN0cmluZztcblx0dHlwZTogVHlwZTtcblx0a2V5TWFwPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbn1cblxuLy8gQWRkIHRoZSBHVUkgc3RhdGUuXG5leHBvcnQgY2xhc3MgU3RhdGUge1xuXHRwcml2YXRlIHN0YXRpYyBQUk9QUzogUHJvcGVydHlbXSA9XG5cdFx0W1xuXHRcdFx0e25hbWU6IFwiYWN0aXZhdGlvblwiLCB0eXBlOiBUeXBlLk9CSkVDVCwga2V5TWFwOiBhY3RpdmF0aW9uc30sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6IFwicmVndWxhcml6YXRpb25cIixcblx0XHRcdFx0dHlwZTogVHlwZS5PQkpFQ1QsXG5cdFx0XHRcdGtleU1hcDogcmVndWxhcml6YXRpb25zXG5cdFx0XHR9LFxuXHRcdFx0e25hbWU6IFwiYmF0Y2hTaXplXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcblx0XHRcdHtuYW1lOiBcImRhdGFzZXRcIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogZGF0YXNldHN9LFxuXHRcdFx0e25hbWU6IFwicmVnRGF0YXNldFwiLCB0eXBlOiBUeXBlLk9CSkVDVCwga2V5TWFwOiByZWdEYXRhc2V0c30sXG5cdFx0XHR7bmFtZTogXCJsZWFybmluZ1JhdGVcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwidHJ1ZUxlYXJuaW5nUmF0ZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sIC8vIFRoZSB0cnVlIGxlYXJuaW5nIHJhdGVcblx0XHRcdHtuYW1lOiBcInJlZ3VsYXJpemF0aW9uUmF0ZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sXG5cdFx0XHR7bmFtZTogXCJub2lzZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sXG5cdFx0XHR7bmFtZTogXCJuZXR3b3JrU2hhcGVcIiwgdHlwZTogVHlwZS5BUlJBWV9OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwic2VlZFwiLCB0eXBlOiBUeXBlLlNUUklOR30sXG5cdFx0XHR7bmFtZTogXCJzaG93VGVzdERhdGFcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcImRpc2NyZXRpemVcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInBlcmNUcmFpbkRhdGFcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwieFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwieVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwieFRpbWVzWVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwieFNxdWFyZWRcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInlTcXVhcmVkXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJjb3NYXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJzaW5YXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJjb3NZXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJzaW5ZXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJjb2xsZWN0U3RhdHNcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInR1dG9yaWFsXCIsIHR5cGU6IFR5cGUuU1RSSU5HfSxcblx0XHRcdHtuYW1lOiBcInByb2JsZW1cIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogcHJvYmxlbXN9LFxuXHRcdFx0e25hbWU6IFwiaW5pdFplcm9cIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcImhpZGVUZXh0XCIsIHR5cGU6IFR5cGUuQk9PTEVBTn1cblx0XHRdO1xuXG5cdFtrZXk6IHN0cmluZ106IGFueTtcblxuXHR0b3RhbENhcGFjaXR5ID0gMC4wO1xuXHRyZXFDYXBhY2l0eSA9IDI7XG5cdG1heENhcGFjaXR5ID0gMDtcblx0c3VnQ2FwYWNpdHkgPSAwO1xuXHRsb3NzQ2FwYWNpdHkgPSAwO1xuXHR0cnVlTGVhcm5pbmdSYXRlID0gMC4wO1xuXHRsZWFybmluZ1JhdGUgPSAxLjA7XG5cdHJlZ3VsYXJpemF0aW9uUmF0ZSA9IDA7XG5cdHNob3dUZXN0RGF0YSA9IGZhbHNlO1xuXHRub2lzZSA9IDM1OyAvLyBTTlJkQlxuXHRiYXRjaFNpemUgPSAxMDtcblx0ZGlzY3JldGl6ZSA9IGZhbHNlO1xuXHR0dXRvcmlhbDogc3RyaW5nID0gbnVsbDtcblx0cGVyY1RyYWluRGF0YSA9IDUwO1xuXHRhY3RpdmF0aW9uID0gbm4uQWN0aXZhdGlvbnMuU0lHTU9JRDtcblx0cmVndWxhcml6YXRpb246IG5uLlJlZ3VsYXJpemF0aW9uRnVuY3Rpb24gPSBudWxsO1xuXHRwcm9ibGVtID0gUHJvYmxlbS5DTEFTU0lGSUNBVElPTjtcblx0aW5pdFplcm8gPSBmYWxzZTtcblx0aGlkZVRleHQgPSBmYWxzZTtcblx0Y29sbGVjdFN0YXRzID0gZmFsc2U7XG5cdG51bUhpZGRlbkxheWVycyA9IDE7XG5cdGhpZGRlbkxheWVyQ29udHJvbHM6IGFueVtdID0gW107XG5cdG5ldHdvcmtTaGFwZTogbnVtYmVyW10gPSBbMV07XG5cdHggPSB0cnVlO1xuXHR5ID0gdHJ1ZTtcblx0eFRpbWVzWSA9IGZhbHNlO1xuXHR4U3F1YXJlZCA9IGZhbHNlO1xuXHR5U3F1YXJlZCA9IGZhbHNlO1xuXHRjb3NYID0gZmFsc2U7XG5cdHNpblggPSBmYWxzZTtcblx0Y29zWSA9IGZhbHNlO1xuXHRzaW5ZID0gZmFsc2U7XG5cdGJ5b2QgPSBmYWxzZTtcblx0ZGF0YTogRXhhbXBsZTJEW10gPSBbXTtcblx0ZGF0YXNldDogZGF0YXNldC5EYXRhR2VuZXJhdG9yID0gZGF0YXNldC5jbGFzc2lmeVR3b0dhdXNzRGF0YTtcblx0cmVnRGF0YXNldDogZGF0YXNldC5EYXRhR2VuZXJhdG9yID0gZGF0YXNldC5yZWdyZXNzUGxhbmU7XG5cdHNlZWQ6IHN0cmluZztcblxuXHQvKipcblx0ICogRGVzZXJpYWxpemVzIHRoZSBzdGF0ZSBmcm9tIHRoZSB1cmwgaGFzaC5cblx0ICovXG5cdHN0YXRpYyBkZXNlcmlhbGl6ZVN0YXRlKCk6IFN0YXRlIHtcblx0XHRsZXQgbWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cdFx0Zm9yIChsZXQga2V5dmFsdWUgb2Ygd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkuc3BsaXQoXCImXCIpKSB7XG5cdFx0XHRsZXQgW25hbWUsIHZhbHVlXSA9IGtleXZhbHVlLnNwbGl0KFwiPVwiKTtcblx0XHRcdG1hcFtuYW1lXSA9IHZhbHVlO1xuXHRcdH1cblx0XHRsZXQgc3RhdGUgPSBuZXcgU3RhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGhhc0tleShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiBuYW1lIGluIG1hcCAmJiBtYXBbbmFtZV0gIT0gbnVsbCAmJiBtYXBbbmFtZV0udHJpbSgpICE9PSBcIlwiO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHBhcnNlQXJyYXkodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcblx0XHRcdHJldHVybiB2YWx1ZS50cmltKCkgPT09IFwiXCIgPyBbXSA6IHZhbHVlLnNwbGl0KFwiLFwiKTtcblx0XHR9XG5cblx0XHQvLyBEZXNlcmlhbGl6ZSByZWd1bGFyIHByb3BlcnRpZXMuXG5cdFx0U3RhdGUuUFJPUFMuZm9yRWFjaCgoe25hbWUsIHR5cGUsIGtleU1hcH0pID0+IHtcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIFR5cGUuT0JKRUNUOlxuXHRcdFx0XHRcdGlmIChrZXlNYXAgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0dGhyb3cgRXJyb3IoXCJBIGtleS12YWx1ZSBtYXAgbXVzdCBiZSBwcm92aWRlZCBmb3Igc3RhdGUgXCIgK1xuXHRcdFx0XHRcdFx0XHRcInZhcmlhYmxlcyBvZiB0eXBlIE9iamVjdFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGhhc0tleShuYW1lKSAmJiBtYXBbbmFtZV0gaW4ga2V5TWFwKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZVtuYW1lXSA9IGtleU1hcFttYXBbbmFtZV1dO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBUeXBlLk5VTUJFUjpcblx0XHRcdFx0XHRpZiAoaGFzS2V5KG5hbWUpKSB7XG5cdFx0XHRcdFx0XHQvLyBUaGUgKyBvcGVyYXRvciBpcyBmb3IgY29udmVydGluZyBhIHN0cmluZyB0byBhIG51bWJlci5cblx0XHRcdFx0XHRcdHN0YXRlW25hbWVdID0gK21hcFtuYW1lXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVHlwZS5TVFJJTkc6XG5cdFx0XHRcdFx0aWYgKGhhc0tleShuYW1lKSkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBtYXBbbmFtZV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQk9PTEVBTjpcblx0XHRcdFx0XHRpZiAoaGFzS2V5KG5hbWUpKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZVtuYW1lXSA9IChtYXBbbmFtZV0gPT09IFwiZmFsc2VcIiA/IGZhbHNlIDogdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQVJSQVlfTlVNQkVSOlxuXHRcdFx0XHRcdGlmIChuYW1lIGluIG1hcCkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBwYXJzZUFycmF5KG1hcFtuYW1lXSkubWFwKE51bWJlcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQVJSQVlfU1RSSU5HOlxuXHRcdFx0XHRcdGlmIChuYW1lIGluIG1hcCkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBwYXJzZUFycmF5KG1hcFtuYW1lXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IEVycm9yKFwiRW5jb3VudGVyZWQgYW4gdW5rbm93biB0eXBlIGZvciBhIHN0YXRlIHZhcmlhYmxlXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gRGVzZXJpYWxpemUgc3RhdGUgcHJvcGVydGllcyB0aGF0IGNvcnJlc3BvbmQgdG8gaGlkaW5nIFVJIGNvbnRyb2xzLlxuXHRcdGdldEhpZGVQcm9wcyhtYXApLmZvckVhY2gocHJvcCA9PiB7XG5cdFx0XHRzdGF0ZVtwcm9wXSA9IChtYXBbcHJvcF0gPT09IFwidHJ1ZVwiKTtcblx0XHR9KTtcblx0XHRzdGF0ZS5udW1IaWRkZW5MYXllcnMgPSBzdGF0ZS5uZXR3b3JrU2hhcGUubGVuZ3RoO1xuXHRcdGlmIChzdGF0ZS5zZWVkID09IG51bGwpIHtcblx0XHRcdHN0YXRlLnNlZWQgPSBNYXRoLnJhbmRvbSgpLnRvRml4ZWQoNSk7XG5cdFx0fVxuXHRcdE1hdGguc2VlZHJhbmRvbShzdGF0ZS5zZWVkKTtcblx0XHRyZXR1cm4gc3RhdGU7XG5cdH1cblxuXHQvKipcblx0ICogU2VyaWFsaXplcyB0aGUgc3RhdGUgaW50byB0aGUgdXJsIGhhc2guXG5cdCAqL1xuXHRzZXJpYWxpemUoKSB7XG5cdFx0Ly8gU2VyaWFsaXplIHJlZ3VsYXIgcHJvcGVydGllcy5cblx0XHRsZXQgcHJvcHM6IHN0cmluZ1tdID0gW107XG5cdFx0U3RhdGUuUFJPUFMuZm9yRWFjaCgoe25hbWUsIHR5cGUsIGtleU1hcH0pID0+IHtcblx0XHRcdGxldCB2YWx1ZSA9IHRoaXNbbmFtZV07XG5cdFx0XHQvLyBEb24ndCBzZXJpYWxpemUgbWlzc2luZyB2YWx1ZXMuXG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZSA9PT0gVHlwZS5PQkpFQ1QpIHtcblx0XHRcdFx0dmFsdWUgPSBnZXRLZXlGcm9tVmFsdWUoa2V5TWFwLCB2YWx1ZSk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IFR5cGUuQVJSQVlfTlVNQkVSIHx8IHR5cGUgPT09IFR5cGUuQVJSQVlfU1RSSU5HKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuam9pbihcIixcIik7XG5cdFx0XHR9XG5cdFx0XHRwcm9wcy5wdXNoKGAke25hbWV9PSR7dmFsdWV9YCk7XG5cdFx0fSk7XG5cdFx0Ly8gU2VyaWFsaXplIHByb3BlcnRpZXMgdGhhdCBjb3JyZXNwb25kIHRvIGhpZGluZyBVSSBjb250cm9scy5cblx0XHRnZXRIaWRlUHJvcHModGhpcykuZm9yRWFjaChwcm9wID0+IHtcblx0XHRcdHByb3BzLnB1c2goYCR7cHJvcH09JHt0aGlzW3Byb3BdfWApO1xuXHRcdH0pO1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcHJvcHMuam9pbihcIiZcIik7XG5cdH1cblxuXHQvKiogUmV0dXJucyBhbGwgdGhlIGhpZGRlbiBwcm9wZXJ0aWVzLiAqL1xuXHRnZXRIaWRkZW5Qcm9wcygpOiBzdHJpbmdbXSB7XG5cdFx0bGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblx0XHRmb3IgKGxldCBwcm9wIGluIHRoaXMpIHtcblx0XHRcdGlmIChlbmRzV2l0aChwcm9wLCBISURFX1NUQVRFX1NVRkZJWCkgJiYgU3RyaW5nKHRoaXNbcHJvcF0pID09PSBcInRydWVcIikge1xuXHRcdFx0XHRyZXN1bHQucHVzaChwcm9wLnJlcGxhY2UoSElERV9TVEFURV9TVUZGSVgsIFwiXCIpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdHNldEhpZGVQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIGhpZGRlbjogYm9vbGVhbikge1xuXHRcdHRoaXNbbmFtZSArIEhJREVfU1RBVEVfU1VGRklYXSA9IGhpZGRlbjtcblx0fVxufVxuIl19
