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
    var mappedDataset = dataset.map(function (point) { return "" + point.x + point.y + point.label; });
    return mappedDataset.filter(function (n, i, self) {
        return self.indexOf(n) == i;
    }).length;
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
            console.log(trainData);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy5ucG0vX25weC85NTM1My9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGF0YXNldC50cyIsInNyYy9oZWF0bWFwLnRzIiwic3JjL2xpbmVjaGFydC50cyIsInNyYy9ubi50cyIsInNyYy9wbGF5Z3JvdW5kLnRzIiwic3JjL3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQytDQSx5QkFBZ0MsVUFBa0IsRUFBRSxLQUFhO0lBQ2hFLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUM7SUFpQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDZixDQUFDO0FBbkNELDBDQW1DQztBQVFELDhCQUFxQyxVQUFrQixFQUFFLEtBQWE7SUFDckUsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztJQUM3QixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFHbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXpCLGtCQUFrQixFQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWE7UUFDdEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDaEQsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDaEQsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6QyxJQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxHQUFHLE9BQU8s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QUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDbEQsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELENBQUMsSUFBSSxNQUFNLENBQUM7UUFDWixDQUFDLElBQUksTUFBTSxDQUFDO1FBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBR0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFHMUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztRQUNsRCxDQUFDLElBQUksTUFBTSxDQUFDO1FBQ1osQ0FBQyxJQUFJLE1BQU0sQ0FBQztRQUNaLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNmLENBQUM7QUF4Q0QsZ0RBd0NDO0FBS0QseUJBQWdDLFVBQWtCLEVBQUUsS0FBYTtJQUVoRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFHekIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBRWxCLHFCQUFxQixDQUFRO1FBQzVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztJQUM3QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzQyxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDbEIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFFaEMsSUFBSSxjQUFjLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQyxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLGNBQWMsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUN0RCxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLGNBQWMsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUN0RCxJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNmLENBQUM7QUExQkQsMENBMEJDO0FBTUQsc0JBQTZCLFVBQWtCLEVBQUUsS0FBYTtJQUM3RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsSUFBSSxFQUFFLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtTQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNqQixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLElBQUksUUFBUSxHQUFHLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQWpCLENBQWlCLENBQUM7SUFFM0MsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztJQUM3QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDMUMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDMUMsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDZixDQUFDO0FBbkJELG9DQW1CQztBQUVELHlCQUFnQyxVQUFrQixFQUFFLEtBQWE7SUFDaEUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXpCLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUM7SUFDN0IsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7U0FDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2IsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWQsSUFBSSxTQUFTLEdBQ1o7UUFDQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2IsQ0FBQztJQUVILGtCQUFrQixDQUFDLEVBQUUsQ0FBQztRQUVyQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBYztnQkFBYixVQUFFLEVBQUUsVUFBRSxFQUFFLFlBQUk7WUFDL0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLEtBQUssR0FBRyxRQUFRLENBQUM7WUFDbEIsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFRCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDZixJQUFJLEVBQUUsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyQyxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNmLENBQUM7QUEzQ0QsMENBMkNDO0FBU0QsaUJBQXdCLEtBQVk7SUFDbkMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUMzQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7SUFDYixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFFZCxPQUFPLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUVwQixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFFNUMsT0FBTyxFQUFFLENBQUM7UUFFVixJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RCLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0FBQ0YsQ0FBQztBQWZELDBCQWVDO0FBRUQsY0FBYyxDQUFTO0lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUVELGVBQWUsQ0FBUztJQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxrQkFBa0IsQ0FBUztJQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUVELGNBQWMsQ0FBUztJQUN0QixNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBTUQscUJBQXFCLENBQVMsRUFBRSxDQUFTO0lBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFTRCxzQkFBc0IsSUFBUSxFQUFFLFFBQVk7SUFBdEIscUJBQUEsRUFBQSxRQUFRO0lBQUUseUJBQUEsRUFBQSxZQUFZO0lBQzNDLElBQUksRUFBVSxFQUFFLEVBQVUsRUFBRSxDQUFTLENBQUM7SUFDdEMsR0FBRyxDQUFDO1FBQ0gsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBRWhCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbEQsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUM1QyxDQUFDO0FBR0QsY0FBYyxDQUFRLEVBQUUsQ0FBUTtJQUMvQixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7Ozs7QUNsVkQsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBT3RCO0lBU0MsaUJBQ0MsS0FBYSxFQUFFLFVBQWtCLEVBQUUsT0FBeUIsRUFDNUQsT0FBeUIsRUFBRSxTQUE0QixFQUN2RCxZQUE4QjtRQVh2QixhQUFRLEdBQW9CLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFZbkUsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksT0FBTyxHQUFHLFlBQVksQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUU3QyxFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUUxQixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxDQUFDO1FBQ0YsQ0FBQztRQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7YUFDOUIsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUNmLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTthQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDO2FBQ2YsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUdsQyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBa0I7YUFDL0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNsQixLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ3hDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUtiLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7WUFDdkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQVU7YUFDdkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDZixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFZixTQUFTLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDbEMsS0FBSyxDQUNOO1lBQ0MsS0FBSyxFQUFLLEtBQUssT0FBSTtZQUNuQixNQUFNLEVBQUssTUFBTSxPQUFJO1lBQ3JCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLEdBQUcsRUFBRSxNQUFJLE9BQU8sT0FBSTtZQUNwQixJQUFJLEVBQUUsTUFBSSxPQUFPLE9BQUk7U0FDckIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQzthQUN2QyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQzthQUN6QixJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQzthQUMxQixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDNUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQzlDLEtBQUssQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO2FBQzdCLEtBQUssQ0FBQyxLQUFLLEVBQUssT0FBTyxPQUFJLENBQUM7YUFDNUIsS0FBSyxDQUFDLE1BQU0sRUFBSyxPQUFPLE9BQUksQ0FBQyxDQUFDO1FBRS9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQ3ZDO2dCQUNDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFFBQVEsRUFBRSxNQUFNO2FBQ2hCLENBQUMsQ0FBQyxLQUFLLENBQ1I7Z0JBRUMsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLE1BQU0sRUFBRSxHQUFHO2dCQUNYLEtBQUssRUFBRSxHQUFHO2FBQ1YsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ2IsSUFBSSxDQUFDLFdBQVcsRUFBRSxlQUFhLE9BQU8sU0FBSSxPQUFPLE1BQUcsQ0FBQyxDQUFDO1lBRXZELElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO2lCQUN4QixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFDbEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWxCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO2lCQUN4QixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFDbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDbkIsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7aUJBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsa0JBQWUsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLE9BQUcsQ0FBQztpQkFDekQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO2lCQUNuQixJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztpQkFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQztpQkFDL0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2QsQ0FBQztJQUNGLENBQUM7SUFFRCxrQ0FBZ0IsR0FBaEIsVUFBaUIsTUFBbUI7UUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELDhCQUFZLEdBQVosVUFBYSxNQUFtQjtRQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDekIsTUFBTSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsa0NBQWdCLEdBQWhCLFVBQWlCLElBQWdCLEVBQUUsVUFBbUI7UUFDckQsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN4QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXJCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN0RCxNQUFNLElBQUksS0FBSyxDQUNkLDJDQUEyQztnQkFDM0MseUJBQXlCLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBR0QsSUFBSSxPQUFPLEdBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQXdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pFLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTVDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3JDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQzdCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsS0FBSyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsQ0FBQztnQkFDRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUN2QixDQUFDO1FBQ0YsQ0FBQztRQUNELE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU8sK0JBQWEsR0FBckIsVUFBc0IsU0FBNEIsRUFBRSxNQUFtQjtRQUF2RSxpQkEwQkM7UUF4QkEsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25DLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQztZQUN2QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO21CQUMxQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUdILElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRzNELFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUdoRCxTQUFTO2FBQ1IsSUFBSSxDQUNMO1lBQ0MsRUFBRSxFQUFFLFVBQUMsQ0FBWSxJQUFLLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQWhCLENBQWdCO1lBQ3RDLEVBQUUsRUFBRSxVQUFDLENBQVksSUFBSyxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFoQixDQUFnQjtTQUN0QyxDQUFDO2FBQ0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFuQixDQUFtQixDQUFDLENBQUM7UUFHekMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFDRixjQUFDO0FBQUQsQ0FoTEEsQUFnTEMsSUFBQTtBQWhMWSwwQkFBTztBQWtMcEIsc0JBQTZCLE1BQWtCLEVBQUUsTUFBYztJQUM5RCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLHNEQUFzRDtZQUN0RSxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFDRCxJQUFJLE1BQU0sR0FBZSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQzNELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUM7UUFDaEQsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUM7WUFDaEQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBRVosR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDakMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDakMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixDQUFDO1lBQ0YsQ0FBQztZQUNELEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDdEMsQ0FBQztJQUNGLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2YsQ0FBQztBQXhCRCxvQ0F3QkM7Ozs7QUNsTkQ7SUFZQyw0QkFBWSxTQUE0QixFQUFFLFVBQW9CO1FBVnRELFNBQUksR0FBZ0IsRUFBRSxDQUFDO1FBT3ZCLFNBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3hCLFNBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBRy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFpQixDQUFDO1FBQzNDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDbEMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNwQyxJQUFJLE1BQU0sR0FBRyxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUMsQ0FBQztRQUNwRCxJQUFJLEtBQUssR0FBRyxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BELElBQUksTUFBTSxHQUFHLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFdEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTthQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUVwQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO2FBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNkLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJCLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDaEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ2pELElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQzthQUNuRCxNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ1gsSUFBSSxDQUFDLFdBQVcsRUFBRSxlQUFhLE1BQU0sQ0FBQyxJQUFJLFNBQUksTUFBTSxDQUFDLEdBQUcsTUFBRyxDQUFDLENBQUM7UUFFL0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7aUJBQ3JDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO2lCQUNyQixLQUFLLENBQ0w7Z0JBQ0MsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLGNBQWMsRUFBRSxPQUFPO2FBQ3ZCLENBQUMsQ0FBQztRQUNOLENBQUM7SUFDRixDQUFDO0lBRUQsa0NBQUssR0FBTDtRQUNDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUM5QixDQUFDO0lBRUQseUNBQVksR0FBWixVQUFhLFNBQW1CO1FBQWhDLGlCQVdDO1FBVkEsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztZQUNsQixLQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuQyxLQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixDQUFDO0lBRU8sbUNBQU0sR0FBZDtRQUFBLGlCQWFDO1FBWEEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUUzQyxJQUFJLFVBQVUsR0FBRyxVQUFDLFNBQWlCO1lBQ2xDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBYTtpQkFDN0IsQ0FBQyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQWhCLENBQWdCLENBQUM7aUJBQ3hCLENBQUMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDO1FBQ0YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztJQUNGLENBQUM7SUFDRix5QkFBQztBQUFELENBbkZBLEFBbUZDLElBQUE7QUFuRlksZ0RBQWtCOzs7O0FDSC9CO0lBZ0NDLGNBQVksRUFBVSxFQUFFLFVBQThCLEVBQUUsUUFBa0I7UUE3QjFFLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsU0FBSSxHQUFHLEdBQUcsQ0FBQztRQUVYLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFJckIscUJBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBRXJCLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFFZCxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBTWIsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFLaEIsdUJBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBUXRCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsQ0FBQztJQUNGLENBQUM7SUFHRCwyQkFBWSxHQUFaO1FBRUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNqRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNyRCxDQUFDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDcEIsQ0FBQztJQUNGLFdBQUM7QUFBRCxDQW5EQSxBQW1EQyxJQUFBO0FBbkRZLG9CQUFJO0FBMEVqQjtJQUFBO0lBT0EsQ0FBQztJQUFELGFBQUM7QUFBRCxDQVBBLEFBT0M7QUFOYyxhQUFNLEdBQ25CO0lBQ0MsS0FBSyxFQUFFLFVBQUMsTUFBYyxFQUFFLE1BQWM7UUFDckMsT0FBQSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUFsQyxDQUFrQztJQUNuQyxHQUFHLEVBQUUsVUFBQyxNQUFjLEVBQUUsTUFBYyxJQUFLLE9BQUEsTUFBTSxHQUFHLE1BQU0sRUFBZixDQUFlO0NBQ3hELENBQUM7QUFOUyx3QkFBTTtBQVVsQixJQUFZLENBQUMsSUFBSSxHQUFJLElBQVksQ0FBQyxJQUFJLElBQUksVUFBVSxDQUFDO0lBQ3JELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDVixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1AsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlCLENBQUM7QUFDRixDQUFDLENBQUM7QUFHRjtJQUFBO0lBZ0NBLENBQUM7SUFBRCxrQkFBQztBQUFELENBaENBLEFBZ0NDO0FBL0JjLGdCQUFJLEdBQ2pCO0lBQ0MsTUFBTSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUMsSUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBckIsQ0FBcUI7SUFDbEMsR0FBRyxFQUFFLFVBQUEsQ0FBQztRQUNMLElBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUM1QixDQUFDO0NBQ0QsQ0FBQztBQUNXLGdCQUFJLEdBQ2pCO0lBQ0MsTUFBTSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQWQsQ0FBYztJQUMzQixHQUFHLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQWQsQ0FBYztDQUN4QixDQUFDO0FBQ1csbUJBQU8sR0FDcEI7SUFDQyxNQUFNLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQXRCLENBQXNCO0lBQ25DLEdBQUcsRUFBRSxVQUFBLENBQUM7UUFDTCxJQUFJLE1BQU0sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7Q0FDRCxDQUFDO0FBQ1csa0JBQU0sR0FDbkI7SUFDQyxNQUFNLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEVBQUQsQ0FBQztJQUNkLEdBQUcsRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsRUFBRCxDQUFDO0NBQ1gsQ0FBQztBQUNXLGdCQUFJLEdBQ2pCO0lBQ0MsTUFBTSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBWCxDQUFXO0lBQ3hCLEdBQUcsRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVztDQUNyQixDQUFDO0FBL0JTLGtDQUFXO0FBbUN4QjtJQUFBO0lBV0EsQ0FBQztJQUFELDZCQUFDO0FBQUQsQ0FYQSxBQVdDO0FBVmMseUJBQUUsR0FDZjtJQUNDLE1BQU0sRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVztJQUN4QixHQUFHLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQTVCLENBQTRCO0NBQ3RDLENBQUM7QUFDVyx5QkFBRSxHQUNmO0lBQ0MsTUFBTSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQVgsQ0FBVztJQUN4QixHQUFHLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEVBQUQsQ0FBQztDQUNYLENBQUM7QUFWUyx3REFBc0I7QUFtQm5DO0lBd0JDLGNBQVksTUFBWSxFQUFFLElBQVUsRUFDakMsY0FBc0MsRUFBRSxRQUFrQjtRQXJCN0QsV0FBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDN0IsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUVmLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFYixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUVoQix1QkFBa0IsR0FBRyxDQUFDLENBQUM7UUFHdkIscUJBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBWXBCLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNyQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDakIsQ0FBQztJQUNGLENBQUM7SUFDRixXQUFDO0FBQUQsQ0FsQ0EsQUFrQ0MsSUFBQTtBQWxDWSxvQkFBSTtBQWlEakIsc0JBQ0MsWUFBc0IsRUFBRSxVQUE4QixFQUN0RCxnQkFBb0MsRUFDcEMsY0FBc0MsRUFDdEMsUUFBa0IsRUFBRSxRQUFrQjtJQUN0QyxJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0lBQ3BDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVYLElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQ3pELElBQUksYUFBYSxHQUFHLFFBQVEsS0FBSyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLElBQUksWUFBWSxHQUFHLFFBQVEsS0FBSyxDQUFDLENBQUM7UUFDbEMsSUFBSSxZQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0IsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbkMsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLEVBQUUsRUFBRSxDQUFDO1lBQ04sQ0FBQztZQUNELElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFDekIsYUFBYSxHQUFHLGdCQUFnQixHQUFHLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMxRCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVuQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3ZELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUM5RCxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVCLENBQUM7WUFDRixDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUM7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ2hCLENBQUM7QUFyQ0Qsb0NBcUNDO0FBWUQscUJBQTRCLE9BQWlCLEVBQUUsTUFBZ0I7SUFDOUQsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3REFBd0Q7WUFDdkUsa0JBQWtCLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUM5RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDOUMsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyQixDQUFDO0lBQ0YsQ0FBQztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDOUMsQ0FBQztBQXBCRCxrQ0FvQkM7QUFTRCxrQkFBeUIsT0FBaUIsRUFBRSxNQUFjLEVBQUUsU0FBd0I7SUFHbkYsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEQsVUFBVSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFHaEUsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsUUFBUSxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQ25FLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUlyQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QyxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN0RSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDbEMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUdELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzlDLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2pELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNqQixRQUFRLENBQUM7Z0JBQ1YsQ0FBQztnQkFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDM0IsQ0FBQztRQUNGLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixRQUFRLENBQUM7UUFDVixDQUFDO1FBQ0QsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMzQyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDbkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM5QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDeEQsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0FBQ0YsQ0FBQztBQTlDRCw0QkE4Q0M7QUFNRCx1QkFBOEIsT0FBaUIsRUFBRSxZQUFvQixFQUFFLGtCQUEwQjtJQUNoRyxHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUM5RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDOUMsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7Z0JBQ25FLElBQUksQ0FBQyxJQUFJLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUM7WUFDN0IsQ0FBQztZQUVELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDakQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLFFBQVEsQ0FBQztnQkFDVixDQUFDO2dCQUNELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjO29CQUNqQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFakMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO29CQUNuRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztvQkFHakUsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU07d0JBQzlCLENBQUMsWUFBWSxHQUFHLGtCQUFrQixDQUFDLEdBQUcsUUFBUSxDQUFDO29CQUNoRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxLQUFLLHNCQUFzQixDQUFDLEVBQUU7d0JBQ3BELElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRWxDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztvQkFDcEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDUCxJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQztvQkFDN0IsQ0FBQztvQkFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztvQkFDckIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztZQUNGLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztBQUNGLENBQUM7QUExQ0Qsc0NBMENDO0FBR0QscUJBQTRCLE9BQWlCLEVBQUUsWUFBcUIsRUFDN0QsUUFBNkI7SUFDbkMsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUNqRixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDOUMsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQixDQUFDO0lBQ0YsQ0FBQztBQUNGLENBQUM7QUFURCxrQ0FTQztBQUdELHVCQUE4QixPQUFpQjtJQUM5QyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZELHNDQUVDOzs7O0FDeFlELHlCQUEyQjtBQUMzQixxQ0FBZ0Q7QUFDaEQsaUNBU2lCO0FBQ2pCLHFDQUE0RDtBQUM1RCx5Q0FBK0M7QUFFL0MsSUFBSSxTQUFTLENBQUM7QUFPZCxnQkFBZ0IsQ0FBUztJQUN4QixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDUCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBRUQsY0FBYyxDQUFTO0lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUVELGVBQWUsQ0FBUztJQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxrQkFBa0IsQ0FBUztJQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUVELGFBQWEsQ0FBUztJQUNyQixNQUFNLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBR0QsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO0lBQ3JDLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQztJQUNuQixFQUFFLENBQUMsVUFBVSxFQUFFO1NBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQztTQUNkLEtBQUssQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDMUMsQ0FBQyxDQUFDLENBQUM7QUFFSCxxQkFBcUIsTUFBTTtJQUMxQixNQUFNLENBQUM7UUFDTixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFdBQVc7WUFDOUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNqQixRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLENBQUMsQ0FBQztJQUNILENBQUMsQ0FBQztBQUNILENBQUM7QUFFRCxJQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDckIsSUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLElBQU0sb0JBQW9CLEdBQUcsR0FBRyxDQUFDO0FBQ2pDLElBQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUVwQixJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdkIsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBR3ZCLElBQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFFNUIsSUFBSyxTQUVKO0FBRkQsV0FBSyxTQUFTO0lBQ2IseUNBQUksQ0FBQTtJQUFFLDZDQUFNLENBQUE7QUFDYixDQUFDLEVBRkksU0FBUyxLQUFULFNBQVMsUUFFYjtBQU9ELElBQUksTUFBTSxHQUFxQztJQUM5QyxHQUFHLEVBQUUsRUFBQyxDQUFDLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxFQUFELENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDO0lBQ25DLEdBQUcsRUFBRSxFQUFDLENBQUMsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUM7SUFDbkMsVUFBVSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsR0FBRyxDQUFDLEVBQUwsQ0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUM7SUFDaEQsVUFBVSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsR0FBRyxDQUFDLEVBQUwsQ0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUM7SUFDaEQsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsR0FBRyxDQUFDLEVBQUwsQ0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUM7SUFDaEQsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUM7SUFDckQsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUM7Q0FDckQsQ0FBQztBQUVGLElBQUksZ0JBQWdCLEdBQ25CO0lBQ0MsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUM7SUFDbEMsQ0FBQyxtQkFBbUIsRUFBRSxZQUFZLENBQUM7SUFDbkMsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDO0lBQzdCLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQztJQUM3QixDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUM7SUFDL0IsQ0FBQyxtQkFBbUIsRUFBRSxjQUFjLENBQUM7SUFDckMsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUM7SUFDckMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO0lBQzVCLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7SUFDcEMsQ0FBQyxxQkFBcUIsRUFBRSxvQkFBb0IsQ0FBQztJQUM3QyxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUM7SUFDM0IsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDO0lBQzVCLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxDQUFDO0lBQ3JDLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQztJQUN4QixDQUFDLFlBQVksRUFBRSxXQUFXLENBQUM7SUFDM0IsQ0FBQyxvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQztDQUN6QyxDQUFDO0FBRUg7SUFBQTtRQUNTLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFDZixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGFBQVEsR0FBaUMsSUFBSSxDQUFDO0lBOEN2RCxDQUFDO0lBM0NBLDRCQUFXLEdBQVg7UUFDQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsaUJBQWlCLEVBQUUsQ0FBQztZQUNyQixDQUFDO1lBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2IsQ0FBQztJQUNGLENBQUM7SUFFRCw0QkFBVyxHQUFYLFVBQVksUUFBc0M7UUFDakQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDMUIsQ0FBQztJQUVELHFCQUFJLEdBQUo7UUFDQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELHNCQUFLLEdBQUw7UUFDQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNGLENBQUM7SUFFTyxzQkFBSyxHQUFiLFVBQWMsZUFBdUI7UUFBckMsaUJBUUM7UUFQQSxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ1IsRUFBRSxDQUFDLENBQUMsZUFBZSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2IsQ0FBQztZQUNELE9BQU8sRUFBRSxDQUFDO1lBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNkLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRixhQUFDO0FBQUQsQ0FqREEsQUFpREMsSUFBQTtBQUVELElBQUksS0FBSyxHQUFHLGFBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBR3JDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO0lBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JCLENBQUM7QUFDRixDQUFDLENBQUMsQ0FBQztBQUVILElBQUksUUFBUSxHQUFpQyxFQUFFLENBQUM7QUFDaEQsSUFBSSxjQUFjLEdBQVcsSUFBSSxDQUFDO0FBRWxDLElBQUksT0FBTyxHQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLElBQUksT0FBTyxHQUNWLElBQUksaUJBQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFDaEUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUNwQixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtLQUNwQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDZCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDZCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBVTtLQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbEIsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUN4QyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDZCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDYixJQUFJLFNBQVMsR0FBZ0IsRUFBRSxDQUFDO0FBQ2hDLElBQUksUUFBUSxHQUFnQixFQUFFLENBQUM7QUFDL0IsSUFBSSxPQUFPLEdBQWdCLElBQUksQ0FBQztBQUNoQyxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFDdkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUMxQixJQUFJLFNBQVMsR0FBRyxJQUFJLDhCQUFrQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQzdELENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFFcEIsd0JBQXdCLE1BQW1CO0lBRTFDLElBQUksUUFBUSxHQUFHLGdCQUFnQixDQUFDO0lBQ2hDLElBQUksTUFBTSxHQUFpQixFQUFFLENBQUM7SUFDOUIsSUFBSSxPQUFPLEdBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNwQyxJQUFJLE9BQU8sR0FBVyxDQUFDLENBQUM7SUFDeEIsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDO0lBQ3ZCLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUUxQixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNsQixJQUFJLFNBQVMsR0FBVyxDQUFDLENBQUM7SUFDMUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsR0FBVyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNsQyxJQUFJLENBQUMsR0FBVyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNsQyxJQUFJLFFBQU0sR0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFbkMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixRQUFNLEdBQUcsTUFBTSxDQUFDLFFBQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNFLENBQUM7UUFDRCxJQUFJLElBQUksR0FBVyxRQUFNLENBQUM7UUFDMUIsSUFBSSxLQUFLLEdBQVcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxNQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUMsQ0FBQyxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNoQixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsU0FBUyxFQUFFLENBQUM7UUFDYixDQUFDO0lBQ0YsQ0FBQztJQUdELE1BQU0sQ0FBQyxJQUFJLENBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUNiLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDeEIsQ0FBQyxDQUNELENBQUM7SUFFRixJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQy9CLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztJQUVoQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN4QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakMsT0FBTyxFQUFFLENBQUM7WUFDVixRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM1QixDQUFDO0lBQ0YsQ0FBQztJQUVELElBQUksUUFBUSxHQUFXLENBQUMsQ0FBQztJQUN6QixRQUFRLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUV2QixJQUFJLE9BQU8sR0FBVyxDQUFDLENBQUM7SUFDeEIsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFFcEMsSUFBSSxXQUFXLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUNwQyxJQUFJLFdBQVcsR0FBRyxPQUFPLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBRXBELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUd6QixNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2YsQ0FBQztBQUdELHdCQUF3QixPQUFvQjtJQUMzQyxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFwQyxDQUFvQyxDQUFDLENBQUM7SUFDL0UsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7UUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNYLENBQUM7QUFFRDtJQUNDLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUN0QyxLQUFLLEVBQUUsQ0FBQztRQUNSLGlCQUFpQixFQUFFLENBQUM7UUFDcEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7UUFFM0MsaUJBQWlCLEVBQUUsQ0FBQztRQUNwQixNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQUEsU0FBUztRQUMzQixFQUFFLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQzFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNmLGlCQUFpQixFQUFFLENBQUM7UUFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsaUJBQWlCLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQzNDLFlBQVksRUFBRSxDQUFDO1FBQ2YsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzFELGNBQWMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQzFCLElBQUksVUFBVSxHQUFHLGdCQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRCxJQUFJLFVBQVUsR0FBRyx1QkFBZSxDQUFDLGdCQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFdkQsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxPQUFPLElBQUksVUFBVSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDO1FBQ1IsQ0FBQztRQUVELEtBQUssQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO1FBRzNCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBRTNCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsc0RBQXNELENBQUMsQ0FBQztZQUN6RixjQUFjLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMxQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7WUFLNUIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzVDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVUsS0FBSztnQkFDckMsSUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztnQkFDOUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxLQUFLO29CQUM5QixJQUFJLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO29CQUM3QixJQUFJLE1BQU0sR0FBUSxLQUFLLENBQUMsTUFBTSxDQUFDO29CQUMvQixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO29CQUN6QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN6QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzt3QkFDbkMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDekIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7NEJBQUMsS0FBSyxDQUFDO3dCQUMxQixJQUFJLEdBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNkLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsS0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztvQkFFNUIsQ0FBQztvQkFDRCxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUVoQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDdkUsU0FBUyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUN4QyxRQUFRLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFFcEMsT0FBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDaEMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDO29CQUs3RCxLQUFLLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakQsS0FBSyxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNyRSxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFFN0UsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO29CQUN6QixLQUFLLEVBQUUsQ0FBQztnQkFFVCxDQUFDLENBQUM7Z0JBRUYsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFHSixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUluQixjQUFjLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMxQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFHakIsWUFBWSxFQUFFLENBQUM7WUFFZixJQUFJLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO1lBQzdCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLENBQUM7WUFDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDO1lBR0QsS0FBSyxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsS0FBSyxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUU3RSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZCLGlCQUFpQixHQUFHLElBQUksQ0FBQztZQUN6QixLQUFLLEVBQUUsQ0FBQztRQUNULENBQUM7SUFFRixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksVUFBVSxHQUFHLHVCQUFlLENBQUMsZ0JBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFMUQsRUFBRSxDQUFDLE1BQU0sQ0FBQyx5QkFBdUIsVUFBVSxNQUFHLENBQUM7U0FDN0MsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUU1QixJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUNoRSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQzdCLElBQUksVUFBVSxHQUFHLG1CQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDO1FBQ1IsQ0FBQztRQUNELEtBQUssQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzlCLEtBQUssQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELEtBQUssQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLFlBQVksRUFBRSxDQUFDO1FBQ2YsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLGFBQWEsR0FBRyx1QkFBZSxDQUFDLG1CQUFXLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRW5FLEVBQUUsQ0FBQyxNQUFNLENBQUMsNEJBQTBCLGFBQWEsTUFBRyxDQUFDO1NBQ25ELE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFHNUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUM7UUFDUixDQUFDO1FBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUM7UUFDUixDQUFDO1FBQ0QsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNqRCxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQzVELEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNsQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztRQUNwQixPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFHSCxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFckQsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ3RELEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNoQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztRQUNwQixRQUFRLEVBQUUsQ0FBQztJQUNaLENBQUMsQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRWpELElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ3ZELEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNqQyxFQUFFLENBQUMsTUFBTSxDQUFDLG1DQUFtQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxZQUFZLEVBQUUsQ0FBQztRQUNmLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDN0UsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDSCxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDakQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFekUsMEJBQTBCLENBQVM7UUFDbEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUMzQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsWUFBWSxFQUFFLENBQUM7UUFDZixFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRSxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRSxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzdFLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixLQUFLLEVBQUUsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLEVBQUUsQ0FBQyxNQUFNLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFN0UsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ25ELEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM3QixFQUFFLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1RCxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRSxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRSxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzdFLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixLQUFLLEVBQUUsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0gsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLEVBQUUsQ0FBQyxNQUFNLENBQUMsK0JBQStCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFHN0UsSUFBSSxrQkFBa0IsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7UUFDL0QsS0FBSyxDQUFDLFVBQVUsR0FBRyxtQkFBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUNILGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsdUJBQWUsQ0FBQyxtQkFBVyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBRXJGLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUMxRCxLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDaEMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xCLGlCQUFpQixFQUFFLENBQUM7UUFDcEIsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBRUgsWUFBWSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRW5ELElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ2hFLEtBQUssQ0FBQyxjQUFjLEdBQUcsdUJBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkQsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFFSCxlQUFlLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSx1QkFBZSxDQUFDLHVCQUFlLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFFMUYsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ3hELEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdkMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDSCxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUV4RCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7UUFDaEQsS0FBSyxDQUFDLE9BQU8sR0FBRyxnQkFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQyxZQUFZLEVBQUUsQ0FBQztRQUNmLHFCQUFxQixFQUFFLENBQUM7UUFDeEIsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSx1QkFBZSxDQUFDLGdCQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFHcEUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzFELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO1NBQ3ZCLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDUixNQUFNLENBQUMsUUFBUSxDQUFDO1NBQ2hCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN0QixVQUFVLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1NBQ3ZDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO1NBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUM7U0FDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBSWQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtRQUNqQyxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQzthQUNqRCxxQkFBcUIsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNoQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM1QixTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQ3JCLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEIsQ0FBQztJQUNGLENBQUMsQ0FBQyxDQUFDO0lBR0gsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDcEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUMsQ0FBQztBQUNGLENBQUM7QUFFRCx3QkFBd0IsT0FBb0I7SUFDM0MsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQUEsSUFBSTtRQUNqQyxFQUFFLENBQUMsTUFBTSxDQUFDLGVBQWEsSUFBSSxDQUFDLEVBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELHlCQUF5QixPQUFvQixFQUFFLFNBQTRCO0lBQzFFLEdBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQzlELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVyQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QyxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNqRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFJLENBQUM7cUJBQ3hELEtBQUssQ0FDTDtvQkFDQyxtQkFBbUIsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDO29CQUM5QixjQUFjLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNyRCxRQUFRLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7aUJBQ2pDLENBQUM7cUJBQ0YsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2YsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0FBQ0YsQ0FBQztBQUVELGtCQUFrQixFQUFVLEVBQUUsRUFBVSxFQUFFLE1BQWMsRUFBRSxPQUFnQixFQUFFLFNBQTRCLEVBQUUsSUFBYztJQUN2SCxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUMzQixJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUUzQixJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FDekM7UUFDQyxPQUFPLEVBQUUsTUFBTTtRQUNmLElBQUksRUFBRSxTQUFPLE1BQVE7UUFDckIsV0FBVyxFQUFFLGVBQWEsQ0FBQyxTQUFJLENBQUMsTUFBRztLQUNuQyxDQUFDLENBQUM7SUFHSixTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FDNUI7UUFDQyxDQUFDLEVBQUUsQ0FBQztRQUNKLENBQUMsRUFBRSxDQUFDO1FBQ0osS0FBSyxFQUFFLFNBQVM7UUFDaEIsTUFBTSxFQUFFLFNBQVM7S0FDakIsQ0FBQyxDQUFDO0lBRUosSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQztJQUM3RCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFFekUsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQ3ZDO1lBQ0MsT0FBSyxFQUFFLFlBQVk7WUFDbkIsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNOLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLGFBQWEsRUFBRSxLQUFLO1NBQ3RDLENBQUMsQ0FBQztRQUNKLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksSUFBSSxHQUFHLGlCQUFpQixDQUFDO1lBQzdCLElBQUksT0FBTyxTQUFBLENBQUM7WUFDWixJQUFJLFNBQVMsU0FBQSxDQUFDO1lBQ2QsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQzdDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUMzQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2dCQUNELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO3FCQUNsQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxLQUFLLEdBQUcsR0FBRyxLQUFLLEdBQUcsT0FBTyxDQUFDO3FCQUNyRCxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQztxQkFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hCLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7UUFDRixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsU0FBUyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRWQsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQzVCO1lBQ0MsRUFBRSxFQUFFLFVBQVEsTUFBUTtZQUNwQixDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQztZQUNqQixDQUFDLEVBQUUsU0FBUyxHQUFHLFNBQVMsR0FBRyxDQUFDO1lBQzVCLEtBQUssRUFBRSxTQUFTO1lBQ2hCLE1BQU0sRUFBRSxTQUFTO1NBQ2pCLENBQUM7YUFDRCxFQUFFLENBQUMsWUFBWSxFQUFFO1lBQ2pCLGVBQWUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFDO2FBQ0QsRUFBRSxDQUFDLFlBQVksRUFBRTtZQUNqQixlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0QsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FDakU7UUFDQyxJQUFJLEVBQUUsWUFBVSxNQUFRO1FBQ3hCLE9BQU8sRUFBRSxRQUFRO0tBQ2pCLENBQUM7U0FDRCxLQUFLLENBQ0w7UUFDQyxRQUFRLEVBQUUsVUFBVTtRQUNwQixJQUFJLEVBQUssQ0FBQyxHQUFHLENBQUMsT0FBSTtRQUNsQixHQUFHLEVBQUssQ0FBQyxHQUFHLENBQUMsT0FBSTtLQUNqQixDQUFDO1NBQ0YsRUFBRSxDQUFDLFlBQVksRUFBRTtRQUNqQixjQUFjLEdBQUcsTUFBTSxDQUFDO1FBQ3hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdCLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25DLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2QyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUM7U0FDRCxFQUFFLENBQUMsWUFBWSxFQUFFO1FBQ2pCLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDdEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEMsc0JBQXNCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDcEYsQ0FBQyxDQUFDLENBQUM7SUFDSixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2IsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDZixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0IsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLEtBQUssRUFBRSxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNiLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELElBQUksV0FBVyxHQUFHLElBQUksaUJBQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQzdGLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFHRCxxQkFBcUIsT0FBb0I7SUFDeEMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU1QixHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRTlCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3ZELEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFHbkUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQW9CLENBQUM7SUFDOUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksRUFBb0IsQ0FBQztJQUNoRSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDMUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFHekIsSUFBSSxVQUFVLEdBQWlELEVBQUUsQ0FBQztJQUNsRSxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztTQUM3QixPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztTQUNyQixJQUFJLENBQUMsV0FBVyxFQUFFLGVBQWEsT0FBTyxTQUFJLE9BQU8sTUFBRyxDQUFDLENBQUM7SUFFeEQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLFlBQVksR0FBRyxHQUFHLENBQUM7SUFDdkIsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQWtCO1NBQ2pELE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbEMsV0FBVyxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssR0FBRyxTQUFTLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0RCxJQUFJLGNBQWMsR0FBRyxVQUFDLFNBQWlCLElBQUssT0FBQSxTQUFTLEdBQUcsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLEVBQTVCLENBQTRCLENBQUM7SUFHekUsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUUsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUUsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLElBQUksbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0lBRy9CLElBQUksRUFBRSxHQUFHLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzVCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFFLENBQUM7UUFDekIsSUFBSSxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDM0MsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUMsRUFBRSxJQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUMsQ0FBQztRQUM5QixRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0lBR0gsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxTQUFTLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDN0QsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN4QyxJQUFJLElBQUUsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUM5QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDaEQsbUJBQW1CLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbkMsSUFBSSxNQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksSUFBRSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLFVBQVUsQ0FBQyxNQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBQyxFQUFFLE1BQUEsRUFBRSxFQUFFLE1BQUEsRUFBQyxDQUFDO1lBQy9CLFFBQVEsQ0FBQyxJQUFFLEVBQUUsSUFBRSxFQUFFLE1BQUksQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFJLENBQUMsQ0FBQztZQUdsRCxJQUFJLFVBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3hDLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLGFBQWEsSUFBSSxJQUFJO2dCQUN4QixDQUFDLEtBQUssVUFBUSxHQUFHLENBQUM7Z0JBQ2xCLFlBQVksSUFBSSxVQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixZQUFZLENBQUMsS0FBSyxDQUNqQjtvQkFDQyxPQUFPLEVBQUUsSUFBSTtvQkFDYixHQUFHLEVBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFFLE9BQUk7b0JBQ3ZCLElBQUksRUFBSyxJQUFFLE9BQUk7aUJBQ2YsQ0FBQyxDQUFDO2dCQUNKLGFBQWEsR0FBRyxNQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3pCLENBQUM7WUFHRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2pELElBQUksSUFBSSxHQUFHLE1BQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLElBQUksSUFBSSxHQUFtQixRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQzVELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBUyxDQUFDO2dCQUU5RCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsSUFBSSxJQUFJO29CQUM5QixDQUFDLEtBQUssVUFBUSxHQUFHLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLGlCQUFpQixDQUFDLEVBQUU7b0JBQ3ZDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssYUFBYSxJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUM7b0JBQ3BELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLGFBQWE7b0JBQzlCLFNBQVMsQ0FBQyxNQUFNLElBQUksVUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDL0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDbEUsY0FBYyxDQUFDLEtBQUssQ0FDbkI7d0JBQ0MsT0FBTyxFQUFFLElBQUk7d0JBQ2IsR0FBRyxFQUFLLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFJO3dCQUMxQixJQUFJLEVBQUssUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQUk7cUJBQzNCLENBQUMsQ0FBQztvQkFDSixtQkFBbUIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDcEMsQ0FBQztZQUNGLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUdELEVBQUUsR0FBRyxLQUFLLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUMzQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLElBQUksRUFBRSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBQyxFQUFFLElBQUEsRUFBRSxFQUFFLElBQUEsRUFBQyxDQUFDO0lBRS9CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNqRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQ3hELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBR3pCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQ3BCLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxFQUMvQixpQkFBaUIsQ0FBQyxjQUFjLENBQUMsRUFDakMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUN4QyxDQUFDO0lBQ0YsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFFRCwyQkFBMkIsU0FBNEI7SUFDdEQsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBdUIsQ0FBQztJQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQzNDLENBQUM7QUFFRCw2QkFBNkIsQ0FBUyxFQUFFLFFBQWdCO0lBQ3ZELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUMzQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDO1NBQ25DLEtBQUssQ0FBQyxNQUFNLEVBQUssQ0FBQyxHQUFHLEVBQUUsT0FBSSxDQUFDLENBQUM7SUFFL0IsSUFBSSxDQUFDLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsZ0JBQWMsUUFBVSxDQUFDLENBQUM7SUFDekUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7U0FDdkIsSUFBSSxDQUFDLE9BQU8sRUFBRSwyQ0FBMkMsQ0FBQztTQUMxRCxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ1osSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUM7UUFDUixDQUFDO1FBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3hCLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixLQUFLLEVBQUUsQ0FBQztJQUNULENBQUMsQ0FBQztTQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7U0FDWCxJQUFJLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDO1NBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVkLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1NBQ3ZCLElBQUksQ0FBQyxPQUFPLEVBQUUsMkNBQTJDLENBQUM7U0FDMUQsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUNaLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDO1FBQ1IsQ0FBQztRQUNELEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN4QixpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUM7U0FDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1NBQ1gsSUFBSSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQztTQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFakIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNsRCxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUNwRSxDQUFDO0FBRUQseUJBQXlCLElBQWUsRUFBRSxVQUE4QixFQUFFLFdBQThCO0lBQ3ZHLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDeEMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEIsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQztJQUNSLENBQUM7SUFDRCxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7UUFDN0IsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDakIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQzlCLFVBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDOUMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixVQUFzQixDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzVDLENBQUM7Z0JBQ0QsUUFBUSxFQUFFLENBQUM7WUFDWixDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRTtZQUNwQixFQUFFLENBQUMsQ0FBRSxFQUFFLENBQUMsS0FBYSxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxlQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNoRCxDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDRixLQUFLLENBQUMsSUFBSSxFQUF1QixDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNyQyxVQUFzQixDQUFDLE1BQU07UUFDN0IsVUFBc0IsQ0FBQyxJQUFJLENBQUM7SUFDOUIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUM7SUFDM0QsU0FBUyxDQUFDLEtBQUssQ0FDZDtRQUNDLE1BQU0sRUFBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFJO1FBQ2xDLEtBQUssRUFBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQUk7UUFDNUIsU0FBUyxFQUFFLE9BQU87S0FDbEIsQ0FBQyxDQUFDO0lBQ0osU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7U0FDeEIsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7U0FDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QixTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUN2QixRQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRUQsa0JBQ0MsS0FBYyxFQUFFLFVBQXdELEVBQ3hFLE9BQW9CLEVBQUUsU0FBNEIsRUFDbEQsT0FBZ0IsRUFBRSxLQUFhLEVBQUUsTUFBYztJQUMvQyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNwRCxJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QyxJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQyxJQUFJLEtBQUssR0FBRztRQUNYLE1BQU0sRUFDTDtZQUNDLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxHQUFHLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQztZQUNoQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUU7U0FDWjtRQUNGLE1BQU0sRUFDTDtZQUNDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLFNBQVMsR0FBRyxDQUFDO1lBQzFCLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBRTtTQUN2RDtLQUNGLENBQUM7SUFDRixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQVYsQ0FBVSxDQUFDLENBQUM7SUFDN0QsSUFBSSxDQUFDLElBQUksQ0FDUjtRQUNDLGNBQWMsRUFBRSxtQkFBbUI7UUFDbkMsT0FBSyxFQUFFLE1BQU07UUFDYixFQUFFLEVBQUUsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbEQsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ3JCLENBQUMsQ0FBQztJQUlKLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQ3RCLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM3QixJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztTQUMzQixFQUFFLENBQUMsWUFBWSxFQUFFO1FBQ2pCLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRTtRQUNwQixlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2IsQ0FBQztBQVNELGdDQUFnQyxPQUFvQixFQUFFLFNBQWtCO0lBQ3ZFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDZixRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2QsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQUEsSUFBSTtZQUNqQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMzQixRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsQ0FBQztJQUNGLENBQUM7SUFDRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkUsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXZFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZixFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBQSxJQUFJO2dCQUNqQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1lBRUgsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFDLENBQUM7UUFDRixDQUFDO1FBQ0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFFOUIsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFJLEtBQUssR0FBRyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFBLElBQUk7Z0JBQ2pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBRWYsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0FBQ0YsQ0FBQztBQUVELHlCQUF5QixPQUFvQjtJQUM1QyxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQztJQUV6QixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUM5RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDOUMsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUMzQyxDQUFDO0lBQ0YsQ0FBQztJQUNELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztBQUN6QixDQUFDO0FBRUQsMEJBQTBCLE9BQW9CO0lBQzdDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztJQUN0QixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUM5RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsYUFBYSxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUM7UUFDckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDOUMsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLGFBQWEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUN6QyxDQUFDO0lBQ0YsQ0FBQztJQUNELE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFDdEIsQ0FBQztBQUVELGlCQUFpQixPQUFvQixFQUFFLFVBQXVCO0lBQzdELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNiLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzVDLElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixJQUFJLEtBQUssR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCwyQ0FBMkMsT0FBb0IsRUFBRSxVQUF1QjtJQUN2RixJQUFJLG1CQUFtQixHQUFHLENBQUMsQ0FBQztJQUM1QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM1QyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxLQUFLLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLElBQUksVUFBVSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLE9BQU8sR0FBRyxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxtQkFBbUIsSUFBSSxPQUFPLENBQUE7SUFDL0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztBQUM1QixDQUFDO0FBRUQsa0JBQWtCLFNBQWlCO0lBQWpCLDBCQUFBLEVBQUEsaUJBQWlCO0lBRWxDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRTlDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV4QixzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0MsSUFBSSxVQUFVLEdBQUcsY0FBYyxJQUFJLElBQUk7UUFDdEMsY0FBYyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQy9DLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBR2pFLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztTQUMzQyxJQUFJLENBQUMsVUFBVSxJQUFzQztRQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdEYsQ0FBQyxDQUFDLENBQUM7SUFFSixpQkFBaUIsQ0FBUztRQUN6QixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUM7UUFDbkIsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsbUJBQW1CLENBQVM7UUFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELHVCQUF1QixDQUFTO1FBQy9CLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCwwQkFBMEIsQ0FBUztRQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsa0JBQWtCLENBQVM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBSUQsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDO0lBQzNCLElBQUksWUFBWSxHQUFHLFNBQVMsQ0FBQztJQUM3QixJQUFJLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUM1RCxJQUFJLGlCQUFpQixHQUFHLGNBQWMsQ0FBQztJQUd2QyxFQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUMzRCxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUN6RCxFQUFFLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7SUFDcEUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQ25FLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRUQ7SUFDQyxJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFDMUIsR0FBRyxDQUFDLENBQUMsSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEIsQ0FBQztJQUNGLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2YsQ0FBQztBQUVELHdCQUF3QixDQUFTLEVBQUUsQ0FBUztJQUMzQyxJQUFJLEtBQUssR0FBYSxFQUFFLENBQUM7SUFDekIsR0FBRyxDQUFDLENBQUMsSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDO0lBQ0YsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZCxDQUFDO0FBRUQ7SUFDQyxJQUFJLEVBQUUsQ0FBQztJQUNQLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUUsQ0FBQztRQUMxQixJQUFJLEtBQUssR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3pFLENBQUM7SUFDRixDQUFDLENBQUMsQ0FBQztJQUdILGdCQUFnQixHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1QyxhQUFhLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFMUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFdEMsSUFBSSxtQ0FBbUMsR0FBVyxpQ0FBaUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEcsSUFBSSxrQ0FBa0MsR0FBVyxpQ0FBaUMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEcsY0FBYyxHQUFHLENBQUMsbUNBQW1DLEdBQUUsa0NBQWtDLENBQUMsR0FBQyxhQUFhLENBQUM7SUFHekcsUUFBUSxFQUFFLENBQUM7QUFDWixDQUFDO0FBRUQsMEJBQWlDLE9BQW9CO0lBQ3BELElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDbEUsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzlDLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzlDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdCLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDaEIsQ0FBQztBQWJELDRDQWFDO0FBRUQsZUFBZSxTQUFpQjtJQUFqQiwwQkFBQSxFQUFBLGlCQUFpQjtJQUMvQixTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbEIsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoQixpQkFBaUIsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFZixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsZUFBZSxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ3BELEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUN6RCxFQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFJckQsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNULElBQUksU0FBUyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzVDLElBQUksS0FBSyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9ELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLGVBQU8sQ0FBQyxVQUFVLENBQUM7UUFDNUQsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDN0MsT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQ2xFLEtBQUssQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUQsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUV4QyxJQUFJLG1DQUFtQyxHQUFXLGlDQUFpQyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN4RyxJQUFJLGtDQUFrQyxHQUFXLGlDQUFpQyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0RyxjQUFjLEdBQUcsQ0FBQyxtQ0FBbUMsR0FBRyxrQ0FBa0MsQ0FBQyxHQUFDLGFBQWEsQ0FBQztJQUUxRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hCLENBQUM7QUFFRDtJQUNDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sQ0FBQztJQUNSLENBQUM7SUFFRCxFQUFFLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDN0MsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQy9DLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFM0IsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFhLEtBQUssQ0FBQyxRQUFRLFVBQU8sRUFBRSxVQUFDLEdBQUcsRUFBRSxZQUFZO1FBQzdELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDVCxNQUFNLEdBQUcsQ0FBQztRQUNYLENBQUM7UUFDRCxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTFDLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsQixFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FDM0I7Z0JBQ0MsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLGVBQWUsRUFBRSxNQUFNO2FBQ3ZCLENBQUM7aUJBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLENBQUM7SUFDRixDQUFDLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRDtJQUNDLHlCQUF5QixNQUFNLEVBQUUsYUFBYTtRQUM3QyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDWixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDWixNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbEMsSUFBSSxDQUFDLE9BQU8sQ0FDWCxVQUFVLENBQUM7WUFDVixPQUFPLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFeEMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztRQUNKLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVsRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLGVBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxDQUFDLElBQUksT0FBTyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksTUFBTSxHQUNULFFBQVEsQ0FBQyxhQUFhLENBQUMseUJBQXVCLE9BQU8sTUFBRyxDQUFDLENBQUM7WUFDM0QsSUFBSSxhQUFhLEdBQUcsZ0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV0QyxlQUFlLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBR3hDLENBQUM7SUFDRixDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxlQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMxQyxHQUFHLENBQUMsQ0FBQyxJQUFJLFVBQVUsSUFBSSxtQkFBVyxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLE1BQU0sR0FDVCxRQUFRLENBQUMsYUFBYSxDQUFDLDRCQUEwQixVQUFVLE1BQUcsQ0FBQyxDQUFDO1lBQ2pFLElBQUksYUFBYSxHQUFHLG1CQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDNUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN4QyxDQUFDO0lBQ0YsQ0FBQztBQUNGLENBQUM7QUFFRDtJQUVDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN6QyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtRQUN2QixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLFNBQU8sSUFBTSxDQUFDLENBQUM7UUFDM0MsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQywwQ0FBd0MsSUFBTSxDQUFDLENBQUM7UUFDOUQsQ0FBQztRQUNELFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxDQUFDO0lBSUgsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQy9DLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQVU7WUFBVCxZQUFJLEVBQUUsVUFBRTtRQUNsQyxJQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUN0QyxJQUFJLENBQUMsT0FBTyxFQUFFLG1EQUFtRCxDQUFDLENBQUM7UUFDckUsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7YUFDL0IsSUFBSSxDQUNKO1lBQ0MsSUFBSSxFQUFFLFVBQVU7WUFDaEIsT0FBSyxFQUFFLHFCQUFxQjtTQUM1QixDQUFDLENBQUM7UUFDTCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBQ0QsS0FBSyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDbEIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xCLGlCQUFpQixFQUFFLENBQUM7WUFDcEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztpQkFDOUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDbEIsSUFBSSxDQUFDLE9BQU8sRUFBRSwyQkFBMkIsQ0FBQzthQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZCxDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUM7U0FDOUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFFRCxzQkFBc0IsU0FBaUI7SUFBakIsMEJBQUEsRUFBQSxpQkFBaUI7SUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRWhCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLGVBQU8sQ0FBQyxVQUFVLENBQUM7UUFDdEQsbUJBQW1CLEdBQUcsb0JBQW9CLENBQUM7SUFFNUMsSUFBSSxTQUFTLENBQUM7SUFDZCxJQUFJLElBQUksR0FBZ0IsRUFBRSxDQUFDO0lBRTNCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBZWpCLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxLQUFLLGVBQU8sQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ3hGLElBQUksR0FBRyxTQUFTLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxQyxpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDckUsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFDRCxLQUFLLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRCxLQUFLLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRCxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyRSxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyRSxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBRTdFLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBRTlELENBQUM7QUFFRCxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM1QixJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztBQUU5QjtJQUNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQztJQUNSLENBQUM7SUFDRCxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDO0lBQ25CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFJLEdBQUcsa0JBQWdCLEtBQUssQ0FBQyxRQUFVLENBQUM7SUFDekMsQ0FBQztJQUNELEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRUQ7SUFDQyxFQUFFLENBQUMsTUFBTSxFQUNSO1FBQ0MsT0FBTyxFQUFFLE9BQU87UUFDaEIsYUFBYSxFQUFFLHFCQUFxQjtRQUNwQyxXQUFXLEVBQUUsaUJBQWlCLEdBQUcsU0FBUyxHQUFHLFdBQVc7UUFDeEQsVUFBVSxFQUFFLEtBQUssQ0FBQyxRQUFRLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsUUFBUTtLQUN4RCxDQUFDLENBQUM7SUFDSixpQkFBaUIsR0FBRyxLQUFLLENBQUM7QUFDM0IsQ0FBQztBQUVELHVCQUF1QixJQUFJO0lBQzFCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDOUMsR0FBRyxDQUFDLGNBQWMsQ0FDakIsT0FBTyxFQUNQLElBQUksRUFDSixJQUFJLEVBQ0osTUFBTSxFQUNOLENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLEVBQ0QsS0FBSyxFQUNMLEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLENBQUMsRUFDRCxJQUFJLENBQUMsQ0FBQztJQUNQLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUVELHFCQUFxQixFQUFFLENBQUM7QUFFeEIsT0FBTyxFQUFFLENBQUM7QUFDVixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ1osWUFBWSxFQUFFLENBQUM7Ozs7QUNqN0NmLHlCQUEyQjtBQUMzQixtQ0FBcUM7QUFJckMsSUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUM7QUFHdkIsUUFBQSxXQUFXLEdBQTZDO0lBQ2xFLE1BQU0sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUk7SUFDM0IsTUFBTSxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSTtJQUMzQixTQUFTLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPO0lBQ2pDLFFBQVEsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU07SUFDL0IsTUFBTSxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSTtDQUMzQixDQUFDO0FBR1MsUUFBQSxlQUFlLEdBQWlEO0lBQzFFLE1BQU0sRUFBRSxJQUFJO0lBQ1osSUFBSSxFQUFFLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFO0lBQ2xDLElBQUksRUFBRSxFQUFFLENBQUMsc0JBQXNCLENBQUMsRUFBRTtDQUNsQyxDQUFDO0FBR1MsUUFBQSxRQUFRLEdBQTZDO0lBQy9ELFFBQVEsRUFBRSxPQUFPLENBQUMsa0JBQWtCO0lBQ3BDLEtBQUssRUFBRSxPQUFPLENBQUMsZUFBZTtJQUM5QixPQUFPLEVBQUUsT0FBTyxDQUFDLG9CQUFvQjtJQUNyQyxRQUFRLEVBQUUsT0FBTyxDQUFDLGtCQUFrQjtJQUNwQyxNQUFNLEVBQUUsT0FBTyxDQUFDLGVBQWU7Q0FDL0IsQ0FBQztBQUdTLFFBQUEsV0FBVyxHQUE2QztJQUNsRSxXQUFXLEVBQUUsT0FBTyxDQUFDLFlBQVk7SUFDakMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxlQUFlO0NBQ3BDLENBQUM7QUFFRix5QkFBZ0MsR0FBUSxFQUFFLEtBQVU7SUFDbkQsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ1osQ0FBQztJQUNGLENBQUM7SUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ2xCLENBQUM7QUFQRCwwQ0FPQztBQUVELGtCQUFrQixDQUFTLEVBQUUsTUFBYztJQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxNQUFNLENBQUM7QUFDNUMsQ0FBQztBQUVELHNCQUFzQixHQUFRO0lBQzdCLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUMxQixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQixDQUFDO0lBQ0YsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDZixDQUFDO0FBTUQsSUFBWSxJQU9YO0FBUEQsV0FBWSxJQUFJO0lBQ2YsbUNBQU0sQ0FBQTtJQUNOLG1DQUFNLENBQUE7SUFDTiwrQ0FBWSxDQUFBO0lBQ1osK0NBQVksQ0FBQTtJQUNaLHFDQUFPLENBQUE7SUFDUCxtQ0FBTSxDQUFBO0FBQ1AsQ0FBQyxFQVBXLElBQUksR0FBSixZQUFJLEtBQUosWUFBSSxRQU9mO0FBRUQsSUFBWSxPQUdYO0FBSEQsV0FBWSxPQUFPO0lBQ2xCLHlEQUFjLENBQUE7SUFDZCxpREFBVSxDQUFBO0FBQ1gsQ0FBQyxFQUhXLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQUdsQjtBQUVVLFFBQUEsUUFBUSxHQUFHO0lBQ3JCLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxjQUFjO0lBQ3hDLFlBQVksRUFBRSxPQUFPLENBQUMsVUFBVTtDQUNoQyxDQUFDO0FBU0Y7SUFBQTtRQXVDQyxrQkFBYSxHQUFHLEdBQUcsQ0FBQztRQUNwQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUNqQixxQkFBZ0IsR0FBRyxHQUFHLENBQUM7UUFDdkIsaUJBQVksR0FBRyxHQUFHLENBQUM7UUFDbkIsdUJBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixhQUFRLEdBQVcsSUFBSSxDQUFDO1FBQ3hCLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ25CLGVBQVUsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztRQUNwQyxtQkFBYyxHQUE4QixJQUFJLENBQUM7UUFDakQsWUFBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7UUFDakMsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLG9CQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLHdCQUFtQixHQUFVLEVBQUUsQ0FBQztRQUNoQyxpQkFBWSxHQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsTUFBQyxHQUFHLElBQUksQ0FBQztRQUNULE1BQUMsR0FBRyxJQUFJLENBQUM7UUFDVCxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsU0FBSSxHQUFHLEtBQUssQ0FBQztRQUNiLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsU0FBSSxHQUFHLEtBQUssQ0FBQztRQUNiLFNBQUksR0FBZ0IsRUFBRSxDQUFDO1FBQ3ZCLFlBQU8sR0FBMEIsT0FBTyxDQUFDLG9CQUFvQixDQUFDO1FBQzlELGVBQVUsR0FBMEIsT0FBTyxDQUFDLFlBQVksQ0FBQztJQXFIMUQsQ0FBQztJQS9HTyxzQkFBZ0IsR0FBdkI7UUFDQyxJQUFJLEdBQUcsR0FBOEIsRUFBRSxDQUFDO1FBQ3hDLEdBQUcsQ0FBQyxDQUFpQixVQUF3QyxFQUF4QyxLQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQXhDLGNBQXdDLEVBQXhDLElBQXdDO1lBQXhELElBQUksUUFBUSxTQUFBO1lBQ1osSUFBQSx3QkFBbUMsRUFBbEMsY0FBSSxFQUFFLGFBQUssQ0FBd0I7WUFDeEMsR0FBRyxDQUFDLE1BQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUNsQjtRQUNELElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFFeEIsZ0JBQWdCLElBQVk7WUFDM0IsTUFBTSxDQUFDLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ3BFLENBQUM7UUFFRCxvQkFBb0IsS0FBYTtZQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBR0QsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFvQjtnQkFBbkIsY0FBSSxFQUFFLGNBQUksRUFBRSxrQkFBTTtZQUN2QyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNkLEtBQUssSUFBSSxDQUFDLE1BQU07b0JBQ2YsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3BCLE1BQU0sS0FBSyxDQUFDLDZDQUE2Qzs0QkFDeEQsMEJBQTBCLENBQUMsQ0FBQztvQkFDOUIsQ0FBQztvQkFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLENBQUM7b0JBQ0QsS0FBSyxDQUFDO2dCQUNQLEtBQUssSUFBSSxDQUFDLE1BQU07b0JBQ2YsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFbEIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMxQixDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUCxLQUFLLElBQUksQ0FBQyxNQUFNO29CQUNmLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3pCLENBQUM7b0JBQ0QsS0FBSyxDQUFDO2dCQUNQLEtBQUssSUFBSSxDQUFDLE9BQU87b0JBQ2hCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxPQUFPLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUN0RCxDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUCxLQUFLLElBQUksQ0FBQyxZQUFZO29CQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ2pELENBQUM7b0JBQ0QsS0FBSyxDQUFDO2dCQUNQLEtBQUssSUFBSSxDQUFDLFlBQVk7b0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUDtvQkFDQyxNQUFNLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1lBQ2xFLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztRQUdILFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1lBQzdCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNkLENBQUM7SUFLRCx5QkFBUyxHQUFUO1FBQUEsaUJBcUJDO1FBbkJBLElBQUksS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUN6QixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQW9CO2dCQUFuQixjQUFJLEVBQUUsY0FBSSxFQUFFLGtCQUFNO1lBQ3ZDLElBQUksS0FBSyxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV2QixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDO1lBQ1IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsS0FBSyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDeEMsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLENBQUM7WUFDRCxLQUFLLENBQUMsSUFBSSxDQUFJLElBQUksU0FBSSxLQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUVILFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1lBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUksSUFBSSxTQUFJLEtBQUksQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBR0QsOEJBQWMsR0FBZDtRQUNDLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUMxQixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEQsQ0FBQztRQUNGLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2YsQ0FBQztJQUVELCtCQUFlLEdBQWYsVUFBZ0IsSUFBWSxFQUFFLE1BQWU7UUFDNUMsSUFBSSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUN6QyxDQUFDO0lBQ0YsWUFBQztBQUFELENBL0xBLEFBK0xDO0FBOUxlLFdBQUssR0FDbkI7SUFDQyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLG1CQUFXLEVBQUM7SUFDNUQ7UUFDQyxJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTTtRQUNqQixNQUFNLEVBQUUsdUJBQWU7S0FDdkI7SUFDRCxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDdEMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxnQkFBUSxFQUFDO0lBQ3RELEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsbUJBQVcsRUFBQztJQUM1RCxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDekMsRUFBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDN0MsRUFBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDL0MsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQ2xDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBQztJQUMvQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDakMsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQzFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUN4QyxFQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDMUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQy9CLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUMvQixFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDckMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQ3RDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUN0QyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDbEMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQ2xDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUNsQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDbEMsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQzFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNyQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLGdCQUFRLEVBQUM7SUFDdEQsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQ3RDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztDQUN0QyxDQUFDO0FBbkNTLHNCQUFLIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4vKipcbiAqIEEgdHdvIGRpbWVuc2lvbmFsIGV4YW1wbGU6IHggYW5kIHkgY29vcmRpbmF0ZXMgd2l0aCB0aGUgbGFiZWwuXG4gKi9cbmV4cG9ydCB0eXBlIEV4YW1wbGUyRCA9IHtcblx0eDogbnVtYmVyLFxuXHR5OiBudW1iZXIsXG5cdGxhYmVsOiBudW1iZXJcbn07XG5cbnR5cGUgUG9pbnQgPSB7XG5cdFx0eDogbnVtYmVyLFxuXHRcdHk6IG51bWJlclxuXHR9O1xuXG5leHBvcnQgdHlwZSBEYXRhR2VuZXJhdG9yID0gKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcikgPT4gRXhhbXBsZTJEW107XG5cbmludGVyZmFjZSBIVE1MSW5wdXRFdmVudCBleHRlbmRzIEV2ZW50IHtcblx0dGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50ICYgRXZlbnRUYXJnZXQ7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gQ0xBU1NJRklDQVRJT05cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIEJyaW5nIFlvdXIgT3duIERhdGFcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlCWU9EYXRhKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6IEV4YW1wbGUyRFtdIHtcblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0Ly8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuXHQvLyB+IHZhciBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHQvLyB+IHZhciBkYXRhO1xuXG5cdC8vIH4gdmFyIGlucHV0QllPRCA9IGQzLnNlbGVjdChcIiNpbnB1dEZpbGVCWU9EXCIpO1xuXHQvLyB+IGlucHV0QllPRC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSAvLzogRXhhbXBsZTJEW11cblx0Ly8gfiB7XG5cdC8vIH4gdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cdC8vIH4gdmFyIG5hbWUgPSB0aGlzLmZpbGVzWzBdLm5hbWU7XG5cdC8vIH4gcmVhZGVyLnJlYWRBc1RleHQodGhpcy5maWxlc1swXSk7XG5cdC8vIH4gcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KVxuXHQvLyB+IHtcblx0Ly8gfiB2YXIgdGFyZ2V0OiBhbnkgPSBldmVudC50YXJnZXQ7XG5cdC8vIH4gZGF0YSA9IHRhcmdldC5yZXN1bHQ7XG5cdC8vIH4gbGV0IHMgPSBkYXRhLnNwbGl0KFwiXFxuXCIpO1xuXHQvLyB+IGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKylcblx0Ly8gfiB7XG5cdC8vIH4gbGV0IHNzID0gc1tpXS5zcGxpdChcIixcIik7XG5cdC8vIH4gaWYgKHNzLmxlbmd0aCAhPSAzKSBicmVhaztcblx0Ly8gfiBsZXQgeCA9IHNzWzBdO1xuXHQvLyB+IGxldCB5ID0gc3NbMV07XG5cdC8vIH4gbGV0IGxhYmVsID0gc3NbMl07XG5cdC8vIH4gcG9pbnRzLnB1c2goe3gseSxsYWJlbH0pO1xuXHQvLyB+IGNvbnNvbGUubG9nKHBvaW50c1tpXS54K1wiLFwiK3BvaW50c1tpXS55K1wiLFwiK3BvaW50c1tpXS5sYWJlbCk7XG5cdC8vIH4gfVxuXHQvLyB+IGNvbnNvbGUubG9nKFwiODEgZGF0YXNldC50czogcG9pbnRzLmxlbmd0aCA9IFwiICsgcG9pbnRzLmxlbmd0aCk7XG5cdC8vIH4gfTtcblx0Ly8gfiBjb25zb2xlLmxvZyhcIjgzIGRhdGFzZXQudHM6IHBvaW50cy5sZW5ndGggPSBcIiArIHBvaW50cy5sZW5ndGgpO1xuXHQvLyB+IH0pO1xuXHQvLyB+IGNvbnNvbGUubG9nKFwiODUgZmlsZW5hbWU6IFwiICsgbmFtZSk7XG5cdC8vIH4gY29uc29sZS5sb2coXCI4NiBkYXRhc2V0LnRzOiBwb2ludHMubGVuZ3RoID0gXCIgKyBwb2ludHMubGVuZ3RoKTtcblx0cmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBDTEFTU0lGWSBHQVVTU0lBTiBDTFVTVEVSU1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeVR3b0dhdXNzRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdGxldCB2YXJpYW5jZSA9IDAuNTtcblxuXHQvLyBBV0cgTm9pc2UgVmFyaWFuY2UgPSBTaWduYWwgLyAxMF4oU05SZEIvMTApXG5cdGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHRmdW5jdGlvbiBnZW5HYXVzcyhjeDogbnVtYmVyLCBjeTogbnVtYmVyLCBsYWJlbDogbnVtYmVyKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzIC8gMjsgaSsrKSB7XG5cdFx0XHRsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIHZhcmlhbmNlICogZE5vaXNlKTtcblx0XHRcdGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgdmFyaWFuY2UgKiBkTm9pc2UpO1xuXHRcdFx0bGV0IHNpZ25hbFggPSBub3JtYWxSYW5kb20oY3gsIHZhcmlhbmNlKTtcblx0XHRcdGxldCBzaWduYWxZID0gbm9ybWFsUmFuZG9tKGN5LCB2YXJpYW5jZSk7XG5cdFx0XHRsZXQgeCA9IHNpZ25hbFggKyBub2lzZVg7XG5cdFx0XHRsZXQgeSA9IHNpZ25hbFkgKyBub2lzZVk7XG5cdFx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0XHR9XG5cdH1cblxuXHRnZW5HYXVzcygyLCAyLCAxKTsgLy8gR2F1c3NpYW4gd2l0aCBwb3NpdGl2ZSBleGFtcGxlcy5cblx0Z2VuR2F1c3MoLTIsIC0yLCAtMSk7IC8vIEdhdXNzaWFuIHdpdGggbmVnYXRpdmUgZXhhbXBsZXMuXG5cdHJldHVybiBwb2ludHM7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vIENMQVNTSUZZIFNQSVJBTFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlTcGlyYWxEYXRhKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6IEV4YW1wbGUyRFtdIHtcblxuXHQvLyBBV0cgTm9pc2UgVmFyaWFuY2UgPSBTaWduYWwgLyAxMF4oU05SZEIvMTApXG5cdGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRsZXQgbiA9IG51bVNhbXBsZXMgLyAyO1xuXG5cdGZ1bmN0aW9uIGdlblNwaXJhbChkZWx0YVQ6IG51bWJlciwgbGFiZWw6IG51bWJlcikge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRsZXQgciA9IGkgLyBuICogNTtcblx0XHRcdGxldCByMiA9IHIgKiByO1xuXHRcdFx0bGV0IHQgPSAxLjc1ICogaSAvIG4gKiAyICogTWF0aC5QSSArIGRlbHRhVDtcblx0XHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgciAqIGROb2lzZSk7XG5cdFx0XHRsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIHIgKiBkTm9pc2UpO1xuXHRcdFx0bGV0IHggPSByICogTWF0aC5zaW4odCkgKyBub2lzZVg7XG5cdFx0XHRsZXQgeSA9IHIgKiBNYXRoLmNvcyh0KSArIG5vaXNlWTtcblx0XHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHRcdH1cblx0fVxuXG5cdGdlblNwaXJhbCgwLCAxKTsgLy8gUG9zaXRpdmUgZXhhbXBsZXMuXG5cdGdlblNwaXJhbChNYXRoLlBJLCAtMSk7IC8vIE5lZ2F0aXZlIGV4YW1wbGVzLlxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBDTEFTU0lGWSBDSVJDTEVcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeUNpcmNsZURhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXHQvLyBBV0cgTm9pc2UgVmFyaWFuY2UgPSBTaWduYWwgLyAxMF4oU05SZEIvMTApXG5cdGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRsZXQgcmFkaXVzID0gNTtcblxuXHQvLyBHZW5lcmF0ZSBwb3NpdGl2ZSBwb2ludHMgaW5zaWRlIHRoZSBjaXJjbGUuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlcyAvIDI7IGkrKykge1xuXHRcdGxldCByID0gcmFuZFVuaWZvcm0oMCwgcmFkaXVzICogMC41KTtcblx0XHQvLyBXZSBhc3N1bWUgcl4yIGFzIHRoZSB2YXJpYW5jZSBvZiB0aGUgU2lnbmFsXG5cdFx0bGV0IHIyID0gciAqIHI7XG5cdFx0bGV0IGFuZ2xlID0gcmFuZFVuaWZvcm0oMCwgMiAqIE1hdGguUEkpO1xuXHRcdGxldCB4ID0gciAqIE1hdGguc2luKGFuZ2xlKTtcblx0XHRsZXQgeSA9IHIgKiBNYXRoLmNvcyhhbmdsZSk7XG5cdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCAxIC8gcmFkaXVzICogZE5vaXNlKTtcblx0XHRsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIDEgLyByYWRpdXMgKiBkTm9pc2UpO1xuXHRcdHggKz0gbm9pc2VYO1xuXHRcdHkgKz0gbm9pc2VZO1xuXHRcdGxldCBsYWJlbCA9IDE7XG5cdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdH1cblxuXHQvLyBHZW5lcmF0ZSBuZWdhdGl2ZSBwb2ludHMgb3V0c2lkZSB0aGUgY2lyY2xlLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXMgLyAyOyBpKyspIHtcblx0XHRsZXQgciA9IHJhbmRVbmlmb3JtKHJhZGl1cyAqIDAuNywgcmFkaXVzKTtcblxuXHRcdC8vIFdlIGFzc3VtZSByXjIgYXMgdGhlIHZhcmlhbmNlIG9mIHRoZSBTaWduYWxcblx0XHRsZXQgcnIyID0gciAqIHI7XG5cdFx0bGV0IGFuZ2xlID0gcmFuZFVuaWZvcm0oMCwgMiAqIE1hdGguUEkpO1xuXHRcdGxldCB4ID0gciAqIE1hdGguc2luKGFuZ2xlKTtcblx0XHRsZXQgeSA9IHIgKiBNYXRoLmNvcyhhbmdsZSk7XG5cdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCAxIC8gcmFkaXVzICogZE5vaXNlKTtcblx0XHRsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIDEgLyByYWRpdXMgKiBkTm9pc2UpO1xuXHRcdHggKz0gbm9pc2VYO1xuXHRcdHkgKz0gbm9pc2VZO1xuXHRcdGxldCBsYWJlbCA9IC0xO1xuXHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHR9XG5cdHJldHVybiBwb2ludHM7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vIENMQVNTSUZZIFhPUlxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5WE9SRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cdC8vIEFXRyBOb2lzZSBWYXJpYW5jZSA9IFNpZ25hbCAvIDEwXihTTlJkQi8xMClcblx0bGV0IGROb2lzZSA9IGRTTlIobm9pc2UpO1xuXG5cdC8vIFN0YW5kYXJkIGRldmlhdGlvbiBvZiB0aGUgc2lnbmFsXG5cdGxldCBzdGRTaWduYWwgPSA1O1xuXG5cdGZ1bmN0aW9uIGdldFhPUkxhYmVsKHA6IFBvaW50KSB7XG5cdFx0cmV0dXJuIHAueCAqIHAueSA+PSAwID8gMSA6IC0xO1xuXHR9XG5cblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzOyBpKyspIHtcblx0XHRsZXQgeCA9IHJhbmRVbmlmb3JtKC1zdGRTaWduYWwsIHN0ZFNpZ25hbCk7XG5cdFx0bGV0IHBhZGRpbmcgPSAwLjM7XG5cdFx0eCArPSB4ID4gMCA/IHBhZGRpbmcgOiAtcGFkZGluZzsgIC8vIFBhZGRpbmcuXG5cdFx0bGV0IHkgPSByYW5kVW5pZm9ybSgtc3RkU2lnbmFsLCBzdGRTaWduYWwpO1xuXHRcdHkgKz0geSA+IDAgPyBwYWRkaW5nIDogLXBhZGRpbmc7XG5cblx0XHRsZXQgdmFyaWFuY2VTaWduYWwgPSBzdGRTaWduYWwgKiBzdGRTaWduYWw7XG5cdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCB2YXJpYW5jZVNpZ25hbCAqIGROb2lzZSk7XG5cdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCB2YXJpYW5jZVNpZ25hbCAqIGROb2lzZSk7XG5cdFx0bGV0IGxhYmVsID0gZ2V0WE9STGFiZWwoe3g6IHggKyBub2lzZVgsIHk6IHkgKyBub2lzZVl9KTtcblx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0fVxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBSRUdSRVNTSU9OXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmV4cG9ydCBmdW5jdGlvbiByZWdyZXNzUGxhbmUobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXHRsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cdGxldCByYWRpdXMgPSA2O1xuXHRsZXQgcjIgPSByYWRpdXMgKiByYWRpdXM7XG5cdGxldCBsYWJlbFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKFstMTAsIDEwXSlcblx0XHQucmFuZ2UoWy0xLCAxXSk7XG5cdGxldCBnZXRMYWJlbCA9ICh4LCB5KSA9PiBsYWJlbFNjYWxlKHggKyB5KTtcblxuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXM7IGkrKykge1xuXHRcdGxldCB4ID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKTtcblx0XHRsZXQgeSA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XG5cdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCByMiAqIGROb2lzZSk7XG5cdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCByMiAqIGROb2lzZSk7XG5cdFx0bGV0IGxhYmVsID0gZ2V0TGFiZWwoeCArIG5vaXNlWCwgeSArIG5vaXNlWSk7XG5cdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdH1cblx0cmV0dXJuIHBvaW50cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ3Jlc3NHYXVzc2lhbihudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cdGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRsZXQgbGFiZWxTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0LmRvbWFpbihbMCwgMl0pXG5cdFx0LnJhbmdlKFsxLCAwXSlcblx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0bGV0IGdhdXNzaWFucyA9XG5cdFx0W1xuXHRcdFx0Wy00LCAyLjUsIDFdLFxuXHRcdFx0WzAsIDIuNSwgLTFdLFxuXHRcdFx0WzQsIDIuNSwgMV0sXG5cdFx0XHRbLTQsIC0yLjUsIC0xXSxcblx0XHRcdFswLCAtMi41LCAxXSxcblx0XHRcdFs0LCAtMi41LCAtMV1cblx0XHRdO1xuXG5cdGZ1bmN0aW9uIGdldExhYmVsKHgsIHkpIHtcblx0XHQvLyBDaG9vc2UgdGhlIG9uZSB0aGF0IGlzIG1heGltdW0gaW4gYWJzIHZhbHVlLlxuXHRcdGxldCBsYWJlbCA9IDA7XG5cdFx0Z2F1c3NpYW5zLmZvckVhY2goKFtjeCwgY3ksIHNpZ25dKSA9PiB7XG5cdFx0XHRsZXQgbmV3TGFiZWwgPSBzaWduICogbGFiZWxTY2FsZShkaXN0KHt4LCB5fSwge3g6IGN4LCB5OiBjeX0pKTtcblx0XHRcdGlmIChNYXRoLmFicyhuZXdMYWJlbCkgPiBNYXRoLmFicyhsYWJlbCkpIHtcblx0XHRcdFx0bGFiZWwgPSBuZXdMYWJlbDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbGFiZWw7XG5cdH1cblxuXHRsZXQgcmFkaXVzID0gNjtcblx0bGV0IHIyID0gcmFkaXVzICogcmFkaXVzO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXM7IGkrKykge1xuXHRcdGxldCB4ID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKTtcblx0XHRsZXQgeSA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XG5cdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCByMiAqIGROb2lzZSk7XG5cdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCByMiAqIGROb2lzZSk7XG5cdFx0bGV0IGxhYmVsID0gZ2V0TGFiZWwoeCArIG5vaXNlWCwgeSArIG5vaXNlWSk7XG5cdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdH1cblxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBBQ0NFU1NPUlkgRlVOQ1RJT05TXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAqIFNodWZmbGVzIHRoZSBhcnJheSB1c2luZyBGaXNoZXItWWF0ZXMgYWxnb3JpdGhtLiBVc2VzIHRoZSBzZWVkcmFuZG9tXG4gKiBsaWJyYXJ5IGFzIHRoZSByYW5kb20gZ2VuZXJhdG9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2h1ZmZsZShhcnJheTogYW55W10pOiB2b2lkIHtcblx0bGV0IGNvdW50ZXIgPSBhcnJheS5sZW5ndGg7XG5cdGxldCB0ZW1wID0gMDtcblx0bGV0IGluZGV4ID0gMDtcblx0Ly8gV2hpbGUgdGhlcmUgYXJlIGVsZW1lbnRzIGluIHRoZSBhcnJheVxuXHR3aGlsZSAoY291bnRlciA+IDApIHtcblx0XHQvLyBQaWNrIGEgcmFuZG9tIGluZGV4XG5cdFx0aW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb3VudGVyKTtcblx0XHQvLyBEZWNyZWFzZSBjb3VudGVyIGJ5IDFcblx0XHRjb3VudGVyLS07XG5cdFx0Ly8gQW5kIHN3YXAgdGhlIGxhc3QgZWxlbWVudCB3aXRoIGl0XG5cdFx0dGVtcCA9IGFycmF5W2NvdW50ZXJdO1xuXHRcdGFycmF5W2NvdW50ZXJdID0gYXJyYXlbaW5kZXhdO1xuXHRcdGFycmF5W2luZGV4XSA9IHRlbXA7XG5cdH1cbn1cblxuZnVuY3Rpb24gbG9nMih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZygyKTtcbn1cblxuZnVuY3Rpb24gbG9nMTAoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coMTApO1xufVxuXG5mdW5jdGlvbiBzaWduYWxPZih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gbG9nMigxICsgTWF0aC5hYnMoeCkpO1xufVxuXG5mdW5jdGlvbiBkU05SKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiAxIC8gTWF0aC5wb3coMTAsIHggLyAxMCk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHNhbXBsZSBmcm9tIGEgdW5pZm9ybSBbYSwgYl0gZGlzdHJpYnV0aW9uLlxuICogVXNlcyB0aGUgc2VlZHJhbmRvbSBsaWJyYXJ5IGFzIHRoZSByYW5kb20gZ2VuZXJhdG9yLlxuICovXG5mdW5jdGlvbiByYW5kVW5pZm9ybShhOiBudW1iZXIsIGI6IG51bWJlcikge1xuXHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChiIC0gYSkgKyBhO1xufVxuXG4vKipcbiAqIFNhbXBsZXMgZnJvbSBhIG5vcm1hbCBkaXN0cmlidXRpb24uIFVzZXMgdGhlIHNlZWRyYW5kb20gbGlicmFyeSBhcyB0aGVcbiAqIHJhbmRvbSBnZW5lcmF0b3IuXG4gKlxuICogQHBhcmFtIG1lYW4gVGhlIG1lYW4uIERlZmF1bHQgaXMgMC5cbiAqIEBwYXJhbSB2YXJpYW5jZSBUaGUgdmFyaWFuY2UuIERlZmF1bHQgaXMgMS5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsUmFuZG9tKG1lYW4gPSAwLCB2YXJpYW5jZSA9IDEpOiBudW1iZXIge1xuXHRsZXQgdjE6IG51bWJlciwgdjI6IG51bWJlciwgczogbnVtYmVyO1xuXHRkbyB7XG5cdFx0djEgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XG5cdFx0djIgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XG5cdFx0cyA9IHYxICogdjEgKyB2MiAqIHYyO1xuXHR9IHdoaWxlIChzID4gMSk7XG5cblx0bGV0IHJlc3VsdCA9IE1hdGguc3FydCgtMiAqIE1hdGgubG9nKHMpIC8gcykgKiB2MTtcblx0cmV0dXJuIG1lYW4gKyBNYXRoLnNxcnQodmFyaWFuY2UpICogcmVzdWx0O1xufVxuXG4vKiogUmV0dXJucyB0aGUgZXVjbGlkZWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50cyBpbiBzcGFjZS4gKi9cbmZ1bmN0aW9uIGRpc3QoYTogUG9pbnQsIGI6IFBvaW50KTogbnVtYmVyIHtcblx0bGV0IGR4ID0gYS54IC0gYi54O1xuXHRsZXQgZHkgPSBhLnkgLSBiLnk7XG5cdHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xufVxuIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG5odHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmltcG9ydCB7RXhhbXBsZTJEfSBmcm9tIFwiLi9kYXRhc2V0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGVhdE1hcFNldHRpbmdzIHtcblx0W2tleTogc3RyaW5nXTogYW55O1xuXHRzaG93QXhlcz86IGJvb2xlYW47XG5cdG5vU3ZnPzogYm9vbGVhbjtcbn1cblxuLyoqIE51bWJlciBvZiBkaWZmZXJlbnQgc2hhZGVzIChjb2xvcnMpIHdoZW4gZHJhd2luZyBhIGdyYWRpZW50IGhlYXRtYXAgKi9cbmNvbnN0IE5VTV9TSEFERVMgPSA2NDtcblxuLyoqXG4qIERyYXdzIGEgaGVhdG1hcCB1c2luZyBjYW52YXMuIFVzZWQgZm9yIHNob3dpbmcgdGhlIGxlYXJuZWQgZGVjaXNpb25cbiogYm91bmRhcnkgb2YgdGhlIGNsYXNzaWZpY2F0aW9uIGFsZ29yaXRobS4gQ2FuIGFsc28gZHJhdyBkYXRhIHBvaW50c1xuKiB1c2luZyBhbiBzdmcgb3ZlcmxheWVkIG9uIHRvcCBvZiB0aGUgY2FudmFzIGhlYXRtYXAuXG4qL1xuZXhwb3J0IGNsYXNzIEhlYXRNYXAge1xuXHRwcml2YXRlIHNldHRpbmdzOiBIZWF0TWFwU2V0dGluZ3MgPSB7c2hvd0F4ZXM6IGZhbHNlLCBub1N2ZzogZmFsc2V9O1xuXHRwcml2YXRlIHhTY2FsZTogZDMuc2NhbGUuTGluZWFyPG51bWJlciwgbnVtYmVyPjtcblx0cHJpdmF0ZSB5U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XG5cdHByaXZhdGUgbnVtU2FtcGxlczogbnVtYmVyO1xuXHRwcml2YXRlIGNvbG9yOiBkMy5zY2FsZS5RdWFudGl6ZTxzdHJpbmc+O1xuXHRwcml2YXRlIGNhbnZhczogZDMuU2VsZWN0aW9uPGFueT47XG5cdHByaXZhdGUgc3ZnOiBkMy5TZWxlY3Rpb248YW55PjtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHR3aWR0aDogbnVtYmVyLCBudW1TYW1wbGVzOiBudW1iZXIsIHhEb21haW46IFtudW1iZXIsIG51bWJlcl0sXG5cdFx0eURvbWFpbjogW251bWJlciwgbnVtYmVyXSwgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55Pixcblx0XHR1c2VyU2V0dGluZ3M/OiBIZWF0TWFwU2V0dGluZ3MpIHtcblx0XHR0aGlzLm51bVNhbXBsZXMgPSBudW1TYW1wbGVzO1xuXHRcdGxldCBoZWlnaHQgPSB3aWR0aDtcblx0XHRsZXQgcGFkZGluZyA9IHVzZXJTZXR0aW5ncy5zaG93QXhlcyA/IDIwIDogMDtcblxuXHRcdGlmICh1c2VyU2V0dGluZ3MgIT0gbnVsbCkge1xuXHRcdFx0Ly8gb3ZlcndyaXRlIHRoZSBkZWZhdWx0cyB3aXRoIHRoZSB1c2VyLXNwZWNpZmllZCBzZXR0aW5ncy5cblx0XHRcdGZvciAobGV0IHByb3AgaW4gdXNlclNldHRpbmdzKSB7XG5cdFx0XHRcdHRoaXMuc2V0dGluZ3NbcHJvcF0gPSB1c2VyU2V0dGluZ3NbcHJvcF07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy54U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdC5kb21haW4oeERvbWFpbilcblx0XHQucmFuZ2UoWzAsIHdpZHRoIC0gMiAqIHBhZGRpbmddKTtcblxuXHRcdHRoaXMueVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKHlEb21haW4pXG5cdFx0LnJhbmdlKFtoZWlnaHQgLSAyICogcGFkZGluZywgMF0pO1xuXG5cdFx0Ly8gR2V0IGEgcmFuZ2Ugb2YgY29sb3JzLlxuXHRcdGxldCB0bXBTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcjxzdHJpbmcsIHN0cmluZz4oKVxuXHRcdC5kb21haW4oWzAsIC41LCAxXSlcblx0XHQucmFuZ2UoW1wiIzA4NzdiZFwiLCBcIiNlOGVhZWJcIiwgXCIjZjU5MzIyXCJdKVxuXHRcdC5jbGFtcCh0cnVlKTtcblx0XHQvLyBEdWUgdG8gbnVtZXJpY2FsIGVycm9yLCB3ZSBuZWVkIHRvIHNwZWNpZnlcblx0XHQvLyBkMy5yYW5nZSgwLCBlbmQgKyBzbWFsbF9lcHNpbG9uLCBzdGVwKVxuXHRcdC8vIGluIG9yZGVyIHRvIGd1YXJhbnRlZSB0aGF0IHdlIHdpbGwgaGF2ZSBlbmQvc3RlcCBlbnRyaWVzIHdpdGhcblx0XHQvLyB0aGUgbGFzdCBlbGVtZW50IGJlaW5nIGVxdWFsIHRvIGVuZC5cblx0XHRsZXQgY29sb3JzID0gZDMucmFuZ2UoMCwgMSArIDFFLTksIDEgLyBOVU1fU0hBREVTKS5tYXAoYSA9PiB7XG5cdFx0XHRyZXR1cm4gdG1wU2NhbGUoYSk7XG5cdFx0fSk7XG5cdFx0dGhpcy5jb2xvciA9IGQzLnNjYWxlLnF1YW50aXplPHN0cmluZz4oKVxuXHRcdC5kb21haW4oWy0xLCAxXSlcblx0XHQucmFuZ2UoY29sb3JzKTtcblxuXHRcdGNvbnRhaW5lciA9IGNvbnRhaW5lci5hcHBlbmQoXCJkaXZcIilcblx0XHQuc3R5bGUoXG5cdFx0e1xuXHRcdFx0d2lkdGg6IGAke3dpZHRofXB4YCxcblx0XHRcdGhlaWdodDogYCR7aGVpZ2h0fXB4YCxcblx0XHRcdHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG5cdFx0XHR0b3A6IGAtJHtwYWRkaW5nfXB4YCxcblx0XHRcdGxlZnQ6IGAtJHtwYWRkaW5nfXB4YFxuXHRcdH0pO1xuXHRcdHRoaXMuY2FudmFzID0gY29udGFpbmVyLmFwcGVuZChcImNhbnZhc1wiKVxuXHRcdC5hdHRyKFwid2lkdGhcIiwgbnVtU2FtcGxlcylcblx0XHQuYXR0cihcImhlaWdodFwiLCBudW1TYW1wbGVzKVxuXHRcdC5zdHlsZShcIndpZHRoXCIsICh3aWR0aCAtIDIgKiBwYWRkaW5nKSArIFwicHhcIilcblx0XHQuc3R5bGUoXCJoZWlnaHRcIiwgKGhlaWdodCAtIDIgKiBwYWRkaW5nKSArIFwicHhcIilcblx0XHQuc3R5bGUoXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIpXG5cdFx0LnN0eWxlKFwidG9wXCIsIGAke3BhZGRpbmd9cHhgKVxuXHRcdC5zdHlsZShcImxlZnRcIiwgYCR7cGFkZGluZ31weGApO1xuXG5cdFx0aWYgKCF0aGlzLnNldHRpbmdzLm5vU3ZnKSB7XG5cdFx0XHR0aGlzLnN2ZyA9IGNvbnRhaW5lci5hcHBlbmQoXCJzdmdcIikuYXR0cihcblx0XHRcdHtcblx0XHRcdFx0XCJ3aWR0aFwiOiB3aWR0aCxcblx0XHRcdFx0XCJoZWlnaHRcIjogaGVpZ2h0XG5cdFx0XHR9KS5zdHlsZShcblx0XHRcdHtcblx0XHRcdFx0Ly8gT3ZlcmxheSB0aGUgc3ZnIG9uIHRvcCBvZiB0aGUgY2FudmFzLlxuXHRcdFx0XHRcInBvc2l0aW9uXCI6IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0XCJsZWZ0XCI6IFwiMFwiLFxuXHRcdFx0XHRcInRvcFwiOiBcIjBcIlxuXHRcdFx0fSkuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3BhZGRpbmd9LCR7cGFkZGluZ30pYCk7XG5cblx0XHRcdHRoaXMuc3ZnLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIFwidHJhaW5cIik7XG5cdFx0XHR0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBcInRlc3RcIik7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3Muc2hvd0F4ZXMpIHtcblx0XHRcdGxldCB4QXhpcyA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSh0aGlzLnhTY2FsZSlcblx0XHRcdC5vcmllbnQoXCJib3R0b21cIik7XG5cblx0XHRcdGxldCB5QXhpcyA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSh0aGlzLnlTY2FsZSlcblx0XHRcdC5vcmllbnQoXCJyaWdodFwiKTtcblxuXHRcdFx0dGhpcy5zdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcInggYXhpc1wiKVxuXHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCR7aGVpZ2h0IC0gMiAqIHBhZGRpbmd9KWApXG5cdFx0XHQuY2FsbCh4QXhpcyk7XG5cblx0XHRcdHRoaXMuc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ5IGF4aXNcIilcblx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKHdpZHRoIC0gMiAqIHBhZGRpbmcpICsgXCIsMClcIilcblx0XHRcdC5jYWxsKHlBeGlzKTtcblx0XHR9XG5cdH1cblxuXHR1cGRhdGVUZXN0UG9pbnRzKHBvaW50czogRXhhbXBsZTJEW10pOiB2b2lkIHtcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5ub1N2Zykge1xuXHRcdFx0dGhyb3cgRXJyb3IoXCJDYW4ndCBhZGQgcG9pbnRzIHNpbmNlIG5vU3ZnPXRydWVcIik7XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlQ2lyY2xlcyh0aGlzLnN2Zy5zZWxlY3QoXCJnLnRlc3RcIiksIHBvaW50cyk7XG5cdH1cblxuXHR1cGRhdGVQb2ludHMocG9pbnRzOiBFeGFtcGxlMkRbXSk6IHZvaWQge1xuXHRcdGlmICh0aGlzLnNldHRpbmdzLm5vU3ZnKSB7XG5cdFx0XHR0aHJvdyBFcnJvcihcIkNhbid0IGFkZCBwb2ludHMgc2luY2Ugbm9Tdmc9dHJ1ZVwiKTtcblx0XHR9XG5cdFx0dGhpcy51cGRhdGVDaXJjbGVzKHRoaXMuc3ZnLnNlbGVjdChcImcudHJhaW5cIiksIHBvaW50cyk7XG5cdH1cblxuXHR1cGRhdGVCYWNrZ3JvdW5kKGRhdGE6IG51bWJlcltdW10sIGRpc2NyZXRpemU6IGJvb2xlYW4pOiB2b2lkIHtcblx0XHRsZXQgZHggPSBkYXRhWzBdLmxlbmd0aDtcblx0XHRsZXQgZHkgPSBkYXRhLmxlbmd0aDtcblxuXHRcdGlmIChkeCAhPT0gdGhpcy5udW1TYW1wbGVzIHx8IGR5ICE9PSB0aGlzLm51bVNhbXBsZXMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XCJUaGUgcHJvdmlkZWQgZGF0YSBtYXRyaXggbXVzdCBiZSBvZiBzaXplIFwiICtcblx0XHRcdFx0XCJudW1TYW1wbGVzIFggbnVtU2FtcGxlc1wiKTtcblx0XHR9XG5cblx0XHQvLyBDb21wdXRlIHRoZSBwaXhlbCBjb2xvcnM7IHNjYWxlZCBieSBDU1MuXG5cdFx0bGV0IGNvbnRleHQgPSAodGhpcy5jYW52YXMubm9kZSgpIGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRDb250ZXh0KFwiMmRcIik7XG5cdFx0bGV0IGltYWdlID0gY29udGV4dC5jcmVhdGVJbWFnZURhdGEoZHgsIGR5KTtcblxuXHRcdGZvciAobGV0IHkgPSAwLCBwID0gLTE7IHkgPCBkeTsgKyt5KSB7XG5cdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGR4OyArK3gpIHtcblx0XHRcdFx0bGV0IHZhbHVlID0gZGF0YVt4XVt5XTtcblx0XHRcdFx0aWYgKGRpc2NyZXRpemUpIHtcblx0XHRcdFx0XHR2YWx1ZSA9ICh2YWx1ZSA+PSAwID8gMSA6IC0xKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgYyA9IGQzLnJnYih0aGlzLmNvbG9yKHZhbHVlKSk7XG5cdFx0XHRcdGltYWdlLmRhdGFbKytwXSA9IGMucjtcblx0XHRcdFx0aW1hZ2UuZGF0YVsrK3BdID0gYy5nO1xuXHRcdFx0XHRpbWFnZS5kYXRhWysrcF0gPSBjLmI7XG5cdFx0XHRcdGltYWdlLmRhdGFbKytwXSA9IDE2MDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2UsIDAsIDApO1xuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVDaXJjbGVzKGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sIHBvaW50czogRXhhbXBsZTJEW10pIHtcblx0XHQvLyBLZWVwIG9ubHkgcG9pbnRzIHRoYXQgYXJlIGluc2lkZSB0aGUgYm91bmRzLlxuXHRcdGxldCB4RG9tYWluID0gdGhpcy54U2NhbGUuZG9tYWluKCk7XG5cdFx0bGV0IHlEb21haW4gPSB0aGlzLnlTY2FsZS5kb21haW4oKTtcblx0XHRwb2ludHMgPSBwb2ludHMuZmlsdGVyKHAgPT4ge1xuXHRcdFx0cmV0dXJuIHAueCA+PSB4RG9tYWluWzBdICYmIHAueCA8PSB4RG9tYWluWzFdXG5cdFx0XHQmJiBwLnkgPj0geURvbWFpblswXSAmJiBwLnkgPD0geURvbWFpblsxXTtcblx0XHR9KTtcblxuXHRcdC8vIEF0dGFjaCBkYXRhIHRvIGluaXRpYWxseSBlbXB0eSBzZWxlY3Rpb24uXG5cdFx0bGV0IHNlbGVjdGlvbiA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCJjaXJjbGVcIikuZGF0YShwb2ludHMpO1xuXG5cdFx0Ly8gSW5zZXJ0IGVsZW1lbnRzIHRvIG1hdGNoIGxlbmd0aCBvZiBwb2ludHMgYXJyYXkuXG5cdFx0c2VsZWN0aW9uLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpLmF0dHIoXCJyXCIsIDMpO1xuXG5cdFx0Ly8gVXBkYXRlIHBvaW50cyB0byBiZSBpbiB0aGUgY29ycmVjdCBwb3NpdGlvbi5cblx0XHRzZWxlY3Rpb25cblx0XHQuYXR0cihcblx0XHR7XG5cdFx0XHRjeDogKGQ6IEV4YW1wbGUyRCkgPT4gdGhpcy54U2NhbGUoZC54KSxcblx0XHRcdGN5OiAoZDogRXhhbXBsZTJEKSA9PiB0aGlzLnlTY2FsZShkLnkpLFxuXHRcdH0pXG5cdFx0LnN0eWxlKFwiZmlsbFwiLCBkID0+IHRoaXMuY29sb3IoZC5sYWJlbCkpO1xuXG5cdFx0Ly8gUmVtb3ZlIHBvaW50cyBpZiB0aGUgbGVuZ3RoIGhhcyBnb25lIGRvd24uXG5cdFx0c2VsZWN0aW9uLmV4aXQoKS5yZW1vdmUoKTtcblx0fVxufSAgLy8gQ2xvc2UgY2xhc3MgSGVhdE1hcC5cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZU1hdHJpeChtYXRyaXg6IG51bWJlcltdW10sIGZhY3RvcjogbnVtYmVyKTogbnVtYmVyW11bXSB7XG5cdGlmIChtYXRyaXgubGVuZ3RoICE9PSBtYXRyaXhbMF0ubGVuZ3RoKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIHByb3ZpZGVkIG1hdHJpeCBtdXN0IGJlIGEgc3F1YXJlIG1hdHJpeFwiKTtcblx0fVxuXHRpZiAobWF0cml4Lmxlbmd0aCAlIGZhY3RvciAhPT0gMCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSB3aWR0aC9oZWlnaHQgb2YgdGhlIG1hdHJpeCBtdXN0IGJlIGRpdmlzaWJsZSBieSBcIiArXG5cdFx0XCJ0aGUgcmVkdWN0aW9uIGZhY3RvclwiKTtcblx0fVxuXHRsZXQgcmVzdWx0OiBudW1iZXJbXVtdID0gbmV3IEFycmF5KG1hdHJpeC5sZW5ndGggLyBmYWN0b3IpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5sZW5ndGg7IGkgKz0gZmFjdG9yKSB7XG5cdFx0cmVzdWx0W2kgLyBmYWN0b3JdID0gbmV3IEFycmF5KG1hdHJpeC5sZW5ndGggLyBmYWN0b3IpO1xuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgbWF0cml4Lmxlbmd0aDsgaiArPSBmYWN0b3IpIHtcblx0XHRcdGxldCBhdmcgPSAwO1xuXHRcdFx0Ly8gU3VtIGFsbCB0aGUgdmFsdWVzIGluIHRoZSBuZWlnaGJvcmhvb2QuXG5cdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGZhY3RvcjsgaysrKSB7XG5cdFx0XHRcdGZvciAobGV0IGwgPSAwOyBsIDwgZmFjdG9yOyBsKyspIHtcblx0XHRcdFx0XHRhdmcgKz0gbWF0cml4W2kgKyBrXVtqICsgbF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGF2ZyAvPSAoZmFjdG9yICogZmFjdG9yKTtcblx0XHRcdHJlc3VsdFtpIC8gZmFjdG9yXVtqIC8gZmFjdG9yXSA9IGF2Zztcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbnR5cGUgRGF0YVBvaW50ID0ge1xuXHR4OiBudW1iZXI7XG5cdHk6IG51bWJlcltdO1xufTtcblxuLyoqXG4gKiBBIG11bHRpLXNlcmllcyBsaW5lIGNoYXJ0IHRoYXQgYWxsb3dzIHlvdSB0byBhcHBlbmQgbmV3IGRhdGEgcG9pbnRzXG4gKiBhcyBkYXRhIGJlY29tZXMgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgY2xhc3MgQXBwZW5kaW5nTGluZUNoYXJ0IHtcblx0cHJpdmF0ZSBudW1MaW5lczogbnVtYmVyO1xuXHRwcml2YXRlIGRhdGE6IERhdGFQb2ludFtdID0gW107XG5cdHByaXZhdGUgc3ZnOiBkMy5TZWxlY3Rpb248YW55Pjtcblx0cHJpdmF0ZSB4U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XG5cdHByaXZhdGUgeVNjYWxlOiBkMy5zY2FsZS5MaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xuXHRwcml2YXRlIHBhdGhzOiBBcnJheTxkMy5TZWxlY3Rpb248YW55Pj47XG5cdHByaXZhdGUgbGluZUNvbG9yczogc3RyaW5nW107XG5cblx0cHJpdmF0ZSBtaW5ZID0gTnVtYmVyLk1BWF9WQUxVRTtcblx0cHJpdmF0ZSBtYXhZID0gTnVtYmVyLk1JTl9WQUxVRTtcblxuXHRjb25zdHJ1Y3Rvcihjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+LCBsaW5lQ29sb3JzOiBzdHJpbmdbXSkge1xuXHRcdHRoaXMubGluZUNvbG9ycyA9IGxpbmVDb2xvcnM7XG5cdFx0dGhpcy5udW1MaW5lcyA9IGxpbmVDb2xvcnMubGVuZ3RoO1xuXHRcdGxldCBub2RlID0gY29udGFpbmVyLm5vZGUoKSBhcyBIVE1MRWxlbWVudDtcblx0XHRsZXQgdG90YWxXaWR0aCA9IG5vZGUub2Zmc2V0V2lkdGg7XG5cdFx0bGV0IHRvdGFsSGVpZ2h0ID0gbm9kZS5vZmZzZXRIZWlnaHQ7XG5cdFx0bGV0IG1hcmdpbiA9IHt0b3A6IDIsIHJpZ2h0OiAwLCBib3R0b206IDIsIGxlZnQ6IDJ9O1xuXHRcdGxldCB3aWR0aCA9IHRvdGFsV2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcblx0XHRsZXQgaGVpZ2h0ID0gdG90YWxIZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcblxuXHRcdHRoaXMueFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdC5kb21haW4oWzAsIDBdKVxuXHRcdFx0LnJhbmdlKFswLCB3aWR0aF0pO1xuXG5cdFx0dGhpcy55U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0LmRvbWFpbihbMCwgMF0pXG5cdFx0XHQucmFuZ2UoW2hlaWdodCwgMF0pO1xuXG5cdFx0dGhpcy5zdmcgPSBjb250YWluZXIuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHQuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG5cdFx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSlcblx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7bWFyZ2luLmxlZnR9LCR7bWFyZ2luLnRvcH0pYCk7XG5cblx0XHR0aGlzLnBhdGhzID0gbmV3IEFycmF5KHRoaXMubnVtTGluZXMpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1MaW5lczsgaSsrKSB7XG5cdFx0XHR0aGlzLnBhdGhzW2ldID0gdGhpcy5zdmcuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwibGluZVwiKVxuXHRcdFx0XHQuc3R5bGUoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XCJmaWxsXCI6IFwibm9uZVwiLFxuXHRcdFx0XHRcdFx0XCJzdHJva2VcIjogbGluZUNvbG9yc1tpXSxcblx0XHRcdFx0XHRcdFwic3Ryb2tlLXdpZHRoXCI6IFwiMS41cHhcIlxuXHRcdFx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHJlc2V0KCkge1xuXHRcdHRoaXMuZGF0YSA9IFtdO1xuXHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0dGhpcy5taW5ZID0gTnVtYmVyLk1BWF9WQUxVRTtcblx0XHR0aGlzLm1heFkgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuXHR9XG5cblx0YWRkRGF0YVBvaW50KGRhdGFQb2ludDogbnVtYmVyW10pIHtcblx0XHRpZiAoZGF0YVBvaW50Lmxlbmd0aCAhPT0gdGhpcy5udW1MaW5lcykge1xuXHRcdFx0dGhyb3cgRXJyb3IoXCJMZW5ndGggb2YgZGF0YVBvaW50IG11c3QgZXF1YWwgbnVtYmVyIG9mIGxpbmVzXCIpO1xuXHRcdH1cblx0XHRkYXRhUG9pbnQuZm9yRWFjaCh5ID0+IHtcblx0XHRcdHRoaXMubWluWSA9IE1hdGgubWluKHRoaXMubWluWSwgeSk7XG5cdFx0XHR0aGlzLm1heFkgPSBNYXRoLm1heCh0aGlzLm1heFksIHkpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5kYXRhLnB1c2goe3g6IHRoaXMuZGF0YS5sZW5ndGggKyAxLCB5OiBkYXRhUG9pbnR9KTtcblx0XHR0aGlzLnJlZHJhdygpO1xuXHR9XG5cblx0cHJpdmF0ZSByZWRyYXcoKSB7XG5cdFx0Ly8gQWRqdXN0IHRoZSB4IGFuZCB5IGRvbWFpbi5cblx0XHR0aGlzLnhTY2FsZS5kb21haW4oWzEsIHRoaXMuZGF0YS5sZW5ndGhdKTtcblx0XHR0aGlzLnlTY2FsZS5kb21haW4oW3RoaXMubWluWSwgdGhpcy5tYXhZXSk7XG5cdFx0Ly8gQWRqdXN0IGFsbCB0aGUgPHBhdGg+IGVsZW1lbnRzIChsaW5lcykuXG5cdFx0bGV0IGdldFBhdGhNYXAgPSAobGluZUluZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdHJldHVybiBkMy5zdmcubGluZTxEYXRhUG9pbnQ+KClcblx0XHRcdFx0LngoZCA9PiB0aGlzLnhTY2FsZShkLngpKVxuXHRcdFx0XHQueShkID0+IHRoaXMueVNjYWxlKGQueVtsaW5lSW5kZXhdKSk7XG5cdFx0fTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtTGluZXM7IGkrKykge1xuXHRcdFx0dGhpcy5wYXRoc1tpXS5kYXR1bSh0aGlzLmRhdGEpLmF0dHIoXCJkXCIsIGdldFBhdGhNYXAoaSkpO1xuXHRcdH1cblx0fVxufVxuIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4vKipcbiAqIEEgbm9kZSBpbiBhIG5ldXJhbCBuZXR3b3JrLiBFYWNoIG5vZGUgaGFzIGEgc3RhdGVcbiAqICh0b3RhbCBpbnB1dCwgb3V0cHV0LCBhbmQgdGhlaXIgcmVzcGVjdGl2ZWx5IGRlcml2YXRpdmVzKSB3aGljaCBjaGFuZ2VzXG4gKiBhZnRlciBldmVyeSBmb3J3YXJkIGFuZCBiYWNrIHByb3BhZ2F0aW9uIHJ1bi5cbiAqL1xuZXhwb3J0IGNsYXNzIE5vZGUge1xuXHRpZDogc3RyaW5nO1xuXHQvKiogTGlzdCBvZiBpbnB1dCBsaW5rcy4gKi9cblx0aW5wdXRMaW5rczogTGlua1tdID0gW107XG5cdGJpYXMgPSAwLjE7XG5cdC8qKiBMaXN0IG9mIG91dHB1dCBsaW5rcy4gKi9cblx0b3V0cHV0czogTGlua1tdID0gW107XG5cdHRvdGFsSW5wdXQ6IG51bWJlcjtcblx0b3V0cHV0OiBudW1iZXI7XG5cblx0dHJ1ZUxlYXJuaW5nUmF0ZSA9IDA7XG5cdC8qKiBFcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byB0aGlzIG5vZGUncyBvdXRwdXQuICovXG5cdG91dHB1dERlciA9IDA7XG5cdC8qKiBFcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byB0aGlzIG5vZGUncyB0b3RhbCBpbnB1dC4gKi9cblx0aW5wdXREZXIgPSAwO1xuXHQvKipcblx0ICogQWNjdW11bGF0ZWQgZXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyBub2RlJ3MgdG90YWwgaW5wdXQgc2luY2Vcblx0ICogdGhlIGxhc3QgdXBkYXRlLiBUaGlzIGRlcml2YXRpdmUgZXF1YWxzIGRFL2RiIHdoZXJlIGIgaXMgdGhlIG5vZGUnc1xuXHQgKiBiaWFzIHRlcm0uXG5cdCAqL1xuXHRhY2NJbnB1dERlciA9IDA7XG5cdC8qKlxuXHQgKiBOdW1iZXIgb2YgYWNjdW11bGF0ZWQgZXJyLiBkZXJpdmF0aXZlcyB3aXRoIHJlc3BlY3QgdG8gdGhlIHRvdGFsIGlucHV0XG5cdCAqIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cblx0ICovXG5cdG51bUFjY3VtdWxhdGVkRGVycyA9IDA7XG5cdC8qKiBBY3RpdmF0aW9uIGZ1bmN0aW9uIHRoYXQgdGFrZXMgdG90YWwgaW5wdXQgYW5kIHJldHVybnMgbm9kZSdzIG91dHB1dCAqL1xuXHRhY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb247XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgbm9kZSB3aXRoIHRoZSBwcm92aWRlZCBpZCBhbmQgYWN0aXZhdGlvbiBmdW5jdGlvbi5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGFjdGl2YXRpb246IEFjdGl2YXRpb25GdW5jdGlvbiwgaW5pdFplcm8/OiBib29sZWFuKSB7XG5cdFx0dGhpcy5pZCA9IGlkO1xuXHRcdHRoaXMuYWN0aXZhdGlvbiA9IGFjdGl2YXRpb247XG5cdFx0aWYgKGluaXRaZXJvKSB7XG5cdFx0XHR0aGlzLmJpYXMgPSAwO1xuXHRcdH1cblx0fVxuXG5cdC8qKiBSZWNvbXB1dGVzIHRoZSBub2RlJ3Mgb3V0cHV0IGFuZCByZXR1cm5zIGl0LiAqL1xuXHR1cGRhdGVPdXRwdXQoKTogbnVtYmVyIHtcblx0XHQvLyBTdG9yZXMgdG90YWwgaW5wdXQgaW50byB0aGUgbm9kZS5cblx0XHR0aGlzLnRvdGFsSW5wdXQgPSB0aGlzLmJpYXM7XG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmlucHV0TGlua3MubGVuZ3RoOyBqKyspIHtcblx0XHRcdGxldCBsaW5rID0gdGhpcy5pbnB1dExpbmtzW2pdO1xuXHRcdFx0dGhpcy50b3RhbElucHV0ICs9IGxpbmsud2VpZ2h0ICogbGluay5zb3VyY2Uub3V0cHV0O1xuXHRcdH1cblx0XHR0aGlzLm91dHB1dCA9IHRoaXMuYWN0aXZhdGlvbi5vdXRwdXQodGhpcy50b3RhbElucHV0KTtcblx0XHRyZXR1cm4gdGhpcy5vdXRwdXQ7XG5cdH1cbn1cblxuLyoqXG4gKiBBbiBlcnJvciBmdW5jdGlvbiBhbmQgaXRzIGRlcml2YXRpdmUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JGdW5jdGlvbiB7XG5cdGVycm9yOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PiBudW1iZXI7XG5cdGRlcjogKG91dHB1dDogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcikgPT4gbnVtYmVyO1xufVxuXG4vKiogQSBub2RlJ3MgYWN0aXZhdGlvbiBmdW5jdGlvbiBhbmQgaXRzIGRlcml2YXRpdmUuICovXG5leHBvcnQgaW50ZXJmYWNlIEFjdGl2YXRpb25GdW5jdGlvbiB7XG5cdG91dHB1dDogKGlucHV0OiBudW1iZXIpID0+IG51bWJlcjtcblx0ZGVyOiAoaW5wdXQ6IG51bWJlcikgPT4gbnVtYmVyO1xufVxuXG4vKiogRnVuY3Rpb24gdGhhdCBjb21wdXRlcyBhIHBlbmFsdHkgY29zdCBmb3IgYSBnaXZlbiB3ZWlnaHQgaW4gdGhlIG5ldHdvcmsuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24ge1xuXHRvdXRwdXQ6ICh3ZWlnaHQ6IG51bWJlcikgPT4gbnVtYmVyO1xuXHRkZXI6ICh3ZWlnaHQ6IG51bWJlcikgPT4gbnVtYmVyO1xufVxuXG4vKiogQnVpbHQtaW4gZXJyb3IgZnVuY3Rpb25zICovXG5leHBvcnQgY2xhc3MgRXJyb3JzIHtcblx0cHVibGljIHN0YXRpYyBTUVVBUkU6IEVycm9yRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdGVycm9yOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PlxuXHRcdFx0XHQwLjUgKiBNYXRoLnBvdyhvdXRwdXQgLSB0YXJnZXQsIDIpLFxuXHRcdFx0ZGVyOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PiBvdXRwdXQgLSB0YXJnZXRcblx0XHR9O1xufVxuXG4vKiogUG9seWZpbGwgZm9yIFRBTkggKi9cbihNYXRoIGFzIGFueSkudGFuaCA9IChNYXRoIGFzIGFueSkudGFuaCB8fCBmdW5jdGlvbiAoeCkge1xuXHRpZiAoeCA9PT0gSW5maW5pdHkpIHtcblx0XHRyZXR1cm4gMTtcblx0fSBlbHNlIGlmICh4ID09PSAtSW5maW5pdHkpIHtcblx0XHRyZXR1cm4gLTE7XG5cdH0gZWxzZSB7XG5cdFx0bGV0IGUyeCA9IE1hdGguZXhwKDIgKiB4KTtcblx0XHRyZXR1cm4gKGUyeCAtIDEpIC8gKGUyeCArIDEpO1xuXHR9XG59O1xuXG4vKiogQnVpbHQtaW4gYWN0aXZhdGlvbiBmdW5jdGlvbnMgKi9cbmV4cG9ydCBjbGFzcyBBY3RpdmF0aW9ucyB7XG5cdHB1YmxpYyBzdGF0aWMgVEFOSDogQWN0aXZhdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHggPT4gKE1hdGggYXMgYW55KS50YW5oKHgpLFxuXHRcdFx0ZGVyOiB4ID0+IHtcblx0XHRcdFx0bGV0IG91dHB1dCA9IEFjdGl2YXRpb25zLlRBTkgub3V0cHV0KHgpO1xuXHRcdFx0XHRyZXR1cm4gMSAtIG91dHB1dCAqIG91dHB1dDtcblx0XHRcdH1cblx0XHR9O1xuXHRwdWJsaWMgc3RhdGljIFJFTFU6IEFjdGl2YXRpb25GdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0b3V0cHV0OiB4ID0+IE1hdGgubWF4KDAsIHgpLFxuXHRcdFx0ZGVyOiB4ID0+IHggPD0gMCA/IDAgOiAxXG5cdFx0fTtcblx0cHVibGljIHN0YXRpYyBTSUdNT0lEOiBBY3RpdmF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogeCA9PiAxIC8gKDEgKyBNYXRoLmV4cCgteCkpLFxuXHRcdFx0ZGVyOiB4ID0+IHtcblx0XHRcdFx0bGV0IG91dHB1dCA9IEFjdGl2YXRpb25zLlNJR01PSUQub3V0cHV0KHgpO1xuXHRcdFx0XHRyZXR1cm4gb3V0cHV0ICogKDEgLSBvdXRwdXQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdHB1YmxpYyBzdGF0aWMgTElORUFSOiBBY3RpdmF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogeCA9PiB4LFxuXHRcdFx0ZGVyOiB4ID0+IDFcblx0XHR9O1xuXHRwdWJsaWMgc3RhdGljIFNJTlg6IEFjdGl2YXRpb25GdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0b3V0cHV0OiB4ID0+IE1hdGguc2luKHgpLFxuXHRcdFx0ZGVyOiB4ID0+IE1hdGguY29zKHgpXG5cdFx0fTtcbn1cblxuLyoqIEJ1aWxkLWluIHJlZ3VsYXJpemF0aW9uIGZ1bmN0aW9ucyAqL1xuZXhwb3J0IGNsYXNzIFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24ge1xuXHRwdWJsaWMgc3RhdGljIEwxOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHcgPT4gTWF0aC5hYnModyksXG5cdFx0XHRkZXI6IHcgPT4gdyA8IDAgPyAtMSA6ICh3ID4gMCA/IDEgOiAwKVxuXHRcdH07XG5cdHB1YmxpYyBzdGF0aWMgTDI6IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogdyA9PiAwLjUgKiB3ICogdyxcblx0XHRcdGRlcjogdyA9PiB3XG5cdFx0fTtcbn1cblxuLyoqXG4gKiBBIGxpbmsgaW4gYSBuZXVyYWwgbmV0d29yay4gRWFjaCBsaW5rIGhhcyBhIHdlaWdodCBhbmQgYSBzb3VyY2UgYW5kXG4gKiBkZXN0aW5hdGlvbiBub2RlLiBBbHNvIGl0IGhhcyBhbiBpbnRlcm5hbCBzdGF0ZSAoZXJyb3IgZGVyaXZhdGl2ZVxuICogd2l0aCByZXNwZWN0IHRvIGEgcGFydGljdWxhciBpbnB1dCkgd2hpY2ggZ2V0cyB1cGRhdGVkIGFmdGVyXG4gKiBhIHJ1biBvZiBiYWNrIHByb3BhZ2F0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgTGluayB7XG5cdGlkOiBzdHJpbmc7XG5cdHNvdXJjZTogTm9kZTtcblx0ZGVzdDogTm9kZTtcblx0d2VpZ2h0ID0gTWF0aC5yYW5kb20oKSAtIDAuNTtcblx0aXNEZWFkID0gZmFsc2U7XG5cdC8qKiBFcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byB0aGlzIHdlaWdodC4gKi9cblx0ZXJyb3JEZXIgPSAwO1xuXHQvKiogQWNjdW11bGF0ZWQgZXJyb3IgZGVyaXZhdGl2ZSBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuICovXG5cdGFjY0Vycm9yRGVyID0gMDtcblx0LyoqIE51bWJlciBvZiBhY2N1bXVsYXRlZCBkZXJpdmF0aXZlcyBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuICovXG5cdG51bUFjY3VtdWxhdGVkRGVycyA9IDA7XG5cdHJlZ3VsYXJpemF0aW9uOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uO1xuXG5cdHRydWVMZWFybmluZ1JhdGUgPSAwO1xuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RzIGEgbGluayBpbiB0aGUgbmV1cmFsIG5ldHdvcmsgaW5pdGlhbGl6ZWQgd2l0aCByYW5kb20gd2VpZ2h0LlxuXHQgKlxuXHQgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2Ugbm9kZS5cblx0ICogQHBhcmFtIGRlc3QgVGhlIGRlc3RpbmF0aW9uIG5vZGUuXG5cdCAqIEBwYXJhbSByZWd1bGFyaXphdGlvbiBUaGUgcmVndWxhcml6YXRpb24gZnVuY3Rpb24gdGhhdCBjb21wdXRlcyB0aGVcblx0ICogICAgIHBlbmFsdHkgZm9yIHRoaXMgd2VpZ2h0LiBJZiBudWxsLCB0aGVyZSB3aWxsIGJlIG5vIHJlZ3VsYXJpemF0aW9uLlxuXHQgKi9cblx0Y29uc3RydWN0b3Ioc291cmNlOiBOb2RlLCBkZXN0OiBOb2RlLFxuXHRcdFx0XHRyZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbiwgaW5pdFplcm8/OiBib29sZWFuKSB7XG5cdFx0dGhpcy5pZCA9IHNvdXJjZS5pZCArIFwiLVwiICsgZGVzdC5pZDtcblx0XHR0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblx0XHR0aGlzLmRlc3QgPSBkZXN0O1xuXHRcdHRoaXMucmVndWxhcml6YXRpb24gPSByZWd1bGFyaXphdGlvbjtcblx0XHRpZiAoaW5pdFplcm8pIHtcblx0XHRcdHRoaXMud2VpZ2h0ID0gMDtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBCdWlsZHMgYSBuZXVyYWwgbmV0d29yay5cbiAqXG4gKiBAcGFyYW0gbmV0d29ya1NoYXBlIFRoZSBzaGFwZSBvZiB0aGUgbmV0d29yay4gRS5nLiBbMSwgMiwgMywgMV0gbWVhbnNcbiAqICAgdGhlIG5ldHdvcmsgd2lsbCBoYXZlIG9uZSBpbnB1dCBub2RlLCAyIG5vZGVzIGluIGZpcnN0IGhpZGRlbiBsYXllcixcbiAqICAgMyBub2RlcyBpbiBzZWNvbmQgaGlkZGVuIGxheWVyIGFuZCAxIG91dHB1dCBub2RlLlxuICogQHBhcmFtIGFjdGl2YXRpb24gVGhlIGFjdGl2YXRpb24gZnVuY3Rpb24gb2YgZXZlcnkgaGlkZGVuIG5vZGUuXG4gKiBAcGFyYW0gb3V0cHV0QWN0aXZhdGlvbiBUaGUgYWN0aXZhdGlvbiBmdW5jdGlvbiBmb3IgdGhlIG91dHB1dCBub2Rlcy5cbiAqIEBwYXJhbSByZWd1bGFyaXphdGlvbiBUaGUgcmVndWxhcml6YXRpb24gZnVuY3Rpb24gdGhhdCBjb21wdXRlcyBhIHBlbmFsdHlcbiAqICAgICBmb3IgYSBnaXZlbiB3ZWlnaHQgKHBhcmFtZXRlcikgaW4gdGhlIG5ldHdvcmsuIElmIG51bGwsIHRoZXJlIHdpbGwgYmVcbiAqICAgICBubyByZWd1bGFyaXphdGlvbi5cbiAqIEBwYXJhbSBpbnB1dElkcyBMaXN0IG9mIGlkcyBmb3IgdGhlIGlucHV0IG5vZGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGROZXR3b3JrKFxuXHRuZXR3b3JrU2hhcGU6IG51bWJlcltdLCBhY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb24sXG5cdG91dHB1dEFjdGl2YXRpb246IEFjdGl2YXRpb25GdW5jdGlvbixcblx0cmVndWxhcml6YXRpb246IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24sXG5cdGlucHV0SWRzOiBzdHJpbmdbXSwgaW5pdFplcm8/OiBib29sZWFuKTogTm9kZVtdW10ge1xuXHRsZXQgbnVtTGF5ZXJzID0gbmV0d29ya1NoYXBlLmxlbmd0aDtcblx0bGV0IGlkID0gMTtcblx0LyoqIExpc3Qgb2YgbGF5ZXJzLCB3aXRoIGVhY2ggbGF5ZXIgYmVpbmcgYSBsaXN0IG9mIG5vZGVzLiAqL1xuXHRsZXQgbmV0d29yazogTm9kZVtdW10gPSBbXTtcblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAwOyBsYXllcklkeCA8IG51bUxheWVyczsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBpc091dHB1dExheWVyID0gbGF5ZXJJZHggPT09IG51bUxheWVycyAtIDE7XG5cdFx0bGV0IGlzSW5wdXRMYXllciA9IGxheWVySWR4ID09PSAwO1xuXHRcdGxldCBjdXJyZW50TGF5ZXI6IE5vZGVbXSA9IFtdO1xuXHRcdG5ldHdvcmsucHVzaChjdXJyZW50TGF5ZXIpO1xuXHRcdGxldCBudW1Ob2RlcyA9IG5ldHdvcmtTaGFwZVtsYXllcklkeF07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1Ob2RlczsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZUlkID0gaWQudG9TdHJpbmcoKTtcblx0XHRcdGlmIChpc0lucHV0TGF5ZXIpIHtcblx0XHRcdFx0bm9kZUlkID0gaW5wdXRJZHNbaV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZCsrO1xuXHRcdFx0fVxuXHRcdFx0bGV0IG5vZGUgPSBuZXcgTm9kZShub2RlSWQsXG5cdFx0XHRcdGlzT3V0cHV0TGF5ZXIgPyBvdXRwdXRBY3RpdmF0aW9uIDogYWN0aXZhdGlvbiwgaW5pdFplcm8pO1xuXHRcdFx0Y3VycmVudExheWVyLnB1c2gobm9kZSk7XG5cdFx0XHRpZiAobGF5ZXJJZHggPj0gMSkge1xuXHRcdFx0XHQvLyBBZGQgbGlua3MgZnJvbSBub2RlcyBpbiB0aGUgcHJldmlvdXMgbGF5ZXIgdG8gdGhpcyBub2RlLlxuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5ldHdvcmtbbGF5ZXJJZHggLSAxXS5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdGxldCBwcmV2Tm9kZSA9IG5ldHdvcmtbbGF5ZXJJZHggLSAxXVtqXTtcblx0XHRcdFx0XHRsZXQgbGluayA9IG5ldyBMaW5rKHByZXZOb2RlLCBub2RlLCByZWd1bGFyaXphdGlvbiwgaW5pdFplcm8pO1xuXHRcdFx0XHRcdHByZXZOb2RlLm91dHB1dHMucHVzaChsaW5rKTtcblx0XHRcdFx0XHRub2RlLmlucHV0TGlua3MucHVzaChsaW5rKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gbmV0d29yaztcbn1cblxuLyoqXG4gKiBSdW5zIGEgZm9yd2FyZCBwcm9wYWdhdGlvbiBvZiB0aGUgcHJvdmlkZWQgaW5wdXQgdGhyb3VnaCB0aGUgcHJvdmlkZWRcbiAqIG5ldHdvcmsuIFRoaXMgbWV0aG9kIG1vZGlmaWVzIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgbmV0d29yayAtIHRoZVxuICogdG90YWwgaW5wdXQgYW5kIG91dHB1dCBvZiBlYWNoIG5vZGUgaW4gdGhlIG5ldHdvcmsuXG4gKlxuICogQHBhcmFtIG5ldHdvcmsgVGhlIG5ldXJhbCBuZXR3b3JrLlxuICogQHBhcmFtIGlucHV0cyBUaGUgaW5wdXQgYXJyYXkuIEl0cyBsZW5ndGggc2hvdWxkIG1hdGNoIHRoZSBudW1iZXIgb2YgaW5wdXRcbiAqICAgICBub2RlcyBpbiB0aGUgbmV0d29yay5cbiAqIEByZXR1cm4gVGhlIGZpbmFsIG91dHB1dCBvZiB0aGUgbmV0d29yay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmRQcm9wKG5ldHdvcms6IE5vZGVbXVtdLCBpbnB1dHM6IG51bWJlcltdKTogbnVtYmVyIHtcblx0bGV0IGlucHV0TGF5ZXIgPSBuZXR3b3JrWzBdO1xuXHRpZiAoaW5wdXRzLmxlbmd0aCAhPT0gaW5wdXRMYXllci5sZW5ndGgpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgbnVtYmVyIG9mIGlucHV0cyBtdXN0IG1hdGNoIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW5cIiArXG5cdFx0XHRcIiB0aGUgaW5wdXQgbGF5ZXJcIik7XG5cdH1cblx0Ly8gVXBkYXRlIHRoZSBpbnB1dCBsYXllci5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IG5vZGUgPSBpbnB1dExheWVyW2ldO1xuXHRcdG5vZGUub3V0cHV0ID0gaW5wdXRzW2ldO1xuXHR9XG5cdGZvciAobGV0IGxheWVySWR4ID0gMTsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aDsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcblx0XHQvLyBVcGRhdGUgYWxsIHRoZSBub2RlcyBpbiB0aGlzIGxheWVyLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdG5vZGUudXBkYXRlT3V0cHV0KCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBuZXR3b3JrW25ldHdvcmsubGVuZ3RoIC0gMV1bMF0ub3V0cHV0O1xufVxuXG4vKipcbiAqIFJ1bnMgYSBiYWNrd2FyZCBwcm9wYWdhdGlvbiB1c2luZyB0aGUgcHJvdmlkZWQgdGFyZ2V0IGFuZCB0aGVcbiAqIGNvbXB1dGVkIG91dHB1dCBvZiB0aGUgcHJldmlvdXMgY2FsbCB0byBmb3J3YXJkIHByb3BhZ2F0aW9uLlxuICogVGhpcyBtZXRob2QgbW9kaWZpZXMgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBuZXR3b3JrIC0gdGhlIGVycm9yXG4gKiBkZXJpdmF0aXZlcyB3aXRoIHJlc3BlY3QgdG8gZWFjaCBub2RlLCBhbmQgZWFjaCB3ZWlnaHRcbiAqIGluIHRoZSBuZXR3b3JrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmFja1Byb3AobmV0d29yazogTm9kZVtdW10sIHRhcmdldDogbnVtYmVyLCBlcnJvckZ1bmM6IEVycm9yRnVuY3Rpb24pOiB2b2lkIHtcblx0Ly8gVGhlIG91dHB1dCBub2RlIGlzIGEgc3BlY2lhbCBjYXNlLiBXZSB1c2UgdGhlIHVzZXItZGVmaW5lZCBlcnJvclxuXHQvLyBmdW5jdGlvbiBmb3IgdGhlIGRlcml2YXRpdmUuXG5cdGxldCBvdXRwdXROb2RlID0gbmV0d29ya1tuZXR3b3JrLmxlbmd0aCAtIDFdWzBdO1xuXHRvdXRwdXROb2RlLm91dHB1dERlciA9IGVycm9yRnVuYy5kZXIob3V0cHV0Tm9kZS5vdXRwdXQsIHRhcmdldCk7XG5cblx0Ly8gR28gdGhyb3VnaCB0aGUgbGF5ZXJzIGJhY2t3YXJkcy5cblx0Zm9yIChsZXQgbGF5ZXJJZHggPSBuZXR3b3JrLmxlbmd0aCAtIDE7IGxheWVySWR4ID49IDE7IGxheWVySWR4LS0pIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Ly8gQ29tcHV0ZSB0aGUgZXJyb3IgZGVyaXZhdGl2ZSBvZiBlYWNoIG5vZGUgd2l0aCByZXNwZWN0IHRvOlxuXHRcdC8vIDEpIGl0cyB0b3RhbCBpbnB1dFxuXHRcdC8vIDIpIGVhY2ggb2YgaXRzIGlucHV0IHdlaWdodHMuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0bm9kZS5pbnB1dERlciA9IG5vZGUub3V0cHV0RGVyICogbm9kZS5hY3RpdmF0aW9uLmRlcihub2RlLnRvdGFsSW5wdXQpO1xuXHRcdFx0bm9kZS5hY2NJbnB1dERlciArPSBub2RlLmlucHV0RGVyO1xuXHRcdFx0bm9kZS5udW1BY2N1bXVsYXRlZERlcnMrKztcblx0XHR9XG5cblx0XHQvLyBFcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byBlYWNoIHdlaWdodCBjb21pbmcgaW50byB0aGUgbm9kZS5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcblx0XHRcdFx0aWYgKGxpbmsuaXNEZWFkKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGluay5lcnJvckRlciA9IG5vZGUuaW5wdXREZXIgKiBsaW5rLnNvdXJjZS5vdXRwdXQ7XG5cdFx0XHRcdGxpbmsuYWNjRXJyb3JEZXIgKz0gbGluay5lcnJvckRlcjtcblx0XHRcdFx0bGluay5udW1BY2N1bXVsYXRlZERlcnMrKztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGxheWVySWR4ID09PSAxKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0bGV0IHByZXZMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHggLSAxXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByZXZMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBwcmV2TGF5ZXJbaV07XG5cdFx0XHQvLyBDb21wdXRlIHRoZSBlcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byBlYWNoIG5vZGUncyBvdXRwdXQuXG5cdFx0XHRub2RlLm91dHB1dERlciA9IDA7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUub3V0cHV0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgb3V0cHV0ID0gbm9kZS5vdXRwdXRzW2pdO1xuXHRcdFx0XHRub2RlLm91dHB1dERlciArPSBvdXRwdXQud2VpZ2h0ICogb3V0cHV0LmRlc3QuaW5wdXREZXI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgd2VpZ2h0cyBvZiB0aGUgbmV0d29yayB1c2luZyB0aGUgcHJldmlvdXNseSBhY2N1bXVsYXRlZCBlcnJvclxuICogZGVyaXZhdGl2ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVXZWlnaHRzKG5ldHdvcms6IE5vZGVbXVtdLCBsZWFybmluZ1JhdGU6IG51bWJlciwgcmVndWxhcml6YXRpb25SYXRlOiBudW1iZXIpIHtcblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdC8vIFVwZGF0ZSB0aGUgbm9kZSdzIGJpYXMuXG5cdFx0XHRpZiAobm9kZS5udW1BY2N1bXVsYXRlZERlcnMgPiAwKSB7XG5cdFx0XHRcdG5vZGUudHJ1ZUxlYXJuaW5nUmF0ZSA9IG5vZGUuYWNjSW5wdXREZXIgLyBub2RlLm51bUFjY3VtdWxhdGVkRGVycztcblx0XHRcdFx0bm9kZS5iaWFzIC09IGxlYXJuaW5nUmF0ZSAqIG5vZGUudHJ1ZUxlYXJuaW5nUmF0ZTsgLy8gbm9kZS5hY2NJbnB1dERlciAvIG5vZGUubnVtQWNjdW11bGF0ZWREZXJzO1xuXHRcdFx0XHRub2RlLmFjY0lucHV0RGVyID0gMDtcblx0XHRcdFx0bm9kZS5udW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuXHRcdFx0fVxuXHRcdFx0Ly8gVXBkYXRlIHRoZSB3ZWlnaHRzIGNvbWluZyBpbnRvIHRoaXMgbm9kZS5cblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2pdO1xuXHRcdFx0XHRpZiAobGluay5pc0RlYWQpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgcmVndWxEZXIgPSBsaW5rLnJlZ3VsYXJpemF0aW9uID9cblx0XHRcdFx0XHRsaW5rLnJlZ3VsYXJpemF0aW9uLmRlcihsaW5rLndlaWdodCkgOiAwO1xuXHRcdFx0XHRpZiAobGluay5udW1BY2N1bXVsYXRlZERlcnMgPiAwKSB7XG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSB3ZWlnaHQgYmFzZWQgb24gZEUvZHcuXG5cdFx0XHRcdFx0bGluay50cnVlTGVhcm5pbmdSYXRlID0gbGluay5hY2NFcnJvckRlciAvIGxpbmsubnVtQWNjdW11bGF0ZWREZXJzO1xuXHRcdFx0XHRcdGxpbmsud2VpZ2h0ID0gbGluay53ZWlnaHQgLSBsZWFybmluZ1JhdGUgKiBsaW5rLnRydWVMZWFybmluZ1JhdGU7XG5cblx0XHRcdFx0XHQvLyBGdXJ0aGVyIHVwZGF0ZSB0aGUgd2VpZ2h0IGJhc2VkIG9uIHJlZ3VsYXJpemF0aW9uLlxuXHRcdFx0XHRcdGxldCBuZXdMaW5rV2VpZ2h0ID0gbGluay53ZWlnaHQgLVxuXHRcdFx0XHRcdFx0KGxlYXJuaW5nUmF0ZSAqIHJlZ3VsYXJpemF0aW9uUmF0ZSkgKiByZWd1bERlcjtcblx0XHRcdFx0XHRpZiAobGluay5yZWd1bGFyaXphdGlvbiA9PT0gUmVndWxhcml6YXRpb25GdW5jdGlvbi5MMSAmJlxuXHRcdFx0XHRcdFx0bGluay53ZWlnaHQgKiBuZXdMaW5rV2VpZ2h0IDwgMCkge1xuXHRcdFx0XHRcdFx0Ly8gVGhlIHdlaWdodCBjcm9zc2VkIDAgZHVlIHRvIHRoZSByZWd1bGFyaXphdGlvbiB0ZXJtLiBTZXQgaXQgdG8gMC5cblx0XHRcdFx0XHRcdGxpbmsud2VpZ2h0ID0gMDtcblx0XHRcdFx0XHRcdGxpbmsuaXNEZWFkID0gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGluay53ZWlnaHQgPSBuZXdMaW5rV2VpZ2h0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsaW5rLmFjY0Vycm9yRGVyID0gMDtcblx0XHRcdFx0XHRsaW5rLm51bUFjY3VtdWxhdGVkRGVycyA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuLyoqIEl0ZXJhdGVzIG92ZXIgZXZlcnkgbm9kZSBpbiB0aGUgbmV0d29yay8gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoTm9kZShuZXR3b3JrOiBOb2RlW11bXSwgaWdub3JlSW5wdXRzOiBib29sZWFuLFxuXHRcdFx0XHRcdFx0XHRhY2Nlc3NvcjogKG5vZGU6IE5vZGUpID0+IGFueSkge1xuXHRmb3IgKGxldCBsYXllcklkeCA9IGlnbm9yZUlucHV0cyA/IDEgOiAwOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdGFjY2Vzc29yKG5vZGUpO1xuXHRcdH1cblx0fVxufVxuXG4vKiogUmV0dXJucyB0aGUgb3V0cHV0IG5vZGUgaW4gdGhlIG5ldHdvcmsuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3V0cHV0Tm9kZShuZXR3b3JrOiBOb2RlW11bXSkge1xuXHRyZXR1cm4gbmV0d29ya1tuZXR3b3JrLmxlbmd0aCAtIDFdWzBdO1xufVxuIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZGVjbGFyZSB2YXIgJDogYW55O1xuXG5pbXBvcnQgKiBhcyBubiBmcm9tIFwiLi9ublwiO1xuaW1wb3J0IHtIZWF0TWFwLCByZWR1Y2VNYXRyaXh9IGZyb20gXCIuL2hlYXRtYXBcIjtcbmltcG9ydCB7XG5cdFN0YXRlLFxuXHRkYXRhc2V0cyxcblx0cmVnRGF0YXNldHMsXG5cdGFjdGl2YXRpb25zLFxuXHRwcm9ibGVtcyxcblx0cmVndWxhcml6YXRpb25zLFxuXHRnZXRLZXlGcm9tVmFsdWUsXG5cdFByb2JsZW1cbn0gZnJvbSBcIi4vc3RhdGVcIjtcbmltcG9ydCB7RXhhbXBsZTJELCBzaHVmZmxlLCBEYXRhR2VuZXJhdG9yfSBmcm9tIFwiLi9kYXRhc2V0XCI7XG5pbXBvcnQge0FwcGVuZGluZ0xpbmVDaGFydH0gZnJvbSBcIi4vbGluZWNoYXJ0XCI7XG5cbmxldCBtYWluV2lkdGg7XG5cbnR5cGUgZW5lcmd5VHlwZSA9IHtcblx0ZVZhbDogbnVtYmVyLFxuXHRsYWJlbDogbnVtYmVyXG59O1xuXG5mdW5jdGlvbiBtdHJ1bmModjogbnVtYmVyKSB7XG5cdHYgPSArdjtcblx0cmV0dXJuICh2IC0gdiAlIDEpIHx8ICghaXNGaW5pdGUodikgfHwgdiA9PT0gMCA/IHYgOiB2IDwgMCA/IC0wIDogMCk7XG59XG5cbmZ1bmN0aW9uIGxvZzIoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coMik7XG59XG5cbmZ1bmN0aW9uIGxvZzEwKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGgubG9nKDEwKTtcbn1cblxuZnVuY3Rpb24gc2lnbmFsT2YoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIGxvZzIoMSArIE1hdGguYWJzKHgpKTtcbn1cblxuZnVuY3Rpb24gU05SKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiAxMCAqIGxvZzEwKHgpO1xufVxuXG4vLyBNb3JlIHNjcm9sbGluZ1xuZDMuc2VsZWN0KFwiLm1vcmUgYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRsZXQgcG9zaXRpb24gPSA4MDA7XG5cdGQzLnRyYW5zaXRpb24oKVxuXHRcdC5kdXJhdGlvbigxMDAwKVxuXHRcdC50d2VlbihcInNjcm9sbFwiLCBzY3JvbGxUd2Vlbihwb3NpdGlvbikpO1xufSk7XG5cbmZ1bmN0aW9uIHNjcm9sbFR3ZWVuKG9mZnNldCkge1xuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGxldCBpID0gZDMuaW50ZXJwb2xhdGVOdW1iZXIod2luZG93LnBhZ2VZT2Zmc2V0IHx8XG5cdFx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLCBvZmZzZXQpO1xuXHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0c2Nyb2xsVG8oMCwgaSh0KSk7XG5cdFx0fTtcblx0fTtcbn1cblxuY29uc3QgUkVDVF9TSVpFID0gMzA7XG5jb25zdCBCSUFTX1NJWkUgPSA1O1xuY29uc3QgTlVNX1NBTVBMRVNfQ0xBU1NJRlkgPSA1MDA7XG5jb25zdCBOVU1fU0FNUExFU19SRUdSRVNTID0gMTIwMDtcbmNvbnN0IERFTlNJVFkgPSAxMDA7XG5cbmNvbnN0IE1BWF9ORVVST05TID0gMzI7XG5jb25zdCBNQVhfSExBWUVSUyA9IDEwO1xuXG4vLyBSb3VuZGluZyBvZmYgb2YgdHJhaW5pbmcgZGF0YS4gVXNlZCBieSBnZXRSZXFDYXBhY2l0eVxuY29uc3QgUkVRX0NBUF9ST1VORElORyA9IC0xO1xuXG5lbnVtIEhvdmVyVHlwZSB7XG5cdEJJQVMsIFdFSUdIVFxufVxuXG5pbnRlcmZhY2UgSW5wdXRGZWF0dXJlIHtcblx0ZjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXI7XG5cdGxhYmVsPzogc3RyaW5nO1xufVxuXG5sZXQgSU5QVVRTOiB7IFtuYW1lOiBzdHJpbmddOiBJbnB1dEZlYXR1cmUgfSA9IHtcblx0XCJ4XCI6IHtmOiAoeCwgeSkgPT4geCwgbGFiZWw6IFwiWF8xXCJ9LFxuXHRcInlcIjoge2Y6ICh4LCB5KSA9PiB5LCBsYWJlbDogXCJYXzJcIn0sXG5cdFwieFNxdWFyZWRcIjoge2Y6ICh4LCB5KSA9PiB4ICogeCwgbGFiZWw6IFwiWF8xXjJcIn0sXG5cdFwieVNxdWFyZWRcIjoge2Y6ICh4LCB5KSA9PiB5ICogeSwgbGFiZWw6IFwiWF8yXjJcIn0sXG5cdFwieFRpbWVzWVwiOiB7ZjogKHgsIHkpID0+IHggKiB5LCBsYWJlbDogXCJYXzFYXzJcIn0sXG5cdFwic2luWFwiOiB7ZjogKHgsIHkpID0+IE1hdGguc2luKHgpLCBsYWJlbDogXCJzaW4oWF8xKVwifSxcblx0XCJzaW5ZXCI6IHtmOiAoeCwgeSkgPT4gTWF0aC5zaW4oeSksIGxhYmVsOiBcInNpbihYXzIpXCJ9LFxufTtcblxubGV0IEhJREFCTEVfQ09OVFJPTFMgPVxuXHRbXG5cdFx0W1wiU2hvdyB0ZXN0IGRhdGFcIiwgXCJzaG93VGVzdERhdGFcIl0sXG5cdFx0W1wiRGlzY3JldGl6ZSBvdXRwdXRcIiwgXCJkaXNjcmV0aXplXCJdLFxuXHRcdFtcIlBsYXkgYnV0dG9uXCIsIFwicGxheUJ1dHRvblwiXSxcblx0XHRbXCJTdGVwIGJ1dHRvblwiLCBcInN0ZXBCdXR0b25cIl0sXG5cdFx0W1wiUmVzZXQgYnV0dG9uXCIsIFwicmVzZXRCdXR0b25cIl0sXG5cdFx0W1wiUmF0ZSBzY2FsZSBmYWN0b3JcIiwgXCJsZWFybmluZ1JhdGVcIl0sXG5cdFx0W1wiTGVhcm5pbmcgcmF0ZVwiLCBcInRydWVMZWFybmluZ1JhdGVcIl0sXG5cdFx0W1wiQWN0aXZhdGlvblwiLCBcImFjdGl2YXRpb25cIl0sXG5cdFx0W1wiUmVndWxhcml6YXRpb25cIiwgXCJyZWd1bGFyaXphdGlvblwiXSxcblx0XHRbXCJSZWd1bGFyaXphdGlvbiByYXRlXCIsIFwicmVndWxhcml6YXRpb25SYXRlXCJdLFxuXHRcdFtcIlByb2JsZW0gdHlwZVwiLCBcInByb2JsZW1cIl0sXG5cdFx0W1wiV2hpY2ggZGF0YXNldFwiLCBcImRhdGFzZXRcIl0sXG5cdFx0W1wiUmF0aW8gdHJhaW4gZGF0YVwiLCBcInBlcmNUcmFpbkRhdGFcIl0sXG5cdFx0W1wiTm9pc2UgbGV2ZWxcIiwgXCJub2lzZVwiXSxcblx0XHRbXCJCYXRjaCBzaXplXCIsIFwiYmF0Y2hTaXplXCJdLFxuXHRcdFtcIiMgb2YgaGlkZGVuIGxheWVyc1wiLCBcIm51bUhpZGRlbkxheWVyc1wiXSxcblx0XTtcblxuY2xhc3MgUGxheWVyIHtcblx0cHJpdmF0ZSB0aW1lckluZGV4ID0gMDtcblx0cHJpdmF0ZSBpc1BsYXlpbmcgPSBmYWxzZTtcblx0cHJpdmF0ZSBjYWxsYmFjazogKGlzUGxheWluZzogYm9vbGVhbikgPT4gdm9pZCA9IG51bGw7XG5cblx0LyoqIFBsYXlzL3BhdXNlcyB0aGUgcGxheWVyLiAqL1xuXHRwbGF5T3JQYXVzZSgpIHtcblx0XHRpZiAodGhpcy5pc1BsYXlpbmcpIHtcblx0XHRcdHRoaXMuaXNQbGF5aW5nID0gZmFsc2U7XG5cdFx0XHR0aGlzLnBhdXNlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuaXNQbGF5aW5nID0gdHJ1ZTtcblx0XHRcdGlmIChpdGVyID09PSAwKSB7XG5cdFx0XHRcdHNpbXVsYXRpb25TdGFydGVkKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnBsYXkoKTtcblx0XHR9XG5cdH1cblxuXHRvblBsYXlQYXVzZShjYWxsYmFjazogKGlzUGxheWluZzogYm9vbGVhbikgPT4gdm9pZCkge1xuXHRcdHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcblx0fVxuXG5cdHBsYXkoKSB7XG5cdFx0dGhpcy5wYXVzZSgpO1xuXHRcdHRoaXMuaXNQbGF5aW5nID0gdHJ1ZTtcblx0XHRpZiAodGhpcy5jYWxsYmFjaykge1xuXHRcdFx0dGhpcy5jYWxsYmFjayh0aGlzLmlzUGxheWluZyk7XG5cdFx0fVxuXHRcdHRoaXMuc3RhcnQodGhpcy50aW1lckluZGV4KTtcblx0fVxuXG5cdHBhdXNlKCkge1xuXHRcdHRoaXMudGltZXJJbmRleCsrO1xuXHRcdHRoaXMuaXNQbGF5aW5nID0gZmFsc2U7XG5cdFx0aWYgKHRoaXMuY2FsbGJhY2spIHtcblx0XHRcdHRoaXMuY2FsbGJhY2sodGhpcy5pc1BsYXlpbmcpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RhcnQobG9jYWxUaW1lckluZGV4OiBudW1iZXIpIHtcblx0XHRkMy50aW1lcigoKSA9PiB7XG5cdFx0XHRpZiAobG9jYWxUaW1lckluZGV4IDwgdGhpcy50aW1lckluZGV4KSB7XG5cdFx0XHRcdHJldHVybiB0cnVlOyAgLy8gRG9uZS5cblx0XHRcdH1cblx0XHRcdG9uZVN0ZXAoKTtcblx0XHRcdHJldHVybiBmYWxzZTsgIC8vIE5vdCBkb25lLlxuXHRcdH0sIDApO1xuXHR9XG59XG5cbmxldCBzdGF0ZSA9IFN0YXRlLmRlc2VyaWFsaXplU3RhdGUoKTtcblxuLy8gRmlsdGVyIG91dCBpbnB1dHMgdGhhdCBhcmUgaGlkZGVuLlxuc3RhdGUuZ2V0SGlkZGVuUHJvcHMoKS5mb3JFYWNoKHByb3AgPT4ge1xuXHRpZiAocHJvcCBpbiBJTlBVVFMpIHtcblx0XHRkZWxldGUgSU5QVVRTW3Byb3BdO1xuXHR9XG59KTtcblxubGV0IGJvdW5kYXJ5OiB7IFtpZDogc3RyaW5nXTogbnVtYmVyW11bXSB9ID0ge307XG5sZXQgc2VsZWN0ZWROb2RlSWQ6IHN0cmluZyA9IG51bGw7XG4vLyBQbG90IHRoZSBoZWF0bWFwLlxubGV0IHhEb21haW46IFtudW1iZXIsIG51bWJlcl0gPSBbLTYsIDZdO1xubGV0IGhlYXRNYXAgPVxuXHRuZXcgSGVhdE1hcCgzMDAsIERFTlNJVFksIHhEb21haW4sIHhEb21haW4sIGQzLnNlbGVjdChcIiNoZWF0bWFwXCIpLFxuXHRcdHtzaG93QXhlczogdHJ1ZX0pO1xubGV0IGxpbmtXaWR0aFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0LmRvbWFpbihbMCwgNV0pXG5cdC5yYW5nZShbMSwgMTBdKVxuXHQuY2xhbXAodHJ1ZSk7XG5sZXQgY29sb3JTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcjxzdHJpbmc+KClcblx0LmRvbWFpbihbLTEsIDAsIDFdKVxuXHQucmFuZ2UoW1wiIzA4NzdiZFwiLCBcIiNlOGVhZWJcIiwgXCIjZjU5MzIyXCJdKVxuXHQuY2xhbXAodHJ1ZSk7XG5sZXQgaXRlciA9IDA7XG5sZXQgdHJhaW5EYXRhOiBFeGFtcGxlMkRbXSA9IFtdO1xubGV0IHRlc3REYXRhOiBFeGFtcGxlMkRbXSA9IFtdO1xubGV0IG5ldHdvcms6IG5uLk5vZGVbXVtdID0gbnVsbDtcbmxldCBsb3NzVHJhaW4gPSAwO1xubGV0IGxvc3NUZXN0ID0gMDtcbmxldCB0cnVlTGVhcm5pbmdSYXRlID0gMDtcbmxldCB0b3RhbENhcGFjaXR5ID0gMDtcbmxldCBnZW5lcmFsaXphdGlvbiA9IDA7XG5sZXQgcGxheWVyID0gbmV3IFBsYXllcigpO1xubGV0IGxpbmVDaGFydCA9IG5ldyBBcHBlbmRpbmdMaW5lQ2hhcnQoZDMuc2VsZWN0KFwiI2xpbmVjaGFydFwiKSxcblx0W1wiIzc3N1wiLCBcImJsYWNrXCJdKTtcblxuZnVuY3Rpb24gZ2V0UmVxQ2FwYWNpdHkocG9pbnRzOiBFeGFtcGxlMkRbXSk6IG51bWJlcltdIHtcblxuXHRsZXQgcm91bmRpbmcgPSBSRVFfQ0FQX1JPVU5ESU5HO1xuXHRsZXQgZW5lcmd5OiBlbmVyZ3lUeXBlW10gPSBbXTtcblx0bGV0IG51bVJvd3M6IG51bWJlciA9IHBvaW50cy5sZW5ndGg7XG5cdGxldCBudW1Db2xzOiBudW1iZXIgPSAyO1xuXHRsZXQgcmVzdWx0OiBudW1iZXIgPSAwO1xuXHRsZXQgcmV0dmFsOiBudW1iZXJbXSA9IFtdO1xuXG5cdGxldCBjbGFzczEgPSAtNjY2O1xuXHRsZXQgbnVtY2xhc3MxOiBudW1iZXIgPSAwO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVJvd3M7IGkrKykge1xuXHRcdGxldCB4OiBudW1iZXIgPSBwb2ludHNbaV0ueCAvIDEuMDtcblx0XHRsZXQgeTogbnVtYmVyID0gcG9pbnRzW2ldLnkgLyAxLjA7XG5cdFx0bGV0IHJlc3VsdDogbnVtYmVyID0gKHggKyB5KSAvIDEuMDtcblx0XHQvLyB+IGNvbnNvbGUubG9nKFwieDogXCIgKyB4ICsgXCJcXHR5OiBcIiArIHkgKyBcIlxcdHJlc3VsdFtcIiArIGkgKyBcIl06IFwiICsgcmVzdWx0KTtcblx0XHRpZiAocm91bmRpbmcgIT0gLTEpIHtcblx0XHRcdHJlc3VsdCA9IG10cnVuYyhyZXN1bHQgKiBNYXRoLnBvdygxMCwgcm91bmRpbmcpKSAvIE1hdGgucG93KDEwLCByb3VuZGluZyk7XG5cdFx0fVxuXHRcdGxldCBlVmFsOiBudW1iZXIgPSByZXN1bHQ7XG5cdFx0bGV0IGxhYmVsOiBudW1iZXIgPSBwb2ludHNbaV0ubGFiZWw7XG5cdFx0ZW5lcmd5LnB1c2goe2VWYWwsIGxhYmVsfSk7XG5cdFx0aWYgKGNsYXNzMSA9PSAtNjY2KSB7XG5cdFx0XHRjbGFzczEgPSBsYWJlbDtcblx0XHR9XG5cdFx0aWYgKGxhYmVsID09IGNsYXNzMSkge1xuXHRcdFx0bnVtY2xhc3MxKys7XG5cdFx0fVxuXHR9XG5cblxuXHRlbmVyZ3kuc29ydChcblx0XHRmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0cmV0dXJuIGEuZVZhbCAtIGIuZVZhbDtcblx0XHR9XG5cdCk7XG5cblx0bGV0IGN1ckxhYmVsID0gZW5lcmd5WzBdLmxhYmVsO1xuXHRsZXQgY2hhbmdlcyA9IDA7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBlbmVyZ3kubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoZW5lcmd5W2ldLmxhYmVsICE9IGN1ckxhYmVsKSB7XG5cdFx0XHRjaGFuZ2VzKys7XG5cdFx0XHRjdXJMYWJlbCA9IGVuZXJneVtpXS5sYWJlbDtcblx0XHR9XG5cdH1cblxuXHRsZXQgY2x1c3RlcnM6IG51bWJlciA9IDA7XG5cdGNsdXN0ZXJzID0gY2hhbmdlcyArIDE7XG5cblx0bGV0IG1pbmN1dHM6IG51bWJlciA9IDA7XG5cdG1pbmN1dHMgPSBNYXRoLmNlaWwobG9nMihjbHVzdGVycykpO1xuXG5cdGxldCBzdWdDYXBhY2l0eSA9IG1pbmN1dHMgKiBudW1Db2xzO1xuXHRsZXQgbWF4Q2FwYWNpdHkgPSBjaGFuZ2VzICogKG51bUNvbHMgKyAxKSArIGNoYW5nZXM7XG5cblx0cmV0dmFsLnB1c2goc3VnQ2FwYWNpdHkpO1xuXHRyZXR2YWwucHVzaChtYXhDYXBhY2l0eSk7XG5cblxuXHRyZXR1cm4gcmV0dmFsO1xufVxuXG4vLyB+IGxldCBteURhdGE6IEV4YW1wbGUyRFtdID0gW107XG5mdW5jdGlvbiBudW1iZXJPZlVuaXF1ZShkYXRhc2V0OiBFeGFtcGxlMkRbXSkge1xuXHRsZXQgbWFwcGVkRGF0YXNldCA9IGRhdGFzZXQubWFwKHBvaW50ID0+IFwiXCIgKyBwb2ludC54ICsgcG9pbnQueSArIHBvaW50LmxhYmVsKTtcblx0cmV0dXJuIG1hcHBlZERhdGFzZXQuZmlsdGVyKGZ1bmN0aW9uIChuLCBpLCBzZWxmKSB7XG5cdFx0cmV0dXJuIHNlbGYuaW5kZXhPZihuKSA9PSBpO1xuXHR9KS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIG1ha2VHVUkoKSB7XG5cdGQzLnNlbGVjdChcIiNyZXNldC1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0cmVzZXQoKTtcblx0XHR1c2VySGFzSW50ZXJhY3RlZCgpO1xuXHRcdGQzLnNlbGVjdChcIiNwbGF5LXBhdXNlLWJ1dHRvblwiKTtcblx0fSk7XG5cblx0ZDMuc2VsZWN0KFwiI3BsYXktcGF1c2UtYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdC8vIENoYW5nZSB0aGUgYnV0dG9uJ3MgY29udGVudC5cblx0XHR1c2VySGFzSW50ZXJhY3RlZCgpO1xuXHRcdHBsYXllci5wbGF5T3JQYXVzZSgpO1xuXHR9KTtcblxuXHRwbGF5ZXIub25QbGF5UGF1c2UoaXNQbGF5aW5nID0+IHtcblx0XHRkMy5zZWxlY3QoXCIjcGxheS1wYXVzZS1idXR0b25cIikuY2xhc3NlZChcInBsYXlpbmdcIiwgaXNQbGF5aW5nKTtcblx0fSk7XG5cblx0ZDMuc2VsZWN0KFwiI25leHQtc3RlcC1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0cGxheWVyLnBhdXNlKCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRpZiAoaXRlciA9PT0gMCkge1xuXHRcdFx0c2ltdWxhdGlvblN0YXJ0ZWQoKTtcblx0XHR9XG5cdFx0b25lU3RlcCgpO1xuXHR9KTtcblxuXHRkMy5zZWxlY3QoXCIjZGF0YS1yZWdlbi1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0Z2VuZXJhdGVEYXRhKCk7XG5cdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHR9KTtcblxuXHRsZXQgZGF0YVRodW1ibmFpbHMgPSBkMy5zZWxlY3RBbGwoXCJjYW52YXNbZGF0YS1kYXRhc2V0XVwiKTtcblx0ZGF0YVRodW1ibmFpbHMub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IG5ld0RhdGFzZXQgPSBkYXRhc2V0c1t0aGlzLmRhdGFzZXQuZGF0YXNldF07XG5cdFx0bGV0IGRhdGFzZXRLZXkgPSBnZXRLZXlGcm9tVmFsdWUoZGF0YXNldHMsIG5ld0RhdGFzZXQpO1xuXG5cdFx0aWYgKG5ld0RhdGFzZXQgPT09IHN0YXRlLmRhdGFzZXQgJiYgZGF0YXNldEtleSAhPSBcImJ5b2RcIikge1xuXHRcdFx0cmV0dXJuOyAvLyBOby1vcC5cblx0XHR9XG5cblx0XHRzdGF0ZS5kYXRhc2V0ID0gbmV3RGF0YXNldDtcblxuXG5cdFx0aWYgKGRhdGFzZXRLZXkgPT09IFwiYnlvZFwiKSB7XG5cblx0XHRcdHN0YXRlLmJ5b2QgPSB0cnVlO1xuXHRcdFx0ZDMuc2VsZWN0KFwiI2lucHV0Rm9ybUJZT0RcIikuaHRtbChcIjxpbnB1dCB0eXBlPSdmaWxlJyBhY2NlcHQ9Jy5jc3YnIGlkPSdpbnB1dEZpbGVCWU9EJz5cIik7XG5cdFx0XHRkYXRhVGh1bWJuYWlscy5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuXHRcdFx0ZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcblx0XHRcdCQoXCIjaW5wdXRGaWxlQllPRFwiKS5jbGljaygpO1xuXG5cdFx0XHQvLyBkMy5zZWxlY3QoXCIjbm9pc2VcIikudmFsdWUoc3RhdGUubm9pc2UpO1xuXHRcdFx0Ly8gfiAkKFwiI25vaXNlXCIpLnNsaWRlcihcImRpc2FibGVcIik7XG5cblx0XHRcdGxldCBpbnB1dEJZT0QgPSBkMy5zZWxlY3QoXCIjaW5wdXRGaWxlQllPRFwiKTtcblx0XHRcdGlucHV0QllPRC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cdFx0XHRcdGxldCBuYW1lID0gdGhpcy5maWxlc1swXS5uYW1lO1xuXHRcdFx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0XHRcdFx0XHRsZXQgdGFyZ2V0OiBhbnkgPSBldmVudC50YXJnZXQ7XG5cdFx0XHRcdFx0bGV0IGRhdGEgPSB0YXJnZXQucmVzdWx0O1xuXHRcdFx0XHRcdGxldCBzID0gZGF0YS5zcGxpdChcIlxcblwiKTtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGxldCBzcyA9IHNbaV0uc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRcdFx0aWYgKHNzLmxlbmd0aCAhPSAzKSBicmVhaztcblx0XHRcdFx0XHRcdGxldCB4ID0gc3NbMF07XG5cdFx0XHRcdFx0XHRsZXQgeSA9IHNzWzFdO1xuXHRcdFx0XHRcdFx0bGV0IGxhYmVsID0gc3NbMl07XG5cdFx0XHRcdFx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0XHRcdFx0XHRcdC8vIH4gY29uc29sZS5sb2cocG9pbnRzW2ldLngrXCIsXCIrcG9pbnRzW2ldLnkrXCIsXCIrcG9pbnRzW2ldLmxhYmVsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c2h1ZmZsZShwb2ludHMpO1xuXHRcdFx0XHRcdC8vIFNwbGl0IGludG8gdHJhaW4gYW5kIHRlc3QgZGF0YS5cblx0XHRcdFx0XHRsZXQgc3BsaXRJbmRleCA9IE1hdGguZmxvb3IocG9pbnRzLmxlbmd0aCAqIHN0YXRlLnBlcmNUcmFpbkRhdGEgLyAxMDApO1xuXHRcdFx0XHRcdHRyYWluRGF0YSA9IHBvaW50cy5zbGljZSgwLCBzcGxpdEluZGV4KTtcblx0XHRcdFx0XHR0ZXN0RGF0YSA9IHBvaW50cy5zbGljZShzcGxpdEluZGV4KTtcblxuXHRcdFx0XHRcdGhlYXRNYXAudXBkYXRlUG9pbnRzKHRyYWluRGF0YSk7XG5cdFx0XHRcdFx0aGVhdE1hcC51cGRhdGVUZXN0UG9pbnRzKHN0YXRlLnNob3dUZXN0RGF0YSA/IHRlc3REYXRhIDogW10pO1xuXG5cblx0XHRcdFx0XHQvLyB+IHN0YXRlLnN1Z0NhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkocG9pbnRzKVswXTtcblx0XHRcdFx0XHQvLyB+IHN0YXRlLm1heENhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkocG9pbnRzKVsxXTtcblx0XHRcdFx0XHRzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMF07XG5cdFx0XHRcdFx0c3RhdGUubWF4Q2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzFdO1xuXHRcdFx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbWF4Q2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5tYXhDYXBhY2l0eSk7XG5cdFx0XHRcdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0XHRcdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cdFx0XHRcdFx0Ly8vLy8vLy8vLy8vLy8vLy8vXG5cdFx0XHRcdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHJlc2V0KCk7XG5cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZWFkZXIucmVhZEFzVGV4dCh0aGlzLmZpbGVzWzBdKTtcblx0XHRcdH0pO1xuXG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0c3RhdGUuYnlvZCA9IGZhbHNlO1xuXHRcdFx0Ly8gfiBkMy5zZWxlY3QoXCIjaW5wdXRGb3JtQllPRFwiKS5odG1sKFwiXCIpO1xuXHRcdFx0Ly8gJChcIiNub2lzZVwiKS5kaXNhYmxlZCA9IGZhbHNlO1xuXG5cdFx0XHRkYXRhVGh1bWJuYWlscy5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuXHRcdFx0ZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcblx0XHRcdHN0YXRlLm5vaXNlID0gMzU7IC8vIFNOUmRCXG5cblxuXHRcdFx0Z2VuZXJhdGVEYXRhKCk7XG5cblx0XHRcdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRyYWluRGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRwb2ludHMucHVzaCh0cmFpbkRhdGFbaV0pO1xuXHRcdFx0fVxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0ZXN0RGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRwb2ludHMucHVzaCh0ZXN0RGF0YVtpXSk7XG5cdFx0XHR9XG5cdFx0XHQvLyB+IHN0YXRlLnN1Z0NhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkocG9pbnRzKVswXTtcblx0XHRcdC8vIH4gc3RhdGUubWF4Q2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eShwb2ludHMpWzFdO1xuXHRcdFx0c3RhdGUuc3VnQ2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzBdO1xuXHRcdFx0c3RhdGUubWF4Q2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzFdO1xuXHRcdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cblx0XHRcdGNvbnNvbGUubG9nKHRyYWluRGF0YSk7XG5cdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRyZXNldCgpO1xuXHRcdH1cblxuXHR9KTtcblxuXHRsZXQgZGF0YXNldEtleSA9IGdldEtleUZyb21WYWx1ZShkYXRhc2V0cywgc3RhdGUuZGF0YXNldCk7XG5cdC8vIFNlbGVjdCB0aGUgZGF0YXNldCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG5cdGQzLnNlbGVjdChgY2FudmFzW2RhdGEtZGF0YXNldD0ke2RhdGFzZXRLZXl9XWApXG5cdFx0LmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcblxuXHRsZXQgcmVnRGF0YVRodW1ibmFpbHMgPSBkMy5zZWxlY3RBbGwoXCJjYW52YXNbZGF0YS1yZWdEYXRhc2V0XVwiKTtcblx0cmVnRGF0YVRodW1ibmFpbHMub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IG5ld0RhdGFzZXQgPSByZWdEYXRhc2V0c1t0aGlzLmRhdGFzZXQucmVnZGF0YXNldF07XG5cdFx0aWYgKG5ld0RhdGFzZXQgPT09IHN0YXRlLnJlZ0RhdGFzZXQpIHtcblx0XHRcdHJldHVybjsgLy8gTm8tb3AuXG5cdFx0fVxuXHRcdHN0YXRlLnJlZ0RhdGFzZXQgPSBuZXdEYXRhc2V0O1xuXHRcdHN0YXRlLnN1Z0NhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkodHJhaW5EYXRhKVswXTtcblx0XHRzdGF0ZS5tYXhDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMV07XG5cdFx0cmVnRGF0YVRodW1ibmFpbHMuY2xhc3NlZChcInNlbGVjdGVkXCIsIGZhbHNlKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xuXHRcdGdlbmVyYXRlRGF0YSgpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRsZXQgcmVnRGF0YXNldEtleSA9IGdldEtleUZyb21WYWx1ZShyZWdEYXRhc2V0cywgc3RhdGUucmVnRGF0YXNldCk7XG5cdC8vIFNlbGVjdCB0aGUgZGF0YXNldCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG5cdGQzLnNlbGVjdChgY2FudmFzW2RhdGEtcmVnRGF0YXNldD0ke3JlZ0RhdGFzZXRLZXl9XWApXG5cdFx0LmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcblxuXG5cdGQzLnNlbGVjdChcIiNhZGQtbGF5ZXJzXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlmIChzdGF0ZS5udW1IaWRkZW5MYXllcnMgPj0gTUFYX0hMQVlFUlMpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0c3RhdGUubmV0d29ya1NoYXBlW3N0YXRlLm51bUhpZGRlbkxheWVyc10gPSAyO1xuXHRcdHN0YXRlLm51bUhpZGRlbkxheWVycysrO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRkMy5zZWxlY3QoXCIjcmVtb3ZlLWxheWVyc1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAoc3RhdGUubnVtSGlkZGVuTGF5ZXJzIDw9IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0c3RhdGUubnVtSGlkZGVuTGF5ZXJzLS07XG5cdFx0c3RhdGUubmV0d29ya1NoYXBlLnNwbGljZShzdGF0ZS5udW1IaWRkZW5MYXllcnMpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRsZXQgc2hvd1Rlc3REYXRhID0gZDMuc2VsZWN0KFwiI3Nob3ctdGVzdC1kYXRhXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5zaG93VGVzdERhdGEgPSB0aGlzLmNoZWNrZWQ7XG5cdFx0c3RhdGUuc2VyaWFsaXplKCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRoZWF0TWFwLnVwZGF0ZVRlc3RQb2ludHMoc3RhdGUuc2hvd1Rlc3REYXRhID8gdGVzdERhdGEgOiBbXSk7XG5cdH0pO1xuXG5cdC8vIENoZWNrL3VuY2hlY2sgdGhlIGNoZWNrYm94IGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS5cblx0c2hvd1Rlc3REYXRhLnByb3BlcnR5KFwiY2hlY2tlZFwiLCBzdGF0ZS5zaG93VGVzdERhdGEpO1xuXG5cdGxldCBkaXNjcmV0aXplID0gZDMuc2VsZWN0KFwiI2Rpc2NyZXRpemVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLmRpc2NyZXRpemUgPSB0aGlzLmNoZWNrZWQ7XG5cdFx0c3RhdGUuc2VyaWFsaXplKCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHR1cGRhdGVVSSgpO1xuXHR9KTtcblx0Ly8gQ2hlY2svdW5jaGVjayB0aGUgY2hlY2JveCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG5cdGRpc2NyZXRpemUucHJvcGVydHkoXCJjaGVja2VkXCIsIHN0YXRlLmRpc2NyZXRpemUpO1xuXG5cdGxldCBwZXJjVHJhaW4gPSBkMy5zZWxlY3QoXCIjcGVyY1RyYWluRGF0YVwiKS5vbihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5wZXJjVHJhaW5EYXRhID0gdGhpcy52YWx1ZTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3BlcmNUcmFpbkRhdGEnXSAudmFsdWVcIikudGV4dCh0aGlzLnZhbHVlKTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblx0cGVyY1RyYWluLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUucGVyY1RyYWluRGF0YSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0ncGVyY1RyYWluRGF0YSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnBlcmNUcmFpbkRhdGEpO1xuXG5cdGZ1bmN0aW9uIGh1bWFuUmVhZGFibGVJbnQobjogbnVtYmVyKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gbi50b0ZpeGVkKDApO1xuXHR9XG5cblx0bGV0IG5vaXNlID0gZDMuc2VsZWN0KFwiI25vaXNlXCIpLm9uKFwiaW5wdXRcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLm5vaXNlID0gdGhpcy52YWx1ZTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3RydWUtbm9pc2VTTlInXSAudmFsdWVcIikudGV4dCh0aGlzLnZhbHVlKTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRub2lzZS5wcm9wZXJ0eShcInZhbHVlXCIsIHN0YXRlLm5vaXNlKTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSd0cnVlLW5vaXNlU05SJ10gLnZhbHVlXCIpLnRleHQoc3RhdGUubm9pc2UpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cblx0bGV0IGJhdGNoU2l6ZSA9IGQzLnNlbGVjdChcIiNiYXRjaFNpemVcIikub24oXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0c3RhdGUuYmF0Y2hTaXplID0gdGhpcy52YWx1ZTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHRoaXMudmFsdWUpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbWF4Q2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5tYXhDYXBhY2l0eSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHRcdHJlc2V0KCk7XG5cdH0pO1xuXHRiYXRjaFNpemUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5iYXRjaFNpemUpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLmJhdGNoU2l6ZSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbWF4Q2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5tYXhDYXBhY2l0eSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblxuXG5cdGxldCBhY3RpdmF0aW9uRHJvcGRvd24gPSBkMy5zZWxlY3QoXCIjYWN0aXZhdGlvbnNcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLmFjdGl2YXRpb24gPSBhY3RpdmF0aW9uc1t0aGlzLnZhbHVlXTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cdGFjdGl2YXRpb25Ecm9wZG93bi5wcm9wZXJ0eShcInZhbHVlXCIsIGdldEtleUZyb21WYWx1ZShhY3RpdmF0aW9ucywgc3RhdGUuYWN0aXZhdGlvbikpO1xuXG5cdGxldCBsZWFybmluZ1JhdGUgPSBkMy5zZWxlY3QoXCIjbGVhcm5pbmdSYXRlXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5sZWFybmluZ1JhdGUgPSB0aGlzLnZhbHVlO1xuXHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHR9KTtcblxuXHRsZWFybmluZ1JhdGUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5sZWFybmluZ1JhdGUpO1xuXG5cdGxldCByZWd1bGFyRHJvcGRvd24gPSBkMy5zZWxlY3QoXCIjcmVndWxhcml6YXRpb25zXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5yZWd1bGFyaXphdGlvbiA9IHJlZ3VsYXJpemF0aW9uc1t0aGlzLnZhbHVlXTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0cmVndWxhckRyb3Bkb3duLnByb3BlcnR5KFwidmFsdWVcIiwgZ2V0S2V5RnJvbVZhbHVlKHJlZ3VsYXJpemF0aW9ucywgc3RhdGUucmVndWxhcml6YXRpb24pKTtcblxuXHRsZXQgcmVndWxhclJhdGUgPSBkMy5zZWxlY3QoXCIjcmVndWxhclJhdGVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLnJlZ3VsYXJpemF0aW9uUmF0ZSA9ICt0aGlzLnZhbHVlO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblx0cmVndWxhclJhdGUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5yZWd1bGFyaXphdGlvblJhdGUpO1xuXG5cdGxldCBwcm9ibGVtID0gZDMuc2VsZWN0KFwiI3Byb2JsZW1cIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLnByb2JsZW0gPSBwcm9ibGVtc1t0aGlzLnZhbHVlXTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblx0XHRkcmF3RGF0YXNldFRodW1ibmFpbHMoKTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cdHByb2JsZW0ucHJvcGVydHkoXCJ2YWx1ZVwiLCBnZXRLZXlGcm9tVmFsdWUocHJvYmxlbXMsIHN0YXRlLnByb2JsZW0pKTtcblxuXHQvLyBBZGQgc2NhbGUgdG8gdGhlIGdyYWRpZW50IGNvbG9yIG1hcC5cblx0bGV0IHggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWy0xLCAxXSkucmFuZ2UoWzAsIDE0NF0pO1xuXHRsZXQgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG5cdFx0LnNjYWxlKHgpXG5cdFx0Lm9yaWVudChcImJvdHRvbVwiKVxuXHRcdC50aWNrVmFsdWVzKFstMSwgMCwgMV0pXG5cdFx0LnRpY2tGb3JtYXQoZDMuZm9ybWF0KFwiZFwiKSk7XG5cdGQzLnNlbGVjdChcIiNjb2xvcm1hcCBnLmNvcmVcIikuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ4IGF4aXNcIilcblx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDEwKVwiKVxuXHRcdC5jYWxsKHhBeGlzKTtcblxuXHQvLyBMaXN0ZW4gZm9yIGNzcy1yZXNwb25zaXZlIGNoYW5nZXMgYW5kIHJlZHJhdyB0aGUgc3ZnIG5ldHdvcmsuXG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xuXHRcdGxldCBuZXdXaWR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbi1wYXJ0XCIpXG5cdFx0XHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cdFx0aWYgKG5ld1dpZHRoICE9PSBtYWluV2lkdGgpIHtcblx0XHRcdG1haW5XaWR0aCA9IG5ld1dpZHRoO1xuXHRcdFx0ZHJhd05ldHdvcmsobmV0d29yayk7XG5cdFx0XHR1cGRhdGVVSSh0cnVlKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIEhpZGUgdGhlIHRleHQgYmVsb3cgdGhlIHZpc3VhbGl6YXRpb24gZGVwZW5kaW5nIG9uIHRoZSBVUkwuXG5cdGlmIChzdGF0ZS5oaWRlVGV4dCkge1xuXHRcdGQzLnNlbGVjdChcIiNhcnRpY2xlLXRleHRcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0XHRkMy5zZWxlY3QoXCJkaXYubW9yZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdGQzLnNlbGVjdChcImhlYWRlclwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJpYXNlc1VJKG5ldHdvcms6IG5uLk5vZGVbXVtdKSB7XG5cdG5uLmZvckVhY2hOb2RlKG5ldHdvcmssIHRydWUsIG5vZGUgPT4ge1xuXHRcdGQzLnNlbGVjdChgcmVjdCNiaWFzLSR7bm9kZS5pZH1gKS5zdHlsZShcImZpbGxcIiwgY29sb3JTY2FsZShub2RlLmJpYXMpKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVdlaWdodHNVSShuZXR3b3JrOiBubi5Ob2RlW11bXSwgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55Pikge1xuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Ly8gVXBkYXRlIGFsbCB0aGUgbm9kZXMgaW4gdGhpcyBsYXllci5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcblx0XHRcdFx0Y29udGFpbmVyLnNlbGVjdChgI2xpbmske2xpbmsuc291cmNlLmlkfS0ke2xpbmsuZGVzdC5pZH1gKVxuXHRcdFx0XHRcdC5zdHlsZShcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XCJzdHJva2UtZGFzaG9mZnNldFwiOiAtaXRlciAvIDMsXG5cdFx0XHRcdFx0XHRcdFwic3Ryb2tlLXdpZHRoXCI6IGxpbmtXaWR0aFNjYWxlKE1hdGguYWJzKGxpbmsud2VpZ2h0KSksXG5cdFx0XHRcdFx0XHRcdFwic3Ryb2tlXCI6IGNvbG9yU2NhbGUobGluay53ZWlnaHQpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5kYXR1bShsaW5rKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gZHJhd05vZGUoY3g6IG51bWJlciwgY3k6IG51bWJlciwgbm9kZUlkOiBzdHJpbmcsIGlzSW5wdXQ6IGJvb2xlYW4sIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sIG5vZGU/OiBubi5Ob2RlKSB7XG5cdGxldCB4ID0gY3ggLSBSRUNUX1NJWkUgLyAyO1xuXHRsZXQgeSA9IGN5IC0gUkVDVF9TSVpFIC8gMjtcblxuXHRsZXQgbm9kZUdyb3VwID0gY29udGFpbmVyLmFwcGVuZChcImdcIikuYXR0cihcblx0XHR7XG5cdFx0XHRcImNsYXNzXCI6IFwibm9kZVwiLFxuXHRcdFx0XCJpZFwiOiBgbm9kZSR7bm9kZUlkfWAsXG5cdFx0XHRcInRyYW5zZm9ybVwiOiBgdHJhbnNsYXRlKCR7eH0sJHt5fSlgXG5cdFx0fSk7XG5cblx0Ly8gRHJhdyB0aGUgbWFpbiByZWN0YW5nbGUuXG5cdG5vZGVHcm91cC5hcHBlbmQoXCJyZWN0XCIpLmF0dHIoXG5cdFx0e1xuXHRcdFx0eDogMCxcblx0XHRcdHk6IDAsXG5cdFx0XHR3aWR0aDogUkVDVF9TSVpFLFxuXHRcdFx0aGVpZ2h0OiBSRUNUX1NJWkUsXG5cdFx0fSk7XG5cblx0bGV0IGFjdGl2ZU9yTm90Q2xhc3MgPSBzdGF0ZVtub2RlSWRdID8gXCJhY3RpdmVcIiA6IFwiaW5hY3RpdmVcIjtcblx0aWYgKGlzSW5wdXQpIHtcblx0XHRsZXQgbGFiZWwgPSBJTlBVVFNbbm9kZUlkXS5sYWJlbCAhPSBudWxsID8gSU5QVVRTW25vZGVJZF0ubGFiZWwgOiBub2RlSWQ7XG5cdFx0Ly8gRHJhdyB0aGUgaW5wdXQgbGFiZWwuXG5cdFx0bGV0IHRleHQgPSBub2RlR3JvdXAuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFxuXHRcdFx0e1xuXHRcdFx0XHRjbGFzczogXCJtYWluLWxhYmVsXCIsXG5cdFx0XHRcdHg6IC0xMCxcblx0XHRcdFx0eTogUkVDVF9TSVpFIC8gMiwgXCJ0ZXh0LWFuY2hvclwiOiBcImVuZFwiXG5cdFx0XHR9KTtcblx0XHRpZiAoL1tfXl0vLnRlc3QobGFiZWwpKSB7XG5cdFx0XHRsZXQgbXlSZSA9IC8oLio/KShbX15dKSguKS9nO1xuXHRcdFx0bGV0IG15QXJyYXk7XG5cdFx0XHRsZXQgbGFzdEluZGV4O1xuXHRcdFx0d2hpbGUgKChteUFycmF5ID0gbXlSZS5leGVjKGxhYmVsKSkgIT0gbnVsbCkge1xuXHRcdFx0XHRsYXN0SW5kZXggPSBteVJlLmxhc3RJbmRleDtcblx0XHRcdFx0bGV0IHByZWZpeCA9IG15QXJyYXlbMV07XG5cdFx0XHRcdGxldCBzZXAgPSBteUFycmF5WzJdO1xuXHRcdFx0XHRsZXQgc3VmZml4ID0gbXlBcnJheVszXTtcblx0XHRcdFx0aWYgKHByZWZpeCkge1xuXHRcdFx0XHRcdHRleHQuYXBwZW5kKFwidHNwYW5cIikudGV4dChwcmVmaXgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRleHQuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcImJhc2VsaW5lLXNoaWZ0XCIsIHNlcCA9PT0gXCJfXCIgPyBcInN1YlwiIDogXCJzdXBlclwiKVxuXHRcdFx0XHRcdC5zdHlsZShcImZvbnQtc2l6ZVwiLCBcIjlweFwiKVxuXHRcdFx0XHRcdC50ZXh0KHN1ZmZpeCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAobGFiZWwuc3Vic3RyaW5nKGxhc3RJbmRleCkpIHtcblx0XHRcdFx0dGV4dC5hcHBlbmQoXCJ0c3BhblwiKS50ZXh0KGxhYmVsLnN1YnN0cmluZyhsYXN0SW5kZXgpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGV4dC5hcHBlbmQoXCJ0c3BhblwiKS50ZXh0KGxhYmVsKTtcblx0XHR9XG5cdFx0bm9kZUdyb3VwLmNsYXNzZWQoYWN0aXZlT3JOb3RDbGFzcywgdHJ1ZSk7XG5cdH1cblx0aWYgKCFpc0lucHV0KSB7XG5cdFx0Ly8gRHJhdyB0aGUgbm9kZSdzIGJpYXMuXG5cdFx0bm9kZUdyb3VwLmFwcGVuZChcInJlY3RcIikuYXR0cihcblx0XHRcdHtcblx0XHRcdFx0aWQ6IGBiaWFzLSR7bm9kZUlkfWAsXG5cdFx0XHRcdHg6IC1CSUFTX1NJWkUgLSAyLFxuXHRcdFx0XHR5OiBSRUNUX1NJWkUgLSBCSUFTX1NJWkUgKyAzLFxuXHRcdFx0XHR3aWR0aDogQklBU19TSVpFLFxuXHRcdFx0XHRoZWlnaHQ6IEJJQVNfU0laRSxcblx0XHRcdH0pXG5cdFx0XHQub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dXBkYXRlSG92ZXJDYXJkKEhvdmVyVHlwZS5CSUFTLCBub2RlLCBkMy5tb3VzZShjb250YWluZXIubm9kZSgpKSk7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHVwZGF0ZUhvdmVyQ2FyZChudWxsKTtcblx0XHRcdH0pO1xuXHR9XG5cblx0Ly8gRHJhdyB0aGUgbm9kZSdzIGNhbnZhcy5cblx0bGV0IGRpdiA9IGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLmluc2VydChcImRpdlwiLCBcIjpmaXJzdC1jaGlsZFwiKS5hdHRyKFxuXHRcdHtcblx0XHRcdFwiaWRcIjogYGNhbnZhcy0ke25vZGVJZH1gLFxuXHRcdFx0XCJjbGFzc1wiOiBcImNhbnZhc1wiXG5cdFx0fSlcblx0XHQuc3R5bGUoXG5cdFx0XHR7XG5cdFx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdGxlZnQ6IGAke3ggKyAzfXB4YCxcblx0XHRcdFx0dG9wOiBgJHt5ICsgM31weGBcblx0XHRcdH0pXG5cdFx0Lm9uKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzZWxlY3RlZE5vZGVJZCA9IG5vZGVJZDtcblx0XHRcdGRpdi5jbGFzc2VkKFwiaG92ZXJlZFwiLCB0cnVlKTtcblx0XHRcdG5vZGVHcm91cC5jbGFzc2VkKFwiaG92ZXJlZFwiLCB0cnVlKTtcblx0XHRcdHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmFsc2UpO1xuXHRcdFx0aGVhdE1hcC51cGRhdGVCYWNrZ3JvdW5kKGJvdW5kYXJ5W25vZGVJZF0sIHN0YXRlLmRpc2NyZXRpemUpO1xuXHRcdH0pXG5cdFx0Lm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzZWxlY3RlZE5vZGVJZCA9IG51bGw7XG5cdFx0XHRkaXYuY2xhc3NlZChcImhvdmVyZWRcIiwgZmFsc2UpO1xuXHRcdFx0bm9kZUdyb3VwLmNsYXNzZWQoXCJob3ZlcmVkXCIsIGZhbHNlKTtcblx0XHRcdHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmFsc2UpO1xuXHRcdFx0aGVhdE1hcC51cGRhdGVCYWNrZ3JvdW5kKGJvdW5kYXJ5W25uLmdldE91dHB1dE5vZGUobmV0d29yaykuaWRdLCBzdGF0ZS5kaXNjcmV0aXplKTtcblx0XHR9KTtcblx0aWYgKGlzSW5wdXQpIHtcblx0XHRkaXYub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzdGF0ZVtub2RlSWRdID0gIXN0YXRlW25vZGVJZF07XG5cdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRyZXNldCgpO1xuXHRcdH0pO1xuXHRcdGRpdi5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIik7XG5cdH1cblx0aWYgKGlzSW5wdXQpIHtcblx0XHRkaXYuY2xhc3NlZChhY3RpdmVPck5vdENsYXNzLCB0cnVlKTtcblx0fVxuXHRsZXQgbm9kZUhlYXRNYXAgPSBuZXcgSGVhdE1hcChSRUNUX1NJWkUsIERFTlNJVFkgLyAxMCwgeERvbWFpbiwgeERvbWFpbiwgZGl2LCB7bm9Tdmc6IHRydWV9KTtcblx0ZGl2LmRhdHVtKHtoZWF0bWFwOiBub2RlSGVhdE1hcCwgaWQ6IG5vZGVJZH0pO1xufVxuXG4vLyBEcmF3IG5ldHdvcmtcbmZ1bmN0aW9uIGRyYXdOZXR3b3JrKG5ldHdvcms6IG5uLk5vZGVbXVtdKTogdm9pZCB7XG5cdGxldCBzdmcgPSBkMy5zZWxlY3QoXCIjc3ZnXCIpO1xuXHQvLyBSZW1vdmUgYWxsIHN2ZyBlbGVtZW50cy5cblx0c3ZnLnNlbGVjdChcImcuY29yZVwiKS5yZW1vdmUoKTtcblx0Ly8gUmVtb3ZlIGFsbCBkaXYgZWxlbWVudHMuXG5cdGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLnNlbGVjdEFsbChcImRpdi5jYW52YXNcIikucmVtb3ZlKCk7XG5cdGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLnNlbGVjdEFsbChcImRpdi5wbHVzLW1pbnVzLW5ldXJvbnNcIikucmVtb3ZlKCk7XG5cblx0Ly8gR2V0IHRoZSB3aWR0aCBvZiB0aGUgc3ZnIGNvbnRhaW5lci5cblx0bGV0IHBhZGRpbmcgPSAzO1xuXHRsZXQgY28gPSBkMy5zZWxlY3QoXCIuY29sdW1uLm91dHB1dFwiKS5ub2RlKCkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cdGxldCBjZiA9IGQzLnNlbGVjdChcIi5jb2x1bW4uZmVhdHVyZXNcIikubm9kZSgpIGFzIEhUTUxEaXZFbGVtZW50O1xuXHRsZXQgd2lkdGggPSBjby5vZmZzZXRMZWZ0IC0gY2Yub2Zmc2V0TGVmdDtcblx0c3ZnLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XG5cblx0Ly8gTWFwIG9mIGFsbCBub2RlIGNvb3JkaW5hdGVzLlxuXHRsZXQgbm9kZTJjb29yZDogeyBbaWQ6IHN0cmluZ106IHsgY3g6IG51bWJlciwgY3k6IG51bWJlciB9IH0gPSB7fTtcblx0bGV0IGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0LmNsYXNzZWQoXCJjb3JlXCIsIHRydWUpXG5cdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3BhZGRpbmd9LCR7cGFkZGluZ30pYCk7XG5cdC8vIERyYXcgdGhlIG5ldHdvcmsgbGF5ZXIgYnkgbGF5ZXIuXG5cdGxldCBudW1MYXllcnMgPSBuZXR3b3JrLmxlbmd0aDtcblx0bGV0IGZlYXR1cmVXaWR0aCA9IDExODtcblx0bGV0IGxheWVyU2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsPG51bWJlciwgbnVtYmVyPigpXG5cdFx0LmRvbWFpbihkMy5yYW5nZSgxLCBudW1MYXllcnMgLSAxKSlcblx0XHQucmFuZ2VQb2ludHMoW2ZlYXR1cmVXaWR0aCwgd2lkdGggLSBSRUNUX1NJWkVdLCAwLjcpO1xuXHRsZXQgbm9kZUluZGV4U2NhbGUgPSAobm9kZUluZGV4OiBudW1iZXIpID0+IG5vZGVJbmRleCAqIChSRUNUX1NJWkUgKyAyNSk7XG5cblxuXHRsZXQgY2FsbG91dFRodW1iID0gZDMuc2VsZWN0KFwiLmNhbGxvdXQudGh1bWJuYWlsXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdGxldCBjYWxsb3V0V2VpZ2h0cyA9IGQzLnNlbGVjdChcIi5jYWxsb3V0LndlaWdodHNcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0bGV0IGlkV2l0aENhbGxvdXQgPSBudWxsO1xuXHRsZXQgdGFyZ2V0SWRXaXRoQ2FsbG91dCA9IG51bGw7XG5cblx0Ly8gRHJhdyB0aGUgaW5wdXQgbGF5ZXIgc2VwYXJhdGVseS5cblx0bGV0IGN4ID0gUkVDVF9TSVpFIC8gMiArIDUwO1xuXHRsZXQgbm9kZUlkcyA9IE9iamVjdC5rZXlzKElOUFVUUyk7XG5cdGxldCBtYXhZID0gbm9kZUluZGV4U2NhbGUobm9kZUlkcy5sZW5ndGgpO1xuXHRub2RlSWRzLmZvckVhY2goKG5vZGVJZCwgaSkgPT4ge1xuXHRcdGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKGkpICsgUkVDVF9TSVpFIC8gMjtcblx0XHRub2RlMmNvb3JkW25vZGVJZF0gPSB7Y3gsIGN5fTtcblx0XHRkcmF3Tm9kZShjeCwgY3ksIG5vZGVJZCwgdHJ1ZSwgY29udGFpbmVyKTtcblx0fSk7XG5cblx0Ly8gRHJhdyB0aGUgaW50ZXJtZWRpYXRlIGxheWVycy5cblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG51bUxheWVycyAtIDE7IGxheWVySWR4KyspIHtcblx0XHRsZXQgbnVtTm9kZXMgPSBuZXR3b3JrW2xheWVySWR4XS5sZW5ndGg7XG5cdFx0bGV0IGN4ID0gbGF5ZXJTY2FsZShsYXllcklkeCkgKyBSRUNUX1NJWkUgLyAyO1xuXHRcdG1heFkgPSBNYXRoLm1heChtYXhZLCBub2RlSW5kZXhTY2FsZShudW1Ob2RlcykpO1xuXHRcdGFkZFBsdXNNaW51c0NvbnRyb2wobGF5ZXJTY2FsZShsYXllcklkeCksIGxheWVySWR4KTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG51bU5vZGVzOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gbmV0d29ya1tsYXllcklkeF1baV07XG5cdFx0XHRsZXQgY3kgPSBub2RlSW5kZXhTY2FsZShpKSArIFJFQ1RfU0laRSAvIDI7XG5cdFx0XHRub2RlMmNvb3JkW25vZGUuaWRdID0ge2N4LCBjeX07XG5cdFx0XHRkcmF3Tm9kZShjeCwgY3ksIG5vZGUuaWQsIGZhbHNlLCBjb250YWluZXIsIG5vZGUpO1xuXG5cdFx0XHQvLyBTaG93IGNhbGxvdXQgdG8gdGh1bWJuYWlscy5cblx0XHRcdGxldCBudW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHhdLmxlbmd0aDtcblx0XHRcdGxldCBuZXh0TnVtTm9kZXMgPSBuZXR3b3JrW2xheWVySWR4ICsgMV0ubGVuZ3RoO1xuXHRcdFx0aWYgKGlkV2l0aENhbGxvdXQgPT0gbnVsbCAmJlxuXHRcdFx0XHRpID09PSBudW1Ob2RlcyAtIDEgJiZcblx0XHRcdFx0bmV4dE51bU5vZGVzIDw9IG51bU5vZGVzKSB7XG5cdFx0XHRcdGNhbGxvdXRUaHVtYi5zdHlsZShcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBudWxsLFxuXHRcdFx0XHRcdFx0dG9wOiBgJHsyMCArIDMgKyBjeX1weGAsXG5cdFx0XHRcdFx0XHRsZWZ0OiBgJHtjeH1weGBcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0aWRXaXRoQ2FsbG91dCA9IG5vZGUuaWQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIERyYXcgbGlua3MuXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcblx0XHRcdFx0bGV0IHBhdGg6IFNWR1BhdGhFbGVtZW50ID0gZHJhd0xpbmsobGluaywgbm9kZTJjb29yZCwgbmV0d29yayxcblx0XHRcdFx0XHRjb250YWluZXIsIGogPT09IDAsIGosIG5vZGUuaW5wdXRMaW5rcy5sZW5ndGgpLm5vZGUoKSBhcyBhbnk7XG5cdFx0XHRcdC8vIFNob3cgY2FsbG91dCB0byB3ZWlnaHRzLlxuXHRcdFx0XHRsZXQgcHJldkxheWVyID0gbmV0d29ya1tsYXllcklkeCAtIDFdO1xuXHRcdFx0XHRsZXQgbGFzdE5vZGVQcmV2TGF5ZXIgPSBwcmV2TGF5ZXJbcHJldkxheWVyLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRpZiAodGFyZ2V0SWRXaXRoQ2FsbG91dCA9PSBudWxsICYmXG5cdFx0XHRcdFx0aSA9PT0gbnVtTm9kZXMgLSAxICYmXG5cdFx0XHRcdFx0bGluay5zb3VyY2UuaWQgPT09IGxhc3ROb2RlUHJldkxheWVyLmlkICYmXG5cdFx0XHRcdFx0KGxpbmsuc291cmNlLmlkICE9PSBpZFdpdGhDYWxsb3V0IHx8IG51bUxheWVycyA8PSA1KSAmJlxuXHRcdFx0XHRcdGxpbmsuZGVzdC5pZCAhPT0gaWRXaXRoQ2FsbG91dCAmJlxuXHRcdFx0XHRcdHByZXZMYXllci5sZW5ndGggPj0gbnVtTm9kZXMpIHtcblx0XHRcdFx0XHRsZXQgbWlkUG9pbnQgPSBwYXRoLmdldFBvaW50QXRMZW5ndGgocGF0aC5nZXRUb3RhbExlbmd0aCgpICogMC43KTtcblx0XHRcdFx0XHRjYWxsb3V0V2VpZ2h0cy5zdHlsZShcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogbnVsbCxcblx0XHRcdFx0XHRcdFx0dG9wOiBgJHttaWRQb2ludC55ICsgNX1weGAsXG5cdFx0XHRcdFx0XHRcdGxlZnQ6IGAke21pZFBvaW50LnggKyAzfXB4YFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGFyZ2V0SWRXaXRoQ2FsbG91dCA9IGxpbmsuZGVzdC5pZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIERyYXcgdGhlIG91dHB1dCBub2RlIHNlcGFyYXRlbHkuXG5cdGN4ID0gd2lkdGggKyBSRUNUX1NJWkUgLyAyO1xuXHRsZXQgbm9kZSA9IG5ldHdvcmtbbnVtTGF5ZXJzIC0gMV1bMF07XG5cdGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKDApICsgUkVDVF9TSVpFIC8gMjtcblx0bm9kZTJjb29yZFtub2RlLmlkXSA9IHtjeCwgY3l9O1xuXHQvLyBEcmF3IGxpbmtzLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2ldO1xuXHRcdGRyYXdMaW5rKGxpbmssIG5vZGUyY29vcmQsIG5ldHdvcmssIGNvbnRhaW5lciwgaSA9PT0gMCwgaSxcblx0XHRcdG5vZGUuaW5wdXRMaW5rcy5sZW5ndGgpO1xuXHR9XG5cdC8vIEFkanVzdCB0aGUgaGVpZ2h0IG9mIHRoZSBzdmcuXG5cdHN2Zy5hdHRyKFwiaGVpZ2h0XCIsIG1heFkpO1xuXG5cdC8vIEFkanVzdCB0aGUgaGVpZ2h0IG9mIHRoZSBmZWF0dXJlcyBjb2x1bW4uXG5cdGxldCBoZWlnaHQgPSBNYXRoLm1heChcblx0XHRnZXRSZWxhdGl2ZUhlaWdodChjYWxsb3V0VGh1bWIpLFxuXHRcdGdldFJlbGF0aXZlSGVpZ2h0KGNhbGxvdXRXZWlnaHRzKSxcblx0XHRnZXRSZWxhdGl2ZUhlaWdodChkMy5zZWxlY3QoXCIjbmV0d29ya1wiKSlcblx0KTtcblx0ZDMuc2VsZWN0KFwiLmNvbHVtbi5mZWF0dXJlc1wiKS5zdHlsZShcImhlaWdodFwiLCBoZWlnaHQgKyBcInB4XCIpO1xufVxuXG5mdW5jdGlvbiBnZXRSZWxhdGl2ZUhlaWdodChzZWxlY3Rpb246IGQzLlNlbGVjdGlvbjxhbnk+KSB7XG5cdGxldCBub2RlID0gc2VsZWN0aW9uLm5vZGUoKSBhcyBIVE1MQW5jaG9yRWxlbWVudDtcblx0cmV0dXJuIG5vZGUub2Zmc2V0SGVpZ2h0ICsgbm9kZS5vZmZzZXRUb3A7XG59XG5cbmZ1bmN0aW9uIGFkZFBsdXNNaW51c0NvbnRyb2woeDogbnVtYmVyLCBsYXllcklkeDogbnVtYmVyKSB7XG5cdGxldCBkaXYgPSBkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5hcHBlbmQoXCJkaXZcIilcblx0XHQuY2xhc3NlZChcInBsdXMtbWludXMtbmV1cm9uc1wiLCB0cnVlKVxuXHRcdC5zdHlsZShcImxlZnRcIiwgYCR7eCAtIDEwfXB4YCk7XG5cblx0bGV0IGkgPSBsYXllcklkeCAtIDE7XG5cdGxldCBmaXJzdFJvdyA9IGRpdi5hcHBlbmQoXCJkaXZcIikuYXR0cihcImNsYXNzXCIsIGB1aS1udW1Ob2RlcyR7bGF5ZXJJZHh9YCk7XG5cdGZpcnN0Um93LmFwcGVuZChcImJ1dHRvblwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtZGwtYnV0dG9uIG1kbC1qcy1idXR0b24gbWRsLWJ1dHRvbi0taWNvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGxldCBudW1OZXVyb25zID0gc3RhdGUubmV0d29ya1NoYXBlW2ldO1xuXHRcdFx0aWYgKG51bU5ldXJvbnMgPj0gTUFYX05FVVJPTlMpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c3RhdGUubmV0d29ya1NoYXBlW2ldKys7XG5cdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRyZXNldCgpO1xuXHRcdH0pXG5cdFx0LmFwcGVuZChcImlcIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibWF0ZXJpYWwtaWNvbnNcIilcblx0XHQudGV4dChcImFkZFwiKTtcblxuXHRmaXJzdFJvdy5hcHBlbmQoXCJidXR0b25cIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibWRsLWJ1dHRvbiBtZGwtanMtYnV0dG9uIG1kbC1idXR0b24tLWljb25cIilcblx0XHQub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRsZXQgbnVtTmV1cm9ucyA9IHN0YXRlLm5ldHdvcmtTaGFwZVtpXTtcblx0XHRcdGlmIChudW1OZXVyb25zIDw9IDEpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c3RhdGUubmV0d29ya1NoYXBlW2ldLS07XG5cdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRyZXNldCgpO1xuXHRcdH0pXG5cdFx0LmFwcGVuZChcImlcIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibWF0ZXJpYWwtaWNvbnNcIilcblx0XHQudGV4dChcInJlbW92ZVwiKTtcblxuXHRsZXQgc3VmZml4ID0gc3RhdGUubmV0d29ya1NoYXBlW2ldID4gMSA/IFwic1wiIDogXCJcIjtcblx0ZGl2LmFwcGVuZChcImRpdlwiKS50ZXh0KHN0YXRlLm5ldHdvcmtTaGFwZVtpXSArIFwiIG5ldXJvblwiICsgc3VmZml4KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSG92ZXJDYXJkKHR5cGU6IEhvdmVyVHlwZSwgbm9kZU9yTGluaz86IG5uLk5vZGUgfCBubi5MaW5rLCBjb29yZGluYXRlcz86IFtudW1iZXIsIG51bWJlcl0pIHtcblx0bGV0IGhvdmVyY2FyZCA9IGQzLnNlbGVjdChcIiNob3ZlcmNhcmRcIik7XG5cdGlmICh0eXBlID09IG51bGwpIHtcblx0XHRob3ZlcmNhcmQuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0XHRkMy5zZWxlY3QoXCIjc3ZnXCIpLm9uKFwiY2xpY2tcIiwgbnVsbCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGQzLnNlbGVjdChcIiNzdmdcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aG92ZXJjYXJkLnNlbGVjdChcIi52YWx1ZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdGxldCBpbnB1dCA9IGhvdmVyY2FyZC5zZWxlY3QoXCJpbnB1dFwiKTtcblx0XHRpbnB1dC5zdHlsZShcImRpc3BsYXlcIiwgbnVsbCk7XG5cdFx0aW5wdXQub24oXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodGhpcy52YWx1ZSAhPSBudWxsICYmIHRoaXMudmFsdWUgIT09IFwiXCIpIHtcblx0XHRcdFx0aWYgKHR5cGUgPT09IEhvdmVyVHlwZS5XRUlHSFQpIHtcblx0XHRcdFx0XHQobm9kZU9yTGluayBhcyBubi5MaW5rKS53ZWlnaHQgPSArdGhpcy52YWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQobm9kZU9yTGluayBhcyBubi5Ob2RlKS5iaWFzID0gK3RoaXMudmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dXBkYXRlVUkoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRpbnB1dC5vbihcImtleXByZXNzXCIsICgpID0+IHtcblx0XHRcdGlmICgoZDMuZXZlbnQgYXMgYW55KS5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0XHR1cGRhdGVIb3ZlckNhcmQodHlwZSwgbm9kZU9yTGluaywgY29vcmRpbmF0ZXMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdChpbnB1dC5ub2RlKCkgYXMgSFRNTElucHV0RWxlbWVudCkuZm9jdXMoKTtcblx0fSk7XG5cdGxldCB2YWx1ZSA9ICh0eXBlID09PSBIb3ZlclR5cGUuV0VJR0hUKSA/XG5cdFx0KG5vZGVPckxpbmsgYXMgbm4uTGluaykud2VpZ2h0IDpcblx0XHQobm9kZU9yTGluayBhcyBubi5Ob2RlKS5iaWFzO1xuXHRsZXQgbmFtZSA9ICh0eXBlID09PSBIb3ZlclR5cGUuV0VJR0hUKSA/IFwiV2VpZ2h0XCIgOiBcIkJpYXNcIjtcblx0aG92ZXJjYXJkLnN0eWxlKFxuXHRcdHtcblx0XHRcdFwibGVmdFwiOiBgJHtjb29yZGluYXRlc1swXSArIDIwfXB4YCxcblx0XHRcdFwidG9wXCI6IGAke2Nvb3JkaW5hdGVzWzFdfXB4YCxcblx0XHRcdFwiZGlzcGxheVwiOiBcImJsb2NrXCJcblx0XHR9KTtcblx0aG92ZXJjYXJkLnNlbGVjdChcIi50eXBlXCIpLnRleHQobmFtZSk7XG5cdGhvdmVyY2FyZC5zZWxlY3QoXCIudmFsdWVcIilcblx0XHQuc3R5bGUoXCJkaXNwbGF5XCIsIG51bGwpXG5cdFx0LnRleHQodmFsdWUudG9QcmVjaXNpb24oMikpO1xuXHRob3ZlcmNhcmQuc2VsZWN0KFwiaW5wdXRcIilcblx0XHQucHJvcGVydHkoXCJ2YWx1ZVwiLCB2YWx1ZS50b1ByZWNpc2lvbigyKSlcblx0XHQuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbn1cblxuZnVuY3Rpb24gZHJhd0xpbmsoXG5cdGlucHV0OiBubi5MaW5rLCBub2RlMmNvb3JkOiB7IFtpZDogc3RyaW5nXTogeyBjeDogbnVtYmVyLCBjeTogbnVtYmVyIH0gfSxcblx0bmV0d29yazogbm4uTm9kZVtdW10sIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sXG5cdGlzRmlyc3Q6IGJvb2xlYW4sIGluZGV4OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKSB7XG5cdGxldCBsaW5lID0gY29udGFpbmVyLmluc2VydChcInBhdGhcIiwgXCI6Zmlyc3QtY2hpbGRcIik7XG5cdGxldCBzb3VyY2UgPSBub2RlMmNvb3JkW2lucHV0LnNvdXJjZS5pZF07XG5cdGxldCBkZXN0ID0gbm9kZTJjb29yZFtpbnB1dC5kZXN0LmlkXTtcblx0bGV0IGRhdHVtID0ge1xuXHRcdHNvdXJjZTpcblx0XHRcdHtcblx0XHRcdFx0eTogc291cmNlLmN4ICsgUkVDVF9TSVpFIC8gMiArIDIsXG5cdFx0XHRcdHg6IHNvdXJjZS5jeVxuXHRcdFx0fSxcblx0XHR0YXJnZXQ6XG5cdFx0XHR7XG5cdFx0XHRcdHk6IGRlc3QuY3ggLSBSRUNUX1NJWkUgLyAyLFxuXHRcdFx0XHR4OiBkZXN0LmN5ICsgKChpbmRleCAtIChsZW5ndGggLSAxKSAvIDIpIC8gbGVuZ3RoKSAqIDEyXG5cdFx0XHR9XG5cdH07XG5cdGxldCBkaWFnb25hbCA9IGQzLnN2Zy5kaWFnb25hbCgpLnByb2plY3Rpb24oZCA9PiBbZC55LCBkLnhdKTtcblx0bGluZS5hdHRyKFxuXHRcdHtcblx0XHRcdFwibWFya2VyLXN0YXJ0XCI6IFwidXJsKCNtYXJrZXJBcnJvdylcIixcblx0XHRcdGNsYXNzOiBcImxpbmtcIixcblx0XHRcdGlkOiBcImxpbmtcIiArIGlucHV0LnNvdXJjZS5pZCArIFwiLVwiICsgaW5wdXQuZGVzdC5pZCxcblx0XHRcdGQ6IGRpYWdvbmFsKGRhdHVtLCAwKVxuXHRcdH0pO1xuXG5cdC8vIEFkZCBhbiBpbnZpc2libGUgdGhpY2sgbGluayB0aGF0IHdpbGwgYmUgdXNlZCBmb3Jcblx0Ly8gc2hvd2luZyB0aGUgd2VpZ2h0IHZhbHVlIG9uIGhvdmVyLlxuXHRjb250YWluZXIuYXBwZW5kKFwicGF0aFwiKVxuXHRcdC5hdHRyKFwiZFwiLCBkaWFnb25hbChkYXR1bSwgMCkpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxpbmstaG92ZXJcIilcblx0XHQub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHVwZGF0ZUhvdmVyQ2FyZChIb3ZlclR5cGUuV0VJR0hULCBpbnB1dCwgZDMubW91c2UodGhpcykpO1xuXHRcdH0pLm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0dXBkYXRlSG92ZXJDYXJkKG51bGwpO1xuXHR9KTtcblx0cmV0dXJuIGxpbmU7XG59XG5cbi8qKlxuICogR2l2ZW4gYSBuZXVyYWwgbmV0d29yaywgaXQgYXNrcyB0aGUgbmV0d29yayBmb3IgdGhlIG91dHB1dCAocHJlZGljdGlvbilcbiAqIG9mIGV2ZXJ5IG5vZGUgaW4gdGhlIG5ldHdvcmsgdXNpbmcgaW5wdXRzIHNhbXBsZWQgb24gYSBzcXVhcmUgZ3JpZC5cbiAqIEl0IHJldHVybnMgYSBtYXAgd2hlcmUgZWFjaCBrZXkgaXMgdGhlIG5vZGUgSUQgYW5kIHRoZSB2YWx1ZSBpcyBhIHNxdWFyZVxuICogbWF0cml4IG9mIHRoZSBvdXRwdXRzIG9mIHRoZSBuZXR3b3JrIGZvciBlYWNoIGlucHV0IGluIHRoZSBncmlkIHJlc3BlY3RpdmVseS5cbiAqL1xuXG5mdW5jdGlvbiB1cGRhdGVEZWNpc2lvbkJvdW5kYXJ5KG5ldHdvcms6IG5uLk5vZGVbXVtdLCBmaXJzdFRpbWU6IGJvb2xlYW4pIHtcblx0aWYgKGZpcnN0VGltZSkge1xuXHRcdGJvdW5kYXJ5ID0ge307XG5cdFx0bm4uZm9yRWFjaE5vZGUobmV0d29yaywgdHJ1ZSwgbm9kZSA9PiB7XG5cdFx0XHRib3VuZGFyeVtub2RlLmlkXSA9IG5ldyBBcnJheShERU5TSVRZKTtcblx0XHR9KTtcblx0XHQvLyBHbyB0aHJvdWdoIGFsbCBwcmVkZWZpbmVkIGlucHV0cy5cblx0XHRmb3IgKGxldCBub2RlSWQgaW4gSU5QVVRTKSB7XG5cdFx0XHRib3VuZGFyeVtub2RlSWRdID0gbmV3IEFycmF5KERFTlNJVFkpO1xuXHRcdH1cblx0fVxuXHRsZXQgeFNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCBERU5TSVRZIC0gMV0pLnJhbmdlKHhEb21haW4pO1xuXHRsZXQgeVNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFtERU5TSVRZIC0gMSwgMF0pLnJhbmdlKHhEb21haW4pO1xuXG5cdGxldCBpID0gMCwgaiA9IDA7XG5cdGZvciAoaSA9IDA7IGkgPCBERU5TSVRZOyBpKyspIHtcblx0XHRpZiAoZmlyc3RUaW1lKSB7XG5cdFx0XHRubi5mb3JFYWNoTm9kZShuZXR3b3JrLCB0cnVlLCBub2RlID0+IHtcblx0XHRcdFx0Ym91bmRhcnlbbm9kZS5pZF1baV0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XG5cdFx0XHR9KTtcblx0XHRcdC8vIEdvIHRocm91Z2ggYWxsIHByZWRlZmluZWQgaW5wdXRzLlxuXHRcdFx0Zm9yIChsZXQgbm9kZUlkIGluIElOUFVUUykge1xuXHRcdFx0XHRib3VuZGFyeVtub2RlSWRdW2ldID0gbmV3IEFycmF5KERFTlNJVFkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKGogPSAwOyBqIDwgREVOU0lUWTsgaisrKSB7XG5cdFx0XHQvLyAxIGZvciBwb2ludHMgaW5zaWRlIHRoZSBjaXJjbGUsIGFuZCAwIGZvciBwb2ludHMgb3V0c2lkZSB0aGUgY2lyY2xlLlxuXHRcdFx0bGV0IHggPSB4U2NhbGUoaSk7XG5cdFx0XHRsZXQgeSA9IHlTY2FsZShqKTtcblx0XHRcdGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KHgsIHkpO1xuXHRcdFx0bm4uZm9yd2FyZFByb3AobmV0d29yaywgaW5wdXQpO1xuXHRcdFx0bm4uZm9yRWFjaE5vZGUobmV0d29yaywgdHJ1ZSwgbm9kZSA9PiB7XG5cdFx0XHRcdGJvdW5kYXJ5W25vZGUuaWRdW2ldW2pdID0gbm9kZS5vdXRwdXQ7XG5cdFx0XHR9KTtcblx0XHRcdGlmIChmaXJzdFRpbWUpIHtcblx0XHRcdFx0Ly8gR28gdGhyb3VnaCBhbGwgcHJlZGVmaW5lZCBpbnB1dHMuXG5cdFx0XHRcdGZvciAobGV0IG5vZGVJZCBpbiBJTlBVVFMpIHtcblx0XHRcdFx0XHRib3VuZGFyeVtub2RlSWRdW2ldW2pdID0gSU5QVVRTW25vZGVJZF0uZih4LCB5KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBnZXRMZWFybmluZ1JhdGUobmV0d29yazogbm4uTm9kZVtdW10pOiBudW1iZXIge1xuXHRsZXQgdHJ1ZUxlYXJuaW5nUmF0ZSA9IDA7XG5cblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdC8vIFVwZGF0ZSBhbGwgdGhlIG5vZGVzIGluIHRoaXMgbGF5ZXIuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0dHJ1ZUxlYXJuaW5nUmF0ZSArPSBub2RlLnRydWVMZWFybmluZ1JhdGU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0cnVlTGVhcm5pbmdSYXRlO1xufVxuXG5mdW5jdGlvbiBnZXRUb3RhbENhcGFjaXR5KG5ldHdvcms6IG5uLk5vZGVbXVtdKTogbnVtYmVyIHtcblx0bGV0IHRvdGFsQ2FwYWNpdHkgPSAwO1xuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0dG90YWxDYXBhY2l0eSArPSBjdXJyZW50TGF5ZXIubGVuZ3RoO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdHRvdGFsQ2FwYWNpdHkgKz0gbm9kZS5pbnB1dExpbmtzLmxlbmd0aDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRvdGFsQ2FwYWNpdHk7XG59XG5cbmZ1bmN0aW9uIGdldExvc3MobmV0d29yazogbm4uTm9kZVtdW10sIGRhdGFQb2ludHM6IEV4YW1wbGUyRFtdKTogbnVtYmVyIHtcblx0bGV0IGxvc3MgPSAwO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFQb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgZGF0YVBvaW50ID0gZGF0YVBvaW50c1tpXTtcblx0XHRsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dChkYXRhUG9pbnQueCwgZGF0YVBvaW50LnkpO1xuXHRcdGxldCBvdXRwdXQgPSBubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XG5cdFx0bG9zcyArPSBubi5FcnJvcnMuU1FVQVJFLmVycm9yKG91dHB1dCwgZGF0YVBvaW50LmxhYmVsKTtcblx0fVxuXHRyZXR1cm4gbG9zcyAvIGRhdGFQb2ludHMubGVuZ3RoICogMTAwO1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXJPZkNvcnJlY3RDbGFzc2lmaWNhdGlvbnMobmV0d29yazogbm4uTm9kZVtdW10sIGRhdGFQb2ludHM6IEV4YW1wbGUyRFtdKTogbnVtYmVyIHtcblx0bGV0IGNvcnJlY3RseUNsYXNzaWZpZWQgPSAwO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFQb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgZGF0YVBvaW50ID0gZGF0YVBvaW50c1tpXTtcblx0XHRsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dChkYXRhUG9pbnQueCwgZGF0YVBvaW50LnkpO1xuXHRcdGxldCBvdXRwdXQgPSBubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XG5cdFx0bGV0IHByZWRpY3Rpb24gPSAob3V0cHV0ID4gMCkgPyAxIDogLTE7XG5cdFx0bGV0IGNvcnJlY3QgPSAocHJlZGljdGlvbiA9PT0gZGF0YVBvaW50LmxhYmVsKSA/IDEgOiAwO1xuXHRcdGNvcnJlY3RseUNsYXNzaWZpZWQgKz0gY29ycmVjdFxuXHR9XG5cdHJldHVybiBjb3JyZWN0bHlDbGFzc2lmaWVkO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVVSShmaXJzdFN0ZXAgPSBmYWxzZSkge1xuXHQvLyBVcGRhdGUgdGhlIGxpbmtzIHZpc3VhbGx5LlxuXHR1cGRhdGVXZWlnaHRzVUkobmV0d29yaywgZDMuc2VsZWN0KFwiZy5jb3JlXCIpKTtcblx0Ly8gVXBkYXRlIHRoZSBiaWFzIHZhbHVlcyB2aXN1YWxseS5cblx0dXBkYXRlQmlhc2VzVUkobmV0d29yayk7XG5cdC8vIEdldCB0aGUgZGVjaXNpb24gYm91bmRhcnkgb2YgdGhlIG5ldHdvcmsuXG5cdHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmlyc3RTdGVwKTtcblx0bGV0IHNlbGVjdGVkSWQgPSBzZWxlY3RlZE5vZGVJZCAhPSBudWxsID9cblx0XHRzZWxlY3RlZE5vZGVJZCA6IG5uLmdldE91dHB1dE5vZGUobmV0d29yaykuaWQ7XG5cdGhlYXRNYXAudXBkYXRlQmFja2dyb3VuZChib3VuZGFyeVtzZWxlY3RlZElkXSwgc3RhdGUuZGlzY3JldGl6ZSk7XG5cblx0Ly8gVXBkYXRlIGFsbCBkZWNpc2lvbiBib3VuZGFyaWVzLlxuXHRkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5zZWxlY3RBbGwoXCJkaXYuY2FudmFzXCIpXG5cdFx0LmVhY2goZnVuY3Rpb24gKGRhdGE6IHsgaGVhdG1hcDogSGVhdE1hcCwgaWQ6IHN0cmluZyB9KSB7XG5cdFx0XHRkYXRhLmhlYXRtYXAudXBkYXRlQmFja2dyb3VuZChyZWR1Y2VNYXRyaXgoYm91bmRhcnlbZGF0YS5pZF0sIDEwKSwgc3RhdGUuZGlzY3JldGl6ZSk7XG5cdFx0fSk7XG5cblx0ZnVuY3Rpb24gemVyb1BhZChuOiBudW1iZXIpOiBzdHJpbmcge1xuXHRcdGxldCBwYWQgPSBcIjAwMDAwMFwiO1xuXHRcdHJldHVybiAocGFkICsgbikuc2xpY2UoLXBhZC5sZW5ndGgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWRkQ29tbWFzKHM6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHMucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgXCIsXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaHVtYW5SZWFkYWJsZShuOiBudW1iZXIpOiBzdHJpbmcge1xuXHRcdHJldHVybiBuLnRvRml4ZWQoNCk7XG5cdH1cblxuXHRmdW5jdGlvbiBodW1hblJlYWRhYmxlSW50KG46IG51bWJlcik6IHN0cmluZyB7XG5cdFx0cmV0dXJuIG4udG9GaXhlZCgwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNpZ25hbE9mKG46IG51bWJlcik6IG51bWJlciB7XG5cdFx0cmV0dXJuIE1hdGgubG9nKDEgKyBNYXRoLmFicyhuKSk7XG5cdH1cblxuXHQvLyBVcGRhdGUgdHJ1ZSBsZWFybmluZyByYXRlIGxvc3MgYW5kIGl0ZXJhdGlvbiBudW1iZXIuXG5cdC8vIFRoZXNlIGFyZSBhbGwgYml0IHJhdGVzLCBoZW5jZSB0aGV5IGFyZSBjaGFubmVsIHNpZ25hbHNcblx0bGV0IGxvZzIgPSAxLjAgLyBNYXRoLmxvZygyLjApO1xuXHRsZXQgYml0TG9zc1Rlc3QgPSBsb3NzVGVzdDtcblx0bGV0IGJpdExvc3NUcmFpbiA9IGxvc3NUcmFpbjtcblx0bGV0IGJpdFRydWVMZWFybmluZ1JhdGUgPSBzaWduYWxPZih0cnVlTGVhcm5pbmdSYXRlKSAqIGxvZzI7XG5cdGxldCBiaXRHZW5lcmFsaXphdGlvbiA9IGdlbmVyYWxpemF0aW9uO1xuXG5cblx0ZDMuc2VsZWN0KFwiI2xvc3MtdHJhaW5cIikudGV4dChodW1hblJlYWRhYmxlKGJpdExvc3NUcmFpbikpO1xuXHRkMy5zZWxlY3QoXCIjbG9zcy10ZXN0XCIpLnRleHQoaHVtYW5SZWFkYWJsZShiaXRMb3NzVGVzdCkpO1xuXHRkMy5zZWxlY3QoXCIjZ2VuZXJhbGl6YXRpb25cIikudGV4dChodW1hblJlYWRhYmxlKGJpdEdlbmVyYWxpemF0aW9uKSk7XG5cdGQzLnNlbGVjdChcIiNpdGVyLW51bWJlclwiKS50ZXh0KGFkZENvbW1hcyh6ZXJvUGFkKGl0ZXIpKSk7XG5cdGQzLnNlbGVjdChcIiN0b3RhbC1jYXBhY2l0eVwiKS50ZXh0KGh1bWFuUmVhZGFibGVJbnQodG90YWxDYXBhY2l0eSkpO1xuXHRsaW5lQ2hhcnQuYWRkRGF0YVBvaW50KFtsb3NzVHJhaW4sIGxvc3NUZXN0XSk7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdElucHV0SWRzKCk6IHN0cmluZ1tdIHtcblx0bGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblx0Zm9yIChsZXQgaW5wdXROYW1lIGluIElOUFVUUykge1xuXHRcdGlmIChzdGF0ZVtpbnB1dE5hbWVdKSB7XG5cdFx0XHRyZXN1bHQucHVzaChpbnB1dE5hbWUpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RJbnB1dCh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlcltdIHtcblx0bGV0IGlucHV0OiBudW1iZXJbXSA9IFtdO1xuXHRmb3IgKGxldCBpbnB1dE5hbWUgaW4gSU5QVVRTKSB7XG5cdFx0aWYgKHN0YXRlW2lucHV0TmFtZV0pIHtcblx0XHRcdGlucHV0LnB1c2goSU5QVVRTW2lucHV0TmFtZV0uZih4LCB5KSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gb25lU3RlcCgpOiB2b2lkIHtcblx0aXRlcisrO1xuXHR0cmFpbkRhdGEuZm9yRWFjaCgocG9pbnQsIGkpID0+IHtcblx0XHRsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dChwb2ludC54LCBwb2ludC55KTtcblx0XHRubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XG5cdFx0bm4uYmFja1Byb3AobmV0d29yaywgcG9pbnQubGFiZWwsIG5uLkVycm9ycy5TUVVBUkUpO1xuXHRcdGlmICgoaSArIDEpICUgc3RhdGUuYmF0Y2hTaXplID09PSAwKSB7XG5cdFx0XHRubi51cGRhdGVXZWlnaHRzKG5ldHdvcmssIHN0YXRlLmxlYXJuaW5nUmF0ZSwgc3RhdGUucmVndWxhcml6YXRpb25SYXRlKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIENvbXB1dGUgdGhlIGxvc3MuXG5cdHRydWVMZWFybmluZ1JhdGUgPSBnZXRMZWFybmluZ1JhdGUobmV0d29yayk7XG5cdHRvdGFsQ2FwYWNpdHkgPSBnZXRUb3RhbENhcGFjaXR5KG5ldHdvcmspO1xuXG5cdGxvc3NUcmFpbiA9IGdldExvc3MobmV0d29yaywgdHJhaW5EYXRhKTtcblx0bG9zc1Rlc3QgPSBnZXRMb3NzKG5ldHdvcmssIHRlc3REYXRhKTtcblxuXHRsZXQgbnVtYmVyT2ZDb3JyZWN0VHJhaW5DbGFzc2lmaWNhdGlvbnM6IG51bWJlciA9IGdldE51bWJlck9mQ29ycmVjdENsYXNzaWZpY2F0aW9ucyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuXHRsZXQgbnVtYmVyT2ZDb3JyZWN0VGVzdENsYXNzaWZpY2F0aW9uczogbnVtYmVyID0gZ2V0TnVtYmVyT2ZDb3JyZWN0Q2xhc3NpZmljYXRpb25zKG5ldHdvcmssIHRlc3REYXRhKTtcblx0Z2VuZXJhbGl6YXRpb24gPSAobnVtYmVyT2ZDb3JyZWN0VHJhaW5DbGFzc2lmaWNhdGlvbnMrIG51bWJlck9mQ29ycmVjdFRlc3RDbGFzc2lmaWNhdGlvbnMpL3RvdGFsQ2FwYWNpdHk7XG5cblxuXHR1cGRhdGVVSSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3V0cHV0V2VpZ2h0cyhuZXR3b3JrOiBubi5Ob2RlW11bXSk6IG51bWJlcltdIHtcblx0bGV0IHdlaWdodHM6IG51bWJlcltdID0gW107XG5cdGZvciAobGV0IGxheWVySWR4ID0gMDsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aCAtIDE7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBub2RlLm91dHB1dHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0bGV0IG91dHB1dCA9IG5vZGUub3V0cHV0c1tqXTtcblx0XHRcdFx0d2VpZ2h0cy5wdXNoKG91dHB1dC53ZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gd2VpZ2h0cztcbn1cblxuZnVuY3Rpb24gcmVzZXQob25TdGFydHVwID0gZmFsc2UpIHtcblx0bGluZUNoYXJ0LnJlc2V0KCk7XG5cdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRpZiAoIW9uU3RhcnR1cCkge1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdH1cblx0cGxheWVyLnBhdXNlKCk7XG5cblx0bGV0IHN1ZmZpeCA9IHN0YXRlLm51bUhpZGRlbkxheWVycyAhPT0gMSA/IFwic1wiIDogXCJcIjtcblx0ZDMuc2VsZWN0KFwiI2xheWVycy1sYWJlbFwiKS50ZXh0KFwiSGlkZGVuIGxheWVyXCIgKyBzdWZmaXgpO1xuXHRkMy5zZWxlY3QoXCIjbnVtLWxheWVyc1wiKS50ZXh0KHN0YXRlLm51bUhpZGRlbkxheWVycyk7XG5cblxuXHQvLyBNYWtlIGEgc2ltcGxlIG5ldHdvcmsuXG5cdGl0ZXIgPSAwO1xuXHRsZXQgbnVtSW5wdXRzID0gY29uc3RydWN0SW5wdXQoMCwgMCkubGVuZ3RoO1xuXHRsZXQgc2hhcGUgPSBbbnVtSW5wdXRzXS5jb25jYXQoc3RhdGUubmV0d29ya1NoYXBlKS5jb25jYXQoWzFdKTtcblx0bGV0IG91dHB1dEFjdGl2YXRpb24gPSAoc3RhdGUucHJvYmxlbSA9PT0gUHJvYmxlbS5SRUdSRVNTSU9OKSA/XG5cdFx0bm4uQWN0aXZhdGlvbnMuTElORUFSIDogbm4uQWN0aXZhdGlvbnMuVEFOSDtcblx0bmV0d29yayA9IG5uLmJ1aWxkTmV0d29yayhzaGFwZSwgc3RhdGUuYWN0aXZhdGlvbiwgb3V0cHV0QWN0aXZhdGlvbixcblx0XHRzdGF0ZS5yZWd1bGFyaXphdGlvbiwgY29uc3RydWN0SW5wdXRJZHMoKSwgc3RhdGUuaW5pdFplcm8pO1xuXHR0cnVlTGVhcm5pbmdSYXRlID0gZ2V0TGVhcm5pbmdSYXRlKG5ldHdvcmspO1xuXHR0b3RhbENhcGFjaXR5ID0gZ2V0VG90YWxDYXBhY2l0eShuZXR3b3JrKTtcblx0bG9zc1Rlc3QgPSBnZXRMb3NzKG5ldHdvcmssIHRlc3REYXRhKTtcblx0bG9zc1RyYWluID0gZ2V0TG9zcyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuXG5cdGxldCBudW1iZXJPZkNvcnJlY3RUcmFpbkNsYXNzaWZpY2F0aW9uczogbnVtYmVyID0gZ2V0TnVtYmVyT2ZDb3JyZWN0Q2xhc3NpZmljYXRpb25zKG5ldHdvcmssIHRyYWluRGF0YSk7XG5cdGxldCBudW1iZXJPZkNvcnJlY3RUZXN0Q2xhc3NpZmljYXRpb25zOiBudW1iZXIgPSBnZXROdW1iZXJPZkNvcnJlY3RDbGFzc2lmaWNhdGlvbnMobmV0d29yaywgdGVzdERhdGEpO1xuXHRnZW5lcmFsaXphdGlvbiA9IChudW1iZXJPZkNvcnJlY3RUcmFpbkNsYXNzaWZpY2F0aW9ucyArIG51bWJlck9mQ29ycmVjdFRlc3RDbGFzc2lmaWNhdGlvbnMpL3RvdGFsQ2FwYWNpdHk7XG5cblx0ZHJhd05ldHdvcmsobmV0d29yayk7XG5cdHVwZGF0ZVVJKHRydWUpO1xufVxuXG5mdW5jdGlvbiBpbml0VHV0b3JpYWwoKSB7XG5cdGlmIChzdGF0ZS50dXRvcmlhbCA9PSBudWxsIHx8IHN0YXRlLnR1dG9yaWFsID09PSBcIlwiIHx8IHN0YXRlLmhpZGVUZXh0KSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdC8vIFJlbW92ZSBhbGwgb3RoZXIgdGV4dC5cblx0ZDMuc2VsZWN0QWxsKFwiYXJ0aWNsZSBkaXYubC0tYm9keVwiKS5yZW1vdmUoKTtcblx0bGV0IHR1dG9yaWFsID0gZDMuc2VsZWN0KFwiYXJ0aWNsZVwiKS5hcHBlbmQoXCJkaXZcIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibC0tYm9keVwiKTtcblx0Ly8gSW5zZXJ0IHR1dG9yaWFsIHRleHQuXG5cdGQzLmh0bWwoYHR1dG9yaWFscy8ke3N0YXRlLnR1dG9yaWFsfS5odG1sYCwgKGVyciwgaHRtbEZyYWdtZW50KSA9PiB7XG5cdFx0aWYgKGVycikge1xuXHRcdFx0dGhyb3cgZXJyO1xuXHRcdH1cblx0XHR0dXRvcmlhbC5ub2RlKCkuYXBwZW5kQ2hpbGQoaHRtbEZyYWdtZW50KTtcblx0XHQvLyBJZiB0aGUgdHV0b3JpYWwgaGFzIGEgPHRpdGxlPiB0YWcsIHNldCB0aGUgcGFnZSB0aXRsZSB0byB0aGF0LlxuXHRcdGxldCB0aXRsZSA9IHR1dG9yaWFsLnNlbGVjdChcInRpdGxlXCIpO1xuXHRcdGlmICh0aXRsZS5zaXplKCkpIHtcblx0XHRcdGQzLnNlbGVjdChcImhlYWRlciBoMVwiKS5zdHlsZShcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwibWFyZ2luLXRvcFwiOiBcIjIwcHhcIixcblx0XHRcdFx0XHRcIm1hcmdpbi1ib3R0b21cIjogXCIyMHB4XCIsXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50ZXh0KHRpdGxlLnRleHQoKSk7XG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlLnRleHQoKTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBkcmF3RGF0YXNldFRodW1ibmFpbHMoKSB7XG5cdGZ1bmN0aW9uIHJlbmRlclRodW1ibmFpbChjYW52YXMsIGRhdGFHZW5lcmF0b3IpIHtcblx0XHRsZXQgdyA9IDEwMDtcblx0XHRsZXQgaCA9IDEwMDtcblx0XHRjYW52YXMuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgdyk7XG5cdFx0Y2FudmFzLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBoKTtcblx0XHRsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cdFx0bGV0IGRhdGEgPSBkYXRhR2VuZXJhdG9yKDIwMCwgNTApOyAvLyBOUE9JTlRTLCBOT0lTRVxuXG5cdFx0ZGF0YS5mb3JFYWNoKFxuXHRcdFx0ZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBjb2xvclNjYWxlKGQubGFiZWwpO1xuXHRcdFx0XHQvLyB+IGNvbnRleHQuZmlsbFJlY3QodyAqIChkLnggKyA2KSAvIDEyLCBoICogKC1kLnkgKyA2KSAvIDEyLCA0LCA0KTtcblx0XHRcdFx0Y29udGV4dC5maWxsUmVjdCh3ICogKGQueCArIDYpIC8gMTIsIGggKiAoLWQueSArIDYpIC8gMTIsIDQsIDQpO1xuXHRcdFx0fSk7XG5cdFx0ZDMuc2VsZWN0KGNhbnZhcy5wYXJlbnROb2RlKS5zdHlsZShcImRpc3BsYXlcIiwgbnVsbCk7XG5cdH1cblxuXHRkMy5zZWxlY3RBbGwoXCIuZGF0YXNldFwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXG5cdGlmIChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OKSB7XG5cdFx0Zm9yIChsZXQgZGF0YXNldCBpbiBkYXRhc2V0cykge1xuXHRcdFx0bGV0IGNhbnZhczogYW55ID1cblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2FudmFzW2RhdGEtZGF0YXNldD0ke2RhdGFzZXR9XWApO1xuXHRcdFx0bGV0IGRhdGFHZW5lcmF0b3IgPSBkYXRhc2V0c1tkYXRhc2V0XTtcblxuXHRcdFx0cmVuZGVyVGh1bWJuYWlsKGNhbnZhcywgZGF0YUdlbmVyYXRvcik7XG5cblxuXHRcdH1cblx0fVxuXHRpZiAoc3RhdGUucHJvYmxlbSA9PT0gUHJvYmxlbS5SRUdSRVNTSU9OKSB7XG5cdFx0Zm9yIChsZXQgcmVnRGF0YXNldCBpbiByZWdEYXRhc2V0cykge1xuXHRcdFx0bGV0IGNhbnZhczogYW55ID1cblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2FudmFzW2RhdGEtcmVnRGF0YXNldD0ke3JlZ0RhdGFzZXR9XWApO1xuXHRcdFx0bGV0IGRhdGFHZW5lcmF0b3IgPSByZWdEYXRhc2V0c1tyZWdEYXRhc2V0XTtcblx0XHRcdHJlbmRlclRodW1ibmFpbChjYW52YXMsIGRhdGFHZW5lcmF0b3IpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBoaWRlQ29udHJvbHMoKSB7XG5cdC8vIFNldCBkaXNwbGF5Om5vbmUgdG8gYWxsIHRoZSBVSSBlbGVtZW50cyB0aGF0IGFyZSBoaWRkZW4uXG5cdGxldCBoaWRkZW5Qcm9wcyA9IHN0YXRlLmdldEhpZGRlblByb3BzKCk7XG5cdGhpZGRlblByb3BzLmZvckVhY2gocHJvcCA9PiB7XG5cdFx0bGV0IGNvbnRyb2xzID0gZDMuc2VsZWN0QWxsKGAudWktJHtwcm9wfWApO1xuXHRcdGlmIChjb250cm9scy5zaXplKCkgPT09IDApIHtcblx0XHRcdGNvbnNvbGUud2FybihgMCBodG1sIGVsZW1lbnRzIGZvdW5kIHdpdGggY2xhc3MgLnVpLSR7cHJvcH1gKTtcblx0XHR9XG5cdFx0Y29udHJvbHMuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0fSk7XG5cblx0Ly8gQWxzbyBhZGQgY2hlY2tib3ggZm9yIGVhY2ggaGlkYWJsZSBjb250cm9sIGluIHRoZSBcInVzZSBpdCBpbiBjbGFzc3JvbVwiXG5cdC8vIHNlY3Rpb24uXG5cdGxldCBoaWRlQ29udHJvbHMgPSBkMy5zZWxlY3QoXCIuaGlkZS1jb250cm9sc1wiKTtcblx0SElEQUJMRV9DT05UUk9MUy5mb3JFYWNoKChbdGV4dCwgaWRdKSA9PiB7XG5cdFx0bGV0IGxhYmVsID0gaGlkZUNvbnRyb2xzLmFwcGVuZChcImxhYmVsXCIpXG5cdFx0XHQuYXR0cihcImNsYXNzXCIsIFwibWRsLWNoZWNrYm94IG1kbC1qcy1jaGVja2JveCBtZGwtanMtcmlwcGxlLWVmZmVjdFwiKTtcblx0XHRsZXQgaW5wdXQgPSBsYWJlbC5hcHBlbmQoXCJpbnB1dFwiKVxuXHRcdFx0LmF0dHIoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0eXBlOiBcImNoZWNrYm94XCIsXG5cdFx0XHRcdFx0Y2xhc3M6IFwibWRsLWNoZWNrYm94X19pbnB1dFwiLFxuXHRcdFx0XHR9KTtcblx0XHRpZiAoaGlkZGVuUHJvcHMuaW5kZXhPZihpZCkgPT09IC0xKSB7XG5cdFx0XHRpbnB1dC5hdHRyKFwiY2hlY2tlZFwiLCBcInRydWVcIik7XG5cdFx0fVxuXHRcdGlucHV0Lm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHN0YXRlLnNldEhpZGVQcm9wZXJ0eShpZCwgIXRoaXMuY2hlY2tlZCk7XG5cdFx0XHRzdGF0ZS5zZXJpYWxpemUoKTtcblx0XHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0XHRkMy5zZWxlY3QoXCIuaGlkZS1jb250cm9scy1saW5rXCIpXG5cdFx0XHRcdC5hdHRyKFwiaHJlZlwiLCB3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cdFx0fSk7XG5cdFx0bGFiZWwuYXBwZW5kKFwic3BhblwiKVxuXHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcIm1kbC1jaGVja2JveF9fbGFiZWwgbGFiZWxcIilcblx0XHRcdC50ZXh0KHRleHQpO1xuXHR9KTtcblx0ZDMuc2VsZWN0KFwiLmhpZGUtY29udHJvbHMtbGlua1wiKVxuXHRcdC5hdHRyKFwiaHJlZlwiLCB3aW5kb3cubG9jYXRpb24uaHJlZik7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlRGF0YShmaXJzdFRpbWUgPSBmYWxzZSkge1xuXHRpZiAoIWZpcnN0VGltZSkge1xuXHRcdC8vIENoYW5nZSB0aGUgc2VlZC5cblx0XHRzdGF0ZS5zZWVkID0gTWF0aC5yYW5kb20oKS50b0ZpeGVkKDgpO1xuXHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdH1cblx0TWF0aC5zZWVkcmFuZG9tKHN0YXRlLnNlZWQpO1xuXHRsZXQgbnVtU2FtcGxlcyA9IChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLlJFR1JFU1NJT04pID9cblx0XHROVU1fU0FNUExFU19SRUdSRVNTIDogTlVNX1NBTVBMRVNfQ0xBU1NJRlk7XG5cblx0bGV0IGdlbmVyYXRvcjtcblx0bGV0IGRhdGE6IEV4YW1wbGUyRFtdID0gW107XG5cblx0aWYgKHN0YXRlLmJ5b2QpIHtcblx0XHQvLyB+IGZvciAobGV0IGkgPSAwOyBpIDwgdHJhaW5EYXRhLmxlbmd0aDsgaSsrKVxuXHRcdC8vIH4ge1xuXHRcdC8vIH4gZGF0YVtpXS5wdXNoKHRyYWluRGF0YVtpXSk7XG5cdFx0Ly8gfiB9XG5cdFx0Ly8gfiBmb3IgKGxldCBpID0gdHJhaW5EYXRhLmxlbmd0aDsgaSA8IHRyYWluRGF0YS5sZW5ndGgrdGVzdERhdGEubGVuZ3RoOyBpKyspXG5cdFx0Ly8gfiB7XG5cdFx0Ly8gfiBsZXQgaiA9IGkgLSB0cmFpbkRhdGEubGVuZ3RoO1xuXHRcdC8vIH4gZGF0YVtpXS5wdXNoKHRlc3REYXRhW2pdKTtcblx0XHQvLyB+IH1cblxuXHRcdC8vIH4gc2h1ZmZsZShkYXRhKTtcblx0XHQvLyB+IGxldCBzcGxpdEluZGV4ID0gTWF0aC5mbG9vcihkYXRhLmxlbmd0aCAqIHN0YXRlLnBlcmNUcmFpbkRhdGEvMTAwKTtcblx0XHQvLyB+IHRyYWluRGF0YSA9IGRhdGEuc2xpY2UoMCwgc3BsaXRJbmRleCk7XG5cdFx0Ly8gfiB0ZXN0RGF0YSA9IGRhdGEuc2xpY2Uoc3BsaXRJbmRleCk7XG5cdH1cblxuXHRpZiAoIXN0YXRlLmJ5b2QpIHtcblx0XHRnZW5lcmF0b3IgPSBzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OID8gc3RhdGUuZGF0YXNldCA6IHN0YXRlLnJlZ0RhdGFzZXQ7XG5cdFx0ZGF0YSA9IGdlbmVyYXRvcihudW1TYW1wbGVzLCBzdGF0ZS5ub2lzZSk7XG5cblx0XHRzaHVmZmxlKGRhdGEpO1xuXHRcdC8vIFNwbGl0IGludG8gdHJhaW4gYW5kIHRlc3QgZGF0YS5cblx0XHRsZXQgc3BsaXRJbmRleCA9IE1hdGguZmxvb3IoZGF0YS5sZW5ndGggKiBzdGF0ZS5wZXJjVHJhaW5EYXRhIC8gMTAwKTtcblx0XHR0cmFpbkRhdGEgPSBkYXRhLnNsaWNlKDAsIHNwbGl0SW5kZXgpO1xuXHRcdHRlc3REYXRhID0gZGF0YS5zbGljZShzcGxpdEluZGV4KTtcblx0fVxuXHRzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMF07XG5cdHN0YXRlLm1heENhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkodHJhaW5EYXRhKVsxXTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXG5cdGhlYXRNYXAudXBkYXRlUG9pbnRzKHRyYWluRGF0YSk7XG5cdGhlYXRNYXAudXBkYXRlVGVzdFBvaW50cyhzdGF0ZS5zaG93VGVzdERhdGEgPyB0ZXN0RGF0YSA6IFtdKTtcblxufVxuXG5sZXQgZmlyc3RJbnRlcmFjdGlvbiA9IHRydWU7XG5sZXQgcGFyYW1ldGVyc0NoYW5nZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gdXNlckhhc0ludGVyYWN0ZWQoKSB7XG5cdGlmICghZmlyc3RJbnRlcmFjdGlvbikge1xuXHRcdHJldHVybjtcblx0fVxuXHRmaXJzdEludGVyYWN0aW9uID0gZmFsc2U7XG5cdGxldCBwYWdlID0gXCJpbmRleFwiO1xuXHRpZiAoc3RhdGUudHV0b3JpYWwgIT0gbnVsbCAmJiBzdGF0ZS50dXRvcmlhbCAhPT0gXCJcIikge1xuXHRcdHBhZ2UgPSBgL3YvdHV0b3JpYWxzLyR7c3RhdGUudHV0b3JpYWx9YDtcblx0fVxuXHRnYShcInNldFwiLCBcInBhZ2VcIiwgcGFnZSk7XG5cdGdhKFwic2VuZFwiLCBcInBhZ2V2aWV3XCIsIHtcInNlc3Npb25Db250cm9sXCI6IFwic3RhcnRcIn0pO1xufVxuXG5mdW5jdGlvbiBzaW11bGF0aW9uU3RhcnRlZCgpIHtcblx0Z2EoXCJzZW5kXCIsXG5cdFx0e1xuXHRcdFx0aGl0VHlwZTogXCJldmVudFwiLFxuXHRcdFx0ZXZlbnRDYXRlZ29yeTogXCJTdGFydGluZyBTaW11bGF0aW9uXCIsXG5cdFx0XHRldmVudEFjdGlvbjogcGFyYW1ldGVyc0NoYW5nZWQgPyBcImNoYW5nZWRcIiA6IFwidW5jaGFuZ2VkXCIsXG5cdFx0XHRldmVudExhYmVsOiBzdGF0ZS50dXRvcmlhbCA9PSBudWxsID8gXCJcIiA6IHN0YXRlLnR1dG9yaWFsXG5cdFx0fSk7XG5cdHBhcmFtZXRlcnNDaGFuZ2VkID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHNpbXVsYXRlQ2xpY2soZWxlbSAvKiBNdXN0IGJlIHRoZSBlbGVtZW50LCBub3QgZDMgc2VsZWN0aW9uICovKSB7XG5cdGxldCBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIk1vdXNlRXZlbnRzXCIpO1xuXHRldnQuaW5pdE1vdXNlRXZlbnQoXG5cdFx0XCJjbGlja1wiLCAvKiB0eXBlICovXG5cdFx0dHJ1ZSwgLyogY2FuQnViYmxlICovXG5cdFx0dHJ1ZSwgLyogY2FuY2VsYWJsZSAqL1xuXHRcdHdpbmRvdywgLyogdmlldyAqL1xuXHRcdDAsIC8qIGRldGFpbCAqL1xuXHRcdDAsIC8qIHNjcmVlblggKi9cblx0XHQwLCAvKiBzY3JlZW5ZICovXG5cdFx0MCwgLyogY2xpZW50WCAqL1xuXHRcdDAsIC8qIGNsaWVudFkgKi9cblx0XHRmYWxzZSwgLyogY3RybEtleSAqL1xuXHRcdGZhbHNlLCAvKiBhbHRLZXkgKi9cblx0XHRmYWxzZSwgLyogc2hpZnRLZXkgKi9cblx0XHRmYWxzZSwgLyogbWV0YUtleSAqL1xuXHRcdDAsIC8qIGJ1dHRvbiAqL1xuXHRcdG51bGwpOyAvKiByZWxhdGVkVGFyZ2V0ICovXG5cdGVsZW0uZGlzcGF0Y2hFdmVudChldnQpO1xufVxuXG5kcmF3RGF0YXNldFRodW1ibmFpbHMoKTtcbi8vIGluaXRUdXRvcmlhbCgpO1xubWFrZUdVSSgpO1xuZ2VuZXJhdGVEYXRhKHRydWUpO1xucmVzZXQodHJ1ZSk7XG5oaWRlQ29udHJvbHMoKTtcbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuaW1wb3J0ICogYXMgbm4gZnJvbSBcIi4vbm5cIjtcbmltcG9ydCAqIGFzIGRhdGFzZXQgZnJvbSBcIi4vZGF0YXNldFwiO1xuaW1wb3J0IHtFeGFtcGxlMkQsIHNodWZmbGUsIERhdGFHZW5lcmF0b3J9IGZyb20gXCIuL2RhdGFzZXRcIjtcblxuLyoqIFN1ZmZpeCBhZGRlZCB0byB0aGUgc3RhdGUgd2hlbiBzdG9yaW5nIGlmIGEgY29udHJvbCBpcyBoaWRkZW4gb3Igbm90LiAqL1xuY29uc3QgSElERV9TVEFURV9TVUZGSVggPSBcIl9oaWRlXCI7XG5cbi8qKiBBIG1hcCBiZXR3ZWVuIG5hbWVzIGFuZCBhY3RpdmF0aW9uIGZ1bmN0aW9ucy4gKi9cbmV4cG9ydCBsZXQgYWN0aXZhdGlvbnM6IHsgW2tleTogc3RyaW5nXTogbm4uQWN0aXZhdGlvbkZ1bmN0aW9uIH0gPSB7XG5cdFwicmVsdVwiOiBubi5BY3RpdmF0aW9ucy5SRUxVLFxuXHRcInRhbmhcIjogbm4uQWN0aXZhdGlvbnMuVEFOSCxcblx0XCJzaWdtb2lkXCI6IG5uLkFjdGl2YXRpb25zLlNJR01PSUQsXG5cdFwibGluZWFyXCI6IG5uLkFjdGl2YXRpb25zLkxJTkVBUixcblx0XCJzaW54XCI6IG5uLkFjdGl2YXRpb25zLlNJTlhcbn07XG5cbi8qKiBBIG1hcCBiZXR3ZWVuIG5hbWVzIGFuZCByZWd1bGFyaXphdGlvbiBmdW5jdGlvbnMuICovXG5leHBvcnQgbGV0IHJlZ3VsYXJpemF0aW9uczogeyBba2V5OiBzdHJpbmddOiBubi5SZWd1bGFyaXphdGlvbkZ1bmN0aW9uIH0gPSB7XG5cdFwibm9uZVwiOiBudWxsLFxuXHRcIkwxXCI6IG5uLlJlZ3VsYXJpemF0aW9uRnVuY3Rpb24uTDEsXG5cdFwiTDJcIjogbm4uUmVndWxhcml6YXRpb25GdW5jdGlvbi5MMlxufTtcblxuLyoqIEEgbWFwIGJldHdlZW4gZGF0YXNldCBuYW1lcyBhbmQgZnVuY3Rpb25zIHRoYXQgZ2VuZXJhdGUgY2xhc3NpZmljYXRpb24gZGF0YS4gKi9cbmV4cG9ydCBsZXQgZGF0YXNldHM6IHsgW2tleTogc3RyaW5nXTogZGF0YXNldC5EYXRhR2VuZXJhdG9yIH0gPSB7XG5cdFwiY2lyY2xlXCI6IGRhdGFzZXQuY2xhc3NpZnlDaXJjbGVEYXRhLFxuXHRcInhvclwiOiBkYXRhc2V0LmNsYXNzaWZ5WE9SRGF0YSxcblx0XCJnYXVzc1wiOiBkYXRhc2V0LmNsYXNzaWZ5VHdvR2F1c3NEYXRhLFxuXHRcInNwaXJhbFwiOiBkYXRhc2V0LmNsYXNzaWZ5U3BpcmFsRGF0YSxcblx0XCJieW9kXCI6IGRhdGFzZXQuY2xhc3NpZnlCWU9EYXRhXG59O1xuXG4vKiogQSBtYXAgYmV0d2VlbiBkYXRhc2V0IG5hbWVzIGFuZCBmdW5jdGlvbnMgdGhhdCBnZW5lcmF0ZSByZWdyZXNzaW9uIGRhdGEuICovXG5leHBvcnQgbGV0IHJlZ0RhdGFzZXRzOiB7IFtrZXk6IHN0cmluZ106IGRhdGFzZXQuRGF0YUdlbmVyYXRvciB9ID0ge1xuXHRcInJlZy1wbGFuZVwiOiBkYXRhc2V0LnJlZ3Jlc3NQbGFuZSxcblx0XCJyZWctZ2F1c3NcIjogZGF0YXNldC5yZWdyZXNzR2F1c3NpYW5cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRLZXlGcm9tVmFsdWUob2JqOiBhbnksIHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuXHRmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG5cdFx0aWYgKG9ialtrZXldID09PSB2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIGtleTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZW5kc1dpdGgoczogc3RyaW5nLCBzdWZmaXg6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gcy5zdWJzdHIoLXN1ZmZpeC5sZW5ndGgpID09PSBzdWZmaXg7XG59XG5cbmZ1bmN0aW9uIGdldEhpZGVQcm9wcyhvYmo6IGFueSk6IHN0cmluZ1tdIHtcblx0bGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblx0Zm9yIChsZXQgcHJvcCBpbiBvYmopIHtcblx0XHRpZiAoZW5kc1dpdGgocHJvcCwgSElERV9TVEFURV9TVUZGSVgpKSB7XG5cdFx0XHRyZXN1bHQucHVzaChwcm9wKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgZGF0YSB0eXBlIG9mIGEgc3RhdGUgdmFyaWFibGUuIFVzZWQgZm9yIGRldGVybWluaW5nIHRoZVxuICogKGRlKXNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5leHBvcnQgZW51bSBUeXBlIHtcblx0U1RSSU5HLFxuXHROVU1CRVIsXG5cdEFSUkFZX05VTUJFUixcblx0QVJSQVlfU1RSSU5HLFxuXHRCT09MRUFOLFxuXHRPQkpFQ1Rcbn1cblxuZXhwb3J0IGVudW0gUHJvYmxlbSB7XG5cdENMQVNTSUZJQ0FUSU9OLFxuXHRSRUdSRVNTSU9OXG59XG5cbmV4cG9ydCBsZXQgcHJvYmxlbXMgPSB7XG5cdFwiY2xhc3NpZmljYXRpb25cIjogUHJvYmxlbS5DTEFTU0lGSUNBVElPTixcblx0XCJyZWdyZXNzaW9uXCI6IFByb2JsZW0uUkVHUkVTU0lPTlxufTtcblxuZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eSB7XG5cdG5hbWU6IHN0cmluZztcblx0dHlwZTogVHlwZTtcblx0a2V5TWFwPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbn1cblxuLy8gQWRkIHRoZSBHVUkgc3RhdGUuXG5leHBvcnQgY2xhc3MgU3RhdGUge1xuXHRwcml2YXRlIHN0YXRpYyBQUk9QUzogUHJvcGVydHlbXSA9XG5cdFx0W1xuXHRcdFx0e25hbWU6IFwiYWN0aXZhdGlvblwiLCB0eXBlOiBUeXBlLk9CSkVDVCwga2V5TWFwOiBhY3RpdmF0aW9uc30sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6IFwicmVndWxhcml6YXRpb25cIixcblx0XHRcdFx0dHlwZTogVHlwZS5PQkpFQ1QsXG5cdFx0XHRcdGtleU1hcDogcmVndWxhcml6YXRpb25zXG5cdFx0XHR9LFxuXHRcdFx0e25hbWU6IFwiYmF0Y2hTaXplXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcblx0XHRcdHtuYW1lOiBcImRhdGFzZXRcIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogZGF0YXNldHN9LFxuXHRcdFx0e25hbWU6IFwicmVnRGF0YXNldFwiLCB0eXBlOiBUeXBlLk9CSkVDVCwga2V5TWFwOiByZWdEYXRhc2V0c30sXG5cdFx0XHR7bmFtZTogXCJsZWFybmluZ1JhdGVcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwidHJ1ZUxlYXJuaW5nUmF0ZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sIC8vIFRoZSB0cnVlIGxlYXJuaW5nIHJhdGVcblx0XHRcdHtuYW1lOiBcInJlZ3VsYXJpemF0aW9uUmF0ZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sXG5cdFx0XHR7bmFtZTogXCJub2lzZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sXG5cdFx0XHR7bmFtZTogXCJuZXR3b3JrU2hhcGVcIiwgdHlwZTogVHlwZS5BUlJBWV9OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwic2VlZFwiLCB0eXBlOiBUeXBlLlNUUklOR30sXG5cdFx0XHR7bmFtZTogXCJzaG93VGVzdERhdGFcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcImRpc2NyZXRpemVcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInBlcmNUcmFpbkRhdGFcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwieFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwieVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwieFRpbWVzWVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwieFNxdWFyZWRcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInlTcXVhcmVkXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJjb3NYXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJzaW5YXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJjb3NZXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJzaW5ZXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJjb2xsZWN0U3RhdHNcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInR1dG9yaWFsXCIsIHR5cGU6IFR5cGUuU1RSSU5HfSxcblx0XHRcdHtuYW1lOiBcInByb2JsZW1cIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogcHJvYmxlbXN9LFxuXHRcdFx0e25hbWU6IFwiaW5pdFplcm9cIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcImhpZGVUZXh0XCIsIHR5cGU6IFR5cGUuQk9PTEVBTn1cblx0XHRdO1xuXG5cdFtrZXk6IHN0cmluZ106IGFueTtcblxuXHR0b3RhbENhcGFjaXR5ID0gMC4wO1xuXHRyZXFDYXBhY2l0eSA9IDI7XG5cdG1heENhcGFjaXR5ID0gMDtcblx0c3VnQ2FwYWNpdHkgPSAwO1xuXHRsb3NzQ2FwYWNpdHkgPSAwO1xuXHR0cnVlTGVhcm5pbmdSYXRlID0gMC4wO1xuXHRsZWFybmluZ1JhdGUgPSAxLjA7XG5cdHJlZ3VsYXJpemF0aW9uUmF0ZSA9IDA7XG5cdHNob3dUZXN0RGF0YSA9IGZhbHNlO1xuXHRub2lzZSA9IDM1OyAvLyBTTlJkQlxuXHRiYXRjaFNpemUgPSAxMDtcblx0ZGlzY3JldGl6ZSA9IGZhbHNlO1xuXHR0dXRvcmlhbDogc3RyaW5nID0gbnVsbDtcblx0cGVyY1RyYWluRGF0YSA9IDUwO1xuXHRhY3RpdmF0aW9uID0gbm4uQWN0aXZhdGlvbnMuU0lHTU9JRDtcblx0cmVndWxhcml6YXRpb246IG5uLlJlZ3VsYXJpemF0aW9uRnVuY3Rpb24gPSBudWxsO1xuXHRwcm9ibGVtID0gUHJvYmxlbS5DTEFTU0lGSUNBVElPTjtcblx0aW5pdFplcm8gPSBmYWxzZTtcblx0aGlkZVRleHQgPSBmYWxzZTtcblx0Y29sbGVjdFN0YXRzID0gZmFsc2U7XG5cdG51bUhpZGRlbkxheWVycyA9IDE7XG5cdGhpZGRlbkxheWVyQ29udHJvbHM6IGFueVtdID0gW107XG5cdG5ldHdvcmtTaGFwZTogbnVtYmVyW10gPSBbMV07XG5cdHggPSB0cnVlO1xuXHR5ID0gdHJ1ZTtcblx0eFRpbWVzWSA9IGZhbHNlO1xuXHR4U3F1YXJlZCA9IGZhbHNlO1xuXHR5U3F1YXJlZCA9IGZhbHNlO1xuXHRjb3NYID0gZmFsc2U7XG5cdHNpblggPSBmYWxzZTtcblx0Y29zWSA9IGZhbHNlO1xuXHRzaW5ZID0gZmFsc2U7XG5cdGJ5b2QgPSBmYWxzZTtcblx0ZGF0YTogRXhhbXBsZTJEW10gPSBbXTtcblx0ZGF0YXNldDogZGF0YXNldC5EYXRhR2VuZXJhdG9yID0gZGF0YXNldC5jbGFzc2lmeVR3b0dhdXNzRGF0YTtcblx0cmVnRGF0YXNldDogZGF0YXNldC5EYXRhR2VuZXJhdG9yID0gZGF0YXNldC5yZWdyZXNzUGxhbmU7XG5cdHNlZWQ6IHN0cmluZztcblxuXHQvKipcblx0ICogRGVzZXJpYWxpemVzIHRoZSBzdGF0ZSBmcm9tIHRoZSB1cmwgaGFzaC5cblx0ICovXG5cdHN0YXRpYyBkZXNlcmlhbGl6ZVN0YXRlKCk6IFN0YXRlIHtcblx0XHRsZXQgbWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cdFx0Zm9yIChsZXQga2V5dmFsdWUgb2Ygd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkuc3BsaXQoXCImXCIpKSB7XG5cdFx0XHRsZXQgW25hbWUsIHZhbHVlXSA9IGtleXZhbHVlLnNwbGl0KFwiPVwiKTtcblx0XHRcdG1hcFtuYW1lXSA9IHZhbHVlO1xuXHRcdH1cblx0XHRsZXQgc3RhdGUgPSBuZXcgU3RhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGhhc0tleShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiBuYW1lIGluIG1hcCAmJiBtYXBbbmFtZV0gIT0gbnVsbCAmJiBtYXBbbmFtZV0udHJpbSgpICE9PSBcIlwiO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHBhcnNlQXJyYXkodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcblx0XHRcdHJldHVybiB2YWx1ZS50cmltKCkgPT09IFwiXCIgPyBbXSA6IHZhbHVlLnNwbGl0KFwiLFwiKTtcblx0XHR9XG5cblx0XHQvLyBEZXNlcmlhbGl6ZSByZWd1bGFyIHByb3BlcnRpZXMuXG5cdFx0U3RhdGUuUFJPUFMuZm9yRWFjaCgoe25hbWUsIHR5cGUsIGtleU1hcH0pID0+IHtcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIFR5cGUuT0JKRUNUOlxuXHRcdFx0XHRcdGlmIChrZXlNYXAgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0dGhyb3cgRXJyb3IoXCJBIGtleS12YWx1ZSBtYXAgbXVzdCBiZSBwcm92aWRlZCBmb3Igc3RhdGUgXCIgK1xuXHRcdFx0XHRcdFx0XHRcInZhcmlhYmxlcyBvZiB0eXBlIE9iamVjdFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGhhc0tleShuYW1lKSAmJiBtYXBbbmFtZV0gaW4ga2V5TWFwKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZVtuYW1lXSA9IGtleU1hcFttYXBbbmFtZV1dO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBUeXBlLk5VTUJFUjpcblx0XHRcdFx0XHRpZiAoaGFzS2V5KG5hbWUpKSB7XG5cdFx0XHRcdFx0XHQvLyBUaGUgKyBvcGVyYXRvciBpcyBmb3IgY29udmVydGluZyBhIHN0cmluZyB0byBhIG51bWJlci5cblx0XHRcdFx0XHRcdHN0YXRlW25hbWVdID0gK21hcFtuYW1lXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVHlwZS5TVFJJTkc6XG5cdFx0XHRcdFx0aWYgKGhhc0tleShuYW1lKSkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBtYXBbbmFtZV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQk9PTEVBTjpcblx0XHRcdFx0XHRpZiAoaGFzS2V5KG5hbWUpKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZVtuYW1lXSA9IChtYXBbbmFtZV0gPT09IFwiZmFsc2VcIiA/IGZhbHNlIDogdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQVJSQVlfTlVNQkVSOlxuXHRcdFx0XHRcdGlmIChuYW1lIGluIG1hcCkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBwYXJzZUFycmF5KG1hcFtuYW1lXSkubWFwKE51bWJlcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQVJSQVlfU1RSSU5HOlxuXHRcdFx0XHRcdGlmIChuYW1lIGluIG1hcCkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBwYXJzZUFycmF5KG1hcFtuYW1lXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IEVycm9yKFwiRW5jb3VudGVyZWQgYW4gdW5rbm93biB0eXBlIGZvciBhIHN0YXRlIHZhcmlhYmxlXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gRGVzZXJpYWxpemUgc3RhdGUgcHJvcGVydGllcyB0aGF0IGNvcnJlc3BvbmQgdG8gaGlkaW5nIFVJIGNvbnRyb2xzLlxuXHRcdGdldEhpZGVQcm9wcyhtYXApLmZvckVhY2gocHJvcCA9PiB7XG5cdFx0XHRzdGF0ZVtwcm9wXSA9IChtYXBbcHJvcF0gPT09IFwidHJ1ZVwiKTtcblx0XHR9KTtcblx0XHRzdGF0ZS5udW1IaWRkZW5MYXllcnMgPSBzdGF0ZS5uZXR3b3JrU2hhcGUubGVuZ3RoO1xuXHRcdGlmIChzdGF0ZS5zZWVkID09IG51bGwpIHtcblx0XHRcdHN0YXRlLnNlZWQgPSBNYXRoLnJhbmRvbSgpLnRvRml4ZWQoNSk7XG5cdFx0fVxuXHRcdE1hdGguc2VlZHJhbmRvbShzdGF0ZS5zZWVkKTtcblx0XHRyZXR1cm4gc3RhdGU7XG5cdH1cblxuXHQvKipcblx0ICogU2VyaWFsaXplcyB0aGUgc3RhdGUgaW50byB0aGUgdXJsIGhhc2guXG5cdCAqL1xuXHRzZXJpYWxpemUoKSB7XG5cdFx0Ly8gU2VyaWFsaXplIHJlZ3VsYXIgcHJvcGVydGllcy5cblx0XHRsZXQgcHJvcHM6IHN0cmluZ1tdID0gW107XG5cdFx0U3RhdGUuUFJPUFMuZm9yRWFjaCgoe25hbWUsIHR5cGUsIGtleU1hcH0pID0+IHtcblx0XHRcdGxldCB2YWx1ZSA9IHRoaXNbbmFtZV07XG5cdFx0XHQvLyBEb24ndCBzZXJpYWxpemUgbWlzc2luZyB2YWx1ZXMuXG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZSA9PT0gVHlwZS5PQkpFQ1QpIHtcblx0XHRcdFx0dmFsdWUgPSBnZXRLZXlGcm9tVmFsdWUoa2V5TWFwLCB2YWx1ZSk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IFR5cGUuQVJSQVlfTlVNQkVSIHx8IHR5cGUgPT09IFR5cGUuQVJSQVlfU1RSSU5HKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuam9pbihcIixcIik7XG5cdFx0XHR9XG5cdFx0XHRwcm9wcy5wdXNoKGAke25hbWV9PSR7dmFsdWV9YCk7XG5cdFx0fSk7XG5cdFx0Ly8gU2VyaWFsaXplIHByb3BlcnRpZXMgdGhhdCBjb3JyZXNwb25kIHRvIGhpZGluZyBVSSBjb250cm9scy5cblx0XHRnZXRIaWRlUHJvcHModGhpcykuZm9yRWFjaChwcm9wID0+IHtcblx0XHRcdHByb3BzLnB1c2goYCR7cHJvcH09JHt0aGlzW3Byb3BdfWApO1xuXHRcdH0pO1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcHJvcHMuam9pbihcIiZcIik7XG5cdH1cblxuXHQvKiogUmV0dXJucyBhbGwgdGhlIGhpZGRlbiBwcm9wZXJ0aWVzLiAqL1xuXHRnZXRIaWRkZW5Qcm9wcygpOiBzdHJpbmdbXSB7XG5cdFx0bGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblx0XHRmb3IgKGxldCBwcm9wIGluIHRoaXMpIHtcblx0XHRcdGlmIChlbmRzV2l0aChwcm9wLCBISURFX1NUQVRFX1NVRkZJWCkgJiYgU3RyaW5nKHRoaXNbcHJvcF0pID09PSBcInRydWVcIikge1xuXHRcdFx0XHRyZXN1bHQucHVzaChwcm9wLnJlcGxhY2UoSElERV9TVEFURV9TVUZGSVgsIFwiXCIpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdHNldEhpZGVQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIGhpZGRlbjogYm9vbGVhbikge1xuXHRcdHRoaXNbbmFtZSArIEhJREVfU1RBVEVfU1VGRklYXSA9IGhpZGRlbjtcblx0fVxufVxuIl19
