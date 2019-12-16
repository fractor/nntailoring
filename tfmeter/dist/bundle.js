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
    function signalOf(n) {
        return Math.log(1 + Math.abs(n));
    }
    var log2 = 1.0 / Math.log(2.0);
    var bitLossTest = lossTest;
    var bitLossTrain = lossTrain;
    var bitTrueLearningRate = signalOf(trueLearningRate) * log2;
    var bitGeneralization = generalization;
    totalCapacity = getTotalCapacity(network);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy5ucG0vX25weC83MzY2OS9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGF0YXNldC50cyIsInNyYy9oZWF0bWFwLnRzIiwic3JjL2xpbmVjaGFydC50cyIsInNyYy9ubi50cyIsInNyYy9wbGF5Z3JvdW5kLnRzIiwic3JjL3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQytDQSx5QkFBZ0MsVUFBa0IsRUFBRSxLQUFhO0lBQ2hFLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUM7SUFpQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDZixDQUFDO0FBbkNELDBDQW1DQztBQVFELDhCQUFxQyxVQUFrQixFQUFFLEtBQWE7SUFDckUsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztJQUM3QixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFHbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXpCLGtCQUFrQixFQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWE7UUFDdEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDaEQsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDaEQsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6QyxJQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxHQUFHLE9BQU8s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QUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDbEQsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELENBQUMsSUFBSSxNQUFNLENBQUM7UUFDWixDQUFDLElBQUksTUFBTSxDQUFDO1FBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBR0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFHMUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxD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QUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQ3JDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0JBQVEsRUFBQztJQUN0RCxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDdEMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0NBQ3RDLENBQUM7QUFuQ1Msc0JBQUsiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbi8qKlxuICogQSB0d28gZGltZW5zaW9uYWwgZXhhbXBsZTogeCBhbmQgeSBjb29yZGluYXRlcyB3aXRoIHRoZSBsYWJlbC5cbiAqL1xuZXhwb3J0IHR5cGUgRXhhbXBsZTJEID0ge1xuXHR4OiBudW1iZXIsXG5cdHk6IG51bWJlcixcblx0bGFiZWw6IG51bWJlclxufTtcblxudHlwZSBQb2ludCA9IHtcblx0XHR4OiBudW1iZXIsXG5cdFx0eTogbnVtYmVyXG5cdH07XG5cbmV4cG9ydCB0eXBlIERhdGFHZW5lcmF0b3IgPSAobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKSA9PiBFeGFtcGxlMkRbXTtcblxuaW50ZXJmYWNlIEhUTUxJbnB1dEV2ZW50IGV4dGVuZHMgRXZlbnQge1xuXHR0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgJiBFdmVudFRhcmdldDtcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBDTEFTU0lGSUNBVElPTlxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gQnJpbmcgWW91ciBPd24gRGF0YVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeUJZT0RhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHQvLyBBV0cgTm9pc2UgVmFyaWFuY2UgPSBTaWduYWwgLyAxMF4oU05SZEIvMTApXG5cdC8vIH4gdmFyIGROb2lzZSA9IGRTTlIobm9pc2UpO1xuXG5cdC8vIH4gdmFyIGRhdGE7XG5cblx0Ly8gfiB2YXIgaW5wdXRCWU9EID0gZDMuc2VsZWN0KFwiI2lucHV0RmlsZUJZT0RcIik7XG5cdC8vIH4gaW5wdXRCWU9ELm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIC8vOiBFeGFtcGxlMkRbXVxuXHQvLyB+IHtcblx0Ly8gfiB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0Ly8gfiB2YXIgbmFtZSA9IHRoaXMuZmlsZXNbMF0ubmFtZTtcblx0Ly8gfiByZWFkZXIucmVhZEFzVGV4dCh0aGlzLmZpbGVzWzBdKTtcblx0Ly8gfiByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpXG5cdC8vIH4ge1xuXHQvLyB+IHZhciB0YXJnZXQ6IGFueSA9IGV2ZW50LnRhcmdldDtcblx0Ly8gfiBkYXRhID0gdGFyZ2V0LnJlc3VsdDtcblx0Ly8gfiBsZXQgcyA9IGRhdGEuc3BsaXQoXCJcXG5cIik7XG5cdC8vIH4gZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKVxuXHQvLyB+IHtcblx0Ly8gfiBsZXQgc3MgPSBzW2ldLnNwbGl0KFwiLFwiKTtcblx0Ly8gfiBpZiAoc3MubGVuZ3RoICE9IDMpIGJyZWFrO1xuXHQvLyB+IGxldCB4ID0gc3NbMF07XG5cdC8vIH4gbGV0IHkgPSBzc1sxXTtcblx0Ly8gfiBsZXQgbGFiZWwgPSBzc1syXTtcblx0Ly8gfiBwb2ludHMucHVzaCh7eCx5LGxhYmVsfSk7XG5cdC8vIH4gY29uc29sZS5sb2cocG9pbnRzW2ldLngrXCIsXCIrcG9pbnRzW2ldLnkrXCIsXCIrcG9pbnRzW2ldLmxhYmVsKTtcblx0Ly8gfiB9XG5cdC8vIH4gY29uc29sZS5sb2coXCI4MSBkYXRhc2V0LnRzOiBwb2ludHMubGVuZ3RoID0gXCIgKyBwb2ludHMubGVuZ3RoKTtcblx0Ly8gfiB9O1xuXHQvLyB+IGNvbnNvbGUubG9nKFwiODMgZGF0YXNldC50czogcG9pbnRzLmxlbmd0aCA9IFwiICsgcG9pbnRzLmxlbmd0aCk7XG5cdC8vIH4gfSk7XG5cdC8vIH4gY29uc29sZS5sb2coXCI4NSBmaWxlbmFtZTogXCIgKyBuYW1lKTtcblx0Ly8gfiBjb25zb2xlLmxvZyhcIjg2IGRhdGFzZXQudHM6IHBvaW50cy5sZW5ndGggPSBcIiArIHBvaW50cy5sZW5ndGgpO1xuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIENMQVNTSUZZIEdBVVNTSUFOIENMVVNURVJTXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5VHdvR2F1c3NEYXRhKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6IEV4YW1wbGUyRFtdIHtcblx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0bGV0IHZhcmlhbmNlID0gMC41O1xuXG5cdC8vIEFXRyBOb2lzZSBWYXJpYW5jZSA9IFNpZ25hbCAvIDEwXihTTlJkQi8xMClcblx0bGV0IGROb2lzZSA9IGRTTlIobm9pc2UpO1xuXG5cdGZ1bmN0aW9uIGdlbkdhdXNzKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIGxhYmVsOiBudW1iZXIpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXMgLyAyOyBpKyspIHtcblx0XHRcdGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgdmFyaWFuY2UgKiBkTm9pc2UpO1xuXHRcdFx0bGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCB2YXJpYW5jZSAqIGROb2lzZSk7XG5cdFx0XHRsZXQgc2lnbmFsWCA9IG5vcm1hbFJhbmRvbShjeCwgdmFyaWFuY2UpO1xuXHRcdFx0bGV0IHNpZ25hbFkgPSBub3JtYWxSYW5kb20oY3ksIHZhcmlhbmNlKTtcblx0XHRcdGxldCB4ID0gc2lnbmFsWCArIG5vaXNlWDtcblx0XHRcdGxldCB5ID0gc2lnbmFsWSArIG5vaXNlWTtcblx0XHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHRcdH1cblx0fVxuXG5cdGdlbkdhdXNzKDIsIDIsIDEpOyAvLyBHYXVzc2lhbiB3aXRoIHBvc2l0aXZlIGV4YW1wbGVzLlxuXHRnZW5HYXVzcygtMiwgLTIsIC0xKTsgLy8gR2F1c3NpYW4gd2l0aCBuZWdhdGl2ZSBleGFtcGxlcy5cblx0cmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy8gQ0xBU1NJRlkgU1BJUkFMXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeVNwaXJhbERhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTogRXhhbXBsZTJEW10ge1xuXG5cdC8vIEFXRyBOb2lzZSBWYXJpYW5jZSA9IFNpZ25hbCAvIDEwXihTTlJkQi8xMClcblx0bGV0IGROb2lzZSA9IGRTTlIobm9pc2UpO1xuXG5cdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdGxldCBuID0gbnVtU2FtcGxlcyAvIDI7XG5cblx0ZnVuY3Rpb24gZ2VuU3BpcmFsKGRlbHRhVDogbnVtYmVyLCBsYWJlbDogbnVtYmVyKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcblx0XHRcdGxldCByID0gaSAvIG4gKiA1O1xuXHRcdFx0bGV0IHIyID0gciAqIHI7XG5cdFx0XHRsZXQgdCA9IDEuNzUgKiBpIC8gbiAqIDIgKiBNYXRoLlBJICsgZGVsdGFUO1xuXHRcdFx0bGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCByICogZE5vaXNlKTtcblx0XHRcdGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgciAqIGROb2lzZSk7XG5cdFx0XHRsZXQgeCA9IHIgKiBNYXRoLnNpbih0KSArIG5vaXNlWDtcblx0XHRcdGxldCB5ID0gciAqIE1hdGguY29zKHQpICsgbm9pc2VZO1xuXHRcdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdFx0fVxuXHR9XG5cblx0Z2VuU3BpcmFsKDAsIDEpOyAvLyBQb3NpdGl2ZSBleGFtcGxlcy5cblx0Z2VuU3BpcmFsKE1hdGguUEksIC0xKTsgLy8gTmVnYXRpdmUgZXhhbXBsZXMuXG5cdHJldHVybiBwb2ludHM7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vIENMQVNTSUZZIENJUkNMRVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5Q2lyY2xlRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cdC8vIEFXRyBOb2lzZSBWYXJpYW5jZSA9IFNpZ25hbCAvIDEwXihTTlJkQi8xMClcblx0bGV0IGROb2lzZSA9IGRTTlIobm9pc2UpO1xuXG5cdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdGxldCByYWRpdXMgPSA1O1xuXG5cdC8vIEdlbmVyYXRlIHBvc2l0aXZlIHBvaW50cyBpbnNpZGUgdGhlIGNpcmNsZS5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzIC8gMjsgaSsrKSB7XG5cdFx0bGV0IHIgPSByYW5kVW5pZm9ybSgwLCByYWRpdXMgKiAwLjUpO1xuXHRcdC8vIFdlIGFzc3VtZSByXjIgYXMgdGhlIHZhcmlhbmNlIG9mIHRoZSBTaWduYWxcblx0XHRsZXQgcjIgPSByICogcjtcblx0XHRsZXQgYW5nbGUgPSByYW5kVW5pZm9ybSgwLCAyICogTWF0aC5QSSk7XG5cdFx0bGV0IHggPSByICogTWF0aC5zaW4oYW5nbGUpO1xuXHRcdGxldCB5ID0gciAqIE1hdGguY29zKGFuZ2xlKTtcblx0XHRsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIDEgLyByYWRpdXMgKiBkTm9pc2UpO1xuXHRcdGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgMSAvIHJhZGl1cyAqIGROb2lzZSk7XG5cdFx0eCArPSBub2lzZVg7XG5cdFx0eSArPSBub2lzZVk7XG5cdFx0bGV0IGxhYmVsID0gMTtcblx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0fVxuXG5cdC8vIEdlbmVyYXRlIG5lZ2F0aXZlIHBvaW50cyBvdXRzaWRlIHRoZSBjaXJjbGUuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlcyAvIDI7IGkrKykge1xuXHRcdGxldCByID0gcmFuZFVuaWZvcm0ocmFkaXVzICogMC43LCByYWRpdXMpO1xuXG5cdFx0Ly8gV2UgYXNzdW1lIHJeMiBhcyB0aGUgdmFyaWFuY2Ugb2YgdGhlIFNpZ25hbFxuXHRcdGxldCBycjIgPSByICogcjtcblx0XHRsZXQgYW5nbGUgPSByYW5kVW5pZm9ybSgwLCAyICogTWF0aC5QSSk7XG5cdFx0bGV0IHggPSByICogTWF0aC5zaW4oYW5nbGUpO1xuXHRcdGxldCB5ID0gciAqIE1hdGguY29zKGFuZ2xlKTtcblx0XHRsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIDEgLyByYWRpdXMgKiBkTm9pc2UpO1xuXHRcdGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgMSAvIHJhZGl1cyAqIGROb2lzZSk7XG5cdFx0eCArPSBub2lzZVg7XG5cdFx0eSArPSBub2lzZVk7XG5cdFx0bGV0IGxhYmVsID0gLTE7XG5cdFx0cG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG5cdH1cblx0cmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy8gQ0xBU1NJRlkgWE9SXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlYT1JEYXRhKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6IEV4YW1wbGUyRFtdIHtcblx0Ly8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuXHRsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cblx0Ly8gU3RhbmRhcmQgZGV2aWF0aW9uIG9mIHRoZSBzaWduYWxcblx0bGV0IHN0ZFNpZ25hbCA9IDU7XG5cblx0ZnVuY3Rpb24gZ2V0WE9STGFiZWwocDogUG9pbnQpIHtcblx0XHRyZXR1cm4gcC54ICogcC55ID49IDAgPyAxIDogLTE7XG5cdH1cblxuXHRsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXM7IGkrKykge1xuXHRcdGxldCB4ID0gcmFuZFVuaWZvcm0oLXN0ZFNpZ25hbCwgc3RkU2lnbmFsKTtcblx0XHRsZXQgcGFkZGluZyA9IDAuMztcblx0XHR4ICs9IHggPiAwID8gcGFkZGluZyA6IC1wYWRkaW5nOyAgLy8gUGFkZGluZy5cblx0XHRsZXQgeSA9IHJhbmRVbmlmb3JtKC1zdGRTaWduYWwsIHN0ZFNpZ25hbCk7XG5cdFx0eSArPSB5ID4gMCA/IHBhZGRpbmcgOiAtcGFkZGluZztcblxuXHRcdGxldCB2YXJpYW5jZVNpZ25hbCA9IHN0ZFNpZ25hbCAqIHN0ZFNpZ25hbDtcblx0XHRsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIHZhcmlhbmNlU2lnbmFsICogZE5vaXNlKTtcblx0XHRsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIHZhcmlhbmNlU2lnbmFsICogZE5vaXNlKTtcblx0XHRsZXQgbGFiZWwgPSBnZXRYT1JMYWJlbCh7eDogeCArIG5vaXNlWCwgeTogeSArIG5vaXNlWX0pO1xuXHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHR9XG5cdHJldHVybiBwb2ludHM7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vIFJFR1JFU1NJT05cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ3Jlc3NQbGFuZShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOiBFeGFtcGxlMkRbXSB7XG5cdGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcblx0bGV0IHJhZGl1cyA9IDY7XG5cdGxldCByMiA9IHJhZGl1cyAqIHJhZGl1cztcblx0bGV0IGxhYmVsU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdC5kb21haW4oWy0xMCwgMTBdKVxuXHRcdC5yYW5nZShbLTEsIDFdKTtcblx0bGV0IGdldExhYmVsID0gKHgsIHkpID0+IGxhYmVsU2NhbGUoeCArIHkpO1xuXG5cdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlczsgaSsrKSB7XG5cdFx0bGV0IHggPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpO1xuXHRcdGxldCB5ID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKTtcblx0XHRsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIHIyICogZE5vaXNlKTtcblx0XHRsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIHIyICogZE5vaXNlKTtcblx0XHRsZXQgbGFiZWwgPSBnZXRMYWJlbCh4ICsgbm9pc2VYLCB5ICsgbm9pc2VZKTtcblx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0fVxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVncmVzc0dhdXNzaWFuKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6IEV4YW1wbGUyRFtdIHtcblx0bGV0IGROb2lzZSA9IGRTTlIobm9pc2UpO1xuXG5cdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdGxldCBsYWJlbFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKFswLCAyXSlcblx0XHQucmFuZ2UoWzEsIDBdKVxuXHRcdC5jbGFtcCh0cnVlKTtcblxuXHRsZXQgZ2F1c3NpYW5zID1cblx0XHRbXG5cdFx0XHRbLTQsIDIuNSwgMV0sXG5cdFx0XHRbMCwgMi41LCAtMV0sXG5cdFx0XHRbNCwgMi41LCAxXSxcblx0XHRcdFstNCwgLTIuNSwgLTFdLFxuXHRcdFx0WzAsIC0yLjUsIDFdLFxuXHRcdFx0WzQsIC0yLjUsIC0xXVxuXHRcdF07XG5cblx0ZnVuY3Rpb24gZ2V0TGFiZWwoeCwgeSkge1xuXHRcdC8vIENob29zZSB0aGUgb25lIHRoYXQgaXMgbWF4aW11bSBpbiBhYnMgdmFsdWUuXG5cdFx0bGV0IGxhYmVsID0gMDtcblx0XHRnYXVzc2lhbnMuZm9yRWFjaCgoW2N4LCBjeSwgc2lnbl0pID0+IHtcblx0XHRcdGxldCBuZXdMYWJlbCA9IHNpZ24gKiBsYWJlbFNjYWxlKGRpc3Qoe3gsIHl9LCB7eDogY3gsIHk6IGN5fSkpO1xuXHRcdFx0aWYgKE1hdGguYWJzKG5ld0xhYmVsKSA+IE1hdGguYWJzKGxhYmVsKSkge1xuXHRcdFx0XHRsYWJlbCA9IG5ld0xhYmVsO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBsYWJlbDtcblx0fVxuXG5cdGxldCByYWRpdXMgPSA2O1xuXHRsZXQgcjIgPSByYWRpdXMgKiByYWRpdXM7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlczsgaSsrKSB7XG5cdFx0bGV0IHggPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpO1xuXHRcdGxldCB5ID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKTtcblx0XHRsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIHIyICogZE5vaXNlKTtcblx0XHRsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIHIyICogZE5vaXNlKTtcblx0XHRsZXQgbGFiZWwgPSBnZXRMYWJlbCh4ICsgbm9pc2VYLCB5ICsgbm9pc2VZKTtcblx0XHRwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcblx0fVxuXG5cdHJldHVybiBwb2ludHM7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vIEFDQ0VTU09SWSBGVU5DVElPTlNcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKlxuICogU2h1ZmZsZXMgdGhlIGFycmF5IHVzaW5nIEZpc2hlci1ZYXRlcyBhbGdvcml0aG0uIFVzZXMgdGhlIHNlZWRyYW5kb21cbiAqIGxpYnJhcnkgYXMgdGhlIHJhbmRvbSBnZW5lcmF0b3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaHVmZmxlKGFycmF5OiBhbnlbXSk6IHZvaWQge1xuXHRsZXQgY291bnRlciA9IGFycmF5Lmxlbmd0aDtcblx0bGV0IHRlbXAgPSAwO1xuXHRsZXQgaW5kZXggPSAwO1xuXHQvLyBXaGlsZSB0aGVyZSBhcmUgZWxlbWVudHMgaW4gdGhlIGFycmF5XG5cdHdoaWxlIChjb3VudGVyID4gMCkge1xuXHRcdC8vIFBpY2sgYSByYW5kb20gaW5kZXhcblx0XHRpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvdW50ZXIpO1xuXHRcdC8vIERlY3JlYXNlIGNvdW50ZXIgYnkgMVxuXHRcdGNvdW50ZXItLTtcblx0XHQvLyBBbmQgc3dhcCB0aGUgbGFzdCBlbGVtZW50IHdpdGggaXRcblx0XHR0ZW1wID0gYXJyYXlbY291bnRlcl07XG5cdFx0YXJyYXlbY291bnRlcl0gPSBhcnJheVtpbmRleF07XG5cdFx0YXJyYXlbaW5kZXhdID0gdGVtcDtcblx0fVxufVxuXG5mdW5jdGlvbiBsb2cyKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGgubG9nKDIpO1xufVxuXG5mdW5jdGlvbiBsb2cxMCh4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZygxMCk7XG59XG5cbmZ1bmN0aW9uIHNpZ25hbE9mKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiBsb2cyKDEgKyBNYXRoLmFicyh4KSk7XG59XG5cbmZ1bmN0aW9uIGRTTlIoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIDEgLyBNYXRoLnBvdygxMCwgeCAvIDEwKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgc2FtcGxlIGZyb20gYSB1bmlmb3JtIFthLCBiXSBkaXN0cmlidXRpb24uXG4gKiBVc2VzIHRoZSBzZWVkcmFuZG9tIGxpYnJhcnkgYXMgdGhlIHJhbmRvbSBnZW5lcmF0b3IuXG4gKi9cbmZ1bmN0aW9uIHJhbmRVbmlmb3JtKGE6IG51bWJlciwgYjogbnVtYmVyKSB7XG5cdHJldHVybiBNYXRoLnJhbmRvbSgpICogKGIgLSBhKSArIGE7XG59XG5cbi8qKlxuICogU2FtcGxlcyBmcm9tIGEgbm9ybWFsIGRpc3RyaWJ1dGlvbi4gVXNlcyB0aGUgc2VlZHJhbmRvbSBsaWJyYXJ5IGFzIHRoZVxuICogcmFuZG9tIGdlbmVyYXRvci5cbiAqXG4gKiBAcGFyYW0gbWVhbiBUaGUgbWVhbi4gRGVmYXVsdCBpcyAwLlxuICogQHBhcmFtIHZhcmlhbmNlIFRoZSB2YXJpYW5jZS4gRGVmYXVsdCBpcyAxLlxuICovXG5mdW5jdGlvbiBub3JtYWxSYW5kb20obWVhbiA9IDAsIHZhcmlhbmNlID0gMSk6IG51bWJlciB7XG5cdGxldCB2MTogbnVtYmVyLCB2MjogbnVtYmVyLCBzOiBudW1iZXI7XG5cdGRvIHtcblx0XHR2MSA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcblx0XHR2MiA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcblx0XHRzID0gdjEgKiB2MSArIHYyICogdjI7XG5cdH0gd2hpbGUgKHMgPiAxKTtcblxuXHRsZXQgcmVzdWx0ID0gTWF0aC5zcXJ0KC0yICogTWF0aC5sb2cocykgLyBzKSAqIHYxO1xuXHRyZXR1cm4gbWVhbiArIE1hdGguc3FydCh2YXJpYW5jZSkgKiByZXN1bHQ7XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBldWNsaWRlYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzIGluIHNwYWNlLiAqL1xuZnVuY3Rpb24gZGlzdChhOiBQb2ludCwgYjogUG9pbnQpOiBudW1iZXIge1xuXHRsZXQgZHggPSBhLnggLSBiLng7XG5cdGxldCBkeSA9IGEueSAtIGIueTtcblx0cmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbmh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuaW1wb3J0IHtFeGFtcGxlMkR9IGZyb20gXCIuL2RhdGFzZXRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBIZWF0TWFwU2V0dGluZ3Mge1xuXHRba2V5OiBzdHJpbmddOiBhbnk7XG5cdHNob3dBeGVzPzogYm9vbGVhbjtcblx0bm9Tdmc/OiBib29sZWFuO1xufVxuXG4vKiogTnVtYmVyIG9mIGRpZmZlcmVudCBzaGFkZXMgKGNvbG9ycykgd2hlbiBkcmF3aW5nIGEgZ3JhZGllbnQgaGVhdG1hcCAqL1xuY29uc3QgTlVNX1NIQURFUyA9IDY0O1xuXG4vKipcbiogRHJhd3MgYSBoZWF0bWFwIHVzaW5nIGNhbnZhcy4gVXNlZCBmb3Igc2hvd2luZyB0aGUgbGVhcm5lZCBkZWNpc2lvblxuKiBib3VuZGFyeSBvZiB0aGUgY2xhc3NpZmljYXRpb24gYWxnb3JpdGhtLiBDYW4gYWxzbyBkcmF3IGRhdGEgcG9pbnRzXG4qIHVzaW5nIGFuIHN2ZyBvdmVybGF5ZWQgb24gdG9wIG9mIHRoZSBjYW52YXMgaGVhdG1hcC5cbiovXG5leHBvcnQgY2xhc3MgSGVhdE1hcCB7XG5cdHByaXZhdGUgc2V0dGluZ3M6IEhlYXRNYXBTZXR0aW5ncyA9IHtzaG93QXhlczogZmFsc2UsIG5vU3ZnOiBmYWxzZX07XG5cdHByaXZhdGUgeFNjYWxlOiBkMy5zY2FsZS5MaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xuXHRwcml2YXRlIHlTY2FsZTogZDMuc2NhbGUuTGluZWFyPG51bWJlciwgbnVtYmVyPjtcblx0cHJpdmF0ZSBudW1TYW1wbGVzOiBudW1iZXI7XG5cdHByaXZhdGUgY29sb3I6IGQzLnNjYWxlLlF1YW50aXplPHN0cmluZz47XG5cdHByaXZhdGUgY2FudmFzOiBkMy5TZWxlY3Rpb248YW55Pjtcblx0cHJpdmF0ZSBzdmc6IGQzLlNlbGVjdGlvbjxhbnk+O1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHdpZHRoOiBudW1iZXIsIG51bVNhbXBsZXM6IG51bWJlciwgeERvbWFpbjogW251bWJlciwgbnVtYmVyXSxcblx0XHR5RG9tYWluOiBbbnVtYmVyLCBudW1iZXJdLCBjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+LFxuXHRcdHVzZXJTZXR0aW5ncz86IEhlYXRNYXBTZXR0aW5ncykge1xuXHRcdHRoaXMubnVtU2FtcGxlcyA9IG51bVNhbXBsZXM7XG5cdFx0bGV0IGhlaWdodCA9IHdpZHRoO1xuXHRcdGxldCBwYWRkaW5nID0gdXNlclNldHRpbmdzLnNob3dBeGVzID8gMjAgOiAwO1xuXG5cdFx0aWYgKHVzZXJTZXR0aW5ncyAhPSBudWxsKSB7XG5cdFx0XHQvLyBvdmVyd3JpdGUgdGhlIGRlZmF1bHRzIHdpdGggdGhlIHVzZXItc3BlY2lmaWVkIHNldHRpbmdzLlxuXHRcdFx0Zm9yIChsZXQgcHJvcCBpbiB1c2VyU2V0dGluZ3MpIHtcblx0XHRcdFx0dGhpcy5zZXR0aW5nc1twcm9wXSA9IHVzZXJTZXR0aW5nc1twcm9wXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0LmRvbWFpbih4RG9tYWluKVxuXHRcdC5yYW5nZShbMCwgd2lkdGggLSAyICogcGFkZGluZ10pO1xuXG5cdFx0dGhpcy55U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdC5kb21haW4oeURvbWFpbilcblx0XHQucmFuZ2UoW2hlaWdodCAtIDIgKiBwYWRkaW5nLCAwXSk7XG5cblx0XHQvLyBHZXQgYSByYW5nZSBvZiBjb2xvcnMuXG5cdFx0bGV0IHRtcFNjYWxlID0gZDMuc2NhbGUubGluZWFyPHN0cmluZywgc3RyaW5nPigpXG5cdFx0LmRvbWFpbihbMCwgLjUsIDFdKVxuXHRcdC5yYW5nZShbXCIjMDg3N2JkXCIsIFwiI2U4ZWFlYlwiLCBcIiNmNTkzMjJcIl0pXG5cdFx0LmNsYW1wKHRydWUpO1xuXHRcdC8vIER1ZSB0byBudW1lcmljYWwgZXJyb3IsIHdlIG5lZWQgdG8gc3BlY2lmeVxuXHRcdC8vIGQzLnJhbmdlKDAsIGVuZCArIHNtYWxsX2Vwc2lsb24sIHN0ZXApXG5cdFx0Ly8gaW4gb3JkZXIgdG8gZ3VhcmFudGVlIHRoYXQgd2Ugd2lsbCBoYXZlIGVuZC9zdGVwIGVudHJpZXMgd2l0aFxuXHRcdC8vIHRoZSBsYXN0IGVsZW1lbnQgYmVpbmcgZXF1YWwgdG8gZW5kLlxuXHRcdGxldCBjb2xvcnMgPSBkMy5yYW5nZSgwLCAxICsgMUUtOSwgMSAvIE5VTV9TSEFERVMpLm1hcChhID0+IHtcblx0XHRcdHJldHVybiB0bXBTY2FsZShhKTtcblx0XHR9KTtcblx0XHR0aGlzLmNvbG9yID0gZDMuc2NhbGUucXVhbnRpemU8c3RyaW5nPigpXG5cdFx0LmRvbWFpbihbLTEsIDFdKVxuXHRcdC5yYW5nZShjb2xvcnMpO1xuXG5cdFx0Y29udGFpbmVyID0gY29udGFpbmVyLmFwcGVuZChcImRpdlwiKVxuXHRcdC5zdHlsZShcblx0XHR7XG5cdFx0XHR3aWR0aDogYCR7d2lkdGh9cHhgLFxuXHRcdFx0aGVpZ2h0OiBgJHtoZWlnaHR9cHhgLFxuXHRcdFx0cG9zaXRpb246IFwicmVsYXRpdmVcIixcblx0XHRcdHRvcDogYC0ke3BhZGRpbmd9cHhgLFxuXHRcdFx0bGVmdDogYC0ke3BhZGRpbmd9cHhgXG5cdFx0fSk7XG5cdFx0dGhpcy5jYW52YXMgPSBjb250YWluZXIuYXBwZW5kKFwiY2FudmFzXCIpXG5cdFx0LmF0dHIoXCJ3aWR0aFwiLCBudW1TYW1wbGVzKVxuXHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG51bVNhbXBsZXMpXG5cdFx0LnN0eWxlKFwid2lkdGhcIiwgKHdpZHRoIC0gMiAqIHBhZGRpbmcpICsgXCJweFwiKVxuXHRcdC5zdHlsZShcImhlaWdodFwiLCAoaGVpZ2h0IC0gMiAqIHBhZGRpbmcpICsgXCJweFwiKVxuXHRcdC5zdHlsZShcInBvc2l0aW9uXCIsIFwiYWJzb2x1dGVcIilcblx0XHQuc3R5bGUoXCJ0b3BcIiwgYCR7cGFkZGluZ31weGApXG5cdFx0LnN0eWxlKFwibGVmdFwiLCBgJHtwYWRkaW5nfXB4YCk7XG5cblx0XHRpZiAoIXRoaXMuc2V0dGluZ3Mubm9TdmcpIHtcblx0XHRcdHRoaXMuc3ZnID0gY29udGFpbmVyLmFwcGVuZChcInN2Z1wiKS5hdHRyKFxuXHRcdFx0e1xuXHRcdFx0XHRcIndpZHRoXCI6IHdpZHRoLFxuXHRcdFx0XHRcImhlaWdodFwiOiBoZWlnaHRcblx0XHRcdH0pLnN0eWxlKFxuXHRcdFx0e1xuXHRcdFx0XHQvLyBPdmVybGF5IHRoZSBzdmcgb24gdG9wIG9mIHRoZSBjYW52YXMuXG5cdFx0XHRcdFwicG9zaXRpb25cIjogXCJhYnNvbHV0ZVwiLFxuXHRcdFx0XHRcImxlZnRcIjogXCIwXCIsXG5cdFx0XHRcdFwidG9wXCI6IFwiMFwiXG5cdFx0XHR9KS5hcHBlbmQoXCJnXCIpXG5cdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7cGFkZGluZ30sJHtwYWRkaW5nfSlgKTtcblxuXHRcdFx0dGhpcy5zdmcuYXBwZW5kKFwiZ1wiKS5hdHRyKFwiY2xhc3NcIiwgXCJ0cmFpblwiKTtcblx0XHRcdHRoaXMuc3ZnLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIFwidGVzdFwiKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5zZXR0aW5ncy5zaG93QXhlcykge1xuXHRcdFx0bGV0IHhBeGlzID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlKHRoaXMueFNjYWxlKVxuXHRcdFx0Lm9yaWVudChcImJvdHRvbVwiKTtcblxuXHRcdFx0bGV0IHlBeGlzID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlKHRoaXMueVNjYWxlKVxuXHRcdFx0Lm9yaWVudChcInJpZ2h0XCIpO1xuXG5cdFx0XHR0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0XHQuYXR0cihcImNsYXNzXCIsIFwieCBheGlzXCIpXG5cdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKDAsJHtoZWlnaHQgLSAyICogcGFkZGluZ30pYClcblx0XHRcdC5jYWxsKHhBeGlzKTtcblxuXHRcdFx0dGhpcy5zdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcInkgYXhpc1wiKVxuXHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAod2lkdGggLSAyICogcGFkZGluZykgKyBcIiwwKVwiKVxuXHRcdFx0LmNhbGwoeUF4aXMpO1xuXHRcdH1cblx0fVxuXG5cdHVwZGF0ZVRlc3RQb2ludHMocG9pbnRzOiBFeGFtcGxlMkRbXSk6IHZvaWQge1xuXHRcdGlmICh0aGlzLnNldHRpbmdzLm5vU3ZnKSB7XG5cdFx0XHR0aHJvdyBFcnJvcihcIkNhbid0IGFkZCBwb2ludHMgc2luY2Ugbm9Tdmc9dHJ1ZVwiKTtcblx0XHR9XG5cdFx0dGhpcy51cGRhdGVDaXJjbGVzKHRoaXMuc3ZnLnNlbGVjdChcImcudGVzdFwiKSwgcG9pbnRzKTtcblx0fVxuXG5cdHVwZGF0ZVBvaW50cyhwb2ludHM6IEV4YW1wbGUyRFtdKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuc2V0dGluZ3Mubm9TdmcpIHtcblx0XHRcdHRocm93IEVycm9yKFwiQ2FuJ3QgYWRkIHBvaW50cyBzaW5jZSBub1N2Zz10cnVlXCIpO1xuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZUNpcmNsZXModGhpcy5zdmcuc2VsZWN0KFwiZy50cmFpblwiKSwgcG9pbnRzKTtcblx0fVxuXG5cdHVwZGF0ZUJhY2tncm91bmQoZGF0YTogbnVtYmVyW11bXSwgZGlzY3JldGl6ZTogYm9vbGVhbik6IHZvaWQge1xuXHRcdGxldCBkeCA9IGRhdGFbMF0ubGVuZ3RoO1xuXHRcdGxldCBkeSA9IGRhdGEubGVuZ3RoO1xuXG5cdFx0aWYgKGR4ICE9PSB0aGlzLm51bVNhbXBsZXMgfHwgZHkgIT09IHRoaXMubnVtU2FtcGxlcykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcIlRoZSBwcm92aWRlZCBkYXRhIG1hdHJpeCBtdXN0IGJlIG9mIHNpemUgXCIgK1xuXHRcdFx0XHRcIm51bVNhbXBsZXMgWCBudW1TYW1wbGVzXCIpO1xuXHRcdH1cblxuXHRcdC8vIENvbXB1dGUgdGhlIHBpeGVsIGNvbG9yczsgc2NhbGVkIGJ5IENTUy5cblx0XHRsZXQgY29udGV4dCA9ICh0aGlzLmNhbnZhcy5ub2RlKCkgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmdldENvbnRleHQoXCIyZFwiKTtcblx0XHRsZXQgaW1hZ2UgPSBjb250ZXh0LmNyZWF0ZUltYWdlRGF0YShkeCwgZHkpO1xuXG5cdFx0Zm9yIChsZXQgeSA9IDAsIHAgPSAtMTsgeSA8IGR5OyArK3kpIHtcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgZHg7ICsreCkge1xuXHRcdFx0XHRsZXQgdmFsdWUgPSBkYXRhW3hdW3ldO1xuXHRcdFx0XHRpZiAoZGlzY3JldGl6ZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gKHZhbHVlID49IDAgPyAxIDogLTEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCBjID0gZDMucmdiKHRoaXMuY29sb3IodmFsdWUpKTtcblx0XHRcdFx0aW1hZ2UuZGF0YVsrK3BdID0gYy5yO1xuXHRcdFx0XHRpbWFnZS5kYXRhWysrcF0gPSBjLmc7XG5cdFx0XHRcdGltYWdlLmRhdGFbKytwXSA9IGMuYjtcblx0XHRcdFx0aW1hZ2UuZGF0YVsrK3BdID0gMTYwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCk7XG5cdH1cblxuXHRwcml2YXRlIHVwZGF0ZUNpcmNsZXMoY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55PiwgcG9pbnRzOiBFeGFtcGxlMkRbXSkge1xuXHRcdC8vIEtlZXAgb25seSBwb2ludHMgdGhhdCBhcmUgaW5zaWRlIHRoZSBib3VuZHMuXG5cdFx0bGV0IHhEb21haW4gPSB0aGlzLnhTY2FsZS5kb21haW4oKTtcblx0XHRsZXQgeURvbWFpbiA9IHRoaXMueVNjYWxlLmRvbWFpbigpO1xuXHRcdHBvaW50cyA9IHBvaW50cy5maWx0ZXIocCA9PiB7XG5cdFx0XHRyZXR1cm4gcC54ID49IHhEb21haW5bMF0gJiYgcC54IDw9IHhEb21haW5bMV1cblx0XHRcdCYmIHAueSA+PSB5RG9tYWluWzBdICYmIHAueSA8PSB5RG9tYWluWzFdO1xuXHRcdH0pO1xuXG5cdFx0Ly8gQXR0YWNoIGRhdGEgdG8gaW5pdGlhbGx5IGVtcHR5IHNlbGVjdGlvbi5cblx0XHRsZXQgc2VsZWN0aW9uID0gY29udGFpbmVyLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKHBvaW50cyk7XG5cblx0XHQvLyBJbnNlcnQgZWxlbWVudHMgdG8gbWF0Y2ggbGVuZ3RoIG9mIHBvaW50cyBhcnJheS5cblx0XHRzZWxlY3Rpb24uZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIikuYXR0cihcInJcIiwgMyk7XG5cblx0XHQvLyBVcGRhdGUgcG9pbnRzIHRvIGJlIGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uLlxuXHRcdHNlbGVjdGlvblxuXHRcdC5hdHRyKFxuXHRcdHtcblx0XHRcdGN4OiAoZDogRXhhbXBsZTJEKSA9PiB0aGlzLnhTY2FsZShkLngpLFxuXHRcdFx0Y3k6IChkOiBFeGFtcGxlMkQpID0+IHRoaXMueVNjYWxlKGQueSksXG5cdFx0fSlcblx0XHQuc3R5bGUoXCJmaWxsXCIsIGQgPT4gdGhpcy5jb2xvcihkLmxhYmVsKSk7XG5cblx0XHQvLyBSZW1vdmUgcG9pbnRzIGlmIHRoZSBsZW5ndGggaGFzIGdvbmUgZG93bi5cblx0XHRzZWxlY3Rpb24uZXhpdCgpLnJlbW92ZSgpO1xuXHR9XG59ICAvLyBDbG9zZSBjbGFzcyBIZWF0TWFwLlxuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlTWF0cml4KG1hdHJpeDogbnVtYmVyW11bXSwgZmFjdG9yOiBudW1iZXIpOiBudW1iZXJbXVtdIHtcblx0aWYgKG1hdHJpeC5sZW5ndGggIT09IG1hdHJpeFswXS5sZW5ndGgpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcHJvdmlkZWQgbWF0cml4IG11c3QgYmUgYSBzcXVhcmUgbWF0cml4XCIpO1xuXHR9XG5cdGlmIChtYXRyaXgubGVuZ3RoICUgZmFjdG9yICE9PSAwKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIHdpZHRoL2hlaWdodCBvZiB0aGUgbWF0cml4IG11c3QgYmUgZGl2aXNpYmxlIGJ5IFwiICtcblx0XHRcInRoZSByZWR1Y3Rpb24gZmFjdG9yXCIpO1xuXHR9XG5cdGxldCByZXN1bHQ6IG51bWJlcltdW10gPSBuZXcgQXJyYXkobWF0cml4Lmxlbmd0aCAvIGZhY3Rvcik7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4Lmxlbmd0aDsgaSArPSBmYWN0b3IpIHtcblx0XHRyZXN1bHRbaSAvIGZhY3Rvcl0gPSBuZXcgQXJyYXkobWF0cml4Lmxlbmd0aCAvIGZhY3Rvcik7XG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBtYXRyaXgubGVuZ3RoOyBqICs9IGZhY3Rvcikge1xuXHRcdFx0bGV0IGF2ZyA9IDA7XG5cdFx0XHQvLyBTdW0gYWxsIHRoZSB2YWx1ZXMgaW4gdGhlIG5laWdoYm9yaG9vZC5cblx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwgZmFjdG9yOyBrKyspIHtcblx0XHRcdFx0Zm9yIChsZXQgbCA9IDA7IGwgPCBmYWN0b3I7IGwrKykge1xuXHRcdFx0XHRcdGF2ZyArPSBtYXRyaXhbaSArIGtdW2ogKyBsXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YXZnIC89IChmYWN0b3IgKiBmYWN0b3IpO1xuXHRcdFx0cmVzdWx0W2kgLyBmYWN0b3JdW2ogLyBmYWN0b3JdID0gYXZnO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xudHlwZSBEYXRhUG9pbnQgPSB7XG5cdHg6IG51bWJlcjtcblx0eTogbnVtYmVyW107XG59O1xuXG4vKipcbiAqIEEgbXVsdGktc2VyaWVzIGxpbmUgY2hhcnQgdGhhdCBhbGxvd3MgeW91IHRvIGFwcGVuZCBuZXcgZGF0YSBwb2ludHNcbiAqIGFzIGRhdGEgYmVjb21lcyBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBBcHBlbmRpbmdMaW5lQ2hhcnQge1xuXHRwcml2YXRlIG51bUxpbmVzOiBudW1iZXI7XG5cdHByaXZhdGUgZGF0YTogRGF0YVBvaW50W10gPSBbXTtcblx0cHJpdmF0ZSBzdmc6IGQzLlNlbGVjdGlvbjxhbnk+O1xuXHRwcml2YXRlIHhTY2FsZTogZDMuc2NhbGUuTGluZWFyPG51bWJlciwgbnVtYmVyPjtcblx0cHJpdmF0ZSB5U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XG5cdHByaXZhdGUgcGF0aHM6IEFycmF5PGQzLlNlbGVjdGlvbjxhbnk+Pjtcblx0cHJpdmF0ZSBsaW5lQ29sb3JzOiBzdHJpbmdbXTtcblxuXHRwcml2YXRlIG1pblkgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXHRwcml2YXRlIG1heFkgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuXG5cdGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sIGxpbmVDb2xvcnM6IHN0cmluZ1tdKSB7XG5cdFx0dGhpcy5saW5lQ29sb3JzID0gbGluZUNvbG9ycztcblx0XHR0aGlzLm51bUxpbmVzID0gbGluZUNvbG9ycy5sZW5ndGg7XG5cdFx0bGV0IG5vZGUgPSBjb250YWluZXIubm9kZSgpIGFzIEhUTUxFbGVtZW50O1xuXHRcdGxldCB0b3RhbFdpZHRoID0gbm9kZS5vZmZzZXRXaWR0aDtcblx0XHRsZXQgdG90YWxIZWlnaHQgPSBub2RlLm9mZnNldEhlaWdodDtcblx0XHRsZXQgbWFyZ2luID0ge3RvcDogMiwgcmlnaHQ6IDAsIGJvdHRvbTogMiwgbGVmdDogMn07XG5cdFx0bGV0IHdpZHRoID0gdG90YWxXaWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xuXHRcdGxldCBoZWlnaHQgPSB0b3RhbEhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xuXG5cdFx0dGhpcy54U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0LmRvbWFpbihbMCwgMF0pXG5cdFx0XHQucmFuZ2UoWzAsIHdpZHRoXSk7XG5cblx0XHR0aGlzLnlTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHQuZG9tYWluKFswLCAwXSlcblx0XHRcdC5yYW5nZShbaGVpZ2h0LCAwXSk7XG5cblx0XHR0aGlzLnN2ZyA9IGNvbnRhaW5lci5hcHBlbmQoXCJzdmdcIilcblx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodClcblx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tKVxuXHRcdFx0LmFwcGVuZChcImdcIilcblx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHttYXJnaW4ubGVmdH0sJHttYXJnaW4udG9wfSlgKTtcblxuXHRcdHRoaXMucGF0aHMgPSBuZXcgQXJyYXkodGhpcy5udW1MaW5lcyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUxpbmVzOyBpKyspIHtcblx0XHRcdHRoaXMucGF0aHNbaV0gPSB0aGlzLnN2Zy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lXCIpXG5cdFx0XHRcdC5zdHlsZShcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcImZpbGxcIjogXCJub25lXCIsXG5cdFx0XHRcdFx0XHRcInN0cm9rZVwiOiBsaW5lQ29sb3JzW2ldLFxuXHRcdFx0XHRcdFx0XCJzdHJva2Utd2lkdGhcIjogXCIxLjVweFwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0cmVzZXQoKSB7XG5cdFx0dGhpcy5kYXRhID0gW107XG5cdFx0dGhpcy5yZWRyYXcoKTtcblx0XHR0aGlzLm1pblkgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXHRcdHRoaXMubWF4WSA9IE51bWJlci5NSU5fVkFMVUU7XG5cdH1cblxuXHRhZGREYXRhUG9pbnQoZGF0YVBvaW50OiBudW1iZXJbXSkge1xuXHRcdGlmIChkYXRhUG9pbnQubGVuZ3RoICE9PSB0aGlzLm51bUxpbmVzKSB7XG5cdFx0XHR0aHJvdyBFcnJvcihcIkxlbmd0aCBvZiBkYXRhUG9pbnQgbXVzdCBlcXVhbCBudW1iZXIgb2YgbGluZXNcIik7XG5cdFx0fVxuXHRcdGRhdGFQb2ludC5mb3JFYWNoKHkgPT4ge1xuXHRcdFx0dGhpcy5taW5ZID0gTWF0aC5taW4odGhpcy5taW5ZLCB5KTtcblx0XHRcdHRoaXMubWF4WSA9IE1hdGgubWF4KHRoaXMubWF4WSwgeSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmRhdGEucHVzaCh7eDogdGhpcy5kYXRhLmxlbmd0aCArIDEsIHk6IGRhdGFQb2ludH0pO1xuXHRcdHRoaXMucmVkcmF3KCk7XG5cdH1cblxuXHRwcml2YXRlIHJlZHJhdygpIHtcblx0XHQvLyBBZGp1c3QgdGhlIHggYW5kIHkgZG9tYWluLlxuXHRcdHRoaXMueFNjYWxlLmRvbWFpbihbMSwgdGhpcy5kYXRhLmxlbmd0aF0pO1xuXHRcdHRoaXMueVNjYWxlLmRvbWFpbihbdGhpcy5taW5ZLCB0aGlzLm1heFldKTtcblx0XHQvLyBBZGp1c3QgYWxsIHRoZSA8cGF0aD4gZWxlbWVudHMgKGxpbmVzKS5cblx0XHRsZXQgZ2V0UGF0aE1hcCA9IChsaW5lSW5kZXg6IG51bWJlcikgPT4ge1xuXHRcdFx0cmV0dXJuIGQzLnN2Zy5saW5lPERhdGFQb2ludD4oKVxuXHRcdFx0XHQueChkID0+IHRoaXMueFNjYWxlKGQueCkpXG5cdFx0XHRcdC55KGQgPT4gdGhpcy55U2NhbGUoZC55W2xpbmVJbmRleF0pKTtcblx0XHR9O1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1MaW5lczsgaSsrKSB7XG5cdFx0XHR0aGlzLnBhdGhzW2ldLmRhdHVtKHRoaXMuZGF0YSkuYXR0cihcImRcIiwgZ2V0UGF0aE1hcChpKSk7XG5cdFx0fVxuXHR9XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbi8qKlxuICogQSBub2RlIGluIGEgbmV1cmFsIG5ldHdvcmsuIEVhY2ggbm9kZSBoYXMgYSBzdGF0ZVxuICogKHRvdGFsIGlucHV0LCBvdXRwdXQsIGFuZCB0aGVpciByZXNwZWN0aXZlbHkgZGVyaXZhdGl2ZXMpIHdoaWNoIGNoYW5nZXNcbiAqIGFmdGVyIGV2ZXJ5IGZvcndhcmQgYW5kIGJhY2sgcHJvcGFnYXRpb24gcnVuLlxuICovXG5leHBvcnQgY2xhc3MgTm9kZSB7XG5cdGlkOiBzdHJpbmc7XG5cdC8qKiBMaXN0IG9mIGlucHV0IGxpbmtzLiAqL1xuXHRpbnB1dExpbmtzOiBMaW5rW10gPSBbXTtcblx0YmlhcyA9IDAuMTtcblx0LyoqIExpc3Qgb2Ygb3V0cHV0IGxpbmtzLiAqL1xuXHRvdXRwdXRzOiBMaW5rW10gPSBbXTtcblx0dG90YWxJbnB1dDogbnVtYmVyO1xuXHRvdXRwdXQ6IG51bWJlcjtcblx0bGF5ZXI6IG51bWJlcjtcblxuXHR0cnVlTGVhcm5pbmdSYXRlID0gMDtcblx0LyoqIEVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIHRoaXMgbm9kZSdzIG91dHB1dC4gKi9cblx0b3V0cHV0RGVyID0gMDtcblx0LyoqIEVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIHRoaXMgbm9kZSdzIHRvdGFsIGlucHV0LiAqL1xuXHRpbnB1dERlciA9IDA7XG5cdC8qKlxuXHQgKiBBY2N1bXVsYXRlZCBlcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byB0aGlzIG5vZGUncyB0b3RhbCBpbnB1dCBzaW5jZVxuXHQgKiB0aGUgbGFzdCB1cGRhdGUuIFRoaXMgZGVyaXZhdGl2ZSBlcXVhbHMgZEUvZGIgd2hlcmUgYiBpcyB0aGUgbm9kZSdzXG5cdCAqIGJpYXMgdGVybS5cblx0ICovXG5cdGFjY0lucHV0RGVyID0gMDtcblx0LyoqXG5cdCAqIE51bWJlciBvZiBhY2N1bXVsYXRlZCBlcnIuIGRlcml2YXRpdmVzIHdpdGggcmVzcGVjdCB0byB0aGUgdG90YWwgaW5wdXRcblx0ICogc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuXHQgKi9cblx0bnVtQWNjdW11bGF0ZWREZXJzID0gMDtcblx0LyoqIEFjdGl2YXRpb24gZnVuY3Rpb24gdGhhdCB0YWtlcyB0b3RhbCBpbnB1dCBhbmQgcmV0dXJucyBub2RlJ3Mgb3V0cHV0ICovXG5cdGFjdGl2YXRpb246IEFjdGl2YXRpb25GdW5jdGlvbjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBub2RlIHdpdGggdGhlIHByb3ZpZGVkIGlkIGFuZCBhY3RpdmF0aW9uIGZ1bmN0aW9uLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoaWQ6IHN0cmluZywgYWN0aXZhdGlvbjogQWN0aXZhdGlvbkZ1bmN0aW9uLCBpbml0WmVybz86IGJvb2xlYW4pIHtcblx0XHR0aGlzLmlkID0gaWQ7XG5cdFx0dGhpcy5hY3RpdmF0aW9uID0gYWN0aXZhdGlvbjtcblx0XHRpZiAoaW5pdFplcm8pIHtcblx0XHRcdHRoaXMuYmlhcyA9IDA7XG5cdFx0fVxuXHR9XG5cblx0LyoqIFJlY29tcHV0ZXMgdGhlIG5vZGUncyBvdXRwdXQgYW5kIHJldHVybnMgaXQuICovXG5cdHVwZGF0ZU91dHB1dCgpOiBudW1iZXIge1xuXHRcdC8vIFN0b3JlcyB0b3RhbCBpbnB1dCBpbnRvIHRoZSBub2RlLlxuXHRcdHRoaXMudG90YWxJbnB1dCA9IHRoaXMuYmlhcztcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0bGV0IGxpbmsgPSB0aGlzLmlucHV0TGlua3Nbal07XG5cdFx0XHR0aGlzLnRvdGFsSW5wdXQgKz0gbGluay53ZWlnaHQgKiBsaW5rLnNvdXJjZS5vdXRwdXQ7XG5cdFx0fVxuXHRcdHRoaXMub3V0cHV0ID0gdGhpcy5hY3RpdmF0aW9uLm91dHB1dCh0aGlzLnRvdGFsSW5wdXQpO1xuXHRcdHJldHVybiB0aGlzLm91dHB1dDtcblx0fVxufVxuXG4vKipcbiAqIEFuIGVycm9yIGZ1bmN0aW9uIGFuZCBpdHMgZGVyaXZhdGl2ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFcnJvckZ1bmN0aW9uIHtcblx0ZXJyb3I6IChvdXRwdXQ6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpID0+IG51bWJlcjtcblx0ZGVyOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PiBudW1iZXI7XG59XG5cbi8qKiBBIG5vZGUncyBhY3RpdmF0aW9uIGZ1bmN0aW9uIGFuZCBpdHMgZGVyaXZhdGl2ZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWN0aXZhdGlvbkZ1bmN0aW9uIHtcblx0b3V0cHV0OiAoaW5wdXQ6IG51bWJlcikgPT4gbnVtYmVyO1xuXHRkZXI6IChpbnB1dDogbnVtYmVyKSA9PiBudW1iZXI7XG59XG5cbi8qKiBGdW5jdGlvbiB0aGF0IGNvbXB1dGVzIGEgcGVuYWx0eSBjb3N0IGZvciBhIGdpdmVuIHdlaWdodCBpbiB0aGUgbmV0d29yay4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVndWxhcml6YXRpb25GdW5jdGlvbiB7XG5cdG91dHB1dDogKHdlaWdodDogbnVtYmVyKSA9PiBudW1iZXI7XG5cdGRlcjogKHdlaWdodDogbnVtYmVyKSA9PiBudW1iZXI7XG59XG5cbi8qKiBCdWlsdC1pbiBlcnJvciBmdW5jdGlvbnMgKi9cbmV4cG9ydCBjbGFzcyBFcnJvcnMge1xuXHRwdWJsaWMgc3RhdGljIFNRVUFSRTogRXJyb3JGdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0ZXJyb3I6IChvdXRwdXQ6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpID0+XG5cdFx0XHRcdDAuNSAqIE1hdGgucG93KG91dHB1dCAtIHRhcmdldCwgMiksXG5cdFx0XHRkZXI6IChvdXRwdXQ6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpID0+IG91dHB1dCAtIHRhcmdldFxuXHRcdH07XG59XG5cbi8qKiBQb2x5ZmlsbCBmb3IgVEFOSCAqL1xuKE1hdGggYXMgYW55KS50YW5oID0gKE1hdGggYXMgYW55KS50YW5oIHx8IGZ1bmN0aW9uICh4KSB7XG5cdGlmICh4ID09PSBJbmZpbml0eSkge1xuXHRcdHJldHVybiAxO1xuXHR9IGVsc2UgaWYgKHggPT09IC1JbmZpbml0eSkge1xuXHRcdHJldHVybiAtMTtcblx0fSBlbHNlIHtcblx0XHRsZXQgZTJ4ID0gTWF0aC5leHAoMiAqIHgpO1xuXHRcdHJldHVybiAoZTJ4IC0gMSkgLyAoZTJ4ICsgMSk7XG5cdH1cbn07XG5cbi8qKiBCdWlsdC1pbiBhY3RpdmF0aW9uIGZ1bmN0aW9ucyAqL1xuZXhwb3J0IGNsYXNzIEFjdGl2YXRpb25zIHtcblx0cHVibGljIHN0YXRpYyBUQU5IOiBBY3RpdmF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogeCA9PiAoTWF0aCBhcyBhbnkpLnRhbmgoeCksXG5cdFx0XHRkZXI6IHggPT4ge1xuXHRcdFx0XHRsZXQgb3V0cHV0ID0gQWN0aXZhdGlvbnMuVEFOSC5vdXRwdXQoeCk7XG5cdFx0XHRcdHJldHVybiAxIC0gb3V0cHV0ICogb3V0cHV0O1xuXHRcdFx0fVxuXHRcdH07XG5cdHB1YmxpYyBzdGF0aWMgUkVMVTogQWN0aXZhdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHggPT4gTWF0aC5tYXgoMCwgeCksXG5cdFx0XHRkZXI6IHggPT4geCA8PSAwID8gMCA6IDFcblx0XHR9O1xuXHRwdWJsaWMgc3RhdGljIFNJR01PSUQ6IEFjdGl2YXRpb25GdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0b3V0cHV0OiB4ID0+IDEgLyAoMSArIE1hdGguZXhwKC14KSksXG5cdFx0XHRkZXI6IHggPT4ge1xuXHRcdFx0XHRsZXQgb3V0cHV0ID0gQWN0aXZhdGlvbnMuU0lHTU9JRC5vdXRwdXQoeCk7XG5cdFx0XHRcdHJldHVybiBvdXRwdXQgKiAoMSAtIG91dHB1dCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0cHVibGljIHN0YXRpYyBMSU5FQVI6IEFjdGl2YXRpb25GdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0b3V0cHV0OiB4ID0+IHgsXG5cdFx0XHRkZXI6IHggPT4gMVxuXHRcdH07XG5cdHB1YmxpYyBzdGF0aWMgU0lOWDogQWN0aXZhdGlvbkZ1bmN0aW9uID1cblx0XHR7XG5cdFx0XHRvdXRwdXQ6IHggPT4gTWF0aC5zaW4oeCksXG5cdFx0XHRkZXI6IHggPT4gTWF0aC5jb3MoeClcblx0XHR9O1xufVxuXG4vKiogQnVpbGQtaW4gcmVndWxhcml6YXRpb24gZnVuY3Rpb25zICovXG5leHBvcnQgY2xhc3MgUmVndWxhcml6YXRpb25GdW5jdGlvbiB7XG5cdHB1YmxpYyBzdGF0aWMgTDE6IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24gPVxuXHRcdHtcblx0XHRcdG91dHB1dDogdyA9PiBNYXRoLmFicyh3KSxcblx0XHRcdGRlcjogdyA9PiB3IDwgMCA/IC0xIDogKHcgPiAwID8gMSA6IDApXG5cdFx0fTtcblx0cHVibGljIHN0YXRpYyBMMjogUmVndWxhcml6YXRpb25GdW5jdGlvbiA9XG5cdFx0e1xuXHRcdFx0b3V0cHV0OiB3ID0+IDAuNSAqIHcgKiB3LFxuXHRcdFx0ZGVyOiB3ID0+IHdcblx0XHR9O1xufVxuXG4vKipcbiAqIEEgbGluayBpbiBhIG5ldXJhbCBuZXR3b3JrLiBFYWNoIGxpbmsgaGFzIGEgd2VpZ2h0IGFuZCBhIHNvdXJjZSBhbmRcbiAqIGRlc3RpbmF0aW9uIG5vZGUuIEFsc28gaXQgaGFzIGFuIGludGVybmFsIHN0YXRlIChlcnJvciBkZXJpdmF0aXZlXG4gKiB3aXRoIHJlc3BlY3QgdG8gYSBwYXJ0aWN1bGFyIGlucHV0KSB3aGljaCBnZXRzIHVwZGF0ZWQgYWZ0ZXJcbiAqIGEgcnVuIG9mIGJhY2sgcHJvcGFnYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBMaW5rIHtcblx0aWQ6IHN0cmluZztcblx0c291cmNlOiBOb2RlO1xuXHRkZXN0OiBOb2RlO1xuXHR3ZWlnaHQgPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuXHRpc0RlYWQgPSBmYWxzZTtcblx0LyoqIEVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIHRoaXMgd2VpZ2h0LiAqL1xuXHRlcnJvckRlciA9IDA7XG5cdC8qKiBBY2N1bXVsYXRlZCBlcnJvciBkZXJpdmF0aXZlIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS4gKi9cblx0YWNjRXJyb3JEZXIgPSAwO1xuXHQvKiogTnVtYmVyIG9mIGFjY3VtdWxhdGVkIGRlcml2YXRpdmVzIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS4gKi9cblx0bnVtQWNjdW11bGF0ZWREZXJzID0gMDtcblx0cmVndWxhcml6YXRpb246IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb247XG5cblx0dHJ1ZUxlYXJuaW5nUmF0ZSA9IDA7XG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdHMgYSBsaW5rIGluIHRoZSBuZXVyYWwgbmV0d29yayBpbml0aWFsaXplZCB3aXRoIHJhbmRvbSB3ZWlnaHQuXG5cdCAqXG5cdCAqIEBwYXJhbSBzb3VyY2UgVGhlIHNvdXJjZSBub2RlLlxuXHQgKiBAcGFyYW0gZGVzdCBUaGUgZGVzdGluYXRpb24gbm9kZS5cblx0ICogQHBhcmFtIHJlZ3VsYXJpemF0aW9uIFRoZSByZWd1bGFyaXphdGlvbiBmdW5jdGlvbiB0aGF0IGNvbXB1dGVzIHRoZVxuXHQgKiAgICAgcGVuYWx0eSBmb3IgdGhpcyB3ZWlnaHQuIElmIG51bGwsIHRoZXJlIHdpbGwgYmUgbm8gcmVndWxhcml6YXRpb24uXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihzb3VyY2U6IE5vZGUsIGRlc3Q6IE5vZGUsXG5cdFx0XHRcdHJlZ3VsYXJpemF0aW9uOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uLCBpbml0WmVybz86IGJvb2xlYW4pIHtcblx0XHR0aGlzLmlkID0gc291cmNlLmlkICsgXCItXCIgKyBkZXN0LmlkO1xuXHRcdHRoaXMuc291cmNlID0gc291cmNlO1xuXHRcdHRoaXMuZGVzdCA9IGRlc3Q7XG5cdFx0dGhpcy5yZWd1bGFyaXphdGlvbiA9IHJlZ3VsYXJpemF0aW9uO1xuXHRcdGlmIChpbml0WmVybykge1xuXHRcdFx0dGhpcy53ZWlnaHQgPSAwO1xuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIEJ1aWxkcyBhIG5ldXJhbCBuZXR3b3JrLlxuICpcbiAqIEBwYXJhbSBuZXR3b3JrU2hhcGUgVGhlIHNoYXBlIG9mIHRoZSBuZXR3b3JrLiBFLmcuIFsxLCAyLCAzLCAxXSBtZWFuc1xuICogICB0aGUgbmV0d29yayB3aWxsIGhhdmUgb25lIGlucHV0IG5vZGUsIDIgbm9kZXMgaW4gZmlyc3QgaGlkZGVuIGxheWVyLFxuICogICAzIG5vZGVzIGluIHNlY29uZCBoaWRkZW4gbGF5ZXIgYW5kIDEgb3V0cHV0IG5vZGUuXG4gKiBAcGFyYW0gYWN0aXZhdGlvbiBUaGUgYWN0aXZhdGlvbiBmdW5jdGlvbiBvZiBldmVyeSBoaWRkZW4gbm9kZS5cbiAqIEBwYXJhbSBvdXRwdXRBY3RpdmF0aW9uIFRoZSBhY3RpdmF0aW9uIGZ1bmN0aW9uIGZvciB0aGUgb3V0cHV0IG5vZGVzLlxuICogQHBhcmFtIHJlZ3VsYXJpemF0aW9uIFRoZSByZWd1bGFyaXphdGlvbiBmdW5jdGlvbiB0aGF0IGNvbXB1dGVzIGEgcGVuYWx0eVxuICogICAgIGZvciBhIGdpdmVuIHdlaWdodCAocGFyYW1ldGVyKSBpbiB0aGUgbmV0d29yay4gSWYgbnVsbCwgdGhlcmUgd2lsbCBiZVxuICogICAgIG5vIHJlZ3VsYXJpemF0aW9uLlxuICogQHBhcmFtIGlucHV0SWRzIExpc3Qgb2YgaWRzIGZvciB0aGUgaW5wdXQgbm9kZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE5ldHdvcmsoXG5cdG5ldHdvcmtTaGFwZTogbnVtYmVyW10sIGFjdGl2YXRpb246IEFjdGl2YXRpb25GdW5jdGlvbixcblx0b3V0cHV0QWN0aXZhdGlvbjogQWN0aXZhdGlvbkZ1bmN0aW9uLFxuXHRyZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbixcblx0aW5wdXRJZHM6IHN0cmluZ1tdLCBpbml0WmVybz86IGJvb2xlYW4pOiBOb2RlW11bXSB7XG5cdGxldCBudW1MYXllcnMgPSBuZXR3b3JrU2hhcGUubGVuZ3RoO1xuXHRsZXQgaWQgPSAxO1xuXHQvKiogTGlzdCBvZiBsYXllcnMsIHdpdGggZWFjaCBsYXllciBiZWluZyBhIGxpc3Qgb2Ygbm9kZXMuICovXG5cdGxldCBuZXR3b3JrOiBOb2RlW11bXSA9IFtdO1xuXHRmb3IgKGxldCBsYXllcklkeCA9IDA7IGxheWVySWR4IDwgbnVtTGF5ZXJzOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGlzT3V0cHV0TGF5ZXIgPSBsYXllcklkeCA9PT0gbnVtTGF5ZXJzIC0gMTtcblx0XHRsZXQgaXNJbnB1dExheWVyID0gbGF5ZXJJZHggPT09IDA7XG5cdFx0bGV0IGN1cnJlbnRMYXllcjogTm9kZVtdID0gW107XG5cdFx0bmV0d29yay5wdXNoKGN1cnJlbnRMYXllcik7XG5cdFx0bGV0IG51bU5vZGVzID0gbmV0d29ya1NoYXBlW2xheWVySWR4XTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG51bU5vZGVzOyBpKyspIHtcblx0XHRcdGxldCBub2RlSWQgPSBpZC50b1N0cmluZygpO1xuXHRcdFx0aWYgKGlzSW5wdXRMYXllcikge1xuXHRcdFx0XHRub2RlSWQgPSBpbnB1dElkc1tpXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlkKys7XG5cdFx0XHR9XG5cdFx0XHRsZXQgbm9kZSA9IG5ldyBOb2RlKG5vZGVJZCwgaXNPdXRwdXRMYXllciA/IG91dHB1dEFjdGl2YXRpb24gOiBhY3RpdmF0aW9uLCBpbml0WmVybyk7XG5cdFx0XHRub2RlLmxheWVyID0gbGF5ZXJJZHg7XG5cdFx0XHRjdXJyZW50TGF5ZXIucHVzaChub2RlKTtcblx0XHRcdGlmIChsYXllcklkeCA+PSAxKSB7XG5cdFx0XHRcdC8vIEFkZCBsaW5rcyBmcm9tIG5vZGVzIGluIHRoZSBwcmV2aW91cyBsYXllciB0byB0aGlzIG5vZGUuXG5cdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbmV0d29ya1tsYXllcklkeCAtIDFdLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0bGV0IHByZXZOb2RlID0gbmV0d29ya1tsYXllcklkeCAtIDFdW2pdO1xuXHRcdFx0XHRcdGxldCBsaW5rID0gbmV3IExpbmsocHJldk5vZGUsIG5vZGUsIHJlZ3VsYXJpemF0aW9uLCBpbml0WmVybyk7XG5cdFx0XHRcdFx0cHJldk5vZGUub3V0cHV0cy5wdXNoKGxpbmspO1xuXHRcdFx0XHRcdG5vZGUuaW5wdXRMaW5rcy5wdXNoKGxpbmspO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBuZXR3b3JrO1xufVxuXG4vKipcbiAqIFJ1bnMgYSBmb3J3YXJkIHByb3BhZ2F0aW9uIG9mIHRoZSBwcm92aWRlZCBpbnB1dCB0aHJvdWdoIHRoZSBwcm92aWRlZFxuICogbmV0d29yay4gVGhpcyBtZXRob2QgbW9kaWZpZXMgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBuZXR3b3JrIC0gdGhlXG4gKiB0b3RhbCBpbnB1dCBhbmQgb3V0cHV0IG9mIGVhY2ggbm9kZSBpbiB0aGUgbmV0d29yay5cbiAqXG4gKiBAcGFyYW0gbmV0d29yayBUaGUgbmV1cmFsIG5ldHdvcmsuXG4gKiBAcGFyYW0gaW5wdXRzIFRoZSBpbnB1dCBhcnJheS4gSXRzIGxlbmd0aCBzaG91bGQgbWF0Y2ggdGhlIG51bWJlciBvZiBpbnB1dFxuICogICAgIG5vZGVzIGluIHRoZSBuZXR3b3JrLlxuICogQHJldHVybiBUaGUgZmluYWwgb3V0cHV0IG9mIHRoZSBuZXR3b3JrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZFByb3AobmV0d29yazogTm9kZVtdW10sIGlucHV0czogbnVtYmVyW10pOiBudW1iZXIge1xuXHRsZXQgaW5wdXRMYXllciA9IG5ldHdvcmtbMF07XG5cdGlmIChpbnB1dHMubGVuZ3RoICE9PSBpbnB1dExheWVyLmxlbmd0aCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBudW1iZXIgb2YgaW5wdXRzIG11c3QgbWF0Y2ggdGhlIG51bWJlciBvZiBub2RlcyBpblwiICtcblx0XHRcdFwiIHRoZSBpbnB1dCBsYXllclwiKTtcblx0fVxuXHQvLyBVcGRhdGUgdGhlIGlucHV0IGxheWVyLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgbm9kZSA9IGlucHV0TGF5ZXJbaV07XG5cdFx0bm9kZS5vdXRwdXQgPSBpbnB1dHNbaV07XG5cdH1cblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdC8vIFVwZGF0ZSBhbGwgdGhlIG5vZGVzIGluIHRoaXMgbGF5ZXIuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0bm9kZS51cGRhdGVPdXRwdXQoKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5ldHdvcmtbbmV0d29yay5sZW5ndGggLSAxXVswXS5vdXRwdXQ7XG59XG5cbi8qKlxuICogUnVucyBhIGJhY2t3YXJkIHByb3BhZ2F0aW9uIHVzaW5nIHRoZSBwcm92aWRlZCB0YXJnZXQgYW5kIHRoZVxuICogY29tcHV0ZWQgb3V0cHV0IG9mIHRoZSBwcmV2aW91cyBjYWxsIHRvIGZvcndhcmQgcHJvcGFnYXRpb24uXG4gKiBUaGlzIG1ldGhvZCBtb2RpZmllcyB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIG5ldHdvcmsgLSB0aGUgZXJyb3JcbiAqIGRlcml2YXRpdmVzIHdpdGggcmVzcGVjdCB0byBlYWNoIG5vZGUsIGFuZCBlYWNoIHdlaWdodFxuICogaW4gdGhlIG5ldHdvcmsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiYWNrUHJvcChuZXR3b3JrOiBOb2RlW11bXSwgdGFyZ2V0OiBudW1iZXIsIGVycm9yRnVuYzogRXJyb3JGdW5jdGlvbik6IHZvaWQge1xuXHQvLyBUaGUgb3V0cHV0IG5vZGUgaXMgYSBzcGVjaWFsIGNhc2UuIFdlIHVzZSB0aGUgdXNlci1kZWZpbmVkIGVycm9yXG5cdC8vIGZ1bmN0aW9uIGZvciB0aGUgZGVyaXZhdGl2ZS5cblx0bGV0IG91dHB1dE5vZGUgPSBuZXR3b3JrW25ldHdvcmsubGVuZ3RoIC0gMV1bMF07XG5cdG91dHB1dE5vZGUub3V0cHV0RGVyID0gZXJyb3JGdW5jLmRlcihvdXRwdXROb2RlLm91dHB1dCwgdGFyZ2V0KTtcblxuXHQvLyBHbyB0aHJvdWdoIHRoZSBsYXllcnMgYmFja3dhcmRzLlxuXHRmb3IgKGxldCBsYXllcklkeCA9IG5ldHdvcmsubGVuZ3RoIC0gMTsgbGF5ZXJJZHggPj0gMTsgbGF5ZXJJZHgtLSkge1xuXHRcdGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcblx0XHQvLyBDb21wdXRlIHRoZSBlcnJvciBkZXJpdmF0aXZlIG9mIGVhY2ggbm9kZSB3aXRoIHJlc3BlY3QgdG86XG5cdFx0Ly8gMSkgaXRzIHRvdGFsIGlucHV0XG5cdFx0Ly8gMikgZWFjaCBvZiBpdHMgaW5wdXQgd2VpZ2h0cy5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRub2RlLmlucHV0RGVyID0gbm9kZS5vdXRwdXREZXIgKiBub2RlLmFjdGl2YXRpb24uZGVyKG5vZGUudG90YWxJbnB1dCk7XG5cdFx0XHRub2RlLmFjY0lucHV0RGVyICs9IG5vZGUuaW5wdXREZXI7XG5cdFx0XHRub2RlLm51bUFjY3VtdWxhdGVkRGVycysrO1xuXHRcdH1cblxuXHRcdC8vIEVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIGVhY2ggd2VpZ2h0IGNvbWluZyBpbnRvIHRoZSBub2RlLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2pdO1xuXHRcdFx0XHRpZiAobGluay5pc0RlYWQpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaW5rLmVycm9yRGVyID0gbm9kZS5pbnB1dERlciAqIGxpbmsuc291cmNlLm91dHB1dDtcblx0XHRcdFx0bGluay5hY2NFcnJvckRlciArPSBsaW5rLmVycm9yRGVyO1xuXHRcdFx0XHRsaW5rLm51bUFjY3VtdWxhdGVkRGVycysrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAobGF5ZXJJZHggPT09IDEpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRsZXQgcHJldkxheWVyID0gbmV0d29ya1tsYXllcklkeCAtIDFdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcHJldkxheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbm9kZSA9IHByZXZMYXllcltpXTtcblx0XHRcdC8vIENvbXB1dGUgdGhlIGVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIGVhY2ggbm9kZSdzIG91dHB1dC5cblx0XHRcdG5vZGUub3V0cHV0RGVyID0gMDtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5vdXRwdXRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGxldCBvdXRwdXQgPSBub2RlLm91dHB1dHNbal07XG5cdFx0XHRcdG5vZGUub3V0cHV0RGVyICs9IG91dHB1dC53ZWlnaHQgKiBvdXRwdXQuZGVzdC5pbnB1dERlcjtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSB3ZWlnaHRzIG9mIHRoZSBuZXR3b3JrIHVzaW5nIHRoZSBwcmV2aW91c2x5IGFjY3VtdWxhdGVkIGVycm9yXG4gKiBkZXJpdmF0aXZlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVdlaWdodHMobmV0d29yazogTm9kZVtdW10sIGxlYXJuaW5nUmF0ZTogbnVtYmVyLCByZWd1bGFyaXphdGlvblJhdGU6IG51bWJlcikge1xuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0Ly8gVXBkYXRlIHRoZSBub2RlJ3MgYmlhcy5cblx0XHRcdGlmIChub2RlLm51bUFjY3VtdWxhdGVkRGVycyA+IDApIHtcblx0XHRcdFx0bm9kZS50cnVlTGVhcm5pbmdSYXRlID0gbm9kZS5hY2NJbnB1dERlciAvIG5vZGUubnVtQWNjdW11bGF0ZWREZXJzO1xuXHRcdFx0XHRub2RlLmJpYXMgLT0gbGVhcm5pbmdSYXRlICogbm9kZS50cnVlTGVhcm5pbmdSYXRlOyAvLyBub2RlLmFjY0lucHV0RGVyIC8gbm9kZS5udW1BY2N1bXVsYXRlZERlcnM7XG5cdFx0XHRcdG5vZGUuYWNjSW5wdXREZXIgPSAwO1xuXHRcdFx0XHRub2RlLm51bUFjY3VtdWxhdGVkRGVycyA9IDA7XG5cdFx0XHR9XG5cdFx0XHQvLyBVcGRhdGUgdGhlIHdlaWdodHMgY29taW5nIGludG8gdGhpcyBub2RlLlxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBub2RlLmlucHV0TGlua3MubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0bGV0IGxpbmsgPSBub2RlLmlucHV0TGlua3Nbal07XG5cdFx0XHRcdGlmIChsaW5rLmlzRGVhZCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCByZWd1bERlciA9IGxpbmsucmVndWxhcml6YXRpb24gP1xuXHRcdFx0XHRcdGxpbmsucmVndWxhcml6YXRpb24uZGVyKGxpbmsud2VpZ2h0KSA6IDA7XG5cdFx0XHRcdGlmIChsaW5rLm51bUFjY3VtdWxhdGVkRGVycyA+IDApIHtcblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIHdlaWdodCBiYXNlZCBvbiBkRS9kdy5cblx0XHRcdFx0XHRsaW5rLnRydWVMZWFybmluZ1JhdGUgPSBsaW5rLmFjY0Vycm9yRGVyIC8gbGluay5udW1BY2N1bXVsYXRlZERlcnM7XG5cdFx0XHRcdFx0bGluay53ZWlnaHQgPSBsaW5rLndlaWdodCAtIGxlYXJuaW5nUmF0ZSAqIGxpbmsudHJ1ZUxlYXJuaW5nUmF0ZTtcblxuXHRcdFx0XHRcdC8vIEZ1cnRoZXIgdXBkYXRlIHRoZSB3ZWlnaHQgYmFzZWQgb24gcmVndWxhcml6YXRpb24uXG5cdFx0XHRcdFx0bGV0IG5ld0xpbmtXZWlnaHQgPSBsaW5rLndlaWdodCAtXG5cdFx0XHRcdFx0XHQobGVhcm5pbmdSYXRlICogcmVndWxhcml6YXRpb25SYXRlKSAqIHJlZ3VsRGVyO1xuXHRcdFx0XHRcdGlmIChsaW5rLnJlZ3VsYXJpemF0aW9uID09PSBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uLkwxICYmXG5cdFx0XHRcdFx0XHRsaW5rLndlaWdodCAqIG5ld0xpbmtXZWlnaHQgPCAwKSB7XG5cdFx0XHRcdFx0XHQvLyBUaGUgd2VpZ2h0IGNyb3NzZWQgMCBkdWUgdG8gdGhlIHJlZ3VsYXJpemF0aW9uIHRlcm0uIFNldCBpdCB0byAwLlxuXHRcdFx0XHRcdFx0bGluay53ZWlnaHQgPSAwO1xuXHRcdFx0XHRcdFx0bGluay5pc0RlYWQgPSB0cnVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsaW5rLndlaWdodCA9IG5ld0xpbmtXZWlnaHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGxpbmsuYWNjRXJyb3JEZXIgPSAwO1xuXHRcdFx0XHRcdGxpbmsubnVtQWNjdW11bGF0ZWREZXJzID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG4vKiogSXRlcmF0ZXMgb3ZlciBldmVyeSBub2RlIGluIHRoZSBuZXR3b3JrLyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvckVhY2hOb2RlKG5ldHdvcms6IE5vZGVbXVtdLCBpZ25vcmVJbnB1dHM6IGJvb2xlYW4sXG5cdFx0XHRcdFx0XHRcdGFjY2Vzc29yOiAobm9kZTogTm9kZSkgPT4gYW55KSB7XG5cdGZvciAobGV0IGxheWVySWR4ID0gaWdub3JlSW5wdXRzID8gMSA6IDA7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0YWNjZXNzb3Iobm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBvdXRwdXQgbm9kZSBpbiB0aGUgbmV0d29yay4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPdXRwdXROb2RlKG5ldHdvcms6IE5vZGVbXVtdKSB7XG5cdHJldHVybiBuZXR3b3JrW25ldHdvcmsubGVuZ3RoIC0gMV1bMF07XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5pbXBvcnQge0xpbmt9IGZyb20gXCIuL25uXCI7XG5cbmRlY2xhcmUgdmFyICQ6IGFueTtcblxuaW1wb3J0ICogYXMgbm4gZnJvbSBcIi4vbm5cIjtcbmltcG9ydCB7SGVhdE1hcCwgcmVkdWNlTWF0cml4fSBmcm9tIFwiLi9oZWF0bWFwXCI7XG5pbXBvcnQge1xuXHRTdGF0ZSxcblx0ZGF0YXNldHMsXG5cdHJlZ0RhdGFzZXRzLFxuXHRhY3RpdmF0aW9ucyxcblx0cHJvYmxlbXMsXG5cdHJlZ3VsYXJpemF0aW9ucyxcblx0Z2V0S2V5RnJvbVZhbHVlLFxuXHRQcm9ibGVtXG59IGZyb20gXCIuL3N0YXRlXCI7XG5pbXBvcnQge0V4YW1wbGUyRCwgc2h1ZmZsZSwgRGF0YUdlbmVyYXRvcn0gZnJvbSBcIi4vZGF0YXNldFwiO1xuaW1wb3J0IHtBcHBlbmRpbmdMaW5lQ2hhcnR9IGZyb20gXCIuL2xpbmVjaGFydFwiO1xuXG5sZXQgbWFpbldpZHRoO1xuXG50eXBlIGVuZXJneVR5cGUgPSB7XG5cdGVWYWw6IG51bWJlcixcblx0bGFiZWw6IG51bWJlclxufTtcblxuZnVuY3Rpb24gbXRydW5jKHY6IG51bWJlcikge1xuXHR2ID0gK3Y7XG5cdHJldHVybiAodiAtIHYgJSAxKSB8fCAoIWlzRmluaXRlKHYpIHx8IHYgPT09IDAgPyB2IDogdiA8IDAgPyAtMCA6IDApO1xufVxuXG5mdW5jdGlvbiBsb2cyKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGgubG9nKDIpO1xufVxuXG5mdW5jdGlvbiBsb2cxMCh4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZygxMCk7XG59XG5cbmZ1bmN0aW9uIHNpZ25hbE9mKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiBsb2cyKDEgKyBNYXRoLmFicyh4KSk7XG59XG5cbmZ1bmN0aW9uIFNOUih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gMTAgKiBsb2cxMCh4KTtcbn1cblxuLy8gTW9yZSBzY3JvbGxpbmdcbmQzLnNlbGVjdChcIi5tb3JlIGJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0bGV0IHBvc2l0aW9uID0gODAwO1xuXHRkMy50cmFuc2l0aW9uKClcblx0XHQuZHVyYXRpb24oMTAwMClcblx0XHQudHdlZW4oXCJzY3JvbGxcIiwgc2Nyb2xsVHdlZW4ocG9zaXRpb24pKTtcbn0pO1xuXG5mdW5jdGlvbiBzY3JvbGxUd2VlbihvZmZzZXQpIHtcblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgaSA9IGQzLmludGVycG9sYXRlTnVtYmVyKHdpbmRvdy5wYWdlWU9mZnNldCB8fFxuXHRcdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCwgb2Zmc2V0KTtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdHNjcm9sbFRvKDAsIGkodCkpO1xuXHRcdH07XG5cdH07XG59XG5cbmNvbnN0IFJFQ1RfU0laRSA9IDMwO1xuY29uc3QgQklBU19TSVpFID0gNTtcbmNvbnN0IE5VTV9TQU1QTEVTX0NMQVNTSUZZID0gNTAwO1xuY29uc3QgTlVNX1NBTVBMRVNfUkVHUkVTUyA9IDEyMDA7XG5jb25zdCBERU5TSVRZID0gMTAwO1xuXG5jb25zdCBNQVhfTkVVUk9OUyA9IDMyO1xuY29uc3QgTUFYX0hMQVlFUlMgPSAxMDtcblxuLy8gUm91bmRpbmcgb2ZmIG9mIHRyYWluaW5nIGRhdGEuIFVzZWQgYnkgZ2V0UmVxQ2FwYWNpdHlcbmNvbnN0IFJFUV9DQVBfUk9VTkRJTkcgPSAtMTtcblxuZW51bSBIb3ZlclR5cGUge1xuXHRCSUFTLCBXRUlHSFRcbn1cblxuaW50ZXJmYWNlIElucHV0RmVhdHVyZSB7XG5cdGY6ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gbnVtYmVyO1xuXHRsYWJlbD86IHN0cmluZztcbn1cblxubGV0IElOUFVUUzogeyBbbmFtZTogc3RyaW5nXTogSW5wdXRGZWF0dXJlIH0gPSB7XG5cdFwieFwiOiB7ZjogKHgsIHkpID0+IHgsIGxhYmVsOiBcIlhfMVwifSxcblx0XCJ5XCI6IHtmOiAoeCwgeSkgPT4geSwgbGFiZWw6IFwiWF8yXCJ9LFxuXHRcInhTcXVhcmVkXCI6IHtmOiAoeCwgeSkgPT4geCAqIHgsIGxhYmVsOiBcIlhfMV4yXCJ9LFxuXHRcInlTcXVhcmVkXCI6IHtmOiAoeCwgeSkgPT4geSAqIHksIGxhYmVsOiBcIlhfMl4yXCJ9LFxuXHRcInhUaW1lc1lcIjoge2Y6ICh4LCB5KSA9PiB4ICogeSwgbGFiZWw6IFwiWF8xWF8yXCJ9LFxuXHRcInNpblhcIjoge2Y6ICh4LCB5KSA9PiBNYXRoLnNpbih4KSwgbGFiZWw6IFwic2luKFhfMSlcIn0sXG5cdFwic2luWVwiOiB7ZjogKHgsIHkpID0+IE1hdGguc2luKHkpLCBsYWJlbDogXCJzaW4oWF8yKVwifSxcbn07XG5cbmxldCBISURBQkxFX0NPTlRST0xTID1cblx0W1xuXHRcdFtcIlNob3cgdGVzdCBkYXRhXCIsIFwic2hvd1Rlc3REYXRhXCJdLFxuXHRcdFtcIkRpc2NyZXRpemUgb3V0cHV0XCIsIFwiZGlzY3JldGl6ZVwiXSxcblx0XHRbXCJQbGF5IGJ1dHRvblwiLCBcInBsYXlCdXR0b25cIl0sXG5cdFx0W1wiU3RlcCBidXR0b25cIiwgXCJzdGVwQnV0dG9uXCJdLFxuXHRcdFtcIlJlc2V0IGJ1dHRvblwiLCBcInJlc2V0QnV0dG9uXCJdLFxuXHRcdFtcIlJhdGUgc2NhbGUgZmFjdG9yXCIsIFwibGVhcm5pbmdSYXRlXCJdLFxuXHRcdFtcIkxlYXJuaW5nIHJhdGVcIiwgXCJ0cnVlTGVhcm5pbmdSYXRlXCJdLFxuXHRcdFtcIkFjdGl2YXRpb25cIiwgXCJhY3RpdmF0aW9uXCJdLFxuXHRcdFtcIlJlZ3VsYXJpemF0aW9uXCIsIFwicmVndWxhcml6YXRpb25cIl0sXG5cdFx0W1wiUmVndWxhcml6YXRpb24gcmF0ZVwiLCBcInJlZ3VsYXJpemF0aW9uUmF0ZVwiXSxcblx0XHRbXCJQcm9ibGVtIHR5cGVcIiwgXCJwcm9ibGVtXCJdLFxuXHRcdFtcIldoaWNoIGRhdGFzZXRcIiwgXCJkYXRhc2V0XCJdLFxuXHRcdFtcIlJhdGlvIHRyYWluIGRhdGFcIiwgXCJwZXJjVHJhaW5EYXRhXCJdLFxuXHRcdFtcIk5vaXNlIGxldmVsXCIsIFwibm9pc2VcIl0sXG5cdFx0W1wiQmF0Y2ggc2l6ZVwiLCBcImJhdGNoU2l6ZVwiXSxcblx0XHRbXCIjIG9mIGhpZGRlbiBsYXllcnNcIiwgXCJudW1IaWRkZW5MYXllcnNcIl0sXG5cdF07XG5cbmNsYXNzIFBsYXllciB7XG5cdHByaXZhdGUgdGltZXJJbmRleCA9IDA7XG5cdHByaXZhdGUgaXNQbGF5aW5nID0gZmFsc2U7XG5cdHByaXZhdGUgY2FsbGJhY2s6IChpc1BsYXlpbmc6IGJvb2xlYW4pID0+IHZvaWQgPSBudWxsO1xuXG5cdC8qKiBQbGF5cy9wYXVzZXMgdGhlIHBsYXllci4gKi9cblx0cGxheU9yUGF1c2UoKSB7XG5cdFx0aWYgKHRoaXMuaXNQbGF5aW5nKSB7XG5cdFx0XHR0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5wYXVzZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmlzUGxheWluZyA9IHRydWU7XG5cdFx0XHRpZiAoaXRlciA9PT0gMCkge1xuXHRcdFx0XHRzaW11bGF0aW9uU3RhcnRlZCgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5wbGF5KCk7XG5cdFx0fVxuXHR9XG5cblx0b25QbGF5UGF1c2UoY2FsbGJhY2s6IChpc1BsYXlpbmc6IGJvb2xlYW4pID0+IHZvaWQpIHtcblx0XHR0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdH1cblxuXHRwbGF5KCkge1xuXHRcdHRoaXMucGF1c2UoKTtcblx0XHR0aGlzLmlzUGxheWluZyA9IHRydWU7XG5cdFx0aWYgKHRoaXMuY2FsbGJhY2spIHtcblx0XHRcdHRoaXMuY2FsbGJhY2sodGhpcy5pc1BsYXlpbmcpO1xuXHRcdH1cblx0XHR0aGlzLnN0YXJ0KHRoaXMudGltZXJJbmRleCk7XG5cdH1cblxuXHRwYXVzZSgpIHtcblx0XHR0aGlzLnRpbWVySW5kZXgrKztcblx0XHR0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuXHRcdGlmICh0aGlzLmNhbGxiYWNrKSB7XG5cdFx0XHR0aGlzLmNhbGxiYWNrKHRoaXMuaXNQbGF5aW5nKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0YXJ0KGxvY2FsVGltZXJJbmRleDogbnVtYmVyKSB7XG5cdFx0ZDMudGltZXIoKCkgPT4ge1xuXHRcdFx0aWYgKGxvY2FsVGltZXJJbmRleCA8IHRoaXMudGltZXJJbmRleCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTsgIC8vIERvbmUuXG5cdFx0XHR9XG5cdFx0XHRvbmVTdGVwKCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7ICAvLyBOb3QgZG9uZS5cblx0XHR9LCAwKTtcblx0fVxufVxuXG5sZXQgc3RhdGUgPSBTdGF0ZS5kZXNlcmlhbGl6ZVN0YXRlKCk7XG5cbi8vIEZpbHRlciBvdXQgaW5wdXRzIHRoYXQgYXJlIGhpZGRlbi5cbnN0YXRlLmdldEhpZGRlblByb3BzKCkuZm9yRWFjaChwcm9wID0+IHtcblx0aWYgKHByb3AgaW4gSU5QVVRTKSB7XG5cdFx0ZGVsZXRlIElOUFVUU1twcm9wXTtcblx0fVxufSk7XG5cbmxldCBib3VuZGFyeTogeyBbaWQ6IHN0cmluZ106IG51bWJlcltdW10gfSA9IHt9O1xubGV0IHNlbGVjdGVkTm9kZUlkOiBzdHJpbmcgPSBudWxsO1xuLy8gUGxvdCB0aGUgaGVhdG1hcC5cbmxldCB4RG9tYWluOiBbbnVtYmVyLCBudW1iZXJdID0gWy02LCA2XTtcbmxldCBoZWF0TWFwID1cblx0bmV3IEhlYXRNYXAoMzAwLCBERU5TSVRZLCB4RG9tYWluLCB4RG9tYWluLCBkMy5zZWxlY3QoXCIjaGVhdG1hcFwiKSxcblx0XHR7c2hvd0F4ZXM6IHRydWV9KTtcbmxldCBsaW5rV2lkdGhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdC5kb21haW4oWzAsIDVdKVxuXHQucmFuZ2UoWzEsIDEwXSlcblx0LmNsYW1wKHRydWUpO1xubGV0IGNvbG9yU2NhbGUgPSBkMy5zY2FsZS5saW5lYXI8c3RyaW5nPigpXG5cdC5kb21haW4oWy0xLCAwLCAxXSlcblx0LnJhbmdlKFtcIiMwODc3YmRcIiwgXCIjZThlYWViXCIsIFwiI2Y1OTMyMlwiXSlcblx0LmNsYW1wKHRydWUpO1xubGV0IGl0ZXIgPSAwO1xubGV0IHRyYWluRGF0YTogRXhhbXBsZTJEW10gPSBbXTtcbmxldCB0ZXN0RGF0YTogRXhhbXBsZTJEW10gPSBbXTtcbmxldCBuZXR3b3JrOiBubi5Ob2RlW11bXSA9IG51bGw7XG5sZXQgbG9zc1RyYWluID0gMDtcbmxldCBsb3NzVGVzdCA9IDA7XG5sZXQgdHJ1ZUxlYXJuaW5nUmF0ZSA9IDA7XG5sZXQgdG90YWxDYXBhY2l0eSA9IDA7XG5sZXQgZ2VuZXJhbGl6YXRpb24gPSAwO1xubGV0IHRyYWluQ2xhc3Nlc0FjY3VyYWN5ID0gW107XG5sZXQgdGVzdENsYXNzZXNBY2N1cmFjeSA9IFtdO1xubGV0IHBsYXllciA9IG5ldyBQbGF5ZXIoKTtcbmxldCBsaW5lQ2hhcnQgPSBuZXcgQXBwZW5kaW5nTGluZUNoYXJ0KGQzLnNlbGVjdChcIiNsaW5lY2hhcnRcIiksXG5cdFtcIiM3NzdcIiwgXCJibGFja1wiXSk7XG5cbmxldCBtYXJrZWROb2RlOiBubi5Ob2RlID0gbnVsbDtcbmxldCBtYXJrZWREaXYgPSBudWxsO1xuXG5mdW5jdGlvbiBnZXRSZXFDYXBhY2l0eShwb2ludHM6IEV4YW1wbGUyRFtdKTogbnVtYmVyW10ge1xuXG5cdGxldCByb3VuZGluZyA9IFJFUV9DQVBfUk9VTkRJTkc7XG5cdGxldCBlbmVyZ3k6IGVuZXJneVR5cGVbXSA9IFtdO1xuXHRsZXQgbnVtUm93czogbnVtYmVyID0gcG9pbnRzLmxlbmd0aDtcblx0bGV0IG51bUNvbHM6IG51bWJlciA9IDI7XG5cdGxldCByZXN1bHQ6IG51bWJlciA9IDA7XG5cdGxldCByZXR2YWw6IG51bWJlcltdID0gW107XG5cblx0bGV0IGNsYXNzMSA9IC02NjY7XG5cdGxldCBudW1jbGFzczE6IG51bWJlciA9IDA7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XG5cdFx0bGV0IHg6IG51bWJlciA9IHBvaW50c1tpXS54IC8gMS4wO1xuXHRcdGxldCB5OiBudW1iZXIgPSBwb2ludHNbaV0ueSAvIDEuMDtcblx0XHRsZXQgcmVzdWx0OiBudW1iZXIgPSAoeCArIHkpIC8gMS4wO1xuXHRcdC8vIH4gY29uc29sZS5sb2coXCJ4OiBcIiArIHggKyBcIlxcdHk6IFwiICsgeSArIFwiXFx0cmVzdWx0W1wiICsgaSArIFwiXTogXCIgKyByZXN1bHQpO1xuXHRcdGlmIChyb3VuZGluZyAhPSAtMSkge1xuXHRcdFx0cmVzdWx0ID0gbXRydW5jKHJlc3VsdCAqIE1hdGgucG93KDEwLCByb3VuZGluZykpIC8gTWF0aC5wb3coMTAsIHJvdW5kaW5nKTtcblx0XHR9XG5cdFx0bGV0IGVWYWw6IG51bWJlciA9IHJlc3VsdDtcblx0XHRsZXQgbGFiZWw6IG51bWJlciA9IHBvaW50c1tpXS5sYWJlbDtcblx0XHRlbmVyZ3kucHVzaCh7ZVZhbCwgbGFiZWx9KTtcblx0XHRpZiAoY2xhc3MxID09IC02NjYpIHtcblx0XHRcdGNsYXNzMSA9IGxhYmVsO1xuXHRcdH1cblx0XHRpZiAobGFiZWwgPT0gY2xhc3MxKSB7XG5cdFx0XHRudW1jbGFzczErKztcblx0XHR9XG5cdH1cblxuXG5cdGVuZXJneS5zb3J0KFxuXHRcdGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0XHRyZXR1cm4gYS5lVmFsIC0gYi5lVmFsO1xuXHRcdH1cblx0KTtcblxuXHRsZXQgY3VyTGFiZWwgPSBlbmVyZ3lbMF0ubGFiZWw7XG5cdGxldCBjaGFuZ2VzID0gMDtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGVuZXJneS5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChlbmVyZ3lbaV0ubGFiZWwgIT0gY3VyTGFiZWwpIHtcblx0XHRcdGNoYW5nZXMrKztcblx0XHRcdGN1ckxhYmVsID0gZW5lcmd5W2ldLmxhYmVsO1xuXHRcdH1cblx0fVxuXG5cdGxldCBjbHVzdGVyczogbnVtYmVyID0gMDtcblx0Y2x1c3RlcnMgPSBjaGFuZ2VzICsgMTtcblxuXHRsZXQgbWluY3V0czogbnVtYmVyID0gMDtcblx0bWluY3V0cyA9IE1hdGguY2VpbChsb2cyKGNsdXN0ZXJzKSk7XG5cblx0bGV0IHN1Z0NhcGFjaXR5ID0gbWluY3V0cyAqIG51bUNvbHM7XG5cdGxldCBtYXhDYXBhY2l0eSA9IGNoYW5nZXMgKiAobnVtQ29scyArIDEpICsgY2hhbmdlcztcblxuXHRyZXR2YWwucHVzaChzdWdDYXBhY2l0eSk7XG5cdHJldHZhbC5wdXNoKG1heENhcGFjaXR5KTtcblxuXG5cdHJldHVybiByZXR2YWw7XG59XG5cblxuZnVuY3Rpb24gbnVtYmVyT2ZVbmlxdWUoZGF0YXNldDogRXhhbXBsZTJEW10pIHtcblx0bGV0IGNvdW50OiBudW1iZXIgPSAwO1xuXHRsZXQgdW5pcXVlRGljdDogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xuXHRkYXRhc2V0LmZvckVhY2gocG9pbnQgPT4ge1xuXHRcdGxldCBrZXk6IHN0cmluZyA9IFwiXCIgKyBwb2ludC54ICsgcG9pbnQueSArIHBvaW50LmxhYmVsO1xuXHRcdGlmICghKGtleSBpbiB1bmlxdWVEaWN0KSkge1xuXHRcdFx0Y291bnQgKz0gMTtcblx0XHRcdHVuaXF1ZURpY3Rba2V5XSA9IDE7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGNvdW50O1xufVxuXG4vKipcbiAqIFNjYWxpbmcgdGhlIHBvaW50cyBpbiB7cG9pbnRzfSBnaXZlbiBhIHJhbmdlIHtyYW5nZX1cbiAqL1xuZnVuY3Rpb24gbWluTWF4U2NhbGVQb2ludHMocG9pbnRzOiBFeGFtcGxlMkRbXSwgcmFuZ2U6IFtudW1iZXIsIG51bWJlcl0pIHtcblx0bGV0IHBvaW50c194ID0gcG9pbnRzLm1hcChwID0+IHAueCk7XG5cdGxldCBwb2ludHNfeSA9IHBvaW50cy5tYXAocCA9PiBwLnkpO1xuXHRsZXQgeF9taW4gPSBNYXRoLm1pbiguLi5wb2ludHNfeCk7XG5cdGxldCB4X21heCA9IE1hdGgubWF4KC4uLnBvaW50c194KTtcblx0bGV0IHlfbWluID0gTWF0aC5taW4oLi4ucG9pbnRzX3kpO1xuXHRsZXQgeV9tYXggPSBNYXRoLm1heCguLi5wb2ludHNfeSk7XG5cdHBvaW50cy5mb3JFYWNoKHAgPT4ge1xuXHRcdHAueCA9ICgocC54IC0geF9taW4pIC8gKHhfbWF4IC0geF9taW4pKSAqIChyYW5nZVsxXSAtIHJhbmdlWzBdKSArIHJhbmdlWzBdO1xuXHRcdHAueSA9ICgocC55IC0geV9taW4pIC8gKHlfbWF4IC0geV9taW4pKSAqIChyYW5nZVsxXSAtIHJhbmdlWzBdKSArIHJhbmdlWzBdO1xuXHR9KTtcblx0cmV0dXJuIHBvaW50cztcbn1cblxuZnVuY3Rpb24gbWFrZUdVSSgpIHtcblx0Ly8gVG9vbGJveGVzXG5cdCQoZnVuY3Rpb24gKCkge1xuXHRcdCQoXCJbZGF0YS10b2dnbGU9J3BvcG92ZXInXVwiKS5wb3BvdmVyKHtcblx0XHRcdGNvbnRhaW5lcjogXCJib2R5XCJcblx0XHR9KTtcblx0fSk7XG5cdCQoXCIucG9wb3Zlci1kaXNtaXNzXCIpLnBvcG92ZXIoe1xuXHRcdHRyaWdnZXI6IFwiZm9jdXNcIlxuXHR9KTtcblxuXHQvLyBBZGRpbmcgbGlua3MgYmV0d2VlbiBub2Rlc1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09IDE2KSB7XG5cdFx0XHRzdGF0ZS5zaGlmdERvd24gPSBmYWxzZTtcblx0XHRcdGlmIChtYXJrZWREaXYgIT0gbnVsbCkge1xuXHRcdFx0XHRtYXJrZWREaXYuc3R5bGUoe1xuXHRcdFx0XHRcdFwiYm9yZGVyLXdpZHRoXCI6IFwiMHB4XCJcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRtYXJrZWREaXYgPSBudWxsO1xuXHRcdFx0bWFya2VkTm9kZSA9IG51bGw7XG5cdFx0fVxuXHR9KTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09IDE2KSB7XG5cdFx0XHRzdGF0ZS5zaGlmdERvd24gPSB0cnVlO1xuXHRcdH1cblx0fSk7XG5cblxuXHRkMy5zZWxlY3QoXCIjcmVzZXQtYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdHJlc2V0KCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRkMy5zZWxlY3QoXCIjcGxheS1wYXVzZS1idXR0b25cIik7XG5cdH0pO1xuXG5cdGQzLnNlbGVjdChcIiNwbGF5LXBhdXNlLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHQvLyBDaGFuZ2UgdGhlIGJ1dHRvbidzIGNvbnRlbnQuXG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRwbGF5ZXIucGxheU9yUGF1c2UoKTtcblx0fSk7XG5cblx0cGxheWVyLm9uUGxheVBhdXNlKGlzUGxheWluZyA9PiB7XG5cdFx0ZDMuc2VsZWN0KFwiI3BsYXktcGF1c2UtYnV0dG9uXCIpLmNsYXNzZWQoXCJwbGF5aW5nXCIsIGlzUGxheWluZyk7XG5cdH0pO1xuXG5cdGQzLnNlbGVjdChcIiNuZXh0LXN0ZXAtYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdHBsYXllci5wYXVzZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0aWYgKGl0ZXIgPT09IDApIHtcblx0XHRcdHNpbXVsYXRpb25TdGFydGVkKCk7XG5cdFx0fVxuXHRcdG9uZVN0ZXAoKTtcblx0fSk7XG5cblx0ZDMuc2VsZWN0KFwiI2RhdGEtcmVnZW4tYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGdlbmVyYXRlRGF0YSgpO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0fSk7XG5cblx0bGV0IGRhdGFUaHVtYm5haWxzID0gZDMuc2VsZWN0QWxsKFwiY2FudmFzW2RhdGEtZGF0YXNldF1cIik7XG5cdGRhdGFUaHVtYm5haWxzLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCBuZXdEYXRhc2V0ID0gZGF0YXNldHNbdGhpcy5kYXRhc2V0LmRhdGFzZXRdO1xuXHRcdGxldCBkYXRhc2V0S2V5ID0gZ2V0S2V5RnJvbVZhbHVlKGRhdGFzZXRzLCBuZXdEYXRhc2V0KTtcblxuXHRcdGlmIChuZXdEYXRhc2V0ID09PSBzdGF0ZS5kYXRhc2V0ICYmIGRhdGFzZXRLZXkgIT0gXCJieW9kXCIpIHtcblx0XHRcdHJldHVybjsgLy8gTm8tb3AuXG5cdFx0fVxuXG5cdFx0c3RhdGUuZGF0YXNldCA9IG5ld0RhdGFzZXQ7XG5cblxuXHRcdGlmIChkYXRhc2V0S2V5ID09PSBcImJ5b2RcIikge1xuXG5cdFx0XHRzdGF0ZS5ieW9kID0gdHJ1ZTtcblx0XHRcdGQzLnNlbGVjdChcIiNpbnB1dEZvcm1CWU9EXCIpLmh0bWwoXCI8aW5wdXQgdHlwZT0nZmlsZScgYWNjZXB0PScuY3N2JyBpZD0naW5wdXRGaWxlQllPRCc+XCIpO1xuXHRcdFx0ZGF0YVRodW1ibmFpbHMuY2xhc3NlZChcInNlbGVjdGVkXCIsIGZhbHNlKTtcblx0XHRcdGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cdFx0XHQkKFwiI2lucHV0RmlsZUJZT0RcIikuY2xpY2soKTtcblxuXHRcdFx0Ly8gZDMuc2VsZWN0KFwiI25vaXNlXCIpLnZhbHVlKHN0YXRlLm5vaXNlKTtcblx0XHRcdC8vIH4gJChcIiNub2lzZVwiKS5zbGlkZXIoXCJkaXNhYmxlXCIpO1xuXG5cdFx0XHRsZXQgaW5wdXRCWU9EID0gZDMuc2VsZWN0KFwiI2lucHV0RmlsZUJZT0RcIik7XG5cdFx0XHRpbnB1dEJZT0Qub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0XHRsZXQgbmFtZSA9IHRoaXMuZmlsZXNbMF0ubmFtZTtcblx0XHRcdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRcdGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cdFx0XHRcdFx0bGV0IHRhcmdldDogYW55ID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0XHRcdGxldCBkYXRhID0gdGFyZ2V0LnJlc3VsdDtcblx0XHRcdFx0XHRsZXQgcyA9IGRhdGEuc3BsaXQoXCJcXG5cIik7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRsZXQgc3MgPSBzW2ldLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHRcdGlmIChzcy5sZW5ndGggIT0gMykgYnJlYWs7XG5cdFx0XHRcdFx0XHRsZXQgeCA9IHBhcnNlRmxvYXQoc3NbMF0pO1xuXHRcdFx0XHRcdFx0bGV0IHkgPSBwYXJzZUZsb2F0KHNzWzFdKTtcblx0XHRcdFx0XHRcdGxldCBsYWJlbCA9IHBhcnNlSW50KHNzWzJdKTtcblx0XHRcdFx0XHRcdHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwb2ludHMgPSBtaW5NYXhTY2FsZVBvaW50cyhwb2ludHMsIFstNiwgNl0pO1xuXHRcdFx0XHRcdHNodWZmbGUocG9pbnRzKTtcblx0XHRcdFx0XHQvLyBTcGxpdCBpbnRvIHRyYWluIGFuZCB0ZXN0IGRhdGEuXG5cdFx0XHRcdFx0bGV0IHNwbGl0SW5kZXggPSBNYXRoLmZsb29yKHBvaW50cy5sZW5ndGggKiBzdGF0ZS5wZXJjVHJhaW5EYXRhIC8gMTAwKTtcblx0XHRcdFx0XHR0cmFpbkRhdGEgPSBwb2ludHMuc2xpY2UoMCwgc3BsaXRJbmRleCk7XG5cdFx0XHRcdFx0dGVzdERhdGEgPSBwb2ludHMuc2xpY2Uoc3BsaXRJbmRleCk7XG5cblx0XHRcdFx0XHRoZWF0TWFwLnVwZGF0ZVBvaW50cyh0cmFpbkRhdGEpO1xuXHRcdFx0XHRcdGhlYXRNYXAudXBkYXRlVGVzdFBvaW50cyhzdGF0ZS5zaG93VGVzdERhdGEgPyB0ZXN0RGF0YSA6IFtdKTtcblxuXHRcdFx0XHRcdGxldCBjbGFzc0Rpc3QgPSBnZXROdW1iZXJPZkVhY2hDbGFzcyh0cmFpbkRhdGEpLm1hcCgobnVtKSA9PiBudW0gLyB0cmFpbkRhdGEubGVuZ3RoKTtcblx0XHRcdFx0XHRzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMF07XG5cdFx0XHRcdFx0c3RhdGUubWF4Q2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzFdO1xuXG5cdFx0XHRcdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0XHRcdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRcdFx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblx0XHRcdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFEaXN0cmlidXRpb24nXSAudmFsdWVcIilcblx0XHRcdFx0XHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblx0XHRcdFx0XHQvLy8vLy8vLy8vLy8vLy8vLy9cblx0XHRcdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0cmVzZXQoKTtcblxuXHRcdFx0XHRcdC8vIERyYXdpbmcgdGh1bWJuYWlsXG5cdFx0XHRcdFx0bGV0IGNhbnZhczogYW55ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2FudmFzW2RhdGEtZGF0YXNldD1ieW9kXWApO1xuXHRcdFx0XHRcdHJlbmRlclRodW1ibmFpbChjYW52YXMsIChudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpID0+IHBvaW50cyk7XG5cblxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHJlYWRlci5yZWFkQXNUZXh0KHRoaXMuZmlsZXNbMF0pO1xuXHRcdFx0fSk7XG5cblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdGF0ZS5ieW9kID0gZmFsc2U7XG5cdFx0XHQvLyB+IGQzLnNlbGVjdChcIiNpbnB1dEZvcm1CWU9EXCIpLmh0bWwoXCJcIik7XG5cdFx0XHQvLyAkKFwiI25vaXNlXCIpLmRpc2FibGVkID0gZmFsc2U7XG5cblx0XHRcdGRhdGFUaHVtYm5haWxzLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG5cdFx0XHRkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xuXHRcdFx0c3RhdGUubm9pc2UgPSAzNTsgLy8gU05SZEJcblxuXG5cdFx0XHRnZW5lcmF0ZURhdGEoKTtcblxuXHRcdFx0bGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdHJhaW5EYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHBvaW50cy5wdXNoKHRyYWluRGF0YVtpXSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRlc3REYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHBvaW50cy5wdXNoKHRlc3REYXRhW2ldKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNsYXNzRGlzdCA9IGdldE51bWJlck9mRWFjaENsYXNzKHRyYWluRGF0YSkubWFwKChudW0pID0+IG51bSAvIHRyYWluRGF0YS5sZW5ndGgpO1xuXHRcdFx0c3RhdGUuc3VnQ2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzBdO1xuXHRcdFx0c3RhdGUubWF4Q2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzFdO1xuXG5cdFx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRcdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblx0XHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YURpc3RyaWJ1dGlvbiddIC52YWx1ZVwiKVxuXHRcdFx0XHQudGV4dChgJHtjbGFzc0Rpc3RbMF0udG9GaXhlZCgzKX0sICR7Y2xhc3NEaXN0WzFdLnRvRml4ZWQoMyl9YCk7XG5cblx0XHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblxuXHRcdFx0Ly8gUmVzZXR0aW5nIHRoZSBCWU9EIHRodW1ibmFpbFxuXHRcdFx0bGV0IGNhbnZhczogYW55ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2FudmFzW2RhdGEtZGF0YXNldD1ieW9kXWApO1xuXHRcdFx0cmVuZGVyQllPRFRodW1ibmFpbChjYW52YXMpO1xuXHRcdFx0cmVzZXQoKTtcblx0XHR9XG5cblx0fSk7XG5cblx0bGV0IGRhdGFzZXRLZXkgPSBnZXRLZXlGcm9tVmFsdWUoZGF0YXNldHMsIHN0YXRlLmRhdGFzZXQpO1xuXHQvLyBTZWxlY3QgdGhlIGRhdGFzZXQgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxuXHRkMy5zZWxlY3QoYGNhbnZhc1tkYXRhLWRhdGFzZXQ9JHtkYXRhc2V0S2V5fV1gKVxuXHRcdC5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cblx0bGV0IHJlZ0RhdGFUaHVtYm5haWxzID0gZDMuc2VsZWN0QWxsKFwiY2FudmFzW2RhdGEtcmVnRGF0YXNldF1cIik7XG5cdHJlZ0RhdGFUaHVtYm5haWxzLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCBuZXdEYXRhc2V0ID0gcmVnRGF0YXNldHNbdGhpcy5kYXRhc2V0LnJlZ2RhdGFzZXRdO1xuXHRcdGlmIChuZXdEYXRhc2V0ID09PSBzdGF0ZS5yZWdEYXRhc2V0KSB7XG5cdFx0XHRyZXR1cm47IC8vIE5vLW9wLlxuXHRcdH1cblx0XHRzdGF0ZS5yZWdEYXRhc2V0ID0gbmV3RGF0YXNldDtcblx0XHRzdGF0ZS5zdWdDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMF07XG5cdFx0c3RhdGUubWF4Q2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzFdO1xuXHRcdHJlZ0RhdGFUaHVtYm5haWxzLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG5cdFx0ZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0bGV0IHJlZ0RhdGFzZXRLZXkgPSBnZXRLZXlGcm9tVmFsdWUocmVnRGF0YXNldHMsIHN0YXRlLnJlZ0RhdGFzZXQpO1xuXHQvLyBTZWxlY3QgdGhlIGRhdGFzZXQgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxuXHRkMy5zZWxlY3QoYGNhbnZhc1tkYXRhLXJlZ0RhdGFzZXQ9JHtyZWdEYXRhc2V0S2V5fV1gKVxuXHRcdC5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cblxuXHRkMy5zZWxlY3QoXCIjYWRkLWxheWVyc1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAoc3RhdGUubnVtSGlkZGVuTGF5ZXJzID49IE1BWF9ITEFZRVJTKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHN0YXRlLm5ldHdvcmtTaGFwZVtzdGF0ZS5udW1IaWRkZW5MYXllcnNdID0gMjtcblx0XHRzdGF0ZS5udW1IaWRkZW5MYXllcnMrKztcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0ZDMuc2VsZWN0KFwiI3JlbW92ZS1sYXllcnNcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aWYgKHN0YXRlLm51bUhpZGRlbkxheWVycyA8PSAwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHN0YXRlLm51bUhpZGRlbkxheWVycy0tO1xuXHRcdHN0YXRlLm5ldHdvcmtTaGFwZS5zcGxpY2Uoc3RhdGUubnVtSGlkZGVuTGF5ZXJzKTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0bGV0IHNob3dUZXN0RGF0YSA9IGQzLnNlbGVjdChcIiNzaG93LXRlc3QtZGF0YVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0c3RhdGUuc2hvd1Rlc3REYXRhID0gdGhpcy5jaGVja2VkO1xuXHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0aGVhdE1hcC51cGRhdGVUZXN0UG9pbnRzKHN0YXRlLnNob3dUZXN0RGF0YSA/IHRlc3REYXRhIDogW10pO1xuXHR9KTtcblxuXHQvLyBDaGVjay91bmNoZWNrIHRoZSBjaGVja2JveCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG5cdHNob3dUZXN0RGF0YS5wcm9wZXJ0eShcImNoZWNrZWRcIiwgc3RhdGUuc2hvd1Rlc3REYXRhKTtcblxuXHRsZXQgZGlzY3JldGl6ZSA9IGQzLnNlbGVjdChcIiNkaXNjcmV0aXplXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5kaXNjcmV0aXplID0gdGhpcy5jaGVja2VkO1xuXHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0dXBkYXRlVUkoKTtcblx0fSk7XG5cdC8vIENoZWNrL3VuY2hlY2sgdGhlIGNoZWNib3ggYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxuXHRkaXNjcmV0aXplLnByb3BlcnR5KFwiY2hlY2tlZFwiLCBzdGF0ZS5kaXNjcmV0aXplKTtcblxuXHRsZXQgcGVyY1RyYWluID0gZDMuc2VsZWN0KFwiI3BlcmNUcmFpbkRhdGFcIikub24oXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0c3RhdGUucGVyY1RyYWluRGF0YSA9IHRoaXMudmFsdWU7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdwZXJjVHJhaW5EYXRhJ10gLnZhbHVlXCIpLnRleHQodGhpcy52YWx1ZSk7XG5cdFx0Z2VuZXJhdGVEYXRhKCk7XG5cblx0XHRsZXQgY2xhc3NEaXN0ID0gZ2V0TnVtYmVyT2ZFYWNoQ2xhc3ModHJhaW5EYXRhKS5tYXAoKG51bSkgPT4gbnVtIC8gdHJhaW5EYXRhLmxlbmd0aCk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFEaXN0cmlidXRpb24nXSAudmFsdWVcIilcblx0XHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cdHBlcmNUcmFpbi5wcm9wZXJ0eShcInZhbHVlXCIsIHN0YXRlLnBlcmNUcmFpbkRhdGEpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3BlcmNUcmFpbkRhdGEnXSAudmFsdWVcIikudGV4dChzdGF0ZS5wZXJjVHJhaW5EYXRhKTtcblxuXHRmdW5jdGlvbiBodW1hblJlYWRhYmxlSW50KG46IG51bWJlcik6IHN0cmluZyB7XG5cdFx0cmV0dXJuIG4udG9GaXhlZCgwKTtcblx0fVxuXG5cdGxldCBub2lzZSA9IGQzLnNlbGVjdChcIiNub2lzZVwiKS5vbihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5ub2lzZSA9IHRoaXMudmFsdWU7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSd0cnVlLW5vaXNlU05SJ10gLnZhbHVlXCIpLnRleHQodGhpcy52YWx1ZSk7XG5cdFx0Z2VuZXJhdGVEYXRhKCk7XG5cblx0XHRsZXQgY2xhc3NEaXN0ID0gZ2V0TnVtYmVyT2ZFYWNoQ2xhc3ModHJhaW5EYXRhKS5tYXAoKG51bSkgPT4gbnVtIC8gdHJhaW5EYXRhLmxlbmd0aCk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YU92ZXJmaXQnXSAudmFsdWVcIikudGV4dChudW1iZXJPZlVuaXF1ZSh0cmFpbkRhdGEpKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFEaXN0cmlidXRpb24nXSAudmFsdWVcIilcblx0XHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblxuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblxuXG5cdG5vaXNlLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUubm9pc2UpO1xuXHRsZXQgY2xhc3NEaXN0ID0gZ2V0TnVtYmVyT2ZFYWNoQ2xhc3ModHJhaW5EYXRhKS5tYXAoKG51bSkgPT4gbnVtIC8gdHJhaW5EYXRhLmxlbmd0aCk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0ndHJ1ZS1ub2lzZVNOUiddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm5vaXNlKTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFEaXN0cmlidXRpb24nXSAudmFsdWVcIilcblx0XHQudGV4dChgJHtjbGFzc0Rpc3RbMF0udG9GaXhlZCgzKX0sICR7Y2xhc3NEaXN0WzFdLnRvRml4ZWQoMyl9YCk7XG5cblx0bGV0IGJhdGNoU2l6ZSA9IGQzLnNlbGVjdChcIiNiYXRjaFNpemVcIikub24oXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0c3RhdGUuYmF0Y2hTaXplID0gdGhpcy52YWx1ZTtcblxuXHRcdGxldCBjbGFzc0Rpc3QgPSBnZXROdW1iZXJPZkVhY2hDbGFzcyh0cmFpbkRhdGEpLm1hcCgobnVtKSA9PiBudW0gLyB0cmFpbkRhdGEubGVuZ3RoKTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHRoaXMudmFsdWUpO1xuXHRcdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbWF4Q2FwYWNpdHknXSAudmFsdWVcIikudGV4dChzdGF0ZS5tYXhDYXBhY2l0eSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0XHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cdFx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhRGlzdHJpYnV0aW9uJ10gLnZhbHVlXCIpXG5cdFx0XHQudGV4dChgJHtjbGFzc0Rpc3RbMF0udG9GaXhlZCgzKX0sICR7Y2xhc3NEaXN0WzFdLnRvRml4ZWQoMyl9YCk7XG5cblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0YmF0Y2hTaXplLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUuYmF0Y2hTaXplKTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdiYXRjaFNpemUnXSAudmFsdWVcIikudGV4dChzdGF0ZS5iYXRjaFNpemUpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J21heENhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUubWF4Q2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3N1Z0NhcGFjaXR5J10gLnZhbHVlXCIpLnRleHQoc3RhdGUuc3VnQ2FwYWNpdHkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFPdmVyZml0J10gLnZhbHVlXCIpLnRleHQobnVtYmVyT2ZVbmlxdWUodHJhaW5EYXRhKSk7XG5cdGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nZGF0YURpc3RyaWJ1dGlvbiddIC52YWx1ZVwiKVxuXHRcdC50ZXh0KGAke2NsYXNzRGlzdFswXS50b0ZpeGVkKDMpfSwgJHtjbGFzc0Rpc3RbMV0udG9GaXhlZCgzKX1gKTtcblxuXG5cdGxldCBhY3RpdmF0aW9uRHJvcGRvd24gPSBkMy5zZWxlY3QoXCIjYWN0aXZhdGlvbnNcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLmFjdGl2YXRpb24gPSBhY3RpdmF0aW9uc1t0aGlzLnZhbHVlXTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cdGFjdGl2YXRpb25Ecm9wZG93bi5wcm9wZXJ0eShcInZhbHVlXCIsIGdldEtleUZyb21WYWx1ZShhY3RpdmF0aW9ucywgc3RhdGUuYWN0aXZhdGlvbikpO1xuXG5cdGxldCBsZWFybmluZ1JhdGUgPSBkMy5zZWxlY3QoXCIjbGVhcm5pbmdSYXRlXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5sZWFybmluZ1JhdGUgPSB0aGlzLnZhbHVlO1xuXHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdFx0cGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuXHR9KTtcblxuXHRsZWFybmluZ1JhdGUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5sZWFybmluZ1JhdGUpO1xuXG5cdGxldCByZWd1bGFyRHJvcGRvd24gPSBkMy5zZWxlY3QoXCIjcmVndWxhcml6YXRpb25zXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRzdGF0ZS5yZWd1bGFyaXphdGlvbiA9IHJlZ3VsYXJpemF0aW9uc1t0aGlzLnZhbHVlXTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cblx0cmVndWxhckRyb3Bkb3duLnByb3BlcnR5KFwidmFsdWVcIiwgZ2V0S2V5RnJvbVZhbHVlKHJlZ3VsYXJpemF0aW9ucywgc3RhdGUucmVndWxhcml6YXRpb24pKTtcblxuXHRsZXQgcmVndWxhclJhdGUgPSBkMy5zZWxlY3QoXCIjcmVndWxhclJhdGVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLnJlZ3VsYXJpemF0aW9uUmF0ZSA9ICt0aGlzLnZhbHVlO1xuXHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRyZXNldCgpO1xuXHR9KTtcblx0cmVndWxhclJhdGUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5yZWd1bGFyaXphdGlvblJhdGUpO1xuXG5cdGxldCBwcm9ibGVtID0gZDMuc2VsZWN0KFwiI3Byb2JsZW1cIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHN0YXRlLnByb2JsZW0gPSBwcm9ibGVtc1t0aGlzLnZhbHVlXTtcblx0XHRnZW5lcmF0ZURhdGEoKTtcblx0XHRkcmF3RGF0YXNldFRodW1ibmFpbHMoKTtcblx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0cmVzZXQoKTtcblx0fSk7XG5cdHByb2JsZW0ucHJvcGVydHkoXCJ2YWx1ZVwiLCBnZXRLZXlGcm9tVmFsdWUocHJvYmxlbXMsIHN0YXRlLnByb2JsZW0pKTtcblxuXHQvLyBBZGQgc2NhbGUgdG8gdGhlIGdyYWRpZW50IGNvbG9yIG1hcC5cblx0bGV0IHggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWy0xLCAxXSkucmFuZ2UoWzAsIDE0NF0pO1xuXHRsZXQgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG5cdFx0LnNjYWxlKHgpXG5cdFx0Lm9yaWVudChcImJvdHRvbVwiKVxuXHRcdC50aWNrVmFsdWVzKFstMSwgMCwgMV0pXG5cdFx0LnRpY2tGb3JtYXQoZDMuZm9ybWF0KFwiZFwiKSk7XG5cdGQzLnNlbGVjdChcIiNjb2xvcm1hcCBnLmNvcmVcIikuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ4IGF4aXNcIilcblx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDEwKVwiKVxuXHRcdC5jYWxsKHhBeGlzKTtcblxuXHQvLyBMaXN0ZW4gZm9yIGNzcy1yZXNwb25zaXZlIGNoYW5nZXMgYW5kIHJlZHJhdyB0aGUgc3ZnIG5ldHdvcmsuXG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xuXHRcdGxldCBuZXdXaWR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbi1wYXJ0XCIpXG5cdFx0XHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cdFx0aWYgKG5ld1dpZHRoICE9PSBtYWluV2lkdGgpIHtcblx0XHRcdG1haW5XaWR0aCA9IG5ld1dpZHRoO1xuXHRcdFx0ZHJhd05ldHdvcmsobmV0d29yayk7XG5cdFx0XHR1cGRhdGVVSSh0cnVlKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIEhpZGUgdGhlIHRleHQgYmVsb3cgdGhlIHZpc3VhbGl6YXRpb24gZGVwZW5kaW5nIG9uIHRoZSBVUkwuXG5cdGlmIChzdGF0ZS5oaWRlVGV4dCkge1xuXHRcdGQzLnNlbGVjdChcIiNhcnRpY2xlLXRleHRcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0XHRkMy5zZWxlY3QoXCJkaXYubW9yZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdGQzLnNlbGVjdChcImhlYWRlclwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJpYXNlc1VJKG5ldHdvcms6IG5uLk5vZGVbXVtdKSB7XG5cdG5uLmZvckVhY2hOb2RlKG5ldHdvcmssIHRydWUsIG5vZGUgPT4ge1xuXHRcdGQzLnNlbGVjdChgcmVjdCNiaWFzLSR7bm9kZS5pZH1gKS5zdHlsZShcImZpbGxcIiwgY29sb3JTY2FsZShub2RlLmJpYXMpKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVdlaWdodHNVSShuZXR3b3JrOiBubi5Ob2RlW11bXSwgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55Pikge1xuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Ly8gVXBkYXRlIGFsbCB0aGUgbm9kZXMgaW4gdGhpcyBsYXllci5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcblx0XHRcdFx0Y29udGFpbmVyLnNlbGVjdChgI2xpbmske2xpbmsuc291cmNlLmlkfS0ke2xpbmsuZGVzdC5pZH1gKVxuXHRcdFx0XHRcdC5zdHlsZShcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XCJzdHJva2UtZGFzaG9mZnNldFwiOiAtaXRlciAvIDMsXG5cdFx0XHRcdFx0XHRcdFwic3Ryb2tlLXdpZHRoXCI6IGxpbmtXaWR0aFNjYWxlKE1hdGguYWJzKGxpbmsud2VpZ2h0KSksXG5cdFx0XHRcdFx0XHRcdFwic3Ryb2tlXCI6IGNvbG9yU2NhbGUobGluay53ZWlnaHQpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5kYXR1bShsaW5rKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBDcmVhdGluZyBsaW5rIGJldHdlZW4gdHdvIG5vZGVzLlxuICogQHBhcmFtIHN0YXJ0Tm9kZTogU3RhcnRpbmcgbm9kZSBvZiBsaW5rXG4gKiBAcGFyYW0gZW5kTm9kZTogRW5kIG5vZGUgb2YgbGlua1xuICovXG5mdW5jdGlvbiBjcmVhdGVMaW5rKHN0YXJ0Tm9kZTogbm4uTm9kZSwgZW5kTm9kZTogbm4uTm9kZSkge1xuXHRpZiAoc3RhcnROb2RlLmxheWVyID49IGVuZE5vZGUubGF5ZXIpIHtcblx0XHRyZXR1cm47XG5cdH1cblx0Ly8gVE9ETzogRklYIENBUEFDSVRZIFdIRU4gQURESU5HIEFORCBSRU1PVklORyBMSU5LU1xuXHRsZXQgbGluayA9IG5ldyBMaW5rKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgc3RhdGUucmVndWxhcml6YXRpb24sIHN0YXRlLmluaXRaZXJvKTtcblx0c3RhcnROb2RlLm91dHB1dHMucHVzaChsaW5rKTtcblx0ZW5kTm9kZS5pbnB1dExpbmtzLnB1c2gobGluayk7XG5cdGRyYXdOZXR3b3JrKG5ldHdvcmspO1xuXHR1cGRhdGVVSSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3Tm9kZShjeDogbnVtYmVyLCBjeTogbnVtYmVyLCBub2RlSWQ6IHN0cmluZywgaXNJbnB1dDogYm9vbGVhbiwgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55Piwgbm9kZT86IG5uLk5vZGUpIHtcblx0bGV0IHggPSBjeCAtIFJFQ1RfU0laRSAvIDI7XG5cdGxldCB5ID0gY3kgLSBSRUNUX1NJWkUgLyAyO1xuXG5cdGxldCBub2RlR3JvdXAgPSBjb250YWluZXIuYXBwZW5kKFwiZ1wiKS5hdHRyKFxuXHRcdHtcblx0XHRcdFwiY2xhc3NcIjogXCJub2RlXCIsXG5cdFx0XHRcImlkXCI6IGBub2RlJHtub2RlSWR9YCxcblx0XHRcdFwidHJhbnNmb3JtXCI6IGB0cmFuc2xhdGUoJHt4fSwke3l9KWBcblx0XHR9KTtcblxuXHQvLyBEcmF3IHRoZSBtYWluIHJlY3RhbmdsZS5cblx0bm9kZUdyb3VwLmFwcGVuZChcInJlY3RcIikuYXR0cihcblx0XHR7XG5cdFx0XHR4OiAwLFxuXHRcdFx0eTogMCxcblx0XHRcdHdpZHRoOiBSRUNUX1NJWkUsXG5cdFx0XHRoZWlnaHQ6IFJFQ1RfU0laRSxcblx0XHR9KTtcblxuXHRsZXQgYWN0aXZlT3JOb3RDbGFzcyA9IHN0YXRlW25vZGVJZF0gPyBcImFjdGl2ZVwiIDogXCJpbmFjdGl2ZVwiO1xuXHRpZiAoaXNJbnB1dCkge1xuXHRcdGxldCBsYWJlbCA9IElOUFVUU1tub2RlSWRdLmxhYmVsICE9IG51bGwgPyBJTlBVVFNbbm9kZUlkXS5sYWJlbCA6IG5vZGVJZDtcblx0XHQvLyBEcmF3IHRoZSBpbnB1dCBsYWJlbC5cblx0XHRsZXQgdGV4dCA9IG5vZGVHcm91cC5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXG5cdFx0XHR7XG5cdFx0XHRcdGNsYXNzOiBcIm1haW4tbGFiZWxcIixcblx0XHRcdFx0eDogLTEwLFxuXHRcdFx0XHR5OiBSRUNUX1NJWkUgLyAyLCBcInRleHQtYW5jaG9yXCI6IFwiZW5kXCJcblx0XHRcdH0pO1xuXHRcdGlmICgvW19eXS8udGVzdChsYWJlbCkpIHtcblx0XHRcdGxldCBteVJlID0gLyguKj8pKFtfXl0pKC4pL2c7XG5cdFx0XHRsZXQgbXlBcnJheTtcblx0XHRcdGxldCBsYXN0SW5kZXg7XG5cdFx0XHR3aGlsZSAoKG15QXJyYXkgPSBteVJlLmV4ZWMobGFiZWwpKSAhPSBudWxsKSB7XG5cdFx0XHRcdGxhc3RJbmRleCA9IG15UmUubGFzdEluZGV4O1xuXHRcdFx0XHRsZXQgcHJlZml4ID0gbXlBcnJheVsxXTtcblx0XHRcdFx0bGV0IHNlcCA9IG15QXJyYXlbMl07XG5cdFx0XHRcdGxldCBzdWZmaXggPSBteUFycmF5WzNdO1xuXHRcdFx0XHRpZiAocHJlZml4KSB7XG5cdFx0XHRcdFx0dGV4dC5hcHBlbmQoXCJ0c3BhblwiKS50ZXh0KHByZWZpeCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGV4dC5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiYmFzZWxpbmUtc2hpZnRcIiwgc2VwID09PSBcIl9cIiA/IFwic3ViXCIgOiBcInN1cGVyXCIpXG5cdFx0XHRcdFx0LnN0eWxlKFwiZm9udC1zaXplXCIsIFwiOXB4XCIpXG5cdFx0XHRcdFx0LnRleHQoc3VmZml4KTtcblx0XHRcdH1cblx0XHRcdGlmIChsYWJlbC5zdWJzdHJpbmcobGFzdEluZGV4KSkge1xuXHRcdFx0XHR0ZXh0LmFwcGVuZChcInRzcGFuXCIpLnRleHQobGFiZWwuc3Vic3RyaW5nKGxhc3RJbmRleCkpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0ZXh0LmFwcGVuZChcInRzcGFuXCIpLnRleHQobGFiZWwpO1xuXHRcdH1cblx0XHRub2RlR3JvdXAuY2xhc3NlZChhY3RpdmVPck5vdENsYXNzLCB0cnVlKTtcblx0fVxuXHRpZiAoIWlzSW5wdXQpIHtcblx0XHQvLyBEcmF3IHRoZSBub2RlJ3MgYmlhcy5cblx0XHRub2RlR3JvdXAuYXBwZW5kKFwicmVjdFwiKS5hdHRyKFxuXHRcdFx0e1xuXHRcdFx0XHRpZDogYGJpYXMtJHtub2RlSWR9YCxcblx0XHRcdFx0eDogLUJJQVNfU0laRSAtIDIsXG5cdFx0XHRcdHk6IFJFQ1RfU0laRSAtIEJJQVNfU0laRSArIDMsXG5cdFx0XHRcdHdpZHRoOiBCSUFTX1NJWkUsXG5cdFx0XHRcdGhlaWdodDogQklBU19TSVpFLFxuXHRcdFx0fSlcblx0XHRcdC5vbihcIm1vdXNlZW50ZXJcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR1cGRhdGVIb3ZlckNhcmQoSG92ZXJUeXBlLkJJQVMsIG5vZGUsIGQzLm1vdXNlKGNvbnRhaW5lci5ub2RlKCkpKTtcblx0XHRcdH0pXG5cdFx0XHQub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dXBkYXRlSG92ZXJDYXJkKG51bGwpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvLyBEcmF3IHRoZSBub2RlJ3MgY2FudmFzLlxuXHRsZXQgZGl2ID0gZDMuc2VsZWN0KFwiI25ldHdvcmtcIikuaW5zZXJ0KFwiZGl2XCIsIFwiOmZpcnN0LWNoaWxkXCIpLmF0dHIoXG5cdFx0e1xuXHRcdFx0XCJpZFwiOiBgY2FudmFzLSR7bm9kZUlkfWAsXG5cdFx0XHRcImNsYXNzXCI6IFwiY2FudmFzXCJcblx0XHR9KVxuXHRcdC5zdHlsZShcblx0XHRcdHtcblx0XHRcdFx0cG9zaXRpb246IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0bGVmdDogYCR7eCArIDN9cHhgLFxuXHRcdFx0XHR0b3A6IGAke3kgKyAzfXB4YFxuXHRcdFx0fSlcblx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoc3RhdGUuc2hpZnREb3duKSB7XG5cdFx0XHRcdGlmIChtYXJrZWROb2RlID09IG51bGwpIHtcblx0XHRcdFx0XHRkaXYuc3R5bGUoe1xuXHRcdFx0XHRcdFx0XCJib3JkZXItc3R5bGVcIjogXCJzb2xpZFwiLFxuXHRcdFx0XHRcdFx0XCJib3JkZXItcmFkaXVzXCI6IFwiNXB4XCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiBcInJlZFwiLFxuXHRcdFx0XHRcdFx0XCJib3JkZXItd2lkdGhcIjogXCIycHhcIlxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG1hcmtlZE5vZGUgPSBub2RlO1xuXHRcdFx0XHRcdG1hcmtlZERpdiA9IGRpdjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtYXJrZWREaXYuc3R5bGUoe1xuXHRcdFx0XHRcdFx0XCJib3JkZXItd2lkdGhcIjogXCIwcHhcIlxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGNyZWF0ZUxpbmsobWFya2VkTm9kZSwgbm9kZSk7XG5cdFx0XHRcdFx0bWFya2VkTm9kZSA9IG51bGw7XG5cdFx0XHRcdFx0bWFya2VkRGl2ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0Lm9uKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzZWxlY3RlZE5vZGVJZCA9IG5vZGVJZDtcblx0XHRcdGRpdi5jbGFzc2VkKFwiaG92ZXJlZFwiLCB0cnVlKTtcblx0XHRcdG5vZGVHcm91cC5jbGFzc2VkKFwiaG92ZXJlZFwiLCB0cnVlKTtcblx0XHRcdHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmFsc2UpO1xuXHRcdFx0aGVhdE1hcC51cGRhdGVCYWNrZ3JvdW5kKGJvdW5kYXJ5W25vZGVJZF0sIHN0YXRlLmRpc2NyZXRpemUpO1xuXHRcdH0pXG5cdFx0Lm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzZWxlY3RlZE5vZGVJZCA9IG51bGw7XG5cdFx0XHRkaXYuY2xhc3NlZChcImhvdmVyZWRcIiwgZmFsc2UpO1xuXHRcdFx0bm9kZUdyb3VwLmNsYXNzZWQoXCJob3ZlcmVkXCIsIGZhbHNlKTtcblx0XHRcdHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmFsc2UpO1xuXHRcdFx0aGVhdE1hcC51cGRhdGVCYWNrZ3JvdW5kKGJvdW5kYXJ5W25uLmdldE91dHB1dE5vZGUobmV0d29yaykuaWRdLCBzdGF0ZS5kaXNjcmV0aXplKTtcblx0XHR9KTtcblx0aWYgKGlzSW5wdXQpIHtcblx0XHRkaXYub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoIXN0YXRlLnNoaWZ0RG93bikge1xuXHRcdFx0XHRzdGF0ZVtub2RlSWRdID0gIXN0YXRlW25vZGVJZF07XG5cdFx0XHRcdHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0cmVzZXQoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChtYXJrZWROb2RlID09IG51bGwpIHtcblx0XHRcdFx0XHRkaXYuc3R5bGUoe1xuXHRcdFx0XHRcdFx0XCJib3JkZXItc3R5bGVcIjogXCJzb2xpZFwiLFxuXHRcdFx0XHRcdFx0XCJib3JkZXItcmFkaXVzXCI6IFwiNXB4XCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiBcInJlZFwiLFxuXHRcdFx0XHRcdFx0XCJib3JkZXItd2lkdGhcIjogXCIycHhcIlxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKG5vZGUsIGRpdik7XG5cdFx0XHRcdFx0bWFya2VkTm9kZSA9IG5vZGU7XG5cdFx0XHRcdFx0bWFya2VkRGl2ID0gZGl2O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0ZGl2LnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKTtcblx0fVxuXHRpZiAoaXNJbnB1dCkge1xuXHRcdGRpdi5jbGFzc2VkKGFjdGl2ZU9yTm90Q2xhc3MsIHRydWUpO1xuXHR9XG5cdGxldCBub2RlSGVhdE1hcCA9IG5ldyBIZWF0TWFwKFJFQ1RfU0laRSwgREVOU0lUWSAvIDEwLCB4RG9tYWluLCB4RG9tYWluLCBkaXYsIHtub1N2ZzogdHJ1ZX0pO1xuXHRkaXYuZGF0dW0oe2hlYXRtYXA6IG5vZGVIZWF0TWFwLCBpZDogbm9kZUlkfSk7XG59XG5cbi8vIERyYXcgbmV0d29ya1xuZnVuY3Rpb24gZHJhd05ldHdvcmsobmV0d29yazogbm4uTm9kZVtdW10pOiB2b2lkIHtcblx0bGV0IHN2ZyA9IGQzLnNlbGVjdChcIiNzdmdcIik7XG5cdC8vIFJlbW92ZSBhbGwgc3ZnIGVsZW1lbnRzLlxuXHRzdmcuc2VsZWN0KFwiZy5jb3JlXCIpLnJlbW92ZSgpO1xuXHQvLyBSZW1vdmUgYWxsIGRpdiBlbGVtZW50cy5cblx0ZDMuc2VsZWN0KFwiI25ldHdvcmtcIikuc2VsZWN0QWxsKFwiZGl2LmNhbnZhc1wiKS5yZW1vdmUoKTtcblx0ZDMuc2VsZWN0KFwiI25ldHdvcmtcIikuc2VsZWN0QWxsKFwiZGl2LnBsdXMtbWludXMtbmV1cm9uc1wiKS5yZW1vdmUoKTtcblxuXHQvLyBHZXQgdGhlIHdpZHRoIG9mIHRoZSBzdmcgY29udGFpbmVyLlxuXHRsZXQgcGFkZGluZyA9IDM7XG5cdGxldCBjbyA9IGQzLnNlbGVjdChcIi5jb2x1bW4ub3V0cHV0XCIpLm5vZGUoKSBhcyBIVE1MRGl2RWxlbWVudDtcblx0bGV0IGNmID0gZDMuc2VsZWN0KFwiLmNvbHVtbi5mZWF0dXJlc1wiKS5ub2RlKCkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cdGxldCB3aWR0aCA9IGNvLm9mZnNldExlZnQgLSBjZi5vZmZzZXRMZWZ0O1xuXHRzdmcuYXR0cihcIndpZHRoXCIsIHdpZHRoKTtcblxuXHQvLyBNYXAgb2YgYWxsIG5vZGUgY29vcmRpbmF0ZXMuXG5cdGxldCBub2RlMmNvb3JkOiB7IFtpZDogc3RyaW5nXTogeyBjeDogbnVtYmVyLCBjeTogbnVtYmVyIH0gfSA9IHt9O1xuXHRsZXQgY29udGFpbmVyID0gc3ZnLmFwcGVuZChcImdcIilcblx0XHQuY2xhc3NlZChcImNvcmVcIiwgdHJ1ZSlcblx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7cGFkZGluZ30sJHtwYWRkaW5nfSlgKTtcblx0Ly8gRHJhdyB0aGUgbmV0d29yayBsYXllciBieSBsYXllci5cblx0bGV0IG51bUxheWVycyA9IG5ldHdvcmsubGVuZ3RoO1xuXHRsZXQgZmVhdHVyZVdpZHRoID0gMTE4O1xuXHRsZXQgbGF5ZXJTY2FsZSA9IGQzLnNjYWxlLm9yZGluYWw8bnVtYmVyLCBudW1iZXI+KClcblx0XHQuZG9tYWluKGQzLnJhbmdlKDEsIG51bUxheWVycyAtIDEpKVxuXHRcdC5yYW5nZVBvaW50cyhbZmVhdHVyZVdpZHRoLCB3aWR0aCAtIFJFQ1RfU0laRV0sIDAuNyk7XG5cdGxldCBub2RlSW5kZXhTY2FsZSA9IChub2RlSW5kZXg6IG51bWJlcikgPT4gbm9kZUluZGV4ICogKFJFQ1RfU0laRSArIDI1KTtcblxuXG5cdGxldCBjYWxsb3V0VGh1bWIgPSBkMy5zZWxlY3QoXCIuY2FsbG91dC50aHVtYm5haWxcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0bGV0IGNhbGxvdXRXZWlnaHRzID0gZDMuc2VsZWN0KFwiLmNhbGxvdXQud2VpZ2h0c1wiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRsZXQgaWRXaXRoQ2FsbG91dCA9IG51bGw7XG5cdGxldCB0YXJnZXRJZFdpdGhDYWxsb3V0ID0gbnVsbDtcblxuXHQvLyBEcmF3IHRoZSBpbnB1dCBsYXllciBzZXBhcmF0ZWx5LlxuXHRsZXQgY3ggPSBSRUNUX1NJWkUgLyAyICsgNTA7XG5cdGxldCBub2RlSWRzID0gT2JqZWN0LmtleXMoSU5QVVRTKTtcblx0bGV0IG1heFkgPSBub2RlSW5kZXhTY2FsZShub2RlSWRzLmxlbmd0aCk7XG5cdGxldCBhY3RpdmVOb2RlSW5kaWNlcyA9IG5ldHdvcmtbMF0ucmVkdWNlKChvYmosIG5vZGUsIGkpID0+IHtcblx0XHRvYmpbbm9kZS5pZF0gPSBpO1xuXHRcdHJldHVybiBvYmo7XG5cdH0sIHt9KTtcblx0bm9kZUlkcy5mb3JFYWNoKChub2RlSWQsIGkpID0+IHtcblx0XHRsZXQgbm9kZUlkeCA9IGFjdGl2ZU5vZGVJbmRpY2VzW25vZGVJZF07XG5cdFx0bGV0IG5vZGUgPSBuZXR3b3JrWzBdW25vZGVJZHhdO1xuXHRcdGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKGkpICsgUkVDVF9TSVpFIC8gMjtcblx0XHRub2RlMmNvb3JkW25vZGVJZF0gPSB7Y3gsIGN5fTtcblx0XHRkcmF3Tm9kZShjeCwgY3ksIG5vZGVJZCwgdHJ1ZSwgY29udGFpbmVyLCBub2RlKTtcblx0fSk7XG5cblx0Ly8gRHJhdyB0aGUgaW50ZXJtZWRpYXRlIGxheWVycy5cblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG51bUxheWVycyAtIDE7IGxheWVySWR4KyspIHtcblx0XHRsZXQgbnVtTm9kZXMgPSBuZXR3b3JrW2xheWVySWR4XS5sZW5ndGg7XG5cdFx0bGV0IGN4ID0gbGF5ZXJTY2FsZShsYXllcklkeCkgKyBSRUNUX1NJWkUgLyAyO1xuXHRcdG1heFkgPSBNYXRoLm1heChtYXhZLCBub2RlSW5kZXhTY2FsZShudW1Ob2RlcykpO1xuXHRcdGFkZFBsdXNNaW51c0NvbnRyb2wobGF5ZXJTY2FsZShsYXllcklkeCksIGxheWVySWR4KTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG51bU5vZGVzOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gbmV0d29ya1tsYXllcklkeF1baV07XG5cdFx0XHRsZXQgY3kgPSBub2RlSW5kZXhTY2FsZShpKSArIFJFQ1RfU0laRSAvIDI7XG5cdFx0XHRub2RlMmNvb3JkW25vZGUuaWRdID0ge2N4LCBjeX07XG5cdFx0XHRkcmF3Tm9kZShjeCwgY3ksIG5vZGUuaWQsIGZhbHNlLCBjb250YWluZXIsIG5vZGUpO1xuXG5cdFx0XHQvLyBTaG93IGNhbGxvdXQgdG8gdGh1bWJuYWlscy5cblx0XHRcdGxldCBudW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHhdLmxlbmd0aDtcblx0XHRcdGxldCBuZXh0TnVtTm9kZXMgPSBuZXR3b3JrW2xheWVySWR4ICsgMV0ubGVuZ3RoO1xuXHRcdFx0aWYgKGlkV2l0aENhbGxvdXQgPT0gbnVsbCAmJlxuXHRcdFx0XHRpID09PSBudW1Ob2RlcyAtIDEgJiZcblx0XHRcdFx0bmV4dE51bU5vZGVzIDw9IG51bU5vZGVzKSB7XG5cdFx0XHRcdGNhbGxvdXRUaHVtYi5zdHlsZShcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBudWxsLFxuXHRcdFx0XHRcdFx0dG9wOiBgJHsyMCArIDMgKyBjeX1weGAsXG5cdFx0XHRcdFx0XHRsZWZ0OiBgJHtjeH1weGBcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0aWRXaXRoQ2FsbG91dCA9IG5vZGUuaWQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIERyYXcgbGlua3MuXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcblx0XHRcdFx0bGV0IHBhdGg6IFNWR1BhdGhFbGVtZW50ID0gZHJhd0xpbmsobGluaywgbm9kZTJjb29yZCwgbmV0d29yayxcblx0XHRcdFx0XHRjb250YWluZXIsIGogPT09IDAsIGosIG5vZGUuaW5wdXRMaW5rcy5sZW5ndGgpLm5vZGUoKSBhcyBhbnk7XG5cdFx0XHRcdC8vIFNob3cgY2FsbG91dCB0byB3ZWlnaHRzLlxuXHRcdFx0XHRsZXQgcHJldkxheWVyID0gbmV0d29ya1tsYXllcklkeCAtIDFdO1xuXHRcdFx0XHRsZXQgbGFzdE5vZGVQcmV2TGF5ZXIgPSBwcmV2TGF5ZXJbcHJldkxheWVyLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRpZiAodGFyZ2V0SWRXaXRoQ2FsbG91dCA9PSBudWxsICYmXG5cdFx0XHRcdFx0aSA9PT0gbnVtTm9kZXMgLSAxICYmXG5cdFx0XHRcdFx0bGluay5zb3VyY2UuaWQgPT09IGxhc3ROb2RlUHJldkxheWVyLmlkICYmXG5cdFx0XHRcdFx0KGxpbmsuc291cmNlLmlkICE9PSBpZFdpdGhDYWxsb3V0IHx8IG51bUxheWVycyA8PSA1KSAmJlxuXHRcdFx0XHRcdGxpbmsuZGVzdC5pZCAhPT0gaWRXaXRoQ2FsbG91dCAmJlxuXHRcdFx0XHRcdHByZXZMYXllci5sZW5ndGggPj0gbnVtTm9kZXMpIHtcblx0XHRcdFx0XHRsZXQgbWlkUG9pbnQgPSBwYXRoLmdldFBvaW50QXRMZW5ndGgocGF0aC5nZXRUb3RhbExlbmd0aCgpICogMC43KTtcblx0XHRcdFx0XHRjYWxsb3V0V2VpZ2h0cy5zdHlsZShcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogbnVsbCxcblx0XHRcdFx0XHRcdFx0dG9wOiBgJHttaWRQb2ludC55ICsgNX1weGAsXG5cdFx0XHRcdFx0XHRcdGxlZnQ6IGAke21pZFBvaW50LnggKyAzfXB4YFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGFyZ2V0SWRXaXRoQ2FsbG91dCA9IGxpbmsuZGVzdC5pZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIERyYXcgdGhlIG91dHB1dCBub2RlIHNlcGFyYXRlbHkuXG5cdGN4ID0gd2lkdGggKyBSRUNUX1NJWkUgLyAyO1xuXHRsZXQgbm9kZSA9IG5ldHdvcmtbbnVtTGF5ZXJzIC0gMV1bMF07XG5cdGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKDApICsgUkVDVF9TSVpFIC8gMjtcblx0bm9kZTJjb29yZFtub2RlLmlkXSA9IHtjeCwgY3l9O1xuXHQvLyBEcmF3IGxpbmtzLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2ldO1xuXHRcdGRyYXdMaW5rKGxpbmssIG5vZGUyY29vcmQsIG5ldHdvcmssIGNvbnRhaW5lciwgaSA9PT0gMCwgaSxcblx0XHRcdG5vZGUuaW5wdXRMaW5rcy5sZW5ndGgpO1xuXHR9XG5cdC8vIEFkanVzdCB0aGUgaGVpZ2h0IG9mIHRoZSBzdmcuXG5cdHN2Zy5hdHRyKFwiaGVpZ2h0XCIsIG1heFkpO1xuXG5cdC8vIEFkanVzdCB0aGUgaGVpZ2h0IG9mIHRoZSBmZWF0dXJlcyBjb2x1bW4uXG5cdGxldCBoZWlnaHQgPSBNYXRoLm1heChcblx0XHRnZXRSZWxhdGl2ZUhlaWdodChjYWxsb3V0VGh1bWIpLFxuXHRcdGdldFJlbGF0aXZlSGVpZ2h0KGNhbGxvdXRXZWlnaHRzKSxcblx0XHRnZXRSZWxhdGl2ZUhlaWdodChkMy5zZWxlY3QoXCIjbmV0d29ya1wiKSlcblx0KTtcblx0ZDMuc2VsZWN0KFwiLmNvbHVtbi5mZWF0dXJlc1wiKS5zdHlsZShcImhlaWdodFwiLCBoZWlnaHQgKyBcInB4XCIpO1xufVxuXG5mdW5jdGlvbiBnZXRSZWxhdGl2ZUhlaWdodChzZWxlY3Rpb246IGQzLlNlbGVjdGlvbjxhbnk+KSB7XG5cdGxldCBub2RlID0gc2VsZWN0aW9uLm5vZGUoKSBhcyBIVE1MQW5jaG9yRWxlbWVudDtcblx0cmV0dXJuIG5vZGUub2Zmc2V0SGVpZ2h0ICsgbm9kZS5vZmZzZXRUb3A7XG59XG5cbmZ1bmN0aW9uIGFkZFBsdXNNaW51c0NvbnRyb2woeDogbnVtYmVyLCBsYXllcklkeDogbnVtYmVyKSB7XG5cdGxldCBkaXYgPSBkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5hcHBlbmQoXCJkaXZcIilcblx0XHQuY2xhc3NlZChcInBsdXMtbWludXMtbmV1cm9uc1wiLCB0cnVlKVxuXHRcdC5zdHlsZShcImxlZnRcIiwgYCR7eCAtIDEwfXB4YCk7XG5cblx0bGV0IGkgPSBsYXllcklkeCAtIDE7XG5cdGxldCBmaXJzdFJvdyA9IGRpdi5hcHBlbmQoXCJkaXZcIikuYXR0cihcImNsYXNzXCIsIGB1aS1udW1Ob2RlcyR7bGF5ZXJJZHh9YCk7XG5cdGZpcnN0Um93LmFwcGVuZChcImJ1dHRvblwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtZGwtYnV0dG9uIG1kbC1qcy1idXR0b24gbWRsLWJ1dHRvbi0taWNvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGxldCBudW1OZXVyb25zID0gc3RhdGUubmV0d29ya1NoYXBlW2ldO1xuXHRcdFx0aWYgKG51bU5ldXJvbnMgPj0gTUFYX05FVVJPTlMpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c3RhdGUubmV0d29ya1NoYXBlW2ldKys7XG5cdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRyZXNldCgpO1xuXHRcdH0pXG5cdFx0LmFwcGVuZChcImlcIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibWF0ZXJpYWwtaWNvbnNcIilcblx0XHQudGV4dChcImFkZFwiKTtcblxuXHRmaXJzdFJvdy5hcHBlbmQoXCJidXR0b25cIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibWRsLWJ1dHRvbiBtZGwtanMtYnV0dG9uIG1kbC1idXR0b24tLWljb25cIilcblx0XHQub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRsZXQgbnVtTmV1cm9ucyA9IHN0YXRlLm5ldHdvcmtTaGFwZVtpXTtcblx0XHRcdGlmIChudW1OZXVyb25zIDw9IDEpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c3RhdGUubmV0d29ya1NoYXBlW2ldLS07XG5cdFx0XHRwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRyZXNldCgpO1xuXHRcdH0pXG5cdFx0LmFwcGVuZChcImlcIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwibWF0ZXJpYWwtaWNvbnNcIilcblx0XHQudGV4dChcInJlbW92ZVwiKTtcblxuXHRsZXQgc3VmZml4ID0gc3RhdGUubmV0d29ya1NoYXBlW2ldID4gMSA/IFwic1wiIDogXCJcIjtcblx0ZGl2LmFwcGVuZChcImRpdlwiKS50ZXh0KHN0YXRlLm5ldHdvcmtTaGFwZVtpXSArIFwiIG5ldXJvblwiICsgc3VmZml4KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSG92ZXJDYXJkKHR5cGU6IEhvdmVyVHlwZSwgbm9kZU9yTGluaz86IG5uLk5vZGUgfCBubi5MaW5rLCBjb29yZGluYXRlcz86IFtudW1iZXIsIG51bWJlcl0pIHtcblx0bGV0IGhvdmVyY2FyZCA9IGQzLnNlbGVjdChcIiNob3ZlcmNhcmRcIik7XG5cdGlmICh0eXBlID09IG51bGwpIHtcblx0XHRob3ZlcmNhcmQuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0XHRkMy5zZWxlY3QoXCIjc3ZnXCIpLm9uKFwiY2xpY2tcIiwgbnVsbCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGQzLnNlbGVjdChcIiNzdmdcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aG92ZXJjYXJkLnNlbGVjdChcIi52YWx1ZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdGxldCBpbnB1dCA9IGhvdmVyY2FyZC5zZWxlY3QoXCJpbnB1dFwiKTtcblx0XHRpbnB1dC5zdHlsZShcImRpc3BsYXlcIiwgbnVsbCk7XG5cdFx0aW5wdXQub24oXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodGhpcy52YWx1ZSAhPSBudWxsICYmIHRoaXMudmFsdWUgIT09IFwiXCIpIHtcblx0XHRcdFx0aWYgKHR5cGUgPT09IEhvdmVyVHlwZS5XRUlHSFQpIHtcblx0XHRcdFx0XHQobm9kZU9yTGluayBhcyBubi5MaW5rKS53ZWlnaHQgPSArdGhpcy52YWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQobm9kZU9yTGluayBhcyBubi5Ob2RlKS5iaWFzID0gK3RoaXMudmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dXBkYXRlVUkoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRpbnB1dC5vbihcImtleXByZXNzXCIsICgpID0+IHtcblx0XHRcdGlmICgoZDMuZXZlbnQgYXMgYW55KS5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0XHR1cGRhdGVIb3ZlckNhcmQodHlwZSwgbm9kZU9yTGluaywgY29vcmRpbmF0ZXMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdChpbnB1dC5ub2RlKCkgYXMgSFRNTElucHV0RWxlbWVudCkuZm9jdXMoKTtcblx0fSk7XG5cdGxldCB2YWx1ZSA9ICh0eXBlID09PSBIb3ZlclR5cGUuV0VJR0hUKSA/XG5cdFx0KG5vZGVPckxpbmsgYXMgbm4uTGluaykud2VpZ2h0IDpcblx0XHQobm9kZU9yTGluayBhcyBubi5Ob2RlKS5iaWFzO1xuXHRsZXQgbmFtZSA9ICh0eXBlID09PSBIb3ZlclR5cGUuV0VJR0hUKSA/IFwiV2VpZ2h0XCIgOiBcIkJpYXNcIjtcblx0aG92ZXJjYXJkLnN0eWxlKFxuXHRcdHtcblx0XHRcdFwibGVmdFwiOiBgJHtjb29yZGluYXRlc1swXSArIDIwfXB4YCxcblx0XHRcdFwidG9wXCI6IGAke2Nvb3JkaW5hdGVzWzFdfXB4YCxcblx0XHRcdFwiZGlzcGxheVwiOiBcImJsb2NrXCJcblx0XHR9KTtcblx0aG92ZXJjYXJkLnNlbGVjdChcIi50eXBlXCIpLnRleHQobmFtZSk7XG5cdGhvdmVyY2FyZC5zZWxlY3QoXCIudmFsdWVcIilcblx0XHQuc3R5bGUoXCJkaXNwbGF5XCIsIG51bGwpXG5cdFx0LnRleHQodmFsdWUudG9QcmVjaXNpb24oMikpO1xuXHRob3ZlcmNhcmQuc2VsZWN0KFwiaW5wdXRcIilcblx0XHQucHJvcGVydHkoXCJ2YWx1ZVwiLCB2YWx1ZS50b1ByZWNpc2lvbigyKSlcblx0XHQuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbn1cblxuZnVuY3Rpb24gZHJhd0xpbmsoXG5cdGlucHV0OiBubi5MaW5rLCBub2RlMmNvb3JkOiB7IFtpZDogc3RyaW5nXTogeyBjeDogbnVtYmVyLCBjeTogbnVtYmVyIH0gfSxcblx0bmV0d29yazogbm4uTm9kZVtdW10sIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sXG5cdGlzRmlyc3Q6IGJvb2xlYW4sIGluZGV4OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKSB7XG5cdGxldCBsaW5lID0gY29udGFpbmVyLmluc2VydChcInBhdGhcIiwgXCI6Zmlyc3QtY2hpbGRcIik7XG5cdGxldCBzb3VyY2UgPSBub2RlMmNvb3JkW2lucHV0LnNvdXJjZS5pZF07XG5cdGxldCBkZXN0ID0gbm9kZTJjb29yZFtpbnB1dC5kZXN0LmlkXTtcblx0bGV0IGRhdHVtID0ge1xuXHRcdHNvdXJjZTpcblx0XHRcdHtcblx0XHRcdFx0eTogc291cmNlLmN4ICsgUkVDVF9TSVpFIC8gMiArIDIsXG5cdFx0XHRcdHg6IHNvdXJjZS5jeVxuXHRcdFx0fSxcblx0XHR0YXJnZXQ6XG5cdFx0XHR7XG5cdFx0XHRcdHk6IGRlc3QuY3ggLSBSRUNUX1NJWkUgLyAyLFxuXHRcdFx0XHR4OiBkZXN0LmN5ICsgKChpbmRleCAtIChsZW5ndGggLSAxKSAvIDIpIC8gbGVuZ3RoKSAqIDEyXG5cdFx0XHR9XG5cdH07XG5cdGxldCBkaWFnb25hbCA9IGQzLnN2Zy5kaWFnb25hbCgpLnByb2plY3Rpb24oZCA9PiBbZC55LCBkLnhdKTtcblx0bGluZS5hdHRyKFxuXHRcdHtcblx0XHRcdFwibWFya2VyLXN0YXJ0XCI6IFwidXJsKCNtYXJrZXJBcnJvdylcIixcblx0XHRcdGNsYXNzOiBcImxpbmtcIixcblx0XHRcdGlkOiBcImxpbmtcIiArIGlucHV0LnNvdXJjZS5pZCArIFwiLVwiICsgaW5wdXQuZGVzdC5pZCxcblx0XHRcdGQ6IGRpYWdvbmFsKGRhdHVtLCAwKVxuXHRcdH0pO1xuXG5cdC8vIEFkZCBhbiBpbnZpc2libGUgdGhpY2sgbGluayB0aGF0IHdpbGwgYmUgdXNlZCBmb3Jcblx0Ly8gc2hvd2luZyB0aGUgd2VpZ2h0IHZhbHVlIG9uIGhvdmVyLlxuXHRjb250YWluZXIuYXBwZW5kKFwicGF0aFwiKVxuXHRcdC5hdHRyKFwiZFwiLCBkaWFnb25hbChkYXR1bSwgMCkpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxpbmstaG92ZXJcIilcblx0XHQub24oXCJkYmxjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRkZWFjdGl2YXRlQWN0aXZhdGVMaW5rKGlucHV0LCBkMy5tb3VzZSh0aGlzKSk7XG5cdFx0fSlcblx0XHQub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHVwZGF0ZUhvdmVyQ2FyZChIb3ZlclR5cGUuV0VJR0hULCBpbnB1dCwgZDMubW91c2UodGhpcykpO1xuXHRcdH0pXG5cdFx0Lm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHR1cGRhdGVIb3ZlckNhcmQobnVsbCk7XG5cdFx0fSk7XG5cdHJldHVybiBsaW5lO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgbGluaywgcmVhY3RpdmF0ZXMgaXQgaWYgZGVhZCBvciBzZXRzIGl0J3Mgd2VpZ2h0IHRvIHplcm8gYW5kIGtpbGxzIGl0XG4gKiBAcGFyYW0gbGluazogQSBsaW5rIGluIGEgbmV1cmFsIG5ldHdvcmtcbiAqIEBwYXJhbSBjb29yZGluYXRlczogTW91c2UgY29vcmRpbmF0ZXNcbiAqL1xuZnVuY3Rpb24gZGVhY3RpdmF0ZUFjdGl2YXRlTGluayhsaW5rOiBubi5MaW5rLCBjb29yZGluYXRlcz86IFtudW1iZXIsIG51bWJlcl0pIHtcblx0aWYgKGxpbmsuaXNEZWFkKSB7XG5cdFx0bGluay53ZWlnaHQgPSAxO1xuXHRcdGxpbmsuaXNEZWFkID0gZmFsc2U7XG5cdFx0dXBkYXRlSG92ZXJDYXJkKEhvdmVyVHlwZS5XRUlHSFQsIGxpbmssIGNvb3JkaW5hdGVzKTtcblx0XHR1cGRhdGVVSSgpO1xuXHR9IGVsc2Uge1xuXHRcdGxpbmsud2VpZ2h0ID0gMDtcblx0XHRsaW5rLmlzRGVhZCA9IHRydWU7XG5cdFx0dXBkYXRlSG92ZXJDYXJkKEhvdmVyVHlwZS5XRUlHSFQsIGxpbmssIGNvb3JkaW5hdGVzKTtcblx0XHR0b3RhbENhcGFjaXR5ID0gZ2V0VG90YWxDYXBhY2l0eShuZXR3b3JrKTtcblx0XHR1cGRhdGVVSSgpO1xuXHR9XG59XG5cbi8qKlxuICogR2l2ZW4gYSBuZXVyYWwgbmV0d29yaywgaXQgYXNrcyB0aGUgbmV0d29yayBmb3IgdGhlIG91dHB1dCAocHJlZGljdGlvbilcbiAqIG9mIGV2ZXJ5IG5vZGUgaW4gdGhlIG5ldHdvcmsgdXNpbmcgaW5wdXRzIHNhbXBsZWQgb24gYSBzcXVhcmUgZ3JpZC5cbiAqIEl0IHJldHVybnMgYSBtYXAgd2hlcmUgZWFjaCBrZXkgaXMgdGhlIG5vZGUgSUQgYW5kIHRoZSB2YWx1ZSBpcyBhIHNxdWFyZVxuICogbWF0cml4IG9mIHRoZSBvdXRwdXRzIG9mIHRoZSBuZXR3b3JrIGZvciBlYWNoIGlucHV0IGluIHRoZSBncmlkIHJlc3BlY3RpdmVseS5cbiAqL1xuXG5mdW5jdGlvbiB1cGRhdGVEZWNpc2lvbkJvdW5kYXJ5KG5ldHdvcms6IG5uLk5vZGVbXVtdLCBmaXJzdFRpbWU6IGJvb2xlYW4pIHtcblx0aWYgKGZpcnN0VGltZSkge1xuXHRcdGJvdW5kYXJ5ID0ge307XG5cdFx0bm4uZm9yRWFjaE5vZGUobmV0d29yaywgdHJ1ZSwgbm9kZSA9PiB7XG5cdFx0XHRib3VuZGFyeVtub2RlLmlkXSA9IG5ldyBBcnJheShERU5TSVRZKTtcblx0XHR9KTtcblx0XHQvLyBHbyB0aHJvdWdoIGFsbCBwcmVkZWZpbmVkIGlucHV0cy5cblx0XHRmb3IgKGxldCBub2RlSWQgaW4gSU5QVVRTKSB7XG5cdFx0XHRib3VuZGFyeVtub2RlSWRdID0gbmV3IEFycmF5KERFTlNJVFkpO1xuXHRcdH1cblx0fVxuXHRsZXQgeFNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCBERU5TSVRZIC0gMV0pLnJhbmdlKHhEb21haW4pO1xuXHRsZXQgeVNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFtERU5TSVRZIC0gMSwgMF0pLnJhbmdlKHhEb21haW4pO1xuXG5cdGxldCBpID0gMCwgaiA9IDA7XG5cdGZvciAoaSA9IDA7IGkgPCBERU5TSVRZOyBpKyspIHtcblx0XHRpZiAoZmlyc3RUaW1lKSB7XG5cdFx0XHRubi5mb3JFYWNoTm9kZShuZXR3b3JrLCB0cnVlLCBub2RlID0+IHtcblx0XHRcdFx0Ym91bmRhcnlbbm9kZS5pZF1baV0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XG5cdFx0XHR9KTtcblx0XHRcdC8vIEdvIHRocm91Z2ggYWxsIHByZWRlZmluZWQgaW5wdXRzLlxuXHRcdFx0Zm9yIChsZXQgbm9kZUlkIGluIElOUFVUUykge1xuXHRcdFx0XHRib3VuZGFyeVtub2RlSWRdW2ldID0gbmV3IEFycmF5KERFTlNJVFkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKGogPSAwOyBqIDwgREVOU0lUWTsgaisrKSB7XG5cdFx0XHQvLyAxIGZvciBwb2ludHMgaW5zaWRlIHRoZSBjaXJjbGUsIGFuZCAwIGZvciBwb2ludHMgb3V0c2lkZSB0aGUgY2lyY2xlLlxuXHRcdFx0bGV0IHggPSB4U2NhbGUoaSk7XG5cdFx0XHRsZXQgeSA9IHlTY2FsZShqKTtcblx0XHRcdGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KHgsIHkpO1xuXHRcdFx0bm4uZm9yd2FyZFByb3AobmV0d29yaywgaW5wdXQpO1xuXHRcdFx0bm4uZm9yRWFjaE5vZGUobmV0d29yaywgdHJ1ZSwgbm9kZSA9PiB7XG5cdFx0XHRcdGJvdW5kYXJ5W25vZGUuaWRdW2ldW2pdID0gbm9kZS5vdXRwdXQ7XG5cdFx0XHR9KTtcblx0XHRcdGlmIChmaXJzdFRpbWUpIHtcblx0XHRcdFx0Ly8gR28gdGhyb3VnaCBhbGwgcHJlZGVmaW5lZCBpbnB1dHMuXG5cdFx0XHRcdGZvciAobGV0IG5vZGVJZCBpbiBJTlBVVFMpIHtcblx0XHRcdFx0XHRib3VuZGFyeVtub2RlSWRdW2ldW2pdID0gSU5QVVRTW25vZGVJZF0uZih4LCB5KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBnZXRMZWFybmluZ1JhdGUobmV0d29yazogbm4uTm9kZVtdW10pOiBudW1iZXIge1xuXHRsZXQgdHJ1ZUxlYXJuaW5nUmF0ZSA9IDA7XG5cblx0Zm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdC8vIFVwZGF0ZSBhbGwgdGhlIG5vZGVzIGluIHRoaXMgbGF5ZXIuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0dHJ1ZUxlYXJuaW5nUmF0ZSArPSBub2RlLnRydWVMZWFybmluZ1JhdGU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0cnVlTGVhcm5pbmdSYXRlO1xufVxuXG5mdW5jdGlvbiBnZXRUb3RhbENhcGFjaXR5KG5ldHdvcms6IG5uLk5vZGVbXVtdKTogbnVtYmVyIHtcblx0bGV0IHRvdGFsQ2FwYWNpdHkgPSAwO1xuXHRmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VyTGF5ZXJDYXBhY2l0eSA9IDA7XG5cdFx0bGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuXHRcdGlmICgxID09PSBsYXllcklkeClcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0XHRjdXJMYXllckNhcGFjaXR5ICs9IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGggKyAxO1xuXHRcdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0bGV0IG1pbkxheWVyID0gbmV0d29ya1tsYXllcklkeCAtIDFdLmxlbmd0aDtcblx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgbGF5ZXJJZHggLSAxOyBpKyspIHtcblx0XHRcdFx0aWYgKG5ldHdvcmtbaV0ubGVuZ3RoIDwgbWluTGF5ZXIpIHtcblx0XHRcdFx0XHRtaW5MYXllciA9IG5ldHdvcmtbaV0ubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGN1ckxheWVyQ2FwYWNpdHkgKz0gbWluTGF5ZXI7XG5cdFx0fVxuXHRcdHRvdGFsQ2FwYWNpdHkgKz0gY3VyTGF5ZXJDYXBhY2l0eTtcblx0fVxuXHRyZXR1cm4gdG90YWxDYXBhY2l0eTtcbn1cblxuZnVuY3Rpb24gZ2V0TG9zcyhuZXR3b3JrOiBubi5Ob2RlW11bXSwgZGF0YVBvaW50czogRXhhbXBsZTJEW10pOiBudW1iZXIge1xuXHRsZXQgbG9zcyA9IDA7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBkYXRhUG9pbnQgPSBkYXRhUG9pbnRzW2ldO1xuXHRcdGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KGRhdGFQb2ludC54LCBkYXRhUG9pbnQueSk7XG5cdFx0bGV0IG91dHB1dCA9IG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcblx0XHRsb3NzICs9IG5uLkVycm9ycy5TUVVBUkUuZXJyb3Iob3V0cHV0LCBkYXRhUG9pbnQubGFiZWwpO1xuXHR9XG5cdHJldHVybiBsb3NzIC8gZGF0YVBvaW50cy5sZW5ndGggKiAxMDA7XG59XG5cbmZ1bmN0aW9uIGdldE51bWJlck9mQ29ycmVjdENsYXNzaWZpY2F0aW9ucyhuZXR3b3JrOiBubi5Ob2RlW11bXSwgZGF0YVBvaW50czogRXhhbXBsZTJEW10pOiBudW1iZXIge1xuXHRsZXQgY29ycmVjdGx5Q2xhc3NpZmllZCA9IDA7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBkYXRhUG9pbnQgPSBkYXRhUG9pbnRzW2ldO1xuXHRcdGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KGRhdGFQb2ludC54LCBkYXRhUG9pbnQueSk7XG5cdFx0bGV0IG91dHB1dCA9IG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcblx0XHRsZXQgcHJlZGljdGlvbiA9IChvdXRwdXQgPiAwKSA/IDEgOiAtMTtcblx0XHRsZXQgY29ycmVjdCA9IChwcmVkaWN0aW9uID09PSBkYXRhUG9pbnQubGFiZWwpID8gMSA6IDA7XG5cdFx0Y29ycmVjdGx5Q2xhc3NpZmllZCArPSBjb3JyZWN0O1xuXHR9XG5cblx0cmV0dXJuIGNvcnJlY3RseUNsYXNzaWZpZWQ7XG59XG5cbmZ1bmN0aW9uIGdldE51bWJlck9mRWFjaENsYXNzKGRhdGFQb2ludHM6IEV4YW1wbGUyRFtdKTogbnVtYmVyW10ge1xuXHRsZXQgZmlyc3RDbGFzczogbnVtYmVyID0gMDtcblx0bGV0IHNlY29uZENsYXNzOiBudW1iZXIgPSAwO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFQb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgZGF0YVBvaW50ID0gZGF0YVBvaW50c1tpXTtcblx0XHRmaXJzdENsYXNzICs9IChkYXRhUG9pbnQubGFiZWwgPT09IC0xKSA/IDEgOiAwO1xuXHRcdHNlY29uZENsYXNzICs9IChkYXRhUG9pbnQubGFiZWwgPT09IDEpID8gMSA6IDA7XG5cdH1cblx0cmV0dXJuIFtmaXJzdENsYXNzLCBzZWNvbmRDbGFzc107XG59XG5cbmZ1bmN0aW9uIGdldEFjY3VyYWN5Rm9yRWFjaENsYXNzKG5ldHdvcms6IG5uLk5vZGVbXVtdLCBkYXRhUG9pbnRzOiBFeGFtcGxlMkRbXSk6IG51bWJlcltdIHtcblx0bGV0IGZpcnN0Q2xhc3NDb3JyZWN0OiBudW1iZXIgPSAwO1xuXHRsZXQgc2Vjb25kQ2xhc3NDb3JyZWN0OiBudW1iZXIgPSAwO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFQb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgZGF0YVBvaW50ID0gZGF0YVBvaW50c1tpXTtcblx0XHRsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dChkYXRhUG9pbnQueCwgZGF0YVBvaW50LnkpO1xuXHRcdGxldCBvdXRwdXQgPSBubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XG5cdFx0bGV0IHByZWRpY3Rpb24gPSAob3V0cHV0ID4gMCkgPyAxIDogLTE7XG5cdFx0bGV0IGlzQ29ycmVjdCA9IHByZWRpY3Rpb24gPT09IGRhdGFQb2ludC5sYWJlbDtcblx0XHRpZiAoaXNDb3JyZWN0KSB7XG5cdFx0XHRpZiAoZGF0YVBvaW50LmxhYmVsID09PSAtMSkge1xuXHRcdFx0XHRmaXJzdENsYXNzQ29ycmVjdCArPSAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2Vjb25kQ2xhc3NDb3JyZWN0ICs9IDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblx0bGV0IGNsYXNzZXNDb3VudDogbnVtYmVyW10gPSBnZXROdW1iZXJPZkVhY2hDbGFzcyhkYXRhUG9pbnRzKTtcblx0cmV0dXJuIFtmaXJzdENsYXNzQ29ycmVjdCAvIGNsYXNzZXNDb3VudFswXSwgc2Vjb25kQ2xhc3NDb3JyZWN0IC8gY2xhc3Nlc0NvdW50WzFdXTtcbn1cblxuXG5mdW5jdGlvbiB1cGRhdGVVSShmaXJzdFN0ZXAgPSBmYWxzZSkge1xuXHQvLyBVcGRhdGUgdGhlIGxpbmtzIHZpc3VhbGx5LlxuXHR1cGRhdGVXZWlnaHRzVUkobmV0d29yaywgZDMuc2VsZWN0KFwiZy5jb3JlXCIpKTtcblx0Ly8gVXBkYXRlIHRoZSBiaWFzIHZhbHVlcyB2aXN1YWxseS5cblx0dXBkYXRlQmlhc2VzVUkobmV0d29yayk7XG5cdC8vIEdldCB0aGUgZGVjaXNpb24gYm91bmRhcnkgb2YgdGhlIG5ldHdvcmsuXG5cdHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmlyc3RTdGVwKTtcblx0bGV0IHNlbGVjdGVkSWQgPSBzZWxlY3RlZE5vZGVJZCAhPSBudWxsID9cblx0XHRzZWxlY3RlZE5vZGVJZCA6IG5uLmdldE91dHB1dE5vZGUobmV0d29yaykuaWQ7XG5cdGhlYXRNYXAudXBkYXRlQmFja2dyb3VuZChib3VuZGFyeVtzZWxlY3RlZElkXSwgc3RhdGUuZGlzY3JldGl6ZSk7XG5cblx0Ly8gVXBkYXRlIGFsbCBkZWNpc2lvbiBib3VuZGFyaWVzLlxuXHRkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5zZWxlY3RBbGwoXCJkaXYuY2FudmFzXCIpXG5cdFx0LmVhY2goZnVuY3Rpb24gKGRhdGE6IHsgaGVhdG1hcDogSGVhdE1hcCwgaWQ6IHN0cmluZyB9KSB7XG5cdFx0XHRkYXRhLmhlYXRtYXAudXBkYXRlQmFja2dyb3VuZChyZWR1Y2VNYXRyaXgoYm91bmRhcnlbZGF0YS5pZF0sIDEwKSwgc3RhdGUuZGlzY3JldGl6ZSk7XG5cdFx0fSk7XG5cblx0ZnVuY3Rpb24gemVyb1BhZChuOiBudW1iZXIpOiBzdHJpbmcge1xuXHRcdGxldCBwYWQgPSBcIjAwMDAwMFwiO1xuXHRcdHJldHVybiAocGFkICsgbikuc2xpY2UoLXBhZC5sZW5ndGgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWRkQ29tbWFzKHM6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHMucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgXCIsXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaHVtYW5SZWFkYWJsZShuOiBudW1iZXIsIGsgPSA0KTogc3RyaW5nIHtcblx0XHRyZXR1cm4gbi50b0ZpeGVkKGspO1xuXHR9XG5cblx0ZnVuY3Rpb24gaHVtYW5SZWFkYWJsZUludChuOiBudW1iZXIpOiBzdHJpbmcge1xuXHRcdHJldHVybiBuLnRvRml4ZWQoMCk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaWduYWxPZihuOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdHJldHVybiBNYXRoLmxvZygxICsgTWF0aC5hYnMobikpO1xuXHR9XG5cblx0Ly8gVXBkYXRlIHRydWUgbGVhcm5pbmcgcmF0ZSBsb3NzIGFuZCBpdGVyYXRpb24gbnVtYmVyLlxuXHQvLyBUaGVzZSBhcmUgYWxsIGJpdCByYXRlcywgaGVuY2UgdGhleSBhcmUgY2hhbm5lbCBzaWduYWxzXG5cdGxldCBsb2cyID0gMS4wIC8gTWF0aC5sb2coMi4wKTtcblx0bGV0IGJpdExvc3NUZXN0ID0gbG9zc1Rlc3Q7XG5cdGxldCBiaXRMb3NzVHJhaW4gPSBsb3NzVHJhaW47XG5cdGxldCBiaXRUcnVlTGVhcm5pbmdSYXRlID0gc2lnbmFsT2YodHJ1ZUxlYXJuaW5nUmF0ZSkgKiBsb2cyO1xuXHRsZXQgYml0R2VuZXJhbGl6YXRpb24gPSBnZW5lcmFsaXphdGlvbjtcblx0dG90YWxDYXBhY2l0eSA9IGdldFRvdGFsQ2FwYWNpdHkobmV0d29yayk7XG5cblxuXHRkMy5zZWxlY3QoXCIjbG9zcy10cmFpblwiKS50ZXh0KGh1bWFuUmVhZGFibGUoYml0TG9zc1RyYWluKSk7XG5cdGQzLnNlbGVjdChcIiNsb3NzLXRlc3RcIikudGV4dChodW1hblJlYWRhYmxlKGJpdExvc3NUZXN0KSk7XG5cdGQzLnNlbGVjdChcIiNnZW5lcmFsaXphdGlvblwiKS50ZXh0KGh1bWFuUmVhZGFibGUoYml0R2VuZXJhbGl6YXRpb24sIDMpKTtcblx0ZDMuc2VsZWN0KFwiI3RyYWluLWFjY3VyYWN5LWZpcnN0XCIpLnRleHQoaHVtYW5SZWFkYWJsZSh0cmFpbkNsYXNzZXNBY2N1cmFjeVswXSkpO1xuXHRkMy5zZWxlY3QoXCIjdHJhaW4tYWNjdXJhY3ktc2Vjb25kXCIpLnRleHQoaHVtYW5SZWFkYWJsZSh0cmFpbkNsYXNzZXNBY2N1cmFjeVsxXSkpO1xuXHRkMy5zZWxlY3QoXCIjdGVzdC1hY2N1cmFjeS1maXJzdFwiKS50ZXh0KGh1bWFuUmVhZGFibGUodGVzdENsYXNzZXNBY2N1cmFjeVswXSkpO1xuXHRkMy5zZWxlY3QoXCIjdGVzdC1hY2N1cmFjeS1zZWNvbmRcIikudGV4dChodW1hblJlYWRhYmxlKHRlc3RDbGFzc2VzQWNjdXJhY3lbMV0pKTtcblx0ZDMuc2VsZWN0KFwiI2l0ZXItbnVtYmVyXCIpLnRleHQoYWRkQ29tbWFzKHplcm9QYWQoaXRlcikpKTtcblx0ZDMuc2VsZWN0KFwiI3RvdGFsLWNhcGFjaXR5XCIpLnRleHQoaHVtYW5SZWFkYWJsZUludCh0b3RhbENhcGFjaXR5KSk7XG5cdGxpbmVDaGFydC5hZGREYXRhUG9pbnQoW2xvc3NUcmFpbiwgbG9zc1Rlc3RdKTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0SW5wdXRJZHMoKTogc3RyaW5nW10ge1xuXHRsZXQgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xuXHRmb3IgKGxldCBpbnB1dE5hbWUgaW4gSU5QVVRTKSB7XG5cdFx0aWYgKHN0YXRlW2lucHV0TmFtZV0pIHtcblx0XHRcdHJlc3VsdC5wdXNoKGlucHV0TmFtZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdElucHV0KHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyW10ge1xuXHRsZXQgaW5wdXQ6IG51bWJlcltdID0gW107XG5cdGZvciAobGV0IGlucHV0TmFtZSBpbiBJTlBVVFMpIHtcblx0XHRpZiAoc3RhdGVbaW5wdXROYW1lXSkge1xuXHRcdFx0aW5wdXQucHVzaChJTlBVVFNbaW5wdXROYW1lXS5mKHgsIHkpKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGlucHV0O1xufVxuXG5mdW5jdGlvbiBvbmVTdGVwKCk6IHZvaWQge1xuXHRpdGVyKys7XG5cdHRyYWluRGF0YS5mb3JFYWNoKChwb2ludCwgaSkgPT4ge1xuXHRcdGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KHBvaW50LngsIHBvaW50LnkpO1xuXHRcdG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcblx0XHRubi5iYWNrUHJvcChuZXR3b3JrLCBwb2ludC5sYWJlbCwgbm4uRXJyb3JzLlNRVUFSRSk7XG5cdFx0aWYgKChpICsgMSkgJSBzdGF0ZS5iYXRjaFNpemUgPT09IDApIHtcblx0XHRcdG5uLnVwZGF0ZVdlaWdodHMobmV0d29yaywgc3RhdGUubGVhcm5pbmdSYXRlLCBzdGF0ZS5yZWd1bGFyaXphdGlvblJhdGUpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gQ29tcHV0ZSB0aGUgbG9zcy5cblx0dHJ1ZUxlYXJuaW5nUmF0ZSA9IGdldExlYXJuaW5nUmF0ZShuZXR3b3JrKTtcblx0dG90YWxDYXBhY2l0eSA9IGdldFRvdGFsQ2FwYWNpdHkobmV0d29yayk7XG5cblx0bG9zc1RyYWluID0gZ2V0TG9zcyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuXHRsb3NzVGVzdCA9IGdldExvc3MobmV0d29yaywgdGVzdERhdGEpO1xuXG5cdGxldCBudW1iZXJPZkNvcnJlY3RUcmFpbkNsYXNzaWZpY2F0aW9uczogbnVtYmVyID0gZ2V0TnVtYmVyT2ZDb3JyZWN0Q2xhc3NpZmljYXRpb25zKG5ldHdvcmssIHRyYWluRGF0YSk7XG5cdGxldCBudW1iZXJPZkNvcnJlY3RUZXN0Q2xhc3NpZmljYXRpb25zOiBudW1iZXIgPSBnZXROdW1iZXJPZkNvcnJlY3RDbGFzc2lmaWNhdGlvbnMobmV0d29yaywgdGVzdERhdGEpO1xuXHRnZW5lcmFsaXphdGlvbiA9IChudW1iZXJPZkNvcnJlY3RUcmFpbkNsYXNzaWZpY2F0aW9ucyArIG51bWJlck9mQ29ycmVjdFRlc3RDbGFzc2lmaWNhdGlvbnMpIC8gdG90YWxDYXBhY2l0eTtcblxuXHR0cmFpbkNsYXNzZXNBY2N1cmFjeSA9IGdldEFjY3VyYWN5Rm9yRWFjaENsYXNzKG5ldHdvcmssIHRyYWluRGF0YSk7XG5cdHRlc3RDbGFzc2VzQWNjdXJhY3kgPSBnZXRBY2N1cmFjeUZvckVhY2hDbGFzcyhuZXR3b3JrLCB0ZXN0RGF0YSk7XG5cblxuXHR1cGRhdGVVSSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3V0cHV0V2VpZ2h0cyhuZXR3b3JrOiBubi5Ob2RlW11bXSk6IG51bWJlcltdIHtcblx0bGV0IHdlaWdodHM6IG51bWJlcltdID0gW107XG5cdGZvciAobGV0IGxheWVySWR4ID0gMDsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aCAtIDE7IGxheWVySWR4KyspIHtcblx0XHRsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBub2RlLm91dHB1dHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0bGV0IG91dHB1dCA9IG5vZGUub3V0cHV0c1tqXTtcblx0XHRcdFx0d2VpZ2h0cy5wdXNoKG91dHB1dC53ZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gd2VpZ2h0cztcbn1cblxuZnVuY3Rpb24gcmVzZXQob25TdGFydHVwID0gZmFsc2UpIHtcblx0bGluZUNoYXJ0LnJlc2V0KCk7XG5cdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRpZiAoIW9uU3RhcnR1cCkge1xuXHRcdHVzZXJIYXNJbnRlcmFjdGVkKCk7XG5cdH1cblx0cGxheWVyLnBhdXNlKCk7XG5cblx0bGV0IHN1ZmZpeCA9IHN0YXRlLm51bUhpZGRlbkxheWVycyAhPT0gMSA/IFwic1wiIDogXCJcIjtcblx0ZDMuc2VsZWN0KFwiI2xheWVycy1sYWJlbFwiKS50ZXh0KFwiSGlkZGVuIGxheWVyXCIgKyBzdWZmaXgpO1xuXHRkMy5zZWxlY3QoXCIjbnVtLWxheWVyc1wiKS50ZXh0KHN0YXRlLm51bUhpZGRlbkxheWVycyk7XG5cblxuXHQvLyBNYWtlIGEgc2ltcGxlIG5ldHdvcmsuXG5cdGl0ZXIgPSAwO1xuXHRsZXQgbnVtSW5wdXRzID0gY29uc3RydWN0SW5wdXQoMCwgMCkubGVuZ3RoO1xuXHRsZXQgc2hhcGUgPSBbbnVtSW5wdXRzXS5jb25jYXQoc3RhdGUubmV0d29ya1NoYXBlKS5jb25jYXQoWzFdKTtcblx0bGV0IG91dHB1dEFjdGl2YXRpb24gPSAoc3RhdGUucHJvYmxlbSA9PT0gUHJvYmxlbS5SRUdSRVNTSU9OKSA/XG5cdFx0bm4uQWN0aXZhdGlvbnMuTElORUFSIDogbm4uQWN0aXZhdGlvbnMuVEFOSDtcblx0bmV0d29yayA9IG5uLmJ1aWxkTmV0d29yayhzaGFwZSwgc3RhdGUuYWN0aXZhdGlvbiwgb3V0cHV0QWN0aXZhdGlvbixcblx0XHRzdGF0ZS5yZWd1bGFyaXphdGlvbiwgY29uc3RydWN0SW5wdXRJZHMoKSwgc3RhdGUuaW5pdFplcm8pO1xuXHR0cnVlTGVhcm5pbmdSYXRlID0gZ2V0TGVhcm5pbmdSYXRlKG5ldHdvcmspO1xuXHR0b3RhbENhcGFjaXR5ID0gZ2V0VG90YWxDYXBhY2l0eShuZXR3b3JrKTtcblx0bG9zc1Rlc3QgPSBnZXRMb3NzKG5ldHdvcmssIHRlc3REYXRhKTtcblx0bG9zc1RyYWluID0gZ2V0TG9zcyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuXG5cdGxldCBudW1iZXJPZkNvcnJlY3RUcmFpbkNsYXNzaWZpY2F0aW9uczogbnVtYmVyID0gZ2V0TnVtYmVyT2ZDb3JyZWN0Q2xhc3NpZmljYXRpb25zKG5ldHdvcmssIHRyYWluRGF0YSk7XG5cdGxldCBudW1iZXJPZkNvcnJlY3RUZXN0Q2xhc3NpZmljYXRpb25zOiBudW1iZXIgPSBnZXROdW1iZXJPZkNvcnJlY3RDbGFzc2lmaWNhdGlvbnMobmV0d29yaywgdGVzdERhdGEpO1xuXG5cdGdlbmVyYWxpemF0aW9uID0gKG51bWJlck9mQ29ycmVjdFRyYWluQ2xhc3NpZmljYXRpb25zICsgbnVtYmVyT2ZDb3JyZWN0VGVzdENsYXNzaWZpY2F0aW9ucykgLyB0b3RhbENhcGFjaXR5O1xuXG5cdHRyYWluQ2xhc3Nlc0FjY3VyYWN5ID0gZ2V0QWNjdXJhY3lGb3JFYWNoQ2xhc3MobmV0d29yaywgdHJhaW5EYXRhKTtcblx0dGVzdENsYXNzZXNBY2N1cmFjeSA9IGdldEFjY3VyYWN5Rm9yRWFjaENsYXNzKG5ldHdvcmssIHRlc3REYXRhKTtcblxuXHRkcmF3TmV0d29yayhuZXR3b3JrKTtcblx0dXBkYXRlVUkodHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGluaXRUdXRvcmlhbCgpIHtcblx0aWYgKHN0YXRlLnR1dG9yaWFsID09IG51bGwgfHwgc3RhdGUudHV0b3JpYWwgPT09IFwiXCIgfHwgc3RhdGUuaGlkZVRleHQpIHtcblx0XHRyZXR1cm47XG5cdH1cblx0Ly8gUmVtb3ZlIGFsbCBvdGhlciB0ZXh0LlxuXHRkMy5zZWxlY3RBbGwoXCJhcnRpY2xlIGRpdi5sLS1ib2R5XCIpLnJlbW92ZSgpO1xuXHRsZXQgdHV0b3JpYWwgPSBkMy5zZWxlY3QoXCJhcnRpY2xlXCIpLmFwcGVuZChcImRpdlwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsLS1ib2R5XCIpO1xuXHQvLyBJbnNlcnQgdHV0b3JpYWwgdGV4dC5cblx0ZDMuaHRtbChgdHV0b3JpYWxzLyR7c3RhdGUudHV0b3JpYWx9Lmh0bWxgLCAoZXJyLCBodG1sRnJhZ21lbnQpID0+IHtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHR0aHJvdyBlcnI7XG5cdFx0fVxuXHRcdHR1dG9yaWFsLm5vZGUoKS5hcHBlbmRDaGlsZChodG1sRnJhZ21lbnQpO1xuXHRcdC8vIElmIHRoZSB0dXRvcmlhbCBoYXMgYSA8dGl0bGU+IHRhZywgc2V0IHRoZSBwYWdlIHRpdGxlIHRvIHRoYXQuXG5cdFx0bGV0IHRpdGxlID0gdHV0b3JpYWwuc2VsZWN0KFwidGl0bGVcIik7XG5cdFx0aWYgKHRpdGxlLnNpemUoKSkge1xuXHRcdFx0ZDMuc2VsZWN0KFwiaGVhZGVyIGgxXCIpLnN0eWxlKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJtYXJnaW4tdG9wXCI6IFwiMjBweFwiLFxuXHRcdFx0XHRcdFwibWFyZ2luLWJvdHRvbVwiOiBcIjIwcHhcIixcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRleHQodGl0bGUudGV4dCgpKTtcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGUudGV4dCgpO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclRodW1ibmFpbChjYW52YXMsIGRhdGFHZW5lcmF0b3IpIHtcblx0bGV0IHcgPSAxMDA7XG5cdGxldCBoID0gMTAwO1xuXHRjYW52YXMuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgdyk7XG5cdGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgaCk7XG5cdGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblx0bGV0IGRhdGEgPSBkYXRhR2VuZXJhdG9yKDIwMCwgNTApOyAvLyBOUE9JTlRTLCBOT0lTRVxuXG5cdGRhdGEuZm9yRWFjaChcblx0XHRmdW5jdGlvbiAoZCkge1xuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBjb2xvclNjYWxlKGQubGFiZWwpO1xuXHRcdFx0Y29udGV4dC5maWxsUmVjdCh3ICogKGQueCArIDYpIC8gMTIsIGggKiAoLWQueSArIDYpIC8gMTIsIDQsIDQpO1xuXHRcdH0pO1xuXHRkMy5zZWxlY3QoY2FudmFzLnBhcmVudE5vZGUpLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQllPRFRodW1ibmFpbChjYW52YXMpIHtcblx0Y2FudmFzLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIDEwMCk7XG5cdGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgMTAwKTtcblx0bGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRjb25zdCBwbHVzU3ZnID0gXCI8c3ZnIHZlcnNpb249XFxcIjEuMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB3aWR0aD1cXFwiMjRcXFwiIGhlaWdodD1cXFwiMjRcXFwiIHZpZXdCb3g9XFxcIjAgMCAyNCAyNFxcXCI+PHRpdGxlPmFkZDwvdGl0bGU+PHBhdGggZD1cXFwiTTE4Ljk4NCAxMi45ODRoLTZ2NmgtMS45Njl2LTZoLTZ2LTEuOTY5aDZ2LTZoMS45Njl2Nmg2djEuOTY5elxcXCI+PC9wYXRoPjwvc3ZnPlwiO1xuXHRjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcblx0Y29uc3Qgc3ZnID0gbmV3IEJsb2IoW3BsdXNTdmddLCB7dHlwZTogXCJpbWFnZS9zdmcreG1sXCJ9KTtcblx0Y29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChzdmcpO1xuXG5cdGltZy5zcmMgPSB1cmw7XG5cblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG5cdFx0Y29udGV4dC5kcmF3SW1hZ2UoaW1nLCAyNSwgMjUsIDUwLCA1MCk7XG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuXHR9O1xuXHRkMy5zZWxlY3QoY2FudmFzLnBhcmVudE5vZGUpLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKTtcbn1cblxuZnVuY3Rpb24gZHJhd0RhdGFzZXRUaHVtYm5haWxzKCkge1xuXHRkMy5zZWxlY3RBbGwoXCIuZGF0YXNldFwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXG5cdGlmIChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OKSB7XG5cdFx0Zm9yIChsZXQgZGF0YXNldCBpbiBkYXRhc2V0cykge1xuXHRcdFx0bGV0IGNhbnZhczogYW55ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2FudmFzW2RhdGEtZGF0YXNldD0ke2RhdGFzZXR9XWApO1xuXHRcdFx0bGV0IGRhdGFHZW5lcmF0b3IgPSBkYXRhc2V0c1tkYXRhc2V0XTtcblxuXHRcdFx0aWYgKGRhdGFzZXQgPT09IFwiYnlvZFwiKSB7XG5cdFx0XHRcdHJlbmRlckJZT0RUaHVtYm5haWwoY2FudmFzKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRyZW5kZXJUaHVtYm5haWwoY2FudmFzLCBkYXRhR2VuZXJhdG9yKTtcblxuXG5cdFx0fVxuXHR9XG5cdGlmIChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLlJFR1JFU1NJT04pIHtcblx0XHRmb3IgKGxldCByZWdEYXRhc2V0IGluIHJlZ0RhdGFzZXRzKSB7XG5cdFx0XHRsZXQgY2FudmFzOiBhbnkgPVxuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBjYW52YXNbZGF0YS1yZWdEYXRhc2V0PSR7cmVnRGF0YXNldH1dYCk7XG5cdFx0XHRsZXQgZGF0YUdlbmVyYXRvciA9IHJlZ0RhdGFzZXRzW3JlZ0RhdGFzZXRdO1xuXHRcdFx0cmVuZGVyVGh1bWJuYWlsKGNhbnZhcywgZGF0YUdlbmVyYXRvcik7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGhpZGVDb250cm9scygpIHtcblx0Ly8gU2V0IGRpc3BsYXk6bm9uZSB0byBhbGwgdGhlIFVJIGVsZW1lbnRzIHRoYXQgYXJlIGhpZGRlbi5cblx0bGV0IGhpZGRlblByb3BzID0gc3RhdGUuZ2V0SGlkZGVuUHJvcHMoKTtcblx0aGlkZGVuUHJvcHMuZm9yRWFjaChwcm9wID0+IHtcblx0XHRsZXQgY29udHJvbHMgPSBkMy5zZWxlY3RBbGwoYC51aS0ke3Byb3B9YCk7XG5cdFx0aWYgKGNvbnRyb2xzLnNpemUoKSA9PT0gMCkge1xuXHRcdFx0Y29uc29sZS53YXJuKGAwIGh0bWwgZWxlbWVudHMgZm91bmQgd2l0aCBjbGFzcyAudWktJHtwcm9wfWApO1xuXHRcdH1cblx0XHRjb250cm9scy5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHR9KTtcblxuXHQvLyBBbHNvIGFkZCBjaGVja2JveCBmb3IgZWFjaCBoaWRhYmxlIGNvbnRyb2wgaW4gdGhlIFwidXNlIGl0IGluIGNsYXNzcm9tXCJcblx0Ly8gc2VjdGlvbi5cblx0bGV0IGhpZGVDb250cm9scyA9IGQzLnNlbGVjdChcIi5oaWRlLWNvbnRyb2xzXCIpO1xuXHRISURBQkxFX0NPTlRST0xTLmZvckVhY2goKFt0ZXh0LCBpZF0pID0+IHtcblx0XHRsZXQgbGFiZWwgPSBoaWRlQ29udHJvbHMuYXBwZW5kKFwibGFiZWxcIilcblx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtZGwtY2hlY2tib3ggbWRsLWpzLWNoZWNrYm94IG1kbC1qcy1yaXBwbGUtZWZmZWN0XCIpO1xuXHRcdGxldCBpbnB1dCA9IGxhYmVsLmFwcGVuZChcImlucHV0XCIpXG5cdFx0XHQuYXR0cihcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHR5cGU6IFwiY2hlY2tib3hcIixcblx0XHRcdFx0XHRjbGFzczogXCJtZGwtY2hlY2tib3hfX2lucHV0XCIsXG5cdFx0XHRcdH0pO1xuXHRcdGlmIChoaWRkZW5Qcm9wcy5pbmRleE9mKGlkKSA9PT0gLTEpIHtcblx0XHRcdGlucHV0LmF0dHIoXCJjaGVja2VkXCIsIFwidHJ1ZVwiKTtcblx0XHR9XG5cdFx0aW5wdXQub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0c3RhdGUuc2V0SGlkZVByb3BlcnR5KGlkLCAhdGhpcy5jaGVja2VkKTtcblx0XHRcdHN0YXRlLnNlcmlhbGl6ZSgpO1xuXHRcdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0XHRcdGQzLnNlbGVjdChcIi5oaWRlLWNvbnRyb2xzLWxpbmtcIilcblx0XHRcdFx0LmF0dHIoXCJocmVmXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblx0XHR9KTtcblx0XHRsYWJlbC5hcHBlbmQoXCJzcGFuXCIpXG5cdFx0XHQuYXR0cihcImNsYXNzXCIsIFwibWRsLWNoZWNrYm94X19sYWJlbCBsYWJlbFwiKVxuXHRcdFx0LnRleHQodGV4dCk7XG5cdH0pO1xuXHRkMy5zZWxlY3QoXCIuaGlkZS1jb250cm9scy1saW5rXCIpXG5cdFx0LmF0dHIoXCJocmVmXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVEYXRhKGZpcnN0VGltZSA9IGZhbHNlKSB7XG5cdGlmICghZmlyc3RUaW1lKSB7XG5cdFx0Ly8gQ2hhbmdlIHRoZSBzZWVkLlxuXHRcdHN0YXRlLnNlZWQgPSBNYXRoLnJhbmRvbSgpLnRvRml4ZWQoOCk7XG5cdFx0c3RhdGUuc2VyaWFsaXplKCk7XG5cdFx0dXNlckhhc0ludGVyYWN0ZWQoKTtcblx0fVxuXHRNYXRoLnNlZWRyYW5kb20oc3RhdGUuc2VlZCk7XG5cdGxldCBudW1TYW1wbGVzID0gKHN0YXRlLnByb2JsZW0gPT09IFByb2JsZW0uUkVHUkVTU0lPTikgP1xuXHRcdE5VTV9TQU1QTEVTX1JFR1JFU1MgOiBOVU1fU0FNUExFU19DTEFTU0lGWTtcblxuXHRsZXQgZ2VuZXJhdG9yO1xuXHRsZXQgZGF0YTogRXhhbXBsZTJEW10gPSBbXTtcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmluZGVudFxuXG5cdGlmIChzdGF0ZS5ieW9kKSB7XG5cdFx0ZGF0YSA9IHRyYWluRGF0YS5jb25jYXQodGVzdERhdGEpO1xuXHR9XG5cblx0aWYgKCFzdGF0ZS5ieW9kKSB7XG5cdFx0Z2VuZXJhdG9yID0gc3RhdGUucHJvYmxlbSA9PT0gUHJvYmxlbS5DTEFTU0lGSUNBVElPTiA/IHN0YXRlLmRhdGFzZXQgOiBzdGF0ZS5yZWdEYXRhc2V0O1xuXHRcdGRhdGEgPSBnZW5lcmF0b3IobnVtU2FtcGxlcywgc3RhdGUubm9pc2UpO1xuXHR9XG5cblx0Ly8gU2h1ZmZsZSBhbmQgc3BsaXQgaW50byB0cmFpbiBhbmQgdGVzdCBkYXRhLlxuXHRzaHVmZmxlKGRhdGEpO1xuXHRsZXQgc3BsaXRJbmRleCA9IE1hdGguZmxvb3IoZGF0YS5sZW5ndGggKiBzdGF0ZS5wZXJjVHJhaW5EYXRhIC8gMTAwKTtcblx0dHJhaW5EYXRhID0gZGF0YS5zbGljZSgwLCBzcGxpdEluZGV4KTtcblx0dGVzdERhdGEgPSBkYXRhLnNsaWNlKHNwbGl0SW5kZXgpO1xuXG5cdGxldCBjbGFzc0Rpc3QgPSBnZXROdW1iZXJPZkVhY2hDbGFzcyh0cmFpbkRhdGEpLm1hcCgobnVtKSA9PiBudW0gLyB0cmFpbkRhdGEubGVuZ3RoKTtcblx0c3RhdGUuc3VnQ2FwYWNpdHkgPSBnZXRSZXFDYXBhY2l0eSh0cmFpbkRhdGEpWzBdO1xuXHRzdGF0ZS5tYXhDYXBhY2l0eSA9IGdldFJlcUNhcGFjaXR5KHRyYWluRGF0YSlbMV07XG5cblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdtYXhDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm1heENhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdzdWdDYXBhY2l0eSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnN1Z0NhcGFjaXR5KTtcblx0ZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdkYXRhT3ZlcmZpdCddIC52YWx1ZVwiKS50ZXh0KG51bWJlck9mVW5pcXVlKHRyYWluRGF0YSkpO1xuXHRkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2RhdGFEaXN0cmlidXRpb24nXSAudmFsdWVcIilcblx0XHQudGV4dChgJHtjbGFzc0Rpc3RbMF0udG9GaXhlZCgzKX0sICR7Y2xhc3NEaXN0WzFdLnRvRml4ZWQoMyl9YCk7XG5cblx0aGVhdE1hcC51cGRhdGVQb2ludHModHJhaW5EYXRhKTtcblx0aGVhdE1hcC51cGRhdGVUZXN0UG9pbnRzKHN0YXRlLnNob3dUZXN0RGF0YSA/IHRlc3REYXRhIDogW10pO1xuXG59XG5cbmxldCBmaXJzdEludGVyYWN0aW9uID0gdHJ1ZTtcbmxldCBwYXJhbWV0ZXJzQ2hhbmdlZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiB1c2VySGFzSW50ZXJhY3RlZCgpIHtcblx0aWYgKCFmaXJzdEludGVyYWN0aW9uKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZpcnN0SW50ZXJhY3Rpb24gPSBmYWxzZTtcblx0bGV0IHBhZ2UgPSBcImluZGV4XCI7XG5cdGlmIChzdGF0ZS50dXRvcmlhbCAhPSBudWxsICYmIHN0YXRlLnR1dG9yaWFsICE9PSBcIlwiKSB7XG5cdFx0cGFnZSA9IGAvdi90dXRvcmlhbHMvJHtzdGF0ZS50dXRvcmlhbH1gO1xuXHR9XG5cdGdhKFwic2V0XCIsIFwicGFnZVwiLCBwYWdlKTtcblx0Z2EoXCJzZW5kXCIsIFwicGFnZXZpZXdcIiwge1wic2Vzc2lvbkNvbnRyb2xcIjogXCJzdGFydFwifSk7XG59XG5cbmZ1bmN0aW9uIHNpbXVsYXRpb25TdGFydGVkKCkge1xuXHRnYShcInNlbmRcIixcblx0XHR7XG5cdFx0XHRoaXRUeXBlOiBcImV2ZW50XCIsXG5cdFx0XHRldmVudENhdGVnb3J5OiBcIlN0YXJ0aW5nIFNpbXVsYXRpb25cIixcblx0XHRcdGV2ZW50QWN0aW9uOiBwYXJhbWV0ZXJzQ2hhbmdlZCA/IFwiY2hhbmdlZFwiIDogXCJ1bmNoYW5nZWRcIixcblx0XHRcdGV2ZW50TGFiZWw6IHN0YXRlLnR1dG9yaWFsID09IG51bGwgPyBcIlwiIDogc3RhdGUudHV0b3JpYWxcblx0XHR9KTtcblx0cGFyYW1ldGVyc0NoYW5nZWQgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gc2ltdWxhdGVDbGljayhlbGVtIC8qIE11c3QgYmUgdGhlIGVsZW1lbnQsIG5vdCBkMyBzZWxlY3Rpb24gKi8pIHtcblx0bGV0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiTW91c2VFdmVudHNcIik7XG5cdGV2dC5pbml0TW91c2VFdmVudChcblx0XHRcImNsaWNrXCIsIC8qIHR5cGUgKi9cblx0XHR0cnVlLCAvKiBjYW5CdWJibGUgKi9cblx0XHR0cnVlLCAvKiBjYW5jZWxhYmxlICovXG5cdFx0d2luZG93LCAvKiB2aWV3ICovXG5cdFx0MCwgLyogZGV0YWlsICovXG5cdFx0MCwgLyogc2NyZWVuWCAqL1xuXHRcdDAsIC8qIHNjcmVlblkgKi9cblx0XHQwLCAvKiBjbGllbnRYICovXG5cdFx0MCwgLyogY2xpZW50WSAqL1xuXHRcdGZhbHNlLCAvKiBjdHJsS2V5ICovXG5cdFx0ZmFsc2UsIC8qIGFsdEtleSAqL1xuXHRcdGZhbHNlLCAvKiBzaGlmdEtleSAqL1xuXHRcdGZhbHNlLCAvKiBtZXRhS2V5ICovXG5cdFx0MCwgLyogYnV0dG9uICovXG5cdFx0bnVsbCk7IC8qIHJlbGF0ZWRUYXJnZXQgKi9cblx0ZWxlbS5kaXNwYXRjaEV2ZW50KGV2dCk7XG59XG5cblxuZHJhd0RhdGFzZXRUaHVtYm5haWxzKCk7XG4vLyBpbml0VHV0b3JpYWwoKTtcbm1ha2VHVUkoKTtcbmdlbmVyYXRlRGF0YSh0cnVlKTtcbnJlc2V0KHRydWUpO1xuaGlkZUNvbnRyb2xzKCk7XG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmltcG9ydCAqIGFzIG5uIGZyb20gXCIuL25uXCI7XG5pbXBvcnQgKiBhcyBkYXRhc2V0IGZyb20gXCIuL2RhdGFzZXRcIjtcbmltcG9ydCB7RXhhbXBsZTJELCBzaHVmZmxlLCBEYXRhR2VuZXJhdG9yfSBmcm9tIFwiLi9kYXRhc2V0XCI7XG5cbi8qKiBTdWZmaXggYWRkZWQgdG8gdGhlIHN0YXRlIHdoZW4gc3RvcmluZyBpZiBhIGNvbnRyb2wgaXMgaGlkZGVuIG9yIG5vdC4gKi9cbmNvbnN0IEhJREVfU1RBVEVfU1VGRklYID0gXCJfaGlkZVwiO1xuXG4vKiogQSBtYXAgYmV0d2VlbiBuYW1lcyBhbmQgYWN0aXZhdGlvbiBmdW5jdGlvbnMuICovXG5leHBvcnQgbGV0IGFjdGl2YXRpb25zOiB7IFtrZXk6IHN0cmluZ106IG5uLkFjdGl2YXRpb25GdW5jdGlvbiB9ID0ge1xuXHRcInJlbHVcIjogbm4uQWN0aXZhdGlvbnMuUkVMVSxcblx0XCJ0YW5oXCI6IG5uLkFjdGl2YXRpb25zLlRBTkgsXG5cdFwic2lnbW9pZFwiOiBubi5BY3RpdmF0aW9ucy5TSUdNT0lELFxuXHRcImxpbmVhclwiOiBubi5BY3RpdmF0aW9ucy5MSU5FQVIsXG5cdFwic2lueFwiOiBubi5BY3RpdmF0aW9ucy5TSU5YXG59O1xuXG4vKiogQSBtYXAgYmV0d2VlbiBuYW1lcyBhbmQgcmVndWxhcml6YXRpb24gZnVuY3Rpb25zLiAqL1xuZXhwb3J0IGxldCByZWd1bGFyaXphdGlvbnM6IHsgW2tleTogc3RyaW5nXTogbm4uUmVndWxhcml6YXRpb25GdW5jdGlvbiB9ID0ge1xuXHRcIm5vbmVcIjogbnVsbCxcblx0XCJMMVwiOiBubi5SZWd1bGFyaXphdGlvbkZ1bmN0aW9uLkwxLFxuXHRcIkwyXCI6IG5uLlJlZ3VsYXJpemF0aW9uRnVuY3Rpb24uTDJcbn07XG5cbi8qKiBBIG1hcCBiZXR3ZWVuIGRhdGFzZXQgbmFtZXMgYW5kIGZ1bmN0aW9ucyB0aGF0IGdlbmVyYXRlIGNsYXNzaWZpY2F0aW9uIGRhdGEuICovXG5leHBvcnQgbGV0IGRhdGFzZXRzOiB7IFtrZXk6IHN0cmluZ106IGRhdGFzZXQuRGF0YUdlbmVyYXRvciB9ID0ge1xuXHRcImNpcmNsZVwiOiBkYXRhc2V0LmNsYXNzaWZ5Q2lyY2xlRGF0YSxcblx0XCJ4b3JcIjogZGF0YXNldC5jbGFzc2lmeVhPUkRhdGEsXG5cdFwiZ2F1c3NcIjogZGF0YXNldC5jbGFzc2lmeVR3b0dhdXNzRGF0YSxcblx0XCJzcGlyYWxcIjogZGF0YXNldC5jbGFzc2lmeVNwaXJhbERhdGEsXG5cdFwiYnlvZFwiOiBkYXRhc2V0LmNsYXNzaWZ5QllPRGF0YVxufTtcblxuLyoqIEEgbWFwIGJldHdlZW4gZGF0YXNldCBuYW1lcyBhbmQgZnVuY3Rpb25zIHRoYXQgZ2VuZXJhdGUgcmVncmVzc2lvbiBkYXRhLiAqL1xuZXhwb3J0IGxldCByZWdEYXRhc2V0czogeyBba2V5OiBzdHJpbmddOiBkYXRhc2V0LkRhdGFHZW5lcmF0b3IgfSA9IHtcblx0XCJyZWctcGxhbmVcIjogZGF0YXNldC5yZWdyZXNzUGxhbmUsXG5cdFwicmVnLWdhdXNzXCI6IGRhdGFzZXQucmVncmVzc0dhdXNzaWFuXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0S2V5RnJvbVZhbHVlKG9iajogYW55LCB2YWx1ZTogYW55KTogc3RyaW5nIHtcblx0Zm9yIChsZXQga2V5IGluIG9iaikge1xuXHRcdGlmIChvYmpba2V5XSA9PT0gdmFsdWUpIHtcblx0XHRcdHJldHVybiBrZXk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGVuZHNXaXRoKHM6IHN0cmluZywgc3VmZml4OiBzdHJpbmcpOiBib29sZWFuIHtcblx0cmV0dXJuIHMuc3Vic3RyKC1zdWZmaXgubGVuZ3RoKSA9PT0gc3VmZml4O1xufVxuXG5mdW5jdGlvbiBnZXRIaWRlUHJvcHMob2JqOiBhbnkpOiBzdHJpbmdbXSB7XG5cdGxldCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cdGZvciAobGV0IHByb3AgaW4gb2JqKSB7XG5cdFx0aWYgKGVuZHNXaXRoKHByb3AsIEhJREVfU1RBVEVfU1VGRklYKSkge1xuXHRcdFx0cmVzdWx0LnB1c2gocHJvcCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGRhdGEgdHlwZSBvZiBhIHN0YXRlIHZhcmlhYmxlLiBVc2VkIGZvciBkZXRlcm1pbmluZyB0aGVcbiAqIChkZSlzZXJpYWxpemF0aW9uIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGVudW0gVHlwZSB7XG5cdFNUUklORyxcblx0TlVNQkVSLFxuXHRBUlJBWV9OVU1CRVIsXG5cdEFSUkFZX1NUUklORyxcblx0Qk9PTEVBTixcblx0T0JKRUNUXG59XG5cbmV4cG9ydCBlbnVtIFByb2JsZW0ge1xuXHRDTEFTU0lGSUNBVElPTixcblx0UkVHUkVTU0lPTlxufVxuXG5leHBvcnQgbGV0IHByb2JsZW1zID0ge1xuXHRcImNsYXNzaWZpY2F0aW9uXCI6IFByb2JsZW0uQ0xBU1NJRklDQVRJT04sXG5cdFwicmVncmVzc2lvblwiOiBQcm9ibGVtLlJFR1JFU1NJT05cbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvcGVydHkge1xuXHRuYW1lOiBzdHJpbmc7XG5cdHR5cGU6IFR5cGU7XG5cdGtleU1hcD86IHsgW2tleTogc3RyaW5nXTogYW55IH07XG59XG5cbi8vIEFkZCB0aGUgR1VJIHN0YXRlLlxuZXhwb3J0IGNsYXNzIFN0YXRlIHtcblx0cHJpdmF0ZSBzdGF0aWMgUFJPUFM6IFByb3BlcnR5W10gPVxuXHRcdFtcblx0XHRcdHtuYW1lOiBcImFjdGl2YXRpb25cIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogYWN0aXZhdGlvbnN9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiBcInJlZ3VsYXJpemF0aW9uXCIsXG5cdFx0XHRcdHR5cGU6IFR5cGUuT0JKRUNULFxuXHRcdFx0XHRrZXlNYXA6IHJlZ3VsYXJpemF0aW9uc1xuXHRcdFx0fSxcblx0XHRcdHtuYW1lOiBcImJhdGNoU2l6ZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sXG5cdFx0XHR7bmFtZTogXCJkYXRhc2V0XCIsIHR5cGU6IFR5cGUuT0JKRUNULCBrZXlNYXA6IGRhdGFzZXRzfSxcblx0XHRcdHtuYW1lOiBcInJlZ0RhdGFzZXRcIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogcmVnRGF0YXNldHN9LFxuXHRcdFx0e25hbWU6IFwibGVhcm5pbmdSYXRlXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcblx0XHRcdHtuYW1lOiBcInRydWVMZWFybmluZ1JhdGVcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LCAvLyBUaGUgdHJ1ZSBsZWFybmluZyByYXRlXG5cdFx0XHR7bmFtZTogXCJyZWd1bGFyaXphdGlvblJhdGVcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwibm9pc2VcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuXHRcdFx0e25hbWU6IFwibmV0d29ya1NoYXBlXCIsIHR5cGU6IFR5cGUuQVJSQVlfTlVNQkVSfSxcblx0XHRcdHtuYW1lOiBcInNlZWRcIiwgdHlwZTogVHlwZS5TVFJJTkd9LFxuXHRcdFx0e25hbWU6IFwic2hvd1Rlc3REYXRhXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJkaXNjcmV0aXplXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJwZXJjVHJhaW5EYXRhXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcblx0XHRcdHtuYW1lOiBcInhcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInlcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInhUaW1lc1lcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcblx0XHRcdHtuYW1lOiBcInhTcXVhcmVkXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJ5U3F1YXJlZFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwiY29zWFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwic2luWFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwiY29zWVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwic2luWVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuXHRcdFx0e25hbWU6IFwiY29sbGVjdFN0YXRzXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJ0dXRvcmlhbFwiLCB0eXBlOiBUeXBlLlNUUklOR30sXG5cdFx0XHR7bmFtZTogXCJwcm9ibGVtXCIsIHR5cGU6IFR5cGUuT0JKRUNULCBrZXlNYXA6IHByb2JsZW1zfSxcblx0XHRcdHtuYW1lOiBcImluaXRaZXJvXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG5cdFx0XHR7bmFtZTogXCJoaWRlVGV4dFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59XG5cdFx0XTtcblxuXHRba2V5OiBzdHJpbmddOiBhbnk7XG5cblx0dG90YWxDYXBhY2l0eSA9IDAuMDtcblx0cmVxQ2FwYWNpdHkgPSAyO1xuXHRtYXhDYXBhY2l0eSA9IDA7XG5cdHN1Z0NhcGFjaXR5ID0gMDtcblx0bG9zc0NhcGFjaXR5ID0gMDtcblx0dHJ1ZUxlYXJuaW5nUmF0ZSA9IDAuMDtcblx0bGVhcm5pbmdSYXRlID0gMS4wO1xuXHRyZWd1bGFyaXphdGlvblJhdGUgPSAwO1xuXHRzaG93VGVzdERhdGEgPSBmYWxzZTtcblx0bm9pc2UgPSAzNTsgLy8gU05SZEJcblx0YmF0Y2hTaXplID0gMTA7XG5cdGRpc2NyZXRpemUgPSBmYWxzZTtcblx0dHV0b3JpYWw6IHN0cmluZyA9IG51bGw7XG5cdHBlcmNUcmFpbkRhdGEgPSA1MDtcblx0YWN0aXZhdGlvbiA9IG5uLkFjdGl2YXRpb25zLlNJR01PSUQ7XG5cdHJlZ3VsYXJpemF0aW9uOiBubi5SZWd1bGFyaXphdGlvbkZ1bmN0aW9uID0gbnVsbDtcblx0cHJvYmxlbSA9IFByb2JsZW0uQ0xBU1NJRklDQVRJT047XG5cdGluaXRaZXJvID0gZmFsc2U7XG5cdGhpZGVUZXh0ID0gZmFsc2U7XG5cdGNvbGxlY3RTdGF0cyA9IGZhbHNlO1xuXHRudW1IaWRkZW5MYXllcnMgPSAxO1xuXHRoaWRkZW5MYXllckNvbnRyb2xzOiBhbnlbXSA9IFtdO1xuXHRuZXR3b3JrU2hhcGU6IG51bWJlcltdID0gWzFdO1xuXHR4ID0gdHJ1ZTtcblx0eSA9IHRydWU7XG5cdHhUaW1lc1kgPSBmYWxzZTtcblx0eFNxdWFyZWQgPSBmYWxzZTtcblx0eVNxdWFyZWQgPSBmYWxzZTtcblx0Y29zWCA9IGZhbHNlO1xuXHRzaW5YID0gZmFsc2U7XG5cdGNvc1kgPSBmYWxzZTtcblx0c2luWSA9IGZhbHNlO1xuXHRieW9kID0gZmFsc2U7XG5cdGRhdGE6IEV4YW1wbGUyRFtdID0gW107XG5cdGRhdGFzZXQ6IGRhdGFzZXQuRGF0YUdlbmVyYXRvciA9IGRhdGFzZXQuY2xhc3NpZnlUd29HYXVzc0RhdGE7XG5cdHJlZ0RhdGFzZXQ6IGRhdGFzZXQuRGF0YUdlbmVyYXRvciA9IGRhdGFzZXQucmVncmVzc1BsYW5lO1xuXHRzZWVkOiBzdHJpbmc7XG5cdHNoaWZ0RG93bjogYm9vbGVhbjtcblxuXHQvKipcblx0ICogRGVzZXJpYWxpemVzIHRoZSBzdGF0ZSBmcm9tIHRoZSB1cmwgaGFzaC5cblx0ICovXG5cdHN0YXRpYyBkZXNlcmlhbGl6ZVN0YXRlKCk6IFN0YXRlIHtcblx0XHRsZXQgbWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cdFx0Zm9yIChsZXQga2V5dmFsdWUgb2Ygd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkuc3BsaXQoXCImXCIpKSB7XG5cdFx0XHRsZXQgW25hbWUsIHZhbHVlXSA9IGtleXZhbHVlLnNwbGl0KFwiPVwiKTtcblx0XHRcdG1hcFtuYW1lXSA9IHZhbHVlO1xuXHRcdH1cblx0XHRsZXQgc3RhdGUgPSBuZXcgU3RhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGhhc0tleShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiBuYW1lIGluIG1hcCAmJiBtYXBbbmFtZV0gIT0gbnVsbCAmJiBtYXBbbmFtZV0udHJpbSgpICE9PSBcIlwiO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHBhcnNlQXJyYXkodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcblx0XHRcdHJldHVybiB2YWx1ZS50cmltKCkgPT09IFwiXCIgPyBbXSA6IHZhbHVlLnNwbGl0KFwiLFwiKTtcblx0XHR9XG5cblx0XHQvLyBEZXNlcmlhbGl6ZSByZWd1bGFyIHByb3BlcnRpZXMuXG5cdFx0U3RhdGUuUFJPUFMuZm9yRWFjaCgoe25hbWUsIHR5cGUsIGtleU1hcH0pID0+IHtcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIFR5cGUuT0JKRUNUOlxuXHRcdFx0XHRcdGlmIChrZXlNYXAgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0dGhyb3cgRXJyb3IoXCJBIGtleS12YWx1ZSBtYXAgbXVzdCBiZSBwcm92aWRlZCBmb3Igc3RhdGUgXCIgK1xuXHRcdFx0XHRcdFx0XHRcInZhcmlhYmxlcyBvZiB0eXBlIE9iamVjdFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGhhc0tleShuYW1lKSAmJiBtYXBbbmFtZV0gaW4ga2V5TWFwKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZVtuYW1lXSA9IGtleU1hcFttYXBbbmFtZV1dO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBUeXBlLk5VTUJFUjpcblx0XHRcdFx0XHRpZiAoaGFzS2V5KG5hbWUpKSB7XG5cdFx0XHRcdFx0XHQvLyBUaGUgKyBvcGVyYXRvciBpcyBmb3IgY29udmVydGluZyBhIHN0cmluZyB0byBhIG51bWJlci5cblx0XHRcdFx0XHRcdHN0YXRlW25hbWVdID0gK21hcFtuYW1lXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVHlwZS5TVFJJTkc6XG5cdFx0XHRcdFx0aWYgKGhhc0tleShuYW1lKSkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBtYXBbbmFtZV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQk9PTEVBTjpcblx0XHRcdFx0XHRpZiAoaGFzS2V5KG5hbWUpKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZVtuYW1lXSA9IChtYXBbbmFtZV0gPT09IFwiZmFsc2VcIiA/IGZhbHNlIDogdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQVJSQVlfTlVNQkVSOlxuXHRcdFx0XHRcdGlmIChuYW1lIGluIG1hcCkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBwYXJzZUFycmF5KG1hcFtuYW1lXSkubWFwKE51bWJlcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFR5cGUuQVJSQVlfU1RSSU5HOlxuXHRcdFx0XHRcdGlmIChuYW1lIGluIG1hcCkge1xuXHRcdFx0XHRcdFx0c3RhdGVbbmFtZV0gPSBwYXJzZUFycmF5KG1hcFtuYW1lXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IEVycm9yKFwiRW5jb3VudGVyZWQgYW4gdW5rbm93biB0eXBlIGZvciBhIHN0YXRlIHZhcmlhYmxlXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gRGVzZXJpYWxpemUgc3RhdGUgcHJvcGVydGllcyB0aGF0IGNvcnJlc3BvbmQgdG8gaGlkaW5nIFVJIGNvbnRyb2xzLlxuXHRcdGdldEhpZGVQcm9wcyhtYXApLmZvckVhY2gocHJvcCA9PiB7XG5cdFx0XHRzdGF0ZVtwcm9wXSA9IChtYXBbcHJvcF0gPT09IFwidHJ1ZVwiKTtcblx0XHR9KTtcblx0XHRzdGF0ZS5udW1IaWRkZW5MYXllcnMgPSBzdGF0ZS5uZXR3b3JrU2hhcGUubGVuZ3RoO1xuXHRcdGlmIChzdGF0ZS5zZWVkID09IG51bGwpIHtcblx0XHRcdHN0YXRlLnNlZWQgPSBNYXRoLnJhbmRvbSgpLnRvRml4ZWQoNSk7XG5cdFx0fVxuXHRcdE1hdGguc2VlZHJhbmRvbShzdGF0ZS5zZWVkKTtcblx0XHRzdGF0ZS5zaGlmdERvd24gPSBmYWxzZTtcblx0XHRyZXR1cm4gc3RhdGU7XG5cdH1cblxuXHQvKipcblx0ICogU2VyaWFsaXplcyB0aGUgc3RhdGUgaW50byB0aGUgdXJsIGhhc2guXG5cdCAqL1xuXHRzZXJpYWxpemUoKSB7XG5cdFx0Ly8gU2VyaWFsaXplIHJlZ3VsYXIgcHJvcGVydGllcy5cblx0XHRsZXQgcHJvcHM6IHN0cmluZ1tdID0gW107XG5cdFx0U3RhdGUuUFJPUFMuZm9yRWFjaCgoe25hbWUsIHR5cGUsIGtleU1hcH0pID0+IHtcblx0XHRcdGxldCB2YWx1ZSA9IHRoaXNbbmFtZV07XG5cdFx0XHQvLyBEb24ndCBzZXJpYWxpemUgbWlzc2luZyB2YWx1ZXMuXG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZSA9PT0gVHlwZS5PQkpFQ1QpIHtcblx0XHRcdFx0dmFsdWUgPSBnZXRLZXlGcm9tVmFsdWUoa2V5TWFwLCB2YWx1ZSk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IFR5cGUuQVJSQVlfTlVNQkVSIHx8IHR5cGUgPT09IFR5cGUuQVJSQVlfU1RSSU5HKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuam9pbihcIixcIik7XG5cdFx0XHR9XG5cdFx0XHRwcm9wcy5wdXNoKGAke25hbWV9PSR7dmFsdWV9YCk7XG5cdFx0fSk7XG5cdFx0Ly8gU2VyaWFsaXplIHByb3BlcnRpZXMgdGhhdCBjb3JyZXNwb25kIHRvIGhpZGluZyBVSSBjb250cm9scy5cblx0XHRnZXRIaWRlUHJvcHModGhpcykuZm9yRWFjaChwcm9wID0+IHtcblx0XHRcdHByb3BzLnB1c2goYCR7cHJvcH09JHt0aGlzW3Byb3BdfWApO1xuXHRcdH0pO1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcHJvcHMuam9pbihcIiZcIik7XG5cdH1cblxuXHQvKiogUmV0dXJucyBhbGwgdGhlIGhpZGRlbiBwcm9wZXJ0aWVzLiAqL1xuXHRnZXRIaWRkZW5Qcm9wcygpOiBzdHJpbmdbXSB7XG5cdFx0bGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblx0XHRmb3IgKGxldCBwcm9wIGluIHRoaXMpIHtcblx0XHRcdGlmIChlbmRzV2l0aChwcm9wLCBISURFX1NUQVRFX1NVRkZJWCkgJiYgU3RyaW5nKHRoaXNbcHJvcF0pID09PSBcInRydWVcIikge1xuXHRcdFx0XHRyZXN1bHQucHVzaChwcm9wLnJlcGxhY2UoSElERV9TVEFURV9TVUZGSVgsIFwiXCIpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdHNldEhpZGVQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIGhpZGRlbjogYm9vbGVhbikge1xuXHRcdHRoaXNbbmFtZSArIEhJREVfU1RBVEVfU1VGRklYXSA9IGhpZGRlbjtcblx0fVxufVxuIl19
