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
    if (startNode.layer >= endNode.layer) {
        return;
    }
    var link = new nn_1.Link(startNode, endNode, state.regularization, state.initZero);
    startNode.outputs.push(link);
    endNode.inputLinks.push(link);
    drawNetwork(network);
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
        var curLayerCapacity = 0;
        var currentLayer = network[layerIdx];
        if (1 === layerIdx)
            for (var i = 0; i < currentLayer.length; i++) {
                var node = currentLayer[i];
                curLayerCapacity += node.inputLinks.length + 1;
            }
        else {
            var minLayer = network[layerIdx - 1].length;
            for (var i = 1; i < layerIdx - 1; i++) {
                if (network[i].length < minLayer) {
                    minLayer = network[i].length;
                }
            }
            curLayerCapacity += minLayer;
        }
        totalCapacity += curLayerCapacity;
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
    var numberOfCorrectTrainClassifications = getNumberOfCorrectClassifications(network, trainData);
    var numberOfCorrectTestClassifications = getNumberOfCorrectClassifications(network, testData);
    generalization = (numberOfCorrectTrainClassifications + numberOfCorrectTestClassifications) / totalCapacity;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy5ucG0vX25weC85ODAyNi9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGF0YXNldC50cyIsInNyYy9oZWF0bWFwLnRzIiwic3JjL2xpbmVjaGFydC50cyIsInNyYy9ubi50cyIsInNyYy9wbGF5Z3JvdW5kLnRzIiwic3JjL3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQytDQSx5QkFBZ0MsVUFBa0IsRUFBRSxLQUFhO0lBQ2hFLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUM7SUFpQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDZixDQUFDO0FBbkNELDBDQW1DQztBQVFELDhCQUFxQyxVQUFrQixFQUFFLEtBQWE7SUFDckUsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztJQUM3QixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFHbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXpCLGtCQUFrQixFQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWE7UUFDdEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDaEQsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDaEQsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6QyxJQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxHQUFHLE9BQU8s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QUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDbEQsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELENBQUMsSUFBSSxNQUFNLENBQUM7UUFDWixDQUFDLElBQUksTUFBTSxDQUFDO1FBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBR0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFHMUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxD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ckIsQ0FBQztJQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNkLENBQUM7QUFLRCwyQkFBMkIsTUFBbUIsRUFBRSxLQUF1QjtJQUN0RSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsRUFBSCxDQUFHLENBQUMsQ0FBQztJQUNwQyxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsRUFBSCxDQUFHLENBQUMsQ0FBQztJQUNwQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxRQUFRLENBQUMsQ0FBQztJQUNsQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxRQUFRLENBQUMsQ0FBQztJQUNsQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxRQUFRLENBQUMsQ0FBQztJQUNsQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxRQUFRLENBQUMsQ0FBQztJQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RSxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDZixDQUFDO0FBRUQ7SUFFQyxDQUFDLENBQUM7UUFDRCxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDcEMsU0FBUyxFQUFFLE1BQU07U0FDakIsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSCxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDN0IsT0FBTyxFQUFFLE9BQU87S0FDaEIsQ0FBQyxDQUFDO0lBR0gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUs7UUFDL0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixTQUFTLENBQUMsS0FBSyxDQUFDO29CQUNmLGNBQWMsRUFBRSxLQUFLO2lCQUNyQixDQUFDLENBQUM7WUFDSixDQUFDO1lBQ0QsU0FBUyxHQUFHLElBQUksQ0FBQztZQUNqQixVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ25CLENBQUM7SUFDRixDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxLQUFLO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QixLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN4QixDQUFDO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFHSCxFQUFFLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7UUFDdEMsS0FBSyxFQUFFLENBQUM7UUFDUixpQkFBaUIsRUFBRSxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBRTNDLGlCQUFpQixFQUFFLENBQUM7UUFDcEIsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFBLFNBQVM7UUFDM0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUMxQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixpQkFBaUIsRUFBRSxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLGlCQUFpQixFQUFFLENBQUM7UUFDckIsQ0FBQztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUMzQyxZQUFZLEVBQUUsQ0FBQztRQUNmLGlCQUFpQixHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUMxRCxjQUFjLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUMxQixJQUFJLFVBQVUsR0FBRyxnQkFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEQsSUFBSSxVQUFVLEdBQUcsdUJBQWUsQ0FBQyxnQkFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRXZELEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsT0FBTyxJQUFJLFVBQVUsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQztRQUNSLENBQUM7UUFFRCxLQUFLLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztRQUczQixFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUUzQixLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNsQixFQUFFLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7WUFDekYsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBSzVCLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM1QyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLEtBQUs7Z0JBQ3JDLElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQzlCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUM5QixNQUFNLENBQUMsTUFBTSxHQUFHLFVBQVUsS0FBSztvQkFDOUIsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztvQkFDN0IsSUFBSSxNQUFNLEdBQVEsS0FBSyxDQUFDLE1BQU0sQ0FBQztvQkFDL0IsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztvQkFDekIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDekIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ25DLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDOzRCQUFDLEtBQUssQ0FBQzt3QkFDMUIsSUFBSSxHQUFDLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMxQixJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzFCLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsS0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztvQkFDNUIsQ0FBQztvQkFDRCxNQUFNLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUMsaUJBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFFaEIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQ3ZFLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDeEMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBRXBDLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2hDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFFN0QsSUFBSSxTQUFTLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQXRCLENBQXNCLENBQUMsQ0FBQztvQkFDckYsS0FBSyxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELEtBQUssQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUVqRCxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQzdFLEVBQUUsQ0FBQyxNQUFNLENBQUMsc0NBQXNDLENBQUM7eUJBQy9DLElBQUksQ0FBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFHLENBQUMsQ0FBQztvQkFFakUsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO29CQUN6QixLQUFLLEVBQUUsQ0FBQztvQkFHUixJQUFJLE1BQU0sR0FBUSxRQUFRLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLENBQUM7b0JBQ3RFLGVBQWUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxVQUFrQixFQUFFLEtBQWEsSUFBSyxPQUFBLE1BQU0sRUFBTixDQUFNLENBQUMsQ0FBQztnQkFHeEUsQ0FBQyxDQUFDO2dCQUVGLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBR0osQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFJbkIsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBR2pCLFlBQVksRUFBRSxDQUFDO1lBRWYsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztZQUM3QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixDQUFDO1lBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsQ0FBQztZQUVELElBQUksV0FBUyxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUF0QixDQUFzQixDQUFDLENBQUM7WUFDckYsS0FBSyxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsS0FBSyxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFakQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM3RSxFQUFFLENBQUMsTUFBTSxDQUFDLHNDQUFzQyxDQUFDO2lCQUMvQyxJQUFJLENBQUksV0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBSyxXQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRyxDQUFDLENBQUM7WUFFakUsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1lBR3pCLElBQUksTUFBTSxHQUFRLFFBQVEsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUN0RSxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixLQUFLLEVBQUUsQ0FBQztRQUNULENBQUM7SUFFRixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksVUFBVSxHQUFHLHVCQUFlLENBQUMsZ0JBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFMUQsRUFBRSxDQUFDLE1BQU0sQ0FBQyx5QkFBdUIsVUFBVSxNQUFHLENBQUM7U0FDN0MsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUU1QixJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUNoRSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQzdCLElBQUksVUFBVSxHQUFHLG1CQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDO1FBQ1IsQ0FBQztRQUNELEtBQUssQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzlCLEtBQUssQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELEtBQUssQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLFlBQVksRUFBRSxDQUFDO1FBQ2YsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLGFBQWEsR0FBRyx1QkFBZSxDQUFDLG1CQUFXLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRW5FLEVBQUUsQ0FBQyxNQUFNLENBQUMsNEJBQTBCLGFBQWEsTUFBRyxDQUFDO1NBQ25ELE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFHNUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUM7UUFDUixDQUFDO1FBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUM7UUFDUixDQUFDO1FBQ0QsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNqRCxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQzVELEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNsQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztRQUNwQixPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFHSCxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFckQsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ3RELEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNoQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztRQUNwQixRQUFRLEVBQUUsQ0FBQztJQUNaLENBQUMsQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRWpELElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ3ZELEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNqQyxFQUFFLENBQUMsTUFBTSxDQUFDLG1DQUFtQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxZQUFZLEVBQUUsQ0FBQztRQUVmLElBQUksU0FBUyxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUF0QixDQUFzQixDQUFDLENBQUM7UUFDckYsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM3RSxFQUFFLENBQUMsTUFBTSxDQUFDLHNDQUFzQyxDQUFDO2FBQy9DLElBQUksQ0FBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFHLENBQUMsQ0FBQztRQUNqRSxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUNILFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRCxFQUFFLENBQUMsTUFBTSxDQUFDLG1DQUFtQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUV6RSwwQkFBMEIsQ0FBUztRQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQzNDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixFQUFFLENBQUMsTUFBTSxDQUFDLG1DQUFtQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxZQUFZLEVBQUUsQ0FBQztRQUVmLElBQUksU0FBUyxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUF0QixDQUFzQixDQUFDLENBQUM7UUFDckYsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM3RSxFQUFFLENBQUMsTUFBTSxDQUFDLHNDQUFzQyxDQUFDO2FBQy9DLElBQUksQ0FBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFHLENBQUMsQ0FBQztRQUVqRSxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUdILEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxJQUFJLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDO0lBQ3JGLEVBQUUsQ0FBQyxNQUFNLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDN0UsRUFBRSxDQUFDLE1BQU0sQ0FBQyxzQ0FBc0MsQ0FBQztTQUMvQyxJQUFJLENBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRyxDQUFDLENBQUM7SUFFakUsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ25ELEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUU3QixJQUFJLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDO1FBQ3JGLEVBQUUsQ0FBQyxNQUFNLENBQUMsK0JBQStCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVELEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDN0UsRUFBRSxDQUFDLE1BQU0sQ0FBQyxzQ0FBc0MsQ0FBQzthQUMvQyxJQUFJLENBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRyxDQUFDLENBQUM7UUFFakUsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0MsRUFBRSxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM3RSxFQUFFLENBQUMsTUFBTSxDQUFDLHNDQUFzQyxDQUFDO1NBQy9DLElBQUksQ0FBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFHLENBQUMsQ0FBQztJQUdqRSxJQUFJLGtCQUFrQixHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUMvRCxLQUFLLENBQUMsVUFBVSxHQUFHLG1CQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixLQUFLLEVBQUUsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0gsa0JBQWtCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSx1QkFBZSxDQUFDLG1CQUFXLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFFckYsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQzFELEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNoQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztRQUNwQixpQkFBaUIsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxZQUFZLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFbkQsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7UUFDaEUsS0FBSyxDQUFDLGNBQWMsR0FBRyx1QkFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuRCxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLHVCQUFlLENBQUMsdUJBQWUsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUUxRixJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7UUFDeEQsS0FBSyxDQUFDLGtCQUFrQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN2QyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUNILFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRXhELElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUNoRCxLQUFLLENBQUMsT0FBTyxHQUFHLGdCQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLFlBQVksRUFBRSxDQUFDO1FBQ2YscUJBQXFCLEVBQUUsQ0FBQztRQUN4QixpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLHVCQUFlLENBQUMsZ0JBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUdwRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDMUQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7U0FDdkIsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNSLE1BQU0sQ0FBQyxRQUFRLENBQUM7U0FDaEIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3RCLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7U0FDdkMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7U0FDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQztTQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFJZCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFO1FBQ2pDLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO2FBQ2pELHFCQUFxQixFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzVCLFNBQVMsR0FBRyxRQUFRLENBQUM7WUFDckIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQixDQUFDO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFHSCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNwQixFQUFFLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5QyxDQUFDO0FBQ0YsQ0FBQztBQUVELHdCQUF3QixPQUFvQjtJQUMzQyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBQSxJQUFJO1FBQ2pDLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBYSxJQUFJLENBQUMsRUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQseUJBQXlCLE9BQW9CLEVBQUUsU0FBNEI7SUFDMUUsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDOUQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXJDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzlDLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2pELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUksQ0FBQztxQkFDeEQsS0FBSyxDQUNMO29CQUNDLG1CQUFtQixFQUFFLENBQUMsSUFBSSxHQUFHLENBQUM7b0JBQzlCLGNBQWMsRUFBRSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3JELFFBQVEsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFDakMsQ0FBQztxQkFDRixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDZixDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUM7QUFDRixDQUFDO0FBT0Qsb0JBQW9CLFNBQWtCLEVBQUUsT0FBZ0I7SUFDdkQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUM7SUFDUixDQUFDO0lBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxTQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5RSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsUUFBUSxFQUFFLENBQUM7QUFDWixDQUFDO0FBRUQsa0JBQWtCLEVBQVUsRUFBRSxFQUFVLEVBQUUsTUFBYyxFQUFFLE9BQWdCLEVBQUUsU0FBNEIsRUFBRSxJQUFjO0lBQ3ZILElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBRTNCLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUN6QztRQUNDLE9BQU8sRUFBRSxNQUFNO1FBQ2YsSUFBSSxFQUFFLFNBQU8sTUFBUTtRQUNyQixXQUFXLEVBQUUsZUFBYSxDQUFDLFNBQUksQ0FBQyxNQUFHO0tBQ25DLENBQUMsQ0FBQztJQUdKLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUM1QjtRQUNDLENBQUMsRUFBRSxDQUFDO1FBQ0osQ0FBQyxFQUFFLENBQUM7UUFDSixLQUFLLEVBQUUsU0FBUztRQUNoQixNQUFNLEVBQUUsU0FBUztLQUNqQixDQUFDLENBQUM7SUFFSixJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDO0lBQzdELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDYixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUV6RSxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FDdkM7WUFDQyxPQUFLLEVBQUUsWUFBWTtZQUNuQixDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ04sQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsYUFBYSxFQUFFLEtBQUs7U0FDdEMsQ0FBQyxDQUFDO1FBQ0osRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxJQUFJLEdBQUcsaUJBQWlCLENBQUM7WUFDN0IsSUFBSSxPQUFPLFNBQUEsQ0FBQztZQUNaLElBQUksU0FBUyxTQUFBLENBQUM7WUFDZCxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDN0MsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQzNCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7cUJBQ2xCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEtBQUssR0FBRyxHQUFHLEtBQUssR0FBRyxPQUFPLENBQUM7cUJBQ3JELEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDO3FCQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEIsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsQ0FBQztRQUNGLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFDRCxTQUFTLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFZCxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FDNUI7WUFDQyxFQUFFLEVBQUUsVUFBUSxNQUFRO1lBQ3BCLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDO1lBQ2pCLENBQUMsRUFBRSxTQUFTLEdBQUcsU0FBUyxHQUFHLENBQUM7WUFDNUIsS0FBSyxFQUFFLFNBQVM7WUFDaEIsTUFBTSxFQUFFLFNBQVM7U0FDakIsQ0FBQzthQUNELEVBQUUsQ0FBQyxZQUFZLEVBQUU7WUFDakIsZUFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUM7YUFDRCxFQUFFLENBQUMsWUFBWSxFQUFFO1lBQ2pCLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUNqRTtRQUNDLElBQUksRUFBRSxZQUFVLE1BQVE7UUFDeEIsT0FBTyxFQUFFLFFBQVE7S0FDakIsQ0FBQztTQUNELEtBQUssQ0FDTDtRQUNDLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLElBQUksRUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFJO1FBQ2xCLEdBQUcsRUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFJO0tBQ2pCLENBQUM7U0FDRixFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ1osRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDckIsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEdBQUcsQ0FBQyxLQUFLLENBQUM7b0JBQ1QsY0FBYyxFQUFFLE9BQU87b0JBQ3ZCLGVBQWUsRUFBRSxLQUFLO29CQUN0QixjQUFjLEVBQUUsS0FBSztvQkFDckIsY0FBYyxFQUFFLEtBQUs7aUJBQ3JCLENBQUMsQ0FBQztnQkFDSCxVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixTQUFTLEdBQUcsR0FBRyxDQUFDO1lBQ2pCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxTQUFTLENBQUMsS0FBSyxDQUFDO29CQUNmLGNBQWMsRUFBRSxLQUFLO2lCQUNyQixDQUFDLENBQUM7Z0JBQ0gsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDN0IsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDbEIsU0FBUyxHQUFHLElBQUksQ0FBQztZQUNsQixDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUMsQ0FBQztTQUNELEVBQUUsQ0FBQyxZQUFZLEVBQUU7UUFDakIsY0FBYyxHQUFHLE1BQU0sQ0FBQztRQUN4QixHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QixTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuQyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDO1NBQ0QsRUFBRSxDQUFDLFlBQVksRUFBRTtRQUNqQixjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlCLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2QyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BGLENBQUMsQ0FBQyxDQUFDO0lBQ0osRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNiLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1lBQ2YsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQixpQkFBaUIsR0FBRyxJQUFJLENBQUM7Z0JBQ3pCLEtBQUssRUFBRSxDQUFDO1lBQ1QsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN4QixHQUFHLENBQUMsS0FBSyxDQUFDO3dCQUNULGNBQWMsRUFBRSxPQUFPO3dCQUN2QixlQUFlLEVBQUUsS0FBSzt3QkFDdEIsY0FBYyxFQUFFLEtBQUs7d0JBQ3JCLGNBQWMsRUFBRSxLQUFLO3FCQUNyQixDQUFDLENBQUM7b0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3ZCLFVBQVUsR0FBRyxJQUFJLENBQUM7b0JBQ2xCLFNBQVMsR0FBRyxHQUFHLENBQUM7Z0JBQ2pCLENBQUM7WUFDRixDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNiLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELElBQUksV0FBVyxHQUFHLElBQUksaUJBQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQzdGLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFHRCxxQkFBcUIsT0FBb0I7SUFDeEMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU1QixHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRTlCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3ZELEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFHbkUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQW9CLENBQUM7SUFDOUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksRUFBb0IsQ0FBQztJQUNoRSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDMUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFHekIsSUFBSSxVQUFVLEdBQWlELEVBQUUsQ0FBQztJQUNsRSxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztTQUM3QixPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztTQUNyQixJQUFJLENBQUMsV0FBVyxFQUFFLGVBQWEsT0FBTyxTQUFJLE9BQU8sTUFBRyxDQUFDLENBQUM7SUFFeEQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLFlBQVksR0FBRyxHQUFHLENBQUM7SUFDdkIsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQWtCO1NBQ2pELE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbEMsV0FBVyxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssR0FBRyxTQUFTLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0RCxJQUFJLGNBQWMsR0FBRyxVQUFDLFNBQWlCLElBQUssT0FBQSxTQUFTLEdBQUcsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLEVBQTVCLENBQTRCLENBQUM7SUFHekUsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUUsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUUsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLElBQUksbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0lBRy9CLElBQUksRUFBRSxHQUFHLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzVCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDdEQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNaLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNQLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUUsQ0FBQztRQUN6QixJQUFJLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsSUFBSSxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDM0MsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUMsRUFBRSxJQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUMsQ0FBQztRQUM5QixRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDLENBQUMsQ0FBQztJQUdILEdBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsU0FBUyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQzdELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBSSxJQUFFLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDOUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2hELG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ25DLElBQUksTUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLElBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUMzQyxVQUFVLENBQUMsTUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUMsRUFBRSxNQUFBLEVBQUUsRUFBRSxNQUFBLEVBQUMsQ0FBQztZQUMvQixRQUFRLENBQUMsSUFBRSxFQUFFLElBQUUsRUFBRSxNQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBSSxDQUFDLENBQUM7WUFHbEQsSUFBSSxVQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUN4QyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNoRCxFQUFFLENBQUMsQ0FBQyxhQUFhLElBQUksSUFBSTtnQkFDeEIsQ0FBQyxLQUFLLFVBQVEsR0FBRyxDQUFDO2dCQUNsQixZQUFZLElBQUksVUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsWUFBWSxDQUFDLEtBQUssQ0FDakI7b0JBQ0MsT0FBTyxFQUFFLElBQUk7b0JBQ2IsR0FBRyxFQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBRSxPQUFJO29CQUN2QixJQUFJLEVBQUssSUFBRSxPQUFJO2lCQUNmLENBQUMsQ0FBQztnQkFDSixhQUFhLEdBQUcsTUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN6QixDQUFDO1lBR0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNqRCxJQUFJLElBQUksR0FBRyxNQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLElBQUksR0FBbUIsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUM1RCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQVMsQ0FBQztnQkFFOUQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsbUJBQW1CLElBQUksSUFBSTtvQkFDOUIsQ0FBQyxLQUFLLFVBQVEsR0FBRyxDQUFDO29CQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxpQkFBaUIsQ0FBQyxFQUFFO29CQUN2QyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLGFBQWEsSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDO29CQUNwRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxhQUFhO29CQUM5QixTQUFTLENBQUMsTUFBTSxJQUFJLFVBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQ2xFLGNBQWMsQ0FBQyxLQUFLLENBQ25CO3dCQUNDLE9BQU8sRUFBRSxJQUFJO3dCQUNiLEdBQUcsRUFBSyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBSTt3QkFDMUIsSUFBSSxFQUFLLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFJO3FCQUMzQixDQUFDLENBQUM7b0JBQ0osbUJBQW1CLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3BDLENBQUM7WUFDRixDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUM7SUFHRCxFQUFFLEdBQUcsS0FBSyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDM0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxJQUFJLEVBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUMzQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUMsRUFBRSxJQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUMsQ0FBQztJQUUvQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDakQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUN4RCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUd6QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNwQixpQkFBaUIsQ0FBQyxZQUFZLENBQUMsRUFDL0IsaUJBQWlCLENBQUMsY0FBYyxDQUFDLEVBQ2pDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FDeEMsQ0FBQztJQUNGLEVBQUUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBRUQsMkJBQTJCLFNBQTRCO0lBQ3RELElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQXVCLENBQUM7SUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUMzQyxDQUFDO0FBRUQsNkJBQTZCLENBQVMsRUFBRSxRQUFnQjtJQUN2RCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDM0MsT0FBTyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQztTQUNuQyxLQUFLLENBQUMsTUFBTSxFQUFLLENBQUMsR0FBRyxFQUFFLE9BQUksQ0FBQyxDQUFDO0lBRS9CLElBQUksQ0FBQyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDckIsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGdCQUFjLFFBQVUsQ0FBQyxDQUFDO0lBQ3pFLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1NBQ3ZCLElBQUksQ0FBQyxPQUFPLEVBQUUsMkNBQTJDLENBQUM7U0FDMUQsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUNaLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDL0IsTUFBTSxDQUFDO1FBQ1IsQ0FBQztRQUNELEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN4QixpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUM7U0FDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1NBQ1gsSUFBSSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQztTQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFZCxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztTQUN2QixJQUFJLENBQUMsT0FBTyxFQUFFLDJDQUEyQyxDQUFDO1NBQzFELEVBQUUsQ0FBQyxPQUFPLEVBQUU7UUFDWixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQztRQUNSLENBQUM7UUFDRCxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDeEIsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDO1NBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztTQUNYLElBQUksQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUM7U0FDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRWpCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDbEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDcEUsQ0FBQztBQUVELHlCQUF5QixJQUFlLEVBQUUsVUFBOEIsRUFBRSxXQUE4QjtJQUN2RyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3hDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUM7SUFDUixDQUFDO0lBQ0QsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQzdCLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRCxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdCLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUM5QixVQUFzQixDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzlDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sVUFBc0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUM1QyxDQUFDO2dCQUNELFFBQVEsRUFBRSxDQUFDO1lBQ1osQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUU7WUFDcEIsRUFBRSxDQUFDLENBQUUsRUFBRSxDQUFDLEtBQWEsQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdEMsZUFBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDaEQsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0YsS0FBSyxDQUFDLElBQUksRUFBdUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM1QyxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDckMsVUFBc0IsQ0FBQyxNQUFNO1FBQzdCLFVBQXNCLENBQUMsSUFBSSxDQUFDO0lBQzlCLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDO0lBQzNELFNBQVMsQ0FBQyxLQUFLLENBQ2Q7UUFDQyxNQUFNLEVBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBSTtRQUNsQyxLQUFLLEVBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFJO1FBQzVCLFNBQVMsRUFBRSxPQUFPO0tBQ2xCLENBQUMsQ0FBQztJQUNKLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1NBQ3hCLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO1NBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0IsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7U0FDdkIsUUFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUVELGtCQUNDLEtBQWMsRUFBRSxVQUF3RCxFQUN4RSxPQUFvQixFQUFFLFNBQTRCLEVBQ2xELE9BQWdCLEVBQUUsS0FBYSxFQUFFLE1BQWM7SUFDL0MsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDcEQsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekMsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckMsSUFBSSxLQUFLLEdBQUc7UUFDWCxNQUFNLEVBQ0w7WUFDQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsR0FBRyxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUM7WUFDaEMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFO1NBQ1o7UUFDRixNQUFNLEVBQ0w7WUFDQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxTQUFTLEdBQUcsQ0FBQztZQUMxQixDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUU7U0FDdkQ7S0FDRixDQUFDO0lBQ0YsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFWLENBQVUsQ0FBQyxDQUFDO0lBQzdELElBQUksQ0FBQyxJQUFJLENBQ1I7UUFDQyxjQUFjLEVBQUUsbUJBQW1CO1FBQ25DLE9BQUssRUFBRSxNQUFNO1FBQ2IsRUFBRSxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2xELENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUNyQixDQUFDLENBQUM7SUFJSixTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUN0QixJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDN0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7U0FDM0IsRUFBRSxDQUFDLFVBQVUsRUFBRTtRQUNmLHNCQUFzQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDO1NBQ0QsRUFBRSxDQUFDLFlBQVksRUFBRTtRQUNqQixlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQztTQUNELEVBQUUsQ0FBQyxZQUFZLEVBQUU7UUFDakIsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQztBQUNiLENBQUM7QUFPRCxnQ0FBZ0MsSUFBYSxFQUFFLFdBQThCO0lBQzVFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNyRCxRQUFRLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNQLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNyRCxhQUFhLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsUUFBUSxFQUFFLENBQUM7SUFDWixDQUFDO0FBQ0YsQ0FBQztBQVNELGdDQUFnQyxPQUFvQixFQUFFLFNBQWtCO0lBQ3ZFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDZixRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2QsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQUEsSUFBSTtZQUNqQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMzQixRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsQ0FBQztJQUNGLENBQUM7SUFDRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkUsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXZFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZixFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBQSxJQUFJO2dCQUNqQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1lBRUgsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFDLENBQUM7UUFDRixDQUFDO1FBQ0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFFOUIsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFJLEtBQUssR0FBRyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFBLElBQUk7Z0JBQ2pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBRWYsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0FBQ0YsQ0FBQztBQUVELHlCQUF5QixPQUFvQjtJQUM1QyxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQztJQUV6QixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUM5RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDOUMsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUMzQyxDQUFDO0lBQ0YsQ0FBQztJQUNELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztBQUN6QixDQUFDO0FBRUQsMEJBQTBCLE9BQW9CO0lBQzdDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztJQUN0QixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUM5RCxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQztZQUNsQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDOUMsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixnQkFBZ0IsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDaEQsQ0FBQztRQUNGLElBQUksQ0FBQyxDQUFDO1lBQ0wsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDNUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDbEMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQzlCLENBQUM7WUFDRixDQUFDO1lBRUQsZ0JBQWdCLElBQUksUUFBUSxDQUFDO1FBQzlCLENBQUM7UUFDRCxhQUFhLElBQUksZ0JBQWdCLENBQUM7SUFDbkMsQ0FBQztJQUNELE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFDdEIsQ0FBQztBQUVELGlCQUFpQixPQUFvQixFQUFFLFVBQXVCO0lBQzdELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNiLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzVDLElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixJQUFJLEtBQUssR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCwyQ0FBMkMsT0FBb0IsRUFBRSxVQUF1QjtJQUN2RixJQUFJLG1CQUFtQixHQUFHLENBQUMsQ0FBQztJQUM1QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM1QyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxLQUFLLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLElBQUksVUFBVSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLE9BQU8sR0FBRyxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxtQkFBbUIsSUFBSSxPQUFPLENBQUM7SUFDaEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztBQUM1QixDQUFDO0FBRUQsOEJBQThCLFVBQXVCO0lBQ3BELElBQUksVUFBVSxHQUFXLENBQUMsQ0FBQztJQUMzQixJQUFJLFdBQVcsR0FBVyxDQUFDLENBQUM7SUFDNUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDNUMsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLFVBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLFdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFFRCxpQ0FBaUMsT0FBb0IsRUFBRSxVQUF1QjtJQUM3RSxJQUFJLGlCQUFpQixHQUFXLENBQUMsQ0FBQztJQUNsQyxJQUFJLGtCQUFrQixHQUFXLENBQUMsQ0FBQztJQUNuQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM1QyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxLQUFLLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLElBQUksVUFBVSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLFNBQVMsR0FBRyxVQUFVLEtBQUssU0FBUyxDQUFDLEtBQUssQ0FBQztRQUMvQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2YsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLGlCQUFpQixJQUFJLENBQUMsQ0FBQztZQUN4QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1Asa0JBQWtCLElBQUksQ0FBQyxDQUFDO1lBQ3pCLENBQUM7UUFDRixDQUFDO0lBRUYsQ0FBQztJQUNELElBQUksWUFBWSxHQUFhLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlELE1BQU0sQ0FBQyxDQUFDLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxrQkFBa0IsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRixDQUFDO0FBR0Qsa0JBQWtCLFNBQWlCO0lBQWpCLDBCQUFBLEVBQUEsaUJBQWlCO0lBRWxDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRTlDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV4QixzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0MsSUFBSSxVQUFVLEdBQUcsY0FBYyxJQUFJLElBQUk7UUFDdEMsY0FBYyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQy9DLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBR2pFLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztTQUMzQyxJQUFJLENBQUMsVUFBVSxJQUFzQztRQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdEYsQ0FBQyxDQUFDLENBQUM7SUFFSixpQkFBaUIsQ0FBUztRQUN6QixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUM7UUFDbkIsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsbUJBQW1CLENBQVM7UUFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELHVCQUF1QixDQUFTLEVBQUUsQ0FBSztRQUFMLGtCQUFBLEVBQUEsS0FBSztRQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsMEJBQTBCLENBQVM7UUFDbEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUlELElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQztJQUMzQixJQUFJLFlBQVksR0FBRyxTQUFTLENBQUM7SUFDN0IsSUFBSSxpQkFBaUIsR0FBRyxjQUFjLENBQUM7SUFDdkMsYUFBYSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELEtBQUssQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBR2pELEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQzNELEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3pELEVBQUUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkUsRUFBRSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLEVBQUUsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRixFQUFFLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9FLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pELEVBQUUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUNuRSxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUVEO0lBQ0MsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzFCLEdBQUcsQ0FBQyxDQUFDLElBQUksU0FBUyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hCLENBQUM7SUFDRixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNmLENBQUM7QUFFRCx3QkFBd0IsQ0FBUyxFQUFFLENBQVM7SUFDM0MsSUFBSSxLQUFLLEdBQWEsRUFBRSxDQUFDO0lBQ3pCLEdBQUcsQ0FBQyxDQUFDLElBQUksU0FBUyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQztJQUNGLENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2QsQ0FBQztBQUVEO0lBQ0MsSUFBSSxFQUFFLENBQUM7SUFDUCxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxLQUFLLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN6RSxDQUFDO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFHSCxnQkFBZ0IsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUMsYUFBYSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTFDLFNBQVMsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3hDLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRXRDLElBQUksbUNBQW1DLEdBQVcsaUNBQWlDLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3hHLElBQUksa0NBQWtDLEdBQVcsaUNBQWlDLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RHLGNBQWMsR0FBRyxDQUFDLG1DQUFtQyxHQUFHLGtDQUFrQyxDQUFDLEdBQUcsYUFBYSxDQUFDO0lBRTVHLG9CQUFvQixHQUFHLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuRSxtQkFBbUIsR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFHakUsUUFBUSxFQUFFLENBQUM7QUFDWixDQUFDO0FBRUQsMEJBQWlDLE9BQW9CO0lBQ3BELElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDbEUsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzlDLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzlDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdCLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDaEIsQ0FBQztBQWJELDRDQWFDO0FBRUQsZUFBZSxTQUFpQjtJQUFqQiwwQkFBQSxFQUFBLGlCQUFpQjtJQUMvQixTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbEIsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoQixpQkFBaUIsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFZixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsZUFBZSxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ3BELEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUN6RCxFQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFJckQsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNULElBQUksU0FBUyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzVDLElBQUksS0FBSyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9ELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLGVBQU8sQ0FBQyxVQUFVLENBQUM7UUFDNUQsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDN0MsT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQ2xFLEtBQUssQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUQsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUV4QyxJQUFJLG1DQUFtQyxHQUFXLGlDQUFpQyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN4RyxJQUFJLGtDQUFrQyxHQUFXLGlDQUFpQyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUV0RyxjQUFjLEdBQUcsQ0FBQyxtQ0FBbUMsR0FBRyxrQ0FBa0MsQ0FBQyxHQUFHLGFBQWEsQ0FBQztJQUU1RyxvQkFBb0IsR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbkUsbUJBQW1CLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRWpFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEIsQ0FBQztBQUVEO0lBQ0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDdkUsTUFBTSxDQUFDO0lBQ1IsQ0FBQztJQUVELEVBQUUsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM3QyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDL0MsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUUzQixFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWEsS0FBSyxDQUFDLFFBQVEsVUFBTyxFQUFFLFVBQUMsR0FBRyxFQUFFLFlBQVk7UUFDN0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNULE1BQU0sR0FBRyxDQUFDO1FBQ1gsQ0FBQztRQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFMUMsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUMzQjtnQkFDQyxZQUFZLEVBQUUsTUFBTTtnQkFDcEIsZUFBZSxFQUFFLE1BQU07YUFDdkIsQ0FBQztpQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDckIsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsQ0FBQztJQUNGLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELHlCQUF5QixNQUFNLEVBQUUsYUFBYTtJQUM3QyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDWixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDWixNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNqQyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFbEMsSUFBSSxDQUFDLE9BQU8sQ0FDWCxVQUFVLENBQUM7UUFDVixPQUFPLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDLENBQUMsQ0FBQztJQUNKLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUVELDZCQUE2QixNQUFNO0lBQ2xDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsSUFBTSxPQUFPLEdBQUcsc05BQXNOLENBQUM7SUFDdk8sSUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztJQUN4QixJQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7SUFDekQsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVyQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUVkLEdBQUcsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDO0lBQ0YsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRUQ7SUFDQyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFbEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxlQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUM5QyxHQUFHLENBQUMsQ0FBQyxJQUFJLE9BQU8sSUFBSSxnQkFBUSxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLE1BQU0sR0FBUSxRQUFRLENBQUMsYUFBYSxDQUFDLHlCQUF1QixPQUFPLE1BQUcsQ0FBQyxDQUFDO1lBQzVFLElBQUksYUFBYSxHQUFHLGdCQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFdEMsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QixRQUFRLENBQUM7WUFDVixDQUFDO1lBQ0QsZUFBZSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztRQUd4QyxDQUFDO0lBQ0YsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssZUFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDMUMsR0FBRyxDQUFDLENBQUMsSUFBSSxVQUFVLElBQUksbUJBQVcsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBSSxNQUFNLEdBQ1QsUUFBUSxDQUFDLGFBQWEsQ0FBQyw0QkFBMEIsVUFBVSxNQUFHLENBQUMsQ0FBQztZQUNqRSxJQUFJLGFBQWEsR0FBRyxtQkFBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNGLENBQUM7QUFDRixDQUFDO0FBRUQ7SUFFQyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7UUFDdkIsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFPLElBQU0sQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsMENBQXdDLElBQU0sQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFDRCxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUMsQ0FBQztJQUlILElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUMvQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFVO1lBQVQsWUFBSSxFQUFFLFVBQUU7UUFDbEMsSUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7YUFDdEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxtREFBbUQsQ0FBQyxDQUFDO1FBQ3JFLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2FBQy9CLElBQUksQ0FDSjtZQUNDLElBQUksRUFBRSxVQUFVO1lBQ2hCLE9BQUssRUFBRSxxQkFBcUI7U0FDNUIsQ0FBQyxDQUFDO1FBQ0wsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUNELEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1lBQ2xCLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNsQixpQkFBaUIsRUFBRSxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUM7aUJBQzlCLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2FBQ2xCLElBQUksQ0FBQyxPQUFPLEVBQUUsMkJBQTJCLENBQUM7YUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDO1NBQzlCLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRUQsc0JBQXNCLFNBQWlCO0lBQWpCLDBCQUFBLEVBQUEsaUJBQWlCO0lBQ3RDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUVoQixLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xCLGlCQUFpQixFQUFFLENBQUM7SUFDckIsQ0FBQztJQUNELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLElBQUksVUFBVSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxlQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3RELG1CQUFtQixHQUFHLG9CQUFvQixDQUFDO0lBRTVDLElBQUksU0FBUyxDQUFDO0lBQ2QsSUFBSSxJQUFJLEdBQWdCLEVBQUUsQ0FBQztJQUczQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoQixJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqQixTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sS0FBSyxlQUFPLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUN4RixJQUFJLEdBQUcsU0FBUyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUdELGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNyRSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdEMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFbEMsSUFBSSxTQUFTLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQXRCLENBQXNCLENBQUMsQ0FBQztJQUNyRixLQUFLLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRCxLQUFLLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVqRCxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyRSxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyRSxFQUFFLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzdFLEVBQUUsQ0FBQyxNQUFNLENBQUMsc0NBQXNDLENBQUM7U0FDL0MsSUFBSSxDQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUcsQ0FBQyxDQUFDO0lBRWpFLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBRTlELENBQUM7QUFFRCxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM1QixJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztBQUU5QjtJQUNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQztJQUNSLENBQUM7SUFDRCxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDO0lBQ25CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFJLEdBQUcsa0JBQWdCLEtBQUssQ0FBQyxRQUFVLENBQUM7SUFDekMsQ0FBQztJQUNELEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRUQ7SUFDQyxFQUFFLENBQUMsTUFBTSxFQUNSO1FBQ0MsT0FBTyxFQUFFLE9BQU87UUFDaEIsYUFBYSxFQUFFLHFCQUFxQjtRQUNwQyxXQUFXLEVBQUUsaUJBQWlCLEdBQUcsU0FBUyxHQUFHLFdBQVc7UUFDeEQsVUFBVSxFQUFFLEtBQUssQ0FBQyxRQUFRLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsUUFBUTtLQUN4RCxDQUFDLENBQUM7SUFDSixpQkFBaUIsR0FBRyxLQUFLLENBQUM7QUFDM0IsQ0FBQztBQUVELHVCQUF1QixJQUFJO0lBQzFCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDOUMsR0FBRyxDQUFDLGNBQWMsQ0FDakIsT0FBTyxFQUNQLElBQUksRUFDSixJQUFJLEVBQ0osTUFBTSxFQUNOLENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLEVBQ0QsS0FBSyxFQUNMLEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLENBQUMsRUFDRCxJQUFJLENBQUMsQ0FBQztJQUVQLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUdELHFCQUFxQixFQUFFLENBQUM7QUFFeEIsT0FBTyxFQUFFLENBQUM7QUFDVixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ1osWUFBWSxFQUFFLENBQUM7Ozs7QUM3cURmLHlCQUEyQjtBQUMzQixtQ0FBcUM7QUFJckMsSUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUM7QUFHdkIsUUFBQSxXQUFXLEdBQTZDO0lBQ2xFLE1BQU0sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUk7SUFDM0IsTUFBTSxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSTtJQUMzQixTQUFTLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPO0lBQ2pDLFFBQVEsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU07SUFDL0IsTUFBTSxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSTtDQUMzQixDQUFDO0FBR1MsUUFBQSxlQUFlLEdBQWlEO0lBQzFFLE1BQU0sRUFBRSxJQUFJO0lBQ1osSUFBSSxFQUFFLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFO0lBQ2xDLElBQUksRUFBRSxFQUFFLENBQUMsc0JBQXNCLENBQUMsRUFBRTtDQUNsQyxDQUFDO0FBR1MsUUFBQSxRQUFRLEdBQTZDO0lBQy9ELFFBQVEsRUFBRSxPQUFPLENBQUMsa0JBQWtCO0lBQ3BDLEtBQUssRUFBRSxPQUFPLENBQUMsZUFBZTtJQUM5QixPQUFPLEVBQUUsT0FBTyxDQUFDLG9CQUFvQjtJQUNyQyxRQUFRLEVBQUUsT0FBTyxDQUFDLGtCQUFrQjtJQUNwQyxNQUFNLEVBQUUsT0FBTyxDQUFDLGVBQWU7Q0FDL0IsQ0FBQztBQUdTLFFBQUEsV0FBVyxHQUE2QztJQUNsRSxXQUFXLEVBQUUsT0FBTyxDQUFDLFlBQVk7SUFDakMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxlQUFlO0NBQ3BDLENBQUM7QUFFRix5QkFBZ0MsR0FBUSxFQUFFLEtBQVU7SUFDbkQsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ1osQ0FBQztJQUNGLENBQUM7SUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ2xCLENBQUM7QUFQRCwwQ0FPQztBQUVELGtCQUFrQixDQUFTLEVBQUUsTUFBYztJQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxNQUFNLENBQUM7QUFDNUMsQ0FBQztBQUVELHNCQUFzQixHQUFRO0lBQzdCLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUMxQixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQixDQUFDO0lBQ0YsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDZixDQUFDO0FBTUQsSUFBWSxJQU9YO0FBUEQsV0FBWSxJQUFJO0lBQ2YsbUNBQU0sQ0FBQTtJQUNOLG1DQUFNLENBQUE7SUFDTiwrQ0FBWSxDQUFBO0lBQ1osK0NBQVksQ0FBQTtJQUNaLHFDQUFPLENBQUE7SUFDUCxtQ0FBTSxDQUFBO0FBQ1AsQ0FBQyxFQVBXLElBQUksR0FBSixZQUFJLEtBQUosWUFBSSxRQU9mO0FBRUQsSUFBWSxPQUdYO0FBSEQsV0FBWSxPQUFPO0lBQ2xCLHlEQUFjLENBQUE7SUFDZCxpREFBVSxDQUFBO0FBQ1gsQ0FBQyxFQUhXLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQUdsQjtBQUVVLFFBQUEsUUFBUSxHQUFHO0lBQ3JCLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxjQUFjO0lBQ3hDLFlBQVksRUFBRSxPQUFPLENBQUMsVUFBVTtDQUNoQyxDQUFDO0FBU0Y7SUFBQTtRQXVDQyxrQkFBYSxHQUFHLEdBQUcsQ0FBQztRQUNwQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUNqQixxQkFBZ0IsR0FBRyxHQUFHLENBQUM7UUFDdkIsaUJBQVksR0FBRyxHQUFHLENBQUM7UUFDbkIsdUJBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixhQUFRLEdBQVcsSUFBSSxDQUFDO1FBQ3hCLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ25CLGVBQVUsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztRQUNwQyxtQkFBYyxHQUE4QixJQUFJLENBQUM7UUFDakQsWUFBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7UUFDakMsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLG9CQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLHdCQUFtQixHQUFVLEVBQUUsQ0FBQztRQUNoQyxpQkFBWSxHQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsTUFBQyxHQUFHLElBQUksQ0FBQztRQUNULE1BQUMsR0FBRyxJQUFJLENBQUM7UUFDVCxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsU0FBSSxHQUFHLEtBQUssQ0FBQztRQUNiLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsU0FBSSxHQUFHLEtBQUssQ0FBQztRQUNiLFNBQUksR0FBZ0IsRUFBRSxDQUFDO1FBQ3ZCLFlBQU8sR0FBMEIsT0FBTyxDQUFDLG9CQUFvQixDQUFDO1FBQzlELGVBQVUsR0FBMEIsT0FBTyxDQUFDLFlBQVksQ0FBQztJQXVIMUQsQ0FBQztJQWhITyxzQkFBZ0IsR0FBdkI7UUFDQyxJQUFJLEdBQUcsR0FBOEIsRUFBRSxDQUFDO1FBQ3hDLEdBQUcsQ0FBQyxDQUFpQixVQUF3QyxFQUF4QyxLQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQXhDLGNBQXdDLEVBQXhDLElBQXdDO1lBQXhELElBQUksUUFBUSxTQUFBO1lBQ1osSUFBQSx3QkFBbUMsRUFBbEMsY0FBSSxFQUFFLGFBQUssQ0FBd0I7WUFDeEMsR0FBRyxDQUFDLE1BQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUNsQjtRQUNELElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFFeEIsZ0JBQWdCLElBQVk7WUFDM0IsTUFBTSxDQUFDLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ3BFLENBQUM7UUFFRCxvQkFBb0IsS0FBYTtZQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBR0QsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFvQjtnQkFBbkIsY0FBSSxFQUFFLGNBQUksRUFBRSxrQkFBTTtZQUN2QyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNkLEtBQUssSUFBSSxDQUFDLE1BQU07b0JBQ2YsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3BCLE1BQU0sS0FBSyxDQUFDLDZDQUE2Qzs0QkFDeEQsMEJBQTBCLENBQUMsQ0FBQztvQkFDOUIsQ0FBQztvQkFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLENBQUM7b0JBQ0QsS0FBSyxDQUFDO2dCQUNQLEtBQUssSUFBSSxDQUFDLE1BQU07b0JBQ2YsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFbEIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMxQixDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUCxLQUFLLElBQUksQ0FBQyxNQUFNO29CQUNmLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3pCLENBQUM7b0JBQ0QsS0FBSyxDQUFDO2dCQUNQLEtBQUssSUFBSSxDQUFDLE9BQU87b0JBQ2hCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxPQUFPLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUN0RCxDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUCxLQUFLLElBQUksQ0FBQyxZQUFZO29CQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ2pELENBQUM7b0JBQ0QsS0FBSyxDQUFDO2dCQUNQLEtBQUssSUFBSSxDQUFDLFlBQVk7b0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUDtvQkFDQyxNQUFNLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1lBQ2xFLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztRQUdILFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1lBQzdCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDeEIsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNkLENBQUM7SUFLRCx5QkFBUyxHQUFUO1FBQUEsaUJBcUJDO1FBbkJBLElBQUksS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUN6QixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQW9CO2dCQUFuQixjQUFJLEVBQUUsY0FBSSxFQUFFLGtCQUFNO1lBQ3ZDLElBQUksS0FBSyxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV2QixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDO1lBQ1IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsS0FBSyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDeEMsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLENBQUM7WUFDRCxLQUFLLENBQUMsSUFBSSxDQUFJLElBQUksU0FBSSxLQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUVILFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1lBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUksSUFBSSxTQUFJLEtBQUksQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBR0QsOEJBQWMsR0FBZDtRQUNDLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUMxQixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEQsQ0FBQztRQUNGLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2YsQ0FBQztJQUVELCtCQUFlLEdBQWYsVUFBZ0IsSUFBWSxFQUFFLE1BQWU7UUFDNUMsSUFBSSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUN6QyxDQUFDO0lBQ0YsWUFBQztBQUFELENBak1BLEFBaU1DO0FBaE1lLFdBQUssR0FDbkI7SUFDQyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLG1CQUFXLEVBQUM7SUFDNUQ7UUFDQyxJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTTtRQUNqQixNQUFNLEVBQUUsdUJBQWU7S0FDdkI7SUFDRCxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDdEMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxnQkFBUSxFQUFDO0lBQ3RELEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsbUJBQVcsRUFBQztJQUM1RCxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDekMsRUFBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDN0MsRUFBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDL0MsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQ2xDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBQztJQUMvQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDakMsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQzFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUN4QyxFQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDMUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQy9CLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUMvQixFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDckMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQ3RDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUN0QyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDbEMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQ2xDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUNsQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDbEMsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQzFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNyQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLGdCQUFRLEVBQUM7SUFDdEQsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQ3RDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztDQUN0QyxDQUFDO0FBbkNTLHNCQUFLIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4vKipcbiAqIEEgdHdvIGRpbWVuc2lvbmFsIGV4YW1wbGU6IHggYW5kIHkgY29vcmRpbmF0ZXMgd2l0aCB0aGUgbGFiZWwuXG4gKi9cbmV4cG9ydCB0eXBlIEV4YW1wbGUyRCA9IHtcblx0eDogbnVtYmVyLFxuXHR5OiBudW1iZXIsXG5cdGxhYmVsOiBudW1iZXJcbn07XG5cbnR5cGUgUG9pbnQgPSB7XG5cdFx0eDogbnVtYmVyLFxuXHRcdHk6IG51bWJlclxuXHR9O1xuXG5leHBvcnQgdHlwZSBEYXRhR2VuZXJhdG9yID0gKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcikgPT4gRXhhbXBsZTJEW107XG5cbmludGVyZmFjZSBIVE1MSW5wdXRFdmVudCBleHRlbmRzIEV2ZW50IHtcblx0dGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50ICYgRXZlbnRUYXJnZXQ7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gQ0xBU1NJRklDQVRJT05cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIEJyaW5nIFlvdXIgT3duIERhdGFcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlCWU9EYXRhKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6IEV4YW1wbGUyRFtdIHtcblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0Ly8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuXHQvLyB+IHZhciBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHQvLyB+IHZhciBkYXRhO1xuXG5cdC8vIH4gdmFyIGlucHV0QllPRCA9IGQzLnNlbGVjdChcIiNpbnB1dEZpbGVCWU9EXCIpO1xuXHQvLyB+IGlucHV0QllPRC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSAvLzogRXhhbXBsZTJEW11cblx0Ly8gfiB7XG5cdC8vIH4gdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cdC8vIH4gdmFyIG5hbWUgPSB0aGlzLmZpbGVzWzBdLm5hbWU7XG5cdC8vIH4gcmVhZGVyLnJlYWRBc1RleHQodGhpcy5maWxlc1swXSk7XG5cdC8vIH4gcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KVxuXHQvLyB+IHtcblx0Ly8gfiB2YXIgdGFyZ2V0OiBhbnkgPSBldmVudC50YXJnZXQ7XG5cdC8vIH4gZGF0YSA9IHRhcmdldC5yZXN1bHQ7XG5cdC8vIH4gbGV0IHMgPSBkYXRhLnNwbGl0KFwiXFxuXCIpO1xuXHQvLyB+IGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKylcblx0Ly8gfiB7XG5cdC8vIH4gbGV0IHNzID0gc1tpXS5zcGxpdChcIixcIik7XG5cdC8vIH4gaWYgKHNzLmxlbmd0aCAhPSAzKSBicmVhaztcblx0Ly8gfiBsZXQgeCA9IHNzWzBdO1xuXHQvLyB+IGxldCB5ID0gc3NbMV07XG5cdC8vIH4gbGV0IGxhYmVsID0gc3NbMl07XG5cdC8vIH4gcG9pbnRzLnB1c2goe3gseSxsYWJlbH0pO1xuXHQvLyB+IGNvbnNvbGUubG9nKHBvaW50c1tpXS54K1wiLFwiK3BvaW50c1tpXS55K1wiLFwiK3BvaW50c1tpXS5sYWJlbCk7XG5cdC8vIH4gfVxuXHQvLyB+IGNvbnNvbGUubG9nKFwiODEgZGF0YXNldC50czogcG9pbnRzLmxlbmd0aCA9IFwiICsgcG9pbnRzLmxlbmd0aCk7XG5cdC8vIH4gfTtcblx0Ly8gfiBjb25zb2xlLmxvZyhcIjgzIGRhdGFzZXQudHM6IHBvaW50cy5sZW5ndGggPSBcIiArIHBvaW50cy5sZW5ndGgpO1xuXHQvLyB+IH0pO1xuXHQvLyB+IGNvbnNvbGUubG9nKFwiODUgZmlsZW5hbWU6IFwiICsgbmFtZSk7XG5cdC8vIH4gY29uc29sZS5sb2coXCI4NiBkYXRhc2V0LnRzOiBwb2ludHMubGVuZ3RoID0gXCIgKyBwb2ludHMubGVuZ3RoKTtcblx0cmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBDTEFTU0lGWSBHQVVTU0lBTiBDTFVTVEVSU1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeVR3b0dhdXNzRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdGxldCB2YXJpYW5jZSA9IDAuNTtcblxuXHQvLyBBV0cgTm9pc2UgVmFyaWFuY2UgPSBTaWduYWwgLyAxMF4oU05SZEIvMTApXG5cdGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHRmdW5jdGlvbiBnZW5HYXVzcyhjeDogbnVtYmVyLCBjeTogbnVtYmVyLCBsYWJlbDogbnVtYmVyKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzIC8gMjsgaSsrKSB7XG5cdFx0XHRsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIHZhcmlhbmNlICogZE5vaXNlKTtcblx0XHRcdGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgdmFyaWFuY2UgKiBkTm9pc2UpO1xuXHRcdFx0bGV0IHNpZ25hbFggPSBub3JtYWxSYW5kb20oY3gsIHZhcmlhbmNlKTtcblx0XHRcdGxldCBzaWduYWxZID0gbm9ybWFsUmFuZG9tKGN5LCB2YXJpYW5jZSk7XG5cdFx0XHRsZXQgeCA9IHNpZ25hbFggKyBub2lzZVg7XG5cdFx0XHRsZXQgeSA9IHNpZ25hbFkgKyBub2lzZVk7XG5cdFx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0XHR9XG5cdH1cblxuXHRnZW5HYXVzcygyLCAyLCAxKTsgLy8gR2F1c3NpYW4gd2l0aCBwb3NpdGl2ZSBleGFtcGxlcy5cblx0Z2VuR2F1c3MoLTIsIC0yLCAtMSk7IC8vIEdhdXNzaWFuIHdpdGggbmVnYXRpdmUgZXhhbXBsZXMuXG5cdHJldHVybiBwb2ludHM7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vIENMQVNTSUZZIFNQSVJBTFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlTcGlyYWxEYXRhKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6IEV4YW1wbGUyRFtdIHtcblxuXHQvLyBBV0cgTm9pc2UgVmFyaWFuY2UgPSBTaWduYWwgLyAxMF4oU05SZEIvMTApXG5cdGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRsZXQgbiA9IG51bVNhbXBsZXMgLyAyO1xuXG5cdGZ1bmN0aW9uIGdlblNwaXJhbChkZWx0YVQ6IG51bWJlciwgbGFiZWw6IG51bWJlcikge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRsZXQgciA9IGkgLyBuICogNTtcblx0XHRcdGxldCByMiA9IHIgKiByO1xuXHRcdFx0bGV0IHQgPSAxLjc1ICogaSAvIG4gKiAyICogTWF0aC5QSSArIGRlbHRhVDtcblx0XHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgciAqIGROb2lzZSk7XG5cdFx0XHRsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIHIgKiBkTm9pc2UpO1xuXHRcdFx0bGV0IHggPSByICogTWF0aC5zaW4odCkgKyBub2lzZVg7XG5cdFx0XHRsZXQgeSA9IHIgKiBNYXRoLmNvcyh0KSArIG5vaXNlWTtcblx0XHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHRcdH1cblx0fVxuXG5cdGdlblNwaXJhbCgwLCAxKTsgLy8gUG9zaXRpdmUgZXhhbXBsZXMuXG5cdGdlblNwaXJhbChNYXRoLlBJLCAtMSk7IC8vIE5lZ2F0aXZlIGV4YW1wbGVzLlxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBDTEFTU0lGWSBDSVJDTEVcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeUNpcmNsZURhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXHQvLyBBV0cgTm9pc2UgVmFyaWFuY2UgPSBTaWduYWwgLyAxMF4oU05SZEIvMTApXG5cdGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRsZXQgcmFkaXVzID0gNTtcblxuXHQvLyBHZW5lcmF0ZSBwb3NpdGl2ZSBwb2ludHMgaW5zaWRlIHRoZSBjaXJjbGUuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlcyAvIDI7IGkrKykge1xuXHRcdGxldCByID0gcmFuZFVuaWZvcm0oMCwgcmFkaXVzICogMC41KTtcblx0XHQvLyBXZSBhc3N1bWUgcl4yIGFzIHRoZSB2YXJpYW5jZSBvZiB0aGUgU2lnbmFsXG5cdFx0bGV0IHIyID0gciAqIHI7XG5cdFx0bGV0IGFuZ2xlID0gcmFuZFVuaWZvcm0oMCwgMiAqIE1hdGguUEkpO1xuXHRcdGxldCB4ID0gciAqIE1hdGguc2luKGFuZ2xlKTtcblx0XHRsZXQgeSA9IHIgKiBNYXRoLmNvcyhhbmdsZSk7XG5cdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCAxIC8gcmFkaXVzICogZE5vaXNlKTtcblx0XHRsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIDEgLyByYWRpdXMgKiBkTm9pc2UpO1xuXHRcdHggKz0gbm9pc2VYO1xuXHRcdHkgKz0gbm9pc2VZO1xuXHRcdGxldCBsYWJlbCA9IDE7XG5cdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdH1cblxuXHQvLyBHZW5lcmF0ZSBuZWdhdGl2ZSBwb2ludHMgb3V0c2lkZSB0aGUgY2lyY2xlLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXMgLyAyOyBpKyspIHtcblx0XHRsZXQgciA9IHJhbmRVbmlmb3JtKHJhZGl1cyAqIDAuNywgcmFkaXVzKTtcblxuXHRcdC8vIFdlIGFzc3VtZSByXjIgYXMgdGhlIHZhcmlhbmNlIG9mIHRoZSBTaWduYWxcblx0XHRsZXQgcnIyID0gciAqIHI7XG5cdFx0bGV0IGFuZ2xlID0gcmFuZFVuaWZvcm0oMCwgMiAqIE1hdGguUEkpO1xuXHRcdGxldCB4ID0gciAqIE1hdGguc2luKGFuZ2xlKTtcblx0XHRsZXQgeSA9IHIgKiBNYXRoLmNvcyhhbmdsZSk7XG5cdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCAxIC8gcmFkaXVzICogZE5vaXNlKTtcblx0XHRsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIDEgLyByYWRpdXMgKiBkTm9pc2UpO1xuXHRcdHggKz0gbm9pc2VYO1xuXHRcdHkgKz0gbm9pc2VZO1xuXHRcdGxldCBsYWJlbCA9IC0xO1xuXHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHR9XG5cdHJldHVybiBwb2ludHM7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vIENMQVNTSUZZIFhPUlxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5WE9SRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cdC8vIEFXRyBOb2lzZSBWYXJpYW5jZSA9IFNpZ25hbCAvIDEwXihTTlJkQi8xMClcblx0bGV0IGROb2lzZSA9IGRTTlIobm9pc2UpO1xuXG5cdC8vIFN0YW5kYXJkIGRldmlhdGlvbiBvZiB0aGUgc2lnbmFsXG5cdGxldCBzdGRTaWduYWwgPSA1O1xuXG5cdGZ1bmN0aW9uIGdldFhPUkxhYmVsKHA6IFBvaW50KSB7XG5cdFx0cmV0dXJuIHAueCAqIHAueSA+PSAwID8gMSA6IC0xO1xuXHR9XG5cblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzOyBpKyspIHtcblx0XHRsZXQgeCA9IHJhbmRVbmlmb3JtKC1zdGRTaWduYWwsIHN0ZFNpZ25hbCk7XG5cdFx0bGV0IHBhZGRpbmcgPSAwLjM7XG5cdFx0eCArPSB4ID4gMCA/IHBhZGRpbmcgOiAtcGFkZGluZzsgIC8vIFBhZGRpbmcuXG5cdFx0bGV0IHkgPSByYW5kVW5pZm9ybSgtc3RkU2lnbmFsLCBzdGRTaWduYWwpO1xuXHRcdHkgKz0geSA+IDAgPyBwYWRkaW5nIDogLXBhZGRpbmc7XG5cblx0XHRsZXQgdmFyaWFuY2VTaWduYWwgPSBzdGRTaWduYWwgKiBzdGRTaWduYWw7XG5cdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCB2YXJpYW5jZVNpZ25hbCAqIGROb2lzZSk7XG5cdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCB2YXJpYW5jZVNpZ25hbCAqIGROb2lzZSk7XG5cdFx0bGV0IGxhYmVsID0gZ2V0WE9STGFiZWwoe3g6IHggKyBub2lzZVgsIHk6IHkgKyBub2lzZVl9KTtcblx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0fVxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBSRUdSRVNTSU9OXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmV4cG9ydCBmdW5jdGlvbiByZWdyZXNzUGxhbmUobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXHRsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cdGxldCByYWRpdXMgPSA2O1xuXHRsZXQgcjIgPSByYWRpdXMgKiByYWRpdXM7XG5cdGxldCBsYWJlbFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKFstMTAsIDEwXSlcblx0XHQucmFuZ2UoWy0xLCAxXSk7XG5cdGxldCBnZXRMYWJlbCA9ICh4LCB5KSA9PiBsYWJlbFNjYWxlKHggKyB5KTtcblxuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXM7IGkrKykge1xuXHRcdGxldCB4ID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKTtcblx0XHRsZXQgeSA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XG5cdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCByMiAqIGROb2lzZSk7XG5cdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCByMiAqIGROb2lzZSk7XG5cdFx0bGV0IGxhYmVsID0gZ2V0TGFiZWwoeCArIG5vaXNlWCwgeSArIG5vaXNlWSk7XG5cdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdH1cblx0cmV0dXJuIHBvaW50cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ3Jlc3NHYXVzc2lhbihudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cdGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblxuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRsZXQgbGFiZWxTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0LmRvbWFpbihbMCwgMl0pXG5cdFx0LnJhbmdlKFsxLCAwXSlcblx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0bGV0IGdhdXNzaWFucyA9XG5cdFx0W1xuXHRcdFx0Wy00LCAyLjUsIDFdLFxuXHRcdFx0WzAsIDIuNSwgLTFdLFxuXHRcdFx0WzQsIDIuNSwgMV0sXG5cdFx0XHRbLTQsIC0yLjUsIC0xXSxcblx0XHRcdFswLCAtMi41LCAxXSxcblx0XHRcdFs0LCAtMi41LCAtMV1cblx0XHRdO1xuXG5cdGZ1bmN0aW9uIGdldExhYmVsKHgsIHkpIHtcblx0XHQvLyBDaG9vc2UgdGhlIG9uZSB0aGF0IGlzIG1heGltdW0gaW4gYWJzIHZhbHVlLlxuXHRcdGxldCBsYWJlbCA9IDA7XG5cdFx0Z2F1c3NpYW5zLmZvckVhY2goKFtjeCwgY3ksIHNpZ25dKSA9PiB7XG5cdFx0XHRsZXQgbmV3TGFiZWwgPSBzaWduICogbGFiZWxTY2FsZShkaXN0KHt4LCB5fSwge3g6IGN4LCB5OiBjeX0pKTtcblx0XHRcdGlmIChNYXRoLmFicyhuZXdMYWJlbCkgPiBNYXRoLmFicyhsYWJlbCkpIHtcblx0XHRcdFx0bGFiZWwgPSBuZXdMYWJlbDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbGFiZWw7XG5cdH1cblxuXHRsZXQgcmFkaXVzID0gNjtcblx0bGV0IHIyID0gcmFkaXVzICogcmFkaXVzO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXM7IGkrKykge1xuXHRcdGxldCB4ID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKTtcblx0XHRsZXQgeSA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XG5cdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCByMiAqIGROb2lzZSk7XG5cdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCByMiAqIGROb2lzZSk7XG5cdFx0bGV0IGxhYmVsID0gZ2V0TGFiZWwoeCArIG5vaXNlWCwgeSArIG5vaXNlWSk7XG5cdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdH1cblxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBBQ0NFU1NPUlkgRlVOQ1RJT05TXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAqIFNodWZmbGVzIHRoZSBhcnJheSB1c2luZyBGaXNoZXItWWF0ZXMgYWxnb3JpdGhtLiBVc2VzIHRoZSBzZWVkcmFuZG9tXG4gKiBsaWJyYXJ5IGFzIHRoZSByYW5kb20gZ2VuZXJhdG9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2h1ZmZsZShhcnJheTogYW55W10pOiB2b2lkIHtcblx0bGV0IGNvdW50ZXIgPSBhcnJheS5sZW5ndGg7XG5cdGxldCB0ZW1wID0gMDtcblx0bGV0IGluZGV4ID0gMDtcblx0Ly8gV2hpbGUgdGhlcmUgYXJlIGVsZW1lbnRzIGluIHRoZSBhcnJheVxuXHR3aGlsZSAoY291bnRlciA+IDApIHtcblx0XHQvLyBQaWNrIGEgcmFuZG9tIGluZGV4XG5cdFx0aW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb3VudGVyKTtcblx0XHQvLyBEZWNyZWFzZSBjb3VudGVyIGJ5IDFcblx0XHRjb3VudGVyLS07XG5cdFx0Ly8gQW5kIHN3YXAgdGhlIGxhc3QgZWxlbWVudCB3aXRoIGl0XG5cdFx0dGVtcCA9IGFycmF5W2NvdW50ZXJdO1xuXHRcdGFycmF5W2NvdW50ZXJdID0gYXJyYXlbaW5kZXhdO1xuXHRcdGFycmF5W2luZGV4XSA9IHRlbXA7XG5cdH1cbn1cblxuZnVuY3Rpb24gbG9nMih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZygyKTtcbn1cblxuZnVuY3Rpb24gbG9nMTAoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coMTApO1xufVxuXG5mdW5jdGlvbiBzaWduYWxPZih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gbG9nMigxICsgTWF0aC5hYnMoeCkpO1xufVxuXG5mdW5jdGlvbiBkU05SKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiAxIC8gTWF0aC5wb3coMTAsIHggLyAxMCk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHNhbXBsZSBmcm9tIGEgdW5pZm9ybSBbYSwgYl0gZGlzdHJpYnV0aW9uLlxuICogVXNlcyB0aGUgc2VlZHJhbmRvbSBsaWJyYXJ5IGFzIHRoZSByYW5kb20gZ2VuZXJhdG9yLlxuICovXG5mdW5jdGlvbiByYW5kVW5pZm9ybShhOiBudW1iZXIsIGI6IG51bWJlcikge1xuXHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChiIC0gYSkgKyBhO1xufVxuXG4vKipcbiAqIFNhbXBsZXMgZnJvbSBhIG5vcm1hbCBkaXN0cmlidXRpb24uIFVzZXMgdGhlIHNlZWRyYW5kb20gbGlicmFyeSBhcyB0aGVcbiAqIHJhbmRvbSBnZW5lcmF0b3IuXG4gKlxuICogQHBhcmFtIG1lYW4gVGhlIG1lYW4uIERlZmF1bHQgaXMgMC5cbiAqIEBwYXJhbSB2YXJpYW5jZSBUaGUgdmFyaWFuY2UuIERlZmF1bHQgaXMgMS5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsUmFuZG9tKG1lYW4gPSAwLCB2YXJpYW5jZSA9IDEpOiBudW1iZXIge1xuXHRsZXQgdjE6IG51bWJlciwgdjI6IG51bWJlciwgczogbnVtYmVyO1xuXHRkbyB7XG5cdFx0djEgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XG5cdFx0djIgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XG5cdFx0cyA9IHYxICogdjEgKyB2MiAqIHYyO1xuXHR9IHdoaWxlIChzID4gMSk7XG5cblx0bGV0IHJlc3VsdCA9IE1hdGguc3FydCgtMiAqIE1hdGgubG9nKHMpIC8gcykgKiB2MTtcblx0cmV0dXJuIG1lYW4gKyBNYXRoLnNxcnQodmFyaWFuY2UpICogcmVzdWx0O1xufVxuXG4vKiogUmV0dXJucyB0aGUgZXVjbGlkZWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50cyBpbiBzcGFjZS4gKi9cbmZ1bmN0aW9uIGRpc3QoYTogUG9pbnQsIGI6IFBvaW50KTogbnVtYmVyIHtcblx0bGV0IGR4ID0gYS54IC0gYi54O1xuXHRsZXQgZHkgPSBhLnkgLSBiLnk7XG5cdHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xufVxuIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG5odHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmltcG9ydCB7RXhhbXBsZTJEfSBmcm9tIFwiLi9kYXRhc2V0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGVhdE1hcFNldHRpbmdzIHtcblx0W2tleTogc3RyaW5nXTogYW55O1xuXHRzaG93QXhlcz86IGJvb2xlYW47XG5cdG5vU3ZnPzogYm9vbGVhbjtcbn1cblxuLyoqIE51bWJlciBvZiBkaWZmZXJlbnQgc2hhZGVzIChjb2xvcnMpIHdoZW4gZHJhd2luZyBhIGdyYWRpZW50IGhlYXRtYXAgKi9cbmNvbnN0IE5VTV9TSEFERVMgPSA2NDtcblxuLyoqXG4qIERyYXdzIGEgaGVhdG1hcCB1c2luZyBjYW52YXMuIFVzZWQgZm9yIHNob3dpbmcgdGhlIGxlYXJuZWQgZGVjaXNpb25cbiogYm91bmRhcnkgb2YgdGhlIGNsYXNzaWZpY2F0aW9uIGFsZ29yaXRobS4gQ2FuIGFsc28gZHJhdyBkYXRhIHBvaW50c1xuKiB1c2luZyBhbiBzdmcgb3ZlcmxheWVkIG9uIHRvcCBvZiB0aGUgY2FudmFzIGhlYXRtYXAuXG4qL1xuZXhwb3J0IGNsYXNzIEhlYXRNYXAge1xuXHRwcml2YXRlIHNldHRpbmdzOiBIZWF0TWFwU2V0dGluZ3MgPSB7c2hvd0F4ZXM6IGZhbHNlLCBub1N2ZzogZmFsc2V9O1xuXHRwcml2YXRlIHhTY2FsZTogZDMuc2NhbGUuTGluZWFyPG51bWJlciwgbnVtYmVyPjtcblx0cHJpdmF0ZSB5U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XG5cdHByaXZhdGUgbnVtU2FtcGxlczogbnVtYmVyO1xuXHRwcml2YXRlIGNvbG9yOiBkMy5zY2FsZS5RdWFudGl6ZTxzdHJpbmc+O1xuXHRwcml2YXRlIGNhbnZhczogZDMuU2VsZWN0aW9uPGFueT47XG5cdHByaXZhdGUgc3ZnOiBkMy5TZWxlY3Rpb248YW55PjtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHR3aWR0aDogbnVtYmVyLCBudW1TYW1wbGVzOiBudW1iZXIsIHhEb21haW46IFtudW1iZXIsIG51bWJlcl0sXG5cdFx0eURvbWFpbjogW251bWJlciwgbnVtYmVyXSwgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55Pixcblx0XHR1c2VyU2V0dGluZ3M/OiBIZWF0TWFwU2V0dGluZ3MpIHtcblx0XHR0aGlzLm51bVNhbXBsZXMgPSBudW1TYW1wbGVzO1xuXHRcdGxldCBoZWlnaHQgPSB3aWR0aDtcblx0XHRsZXQgcGFkZGluZyA9IHVzZXJTZXR0aW5ncy5zaG93QXhlcyA/IDIwIDogMDtcblxuXHRcdGlmICh1c2VyU2V0dGluZ3MgIT0gbnVsbCkge1xuXHRcdFx0Ly8gb3ZlcndyaXRlIHRoZSBkZWZhdWx0cyB3aXRoIHRoZSB1c2VyLXNwZWNpZmllZCBzZXR0aW5ncy5cblx0XHRcdGZvciAobGV0IHByb3AgaW4gdXNlclNldHRpbmdzKSB7XG5cdFx0XHRcdHRoaXMuc2V0dGluZ3NbcHJvcF0gPSB1c2VyU2V0dGluZ3NbcHJvcF07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy54U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdC5kb21haW4oeERvbWFpbilcblx0XHQucmFuZ2UoWzAsIHdpZHRoIC0gMiAqIHBhZGRpbmddKTtcblxuXHRcdHRoaXMueVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKHlEb21haW4pXG5cdFx0LnJhbmdlKFtoZWlnaHQgLSAyICogcGFkZGluZywgMF0pO1xuXG5cdFx0Ly8gR2V0IGEgcmFuZ2Ugb2YgY29sb3JzLlxuXHRcdGxldCB0bXBTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcjxzdHJpbmcsIHN0cmluZz4oKVxuXHRcdC5kb21haW4oWzAsIC41LCAxXSlcblx0XHQucmFuZ2UoW1wiIzA4NzdiZFwiLCBcIiNlOGVhZWJcIiwgXCIjZjU5MzIyXCJdKVxuXHRcdC5jbGFtcCh0cnVlKTtcblx0XHQvLyBEdWUgdG8gbnVtZXJpY2FsIGVycm9yLCB3ZSBuZWVkIHRvIHNwZWNpZnlcblx0XHQvLyBkMy5yYW5nZSgwLCBlbmQgKyBzbWFsbF9lcHNpbG9uLCBzdGVwKVxuXHRcdC8vIGluIG9yZGVyIHRvIGd1YXJhbnRlZSB0aGF0IHdlIHdpbGwgaGF2ZSBlbmQvc3RlcCBlbnRyaWVzIHdpdGhcblx0XHQvLyB0aGUgbGFzdCBlbGVtZW50IGJlaW5nIGVxdWFsIHRvIGVuZC5cblx0XHRsZXQgY29sb3JzID0gZDMucmFuZ2UoMCwgMSArIDFFLTksIDEgLyBOVU1fU0hBREVTKS5tYXAoYSA9PiB7XG5cdFx0XHRyZXR1cm4gdG1wU2NhbGUoYSk7XG5cdFx0fSk7XG5cdFx0dGhpcy5jb2xvciA9IGQzLnNjYWxlLnF1YW50aXplPHN0cmluZz4oKVxuXHRcdC5kb21haW4oWy0xLCAxXSlcblx0XHQucmFuZ2UoY29sb3JzKTtcblxuXHRcdGNvbnRhaW5lciA9IGNvbnRhaW5lci5hcHBlbmQoXCJkaXZcIilcblx0XHQuc3R5bGUoXG5cdFx0e1xuXHRcdFx0d2lkdGg6IGAke3dpZHRofXB4YCxcblx0XHRcdGhlaWdodDogYCR7aGVpZ2h0fXB4YCxcblx0XHRcdHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG5cdFx0XHR0b3A6IGAtJHtwYWRkaW5nfXB4YCxcblx0XHRcdGxlZnQ6IGAtJHtwYWRkaW5nfXB4YFxuXHRcdH0pO1xuXHRcdHRoaXMuY2FudmFzID0gY29udGFpbmVyLmFwcGVuZChcImNhbnZhc1wiKVxuXHRcdC5hdHRyKFwid2lkdGhcIiwgbnVtU2FtcGxlcylcblx0XHQuYXR0cihcImhlaWdodFwiLCBudW1TYW1wbGVzKVxuXHRcdC5zdHlsZShcIndpZHRoXCIsICh3aWR0aCAtIDIgKiBwYWRkaW5nKSArIFwicHhcIilcblx0XHQuc3R5bGUoXCJoZWlnaHRcIiwgKGhlaWdodCAtIDIgKiBwYWRkaW5nKSArIFwicHhcIilcblx0XHQuc3R5bGUoXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIpXG5cdFx0LnN0eWxlKFwidG9wXCIsIGAke3BhZGRpbmd9cHhgKVxuXHRcdC5zdHlsZShcImxlZnRcIiwgYCR7cGFkZGluZ31weGApO1xuXG5cdFx0aWYgKCF0aGlzLnNldHRpbmdzLm5vU3ZnKSB7XG5cdFx0XHR0aGlzLnN2ZyA9IGNvbnRhaW5lci5hcHBlbmQoXCJzdmdcIikuYXR0cihcblx0XHRcdHtcblx0XHRcdFx0XCJ3aWR0aFwiOiB3aWR0aCxcblx0XHRcdFx0XCJoZWlnaHRcIjogaGVpZ2h0XG5cdFx0XHR9KS5zdHlsZShcblx0XHRcdHtcblx0XHRcdFx0Ly8gT3ZlcmxheSB0aGUgc3ZnIG9uIHRvcCBvZiB0aGUgY2FudmFzLlxuXHRcdFx0XHRcInBvc2l0aW9uXCI6IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0XCJsZWZ0XCI6IFwiMFwiLFxuXHRcdFx0XHRcInRvcFwiOiBcIjBcIlxuXHRcdFx0fSkuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3BhZGRpbmd9LCR7cGFkZGluZ30pYCk7XG5cblx0XHRcdHRoaXMuc3ZnLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIFwidHJhaW5cIik7XG5cdFx0XHR0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBcInRlc3RcIik7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3Muc2hvd0F4ZXMpIHtcblx0XHRcdGxldCB4QXhpcyA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSh0aGlzLnhTY2FsZSlcblx0XHRcdC5vcmllbnQoXCJib3R0b21cIik7XG5cblx0XHRcdGxldCB5QXhpcyA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSh0aGlzLnlTY2FsZSlcblx0XHRcdC5vcmllbnQoXCJyaWdodFwiKTtcblxuXHRcdFx0dGhpcy5zdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcInggYXhpc1wiKVxuXHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCR7aGVpZ2h0IC0gMiAqIHBhZGRpbmd9KWApXG5cdFx0XHQuY2FsbCh4QXhpcyk7XG5cblx0XHRcdHRoaXMuc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ5IGF4aXNcIilcblx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKHdpZHRoIC0gMiAqIHBhZGRpbmcpICsgXCIsMClcIilcblx0XHRcdC5jYWxsKHlBeGlzKTtcblx0XHR9XG5cdH1cblxuXHR1cGRhdGVUZXN0UG9pbnRzKHBvaW50czogRXhhbXBsZTJEW10pOiB2b2lkIHtcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5ub1N2Zykge1xuXHRcdFx0dGhyb3cgRXJyb3IoXCJDYW4ndCBhZGQgcG9pbnRzIHNpbmNlIG5vU3ZnPXRydWVcIik7XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlQ2lyY2xlcyh0aGlzLnN2Zy5zZWxlY3QoXCJnLnRlc3RcIiksIHBvaW50cyk7XG5cdH1cblxuXHR1cGRhdGVQb2ludHMocG9pbnRzOiBFeGFtcGxlMkRbXSk6IHZvaWQge1xuXHRcdGlmICh0aGlzLnNldHRpbmdzLm5vU3ZnKSB7XG5cdFx0XHR0aHJvdyBFcnJvcihcIkNhbid0IGFkZCBwb2ludHMgc2luY2Ugbm9Tdmc9dHJ1ZVwiKTtcblx0XHR9XG5cdFx0dGhpcy51cGRhdGVDaXJjbGVzKHRoaXMuc3ZnLnNlbGVjdChcImcudHJhaW5cIiksIHBvaW50cyk7XG5cdH1cblxuXHR1cGRhdGVCYWNrZ3JvdW5kKGRhdGE6IG51bWJlcltdW10sIGRpc2NyZXRpemU6IGJvb2xlYW4pOiB2b2lkIHtcblx0XHRsZXQgZHggPSBkYXRhWzBdLmxlbmd0aDtcblx0XHRsZXQgZHkgPSBkYXRhLmxlbmd0aDtcblxuXHRcdGlmIChkeCAhPT0gdGhpcy5udW1TYW1wbGVzIHx8IGR5ICE9PSB0aGlzLm51bVNhbXBsZXMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XCJUaGUgcHJvdmlkZWQgZGF0YSBtYXRyaXggbXVzdCBiZSBvZiBzaXplIFwiICtcblx0XHRcdFx0XCJudW1TYW1wbGVzIFggbnVtU2FtcGxlc1wiKTtcblx0XHR9XG5cblx0XHQvLyBDb21wdXRlIHRoZSBwaXhlbCBjb2xvcnM7IHNjYWxlZCBieSBDU1MuXG5cdFx0bGV0IGNvbnRleHQgPSAodGhpcy5jYW52YXMubm9kZSgpIGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRDb250ZXh0KFwiMmRcIik7XG5cdFx0bGV0IGltYWdlID0gY29udGV4dC5jcmVhdGVJbWFnZURhdGEoZHgsIGR5KTtcblxuXHRcdGZvciAobGV0IHkgPSAwLCBwID0gLTE7IHkgPCBkeTsgKyt5KSB7XG5cdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGR4OyArK3gpIHtcblx0XHRcdFx0bGV0IHZhbHVlID0gZGF0YVt4XVt5XTtcblx0XHRcdFx0aWYgKGRpc2NyZXRpemUpIHtcblx0XHRcdFx0XHR2YWx1ZSA9ICh2YWx1ZSA+PSAwID8gMSA6IC0xKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgYyA9IGQzLnJnYih0aGlzLmNvbG9yKHZhbHVlKSk7XG5cdFx0XHRcdGltYWdlLmRhdGFbKytwXSA9IGMucjtcblx0XHRcdFx0aW1hZ2UuZGF0YVsrK3BdID0gYy5nO1xuXHRcdFx0XHRpbWFnZS5kYXRhWysrcF0gPSBjLmI7XG5cdFx0XHRcdGltYWdlLmRhdGFbKytwXSA9IDE2MDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2UsIDAsIDApO1xuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVDaXJjbGVzKGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sIHBvaW50czogRXhhbXBsZTJEW10pIHtcblx0XHQvLyBLZWVwIG9ubHkgcG9pbnRzIHRoYXQgYXJlIGluc2lkZSB0aGUgYm91bmRzLlxuXHRcdGxldCB4RG9tYWluID0gdGhpcy54U2NhbGUuZG9tYWluKCk7XG5cdFx0bGV0IHlEb21haW4gPSB0aGlzLnlTY2FsZS5kb21haW4oKTtcblx0XHRwb2ludHMgPSBwb2ludHMuZmlsdGVyKHAgPT4ge1xuXHRcdFx0cmV0dXJuIHAueCA+PSB4RG9tYWluWzBdICYmIHAueCA8PSB4RG9tYWluWzFdXG5cdFx0XHQmJiBwLnkgPj0geURvbWFpblswXSAmJiBwLnkgPD0geURvbWFpblsxXTtcblx0XHR9KTtcblxuXHRcdC8vIEF0dGFjaCBkYXRhIHRvIGluaXRpYWxseSBlbXB0eSBzZWxlY3Rpb24uXG5cdFx0bGV0IHNlbGVjdGlvbiA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCJjaXJjbGVcIikuZGF0YShwb2ludHMpO1xuXG5cdFx0Ly8gSW5zZXJ0IGVsZW1lbnRzIHRvIG1hdGNoIGxlbmd0aCBvZiBwb2ludHMgYXJyYXkuXG5cdFx0c2VsZWN0aW9uLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpLmF0dHIoXCJyXCIsIDMpO1xuXG5cdFx0Ly8gVXBkYXRlIHBvaW50cyB0byBiZSBpbiB0aGUgY29ycmVjdCBwb3NpdGlvbi5cblx0XHRzZWxlY3Rpb25cblx0XHQuYXR0cihcblx0XHR7XG5cdFx0XHRjeDogKGQ6IEV4YW1wbGUyRCkgPT4gdGhpcy54U2NhbGUoZC54KSxcblx0XHRcdGN5OiAoZDogRXhhbXBsZTJEKSA9PiB0aGlzLnlTY2FsZShkLnkpLFxuXHRcdH0pXG5cdFx0LnN0eWxlKFwiZmlsbFwiLCBkID0+IHRoaXMuY29sb3IoZC5sYWJlbCkpO1xuXG5cdFx0Ly8gUmVtb3ZlIHBvaW50cyBpZiB0aGUgbGVuZ3RoIGhhcyBnb25lIGRvd24uXG5cdFx0c2VsZWN0aW9uLmV4aXQoKS5yZW1vdmUoKTtcblx0fVxufSAgLy8gQ2xvc2UgY2xhc3MgSGVhdE1hcC5cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZU1hdHJpeChtYXRyaXg6IG51bWJlcltdW10sIGZhY3RvcjogbnVtYmVyKTogbnVtYmVyW11bXSB7XG5cdGlmIChtYXRyaXgubGVuZ3RoICE9PSBtYXRyaXhbMF0ubGVuZ3RoKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIHByb3ZpZGVkIG1hdHJpeCBtdXN0IGJlIGEgc3F1YXJlIG1hdHJpeFwiKTtcblx0fVxuXHRpZiAobWF0cml4Lmxlbmd0aCAlIGZhY3RvciAhPT0gMCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSB3aWR0aC9oZWlnaHQgb2YgdGhlIG1hdHJpeCBtdXN0IGJlIGRpdmlzaWJsZSBieSBcIiArXG5cdFx0XCJ0aGUgcmVkdWN0aW9uIGZhY3RvclwiKTtcblx0fVxuXHRsZXQgcmVzdWx0OiBudW1iZXJbXVtdID0gbmV3IEFycmF5KG1hdHJpeC5sZW5ndGggLyBmYWN0b3IpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5sZW5ndGg7IGkgKz0gZmFjdG9yKSB7XG5cdFx0cmVzdWx0W2kgLyBmYWN0b3JdID0gbmV3IEFycmF5KG1hdHJpeC5sZW5ndGggLyBmYWN0b3IpO1xuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgbWF0cml4Lmxlbmd0aDsgaiArPSBmYWN0b3IpIHtcblx0XHRcdGxldCBhdmcgPSAwO1xuXHRcdFx0Ly8gU3VtIGFsbCB0aGUgdmFsdWVzIGluIHRoZSBuZWlnaGJvcmhvb2QuXG5cdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGZhY3RvcjsgaysrKSB7XG5cdFx0XHRcdGZvciAobGV0IGwgPSAwOyBsIDwgZmFjdG9yOyBsKyspIHtcblx0XHRcdFx0XHRhdmcgKz0gbWF0cml4W2kgKyBrXVtqICsgbF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGF2ZyAvPSAoZmFjdG9yICogZmFjdG9yKTtcblx0XHRcdHJlc3VsdFtpIC8gZmFjdG9yXVtqIC8gZmFjdG9yXSA9IGF2Zztcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbnR5cGUgRGF0YVBvaW50ID0ge1xuXHR4OiBudW1iZXI7XG5cdHk6IG51bWJlcltdO1xufTtcblxuLyoqXG4gKiBBIG11bHRpLXNlcmllcyBsaW5lIGNoYXJ0IHRoYXQgYWxsb3dzIHlvdSB0byBhcHBlbmQgbmV3IGRhdGEgcG9pbnRzXG4gKiBhcyBkYXRhIGJlY29tZXMgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgY2xhc3MgQXBwZW5kaW5nTGluZUNoYXJ0IHtcblx0cHJpdmF0ZSBudW1MaW5lczogbnVtYmVyO1xuXHRwcml2YXRlIGRhdGE6IERhdGFQb2ludFtdID0gW107XG5cdHByaXZhdGUgc3ZnOiBkMy5TZWxlY3Rpb248YW55Pjtcblx0cHJpdmF0ZSB4U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XG5cdHByaXZhdGUgeVNjYWxlOiBkMy5zY2FsZS5MaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xuXHRwcml2YXRlIHBhdGhzOiBBcnJheTxkMy5TZWxlY3Rpb248YW55Pj47XG5cdHByaXZhdGUgbGluZUNvbG9yczogc3RyaW5nW107XG5cblx0cHJpdmF0ZSBtaW5ZID0gTnVtYmVyLk1BWF9WQUxVRTtcblx0cHJpdmF0ZSBtYXhZID0gTnVtYmVyLk1JTl9WQUxVRTtcblxuXHRjb25zdHJ1Y3Rvcihjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+LCBsaW5lQ29sb3JzOiBzdHJpbmdbXSkge1xuXHRcdHRoaXMubGluZUNvbG9ycyA9IGxpbmVDb2xvcnM7XG5cdFx0dGhpcy5udW1MaW5lcyA9IGxpbmVDb2xvcnMubGVuZ3RoO1xuXHRcdGxldCBub2RlID0gY29udGFpbmVyLm5vZGUoKSBhcyBIVE1MRWxlbWVudDtcblx0XHRsZXQgdG90YWxXaWR0aCA9IG5vZGUub2Zmc2V0V2lkdGg7XG5cdFx0bGV0IHRvdGFsSGVpZ2h0ID0gbm9kZS5vZmZzZXRIZWlnaHQ7XG5cdFx0bGV0IG1hcmdpbiA9IHt0b3A6IDIsIHJpZ2h0OiAwLCBib3R0b206IDIsIGxlZnQ6IDJ9O1xuXHRcdGxldCB3aWR0aCA9IHRvdGFsV2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcblx0XHRsZXQgaGVpZ2h0ID0gdG90YWxIZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcblxuXHRcdHRoaXMueFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdC5kb21haW4oWzAsIDBdKVxuXHRcdFx0LnJhbmdlKFswLCB3aWR0aF0pO1xuXG5cdFx0dGhpcy55U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0LmRvbWFpbihbMCwgMF0pXG5cdFx0XHQucmFuZ2UoW2hlaWdodCwgMF0pO1xuXG5cdFx0dGhpcy5zdmcgPSBjb250YWluZXIuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHQuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG5cdFx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSlcblx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7bWFyZ2luLmxlZnR9LCR7bWFyZ2luLnRvcH0pYCk7XG5cblx0XHR0aGlzLnBhdGhzID0gbmV3IEFycmF5KHRoaXMubnVtTGluZXMpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1MaW5lczsgaSsrKSB7XG5cdFx0XHR0aGlzLnBhdGhzW2ldID0gdGhpcy5zdmcuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwibGluZVwiKVxuXHRcdFx0XHQuc3R5bGUoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XCJmaWxsXCI6IFwibm9uZVwiLFxuXHRcdFx0XHRcdFx0XCJzdHJva2VcIjogbGluZUNvbG9yc1tpXSxcblx0XHRcdFx0XHRcdFwic3Ryb2tlLXdpZHRoXCI6IFwiMS41cHhcIlxuXHRcdFx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHJlc2V0KCkge1xuXHRcdHRoaXMuZGF0YSA9IFtdO1xuXHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0dGhpcy5taW5ZID0gTnVtYmVyLk1BWF9WQUxVRTtcblx0XHR0aGlzLm1heFkgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuXHR9XG5cblx0YWRkRGF0YVBvaW50KGRhdGFQb2ludDogbnVtYmVyW10pIHtcblx0XHRpZiAoZGF0YVBvaW50Lmxlbmd0aCAhPT0gdGhpcy5udW1MaW5lcykge1xuXHRcdFx0dGhyb3cgRXJyb3IoXCJMZW5ndGggb2YgZGF0YVBvaW50IG11c3QgZXF1YWwgbnVtYmVyIG9mIGxpbmVzXCIpO1xuXHRcdH1cblx0XHRkYXRhUG9pbnQuZm9yRWFjaCh5ID0+IHtcblx0XHRcdHRoaXMubWluWSA9IE1hdGgubWluKHRoaXMubWluWSwgeSk7XG5cdFx0XHR0aGlzLm1heFkgPSBNYXRoLm1heCh0aGlzLm1heFksIHkpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5kYXRhLnB1c2goe3g6IHRoaXMuZGF0YS5sZW5ndGggKyAxLCB5OiBkYXRhUG9pbnR9KTtcblx0XHR0aGlzLnJlZHJhdygpO1xuXHR9XG5cblx0cHJpdmF0ZSByZWRyYXcoKSB7XG5cdFx0Ly8gQWRqdXN0IHRoZSB4IGFuZCB5IGRvbWFpbi5cblx0XHR0aGlzLnhTY2FsZS5kb21haW4oWzEsIHRoaXMuZGF0YS5sZW5ndGhdKTtcblx0XHR0aGlzLnlTY2FsZS5kb21haW4oW3RoaXMubWluWSwgdGhpcy5tYXhZXSk7XG5cdFx0Ly8gQWRqdXN0IGFsbCB0aGUgPHBhdGg+IGVsZW1lbnRzIChsaW5lcykuXG5cdFx0bGV0IGdldFBhdGhNYXAgPSAobGluZUluZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdHJldHVybiBkMy5zdmcubGluZTxEYXRhUG9pbnQ+KClcblx0XHRcdFx0LngoZCA9PiB0aGlzLnhTY2FsZShkLngpKVxuXHRcdFx0XHQueShkID0+IHRoaXMueVNjYWxlKGQueVtsaW5lSW5kZXhdKSk7XG5cdFx0fTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtTGluZXM7IGkrKykge1xuXHRcdFx0dGhpcy5wYXRoc1tpXS5kYXR1bSh0aGlzLmRhdGEpLmF0dHIoXCJkXCIsIGdldFBhdGhNYXAoaSkpO1xuXHRcdH1cblx0fVxufVxuIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4vKipcbiAqIEEgbm9kZSBpbiBhIG5ldXJhbCBuZXR3b3JrLiBFYWNoIG5vZGUgaGFzIGEgc3RhdGVcbiAqICh0b3RhbCBpbnB1dCwgb3V0cHV0LCBhbmQgdGhlaXIgcmVzcGVjdGl2ZWx5IGRlcml2YXRpdmVzKSB3aGljaCBjaGFuZ2VzXG4gKiBhZnRlciBldmVyeSBmb3J3YXJkIGFuZCBiYWNrIHByb3BhZ2F0aW9uIHJ1bi5cbiAqL1xuZXhwb3J0IGNsYXNzIE5vZGUge1xuXHRpZDogc3RyaW5nO1xuXHQvKiogTGlzdCBvZiBpbnB1dCBsaW5rcy4gKi9cblx0aW5wdXRMaW5rczogTGlua1tdID0gW107XG5cdGJpYXMgPSAwLjE7XG5cdC8qKiBMaXN0IG9mIG91dHB1dCBsaW5rcy4gKi9cblx0b3V0cHV0czogTGlua1tdID0gW107XG5cdHRvdGFsSW5wdXQ6IG51bWJlcjtcblx0b3V0cHV0OiBudW1iZXI7XG5cdGxheWVyOiBudW1iZXI7XG5cblx0dHJ1ZUxlYXJuaW5nUmF0ZSA9IDA7XG5cdC8qKiBFcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byB0aGlzIG5vZGUncyBvdXRwdXQuICovXG5cdG91dHB1dERlciA9IDA7XG5cdC8qKiBFcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byB0aGlzIG5vZGUncyB0b3RhbCBpbnB1dC4gKi9cblx0aW5wdXREZXIgPSAwO1xuXHQvKipcblx0ICogQWNjdW11bGF0ZWQgZXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyBub2RlJ3MgdG90YWwgaW5wdXQgc2luY2Vcblx0ICogdGhlIGxhc3QgdXBkYXRlLiBUaGlzIGRlcml2YXRpdmUgZXF1YWxzIGRFL2RiIHdoZXJlIGIgaXMgdGhlIG5vZGUnc1xuXHQgKiBiaWFzIHRlcm0uXG5cdCAqL1xuXHRhY2NJbnB1dERlciA9IDA7XG5cdC8qKlxuXHQgKiBOdW1iZXIgb2YgYWNjdW11bGF0ZWQgZXJyLiBkZXJpdmF0aXZlcyB3aXRoIHJlc3BlY3QgdG8gdGhlIHRvdGFsIGlucHV0XG5cdCAqIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cblx0ICovXG5cdG51bUFjY3VtdWxhdGVkRGVycyA9IDA7XG5cdC8qKiBBY3RpdmF0aW9uIGZ1bmN0aW9uIHRoYXQgdGFrZXMgdG90YWwgaW5wdXQgYW5kIHJldHVybnMgbm9kZSdzIG91dHB1dCAqL1xuXHRhY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb247XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgbm9kZSB3aXRoIHRoZSBwcm92aWRlZCBpZCBhbmQgYWN0aXZhdGlvbiBmdW5jdGlvbi5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGFjdGl2YXRpb246IEFjdGl2YXRpb25GdW5jdGlvbiwgaW5pdFplcm8/OiBib29sZWFuKSB7XG5cdFx0dGhpcy5pZCA9IGlkO1xuXHRcdHRoaXMuYWN0aXZhdGlvbiA9IGFjdGl2YXRpb247XG5cdFx0aWYgKGluaXRaZXJvKSB7XG5cdFx0XHR0aGlzLmJpYXMgPSAwO1xuXHRcdH1cblx0fVxuXG5cdC8qKiBSZWNvbXB1dGVzIHRoZSBub2RlJ3Mgb3V0cHV0IGFuZCByZXR1cm5zIGl0LiAqL1xuXHR1cGRhdGVPdXRwdXQoKTogbnVtYmVyIHtcblx0XHQvLyBTdG9yZXMgdG90YWwgaW5wdXQgaW50byB0aGUgbm9kZS5cblx0XHR0aGlzLnRvdGFsSW5wdXQgPSB0aGlzLmJpYXM7XG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmlucHV0TGlua3MubGVuZ3RoOyBqKyspIHtcblx0XHRcdGxldCBsaW5rID0gdGhpcy5pbnB1dExpbmtzW2pdO1xuXHRcdFx0dGhpcy50b3RhbElucHV0ICs9IGxpbmsud2VpZ2h0ICogbGluay5zb3VyY2Uub3V0cHV0O1xuXHRcdH1cblx0XHR0aGlzLm91dHB1dCA9IHRoaXMuYWN0aXZhdGlvbi5vdXRwdXQodGhpcy50b3RhbElucHV0KTtcblx0XHRyZXR1cm4gdGhpcy5vdXRwdXQ7XG5cdH1cbn1cblxuLyoqXG4gKiBBbiBlcnJvciBmdW5jdGlvbiBhbmQgaXRzIGRlcml2YXRpdmUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JGdW5jdGlvbiB7XG5cdGVycm9yOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PiBudW1iZXI7XG5cdGRlcjogKG91dHB1dDogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcikgPT4gbnVtYmVyO1xufVxuXG4vKiogQSBub2RlJ3MgYWN0aXZhdGlvbiBmdW5jdGlvbiBhbmQgaXRzIGRlcml2YXRpdmUuICovXG5leHBvcnQgaW50ZXJmYWNlIEFjdGl2YXRpb25GdW5jdGlvbiB7XG5cdG91dHB1dDogKGlucHV0OiBudW1iZXIpID0+IG51bWJlcjtcblx0ZGVyOiAoaW5wdXQ6IG51bWJlcikgPT4gbnVtYmVyO1xufVxuXG4vKiogRnVuY3Rpb24gdGhhdCBjb21wdXRlcyBhIHBlbmFsdHkgY29zdCBmb3IgYSBnaXZlbiB3ZWlnaHQgaW4gdGhlIG5ldHdvcmsuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24ge1xuXHRvdXRwdXQ6ICh3ZWlnaHQ6IG51bWJlcikgPT4gbnVtYmVyO1xuXHRkZXI6ICh3ZWlnaHQ6IG51bWJlcikgPT4gbnVtYmVyO1xufVxuXG4vKiogQnVpbHQtaW4gZXJyb3IgZnVuY3Rpb25zICovXG5leHBvcnQgY2xhc3MgRXJyb3JzIHtcblx0cHVibGljIHN0YXRpYyBTUVVBUkU6IEVycm9yRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdGVycm9yOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PlxuXHRcdFx0XHQwLjUgKiBNYXRoLnBvdyhvdXRwdXQgLSB0YXJnZXQsIDIpLFxuXHRcdFx0ZGVyOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PiBvdXRwdXQgLSB0YXJnZXRcblx0XHR9O1xufVxuXG4vKiogUG9seWZpbGwgZm9yIFRBTkggKi9cbihNYXRoIGFzIGFueSkudGFuaCA9IChNYXRoIGFzIGFueSkudGFuaCB8fCBmdW5jdGlvbiAoeCkge1xuXHRpZiAoeCA9PT0gSW5maW5pdHkpIHtcblx0XHRyZXR1cm4gMTtcblx0fSBlbHNlIGlmICh4ID09PSAtSW5maW5pdHkpIHtcblx0XHRyZXR1cm4gLTE7XG5cdH0gZWxzZSB7XG5cdFx0bGV0IGUyeCA9IE1hdGguZXhwKDIgKiB4KTtcblx0XHRyZXR1cm4gKGUyeCAtIDEpIC8gKGUyeCArIDEpO1xuXHR9XG59O1xuXG4vKiogQnVpbHQtaW4gYWN0aXZhdGlvbiBmdW5jdGlvbnMgKi9cbmV4cG9ydCBjbGFzcyBBY3RpdmF0aW9ucyB7XG5cdHB1YmxpYyBzdGF0aWMgVEFOSDogQWN0aXZhdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHggPT4gKE1hdGggYXMgYW55KS50YW5oKHgpLFxuXHRcdFx0ZGVyOiB4ID0+IHtcblx0XHRcdFx0bGV0IG91dHB1dCA9IEFjdGl2YXRpb25zLlRBTkgub3V0cHV0KHgpO1xuXHRcdFx0XHRyZXR1cm4gMSAtIG91dHB1dCAqIG91dHB1dDtcblx0XHRcdH1cblx0XHR9O1xuXHRwdWJsaWMgc3RhdGljIFJFTFU6IEFjdGl2YXRpb25GdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0b3V0cHV0OiB4ID0+IE1hdGgubWF4KDAsIHgpLFxuXHRcdFx0ZGVyOiB4ID0+IHggPD0gMCA/IDAgOiAxXG5cdFx0fTtcblx0cHVibGljIHN0YXRpYyBTSUdNT0lEOiBBY3RpdmF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogeCA9PiAxIC8gKDEgKyBNYXRoLmV4cCgteCkpLFxuXHRcdFx0ZGVyOiB4ID0+IHtcblx0XHRcdFx0bGV0IG91dHB1dCA9IEFjdGl2YXRpb25zLlNJR01PSUQub3V0cHV0KHgpO1xuXHRcdFx0XHRyZXR1cm4gb3V0cHV0ICogKDEgLSBvdXRwdXQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdHB1YmxpYyBzdGF0aWMgTElORUFSOiBBY3RpdmF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogeCA9PiB4LFxuXHRcdFx0ZGVyOiB4ID0+IDFcblx0XHR9O1xuXHRwdWJsaWMgc3RhdGljIFNJTlg6IEFjdGl2YXRpb25GdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0b3V0cHV0OiB4ID0+IE1hdGguc2luKHgpLFxuXHRcdFx0ZGVyOiB4ID0+IE1hdGguY29zKHgpXG5cdFx0fTtcbn1cblxuLyoqIEJ1aWxkLWluIHJlZ3VsYXJpemF0aW9uIGZ1bmN0aW9ucyAqL1xuZXhwb3J0IGNsYXNzIFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24ge1xuXHRwdWJsaWMgc3RhdGljIEwxOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHcgPT4gTWF0aC5hYnModyksXG5cdFx0XHRkZXI6IHcgPT4gdyA8IDAgPyAtMSA6ICh3ID4gMCA/IDEgOiAwKVxuXHRcdH07XG5cdHB1YmxpYyBzdGF0aWMgTDI6IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogdyA9PiAwLjUgKiB3ICogdyxcblx0XHRcdGRlcjogdyA9PiB3XG5cdFx0fTtcbn1cblxuLyoqXG4gKiBBIGxpbmsgaW4gYSBuZXVyYWwgbmV0d29yay4gRWFjaCBsaW5rIGhhcyBhIHdlaWdodCBhbmQgYSBzb3VyY2UgYW5kXG4gKiBkZXN0aW5hdGlvbiBub2RlLiBBbHNvIGl0IGhhcyBhbiBpbnRlcm5hbCBzdGF0ZSAoZXJyb3IgZGVyaXZhdGl2ZVxuICogd2l0aCByZXNwZWN0IHRvIGEgcGFydGljdWxhciBpbnB1dCkgd2hpY2ggZ2V0cyB1cGRhdGVkIGFmdGVyXG4gKiBhIHJ1biBvZiBiYWNrIHByb3BhZ2F0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgTGluayB7XG5cdGlkOiBzdHJpbmc7XG5cdHNvdXJjZTogTm9kZTtcblx0ZGVzdDogTm9kZTtcblx0d2VpZ2h0ID0gTWF0aC5yYW5kb20oKSAtIDAuNTtcblx0aXNEZWFkID0gZmFsc2U7XG5cdC8qKiBFcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byB0aGlzIHdlaWdodC4gKi9cblx0ZXJyb3JEZXIgPSAwO1xuXHQvKiogQWNjdW11bGF0ZWQgZXJyb3IgZGVyaXZhdGl2ZSBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuICovXG5cdGFjY0Vycm9yRGVyID0gMDtcblx0LyoqIE51bWJlciBvZiBhY2N1bXVsYXRlZCBkZXJpdmF0aXZlcyBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuICovXG5cdG51bUFjY3VtdWxhdGVkRGVycyA9IDA7XG5cdHJlZ3VsYXJpemF0aW9uOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uO1xuXG5cdHRydWVMZWFybmluZ1JhdGUgPSAwO1xuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RzIGEgbGluayBpbiB0aGUgbmV1cmFsIG5ldHdvcmsgaW5pdGlhbGl6ZWQgd2l0aCByYW5kb20gd2VpZ2h0LlxuXHQgKlxuXHQgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2Ugbm9kZS5cblx0ICogQHBhcmFtIGRlc3QgVGhlIGRlc3RpbmF0aW9uIG5vZGUuXG5cdCAqIEBwYXJhbSByZWd1bGFyaXphdGlvbiBUaGUgcmVndWxhcml6YXRpb24gZnVuY3Rpb24gdGhhdCBjb21wdXRlcyB0aGVcblx0ICogICAgIHBlbmFsdHkgZm9yIHRoaXMgd2VpZ2h0LiBJZiBudWxsLCB0aGVyZSB3aWxsIGJlIG5vIHJlZ3VsYXJpemF0aW9uLlxuXHQgKi9cblx0Y29uc3RydWN0b3Ioc291cmNlOiBOb2RlLCBkZXN0OiBOb2RlLFxuXHRcdFx0XHRyZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbiwgaW5pdFplcm8/OiBib29sZWFuKSB7XG5cdFx0dGhpcy5pZCA9IHNvdXJjZS5pZCArIFwiLVwiICsgZGVzdC5pZDtcblx0XHR0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblx0XHR0aGlzLmRlc3QgPSBkZXN0O1xuXHRcdHRoaXMucmVndWxhcml6YXRpb24gPSByZWd1bGFyaXphdGlvbjtcblx0XHRpZiAoaW5pdFplcm8pIHtcblx0XHRcdHRoaXMud2VpZ2h0ID0gMDtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBCdWlsZHMgYSBuZXVyYWwgbmV0d29yay5cbiAqXG4gKiBAcGFyYW0gbmV0d29ya1NoYXBlIFRoZSBzaGFwZSBvZiB0aGUgbmV0d29yay4gRS5nLiBbMSwgMiwgMywgMV0gbWVhbnNcbiAqICAgdGhlIG5ldHdvcmsgd2lsbCBoYXZlIG9uZSBpbnB1dCBub2RlLCAyIG5vZGVzIGluIGZpcnN0IGhpZGRlbiBsYXllcixcbiAqICAgMyBub2RlcyBpbiBzZWNvbmQgaGlkZGVuIGxheWVyIGFuZCAxIG91dHB1dCBub2RlLlxuICogQHBhcmFtIGFjdGl2YXRpb24gVGhlIGFjdGl2YXRpb24gZnVuY3Rpb24gb2YgZXZlcnkgaGlkZGVuIG5vZGUuXG4gKiBAcGFyYW0gb3V0cHV0QWN0aXZhdGlvbiBUaGUgYWN0aXZhdGlvbiBmdW5jdGlvbiBmb3IgdGhlIG91dHB1dCBub2Rlcy5cbiAqIEBwYXJhbSByZWd1bGFyaXphdGlvbiBUaGUgcmVndWxhcml6YXRpb24gZnVuY3Rpb24gdGhhdCBjb21wdXRlcyBhIHBlbmFsdHlcbiAqICAgICBmb3IgYSBnaXZlbiB3ZWlnaHQgKHBhcmFtZXRlcikgaW4gdGhlIG5ldHdvcmsuIElmIG51bGwsIHRoZXJlIHdpbGwgYmVcbiAqICAgICBubyByZWd1bGFyaXphdGlvbi5cbiAqIEBwYXJhbSBpbnB1dElkcyBMaXN0IG9mIGlkcyBmb3IgdGhlIGlucHV0IG5vZGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGROZXR3b3JrKFxuXHRuZXR3b3JrU2hhcGU6IG51bWJlcltdLCBhY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb24sXG5cdG91dHB1dEFjdGl2YXRpb246IEFjdGl2YXRpb25GdW5jdGlvbixcblx0cmVndWxhcml6YXRpb246IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24sXG5cdGlucHV0SWRzOiBzdHJpbmdbXSwgaW5pdFplcm8/OiBib29sZWFuKTogTm9kZVtdW10ge1xuXHRsZXQgbnVtTGF5ZXJzID0gbmV0d29ya1NoYXBlLmxlbmd0aDtcblx0bGV0IGlkID0gMTtcblx0LyoqIExpc3Qgb2YgbGF5ZXJzLCB3aXRoIGVhY2ggbGF5ZXIgYmVpbmcgYSBsaXN0IG9mIG5vZGVzLiAqL1xuXHRsZXQgbmV0d29yazogTm9kZVtdW10gPSBbXTtcblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAwOyBsYXllcklkeCA8IG51bUxheWVyczsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBpc091dHB1dExheWVyID0gbGF5ZXJJZHggPT09IG51bUxheWVycyAtIDE7XG5cdFx0bGV0IGlzSW5wdXRMYXllciA9IGxheWVySWR4ID09PSAwO1xuXHRcdGxldCBjdXJyZW50TGF5ZXI6IE5vZGVbXSA9IFtdO1xuXHRcdG5ldHdvcmsucHVzaChjdXJyZW50TGF5ZXIpO1xuXHRcdGxldCBudW1Ob2RlcyA9IG5ldHdvcmtTaGFwZVtsYXllcklkeF07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1Ob2RlczsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZUlkID0gaWQudG9TdHJpbmcoKTtcblx0XHRcdGlmIChpc0lucHV0TGF5ZXIpIHtcblx0XHRcdFx0bm9kZUlkID0gaW5wdXRJZHNbaV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZCsrO1xuXHRcdFx0fVxuXHRcdFx0bGV0IG5vZGUgPSBuZXcgTm9kZShub2RlSWQsIGlzT3V0cHV0TGF5ZXIgPyBvdXRwdXRBY3RpdmF0aW9uIDogYWN0aXZhdGlvbiwgaW5pdFplcm8pO1xuXHRcdFx0bm9kZS5sYXllciA9IGxheWVySWR4O1xuXHRcdFx0Y3VycmVudExheWVyLnB1c2gobm9kZSk7XG5cdFx0XHRpZiAobGF5ZXJJZHggPj0gMSkge1xuXHRcdFx0XHQvLyBBZGQgbGlua3MgZnJvbSBub2RlcyBpbiB0aGUgcHJldmlvdXMgbGF5ZXIgdG8gdGhpcyBub2RlLlxuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5ldHdvcmtbbGF5ZXJJZHggLSAxXS5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdGxldCBwcmV2Tm9kZSA9IG5ldHdvcmtbbGF5ZXJJZHggLSAxXVtqXTtcblx0XHRcdFx0XHRsZXQgbGluayA9IG5ldyBMaW5rKHByZXZOb2RlLCBub2RlLCByZWd1bGFyaXphdGlvbiwgaW5pdFplcm8pO1xuXHRcdFx0XHRcdHByZXZOb2RlLm91dHB1dHMucHVzaChsaW5rKTtcblx0XHRcdFx0XHRub2RlLmlucHV0TGlua3MucHVzaChsaW5rKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gbmV0d29yaztcbn1cblxuLyoqXG4gKiBSdW5zIGEgZm9yd2FyZCBwcm9wYWdhdGlvbiBvZiB0aGUgcHJvdmlkZWQgaW5wdXQgdGhyb3VnaCB0aGUgcHJvdmlkZWRcbiAqIG5ldHdvcmsuIFRoaXMgbWV0aG9kIG1vZGlmaWVzIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgbmV0d29yayAtIHRoZVxuICogdG90YWwgaW5wdXQgYW5kIG91dHB1dCBvZiBlYWNoIG5vZGUgaW4gdGhlIG5ldHdvcmsuXG4gKlxuICogQHBhcmFtIG5ldHdvcmsgVGhlIG5ldXJhbCBuZXR3b3JrLlxuICogQHBhcmFtIGlucHV0cyBUaGUgaW5wdXQgYXJyYXkuIEl0cyBsZW5ndGggc2hvdWxkIG1hdGNoIHRoZSBudW1iZXIgb2YgaW5wdXRcbiAqICAgICBub2RlcyBpbiB0aGUgbmV0d29yay5cbiAqIEByZXR1cm4gVGhlIGZpbmFsIG91dHB1dCBvZiB0aGUgbmV0d29yay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmRQcm9wKG5ldHdvcms6IE5vZGVbXVtdLCBpbnB1dHM6IG51bWJlcltdKTogbnVtYmVyIHtcblx0bGV0IGlucHV0TGF5ZXIgPSBuZXR3b3JrWzBdO1xuXHRpZiAoaW5wdXRzLmxlbmd0aCAhPT0gaW5wdXRMYXllci5sZW5ndGgpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgbnVtYmVyIG9mIGlucHV0cyBtdXN0IG1hdGNoIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW5cIiArXG5cdFx0XHRcIiB0aGUgaW5wdXQgbGF5ZXJcIik7XG5cdH1cblx0Ly8gVXBkYXRlIHRoZSBpbnB1dCBsYXllci5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IG5vZGUgPSBpbnB1dExheWVyW2ldO1xuXHRcdG5vZGUub3V0cHV0ID0gaW5wdXRzW2ldO1xuXHR9XG5cdGZvciAobGV0IGxheWVySWR4ID0gMTsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aDsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcblx0XHQvLyBVcGRhdGUgYWxsIHRoZSBub2RlcyBpbiB0aGlzIGxheWVyLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdG5vZGUudXBkYXRlT3V0cHV0KCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBuZXR3b3JrW25ldHdvcmsubGVuZ3RoIC0gMV1bMF0ub3V0cHV0O1xufVxuXG4vKipcbiAqIFJ1bnMgYSBiYWNrd2FyZCBwcm9wYWdhdGlvbiB1c2luZyB0aGUgcHJvdmlkZWQgdGFyZ2V0IGFuZCB0aGVcbiAqIGNvbXB1dGVkIG91dHB1dCBvZiB0aGUgcHJldmlvdXMgY2FsbCB0byBmb3J3YXJkIHByb3BhZ2F0aW9uLlxuICogVGhpcyBtZXRob2QgbW9kaWZpZXMgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBuZXR3b3JrIC0gdGhlIGVycm9yXG4gKiBkZXJpdmF0aXZlcyB3aXRoIHJlc3BlY3QgdG8gZWFjaCBub2RlLCBhbmQgZWFjaCB3ZWlnaHRcbiAqIGluIHRoZSBuZXR3b3JrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmFja1Byb3AobmV0d29yazogTm9kZVtdW10sIHRhcmdldDogbnVtYmVyLCBlcnJvckZ1bmM6IEVycm9yRnVuY3Rpb24pOiB2b2lkIHtcblx0Ly8gVGhlIG91dHB1dCBub2RlIGlzIGEgc3BlY2lhbCBjYXNlLiBXZSB1c2UgdGhlIHVzZXItZGVmaW5lZCBlcnJvclxuXHQvLyBmdW5jdGlvbiBmb3IgdGhlIGRlcml2YXRpdmUuXG5cdGxldCBvdXRwdXROb2RlID0gbmV0d29ya1tuZXR3b3JrLmxlbmd0aCAtIDFdWzBdO1xuXHRvdXRwdXROb2RlLm91dHB1dERlciA9IGVycm9yRnVuYy5kZXIob3V0cHV0Tm9kZS5vdXRwdXQsIHRhcmdldCk7XG5cblx0Ly8gR28gdGhyb3VnaCB0aGUgbGF5ZXJzIGJhY2t3YXJkcy5cblx0Zm9yIChsZXQgbGF5ZXJJZHggPSBuZXR3b3JrLmxlbmd0aCAtIDE7IGxheWVySWR4ID49IDE7IGxheWVySWR4LS0pIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Ly8gQ29tcHV0ZSB0aGUgZXJyb3IgZGVyaXZhdGl2ZSBvZiBlYWNoIG5vZGUgd2l0aCByZXNwZWN0IHRvOlxuXHRcdC8vIDEpIGl0cyB0b3RhbCBpbnB1dFxuXHRcdC8vIDIpIGVhY2ggb2YgaXRzIGlucHV0IHdlaWdodHMuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0bm9kZS5pbnB1dERlciA9IG5vZGUub3V0cHV0RGVyICogbm9kZS5hY3RpdmF0aW9uLmRlcihub2RlLnRvdGFsSW5wdXQpO1xuXHRcdFx0bm9kZS5hY2NJbnB1dERlciArPSBub2RlLmlucHV0RGVyO1xuXHRcdFx0bm9kZS5udW1BY2N1bXVsYXRlZERlcnMrKztcblx0XHR9XG5cblx0XHQvLyBFcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byBlYWNoIHdlaWdodCBjb21pbmcgaW50byB0aGUgbm9kZS5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcblx0XHRcdFx0aWYgKGxpbmsuaXNEZWFkKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGluay5lcnJvckRlciA9IG5vZGUuaW5wdXREZXIgKiBsaW5rLnNvdXJjZS5vdXRwdXQ7XG5cdFx0XHRcdGxpbmsuYWNjRXJyb3JEZXIgKz0gbGluay5lcnJvckRlcjtcblx0XHRcdFx0bGluay5udW1BY2N1bXVsYXRlZERlcnMrKztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGxheWVySWR4ID09PSAxKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0bGV0IHByZXZMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHggLSAxXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByZXZMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBwcmV2TGF5ZXJbaV07XG5cdFx0XHQvLyBDb21wdXRlIHRoZSBlcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byBlYWNoIG5vZGUncyBvdXRwdXQuXG5cdFx0XHRub2RlLm91dHB1dERlciA9IDA7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUub3V0cHV0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgb3V0cHV0ID0gbm9kZS5vdXRwdXRzW2pdO1xuXHRcdFx0XHRub2RlLm91dHB1dERlciArPSBvdXRwdXQud2VpZ2h0ICogb3V0cHV0LmRlc3QuaW5wdXREZXI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgd2VpZ2h0cyBvZiB0aGUgbmV0d29yayB1c2luZyB0aGUgcHJldmlvdXNseSBhY2N1bXVsYXRlZCBlcnJvclxuICogZGVyaXZhdGl2ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVXZWlnaHRzKG5ldHdvcms6IE5vZGVbXVtdLCBsZWFybmluZ1JhdGU6IG51bWJlciwgcmVndWxhcml6YXRpb25SYXRlOiBudW1iZXIpIHtcblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdC8vIFVwZGF0ZSB0aGUgbm9kZSdzIGJpYXMuXG5cdFx0XHRpZiAobm9kZS5udW1BY2N1bXVsYXRlZERlcnMgPiAwKSB7XG5cdFx0XHRcdG5vZGUudHJ1ZUxlYXJuaW5nUmF0ZSA9IG5vZGUuYWNjSW5wdXREZXIgLyBub2RlLm51bUFjY3VtdWxhdGVkRGVycztcblx0XHRcdFx0bm9kZS5iaWFzIC09IGxlYXJuaW5nUmF0ZSAqIG5vZGUudHJ1ZUxlYXJuaW5nUmF0ZTsgLy8gbm9kZS5hY2NJbnB1dERlciAvIG5vZGUubnVtQWNjdW11bGF0ZWREZXJzO1xuXHRcdFx0XHRub2RlLmFjY0lucHV0RGVyID0gMDtcblx0XHRcdFx0bm9kZS5udW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuXHRcdFx0fVxuXHRcdFx0Ly8gVXBkYXRlIHRoZSB3ZWlnaHRzIGNvbWluZyBpbnRvIHRoaXMgbm9kZS5cblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2pdO1xuXHRcdFx0XHRpZiAobGluay5pc0RlYWQpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgcmVndWxEZXIgPSBsaW5rLnJlZ3VsYXJpemF0aW9uID9cblx0XHRcdFx0XHRsaW5rLnJlZ3VsYXJpemF0aW9uLmRlcihsaW5rLndlaWdodCkgOiAwO1xuXHRcdFx0XHRpZiAobGluay5udW1BY2N1bXVsYXRlZERlcnMgPiAwKSB7XG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSB3ZWlnaHQgYmFzZWQgb24gZEUvZHcuXG5cdFx0XHRcdFx0bGluay50cnVlTGVhcm5pbmdSYXRlID0gbGluay5hY2NFcnJvckRlciAvIGxpbmsubnVtQWNjdW11bGF0ZWREZXJzO1xuXHRcdFx0XHRcdGxpbmsud2VpZ2h0ID0gbGluay53ZWlnaHQgLSBsZWFybmluZ1JhdGUgKiBsaW5rLnRydWVMZWFybmluZ1JhdGU7XG5cblx0XHRcdFx0XHQvLyBGdXJ0aGVyIHVwZGF0ZSB0aGUgd2VpZ2h0IGJhc2VkIG9uIHJlZ3VsYXJpemF0aW9uLlxuXHRcdFx0XHRcdGxldCBuZXdMaW5rV2VpZ2h0ID0gbGluay53ZWlnaHQgLVxuXHRcdFx0XHRcdFx0KGxlYXJuaW5nUmF0ZSAqIHJlZ3VsYXJpemF0aW9uUmF0ZSkgKiByZWd1bERlcjtcblx0XHRcdFx0XHRpZiAobGluay5yZWd1bGFyaXphdGlvbiA9PT0gUmVndWxhcml6YXRpb25GdW5jdGlvbi5MMSAmJlxuXHRcdFx0XHRcdFx0bGluay53ZWlnaHQgKiBuZXdMaW5rV2VpZ2h0IDwgMCkge1xuXHRcdFx0XHRcdFx0Ly8gVGhlIHdlaWdodCBjcm9zc2VkIDAgZHVlIHRvIHRoZSByZWd1bGFyaXphdGlvbiB0ZXJtLiBTZXQgaXQgdG8gMC5cblx0XHRcdFx0XHRcdGxpbmsud2VpZ2h0ID0gMDtcblx0XHRcdFx0XHRcdGxpbmsuaXNEZWFkID0gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGluay53ZWlnaHQgPSBuZXdMaW5rV2VpZ2h0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsaW5rLmFjY0Vycm9yRGVyID0gMDtcblx0XHRcdFx0XHRsaW5rLm51bUFjY3VtdWxhdGVkRGVycyA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuLyoqIEl0ZXJhdGVzIG92ZXIgZXZlcnkgbm9kZSBpbiB0aGUgbmV0d29yay8gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoTm9kZShuZXR3b3JrOiBOb2RlW11bXSwgaWdub3JlSW5wdXRzOiBib29sZWFuLFxuXHRcdFx0XHRcdFx0XHRhY2Nlc3NvcjogKG5vZGU6IE5vZGUpID0+IGFueSkge1xuXHRmb3IgKGxldCBsYXllcklkeCA9IGlnbm9yZUlucHV0cyA/IDEgOiAwOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdGFjY2Vzc29yKG5vZGUpO1xuXHRcdH1cblx0fVxufVxuXG4vKiogUmV0dXJucyB0aGUgb3V0cHV0IG5vZGUgaW4gdGhlIG5ldHdvcmsuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3V0cHV0Tm9kZShuZXR3b3JrOiBOb2RlW11bXSkge1xuXHRyZXR1cm4gbmV0d29ya1tuZXR3b3JrLmxlbmd0aCAtIDFdWzBdO1xufVxuIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuaW1wb3J0IHtMaW5rLCBOb2RlfSBmcm9tIFwiLi9ublwiO1xuXG5kZWNsYXJlIHZhciAkOiBhbnk7XG5cbmltcG9ydCAqIGFzIG5uIGZyb20gXCIuL25uXCI7XG5pbXBvcnQge0hlYXRNYXAsIHJlZHVjZU1hdHJpeH0gZnJvbSBcIi4vaGVhdG1hcFwiO1xuaW1wb3J0IHtcblx0U3RhdGUsXG5cdGRhdGFzZXRzLFxuXHRyZWdEYXRhc2V0cyxcblx0YWN0aXZhdGlvbnMsXG5cdHByb2JsZW1zLFxuXHRyZWd1bGFyaXphdGlvbnMsXG5cdGdldEtleUZyb21WYWx1ZSxcblx0UHJvYmxlbVxufSBmcm9tIFwiLi9zdGF0ZVwiO1xuaW1wb3J0IHtFeGFtcGxlMkQsIHNodWZmbGUsIERhdGFHZW5lcmF0b3J9IGZyb20gXCIuL2RhdGFzZXRcIjtcbmltcG9ydCB7QXBwZW5kaW5nTGluZUNoYXJ0fSBmcm9tIFwiLi9saW5lY2hhcnRcIjtcblxubGV0IG1haW5XaWR0aDtcblxudHlwZSBlbmVyZ3lUeXBlID0ge1xuXHRlVmFsOiBudW1iZXIsXG5cdGxhYmVsOiBudW1iZXJcbn07XG5cbmZ1bmN0aW9uIG10cnVuYyh2OiBudW1iZXIpIHtcblx0diA9ICt2O1xuXHRyZXR1cm4gKHYgLSB2ICUgMSkgfHwgKCFpc0Zpbml0ZSh2KSB8fCB2ID09PSAwID8gdiA6IHYgPCAwID8gLTAgOiAwKTtcbn1cblxuZnVuY3Rpb24gbG9nMih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZygyKTtcbn1cblxuZnVuY3Rpb24gbG9nMTAoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coMTApO1xufVxuXG5mdW5jdGlvbiBzaWduYWxPZih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gbG9nMigxICsgTWF0aC5hYnMoeCkpO1xufVxuXG5mdW5jdGlvbiBTTlIoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIDEwICogbG9nMTAoeCk7XG59XG5cbi8vIE1vcmUgc2Nyb2xsaW5nXG5kMy5zZWxlY3QoXCIubW9yZSBidXR0b25cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdGxldCBwb3NpdGlvbiA9IDgwMDtcblx0ZDMudHJhbnNpdGlvbigpXG5cdFx0LmR1cmF0aW9uKDEwMDApXG5cdFx0LnR3ZWVuKFwic2Nyb2xsXCIsIHNjcm9sbFR3ZWVuKHBvc2l0aW9uKSk7XG59KTtcblxuZnVuY3Rpb24gc2Nyb2xsVHdlZW4ob2Zmc2V0KSB7XG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IGkgPSBkMy5pbnRlcnBvbGF0ZU51bWJlcih3aW5kb3cucGFnZVlPZmZzZXQgfHxcblx0XHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsIG9mZnNldCk7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRzY3JvbGxUbygwLCBpKHQpKTtcblx0XHR9O1xuXHR9O1xufVxuXG5jb25zdCBSRUNUX1NJWkUgPSAzMDtcbmNvbnN0IEJJQVNfU0laRSA9IDU7XG5jb25zdCBOVU1fU0FNUExFU19DTEFTU0lGWSA9IDUwMDtcbmNvbnN0IE5VTV9TQU1QTEVTX1JFR1JFU1MgPSAxMjAwO1xuY29uc3QgREVOU0lUWSA9IDEwMDtcblxuY29uc3QgTUFYX05FVVJPTlMgPSAzMjtcbmNvbnN0IE1BWF9ITEFZRVJTID0gMTA7XG5cbi8vIFJvdW5kaW5nIG9mZiBvZiB0cmFpbmluZyBkYXRhLiBVc2VkIGJ5IGdldFJlcUNhcGFjaXR5XG5jb25zdCBSRVFfQ0FQX1JPVU5ESU5HID0gLTE7XG5cbmVudW0gSG92ZXJUeXBlIHtcblx0QklBUywgV0VJR0hUXG59XG5cbmludGVyZmFjZSBJbnB1dEZlYXR1cmUge1xuXHRmOiAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IG51bWJlcjtcblx0bGFiZWw/OiBzdHJpbmc7XG59XG5cbmxldCBJTlBVVFM6IHsgW25hbWU6IHN0cmluZ106IElucHV0RmVhdHVyZSB9ID0ge1xuXHRcInhcIjoge2Y6ICh4LCB5KSA9PiB4LCBsYWJlbDogXCJYXzFcIn0sXG5cdFwieVwiOiB7ZjogKHgsIHkpID0+IHksIGxhYmVsOiBcIlhfMlwifSxcblx0XCJ4U3F1YXJlZFwiOiB7ZjogKHgsIHkpID0+IHggKiB4LCBsYWJlbDogXCJYXzFeMlwifSxcblx0XCJ5U3F1YXJlZFwiOiB7ZjogKHgsIHkpID0+IHkgKiB5LCBsYWJlbDogXCJYXzJeMlwifSxcblx0XCJ4VGltZXNZXCI6IHtmOiAoeCwgeSkgPT4geCAqIHksIGxhYmVsOiBcIlhfMVhfMlwifSxcblx0XCJzaW5YXCI6IHtmOiAoeCwgeSkgPT4gTWF0aC5zaW4oeCksIGxhYmVsOiBcInNpbihYXzEpXCJ9LFxuXHRcInNpbllcIjoge2Y6ICh4LCB5KSA9PiBNYXRoLnNpbih5KSwgbGFiZWw6IFwic2luKFhfMilcIn0sXG59O1xuXG5sZXQgSElEQUJMRV9DT05UUk9MUyA9XG5cdFtcblx0XHRbXCJTaG93IHRlc3QgZGF0YVwiLCBcInNob3dUZXN0RGF0YVwiXSxcblx0XHRbXCJEaXNjcmV0aXplIG91dHB1dFwiLCBcImRpc2NyZXRpemVcIl0sXG5cdFx0W1wiUGxheSBidXR0b25cIiwgXCJwbGF5QnV0dG9uXCJdLFxuXHRcdFtcIlN0ZXAgYnV0dG9uXCIsIFwic3RlcEJ1dHRvblwiXSxcblx0XHRbXCJSZXNldCBidXR0b25cIiwgXCJyZXNldEJ1dHRvblwiXSxcblx0XHRbXCJSYXRlIHNjYWxlIGZhY3RvclwiLCBcImxlYXJuaW5nUmF0ZVwiXSxcblx0XHRbXCJMZWFybmluZyByYXRlXCIsIFwidHJ1ZUxlYXJuaW5nUmF0ZVwiXSxcblx0XHRbXCJBY3RpdmF0aW9uXCIsIFwiYWN0aXZhdGlvblwiXSxcblx0XHRbXCJSZWd1bGFyaXphdGlvblwiLCBcInJlZ3VsYXJpemF0aW9uXCJdLFxuXHRcdFtcIlJlZ3VsYXJpemF0aW9uIHJhdGVcIiwgXCJyZWd1bGFyaXphdGlvblJhdGVcIl0sXG5cdFx0W1wiUHJvYmxlbSB0eXBlXCIsIFwicHJvYmxlbVwiXSxcblx0XHRbXCJXaGljaCBkYXRhc2V0XCIsIFwiZGF0YXNldFwiXSxcblx0XHRbXCJSYXRpbyB0cmFpbiBkYXRhXCIsIFwicGVyY1RyYWluRGF0YVwiXSxcblx0XHRbXCJOb2lzZSBsZXZlbFwiLCBcIm5vaXNlXCJdLFxuXHRcdFtcIkJhdGNoIHNpemVcIiwgXCJiYXRjaFNpemVcIl0sXG5cdFx0W1wiIyBvZiBoaWRkZW4gbGF5ZXJzXCIsIFwibnVtSGlkZGVuTGF5ZXJzXCJdLFxuXHRdO1xuXG5jbGFzcyBQbGF5ZXIge1xuXHRwcml2YXRlIHRpbWVySW5kZXggPSAwO1xuXHRwcml2YXRlIGlzUGxheWluZyA9IGZhbHNlO1xuXHRwcml2YXRlIGNhbGxiYWNrOiAoaXNQbGF5aW5nOiBib29sZWFuKSA9PiB2b2lkID0gbnVsbDtcblxuXHQvKiogUGxheXMvcGF1c2VzIHRoZSBwbGF5ZXIuICovXG5cdHBsYXlPclBhdXNlKCkge1xuXHRcdGlmICh0aGlzLmlzUGxheWluZykge1xuXHRcdFx0dGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcblx0XHRcdHRoaXMucGF1c2UoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5pc1BsYXlpbmcgPSB0cnVlO1xuXHRcdFx0aWYgKGl0ZXIgPT09IDApIHtcblx0XHRcdFx0c2ltdWxhdGlvblN0YXJ0ZWQoKTtcblx0XHRcdH1cblx0XHRcdHRoaXMucGxheSgpO1xuXHRcdH1cblx0fVxuXG5cdG9uUGxheVBhdXNlKGNhbGxiYWNrOiAoaXNQbGF5aW5nOiBib29sZWFuKSA9PiB2b2lkKSB7XG5cdFx0dGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuXHR9XG5cblx0cGxheSgpIHtcblx0XHR0aGlzLnBhdXNlKCk7XG5cdFx0dGhpcy5pc1BsYXlpbmcgPSB0cnVlO1xuXHRcdGlmICh0aGlzLmNhbGxiYWNrKSB7XG5cdFx0XHR0aGlzLmNhbGxiYWNrKHRoaXMuaXNQbGF5aW5nKTtcblx0XHR9XG5cdFx0dGhpcy5zdGFydCh0aGlzLnRpbWVySW5kZXgpO1xuXHR9XG5cblx0cGF1c2UoKSB7XG5cdFx0dGhpcy50aW1lckluZGV4Kys7XG5cdFx0dGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcblx0XHRpZiAodGhpcy5jYWxsYmFjaykge1xuXHRcdFx0dGhpcy5jYWxsYmFjayh0aGlzLmlzUGxheWluZyk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdGFydChsb2NhbFRpbWVySW5kZXg6IG51bWJlcikge1xuXHRcdGQzLnRpbWVyKCgpID0+IHtcblx0XHRcdGlmIChsb2NhbFRpbWVySW5kZXggPCB0aGlzLnRpbWVySW5kZXgpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7ICAvLyBEb25lLlxuXHRcdFx0fVxuXHRcdFx0b25lU3RlcCgpO1xuXHRcdFx0cmV0dXJuIGZhbHNlOyAgLy8gTm90IGRvbmUuXG5cdFx0fSwgMCk7XG5cdH1cbn1cblxubGV0IHN0YXRlID0gU3RhdGUuZGVzZXJpYWxpemVTdGF0ZSgpO1xuXG4vLyBGaWx0ZXIgb3V0IGlucHV0cyB0aGF0IGFyZSBoaWRkZW4uXG5zdGF0ZS5nZXRIaWRkZW5Qcm9wcygpLmZvckVhY2gocHJvcCA9PiB7XG5cdGlmIChwcm9wIGluIElOUFVUUykge1xuXHRcdGRlbGV0ZSBJTlBVVFNbcHJvcF07XG5cdH1cbn0pO1xuXG5sZXQgYm91bmRhcnk6IHsgW2lkOiBzdHJpbmddOiBudW1iZXJbXVtdIH0gPSB7fTtcbmxldCBzZWxlY3RlZE5vZGVJZDogc3RyaW5nID0gbnVsbDtcbi8vIFBsb3QgdGhlIGhlYXRtYXAuXG5sZXQgeERvbWFpbjogW251bWJlciwgbnVtYmVyXSA9IFstNiwgNl07XG5sZXQgaGVhdE1hcCA9XG5cdG5ldyBIZWF0TWFwKDMwMCwgREVOU0lUWSwgeERvbWFpbiwgeERvbWFpbiwgZDMuc2VsZWN0KFwiI2hlYXRtYXBcIiksXG5cdFx0e3Nob3dBeGVzOiB0cnVlfSk7XG5sZXQgbGlua1dpZHRoU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHQuZG9tYWluKFswLCA1XSlcblx0LnJhbmdlKFsxLCAxMF0pXG5cdC5jbGFtcCh0cnVlKTtcbmxldCBjb2xvclNjYWxlID0gZDMuc2NhbGUubGluZWFyPHN0cmluZz4oKVxuXHQuZG9tYWluKFstMSwgMCwgMV0pXG5cdC5yYW5nZShbXCIjMDg3N2JkXCIsIFwiI2U4ZWFlYlwiLCBcIiNmNTkzMjJcIl0pXG5cdC5jbGFtcCh0cnVlKTtcbmxldCBpdGVyID0gMDtcbmxldCB0cmFpbkRhdGE6IEV4YW1wbGUyRFtdID0gW107XG5sZXQgdGVzdERhdGE6IEV4YW1wbGUyRFtdID0gW107XG5sZXQgbmV0d29yazogbm4uTm9kZVtdW10gPSBudWxsO1xubGV0IGxvc3NUcmFpbiA9IDA7XG5sZXQgbG9zc1Rlc3QgPSAwO1xubGV0IHRydWVMZWFybmluZ1JhdGUgPSAwO1xubGV0IHRvdGFsQ2FwYWNpdHkgPSAwO1xubGV0IGdlbmVyYWxpemF0aW9uID0gMDtcbmxldCB0cmFpbkNsYXNzZXNBY2N1cmFjeSA9IFtdO1xubGV0IHRlc3RDbGFzc2VzQWNjdXJhY3kgPSBbXTtcbmxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG5sZXQgbGluZUNoYXJ0ID0gbmV3IEFwcGVuZGluZ0xpbmVDaGFydChkMy5zZWxlY3QoXCIjbGluZWNoYXJ0XCIpLFxuXHRbXCIjNzc3XCIsIFwiYmxhY2tcIl0pO1xuXG5sZXQgbWFya2VkTm9kZTogbm4uTm9kZSA9IG51bGw7XG5sZXQgbWFya2VkRGl2ID0gbnVsbDtcblxuZnVuY3Rpb24gZ2V0UmVxQ2FwYWNpdHkocG9pbnRzOiBFeGFtcGxlMkRbXSk6IG51bWJlcltdIHtcblxuXHRsZXQgcm91bmRpbmcgPSBSRVFfQ0FQX1JPVU5ESU5HO1xuXHRsZXQgZW5lcmd5OiBlbmVyZ3lUeXBlW10gPSBbXTtcblx0bGV0IG51bVJvd3M6IG51bWJlciA9IHBvaW50cy5sZW5ndGg7XG5cdGxldCBudW1Db2xzOiBudW1iZXIgPSAyO1xuXHRsZXQgcmVzdWx0OiBudW1iZXIgPSAwO1xuXHRsZXQgcmV0dmFsOiBudW1iZXJbXSA9IFtdO1xuXG5cdGxldCBjbGFzczEgPSAtNjY2O1xuXHRsZXQgbnVtY2xhc3MxOiBudW1iZXIgPSAwO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVJvd3M7IGkrKykge1xuXHRcdGxldCByZXN1bHQgPSAwOyAvLyB5LCB4U3F1YXJlZCwgeVNxdWFyZWQsIHhUaW1lc1ksIHNpblgsIHNpblksXG5cdFx0aWYgKG5ldHdvcmsgJiYgbmV0d29ya1swXS5sZW5ndGgpIHtcblx0XHRcdG5ldHdvcmtbMF0uZm9yRWFjaCgobm9kZTogTm9kZSkgPT4ge1xuXHRcdFx0XHRyZXN1bHQgKz0gSU5QVVRTW25vZGUuaWRdLmYocG9pbnRzW2ldLngsIHBvaW50c1tpXS55KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiBbSW5maW5pdHksIEluZmluaXR5XTtcblx0XHR9XG5cdFx0aWYgKHJvdW5kaW5nICE9IC0xKSB7XG5cdFx0XHRyZXN1bHQgPSBtdHJ1bmMocmVzdWx0ICogTWF0aC5wb3coMTAsIHJvdW5kaW5nKSkgLyBNYXRoLnBvdygxMCwgcm91bmRpbmcpO1xuXHRcdH1cblx0XHRsZXQgZVZhbDogbnVtYmVyID0gcmVzdWx0O1xuXHRcdGxldCBsYWJlbDogbnVtYmVyID0gcG9pbnRzW2ldLmxhYmVsO1xuXHRcdGVuZXJneS5wdXNoKHtlVmFsLCBsYWJlbH0pO1xuXHRcdGlmIChjbGFzczEgPT0gLTY2Nikge1xuXHRcdFx0Y2xhc3MxID0gbGFiZWw7XG5cdFx0fVxuXHRcdGlmIChsYWJlbCA9PSBjbGFzczEpIHtcblx0XHRcdG51bWNsYXNzMSsrO1xuXHRcdH1cblx0fVxuXG5cblx0ZW5lcmd5LnNvcnQoXG5cdFx0ZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRcdHJldHVybiBhLmVWYWwgLSBiLmVWYWw7XG5cdFx0fVxuXHQpO1xuXG5cdGxldCBjdXJMYWJlbCA9IGVuZXJneVswXS5sYWJlbDtcblx0bGV0IGNoYW5nZXMgPSAwO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZW5lcmd5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKGVuZXJneVtpXS5sYWJlbCAhPSBjdXJMYWJlbCkge1xuXHRcdFx0Y2hhbmdlcysrO1xuXHRcdFx0Y3VyTGFiZWwgPSBlbmVyZ3lbaV0ubGFiZWw7XG5cdFx0fVxuXHR9XG5cblx0bGV0IGNsdXN0ZXJzOiBudW1iZXIgPSAwO1xuXHRjbHVzdGVycyA9IGNoYW5nZXMgKyAxO1xuXG5cdGxldCBtaW5jdXRzOiBudW1iZXIgPSAwO1xuXHRtaW5jdXRzID0gTWF0aC5jZWlsKGxvZzIoY2x1c3RlcnMpKTtcblxuXHRsZXQgc3VnQ2FwYWNpdHkgPSBtaW5jdXRzICogbnVtQ29scztcblx0bGV0IG1heENhcGFjaXR5ID0gY2hhbmdlcyAqIChudW1Db2xzICsgMSkgKyBjaGFuZ2VzO1xuXG5cdHJldHZhbC5wdXNoKHN1Z0NhcGFjaXR5KTtcblx0cmV0dmFsLnB1c2gobWF4Q2FwYWNpdHkpO1xuXG5cblx0cmV0dXJuIHJldHZhbDtcbn1cblxuXG5mdW5jdGlvbiBudW1iZXJPZlVuaXF1ZShkYXRhc2V0OiBFeGFtcGxlMkRbXSkge1xuXHRsZXQgY291bnQ6IG51bWJlciA9IDA7XG5cdGxldCB1bmlxdWVEaWN0OiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge307XG5cdGRhdGFzZXQuZm9yRWFjaChwb2ludCA9PiB7XG5cdFx0bGV0IGtleTogc3RyaW5nID0gXCJcIiArIHBvaW50LnggKyBwb2ludC55ICsgcG9pbnQubGFiZWw7XG5cdFx0aWYgKCEoa2V5IGluIHVuaXF1ZURpY3QpKSB7XG5cdFx0XHRjb3VudCArPSAxO1xuXHRcdFx0dW5pcXVlRGljdFtrZXldID0gMTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gY291bnQ7XG59XG5cbi8qKlxuICogU2NhbGluZyB0aGUgcG9pbnRzIGluIHtwb2ludHN9IGdpdmVuIGEgcmFuZ2Uge3JhbmdlfVxuICovXG5mdW5jdGlvbiBtaW5NYXhTY2FsZVBvaW50cyhwb2ludHM6IEV4YW1wbGUyRFtdLCByYW5nZTogW251bWJlciwgbnVtYmVyXSkge1xuXHRsZXQgcG9pbnRzX3ggPSBwb2ludHMubWFwKHAgPT4gcC54KTtcblx0bGV0IHBvaW50c195ID0gcG9pbnRzLm1hcChwID0+IHAueSk7XG5cdGxldCB4X21pbiA9IE1hdGgubWluKC4uLnBvaW50c194KTtcblx0bGV0IHhfbWF4ID0gTWF0aC5tYXgoLi4ucG9pbnRzX3gpO1xuXHRsZXQgeV9taW4gPSBNYXRoLm1pbiguLi5wb2ludHNfeSk7XG5cdGxldCB5X21heCA9IE1hdGgubWF4KC4uLnBvaW50c195KTtcblx0cG9pbnRzLmZvckVhY2gocCA9PiB7XG5cdFx0cC54ID0gKChwLnggLSB4X21pbikgLyAoeF9tYXggLSB4X21pbikpICogKHJhbmdlWzFdIC0gcmFuZ2VbMF0pICsgcmFuZ2VbMF07XG5cdFx0cC55ID0gKChwLnkgLSB5X21pbikgLyAoeV9tYXggLSB5X21pbikpICogKHJhbmdlWzFdIC0gcmFuZ2VbMF0pICsgcmFuZ2VbMF07XG5cdH0pO1xuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG5mdW5jdGlvbiBtYWtlR1VJKCkge1xuXHQvLyBUb29sYm94ZXNcblx0JChmdW5jdGlvbiAoKSB7XG5cdFx0JChcIltkYXRhLXRvZ2dsZT0ncG9wb3ZlciddXCIpLnBvcG92ZXIoe1xuXHRcdFx0Y29udGFpbmVyOiBcImJvZHlcIlxuXHRcdH0pO1xuXHR9KTtcblx0JChcIi5wb3BvdmVyLWRpc21pc3NcIikucG9wb3Zlcih7XG5cdFx0dHJpZ2dlcjogXCJmb2N1c1wiXG5cdH0pO1xuXG5cdC8vIEFkZGluZyBsaW5rcyBiZXR3ZWVuIG5vZGVzXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50LmtleUNvZGUgPT0gMTYpIHtcblx0XHRcdHN0YXRlLnNoaWZ0RG93biA9IGZhbHNlO1xuXHRcdFx0aWYgKG1hcmtlZERpdiAhPSBudWxsKSB7XG5cdFx0XHRcdG1hcmtlZERpdi5zdHlsZSh7XG5cdFx0XHRcdFx0XCJib3JkZXItd2lkdGhcIjogXCIwcHhcIlxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdG1hcmtlZERpdiA9IG51bGw7XG5cdFx0XHRtYXJrZWROb2RlID0gbnVsbDtcblx0XHR9XG5cdH0pO1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50LmtleUNvZGUgPT0gMTYpIHtcblx0XHRcdHN0YXRlLnNoaWZ0RG93biA9IHRydWU7XG5cdFx0fVxuXHR9KTtcblxuXG5cdGQzLnNlbGVjdChcIiNyZXNldC1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0cmVzZXQoKTtcblx0XHR1c2VySGFzSW50ZXJhY3RlZCgpO1xuXHRcdGQzLnNlbGVjdChcIiNwbGF5LXBhdXNlLWJ1dHRvblwiKTtcblx0fSk7XG5cblx0ZDMuc2VsZWN0KFwiI3BsYXktcGF1c2UtYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdC8vIENoYW5nZSB0aGUgYnV0dG9uJ3MgY29udGVudC5cblx0XHR1c2VySGFzSW50ZXJhY3RlZCgpO1xuXHRcdHBsYXllci5wbGF5T3JQYXVzZSgpO1xuXHR9KTtcblxuXHRwbGF5ZXIub25QbGF5UGF1c2UoaXNQbGF5aW5nID0+IHtcblx0XHRkMy5zZWxlY3QoXCIjcGxheS1wYXVzZS1idXR0b25cIikuY2xhc3NlZChcInBsYXlpbmdcIiwgaXNQbGF5aW5nKTtcblx0fSk7XG5cblx0ZDMuc2VsZWN0KFwiI25leHQtc3RlcC1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0cGxheWVyLnBhdXNlKCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRpZiAoaXRlciA9PT0gMCkge1xuXHRcdFx0c2ltdWxhdGlvblN0YXJ0ZWQoKTtcblx0XHR9XG5cdFx0b25lU3RlcCgpO1xuXHR9KTtcblxuXHRkMy5zZWxlY3QoXCIjZGF0YS1yZWdlbi1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0Z2VuZXJhdGVEYXRhKCk7XG5cdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHR9KTtcblxuXHRsZXQgZGF0YVRodW1ibmFpbHMgPSBkMy5zZWxlY3RBbGwoXCJjYW52YXNbZGF0YS1kYXRhc2V0XVwiKTtcblx0ZGF0YVRodW1ibmFpbHMub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IG5ld0RhdGFzZXQgPSBkYXRhc2V0c1t0aGlzLmRhdGFzZXQuZGF0YXNldF07XG5cdFx0bGV0IGRhdGFzZXRLZXkgPSBnZXRLZXlGcm9tVmFsdWUoZGF0YXNldHMsIG5ld0RhdGFzZXQpO1xuXG5cdFx0aWYgKG5ld0RhdGFzZXQgPT09IHN0YXRlLmRhdGFzZXQgJiYgZGF0YXNldEtleSAhPSBcImJ5b2RcIikge1xuXHRcdFx0cmV0dXJuOyAvLyBOby1vcC5cblx0XHR9XG5cblx0XHRzdGF0ZS5kYXRhc2V0ID0gbmV3RGF0YXNldDtcblxuXG5cdFx0aWYgKGRhdGFzZXRLZXkgPT09IFwiYnlvZFwiKSB7XG5cblx0XHRcdHN0YXRlLmJ5b2QgPSB0cnVlO1xuXHRcdFx0ZDMuc2VsZWN0KFwiI2lucHV0Rm9ybUJZT0RcIikuaHRtbChcIjxpbnB1dCB0eXBlPSdmaWxlJyBhY2NlcHQ9Jy5jc3YnIGlkPSdpbnB1dEZpbGVCWU9EJz5cIik7XG5cdFx0XHRkYXRhVGh1bWJuYWlscy5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuXHRcdFx0ZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcblx0XHRcdCQoXCIjaW5wdXRGaWxlQllPRFwiKS5jbGljaygpO1xuXG5cdFx0XHQvLyBkMy5zZWxlY3QoXCIjbm9pc2VcIikudmFsdWUoc3RhdGUubm9pc2UpO1xuXHRcdFx0Ly8gfiAkKFwiI25vaXNlXCIpLnNsaWRlcihcImRpc2FibGVcIik7XG5cblx0XHRcdGxldCBpbnB1dEJZT0QgPSBkMy5zZWxlY3QoXCIjaW5wdXRGaWxlQllPRFwiKTtcblx0XHRcdGlucHV0QllPRC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cdFx0XHRcdGxldCBuYW1lID0gdGhpcy5maWxlc1swXS5uYW1lO1xuXHRcdFx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0XHRcdFx0XHRsZXQgdGFyZ2V0OiBhbnkgPSBldmVudC50YXJnZXQ7XG5cdFx0XHRcdFx0bGV0IGRhdGEgPSB0YXJnZXQucmVzdWx0O1xuXHRcdFx0XHRcdGxldCBzID0gZGF0YS5zcGxpdChcIlxcblwiKTtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGxldCBzcyA9IHNbaV0uc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRcdFx0aWYgKHNzLmxlbmd0aCAhPSAzKSBicmVhaztcblx0XHRcdFx0XHRcdGxldCB4ID0gcGFyc2VGbG9hdChzc1swXSk7XG5cdFx0XHRcdFx0XHRsZXQgeSA9IHBhcnNlRmxvYXQoc3NbMV0pO1xuXHRcdFx0XHRcdFx0bGV0IGxhYmVsID0gcGFyc2VJbnQoc3NbMl0pO1xuXHRcdFx0XHRcdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHBvaW50cyA9IG1pbk1heFNjYWxlUG9pbnRzKHBvaW50cywgWy02LCA2XSk7XG5cdFx0XHRcdFx0c2h1ZmZsZShwb2ludHMpO1xuXHRcdFx0XHRcdC8vIFNwbGl0IGludG8gdHJhaW4gYW5kIHRlc3QgZGF0YS5cblx0XHRcdFx0XHRsZXQgc3BsaXRJbmRleCA9IE1hdGguZmxvb3IocG9pbnRzLmxlbmd0aCAqIHN0YXRlLnBlcmNUcmFpbkRhdGEgLyAxMDApO1xuXHRcdFx0XHRcdHRyYWluRGF0YSA9IHBvaW50cy5zbGljZSgwLCBzcGxpdEluZGV4KTtcblx0XHRcdFx0XHR0ZXN0RGF0YSA9IHBvaW50cy5zbGljZShzcGxpdEluZGV4KTtcblxuXHRcdFx0XHRcdGhlYXRNYXAudXBkYXRlUG9pbnRzKHRyYWluRGF0YSk7XG5cdFx0XHRcdFx0aGVhdE1hcC51cGRhdGVUZXN0UG9pbnRzKHN0YXRlLnNob3dUZXN0RGF0YSA/IHRlc3REYXRhIDogW10pO1xuXG5cdFx0XHRcdFx0bGV0IGNsYXNzRGlzdCA9IGdldE51bWJlck9mRWFjaENsYXNzKHRyYWluRGF0YSkubWFwKChudW0pID0+IG51bSAvIHRyYWluRGF0YS5sZW5ndGgpO1xuXHRcdFx0XHRcdHN0YXRlLnN1Z0NhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkodHJhaW5EYXRhKVswXTtcblx0XHRcdFx0XHRzdGF0ZS5tYXhDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMV07XG5cblx0XHRcdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRcdFx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdFx0XHRcdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRcdFx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YURpc3RyaWJ1dGlvbiddIC52YWx1ZVwiKVxuXHRcdFx0XHRcdFx0LnRleHQoYCR7Y2xhc3NEaXN0WzBdLnRvRml4ZWQoMyl9LCAke2NsYXNzRGlzdFsxXS50b0ZpeGVkKDMpfWApO1xuXHRcdFx0XHRcdC8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdFx0XHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRyZXNldCgpO1xuXG5cdFx0XHRcdFx0Ly8gRHJhd2luZyB0aHVtYm5haWxcblx0XHRcdFx0XHRsZXQgY2FudmFzOiBhbnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBjYW52YXNbZGF0YS1kYXRhc2V0PWJ5b2RdYCk7XG5cdFx0XHRcdFx0cmVuZGVyVGh1bWJuYWlsKGNhbnZhcywgKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcikgPT4gcG9pbnRzKTtcblxuXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVhZGVyLnJlYWRBc1RleHQodGhpcy5maWxlc1swXSk7XG5cdFx0XHR9KTtcblxuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0YXRlLmJ5b2QgPSBmYWxzZTtcblx0XHRcdC8vIH4gZDMuc2VsZWN0KFwiI2lucHV0Rm9ybUJZT0RcIikuaHRtbChcIlwiKTtcblx0XHRcdC8vICQoXCIjbm9pc2VcIikuZGlzYWJsZWQgPSBmYWxzZTtcblxuXHRcdFx0ZGF0YVRodW1ibmFpbHMuY2xhc3NlZChcInNlbGVjdGVkXCIsIGZhbHNlKTtcblx0XHRcdGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cdFx0XHRzdGF0ZS5ub2lzZSA9IDM1OyAvLyBTTlJkQlxuXG5cblx0XHRcdGdlbmVyYXRlRGF0YSgpO1xuXG5cdFx0XHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmFpbkRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0cG9pbnRzLnB1c2godHJhaW5EYXRhW2ldKTtcblx0XHRcdH1cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGVzdERhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0cG9pbnRzLnB1c2godGVzdERhdGFbaV0pO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgY2xhc3NEaXN0ID0gZ2V0TnVtYmVyT2ZFYWNoQ2xhc3ModHJhaW5EYXRhKS5tYXAoKG51bSkgPT4gbnVtIC8gdHJhaW5EYXRhLmxlbmd0aCk7XG5cdFx0XHRzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMF07XG5cdFx0XHRzdGF0ZS5tYXhDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMV07XG5cblx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbWF4Q2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5tYXhDYXBhY2l0eSk7XG5cdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRcdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRcdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhRGlzdHJpYnV0aW9uJ10gLnZhbHVlXCIpXG5cdFx0XHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblxuXHRcdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXG5cdFx0XHQvLyBSZXNldHRpbmcgdGhlIEJZT0QgdGh1bWJuYWlsXG5cdFx0XHRsZXQgY2FudmFzOiBhbnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBjYW52YXNbZGF0YS1kYXRhc2V0PWJ5b2RdYCk7XG5cdFx0XHRyZW5kZXJCWU9EVGh1bWJuYWlsKGNhbnZhcyk7XG5cdFx0XHRyZXNldCgpO1xuXHRcdH1cblxuXHR9KTtcblxuXHRsZXQgZGF0YXNldEtleSA9IGdldEtleUZyb21WYWx1ZShkYXRhc2V0cywgc3RhdGUuZGF0YXNldCk7XG5cdC8vIFNlbGVjdCB0aGUgZGF0YXNldCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG5cdGQzLnNlbGVjdChgY2FudmFzW2RhdGEtZGF0YXNldD0ke2RhdGFzZXRLZXl9XWApXG5cdFx0LmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcblxuXHRsZXQgcmVnRGF0YVRodW1ibmFpbHMgPSBkMy5zZWxlY3RBbGwoXCJjYW52YXNbZGF0YS1yZWdEYXRhc2V0XVwiKTtcblx0cmVnRGF0YVRodW1ibmFpbHMub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IG5ld0RhdGFzZXQgPSByZWdEYXRhc2V0c1t0aGlzLmRhdGFzZXQucmVnZGF0YXNldF07XG5cdFx0aWYgKG5ld0RhdGFzZXQgPT09IHN0YXRlLnJlZ0RhdGFzZXQpIHtcblx0XHRcdHJldHVybjsgLy8gTm8tb3AuXG5cdFx0fVxuXHRcdHN0YXRlLnJlZ0RhdGFzZXQgPSBuZXdEYXRhc2V0O1xuXHRcdHN0YXRlLnN1Z0NhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkodHJhaW5EYXRhKVswXTtcblx0XHRzdGF0ZS5tYXhDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMV07XG5cdFx0cmVnRGF0YVRodW1ibmFpbHMuY2xhc3NlZChcInNlbGVjdGVkXCIsIGZhbHNlKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xuXHRcdGdlbmVyYXRlRGF0YSgpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRsZXQgcmVnRGF0YXNldEtleSA9IGdldEtleUZyb21WYWx1ZShyZWdEYXRhc2V0cywgc3RhdGUucmVnRGF0YXNldCk7XG5cdC8vIFNlbGVjdCB0aGUgZGF0YXNldCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG5cdGQzLnNlbGVjdChgY2FudmFzW2RhdGEtcmVnRGF0YXNldD0ke3JlZ0RhdGFzZXRLZXl9XWApXG5cdFx0LmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcblxuXG5cdGQzLnNlbGVjdChcIiNhZGQtbGF5ZXJzXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlmIChzdGF0ZS5udW1IaWRkZW5MYXllcnMgPj0gTUFYX0hMQVlFUlMpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0c3RhdGUubmV0d29ya1NoYXBlW3N0YXRlLm51bUhpZGRlbkxheWVyc10gPSAyO1xuXHRcdHN0YXRlLm51bUhpZGRlbkxheWVycysrO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRkMy5zZWxlY3QoXCIjcmVtb3ZlLWxheWVyc1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAoc3RhdGUubnVtSGlkZGVuTGF5ZXJzIDw9IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0c3RhdGUubnVtSGlkZGVuTGF5ZXJzLS07XG5cdFx0c3RhdGUubmV0d29ya1NoYXBlLnNwbGljZShzdGF0ZS5udW1IaWRkZW5MYXllcnMpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRsZXQgc2hvd1Rlc3REYXRhID0gZDMuc2VsZWN0KFwiI3Nob3ctdGVzdC1kYXRhXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5zaG93VGVzdERhdGEgPSB0aGlzLmNoZWNrZWQ7XG5cdFx0c3RhdGUuc2VyaWFsaXplKCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRoZWF0TWFwLnVwZGF0ZVRlc3RQb2ludHMoc3RhdGUuc2hvd1Rlc3REYXRhID8gdGVzdERhdGEgOiBbXSk7XG5cdH0pO1xuXG5cdC8vIENoZWNrL3VuY2hlY2sgdGhlIGNoZWNrYm94IGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS5cblx0c2hvd1Rlc3REYXRhLnByb3BlcnR5KFwiY2hlY2tlZFwiLCBzdGF0ZS5zaG93VGVzdERhdGEpO1xuXG5cdGxldCBkaXNjcmV0aXplID0gZDMuc2VsZWN0KFwiI2Rpc2NyZXRpemVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLmRpc2NyZXRpemUgPSB0aGlzLmNoZWNrZWQ7XG5cdFx0c3RhdGUuc2VyaWFsaXplKCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHR1cGRhdGVVSSgpO1xuXHR9KTtcblx0Ly8gQ2hlY2svdW5jaGVjayB0aGUgY2hlY2JveCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG5cdGRpc2NyZXRpemUucHJvcGVydHkoXCJjaGVja2VkXCIsIHN0YXRlLmRpc2NyZXRpemUpO1xuXG5cdGxldCBwZXJjVHJhaW4gPSBkMy5zZWxlY3QoXCIjcGVyY1RyYWluRGF0YVwiKS5vbihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5wZXJjVHJhaW5EYXRhID0gdGhpcy52YWx1ZTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3BlcmNUcmFpbkRhdGEnXSAudmFsdWVcIikudGV4dCh0aGlzLnZhbHVlKTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblxuXHRcdGxldCBjbGFzc0Rpc3QgPSBnZXROdW1iZXJPZkVhY2hDbGFzcyh0cmFpbkRhdGEpLm1hcCgobnVtKSA9PiBudW0gLyB0cmFpbkRhdGEubGVuZ3RoKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YURpc3RyaWJ1dGlvbiddIC52YWx1ZVwiKVxuXHRcdFx0LnRleHQoYCR7Y2xhc3NEaXN0WzBdLnRvRml4ZWQoMyl9LCAke2NsYXNzRGlzdFsxXS50b0ZpeGVkKDMpfWApO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblx0cGVyY1RyYWluLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUucGVyY1RyYWluRGF0YSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0ncGVyY1RyYWluRGF0YSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnBlcmNUcmFpbkRhdGEpO1xuXG5cdGZ1bmN0aW9uIGh1bWFuUmVhZGFibGVJbnQobjogbnVtYmVyKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gbi50b0ZpeGVkKDApO1xuXHR9XG5cblx0bGV0IG5vaXNlID0gZDMuc2VsZWN0KFwiI25vaXNlXCIpLm9uKFwiaW5wdXRcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLm5vaXNlID0gdGhpcy52YWx1ZTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3RydWUtbm9pc2VTTlInXSAudmFsdWVcIikudGV4dCh0aGlzLnZhbHVlKTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblxuXHRcdGxldCBjbGFzc0Rpc3QgPSBnZXROdW1iZXJPZkVhY2hDbGFzcyh0cmFpbkRhdGEpLm1hcCgobnVtKSA9PiBudW0gLyB0cmFpbkRhdGEubGVuZ3RoKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YURpc3RyaWJ1dGlvbiddIC52YWx1ZVwiKVxuXHRcdFx0LnRleHQoYCR7Y2xhc3NEaXN0WzBdLnRvRml4ZWQoMyl9LCAke2NsYXNzRGlzdFsxXS50b0ZpeGVkKDMpfWApO1xuXG5cdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHRcdHJlc2V0KCk7XG5cdH0pO1xuXG5cblx0bm9pc2UucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5ub2lzZSk7XG5cdGxldCBjbGFzc0Rpc3QgPSBnZXROdW1iZXJPZkVhY2hDbGFzcyh0cmFpbkRhdGEpLm1hcCgobnVtKSA9PiBudW0gLyB0cmFpbkRhdGEubGVuZ3RoKTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSd0cnVlLW5vaXNlU05SJ10gLnZhbHVlXCIpLnRleHQoc3RhdGUubm9pc2UpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YURpc3RyaWJ1dGlvbiddIC52YWx1ZVwiKVxuXHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblxuXHRsZXQgYmF0Y2hTaXplID0gZDMuc2VsZWN0KFwiI2JhdGNoU2l6ZVwiKS5vbihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5iYXRjaFNpemUgPSB0aGlzLnZhbHVlO1xuXG5cdFx0bGV0IGNsYXNzRGlzdCA9IGdldE51bWJlck9mRWFjaENsYXNzKHRyYWluRGF0YSkubWFwKChudW0pID0+IG51bSAvIHRyYWluRGF0YS5sZW5ndGgpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nYmF0Y2hTaXplJ10gLnZhbHVlXCIpLnRleHQodGhpcy52YWx1ZSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFEaXN0cmlidXRpb24nXSAudmFsdWVcIilcblx0XHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblxuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRiYXRjaFNpemUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5iYXRjaFNpemUpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLmJhdGNoU2l6ZSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbWF4Q2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5tYXhDYXBhY2l0eSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhRGlzdHJpYnV0aW9uJ10gLnZhbHVlXCIpXG5cdFx0LnRleHQoYCR7Y2xhc3NEaXN0WzBdLnRvRml4ZWQoMyl9LCAke2NsYXNzRGlzdFsxXS50b0ZpeGVkKDMpfWApO1xuXG5cblx0bGV0IGFjdGl2YXRpb25Ecm9wZG93biA9IGQzLnNlbGVjdChcIiNhY3RpdmF0aW9uc1wiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0c3RhdGUuYWN0aXZhdGlvbiA9IGFjdGl2YXRpb25zW3RoaXMudmFsdWVdO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblx0YWN0aXZhdGlvbkRyb3Bkb3duLnByb3BlcnR5KFwidmFsdWVcIiwgZ2V0S2V5RnJvbVZhbHVlKGFjdGl2YXRpb25zLCBzdGF0ZS5hY3RpdmF0aW9uKSk7XG5cblx0bGV0IGxlYXJuaW5nUmF0ZSA9IGQzLnNlbGVjdChcIiNsZWFybmluZ1JhdGVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLmxlYXJuaW5nUmF0ZSA9IHRoaXMudmFsdWU7XG5cdFx0c3RhdGUuc2VyaWFsaXplKCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdH0pO1xuXG5cdGxlYXJuaW5nUmF0ZS5wcm9wZXJ0eShcInZhbHVlXCIsIHN0YXRlLmxlYXJuaW5nUmF0ZSk7XG5cblx0bGV0IHJlZ3VsYXJEcm9wZG93biA9IGQzLnNlbGVjdChcIiNyZWd1bGFyaXphdGlvbnNcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLnJlZ3VsYXJpemF0aW9uID0gcmVndWxhcml6YXRpb25zW3RoaXMudmFsdWVdO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXHRyZWd1bGFyRHJvcGRvd24ucHJvcGVydHkoXCJ2YWx1ZVwiLCBnZXRLZXlGcm9tVmFsdWUocmVndWxhcml6YXRpb25zLCBzdGF0ZS5yZWd1bGFyaXphdGlvbikpO1xuXG5cdGxldCByZWd1bGFyUmF0ZSA9IGQzLnNlbGVjdChcIiNyZWd1bGFyUmF0ZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0c3RhdGUucmVndWxhcml6YXRpb25SYXRlID0gK3RoaXMudmFsdWU7XG5cdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHRcdHJlc2V0KCk7XG5cdH0pO1xuXHRyZWd1bGFyUmF0ZS5wcm9wZXJ0eShcInZhbHVlXCIsIHN0YXRlLnJlZ3VsYXJpemF0aW9uUmF0ZSk7XG5cblx0bGV0IHByb2JsZW0gPSBkMy5zZWxlY3QoXCIjcHJvYmxlbVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0c3RhdGUucHJvYmxlbSA9IHByb2JsZW1zW3RoaXMudmFsdWVdO1xuXHRcdGdlbmVyYXRlRGF0YSgpO1xuXHRcdGRyYXdEYXRhc2V0VGh1bWJuYWlscygpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblx0cHJvYmxlbS5wcm9wZXJ0eShcInZhbHVlXCIsIGdldEtleUZyb21WYWx1ZShwcm9ibGVtcywgc3RhdGUucHJvYmxlbSkpO1xuXG5cdC8vIEFkZCBzY2FsZSB0byB0aGUgZ3JhZGllbnQgY29sb3IgbWFwLlxuXHRsZXQgeCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbLTEsIDFdKS5yYW5nZShbMCwgMTQ0XSk7XG5cdGxldCB4QXhpcyA9IGQzLnN2Zy5heGlzKClcblx0XHQuc2NhbGUoeClcblx0XHQub3JpZW50KFwiYm90dG9tXCIpXG5cdFx0LnRpY2tWYWx1ZXMoWy0xLCAwLCAxXSlcblx0XHQudGlja0Zvcm1hdChkMy5mb3JtYXQoXCJkXCIpKTtcblx0ZDMuc2VsZWN0KFwiI2NvbG9ybWFwIGcuY29yZVwiKS5hcHBlbmQoXCJnXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcInggYXhpc1wiKVxuXHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsMTApXCIpXG5cdFx0LmNhbGwoeEF4aXMpO1xuXG5cdC8vIExpc3RlbiBmb3IgY3NzLXJlc3BvbnNpdmUgY2hhbmdlcyBhbmQgcmVkcmF3IHRoZSBzdmcgbmV0d29yay5cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XG5cdFx0bGV0IG5ld1dpZHRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluLXBhcnRcIilcblx0XHRcdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcblx0XHRpZiAobmV3V2lkdGggIT09IG1haW5XaWR0aCkge1xuXHRcdFx0bWFpbldpZHRoID0gbmV3V2lkdGg7XG5cdFx0XHRkcmF3TmV0d29yayhuZXR3b3JrKTtcblx0XHRcdHVwZGF0ZVVJKHRydWUpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gSGlkZSB0aGUgdGV4dCBiZWxvdyB0aGUgdmlzdWFsaXphdGlvbiBkZXBlbmRpbmcgb24gdGhlIFVSTC5cblx0aWYgKHN0YXRlLmhpZGVUZXh0KSB7XG5cdFx0ZDMuc2VsZWN0KFwiI2FydGljbGUtdGV4dFwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdGQzLnNlbGVjdChcImRpdi5tb3JlXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdFx0ZDMuc2VsZWN0KFwiaGVhZGVyXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQmlhc2VzVUkobmV0d29yazogbm4uTm9kZVtdW10pIHtcblx0bm4uZm9yRWFjaE5vZGUobmV0d29yaywgdHJ1ZSwgbm9kZSA9PiB7XG5cdFx0ZDMuc2VsZWN0KGByZWN0I2JpYXMtJHtub2RlLmlkfWApLnN0eWxlKFwiZmlsbFwiLCBjb2xvclNjYWxlKG5vZGUuYmlhcykpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlV2VpZ2h0c1VJKG5ldHdvcms6IG5uLk5vZGVbXVtdLCBjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+KSB7XG5cdGZvciAobGV0IGxheWVySWR4ID0gMTsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aDsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcblx0XHQvLyBVcGRhdGUgYWxsIHRoZSBub2RlcyBpbiB0aGlzIGxheWVyLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2pdO1xuXHRcdFx0XHRjb250YWluZXIuc2VsZWN0KGAjbGluayR7bGluay5zb3VyY2UuaWR9LSR7bGluay5kZXN0LmlkfWApXG5cdFx0XHRcdFx0LnN0eWxlKFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcInN0cm9rZS1kYXNob2Zmc2V0XCI6IC1pdGVyIC8gMyxcblx0XHRcdFx0XHRcdFx0XCJzdHJva2Utd2lkdGhcIjogbGlua1dpZHRoU2NhbGUoTWF0aC5hYnMobGluay53ZWlnaHQpKSxcblx0XHRcdFx0XHRcdFx0XCJzdHJva2VcIjogY29sb3JTY2FsZShsaW5rLndlaWdodClcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmRhdHVtKGxpbmspO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIENyZWF0aW5nIGxpbmsgYmV0d2VlbiB0d28gbm9kZXMuXG4gKiBAcGFyYW0gc3RhcnROb2RlOiBTdGFydGluZyBub2RlIG9mIGxpbmtcbiAqIEBwYXJhbSBlbmROb2RlOiBFbmQgbm9kZSBvZiBsaW5rXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUxpbmsoc3RhcnROb2RlOiBubi5Ob2RlLCBlbmROb2RlOiBubi5Ob2RlKSB7XG5cdGlmIChzdGFydE5vZGUubGF5ZXIgPj0gZW5kTm9kZS5sYXllcikge1xuXHRcdHJldHVybjtcblx0fVxuXHQvLyBUT0RPOiBGSVggQ0FQQUNJVFkgV0hFTiBBRERJTkcgQU5EIFJFTU9WSU5HIExJTktTXG5cdGxldCBsaW5rID0gbmV3IExpbmsoc3RhcnROb2RlLCBlbmROb2RlLCBzdGF0ZS5yZWd1bGFyaXphdGlvbiwgc3RhdGUuaW5pdFplcm8pO1xuXHRzdGFydE5vZGUub3V0cHV0cy5wdXNoKGxpbmspO1xuXHRlbmROb2RlLmlucHV0TGlua3MucHVzaChsaW5rKTtcblx0ZHJhd05ldHdvcmsobmV0d29yayk7XG5cdHVwZGF0ZVVJKCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdOb2RlKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIG5vZGVJZDogc3RyaW5nLCBpc0lucHV0OiBib29sZWFuLCBjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+LCBub2RlPzogbm4uTm9kZSkge1xuXHRsZXQgeCA9IGN4IC0gUkVDVF9TSVpFIC8gMjtcblx0bGV0IHkgPSBjeSAtIFJFQ1RfU0laRSAvIDI7XG5cblx0bGV0IG5vZGVHcm91cCA9IGNvbnRhaW5lci5hcHBlbmQoXCJnXCIpLmF0dHIoXG5cdFx0e1xuXHRcdFx0XCJjbGFzc1wiOiBcIm5vZGVcIixcblx0XHRcdFwiaWRcIjogYG5vZGUke25vZGVJZH1gLFxuXHRcdFx0XCJ0cmFuc2Zvcm1cIjogYHRyYW5zbGF0ZSgke3h9LCR7eX0pYFxuXHRcdH0pO1xuXG5cdC8vIERyYXcgdGhlIG1haW4gcmVjdGFuZ2xlLlxuXHRub2RlR3JvdXAuYXBwZW5kKFwicmVjdFwiKS5hdHRyKFxuXHRcdHtcblx0XHRcdHg6IDAsXG5cdFx0XHR5OiAwLFxuXHRcdFx0d2lkdGg6IFJFQ1RfU0laRSxcblx0XHRcdGhlaWdodDogUkVDVF9TSVpFLFxuXHRcdH0pO1xuXG5cdGxldCBhY3RpdmVPck5vdENsYXNzID0gc3RhdGVbbm9kZUlkXSA/IFwiYWN0aXZlXCIgOiBcImluYWN0aXZlXCI7XG5cdGlmIChpc0lucHV0KSB7XG5cdFx0bGV0IGxhYmVsID0gSU5QVVRTW25vZGVJZF0ubGFiZWwgIT0gbnVsbCA/IElOUFVUU1tub2RlSWRdLmxhYmVsIDogbm9kZUlkO1xuXHRcdC8vIERyYXcgdGhlIGlucHV0IGxhYmVsLlxuXHRcdGxldCB0ZXh0ID0gbm9kZUdyb3VwLmFwcGVuZChcInRleHRcIikuYXR0cihcblx0XHRcdHtcblx0XHRcdFx0Y2xhc3M6IFwibWFpbi1sYWJlbFwiLFxuXHRcdFx0XHR4OiAtMTAsXG5cdFx0XHRcdHk6IFJFQ1RfU0laRSAvIDIsIFwidGV4dC1hbmNob3JcIjogXCJlbmRcIlxuXHRcdFx0fSk7XG5cdFx0aWYgKC9bX15dLy50ZXN0KGxhYmVsKSkge1xuXHRcdFx0bGV0IG15UmUgPSAvKC4qPykoW19eXSkoLikvZztcblx0XHRcdGxldCBteUFycmF5O1xuXHRcdFx0bGV0IGxhc3RJbmRleDtcblx0XHRcdHdoaWxlICgobXlBcnJheSA9IG15UmUuZXhlYyhsYWJlbCkpICE9IG51bGwpIHtcblx0XHRcdFx0bGFzdEluZGV4ID0gbXlSZS5sYXN0SW5kZXg7XG5cdFx0XHRcdGxldCBwcmVmaXggPSBteUFycmF5WzFdO1xuXHRcdFx0XHRsZXQgc2VwID0gbXlBcnJheVsyXTtcblx0XHRcdFx0bGV0IHN1ZmZpeCA9IG15QXJyYXlbM107XG5cdFx0XHRcdGlmIChwcmVmaXgpIHtcblx0XHRcdFx0XHR0ZXh0LmFwcGVuZChcInRzcGFuXCIpLnRleHQocHJlZml4KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0ZXh0LmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJiYXNlbGluZS1zaGlmdFwiLCBzZXAgPT09IFwiX1wiID8gXCJzdWJcIiA6IFwic3VwZXJcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJmb250LXNpemVcIiwgXCI5cHhcIilcblx0XHRcdFx0XHQudGV4dChzdWZmaXgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxhYmVsLnN1YnN0cmluZyhsYXN0SW5kZXgpKSB7XG5cdFx0XHRcdHRleHQuYXBwZW5kKFwidHNwYW5cIikudGV4dChsYWJlbC5zdWJzdHJpbmcobGFzdEluZGV4KSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRleHQuYXBwZW5kKFwidHNwYW5cIikudGV4dChsYWJlbCk7XG5cdFx0fVxuXHRcdG5vZGVHcm91cC5jbGFzc2VkKGFjdGl2ZU9yTm90Q2xhc3MsIHRydWUpO1xuXHR9XG5cdGlmICghaXNJbnB1dCkge1xuXHRcdC8vIERyYXcgdGhlIG5vZGUncyBiaWFzLlxuXHRcdG5vZGVHcm91cC5hcHBlbmQoXCJyZWN0XCIpLmF0dHIoXG5cdFx0XHR7XG5cdFx0XHRcdGlkOiBgYmlhcy0ke25vZGVJZH1gLFxuXHRcdFx0XHR4OiAtQklBU19TSVpFIC0gMixcblx0XHRcdFx0eTogUkVDVF9TSVpFIC0gQklBU19TSVpFICsgMyxcblx0XHRcdFx0d2lkdGg6IEJJQVNfU0laRSxcblx0XHRcdFx0aGVpZ2h0OiBCSUFTX1NJWkUsXG5cdFx0XHR9KVxuXHRcdFx0Lm9uKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHVwZGF0ZUhvdmVyQ2FyZChIb3ZlclR5cGUuQklBUywgbm9kZSwgZDMubW91c2UoY29udGFpbmVyLm5vZGUoKSkpO1xuXHRcdFx0fSlcblx0XHRcdC5vbihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR1cGRhdGVIb3ZlckNhcmQobnVsbCk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8vIERyYXcgdGhlIG5vZGUncyBjYW52YXMuXG5cdGxldCBkaXYgPSBkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5pbnNlcnQoXCJkaXZcIiwgXCI6Zmlyc3QtY2hpbGRcIikuYXR0cihcblx0XHR7XG5cdFx0XHRcImlkXCI6IGBjYW52YXMtJHtub2RlSWR9YCxcblx0XHRcdFwiY2xhc3NcIjogXCJjYW52YXNcIlxuXHRcdH0pXG5cdFx0LnN0eWxlKFxuXHRcdFx0e1xuXHRcdFx0XHRwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuXHRcdFx0XHRsZWZ0OiBgJHt4ICsgM31weGAsXG5cdFx0XHRcdHRvcDogYCR7eSArIDN9cHhgXG5cdFx0XHR9KVxuXHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChzdGF0ZS5zaGlmdERvd24pIHtcblx0XHRcdFx0aWYgKG1hcmtlZE5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGRpdi5zdHlsZSh7XG5cdFx0XHRcdFx0XHRcImJvcmRlci1zdHlsZVwiOiBcInNvbGlkXCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci1yYWRpdXNcIjogXCI1cHhcIixcblx0XHRcdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IFwicmVkXCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci13aWR0aFwiOiBcIjJweFwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0bWFya2VkTm9kZSA9IG5vZGU7XG5cdFx0XHRcdFx0bWFya2VkRGl2ID0gZGl2O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1hcmtlZERpdi5zdHlsZSh7XG5cdFx0XHRcdFx0XHRcImJvcmRlci13aWR0aFwiOiBcIjBweFwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y3JlYXRlTGluayhtYXJrZWROb2RlLCBub2RlKTtcblx0XHRcdFx0XHRtYXJrZWROb2RlID0gbnVsbDtcblx0XHRcdFx0XHRtYXJrZWREaXYgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGVjdGVkTm9kZUlkID0gbm9kZUlkO1xuXHRcdFx0ZGl2LmNsYXNzZWQoXCJob3ZlcmVkXCIsIHRydWUpO1xuXHRcdFx0bm9kZUdyb3VwLmNsYXNzZWQoXCJob3ZlcmVkXCIsIHRydWUpO1xuXHRcdFx0dXBkYXRlRGVjaXNpb25Cb3VuZGFyeShuZXR3b3JrLCBmYWxzZSk7XG5cdFx0XHRoZWF0TWFwLnVwZGF0ZUJhY2tncm91bmQoYm91bmRhcnlbbm9kZUlkXSwgc3RhdGUuZGlzY3JldGl6ZSk7XG5cdFx0fSlcblx0XHQub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGVjdGVkTm9kZUlkID0gbnVsbDtcblx0XHRcdGRpdi5jbGFzc2VkKFwiaG92ZXJlZFwiLCBmYWxzZSk7XG5cdFx0XHRub2RlR3JvdXAuY2xhc3NlZChcImhvdmVyZWRcIiwgZmFsc2UpO1xuXHRcdFx0dXBkYXRlRGVjaXNpb25Cb3VuZGFyeShuZXR3b3JrLCBmYWxzZSk7XG5cdFx0XHRoZWF0TWFwLnVwZGF0ZUJhY2tncm91bmQoYm91bmRhcnlbbm4uZ2V0T3V0cHV0Tm9kZShuZXR3b3JrKS5pZF0sIHN0YXRlLmRpc2NyZXRpemUpO1xuXHRcdH0pO1xuXHRpZiAoaXNJbnB1dCkge1xuXHRcdGRpdi5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICghc3RhdGUuc2hpZnREb3duKSB7XG5cdFx0XHRcdHN0YXRlW25vZGVJZF0gPSAhc3RhdGVbbm9kZUlkXTtcblx0XHRcdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRyZXNldCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKG1hcmtlZE5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGRpdi5zdHlsZSh7XG5cdFx0XHRcdFx0XHRcImJvcmRlci1zdHlsZVwiOiBcInNvbGlkXCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci1yYWRpdXNcIjogXCI1cHhcIixcblx0XHRcdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IFwicmVkXCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci13aWR0aFwiOiBcIjJweFwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cobm9kZSwgZGl2KTtcblx0XHRcdFx0XHRtYXJrZWROb2RlID0gbm9kZTtcblx0XHRcdFx0XHRtYXJrZWREaXYgPSBkaXY7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0XHRkaXYuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpO1xuXHR9XG5cdGlmIChpc0lucHV0KSB7XG5cdFx0ZGl2LmNsYXNzZWQoYWN0aXZlT3JOb3RDbGFzcywgdHJ1ZSk7XG5cdH1cblx0bGV0IG5vZGVIZWF0TWFwID0gbmV3IEhlYXRNYXAoUkVDVF9TSVpFLCBERU5TSVRZIC8gMTAsIHhEb21haW4sIHhEb21haW4sIGRpdiwge25vU3ZnOiB0cnVlfSk7XG5cdGRpdi5kYXR1bSh7aGVhdG1hcDogbm9kZUhlYXRNYXAsIGlkOiBub2RlSWR9KTtcbn1cblxuLy8gRHJhdyBuZXR3b3JrXG5mdW5jdGlvbiBkcmF3TmV0d29yayhuZXR3b3JrOiBubi5Ob2RlW11bXSk6IHZvaWQge1xuXHRsZXQgc3ZnID0gZDMuc2VsZWN0KFwiI3N2Z1wiKTtcblx0Ly8gUmVtb3ZlIGFsbCBzdmcgZWxlbWVudHMuXG5cdHN2Zy5zZWxlY3QoXCJnLmNvcmVcIikucmVtb3ZlKCk7XG5cdC8vIFJlbW92ZSBhbGwgZGl2IGVsZW1lbnRzLlxuXHRkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5zZWxlY3RBbGwoXCJkaXYuY2FudmFzXCIpLnJlbW92ZSgpO1xuXHRkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5zZWxlY3RBbGwoXCJkaXYucGx1cy1taW51cy1uZXVyb25zXCIpLnJlbW92ZSgpO1xuXG5cdC8vIEdldCB0aGUgd2lkdGggb2YgdGhlIHN2ZyBjb250YWluZXIuXG5cdGxldCBwYWRkaW5nID0gMztcblx0bGV0IGNvID0gZDMuc2VsZWN0KFwiLmNvbHVtbi5vdXRwdXRcIikubm9kZSgpIGFzIEhUTUxEaXZFbGVtZW50O1xuXHRsZXQgY2YgPSBkMy5zZWxlY3QoXCIuY29sdW1uLmZlYXR1cmVzXCIpLm5vZGUoKSBhcyBIVE1MRGl2RWxlbWVudDtcblx0bGV0IHdpZHRoID0gY28ub2Zmc2V0TGVmdCAtIGNmLm9mZnNldExlZnQ7XG5cdHN2Zy5hdHRyKFwid2lkdGhcIiwgd2lkdGgpO1xuXG5cdC8vIE1hcCBvZiBhbGwgbm9kZSBjb29yZGluYXRlcy5cblx0bGV0IG5vZGUyY29vcmQ6IHsgW2lkOiBzdHJpbmddOiB7IGN4OiBudW1iZXIsIGN5OiBudW1iZXIgfSB9ID0ge307XG5cdGxldCBjb250YWluZXIgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdC5jbGFzc2VkKFwiY29yZVwiLCB0cnVlKVxuXHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHtwYWRkaW5nfSwke3BhZGRpbmd9KWApO1xuXHQvLyBEcmF3IHRoZSBuZXR3b3JrIGxheWVyIGJ5IGxheWVyLlxuXHRsZXQgbnVtTGF5ZXJzID0gbmV0d29yay5sZW5ndGg7XG5cdGxldCBmZWF0dXJlV2lkdGggPSAxMTg7XG5cdGxldCBsYXllclNjYWxlID0gZDMuc2NhbGUub3JkaW5hbDxudW1iZXIsIG51bWJlcj4oKVxuXHRcdC5kb21haW4oZDMucmFuZ2UoMSwgbnVtTGF5ZXJzIC0gMSkpXG5cdFx0LnJhbmdlUG9pbnRzKFtmZWF0dXJlV2lkdGgsIHdpZHRoIC0gUkVDVF9TSVpFXSwgMC43KTtcblx0bGV0IG5vZGVJbmRleFNjYWxlID0gKG5vZGVJbmRleDogbnVtYmVyKSA9PiBub2RlSW5kZXggKiAoUkVDVF9TSVpFICsgMjUpO1xuXG5cblx0bGV0IGNhbGxvdXRUaHVtYiA9IGQzLnNlbGVjdChcIi5jYWxsb3V0LnRodW1ibmFpbFwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRsZXQgY2FsbG91dFdlaWdodHMgPSBkMy5zZWxlY3QoXCIuY2FsbG91dC53ZWlnaHRzXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdGxldCBpZFdpdGhDYWxsb3V0ID0gbnVsbDtcblx0bGV0IHRhcmdldElkV2l0aENhbGxvdXQgPSBudWxsO1xuXG5cdC8vIERyYXcgdGhlIGlucHV0IGxheWVyIHNlcGFyYXRlbHkuXG5cdGxldCBjeCA9IFJFQ1RfU0laRSAvIDIgKyA1MDtcblx0bGV0IG5vZGVJZHMgPSBPYmplY3Qua2V5cyhJTlBVVFMpO1xuXHRsZXQgbWF4WSA9IG5vZGVJbmRleFNjYWxlKG5vZGVJZHMubGVuZ3RoKTtcblx0bGV0IGFjdGl2ZU5vZGVJbmRpY2VzID0gbmV0d29ya1swXS5yZWR1Y2UoKG9iaiwgbm9kZSwgaSkgPT4ge1xuXHRcdG9ialtub2RlLmlkXSA9IGk7XG5cdFx0cmV0dXJuIG9iajtcblx0fSwge30pO1xuXHRub2RlSWRzLmZvckVhY2goKG5vZGVJZCwgaSkgPT4ge1xuXHRcdGxldCBub2RlSWR4ID0gYWN0aXZlTm9kZUluZGljZXNbbm9kZUlkXTtcblx0XHRsZXQgbm9kZSA9IG5ldHdvcmtbMF1bbm9kZUlkeF07XG5cdFx0bGV0IGN5ID0gbm9kZUluZGV4U2NhbGUoaSkgKyBSRUNUX1NJWkUgLyAyO1xuXHRcdG5vZGUyY29vcmRbbm9kZUlkXSA9IHtjeCwgY3l9O1xuXHRcdGRyYXdOb2RlKGN4LCBjeSwgbm9kZUlkLCB0cnVlLCBjb250YWluZXIsIG5vZGUpO1xuXHR9KTtcblxuXHQvLyBEcmF3IHRoZSBpbnRlcm1lZGlhdGUgbGF5ZXJzLlxuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbnVtTGF5ZXJzIC0gMTsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBudW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHhdLmxlbmd0aDtcblx0XHRsZXQgY3ggPSBsYXllclNjYWxlKGxheWVySWR4KSArIFJFQ1RfU0laRSAvIDI7XG5cdFx0bWF4WSA9IE1hdGgubWF4KG1heFksIG5vZGVJbmRleFNjYWxlKG51bU5vZGVzKSk7XG5cdFx0YWRkUGx1c01pbnVzQ29udHJvbChsYXllclNjYWxlKGxheWVySWR4KSwgbGF5ZXJJZHgpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtTm9kZXM7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBuZXR3b3JrW2xheWVySWR4XVtpXTtcblx0XHRcdGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKGkpICsgUkVDVF9TSVpFIC8gMjtcblx0XHRcdG5vZGUyY29vcmRbbm9kZS5pZF0gPSB7Y3gsIGN5fTtcblx0XHRcdGRyYXdOb2RlKGN4LCBjeSwgbm9kZS5pZCwgZmFsc2UsIGNvbnRhaW5lciwgbm9kZSk7XG5cblx0XHRcdC8vIFNob3cgY2FsbG91dCB0byB0aHVtYm5haWxzLlxuXHRcdFx0bGV0IG51bU5vZGVzID0gbmV0d29ya1tsYXllcklkeF0ubGVuZ3RoO1xuXHRcdFx0bGV0IG5leHROdW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHggKyAxXS5sZW5ndGg7XG5cdFx0XHRpZiAoaWRXaXRoQ2FsbG91dCA9PSBudWxsICYmXG5cdFx0XHRcdGkgPT09IG51bU5vZGVzIC0gMSAmJlxuXHRcdFx0XHRuZXh0TnVtTm9kZXMgPD0gbnVtTm9kZXMpIHtcblx0XHRcdFx0Y2FsbG91dFRodW1iLnN0eWxlKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IG51bGwsXG5cdFx0XHRcdFx0XHR0b3A6IGAkezIwICsgMyArIGN5fXB4YCxcblx0XHRcdFx0XHRcdGxlZnQ6IGAke2N4fXB4YFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRpZFdpdGhDYWxsb3V0ID0gbm9kZS5pZDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRHJhdyBsaW5rcy5cblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2pdO1xuXHRcdFx0XHRsZXQgcGF0aDogU1ZHUGF0aEVsZW1lbnQgPSBkcmF3TGluayhsaW5rLCBub2RlMmNvb3JkLCBuZXR3b3JrLFxuXHRcdFx0XHRcdGNvbnRhaW5lciwgaiA9PT0gMCwgaiwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aCkubm9kZSgpIGFzIGFueTtcblx0XHRcdFx0Ly8gU2hvdyBjYWxsb3V0IHRvIHdlaWdodHMuXG5cdFx0XHRcdGxldCBwcmV2TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4IC0gMV07XG5cdFx0XHRcdGxldCBsYXN0Tm9kZVByZXZMYXllciA9IHByZXZMYXllcltwcmV2TGF5ZXIubGVuZ3RoIC0gMV07XG5cdFx0XHRcdGlmICh0YXJnZXRJZFdpdGhDYWxsb3V0ID09IG51bGwgJiZcblx0XHRcdFx0XHRpID09PSBudW1Ob2RlcyAtIDEgJiZcblx0XHRcdFx0XHRsaW5rLnNvdXJjZS5pZCA9PT0gbGFzdE5vZGVQcmV2TGF5ZXIuaWQgJiZcblx0XHRcdFx0XHQobGluay5zb3VyY2UuaWQgIT09IGlkV2l0aENhbGxvdXQgfHwgbnVtTGF5ZXJzIDw9IDUpICYmXG5cdFx0XHRcdFx0bGluay5kZXN0LmlkICE9PSBpZFdpdGhDYWxsb3V0ICYmXG5cdFx0XHRcdFx0cHJldkxheWVyLmxlbmd0aCA+PSBudW1Ob2Rlcykge1xuXHRcdFx0XHRcdGxldCBtaWRQb2ludCA9IHBhdGguZ2V0UG9pbnRBdExlbmd0aChwYXRoLmdldFRvdGFsTGVuZ3RoKCkgKiAwLjcpO1xuXHRcdFx0XHRcdGNhbGxvdXRXZWlnaHRzLnN0eWxlKFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBudWxsLFxuXHRcdFx0XHRcdFx0XHR0b3A6IGAke21pZFBvaW50LnkgKyA1fXB4YCxcblx0XHRcdFx0XHRcdFx0bGVmdDogYCR7bWlkUG9pbnQueCArIDN9cHhgXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0YXJnZXRJZFdpdGhDYWxsb3V0ID0gbGluay5kZXN0LmlkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gRHJhdyB0aGUgb3V0cHV0IG5vZGUgc2VwYXJhdGVseS5cblx0Y3ggPSB3aWR0aCArIFJFQ1RfU0laRSAvIDI7XG5cdGxldCBub2RlID0gbmV0d29ya1tudW1MYXllcnMgLSAxXVswXTtcblx0bGV0IGN5ID0gbm9kZUluZGV4U2NhbGUoMCkgKyBSRUNUX1NJWkUgLyAyO1xuXHRub2RlMmNvb3JkW25vZGUuaWRdID0ge2N4LCBjeX07XG5cdC8vIERyYXcgbGlua3MuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IGxpbmsgPSBub2RlLmlucHV0TGlua3NbaV07XG5cdFx0ZHJhd0xpbmsobGluaywgbm9kZTJjb29yZCwgbmV0d29yaywgY29udGFpbmVyLCBpID09PSAwLCBpLFxuXHRcdFx0bm9kZS5pbnB1dExpbmtzLmxlbmd0aCk7XG5cdH1cblx0Ly8gQWRqdXN0IHRoZSBoZWlnaHQgb2YgdGhlIHN2Zy5cblx0c3ZnLmF0dHIoXCJoZWlnaHRcIiwgbWF4WSk7XG5cblx0Ly8gQWRqdXN0IHRoZSBoZWlnaHQgb2YgdGhlIGZlYXR1cmVzIGNvbHVtbi5cblx0bGV0IGhlaWdodCA9IE1hdGgubWF4KFxuXHRcdGdldFJlbGF0aXZlSGVpZ2h0KGNhbGxvdXRUaHVtYiksXG5cdFx0Z2V0UmVsYXRpdmVIZWlnaHQoY2FsbG91dFdlaWdodHMpLFxuXHRcdGdldFJlbGF0aXZlSGVpZ2h0KGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpKVxuXHQpO1xuXHRkMy5zZWxlY3QoXCIuY29sdW1uLmZlYXR1cmVzXCIpLnN0eWxlKFwiaGVpZ2h0XCIsIGhlaWdodCArIFwicHhcIik7XG59XG5cbmZ1bmN0aW9uIGdldFJlbGF0aXZlSGVpZ2h0KHNlbGVjdGlvbjogZDMuU2VsZWN0aW9uPGFueT4pIHtcblx0bGV0IG5vZGUgPSBzZWxlY3Rpb24ubm9kZSgpIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuXHRyZXR1cm4gbm9kZS5vZmZzZXRIZWlnaHQgKyBub2RlLm9mZnNldFRvcDtcbn1cblxuZnVuY3Rpb24gYWRkUGx1c01pbnVzQ29udHJvbCh4OiBudW1iZXIsIGxheWVySWR4OiBudW1iZXIpIHtcblx0bGV0IGRpdiA9IGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLmFwcGVuZChcImRpdlwiKVxuXHRcdC5jbGFzc2VkKFwicGx1cy1taW51cy1uZXVyb25zXCIsIHRydWUpXG5cdFx0LnN0eWxlKFwibGVmdFwiLCBgJHt4IC0gMTB9cHhgKTtcblxuXHRsZXQgaSA9IGxheWVySWR4IC0gMTtcblx0bGV0IGZpcnN0Um93ID0gZGl2LmFwcGVuZChcImRpdlwiKS5hdHRyKFwiY2xhc3NcIiwgYHVpLW51bU5vZGVzJHtsYXllcklkeH1gKTtcblx0Zmlyc3RSb3cuYXBwZW5kKFwiYnV0dG9uXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcIm1kbC1idXR0b24gbWRsLWpzLWJ1dHRvbiBtZGwtYnV0dG9uLS1pY29uXCIpXG5cdFx0Lm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0bGV0IG51bU5ldXJvbnMgPSBzdGF0ZS5uZXR3b3JrU2hhcGVbaV07XG5cdFx0XHRpZiAobnVtTmV1cm9ucyA+PSBNQVhfTkVVUk9OUykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRzdGF0ZS5uZXR3b3JrU2hhcGVbaV0rKztcblx0XHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdHJlc2V0KCk7XG5cdFx0fSlcblx0XHQuYXBwZW5kKFwiaVwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtYXRlcmlhbC1pY29uc1wiKVxuXHRcdC50ZXh0KFwiYWRkXCIpO1xuXG5cdGZpcnN0Um93LmFwcGVuZChcImJ1dHRvblwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtZGwtYnV0dG9uIG1kbC1qcy1idXR0b24gbWRsLWJ1dHRvbi0taWNvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGxldCBudW1OZXVyb25zID0gc3RhdGUubmV0d29ya1NoYXBlW2ldO1xuXHRcdFx0aWYgKG51bU5ldXJvbnMgPD0gMSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRzdGF0ZS5uZXR3b3JrU2hhcGVbaV0tLTtcblx0XHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdHJlc2V0KCk7XG5cdFx0fSlcblx0XHQuYXBwZW5kKFwiaVwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtYXRlcmlhbC1pY29uc1wiKVxuXHRcdC50ZXh0KFwicmVtb3ZlXCIpO1xuXG5cdGxldCBzdWZmaXggPSBzdGF0ZS5uZXR3b3JrU2hhcGVbaV0gPiAxID8gXCJzXCIgOiBcIlwiO1xuXHRkaXYuYXBwZW5kKFwiZGl2XCIpLnRleHQoc3RhdGUubmV0d29ya1NoYXBlW2ldICsgXCIgbmV1cm9uXCIgKyBzdWZmaXgpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3ZlckNhcmQodHlwZTogSG92ZXJUeXBlLCBub2RlT3JMaW5rPzogbm4uTm9kZSB8IG5uLkxpbmssIGNvb3JkaW5hdGVzPzogW251bWJlciwgbnVtYmVyXSkge1xuXHRsZXQgaG92ZXJjYXJkID0gZDMuc2VsZWN0KFwiI2hvdmVyY2FyZFwiKTtcblx0aWYgKHR5cGUgPT0gbnVsbCkge1xuXHRcdGhvdmVyY2FyZC5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdGQzLnNlbGVjdChcIiNzdmdcIikub24oXCJjbGlja1wiLCBudWxsKTtcblx0XHRyZXR1cm47XG5cdH1cblx0ZDMuc2VsZWN0KFwiI3N2Z1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRob3ZlcmNhcmQuc2VsZWN0KFwiLnZhbHVlXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdFx0bGV0IGlucHV0ID0gaG92ZXJjYXJkLnNlbGVjdChcImlucHV0XCIpO1xuXHRcdGlucHV0LnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKTtcblx0XHRpbnB1dC5vbihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0aGlzLnZhbHVlICE9IG51bGwgJiYgdGhpcy52YWx1ZSAhPT0gXCJcIikge1xuXHRcdFx0XHRpZiAodHlwZSA9PT0gSG92ZXJUeXBlLldFSUdIVCkge1xuXHRcdFx0XHRcdChub2RlT3JMaW5rIGFzIG5uLkxpbmspLndlaWdodCA9ICt0aGlzLnZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdChub2RlT3JMaW5rIGFzIG5uLk5vZGUpLmJpYXMgPSArdGhpcy52YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR1cGRhdGVVSSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGlucHV0Lm9uKFwia2V5cHJlc3NcIiwgKCkgPT4ge1xuXHRcdFx0aWYgKChkMy5ldmVudCBhcyBhbnkpLmtleUNvZGUgPT09IDEzKSB7XG5cdFx0XHRcdHVwZGF0ZUhvdmVyQ2FyZCh0eXBlLCBub2RlT3JMaW5rLCBjb29yZGluYXRlcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0KGlucHV0Lm5vZGUoKSBhcyBIVE1MSW5wdXRFbGVtZW50KS5mb2N1cygpO1xuXHR9KTtcblx0bGV0IHZhbHVlID0gKHR5cGUgPT09IEhvdmVyVHlwZS5XRUlHSFQpID9cblx0XHQobm9kZU9yTGluayBhcyBubi5MaW5rKS53ZWlnaHQgOlxuXHRcdChub2RlT3JMaW5rIGFzIG5uLk5vZGUpLmJpYXM7XG5cdGxldCBuYW1lID0gKHR5cGUgPT09IEhvdmVyVHlwZS5XRUlHSFQpID8gXCJXZWlnaHRcIiA6IFwiQmlhc1wiO1xuXHRob3ZlcmNhcmQuc3R5bGUoXG5cdFx0e1xuXHRcdFx0XCJsZWZ0XCI6IGAke2Nvb3JkaW5hdGVzWzBdICsgMjB9cHhgLFxuXHRcdFx0XCJ0b3BcIjogYCR7Y29vcmRpbmF0ZXNbMV19cHhgLFxuXHRcdFx0XCJkaXNwbGF5XCI6IFwiYmxvY2tcIlxuXHRcdH0pO1xuXHRob3ZlcmNhcmQuc2VsZWN0KFwiLnR5cGVcIikudGV4dChuYW1lKTtcblx0aG92ZXJjYXJkLnNlbGVjdChcIi52YWx1ZVwiKVxuXHRcdC5zdHlsZShcImRpc3BsYXlcIiwgbnVsbClcblx0XHQudGV4dCh2YWx1ZS50b1ByZWNpc2lvbigyKSk7XG5cdGhvdmVyY2FyZC5zZWxlY3QoXCJpbnB1dFwiKVxuXHRcdC5wcm9wZXJ0eShcInZhbHVlXCIsIHZhbHVlLnRvUHJlY2lzaW9uKDIpKVxuXHRcdC5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xufVxuXG5mdW5jdGlvbiBkcmF3TGluayhcblx0aW5wdXQ6IG5uLkxpbmssIG5vZGUyY29vcmQ6IHsgW2lkOiBzdHJpbmddOiB7IGN4OiBudW1iZXIsIGN5OiBudW1iZXIgfSB9LFxuXHRuZXR3b3JrOiBubi5Ob2RlW11bXSwgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55Pixcblx0aXNGaXJzdDogYm9vbGVhbiwgaW5kZXg6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpIHtcblx0bGV0IGxpbmUgPSBjb250YWluZXIuaW5zZXJ0KFwicGF0aFwiLCBcIjpmaXJzdC1jaGlsZFwiKTtcblx0bGV0IHNvdXJjZSA9IG5vZGUyY29vcmRbaW5wdXQuc291cmNlLmlkXTtcblx0bGV0IGRlc3QgPSBub2RlMmNvb3JkW2lucHV0LmRlc3QuaWRdO1xuXHRsZXQgZGF0dW0gPSB7XG5cdFx0c291cmNlOlxuXHRcdFx0e1xuXHRcdFx0XHR5OiBzb3VyY2UuY3ggKyBSRUNUX1NJWkUgLyAyICsgMixcblx0XHRcdFx0eDogc291cmNlLmN5XG5cdFx0XHR9LFxuXHRcdHRhcmdldDpcblx0XHRcdHtcblx0XHRcdFx0eTogZGVzdC5jeCAtIFJFQ1RfU0laRSAvIDIsXG5cdFx0XHRcdHg6IGRlc3QuY3kgKyAoKGluZGV4IC0gKGxlbmd0aCAtIDEpIC8gMikgLyBsZW5ndGgpICogMTJcblx0XHRcdH1cblx0fTtcblx0bGV0IGRpYWdvbmFsID0gZDMuc3ZnLmRpYWdvbmFsKCkucHJvamVjdGlvbihkID0+IFtkLnksIGQueF0pO1xuXHRsaW5lLmF0dHIoXG5cdFx0e1xuXHRcdFx0XCJtYXJrZXItc3RhcnRcIjogXCJ1cmwoI21hcmtlckFycm93KVwiLFxuXHRcdFx0Y2xhc3M6IFwibGlua1wiLFxuXHRcdFx0aWQ6IFwibGlua1wiICsgaW5wdXQuc291cmNlLmlkICsgXCItXCIgKyBpbnB1dC5kZXN0LmlkLFxuXHRcdFx0ZDogZGlhZ29uYWwoZGF0dW0sIDApXG5cdFx0fSk7XG5cblx0Ly8gQWRkIGFuIGludmlzaWJsZSB0aGljayBsaW5rIHRoYXQgd2lsbCBiZSB1c2VkIGZvclxuXHQvLyBzaG93aW5nIHRoZSB3ZWlnaHQgdmFsdWUgb24gaG92ZXIuXG5cdGNvbnRhaW5lci5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0LmF0dHIoXCJkXCIsIGRpYWdvbmFsKGRhdHVtLCAwKSlcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibGluay1ob3ZlclwiKVxuXHRcdC5vbihcImRibGNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGRlYWN0aXZhdGVBY3RpdmF0ZUxpbmsoaW5wdXQsIGQzLm1vdXNlKHRoaXMpKTtcblx0XHR9KVxuXHRcdC5vbihcIm1vdXNlZW50ZXJcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0dXBkYXRlSG92ZXJDYXJkKEhvdmVyVHlwZS5XRUlHSFQsIGlucHV0LCBkMy5tb3VzZSh0aGlzKSk7XG5cdFx0fSlcblx0XHQub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHVwZGF0ZUhvdmVyQ2FyZChudWxsKTtcblx0XHR9KTtcblx0cmV0dXJuIGxpbmU7XG59XG5cbi8qKlxuICogR2l2ZW4gYSBsaW5rLCByZWFjdGl2YXRlcyBpdCBpZiBkZWFkIG9yIHNldHMgaXQncyB3ZWlnaHQgdG8gemVybyBhbmQga2lsbHMgaXRcbiAqIEBwYXJhbSBsaW5rOiBBIGxpbmsgaW4gYSBuZXVyYWwgbmV0d29ya1xuICogQHBhcmFtIGNvb3JkaW5hdGVzOiBNb3VzZSBjb29yZGluYXRlc1xuICovXG5mdW5jdGlvbiBkZWFjdGl2YXRlQWN0aXZhdGVMaW5rKGxpbms6IG5uLkxpbmssIGNvb3JkaW5hdGVzPzogW251bWJlciwgbnVtYmVyXSkge1xuXHRpZiAobGluay5pc0RlYWQpIHtcblx0XHRsaW5rLndlaWdodCA9IDE7XG5cdFx0bGluay5pc0RlYWQgPSBmYWxzZTtcblx0XHR1cGRhdGVIb3ZlckNhcmQoSG92ZXJUeXBlLldFSUdIVCwgbGluaywgY29vcmRpbmF0ZXMpO1xuXHRcdHVwZGF0ZVVJKCk7XG5cdH0gZWxzZSB7XG5cdFx0bGluay53ZWlnaHQgPSAwO1xuXHRcdGxpbmsuaXNEZWFkID0gdHJ1ZTtcblx0XHR1cGRhdGVIb3ZlckNhcmQoSG92ZXJUeXBlLldFSUdIVCwgbGluaywgY29vcmRpbmF0ZXMpO1xuXHRcdHRvdGFsQ2FwYWNpdHkgPSBnZXRUb3RhbENhcGFjaXR5KG5ldHdvcmspO1xuXHRcdHVwZGF0ZVVJKCk7XG5cdH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhIG5ldXJhbCBuZXR3b3JrLCBpdCBhc2tzIHRoZSBuZXR3b3JrIGZvciB0aGUgb3V0cHV0IChwcmVkaWN0aW9uKVxuICogb2YgZXZlcnkgbm9kZSBpbiB0aGUgbmV0d29yayB1c2luZyBpbnB1dHMgc2FtcGxlZCBvbiBhIHNxdWFyZSBncmlkLlxuICogSXQgcmV0dXJucyBhIG1hcCB3aGVyZSBlYWNoIGtleSBpcyB0aGUgbm9kZSBJRCBhbmQgdGhlIHZhbHVlIGlzIGEgc3F1YXJlXG4gKiBtYXRyaXggb2YgdGhlIG91dHB1dHMgb2YgdGhlIG5ldHdvcmsgZm9yIGVhY2ggaW5wdXQgaW4gdGhlIGdyaWQgcmVzcGVjdGl2ZWx5LlxuICovXG5cbmZ1bmN0aW9uIHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yazogbm4uTm9kZVtdW10sIGZpcnN0VGltZTogYm9vbGVhbikge1xuXHRpZiAoZmlyc3RUaW1lKSB7XG5cdFx0Ym91bmRhcnkgPSB7fTtcblx0XHRubi5mb3JFYWNoTm9kZShuZXR3b3JrLCB0cnVlLCBub2RlID0+IHtcblx0XHRcdGJvdW5kYXJ5W25vZGUuaWRdID0gbmV3IEFycmF5KERFTlNJVFkpO1xuXHRcdH0pO1xuXHRcdC8vIEdvIHRocm91Z2ggYWxsIHByZWRlZmluZWQgaW5wdXRzLlxuXHRcdGZvciAobGV0IG5vZGVJZCBpbiBJTlBVVFMpIHtcblx0XHRcdGJvdW5kYXJ5W25vZGVJZF0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XG5cdFx0fVxuXHR9XG5cdGxldCB4U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIERFTlNJVFkgLSAxXSkucmFuZ2UoeERvbWFpbik7XG5cdGxldCB5U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW0RFTlNJVFkgLSAxLCAwXSkucmFuZ2UoeERvbWFpbik7XG5cblx0bGV0IGkgPSAwLCBqID0gMDtcblx0Zm9yIChpID0gMDsgaSA8IERFTlNJVFk7IGkrKykge1xuXHRcdGlmIChmaXJzdFRpbWUpIHtcblx0XHRcdG5uLmZvckVhY2hOb2RlKG5ldHdvcmssIHRydWUsIG5vZGUgPT4ge1xuXHRcdFx0XHRib3VuZGFyeVtub2RlLmlkXVtpXSA9IG5ldyBBcnJheShERU5TSVRZKTtcblx0XHRcdH0pO1xuXHRcdFx0Ly8gR28gdGhyb3VnaCBhbGwgcHJlZGVmaW5lZCBpbnB1dHMuXG5cdFx0XHRmb3IgKGxldCBub2RlSWQgaW4gSU5QVVRTKSB7XG5cdFx0XHRcdGJvdW5kYXJ5W25vZGVJZF1baV0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAoaiA9IDA7IGogPCBERU5TSVRZOyBqKyspIHtcblx0XHRcdC8vIDEgZm9yIHBvaW50cyBpbnNpZGUgdGhlIGNpcmNsZSwgYW5kIDAgZm9yIHBvaW50cyBvdXRzaWRlIHRoZSBjaXJjbGUuXG5cdFx0XHRsZXQgeCA9IHhTY2FsZShpKTtcblx0XHRcdGxldCB5ID0geVNjYWxlKGopO1xuXHRcdFx0bGV0IGlucHV0ID0gY29uc3RydWN0SW5wdXQoeCwgeSk7XG5cdFx0XHRubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XG5cdFx0XHRubi5mb3JFYWNoTm9kZShuZXR3b3JrLCB0cnVlLCBub2RlID0+IHtcblx0XHRcdFx0Ym91bmRhcnlbbm9kZS5pZF1baV1bal0gPSBub2RlLm91dHB1dDtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKGZpcnN0VGltZSkge1xuXHRcdFx0XHQvLyBHbyB0aHJvdWdoIGFsbCBwcmVkZWZpbmVkIGlucHV0cy5cblx0XHRcdFx0Zm9yIChsZXQgbm9kZUlkIGluIElOUFVUUykge1xuXHRcdFx0XHRcdGJvdW5kYXJ5W25vZGVJZF1baV1bal0gPSBJTlBVVFNbbm9kZUlkXS5mKHgsIHkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGdldExlYXJuaW5nUmF0ZShuZXR3b3JrOiBubi5Ob2RlW11bXSk6IG51bWJlciB7XG5cdGxldCB0cnVlTGVhcm5pbmdSYXRlID0gMDtcblxuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Ly8gVXBkYXRlIGFsbCB0aGUgbm9kZXMgaW4gdGhpcyBsYXllci5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHR0cnVlTGVhcm5pbmdSYXRlICs9IG5vZGUudHJ1ZUxlYXJuaW5nUmF0ZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRydWVMZWFybmluZ1JhdGU7XG59XG5cbmZ1bmN0aW9uIGdldFRvdGFsQ2FwYWNpdHkobmV0d29yazogbm4uTm9kZVtdW10pOiBudW1iZXIge1xuXHRsZXQgdG90YWxDYXBhY2l0eSA9IDA7XG5cdGZvciAobGV0IGxheWVySWR4ID0gMTsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aDsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBjdXJMYXllckNhcGFjaXR5ID0gMDtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0aWYgKDEgPT09IGxheWVySWR4KVxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRcdGN1ckxheWVyQ2FwYWNpdHkgKz0gbm9kZS5pbnB1dExpbmtzLmxlbmd0aCArIDE7XG5cdFx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRsZXQgbWluTGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4IC0gMV0ubGVuZ3RoO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBsYXllcklkeCAtIDE7IGkrKykge1xuXHRcdFx0XHRpZiAobmV0d29ya1tpXS5sZW5ndGggPCBtaW5MYXllcikge1xuXHRcdFx0XHRcdG1pbkxheWVyID0gbmV0d29ya1tpXS5sZW5ndGg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y3VyTGF5ZXJDYXBhY2l0eSArPSBtaW5MYXllcjtcblx0XHR9XG5cdFx0dG90YWxDYXBhY2l0eSArPSBjdXJMYXllckNhcGFjaXR5O1xuXHR9XG5cdHJldHVybiB0b3RhbENhcGFjaXR5O1xufVxuXG5mdW5jdGlvbiBnZXRMb3NzKG5ldHdvcms6IG5uLk5vZGVbXVtdLCBkYXRhUG9pbnRzOiBFeGFtcGxlMkRbXSk6IG51bWJlciB7XG5cdGxldCBsb3NzID0gMDtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhUG9pbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IGRhdGFQb2ludCA9IGRhdGFQb2ludHNbaV07XG5cdFx0bGV0IGlucHV0ID0gY29uc3RydWN0SW5wdXQoZGF0YVBvaW50LngsIGRhdGFQb2ludC55KTtcblx0XHRsZXQgb3V0cHV0ID0gbm4uZm9yd2FyZFByb3AobmV0d29yaywgaW5wdXQpO1xuXHRcdGxvc3MgKz0gbm4uRXJyb3JzLlNRVUFSRS5lcnJvcihvdXRwdXQsIGRhdGFQb2ludC5sYWJlbCk7XG5cdH1cblx0cmV0dXJuIGxvc3MgLyBkYXRhUG9pbnRzLmxlbmd0aCAqIDEwMDtcbn1cblxuZnVuY3Rpb24gZ2V0TnVtYmVyT2ZDb3JyZWN0Q2xhc3NpZmljYXRpb25zKG5ldHdvcms6IG5uLk5vZGVbXVtdLCBkYXRhUG9pbnRzOiBFeGFtcGxlMkRbXSk6IG51bWJlciB7XG5cdGxldCBjb3JyZWN0bHlDbGFzc2lmaWVkID0gMDtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhUG9pbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IGRhdGFQb2ludCA9IGRhdGFQb2ludHNbaV07XG5cdFx0bGV0IGlucHV0ID0gY29uc3RydWN0SW5wdXQoZGF0YVBvaW50LngsIGRhdGFQb2ludC55KTtcblx0XHRsZXQgb3V0cHV0ID0gbm4uZm9yd2FyZFByb3AobmV0d29yaywgaW5wdXQpO1xuXHRcdGxldCBwcmVkaWN0aW9uID0gKG91dHB1dCA+IDApID8gMSA6IC0xO1xuXHRcdGxldCBjb3JyZWN0ID0gKHByZWRpY3Rpb24gPT09IGRhdGFQb2ludC5sYWJlbCkgPyAxIDogMDtcblx0XHRjb3JyZWN0bHlDbGFzc2lmaWVkICs9IGNvcnJlY3Q7XG5cdH1cblxuXHRyZXR1cm4gY29ycmVjdGx5Q2xhc3NpZmllZDtcbn1cblxuZnVuY3Rpb24gZ2V0TnVtYmVyT2ZFYWNoQ2xhc3MoZGF0YVBvaW50czogRXhhbXBsZTJEW10pOiBudW1iZXJbXSB7XG5cdGxldCBmaXJzdENsYXNzOiBudW1iZXIgPSAwO1xuXHRsZXQgc2Vjb25kQ2xhc3M6IG51bWJlciA9IDA7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBkYXRhUG9pbnQgPSBkYXRhUG9pbnRzW2ldO1xuXHRcdGZpcnN0Q2xhc3MgKz0gKGRhdGFQb2ludC5sYWJlbCA9PT0gLTEpID8gMSA6IDA7XG5cdFx0c2Vjb25kQ2xhc3MgKz0gKGRhdGFQb2ludC5sYWJlbCA9PT0gMSkgPyAxIDogMDtcblx0fVxuXHRyZXR1cm4gW2ZpcnN0Q2xhc3MsIHNlY29uZENsYXNzXTtcbn1cblxuZnVuY3Rpb24gZ2V0QWNjdXJhY3lGb3JFYWNoQ2xhc3MobmV0d29yazogbm4uTm9kZVtdW10sIGRhdGFQb2ludHM6IEV4YW1wbGUyRFtdKTogbnVtYmVyW10ge1xuXHRsZXQgZmlyc3RDbGFzc0NvcnJlY3Q6IG51bWJlciA9IDA7XG5cdGxldCBzZWNvbmRDbGFzc0NvcnJlY3Q6IG51bWJlciA9IDA7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBkYXRhUG9pbnQgPSBkYXRhUG9pbnRzW2ldO1xuXHRcdGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KGRhdGFQb2ludC54LCBkYXRhUG9pbnQueSk7XG5cdFx0bGV0IG91dHB1dCA9IG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcblx0XHRsZXQgcHJlZGljdGlvbiA9IChvdXRwdXQgPiAwKSA/IDEgOiAtMTtcblx0XHRsZXQgaXNDb3JyZWN0ID0gcHJlZGljdGlvbiA9PT0gZGF0YVBvaW50LmxhYmVsO1xuXHRcdGlmIChpc0NvcnJlY3QpIHtcblx0XHRcdGlmIChkYXRhUG9pbnQubGFiZWwgPT09IC0xKSB7XG5cdFx0XHRcdGZpcnN0Q2xhc3NDb3JyZWN0ICs9IDE7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWNvbmRDbGFzc0NvcnJlY3QgKz0gMTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXHRsZXQgY2xhc3Nlc0NvdW50OiBudW1iZXJbXSA9IGdldE51bWJlck9mRWFjaENsYXNzKGRhdGFQb2ludHMpO1xuXHRyZXR1cm4gW2ZpcnN0Q2xhc3NDb3JyZWN0IC8gY2xhc3Nlc0NvdW50WzBdLCBzZWNvbmRDbGFzc0NvcnJlY3QgLyBjbGFzc2VzQ291bnRbMV1dO1xufVxuXG5cbmZ1bmN0aW9uIHVwZGF0ZVVJKGZpcnN0U3RlcCA9IGZhbHNlKSB7XG5cdC8vIFVwZGF0ZSB0aGUgbGlua3MgdmlzdWFsbHkuXG5cdHVwZGF0ZVdlaWdodHNVSShuZXR3b3JrLCBkMy5zZWxlY3QoXCJnLmNvcmVcIikpO1xuXHQvLyBVcGRhdGUgdGhlIGJpYXMgdmFsdWVzIHZpc3VhbGx5LlxuXHR1cGRhdGVCaWFzZXNVSShuZXR3b3JrKTtcblx0Ly8gR2V0IHRoZSBkZWNpc2lvbiBib3VuZGFyeSBvZiB0aGUgbmV0d29yay5cblx0dXBkYXRlRGVjaXNpb25Cb3VuZGFyeShuZXR3b3JrLCBmaXJzdFN0ZXApO1xuXHRsZXQgc2VsZWN0ZWRJZCA9IHNlbGVjdGVkTm9kZUlkICE9IG51bGwgP1xuXHRcdHNlbGVjdGVkTm9kZUlkIDogbm4uZ2V0T3V0cHV0Tm9kZShuZXR3b3JrKS5pZDtcblx0aGVhdE1hcC51cGRhdGVCYWNrZ3JvdW5kKGJvdW5kYXJ5W3NlbGVjdGVkSWRdLCBzdGF0ZS5kaXNjcmV0aXplKTtcblxuXHQvLyBVcGRhdGUgYWxsIGRlY2lzaW9uIGJvdW5kYXJpZXMuXG5cdGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLnNlbGVjdEFsbChcImRpdi5jYW52YXNcIilcblx0XHQuZWFjaChmdW5jdGlvbiAoZGF0YTogeyBoZWF0bWFwOiBIZWF0TWFwLCBpZDogc3RyaW5nIH0pIHtcblx0XHRcdGRhdGEuaGVhdG1hcC51cGRhdGVCYWNrZ3JvdW5kKHJlZHVjZU1hdHJpeChib3VuZGFyeVtkYXRhLmlkXSwgMTApLCBzdGF0ZS5kaXNjcmV0aXplKTtcblx0XHR9KTtcblxuXHRmdW5jdGlvbiB6ZXJvUGFkKG46IG51bWJlcik6IHN0cmluZyB7XG5cdFx0bGV0IHBhZCA9IFwiMDAwMDAwXCI7XG5cdFx0cmV0dXJuIChwYWQgKyBuKS5zbGljZSgtcGFkLmxlbmd0aCk7XG5cdH1cblxuXHRmdW5jdGlvbiBhZGRDb21tYXMoczogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gcy5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIixcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBodW1hblJlYWRhYmxlKG46IG51bWJlciwgayA9IDQpOiBzdHJpbmcge1xuXHRcdHJldHVybiBuLnRvRml4ZWQoayk7XG5cdH1cblxuXHRmdW5jdGlvbiBodW1hblJlYWRhYmxlSW50KG46IG51bWJlcik6IHN0cmluZyB7XG5cdFx0cmV0dXJuIG4udG9GaXhlZCgwKTtcblx0fVxuXG5cdC8vIFVwZGF0ZSB0cnVlIGxlYXJuaW5nIHJhdGUgbG9zcyBhbmQgaXRlcmF0aW9uIG51bWJlci5cblx0Ly8gVGhlc2UgYXJlIGFsbCBiaXQgcmF0ZXMsIGhlbmNlIHRoZXkgYXJlIGNoYW5uZWwgc2lnbmFsc1xuXHRsZXQgYml0TG9zc1Rlc3QgPSBsb3NzVGVzdDtcblx0bGV0IGJpdExvc3NUcmFpbiA9IGxvc3NUcmFpbjtcblx0bGV0IGJpdEdlbmVyYWxpemF0aW9uID0gZ2VuZXJhbGl6YXRpb247XG5cdHRvdGFsQ2FwYWNpdHkgPSBnZXRUb3RhbENhcGFjaXR5KG5ldHdvcmspO1xuXHRzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMF07XG5cdHN0YXRlLm1heENhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkodHJhaW5EYXRhKVsxXTtcblxuXG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbWF4Q2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5tYXhDYXBhY2l0eSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nc3VnQ2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5zdWdDYXBhY2l0eSk7XG5cdGQzLnNlbGVjdChcIiNsb3NzLXRyYWluXCIpLnRleHQoaHVtYW5SZWFkYWJsZShiaXRMb3NzVHJhaW4pKTtcblx0ZDMuc2VsZWN0KFwiI2xvc3MtdGVzdFwiKS50ZXh0KGh1bWFuUmVhZGFibGUoYml0TG9zc1Rlc3QpKTtcblx0ZDMuc2VsZWN0KFwiI2dlbmVyYWxpemF0aW9uXCIpLnRleHQoaHVtYW5SZWFkYWJsZShiaXRHZW5lcmFsaXphdGlvbiwgMykpO1xuXHRkMy5zZWxlY3QoXCIjdHJhaW4tYWNjdXJhY3ktZmlyc3RcIikudGV4dChodW1hblJlYWRhYmxlKHRyYWluQ2xhc3Nlc0FjY3VyYWN5WzBdKSk7XG5cdGQzLnNlbGVjdChcIiN0cmFpbi1hY2N1cmFjeS1zZWNvbmRcIikudGV4dChodW1hblJlYWRhYmxlKHRyYWluQ2xhc3Nlc0FjY3VyYWN5WzFdKSk7XG5cdGQzLnNlbGVjdChcIiN0ZXN0LWFjY3VyYWN5LWZpcnN0XCIpLnRleHQoaHVtYW5SZWFkYWJsZSh0ZXN0Q2xhc3Nlc0FjY3VyYWN5WzBdKSk7XG5cdGQzLnNlbGVjdChcIiN0ZXN0LWFjY3VyYWN5LXNlY29uZFwiKS50ZXh0KGh1bWFuUmVhZGFibGUodGVzdENsYXNzZXNBY2N1cmFjeVsxXSkpO1xuXHRkMy5zZWxlY3QoXCIjaXRlci1udW1iZXJcIikudGV4dChhZGRDb21tYXMoemVyb1BhZChpdGVyKSkpO1xuXHRkMy5zZWxlY3QoXCIjdG90YWwtY2FwYWNpdHlcIikudGV4dChodW1hblJlYWRhYmxlSW50KHRvdGFsQ2FwYWNpdHkpKTtcblx0bGluZUNoYXJ0LmFkZERhdGFQb2ludChbbG9zc1RyYWluLCBsb3NzVGVzdF0pO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RJbnB1dElkcygpOiBzdHJpbmdbXSB7XG5cdGxldCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cdGZvciAobGV0IGlucHV0TmFtZSBpbiBJTlBVVFMpIHtcblx0XHRpZiAoc3RhdGVbaW5wdXROYW1lXSkge1xuXHRcdFx0cmVzdWx0LnB1c2goaW5wdXROYW1lKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0SW5wdXQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXJbXSB7XG5cdGxldCBpbnB1dDogbnVtYmVyW10gPSBbXTtcblx0Zm9yIChsZXQgaW5wdXROYW1lIGluIElOUFVUUykge1xuXHRcdGlmIChzdGF0ZVtpbnB1dE5hbWVdKSB7XG5cdFx0XHRpbnB1dC5wdXNoKElOUFVUU1tpbnB1dE5hbWVdLmYoeCwgeSkpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIG9uZVN0ZXAoKTogdm9pZCB7XG5cdGl0ZXIrKztcblx0dHJhaW5EYXRhLmZvckVhY2goKHBvaW50LCBpKSA9PiB7XG5cdFx0bGV0IGlucHV0ID0gY29uc3RydWN0SW5wdXQocG9pbnQueCwgcG9pbnQueSk7XG5cdFx0bm4uZm9yd2FyZFByb3AobmV0d29yaywgaW5wdXQpO1xuXHRcdG5uLmJhY2tQcm9wKG5ldHdvcmssIHBvaW50LmxhYmVsLCBubi5FcnJvcnMuU1FVQVJFKTtcblx0XHRpZiAoKGkgKyAxKSAlIHN0YXRlLmJhdGNoU2l6ZSA9PT0gMCkge1xuXHRcdFx0bm4udXBkYXRlV2VpZ2h0cyhuZXR3b3JrLCBzdGF0ZS5sZWFybmluZ1JhdGUsIHN0YXRlLnJlZ3VsYXJpemF0aW9uUmF0ZSk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBDb21wdXRlIHRoZSBsb3NzLlxuXHR0cnVlTGVhcm5pbmdSYXRlID0gZ2V0TGVhcm5pbmdSYXRlKG5ldHdvcmspO1xuXHR0b3RhbENhcGFjaXR5ID0gZ2V0VG90YWxDYXBhY2l0eShuZXR3b3JrKTtcblxuXHRsb3NzVHJhaW4gPSBnZXRMb3NzKG5ldHdvcmssIHRyYWluRGF0YSk7XG5cdGxvc3NUZXN0ID0gZ2V0TG9zcyhuZXR3b3JrLCB0ZXN0RGF0YSk7XG5cblx0bGV0IG51bWJlck9mQ29ycmVjdFRyYWluQ2xhc3NpZmljYXRpb25zOiBudW1iZXIgPSBnZXROdW1iZXJPZkNvcnJlY3RDbGFzc2lmaWNhdGlvbnMobmV0d29yaywgdHJhaW5EYXRhKTtcblx0bGV0IG51bWJlck9mQ29ycmVjdFRlc3RDbGFzc2lmaWNhdGlvbnM6IG51bWJlciA9IGdldE51bWJlck9mQ29ycmVjdENsYXNzaWZpY2F0aW9ucyhuZXR3b3JrLCB0ZXN0RGF0YSk7XG5cdGdlbmVyYWxpemF0aW9uID0gKG51bWJlck9mQ29ycmVjdFRyYWluQ2xhc3NpZmljYXRpb25zICsgbnVtYmVyT2ZDb3JyZWN0VGVzdENsYXNzaWZpY2F0aW9ucykgLyB0b3RhbENhcGFjaXR5O1xuXG5cdHRyYWluQ2xhc3Nlc0FjY3VyYWN5ID0gZ2V0QWNjdXJhY3lGb3JFYWNoQ2xhc3MobmV0d29yaywgdHJhaW5EYXRhKTtcblx0dGVzdENsYXNzZXNBY2N1cmFjeSA9IGdldEFjY3VyYWN5Rm9yRWFjaENsYXNzKG5ldHdvcmssIHRlc3REYXRhKTtcblxuXG5cdHVwZGF0ZVVJKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPdXRwdXRXZWlnaHRzKG5ldHdvcms6IG5uLk5vZGVbXVtdKTogbnVtYmVyW10ge1xuXHRsZXQgd2VpZ2h0czogbnVtYmVyW10gPSBbXTtcblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAwOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoIC0gMTsgbGF5ZXJJZHgrKykge1xuXHRcdGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUub3V0cHV0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgb3V0cHV0ID0gbm9kZS5vdXRwdXRzW2pdO1xuXHRcdFx0XHR3ZWlnaHRzLnB1c2gob3V0cHV0LndlaWdodCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiB3ZWlnaHRzO1xufVxuXG5mdW5jdGlvbiByZXNldChvblN0YXJ0dXAgPSBmYWxzZSkge1xuXHRsaW5lQ2hhcnQucmVzZXQoKTtcblx0c3RhdGUuc2VyaWFsaXplKCk7XG5cdGlmICghb25TdGFydHVwKSB7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0fVxuXHRwbGF5ZXIucGF1c2UoKTtcblxuXHRsZXQgc3VmZml4ID0gc3RhdGUubnVtSGlkZGVuTGF5ZXJzICE9PSAxID8gXCJzXCIgOiBcIlwiO1xuXHRkMy5zZWxlY3QoXCIjbGF5ZXJzLWxhYmVsXCIpLnRleHQoXCJIaWRkZW4gbGF5ZXJcIiArIHN1ZmZpeCk7XG5cdGQzLnNlbGVjdChcIiNudW0tbGF5ZXJzXCIpLnRleHQoc3RhdGUubnVtSGlkZGVuTGF5ZXJzKTtcblxuXG5cdC8vIE1ha2UgYSBzaW1wbGUgbmV0d29yay5cblx0aXRlciA9IDA7XG5cdGxldCBudW1JbnB1dHMgPSBjb25zdHJ1Y3RJbnB1dCgwLCAwKS5sZW5ndGg7XG5cdGxldCBzaGFwZSA9IFtudW1JbnB1dHNdLmNvbmNhdChzdGF0ZS5uZXR3b3JrU2hhcGUpLmNvbmNhdChbMV0pO1xuXHRsZXQgb3V0cHV0QWN0aXZhdGlvbiA9IChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLlJFR1JFU1NJT04pID9cblx0XHRubi5BY3RpdmF0aW9ucy5MSU5FQVIgOiBubi5BY3RpdmF0aW9ucy5UQU5IO1xuXHRuZXR3b3JrID0gbm4uYnVpbGROZXR3b3JrKHNoYXBlLCBzdGF0ZS5hY3RpdmF0aW9uLCBvdXRwdXRBY3RpdmF0aW9uLFxuXHRcdHN0YXRlLnJlZ3VsYXJpemF0aW9uLCBjb25zdHJ1Y3RJbnB1dElkcygpLCBzdGF0ZS5pbml0WmVybyk7XG5cdHRydWVMZWFybmluZ1JhdGUgPSBnZXRMZWFybmluZ1JhdGUobmV0d29yayk7XG5cdHRvdGFsQ2FwYWNpdHkgPSBnZXRUb3RhbENhcGFjaXR5KG5ldHdvcmspO1xuXHRsb3NzVGVzdCA9IGdldExvc3MobmV0d29yaywgdGVzdERhdGEpO1xuXHRsb3NzVHJhaW4gPSBnZXRMb3NzKG5ldHdvcmssIHRyYWluRGF0YSk7XG5cblx0bGV0IG51bWJlck9mQ29ycmVjdFRyYWluQ2xhc3NpZmljYXRpb25zOiBudW1iZXIgPSBnZXROdW1iZXJPZkNvcnJlY3RDbGFzc2lmaWNhdGlvbnMobmV0d29yaywgdHJhaW5EYXRhKTtcblx0bGV0IG51bWJlck9mQ29ycmVjdFRlc3RDbGFzc2lmaWNhdGlvbnM6IG51bWJlciA9IGdldE51bWJlck9mQ29ycmVjdENsYXNzaWZpY2F0aW9ucyhuZXR3b3JrLCB0ZXN0RGF0YSk7XG5cblx0Z2VuZXJhbGl6YXRpb24gPSAobnVtYmVyT2ZDb3JyZWN0VHJhaW5DbGFzc2lmaWNhdGlvbnMgKyBudW1iZXJPZkNvcnJlY3RUZXN0Q2xhc3NpZmljYXRpb25zKSAvIHRvdGFsQ2FwYWNpdHk7XG5cblx0dHJhaW5DbGFzc2VzQWNjdXJhY3kgPSBnZXRBY2N1cmFjeUZvckVhY2hDbGFzcyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuXHR0ZXN0Q2xhc3Nlc0FjY3VyYWN5ID0gZ2V0QWNjdXJhY3lGb3JFYWNoQ2xhc3MobmV0d29yaywgdGVzdERhdGEpO1xuXG5cdGRyYXdOZXR3b3JrKG5ldHdvcmspO1xuXHR1cGRhdGVVSSh0cnVlKTtcbn1cblxuZnVuY3Rpb24gaW5pdFR1dG9yaWFsKCkge1xuXHRpZiAoc3RhdGUudHV0b3JpYWwgPT0gbnVsbCB8fCBzdGF0ZS50dXRvcmlhbCA9PT0gXCJcIiB8fCBzdGF0ZS5oaWRlVGV4dCkge1xuXHRcdHJldHVybjtcblx0fVxuXHQvLyBSZW1vdmUgYWxsIG90aGVyIHRleHQuXG5cdGQzLnNlbGVjdEFsbChcImFydGljbGUgZGl2LmwtLWJvZHlcIikucmVtb3ZlKCk7XG5cdGxldCB0dXRvcmlhbCA9IGQzLnNlbGVjdChcImFydGljbGVcIikuYXBwZW5kKFwiZGl2XCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcImwtLWJvZHlcIik7XG5cdC8vIEluc2VydCB0dXRvcmlhbCB0ZXh0LlxuXHRkMy5odG1sKGB0dXRvcmlhbHMvJHtzdGF0ZS50dXRvcmlhbH0uaHRtbGAsIChlcnIsIGh0bWxGcmFnbWVudCkgPT4ge1xuXHRcdGlmIChlcnIpIHtcblx0XHRcdHRocm93IGVycjtcblx0XHR9XG5cdFx0dHV0b3JpYWwubm9kZSgpLmFwcGVuZENoaWxkKGh0bWxGcmFnbWVudCk7XG5cdFx0Ly8gSWYgdGhlIHR1dG9yaWFsIGhhcyBhIDx0aXRsZT4gdGFnLCBzZXQgdGhlIHBhZ2UgdGl0bGUgdG8gdGhhdC5cblx0XHRsZXQgdGl0bGUgPSB0dXRvcmlhbC5zZWxlY3QoXCJ0aXRsZVwiKTtcblx0XHRpZiAodGl0bGUuc2l6ZSgpKSB7XG5cdFx0XHRkMy5zZWxlY3QoXCJoZWFkZXIgaDFcIikuc3R5bGUoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIm1hcmdpbi10b3BcIjogXCIyMHB4XCIsXG5cdFx0XHRcdFx0XCJtYXJnaW4tYm90dG9tXCI6IFwiMjBweFwiLFxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGV4dCh0aXRsZS50ZXh0KCkpO1xuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZS50ZXh0KCk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyVGh1bWJuYWlsKGNhbnZhcywgZGF0YUdlbmVyYXRvcikge1xuXHRsZXQgdyA9IDEwMDtcblx0bGV0IGggPSAxMDA7XG5cdGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCB3KTtcblx0Y2FudmFzLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBoKTtcblx0bGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRsZXQgZGF0YSA9IGRhdGFHZW5lcmF0b3IoMjAwLCA1MCk7IC8vIE5QT0lOVFMsIE5PSVNFXG5cblx0ZGF0YS5mb3JFYWNoKFxuXHRcdGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yU2NhbGUoZC5sYWJlbCk7XG5cdFx0XHRjb250ZXh0LmZpbGxSZWN0KHcgKiAoZC54ICsgNikgLyAxMiwgaCAqICgtZC55ICsgNikgLyAxMiwgNCwgNCk7XG5cdFx0fSk7XG5cdGQzLnNlbGVjdChjYW52YXMucGFyZW50Tm9kZSkuc3R5bGUoXCJkaXNwbGF5XCIsIG51bGwpO1xufVxuXG5mdW5jdGlvbiByZW5kZXJCWU9EVGh1bWJuYWlsKGNhbnZhcykge1xuXHRjYW52YXMuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgMTAwKTtcblx0Y2FudmFzLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCAxMDApO1xuXHRsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cdGNvbnN0IHBsdXNTdmcgPSBcIjxzdmcgdmVyc2lvbj1cXFwiMS4xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHdpZHRoPVxcXCIyNFxcXCIgaGVpZ2h0PVxcXCIyNFxcXCIgdmlld0JveD1cXFwiMCAwIDI0IDI0XFxcIj48dGl0bGU+YWRkPC90aXRsZT48cGF0aCBkPVxcXCJNMTguOTg0IDEyLjk4NGgtNnY2aC0xLjk2OXYtNmgtNnYtMS45NjloNnYtNmgxLjk2OXY2aDZ2MS45Njl6XFxcIj48L3BhdGg+PC9zdmc+XCI7XG5cdGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuXHRjb25zdCBzdmcgPSBuZXcgQmxvYihbcGx1c1N2Z10sIHt0eXBlOiBcImltYWdlL3N2Zyt4bWxcIn0pO1xuXHRjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHN2Zyk7XG5cblx0aW1nLnNyYyA9IHVybDtcblxuXHRpbWcub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcblx0XHRjb250ZXh0LmRyYXdJbWFnZShpbWcsIDI1LCAyNSwgNTAsIDUwKTtcblx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG5cdH07XG5cdGQzLnNlbGVjdChjYW52YXMucGFyZW50Tm9kZSkuc3R5bGUoXCJkaXNwbGF5XCIsIG51bGwpO1xufVxuXG5mdW5jdGlvbiBkcmF3RGF0YXNldFRodW1ibmFpbHMoKSB7XG5cdGQzLnNlbGVjdEFsbChcIi5kYXRhc2V0XCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cblx0aWYgKHN0YXRlLnByb2JsZW0gPT09IFByb2JsZW0uQ0xBU1NJRklDQVRJT04pIHtcblx0XHRmb3IgKGxldCBkYXRhc2V0IGluIGRhdGFzZXRzKSB7XG5cdFx0XHRsZXQgY2FudmFzOiBhbnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBjYW52YXNbZGF0YS1kYXRhc2V0PSR7ZGF0YXNldH1dYCk7XG5cdFx0XHRsZXQgZGF0YUdlbmVyYXRvciA9IGRhdGFzZXRzW2RhdGFzZXRdO1xuXG5cdFx0XHRpZiAoZGF0YXNldCA9PT0gXCJieW9kXCIpIHtcblx0XHRcdFx0cmVuZGVyQllPRFRodW1ibmFpbChjYW52YXMpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdHJlbmRlclRodW1ibmFpbChjYW52YXMsIGRhdGFHZW5lcmF0b3IpO1xuXG5cblx0XHR9XG5cdH1cblx0aWYgKHN0YXRlLnByb2JsZW0gPT09IFByb2JsZW0uUkVHUkVTU0lPTikge1xuXHRcdGZvciAobGV0IHJlZ0RhdGFzZXQgaW4gcmVnRGF0YXNldHMpIHtcblx0XHRcdGxldCBjYW52YXM6IGFueSA9XG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGNhbnZhc1tkYXRhLXJlZ0RhdGFzZXQ9JHtyZWdEYXRhc2V0fV1gKTtcblx0XHRcdGxldCBkYXRhR2VuZXJhdG9yID0gcmVnRGF0YXNldHNbcmVnRGF0YXNldF07XG5cdFx0XHRyZW5kZXJUaHVtYm5haWwoY2FudmFzLCBkYXRhR2VuZXJhdG9yKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gaGlkZUNvbnRyb2xzKCkge1xuXHQvLyBTZXQgZGlzcGxheTpub25lIHRvIGFsbCB0aGUgVUkgZWxlbWVudHMgdGhhdCBhcmUgaGlkZGVuLlxuXHRsZXQgaGlkZGVuUHJvcHMgPSBzdGF0ZS5nZXRIaWRkZW5Qcm9wcygpO1xuXHRoaWRkZW5Qcm9wcy5mb3JFYWNoKHByb3AgPT4ge1xuXHRcdGxldCBjb250cm9scyA9IGQzLnNlbGVjdEFsbChgLnVpLSR7cHJvcH1gKTtcblx0XHRpZiAoY29udHJvbHMuc2l6ZSgpID09PSAwKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYDAgaHRtbCBlbGVtZW50cyBmb3VuZCB3aXRoIGNsYXNzIC51aS0ke3Byb3B9YCk7XG5cdFx0fVxuXHRcdGNvbnRyb2xzLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdH0pO1xuXG5cdC8vIEFsc28gYWRkIGNoZWNrYm94IGZvciBlYWNoIGhpZGFibGUgY29udHJvbCBpbiB0aGUgXCJ1c2UgaXQgaW4gY2xhc3Nyb21cIlxuXHQvLyBzZWN0aW9uLlxuXHRsZXQgaGlkZUNvbnRyb2xzID0gZDMuc2VsZWN0KFwiLmhpZGUtY29udHJvbHNcIik7XG5cdEhJREFCTEVfQ09OVFJPTFMuZm9yRWFjaCgoW3RleHQsIGlkXSkgPT4ge1xuXHRcdGxldCBsYWJlbCA9IGhpZGVDb250cm9scy5hcHBlbmQoXCJsYWJlbFwiKVxuXHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcIm1kbC1jaGVja2JveCBtZGwtanMtY2hlY2tib3ggbWRsLWpzLXJpcHBsZS1lZmZlY3RcIik7XG5cdFx0bGV0IGlucHV0ID0gbGFiZWwuYXBwZW5kKFwiaW5wdXRcIilcblx0XHRcdC5hdHRyKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dHlwZTogXCJjaGVja2JveFwiLFxuXHRcdFx0XHRcdGNsYXNzOiBcIm1kbC1jaGVja2JveF9faW5wdXRcIixcblx0XHRcdFx0fSk7XG5cdFx0aWYgKGhpZGRlblByb3BzLmluZGV4T2YoaWQpID09PSAtMSkge1xuXHRcdFx0aW5wdXQuYXR0cihcImNoZWNrZWRcIiwgXCJ0cnVlXCIpO1xuXHRcdH1cblx0XHRpbnB1dC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzdGF0ZS5zZXRIaWRlUHJvcGVydHkoaWQsICF0aGlzLmNoZWNrZWQpO1xuXHRcdFx0c3RhdGUuc2VyaWFsaXplKCk7XG5cdFx0XHR1c2VySGFzSW50ZXJhY3RlZCgpO1xuXHRcdFx0ZDMuc2VsZWN0KFwiLmhpZGUtY29udHJvbHMtbGlua1wiKVxuXHRcdFx0XHQuYXR0cihcImhyZWZcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXHRcdH0pO1xuXHRcdGxhYmVsLmFwcGVuZChcInNwYW5cIilcblx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtZGwtY2hlY2tib3hfX2xhYmVsIGxhYmVsXCIpXG5cdFx0XHQudGV4dCh0ZXh0KTtcblx0fSk7XG5cdGQzLnNlbGVjdChcIi5oaWRlLWNvbnRyb2xzLWxpbmtcIilcblx0XHQuYXR0cihcImhyZWZcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZURhdGEoZmlyc3RUaW1lID0gZmFsc2UpIHtcblx0aWYgKCFmaXJzdFRpbWUpIHtcblx0XHQvLyBDaGFuZ2UgdGhlIHNlZWQuXG5cdFx0c3RhdGUuc2VlZCA9IE1hdGgucmFuZG9tKCkudG9GaXhlZCg4KTtcblx0XHRzdGF0ZS5zZXJpYWxpemUoKTtcblx0XHR1c2VySGFzSW50ZXJhY3RlZCgpO1xuXHR9XG5cdE1hdGguc2VlZHJhbmRvbShzdGF0ZS5zZWVkKTtcblx0bGV0IG51bVNhbXBsZXMgPSAoc3RhdGUucHJvYmxlbSA9PT0gUHJvYmxlbS5SRUdSRVNTSU9OKSA/XG5cdFx0TlVNX1NBTVBMRVNfUkVHUkVTUyA6IE5VTV9TQU1QTEVTX0NMQVNTSUZZO1xuXG5cdGxldCBnZW5lcmF0b3I7XG5cdGxldCBkYXRhOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6aW5kZW50XG5cblx0aWYgKHN0YXRlLmJ5b2QpIHtcblx0XHRkYXRhID0gdHJhaW5EYXRhLmNvbmNhdCh0ZXN0RGF0YSk7XG5cdH1cblxuXHRpZiAoIXN0YXRlLmJ5b2QpIHtcblx0XHRnZW5lcmF0b3IgPSBzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OID8gc3RhdGUuZGF0YXNldCA6IHN0YXRlLnJlZ0RhdGFzZXQ7XG5cdFx0ZGF0YSA9IGdlbmVyYXRvcihudW1TYW1wbGVzLCBzdGF0ZS5ub2lzZSk7XG5cdH1cblxuXHQvLyBTaHVmZmxlIGFuZCBzcGxpdCBpbnRvIHRyYWluIGFuZCB0ZXN0IGRhdGEuXG5cdHNodWZmbGUoZGF0YSk7XG5cdGxldCBzcGxpdEluZGV4ID0gTWF0aC5mbG9vcihkYXRhLmxlbmd0aCAqIHN0YXRlLnBlcmNUcmFpbkRhdGEgLyAxMDApO1xuXHR0cmFpbkRhdGEgPSBkYXRhLnNsaWNlKDAsIHNwbGl0SW5kZXgpO1xuXHR0ZXN0RGF0YSA9IGRhdGEuc2xpY2Uoc3BsaXRJbmRleCk7XG5cblx0bGV0IGNsYXNzRGlzdCA9IGdldE51bWJlck9mRWFjaENsYXNzKHRyYWluRGF0YSkubWFwKChudW0pID0+IG51bSAvIHRyYWluRGF0YS5sZW5ndGgpO1xuXHRzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMF07XG5cdHN0YXRlLm1heENhcGFjaXR5ID0gZ2V0UmVxQ2FwYWNpdHkodHJhaW5EYXRhKVsxXTtcblxuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YURpc3RyaWJ1dGlvbiddIC52YWx1ZVwiKVxuXHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblxuXHRoZWF0TWFwLnVwZGF0ZVBvaW50cyh0cmFpbkRhdGEpO1xuXHRoZWF0TWFwLnVwZGF0ZVRlc3RQb2ludHMoc3RhdGUuc2hvd1Rlc3REYXRhID8gdGVzdERhdGEgOiBbXSk7XG5cbn1cblxubGV0IGZpcnN0SW50ZXJhY3Rpb24gPSB0cnVlO1xubGV0IHBhcmFtZXRlcnNDaGFuZ2VkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHVzZXJIYXNJbnRlcmFjdGVkKCkge1xuXHRpZiAoIWZpcnN0SW50ZXJhY3Rpb24pIHtcblx0XHRyZXR1cm47XG5cdH1cblx0Zmlyc3RJbnRlcmFjdGlvbiA9IGZhbHNlO1xuXHRsZXQgcGFnZSA9IFwiaW5kZXhcIjtcblx0aWYgKHN0YXRlLnR1dG9yaWFsICE9IG51bGwgJiYgc3RhdGUudHV0b3JpYWwgIT09IFwiXCIpIHtcblx0XHRwYWdlID0gYC92L3R1dG9yaWFscy8ke3N0YXRlLnR1dG9yaWFsfWA7XG5cdH1cblx0Z2EoXCJzZXRcIiwgXCJwYWdlXCIsIHBhZ2UpO1xuXHRnYShcInNlbmRcIiwgXCJwYWdldmlld1wiLCB7XCJzZXNzaW9uQ29udHJvbFwiOiBcInN0YXJ0XCJ9KTtcbn1cblxuZnVuY3Rpb24gc2ltdWxhdGlvblN0YXJ0ZWQoKSB7XG5cdGdhKFwic2VuZFwiLFxuXHRcdHtcblx0XHRcdGhpdFR5cGU6IFwiZXZlbnRcIixcblx0XHRcdGV2ZW50Q2F0ZWdvcnk6IFwiU3RhcnRpbmcgU2ltdWxhdGlvblwiLFxuXHRcdFx0ZXZlbnRBY3Rpb246IHBhcmFtZXRlcnNDaGFuZ2VkID8gXCJjaGFuZ2VkXCIgOiBcInVuY2hhbmdlZFwiLFxuXHRcdFx0ZXZlbnRMYWJlbDogc3RhdGUudHV0b3JpYWwgPT0gbnVsbCA/IFwiXCIgOiBzdGF0ZS50dXRvcmlhbFxuXHRcdH0pO1xuXHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBzaW11bGF0ZUNsaWNrKGVsZW0gLyogTXVzdCBiZSB0aGUgZWxlbWVudCwgbm90IGQzIHNlbGVjdGlvbiAqLykge1xuXHRsZXQgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJNb3VzZUV2ZW50c1wiKTtcblx0ZXZ0LmluaXRNb3VzZUV2ZW50KFxuXHRcdFwiY2xpY2tcIiwgLyogdHlwZSAqL1xuXHRcdHRydWUsIC8qIGNhbkJ1YmJsZSAqL1xuXHRcdHRydWUsIC8qIGNhbmNlbGFibGUgKi9cblx0XHR3aW5kb3csIC8qIHZpZXcgKi9cblx0XHQwLCAvKiBkZXRhaWwgKi9cblx0XHQwLCAvKiBzY3JlZW5YICovXG5cdFx0MCwgLyogc2NyZWVuWSAqL1xuXHRcdDAsIC8qIGNsaWVudFggKi9cblx0XHQwLCAvKiBjbGllbnRZICovXG5cdFx0ZmFsc2UsIC8qIGN0cmxLZXkgKi9cblx0XHRmYWxzZSwgLyogYWx0S2V5ICovXG5cdFx0ZmFsc2UsIC8qIHNoaWZ0S2V5ICovXG5cdFx0ZmFsc2UsIC8qIG1ldGFLZXkgKi9cblx0XHQwLCAvKiBidXR0b24gKi9cblx0XHRudWxsKTtcblx0LyogcmVsYXRlZFRhcmdldCAqL1xuXHRlbGVtLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbn1cblxuXG5kcmF3RGF0YXNldFRodW1ibmFpbHMoKTtcbi8vIGluaXRUdXRvcmlhbCgpO1xubWFrZUdVSSgpO1xuZ2VuZXJhdGVEYXRhKHRydWUpO1xucmVzZXQodHJ1ZSk7XG5oaWRlQ29udHJvbHMoKTtcbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuaW1wb3J0ICogYXMgbm4gZnJvbSBcIi4vbm5cIjtcbmltcG9ydCAqIGFzIGRhdGFzZXQgZnJvbSBcIi4vZGF0YXNldFwiO1xuaW1wb3J0IHtFeGFtcGxlMkQsIHNodWZmbGUsIERhdGFHZW5lcmF0b3J9IGZyb20gXCIuL2RhdGFzZXRcIjtcblxuLyoqIFN1ZmZpeCBhZGRlZCB0byB0aGUgc3RhdGUgd2hlbiBzdG9yaW5nIGlmIGEgY29udHJvbCBpcyBoaWRkZW4gb3Igbm90LiAqL1xuY29uc3QgSElERV9TVEFURV9TVUZGSVggPSBcIl9oaWRlXCI7XG5cbi8qKiBBIG1hcCBiZXR3ZWVuIG5hbWVzIGFuZCBhY3RpdmF0aW9uIGZ1bmN0aW9ucy4gKi9cbmV4cG9ydCBsZXQgYWN0aXZhdGlvbnM6IHsgW2tleTogc3RyaW5nXTogbm4uQWN0aXZhdGlvbkZ1bmN0aW9uIH0gPSB7XG5cdFwicmVsdVwiOiBubi5BY3RpdmF0aW9ucy5SRUxVLFxuXHRcInRhbmhcIjogbm4uQWN0aXZhdGlvbnMuVEFOSCxcblx0XCJzaWdtb2lkXCI6IG5uLkFjdGl2YXRpb25zLlNJR01PSUQsXG5cdFwibGluZWFyXCI6IG5uLkFjdGl2YXRpb25zLkxJTkVBUixcblx0XCJzaW54XCI6IG5uLkFjdGl2YXRpb25zLlNJTlhcbn07XG5cbi8qKiBBIG1hcCBiZXR3ZWVuIG5hbWVzIGFuZCByZWd1bGFyaXphdGlvbiBmdW5jdGlvbnMuICovXG5leHBvcnQgbGV0IHJlZ3VsYXJpemF0aW9uczogeyBba2V5OiBzdHJpbmddOiBubi5SZWd1bGFyaXphdGlvbkZ1bmN0aW9uIH0gPSB7XG5cdFwibm9uZVwiOiBudWxsLFxuXHRcIkwxXCI6IG5uLlJlZ3VsYXJpemF0aW9uRnVuY3Rpb24uTDEsXG5cdFwiTDJcIjogbm4uUmVndWxhcml6YXRpb25GdW5jdGlvbi5MMlxufTtcblxuLyoqIEEgbWFwIGJldHdlZW4gZGF0YXNldCBuYW1lcyBhbmQgZnVuY3Rpb25zIHRoYXQgZ2VuZXJhdGUgY2xhc3NpZmljYXRpb24gZGF0YS4gKi9cbmV4cG9ydCBsZXQgZGF0YXNldHM6IHsgW2tleTogc3RyaW5nXTogZGF0YXNldC5EYXRhR2VuZXJhdG9yIH0gPSB7XG5cdFwiY2lyY2xlXCI6IGRhdGFzZXQuY2xhc3NpZnlDaXJjbGVEYXRhLFxuXHRcInhvclwiOiBkYXRhc2V0LmNsYXNzaWZ5WE9SRGF0YSxcblx0XCJnYXVzc1wiOiBkYXRhc2V0LmNsYXNzaWZ5VHdvR2F1c3NEYXRhLFxuXHRcInNwaXJhbFwiOiBkYXRhc2V0LmNsYXNzaWZ5U3BpcmFsRGF0YSxcblx0XCJieW9kXCI6IGRhdGFzZXQuY2xhc3NpZnlCWU9EYXRhXG59O1xuXG4vKiogQSBtYXAgYmV0d2VlbiBkYXRhc2V0IG5hbWVzIGFuZCBmdW5jdGlvbnMgdGhhdCBnZW5lcmF0ZSByZWdyZXNzaW9uIGRhdGEuICovXG5leHBvcnQgbGV0IHJlZ0RhdGFzZXRzOiB7IFtrZXk6IHN0cmluZ106IGRhdGFzZXQuRGF0YUdlbmVyYXRvciB9ID0ge1xuXHRcInJlZy1wbGFuZVwiOiBkYXRhc2V0LnJlZ3Jlc3NQbGFuZSxcblx0XCJyZWctZ2F1c3NcIjogZGF0YXNldC5yZWdyZXNzR2F1c3NpYW5cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRLZXlGcm9tVmFsdWUob2JqOiBhbnksIHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuXHRmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG5cdFx0aWYgKG9ialtrZXldID09PSB2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIGtleTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZW5kc1dpdGgoczogc3RyaW5nLCBzdWZmaXg6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gcy5zdWJzdHIoLXN1ZmZpeC5sZW5ndGgpID09PSBzdWZmaXg7XG59XG5cbmZ1bmN0aW9uIGdldEhpZGVQcm9wcyhvYmo6IGFueSk6IHN0cmluZ1tdIHtcblx0bGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblx0Zm9yIChsZXQgcHJvcCBpbiBvYmopIHtcblx0XHRpZiAoZW5kc1dpdGgocHJvcCwgSElERV9TVEFURV9TVUZGSVgpKSB7XG5cdFx0XHRyZXN1bHQucHVzaChwcm9wKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgZGF0YSB0eXBlIG9mIGEgc3RhdGUgdmFyaWFibGUuIFVzZWQgZm9yIGRldGVybWluaW5nIHRoZVxuICogKGRlKXNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5leHBvcnQgZW51bSBUeXBlIHtcblx0U1RSSU5HLFxuXHROVU1CRVIsXG5cdEFSUkFZX05VTUJFUixcblx0QVJSQVlfU1RSSU5HLFxuXHRCT09MRUFOLFxuXHRPQkpFQ1Rcbn1cblxuZXhwb3J0IGVudW0gUHJvYmxlbSB7XG5cdENMQVNTSUZJQ0FUSU9OLFxuXHRSRUdSRVNTSU9OXG59XG5cbmV4cG9ydCBsZXQgcHJvYmxlbXMgPSB7XG5cdFwiY2xhc3NpZmljYXRpb25cIjogUHJvYmxlbS5DTEFTU0lGSUNBVElPTixcblx0XCJyZWdyZXNzaW9uXCI6IFByb2JsZW0uUkVHUkVTU0lPTlxufTtcblxuZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eSB7XG5cdG5hbWU6IHN0cmluZztcblx0dHlwZTogVHlwZTtcblx0a2V5TWFwPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbn1cblxuLy8gQWRkIHRoZSBHVUkgc3RhdGUuXG5leHBvcnQgY2xhc3MgU3RhdGUge1xuXHRwcml2YXRlIHN0YXRpYyBQUk9QUzogUHJvcGVydHlbXSA9XG5cdFx0W1xuXHRcdFx0e25hbWU6IFwiYWN0aXZhdGlvblwiLCB0eXBlOiBUeXBlLk9CSkVDVCwga2V5TWFwOiBhY3RpdmF0aW9uc30sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6IFwicmVndWxhcml6YXRpb25cIixcblx0XHRcdFx0dHlwZTogVHlwZS5PQkpFQ1QsXG5cdFx0XHRcdGtleU1hcDogcmVndWxhcml6YXRpb25zXG5cdFx0XHR9LFxuXHRcdFx0e25hbWU6IFwiYmF0Y2hTaXplXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcblx0XHRcdHtuYW1lOiBcImRhdGFzZXRcIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogZGF0YXNldHN9LFxuXHRcdFx0e25hbWU6IFwicmVnRGF0YXNldFwiLCB0eXBlOiBUeXBlLk9CSkVDVCwga2V5TWFwOiByZWdEYXRhc2V0c30sXG5cdFx0XHR7bmFtZTogXCJsZWFybmluZ1JhdGVcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwidHJ1ZUxlYXJuaW5nUmF0ZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sIC8vIFRoZSB0cnVlIGxlYXJuaW5nIHJhdGVcblx0XHRcdHtuYW1lOiBcInJlZ3VsYXJpemF0aW9uUmF0ZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sXG5cdFx0XHR7bmFtZTogXCJub2lzZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sXG5cdFx0XHR7bmFtZTogXCJuZXR3b3JrU2hhcGVcIiwgdHlwZTogVHlwZS5BUlJBWV9OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwic2VlZFwiLCB0eXBlOiBUeXBlLlNUUklOR30sXG5cdFx0XHR7bmFtZTogXCJzaG93VGVzdERhdGFcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcImRpc2NyZXRpemVcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInBlcmNUcmFpbkRhdGFcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwieFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwieVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwieFRpbWVzWVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwieFNxdWFyZWRcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInlTcXVhcmVkXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJjb3NYXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJzaW5YXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJjb3NZXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJzaW5ZXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJjb2xsZWN0U3RhdHNcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInR1dG9yaWFsXCIsIHR5cGU6IFR5cGUuU1RSSU5HfSxcblx0XHRcdHtuYW1lOiBcInByb2JsZW1cIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogcHJvYmxlbXN9LFxuXHRcdFx0e25hbWU6IFwiaW5pdFplcm9cIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcImhpZGVUZXh0XCIsIHR5cGU6IFR5cGUuQk9PTEVBTn1cblx0XHRdO1xuXG5cdFtrZXk6IHN0cmluZ106IGFueTtcblxuXHR0b3RhbENhcGFjaXR5ID0gMC4wO1xuXHRyZXFDYXBhY2l0eSA9IDI7XG5cdG1heENhcGFjaXR5ID0gMDtcblx0c3VnQ2FwYWNpdHkgPSAwO1xuXHRsb3NzQ2FwYWNpdHkgPSAwO1xuXHR0cnVlTGVhcm5pbmdSYXRlID0gMC4wO1xuXHRsZWFybmluZ1JhdGUgPSAxLjA7XG5cdHJlZ3VsYXJpemF0aW9uUmF0ZSA9IDA7XG5cdHNob3dUZXN0RGF0YSA9IGZhbHNlO1xuXHRub2lzZSA9IDM1OyAvLyBTTlJkQlxuXHRiYXRjaFNpemUgPSAxMDtcblx0ZGlzY3JldGl6ZSA9IGZhbHNlO1xuXHR0dXRvcmlhbDogc3RyaW5nID0gbnVsbDtcblx0cGVyY1RyYWluRGF0YSA9IDUwO1xuXHRhY3RpdmF0aW9uID0gbm4uQWN0aXZhdGlvbnMuU0lHTU9JRDtcblx0cmVndWxhcml6YXRpb246IG5uLlJlZ3VsYXJpemF0aW9uRnVuY3Rpb24gPSBudWxsO1xuXHRwcm9ibGVtID0gUHJvYmxlbS5DTEFTU0lGSUNBVElPTjtcblx0aW5pdFplcm8gPSBmYWxzZTtcblx0aGlkZVRleHQgPSBmYWxzZTtcblx0Y29sbGVjdFN0YXRzID0gZmFsc2U7XG5cdG51bUhpZGRlbkxheWVycyA9IDE7XG5cdGhpZGRlbkxheWVyQ29udHJvbHM6IGFueVtdID0gW107XG5cdG5ldHdvcmtTaGFwZTogbnVtYmVyW10gPSBbMV07XG5cdHggPSB0cnVlO1xuXHR5ID0gdHJ1ZTtcblx0eFRpbWVzWSA9IGZhbHNlO1xuXHR4U3F1YXJlZCA9IGZhbHNlO1xuXHR5U3F1YXJlZCA9IGZhbHNlO1xuXHRjb3NYID0gZmFsc2U7XG5cdHNpblggPSBmYWxzZTtcblx0Y29zWSA9IGZhbHNlO1xuXHRzaW5ZID0gZmFsc2U7XG5cdGJ5b2QgPSBmYWxzZTtcblx0ZGF0YTogRXhhbXBsZTJEW10gPSBbXTtcblx0ZGF0YXNldDogZGF0YXNldC5EYXRhR2VuZXJhdG9yID0gZGF0YXNldC5jbGFzc2lmeVR3b0dhdXNzRGF0YTtcblx0cmVnRGF0YXNldDogZGF0YXNldC5EYXRhR2VuZXJhdG9yID0gZGF0YXNldC5yZWdyZXNzUGxhbmU7XG5cdHNlZWQ6IHN0cmluZztcblx0c2hpZnREb3duOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBEZXNlcmlhbGl6ZXMgdGhlIHN0YXRlIGZyb20gdGhlIHVybCBoYXNoLlxuXHQgKi9cblx0c3RhdGljIGRlc2VyaWFsaXplU3RhdGUoKTogU3RhdGUge1xuXHRcdGxldCBtYXA6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcblx0XHRmb3IgKGxldCBrZXl2YWx1ZSBvZiB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKS5zcGxpdChcIiZcIikpIHtcblx0XHRcdGxldCBbbmFtZSwgdmFsdWVdID0ga2V5dmFsdWUuc3BsaXQoXCI9XCIpO1xuXHRcdFx0bWFwW25hbWVdID0gdmFsdWU7XG5cdFx0fVxuXHRcdGxldCBzdGF0ZSA9IG5ldyBTdGF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gaGFzS2V5KG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIG5hbWUgaW4gbWFwICYmIG1hcFtuYW1lXSAhPSBudWxsICYmIG1hcFtuYW1lXS50cmltKCkgIT09IFwiXCI7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcGFyc2VBcnJheSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nW10ge1xuXHRcdFx0cmV0dXJuIHZhbHVlLnRyaW0oKSA9PT0gXCJcIiA/IFtdIDogdmFsdWUuc3BsaXQoXCIsXCIpO1xuXHRcdH1cblxuXHRcdC8vIERlc2VyaWFsaXplIHJlZ3VsYXIgcHJvcGVydGllcy5cblx0XHRTdGF0ZS5QUk9QUy5mb3JFYWNoKCh7bmFtZSwgdHlwZSwga2V5TWFwfSkgPT4ge1xuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgVHlwZS5PQkpFQ1Q6XG5cdFx0XHRcdFx0aWYgKGtleU1hcCA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBFcnJvcihcIkEga2V5LXZhbHVlIG1hcCBtdXN0IGJlIHByb3ZpZGVkIGZvciBzdGF0ZSBcIiArXG5cdFx0XHRcdFx0XHRcdFwidmFyaWFibGVzIG9mIHR5cGUgT2JqZWN0XCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoaGFzS2V5KG5hbWUpICYmIG1hcFtuYW1lXSBpbiBrZXlNYXApIHtcblx0XHRcdFx0XHRcdHN0YXRlW25hbWVdID0ga2V5TWFwW21hcFtuYW1lXV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuTlVNQkVSOlxuXHRcdFx0XHRcdGlmIChoYXNLZXkobmFtZSkpIHtcblx0XHRcdFx0XHRcdC8vIFRoZSArIG9wZXJhdG9yIGlzIGZvciBjb252ZXJ0aW5nIGEgc3RyaW5nIHRvIGEgbnVtYmVyLlxuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSArbWFwW25hbWVdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBUeXBlLlNUUklORzpcblx0XHRcdFx0XHRpZiAoaGFzS2V5KG5hbWUpKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZVtuYW1lXSA9IG1hcFtuYW1lXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVHlwZS5CT09MRUFOOlxuXHRcdFx0XHRcdGlmIChoYXNLZXkobmFtZSkpIHtcblx0XHRcdFx0XHRcdHN0YXRlW25hbWVdID0gKG1hcFtuYW1lXSA9PT0gXCJmYWxzZVwiID8gZmFsc2UgOiB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVHlwZS5BUlJBWV9OVU1CRVI6XG5cdFx0XHRcdFx0aWYgKG5hbWUgaW4gbWFwKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZVtuYW1lXSA9IHBhcnNlQXJyYXkobWFwW25hbWVdKS5tYXAoTnVtYmVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVHlwZS5BUlJBWV9TVFJJTkc6XG5cdFx0XHRcdFx0aWYgKG5hbWUgaW4gbWFwKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZVtuYW1lXSA9IHBhcnNlQXJyYXkobWFwW25hbWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgRXJyb3IoXCJFbmNvdW50ZXJlZCBhbiB1bmtub3duIHR5cGUgZm9yIGEgc3RhdGUgdmFyaWFibGVcIik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBEZXNlcmlhbGl6ZSBzdGF0ZSBwcm9wZXJ0aWVzIHRoYXQgY29ycmVzcG9uZCB0byBoaWRpbmcgVUkgY29udHJvbHMuXG5cdFx0Z2V0SGlkZVByb3BzKG1hcCkuZm9yRWFjaChwcm9wID0+IHtcblx0XHRcdHN0YXRlW3Byb3BdID0gKG1hcFtwcm9wXSA9PT0gXCJ0cnVlXCIpO1xuXHRcdH0pO1xuXHRcdHN0YXRlLm51bUhpZGRlbkxheWVycyA9IHN0YXRlLm5ldHdvcmtTaGFwZS5sZW5ndGg7XG5cdFx0aWYgKHN0YXRlLnNlZWQgPT0gbnVsbCkge1xuXHRcdFx0c3RhdGUuc2VlZCA9IE1hdGgucmFuZG9tKCkudG9GaXhlZCg1KTtcblx0XHR9XG5cdFx0TWF0aC5zZWVkcmFuZG9tKHN0YXRlLnNlZWQpO1xuXHRcdHN0YXRlLnNoaWZ0RG93biA9IGZhbHNlO1xuXHRcdHJldHVybiBzdGF0ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXJpYWxpemVzIHRoZSBzdGF0ZSBpbnRvIHRoZSB1cmwgaGFzaC5cblx0ICovXG5cdHNlcmlhbGl6ZSgpIHtcblx0XHQvLyBTZXJpYWxpemUgcmVndWxhciBwcm9wZXJ0aWVzLlxuXHRcdGxldCBwcm9wczogc3RyaW5nW10gPSBbXTtcblx0XHRTdGF0ZS5QUk9QUy5mb3JFYWNoKCh7bmFtZSwgdHlwZSwga2V5TWFwfSkgPT4ge1xuXHRcdFx0bGV0IHZhbHVlID0gdGhpc1tuYW1lXTtcblx0XHRcdC8vIERvbid0IHNlcmlhbGl6ZSBtaXNzaW5nIHZhbHVlcy5cblx0XHRcdGlmICh2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlID09PSBUeXBlLk9CSkVDVCkge1xuXHRcdFx0XHR2YWx1ZSA9IGdldEtleUZyb21WYWx1ZShrZXlNYXAsIHZhbHVlKTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gVHlwZS5BUlJBWV9OVU1CRVIgfHwgdHlwZSA9PT0gVHlwZS5BUlJBWV9TVFJJTkcpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5qb2luKFwiLFwiKTtcblx0XHRcdH1cblx0XHRcdHByb3BzLnB1c2goYCR7bmFtZX09JHt2YWx1ZX1gKTtcblx0XHR9KTtcblx0XHQvLyBTZXJpYWxpemUgcHJvcGVydGllcyB0aGF0IGNvcnJlc3BvbmQgdG8gaGlkaW5nIFVJIGNvbnRyb2xzLlxuXHRcdGdldEhpZGVQcm9wcyh0aGlzKS5mb3JFYWNoKHByb3AgPT4ge1xuXHRcdFx0cHJvcHMucHVzaChgJHtwcm9wfT0ke3RoaXNbcHJvcF19YCk7XG5cdFx0fSk7XG5cdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBwcm9wcy5qb2luKFwiJlwiKTtcblx0fVxuXG5cdC8qKiBSZXR1cm5zIGFsbCB0aGUgaGlkZGVuIHByb3BlcnRpZXMuICovXG5cdGdldEhpZGRlblByb3BzKCk6IHN0cmluZ1tdIHtcblx0XHRsZXQgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xuXHRcdGZvciAobGV0IHByb3AgaW4gdGhpcykge1xuXHRcdFx0aWYgKGVuZHNXaXRoKHByb3AsIEhJREVfU1RBVEVfU1VGRklYKSAmJiBTdHJpbmcodGhpc1twcm9wXSkgPT09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKHByb3AucmVwbGFjZShISURFX1NUQVRFX1NVRkZJWCwgXCJcIikpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0c2V0SGlkZVByb3BlcnR5KG5hbWU6IHN0cmluZywgaGlkZGVuOiBib29sZWFuKSB7XG5cdFx0dGhpc1tuYW1lICsgSElERV9TVEFURV9TVUZGSVhdID0gaGlkZGVuO1xuXHR9XG59XG4iXX0=
