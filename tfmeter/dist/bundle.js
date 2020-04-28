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
        this.isResidual = false;
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
            node.layer = layerIdx;
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
var nn_1 = require("./nn");
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
var markedNode = null;
var markedDiv = null;
function getReqCapacity(points) {
    var rounding = REQ_CAP_ROUNDING;
    var energy = [];
    var numRows = points.length;
    var numCols = 2;
    var result = 0;
    var retval = [];
    var class1 = -666;
    var numclass1 = 0;
    var _loop_1 = function (i) {
        var result_1 = 0;
        if (network && network[0].length) {
            network[0].forEach(function (node) {
                result_1 += INPUTS[node.id].f(points[i].x, points[i].y);
            });
        }
        else {
            return { value: [Infinity, Infinity] };
        }
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
    };
    for (var i = 0; i < numRows; i++) {
        var state_2 = _loop_1(i);
        if (typeof state_2 === "object")
            return state_2.value;
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
function minMaxScalePoints(points, range) {
    var points_x = points.map(function (p) { return p.x; });
    var points_y = points.map(function (p) { return p.y; });
    var x_min = Math.min.apply(Math, points_x);
    var x_max = Math.max.apply(Math, points_x);
    var y_min = Math.min.apply(Math, points_y);
    var y_max = Math.max.apply(Math, points_y);
    points.forEach(function (p) {
        p.x = ((p.x - x_min) / (x_max - x_min)) * (range[1] - range[0]) + range[0];
        p.y = ((p.y - y_min) / (y_max - y_min)) * (range[1] - range[0]) + range[0];
    });
    return points;
}
function makeGUI() {
    $(function () {
        $("[data-toggle='popover']").popover({
            container: "body"
        });
    });
    $(".popover-dismiss").popover({
        trigger: "focus"
    });
    window.addEventListener("keyup", function (event) {
        if (event.keyCode == 16) {
            state.shiftDown = false;
            if (markedDiv != null) {
                markedDiv.style({
                    "border-width": "0px"
                });
            }
            markedDiv = null;
            markedNode = null;
        }
    });
    window.addEventListener("keydown", function (event) {
        if (event.keyCode == 16) {
            state.shiftDown = true;
        }
    });
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
                        var x_1 = parseFloat(ss[0]);
                        var y = parseFloat(ss[1]);
                        var label = parseInt(ss[2]);
                        points.push({ x: x_1, y: y, label: label });
                    }
                    points = minMaxScalePoints(points, [-6, 6]);
                    dataset_1.shuffle(points);
                    var splitIndex = Math.floor(points.length * state.percTrainData / 100);
                    trainData = points.slice(0, splitIndex);
                    testData = points.slice(splitIndex);
                    heatMap.updatePoints(trainData);
                    heatMap.updateTestPoints(state.showTestData ? testData : []);
                    var classDist = getNumberOfEachClass(trainData).map(function (num) { return num / trainData.length; });
                    state.sugCapacity = getReqCapacity(trainData)[0];
                    state.maxCapacity = getReqCapacity(trainData)[1];
                    d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
                    d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
                    d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
                    d3.select("label[for='dataDistribution'] .value")
                        .text(classDist[0].toFixed(3) + ", " + classDist[1].toFixed(3));
                    parametersChanged = true;
                    reset();
                    var canvas = document.querySelector("canvas[data-dataset=byod]");
                    renderThumbnail(canvas, function (numSamples, noise) { return points; });
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
            var classDist_1 = getNumberOfEachClass(trainData).map(function (num) { return num / trainData.length; });
            state.sugCapacity = getReqCapacity(trainData)[0];
            state.maxCapacity = getReqCapacity(trainData)[1];
            d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
            d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
            d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
            d3.select("label[for='dataDistribution'] .value")
                .text(classDist_1[0].toFixed(3) + ", " + classDist_1[1].toFixed(3));
            parametersChanged = true;
            var canvas = document.querySelector("canvas[data-dataset=byod]");
            renderBYODThumbnail(canvas);
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
        var classDist = getNumberOfEachClass(trainData).map(function (num) { return num / trainData.length; });
        d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
        d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
        d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
        d3.select("label[for='dataDistribution'] .value")
            .text(classDist[0].toFixed(3) + ", " + classDist[1].toFixed(3));
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
        var classDist = getNumberOfEachClass(trainData).map(function (num) { return num / trainData.length; });
        d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
        d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
        d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
        d3.select("label[for='dataDistribution'] .value")
            .text(classDist[0].toFixed(3) + ", " + classDist[1].toFixed(3));
        parametersChanged = true;
        reset();
    });
    noise.property("value", state.noise);
    var classDist = getNumberOfEachClass(trainData).map(function (num) { return num / trainData.length; });
    d3.select("label[for='true-noiseSNR'] .value").text(state.noise);
    d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
    d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
    d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
    d3.select("label[for='dataDistribution'] .value")
        .text(classDist[0].toFixed(3) + ", " + classDist[1].toFixed(3));
    var batchSize = d3.select("#batchSize").on("input", function () {
        state.batchSize = this.value;
        var classDist = getNumberOfEachClass(trainData).map(function (num) { return num / trainData.length; });
        d3.select("label[for='batchSize'] .value").text(this.value);
        d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
        d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
        d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
        d3.select("label[for='dataDistribution'] .value")
            .text(classDist[0].toFixed(3) + ", " + classDist[1].toFixed(3));
        parametersChanged = true;
        reset();
    });
    batchSize.property("value", state.batchSize);
    d3.select("label[for='batchSize'] .value").text(state.batchSize);
    d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
    d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
    d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
    d3.select("label[for='dataDistribution'] .value")
        .text(classDist[0].toFixed(3) + ", " + classDist[1].toFixed(3));
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
function createLink(startNode, endNode) {
    if (startNode.layer >= endNode.layer - 1) {
        return;
    }
    var link = new nn_1.Link(startNode, endNode, state.regularization, state.initZero);
    link.isResidual = true;
    startNode.outputs.push(link);
    endNode.inputLinks.push(link);
    drawNetwork(network);
    totalCapacity = getTotalCapacity(network);
    updateUI();
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
        .on("click", function () {
        if (state.shiftDown) {
            if (markedNode == null) {
                div.style({
                    "border-style": "solid",
                    "border-radius": "5px",
                    "border-color": "red",
                    "border-width": "2px"
                });
                markedNode = node;
                markedDiv = div;
            }
            else {
                markedDiv.style({
                    "border-width": "0px"
                });
                createLink(markedNode, node);
                markedNode = null;
                markedDiv = null;
            }
        }
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
            if (!state.shiftDown) {
                state[nodeId] = !state[nodeId];
                parametersChanged = true;
                reset();
            }
            else {
                if (markedNode == null) {
                    div.style({
                        "border-style": "solid",
                        "border-radius": "5px",
                        "border-color": "red",
                        "border-width": "2px"
                    });
                    console.log(node, div);
                    markedNode = node;
                    markedDiv = div;
                }
            }
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
    var activeNodeIndices = network[0].reduce(function (obj, node, i) {
        obj[node.id] = i;
        return obj;
    }, {});
    nodeIds.forEach(function (nodeId, i) {
        var nodeIdx = activeNodeIndices[nodeId];
        var node = network[0][nodeIdx];
        var cy = nodeIndexScale(i) + RECT_SIZE / 2;
        node2coord[nodeId] = { cx: cx, cy: cy };
        drawNode(cx, cy, nodeId, true, container, node);
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
        .on("dblclick", function () {
        deactivateActivateLink(input, d3.mouse(this));
    })
        .on("mouseenter", function () {
        updateHoverCard(HoverType.WEIGHT, input, d3.mouse(this));
    })
        .on("mouseleave", function () {
        updateHoverCard(null);
    });
    return line;
}
function deactivateActivateLink(link, coordinates) {
    if (link.isDead) {
        link.weight = 1;
        link.isDead = false;
        updateHoverCard(HoverType.WEIGHT, link, coordinates);
        updateUI();
    }
    else {
        link.weight = 0;
        link.isDead = true;
        updateHoverCard(HoverType.WEIGHT, link, coordinates);
        totalCapacity = getTotalCapacity(network);
        updateUI();
    }
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
function anyAliveOutputLinks(node) {
    var link;
    for (var _i = 0, _a = node.outputs; _i < _a.length; _i++) {
        link = _a[_i];
        if (!link.isDead && !link.isResidual) {
            return true;
        }
    }
    return false;
}
function anyAliveInputLinks(node) {
    var link;
    for (var _i = 0, _a = node.inputLinks; _i < _a.length; _i++) {
        link = _a[_i];
        if (!link.isDead && !link.isResidual) {
            return true;
        }
    }
    return false;
}
function getUniqueInNodes(layer, isOutputNode) {
    if (isOutputNode === void 0) { isOutputNode = false; }
    var uniqueInNodes = [];
    for (var _i = 0, layer_1 = layer; _i < layer_1.length; _i++) {
        var node = layer_1[_i];
        if (anyAliveOutputLinks(node) || isOutputNode) {
            var inLinks = node.inputLinks;
            var link = void 0;
            for (var _a = 0, inLinks_1 = inLinks; _a < inLinks_1.length; _a++) {
                link = inLinks_1[_a];
                if (!link.isResidual && !link.isDead && (link.source.layer === 0 || anyAliveInputLinks(link.source))) {
                    var inNode = link.source;
                    if (uniqueInNodes.indexOf(inNode) === -1) {
                        uniqueInNodes.push(inNode);
                    }
                }
            }
        }
    }
    return uniqueInNodes;
}
function isInArray(candidate, array) {
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var e = array_1[_i];
        if (e[0] == candidate[0] && e[1] == candidate[1]) {
            return true;
        }
    }
    return false;
}
function getTotalCapacity(network) {
    var totalCapacity = 0;
    var _a = getPropogatedInformation(network), propogatedInformation = _a[0], aliveNodes = _a[1];
    var firstLayer = network[1];
    for (var i = 0; i < firstLayer.length; i++) {
        var node = firstLayer[i];
        if (anyAliveOutputLinks(node) || 1 == network.length - 1) {
            totalCapacity += getUniqueInNodes([node], 1 === network.length - 1).length + 1;
        }
    }
    var usedResidualLayers = [];
    for (var layerIdx = 0; layerIdx < network.length; layerIdx++) {
        for (var _i = 0, _b = network[layerIdx]; _i < _b.length; _i++) {
            var node = _b[_i];
            var outputLinks = node.outputs;
            var residualLinks = outputLinks.filter(function (link) {
                return link.isResidual && !link.isDead;
            });
            residualLinks.sort(function (a, b) { return a.dest.layer - b.dest.layer; });
            for (var _c = 0, residualLinks_1 = residualLinks; _c < residualLinks_1.length; _c++) {
                var link = residualLinks_1[_c];
                if (isInArray([link.source, link.dest.layer], usedResidualLayers)) {
                    continue;
                }
                var destIdx = link.dest.layer - 1;
                propogatedInformation[destIdx] += 1;
                for (var j = destIdx + 1; j < propogatedInformation.length; j++) {
                    console.log(j, aliveNodes[j], propogatedInformation[j]);
                    if (aliveNodes[j] > propogatedInformation[j]) {
                        propogatedInformation[j] += 1;
                    }
                    else {
                        break;
                    }
                }
                usedResidualLayers.push([link.source, link.dest.layer]);
            }
        }
    }
    totalCapacity += propogatedInformation.slice(1).reduce(function (a, b) { return a + b; }, 0);
    return totalCapacity;
}
function getPropogatedInformation(network) {
    var propogatedInformation = [];
    var aliveNodes = [];
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var curLayerCapacity = 0;
        var currentLayer = network[layerIdx];
        if (1 === layerIdx) {
            for (var i = 0; i < currentLayer.length; i++) {
                var node = currentLayer[i];
                if (anyAliveOutputLinks(node) || layerIdx == network.length - 1) {
                    curLayerCapacity += 1;
                }
            }
            aliveNodes.push(curLayerCapacity);
            propogatedInformation.push(curLayerCapacity);
        }
        else {
            var uniqueInNodes = getUniqueInNodes(currentLayer, layerIdx === network.length - 1);
            var minLayer = uniqueInNodes.length;
            aliveNodes.push(minLayer);
            for (var i = 1; i < layerIdx; i++) {
                var uniqueInNodes_1 = getUniqueInNodes(network[i], false);
                var tempMinLayer = uniqueInNodes_1.length;
                if (tempMinLayer < minLayer) {
                    minLayer = tempMinLayer;
                }
            }
            curLayerCapacity += minLayer;
            propogatedInformation.push(curLayerCapacity);
        }
    }
    return [propogatedInformation, aliveNodes];
}
function getLearningRate(network) {
    var trueLearningRate = 0;
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var curLayerCapacity = 0;
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            trueLearningRate += node.trueLearningRate;
        }
    }
    return trueLearningRate;
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
function getNumberOfEachClass(dataPoints) {
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
    var classesCount = getNumberOfEachClass(dataPoints);
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
    function humanReadable(n, k) {
        if (k === void 0) { k = 4; }
        return n.toFixed(k);
    }
    function humanReadableInt(n) {
        return n.toFixed(0);
    }
    var numberOfCorrectTrainClassifications = getNumberOfCorrectClassifications(network, trainData);
    var numberOfCorrectTestClassifications = getNumberOfCorrectClassifications(network, testData);
    generalization = (numberOfCorrectTrainClassifications + numberOfCorrectTestClassifications) / totalCapacity;
    var bitLossTest = lossTest;
    var bitLossTrain = lossTrain;
    var bitGeneralization = generalization;
    totalCapacity = getTotalCapacity(network);
    state.sugCapacity = getReqCapacity(trainData)[0];
    state.maxCapacity = getReqCapacity(trainData)[1];
    d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
    d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
    d3.select("#loss-train").text(humanReadable(bitLossTrain));
    d3.select("#loss-test").text(humanReadable(bitLossTest));
    d3.select("#generalization").text(humanReadable(bitGeneralization, 3));
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
    trainClassesAccuracy = getAccuracyForEachClass(network, trainData);
    testClassesAccuracy = getAccuracyForEachClass(network, testData);
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
function renderBYODThumbnail(canvas) {
    canvas.setAttribute("width", 100);
    canvas.setAttribute("height", 100);
    var context = canvas.getContext("2d");
    var plusSvg = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><title>add</title><path d=\"M18.984 12.984h-6v6h-1.969v-6h-6v-1.969h6v-6h1.969v6h6v1.969z\"></path></svg>";
    var img = new Image();
    var svg = new Blob([plusSvg], { type: "image/svg+xml" });
    var url = URL.createObjectURL(svg);
    img.src = url;
    img.onload = function (e) {
        context.drawImage(img, 25, 25, 50, 50);
        URL.revokeObjectURL(url);
    };
    d3.select(canvas.parentNode).style("display", null);
}
function drawDatasetThumbnails() {
    d3.selectAll(".dataset").style("display", "none");
    if (state.problem === state_1.Problem.CLASSIFICATION) {
        for (var dataset in state_1.datasets) {
            var canvas = document.querySelector("canvas[data-dataset=" + dataset + "]");
            var dataGenerator = state_1.datasets[dataset];
            if (dataset === "byod") {
                renderBYODThumbnail(canvas);
                continue;
            }
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
        data = trainData.concat(testData);
    }
    if (!state.byod) {
        generator = state.problem === state_1.Problem.CLASSIFICATION ? state.dataset : state.regDataset;
        data = generator(numSamples, state.noise);
    }
    dataset_1.shuffle(data);
    var splitIndex = Math.floor(data.length * state.percTrainData / 100);
    trainData = data.slice(0, splitIndex);
    testData = data.slice(splitIndex);
    var classDist = getNumberOfEachClass(trainData).map(function (num) { return num / trainData.length; });
    state.sugCapacity = getReqCapacity(trainData)[0];
    state.maxCapacity = getReqCapacity(trainData)[1];
    d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
    d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
    d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
    d3.select("label[for='dataDistribution'] .value")
        .text(classDist[0].toFixed(3) + ", " + classDist[1].toFixed(3));
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
        state.shiftDown = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy5ucG0vX25weC82MDY5NS9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGF0YXNldC50cyIsInNyYy9oZWF0bWFwLnRzIiwic3JjL2xpbmVjaGFydC50cyIsInNyYy9ubi50cyIsInNyYy9wbGF5Z3JvdW5kLnRzIiwic3JjL3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQytDQSx5QkFBZ0MsVUFBa0IsRUFBRSxLQUFhO0lBQ2hFLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUM7SUFpQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDZixDQUFDO0FBbkNELDBDQW1DQztBQVFELDhCQUFxQyxVQUFrQixFQUFFLEtBQWE7SUFDckUsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztJQUM3QixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFHbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXpCLGtCQUFrQixFQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWE7UUFDdEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDaEQsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDaEQsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6QyxJQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxHQUFHLE9BQU8s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QUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDbEQsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELENBQUMsSUFBSSxNQUFNLENBQUM7UUFDWixDQUFDLElBQUksTUFBTSxDQUFDO1FBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBR0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFHMUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxD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QUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQixDQUFDO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2QsQ0FBQztBQUtELDJCQUEyQixNQUFtQixFQUFFLEtBQXVCO0lBQ3RFLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBQyxDQUFDO0lBQ3BDLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBQyxDQUFDO0lBQ3BDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFD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RSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUMxQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDckMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxnQkFBUSxFQUFDO0lBQ3RELEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUN0QyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7Q0FDdEMsQ0FBQztBQW5DUyxzQkFBSyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuLyoqXG4gKiBBIHR3byBkaW1lbnNpb25hbCBleGFtcGxlOiB4IGFuZCB5IGNvb3JkaW5hdGVzIHdpdGggdGhlIGxhYmVsLlxuICovXG5leHBvcnQgdHlwZSBFeGFtcGxlMkQgPSB7XG5cdHg6IG51bWJlcixcblx0eTogbnVtYmVyLFxuXHRsYWJlbDogbnVtYmVyXG59O1xuXG50eXBlIFBvaW50ID0ge1xuXHRcdHg6IG51bWJlcixcblx0XHR5OiBudW1iZXJcblx0fTtcblxuZXhwb3J0IHR5cGUgRGF0YUdlbmVyYXRvciA9IChudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpID0+IEV4YW1wbGUyRFtdO1xuXG5pbnRlcmZhY2UgSFRNTElucHV0RXZlbnQgZXh0ZW5kcyBFdmVudCB7XG5cdHRhcmdldDogSFRNTElucHV0RWxlbWVudCAmIEV2ZW50VGFyZ2V0O1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIENMQVNTSUZJQ0FUSU9OXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBCcmluZyBZb3VyIE93biBEYXRhXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5QllPRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdC8vIEFXRyBOb2lzZSBWYXJpYW5jZSA9IFNpZ25hbCAvIDEwXihTTlJkQi8xMClcblx0Ly8gfiB2YXIgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cblx0Ly8gfiB2YXIgZGF0YTtcblxuXHQvLyB+IHZhciBpbnB1dEJZT0QgPSBkMy5zZWxlY3QoXCIjaW5wdXRGaWxlQllPRFwiKTtcblx0Ly8gfiBpbnB1dEJZT0Qub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkgLy86IEV4YW1wbGUyRFtdXG5cdC8vIH4ge1xuXHQvLyB+IHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHQvLyB+IHZhciBuYW1lID0gdGhpcy5maWxlc1swXS5uYW1lO1xuXHQvLyB+IHJlYWRlci5yZWFkQXNUZXh0KHRoaXMuZmlsZXNbMF0pO1xuXHQvLyB+IHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldmVudClcblx0Ly8gfiB7XG5cdC8vIH4gdmFyIHRhcmdldDogYW55ID0gZXZlbnQudGFyZ2V0O1xuXHQvLyB+IGRhdGEgPSB0YXJnZXQucmVzdWx0O1xuXHQvLyB+IGxldCBzID0gZGF0YS5zcGxpdChcIlxcblwiKTtcblx0Ly8gfiBmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspXG5cdC8vIH4ge1xuXHQvLyB+IGxldCBzcyA9IHNbaV0uc3BsaXQoXCIsXCIpO1xuXHQvLyB+IGlmIChzcy5sZW5ndGggIT0gMykgYnJlYWs7XG5cdC8vIH4gbGV0IHggPSBzc1swXTtcblx0Ly8gfiBsZXQgeSA9IHNzWzFdO1xuXHQvLyB+IGxldCBsYWJlbCA9IHNzWzJdO1xuXHQvLyB+IHBvaW50cy5wdXNoKHt4LHksbGFiZWx9KTtcblx0Ly8gfiBjb25zb2xlLmxvZyhwb2ludHNbaV0ueCtcIixcIitwb2ludHNbaV0ueStcIixcIitwb2ludHNbaV0ubGFiZWwpO1xuXHQvLyB+IH1cblx0Ly8gfiBjb25zb2xlLmxvZyhcIjgxIGRhdGFzZXQudHM6IHBvaW50cy5sZW5ndGggPSBcIiArIHBvaW50cy5sZW5ndGgpO1xuXHQvLyB+IH07XG5cdC8vIH4gY29uc29sZS5sb2coXCI4MyBkYXRhc2V0LnRzOiBwb2ludHMubGVuZ3RoID0gXCIgKyBwb2ludHMubGVuZ3RoKTtcblx0Ly8gfiB9KTtcblx0Ly8gfiBjb25zb2xlLmxvZyhcIjg1IGZpbGVuYW1lOiBcIiArIG5hbWUpO1xuXHQvLyB+IGNvbnNvbGUubG9nKFwiODYgZGF0YXNldC50czogcG9pbnRzLmxlbmd0aCA9IFwiICsgcG9pbnRzLmxlbmd0aCk7XG5cdHJldHVybiBwb2ludHM7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gQ0xBU1NJRlkgR0FVU1NJQU4gQ0xVU1RFUlNcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlUd29HYXVzc0RhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRsZXQgdmFyaWFuY2UgPSAwLjU7XG5cblx0Ly8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuXHRsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cblx0ZnVuY3Rpb24gZ2VuR2F1c3MoY3g6IG51bWJlciwgY3k6IG51bWJlciwgbGFiZWw6IG51bWJlcikge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlcyAvIDI7IGkrKykge1xuXHRcdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCB2YXJpYW5jZSAqIGROb2lzZSk7XG5cdFx0XHRsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIHZhcmlhbmNlICogZE5vaXNlKTtcblx0XHRcdGxldCBzaWduYWxYID0gbm9ybWFsUmFuZG9tKGN4LCB2YXJpYW5jZSk7XG5cdFx0XHRsZXQgc2lnbmFsWSA9IG5vcm1hbFJhbmRvbShjeSwgdmFyaWFuY2UpO1xuXHRcdFx0bGV0IHggPSBzaWduYWxYICsgbm9pc2VYO1xuXHRcdFx0bGV0IHkgPSBzaWduYWxZICsgbm9pc2VZO1xuXHRcdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdFx0fVxuXHR9XG5cblx0Z2VuR2F1c3MoMiwgMiwgMSk7IC8vIEdhdXNzaWFuIHdpdGggcG9zaXRpdmUgZXhhbXBsZXMuXG5cdGdlbkdhdXNzKC0yLCAtMiwgLTEpOyAvLyBHYXVzc2lhbiB3aXRoIG5lZ2F0aXZlIGV4YW1wbGVzLlxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBDTEFTU0lGWSBTUElSQUxcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5U3BpcmFsRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cblx0Ly8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuXHRsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0bGV0IG4gPSBudW1TYW1wbGVzIC8gMjtcblxuXHRmdW5jdGlvbiBnZW5TcGlyYWwoZGVsdGFUOiBudW1iZXIsIGxhYmVsOiBudW1iZXIpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuXHRcdFx0bGV0IHIgPSBpIC8gbiAqIDU7XG5cdFx0XHRsZXQgcjIgPSByICogcjtcblx0XHRcdGxldCB0ID0gMS43NSAqIGkgLyBuICogMiAqIE1hdGguUEkgKyBkZWx0YVQ7XG5cdFx0XHRsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIHIgKiBkTm9pc2UpO1xuXHRcdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCByICogZE5vaXNlKTtcblx0XHRcdGxldCB4ID0gciAqIE1hdGguc2luKHQpICsgbm9pc2VYO1xuXHRcdFx0bGV0IHkgPSByICogTWF0aC5jb3ModCkgKyBub2lzZVk7XG5cdFx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0XHR9XG5cdH1cblxuXHRnZW5TcGlyYWwoMCwgMSk7IC8vIFBvc2l0aXZlIGV4YW1wbGVzLlxuXHRnZW5TcGlyYWwoTWF0aC5QSSwgLTEpOyAvLyBOZWdhdGl2ZSBleGFtcGxlcy5cblx0cmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy8gQ0xBU1NJRlkgQ0lSQ0xFXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlDaXJjbGVEYXRhKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6IEV4YW1wbGUyRFtdIHtcblx0Ly8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuXHRsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0bGV0IHJhZGl1cyA9IDU7XG5cblx0Ly8gR2VuZXJhdGUgcG9zaXRpdmUgcG9pbnRzIGluc2lkZSB0aGUgY2lyY2xlLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXMgLyAyOyBpKyspIHtcblx0XHRsZXQgciA9IHJhbmRVbmlmb3JtKDAsIHJhZGl1cyAqIDAuNSk7XG5cdFx0Ly8gV2UgYXNzdW1lIHJeMiBhcyB0aGUgdmFyaWFuY2Ugb2YgdGhlIFNpZ25hbFxuXHRcdGxldCByMiA9IHIgKiByO1xuXHRcdGxldCBhbmdsZSA9IHJhbmRVbmlmb3JtKDAsIDIgKiBNYXRoLlBJKTtcblx0XHRsZXQgeCA9IHIgKiBNYXRoLnNpbihhbmdsZSk7XG5cdFx0bGV0IHkgPSByICogTWF0aC5jb3MoYW5nbGUpO1xuXHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgMSAvIHJhZGl1cyAqIGROb2lzZSk7XG5cdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCAxIC8gcmFkaXVzICogZE5vaXNlKTtcblx0XHR4ICs9IG5vaXNlWDtcblx0XHR5ICs9IG5vaXNlWTtcblx0XHRsZXQgbGFiZWwgPSAxO1xuXHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHR9XG5cblx0Ly8gR2VuZXJhdGUgbmVnYXRpdmUgcG9pbnRzIG91dHNpZGUgdGhlIGNpcmNsZS5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzIC8gMjsgaSsrKSB7XG5cdFx0bGV0IHIgPSByYW5kVW5pZm9ybShyYWRpdXMgKiAwLjcsIHJhZGl1cyk7XG5cblx0XHQvLyBXZSBhc3N1bWUgcl4yIGFzIHRoZSB2YXJpYW5jZSBvZiB0aGUgU2lnbmFsXG5cdFx0bGV0IHJyMiA9IHIgKiByO1xuXHRcdGxldCBhbmdsZSA9IHJhbmRVbmlmb3JtKDAsIDIgKiBNYXRoLlBJKTtcblx0XHRsZXQgeCA9IHIgKiBNYXRoLnNpbihhbmdsZSk7XG5cdFx0bGV0IHkgPSByICogTWF0aC5jb3MoYW5nbGUpO1xuXHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgMSAvIHJhZGl1cyAqIGROb2lzZSk7XG5cdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCAxIC8gcmFkaXVzICogZE5vaXNlKTtcblx0XHR4ICs9IG5vaXNlWDtcblx0XHR5ICs9IG5vaXNlWTtcblx0XHRsZXQgbGFiZWwgPSAtMTtcblx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0fVxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBDTEFTU0lGWSBYT1Jcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeVhPUkRhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXHQvLyBBV0cgTm9pc2UgVmFyaWFuY2UgPSBTaWduYWwgLyAxMF4oU05SZEIvMTApXG5cdGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHQvLyBTdGFuZGFyZCBkZXZpYXRpb24gb2YgdGhlIHNpZ25hbFxuXHRsZXQgc3RkU2lnbmFsID0gNTtcblxuXHRmdW5jdGlvbiBnZXRYT1JMYWJlbChwOiBQb2ludCkge1xuXHRcdHJldHVybiBwLnggKiBwLnkgPj0gMCA/IDEgOiAtMTtcblx0fVxuXG5cdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlczsgaSsrKSB7XG5cdFx0bGV0IHggPSByYW5kVW5pZm9ybSgtc3RkU2lnbmFsLCBzdGRTaWduYWwpO1xuXHRcdGxldCBwYWRkaW5nID0gMC4zO1xuXHRcdHggKz0geCA+IDAgPyBwYWRkaW5nIDogLXBhZGRpbmc7ICAvLyBQYWRkaW5nLlxuXHRcdGxldCB5ID0gcmFuZFVuaWZvcm0oLXN0ZFNpZ25hbCwgc3RkU2lnbmFsKTtcblx0XHR5ICs9IHkgPiAwID8gcGFkZGluZyA6IC1wYWRkaW5nO1xuXG5cdFx0bGV0IHZhcmlhbmNlU2lnbmFsID0gc3RkU2lnbmFsICogc3RkU2lnbmFsO1xuXHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgdmFyaWFuY2VTaWduYWwgKiBkTm9pc2UpO1xuXHRcdGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgdmFyaWFuY2VTaWduYWwgKiBkTm9pc2UpO1xuXHRcdGxldCBsYWJlbCA9IGdldFhPUkxhYmVsKHt4OiB4ICsgbm9pc2VYLCB5OiB5ICsgbm9pc2VZfSk7XG5cdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdH1cblx0cmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy8gUkVHUkVTU0lPTlxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZnVuY3Rpb24gcmVncmVzc1BsYW5lKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6IEV4YW1wbGUyRFtdIHtcblx0bGV0IGROb2lzZSA9IGRTTlIobm9pc2UpO1xuXHRsZXQgcmFkaXVzID0gNjtcblx0bGV0IHIyID0gcmFkaXVzICogcmFkaXVzO1xuXHRsZXQgbGFiZWxTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0LmRvbWFpbihbLTEwLCAxMF0pXG5cdFx0LnJhbmdlKFstMSwgMV0pO1xuXHRsZXQgZ2V0TGFiZWwgPSAoeCwgeSkgPT4gbGFiZWxTY2FsZSh4ICsgeSk7XG5cblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzOyBpKyspIHtcblx0XHRsZXQgeCA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XG5cdFx0bGV0IHkgPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpO1xuXHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgcjIgKiBkTm9pc2UpO1xuXHRcdGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgcjIgKiBkTm9pc2UpO1xuXHRcdGxldCBsYWJlbCA9IGdldExhYmVsKHggKyBub2lzZVgsIHkgKyBub2lzZVkpO1xuXHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHR9XG5cdHJldHVybiBwb2ludHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdyZXNzR2F1c3NpYW4obnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXHRsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0bGV0IGxhYmVsU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdC5kb21haW4oWzAsIDJdKVxuXHRcdC5yYW5nZShbMSwgMF0pXG5cdFx0LmNsYW1wKHRydWUpO1xuXG5cdGxldCBnYXVzc2lhbnMgPVxuXHRcdFtcblx0XHRcdFstNCwgMi41LCAxXSxcblx0XHRcdFswLCAyLjUsIC0xXSxcblx0XHRcdFs0LCAyLjUsIDFdLFxuXHRcdFx0Wy00LCAtMi41LCAtMV0sXG5cdFx0XHRbMCwgLTIuNSwgMV0sXG5cdFx0XHRbNCwgLTIuNSwgLTFdXG5cdFx0XTtcblxuXHRmdW5jdGlvbiBnZXRMYWJlbCh4LCB5KSB7XG5cdFx0Ly8gQ2hvb3NlIHRoZSBvbmUgdGhhdCBpcyBtYXhpbXVtIGluIGFicyB2YWx1ZS5cblx0XHRsZXQgbGFiZWwgPSAwO1xuXHRcdGdhdXNzaWFucy5mb3JFYWNoKChbY3gsIGN5LCBzaWduXSkgPT4ge1xuXHRcdFx0bGV0IG5ld0xhYmVsID0gc2lnbiAqIGxhYmVsU2NhbGUoZGlzdCh7eCwgeX0sIHt4OiBjeCwgeTogY3l9KSk7XG5cdFx0XHRpZiAoTWF0aC5hYnMobmV3TGFiZWwpID4gTWF0aC5hYnMobGFiZWwpKSB7XG5cdFx0XHRcdGxhYmVsID0gbmV3TGFiZWw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGxhYmVsO1xuXHR9XG5cblx0bGV0IHJhZGl1cyA9IDY7XG5cdGxldCByMiA9IHJhZGl1cyAqIHJhZGl1cztcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzOyBpKyspIHtcblx0XHRsZXQgeCA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XG5cdFx0bGV0IHkgPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpO1xuXHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgcjIgKiBkTm9pc2UpO1xuXHRcdGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgcjIgKiBkTm9pc2UpO1xuXHRcdGxldCBsYWJlbCA9IGdldExhYmVsKHggKyBub2lzZVgsIHkgKyBub2lzZVkpO1xuXHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHR9XG5cblx0cmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy8gQUNDRVNTT1JZIEZVTkNUSU9OU1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gKiBTaHVmZmxlcyB0aGUgYXJyYXkgdXNpbmcgRmlzaGVyLVlhdGVzIGFsZ29yaXRobS4gVXNlcyB0aGUgc2VlZHJhbmRvbVxuICogbGlicmFyeSBhcyB0aGUgcmFuZG9tIGdlbmVyYXRvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNodWZmbGUoYXJyYXk6IGFueVtdKTogdm9pZCB7XG5cdGxldCBjb3VudGVyID0gYXJyYXkubGVuZ3RoO1xuXHRsZXQgdGVtcCA9IDA7XG5cdGxldCBpbmRleCA9IDA7XG5cdC8vIFdoaWxlIHRoZXJlIGFyZSBlbGVtZW50cyBpbiB0aGUgYXJyYXlcblx0d2hpbGUgKGNvdW50ZXIgPiAwKSB7XG5cdFx0Ly8gUGljayBhIHJhbmRvbSBpbmRleFxuXHRcdGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY291bnRlcik7XG5cdFx0Ly8gRGVjcmVhc2UgY291bnRlciBieSAxXG5cdFx0Y291bnRlci0tO1xuXHRcdC8vIEFuZCBzd2FwIHRoZSBsYXN0IGVsZW1lbnQgd2l0aCBpdFxuXHRcdHRlbXAgPSBhcnJheVtjb3VudGVyXTtcblx0XHRhcnJheVtjb3VudGVyXSA9IGFycmF5W2luZGV4XTtcblx0XHRhcnJheVtpbmRleF0gPSB0ZW1wO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxvZzIoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coMik7XG59XG5cbmZ1bmN0aW9uIGxvZzEwKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGgubG9nKDEwKTtcbn1cblxuZnVuY3Rpb24gc2lnbmFsT2YoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIGxvZzIoMSArIE1hdGguYWJzKHgpKTtcbn1cblxuZnVuY3Rpb24gZFNOUih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gMSAvIE1hdGgucG93KDEwLCB4IC8gMTApO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBzYW1wbGUgZnJvbSBhIHVuaWZvcm0gW2EsIGJdIGRpc3RyaWJ1dGlvbi5cbiAqIFVzZXMgdGhlIHNlZWRyYW5kb20gbGlicmFyeSBhcyB0aGUgcmFuZG9tIGdlbmVyYXRvci5cbiAqL1xuZnVuY3Rpb24gcmFuZFVuaWZvcm0oYTogbnVtYmVyLCBiOiBudW1iZXIpIHtcblx0cmV0dXJuIE1hdGgucmFuZG9tKCkgKiAoYiAtIGEpICsgYTtcbn1cblxuLyoqXG4gKiBTYW1wbGVzIGZyb20gYSBub3JtYWwgZGlzdHJpYnV0aW9uLiBVc2VzIHRoZSBzZWVkcmFuZG9tIGxpYnJhcnkgYXMgdGhlXG4gKiByYW5kb20gZ2VuZXJhdG9yLlxuICpcbiAqIEBwYXJhbSBtZWFuIFRoZSBtZWFuLiBEZWZhdWx0IGlzIDAuXG4gKiBAcGFyYW0gdmFyaWFuY2UgVGhlIHZhcmlhbmNlLiBEZWZhdWx0IGlzIDEuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbFJhbmRvbShtZWFuID0gMCwgdmFyaWFuY2UgPSAxKTogbnVtYmVyIHtcblx0bGV0IHYxOiBudW1iZXIsIHYyOiBudW1iZXIsIHM6IG51bWJlcjtcblx0ZG8ge1xuXHRcdHYxID0gMiAqIE1hdGgucmFuZG9tKCkgLSAxO1xuXHRcdHYyID0gMiAqIE1hdGgucmFuZG9tKCkgLSAxO1xuXHRcdHMgPSB2MSAqIHYxICsgdjIgKiB2Mjtcblx0fSB3aGlsZSAocyA+IDEpO1xuXG5cdGxldCByZXN1bHQgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhzKSAvIHMpICogdjE7XG5cdHJldHVybiBtZWFuICsgTWF0aC5zcXJ0KHZhcmlhbmNlKSAqIHJlc3VsdDtcbn1cblxuLyoqIFJldHVybnMgdGhlIGV1Y2xpZGVhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHMgaW4gc3BhY2UuICovXG5mdW5jdGlvbiBkaXN0KGE6IFBvaW50LCBiOiBQb2ludCk6IG51bWJlciB7XG5cdGxldCBkeCA9IGEueCAtIGIueDtcblx0bGV0IGR5ID0gYS55IC0gYi55O1xuXHRyZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbn1cbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5pbXBvcnQge0V4YW1wbGUyRH0gZnJvbSBcIi4vZGF0YXNldFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEhlYXRNYXBTZXR0aW5ncyB7XG5cdFtrZXk6IHN0cmluZ106IGFueTtcblx0c2hvd0F4ZXM/OiBib29sZWFuO1xuXHRub1N2Zz86IGJvb2xlYW47XG59XG5cbi8qKiBOdW1iZXIgb2YgZGlmZmVyZW50IHNoYWRlcyAoY29sb3JzKSB3aGVuIGRyYXdpbmcgYSBncmFkaWVudCBoZWF0bWFwICovXG5jb25zdCBOVU1fU0hBREVTID0gNjQ7XG5cbi8qKlxuKiBEcmF3cyBhIGhlYXRtYXAgdXNpbmcgY2FudmFzLiBVc2VkIGZvciBzaG93aW5nIHRoZSBsZWFybmVkIGRlY2lzaW9uXG4qIGJvdW5kYXJ5IG9mIHRoZSBjbGFzc2lmaWNhdGlvbiBhbGdvcml0aG0uIENhbiBhbHNvIGRyYXcgZGF0YSBwb2ludHNcbiogdXNpbmcgYW4gc3ZnIG92ZXJsYXllZCBvbiB0b3Agb2YgdGhlIGNhbnZhcyBoZWF0bWFwLlxuKi9cbmV4cG9ydCBjbGFzcyBIZWF0TWFwIHtcblx0cHJpdmF0ZSBzZXR0aW5nczogSGVhdE1hcFNldHRpbmdzID0ge3Nob3dBeGVzOiBmYWxzZSwgbm9Tdmc6IGZhbHNlfTtcblx0cHJpdmF0ZSB4U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XG5cdHByaXZhdGUgeVNjYWxlOiBkMy5zY2FsZS5MaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xuXHRwcml2YXRlIG51bVNhbXBsZXM6IG51bWJlcjtcblx0cHJpdmF0ZSBjb2xvcjogZDMuc2NhbGUuUXVhbnRpemU8c3RyaW5nPjtcblx0cHJpdmF0ZSBjYW52YXM6IGQzLlNlbGVjdGlvbjxhbnk+O1xuXHRwcml2YXRlIHN2ZzogZDMuU2VsZWN0aW9uPGFueT47XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0d2lkdGg6IG51bWJlciwgbnVtU2FtcGxlczogbnVtYmVyLCB4RG9tYWluOiBbbnVtYmVyLCBudW1iZXJdLFxuXHRcdHlEb21haW46IFtudW1iZXIsIG51bWJlcl0sIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sXG5cdFx0dXNlclNldHRpbmdzPzogSGVhdE1hcFNldHRpbmdzKSB7XG5cdFx0dGhpcy5udW1TYW1wbGVzID0gbnVtU2FtcGxlcztcblx0XHRsZXQgaGVpZ2h0ID0gd2lkdGg7XG5cdFx0bGV0IHBhZGRpbmcgPSB1c2VyU2V0dGluZ3Muc2hvd0F4ZXMgPyAyMCA6IDA7XG5cblx0XHRpZiAodXNlclNldHRpbmdzICE9IG51bGwpIHtcblx0XHRcdC8vIG92ZXJ3cml0ZSB0aGUgZGVmYXVsdHMgd2l0aCB0aGUgdXNlci1zcGVjaWZpZWQgc2V0dGluZ3MuXG5cdFx0XHRmb3IgKGxldCBwcm9wIGluIHVzZXJTZXR0aW5ncykge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzW3Byb3BdID0gdXNlclNldHRpbmdzW3Byb3BdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMueFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKHhEb21haW4pXG5cdFx0LnJhbmdlKFswLCB3aWR0aCAtIDIgKiBwYWRkaW5nXSk7XG5cblx0XHR0aGlzLnlTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0LmRvbWFpbih5RG9tYWluKVxuXHRcdC5yYW5nZShbaGVpZ2h0IC0gMiAqIHBhZGRpbmcsIDBdKTtcblxuXHRcdC8vIEdldCBhIHJhbmdlIG9mIGNvbG9ycy5cblx0XHRsZXQgdG1wU2NhbGUgPSBkMy5zY2FsZS5saW5lYXI8c3RyaW5nLCBzdHJpbmc+KClcblx0XHQuZG9tYWluKFswLCAuNSwgMV0pXG5cdFx0LnJhbmdlKFtcIiMwODc3YmRcIiwgXCIjZThlYWViXCIsIFwiI2Y1OTMyMlwiXSlcblx0XHQuY2xhbXAodHJ1ZSk7XG5cdFx0Ly8gRHVlIHRvIG51bWVyaWNhbCBlcnJvciwgd2UgbmVlZCB0byBzcGVjaWZ5XG5cdFx0Ly8gZDMucmFuZ2UoMCwgZW5kICsgc21hbGxfZXBzaWxvbiwgc3RlcClcblx0XHQvLyBpbiBvcmRlciB0byBndWFyYW50ZWUgdGhhdCB3ZSB3aWxsIGhhdmUgZW5kL3N0ZXAgZW50cmllcyB3aXRoXG5cdFx0Ly8gdGhlIGxhc3QgZWxlbWVudCBiZWluZyBlcXVhbCB0byBlbmQuXG5cdFx0bGV0IGNvbG9ycyA9IGQzLnJhbmdlKDAsIDEgKyAxRS05LCAxIC8gTlVNX1NIQURFUykubWFwKGEgPT4ge1xuXHRcdFx0cmV0dXJuIHRtcFNjYWxlKGEpO1xuXHRcdH0pO1xuXHRcdHRoaXMuY29sb3IgPSBkMy5zY2FsZS5xdWFudGl6ZTxzdHJpbmc+KClcblx0XHQuZG9tYWluKFstMSwgMV0pXG5cdFx0LnJhbmdlKGNvbG9ycyk7XG5cblx0XHRjb250YWluZXIgPSBjb250YWluZXIuYXBwZW5kKFwiZGl2XCIpXG5cdFx0LnN0eWxlKFxuXHRcdHtcblx0XHRcdHdpZHRoOiBgJHt3aWR0aH1weGAsXG5cdFx0XHRoZWlnaHQ6IGAke2hlaWdodH1weGAsXG5cdFx0XHRwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuXHRcdFx0dG9wOiBgLSR7cGFkZGluZ31weGAsXG5cdFx0XHRsZWZ0OiBgLSR7cGFkZGluZ31weGBcblx0XHR9KTtcblx0XHR0aGlzLmNhbnZhcyA9IGNvbnRhaW5lci5hcHBlbmQoXCJjYW52YXNcIilcblx0XHQuYXR0cihcIndpZHRoXCIsIG51bVNhbXBsZXMpXG5cdFx0LmF0dHIoXCJoZWlnaHRcIiwgbnVtU2FtcGxlcylcblx0XHQuc3R5bGUoXCJ3aWR0aFwiLCAod2lkdGggLSAyICogcGFkZGluZykgKyBcInB4XCIpXG5cdFx0LnN0eWxlKFwiaGVpZ2h0XCIsIChoZWlnaHQgLSAyICogcGFkZGluZykgKyBcInB4XCIpXG5cdFx0LnN0eWxlKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKVxuXHRcdC5zdHlsZShcInRvcFwiLCBgJHtwYWRkaW5nfXB4YClcblx0XHQuc3R5bGUoXCJsZWZ0XCIsIGAke3BhZGRpbmd9cHhgKTtcblxuXHRcdGlmICghdGhpcy5zZXR0aW5ncy5ub1N2Zykge1xuXHRcdFx0dGhpcy5zdmcgPSBjb250YWluZXIuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXG5cdFx0XHR7XG5cdFx0XHRcdFwid2lkdGhcIjogd2lkdGgsXG5cdFx0XHRcdFwiaGVpZ2h0XCI6IGhlaWdodFxuXHRcdFx0fSkuc3R5bGUoXG5cdFx0XHR7XG5cdFx0XHRcdC8vIE92ZXJsYXkgdGhlIHN2ZyBvbiB0b3Agb2YgdGhlIGNhbnZhcy5cblx0XHRcdFx0XCJwb3NpdGlvblwiOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdFwibGVmdFwiOiBcIjBcIixcblx0XHRcdFx0XCJ0b3BcIjogXCIwXCJcblx0XHRcdH0pLmFwcGVuZChcImdcIilcblx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHtwYWRkaW5nfSwke3BhZGRpbmd9KWApO1xuXG5cdFx0XHR0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBcInRyYWluXCIpO1xuXHRcdFx0dGhpcy5zdmcuYXBwZW5kKFwiZ1wiKS5hdHRyKFwiY2xhc3NcIiwgXCJ0ZXN0XCIpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNldHRpbmdzLnNob3dBeGVzKSB7XG5cdFx0XHRsZXQgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUodGhpcy54U2NhbGUpXG5cdFx0XHQub3JpZW50KFwiYm90dG9tXCIpO1xuXG5cdFx0XHRsZXQgeUF4aXMgPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUodGhpcy55U2NhbGUpXG5cdFx0XHQub3JpZW50KFwicmlnaHRcIik7XG5cblx0XHRcdHRoaXMuc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ4IGF4aXNcIilcblx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwke2hlaWdodCAtIDIgKiBwYWRkaW5nfSlgKVxuXHRcdFx0LmNhbGwoeEF4aXMpO1xuXG5cdFx0XHR0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0XHQuYXR0cihcImNsYXNzXCIsIFwieSBheGlzXCIpXG5cdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICh3aWR0aCAtIDIgKiBwYWRkaW5nKSArIFwiLDApXCIpXG5cdFx0XHQuY2FsbCh5QXhpcyk7XG5cdFx0fVxuXHR9XG5cblx0dXBkYXRlVGVzdFBvaW50cyhwb2ludHM6IEV4YW1wbGUyRFtdKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuc2V0dGluZ3Mubm9TdmcpIHtcblx0XHRcdHRocm93IEVycm9yKFwiQ2FuJ3QgYWRkIHBvaW50cyBzaW5jZSBub1N2Zz10cnVlXCIpO1xuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZUNpcmNsZXModGhpcy5zdmcuc2VsZWN0KFwiZy50ZXN0XCIpLCBwb2ludHMpO1xuXHR9XG5cblx0dXBkYXRlUG9pbnRzKHBvaW50czogRXhhbXBsZTJEW10pOiB2b2lkIHtcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5ub1N2Zykge1xuXHRcdFx0dGhyb3cgRXJyb3IoXCJDYW4ndCBhZGQgcG9pbnRzIHNpbmNlIG5vU3ZnPXRydWVcIik7XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlQ2lyY2xlcyh0aGlzLnN2Zy5zZWxlY3QoXCJnLnRyYWluXCIpLCBwb2ludHMpO1xuXHR9XG5cblx0dXBkYXRlQmFja2dyb3VuZChkYXRhOiBudW1iZXJbXVtdLCBkaXNjcmV0aXplOiBib29sZWFuKTogdm9pZCB7XG5cdFx0bGV0IGR4ID0gZGF0YVswXS5sZW5ndGg7XG5cdFx0bGV0IGR5ID0gZGF0YS5sZW5ndGg7XG5cblx0XHRpZiAoZHggIT09IHRoaXMubnVtU2FtcGxlcyB8fCBkeSAhPT0gdGhpcy5udW1TYW1wbGVzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFwiVGhlIHByb3ZpZGVkIGRhdGEgbWF0cml4IG11c3QgYmUgb2Ygc2l6ZSBcIiArXG5cdFx0XHRcdFwibnVtU2FtcGxlcyBYIG51bVNhbXBsZXNcIik7XG5cdFx0fVxuXG5cdFx0Ly8gQ29tcHV0ZSB0aGUgcGl4ZWwgY29sb3JzOyBzY2FsZWQgYnkgQ1NTLlxuXHRcdGxldCBjb250ZXh0ID0gKHRoaXMuY2FudmFzLm5vZGUoKSBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRcdGxldCBpbWFnZSA9IGNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKGR4LCBkeSk7XG5cblx0XHRmb3IgKGxldCB5ID0gMCwgcCA9IC0xOyB5IDwgZHk7ICsreSkge1xuXHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBkeDsgKyt4KSB7XG5cdFx0XHRcdGxldCB2YWx1ZSA9IGRhdGFbeF1beV07XG5cdFx0XHRcdGlmIChkaXNjcmV0aXplKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSAodmFsdWUgPj0gMCA/IDEgOiAtMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IGMgPSBkMy5yZ2IodGhpcy5jb2xvcih2YWx1ZSkpO1xuXHRcdFx0XHRpbWFnZS5kYXRhWysrcF0gPSBjLnI7XG5cdFx0XHRcdGltYWdlLmRhdGFbKytwXSA9IGMuZztcblx0XHRcdFx0aW1hZ2UuZGF0YVsrK3BdID0gYy5iO1xuXHRcdFx0XHRpbWFnZS5kYXRhWysrcF0gPSAxNjA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcblx0fVxuXG5cdHByaXZhdGUgdXBkYXRlQ2lyY2xlcyhjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+LCBwb2ludHM6IEV4YW1wbGUyRFtdKSB7XG5cdFx0Ly8gS2VlcCBvbmx5IHBvaW50cyB0aGF0IGFyZSBpbnNpZGUgdGhlIGJvdW5kcy5cblx0XHRsZXQgeERvbWFpbiA9IHRoaXMueFNjYWxlLmRvbWFpbigpO1xuXHRcdGxldCB5RG9tYWluID0gdGhpcy55U2NhbGUuZG9tYWluKCk7XG5cdFx0cG9pbnRzID0gcG9pbnRzLmZpbHRlcihwID0+IHtcblx0XHRcdHJldHVybiBwLnggPj0geERvbWFpblswXSAmJiBwLnggPD0geERvbWFpblsxXVxuXHRcdFx0JiYgcC55ID49IHlEb21haW5bMF0gJiYgcC55IDw9IHlEb21haW5bMV07XG5cdFx0fSk7XG5cblx0XHQvLyBBdHRhY2ggZGF0YSB0byBpbml0aWFsbHkgZW1wdHkgc2VsZWN0aW9uLlxuXHRcdGxldCBzZWxlY3Rpb24gPSBjb250YWluZXIuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEocG9pbnRzKTtcblxuXHRcdC8vIEluc2VydCBlbGVtZW50cyB0byBtYXRjaCBsZW5ndGggb2YgcG9pbnRzIGFycmF5LlxuXHRcdHNlbGVjdGlvbi5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKS5hdHRyKFwiclwiLCAzKTtcblxuXHRcdC8vIFVwZGF0ZSBwb2ludHMgdG8gYmUgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb24uXG5cdFx0c2VsZWN0aW9uXG5cdFx0LmF0dHIoXG5cdFx0e1xuXHRcdFx0Y3g6IChkOiBFeGFtcGxlMkQpID0+IHRoaXMueFNjYWxlKGQueCksXG5cdFx0XHRjeTogKGQ6IEV4YW1wbGUyRCkgPT4gdGhpcy55U2NhbGUoZC55KSxcblx0XHR9KVxuXHRcdC5zdHlsZShcImZpbGxcIiwgZCA9PiB0aGlzLmNvbG9yKGQubGFiZWwpKTtcblxuXHRcdC8vIFJlbW92ZSBwb2ludHMgaWYgdGhlIGxlbmd0aCBoYXMgZ29uZSBkb3duLlxuXHRcdHNlbGVjdGlvbi5leGl0KCkucmVtb3ZlKCk7XG5cdH1cbn0gIC8vIENsb3NlIGNsYXNzIEhlYXRNYXAuXG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VNYXRyaXgobWF0cml4OiBudW1iZXJbXVtdLCBmYWN0b3I6IG51bWJlcik6IG51bWJlcltdW10ge1xuXHRpZiAobWF0cml4Lmxlbmd0aCAhPT0gbWF0cml4WzBdLmxlbmd0aCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBwcm92aWRlZCBtYXRyaXggbXVzdCBiZSBhIHNxdWFyZSBtYXRyaXhcIik7XG5cdH1cblx0aWYgKG1hdHJpeC5sZW5ndGggJSBmYWN0b3IgIT09IDApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgd2lkdGgvaGVpZ2h0IG9mIHRoZSBtYXRyaXggbXVzdCBiZSBkaXZpc2libGUgYnkgXCIgK1xuXHRcdFwidGhlIHJlZHVjdGlvbiBmYWN0b3JcIik7XG5cdH1cblx0bGV0IHJlc3VsdDogbnVtYmVyW11bXSA9IG5ldyBBcnJheShtYXRyaXgubGVuZ3RoIC8gZmFjdG9yKTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgubGVuZ3RoOyBpICs9IGZhY3Rvcikge1xuXHRcdHJlc3VsdFtpIC8gZmFjdG9yXSA9IG5ldyBBcnJheShtYXRyaXgubGVuZ3RoIC8gZmFjdG9yKTtcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5sZW5ndGg7IGogKz0gZmFjdG9yKSB7XG5cdFx0XHRsZXQgYXZnID0gMDtcblx0XHRcdC8vIFN1bSBhbGwgdGhlIHZhbHVlcyBpbiB0aGUgbmVpZ2hib3Job29kLlxuXHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBmYWN0b3I7IGsrKykge1xuXHRcdFx0XHRmb3IgKGxldCBsID0gMDsgbCA8IGZhY3RvcjsgbCsrKSB7XG5cdFx0XHRcdFx0YXZnICs9IG1hdHJpeFtpICsga11baiArIGxdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRhdmcgLz0gKGZhY3RvciAqIGZhY3Rvcik7XG5cdFx0XHRyZXN1bHRbaSAvIGZhY3Rvcl1baiAvIGZhY3Rvcl0gPSBhdmc7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG50eXBlIERhdGFQb2ludCA9IHtcblx0eDogbnVtYmVyO1xuXHR5OiBudW1iZXJbXTtcbn07XG5cbi8qKlxuICogQSBtdWx0aS1zZXJpZXMgbGluZSBjaGFydCB0aGF0IGFsbG93cyB5b3UgdG8gYXBwZW5kIG5ldyBkYXRhIHBvaW50c1xuICogYXMgZGF0YSBiZWNvbWVzIGF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEFwcGVuZGluZ0xpbmVDaGFydCB7XG5cdHByaXZhdGUgbnVtTGluZXM6IG51bWJlcjtcblx0cHJpdmF0ZSBkYXRhOiBEYXRhUG9pbnRbXSA9IFtdO1xuXHRwcml2YXRlIHN2ZzogZDMuU2VsZWN0aW9uPGFueT47XG5cdHByaXZhdGUgeFNjYWxlOiBkMy5zY2FsZS5MaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xuXHRwcml2YXRlIHlTY2FsZTogZDMuc2NhbGUuTGluZWFyPG51bWJlciwgbnVtYmVyPjtcblx0cHJpdmF0ZSBwYXRoczogQXJyYXk8ZDMuU2VsZWN0aW9uPGFueT4+O1xuXHRwcml2YXRlIGxpbmVDb2xvcnM6IHN0cmluZ1tdO1xuXG5cdHByaXZhdGUgbWluWSA9IE51bWJlci5NQVhfVkFMVUU7XG5cdHByaXZhdGUgbWF4WSA9IE51bWJlci5NSU5fVkFMVUU7XG5cblx0Y29uc3RydWN0b3IoY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55PiwgbGluZUNvbG9yczogc3RyaW5nW10pIHtcblx0XHR0aGlzLmxpbmVDb2xvcnMgPSBsaW5lQ29sb3JzO1xuXHRcdHRoaXMubnVtTGluZXMgPSBsaW5lQ29sb3JzLmxlbmd0aDtcblx0XHRsZXQgbm9kZSA9IGNvbnRhaW5lci5ub2RlKCkgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0bGV0IHRvdGFsV2lkdGggPSBub2RlLm9mZnNldFdpZHRoO1xuXHRcdGxldCB0b3RhbEhlaWdodCA9IG5vZGUub2Zmc2V0SGVpZ2h0O1xuXHRcdGxldCBtYXJnaW4gPSB7dG9wOiAyLCByaWdodDogMCwgYm90dG9tOiAyLCBsZWZ0OiAyfTtcblx0XHRsZXQgd2lkdGggPSB0b3RhbFdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG5cdFx0bGV0IGhlaWdodCA9IHRvdGFsSGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cblx0XHR0aGlzLnhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHQuZG9tYWluKFswLCAwXSlcblx0XHRcdC5yYW5nZShbMCwgd2lkdGhdKTtcblxuXHRcdHRoaXMueVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdC5kb21haW4oWzAsIDBdKVxuXHRcdFx0LnJhbmdlKFtoZWlnaHQsIDBdKTtcblxuXHRcdHRoaXMuc3ZnID0gY29udGFpbmVyLmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxuXHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG5cdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke21hcmdpbi5sZWZ0fSwke21hcmdpbi50b3B9KWApO1xuXG5cdFx0dGhpcy5wYXRocyA9IG5ldyBBcnJheSh0aGlzLm51bUxpbmVzKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtTGluZXM7IGkrKykge1xuXHRcdFx0dGhpcy5wYXRoc1tpXSA9IHRoaXMuc3ZnLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxpbmVcIilcblx0XHRcdFx0LnN0eWxlKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFwiZmlsbFwiOiBcIm5vbmVcIixcblx0XHRcdFx0XHRcdFwic3Ryb2tlXCI6IGxpbmVDb2xvcnNbaV0sXG5cdFx0XHRcdFx0XHRcInN0cm9rZS13aWR0aFwiOiBcIjEuNXB4XCJcblx0XHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRyZXNldCgpIHtcblx0XHR0aGlzLmRhdGEgPSBbXTtcblx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdHRoaXMubWluWSA9IE51bWJlci5NQVhfVkFMVUU7XG5cdFx0dGhpcy5tYXhZID0gTnVtYmVyLk1JTl9WQUxVRTtcblx0fVxuXG5cdGFkZERhdGFQb2ludChkYXRhUG9pbnQ6IG51bWJlcltdKSB7XG5cdFx0aWYgKGRhdGFQb2ludC5sZW5ndGggIT09IHRoaXMubnVtTGluZXMpIHtcblx0XHRcdHRocm93IEVycm9yKFwiTGVuZ3RoIG9mIGRhdGFQb2ludCBtdXN0IGVxdWFsIG51bWJlciBvZiBsaW5lc1wiKTtcblx0XHR9XG5cdFx0ZGF0YVBvaW50LmZvckVhY2goeSA9PiB7XG5cdFx0XHR0aGlzLm1pblkgPSBNYXRoLm1pbih0aGlzLm1pblksIHkpO1xuXHRcdFx0dGhpcy5tYXhZID0gTWF0aC5tYXgodGhpcy5tYXhZLCB5KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuZGF0YS5wdXNoKHt4OiB0aGlzLmRhdGEubGVuZ3RoICsgMSwgeTogZGF0YVBvaW50fSk7XG5cdFx0dGhpcy5yZWRyYXcoKTtcblx0fVxuXG5cdHByaXZhdGUgcmVkcmF3KCkge1xuXHRcdC8vIEFkanVzdCB0aGUgeCBhbmQgeSBkb21haW4uXG5cdFx0dGhpcy54U2NhbGUuZG9tYWluKFsxLCB0aGlzLmRhdGEubGVuZ3RoXSk7XG5cdFx0dGhpcy55U2NhbGUuZG9tYWluKFt0aGlzLm1pblksIHRoaXMubWF4WV0pO1xuXHRcdC8vIEFkanVzdCBhbGwgdGhlIDxwYXRoPiBlbGVtZW50cyAobGluZXMpLlxuXHRcdGxldCBnZXRQYXRoTWFwID0gKGxpbmVJbmRleDogbnVtYmVyKSA9PiB7XG5cdFx0XHRyZXR1cm4gZDMuc3ZnLmxpbmU8RGF0YVBvaW50PigpXG5cdFx0XHRcdC54KGQgPT4gdGhpcy54U2NhbGUoZC54KSlcblx0XHRcdFx0LnkoZCA9PiB0aGlzLnlTY2FsZShkLnlbbGluZUluZGV4XSkpO1xuXHRcdH07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUxpbmVzOyBpKyspIHtcblx0XHRcdHRoaXMucGF0aHNbaV0uZGF0dW0odGhpcy5kYXRhKS5hdHRyKFwiZFwiLCBnZXRQYXRoTWFwKGkpKTtcblx0XHR9XG5cdH1cbn1cbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuLyoqXG4gKiBBIG5vZGUgaW4gYSBuZXVyYWwgbmV0d29yay4gRWFjaCBub2RlIGhhcyBhIHN0YXRlXG4gKiAodG90YWwgaW5wdXQsIG91dHB1dCwgYW5kIHRoZWlyIHJlc3BlY3RpdmVseSBkZXJpdmF0aXZlcykgd2hpY2ggY2hhbmdlc1xuICogYWZ0ZXIgZXZlcnkgZm9yd2FyZCBhbmQgYmFjayBwcm9wYWdhdGlvbiBydW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBOb2RlIHtcblx0aWQ6IHN0cmluZztcblx0LyoqIExpc3Qgb2YgaW5wdXQgbGlua3MuICovXG5cdGlucHV0TGlua3M6IExpbmtbXSA9IFtdO1xuXHRiaWFzID0gMC4xO1xuXHQvKiogTGlzdCBvZiBvdXRwdXQgbGlua3MuICovXG5cdG91dHB1dHM6IExpbmtbXSA9IFtdO1xuXHR0b3RhbElucHV0OiBudW1iZXI7XG5cdG91dHB1dDogbnVtYmVyO1xuXHRsYXllcjogbnVtYmVyO1xuXG5cdHRydWVMZWFybmluZ1JhdGUgPSAwO1xuXHQvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyBub2RlJ3Mgb3V0cHV0LiAqL1xuXHRvdXRwdXREZXIgPSAwO1xuXHQvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyBub2RlJ3MgdG90YWwgaW5wdXQuICovXG5cdGlucHV0RGVyID0gMDtcblx0LyoqXG5cdCAqIEFjY3VtdWxhdGVkIGVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIHRoaXMgbm9kZSdzIHRvdGFsIGlucHV0IHNpbmNlXG5cdCAqIHRoZSBsYXN0IHVwZGF0ZS4gVGhpcyBkZXJpdmF0aXZlIGVxdWFscyBkRS9kYiB3aGVyZSBiIGlzIHRoZSBub2RlJ3Ncblx0ICogYmlhcyB0ZXJtLlxuXHQgKi9cblx0YWNjSW5wdXREZXIgPSAwO1xuXHQvKipcblx0ICogTnVtYmVyIG9mIGFjY3VtdWxhdGVkIGVyci4gZGVyaXZhdGl2ZXMgd2l0aCByZXNwZWN0IHRvIHRoZSB0b3RhbCBpbnB1dFxuXHQgKiBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG5cdCAqL1xuXHRudW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuXHQvKiogQWN0aXZhdGlvbiBmdW5jdGlvbiB0aGF0IHRha2VzIHRvdGFsIGlucHV0IGFuZCByZXR1cm5zIG5vZGUncyBvdXRwdXQgKi9cblx0YWN0aXZhdGlvbjogQWN0aXZhdGlvbkZ1bmN0aW9uO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IG5vZGUgd2l0aCB0aGUgcHJvdmlkZWQgaWQgYW5kIGFjdGl2YXRpb24gZnVuY3Rpb24uXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBhY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb24sIGluaXRaZXJvPzogYm9vbGVhbikge1xuXHRcdHRoaXMuaWQgPSBpZDtcblx0XHR0aGlzLmFjdGl2YXRpb24gPSBhY3RpdmF0aW9uO1xuXHRcdGlmIChpbml0WmVybykge1xuXHRcdFx0dGhpcy5iaWFzID0gMDtcblx0XHR9XG5cdH1cblxuXHQvKiogUmVjb21wdXRlcyB0aGUgbm9kZSdzIG91dHB1dCBhbmQgcmV0dXJucyBpdC4gKi9cblx0dXBkYXRlT3V0cHV0KCk6IG51bWJlciB7XG5cdFx0Ly8gU3RvcmVzIHRvdGFsIGlucHV0IGludG8gdGhlIG5vZGUuXG5cdFx0dGhpcy50b3RhbElucHV0ID0gdGhpcy5iaWFzO1xuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRsZXQgbGluayA9IHRoaXMuaW5wdXRMaW5rc1tqXTtcblx0XHRcdHRoaXMudG90YWxJbnB1dCArPSBsaW5rLndlaWdodCAqIGxpbmsuc291cmNlLm91dHB1dDtcblx0XHR9XG5cdFx0dGhpcy5vdXRwdXQgPSB0aGlzLmFjdGl2YXRpb24ub3V0cHV0KHRoaXMudG90YWxJbnB1dCk7XG5cdFx0cmV0dXJuIHRoaXMub3V0cHV0O1xuXHR9XG59XG5cbi8qKlxuICogQW4gZXJyb3IgZnVuY3Rpb24gYW5kIGl0cyBkZXJpdmF0aXZlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yRnVuY3Rpb24ge1xuXHRlcnJvcjogKG91dHB1dDogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcikgPT4gbnVtYmVyO1xuXHRkZXI6IChvdXRwdXQ6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpID0+IG51bWJlcjtcbn1cblxuLyoqIEEgbm9kZSdzIGFjdGl2YXRpb24gZnVuY3Rpb24gYW5kIGl0cyBkZXJpdmF0aXZlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY3RpdmF0aW9uRnVuY3Rpb24ge1xuXHRvdXRwdXQ6IChpbnB1dDogbnVtYmVyKSA9PiBudW1iZXI7XG5cdGRlcjogKGlucHV0OiBudW1iZXIpID0+IG51bWJlcjtcbn1cblxuLyoqIEZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgYSBwZW5hbHR5IGNvc3QgZm9yIGEgZ2l2ZW4gd2VpZ2h0IGluIHRoZSBuZXR3b3JrLiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uIHtcblx0b3V0cHV0OiAod2VpZ2h0OiBudW1iZXIpID0+IG51bWJlcjtcblx0ZGVyOiAod2VpZ2h0OiBudW1iZXIpID0+IG51bWJlcjtcbn1cblxuLyoqIEJ1aWx0LWluIGVycm9yIGZ1bmN0aW9ucyAqL1xuZXhwb3J0IGNsYXNzIEVycm9ycyB7XG5cdHB1YmxpYyBzdGF0aWMgU1FVQVJFOiBFcnJvckZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRlcnJvcjogKG91dHB1dDogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcikgPT5cblx0XHRcdFx0MC41ICogTWF0aC5wb3cob3V0cHV0IC0gdGFyZ2V0LCAyKSxcblx0XHRcdGRlcjogKG91dHB1dDogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcikgPT4gb3V0cHV0IC0gdGFyZ2V0XG5cdFx0fTtcbn1cblxuLyoqIFBvbHlmaWxsIGZvciBUQU5IICovXG4oTWF0aCBhcyBhbnkpLnRhbmggPSAoTWF0aCBhcyBhbnkpLnRhbmggfHwgZnVuY3Rpb24gKHgpIHtcblx0aWYgKHggPT09IEluZmluaXR5KSB7XG5cdFx0cmV0dXJuIDE7XG5cdH0gZWxzZSBpZiAoeCA9PT0gLUluZmluaXR5KSB7XG5cdFx0cmV0dXJuIC0xO1xuXHR9IGVsc2Uge1xuXHRcdGxldCBlMnggPSBNYXRoLmV4cCgyICogeCk7XG5cdFx0cmV0dXJuIChlMnggLSAxKSAvIChlMnggKyAxKTtcblx0fVxufTtcblxuLyoqIEJ1aWx0LWluIGFjdGl2YXRpb24gZnVuY3Rpb25zICovXG5leHBvcnQgY2xhc3MgQWN0aXZhdGlvbnMge1xuXHRwdWJsaWMgc3RhdGljIFRBTkg6IEFjdGl2YXRpb25GdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0b3V0cHV0OiB4ID0+IChNYXRoIGFzIGFueSkudGFuaCh4KSxcblx0XHRcdGRlcjogeCA9PiB7XG5cdFx0XHRcdGxldCBvdXRwdXQgPSBBY3RpdmF0aW9ucy5UQU5ILm91dHB1dCh4KTtcblx0XHRcdFx0cmV0dXJuIDEgLSBvdXRwdXQgKiBvdXRwdXQ7XG5cdFx0XHR9XG5cdFx0fTtcblx0cHVibGljIHN0YXRpYyBSRUxVOiBBY3RpdmF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogeCA9PiBNYXRoLm1heCgwLCB4KSxcblx0XHRcdGRlcjogeCA9PiB4IDw9IDAgPyAwIDogMVxuXHRcdH07XG5cdHB1YmxpYyBzdGF0aWMgU0lHTU9JRDogQWN0aXZhdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHggPT4gMSAvICgxICsgTWF0aC5leHAoLXgpKSxcblx0XHRcdGRlcjogeCA9PiB7XG5cdFx0XHRcdGxldCBvdXRwdXQgPSBBY3RpdmF0aW9ucy5TSUdNT0lELm91dHB1dCh4KTtcblx0XHRcdFx0cmV0dXJuIG91dHB1dCAqICgxIC0gb3V0cHV0KTtcblx0XHRcdH1cblx0XHR9O1xuXHRwdWJsaWMgc3RhdGljIExJTkVBUjogQWN0aXZhdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHggPT4geCxcblx0XHRcdGRlcjogeCA9PiAxXG5cdFx0fTtcblx0cHVibGljIHN0YXRpYyBTSU5YOiBBY3RpdmF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogeCA9PiBNYXRoLnNpbih4KSxcblx0XHRcdGRlcjogeCA9PiBNYXRoLmNvcyh4KVxuXHRcdH07XG59XG5cbi8qKiBCdWlsZC1pbiByZWd1bGFyaXphdGlvbiBmdW5jdGlvbnMgKi9cbmV4cG9ydCBjbGFzcyBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uIHtcblx0cHVibGljIHN0YXRpYyBMMTogUmVndWxhcml6YXRpb25GdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0b3V0cHV0OiB3ID0+IE1hdGguYWJzKHcpLFxuXHRcdFx0ZGVyOiB3ID0+IHcgPCAwID8gLTEgOiAodyA+IDAgPyAxIDogMClcblx0XHR9O1xuXHRwdWJsaWMgc3RhdGljIEwyOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHcgPT4gMC41ICogdyAqIHcsXG5cdFx0XHRkZXI6IHcgPT4gd1xuXHRcdH07XG59XG5cbi8qKlxuICogQSBsaW5rIGluIGEgbmV1cmFsIG5ldHdvcmsuIEVhY2ggbGluayBoYXMgYSB3ZWlnaHQgYW5kIGEgc291cmNlIGFuZFxuICogZGVzdGluYXRpb24gbm9kZS4gQWxzbyBpdCBoYXMgYW4gaW50ZXJuYWwgc3RhdGUgKGVycm9yIGRlcml2YXRpdmVcbiAqIHdpdGggcmVzcGVjdCB0byBhIHBhcnRpY3VsYXIgaW5wdXQpIHdoaWNoIGdldHMgdXBkYXRlZCBhZnRlclxuICogYSBydW4gb2YgYmFjayBwcm9wYWdhdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIExpbmsge1xuXHRpZDogc3RyaW5nO1xuXHRzb3VyY2U6IE5vZGU7XG5cdGRlc3Q6IE5vZGU7XG5cdHdlaWdodCA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG5cdGlzRGVhZCA9IGZhbHNlO1xuXHQvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyB3ZWlnaHQuICovXG5cdGVycm9yRGVyID0gMDtcblx0LyoqIEFjY3VtdWxhdGVkIGVycm9yIGRlcml2YXRpdmUgc2luY2UgdGhlIGxhc3QgdXBkYXRlLiAqL1xuXHRhY2NFcnJvckRlciA9IDA7XG5cdC8qKiBOdW1iZXIgb2YgYWNjdW11bGF0ZWQgZGVyaXZhdGl2ZXMgc2luY2UgdGhlIGxhc3QgdXBkYXRlLiAqL1xuXHRudW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuXHRyZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbjtcblxuXHR0cnVlTGVhcm5pbmdSYXRlID0gMDtcblx0aXNSZXNpZHVhbDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RzIGEgbGluayBpbiB0aGUgbmV1cmFsIG5ldHdvcmsgaW5pdGlhbGl6ZWQgd2l0aCByYW5kb20gd2VpZ2h0LlxuXHQgKlxuXHQgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2Ugbm9kZS5cblx0ICogQHBhcmFtIGRlc3QgVGhlIGRlc3RpbmF0aW9uIG5vZGUuXG5cdCAqIEBwYXJhbSByZWd1bGFyaXphdGlvbiBUaGUgcmVndWxhcml6YXRpb24gZnVuY3Rpb24gdGhhdCBjb21wdXRlcyB0aGVcblx0ICogICAgIHBlbmFsdHkgZm9yIHRoaXMgd2VpZ2h0LiBJZiBudWxsLCB0aGVyZSB3aWxsIGJlIG5vIHJlZ3VsYXJpemF0aW9uLlxuXHQgKi9cblx0Y29uc3RydWN0b3Ioc291cmNlOiBOb2RlLCBkZXN0OiBOb2RlLFxuXHRcdFx0XHRyZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbiwgaW5pdFplcm8/OiBib29sZWFuKSB7XG5cdFx0dGhpcy5pZCA9IHNvdXJjZS5pZCArIFwiLVwiICsgZGVzdC5pZDtcblx0XHR0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblx0XHR0aGlzLmRlc3QgPSBkZXN0O1xuXHRcdHRoaXMucmVndWxhcml6YXRpb24gPSByZWd1bGFyaXphdGlvbjtcblx0XHRpZiAoaW5pdFplcm8pIHtcblx0XHRcdHRoaXMud2VpZ2h0ID0gMDtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBCdWlsZHMgYSBuZXVyYWwgbmV0d29yay5cbiAqXG4gKiBAcGFyYW0gbmV0d29ya1NoYXBlIFRoZSBzaGFwZSBvZiB0aGUgbmV0d29yay4gRS5nLiBbMSwgMiwgMywgMV0gbWVhbnNcbiAqICAgdGhlIG5ldHdvcmsgd2lsbCBoYXZlIG9uZSBpbnB1dCBub2RlLCAyIG5vZGVzIGluIGZpcnN0IGhpZGRlbiBsYXllcixcbiAqICAgMyBub2RlcyBpbiBzZWNvbmQgaGlkZGVuIGxheWVyIGFuZCAxIG91dHB1dCBub2RlLlxuICogQHBhcmFtIGFjdGl2YXRpb24gVGhlIGFjdGl2YXRpb24gZnVuY3Rpb24gb2YgZXZlcnkgaGlkZGVuIG5vZGUuXG4gKiBAcGFyYW0gb3V0cHV0QWN0aXZhdGlvbiBUaGUgYWN0aXZhdGlvbiBmdW5jdGlvbiBmb3IgdGhlIG91dHB1dCBub2Rlcy5cbiAqIEBwYXJhbSByZWd1bGFyaXphdGlvbiBUaGUgcmVndWxhcml6YXRpb24gZnVuY3Rpb24gdGhhdCBjb21wdXRlcyBhIHBlbmFsdHlcbiAqICAgICBmb3IgYSBnaXZlbiB3ZWlnaHQgKHBhcmFtZXRlcikgaW4gdGhlIG5ldHdvcmsuIElmIG51bGwsIHRoZXJlIHdpbGwgYmVcbiAqICAgICBubyByZWd1bGFyaXphdGlvbi5cbiAqIEBwYXJhbSBpbnB1dElkcyBMaXN0IG9mIGlkcyBmb3IgdGhlIGlucHV0IG5vZGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGROZXR3b3JrKFxuXHRuZXR3b3JrU2hhcGU6IG51bWJlcltdLCBhY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb24sXG5cdG91dHB1dEFjdGl2YXRpb246IEFjdGl2YXRpb25GdW5jdGlvbixcblx0cmVndWxhcml6YXRpb246IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24sXG5cdGlucHV0SWRzOiBzdHJpbmdbXSwgaW5pdFplcm8/OiBib29sZWFuKTogTm9kZVtdW10ge1xuXHRsZXQgbnVtTGF5ZXJzID0gbmV0d29ya1NoYXBlLmxlbmd0aDtcblx0bGV0IGlkID0gMTtcblx0LyoqIExpc3Qgb2YgbGF5ZXJzLCB3aXRoIGVhY2ggbGF5ZXIgYmVpbmcgYSBsaXN0IG9mIG5vZGVzLiAqL1xuXHRsZXQgbmV0d29yazogTm9kZVtdW10gPSBbXTtcblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAwOyBsYXllcklkeCA8IG51bUxheWVyczsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBpc091dHB1dExheWVyID0gbGF5ZXJJZHggPT09IG51bUxheWVycyAtIDE7XG5cdFx0bGV0IGlzSW5wdXRMYXllciA9IGxheWVySWR4ID09PSAwO1xuXHRcdGxldCBjdXJyZW50TGF5ZXI6IE5vZGVbXSA9IFtdO1xuXHRcdG5ldHdvcmsucHVzaChjdXJyZW50TGF5ZXIpO1xuXHRcdGxldCBudW1Ob2RlcyA9IG5ldHdvcmtTaGFwZVtsYXllcklkeF07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1Ob2RlczsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZUlkID0gaWQudG9TdHJpbmcoKTtcblx0XHRcdGlmIChpc0lucHV0TGF5ZXIpIHtcblx0XHRcdFx0bm9kZUlkID0gaW5wdXRJZHNbaV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZCsrO1xuXHRcdFx0fVxuXHRcdFx0bGV0IG5vZGUgPSBuZXcgTm9kZShub2RlSWQsIGlzT3V0cHV0TGF5ZXIgPyBvdXRwdXRBY3RpdmF0aW9uIDogYWN0aXZhdGlvbiwgaW5pdFplcm8pO1xuXHRcdFx0bm9kZS5sYXllciA9IGxheWVySWR4O1xuXHRcdFx0Y3VycmVudExheWVyLnB1c2gobm9kZSk7XG5cdFx0XHRpZiAobGF5ZXJJZHggPj0gMSkge1xuXHRcdFx0XHQvLyBBZGQgbGlua3MgZnJvbSBub2RlcyBpbiB0aGUgcHJldmlvdXMgbGF5ZXIgdG8gdGhpcyBub2RlLlxuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5ldHdvcmtbbGF5ZXJJZHggLSAxXS5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdGxldCBwcmV2Tm9kZSA9IG5ldHdvcmtbbGF5ZXJJZHggLSAxXVtqXTtcblx0XHRcdFx0XHRsZXQgbGluayA9IG5ldyBMaW5rKHByZXZOb2RlLCBub2RlLCByZWd1bGFyaXphdGlvbiwgaW5pdFplcm8pO1xuXHRcdFx0XHRcdHByZXZOb2RlLm91dHB1dHMucHVzaChsaW5rKTtcblx0XHRcdFx0XHRub2RlLmlucHV0TGlua3MucHVzaChsaW5rKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gbmV0d29yaztcbn1cblxuLyoqXG4gKiBSdW5zIGEgZm9yd2FyZCBwcm9wYWdhdGlvbiBvZiB0aGUgcHJvdmlkZWQgaW5wdXQgdGhyb3VnaCB0aGUgcHJvdmlkZWRcbiAqIG5ldHdvcmsuIFRoaXMgbWV0aG9kIG1vZGlmaWVzIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgbmV0d29yayAtIHRoZVxuICogdG90YWwgaW5wdXQgYW5kIG91dHB1dCBvZiBlYWNoIG5vZGUgaW4gdGhlIG5ldHdvcmsuXG4gKlxuICogQHBhcmFtIG5ldHdvcmsgVGhlIG5ldXJhbCBuZXR3b3JrLlxuICogQHBhcmFtIGlucHV0cyBUaGUgaW5wdXQgYXJyYXkuIEl0cyBsZW5ndGggc2hvdWxkIG1hdGNoIHRoZSBudW1iZXIgb2YgaW5wdXRcbiAqICAgICBub2RlcyBpbiB0aGUgbmV0d29yay5cbiAqIEByZXR1cm4gVGhlIGZpbmFsIG91dHB1dCBvZiB0aGUgbmV0d29yay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmRQcm9wKG5ldHdvcms6IE5vZGVbXVtdLCBpbnB1dHM6IG51bWJlcltdKTogbnVtYmVyIHtcblx0bGV0IGlucHV0TGF5ZXIgPSBuZXR3b3JrWzBdO1xuXHRpZiAoaW5wdXRzLmxlbmd0aCAhPT0gaW5wdXRMYXllci5sZW5ndGgpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgbnVtYmVyIG9mIGlucHV0cyBtdXN0IG1hdGNoIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW5cIiArXG5cdFx0XHRcIiB0aGUgaW5wdXQgbGF5ZXJcIik7XG5cdH1cblx0Ly8gVXBkYXRlIHRoZSBpbnB1dCBsYXllci5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IG5vZGUgPSBpbnB1dExheWVyW2ldO1xuXHRcdG5vZGUub3V0cHV0ID0gaW5wdXRzW2ldO1xuXHR9XG5cdGZvciAobGV0IGxheWVySWR4ID0gMTsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aDsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcblx0XHQvLyBVcGRhdGUgYWxsIHRoZSBub2RlcyBpbiB0aGlzIGxheWVyLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdG5vZGUudXBkYXRlT3V0cHV0KCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBuZXR3b3JrW25ldHdvcmsubGVuZ3RoIC0gMV1bMF0ub3V0cHV0O1xufVxuXG4vKipcbiAqIFJ1bnMgYSBiYWNrd2FyZCBwcm9wYWdhdGlvbiB1c2luZyB0aGUgcHJvdmlkZWQgdGFyZ2V0IGFuZCB0aGVcbiAqIGNvbXB1dGVkIG91dHB1dCBvZiB0aGUgcHJldmlvdXMgY2FsbCB0byBmb3J3YXJkIHByb3BhZ2F0aW9uLlxuICogVGhpcyBtZXRob2QgbW9kaWZpZXMgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBuZXR3b3JrIC0gdGhlIGVycm9yXG4gKiBkZXJpdmF0aXZlcyB3aXRoIHJlc3BlY3QgdG8gZWFjaCBub2RlLCBhbmQgZWFjaCB3ZWlnaHRcbiAqIGluIHRoZSBuZXR3b3JrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmFja1Byb3AobmV0d29yazogTm9kZVtdW10sIHRhcmdldDogbnVtYmVyLCBlcnJvckZ1bmM6IEVycm9yRnVuY3Rpb24pOiB2b2lkIHtcblx0Ly8gVGhlIG91dHB1dCBub2RlIGlzIGEgc3BlY2lhbCBjYXNlLiBXZSB1c2UgdGhlIHVzZXItZGVmaW5lZCBlcnJvclxuXHQvLyBmdW5jdGlvbiBmb3IgdGhlIGRlcml2YXRpdmUuXG5cdGxldCBvdXRwdXROb2RlID0gbmV0d29ya1tuZXR3b3JrLmxlbmd0aCAtIDFdWzBdO1xuXHRvdXRwdXROb2RlLm91dHB1dERlciA9IGVycm9yRnVuYy5kZXIob3V0cHV0Tm9kZS5vdXRwdXQsIHRhcmdldCk7XG5cblx0Ly8gR28gdGhyb3VnaCB0aGUgbGF5ZXJzIGJhY2t3YXJkcy5cblx0Zm9yIChsZXQgbGF5ZXJJZHggPSBuZXR3b3JrLmxlbmd0aCAtIDE7IGxheWVySWR4ID49IDE7IGxheWVySWR4LS0pIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Ly8gQ29tcHV0ZSB0aGUgZXJyb3IgZGVyaXZhdGl2ZSBvZiBlYWNoIG5vZGUgd2l0aCByZXNwZWN0IHRvOlxuXHRcdC8vIDEpIGl0cyB0b3RhbCBpbnB1dFxuXHRcdC8vIDIpIGVhY2ggb2YgaXRzIGlucHV0IHdlaWdodHMuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0bm9kZS5pbnB1dERlciA9IG5vZGUub3V0cHV0RGVyICogbm9kZS5hY3RpdmF0aW9uLmRlcihub2RlLnRvdGFsSW5wdXQpO1xuXHRcdFx0bm9kZS5hY2NJbnB1dERlciArPSBub2RlLmlucHV0RGVyO1xuXHRcdFx0bm9kZS5udW1BY2N1bXVsYXRlZERlcnMrKztcblx0XHR9XG5cblx0XHQvLyBFcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byBlYWNoIHdlaWdodCBjb21pbmcgaW50byB0aGUgbm9kZS5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcblx0XHRcdFx0aWYgKGxpbmsuaXNEZWFkKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGluay5lcnJvckRlciA9IG5vZGUuaW5wdXREZXIgKiBsaW5rLnNvdXJjZS5vdXRwdXQ7XG5cdFx0XHRcdGxpbmsuYWNjRXJyb3JEZXIgKz0gbGluay5lcnJvckRlcjtcblx0XHRcdFx0bGluay5udW1BY2N1bXVsYXRlZERlcnMrKztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGxheWVySWR4ID09PSAxKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0bGV0IHByZXZMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHggLSAxXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByZXZMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBwcmV2TGF5ZXJbaV07XG5cdFx0XHQvLyBDb21wdXRlIHRoZSBlcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byBlYWNoIG5vZGUncyBvdXRwdXQuXG5cdFx0XHRub2RlLm91dHB1dERlciA9IDA7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUub3V0cHV0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgb3V0cHV0ID0gbm9kZS5vdXRwdXRzW2pdO1xuXHRcdFx0XHRub2RlLm91dHB1dERlciArPSBvdXRwdXQud2VpZ2h0ICogb3V0cHV0LmRlc3QuaW5wdXREZXI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgd2VpZ2h0cyBvZiB0aGUgbmV0d29yayB1c2luZyB0aGUgcHJldmlvdXNseSBhY2N1bXVsYXRlZCBlcnJvclxuICogZGVyaXZhdGl2ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVXZWlnaHRzKG5ldHdvcms6IE5vZGVbXVtdLCBsZWFybmluZ1JhdGU6IG51bWJlciwgcmVndWxhcml6YXRpb25SYXRlOiBudW1iZXIpIHtcblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdC8vIFVwZGF0ZSB0aGUgbm9kZSdzIGJpYXMuXG5cdFx0XHRpZiAobm9kZS5udW1BY2N1bXVsYXRlZERlcnMgPiAwKSB7XG5cdFx0XHRcdG5vZGUudHJ1ZUxlYXJuaW5nUmF0ZSA9IG5vZGUuYWNjSW5wdXREZXIgLyBub2RlLm51bUFjY3VtdWxhdGVkRGVycztcblx0XHRcdFx0bm9kZS5iaWFzIC09IGxlYXJuaW5nUmF0ZSAqIG5vZGUudHJ1ZUxlYXJuaW5nUmF0ZTsgLy8gbm9kZS5hY2NJbnB1dERlciAvIG5vZGUubnVtQWNjdW11bGF0ZWREZXJzO1xuXHRcdFx0XHRub2RlLmFjY0lucHV0RGVyID0gMDtcblx0XHRcdFx0bm9kZS5udW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuXHRcdFx0fVxuXHRcdFx0Ly8gVXBkYXRlIHRoZSB3ZWlnaHRzIGNvbWluZyBpbnRvIHRoaXMgbm9kZS5cblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2pdO1xuXHRcdFx0XHRpZiAobGluay5pc0RlYWQpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgcmVndWxEZXIgPSBsaW5rLnJlZ3VsYXJpemF0aW9uID9cblx0XHRcdFx0XHRsaW5rLnJlZ3VsYXJpemF0aW9uLmRlcihsaW5rLndlaWdodCkgOiAwO1xuXHRcdFx0XHRpZiAobGluay5udW1BY2N1bXVsYXRlZERlcnMgPiAwKSB7XG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSB3ZWlnaHQgYmFzZWQgb24gZEUvZHcuXG5cdFx0XHRcdFx0bGluay50cnVlTGVhcm5pbmdSYXRlID0gbGluay5hY2NFcnJvckRlciAvIGxpbmsubnVtQWNjdW11bGF0ZWREZXJzO1xuXHRcdFx0XHRcdGxpbmsud2VpZ2h0ID0gbGluay53ZWlnaHQgLSBsZWFybmluZ1JhdGUgKiBsaW5rLnRydWVMZWFybmluZ1JhdGU7XG5cblx0XHRcdFx0XHQvLyBGdXJ0aGVyIHVwZGF0ZSB0aGUgd2VpZ2h0IGJhc2VkIG9uIHJlZ3VsYXJpemF0aW9uLlxuXHRcdFx0XHRcdGxldCBuZXdMaW5rV2VpZ2h0ID0gbGluay53ZWlnaHQgLVxuXHRcdFx0XHRcdFx0KGxlYXJuaW5nUmF0ZSAqIHJlZ3VsYXJpemF0aW9uUmF0ZSkgKiByZWd1bERlcjtcblx0XHRcdFx0XHRpZiAobGluay5yZWd1bGFyaXphdGlvbiA9PT0gUmVndWxhcml6YXRpb25GdW5jdGlvbi5MMSAmJlxuXHRcdFx0XHRcdFx0bGluay53ZWlnaHQgKiBuZXdMaW5rV2VpZ2h0IDwgMCkge1xuXHRcdFx0XHRcdFx0Ly8gVGhlIHdlaWdodCBjcm9zc2VkIDAgZHVlIHRvIHRoZSByZWd1bGFyaXphdGlvbiB0ZXJtLiBTZXQgaXQgdG8gMC5cblx0XHRcdFx0XHRcdGxpbmsud2VpZ2h0ID0gMDtcblx0XHRcdFx0XHRcdGxpbmsuaXNEZWFkID0gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGluay53ZWlnaHQgPSBuZXdMaW5rV2VpZ2h0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsaW5rLmFjY0Vycm9yRGVyID0gMDtcblx0XHRcdFx0XHRsaW5rLm51bUFjY3VtdWxhdGVkRGVycyA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuLyoqIEl0ZXJhdGVzIG92ZXIgZXZlcnkgbm9kZSBpbiB0aGUgbmV0d29yay8gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoTm9kZShuZXR3b3JrOiBOb2RlW11bXSwgaWdub3JlSW5wdXRzOiBib29sZWFuLFxuXHRcdFx0XHRcdFx0XHRhY2Nlc3NvcjogKG5vZGU6IE5vZGUpID0+IGFueSkge1xuXHRmb3IgKGxldCBsYXllcklkeCA9IGlnbm9yZUlucHV0cyA/IDEgOiAwOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdGFjY2Vzc29yKG5vZGUpO1xuXHRcdH1cblx0fVxufVxuXG4vKiogUmV0dXJucyB0aGUgb3V0cHV0IG5vZGUgaW4gdGhlIG5ldHdvcmsuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3V0cHV0Tm9kZShuZXR3b3JrOiBOb2RlW11bXSkge1xuXHRyZXR1cm4gbmV0d29ya1tuZXR3b3JrLmxlbmd0aCAtIDFdWzBdO1xufVxuIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuaW1wb3J0IHtMaW5rLCBOb2RlfSBmcm9tIFwiLi9ublwiO1xuXG5kZWNsYXJlIHZhciAkOiBhbnk7XG5cbmltcG9ydCAqIGFzIG5uIGZyb20gXCIuL25uXCI7XG5pbXBvcnQge0hlYXRNYXAsIHJlZHVjZU1hdHJpeH0gZnJvbSBcIi4vaGVhdG1hcFwiO1xuaW1wb3J0IHtcblx0U3RhdGUsXG5cdGRhdGFzZXRzLFxuXHRyZWdEYXRhc2V0cyxcblx0YWN0aXZhdGlvbnMsXG5cdHByb2JsZW1zLFxuXHRyZWd1bGFyaXphdGlvbnMsXG5cdGdldEtleUZyb21WYWx1ZSxcblx0UHJvYmxlbVxufSBmcm9tIFwiLi9zdGF0ZVwiO1xuaW1wb3J0IHtFeGFtcGxlMkQsIHNodWZmbGUsIERhdGFHZW5lcmF0b3J9IGZyb20gXCIuL2RhdGFzZXRcIjtcbmltcG9ydCB7QXBwZW5kaW5nTGluZUNoYXJ0fSBmcm9tIFwiLi9saW5lY2hhcnRcIjtcblxubGV0IG1haW5XaWR0aDtcblxudHlwZSBlbmVyZ3lUeXBlID0ge1xuXHRlVmFsOiBudW1iZXIsXG5cdGxhYmVsOiBudW1iZXJcbn07XG5cbmZ1bmN0aW9uIG10cnVuYyh2OiBudW1iZXIpIHtcblx0diA9ICt2O1xuXHRyZXR1cm4gKHYgLSB2ICUgMSkgfHwgKCFpc0Zpbml0ZSh2KSB8fCB2ID09PSAwID8gdiA6IHYgPCAwID8gLTAgOiAwKTtcbn1cblxuZnVuY3Rpb24gbG9nMih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZygyKTtcbn1cblxuZnVuY3Rpb24gbG9nMTAoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coMTApO1xufVxuXG5mdW5jdGlvbiBzaWduYWxPZih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gbG9nMigxICsgTWF0aC5hYnMoeCkpO1xufVxuXG5mdW5jdGlvbiBTTlIoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIDEwICogbG9nMTAoeCk7XG59XG5cbi8vIE1vcmUgc2Nyb2xsaW5nXG5kMy5zZWxlY3QoXCIubW9yZSBidXR0b25cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdGxldCBwb3NpdGlvbiA9IDgwMDtcblx0ZDMudHJhbnNpdGlvbigpXG5cdFx0LmR1cmF0aW9uKDEwMDApXG5cdFx0LnR3ZWVuKFwic2Nyb2xsXCIsIHNjcm9sbFR3ZWVuKHBvc2l0aW9uKSk7XG59KTtcblxuZnVuY3Rpb24gc2Nyb2xsVHdlZW4ob2Zmc2V0KSB7XG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IGkgPSBkMy5pbnRlcnBvbGF0ZU51bWJlcih3aW5kb3cucGFnZVlPZmZzZXQgfHxcblx0XHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsIG9mZnNldCk7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRzY3JvbGxUbygwLCBpKHQpKTtcblx0XHR9O1xuXHR9O1xufVxuXG5jb25zdCBSRUNUX1NJWkUgPSAzMDtcbmNvbnN0IEJJQVNfU0laRSA9IDU7XG5jb25zdCBOVU1fU0FNUExFU19DTEFTU0lGWSA9IDUwMDtcbmNvbnN0IE5VTV9TQU1QTEVTX1JFR1JFU1MgPSAxMjAwO1xuY29uc3QgREVOU0lUWSA9IDEwMDtcblxuY29uc3QgTUFYX05FVVJPTlMgPSAzMjtcbmNvbnN0IE1BWF9ITEFZRVJTID0gMTA7XG5cbi8vIFJvdW5kaW5nIG9mZiBvZiB0cmFpbmluZyBkYXRhLiBVc2VkIGJ5IGdldFJlcUNhcGFjaXR5XG5jb25zdCBSRVFfQ0FQX1JPVU5ESU5HID0gLTE7XG5cbmVudW0gSG92ZXJUeXBlIHtcblx0QklBUywgV0VJR0hUXG59XG5cbmludGVyZmFjZSBJbnB1dEZlYXR1cmUge1xuXHRmOiAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IG51bWJlcjtcblx0bGFiZWw/OiBzdHJpbmc7XG59XG5cbmxldCBJTlBVVFM6IHsgW25hbWU6IHN0cmluZ106IElucHV0RmVhdHVyZSB9ID0ge1xuXHRcInhcIjoge2Y6ICh4LCB5KSA9PiB4LCBsYWJlbDogXCJYXzFcIn0sXG5cdFwieVwiOiB7ZjogKHgsIHkpID0+IHksIGxhYmVsOiBcIlhfMlwifSxcblx0XCJ4U3F1YXJlZFwiOiB7ZjogKHgsIHkpID0+IHggKiB4LCBsYWJlbDogXCJYXzFeMlwifSxcblx0XCJ5U3F1YXJlZFwiOiB7ZjogKHgsIHkpID0+IHkgKiB5LCBsYWJlbDogXCJYXzJeMlwifSxcblx0XCJ4VGltZXNZXCI6IHtmOiAoeCwgeSkgPT4geCAqIHksIGxhYmVsOiBcIlhfMVhfMlwifSxcblx0XCJzaW5YXCI6IHtmOiAoeCwgeSkgPT4gTWF0aC5zaW4oeCksIGxhYmVsOiBcInNpbihYXzEpXCJ9LFxuXHRcInNpbllcIjoge2Y6ICh4LCB5KSA9PiBNYXRoLnNpbih5KSwgbGFiZWw6IFwic2luKFhfMilcIn0sXG59O1xuXG5sZXQgSElEQUJMRV9DT05UUk9MUyA9XG5cdFtcblx0XHRbXCJTaG93IHRlc3QgZGF0YVwiLCBcInNob3dUZXN0RGF0YVwiXSxcblx0XHRbXCJEaXNjcmV0aXplIG91dHB1dFwiLCBcImRpc2NyZXRpemVcIl0sXG5cdFx0W1wiUGxheSBidXR0b25cIiwgXCJwbGF5QnV0dG9uXCJdLFxuXHRcdFtcIlN0ZXAgYnV0dG9uXCIsIFwic3RlcEJ1dHRvblwiXSxcblx0XHRbXCJSZXNldCBidXR0b25cIiwgXCJyZXNldEJ1dHRvblwiXSxcblx0XHRbXCJSYXRlIHNjYWxlIGZhY3RvclwiLCBcImxlYXJuaW5nUmF0ZVwiXSxcblx0XHRbXCJMZWFybmluZyByYXRlXCIsIFwidHJ1ZUxlYXJuaW5nUmF0ZVwiXSxcblx0XHRbXCJBY3RpdmF0aW9uXCIsIFwiYWN0aXZhdGlvblwiXSxcblx0XHRbXCJSZWd1bGFyaXphdGlvblwiLCBcInJlZ3VsYXJpemF0aW9uXCJdLFxuXHRcdFtcIlJlZ3VsYXJpemF0aW9uIHJhdGVcIiwgXCJyZWd1bGFyaXphdGlvblJhdGVcIl0sXG5cdFx0W1wiUHJvYmxlbSB0eXBlXCIsIFwicHJvYmxlbVwiXSxcblx0XHRbXCJXaGljaCBkYXRhc2V0XCIsIFwiZGF0YXNldFwiXSxcblx0XHRbXCJSYXRpbyB0cmFpbiBkYXRhXCIsIFwicGVyY1RyYWluRGF0YVwiXSxcblx0XHRbXCJOb2lzZSBsZXZlbFwiLCBcIm5vaXNlXCJdLFxuXHRcdFtcIkJhdGNoIHNpemVcIiwgXCJiYXRjaFNpemVcIl0sXG5cdFx0W1wiIyBvZiBoaWRkZW4gbGF5ZXJzXCIsIFwibnVtSGlkZGVuTGF5ZXJzXCJdLFxuXHRdO1xuXG5jbGFzcyBQbGF5ZXIge1xuXHRwcml2YXRlIHRpbWVySW5kZXggPSAwO1xuXHRwcml2YXRlIGlzUGxheWluZyA9IGZhbHNlO1xuXHRwcml2YXRlIGNhbGxiYWNrOiAoaXNQbGF5aW5nOiBib29sZWFuKSA9PiB2b2lkID0gbnVsbDtcblxuXHQvKiogUGxheXMvcGF1c2VzIHRoZSBwbGF5ZXIuICovXG5cdHBsYXlPclBhdXNlKCkge1xuXHRcdGlmICh0aGlzLmlzUGxheWluZykge1xuXHRcdFx0dGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcblx0XHRcdHRoaXMucGF1c2UoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5pc1BsYXlpbmcgPSB0cnVlO1xuXHRcdFx0aWYgKGl0ZXIgPT09IDApIHtcblx0XHRcdFx0c2ltdWxhdGlvblN0YXJ0ZWQoKTtcblx0XHRcdH1cblx0XHRcdHRoaXMucGxheSgpO1xuXHRcdH1cblx0fVxuXG5cdG9uUGxheVBhdXNlKGNhbGxiYWNrOiAoaXNQbGF5aW5nOiBib29sZWFuKSA9PiB2b2lkKSB7XG5cdFx0dGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuXHR9XG5cblx0cGxheSgpIHtcblx0XHR0aGlzLnBhdXNlKCk7XG5cdFx0dGhpcy5pc1BsYXlpbmcgPSB0cnVlO1xuXHRcdGlmICh0aGlzLmNhbGxiYWNrKSB7XG5cdFx0XHR0aGlzLmNhbGxiYWNrKHRoaXMuaXNQbGF5aW5nKTtcblx0XHR9XG5cdFx0dGhpcy5zdGFydCh0aGlzLnRpbWVySW5kZXgpO1xuXHR9XG5cblx0cGF1c2UoKSB7XG5cdFx0dGhpcy50aW1lckluZGV4Kys7XG5cdFx0dGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcblx0XHRpZiAodGhpcy5jYWxsYmFjaykge1xuXHRcdFx0dGhpcy5jYWxsYmFjayh0aGlzLmlzUGxheWluZyk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdGFydChsb2NhbFRpbWVySW5kZXg6IG51bWJlcikge1xuXHRcdGQzLnRpbWVyKCgpID0+IHtcblx0XHRcdGlmIChsb2NhbFRpbWVySW5kZXggPCB0aGlzLnRpbWVySW5kZXgpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7ICAvLyBEb25lLlxuXHRcdFx0fVxuXHRcdFx0b25lU3RlcCgpO1xuXHRcdFx0cmV0dXJuIGZhbHNlOyAgLy8gTm90IGRvbmUuXG5cdFx0fSwgMCk7XG5cdH1cbn1cblxubGV0IHN0YXRlID0gU3RhdGUuZGVzZXJpYWxpemVTdGF0ZSgpO1xuXG4vLyBGaWx0ZXIgb3V0IGlucHV0cyB0aGF0IGFyZSBoaWRkZW4uXG5zdGF0ZS5nZXRIaWRkZW5Qcm9wcygpLmZvckVhY2gocHJvcCA9PiB7XG5cdGlmIChwcm9wIGluIElOUFVUUykge1xuXHRcdGRlbGV0ZSBJTlBVVFNbcHJvcF07XG5cdH1cbn0pO1xuXG5sZXQgYm91bmRhcnk6IHsgW2lkOiBzdHJpbmddOiBudW1iZXJbXVtdIH0gPSB7fTtcbmxldCBzZWxlY3RlZE5vZGVJZDogc3RyaW5nID0gbnVsbDtcbi8vIFBsb3QgdGhlIGhlYXRtYXAuXG5sZXQgeERvbWFpbjogW251bWJlciwgbnVtYmVyXSA9IFstNiwgNl07XG5sZXQgaGVhdE1hcCA9XG5cdG5ldyBIZWF0TWFwKDMwMCwgREVOU0lUWSwgeERvbWFpbiwgeERvbWFpbiwgZDMuc2VsZWN0KFwiI2hlYXRtYXBcIiksXG5cdFx0e3Nob3dBeGVzOiB0cnVlfSk7XG5sZXQgbGlua1dpZHRoU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHQuZG9tYWluKFswLCA1XSlcblx0LnJhbmdlKFsxLCAxMF0pXG5cdC5jbGFtcCh0cnVlKTtcbmxldCBjb2xvclNjYWxlID0gZDMuc2NhbGUubGluZWFyPHN0cmluZz4oKVxuXHQuZG9tYWluKFstMSwgMCwgMV0pXG5cdC5yYW5nZShbXCIjMDg3N2JkXCIsIFwiI2U4ZWFlYlwiLCBcIiNmNTkzMjJcIl0pXG5cdC5jbGFtcCh0cnVlKTtcbmxldCBpdGVyID0gMDtcbmxldCB0cmFpbkRhdGE6IEV4YW1wbGUyRFtdID0gW107XG5sZXQgdGVzdERhdGE6IEV4YW1wbGUyRFtdID0gW107XG5sZXQgbmV0d29yazogbm4uTm9kZVtdW10gPSBudWxsO1xubGV0IGxvc3NUcmFpbiA9IDA7XG5sZXQgbG9zc1Rlc3QgPSAwO1xubGV0IHRydWVMZWFybmluZ1JhdGUgPSAwO1xubGV0IHRvdGFsQ2FwYWNpdHkgPSAwO1xubGV0IGdlbmVyYWxpemF0aW9uID0gMDtcbmxldCB0cmFpbkNsYXNzZXNBY2N1cmFjeSA9IFtdO1xubGV0IHRlc3RDbGFzc2VzQWNjdXJhY3kgPSBbXTtcbmxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG5sZXQgbGluZUNoYXJ0ID0gbmV3IEFwcGVuZGluZ0xpbmVDaGFydChkMy5zZWxlY3QoXCIjbGluZWNoYXJ0XCIpLFxuXHRbXCIjNzc3XCIsIFwiYmxhY2tcIl0pO1xuXG5sZXQgbWFya2VkTm9kZTogbm4uTm9kZSA9IG51bGw7XG5sZXQgbWFya2VkRGl2ID0gbnVsbDtcblxuZnVuY3Rpb24gZ2V0UmVxQ2FwYWNpdHkocG9pbnRzOiBFeGFtcGxlMkRbXSk6IG51bWJlcltdIHtcblxuXHRsZXQgcm91bmRpbmcgPSBSRVFfQ0FQX1JPVU5ESU5HO1xuXHRsZXQgZW5lcmd5OiBlbmVyZ3lUeXBlW10gPSBbXTtcblx0bGV0IG51bVJvd3M6IG51bWJlciA9IHBvaW50cy5sZW5ndGg7XG5cdGxldCBudW1Db2xzOiBudW1iZXIgPSAyO1xuXHRsZXQgcmVzdWx0OiBudW1iZXIgPSAwO1xuXHRsZXQgcmV0dmFsOiBudW1iZXJbXSA9IFtdO1xuXHRsZXQgY2xhc3MxID0gLTY2Njtcblx0bGV0IG51bWNsYXNzMTogbnVtYmVyID0gMDtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1Sb3dzOyBpKyspIHtcblx0XHRsZXQgcmVzdWx0ID0gMDsgLy8geSwgeFNxdWFyZWQsIHlTcXVhcmVkLCB4VGltZXNZLCBzaW5YLCBzaW5ZLFxuXHRcdGlmIChuZXR3b3JrICYmIG5ldHdvcmtbMF0ubGVuZ3RoKSB7XG5cdFx0XHRuZXR3b3JrWzBdLmZvckVhY2goKG5vZGU6IE5vZGUpID0+IHtcblx0XHRcdFx0cmVzdWx0ICs9IElOUFVUU1tub2RlLmlkXS5mKHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSk7XG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gW0luZmluaXR5LCBJbmZpbml0eV07XG5cdFx0fVxuXHRcdGlmIChyb3VuZGluZyAhPSAtMSkge1xuXHRcdFx0cmVzdWx0ID0gbXRydW5jKHJlc3VsdCAqIE1hdGgucG93KDEwLCByb3VuZGluZykpIC8gTWF0aC5wb3coMTAsIHJvdW5kaW5nKTtcblx0XHR9XG5cdFx0bGV0IGVWYWw6IG51bWJlciA9IHJlc3VsdDtcblx0XHRsZXQgbGFiZWw6IG51bWJlciA9IHBvaW50c1tpXS5sYWJlbDtcblx0XHRlbmVyZ3kucHVzaCh7ZVZhbCwgbGFiZWx9KTtcblx0XHRpZiAoY2xhc3MxID09IC02NjYpIHtcblx0XHRcdGNsYXNzMSA9IGxhYmVsO1xuXHRcdH1cblx0XHRpZiAobGFiZWwgPT0gY2xhc3MxKSB7XG5cdFx0XHRudW1jbGFzczErKztcblx0XHR9XG5cdH1cblxuXG5cdGVuZXJneS5zb3J0KFxuXHRcdGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0XHRyZXR1cm4gYS5lVmFsIC0gYi5lVmFsO1xuXHRcdH1cblx0KTtcblxuXHRsZXQgY3VyTGFiZWwgPSBlbmVyZ3lbMF0ubGFiZWw7XG5cdGxldCBjaGFuZ2VzID0gMDtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGVuZXJneS5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChlbmVyZ3lbaV0ubGFiZWwgIT0gY3VyTGFiZWwpIHtcblx0XHRcdGNoYW5nZXMrKztcblx0XHRcdGN1ckxhYmVsID0gZW5lcmd5W2ldLmxhYmVsO1xuXHRcdH1cblx0fVxuXG5cdGxldCBjbHVzdGVyczogbnVtYmVyID0gMDtcblx0Y2x1c3RlcnMgPSBjaGFuZ2VzICsgMTtcblxuXHRsZXQgbWluY3V0czogbnVtYmVyID0gMDtcblx0bWluY3V0cyA9IE1hdGguY2VpbChsb2cyKGNsdXN0ZXJzKSk7XG5cblx0bGV0IHN1Z0NhcGFjaXR5ID0gbWluY3V0cyAqIG51bUNvbHM7XG5cdGxldCBtYXhDYXBhY2l0eSA9IGNoYW5nZXMgKiAobnVtQ29scyArIDEpICsgY2hhbmdlcztcblxuXHRyZXR2YWwucHVzaChzdWdDYXBhY2l0eSk7XG5cdHJldHZhbC5wdXNoKG1heENhcGFjaXR5KTtcblxuXG5cdHJldHVybiByZXR2YWw7XG59XG5cblxuZnVuY3Rpb24gbnVtYmVyT2ZVbmlxdWUoZGF0YXNldDogRXhhbXBsZTJEW10pIHtcblx0bGV0IGNvdW50OiBudW1iZXIgPSAwO1xuXHRsZXQgdW5pcXVlRGljdDogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xuXHRkYXRhc2V0LmZvckVhY2gocG9pbnQgPT4ge1xuXHRcdGxldCBrZXk6IHN0cmluZyA9IFwiXCIgKyBwb2ludC54ICsgcG9pbnQueSArIHBvaW50LmxhYmVsO1xuXHRcdGlmICghKGtleSBpbiB1bmlxdWVEaWN0KSkge1xuXHRcdFx0Y291bnQgKz0gMTtcblx0XHRcdHVuaXF1ZURpY3Rba2V5XSA9IDE7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGNvdW50O1xufVxuXG4vKipcbiAqIFNjYWxpbmcgdGhlIHBvaW50cyBpbiB7cG9pbnRzfSBnaXZlbiBhIHJhbmdlIHtyYW5nZX1cbiAqL1xuZnVuY3Rpb24gbWluTWF4U2NhbGVQb2ludHMocG9pbnRzOiBFeGFtcGxlMkRbXSwgcmFuZ2U6IFtudW1iZXIsIG51bWJlcl0pIHtcblx0bGV0IHBvaW50c194ID0gcG9pbnRzLm1hcChwID0+IHAueCk7XG5cdGxldCBwb2ludHNfeSA9IHBvaW50cy5tYXAocCA9PiBwLnkpO1xuXHRsZXQgeF9taW4gPSBNYXRoLm1pbiguLi5wb2ludHNfeCk7XG5cdGxldCB4X21heCA9IE1hdGgubWF4KC4uLnBvaW50c194KTtcblx0bGV0IHlfbWluID0gTWF0aC5taW4oLi4ucG9pbnRzX3kpO1xuXHRsZXQgeV9tYXggPSBNYXRoLm1heCguLi5wb2ludHNfeSk7XG5cdHBvaW50cy5mb3JFYWNoKHAgPT4ge1xuXHRcdHAueCA9ICgocC54IC0geF9taW4pIC8gKHhfbWF4IC0geF9taW4pKSAqIChyYW5nZVsxXSAtIHJhbmdlWzBdKSArIHJhbmdlWzBdO1xuXHRcdHAueSA9ICgocC55IC0geV9taW4pIC8gKHlfbWF4IC0geV9taW4pKSAqIChyYW5nZVsxXSAtIHJhbmdlWzBdKSArIHJhbmdlWzBdO1xuXHR9KTtcblx0cmV0dXJuIHBvaW50cztcbn1cblxuZnVuY3Rpb24gbWFrZUdVSSgpIHtcblx0Ly8gVG9vbGJveGVzXG5cdCQoZnVuY3Rpb24gKCkge1xuXHRcdCQoXCJbZGF0YS10b2dnbGU9J3BvcG92ZXInXVwiKS5wb3BvdmVyKHtcblx0XHRcdGNvbnRhaW5lcjogXCJib2R5XCJcblx0XHR9KTtcblx0fSk7XG5cdCQoXCIucG9wb3Zlci1kaXNtaXNzXCIpLnBvcG92ZXIoe1xuXHRcdHRyaWdnZXI6IFwiZm9jdXNcIlxuXHR9KTtcblxuXHQvLyBBZGRpbmcgbGlua3MgYmV0d2VlbiBub2Rlc1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09IDE2KSB7XG5cdFx0XHRzdGF0ZS5zaGlmdERvd24gPSBmYWxzZTtcblx0XHRcdGlmIChtYXJrZWREaXYgIT0gbnVsbCkge1xuXHRcdFx0XHRtYXJrZWREaXYuc3R5bGUoe1xuXHRcdFx0XHRcdFwiYm9yZGVyLXdpZHRoXCI6IFwiMHB4XCJcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRtYXJrZWREaXYgPSBudWxsO1xuXHRcdFx0bWFya2VkTm9kZSA9IG51bGw7XG5cdFx0fVxuXHR9KTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09IDE2KSB7XG5cdFx0XHRzdGF0ZS5zaGlmdERvd24gPSB0cnVlO1xuXHRcdH1cblx0fSk7XG5cblxuXHRkMy5zZWxlY3QoXCIjcmVzZXQtYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdHJlc2V0KCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRkMy5zZWxlY3QoXCIjcGxheS1wYXVzZS1idXR0b25cIik7XG5cdH0pO1xuXG5cdGQzLnNlbGVjdChcIiNwbGF5LXBhdXNlLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHQvLyBDaGFuZ2UgdGhlIGJ1dHRvbidzIGNvbnRlbnQuXG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRwbGF5ZXIucGxheU9yUGF1c2UoKTtcblx0fSk7XG5cblx0cGxheWVyLm9uUGxheVBhdXNlKGlzUGxheWluZyA9PiB7XG5cdFx0ZDMuc2VsZWN0KFwiI3BsYXktcGF1c2UtYnV0dG9uXCIpLmNsYXNzZWQoXCJwbGF5aW5nXCIsIGlzUGxheWluZyk7XG5cdH0pO1xuXG5cdGQzLnNlbGVjdChcIiNuZXh0LXN0ZXAtYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdHBsYXllci5wYXVzZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0aWYgKGl0ZXIgPT09IDApIHtcblx0XHRcdHNpbXVsYXRpb25TdGFydGVkKCk7XG5cdFx0fVxuXHRcdG9uZVN0ZXAoKTtcblx0fSk7XG5cblx0ZDMuc2VsZWN0KFwiI2RhdGEtcmVnZW4tYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGdlbmVyYXRlRGF0YSgpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0fSk7XG5cblx0bGV0IGRhdGFUaHVtYm5haWxzID0gZDMuc2VsZWN0QWxsKFwiY2FudmFzW2RhdGEtZGF0YXNldF1cIik7XG5cdGRhdGFUaHVtYm5haWxzLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCBuZXdEYXRhc2V0ID0gZGF0YXNldHNbdGhpcy5kYXRhc2V0LmRhdGFzZXRdO1xuXHRcdGxldCBkYXRhc2V0S2V5ID0gZ2V0S2V5RnJvbVZhbHVlKGRhdGFzZXRzLCBuZXdEYXRhc2V0KTtcblxuXHRcdGlmIChuZXdEYXRhc2V0ID09PSBzdGF0ZS5kYXRhc2V0ICYmIGRhdGFzZXRLZXkgIT0gXCJieW9kXCIpIHtcblx0XHRcdHJldHVybjsgLy8gTm8tb3AuXG5cdFx0fVxuXG5cdFx0c3RhdGUuZGF0YXNldCA9IG5ld0RhdGFzZXQ7XG5cblxuXHRcdGlmIChkYXRhc2V0S2V5ID09PSBcImJ5b2RcIikge1xuXG5cdFx0XHRzdGF0ZS5ieW9kID0gdHJ1ZTtcblx0XHRcdGQzLnNlbGVjdChcIiNpbnB1dEZvcm1CWU9EXCIpLmh0bWwoXCI8aW5wdXQgdHlwZT0nZmlsZScgYWNjZXB0PScuY3N2JyBpZD0naW5wdXRGaWxlQllPRCc+XCIpO1xuXHRcdFx0ZGF0YVRodW1ibmFpbHMuY2xhc3NlZChcInNlbGVjdGVkXCIsIGZhbHNlKTtcblx0XHRcdGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cdFx0XHQkKFwiI2lucHV0RmlsZUJZT0RcIikuY2xpY2soKTtcblxuXHRcdFx0Ly8gZDMuc2VsZWN0KFwiI25vaXNlXCIpLnZhbHVlKHN0YXRlLm5vaXNlKTtcblx0XHRcdC8vIH4gJChcIiNub2lzZVwiKS5zbGlkZXIoXCJkaXNhYmxlXCIpO1xuXG5cdFx0XHRsZXQgaW5wdXRCWU9EID0gZDMuc2VsZWN0KFwiI2lucHV0RmlsZUJZT0RcIik7XG5cdFx0XHRpbnB1dEJZT0Qub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0XHRsZXQgbmFtZSA9IHRoaXMuZmlsZXNbMF0ubmFtZTtcblx0XHRcdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRcdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdFx0XHRcdFx0bGV0IHRhcmdldDogYW55ID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0XHRcdGxldCBkYXRhID0gdGFyZ2V0LnJlc3VsdDtcblx0XHRcdFx0XHRsZXQgcyA9IGRhdGEuc3BsaXQoXCJcXG5cIik7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRsZXQgc3MgPSBzW2ldLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHRcdGlmIChzcy5sZW5ndGggIT0gMykgYnJlYWs7XG5cdFx0XHRcdFx0XHRsZXQgeCA9IHBhcnNlRmxvYXQoc3NbMF0pO1xuXHRcdFx0XHRcdFx0bGV0IHkgPSBwYXJzZUZsb2F0KHNzWzFdKTtcblx0XHRcdFx0XHRcdGxldCBsYWJlbCA9IHBhcnNlSW50KHNzWzJdKTtcblx0XHRcdFx0XHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwb2ludHMgPSBtaW5NYXhTY2FsZVBvaW50cyhwb2ludHMsIFstNiwgNl0pO1xuXHRcdFx0XHRcdHNodWZmbGUocG9pbnRzKTtcblx0XHRcdFx0XHQvLyBTcGxpdCBpbnRvIHRyYWluIGFuZCB0ZXN0IGRhdGEuXG5cdFx0XHRcdFx0bGV0IHNwbGl0SW5kZXggPSBNYXRoLmZsb29yKHBvaW50cy5sZW5ndGggKiBzdGF0ZS5wZXJjVHJhaW5EYXRhIC8gMTAwKTtcblx0XHRcdFx0XHR0cmFpbkRhdGEgPSBwb2ludHMuc2xpY2UoMCwgc3BsaXRJbmRleCk7XG5cdFx0XHRcdFx0dGVzdERhdGEgPSBwb2ludHMuc2xpY2Uoc3BsaXRJbmRleCk7XG5cblx0XHRcdFx0XHRoZWF0TWFwLnVwZGF0ZVBvaW50cyh0cmFpbkRhdGEpO1xuXHRcdFx0XHRcdGhlYXRNYXAudXBkYXRlVGVzdFBvaW50cyhzdGF0ZS5zaG93VGVzdERhdGEgPyB0ZXN0RGF0YSA6IFtdKTtcblxuXHRcdFx0XHRcdGxldCBjbGFzc0Rpc3QgPSBnZXROdW1iZXJPZkVhY2hDbGFzcyh0cmFpbkRhdGEpLm1hcCgobnVtKSA9PiBudW0gLyB0cmFpbkRhdGEubGVuZ3RoKTtcblx0XHRcdFx0XHRzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMF07XG5cdFx0XHRcdFx0c3RhdGUubWF4Q2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzFdO1xuXG5cdFx0XHRcdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0XHRcdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRcdFx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblx0XHRcdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFEaXN0cmlidXRpb24nXSAudmFsdWVcIilcblx0XHRcdFx0XHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblx0XHRcdFx0XHQvLy8vLy8vLy8vLy8vLy8vLy9cblx0XHRcdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0cmVzZXQoKTtcblxuXHRcdFx0XHRcdC8vIERyYXdpbmcgdGh1bWJuYWlsXG5cdFx0XHRcdFx0bGV0IGNhbnZhczogYW55ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2FudmFzW2RhdGEtZGF0YXNldD1ieW9kXWApO1xuXHRcdFx0XHRcdHJlbmRlclRodW1ibmFpbChjYW52YXMsIChudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpID0+IHBvaW50cyk7XG5cblxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHJlYWRlci5yZWFkQXNUZXh0KHRoaXMuZmlsZXNbMF0pO1xuXHRcdFx0fSk7XG5cblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdGF0ZS5ieW9kID0gZmFsc2U7XG5cdFx0XHQvLyB+IGQzLnNlbGVjdChcIiNpbnB1dEZvcm1CWU9EXCIpLmh0bWwoXCJcIik7XG5cdFx0XHQvLyAkKFwiI25vaXNlXCIpLmRpc2FibGVkID0gZmFsc2U7XG5cblx0XHRcdGRhdGFUaHVtYm5haWxzLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG5cdFx0XHRkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xuXHRcdFx0c3RhdGUubm9pc2UgPSAzNTsgLy8gU05SZEJcblxuXG5cdFx0XHRnZW5lcmF0ZURhdGEoKTtcblxuXHRcdFx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdHJhaW5EYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHBvaW50cy5wdXNoKHRyYWluRGF0YVtpXSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRlc3REYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHBvaW50cy5wdXNoKHRlc3REYXRhW2ldKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNsYXNzRGlzdCA9IGdldE51bWJlck9mRWFjaENsYXNzKHRyYWluRGF0YSkubWFwKChudW0pID0+IG51bSAvIHRyYWluRGF0YS5sZW5ndGgpO1xuXHRcdFx0c3RhdGUuc3VnQ2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzBdO1xuXHRcdFx0c3RhdGUubWF4Q2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzFdO1xuXG5cdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRcdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YURpc3RyaWJ1dGlvbiddIC52YWx1ZVwiKVxuXHRcdFx0XHQudGV4dChgJHtjbGFzc0Rpc3RbMF0udG9GaXhlZCgzKX0sICR7Y2xhc3NEaXN0WzFdLnRvRml4ZWQoMyl9YCk7XG5cblx0XHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblxuXHRcdFx0Ly8gUmVzZXR0aW5nIHRoZSBCWU9EIHRodW1ibmFpbFxuXHRcdFx0bGV0IGNhbnZhczogYW55ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2FudmFzW2RhdGEtZGF0YXNldD1ieW9kXWApO1xuXHRcdFx0cmVuZGVyQllPRFRodW1ibmFpbChjYW52YXMpO1xuXHRcdFx0cmVzZXQoKTtcblx0XHR9XG5cblx0fSk7XG5cblx0bGV0IGRhdGFzZXRLZXkgPSBnZXRLZXlGcm9tVmFsdWUoZGF0YXNldHMsIHN0YXRlLmRhdGFzZXQpO1xuXHQvLyBTZWxlY3QgdGhlIGRhdGFzZXQgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxuXHRkMy5zZWxlY3QoYGNhbnZhc1tkYXRhLWRhdGFzZXQ9JHtkYXRhc2V0S2V5fV1gKVxuXHRcdC5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cblx0bGV0IHJlZ0RhdGFUaHVtYm5haWxzID0gZDMuc2VsZWN0QWxsKFwiY2FudmFzW2RhdGEtcmVnRGF0YXNldF1cIik7XG5cdHJlZ0RhdGFUaHVtYm5haWxzLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCBuZXdEYXRhc2V0ID0gcmVnRGF0YXNldHNbdGhpcy5kYXRhc2V0LnJlZ2RhdGFzZXRdO1xuXHRcdGlmIChuZXdEYXRhc2V0ID09PSBzdGF0ZS5yZWdEYXRhc2V0KSB7XG5cdFx0XHRyZXR1cm47IC8vIE5vLW9wLlxuXHRcdH1cblx0XHRzdGF0ZS5yZWdEYXRhc2V0ID0gbmV3RGF0YXNldDtcblx0XHRzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMF07XG5cdFx0c3RhdGUubWF4Q2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzFdO1xuXHRcdHJlZ0RhdGFUaHVtYm5haWxzLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG5cdFx0ZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0bGV0IHJlZ0RhdGFzZXRLZXkgPSBnZXRLZXlGcm9tVmFsdWUocmVnRGF0YXNldHMsIHN0YXRlLnJlZ0RhdGFzZXQpO1xuXHQvLyBTZWxlY3QgdGhlIGRhdGFzZXQgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxuXHRkMy5zZWxlY3QoYGNhbnZhc1tkYXRhLXJlZ0RhdGFzZXQ9JHtyZWdEYXRhc2V0S2V5fV1gKVxuXHRcdC5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cblxuXHRkMy5zZWxlY3QoXCIjYWRkLWxheWVyc1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAoc3RhdGUubnVtSGlkZGVuTGF5ZXJzID49IE1BWF9ITEFZRVJTKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHN0YXRlLm5ldHdvcmtTaGFwZVtzdGF0ZS5udW1IaWRkZW5MYXllcnNdID0gMjtcblx0XHRzdGF0ZS5udW1IaWRkZW5MYXllcnMrKztcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0ZDMuc2VsZWN0KFwiI3JlbW92ZS1sYXllcnNcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aWYgKHN0YXRlLm51bUhpZGRlbkxheWVycyA8PSAwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHN0YXRlLm51bUhpZGRlbkxheWVycy0tO1xuXHRcdHN0YXRlLm5ldHdvcmtTaGFwZS5zcGxpY2Uoc3RhdGUubnVtSGlkZGVuTGF5ZXJzKTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0bGV0IHNob3dUZXN0RGF0YSA9IGQzLnNlbGVjdChcIiNzaG93LXRlc3QtZGF0YVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0c3RhdGUuc2hvd1Rlc3REYXRhID0gdGhpcy5jaGVja2VkO1xuXHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0aGVhdE1hcC51cGRhdGVUZXN0UG9pbnRzKHN0YXRlLnNob3dUZXN0RGF0YSA/IHRlc3REYXRhIDogW10pO1xuXHR9KTtcblxuXHQvLyBDaGVjay91bmNoZWNrIHRoZSBjaGVja2JveCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG5cdHNob3dUZXN0RGF0YS5wcm9wZXJ0eShcImNoZWNrZWRcIiwgc3RhdGUuc2hvd1Rlc3REYXRhKTtcblxuXHRsZXQgZGlzY3JldGl6ZSA9IGQzLnNlbGVjdChcIiNkaXNjcmV0aXplXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5kaXNjcmV0aXplID0gdGhpcy5jaGVja2VkO1xuXHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0dXBkYXRlVUkoKTtcblx0fSk7XG5cdC8vIENoZWNrL3VuY2hlY2sgdGhlIGNoZWNib3ggYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxuXHRkaXNjcmV0aXplLnByb3BlcnR5KFwiY2hlY2tlZFwiLCBzdGF0ZS5kaXNjcmV0aXplKTtcblxuXHRsZXQgcGVyY1RyYWluID0gZDMuc2VsZWN0KFwiI3BlcmNUcmFpbkRhdGFcIikub24oXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0c3RhdGUucGVyY1RyYWluRGF0YSA9IHRoaXMudmFsdWU7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdwZXJjVHJhaW5EYXRhJ10gLnZhbHVlXCIpLnRleHQodGhpcy52YWx1ZSk7XG5cdFx0Z2VuZXJhdGVEYXRhKCk7XG5cblx0XHRsZXQgY2xhc3NEaXN0ID0gZ2V0TnVtYmVyT2ZFYWNoQ2xhc3ModHJhaW5EYXRhKS5tYXAoKG51bSkgPT4gbnVtIC8gdHJhaW5EYXRhLmxlbmd0aCk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFEaXN0cmlidXRpb24nXSAudmFsdWVcIilcblx0XHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cdHBlcmNUcmFpbi5wcm9wZXJ0eShcInZhbHVlXCIsIHN0YXRlLnBlcmNUcmFpbkRhdGEpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3BlcmNUcmFpbkRhdGEnXSAudmFsdWVcIikudGV4dChzdGF0ZS5wZXJjVHJhaW5EYXRhKTtcblxuXHRmdW5jdGlvbiBodW1hblJlYWRhYmxlSW50KG46IG51bWJlcik6IHN0cmluZyB7XG5cdFx0cmV0dXJuIG4udG9GaXhlZCgwKTtcblx0fVxuXG5cdGxldCBub2lzZSA9IGQzLnNlbGVjdChcIiNub2lzZVwiKS5vbihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5ub2lzZSA9IHRoaXMudmFsdWU7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSd0cnVlLW5vaXNlU05SJ10gLnZhbHVlXCIpLnRleHQodGhpcy52YWx1ZSk7XG5cdFx0Z2VuZXJhdGVEYXRhKCk7XG5cblx0XHRsZXQgY2xhc3NEaXN0ID0gZ2V0TnVtYmVyT2ZFYWNoQ2xhc3ModHJhaW5EYXRhKS5tYXAoKG51bSkgPT4gbnVtIC8gdHJhaW5EYXRhLmxlbmd0aCk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFEaXN0cmlidXRpb24nXSAudmFsdWVcIilcblx0XHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblxuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXG5cdG5vaXNlLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUubm9pc2UpO1xuXHRsZXQgY2xhc3NEaXN0ID0gZ2V0TnVtYmVyT2ZFYWNoQ2xhc3ModHJhaW5EYXRhKS5tYXAoKG51bSkgPT4gbnVtIC8gdHJhaW5EYXRhLmxlbmd0aCk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0ndHJ1ZS1ub2lzZVNOUiddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm5vaXNlKTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFEaXN0cmlidXRpb24nXSAudmFsdWVcIilcblx0XHQudGV4dChgJHtjbGFzc0Rpc3RbMF0udG9GaXhlZCgzKX0sICR7Y2xhc3NEaXN0WzFdLnRvRml4ZWQoMyl9YCk7XG5cblx0bGV0IGJhdGNoU2l6ZSA9IGQzLnNlbGVjdChcIiNiYXRjaFNpemVcIikub24oXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0c3RhdGUuYmF0Y2hTaXplID0gdGhpcy52YWx1ZTtcblxuXHRcdGxldCBjbGFzc0Rpc3QgPSBnZXROdW1iZXJPZkVhY2hDbGFzcyh0cmFpbkRhdGEpLm1hcCgobnVtKSA9PiBudW0gLyB0cmFpbkRhdGEubGVuZ3RoKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHRoaXMudmFsdWUpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbWF4Q2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5tYXhDYXBhY2l0eSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhRGlzdHJpYnV0aW9uJ10gLnZhbHVlXCIpXG5cdFx0XHQudGV4dChgJHtjbGFzc0Rpc3RbMF0udG9GaXhlZCgzKX0sICR7Y2xhc3NEaXN0WzFdLnRvRml4ZWQoMyl9YCk7XG5cblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0YmF0Y2hTaXplLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUuYmF0Y2hTaXplKTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdiYXRjaFNpemUnXSAudmFsdWVcIikudGV4dChzdGF0ZS5iYXRjaFNpemUpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YURpc3RyaWJ1dGlvbiddIC52YWx1ZVwiKVxuXHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblxuXG5cdGxldCBhY3RpdmF0aW9uRHJvcGRvd24gPSBkMy5zZWxlY3QoXCIjYWN0aXZhdGlvbnNcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLmFjdGl2YXRpb24gPSBhY3RpdmF0aW9uc1t0aGlzLnZhbHVlXTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cdGFjdGl2YXRpb25Ecm9wZG93bi5wcm9wZXJ0eShcInZhbHVlXCIsIGdldEtleUZyb21WYWx1ZShhY3RpdmF0aW9ucywgc3RhdGUuYWN0aXZhdGlvbikpO1xuXG5cdGxldCBsZWFybmluZ1JhdGUgPSBkMy5zZWxlY3QoXCIjbGVhcm5pbmdSYXRlXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5sZWFybmluZ1JhdGUgPSB0aGlzLnZhbHVlO1xuXHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHR9KTtcblxuXHRsZWFybmluZ1JhdGUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5sZWFybmluZ1JhdGUpO1xuXG5cdGxldCByZWd1bGFyRHJvcGRvd24gPSBkMy5zZWxlY3QoXCIjcmVndWxhcml6YXRpb25zXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5yZWd1bGFyaXphdGlvbiA9IHJlZ3VsYXJpemF0aW9uc1t0aGlzLnZhbHVlXTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0cmVndWxhckRyb3Bkb3duLnByb3BlcnR5KFwidmFsdWVcIiwgZ2V0S2V5RnJvbVZhbHVlKHJlZ3VsYXJpemF0aW9ucywgc3RhdGUucmVndWxhcml6YXRpb24pKTtcblxuXHRsZXQgcmVndWxhclJhdGUgPSBkMy5zZWxlY3QoXCIjcmVndWxhclJhdGVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLnJlZ3VsYXJpemF0aW9uUmF0ZSA9ICt0aGlzLnZhbHVlO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblx0cmVndWxhclJhdGUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5yZWd1bGFyaXphdGlvblJhdGUpO1xuXG5cdGxldCBwcm9ibGVtID0gZDMuc2VsZWN0KFwiI3Byb2JsZW1cIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLnByb2JsZW0gPSBwcm9ibGVtc1t0aGlzLnZhbHVlXTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblx0XHRkcmF3RGF0YXNldFRodW1ibmFpbHMoKTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cdHByb2JsZW0ucHJvcGVydHkoXCJ2YWx1ZVwiLCBnZXRLZXlGcm9tVmFsdWUocHJvYmxlbXMsIHN0YXRlLnByb2JsZW0pKTtcblxuXHQvLyBBZGQgc2NhbGUgdG8gdGhlIGdyYWRpZW50IGNvbG9yIG1hcC5cblx0bGV0IHggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWy0xLCAxXSkucmFuZ2UoWzAsIDE0NF0pO1xuXHRsZXQgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG5cdFx0LnNjYWxlKHgpXG5cdFx0Lm9yaWVudChcImJvdHRvbVwiKVxuXHRcdC50aWNrVmFsdWVzKFstMSwgMCwgMV0pXG5cdFx0LnRpY2tGb3JtYXQoZDMuZm9ybWF0KFwiZFwiKSk7XG5cdGQzLnNlbGVjdChcIiNjb2xvcm1hcCBnLmNvcmVcIikuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ4IGF4aXNcIilcblx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDEwKVwiKVxuXHRcdC5jYWxsKHhBeGlzKTtcblxuXHQvLyBMaXN0ZW4gZm9yIGNzcy1yZXNwb25zaXZlIGNoYW5nZXMgYW5kIHJlZHJhdyB0aGUgc3ZnIG5ldHdvcmsuXG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xuXHRcdGxldCBuZXdXaWR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbi1wYXJ0XCIpXG5cdFx0XHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cdFx0aWYgKG5ld1dpZHRoICE9PSBtYWluV2lkdGgpIHtcblx0XHRcdG1haW5XaWR0aCA9IG5ld1dpZHRoO1xuXHRcdFx0ZHJhd05ldHdvcmsobmV0d29yayk7XG5cdFx0XHR1cGRhdGVVSSh0cnVlKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIEhpZGUgdGhlIHRleHQgYmVsb3cgdGhlIHZpc3VhbGl6YXRpb24gZGVwZW5kaW5nIG9uIHRoZSBVUkwuXG5cdGlmIChzdGF0ZS5oaWRlVGV4dCkge1xuXHRcdGQzLnNlbGVjdChcIiNhcnRpY2xlLXRleHRcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0XHRkMy5zZWxlY3QoXCJkaXYubW9yZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdGQzLnNlbGVjdChcImhlYWRlclwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJpYXNlc1VJKG5ldHdvcms6IG5uLk5vZGVbXVtdKSB7XG5cdG5uLmZvckVhY2hOb2RlKG5ldHdvcmssIHRydWUsIG5vZGUgPT4ge1xuXHRcdGQzLnNlbGVjdChgcmVjdCNiaWFzLSR7bm9kZS5pZH1gKS5zdHlsZShcImZpbGxcIiwgY29sb3JTY2FsZShub2RlLmJpYXMpKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVdlaWdodHNVSShuZXR3b3JrOiBubi5Ob2RlW11bXSwgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55Pikge1xuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Ly8gVXBkYXRlIGFsbCB0aGUgbm9kZXMgaW4gdGhpcyBsYXllci5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcblx0XHRcdFx0Y29udGFpbmVyLnNlbGVjdChgI2xpbmske2xpbmsuc291cmNlLmlkfS0ke2xpbmsuZGVzdC5pZH1gKVxuXHRcdFx0XHRcdC5zdHlsZShcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XCJzdHJva2UtZGFzaG9mZnNldFwiOiAtaXRlciAvIDMsXG5cdFx0XHRcdFx0XHRcdFwic3Ryb2tlLXdpZHRoXCI6IGxpbmtXaWR0aFNjYWxlKE1hdGguYWJzKGxpbmsud2VpZ2h0KSksXG5cdFx0XHRcdFx0XHRcdFwic3Ryb2tlXCI6IGNvbG9yU2NhbGUobGluay53ZWlnaHQpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5kYXR1bShsaW5rKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBDcmVhdGluZyBsaW5rIGJldHdlZW4gdHdvIG5vZGVzLlxuICogQHBhcmFtIHN0YXJ0Tm9kZTogU3RhcnRpbmcgbm9kZSBvZiBsaW5rXG4gKiBAcGFyYW0gZW5kTm9kZTogRW5kIG5vZGUgb2YgbGlua1xuICovXG5mdW5jdGlvbiBjcmVhdGVMaW5rKHN0YXJ0Tm9kZTogbm4uTm9kZSwgZW5kTm9kZTogbm4uTm9kZSkge1xuXHRpZiAoc3RhcnROb2RlLmxheWVyID49IGVuZE5vZGUubGF5ZXIgLSAxKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bGV0IGxpbmsgPSBuZXcgTGluayhzdGFydE5vZGUsIGVuZE5vZGUsIHN0YXRlLnJlZ3VsYXJpemF0aW9uLCBzdGF0ZS5pbml0WmVybyk7XG5cdGxpbmsuaXNSZXNpZHVhbCA9IHRydWU7XG5cdHN0YXJ0Tm9kZS5vdXRwdXRzLnB1c2gobGluayk7XG5cdGVuZE5vZGUuaW5wdXRMaW5rcy5wdXNoKGxpbmspO1xuXHRkcmF3TmV0d29yayhuZXR3b3JrKTtcblx0dG90YWxDYXBhY2l0eSA9IGdldFRvdGFsQ2FwYWNpdHkobmV0d29yayk7XG5cdHVwZGF0ZVVJKCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdOb2RlKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIG5vZGVJZDogc3RyaW5nLCBpc0lucHV0OiBib29sZWFuLCBjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+LCBub2RlPzogbm4uTm9kZSkge1xuXHRsZXQgeCA9IGN4IC0gUkVDVF9TSVpFIC8gMjtcblx0bGV0IHkgPSBjeSAtIFJFQ1RfU0laRSAvIDI7XG5cblx0bGV0IG5vZGVHcm91cCA9IGNvbnRhaW5lci5hcHBlbmQoXCJnXCIpLmF0dHIoXG5cdFx0e1xuXHRcdFx0XCJjbGFzc1wiOiBcIm5vZGVcIixcblx0XHRcdFwiaWRcIjogYG5vZGUke25vZGVJZH1gLFxuXHRcdFx0XCJ0cmFuc2Zvcm1cIjogYHRyYW5zbGF0ZSgke3h9LCR7eX0pYFxuXHRcdH0pO1xuXG5cdC8vIERyYXcgdGhlIG1haW4gcmVjdGFuZ2xlLlxuXHRub2RlR3JvdXAuYXBwZW5kKFwicmVjdFwiKS5hdHRyKFxuXHRcdHtcblx0XHRcdHg6IDAsXG5cdFx0XHR5OiAwLFxuXHRcdFx0d2lkdGg6IFJFQ1RfU0laRSxcblx0XHRcdGhlaWdodDogUkVDVF9TSVpFLFxuXHRcdH0pO1xuXG5cdGxldCBhY3RpdmVPck5vdENsYXNzID0gc3RhdGVbbm9kZUlkXSA/IFwiYWN0aXZlXCIgOiBcImluYWN0aXZlXCI7XG5cdGlmIChpc0lucHV0KSB7XG5cdFx0bGV0IGxhYmVsID0gSU5QVVRTW25vZGVJZF0ubGFiZWwgIT0gbnVsbCA/IElOUFVUU1tub2RlSWRdLmxhYmVsIDogbm9kZUlkO1xuXHRcdC8vIERyYXcgdGhlIGlucHV0IGxhYmVsLlxuXHRcdGxldCB0ZXh0ID0gbm9kZUdyb3VwLmFwcGVuZChcInRleHRcIikuYXR0cihcblx0XHRcdHtcblx0XHRcdFx0Y2xhc3M6IFwibWFpbi1sYWJlbFwiLFxuXHRcdFx0XHR4OiAtMTAsXG5cdFx0XHRcdHk6IFJFQ1RfU0laRSAvIDIsIFwidGV4dC1hbmNob3JcIjogXCJlbmRcIlxuXHRcdFx0fSk7XG5cdFx0aWYgKC9bX15dLy50ZXN0KGxhYmVsKSkge1xuXHRcdFx0bGV0IG15UmUgPSAvKC4qPykoW19eXSkoLikvZztcblx0XHRcdGxldCBteUFycmF5O1xuXHRcdFx0bGV0IGxhc3RJbmRleDtcblx0XHRcdHdoaWxlICgobXlBcnJheSA9IG15UmUuZXhlYyhsYWJlbCkpICE9IG51bGwpIHtcblx0XHRcdFx0bGFzdEluZGV4ID0gbXlSZS5sYXN0SW5kZXg7XG5cdFx0XHRcdGxldCBwcmVmaXggPSBteUFycmF5WzFdO1xuXHRcdFx0XHRsZXQgc2VwID0gbXlBcnJheVsyXTtcblx0XHRcdFx0bGV0IHN1ZmZpeCA9IG15QXJyYXlbM107XG5cdFx0XHRcdGlmIChwcmVmaXgpIHtcblx0XHRcdFx0XHR0ZXh0LmFwcGVuZChcInRzcGFuXCIpLnRleHQocHJlZml4KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0ZXh0LmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJiYXNlbGluZS1zaGlmdFwiLCBzZXAgPT09IFwiX1wiID8gXCJzdWJcIiA6IFwic3VwZXJcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJmb250LXNpemVcIiwgXCI5cHhcIilcblx0XHRcdFx0XHQudGV4dChzdWZmaXgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxhYmVsLnN1YnN0cmluZyhsYXN0SW5kZXgpKSB7XG5cdFx0XHRcdHRleHQuYXBwZW5kKFwidHNwYW5cIikudGV4dChsYWJlbC5zdWJzdHJpbmcobGFzdEluZGV4KSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRleHQuYXBwZW5kKFwidHNwYW5cIikudGV4dChsYWJlbCk7XG5cdFx0fVxuXHRcdG5vZGVHcm91cC5jbGFzc2VkKGFjdGl2ZU9yTm90Q2xhc3MsIHRydWUpO1xuXHR9XG5cdGlmICghaXNJbnB1dCkge1xuXHRcdC8vIERyYXcgdGhlIG5vZGUncyBiaWFzLlxuXHRcdG5vZGVHcm91cC5hcHBlbmQoXCJyZWN0XCIpLmF0dHIoXG5cdFx0XHR7XG5cdFx0XHRcdGlkOiBgYmlhcy0ke25vZGVJZH1gLFxuXHRcdFx0XHR4OiAtQklBU19TSVpFIC0gMixcblx0XHRcdFx0eTogUkVDVF9TSVpFIC0gQklBU19TSVpFICsgMyxcblx0XHRcdFx0d2lkdGg6IEJJQVNfU0laRSxcblx0XHRcdFx0aGVpZ2h0OiBCSUFTX1NJWkUsXG5cdFx0XHR9KVxuXHRcdFx0Lm9uKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHVwZGF0ZUhvdmVyQ2FyZChIb3ZlclR5cGUuQklBUywgbm9kZSwgZDMubW91c2UoY29udGFpbmVyLm5vZGUoKSkpO1xuXHRcdFx0fSlcblx0XHRcdC5vbihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR1cGRhdGVIb3ZlckNhcmQobnVsbCk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8vIERyYXcgdGhlIG5vZGUncyBjYW52YXMuXG5cdGxldCBkaXYgPSBkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5pbnNlcnQoXCJkaXZcIiwgXCI6Zmlyc3QtY2hpbGRcIikuYXR0cihcblx0XHR7XG5cdFx0XHRcImlkXCI6IGBjYW52YXMtJHtub2RlSWR9YCxcblx0XHRcdFwiY2xhc3NcIjogXCJjYW52YXNcIlxuXHRcdH0pXG5cdFx0LnN0eWxlKFxuXHRcdFx0e1xuXHRcdFx0XHRwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuXHRcdFx0XHRsZWZ0OiBgJHt4ICsgM31weGAsXG5cdFx0XHRcdHRvcDogYCR7eSArIDN9cHhgXG5cdFx0XHR9KVxuXHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChzdGF0ZS5zaGlmdERvd24pIHtcblx0XHRcdFx0aWYgKG1hcmtlZE5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGRpdi5zdHlsZSh7XG5cdFx0XHRcdFx0XHRcImJvcmRlci1zdHlsZVwiOiBcInNvbGlkXCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci1yYWRpdXNcIjogXCI1cHhcIixcblx0XHRcdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IFwicmVkXCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci13aWR0aFwiOiBcIjJweFwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0bWFya2VkTm9kZSA9IG5vZGU7XG5cdFx0XHRcdFx0bWFya2VkRGl2ID0gZGl2O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1hcmtlZERpdi5zdHlsZSh7XG5cdFx0XHRcdFx0XHRcImJvcmRlci13aWR0aFwiOiBcIjBweFwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y3JlYXRlTGluayhtYXJrZWROb2RlLCBub2RlKTtcblx0XHRcdFx0XHRtYXJrZWROb2RlID0gbnVsbDtcblx0XHRcdFx0XHRtYXJrZWREaXYgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGVjdGVkTm9kZUlkID0gbm9kZUlkO1xuXHRcdFx0ZGl2LmNsYXNzZWQoXCJob3ZlcmVkXCIsIHRydWUpO1xuXHRcdFx0bm9kZUdyb3VwLmNsYXNzZWQoXCJob3ZlcmVkXCIsIHRydWUpO1xuXHRcdFx0dXBkYXRlRGVjaXNpb25Cb3VuZGFyeShuZXR3b3JrLCBmYWxzZSk7XG5cdFx0XHRoZWF0TWFwLnVwZGF0ZUJhY2tncm91bmQoYm91bmRhcnlbbm9kZUlkXSwgc3RhdGUuZGlzY3JldGl6ZSk7XG5cdFx0fSlcblx0XHQub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGVjdGVkTm9kZUlkID0gbnVsbDtcblx0XHRcdGRpdi5jbGFzc2VkKFwiaG92ZXJlZFwiLCBmYWxzZSk7XG5cdFx0XHRub2RlR3JvdXAuY2xhc3NlZChcImhvdmVyZWRcIiwgZmFsc2UpO1xuXHRcdFx0dXBkYXRlRGVjaXNpb25Cb3VuZGFyeShuZXR3b3JrLCBmYWxzZSk7XG5cdFx0XHRoZWF0TWFwLnVwZGF0ZUJhY2tncm91bmQoYm91bmRhcnlbbm4uZ2V0T3V0cHV0Tm9kZShuZXR3b3JrKS5pZF0sIHN0YXRlLmRpc2NyZXRpemUpO1xuXHRcdH0pO1xuXHRpZiAoaXNJbnB1dCkge1xuXHRcdGRpdi5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICghc3RhdGUuc2hpZnREb3duKSB7XG5cdFx0XHRcdHN0YXRlW25vZGVJZF0gPSAhc3RhdGVbbm9kZUlkXTtcblx0XHRcdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRyZXNldCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKG1hcmtlZE5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGRpdi5zdHlsZSh7XG5cdFx0XHRcdFx0XHRcImJvcmRlci1zdHlsZVwiOiBcInNvbGlkXCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci1yYWRpdXNcIjogXCI1cHhcIixcblx0XHRcdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IFwicmVkXCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci13aWR0aFwiOiBcIjJweFwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cobm9kZSwgZGl2KTtcblx0XHRcdFx0XHRtYXJrZWROb2RlID0gbm9kZTtcblx0XHRcdFx0XHRtYXJrZWREaXYgPSBkaXY7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0XHRkaXYuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpO1xuXHR9XG5cdGlmIChpc0lucHV0KSB7XG5cdFx0ZGl2LmNsYXNzZWQoYWN0aXZlT3JOb3RDbGFzcywgdHJ1ZSk7XG5cdH1cblx0bGV0IG5vZGVIZWF0TWFwID0gbmV3IEhlYXRNYXAoUkVDVF9TSVpFLCBERU5TSVRZIC8gMTAsIHhEb21haW4sIHhEb21haW4sIGRpdiwge25vU3ZnOiB0cnVlfSk7XG5cdGRpdi5kYXR1bSh7aGVhdG1hcDogbm9kZUhlYXRNYXAsIGlkOiBub2RlSWR9KTtcbn1cblxuLy8gRHJhdyBuZXR3b3JrXG5mdW5jdGlvbiBkcmF3TmV0d29yayhuZXR3b3JrOiBubi5Ob2RlW11bXSk6IHZvaWQge1xuXHRsZXQgc3ZnID0gZDMuc2VsZWN0KFwiI3N2Z1wiKTtcblx0Ly8gUmVtb3ZlIGFsbCBzdmcgZWxlbWVudHMuXG5cdHN2Zy5zZWxlY3QoXCJnLmNvcmVcIikucmVtb3ZlKCk7XG5cdC8vIFJlbW92ZSBhbGwgZGl2IGVsZW1lbnRzLlxuXHRkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5zZWxlY3RBbGwoXCJkaXYuY2FudmFzXCIpLnJlbW92ZSgpO1xuXHRkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5zZWxlY3RBbGwoXCJkaXYucGx1cy1taW51cy1uZXVyb25zXCIpLnJlbW92ZSgpO1xuXG5cdC8vIEdldCB0aGUgd2lkdGggb2YgdGhlIHN2ZyBjb250YWluZXIuXG5cdGxldCBwYWRkaW5nID0gMztcblx0bGV0IGNvID0gZDMuc2VsZWN0KFwiLmNvbHVtbi5vdXRwdXRcIikubm9kZSgpIGFzIEhUTUxEaXZFbGVtZW50O1xuXHRsZXQgY2YgPSBkMy5zZWxlY3QoXCIuY29sdW1uLmZlYXR1cmVzXCIpLm5vZGUoKSBhcyBIVE1MRGl2RWxlbWVudDtcblx0bGV0IHdpZHRoID0gY28ub2Zmc2V0TGVmdCAtIGNmLm9mZnNldExlZnQ7XG5cdHN2Zy5hdHRyKFwid2lkdGhcIiwgd2lkdGgpO1xuXG5cdC8vIE1hcCBvZiBhbGwgbm9kZSBjb29yZGluYXRlcy5cblx0bGV0IG5vZGUyY29vcmQ6IHsgW2lkOiBzdHJpbmddOiB7IGN4OiBudW1iZXIsIGN5OiBudW1iZXIgfSB9ID0ge307XG5cdGxldCBjb250YWluZXIgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdC5jbGFzc2VkKFwiY29yZVwiLCB0cnVlKVxuXHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHtwYWRkaW5nfSwke3BhZGRpbmd9KWApO1xuXHQvLyBEcmF3IHRoZSBuZXR3b3JrIGxheWVyIGJ5IGxheWVyLlxuXHRsZXQgbnVtTGF5ZXJzID0gbmV0d29yay5sZW5ndGg7XG5cdGxldCBmZWF0dXJlV2lkdGggPSAxMTg7XG5cdGxldCBsYXllclNjYWxlID0gZDMuc2NhbGUub3JkaW5hbDxudW1iZXIsIG51bWJlcj4oKVxuXHRcdC5kb21haW4oZDMucmFuZ2UoMSwgbnVtTGF5ZXJzIC0gMSkpXG5cdFx0LnJhbmdlUG9pbnRzKFtmZWF0dXJlV2lkdGgsIHdpZHRoIC0gUkVDVF9TSVpFXSwgMC43KTtcblx0bGV0IG5vZGVJbmRleFNjYWxlID0gKG5vZGVJbmRleDogbnVtYmVyKSA9PiBub2RlSW5kZXggKiAoUkVDVF9TSVpFICsgMjUpO1xuXG5cblx0bGV0IGNhbGxvdXRUaHVtYiA9IGQzLnNlbGVjdChcIi5jYWxsb3V0LnRodW1ibmFpbFwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRsZXQgY2FsbG91dFdlaWdodHMgPSBkMy5zZWxlY3QoXCIuY2FsbG91dC53ZWlnaHRzXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdGxldCBpZFdpdGhDYWxsb3V0ID0gbnVsbDtcblx0bGV0IHRhcmdldElkV2l0aENhbGxvdXQgPSBudWxsO1xuXG5cdC8vIERyYXcgdGhlIGlucHV0IGxheWVyIHNlcGFyYXRlbHkuXG5cdGxldCBjeCA9IFJFQ1RfU0laRSAvIDIgKyA1MDtcblx0bGV0IG5vZGVJZHMgPSBPYmplY3Qua2V5cyhJTlBVVFMpO1xuXHRsZXQgbWF4WSA9IG5vZGVJbmRleFNjYWxlKG5vZGVJZHMubGVuZ3RoKTtcblx0bGV0IGFjdGl2ZU5vZGVJbmRpY2VzID0gbmV0d29ya1swXS5yZWR1Y2UoKG9iaiwgbm9kZSwgaSkgPT4ge1xuXHRcdG9ialtub2RlLmlkXSA9IGk7XG5cdFx0cmV0dXJuIG9iajtcblx0fSwge30pO1xuXHRub2RlSWRzLmZvckVhY2goKG5vZGVJZCwgaSkgPT4ge1xuXHRcdGxldCBub2RlSWR4ID0gYWN0aXZlTm9kZUluZGljZXNbbm9kZUlkXTtcblx0XHRsZXQgbm9kZSA9IG5ldHdvcmtbMF1bbm9kZUlkeF07XG5cdFx0bGV0IGN5ID0gbm9kZUluZGV4U2NhbGUoaSkgKyBSRUNUX1NJWkUgLyAyO1xuXHRcdG5vZGUyY29vcmRbbm9kZUlkXSA9IHtjeCwgY3l9O1xuXHRcdGRyYXdOb2RlKGN4LCBjeSwgbm9kZUlkLCB0cnVlLCBjb250YWluZXIsIG5vZGUpO1xuXHR9KTtcblxuXHQvLyBEcmF3IHRoZSBpbnRlcm1lZGlhdGUgbGF5ZXJzLlxuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbnVtTGF5ZXJzIC0gMTsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBudW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHhdLmxlbmd0aDtcblx0XHRsZXQgY3ggPSBsYXllclNjYWxlKGxheWVySWR4KSArIFJFQ1RfU0laRSAvIDI7XG5cdFx0bWF4WSA9IE1hdGgubWF4KG1heFksIG5vZGVJbmRleFNjYWxlKG51bU5vZGVzKSk7XG5cdFx0YWRkUGx1c01pbnVzQ29udHJvbChsYXllclNjYWxlKGxheWVySWR4KSwgbGF5ZXJJZHgpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtTm9kZXM7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBuZXR3b3JrW2xheWVySWR4XVtpXTtcblx0XHRcdGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKGkpICsgUkVDVF9TSVpFIC8gMjtcblx0XHRcdG5vZGUyY29vcmRbbm9kZS5pZF0gPSB7Y3gsIGN5fTtcblx0XHRcdGRyYXdOb2RlKGN4LCBjeSwgbm9kZS5pZCwgZmFsc2UsIGNvbnRhaW5lciwgbm9kZSk7XG5cblx0XHRcdC8vIFNob3cgY2FsbG91dCB0byB0aHVtYm5haWxzLlxuXHRcdFx0bGV0IG51bU5vZGVzID0gbmV0d29ya1tsYXllcklkeF0ubGVuZ3RoO1xuXHRcdFx0bGV0IG5leHROdW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHggKyAxXS5sZW5ndGg7XG5cdFx0XHRpZiAoaWRXaXRoQ2FsbG91dCA9PSBudWxsICYmXG5cdFx0XHRcdGkgPT09IG51bU5vZGVzIC0gMSAmJlxuXHRcdFx0XHRuZXh0TnVtTm9kZXMgPD0gbnVtTm9kZXMpIHtcblx0XHRcdFx0Y2FsbG91dFRodW1iLnN0eWxlKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IG51bGwsXG5cdFx0XHRcdFx0XHR0b3A6IGAkezIwICsgMyArIGN5fXB4YCxcblx0XHRcdFx0XHRcdGxlZnQ6IGAke2N4fXB4YFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRpZFdpdGhDYWxsb3V0ID0gbm9kZS5pZDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRHJhdyBsaW5rcy5cblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2pdO1xuXHRcdFx0XHRsZXQgcGF0aDogU1ZHUGF0aEVsZW1lbnQgPSBkcmF3TGluayhsaW5rLCBub2RlMmNvb3JkLCBuZXR3b3JrLFxuXHRcdFx0XHRcdGNvbnRhaW5lciwgaiA9PT0gMCwgaiwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aCkubm9kZSgpIGFzIGFueTtcblx0XHRcdFx0Ly8gU2hvdyBjYWxsb3V0IHRvIHdlaWdodHMuXG5cdFx0XHRcdGxldCBwcmV2TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4IC0gMV07XG5cdFx0XHRcdGxldCBsYXN0Tm9kZVByZXZMYXllciA9IHByZXZMYXllcltwcmV2TGF5ZXIubGVuZ3RoIC0gMV07XG5cdFx0XHRcdGlmICh0YXJnZXRJZFdpdGhDYWxsb3V0ID09IG51bGwgJiZcblx0XHRcdFx0XHRpID09PSBudW1Ob2RlcyAtIDEgJiZcblx0XHRcdFx0XHRsaW5rLnNvdXJjZS5pZCA9PT0gbGFzdE5vZGVQcmV2TGF5ZXIuaWQgJiZcblx0XHRcdFx0XHQobGluay5zb3VyY2UuaWQgIT09IGlkV2l0aENhbGxvdXQgfHwgbnVtTGF5ZXJzIDw9IDUpICYmXG5cdFx0XHRcdFx0bGluay5kZXN0LmlkICE9PSBpZFdpdGhDYWxsb3V0ICYmXG5cdFx0XHRcdFx0cHJldkxheWVyLmxlbmd0aCA+PSBudW1Ob2Rlcykge1xuXHRcdFx0XHRcdGxldCBtaWRQb2ludCA9IHBhdGguZ2V0UG9pbnRBdExlbmd0aChwYXRoLmdldFRvdGFsTGVuZ3RoKCkgKiAwLjcpO1xuXHRcdFx0XHRcdGNhbGxvdXRXZWlnaHRzLnN0eWxlKFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBudWxsLFxuXHRcdFx0XHRcdFx0XHR0b3A6IGAke21pZFBvaW50LnkgKyA1fXB4YCxcblx0XHRcdFx0XHRcdFx0bGVmdDogYCR7bWlkUG9pbnQueCArIDN9cHhgXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0YXJnZXRJZFdpdGhDYWxsb3V0ID0gbGluay5kZXN0LmlkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gRHJhdyB0aGUgb3V0cHV0IG5vZGUgc2VwYXJhdGVseS5cblx0Y3ggPSB3aWR0aCArIFJFQ1RfU0laRSAvIDI7XG5cdGxldCBub2RlID0gbmV0d29ya1tudW1MYXllcnMgLSAxXVswXTtcblx0bGV0IGN5ID0gbm9kZUluZGV4U2NhbGUoMCkgKyBSRUNUX1NJWkUgLyAyO1xuXHRub2RlMmNvb3JkW25vZGUuaWRdID0ge2N4LCBjeX07XG5cdC8vIERyYXcgbGlua3MuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IGxpbmsgPSBub2RlLmlucHV0TGlua3NbaV07XG5cdFx0ZHJhd0xpbmsobGluaywgbm9kZTJjb29yZCwgbmV0d29yaywgY29udGFpbmVyLCBpID09PSAwLCBpLFxuXHRcdFx0bm9kZS5pbnB1dExpbmtzLmxlbmd0aCk7XG5cdH1cblx0Ly8gQWRqdXN0IHRoZSBoZWlnaHQgb2YgdGhlIHN2Zy5cblx0c3ZnLmF0dHIoXCJoZWlnaHRcIiwgbWF4WSk7XG5cblx0Ly8gQWRqdXN0IHRoZSBoZWlnaHQgb2YgdGhlIGZlYXR1cmVzIGNvbHVtbi5cblx0bGV0IGhlaWdodCA9IE1hdGgubWF4KFxuXHRcdGdldFJlbGF0aXZlSGVpZ2h0KGNhbGxvdXRUaHVtYiksXG5cdFx0Z2V0UmVsYXRpdmVIZWlnaHQoY2FsbG91dFdlaWdodHMpLFxuXHRcdGdldFJlbGF0aXZlSGVpZ2h0KGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpKVxuXHQpO1xuXHRkMy5zZWxlY3QoXCIuY29sdW1uLmZlYXR1cmVzXCIpLnN0eWxlKFwiaGVpZ2h0XCIsIGhlaWdodCArIFwicHhcIik7XG59XG5cbmZ1bmN0aW9uIGdldFJlbGF0aXZlSGVpZ2h0KHNlbGVjdGlvbjogZDMuU2VsZWN0aW9uPGFueT4pIHtcblx0bGV0IG5vZGUgPSBzZWxlY3Rpb24ubm9kZSgpIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuXHRyZXR1cm4gbm9kZS5vZmZzZXRIZWlnaHQgKyBub2RlLm9mZnNldFRvcDtcbn1cblxuZnVuY3Rpb24gYWRkUGx1c01pbnVzQ29udHJvbCh4OiBudW1iZXIsIGxheWVySWR4OiBudW1iZXIpIHtcblx0bGV0IGRpdiA9IGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLmFwcGVuZChcImRpdlwiKVxuXHRcdC5jbGFzc2VkKFwicGx1cy1taW51cy1uZXVyb25zXCIsIHRydWUpXG5cdFx0LnN0eWxlKFwibGVmdFwiLCBgJHt4IC0gMTB9cHhgKTtcblxuXHRsZXQgaSA9IGxheWVySWR4IC0gMTtcblx0bGV0IGZpcnN0Um93ID0gZGl2LmFwcGVuZChcImRpdlwiKS5hdHRyKFwiY2xhc3NcIiwgYHVpLW51bU5vZGVzJHtsYXllcklkeH1gKTtcblx0Zmlyc3RSb3cuYXBwZW5kKFwiYnV0dG9uXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcIm1kbC1idXR0b24gbWRsLWpzLWJ1dHRvbiBtZGwtYnV0dG9uLS1pY29uXCIpXG5cdFx0Lm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0bGV0IG51bU5ldXJvbnMgPSBzdGF0ZS5uZXR3b3JrU2hhcGVbaV07XG5cdFx0XHRpZiAobnVtTmV1cm9ucyA+PSBNQVhfTkVVUk9OUykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRzdGF0ZS5uZXR3b3JrU2hhcGVbaV0rKztcblx0XHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdHJlc2V0KCk7XG5cdFx0fSlcblx0XHQuYXBwZW5kKFwiaVwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtYXRlcmlhbC1pY29uc1wiKVxuXHRcdC50ZXh0KFwiYWRkXCIpO1xuXG5cdGZpcnN0Um93LmFwcGVuZChcImJ1dHRvblwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtZGwtYnV0dG9uIG1kbC1qcy1idXR0b24gbWRsLWJ1dHRvbi0taWNvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGxldCBudW1OZXVyb25zID0gc3RhdGUubmV0d29ya1NoYXBlW2ldO1xuXHRcdFx0aWYgKG51bU5ldXJvbnMgPD0gMSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRzdGF0ZS5uZXR3b3JrU2hhcGVbaV0tLTtcblx0XHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdHJlc2V0KCk7XG5cdFx0fSlcblx0XHQuYXBwZW5kKFwiaVwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtYXRlcmlhbC1pY29uc1wiKVxuXHRcdC50ZXh0KFwicmVtb3ZlXCIpO1xuXG5cdGxldCBzdWZmaXggPSBzdGF0ZS5uZXR3b3JrU2hhcGVbaV0gPiAxID8gXCJzXCIgOiBcIlwiO1xuXHRkaXYuYXBwZW5kKFwiZGl2XCIpLnRleHQoc3RhdGUubmV0d29ya1NoYXBlW2ldICsgXCIgbmV1cm9uXCIgKyBzdWZmaXgpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3ZlckNhcmQodHlwZTogSG92ZXJUeXBlLCBub2RlT3JMaW5rPzogbm4uTm9kZSB8IG5uLkxpbmssIGNvb3JkaW5hdGVzPzogW251bWJlciwgbnVtYmVyXSkge1xuXHRsZXQgaG92ZXJjYXJkID0gZDMuc2VsZWN0KFwiI2hvdmVyY2FyZFwiKTtcblx0aWYgKHR5cGUgPT0gbnVsbCkge1xuXHRcdGhvdmVyY2FyZC5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdGQzLnNlbGVjdChcIiNzdmdcIikub24oXCJjbGlja1wiLCBudWxsKTtcblx0XHRyZXR1cm47XG5cdH1cblx0ZDMuc2VsZWN0KFwiI3N2Z1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRob3ZlcmNhcmQuc2VsZWN0KFwiLnZhbHVlXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdFx0bGV0IGlucHV0ID0gaG92ZXJjYXJkLnNlbGVjdChcImlucHV0XCIpO1xuXHRcdGlucHV0LnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKTtcblx0XHRpbnB1dC5vbihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0aGlzLnZhbHVlICE9IG51bGwgJiYgdGhpcy52YWx1ZSAhPT0gXCJcIikge1xuXHRcdFx0XHRpZiAodHlwZSA9PT0gSG92ZXJUeXBlLldFSUdIVCkge1xuXHRcdFx0XHRcdChub2RlT3JMaW5rIGFzIG5uLkxpbmspLndlaWdodCA9ICt0aGlzLnZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdChub2RlT3JMaW5rIGFzIG5uLk5vZGUpLmJpYXMgPSArdGhpcy52YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR1cGRhdGVVSSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGlucHV0Lm9uKFwia2V5cHJlc3NcIiwgKCkgPT4ge1xuXHRcdFx0aWYgKChkMy5ldmVudCBhcyBhbnkpLmtleUNvZGUgPT09IDEzKSB7XG5cdFx0XHRcdHVwZGF0ZUhvdmVyQ2FyZCh0eXBlLCBub2RlT3JMaW5rLCBjb29yZGluYXRlcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0KGlucHV0Lm5vZGUoKSBhcyBIVE1MSW5wdXRFbGVtZW50KS5mb2N1cygpO1xuXHR9KTtcblx0bGV0IHZhbHVlID0gKHR5cGUgPT09IEhvdmVyVHlwZS5XRUlHSFQpID9cblx0XHQobm9kZU9yTGluayBhcyBubi5MaW5rKS53ZWlnaHQgOlxuXHRcdChub2RlT3JMaW5rIGFzIG5uLk5vZGUpLmJpYXM7XG5cdGxldCBuYW1lID0gKHR5cGUgPT09IEhvdmVyVHlwZS5XRUlHSFQpID8gXCJXZWlnaHRcIiA6IFwiQmlhc1wiO1xuXHRob3ZlcmNhcmQuc3R5bGUoXG5cdFx0e1xuXHRcdFx0XCJsZWZ0XCI6IGAke2Nvb3JkaW5hdGVzWzBdICsgMjB9cHhgLFxuXHRcdFx0XCJ0b3BcIjogYCR7Y29vcmRpbmF0ZXNbMV19cHhgLFxuXHRcdFx0XCJkaXNwbGF5XCI6IFwiYmxvY2tcIlxuXHRcdH0pO1xuXHRob3ZlcmNhcmQuc2VsZWN0KFwiLnR5cGVcIikudGV4dChuYW1lKTtcblx0aG92ZXJjYXJkLnNlbGVjdChcIi52YWx1ZVwiKVxuXHRcdC5zdHlsZShcImRpc3BsYXlcIiwgbnVsbClcblx0XHQudGV4dCh2YWx1ZS50b1ByZWNpc2lvbigyKSk7XG5cdGhvdmVyY2FyZC5zZWxlY3QoXCJpbnB1dFwiKVxuXHRcdC5wcm9wZXJ0eShcInZhbHVlXCIsIHZhbHVlLnRvUHJlY2lzaW9uKDIpKVxuXHRcdC5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xufVxuXG5mdW5jdGlvbiBkcmF3TGluayhcblx0aW5wdXQ6IG5uLkxpbmssIG5vZGUyY29vcmQ6IHsgW2lkOiBzdHJpbmddOiB7IGN4OiBudW1iZXIsIGN5OiBudW1iZXIgfSB9LFxuXHRuZXR3b3JrOiBubi5Ob2RlW11bXSwgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55Pixcblx0aXNGaXJzdDogYm9vbGVhbiwgaW5kZXg6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpIHtcblx0bGV0IGxpbmUgPSBjb250YWluZXIuaW5zZXJ0KFwicGF0aFwiLCBcIjpmaXJzdC1jaGlsZFwiKTtcblx0bGV0IHNvdXJjZSA9IG5vZGUyY29vcmRbaW5wdXQuc291cmNlLmlkXTtcblx0bGV0IGRlc3QgPSBub2RlMmNvb3JkW2lucHV0LmRlc3QuaWRdO1xuXHRsZXQgZGF0dW0gPSB7XG5cdFx0c291cmNlOlxuXHRcdFx0e1xuXHRcdFx0XHR5OiBzb3VyY2UuY3ggKyBSRUNUX1NJWkUgLyAyICsgMixcblx0XHRcdFx0eDogc291cmNlLmN5XG5cdFx0XHR9LFxuXHRcdHRhcmdldDpcblx0XHRcdHtcblx0XHRcdFx0eTogZGVzdC5jeCAtIFJFQ1RfU0laRSAvIDIsXG5cdFx0XHRcdHg6IGRlc3QuY3kgKyAoKGluZGV4IC0gKGxlbmd0aCAtIDEpIC8gMikgLyBsZW5ndGgpICogMTJcblx0XHRcdH1cblx0fTtcblx0bGV0IGRpYWdvbmFsID0gZDMuc3ZnLmRpYWdvbmFsKCkucHJvamVjdGlvbihkID0+IFtkLnksIGQueF0pO1xuXHRsaW5lLmF0dHIoXG5cdFx0e1xuXHRcdFx0XCJtYXJrZXItc3RhcnRcIjogXCJ1cmwoI21hcmtlckFycm93KVwiLFxuXHRcdFx0Y2xhc3M6IFwibGlua1wiLFxuXHRcdFx0aWQ6IFwibGlua1wiICsgaW5wdXQuc291cmNlLmlkICsgXCItXCIgKyBpbnB1dC5kZXN0LmlkLFxuXHRcdFx0ZDogZGlhZ29uYWwoZGF0dW0sIDApXG5cdFx0fSk7XG5cblx0Ly8gQWRkIGFuIGludmlzaWJsZSB0aGljayBsaW5rIHRoYXQgd2lsbCBiZSB1c2VkIGZvclxuXHQvLyBzaG93aW5nIHRoZSB3ZWlnaHQgdmFsdWUgb24gaG92ZXIuXG5cdGNvbnRhaW5lci5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0LmF0dHIoXCJkXCIsIGRpYWdvbmFsKGRhdHVtLCAwKSlcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibGluay1ob3ZlclwiKVxuXHRcdC5vbihcImRibGNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGRlYWN0aXZhdGVBY3RpdmF0ZUxpbmsoaW5wdXQsIGQzLm1vdXNlKHRoaXMpKTtcblx0XHR9KVxuXHRcdC5vbihcIm1vdXNlZW50ZXJcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0dXBkYXRlSG92ZXJDYXJkKEhvdmVyVHlwZS5XRUlHSFQsIGlucHV0LCBkMy5tb3VzZSh0aGlzKSk7XG5cdFx0fSlcblx0XHQub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHVwZGF0ZUhvdmVyQ2FyZChudWxsKTtcblx0XHR9KTtcblx0cmV0dXJuIGxpbmU7XG59XG5cbi8qKlxuICogR2l2ZW4gYSBsaW5rLCByZWFjdGl2YXRlcyBpdCBpZiBkZWFkIG9yIHNldHMgaXQncyB3ZWlnaHQgdG8gemVybyBhbmQga2lsbHMgaXRcbiAqIEBwYXJhbSBsaW5rOiBBIGxpbmsgaW4gYSBuZXVyYWwgbmV0d29ya1xuICogQHBhcmFtIGNvb3JkaW5hdGVzOiBNb3VzZSBjb29yZGluYXRlc1xuICovXG5mdW5jdGlvbiBkZWFjdGl2YXRlQWN0aXZhdGVMaW5rKGxpbms6IG5uLkxpbmssIGNvb3JkaW5hdGVzPzogW251bWJlciwgbnVtYmVyXSkge1xuXHRpZiAobGluay5pc0RlYWQpIHtcblx0XHRsaW5rLndlaWdodCA9IDE7XG5cdFx0bGluay5pc0RlYWQgPSBmYWxzZTtcblx0XHR1cGRhdGVIb3ZlckNhcmQoSG92ZXJUeXBlLldFSUdIVCwgbGluaywgY29vcmRpbmF0ZXMpO1xuXHRcdHVwZGF0ZVVJKCk7XG5cdH0gZWxzZSB7XG5cdFx0bGluay53ZWlnaHQgPSAwO1xuXHRcdGxpbmsuaXNEZWFkID0gdHJ1ZTtcblx0XHR1cGRhdGVIb3ZlckNhcmQoSG92ZXJUeXBlLldFSUdIVCwgbGluaywgY29vcmRpbmF0ZXMpO1xuXHRcdHRvdGFsQ2FwYWNpdHkgPSBnZXRUb3RhbENhcGFjaXR5KG5ldHdvcmspO1xuXHRcdHVwZGF0ZVVJKCk7XG5cdH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhIG5ldXJhbCBuZXR3b3JrLCBpdCBhc2tzIHRoZSBuZXR3b3JrIGZvciB0aGUgb3V0cHV0IChwcmVkaWN0aW9uKVxuICogb2YgZXZlcnkgbm9kZSBpbiB0aGUgbmV0d29yayB1c2luZyBpbnB1dHMgc2FtcGxlZCBvbiBhIHNxdWFyZSBncmlkLlxuICogSXQgcmV0dXJucyBhIG1hcCB3aGVyZSBlYWNoIGtleSBpcyB0aGUgbm9kZSBJRCBhbmQgdGhlIHZhbHVlIGlzIGEgc3F1YXJlXG4gKiBtYXRyaXggb2YgdGhlIG91dHB1dHMgb2YgdGhlIG5ldHdvcmsgZm9yIGVhY2ggaW5wdXQgaW4gdGhlIGdyaWQgcmVzcGVjdGl2ZWx5LlxuICovXG5cbmZ1bmN0aW9uIHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yazogbm4uTm9kZVtdW10sIGZpcnN0VGltZTogYm9vbGVhbikge1xuXHRpZiAoZmlyc3RUaW1lKSB7XG5cdFx0Ym91bmRhcnkgPSB7fTtcblx0XHRubi5mb3JFYWNoTm9kZShuZXR3b3JrLCB0cnVlLCBub2RlID0+IHtcblx0XHRcdGJvdW5kYXJ5W25vZGUuaWRdID0gbmV3IEFycmF5KERFTlNJVFkpO1xuXHRcdH0pO1xuXHRcdC8vIEdvIHRocm91Z2ggYWxsIHByZWRlZmluZWQgaW5wdXRzLlxuXHRcdGZvciAobGV0IG5vZGVJZCBpbiBJTlBVVFMpIHtcblx0XHRcdGJvdW5kYXJ5W25vZGVJZF0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XG5cdFx0fVxuXHR9XG5cdGxldCB4U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIERFTlNJVFkgLSAxXSkucmFuZ2UoeERvbWFpbik7XG5cdGxldCB5U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW0RFTlNJVFkgLSAxLCAwXSkucmFuZ2UoeERvbWFpbik7XG5cblx0bGV0IGkgPSAwLCBqID0gMDtcblx0Zm9yIChpID0gMDsgaSA8IERFTlNJVFk7IGkrKykge1xuXHRcdGlmIChmaXJzdFRpbWUpIHtcblx0XHRcdG5uLmZvckVhY2hOb2RlKG5ldHdvcmssIHRydWUsIG5vZGUgPT4ge1xuXHRcdFx0XHRib3VuZGFyeVtub2RlLmlkXVtpXSA9IG5ldyBBcnJheShERU5TSVRZKTtcblx0XHRcdH0pO1xuXHRcdFx0Ly8gR28gdGhyb3VnaCBhbGwgcHJlZGVmaW5lZCBpbnB1dHMuXG5cdFx0XHRmb3IgKGxldCBub2RlSWQgaW4gSU5QVVRTKSB7XG5cdFx0XHRcdGJvdW5kYXJ5W25vZGVJZF1baV0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAoaiA9IDA7IGogPCBERU5TSVRZOyBqKyspIHtcblx0XHRcdC8vIDEgZm9yIHBvaW50cyBpbnNpZGUgdGhlIGNpcmNsZSwgYW5kIDAgZm9yIHBvaW50cyBvdXRzaWRlIHRoZSBjaXJjbGUuXG5cdFx0XHRsZXQgeCA9IHhTY2FsZShpKTtcblx0XHRcdGxldCB5ID0geVNjYWxlKGopO1xuXHRcdFx0bGV0IGlucHV0ID0gY29uc3RydWN0SW5wdXQoeCwgeSk7XG5cdFx0XHRubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XG5cdFx0XHRubi5mb3JFYWNoTm9kZShuZXR3b3JrLCB0cnVlLCBub2RlID0+IHtcblx0XHRcdFx0Ym91bmRhcnlbbm9kZS5pZF1baV1bal0gPSBub2RlLm91dHB1dDtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKGZpcnN0VGltZSkge1xuXHRcdFx0XHQvLyBHbyB0aHJvdWdoIGFsbCBwcmVkZWZpbmVkIGlucHV0cy5cblx0XHRcdFx0Zm9yIChsZXQgbm9kZUlkIGluIElOUFVUUykge1xuXHRcdFx0XHRcdGJvdW5kYXJ5W25vZGVJZF1baV1bal0gPSBJTlBVVFNbbm9kZUlkXS5mKHgsIHkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFueUFsaXZlT3V0cHV0TGlua3Mobm9kZTogTm9kZSk6IGJvb2xlYW4ge1xuXHRsZXQgbGluazogTGluaztcblx0Zm9yIChsaW5rIG9mIG5vZGUub3V0cHV0cykge1xuXHRcdGlmICghbGluay5pc0RlYWQgJiYgIWxpbmsuaXNSZXNpZHVhbCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gYW55QWxpdmVJbnB1dExpbmtzKG5vZGU6IE5vZGUpOiBib29sZWFuIHtcblx0bGV0IGxpbms6IExpbms7XG5cdGZvciAobGluayBvZiBub2RlLmlucHV0TGlua3MpIHtcblx0XHRpZiAoIWxpbmsuaXNEZWFkICYmICFsaW5rLmlzUmVzaWR1YWwpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cblxuZnVuY3Rpb24gZ2V0VW5pcXVlSW5Ob2RlcyhsYXllcjogbm4uTm9kZVtdLCBpc091dHB1dE5vZGU6IGJvb2xlYW4gPSBmYWxzZSk6IG5uLk5vZGVbXSB7XG5cdGxldCB1bmlxdWVJbk5vZGVzOiBubi5Ob2RlW10gPSBbXTtcblx0Zm9yIChsZXQgbm9kZSBvZiBsYXllcikge1xuXHRcdGlmIChhbnlBbGl2ZU91dHB1dExpbmtzKG5vZGUpIHx8IGlzT3V0cHV0Tm9kZSkgeyAvLyBOb2RlIGlzIGFsaXZlIGFuZCBwcm9kdWNlcyBvdXRwdXRcblx0XHRcdGxldCBpbkxpbmtzID0gbm9kZS5pbnB1dExpbmtzO1xuXHRcdFx0bGV0IGxpbms6IExpbms7XG5cdFx0XHRmb3IgKGxpbmsgb2YgaW5MaW5rcykge1xuXHRcdFx0XHRpZiAoIWxpbmsuaXNSZXNpZHVhbCAmJiAhbGluay5pc0RlYWQgJiYgKGxpbmsuc291cmNlLmxheWVyID09PSAwIHx8IGFueUFsaXZlSW5wdXRMaW5rcyhsaW5rLnNvdXJjZSkpKSB7XG5cdFx0XHRcdFx0bGV0IGluTm9kZTogTm9kZSA9IGxpbmsuc291cmNlO1xuXHRcdFx0XHRcdGlmICh1bmlxdWVJbk5vZGVzLmluZGV4T2YoaW5Ob2RlKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdHVuaXF1ZUluTm9kZXMucHVzaChpbk5vZGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gdW5pcXVlSW5Ob2Rlcztcbn1cblxuZnVuY3Rpb24gaXNJbkFycmF5KGNhbmRpZGF0ZSwgYXJyYXkpIHtcblx0Zm9yIChsZXQgZSBvZiBhcnJheSkge1xuXHRcdGlmIChlWzBdID09IGNhbmRpZGF0ZVswXSAmJiBlWzFdID09IGNhbmRpZGF0ZVsxXSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0VG90YWxDYXBhY2l0eShuZXR3b3JrOiBubi5Ob2RlW11bXSk6IG51bWJlciB7XG5cdGxldCB0b3RhbENhcGFjaXR5OiBudW1iZXIgPSAwO1xuXHRsZXQgW3Byb3BvZ2F0ZWRJbmZvcm1hdGlvbiwgYWxpdmVOb2Rlc10gPSBnZXRQcm9wb2dhdGVkSW5mb3JtYXRpb24obmV0d29yayk7XG5cdGxldCBmaXJzdExheWVyID0gbmV0d29ya1sxXTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBmaXJzdExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IG5vZGU6IE5vZGUgPSBmaXJzdExheWVyW2ldO1xuXHRcdGlmIChhbnlBbGl2ZU91dHB1dExpbmtzKG5vZGUpIHx8IDEgPT0gbmV0d29yay5sZW5ndGggLSAxKSB7IC8vIE5vZGUgaXMgYWxpdmUgYW5kIHByb2R1Y2VzIG91dHB1dFxuXHRcdFx0dG90YWxDYXBhY2l0eSArPSBnZXRVbmlxdWVJbk5vZGVzKFtub2RlXSwgMSA9PT0gbmV0d29yay5sZW5ndGggLSAxKS5sZW5ndGggKyAxO1xuXHRcdH1cblx0fVxuXHRsZXQgdXNlZFJlc2lkdWFsTGF5ZXJzID0gW107XG5cdGZvciAobGV0IGxheWVySWR4ID0gMDsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aDsgbGF5ZXJJZHgrKykge1xuXHRcdGZvciAobGV0IG5vZGUgb2YgbmV0d29ya1tsYXllcklkeF0pIHtcblx0XHRcdGxldCBvdXRwdXRMaW5rczogTGlua1tdID0gbm9kZS5vdXRwdXRzO1xuXHRcdFx0Y29uc3QgcmVzaWR1YWxMaW5rczogTGlua1tdID0gb3V0cHV0TGlua3MuZmlsdGVyKGZ1bmN0aW9uIChsaW5rKSB7XG5cdFx0XHRcdHJldHVybiBsaW5rLmlzUmVzaWR1YWwgJiYgIWxpbmsuaXNEZWFkO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXNpZHVhbExpbmtzLnNvcnQoKGEsIGIpID0+IGEuZGVzdC5sYXllciAtIGIuZGVzdC5sYXllcik7XG5cdFx0XHRmb3IgKGxldCBsaW5rIG9mIHJlc2lkdWFsTGlua3MpIHtcblx0XHRcdFx0aWYgKGlzSW5BcnJheShbbGluay5zb3VyY2UsIGxpbmsuZGVzdC5sYXllcl0sIHVzZWRSZXNpZHVhbExheWVycykpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgZGVzdElkeCA9IGxpbmsuZGVzdC5sYXllciAtIDE7XG5cdFx0XHRcdHByb3BvZ2F0ZWRJbmZvcm1hdGlvbltkZXN0SWR4XSArPSAxO1xuXHRcdFx0XHRmb3IgKGxldCBqID0gZGVzdElkeCArIDE7IGogPCBwcm9wb2dhdGVkSW5mb3JtYXRpb24ubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhqLCBhbGl2ZU5vZGVzW2pdLCBwcm9wb2dhdGVkSW5mb3JtYXRpb25bal0pO1xuXHRcdFx0XHRcdGlmIChhbGl2ZU5vZGVzW2pdID4gcHJvcG9nYXRlZEluZm9ybWF0aW9uW2pdKSB7XG5cdFx0XHRcdFx0XHRwcm9wb2dhdGVkSW5mb3JtYXRpb25bal0gKz0gMTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHVzZWRSZXNpZHVhbExheWVycy5wdXNoKFtsaW5rLnNvdXJjZSwgbGluay5kZXN0LmxheWVyXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHRvdGFsQ2FwYWNpdHkgKz0gcHJvcG9nYXRlZEluZm9ybWF0aW9uLnNsaWNlKDEpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xuXHRyZXR1cm4gdG90YWxDYXBhY2l0eTtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcG9nYXRlZEluZm9ybWF0aW9uKG5ldHdvcms6IG5uLk5vZGVbXVtdKTogbnVtYmVyW11bXSB7XG5cdGxldCBwcm9wb2dhdGVkSW5mb3JtYXRpb24gPSBbXTtcblx0bGV0IGFsaXZlTm9kZXMgPSBbXTtcblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1ckxheWVyQ2FwYWNpdHkgPSAwO1xuXHRcdGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcblx0XHRpZiAoMSA9PT0gbGF5ZXJJZHgpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGxldCBub2RlOiBOb2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0XHRpZiAoYW55QWxpdmVPdXRwdXRMaW5rcyhub2RlKSB8fCBsYXllcklkeCA9PSBuZXR3b3JrLmxlbmd0aCAtIDEpIHsgLy8gTm9kZSBpcyBhbGl2ZSBhbmQgcHJvZHVjZXMgb3V0cHV0XG5cdFx0XHRcdFx0Y3VyTGF5ZXJDYXBhY2l0eSArPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRhbGl2ZU5vZGVzLnB1c2goY3VyTGF5ZXJDYXBhY2l0eSk7XG5cdFx0XHRwcm9wb2dhdGVkSW5mb3JtYXRpb24ucHVzaChjdXJMYXllckNhcGFjaXR5KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IHVuaXF1ZUluTm9kZXM6IG5uLk5vZGVbXSA9IGdldFVuaXF1ZUluTm9kZXMoY3VycmVudExheWVyLCBsYXllcklkeCA9PT0gbmV0d29yay5sZW5ndGggLSAxKTtcblx0XHRcdGxldCBtaW5MYXllciA9IHVuaXF1ZUluTm9kZXMubGVuZ3RoO1xuXHRcdFx0YWxpdmVOb2Rlcy5wdXNoKG1pbkxheWVyKTtcblx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgbGF5ZXJJZHg7IGkrKykge1xuXHRcdFx0XHRsZXQgdW5pcXVlSW5Ob2Rlczogbm4uTm9kZVtdID0gZ2V0VW5pcXVlSW5Ob2RlcyhuZXR3b3JrW2ldLCBmYWxzZSk7XG5cdFx0XHRcdGxldCB0ZW1wTWluTGF5ZXIgPSB1bmlxdWVJbk5vZGVzLmxlbmd0aDtcblx0XHRcdFx0aWYgKHRlbXBNaW5MYXllciA8IG1pbkxheWVyKSB7XG5cdFx0XHRcdFx0bWluTGF5ZXIgPSB0ZW1wTWluTGF5ZXI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGN1ckxheWVyQ2FwYWNpdHkgKz0gbWluTGF5ZXI7XG5cdFx0XHRwcm9wb2dhdGVkSW5mb3JtYXRpb24ucHVzaChjdXJMYXllckNhcGFjaXR5KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIFtwcm9wb2dhdGVkSW5mb3JtYXRpb24sIGFsaXZlTm9kZXNdO1xufVxuXG5cbmZ1bmN0aW9uIGdldExlYXJuaW5nUmF0ZShuZXR3b3JrOiBubi5Ob2RlW11bXSk6IG51bWJlciB7XG5cdGxldCB0cnVlTGVhcm5pbmdSYXRlID0gMDtcblxuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VyTGF5ZXJDYXBhY2l0eSA9IDA7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXG5cdFx0Ly8gVXBkYXRlIGFsbCB0aGUgbm9kZXMgaW4gdGhpcyBsYXllci5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHR0cnVlTGVhcm5pbmdSYXRlICs9IG5vZGUudHJ1ZUxlYXJuaW5nUmF0ZTtcblxuXHRcdH1cblx0fVxuXHRyZXR1cm4gdHJ1ZUxlYXJuaW5nUmF0ZTtcbn1cblxuZnVuY3Rpb24gZ2V0TG9zcyhuZXR3b3JrOiBubi5Ob2RlW11bXSwgZGF0YVBvaW50czogRXhhbXBsZTJEW10pOiBudW1iZXIge1xuXHRsZXQgbG9zcyA9IDA7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBkYXRhUG9pbnQgPSBkYXRhUG9pbnRzW2ldO1xuXHRcdGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KGRhdGFQb2ludC54LCBkYXRhUG9pbnQueSk7XG5cdFx0bGV0IG91dHB1dCA9IG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcblx0XHRsb3NzICs9IG5uLkVycm9ycy5TUVVBUkUuZXJyb3Iob3V0cHV0LCBkYXRhUG9pbnQubGFiZWwpO1xuXHR9XG5cdHJldHVybiBsb3NzIC8gZGF0YVBvaW50cy5sZW5ndGggKiAxMDA7XG59XG5cbmZ1bmN0aW9uIGdldE51bWJlck9mQ29ycmVjdENsYXNzaWZpY2F0aW9ucyhuZXR3b3JrOiBubi5Ob2RlW11bXSwgZGF0YVBvaW50czogRXhhbXBsZTJEW10pOiBudW1iZXIge1xuXHRsZXQgY29ycmVjdGx5Q2xhc3NpZmllZCA9IDA7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBkYXRhUG9pbnQgPSBkYXRhUG9pbnRzW2ldO1xuXHRcdGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KGRhdGFQb2ludC54LCBkYXRhUG9pbnQueSk7XG5cdFx0bGV0IG91dHB1dCA9IG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcblx0XHRsZXQgcHJlZGljdGlvbiA9IChvdXRwdXQgPiAwKSA/IDEgOiAtMTtcblx0XHRsZXQgY29ycmVjdCA9IChwcmVkaWN0aW9uID09PSBkYXRhUG9pbnQubGFiZWwpID8gMSA6IDA7XG5cdFx0Y29ycmVjdGx5Q2xhc3NpZmllZCArPSBjb3JyZWN0O1xuXHR9XG5cblx0cmV0dXJuIGNvcnJlY3RseUNsYXNzaWZpZWQ7XG59XG5cbmZ1bmN0aW9uIGdldE51bWJlck9mRWFjaENsYXNzKGRhdGFQb2ludHM6IEV4YW1wbGUyRFtdKTogbnVtYmVyW10ge1xuXHRsZXQgZmlyc3RDbGFzczogbnVtYmVyID0gMDtcblx0bGV0IHNlY29uZENsYXNzOiBudW1iZXIgPSAwO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFQb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgZGF0YVBvaW50ID0gZGF0YVBvaW50c1tpXTtcblx0XHRmaXJzdENsYXNzICs9IChkYXRhUG9pbnQubGFiZWwgPT09IC0xKSA/IDEgOiAwO1xuXHRcdHNlY29uZENsYXNzICs9IChkYXRhUG9pbnQubGFiZWwgPT09IDEpID8gMSA6IDA7XG5cdH1cblx0cmV0dXJuIFtmaXJzdENsYXNzLCBzZWNvbmRDbGFzc107XG59XG5cbmZ1bmN0aW9uIGdldEFjY3VyYWN5Rm9yRWFjaENsYXNzKG5ldHdvcms6IG5uLk5vZGVbXVtdLCBkYXRhUG9pbnRzOiBFeGFtcGxlMkRbXSk6IG51bWJlcltdIHtcblx0bGV0IGZpcnN0Q2xhc3NDb3JyZWN0OiBudW1iZXIgPSAwO1xuXHRsZXQgc2Vjb25kQ2xhc3NDb3JyZWN0OiBudW1iZXIgPSAwO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFQb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgZGF0YVBvaW50ID0gZGF0YVBvaW50c1tpXTtcblx0XHRsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dChkYXRhUG9pbnQueCwgZGF0YVBvaW50LnkpO1xuXHRcdGxldCBvdXRwdXQgPSBubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XG5cdFx0bGV0IHByZWRpY3Rpb24gPSAob3V0cHV0ID4gMCkgPyAxIDogLTE7XG5cdFx0bGV0IGlzQ29ycmVjdCA9IHByZWRpY3Rpb24gPT09IGRhdGFQb2ludC5sYWJlbDtcblx0XHRpZiAoaXNDb3JyZWN0KSB7XG5cdFx0XHRpZiAoZGF0YVBvaW50LmxhYmVsID09PSAtMSkge1xuXHRcdFx0XHRmaXJzdENsYXNzQ29ycmVjdCArPSAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2Vjb25kQ2xhc3NDb3JyZWN0ICs9IDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblx0bGV0IGNsYXNzZXNDb3VudDogbnVtYmVyW10gPSBnZXROdW1iZXJPZkVhY2hDbGFzcyhkYXRhUG9pbnRzKTtcblx0cmV0dXJuIFtmaXJzdENsYXNzQ29ycmVjdCAvIGNsYXNzZXNDb3VudFswXSwgc2Vjb25kQ2xhc3NDb3JyZWN0IC8gY2xhc3Nlc0NvdW50WzFdXTtcbn1cblxuXG5mdW5jdGlvbiB1cGRhdGVVSShmaXJzdFN0ZXAgPSBmYWxzZSkge1xuXHQvLyBVcGRhdGUgdGhlIGxpbmtzIHZpc3VhbGx5LlxuXHR1cGRhdGVXZWlnaHRzVUkobmV0d29yaywgZDMuc2VsZWN0KFwiZy5jb3JlXCIpKTtcblx0Ly8gVXBkYXRlIHRoZSBiaWFzIHZhbHVlcyB2aXN1YWxseS5cblx0dXBkYXRlQmlhc2VzVUkobmV0d29yayk7XG5cdC8vIEdldCB0aGUgZGVjaXNpb24gYm91bmRhcnkgb2YgdGhlIG5ldHdvcmsuXG5cdHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmlyc3RTdGVwKTtcblx0bGV0IHNlbGVjdGVkSWQgPSBzZWxlY3RlZE5vZGVJZCAhPSBudWxsID9cblx0XHRzZWxlY3RlZE5vZGVJZCA6IG5uLmdldE91dHB1dE5vZGUobmV0d29yaykuaWQ7XG5cdGhlYXRNYXAudXBkYXRlQmFja2dyb3VuZChib3VuZGFyeVtzZWxlY3RlZElkXSwgc3RhdGUuZGlzY3JldGl6ZSk7XG5cblx0Ly8gVXBkYXRlIGFsbCBkZWNpc2lvbiBib3VuZGFyaWVzLlxuXHRkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5zZWxlY3RBbGwoXCJkaXYuY2FudmFzXCIpXG5cdFx0LmVhY2goZnVuY3Rpb24gKGRhdGE6IHsgaGVhdG1hcDogSGVhdE1hcCwgaWQ6IHN0cmluZyB9KSB7XG5cdFx0XHRkYXRhLmhlYXRtYXAudXBkYXRlQmFja2dyb3VuZChyZWR1Y2VNYXRyaXgoYm91bmRhcnlbZGF0YS5pZF0sIDEwKSwgc3RhdGUuZGlzY3JldGl6ZSk7XG5cdFx0fSk7XG5cblx0ZnVuY3Rpb24gemVyb1BhZChuOiBudW1iZXIpOiBzdHJpbmcge1xuXHRcdGxldCBwYWQgPSBcIjAwMDAwMFwiO1xuXHRcdHJldHVybiAocGFkICsgbikuc2xpY2UoLXBhZC5sZW5ndGgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWRkQ29tbWFzKHM6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHMucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgXCIsXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaHVtYW5SZWFkYWJsZShuOiBudW1iZXIsIGsgPSA0KTogc3RyaW5nIHtcblx0XHRyZXR1cm4gbi50b0ZpeGVkKGspO1xuXHR9XG5cblx0ZnVuY3Rpb24gaHVtYW5SZWFkYWJsZUludChuOiBudW1iZXIpOiBzdHJpbmcge1xuXHRcdHJldHVybiBuLnRvRml4ZWQoMCk7XG5cdH1cblxuXHQvLyBVcGRhdGUgdHJ1ZSBsZWFybmluZyByYXRlIGxvc3MgYW5kIGl0ZXJhdGlvbiBudW1iZXIuXG5cdC8vIFRoZXNlIGFyZSBhbGwgYml0IHJhdGVzLCBoZW5jZSB0aGV5IGFyZSBjaGFubmVsIHNpZ25hbHNcblx0bGV0IG51bWJlck9mQ29ycmVjdFRyYWluQ2xhc3NpZmljYXRpb25zOiBudW1iZXIgPSBnZXROdW1iZXJPZkNvcnJlY3RDbGFzc2lmaWNhdGlvbnMobmV0d29yaywgdHJhaW5EYXRhKTtcblx0bGV0IG51bWJlck9mQ29ycmVjdFRlc3RDbGFzc2lmaWNhdGlvbnM6IG51bWJlciA9IGdldE51bWJlck9mQ29ycmVjdENsYXNzaWZpY2F0aW9ucyhuZXR3b3JrLCB0ZXN0RGF0YSk7XG5cdGdlbmVyYWxpemF0aW9uID0gKG51bWJlck9mQ29ycmVjdFRyYWluQ2xhc3NpZmljYXRpb25zICsgbnVtYmVyT2ZDb3JyZWN0VGVzdENsYXNzaWZpY2F0aW9ucykgLyB0b3RhbENhcGFjaXR5O1xuXG5cdGxldCBiaXRMb3NzVGVzdCA9IGxvc3NUZXN0O1xuXHRsZXQgYml0TG9zc1RyYWluID0gbG9zc1RyYWluO1xuXHRsZXQgYml0R2VuZXJhbGl6YXRpb24gPSBnZW5lcmFsaXphdGlvbjtcblxuXHR0b3RhbENhcGFjaXR5ID0gZ2V0VG90YWxDYXBhY2l0eShuZXR3b3JrKTtcblx0c3RhdGUuc3VnQ2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzBdO1xuXHRzdGF0ZS5tYXhDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMV07XG5cblxuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCIjbG9zcy10cmFpblwiKS50ZXh0KGh1bWFuUmVhZGFibGUoYml0TG9zc1RyYWluKSk7XG5cdGQzLnNlbGVjdChcIiNsb3NzLXRlc3RcIikudGV4dChodW1hblJlYWRhYmxlKGJpdExvc3NUZXN0KSk7XG5cdGQzLnNlbGVjdChcIiNnZW5lcmFsaXphdGlvblwiKS50ZXh0KGh1bWFuUmVhZGFibGUoYml0R2VuZXJhbGl6YXRpb24sIDMpKTtcblx0ZDMuc2VsZWN0KFwiI3RyYWluLWFjY3VyYWN5LWZpcnN0XCIpLnRleHQoaHVtYW5SZWFkYWJsZSh0cmFpbkNsYXNzZXNBY2N1cmFjeVswXSkpO1xuXHRkMy5zZWxlY3QoXCIjdHJhaW4tYWNjdXJhY3ktc2Vjb25kXCIpLnRleHQoaHVtYW5SZWFkYWJsZSh0cmFpbkNsYXNzZXNBY2N1cmFjeVsxXSkpO1xuXHRkMy5zZWxlY3QoXCIjdGVzdC1hY2N1cmFjeS1maXJzdFwiKS50ZXh0KGh1bWFuUmVhZGFibGUodGVzdENsYXNzZXNBY2N1cmFjeVswXSkpO1xuXHRkMy5zZWxlY3QoXCIjdGVzdC1hY2N1cmFjeS1zZWNvbmRcIikudGV4dChodW1hblJlYWRhYmxlKHRlc3RDbGFzc2VzQWNjdXJhY3lbMV0pKTtcblx0ZDMuc2VsZWN0KFwiI2l0ZXItbnVtYmVyXCIpLnRleHQoYWRkQ29tbWFzKHplcm9QYWQoaXRlcikpKTtcblx0ZDMuc2VsZWN0KFwiI3RvdGFsLWNhcGFjaXR5XCIpLnRleHQoaHVtYW5SZWFkYWJsZUludCh0b3RhbENhcGFjaXR5KSk7XG5cdGxpbmVDaGFydC5hZGREYXRhUG9pbnQoW2xvc3NUcmFpbiwgbG9zc1Rlc3RdKTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0SW5wdXRJZHMoKTogc3RyaW5nW10ge1xuXHRsZXQgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xuXHRmb3IgKGxldCBpbnB1dE5hbWUgaW4gSU5QVVRTKSB7XG5cdFx0aWYgKHN0YXRlW2lucHV0TmFtZV0pIHtcblx0XHRcdHJlc3VsdC5wdXNoKGlucHV0TmFtZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdElucHV0KHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyW10ge1xuXHRsZXQgaW5wdXQ6IG51bWJlcltdID0gW107XG5cdGZvciAobGV0IGlucHV0TmFtZSBpbiBJTlBVVFMpIHtcblx0XHRpZiAoc3RhdGVbaW5wdXROYW1lXSkge1xuXHRcdFx0aW5wdXQucHVzaChJTlBVVFNbaW5wdXROYW1lXS5mKHgsIHkpKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGlucHV0O1xufVxuXG5mdW5jdGlvbiBvbmVTdGVwKCk6IHZvaWQge1xuXHRpdGVyKys7XG5cdHRyYWluRGF0YS5mb3JFYWNoKChwb2ludCwgaSkgPT4ge1xuXHRcdGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KHBvaW50LngsIHBvaW50LnkpO1xuXHRcdG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcblx0XHRubi5iYWNrUHJvcChuZXR3b3JrLCBwb2ludC5sYWJlbCwgbm4uRXJyb3JzLlNRVUFSRSk7XG5cdFx0aWYgKChpICsgMSkgJSBzdGF0ZS5iYXRjaFNpemUgPT09IDApIHtcblx0XHRcdG5uLnVwZGF0ZVdlaWdodHMobmV0d29yaywgc3RhdGUubGVhcm5pbmdSYXRlLCBzdGF0ZS5yZWd1bGFyaXphdGlvblJhdGUpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gQ29tcHV0ZSB0aGUgbG9zcy5cblx0dHJ1ZUxlYXJuaW5nUmF0ZSA9IGdldExlYXJuaW5nUmF0ZShuZXR3b3JrKTtcblx0dG90YWxDYXBhY2l0eSA9IGdldFRvdGFsQ2FwYWNpdHkobmV0d29yayk7XG5cblx0bG9zc1RyYWluID0gZ2V0TG9zcyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuXHRsb3NzVGVzdCA9IGdldExvc3MobmV0d29yaywgdGVzdERhdGEpO1xuXG5cdHRyYWluQ2xhc3Nlc0FjY3VyYWN5ID0gZ2V0QWNjdXJhY3lGb3JFYWNoQ2xhc3MobmV0d29yaywgdHJhaW5EYXRhKTtcblx0dGVzdENsYXNzZXNBY2N1cmFjeSA9IGdldEFjY3VyYWN5Rm9yRWFjaENsYXNzKG5ldHdvcmssIHRlc3REYXRhKTtcblxuXHR1cGRhdGVVSSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3V0cHV0V2VpZ2h0cyhuZXR3b3JrOiBubi5Ob2RlW11bXSk6IG51bWJlcltdIHtcblx0bGV0IHdlaWdodHM6IG51bWJlcltdID0gW107XG5cdGZvciAobGV0IGxheWVySWR4ID0gMDsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aCAtIDE7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBub2RlLm91dHB1dHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0bGV0IG91dHB1dCA9IG5vZGUub3V0cHV0c1tqXTtcblx0XHRcdFx0d2VpZ2h0cy5wdXNoKG91dHB1dC53ZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gd2VpZ2h0cztcbn1cblxuZnVuY3Rpb24gcmVzZXQob25TdGFydHVwID0gZmFsc2UpIHtcblx0bGluZUNoYXJ0LnJlc2V0KCk7XG5cdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRpZiAoIW9uU3RhcnR1cCkge1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdH1cblx0cGxheWVyLnBhdXNlKCk7XG5cblx0bGV0IHN1ZmZpeCA9IHN0YXRlLm51bUhpZGRlbkxheWVycyAhPT0gMSA/IFwic1wiIDogXCJcIjtcblx0ZDMuc2VsZWN0KFwiI2xheWVycy1sYWJlbFwiKS50ZXh0KFwiSGlkZGVuIGxheWVyXCIgKyBzdWZmaXgpO1xuXHRkMy5zZWxlY3QoXCIjbnVtLWxheWVyc1wiKS50ZXh0KHN0YXRlLm51bUhpZGRlbkxheWVycyk7XG5cblxuXHQvLyBNYWtlIGEgc2ltcGxlIG5ldHdvcmsuXG5cdGl0ZXIgPSAwO1xuXHRsZXQgbnVtSW5wdXRzID0gY29uc3RydWN0SW5wdXQoMCwgMCkubGVuZ3RoO1xuXHRsZXQgc2hhcGUgPSBbbnVtSW5wdXRzXS5jb25jYXQoc3RhdGUubmV0d29ya1NoYXBlKS5jb25jYXQoWzFdKTtcblx0bGV0IG91dHB1dEFjdGl2YXRpb24gPSAoc3RhdGUucHJvYmxlbSA9PT0gUHJvYmxlbS5SRUdSRVNTSU9OKSA/XG5cdFx0bm4uQWN0aXZhdGlvbnMuTElORUFSIDogbm4uQWN0aXZhdGlvbnMuVEFOSDtcblx0bmV0d29yayA9IG5uLmJ1aWxkTmV0d29yayhzaGFwZSwgc3RhdGUuYWN0aXZhdGlvbiwgb3V0cHV0QWN0aXZhdGlvbixcblx0XHRzdGF0ZS5yZWd1bGFyaXphdGlvbiwgY29uc3RydWN0SW5wdXRJZHMoKSwgc3RhdGUuaW5pdFplcm8pO1xuXHR0cnVlTGVhcm5pbmdSYXRlID0gZ2V0TGVhcm5pbmdSYXRlKG5ldHdvcmspO1xuXHR0b3RhbENhcGFjaXR5ID0gZ2V0VG90YWxDYXBhY2l0eShuZXR3b3JrKTtcblx0bG9zc1Rlc3QgPSBnZXRMb3NzKG5ldHdvcmssIHRlc3REYXRhKTtcblx0bG9zc1RyYWluID0gZ2V0TG9zcyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuXG5cdGxldCBudW1iZXJPZkNvcnJlY3RUcmFpbkNsYXNzaWZpY2F0aW9uczogbnVtYmVyID0gZ2V0TnVtYmVyT2ZDb3JyZWN0Q2xhc3NpZmljYXRpb25zKG5ldHdvcmssIHRyYWluRGF0YSk7XG5cdGxldCBudW1iZXJPZkNvcnJlY3RUZXN0Q2xhc3NpZmljYXRpb25zOiBudW1iZXIgPSBnZXROdW1iZXJPZkNvcnJlY3RDbGFzc2lmaWNhdGlvbnMobmV0d29yaywgdGVzdERhdGEpO1xuXG5cdGdlbmVyYWxpemF0aW9uID0gKG51bWJlck9mQ29ycmVjdFRyYWluQ2xhc3NpZmljYXRpb25zICsgbnVtYmVyT2ZDb3JyZWN0VGVzdENsYXNzaWZpY2F0aW9ucykgLyB0b3RhbENhcGFjaXR5O1xuXG5cdHRyYWluQ2xhc3Nlc0FjY3VyYWN5ID0gZ2V0QWNjdXJhY3lGb3JFYWNoQ2xhc3MobmV0d29yaywgdHJhaW5EYXRhKTtcblx0dGVzdENsYXNzZXNBY2N1cmFjeSA9IGdldEFjY3VyYWN5Rm9yRWFjaENsYXNzKG5ldHdvcmssIHRlc3REYXRhKTtcblxuXHRkcmF3TmV0d29yayhuZXR3b3JrKTtcblx0dXBkYXRlVUkodHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGluaXRUdXRvcmlhbCgpIHtcblx0aWYgKHN0YXRlLnR1dG9yaWFsID09IG51bGwgfHwgc3RhdGUudHV0b3JpYWwgPT09IFwiXCIgfHwgc3RhdGUuaGlkZVRleHQpIHtcblx0XHRyZXR1cm47XG5cdH1cblx0Ly8gUmVtb3ZlIGFsbCBvdGhlciB0ZXh0LlxuXHRkMy5zZWxlY3RBbGwoXCJhcnRpY2xlIGRpdi5sLS1ib2R5XCIpLnJlbW92ZSgpO1xuXHRsZXQgdHV0b3JpYWwgPSBkMy5zZWxlY3QoXCJhcnRpY2xlXCIpLmFwcGVuZChcImRpdlwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsLS1ib2R5XCIpO1xuXHQvLyBJbnNlcnQgdHV0b3JpYWwgdGV4dC5cblx0ZDMuaHRtbChgdHV0b3JpYWxzLyR7c3RhdGUudHV0b3JpYWx9Lmh0bWxgLCAoZXJyLCBodG1sRnJhZ21lbnQpID0+IHtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHR0aHJvdyBlcnI7XG5cdFx0fVxuXHRcdHR1dG9yaWFsLm5vZGUoKS5hcHBlbmRDaGlsZChodG1sRnJhZ21lbnQpO1xuXHRcdC8vIElmIHRoZSB0dXRvcmlhbCBoYXMgYSA8dGl0bGU+IHRhZywgc2V0IHRoZSBwYWdlIHRpdGxlIHRvIHRoYXQuXG5cdFx0bGV0IHRpdGxlID0gdHV0b3JpYWwuc2VsZWN0KFwidGl0bGVcIik7XG5cdFx0aWYgKHRpdGxlLnNpemUoKSkge1xuXHRcdFx0ZDMuc2VsZWN0KFwiaGVhZGVyIGgxXCIpLnN0eWxlKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJtYXJnaW4tdG9wXCI6IFwiMjBweFwiLFxuXHRcdFx0XHRcdFwibWFyZ2luLWJvdHRvbVwiOiBcIjIwcHhcIixcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRleHQodGl0bGUudGV4dCgpKTtcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGUudGV4dCgpO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclRodW1ibmFpbChjYW52YXMsIGRhdGFHZW5lcmF0b3IpIHtcblx0bGV0IHcgPSAxMDA7XG5cdGxldCBoID0gMTAwO1xuXHRjYW52YXMuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgdyk7XG5cdGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgaCk7XG5cdGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblx0bGV0IGRhdGEgPSBkYXRhR2VuZXJhdG9yKDIwMCwgNTApOyAvLyBOUE9JTlRTLCBOT0lTRVxuXG5cdGRhdGEuZm9yRWFjaChcblx0XHRmdW5jdGlvbiAoZCkge1xuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBjb2xvclNjYWxlKGQubGFiZWwpO1xuXHRcdFx0Y29udGV4dC5maWxsUmVjdCh3ICogKGQueCArIDYpIC8gMTIsIGggKiAoLWQueSArIDYpIC8gMTIsIDQsIDQpO1xuXHRcdH0pO1xuXHRkMy5zZWxlY3QoY2FudmFzLnBhcmVudE5vZGUpLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQllPRFRodW1ibmFpbChjYW52YXMpIHtcblx0Y2FudmFzLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIDEwMCk7XG5cdGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgMTAwKTtcblx0bGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRjb25zdCBwbHVzU3ZnID0gXCI8c3ZnIHZlcnNpb249XFxcIjEuMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB3aWR0aD1cXFwiMjRcXFwiIGhlaWdodD1cXFwiMjRcXFwiIHZpZXdCb3g9XFxcIjAgMCAyNCAyNFxcXCI+PHRpdGxlPmFkZDwvdGl0bGU+PHBhdGggZD1cXFwiTTE4Ljk4NCAxMi45ODRoLTZ2NmgtMS45Njl2LTZoLTZ2LTEuOTY5aDZ2LTZoMS45Njl2Nmg2djEuOTY5elxcXCI+PC9wYXRoPjwvc3ZnPlwiO1xuXHRjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcblx0Y29uc3Qgc3ZnID0gbmV3IEJsb2IoW3BsdXNTdmddLCB7dHlwZTogXCJpbWFnZS9zdmcreG1sXCJ9KTtcblx0Y29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChzdmcpO1xuXG5cdGltZy5zcmMgPSB1cmw7XG5cblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG5cdFx0Y29udGV4dC5kcmF3SW1hZ2UoaW1nLCAyNSwgMjUsIDUwLCA1MCk7XG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuXHR9O1xuXHRkMy5zZWxlY3QoY2FudmFzLnBhcmVudE5vZGUpLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKTtcbn1cblxuZnVuY3Rpb24gZHJhd0RhdGFzZXRUaHVtYm5haWxzKCkge1xuXHRkMy5zZWxlY3RBbGwoXCIuZGF0YXNldFwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXG5cdGlmIChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OKSB7XG5cdFx0Zm9yIChsZXQgZGF0YXNldCBpbiBkYXRhc2V0cykge1xuXHRcdFx0bGV0IGNhbnZhczogYW55ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2FudmFzW2RhdGEtZGF0YXNldD0ke2RhdGFzZXR9XWApO1xuXHRcdFx0bGV0IGRhdGFHZW5lcmF0b3IgPSBkYXRhc2V0c1tkYXRhc2V0XTtcblxuXHRcdFx0aWYgKGRhdGFzZXQgPT09IFwiYnlvZFwiKSB7XG5cdFx0XHRcdHJlbmRlckJZT0RUaHVtYm5haWwoY2FudmFzKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRyZW5kZXJUaHVtYm5haWwoY2FudmFzLCBkYXRhR2VuZXJhdG9yKTtcblxuXG5cdFx0fVxuXHR9XG5cdGlmIChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLlJFR1JFU1NJT04pIHtcblx0XHRmb3IgKGxldCByZWdEYXRhc2V0IGluIHJlZ0RhdGFzZXRzKSB7XG5cdFx0XHRsZXQgY2FudmFzOiBhbnkgPVxuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBjYW52YXNbZGF0YS1yZWdEYXRhc2V0PSR7cmVnRGF0YXNldH1dYCk7XG5cdFx0XHRsZXQgZGF0YUdlbmVyYXRvciA9IHJlZ0RhdGFzZXRzW3JlZ0RhdGFzZXRdO1xuXHRcdFx0cmVuZGVyVGh1bWJuYWlsKGNhbnZhcywgZGF0YUdlbmVyYXRvcik7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGhpZGVDb250cm9scygpIHtcblx0Ly8gU2V0IGRpc3BsYXk6bm9uZSB0byBhbGwgdGhlIFVJIGVsZW1lbnRzIHRoYXQgYXJlIGhpZGRlbi5cblx0bGV0IGhpZGRlblByb3BzID0gc3RhdGUuZ2V0SGlkZGVuUHJvcHMoKTtcblx0aGlkZGVuUHJvcHMuZm9yRWFjaChwcm9wID0+IHtcblx0XHRsZXQgY29udHJvbHMgPSBkMy5zZWxlY3RBbGwoYC51aS0ke3Byb3B9YCk7XG5cdFx0aWYgKGNvbnRyb2xzLnNpemUoKSA9PT0gMCkge1xuXHRcdFx0Y29uc29sZS53YXJuKGAwIGh0bWwgZWxlbWVudHMgZm91bmQgd2l0aCBjbGFzcyAudWktJHtwcm9wfWApO1xuXHRcdH1cblx0XHRjb250cm9scy5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHR9KTtcblxuXHQvLyBBbHNvIGFkZCBjaGVja2JveCBmb3IgZWFjaCBoaWRhYmxlIGNvbnRyb2wgaW4gdGhlIFwidXNlIGl0IGluIGNsYXNzcm9tXCJcblx0Ly8gc2VjdGlvbi5cblx0bGV0IGhpZGVDb250cm9scyA9IGQzLnNlbGVjdChcIi5oaWRlLWNvbnRyb2xzXCIpO1xuXHRISURBQkxFX0NPTlRST0xTLmZvckVhY2goKFt0ZXh0LCBpZF0pID0+IHtcblx0XHRsZXQgbGFiZWwgPSBoaWRlQ29udHJvbHMuYXBwZW5kKFwibGFiZWxcIilcblx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtZGwtY2hlY2tib3ggbWRsLWpzLWNoZWNrYm94IG1kbC1qcy1yaXBwbGUtZWZmZWN0XCIpO1xuXHRcdGxldCBpbnB1dCA9IGxhYmVsLmFwcGVuZChcImlucHV0XCIpXG5cdFx0XHQuYXR0cihcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHR5cGU6IFwiY2hlY2tib3hcIixcblx0XHRcdFx0XHRjbGFzczogXCJtZGwtY2hlY2tib3hfX2lucHV0XCIsXG5cdFx0XHRcdH0pO1xuXHRcdGlmIChoaWRkZW5Qcm9wcy5pbmRleE9mKGlkKSA9PT0gLTEpIHtcblx0XHRcdGlucHV0LmF0dHIoXCJjaGVja2VkXCIsIFwidHJ1ZVwiKTtcblx0XHR9XG5cdFx0aW5wdXQub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0c3RhdGUuc2V0SGlkZVByb3BlcnR5KGlkLCAhdGhpcy5jaGVja2VkKTtcblx0XHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRcdGQzLnNlbGVjdChcIi5oaWRlLWNvbnRyb2xzLWxpbmtcIilcblx0XHRcdFx0LmF0dHIoXCJocmVmXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblx0XHR9KTtcblx0XHRsYWJlbC5hcHBlbmQoXCJzcGFuXCIpXG5cdFx0XHQuYXR0cihcImNsYXNzXCIsIFwibWRsLWNoZWNrYm94X19sYWJlbCBsYWJlbFwiKVxuXHRcdFx0LnRleHQodGV4dCk7XG5cdH0pO1xuXHRkMy5zZWxlY3QoXCIuaGlkZS1jb250cm9scy1saW5rXCIpXG5cdFx0LmF0dHIoXCJocmVmXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVEYXRhKGZpcnN0VGltZSA9IGZhbHNlKSB7XG5cdGlmICghZmlyc3RUaW1lKSB7XG5cdFx0Ly8gQ2hhbmdlIHRoZSBzZWVkLlxuXHRcdHN0YXRlLnNlZWQgPSBNYXRoLnJhbmRvbSgpLnRvRml4ZWQoOCk7XG5cdFx0c3RhdGUuc2VyaWFsaXplKCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0fVxuXHRNYXRoLnNlZWRyYW5kb20oc3RhdGUuc2VlZCk7XG5cdGxldCBudW1TYW1wbGVzID0gKHN0YXRlLnByb2JsZW0gPT09IFByb2JsZW0uUkVHUkVTU0lPTikgP1xuXHRcdE5VTV9TQU1QTEVTX1JFR1JFU1MgOiBOVU1fU0FNUExFU19DTEFTU0lGWTtcblxuXHRsZXQgZ2VuZXJhdG9yO1xuXHRsZXQgZGF0YTogRXhhbXBsZTJEW10gPSBbXTtcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmluZGVudFxuXG5cdGlmIChzdGF0ZS5ieW9kKSB7XG5cdFx0ZGF0YSA9IHRyYWluRGF0YS5jb25jYXQodGVzdERhdGEpO1xuXHR9XG5cblx0aWYgKCFzdGF0ZS5ieW9kKSB7XG5cdFx0Z2VuZXJhdG9yID0gc3RhdGUucHJvYmxlbSA9PT0gUHJvYmxlbS5DTEFTU0lGSUNBVElPTiA/IHN0YXRlLmRhdGFzZXQgOiBzdGF0ZS5yZWdEYXRhc2V0O1xuXHRcdGRhdGEgPSBnZW5lcmF0b3IobnVtU2FtcGxlcywgc3RhdGUubm9pc2UpO1xuXHR9XG5cblx0Ly8gU2h1ZmZsZSBhbmQgc3BsaXQgaW50byB0cmFpbiBhbmQgdGVzdCBkYXRhLlxuXHRzaHVmZmxlKGRhdGEpO1xuXHRsZXQgc3BsaXRJbmRleCA9IE1hdGguZmxvb3IoZGF0YS5sZW5ndGggKiBzdGF0ZS5wZXJjVHJhaW5EYXRhIC8gMTAwKTtcblx0dHJhaW5EYXRhID0gZGF0YS5zbGljZSgwLCBzcGxpdEluZGV4KTtcblx0dGVzdERhdGEgPSBkYXRhLnNsaWNlKHNwbGl0SW5kZXgpO1xuXG5cdGxldCBjbGFzc0Rpc3QgPSBnZXROdW1iZXJPZkVhY2hDbGFzcyh0cmFpbkRhdGEpLm1hcCgobnVtKSA9PiBudW0gLyB0cmFpbkRhdGEubGVuZ3RoKTtcblx0c3RhdGUuc3VnQ2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzBdO1xuXHRzdGF0ZS5tYXhDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMV07XG5cblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFEaXN0cmlidXRpb24nXSAudmFsdWVcIilcblx0XHQudGV4dChgJHtjbGFzc0Rpc3RbMF0udG9GaXhlZCgzKX0sICR7Y2xhc3NEaXN0WzFdLnRvRml4ZWQoMyl9YCk7XG5cblx0aGVhdE1hcC51cGRhdGVQb2ludHModHJhaW5EYXRhKTtcblx0aGVhdE1hcC51cGRhdGVUZXN0UG9pbnRzKHN0YXRlLnNob3dUZXN0RGF0YSA/IHRlc3REYXRhIDogW10pO1xuXG59XG5cbmxldCBmaXJzdEludGVyYWN0aW9uID0gdHJ1ZTtcbmxldCBwYXJhbWV0ZXJzQ2hhbmdlZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiB1c2VySGFzSW50ZXJhY3RlZCgpIHtcblx0aWYgKCFmaXJzdEludGVyYWN0aW9uKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZpcnN0SW50ZXJhY3Rpb24gPSBmYWxzZTtcblx0bGV0IHBhZ2UgPSBcImluZGV4XCI7XG5cdGlmIChzdGF0ZS50dXRvcmlhbCAhPSBudWxsICYmIHN0YXRlLnR1dG9yaWFsICE9PSBcIlwiKSB7XG5cdFx0cGFnZSA9IGAvdi90dXRvcmlhbHMvJHtzdGF0ZS50dXRvcmlhbH1gO1xuXHR9XG5cdGdhKFwic2V0XCIsIFwicGFnZVwiLCBwYWdlKTtcblx0Z2EoXCJzZW5kXCIsIFwicGFnZXZpZXdcIiwge1wic2Vzc2lvbkNvbnRyb2xcIjogXCJzdGFydFwifSk7XG59XG5cbmZ1bmN0aW9uIHNpbXVsYXRpb25TdGFydGVkKCkge1xuXHRnYShcInNlbmRcIixcblx0XHR7XG5cdFx0XHRoaXRUeXBlOiBcImV2ZW50XCIsXG5cdFx0XHRldmVudENhdGVnb3J5OiBcIlN0YXJ0aW5nIFNpbXVsYXRpb25cIixcblx0XHRcdGV2ZW50QWN0aW9uOiBwYXJhbWV0ZXJzQ2hhbmdlZCA/IFwiY2hhbmdlZFwiIDogXCJ1bmNoYW5nZWRcIixcblx0XHRcdGV2ZW50TGFiZWw6IHN0YXRlLnR1dG9yaWFsID09IG51bGwgPyBcIlwiIDogc3RhdGUudHV0b3JpYWxcblx0XHR9KTtcblx0cGFyYW1ldGVyc0NoYW5nZWQgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gc2ltdWxhdGVDbGljayhlbGVtIC8qIE11c3QgYmUgdGhlIGVsZW1lbnQsIG5vdCBkMyBzZWxlY3Rpb24gKi8pIHtcblx0bGV0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiTW91c2VFdmVudHNcIik7XG5cdGV2dC5pbml0TW91c2VFdmVudChcblx0XHRcImNsaWNrXCIsIC8qIHR5cGUgKi9cblx0XHR0cnVlLCAvKiBjYW5CdWJibGUgKi9cblx0XHR0cnVlLCAvKiBjYW5jZWxhYmxlICovXG5cdFx0d2luZG93LCAvKiB2aWV3ICovXG5cdFx0MCwgLyogZGV0YWlsICovXG5cdFx0MCwgLyogc2NyZWVuWCAqL1xuXHRcdDAsIC8qIHNjcmVlblkgKi9cblx0XHQwLCAvKiBjbGllbnRYICovXG5cdFx0MCwgLyogY2xpZW50WSAqL1xuXHRcdGZhbHNlLCAvKiBjdHJsS2V5ICovXG5cdFx0ZmFsc2UsIC8qIGFsdEtleSAqL1xuXHRcdGZhbHNlLCAvKiBzaGlmdEtleSAqL1xuXHRcdGZhbHNlLCAvKiBtZXRhS2V5ICovXG5cdFx0MCwgLyogYnV0dG9uICovXG5cdFx0bnVsbCk7XG5cdC8qIHJlbGF0ZWRUYXJnZXQgKi9cblx0ZWxlbS5kaXNwYXRjaEV2ZW50KGV2dCk7XG59XG5cblxuZHJhd0RhdGFzZXRUaHVtYm5haWxzKCk7XG4vLyBpbml0VHV0b3JpYWwoKTtcbm1ha2VHVUkoKTtcbmdlbmVyYXRlRGF0YSh0cnVlKTtcbnJlc2V0KHRydWUpO1xuaGlkZUNvbnRyb2xzKCk7XG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmltcG9ydCAqIGFzIG5uIGZyb20gXCIuL25uXCI7XG5pbXBvcnQgKiBhcyBkYXRhc2V0IGZyb20gXCIuL2RhdGFzZXRcIjtcbmltcG9ydCB7RXhhbXBsZTJELCBzaHVmZmxlLCBEYXRhR2VuZXJhdG9yfSBmcm9tIFwiLi9kYXRhc2V0XCI7XG5cbi8qKiBTdWZmaXggYWRkZWQgdG8gdGhlIHN0YXRlIHdoZW4gc3RvcmluZyBpZiBhIGNvbnRyb2wgaXMgaGlkZGVuIG9yIG5vdC4gKi9cbmNvbnN0IEhJREVfU1RBVEVfU1VGRklYID0gXCJfaGlkZVwiO1xuXG4vKiogQSBtYXAgYmV0d2VlbiBuYW1lcyBhbmQgYWN0aXZhdGlvbiBmdW5jdGlvbnMuICovXG5leHBvcnQgbGV0IGFjdGl2YXRpb25zOiB7IFtrZXk6IHN0cmluZ106IG5uLkFjdGl2YXRpb25GdW5jdGlvbiB9ID0ge1xuXHRcInJlbHVcIjogbm4uQWN0aXZhdGlvbnMuUkVMVSxcblx0XCJ0YW5oXCI6IG5uLkFjdGl2YXRpb25zLlRBTkgsXG5cdFwic2lnbW9pZFwiOiBubi5BY3RpdmF0aW9ucy5TSUdNT0lELFxuXHRcImxpbmVhclwiOiBubi5BY3RpdmF0aW9ucy5MSU5FQVIsXG5cdFwic2lueFwiOiBubi5BY3RpdmF0aW9ucy5TSU5YXG59O1xuXG4vKiogQSBtYXAgYmV0d2VlbiBuYW1lcyBhbmQgcmVndWxhcml6YXRpb24gZnVuY3Rpb25zLiAqL1xuZXhwb3J0IGxldCByZWd1bGFyaXphdGlvbnM6IHsgW2tleTogc3RyaW5nXTogbm4uUmVndWxhcml6YXRpb25GdW5jdGlvbiB9ID0ge1xuXHRcIm5vbmVcIjogbnVsbCxcblx0XCJMMVwiOiBubi5SZWd1bGFyaXphdGlvbkZ1bmN0aW9uLkwxLFxuXHRcIkwyXCI6IG5uLlJlZ3VsYXJpemF0aW9uRnVuY3Rpb24uTDJcbn07XG5cbi8qKiBBIG1hcCBiZXR3ZWVuIGRhdGFzZXQgbmFtZXMgYW5kIGZ1bmN0aW9ucyB0aGF0IGdlbmVyYXRlIGNsYXNzaWZpY2F0aW9uIGRhdGEuICovXG5leHBvcnQgbGV0IGRhdGFzZXRzOiB7IFtrZXk6IHN0cmluZ106IGRhdGFzZXQuRGF0YUdlbmVyYXRvciB9ID0ge1xuXHRcImNpcmNsZVwiOiBkYXRhc2V0LmNsYXNzaWZ5Q2lyY2xlRGF0YSxcblx0XCJ4b3JcIjogZGF0YXNldC5jbGFzc2lmeVhPUkRhdGEsXG5cdFwiZ2F1c3NcIjogZGF0YXNldC5jbGFzc2lmeVR3b0dhdXNzRGF0YSxcblx0XCJzcGlyYWxcIjogZGF0YXNldC5jbGFzc2lmeVNwaXJhbERhdGEsXG5cdFwiYnlvZFwiOiBkYXRhc2V0LmNsYXNzaWZ5QllPRGF0YVxufTtcblxuLyoqIEEgbWFwIGJldHdlZW4gZGF0YXNldCBuYW1lcyBhbmQgZnVuY3Rpb25zIHRoYXQgZ2VuZXJhdGUgcmVncmVzc2lvbiBkYXRhLiAqL1xuZXhwb3J0IGxldCByZWdEYXRhc2V0czogeyBba2V5OiBzdHJpbmddOiBkYXRhc2V0LkRhdGFHZW5lcmF0b3IgfSA9IHtcblx0XCJyZWctcGxhbmVcIjogZGF0YXNldC5yZWdyZXNzUGxhbmUsXG5cdFwicmVnLWdhdXNzXCI6IGRhdGFzZXQucmVncmVzc0dhdXNzaWFuXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0S2V5RnJvbVZhbHVlKG9iajogYW55LCB2YWx1ZTogYW55KTogc3RyaW5nIHtcblx0Zm9yIChsZXQga2V5IGluIG9iaikge1xuXHRcdGlmIChvYmpba2V5XSA9PT0gdmFsdWUpIHtcblx0XHRcdHJldHVybiBrZXk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGVuZHNXaXRoKHM6IHN0cmluZywgc3VmZml4OiBzdHJpbmcpOiBib29sZWFuIHtcblx0cmV0dXJuIHMuc3Vic3RyKC1zdWZmaXgubGVuZ3RoKSA9PT0gc3VmZml4O1xufVxuXG5mdW5jdGlvbiBnZXRIaWRlUHJvcHMob2JqOiBhbnkpOiBzdHJpbmdbXSB7XG5cdGxldCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cdGZvciAobGV0IHByb3AgaW4gb2JqKSB7XG5cdFx0aWYgKGVuZHNXaXRoKHByb3AsIEhJREVfU1RBVEVfU1VGRklYKSkge1xuXHRcdFx0cmVzdWx0LnB1c2gocHJvcCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGRhdGEgdHlwZSBvZiBhIHN0YXRlIHZhcmlhYmxlLiBVc2VkIGZvciBkZXRlcm1pbmluZyB0aGVcbiAqIChkZSlzZXJpYWxpemF0aW9uIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGVudW0gVHlwZSB7XG5cdFNUUklORyxcblx0TlVNQkVSLFxuXHRBUlJBWV9OVU1CRVIsXG5cdEFSUkFZX1NUUklORyxcblx0Qk9PTEVBTixcblx0T0JKRUNUXG59XG5cbmV4cG9ydCBlbnVtIFByb2JsZW0ge1xuXHRDTEFTU0lGSUNBVElPTixcblx0UkVHUkVTU0lPTlxufVxuXG5leHBvcnQgbGV0IHByb2JsZW1zID0ge1xuXHRcImNsYXNzaWZpY2F0aW9uXCI6IFByb2JsZW0uQ0xBU1NJRklDQVRJT04sXG5cdFwicmVncmVzc2lvblwiOiBQcm9ibGVtLlJFR1JFU1NJT05cbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvcGVydHkge1xuXHRuYW1lOiBzdHJpbmc7XG5cdHR5cGU6IFR5cGU7XG5cdGtleU1hcD86IHsgW2tleTogc3RyaW5nXTogYW55IH07XG59XG5cbi8vIEFkZCB0aGUgR1VJIHN0YXRlLlxuZXhwb3J0IGNsYXNzIFN0YXRlIHtcblx0cHJpdmF0ZSBzdGF0aWMgUFJPUFM6IFByb3BlcnR5W10gPVxuXHRcdFtcblx0XHRcdHtuYW1lOiBcImFjdGl2YXRpb25cIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogYWN0aXZhdGlvbnN9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiBcInJlZ3VsYXJpemF0aW9uXCIsXG5cdFx0XHRcdHR5cGU6IFR5cGUuT0JKRUNULFxuXHRcdFx0XHRrZXlNYXA6IHJlZ3VsYXJpemF0aW9uc1xuXHRcdFx0fSxcblx0XHRcdHtuYW1lOiBcImJhdGNoU2l6ZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sXG5cdFx0XHR7bmFtZTogXCJkYXRhc2V0XCIsIHR5cGU6IFR5cGUuT0JKRUNULCBrZXlNYXA6IGRhdGFzZXRzfSxcblx0XHRcdHtuYW1lOiBcInJlZ0RhdGFzZXRcIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogcmVnRGF0YXNldHN9LFxuXHRcdFx0e25hbWU6IFwibGVhcm5pbmdSYXRlXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcblx0XHRcdHtuYW1lOiBcInRydWVMZWFybmluZ1JhdGVcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LCAvLyBUaGUgdHJ1ZSBsZWFybmluZyByYXRlXG5cdFx0XHR7bmFtZTogXCJyZWd1bGFyaXphdGlvblJhdGVcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwibm9pc2VcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwibmV0d29ya1NoYXBlXCIsIHR5cGU6IFR5cGUuQVJSQVlfTlVNQkVSfSxcblx0XHRcdHtuYW1lOiBcInNlZWRcIiwgdHlwZTogVHlwZS5TVFJJTkd9LFxuXHRcdFx0e25hbWU6IFwic2hvd1Rlc3REYXRhXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJkaXNjcmV0aXplXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJwZXJjVHJhaW5EYXRhXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcblx0XHRcdHtuYW1lOiBcInhcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInlcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInhUaW1lc1lcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInhTcXVhcmVkXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJ5U3F1YXJlZFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwiY29zWFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwic2luWFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwiY29zWVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwic2luWVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwiY29sbGVjdFN0YXRzXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJ0dXRvcmlhbFwiLCB0eXBlOiBUeXBlLlNUUklOR30sXG5cdFx0XHR7bmFtZTogXCJwcm9ibGVtXCIsIHR5cGU6IFR5cGUuT0JKRUNULCBrZXlNYXA6IHByb2JsZW1zfSxcblx0XHRcdHtuYW1lOiBcImluaXRaZXJvXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJoaWRlVGV4dFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59XG5cdFx0XTtcblxuXHRba2V5OiBzdHJpbmddOiBhbnk7XG5cblx0dG90YWxDYXBhY2l0eSA9IDAuMDtcblx0cmVxQ2FwYWNpdHkgPSAyO1xuXHRtYXhDYXBhY2l0eSA9IDA7XG5cdHN1Z0NhcGFjaXR5ID0gMDtcblx0bG9zc0NhcGFjaXR5ID0gMDtcblx0dHJ1ZUxlYXJuaW5nUmF0ZSA9IDAuMDtcblx0bGVhcm5pbmdSYXRlID0gMS4wO1xuXHRyZWd1bGFyaXphdGlvblJhdGUgPSAwO1xuXHRzaG93VGVzdERhdGEgPSBmYWxzZTtcblx0bm9pc2UgPSAzNTsgLy8gU05SZEJcblx0YmF0Y2hTaXplID0gMTA7XG5cdGRpc2NyZXRpemUgPSBmYWxzZTtcblx0dHV0b3JpYWw6IHN0cmluZyA9IG51bGw7XG5cdHBlcmNUcmFpbkRhdGEgPSA1MDtcblx0YWN0aXZhdGlvbiA9IG5uLkFjdGl2YXRpb25zLlNJR01PSUQ7XG5cdHJlZ3VsYXJpemF0aW9uOiBubi5SZWd1bGFyaXphdGlvbkZ1bmN0aW9uID0gbnVsbDtcblx0cHJvYmxlbSA9IFByb2JsZW0uQ0xBU1NJRklDQVRJT047XG5cdGluaXRaZXJvID0gZmFsc2U7XG5cdGhpZGVUZXh0ID0gZmFsc2U7XG5cdGNvbGxlY3RTdGF0cyA9IGZhbHNlO1xuXHRudW1IaWRkZW5MYXllcnMgPSAxO1xuXHRoaWRkZW5MYXllckNvbnRyb2xzOiBhbnlbXSA9IFtdO1xuXHRuZXR3b3JrU2hhcGU6IG51bWJlcltdID0gWzFdO1xuXHR4ID0gdHJ1ZTtcblx0eSA9IHRydWU7XG5cdHhUaW1lc1kgPSBmYWxzZTtcblx0eFNxdWFyZWQgPSBmYWxzZTtcblx0eVNxdWFyZWQgPSBmYWxzZTtcblx0Y29zWCA9IGZhbHNlO1xuXHRzaW5YID0gZmFsc2U7XG5cdGNvc1kgPSBmYWxzZTtcblx0c2luWSA9IGZhbHNlO1xuXHRieW9kID0gZmFsc2U7XG5cdGRhdGE6IEV4YW1wbGUyRFtdID0gW107XG5cdGRhdGFzZXQ6IGRhdGFzZXQuRGF0YUdlbmVyYXRvciA9IGRhdGFzZXQuY2xhc3NpZnlUd29HYXVzc0RhdGE7XG5cdHJlZ0RhdGFzZXQ6IGRhdGFzZXQuRGF0YUdlbmVyYXRvciA9IGRhdGFzZXQucmVncmVzc1BsYW5lO1xuXHRzZWVkOiBzdHJpbmc7XG5cdHNoaWZ0RG93bjogYm9vbGVhbjtcblxuXHQvKipcblx0ICogRGVzZXJpYWxpemVzIHRoZSBzdGF0ZSBmcm9tIHRoZSB1cmwgaGFzaC5cblx0ICovXG5cdHN0YXRpYyBkZXNlcmlhbGl6ZVN0YXRlKCk6IFN0YXRlIHtcblx0XHRsZXQgbWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cdFx0Zm9yIChsZXQga2V5dmFsdWUgb2Ygd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkuc3BsaXQoXCImXCIpKSB7XG5cdFx0XHRsZXQgW25hbWUsIHZhbHVlXSA9IGtleXZhbHVlLnNwbGl0KFwiPVwiKTtcblx0XHRcdG1hcFtuYW1lXSA9IHZhbHVlO1xuXHRcdH1cblx0XHRsZXQgc3RhdGUgPSBuZXcgU3RhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGhhc0tleShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiBuYW1lIGluIG1hcCAmJiBtYXBbbmFtZV0gIT0gbnVsbCAmJiBtYXBbbmFtZV0udHJpbSgpICE9PSBcIlwiO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHBhcnNlQXJyYXkodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcblx0XHRcdHJldHVybiB2YWx1ZS50cmltKCkgPT09IFwiXCIgPyBbXSA6IHZhbHVlLnNwbGl0KFwiLFwiKTtcblx0XHR9XG5cblx0XHQvLyBEZXNlcmlhbGl6ZSByZWd1bGFyIHByb3BlcnRpZXMuXG5cdFx0U3RhdGUuUFJPUFMuZm9yRWFjaCgoe25hbWUsIHR5cGUsIGtleU1hcH0pID0+IHtcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIFR5cGUuT0JKRUNUOlxuXHRcdFx0XHRcdGlmIChrZXlNYXAgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0dGhyb3cgRXJyb3IoXCJBIGtleS12YWx1ZSBtYXAgbXVzdCBiZSBwcm92aWRlZCBmb3Igc3RhdGUgXCIgK1xuXHRcdFx0XHRcdFx0XHRcInZhcmlhYmxlcyBvZiB0eXBlIE9iamVjdFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGhhc0tleShuYW1lKSAmJiBtYXBbbmFtZV0gaW4ga2V5TWFwKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZVtuYW1lXSA9IGtleU1hcFttYXBbbmFtZV1dO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBUeXBlLk5VTUJFUjpcblx0XHRcdFx0XHRpZiAoaGFzS2V5KG5hbWUpKSB7XG5cdFx0XHRcdFx0XHQvLyBUaGUgKyBvcGVyYXRvciBpcyBmb3IgY29udmVydGluZyBhIHN0cmluZyB0byBhIG51bWJlci5cblx0XHRcdFx0XHRcdHN0YXRlW25hbWVdID0gK21hcFtuYW1lXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVHlwZS5TVFJJTkc6XG5cdFx0XHRcdFx0aWYgKGhhc0tleShuYW1lKSkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBtYXBbbmFtZV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQk9PTEVBTjpcblx0XHRcdFx0XHRpZiAoaGFzS2V5KG5hbWUpKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZVtuYW1lXSA9IChtYXBbbmFtZV0gPT09IFwiZmFsc2VcIiA/IGZhbHNlIDogdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQVJSQVlfTlVNQkVSOlxuXHRcdFx0XHRcdGlmIChuYW1lIGluIG1hcCkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBwYXJzZUFycmF5KG1hcFtuYW1lXSkubWFwKE51bWJlcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQVJSQVlfU1RSSU5HOlxuXHRcdFx0XHRcdGlmIChuYW1lIGluIG1hcCkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBwYXJzZUFycmF5KG1hcFtuYW1lXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IEVycm9yKFwiRW5jb3VudGVyZWQgYW4gdW5rbm93biB0eXBlIGZvciBhIHN0YXRlIHZhcmlhYmxlXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gRGVzZXJpYWxpemUgc3RhdGUgcHJvcGVydGllcyB0aGF0IGNvcnJlc3BvbmQgdG8gaGlkaW5nIFVJIGNvbnRyb2xzLlxuXHRcdGdldEhpZGVQcm9wcyhtYXApLmZvckVhY2gocHJvcCA9PiB7XG5cdFx0XHRzdGF0ZVtwcm9wXSA9IChtYXBbcHJvcF0gPT09IFwidHJ1ZVwiKTtcblx0XHR9KTtcblx0XHRzdGF0ZS5udW1IaWRkZW5MYXllcnMgPSBzdGF0ZS5uZXR3b3JrU2hhcGUubGVuZ3RoO1xuXHRcdGlmIChzdGF0ZS5zZWVkID09IG51bGwpIHtcblx0XHRcdHN0YXRlLnNlZWQgPSBNYXRoLnJhbmRvbSgpLnRvRml4ZWQoNSk7XG5cdFx0fVxuXHRcdE1hdGguc2VlZHJhbmRvbShzdGF0ZS5zZWVkKTtcblx0XHRzdGF0ZS5zaGlmdERvd24gPSBmYWxzZTtcblx0XHRyZXR1cm4gc3RhdGU7XG5cdH1cblxuXHQvKipcblx0ICogU2VyaWFsaXplcyB0aGUgc3RhdGUgaW50byB0aGUgdXJsIGhhc2guXG5cdCAqL1xuXHRzZXJpYWxpemUoKSB7XG5cdFx0Ly8gU2VyaWFsaXplIHJlZ3VsYXIgcHJvcGVydGllcy5cblx0XHRsZXQgcHJvcHM6IHN0cmluZ1tdID0gW107XG5cdFx0U3RhdGUuUFJPUFMuZm9yRWFjaCgoe25hbWUsIHR5cGUsIGtleU1hcH0pID0+IHtcblx0XHRcdGxldCB2YWx1ZSA9IHRoaXNbbmFtZV07XG5cdFx0XHQvLyBEb24ndCBzZXJpYWxpemUgbWlzc2luZyB2YWx1ZXMuXG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZSA9PT0gVHlwZS5PQkpFQ1QpIHtcblx0XHRcdFx0dmFsdWUgPSBnZXRLZXlGcm9tVmFsdWUoa2V5TWFwLCB2YWx1ZSk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IFR5cGUuQVJSQVlfTlVNQkVSIHx8IHR5cGUgPT09IFR5cGUuQVJSQVlfU1RSSU5HKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuam9pbihcIixcIik7XG5cdFx0XHR9XG5cdFx0XHRwcm9wcy5wdXNoKGAke25hbWV9PSR7dmFsdWV9YCk7XG5cdFx0fSk7XG5cdFx0Ly8gU2VyaWFsaXplIHByb3BlcnRpZXMgdGhhdCBjb3JyZXNwb25kIHRvIGhpZGluZyBVSSBjb250cm9scy5cblx0XHRnZXRIaWRlUHJvcHModGhpcykuZm9yRWFjaChwcm9wID0+IHtcblx0XHRcdHByb3BzLnB1c2goYCR7cHJvcH09JHt0aGlzW3Byb3BdfWApO1xuXHRcdH0pO1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcHJvcHMuam9pbihcIiZcIik7XG5cdH1cblxuXHQvKiogUmV0dXJucyBhbGwgdGhlIGhpZGRlbiBwcm9wZXJ0aWVzLiAqL1xuXHRnZXRIaWRkZW5Qcm9wcygpOiBzdHJpbmdbXSB7XG5cdFx0bGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblx0XHRmb3IgKGxldCBwcm9wIGluIHRoaXMpIHtcblx0XHRcdGlmIChlbmRzV2l0aChwcm9wLCBISURFX1NUQVRFX1NVRkZJWCkgJiYgU3RyaW5nKHRoaXNbcHJvcF0pID09PSBcInRydWVcIikge1xuXHRcdFx0XHRyZXN1bHQucHVzaChwcm9wLnJlcGxhY2UoSElERV9TVEFURV9TVUZGSVgsIFwiXCIpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdHNldEhpZGVQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIGhpZGRlbjogYm9vbGVhbikge1xuXHRcdHRoaXNbbmFtZSArIEhJREVfU1RBVEVfU1VGRklYXSA9IGhpZGRlbjtcblx0fVxufVxuIl19
