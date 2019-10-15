(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
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
    function getXORLabel(p) { return p.x * p.y >= 0 ? 1 : -1; }
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
    ;
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
        this.settings = {
            showAxes: false,
            noSvg: false
        };
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
            .range(["#93f522", "#eae8eb", "#7708bd"])
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
        return function (t) { scrollTo(0, i(t)); };
    };
}
var RECT_SIZE = 30;
var BIAS_SIZE = 5;
var NUM_SAMPLES_CLASSIFY = 500;
var NUM_SAMPLES_REGRESS = 1200;
var DENSITY = 100;
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
    .range(["#93f522", "#eae8eb", "#7708bd"])
    .clamp(true);
var iter = 0;
var trainData = [];
var testData = [];
var network = null;
var lossTrain = 2;
var lossTest = 0;
var trueLearningRate = 0;
var totalCapacity = 0;
var reqCapacity = 2;
var player = new Player();
var lineChart = new linechart_1.AppendingLineChart(d3.select("#linechart"), ["#777", "black"]);
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
        if (newDataset === state.dataset) {
            return;
        }
        state.dataset = newDataset;
        var datasetKey = state_1.getKeyFromValue(state_1.datasets, newDataset);
        if (datasetKey === "circle")
            reqCapacity = 12;
        if (datasetKey === "xor")
            reqCapacity = 4;
        if (datasetKey === "gauss")
            reqCapacity = 2;
        if (datasetKey === "spiral")
            reqCapacity = 320;
        state.reqCapacity = reqCapacity;
        d3.select("label[for='bitBatchSize'] .value").text(state.reqCapacity);
        dataThumbnails.classed("selected", false);
        d3.select(this).classed("selected", true);
        state.noise = 35;
        generateData();
        parametersChanged = true;
        reset();
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
        if (state.numHiddenLayers >= 6) {
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
        generateData();
        d3.select("label[for='percTrainData'] .value").text(this.value);
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
        d3.select("label[for='bitBatchSize'] .value").text(state.reqCapacity);
        parametersChanged = true;
        reset();
    });
    noise.property("value", state.noise);
    d3.select("label[for='true-noiseSNR'] .value").text(state.noise);
    d3.select("label[for='bitBatchSize'] .value").text(state.reqCapacity);
    var batchSize = d3.select("#batchSize").on("input", function () {
        state.batchSize = this.value;
        d3.select("label[for='batchSize'] .value").text(this.value);
        d3.select("label[for='bitBatchSize'] .value").text(state.reqCapacity);
        parametersChanged = true;
        reset();
    });
    batchSize.property("value", state.batchSize);
    d3.select("label[for='batchSize'] .value").text(state.batchSize);
    d3.select("label[for='bitBatchSize'] .value").text(state.reqCapacity);
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
    var nodeGroup = container.append("g")
        .attr({
        "class": "node",
        "id": "node" + nodeId,
        "transform": "translate(" + x + "," + y + ")"
    });
    nodeGroup.append("rect")
        .attr({
        x: 0,
        y: 0,
        width: RECT_SIZE,
        height: RECT_SIZE
    });
    var activeOrNotClass = state[nodeId] ? "active" : "inactive";
    if (isInput) {
        var label = INPUTS[nodeId].label != null ?
            INPUTS[nodeId].label : nodeId;
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
        nodeGroup.append("rect")
            .attr({
            id: "bias-" + nodeId,
            x: -BIAS_SIZE - 2,
            y: RECT_SIZE - BIAS_SIZE + 3,
            width: BIAS_SIZE,
            height: BIAS_SIZE
        }).on("mouseenter", function () {
            updateHoverCard(HoverType.BIAS, node, d3.mouse(container.node()));
        }).on("mouseleave", function () {
            updateHoverCard(null);
        });
    }
    var div = d3.select("#network").insert("div", ":first-child")
        .attr({
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
        if (numNeurons >= 8) {
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
    var totalCapacity = 1;
    for (var layerIdx = 0; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        if (currentLayer.length > 1) {
            for (var i = 0; i < currentLayer.length; i++) {
                totalCapacity++;
                var node = currentLayer[i];
                for (var j = 0; j < node.inputLinks.length; j++) {
                    totalCapacity++;
                }
            }
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
    d3.select("#loss-train").text(humanReadable(bitLossTrain));
    d3.select("#loss-test").text(humanReadable(bitLossTest));
    d3.select("#trueLearningRate").text(humanReadable(bitTrueLearningRate));
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
    drawNetwork(network);
    updateUI(true);
}
;
function initTutorial() {
    if (state.tutorial == null || state.tutorial === '' || state.hideText) {
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
    var generator = state.problem === state_1.Problem.CLASSIFICATION ?
        state.dataset : state.regDataset;
    var data = generator(numSamples, state.noise);
    dataset_1.shuffle(data);
    var splitIndex = Math.floor(data.length * state.percTrainData / 100);
    trainData = data.slice(0, splitIndex);
    testData = data.slice(splitIndex);
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
    var page = 'index';
    if (state.tutorial != null && state.tutorial !== '') {
        page = "/v/tutorials/" + state.tutorial;
    }
    ga('set', 'page', page);
    ga('send', 'pageview', { 'sessionControl': 'start' });
}
function simulationStarted() {
    ga('send', {
        hitType: 'event',
        eventCategory: 'Starting Simulation',
        eventAction: parametersChanged ? 'changed' : 'unchanged',
        eventLabel: state.tutorial == null ? '' : state.tutorial
    });
    parametersChanged = false;
}
drawDatasetThumbnails();
initTutorial();
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
    "spiral": dataset.classifySpiralData
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
;
var State = (function () {
    function State() {
        this.totalCapacity = 0.0;
        this.reqCapacity = 2;
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
            state[prop] = (map[prop] === "true") ? true : false;
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
            else if (type === Type.ARRAY_NUMBER ||
                type === Type.ARRAY_STRING) {
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
    { name: "regularization", type: Type.OBJECT, keyMap: exports.regularizations },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGF0YXNldC50cyIsInNyYy9oZWF0bWFwLnRzIiwic3JjL2xpbmVjaGFydC50cyIsInNyYy9ubi50cyIsInNyYy9wbGF5Z3JvdW5kLnRzIiwic3JjL3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQzJDQSw4QkFBcUMsVUFBa0IsRUFBRSxLQUFhO0lBRXBFLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUM7SUFDN0IsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBR25CLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV6QixrQkFBa0IsRUFBVSxFQUFFLEVBQVUsRUFBRSxLQUFhO1FBQ3JELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzNDLElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxHQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlDLElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxHQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNDLElBQUksT0FBTyxHQUFHLFlBQVksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDekMsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztRQUM3QixDQUFDO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQXZCRCxvREF1QkM7QUFRRCw0QkFBbUMsVUFBa0IsRUFBRSxLQUFhO0lBSWxFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV6QixJQUFJLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO0lBQzdCLElBQUksQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFFdkIsbUJBQW1CLE1BQWMsRUFBRSxLQUFhO1FBQzlDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztZQUNiLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQztZQUM1QyxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QyxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUM7UUFDN0IsQ0FBQztJQUNILENBQUM7SUFDRCxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hCLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBeEJELGdEQXdCQztBQU9ELDRCQUFtQyxVQUFrQixFQUFFLEtBQWE7SUFJbEUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXpCLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUM7SUFDN0IsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBR2YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFHckMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztRQUNiLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUc1QixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsTUFBTSxHQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLENBQUMsSUFBSSxNQUFNLENBQUM7UUFDWixDQUFDLElBQUksTUFBTSxDQUFDO1FBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBR0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFHMUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztRQUNkLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUc1QixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsTUFBTSxHQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLENBQUMsSUFBSSxNQUFNLENBQUM7UUFDWixDQUFDLElBQUksTUFBTSxDQUFDO1FBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFoREQsZ0RBZ0RDO0FBT0QseUJBQWdDLFVBQWtCLEVBQUUsS0FBYTtJQUcvRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFHekIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLHFCQUFxQixDQUFRLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRSxJQUFJLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO0lBQzdCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNsQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUVoQyxJQUFJLGNBQWMsR0FBRyxTQUFTLEdBQUMsU0FBUyxDQUFDO1FBQ3pDLElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsY0FBYyxHQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsY0FBYyxHQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUF4QkQsMENBd0JDO0FBUUQsc0JBQTZCLFVBQWtCLEVBQUUsS0FBYTtJQUU1RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsSUFBSSxFQUFFLEdBQUcsTUFBTSxHQUFDLE1BQU0sQ0FBQztJQUN2QixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtTQUMvQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNqQixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLElBQUksUUFBUSxHQUFHLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQWpCLENBQWlCLENBQUM7SUFFM0MsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztJQUM3QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQXBCRCxvQ0FvQkM7QUFFRCx5QkFBZ0MsVUFBa0IsRUFBRSxLQUFhO0lBRS9ELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV6QixJQUFJLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO0lBQzdCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1NBQy9CLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNkLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNiLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVmLElBQUksU0FBUyxHQUFHO1FBQ2QsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNkLENBQUM7SUFFRixrQkFBa0IsQ0FBQyxFQUFFLENBQUM7UUFFcEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQWM7Z0JBQWIsVUFBRSxFQUFFLFVBQUUsRUFBRSxZQUFJO1lBQzlCLElBQUksUUFBUSxHQUFHLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUMvRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ25CLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBQ0QsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsSUFBSSxFQUFFLEdBQUcsTUFBTSxHQUFDLE1BQU0sQ0FBQztJQUN2QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUFBLENBQUM7SUFDRixNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUF6Q0QsMENBeUNDO0FBV0QsaUJBQXdCLEtBQVk7SUFDbEMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUMzQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7SUFDYixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFFZCxPQUFPLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUVuQixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFFNUMsT0FBTyxFQUFFLENBQUM7UUFFVixJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RCLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0FBQ0gsQ0FBQztBQWZELDBCQWVDO0FBRUQsY0FBYyxDQUFTO0lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUVELGVBQWUsQ0FBUztJQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxrQkFBa0IsQ0FBUztJQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUVELGNBQWMsQ0FBUztJQUN0QixNQUFNLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBTUQscUJBQXFCLENBQVMsRUFBRSxDQUFTO0lBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFTRCxzQkFBc0IsSUFBUSxFQUFFLFFBQVk7SUFBdEIscUJBQUEsRUFBQSxRQUFRO0lBQUUseUJBQUEsRUFBQSxZQUFZO0lBQzFDLElBQUksRUFBVSxFQUFFLEVBQVUsRUFBRSxDQUFTLENBQUM7SUFDdEMsR0FBRyxDQUFDO1FBQ0YsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBRWhCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbEQsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUM3QyxDQUFDO0FBR0QsY0FBYyxDQUFRLEVBQUUsQ0FBUTtJQUM5QixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7Ozs7QUNuVEQsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBT3RCO0lBWUUsaUJBQ0ksS0FBYSxFQUFFLFVBQWtCLEVBQUUsT0FBeUIsRUFDNUQsT0FBeUIsRUFBRSxTQUE0QixFQUN2RCxZQUE4QjtRQWQxQixhQUFRLEdBQW9CO1lBQ2xDLFFBQVEsRUFBRSxLQUFLO1lBQ2YsS0FBSyxFQUFFLEtBQUs7U0FDYixDQUFDO1FBWUEsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksT0FBTyxHQUFHLFlBQVksQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUU3QyxFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV6QixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0gsQ0FBQztRQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7YUFDNUIsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUNmLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTthQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDO2FBQ2YsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUdwQyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBa0I7YUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNsQixLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ3hDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUtqQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1lBQ3RELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFVO2FBQ3RCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2YsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWhDLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzthQUNoQyxLQUFLLENBQUM7WUFDTCxLQUFLLEVBQUssS0FBSyxPQUFJO1lBQ25CLE1BQU0sRUFBSyxNQUFNLE9BQUk7WUFDckIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsR0FBRyxFQUFFLE1BQUksT0FBTyxPQUFJO1lBQ3BCLElBQUksRUFBRSxNQUFJLE9BQU8sT0FBSTtTQUN0QixDQUFDLENBQUM7UUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO2FBQ3JDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO2FBQ3pCLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDO2FBQzFCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQzthQUM1QyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDOUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7YUFDN0IsS0FBSyxDQUFDLEtBQUssRUFBSyxPQUFPLE9BQUksQ0FBQzthQUM1QixLQUFLLENBQUMsTUFBTSxFQUFLLE9BQU8sT0FBSSxDQUFDLENBQUM7UUFFakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDcEMsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsUUFBUSxFQUFFLE1BQU07YUFDbkIsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFFUCxVQUFVLEVBQUUsVUFBVTtnQkFDdEIsTUFBTSxFQUFFLEdBQUc7Z0JBQ1gsS0FBSyxFQUFFLEdBQUc7YUFDWCxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDWCxJQUFJLENBQUMsV0FBVyxFQUFFLGVBQWEsT0FBTyxTQUFJLE9BQU8sTUFBRyxDQUFDLENBQUM7WUFFekQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7aUJBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2lCQUNsQixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFcEIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7aUJBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2lCQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO2lCQUNqQixJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztpQkFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxrQkFBZSxNQUFNLEdBQUcsQ0FBQyxHQUFHLE9BQU8sT0FBRyxDQUFDO2lCQUN6RCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFZixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ2pCLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO2lCQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLFlBQVksR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO2lCQUMvRCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakIsQ0FBQztJQUNILENBQUM7SUFFRCxrQ0FBZ0IsR0FBaEIsVUFBaUIsTUFBbUI7UUFDbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELDhCQUFZLEdBQVosVUFBYSxNQUFtQjtRQUM5QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsa0NBQWdCLEdBQWhCLFVBQWlCLElBQWdCLEVBQUUsVUFBbUI7UUFDcEQsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN4QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXJCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNyRCxNQUFNLElBQUksS0FBSyxDQUNYLDJDQUEyQztnQkFDM0MseUJBQXlCLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBR0QsSUFBSSxPQUFPLEdBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQXdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pFLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTVDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3BDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQzVCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDZixLQUFLLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO2dCQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQ3hCLENBQUM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFTywrQkFBYSxHQUFyQixVQUFzQixTQUE0QixFQUFFLE1BQW1CO1FBQXZFLGlCQXlCQztRQXZCQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25DLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbkMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7bUJBQ3hDLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO1FBR0gsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFHM0QsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBR2hELFNBQVM7YUFDTixJQUFJLENBQUM7WUFDSixFQUFFLEVBQUUsVUFBQyxDQUFZLElBQUssT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBaEIsQ0FBZ0I7WUFDdEMsRUFBRSxFQUFFLFVBQUMsQ0FBWSxJQUFLLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQWhCLENBQWdCO1NBQ3ZDLENBQUM7YUFDRCxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQW5CLENBQW1CLENBQUMsQ0FBQztRQUczQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUNILGNBQUM7QUFBRCxDQS9LQSxBQStLQyxJQUFBO0FBL0tZLDBCQUFPO0FBaUxwQixzQkFBNkIsTUFBa0IsRUFBRSxNQUFjO0lBQzdELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNEO1lBQ2xFLHNCQUFzQixDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNELElBQUksTUFBTSxHQUFlLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDM0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUMvQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDdkQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUMvQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFFWixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNoQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNoQyxHQUFHLElBQUksTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLENBQUM7WUFDSCxDQUFDO1lBQ0QsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN2QyxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQXhCRCxvQ0F3QkM7Ozs7QUNqTkQ7SUFZRSw0QkFBWSxTQUE0QixFQUFFLFVBQW9CO1FBVnRELFNBQUksR0FBZ0IsRUFBRSxDQUFDO1FBT3ZCLFNBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3hCLFNBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBRzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFpQixDQUFDO1FBQzNDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDbEMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNwQyxJQUFJLE1BQU0sR0FBRyxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUMsQ0FBQztRQUNwRCxJQUFJLEtBQUssR0FBRyxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BELElBQUksTUFBTSxHQUFHLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFdEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTthQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUVyQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO2FBQzVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNkLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRCLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDL0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ2pELElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQzthQUNuRCxNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ1QsSUFBSSxDQUFDLFdBQVcsRUFBRSxlQUFhLE1BQU0sQ0FBQyxJQUFJLFNBQUksTUFBTSxDQUFDLEdBQUcsTUFBRyxDQUFDLENBQUM7UUFFbEUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7aUJBQ3BDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO2lCQUNyQixLQUFLLENBQUM7Z0JBQ0wsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLGNBQWMsRUFBRSxPQUFPO2FBQ3hCLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDSCxDQUFDO0lBRUQsa0NBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBRUQseUNBQVksR0FBWixVQUFhLFNBQW1CO1FBQWhDLGlCQVdDO1FBVkMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2QyxNQUFNLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFDRCxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztZQUNqQixLQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuQyxLQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVPLG1DQUFNLEdBQWQ7UUFBQSxpQkFhQztRQVhDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFM0MsSUFBSSxVQUFVLEdBQUcsVUFBQyxTQUFpQjtZQUNqQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQWE7aUJBQzlCLENBQUMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFoQixDQUFnQixDQUFDO2lCQUN4QixDQUFDLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQztRQUNGLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELENBQUM7SUFDSCxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQWxGQSxBQWtGQyxJQUFBO0FBbEZZLGdEQUFrQjs7OztBQ0gvQjtJQWdDRSxjQUFZLEVBQVUsRUFBRSxVQUE4QixFQUFFLFFBQWtCO1FBN0IxRSxlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLFNBQUksR0FBRyxHQUFHLENBQUM7UUFFWCxZQUFPLEdBQVcsRUFBRSxDQUFDO1FBSXJCLHFCQUFnQixHQUFHLENBQUMsQ0FBQztRQUVyQixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBRWQsYUFBUSxHQUFHLENBQUMsQ0FBQztRQU1iLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBS2hCLHVCQUFrQixHQUFHLENBQUMsQ0FBQztRQVFyQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNoQixDQUFDO0lBQ0gsQ0FBQztJQUdELDJCQUFZLEdBQVo7UUFFRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDNUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2hELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3RELENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBQ0gsV0FBQztBQUFELENBbkRBLEFBbURDLElBQUE7QUFuRFksb0JBQUk7QUEwRWpCO0lBQUE7SUFNQSxDQUFDO0lBQUQsYUFBQztBQUFELENBTkEsQUFNQztBQUxlLGFBQU0sR0FBa0I7SUFDcEMsS0FBSyxFQUFFLFVBQUMsTUFBYyxFQUFFLE1BQWM7UUFDM0IsT0FBQSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUFsQyxDQUFrQztJQUM3QyxHQUFHLEVBQUUsVUFBQyxNQUFjLEVBQUUsTUFBYyxJQUFLLE9BQUEsTUFBTSxHQUFHLE1BQU0sRUFBZixDQUFlO0NBQ3pELENBQUM7QUFMUyx3QkFBTTtBQVNsQixJQUFZLENBQUMsSUFBSSxHQUFJLElBQVksQ0FBQyxJQUFJLElBQUksVUFBUyxDQUFDO0lBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7QUFDSCxDQUFDLENBQUM7QUFHRjtJQUFBO0lBMkJBLENBQUM7SUFBRCxrQkFBQztBQUFELENBM0JBLEFBMkJDO0FBMUJlLGdCQUFJLEdBQXVCO0lBQ3ZDLE1BQU0sRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFDLElBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQXJCLENBQXFCO0lBQ2xDLEdBQUcsRUFBRSxVQUFBLENBQUM7UUFDSixJQUFJLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDN0IsQ0FBQztDQUNGLENBQUM7QUFDWSxnQkFBSSxHQUF1QjtJQUN2QyxNQUFNLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBZCxDQUFjO0lBQzNCLEdBQUcsRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBZCxDQUFjO0NBQ3pCLENBQUM7QUFDWSxtQkFBTyxHQUF1QjtJQUMxQyxNQUFNLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQXRCLENBQXNCO0lBQ25DLEdBQUcsRUFBRSxVQUFBLENBQUM7UUFDSixJQUFJLE1BQU0sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRixDQUFDO0FBQ1ksa0JBQU0sR0FBdUI7SUFDekMsTUFBTSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxFQUFELENBQUM7SUFDZCxHQUFHLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEVBQUQsQ0FBQztDQUNaLENBQUM7QUFDWSxnQkFBSSxHQUF1QjtJQUN4QyxNQUFNLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFYLENBQVc7SUFDeEIsR0FBRyxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBWCxDQUFXO0NBQ3JCLENBQUM7QUExQlMsa0NBQVc7QUE4QnhCO0lBQUE7SUFTQSxDQUFDO0lBQUQsNkJBQUM7QUFBRCxDQVRBLEFBU0M7QUFSZSx5QkFBRSxHQUEyQjtJQUN6QyxNQUFNLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFYLENBQVc7SUFDeEIsR0FBRyxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUE1QixDQUE0QjtDQUN2QyxDQUFDO0FBQ1kseUJBQUUsR0FBMkI7SUFDekMsTUFBTSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQVgsQ0FBVztJQUN4QixHQUFHLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEVBQUQsQ0FBQztDQUNaLENBQUM7QUFSUyx3REFBc0I7QUFpQm5DO0lBd0JFLGNBQVksTUFBWSxFQUFFLElBQVUsRUFDaEMsY0FBc0MsRUFBRSxRQUFrQjtRQXJCOUQsV0FBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDN0IsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUVmLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFYixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUVoQix1QkFBa0IsR0FBRyxDQUFDLENBQUM7UUFHdkIscUJBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBWW5CLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNyQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbEIsQ0FBQztJQUNILENBQUM7SUFDSCxXQUFDO0FBQUQsQ0FsQ0EsQUFrQ0MsSUFBQTtBQWxDWSxvQkFBSTtBQWlEakIsc0JBQ0ksWUFBc0IsRUFBRSxVQUE4QixFQUN0RCxnQkFBb0MsRUFDcEMsY0FBc0MsRUFDdEMsUUFBa0IsRUFBRSxRQUFrQjtJQUN4QyxJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0lBQ3BDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVYLElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQ3hELElBQUksYUFBYSxHQUFHLFFBQVEsS0FBSyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLElBQUksWUFBWSxHQUFHLFFBQVEsS0FBSyxDQUFDLENBQUM7UUFDbEMsSUFBSSxZQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0IsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbEMsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEVBQUUsRUFBRSxDQUFDO1lBQ1AsQ0FBQztZQUNELElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFDdEIsYUFBYSxHQUFHLGdCQUFnQixHQUFHLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM3RCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVsQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3RELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUM5RCxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzdCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFyQ0Qsb0NBcUNDO0FBWUQscUJBQTRCLE9BQWlCLEVBQUUsTUFBZ0I7SUFDN0QsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3REFBd0Q7WUFDcEUsa0JBQWtCLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDM0MsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUM3RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0MsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDL0MsQ0FBQztBQXBCRCxrQ0FvQkM7QUFTRCxrQkFBeUIsT0FBaUIsRUFBRSxNQUFjLEVBQ3RELFNBQXdCO0lBRzFCLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hELFVBQVUsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBR2hFLEdBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLFFBQVEsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUNsRSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFJckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0MsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdEUsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzVCLENBQUM7UUFHRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM3QyxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsUUFBUSxDQUFDO2dCQUNYLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNuRCxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzVCLENBQUM7UUFDSCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsUUFBUSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXhCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDN0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3pELENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUEvQ0QsNEJBK0NDO0FBTUQsdUJBQThCLE9BQWlCLEVBQUUsWUFBb0IsRUFDakUsa0JBQTBCO0lBQzVCLEdBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQzdELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM3QyxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztnQkFDM0QsSUFBSSxDQUFDLElBQUksSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUNsRCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBRUQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsUUFBUSxDQUFDO2dCQUNYLENBQUM7Z0JBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWM7b0JBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUVoQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7b0JBQ25FLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO29CQUlqRSxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTTt3QkFDM0IsQ0FBQyxZQUFZLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxRQUFRLENBQUM7b0JBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLEtBQUssc0JBQXNCLENBQUMsRUFBRTt3QkFDakQsSUFBSSxDQUFDLE1BQU0sR0FBRyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO29CQUNyQixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDO29CQUM5QixDQUFDO29CQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUNyQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQTVDRCxzQ0E0Q0M7QUFHRCxxQkFBNEIsT0FBaUIsRUFBRSxZQUFxQixFQUNoRSxRQUE2QjtJQUMvQixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxZQUFZLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFDcEMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQ3pCLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDZixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0MsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFYRCxrQ0FXQztBQUdELHVCQUE4QixPQUFpQjtJQUM3QyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUZELHNDQUVDOzs7O0FDdFlELHlCQUEyQjtBQUMzQixxQ0FBZ0Q7QUFDaEQsaUNBU2lCO0FBQ2pCLHFDQUE2QztBQUM3Qyx5Q0FBK0M7QUFFL0MsSUFBSSxTQUFTLENBQUM7QUFFZCxjQUFjLENBQVM7SUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRUQsZUFBZSxDQUFTO0lBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVELGtCQUFrQixDQUFTO0lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRUQsYUFBYSxDQUFTO0lBQ3JCLE1BQU0sQ0FBQyxFQUFFLEdBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFHRCxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7SUFDcEMsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBQ25CLEVBQUUsQ0FBQyxVQUFVLEVBQUU7U0FDWixRQUFRLENBQUMsSUFBSSxDQUFDO1NBQ2QsS0FBSyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUMsQ0FBQztBQUVILHFCQUFxQixNQUFNO0lBQ3pCLE1BQU0sQ0FBQztRQUNMLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsV0FBVztZQUMzQyxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsVUFBUyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsSUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNwQixJQUFNLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQUNqQyxJQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQztBQUNqQyxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFFcEIsSUFBSyxTQUVKO0FBRkQsV0FBSyxTQUFTO0lBQ1oseUNBQUksQ0FBQTtJQUFFLDZDQUFNLENBQUE7QUFDZCxDQUFDLEVBRkksU0FBUyxLQUFULFNBQVMsUUFFYjtBQU9ELElBQUksTUFBTSxHQUFtQztJQUMzQyxHQUFHLEVBQUUsRUFBQyxDQUFDLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxFQUFELENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDO0lBQ25DLEdBQUcsRUFBRSxFQUFDLENBQUMsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUM7SUFDbkMsVUFBVSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsR0FBRyxDQUFDLEVBQUwsQ0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUM7SUFDaEQsVUFBVSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsR0FBRyxDQUFDLEVBQUwsQ0FBSyxFQUFHLEtBQUssRUFBRSxPQUFPLEVBQUM7SUFDakQsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsR0FBRyxDQUFDLEVBQUwsQ0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUM7SUFDaEQsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUM7SUFDckQsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUM7Q0FDdEQsQ0FBQztBQUVGLElBQUksZ0JBQWdCLEdBQUc7SUFDckIsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUM7SUFDbEMsQ0FBQyxtQkFBbUIsRUFBRSxZQUFZLENBQUM7SUFDbkMsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDO0lBQzdCLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQztJQUM3QixDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUM7SUFDL0IsQ0FBQyxtQkFBbUIsRUFBRSxjQUFjLENBQUM7SUFDckMsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUM7SUFDckMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO0lBQzVCLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7SUFDcEMsQ0FBQyxxQkFBcUIsRUFBRSxvQkFBb0IsQ0FBQztJQUM3QyxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUM7SUFDM0IsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDO0lBQzVCLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxDQUFDO0lBQ3JDLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQztJQUN4QixDQUFDLFlBQVksRUFBRSxXQUFXLENBQUM7SUFDM0IsQ0FBQyxvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQztDQUMxQyxDQUFDO0FBRUY7SUFBQTtRQUNVLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFDZixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGFBQVEsR0FBaUMsSUFBSSxDQUFDO0lBOEN4RCxDQUFDO0lBM0NDLDRCQUFXLEdBQVg7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixpQkFBaUIsRUFBRSxDQUFDO1lBQ3RCLENBQUM7WUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUVELDRCQUFXLEdBQVgsVUFBWSxRQUFzQztRQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRUQscUJBQUksR0FBSjtRQUNFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsc0JBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxDQUFDO0lBQ0gsQ0FBQztJQUVPLHNCQUFLLEdBQWIsVUFBYyxlQUF1QjtRQUFyQyxpQkFRQztRQVBDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDUCxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1lBQ0QsT0FBTyxFQUFFLENBQUM7WUFDVixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUNILGFBQUM7QUFBRCxDQWpEQSxBQWlEQyxJQUFBO0FBRUQsSUFBSSxLQUFLLEdBQUcsYUFBSyxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFHckMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7SUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbkIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxRQUFRLEdBQStCLEVBQUUsQ0FBQztBQUM5QyxJQUFJLGNBQWMsR0FBVyxJQUFJLENBQUM7QUFFbEMsSUFBSSxPQUFPLEdBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEMsSUFBSSxPQUFPLEdBQ1AsSUFBSSxpQkFBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUM3RCxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBQzFCLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0tBQ25DLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNkLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNmLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFVO0tBQ3BCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNsQixLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3hDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDYixJQUFJLFNBQVMsR0FBZ0IsRUFBRSxDQUFDO0FBQ2hDLElBQUksUUFBUSxHQUFnQixFQUFFLENBQUM7QUFDL0IsSUFBSSxPQUFPLEdBQWdCLElBQUksQ0FBQztBQUNoQyxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDcEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUMxQixJQUFJLFNBQVMsR0FBRyxJQUFJLDhCQUFrQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQzFELENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFFdkI7SUFDRSxFQUFFLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7UUFDckMsS0FBSyxFQUFFLENBQUM7UUFDUixpQkFBaUIsRUFBRSxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBRTFDLGlCQUFpQixFQUFFLENBQUM7UUFDcEIsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFBLFNBQVM7UUFDMUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUN6QyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixpQkFBaUIsRUFBRSxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsaUJBQWlCLEVBQUUsQ0FBQztRQUN0QixDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQzFDLFlBQVksRUFBRSxDQUFDO1FBQ2YsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzFELGNBQWMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ3pCLElBQUksVUFBVSxHQUFHLGdCQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRCxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELEtBQUssQ0FBQyxPQUFPLEdBQUksVUFBVSxDQUFDO1FBQzVCLElBQUksVUFBVSxHQUFHLHVCQUFlLENBQUMsZ0JBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN2RCxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssUUFBUyxDQUFDO1lBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUMvQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssS0FBTSxDQUFDO1lBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssT0FBUSxDQUFDO1lBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssUUFBUyxDQUFDO1lBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztRQUNoRCxLQUFLLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUNoQyxFQUFFLENBQUMsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0RSxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsWUFBWSxFQUFFLENBQUM7UUFDZixpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksVUFBVSxHQUFHLHVCQUFlLENBQUMsZ0JBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFMUQsRUFBRSxDQUFDLE1BQU0sQ0FBQyx5QkFBdUIsVUFBVSxNQUFHLENBQUM7U0FDNUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUU3QixJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUNoRSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQzVCLElBQUksVUFBVSxHQUFHLG1CQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUNELEtBQUssQ0FBQyxVQUFVLEdBQUksVUFBVSxDQUFDO1FBQy9CLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLFlBQVksRUFBRSxDQUFDO1FBQ2YsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1YsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLGFBQWEsR0FBRyx1QkFBZSxDQUFDLG1CQUFXLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRW5FLEVBQUUsQ0FBQyxNQUFNLENBQUMsNEJBQTBCLGFBQWEsTUFBRyxDQUFDO1NBQ2xELE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFN0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBQ0QsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNqRCxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQzNELEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNsQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztRQUNwQixPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFckQsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ3JELEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNoQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztRQUNwQixRQUFRLEVBQUUsQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRWpELElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ3RELEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNqQyxZQUFZLEVBQUUsQ0FBQztRQUNmLEVBQUUsQ0FBQyxNQUFNLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixLQUFLLEVBQUUsQ0FBQztJQUNWLENBQUMsQ0FBQyxDQUFDO0lBQ0gsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pELEVBQUUsQ0FBQyxNQUFNLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRXpFLDBCQUEwQixDQUFTO1FBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7UUFDMUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxNQUFNLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLFlBQVksRUFBRSxDQUFDO1FBRWYsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEUsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1YsQ0FBQyxDQUFDLENBQUM7SUFFSCxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFdEUsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ2xELEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM3QixFQUFFLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1RCxFQUFFLENBQUMsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0RSxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVixDQUFDLENBQUMsQ0FBQztJQUNILFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3QyxFQUFFLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRSxFQUFFLENBQUMsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUd0RSxJQUFJLGtCQUFrQixHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUM5RCxLQUFLLENBQUMsVUFBVSxHQUFHLG1CQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixLQUFLLEVBQUUsQ0FBQztJQUNWLENBQUMsQ0FBQyxDQUFDO0lBQ0gsa0JBQWtCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFDL0IsdUJBQWUsQ0FBQyxtQkFBVyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBRXBELElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUN6RCxLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDaEMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xCLGlCQUFpQixFQUFFLENBQUM7UUFDcEIsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsWUFBWSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRW5ELElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUMzRDtRQUNGLEtBQUssQ0FBQyxjQUFjLEdBQUcsdUJBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkQsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1YsQ0FBQyxDQUFDLENBQUM7SUFDSCxlQUFlLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFDNUIsdUJBQWUsQ0FBQyx1QkFBZSxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBRTVELElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUN2RCxLQUFLLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3ZDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixLQUFLLEVBQUUsQ0FBQztJQUNWLENBQUMsQ0FBQyxDQUFDO0lBQ0gsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFFeEQsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQy9DLEtBQUssQ0FBQyxPQUFPLEdBQUcsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsWUFBWSxFQUFFLENBQUM7UUFDZixxQkFBcUIsRUFBRSxDQUFDO1FBQ3hCLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixLQUFLLEVBQUUsQ0FBQztJQUNWLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsdUJBQWUsQ0FBQyxnQkFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBR3BFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxRCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtTQUN0QixLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ1IsTUFBTSxDQUFDLFFBQVEsQ0FBQztTQUNoQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDdEIsVUFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5QixFQUFFLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztTQUN0QyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztTQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLGlCQUFpQixDQUFDO1NBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUlmLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7UUFDaEMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7YUFDOUMscUJBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUNyQixXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pCLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUdILEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ25CLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRCxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0MsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLENBQUM7QUFDSCxDQUFDO0FBRUQsd0JBQXdCLE9BQW9CO0lBQzFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFBLElBQUk7UUFDaEMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxlQUFhLElBQUksQ0FBQyxFQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCx5QkFBeUIsT0FBb0IsRUFBRSxTQUE0QjtJQUN6RSxHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUM3RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0MsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDaEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBSSxDQUFDO3FCQUNyRCxLQUFLLENBQUM7b0JBQ0wsbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQztvQkFDOUIsY0FBYyxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDckQsUUFBUSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2lCQUNsQyxDQUFDO3FCQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQsa0JBQWtCLEVBQVUsRUFBRSxFQUFVLEVBQUUsTUFBYyxFQUFFLE9BQWdCLEVBQ3RFLFNBQTRCLEVBQUUsSUFBYztJQUM5QyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUMzQixJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUUzQixJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztTQUNsQyxJQUFJLENBQUM7UUFDSixPQUFPLEVBQUUsTUFBTTtRQUNmLElBQUksRUFBRSxTQUFPLE1BQVE7UUFDckIsV0FBVyxFQUFFLGVBQWEsQ0FBQyxTQUFJLENBQUMsTUFBRztLQUNwQyxDQUFDLENBQUM7SUFHTCxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUNyQixJQUFJLENBQUM7UUFDSixDQUFDLEVBQUUsQ0FBQztRQUNKLENBQUMsRUFBRSxDQUFDO1FBQ0osS0FBSyxFQUFFLFNBQVM7UUFDaEIsTUFBTSxFQUFFLFNBQVM7S0FDbEIsQ0FBQyxDQUFDO0lBQ0wsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQztJQUM3RCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ1osSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJO1lBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBRWxDLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3ZDLE9BQUssRUFBRSxZQUFZO1lBQ25CLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDTixDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxhQUFhLEVBQUUsS0FBSztTQUN2QyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLElBQUksR0FBRyxpQkFBaUIsQ0FBQztZQUM3QixJQUFJLE9BQU8sU0FBQSxDQUFDO1lBQ1osSUFBSSxTQUFTLFNBQUEsQ0FBQztZQUNkLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUM1QyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDM0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDcEMsQ0FBQztnQkFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztxQkFDbkIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsS0FBSyxHQUFHLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQztxQkFDckQsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUM7cUJBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4RCxDQUFDO1FBQ0gsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUNELFNBQVMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUViLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2FBQ3JCLElBQUksQ0FBQztZQUNKLEVBQUUsRUFBRSxVQUFRLE1BQVE7WUFDcEIsQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUM7WUFDakIsQ0FBQyxFQUFFLFNBQVMsR0FBRyxTQUFTLEdBQUcsQ0FBQztZQUM1QixLQUFLLEVBQUUsU0FBUztZQUNoQixNQUFNLEVBQUUsU0FBUztTQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRTtZQUNsQixlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUU7WUFDbEIsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUM7U0FDMUQsSUFBSSxDQUFDO1FBQ0osSUFBSSxFQUFFLFlBQVUsTUFBUTtRQUN4QixPQUFPLEVBQUUsUUFBUTtLQUNsQixDQUFDO1NBQ0QsS0FBSyxDQUFDO1FBQ0wsUUFBUSxFQUFFLFVBQVU7UUFDcEIsSUFBSSxFQUFLLENBQUMsR0FBRyxDQUFDLE9BQUk7UUFDbEIsR0FBRyxFQUFLLENBQUMsR0FBRyxDQUFDLE9BQUk7S0FDbEIsQ0FBQztTQUNELEVBQUUsQ0FBQyxZQUFZLEVBQUU7UUFDaEIsY0FBYyxHQUFHLE1BQU0sQ0FBQztRQUN4QixHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QixTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuQyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0QsQ0FBQyxDQUFDO1NBQ0QsRUFBRSxDQUFDLFlBQVksRUFBRTtRQUNoQixjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlCLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2QyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzNELEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztJQUNMLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDWixHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtZQUNkLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvQixpQkFBaUIsR0FBRyxJQUFJLENBQUM7WUFDekIsS0FBSyxFQUFFLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ1osR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0QsSUFBSSxXQUFXLEdBQUcsSUFBSSxpQkFBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFDMUQsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQ2pDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO0FBRWhELENBQUM7QUFHRCxxQkFBcUIsT0FBb0I7SUFDdkMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU1QixHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRTlCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3ZELEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFHbkUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQW9CLENBQUM7SUFDOUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksRUFBb0IsQ0FBQztJQUNoRSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDMUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFHekIsSUFBSSxVQUFVLEdBQTZDLEVBQUUsQ0FBQztJQUM5RCxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztTQUM1QixPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztTQUNyQixJQUFJLENBQUMsV0FBVyxFQUFFLGVBQWEsT0FBTyxTQUFJLE9BQU8sTUFBRyxDQUFDLENBQUM7SUFFekQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLFlBQVksR0FBRyxHQUFHLENBQUM7SUFDdkIsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQWtCO1NBQzlDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbEMsV0FBVyxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssR0FBRyxTQUFTLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6RCxJQUFJLGNBQWMsR0FBRyxVQUFDLFNBQWlCLElBQUssT0FBQSxTQUFTLEdBQUcsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLEVBQTVCLENBQTRCLENBQUM7SUFHekUsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUUsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUUsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLElBQUksbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0lBRy9CLElBQUksRUFBRSxHQUFHLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzVCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEIsSUFBSSxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDM0MsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUMsRUFBRSxJQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUMsQ0FBQztRQUM5QixRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0lBR0gsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxTQUFTLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDNUQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN4QyxJQUFJLElBQUUsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUM5QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDaEQsbUJBQW1CLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbEMsSUFBSSxNQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksSUFBRSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLFVBQVUsQ0FBQyxNQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBQyxFQUFFLE1BQUEsRUFBRSxFQUFFLE1BQUEsRUFBQyxDQUFDO1lBQy9CLFFBQVEsQ0FBQyxJQUFFLEVBQUUsSUFBRSxFQUFFLE1BQUksQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFJLENBQUMsQ0FBQztZQUdsRCxJQUFJLFVBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3hDLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLGFBQWEsSUFBSSxJQUFJO2dCQUNyQixDQUFDLEtBQUssVUFBUSxHQUFHLENBQUM7Z0JBQ2xCLFlBQVksSUFBSSxVQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixZQUFZLENBQUMsS0FBSyxDQUFDO29CQUNqQixPQUFPLEVBQUUsSUFBSTtvQkFDYixHQUFHLEVBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFFLE9BQUk7b0JBQ3ZCLElBQUksRUFBSyxJQUFFLE9BQUk7aUJBQ2hCLENBQUMsQ0FBQztnQkFDSCxhQUFhLEdBQUcsTUFBSSxDQUFDLEVBQUUsQ0FBQztZQUMxQixDQUFDO1lBR0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNoRCxJQUFJLElBQUksR0FBRyxNQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLElBQUksR0FBbUIsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUN6RCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQVMsQ0FBQztnQkFFakUsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsbUJBQW1CLElBQUksSUFBSTtvQkFDM0IsQ0FBQyxLQUFLLFVBQVEsR0FBRyxDQUFDO29CQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxpQkFBaUIsQ0FBQyxFQUFFO29CQUN2QyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLGFBQWEsSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDO29CQUNwRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxhQUFhO29CQUM5QixTQUFTLENBQUMsTUFBTSxJQUFJLFVBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQ2xFLGNBQWMsQ0FBQyxLQUFLLENBQUM7d0JBQ25CLE9BQU8sRUFBRSxJQUFJO3dCQUNiLEdBQUcsRUFBSyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBSTt3QkFDMUIsSUFBSSxFQUFLLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFJO3FCQUM1QixDQUFDLENBQUM7b0JBQ0gsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3JDLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFHRCxFQUFFLEdBQUcsS0FBSyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDM0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxJQUFJLEVBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUMzQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUMsRUFBRSxJQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUMsQ0FBQztJQUUvQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDaEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUNyRCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUd6QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNuQixpQkFBaUIsQ0FBQyxZQUFZLENBQUMsRUFDL0IsaUJBQWlCLENBQUMsY0FBYyxDQUFDLEVBQ2pDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FDekMsQ0FBQztJQUNGLEVBQUUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRUQsMkJBQTJCLFNBQTRCO0lBQ3JELElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQXVCLENBQUM7SUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUM1QyxDQUFDO0FBRUQsNkJBQTZCLENBQVMsRUFBRSxRQUFnQjtJQUN0RCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDMUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQztTQUNuQyxLQUFLLENBQUMsTUFBTSxFQUFLLENBQUMsR0FBRyxFQUFFLE9BQUksQ0FBQyxDQUFDO0lBRWhDLElBQUksQ0FBQyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDckIsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGdCQUFjLFFBQVUsQ0FBQyxDQUFDO0lBQ3pFLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1NBQ3BCLElBQUksQ0FBQyxPQUFPLEVBQUUsMkNBQTJDLENBQUM7U0FDMUQsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUNYLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUNELEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN4QixpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsS0FBSyxFQUFFLENBQUM7SUFDVixDQUFDLENBQUM7U0FDSCxNQUFNLENBQUMsR0FBRyxDQUFDO1NBQ1QsSUFBSSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQztTQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFakIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7U0FDcEIsSUFBSSxDQUFDLE9BQU8sRUFBRSwyQ0FBMkMsQ0FBQztTQUMxRCxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ1gsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3hCLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixLQUFLLEVBQUUsQ0FBQztJQUNWLENBQUMsQ0FBQztTQUNILE1BQU0sQ0FBQyxHQUFHLENBQUM7U0FDVCxJQUFJLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDO1NBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVwQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2xELEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUNwQixLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQzNDLENBQUM7QUFDSixDQUFDO0FBRUQseUJBQXlCLElBQWUsRUFBRSxVQUE4QixFQUNwRSxXQUE4QjtJQUNoQyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3hDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUM7SUFDVCxDQUFDO0lBQ0QsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQzVCLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRCxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdCLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUM3QixVQUFzQixDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQy9DLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0wsVUFBc0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUM3QyxDQUFDO2dCQUNELFFBQVEsRUFBRSxDQUFDO1lBQ2IsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUU7WUFDbkIsRUFBRSxDQUFDLENBQUUsRUFBRSxDQUFDLEtBQWEsQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckMsZUFBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDakQsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0YsS0FBSyxDQUFDLElBQUksRUFBdUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM3QyxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDcEMsVUFBc0IsQ0FBQyxNQUFNO1FBQzdCLFVBQXNCLENBQUMsSUFBSSxDQUFDO0lBQy9CLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDO0lBQzNELFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDZCxNQUFNLEVBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBSTtRQUNsQyxLQUFLLEVBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFJO1FBQzVCLFNBQVMsRUFBRSxPQUFPO0tBQ25CLENBQUMsQ0FBQztJQUNILFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1NBQ3ZCLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO1NBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7U0FDdEIsUUFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUVELGtCQUNJLEtBQWMsRUFBRSxVQUFvRCxFQUNwRSxPQUFvQixFQUFFLFNBQTRCLEVBQ2xELE9BQWdCLEVBQUUsS0FBYSxFQUFFLE1BQWM7SUFDakQsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDcEQsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekMsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckMsSUFBSSxLQUFLLEdBQUc7UUFDVixNQUFNLEVBQUU7WUFDTixDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsR0FBRyxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUM7WUFDaEMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFO1NBQ2I7UUFDRCxNQUFNLEVBQUU7WUFDTixDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxTQUFTLEdBQUcsQ0FBQztZQUMxQixDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUU7U0FDeEQ7S0FDRixDQUFDO0lBQ0YsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFWLENBQVUsQ0FBQyxDQUFDO0lBQzdELElBQUksQ0FBQyxJQUFJLENBQUM7UUFDUixjQUFjLEVBQUUsbUJBQW1CO1FBQ25DLE9BQUssRUFBRSxNQUFNO1FBQ2IsRUFBRSxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2xELENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUN0QixDQUFDLENBQUM7SUFJSCxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUNyQixJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDN0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7U0FDM0IsRUFBRSxDQUFDLFlBQVksRUFBRTtRQUNoQixlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUU7UUFDbEIsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFVRCxnQ0FBZ0MsT0FBb0IsRUFBRSxTQUFrQjtJQUN0RSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2QsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNkLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFBLElBQUk7WUFDaEMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxDQUFDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLENBQUM7SUFDSCxDQUFDO0lBQ0QsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV2RSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQUEsSUFBSTtnQkFDaEMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsQ0FBQztZQUVILEdBQUcsQ0FBQyxDQUFDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0gsQ0FBQztRQUNELEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBRTdCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxLQUFLLEdBQUcsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqQyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBQSxJQUFJO2dCQUNoQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUVkLEdBQUcsQ0FBQyxDQUFDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQzFCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRCx5QkFBMEIsT0FBb0I7SUFDNUMsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7SUFFekIsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDN0QsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXJDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzdDLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDNUMsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7QUFDMUIsQ0FBQztBQUVELDBCQUEyQixPQUFvQjtJQUM3QyxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFDdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDM0QsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDaEQsYUFBYSxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ2pELGFBQWEsRUFBRSxDQUFDO2dCQUNqQixDQUFDO1lBQ0EsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBRUQsaUJBQWlCLE9BQW9CLEVBQUUsVUFBdUI7SUFDNUQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDM0MsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLElBQUksS0FBSyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QyxJQUFJLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDeEMsQ0FBQztBQUVELGtCQUFrQixTQUFpQjtJQUFqQiwwQkFBQSxFQUFBLGlCQUFpQjtJQUVqQyxlQUFlLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUU5QyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFeEIsc0JBQXNCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksVUFBVSxHQUFHLGNBQWMsSUFBSSxJQUFJO1FBQ25DLGNBQWMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNsRCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUdqRSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7U0FDeEMsSUFBSSxDQUFDLFVBQVMsSUFBb0M7UUFDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQzdELEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztJQUVILGlCQUFpQixDQUFTO1FBQ3hCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQztRQUNuQixNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxtQkFBbUIsQ0FBUztRQUMxQixNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsdUJBQXVCLENBQVM7UUFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVELDBCQUEwQixDQUFTO1FBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxrQkFBa0IsQ0FBUztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFLRCxJQUFJLElBQUksR0FBRyxHQUFHLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU3QixJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUM7SUFDM0IsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDO0lBQzdCLElBQUksbUJBQW1CLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUMsSUFBSSxDQUFDO0lBRzFELEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQzNELEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3pELEVBQUUsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUN4RSxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxFQUFFLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDbkUsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRDtJQUNFLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUMxQixHQUFHLENBQUMsQ0FBQyxJQUFJLFNBQVMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELHdCQUF3QixDQUFTLEVBQUUsQ0FBUztJQUMxQyxJQUFJLEtBQUssR0FBYSxFQUFFLENBQUM7SUFDekIsR0FBRyxDQUFDLENBQUMsSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQ7SUFDRSxJQUFJLEVBQUUsQ0FBQztJQUNQLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUUsQ0FBQztRQUN6QixJQUFJLEtBQUssR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzFFLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUdILGdCQUFnQixHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1QyxhQUFhLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFLMUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFJdEMsUUFBUSxFQUFFLENBQUM7QUFDYixDQUFDO0FBRUQsMEJBQWlDLE9BQW9CO0lBQ25ELElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDakUsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzdDLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzdDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQWJELDRDQWFDO0FBRUQsZUFBZSxTQUFlO0lBQWYsMEJBQUEsRUFBQSxpQkFBZTtJQUM1QixTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbEIsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNmLGlCQUFpQixFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUVmLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxlQUFlLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDcEQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUdyRCxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ1QsSUFBSSxTQUFTLEdBQUcsY0FBYyxDQUFDLENBQUMsRUFBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDN0MsSUFBSSxLQUFLLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0QsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssZUFBTyxDQUFDLFVBQVUsQ0FBQztRQUM3RCxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUM1QyxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFDakUsS0FBSyxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzRCxnQkFBZ0IsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUMsYUFBYSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBSXRDLFNBQVMsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXhDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakIsQ0FBQztBQUFBLENBQUM7QUFFRjtJQUNFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQztJQUNULENBQUM7SUFFRCxFQUFFLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDN0MsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQzlDLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFNUIsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFhLEtBQUssQ0FBQyxRQUFRLFVBQU8sRUFBRSxVQUFDLEdBQUcsRUFBRSxZQUFZO1FBQzVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDUixNQUFNLEdBQUcsQ0FBQztRQUNaLENBQUM7UUFDRCxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTFDLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqQixFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDM0IsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLGVBQWUsRUFBRSxNQUFNO2FBQ3hCLENBQUM7aUJBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3BCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hDLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDtJQUNFLHlCQUF5QixNQUFNLEVBQUUsYUFBYTtRQUM1QyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDWixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDWixNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFTLENBQUM7WUFDckIsT0FBTyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEUsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFDRCxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFbEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxlQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUM3QyxHQUFHLENBQUMsQ0FBQyxJQUFJLE9BQU8sSUFBSSxnQkFBUSxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLE1BQU0sR0FDTixRQUFRLENBQUMsYUFBYSxDQUFDLHlCQUF1QixPQUFPLE1BQUcsQ0FBQyxDQUFDO1lBQzlELElBQUksYUFBYSxHQUFHLGdCQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEMsZUFBZSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN6QyxDQUFDO0lBQ0gsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssZUFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDekMsR0FBRyxDQUFDLENBQUMsSUFBSSxVQUFVLElBQUksbUJBQVcsQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxNQUFNLEdBQ04sUUFBUSxDQUFDLGFBQWEsQ0FBQyw0QkFBMEIsVUFBVSxNQUFHLENBQUMsQ0FBQztZQUNwRSxJQUFJLGFBQWEsR0FBRyxtQkFBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDekMsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQ7SUFFRSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7UUFDdEIsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFPLElBQU0sQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsMENBQXdDLElBQU0sQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztJQUlILElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUMvQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFVO1lBQVQsWUFBSSxFQUFFLFVBQUU7UUFDakMsSUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7YUFDckMsSUFBSSxDQUFDLE9BQU8sRUFBRSxtREFBbUQsQ0FBQyxDQUFDO1FBQ3RFLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2FBQzlCLElBQUksQ0FBQztZQUNKLElBQUksRUFBRSxVQUFVO1lBQ2hCLE9BQUssRUFBRSxxQkFBcUI7U0FDN0IsQ0FBQyxDQUFDO1FBQ0wsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUNELEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1lBQ2pCLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNsQixpQkFBaUIsRUFBRSxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUM7aUJBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2FBQ2pCLElBQUksQ0FBQyxPQUFPLEVBQUUsMkJBQTJCLENBQUM7YUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztTQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVELHNCQUFzQixTQUFpQjtJQUFqQiwwQkFBQSxFQUFBLGlCQUFpQjtJQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFHZixLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xCLGlCQUFpQixFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLElBQUksVUFBVSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxlQUFPLENBQUMsVUFBVSxDQUFDO1FBQ25ELG1CQUFtQixHQUFHLG9CQUFvQixDQUFDO0lBQy9DLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLEtBQUssZUFBTyxDQUFDLGNBQWM7UUFDcEQsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO0lBRXJDLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTlDLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFZCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNyRSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdEMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEMsT0FBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUVELElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0FBRTlCO0lBQ0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUNELGdCQUFnQixHQUFHLEtBQUssQ0FBQztJQUN6QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUM7SUFDbkIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksR0FBRyxrQkFBZ0IsS0FBSyxDQUFDLFFBQVUsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEIsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsRUFBQyxnQkFBZ0IsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFFRDtJQUNFLEVBQUUsQ0FBQyxNQUFNLEVBQUU7UUFDVCxPQUFPLEVBQUUsT0FBTztRQUNoQixhQUFhLEVBQUUscUJBQXFCO1FBQ3BDLFdBQVcsRUFBRSxpQkFBaUIsR0FBRyxTQUFTLEdBQUcsV0FBVztRQUN4RCxVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxRQUFRO0tBQ3pELENBQUMsQ0FBQztJQUNILGlCQUFpQixHQUFHLEtBQUssQ0FBQztBQUM1QixDQUFDO0FBRUQscUJBQXFCLEVBQUUsQ0FBQztBQUN4QixZQUFZLEVBQUUsQ0FBQztBQUNmLE9BQU8sRUFBRSxDQUFDO0FBQ1YsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25CLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNaLFlBQVksRUFBRSxDQUFDOzs7O0FDcnJDZix5QkFBMkI7QUFDM0IsbUNBQXFDO0FBR3JDLElBQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDO0FBR3ZCLFFBQUEsV0FBVyxHQUEyQztJQUMvRCxNQUFNLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJO0lBQzNCLE1BQU0sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUk7SUFDM0IsU0FBUyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTztJQUNqQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNO0lBQy9CLE1BQU0sRUFBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUk7Q0FDN0IsQ0FBQztBQUdTLFFBQUEsZUFBZSxHQUErQztJQUN2RSxNQUFNLEVBQUUsSUFBSTtJQUNaLElBQUksRUFBRSxFQUFFLENBQUMsc0JBQXNCLENBQUMsRUFBRTtJQUNsQyxJQUFJLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUU7Q0FDbkMsQ0FBQztBQUdTLFFBQUEsUUFBUSxHQUEyQztJQUM1RCxRQUFRLEVBQUUsT0FBTyxDQUFDLGtCQUFrQjtJQUNwQyxLQUFLLEVBQUUsT0FBTyxDQUFDLGVBQWU7SUFDOUIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxvQkFBb0I7SUFDckMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxrQkFBa0I7Q0FDckMsQ0FBQztBQUdTLFFBQUEsV0FBVyxHQUEyQztJQUMvRCxXQUFXLEVBQUUsT0FBTyxDQUFDLFlBQVk7SUFDakMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxlQUFlO0NBQ3JDLENBQUM7QUFFRix5QkFBZ0MsR0FBUSxFQUFFLEtBQVU7SUFDbEQsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2IsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFQRCwwQ0FPQztBQUVELGtCQUFrQixDQUFTLEVBQUUsTUFBYztJQUN6QyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxNQUFNLENBQUM7QUFDN0MsQ0FBQztBQUVELHNCQUFzQixHQUFRO0lBQzVCLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUMxQixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQixDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQU1ELElBQVksSUFPWDtBQVBELFdBQVksSUFBSTtJQUNkLG1DQUFNLENBQUE7SUFDTixtQ0FBTSxDQUFBO0lBQ04sK0NBQVksQ0FBQTtJQUNaLCtDQUFZLENBQUE7SUFDWixxQ0FBTyxDQUFBO0lBQ1AsbUNBQU0sQ0FBQTtBQUNSLENBQUMsRUFQVyxJQUFJLEdBQUosWUFBSSxLQUFKLFlBQUksUUFPZjtBQUVELElBQVksT0FHWDtBQUhELFdBQVksT0FBTztJQUNqQix5REFBYyxDQUFBO0lBQ2QsaURBQVUsQ0FBQTtBQUNaLENBQUMsRUFIVyxPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFHbEI7QUFFVSxRQUFBLFFBQVEsR0FBRztJQUNwQixnQkFBZ0IsRUFBRSxPQUFPLENBQUMsY0FBYztJQUN4QyxZQUFZLEVBQUUsT0FBTyxDQUFDLFVBQVU7Q0FDakMsQ0FBQztBQU1ELENBQUM7QUFHRjtJQUFBO1FBa0NFLGtCQUFhLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLHFCQUFnQixHQUFHLEdBQUcsQ0FBQztRQUN2QixpQkFBWSxHQUFHLEdBQUcsQ0FBQztRQUNuQix1QkFBa0IsR0FBRyxDQUFDLENBQUM7UUFDdkIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFDZixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ25CLGFBQVEsR0FBVyxJQUFJLENBQUM7UUFDeEIsa0JBQWEsR0FBRyxFQUFFLENBQUM7UUFDbkIsZUFBVSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQ3BDLG1CQUFjLEdBQThCLElBQUksQ0FBQztRQUNqRCxZQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUNqQyxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEIsd0JBQW1CLEdBQVUsRUFBRSxDQUFDO1FBQ2hDLGlCQUFZLEdBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixNQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ1QsTUFBQyxHQUFHLElBQUksQ0FBQztRQUNULFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsU0FBSSxHQUFHLEtBQUssQ0FBQztRQUNiLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixZQUFPLEdBQTBCLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztRQUM5RCxlQUFVLEdBQTBCLE9BQU8sQ0FBQyxZQUFZLENBQUM7SUFzSDNELENBQUM7SUFoSFEsc0JBQWdCLEdBQXZCO1FBQ0UsSUFBSSxHQUFHLEdBQTRCLEVBQUUsQ0FBQztRQUN0QyxHQUFHLENBQUMsQ0FBaUIsVUFBd0MsRUFBeEMsS0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUF4QyxjQUF3QyxFQUF4QyxJQUF3QztZQUF4RCxJQUFJLFFBQVEsU0FBQTtZQUNYLElBQUEsd0JBQW1DLEVBQWxDLGNBQUksRUFBRSxhQUFLLENBQXdCO1lBQ3hDLEdBQUcsQ0FBQyxNQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDbkI7UUFDRCxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBRXhCLGdCQUFnQixJQUFZO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNyRSxDQUFDO1FBRUQsb0JBQW9CLEtBQWE7WUFDL0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUdELEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBb0I7Z0JBQW5CLGNBQUksRUFBRSxjQUFJLEVBQUUsa0JBQU07WUFDdEMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDYixLQUFLLElBQUksQ0FBQyxNQUFNO29CQUNkLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNuQixNQUFNLEtBQUssQ0FBQyw2Q0FBNkM7NEJBQ3JELDBCQUEwQixDQUFDLENBQUM7b0JBQ2xDLENBQUM7b0JBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUN4QyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUixLQUFLLElBQUksQ0FBQyxNQUFNO29CQUNkLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRWpCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDM0IsQ0FBQztvQkFDRCxLQUFLLENBQUM7Z0JBQ1IsS0FBSyxJQUFJLENBQUMsTUFBTTtvQkFDZCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMxQixDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUixLQUFLLElBQUksQ0FBQyxPQUFPO29CQUNmLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxPQUFPLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUN2RCxDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUixLQUFLLElBQUksQ0FBQyxZQUFZO29CQUNwQixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDaEIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ2xELENBQUM7b0JBQ0QsS0FBSyxDQUFDO2dCQUNSLEtBQUssSUFBSSxDQUFDLFlBQVk7b0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNoQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUjtvQkFDRSxNQUFNLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1lBQ3BFLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUdILFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1lBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkIsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUtELHlCQUFTLEdBQVQ7UUFBQSxpQkFzQkM7UUFwQkMsSUFBSSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBQ3pCLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBb0I7Z0JBQW5CLGNBQUksRUFBRSxjQUFJLEVBQUUsa0JBQU07WUFDdEMsSUFBSSxLQUFLLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXZCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLENBQUM7WUFDVCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixLQUFLLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsWUFBWTtnQkFDakMsSUFBSSxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQixDQUFDO1lBQ0QsS0FBSyxDQUFDLElBQUksQ0FBSSxJQUFJLFNBQUksS0FBTyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7UUFFSCxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUM3QixLQUFLLENBQUMsSUFBSSxDQUFJLElBQUksU0FBSSxLQUFJLENBQUMsSUFBSSxDQUFHLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUdELDhCQUFjLEdBQWQ7UUFDRSxJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25ELENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsK0JBQWUsR0FBZixVQUFnQixJQUFZLEVBQUUsTUFBZTtRQUMzQyxJQUFJLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQzFDLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0F2TEEsQUF1TEM7QUFyTGdCLFdBQUssR0FBZTtJQUNqQyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLG1CQUFXLEVBQUM7SUFDNUQsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLHVCQUFlLEVBQUM7SUFDcEUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQ3RDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0JBQVEsRUFBQztJQUN0RCxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLG1CQUFXLEVBQUM7SUFDNUQsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQ3pDLEVBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQzdDLEVBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQy9DLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNsQyxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUM7SUFDL0MsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQ2pDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUMxQyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDeEMsRUFBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQzFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUMvQixFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDL0IsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQ3JDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUN0QyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDdEMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQ2xDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUNsQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7SUFDbEMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO0lBQ2xDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUMxQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDckMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxnQkFBUSxFQUFDO0lBQ3RELEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztJQUN0QyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7Q0FDdkMsQ0FBQztBQS9CUyxzQkFBSyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuLyoqXG4gKiBBIHR3byBkaW1lbnNpb25hbCBleGFtcGxlOiB4IGFuZCB5IGNvb3JkaW5hdGVzIHdpdGggdGhlIGxhYmVsLlxuICovXG5leHBvcnQgdHlwZSBFeGFtcGxlMkQgPSB7XG4gIHg6IG51bWJlcixcbiAgeTogbnVtYmVyLFxuICBsYWJlbDogbnVtYmVyXG59O1xuXG50eXBlIFBvaW50ID0ge1xuICB4OiBudW1iZXIsXG4gIHk6IG51bWJlclxufTtcblxuZXhwb3J0IHR5cGUgRGF0YUdlbmVyYXRvciA9IChudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpID0+IEV4YW1wbGUyRFtdO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIENMQVNTSUZJQ0FUSU9OXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBDTEFTU0lGWSBHQVVTU0lBTiBDTFVTVEVSU1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeVR3b0dhdXNzRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOlxuICAgIEV4YW1wbGUyRFtdIHtcbiAgbGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcbiAgbGV0IHZhcmlhbmNlID0gMC41O1xuICBcbiAgLy8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuICBsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG5cbiAgZnVuY3Rpb24gZ2VuR2F1c3MoY3g6IG51bWJlciwgY3k6IG51bWJlciwgbGFiZWw6IG51bWJlcikge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlcyAvIDI7IGkrKykge1xuXHQgIGxldCBub2lzZVggPSBub3JtYWxSYW5kb20oMCwgdmFyaWFuY2UqZE5vaXNlKTtcblx0ICBsZXQgbm9pc2VZID0gbm9ybWFsUmFuZG9tKDAsIHZhcmlhbmNlKmROb2lzZSk7XG4gICAgICBsZXQgc2lnbmFsWCA9IG5vcm1hbFJhbmRvbShjeCwgdmFyaWFuY2UpO1xuICAgICAgbGV0IHNpZ25hbFkgPSBub3JtYWxSYW5kb20oY3ksIHZhcmlhbmNlKTtcbiAgICAgIGxldCB4ID0gc2lnbmFsWCArIG5vaXNlWDtcbiAgICAgIGxldCB5ID0gc2lnbmFsWSArIG5vaXNlWTtcbiAgICAgIHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuICAgIH1cbiAgfVxuXG4gIGdlbkdhdXNzKDIsIDIsIDEpOyAvLyBHYXVzc2lhbiB3aXRoIHBvc2l0aXZlIGV4YW1wbGVzLlxuICBnZW5HYXVzcygtMiwgLTIsIC0xKTsgLy8gR2F1c3NpYW4gd2l0aCBuZWdhdGl2ZSBleGFtcGxlcy5cbiAgcmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBDTEFTU0lGWSBTUElSQUxcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlTcGlyYWxEYXRhKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6XG4gICAgRXhhbXBsZTJEW10ge1xuICBcbiAgLy8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuICBsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG4gIFxuICBsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuICBsZXQgbiA9IG51bVNhbXBsZXMgLyAyO1xuXG4gIGZ1bmN0aW9uIGdlblNwaXJhbChkZWx0YVQ6IG51bWJlciwgbGFiZWw6IG51bWJlcikge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICBsZXQgciA9IGkgLyBuICogNTtcbiAgICAgIGxldCByMiA9IHIqcjtcbiAgICAgIGxldCB0ID0gMS43NSAqIGkgLyBuICogMiAqIE1hdGguUEkgKyBkZWx0YVQ7XG4gICAgICBsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIHIqZE5vaXNlKTtcbiAgICAgIGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgcipkTm9pc2UpO1xuICAgICAgbGV0IHggPSByICogTWF0aC5zaW4odCkgKyBub2lzZVg7XG4gICAgICBsZXQgeSA9IHIgKiBNYXRoLmNvcyh0KSArIG5vaXNlWTtcbiAgICAgIHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuICAgIH1cbiAgfVxuICBnZW5TcGlyYWwoMCwgMSk7IC8vIFBvc2l0aXZlIGV4YW1wbGVzLlxuICBnZW5TcGlyYWwoTWF0aC5QSSwgLTEpOyAvLyBOZWdhdGl2ZSBleGFtcGxlcy5cbiAgcmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBDTEFTU0lGWSBDSVJDTEVcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5Q2lyY2xlRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOlxuICAgIEV4YW1wbGUyRFtdIHtcblx0XHRcbiAgLy8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuICBsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG4gIFxuICBsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuICBsZXQgcmFkaXVzID0gNTtcblxuICAvLyBHZW5lcmF0ZSBwb3NpdGl2ZSBwb2ludHMgaW5zaWRlIHRoZSBjaXJjbGUuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlcyAvIDI7IGkrKykge1xuICAgIGxldCByID0gcmFuZFVuaWZvcm0oMCwgcmFkaXVzICogMC41KTtcbiAgICBcbiAgICAvLyBXZSBhc3N1bWUgcl4yIGFzIHRoZSB2YXJpYW5jZSBvZiB0aGUgU2lnbmFsXG4gICAgbGV0IHIyID0gcipyO1xuICAgIGxldCBhbmdsZSA9IHJhbmRVbmlmb3JtKDAsIDIgKiBNYXRoLlBJKTtcbiAgICBsZXQgeCA9IHIgKiBNYXRoLnNpbihhbmdsZSk7XG4gICAgbGV0IHkgPSByICogTWF0aC5jb3MoYW5nbGUpO1xuICAgIC8vfiBsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIHIyKmROb2lzZSk7XG4gICAgLy9+IGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgcjIqZE5vaXNlKTtcbiAgICBsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIDEvcmFkaXVzKmROb2lzZSk7XG4gICAgbGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCAxL3JhZGl1cypkTm9pc2UpO1xuICAgIHggKz0gbm9pc2VYO1xuICAgIHkgKz0gbm9pc2VZO1xuICAgIGxldCBsYWJlbCA9IDE7XG4gICAgcG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG4gIH1cblxuICAvLyBHZW5lcmF0ZSBuZWdhdGl2ZSBwb2ludHMgb3V0c2lkZSB0aGUgY2lyY2xlLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXMgLyAyOyBpKyspIHtcbiAgICBsZXQgciA9IHJhbmRVbmlmb3JtKHJhZGl1cyAqIDAuNywgcmFkaXVzKTtcbiAgICBcbiAgICAvLyBXZSBhc3N1bWUgcl4yIGFzIHRoZSB2YXJpYW5jZSBvZiB0aGUgU2lnbmFsXG4gICAgbGV0IHJyMiA9IHIqcjtcbiAgICBsZXQgYW5nbGUgPSByYW5kVW5pZm9ybSgwLCAyICogTWF0aC5QSSk7XG4gICAgbGV0IHggPSByICogTWF0aC5zaW4oYW5nbGUpO1xuICAgIGxldCB5ID0gciAqIE1hdGguY29zKGFuZ2xlKTtcbiAgICAvL34gbGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCBycjIqZE5vaXNlKTtcbiAgICAvL34gbGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCBycjIqZE5vaXNlKTtcbiAgICBsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIDEvcmFkaXVzKmROb2lzZSk7XG4gICAgbGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCAxL3JhZGl1cypkTm9pc2UpO1xuICAgIHggKz0gbm9pc2VYO1xuICAgIHkgKz0gbm9pc2VZO1xuICAgIGxldCBsYWJlbCA9IC0xO1xuICAgIHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuICB9XG5cbiAgcmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBDTEFTU0lGWSBYT1JcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5WE9SRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOlxuICAgIEV4YW1wbGUyRFtdIHtcbiAgLy8gQVdHIE5vaXNlIFZhcmlhbmNlID0gU2lnbmFsIC8gMTBeKFNOUmRCLzEwKVxuICBsZXQgZE5vaXNlID0gZFNOUihub2lzZSk7XG4gIFxuICAvLyBTdGFuZGFyZCBkZXZpYXRpb24gb2YgdGhlIHNpZ25hbFxuICBsZXQgc3RkU2lnbmFsID0gNTtcbiAgZnVuY3Rpb24gZ2V0WE9STGFiZWwocDogUG9pbnQpIHsgcmV0dXJuIHAueCAqIHAueSA+PSAwID8gMSA6IC0xOyB9XG5cbiAgbGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzOyBpKyspIHtcbiAgICBsZXQgeCA9IHJhbmRVbmlmb3JtKC1zdGRTaWduYWwsIHN0ZFNpZ25hbCk7XG4gICAgbGV0IHBhZGRpbmcgPSAwLjM7XG4gICAgeCArPSB4ID4gMCA/IHBhZGRpbmcgOiAtcGFkZGluZzsgIC8vIFBhZGRpbmcuXG4gICAgbGV0IHkgPSByYW5kVW5pZm9ybSgtc3RkU2lnbmFsLCBzdGRTaWduYWwpO1xuICAgIHkgKz0geSA+IDAgPyBwYWRkaW5nIDogLXBhZGRpbmc7XG4gICAgXG4gICAgbGV0IHZhcmlhbmNlU2lnbmFsID0gc3RkU2lnbmFsKnN0ZFNpZ25hbDtcbiAgICBsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIHZhcmlhbmNlU2lnbmFsKmROb2lzZSk7XG4gICAgbGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCB2YXJpYW5jZVNpZ25hbCpkTm9pc2UpO1xuICAgIGxldCBsYWJlbCA9IGdldFhPUkxhYmVsKHt4OiB4ICsgbm9pc2VYLCB5OiB5ICsgbm9pc2VZfSk7XG4gICAgcG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XG4gIH1cbiAgcmV0dXJuIHBvaW50cztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBSRUdSRVNTSU9OXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ3Jlc3NQbGFuZShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOlxuICBFeGFtcGxlMkRbXSB7XG4gIGxldCBkTm9pc2UgPSBkU05SKG5vaXNlKTtcbiAgbGV0IHJhZGl1cyA9IDY7XG4gIGxldCByMiA9IHJhZGl1cypyYWRpdXM7XG4gIGxldCBsYWJlbFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAuZG9tYWluKFstMTAsIDEwXSlcbiAgICAucmFuZ2UoWy0xLCAxXSk7XG4gIGxldCBnZXRMYWJlbCA9ICh4LCB5KSA9PiBsYWJlbFNjYWxlKHggKyB5KTtcblxuICBsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXM7IGkrKykge1xuICAgIGxldCB4ID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKTtcbiAgICBsZXQgeSA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XG4gICAgbGV0IG5vaXNlWCA9IG5vcm1hbFJhbmRvbSgwLCByMipkTm9pc2UpO1xuICAgIGxldCBub2lzZVkgPSBub3JtYWxSYW5kb20oMCwgcjIqZE5vaXNlKTtcbiAgICBsZXQgbGFiZWwgPSBnZXRMYWJlbCh4ICsgbm9pc2VYLCB5ICsgbm9pc2VZKTtcbiAgICBwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcbiAgfVxuICByZXR1cm4gcG9pbnRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVncmVzc0dhdXNzaWFuKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6XG4gIEV4YW1wbGUyRFtdIHtcbiAgbGV0IGROb2lzZSA9IGRTTlIobm9pc2UpO1xuICBcbiAgbGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcbiAgbGV0IGxhYmVsU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgIC5kb21haW4oWzAsIDJdKVxuICAgIC5yYW5nZShbMSwgMF0pXG4gICAgLmNsYW1wKHRydWUpO1xuXG4gIGxldCBnYXVzc2lhbnMgPSBbXG4gICAgWy00LCAyLjUsIDFdLFxuICAgIFswLCAyLjUsIC0xXSxcbiAgICBbNCwgMi41LCAxXSxcbiAgICBbLTQsIC0yLjUsIC0xXSxcbiAgICBbMCwgLTIuNSwgMV0sXG4gICAgWzQsIC0yLjUsIC0xXVxuICBdO1xuXG4gIGZ1bmN0aW9uIGdldExhYmVsKHgsIHkpIHtcbiAgICAvLyBDaG9vc2UgdGhlIG9uZSB0aGF0IGlzIG1heGltdW0gaW4gYWJzIHZhbHVlLlxuICAgIGxldCBsYWJlbCA9IDA7XG4gICAgZ2F1c3NpYW5zLmZvckVhY2goKFtjeCwgY3ksIHNpZ25dKSA9PiB7XG4gICAgICBsZXQgbmV3TGFiZWwgPSBzaWduICogbGFiZWxTY2FsZShkaXN0KHt4LCB5fSwge3g6IGN4LCB5OiBjeX0pKTtcbiAgICAgIGlmIChNYXRoLmFicyhuZXdMYWJlbCkgPiBNYXRoLmFicyhsYWJlbCkpIHtcbiAgICAgICAgbGFiZWwgPSBuZXdMYWJlbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbGFiZWw7XG4gIH1cbiAgbGV0IHJhZGl1cyA9IDY7XG4gIGxldCByMiA9IHJhZGl1cypyYWRpdXM7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlczsgaSsrKSB7XG4gICAgbGV0IHggPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpO1xuICAgIGxldCB5ID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKTtcbiAgICBsZXQgbm9pc2VYID0gbm9ybWFsUmFuZG9tKDAsIHIyKmROb2lzZSk7XG4gICAgbGV0IG5vaXNlWSA9IG5vcm1hbFJhbmRvbSgwLCByMipkTm9pc2UpO1xuICAgIGxldCBsYWJlbCA9IGdldExhYmVsKHggKyBub2lzZVgsIHkgKyBub2lzZVkpO1xuICAgIHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xuICB9O1xuICByZXR1cm4gcG9pbnRzO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIEFDQ0VTU09SWSBGVU5DVElPTlNcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gKiBTaHVmZmxlcyB0aGUgYXJyYXkgdXNpbmcgRmlzaGVyLVlhdGVzIGFsZ29yaXRobS4gVXNlcyB0aGUgc2VlZHJhbmRvbVxuICogbGlicmFyeSBhcyB0aGUgcmFuZG9tIGdlbmVyYXRvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNodWZmbGUoYXJyYXk6IGFueVtdKTogdm9pZCB7XG4gIGxldCBjb3VudGVyID0gYXJyYXkubGVuZ3RoO1xuICBsZXQgdGVtcCA9IDA7XG4gIGxldCBpbmRleCA9IDA7XG4gIC8vIFdoaWxlIHRoZXJlIGFyZSBlbGVtZW50cyBpbiB0aGUgYXJyYXlcbiAgd2hpbGUgKGNvdW50ZXIgPiAwKSB7XG4gICAgLy8gUGljayBhIHJhbmRvbSBpbmRleFxuICAgIGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY291bnRlcik7XG4gICAgLy8gRGVjcmVhc2UgY291bnRlciBieSAxXG4gICAgY291bnRlci0tO1xuICAgIC8vIEFuZCBzd2FwIHRoZSBsYXN0IGVsZW1lbnQgd2l0aCBpdFxuICAgIHRlbXAgPSBhcnJheVtjb3VudGVyXTtcbiAgICBhcnJheVtjb3VudGVyXSA9IGFycmF5W2luZGV4XTtcbiAgICBhcnJheVtpbmRleF0gPSB0ZW1wO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxvZzIoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIE1hdGgubG9nKHgpL01hdGgubG9nKDIpO1xufVxuXG5mdW5jdGlvbiBsb2cxMCh4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5sb2coeCkvTWF0aC5sb2coMTApO1xufVxuXG5mdW5jdGlvbiBzaWduYWxPZih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gbG9nMigxK01hdGguYWJzKHgpKTtcbn1cblxuZnVuY3Rpb24gZFNOUih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gMS9NYXRoLnBvdygxMCx4LzEwKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgc2FtcGxlIGZyb20gYSB1bmlmb3JtIFthLCBiXSBkaXN0cmlidXRpb24uXG4gKiBVc2VzIHRoZSBzZWVkcmFuZG9tIGxpYnJhcnkgYXMgdGhlIHJhbmRvbSBnZW5lcmF0b3IuXG4gKi9cbmZ1bmN0aW9uIHJhbmRVbmlmb3JtKGE6IG51bWJlciwgYjogbnVtYmVyKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpICogKGIgLSBhKSArIGE7XG59XG5cbi8qKlxuICogU2FtcGxlcyBmcm9tIGEgbm9ybWFsIGRpc3RyaWJ1dGlvbi4gVXNlcyB0aGUgc2VlZHJhbmRvbSBsaWJyYXJ5IGFzIHRoZVxuICogcmFuZG9tIGdlbmVyYXRvci5cbiAqXG4gKiBAcGFyYW0gbWVhbiBUaGUgbWVhbi4gRGVmYXVsdCBpcyAwLlxuICogQHBhcmFtIHZhcmlhbmNlIFRoZSB2YXJpYW5jZS4gRGVmYXVsdCBpcyAxLlxuICovXG5mdW5jdGlvbiBub3JtYWxSYW5kb20obWVhbiA9IDAsIHZhcmlhbmNlID0gMSk6IG51bWJlciB7XG4gIGxldCB2MTogbnVtYmVyLCB2MjogbnVtYmVyLCBzOiBudW1iZXI7XG4gIGRvIHtcbiAgICB2MSA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcbiAgICB2MiA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcbiAgICBzID0gdjEgKiB2MSArIHYyICogdjI7XG4gIH0gd2hpbGUgKHMgPiAxKTtcblxuICBsZXQgcmVzdWx0ID0gTWF0aC5zcXJ0KC0yICogTWF0aC5sb2cocykgLyBzKSAqIHYxO1xuICByZXR1cm4gbWVhbiArIE1hdGguc3FydCh2YXJpYW5jZSkgKiByZXN1bHQ7XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBldWNsaWRlYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzIGluIHNwYWNlLiAqL1xuZnVuY3Rpb24gZGlzdChhOiBQb2ludCwgYjogUG9pbnQpOiBudW1iZXIge1xuICBsZXQgZHggPSBhLnggLSBiLng7XG4gIGxldCBkeSA9IGEueSAtIGIueTtcbiAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG59XG5cbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuaW1wb3J0IHtFeGFtcGxlMkR9IGZyb20gXCIuL2RhdGFzZXRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBIZWF0TWFwU2V0dGluZ3Mge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG4gIHNob3dBeGVzPzogYm9vbGVhbjtcbiAgbm9Tdmc/OiBib29sZWFuO1xufVxuXG4vKiogTnVtYmVyIG9mIGRpZmZlcmVudCBzaGFkZXMgKGNvbG9ycykgd2hlbiBkcmF3aW5nIGEgZ3JhZGllbnQgaGVhdG1hcCAqL1xuY29uc3QgTlVNX1NIQURFUyA9IDY0O1xuXG4vKipcbiAqIERyYXdzIGEgaGVhdG1hcCB1c2luZyBjYW52YXMuIFVzZWQgZm9yIHNob3dpbmcgdGhlIGxlYXJuZWQgZGVjaXNpb25cbiAqIGJvdW5kYXJ5IG9mIHRoZSBjbGFzc2lmaWNhdGlvbiBhbGdvcml0aG0uIENhbiBhbHNvIGRyYXcgZGF0YSBwb2ludHNcbiAqIHVzaW5nIGFuIHN2ZyBvdmVybGF5ZWQgb24gdG9wIG9mIHRoZSBjYW52YXMgaGVhdG1hcC5cbiAqL1xuZXhwb3J0IGNsYXNzIEhlYXRNYXAge1xuICBwcml2YXRlIHNldHRpbmdzOiBIZWF0TWFwU2V0dGluZ3MgPSB7XG4gICAgc2hvd0F4ZXM6IGZhbHNlLFxuICAgIG5vU3ZnOiBmYWxzZVxuICB9O1xuICBwcml2YXRlIHhTY2FsZTogZDMuc2NhbGUuTGluZWFyPG51bWJlciwgbnVtYmVyPjtcbiAgcHJpdmF0ZSB5U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XG4gIHByaXZhdGUgbnVtU2FtcGxlczogbnVtYmVyO1xuICBwcml2YXRlIGNvbG9yOiBkMy5zY2FsZS5RdWFudGl6ZTxzdHJpbmc+O1xuICBwcml2YXRlIGNhbnZhczogZDMuU2VsZWN0aW9uPGFueT47XG4gIHByaXZhdGUgc3ZnOiBkMy5TZWxlY3Rpb248YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHdpZHRoOiBudW1iZXIsIG51bVNhbXBsZXM6IG51bWJlciwgeERvbWFpbjogW251bWJlciwgbnVtYmVyXSxcbiAgICAgIHlEb21haW46IFtudW1iZXIsIG51bWJlcl0sIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sXG4gICAgICB1c2VyU2V0dGluZ3M/OiBIZWF0TWFwU2V0dGluZ3MpIHtcbiAgICB0aGlzLm51bVNhbXBsZXMgPSBudW1TYW1wbGVzO1xuICAgIGxldCBoZWlnaHQgPSB3aWR0aDtcbiAgICBsZXQgcGFkZGluZyA9IHVzZXJTZXR0aW5ncy5zaG93QXhlcyA/IDIwIDogMDtcblxuICAgIGlmICh1c2VyU2V0dGluZ3MgIT0gbnVsbCkge1xuICAgICAgLy8gb3ZlcndyaXRlIHRoZSBkZWZhdWx0cyB3aXRoIHRoZSB1c2VyLXNwZWNpZmllZCBzZXR0aW5ncy5cbiAgICAgIGZvciAobGV0IHByb3AgaW4gdXNlclNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NbcHJvcF0gPSB1c2VyU2V0dGluZ3NbcHJvcF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy54U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbih4RG9tYWluKVxuICAgICAgLnJhbmdlKFswLCB3aWR0aCAtIDIgKiBwYWRkaW5nXSk7XG5cbiAgICB0aGlzLnlTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHlEb21haW4pXG4gICAgICAucmFuZ2UoW2hlaWdodCAtIDIgKiBwYWRkaW5nLCAwXSk7XG5cbiAgICAvLyBHZXQgYSByYW5nZSBvZiBjb2xvcnMuXG4gICAgbGV0IHRtcFNjYWxlID0gZDMuc2NhbGUubGluZWFyPHN0cmluZywgc3RyaW5nPigpXG4gICAgICAgIC5kb21haW4oWzAsIC41LCAxXSlcbiAgICAgICAgLnJhbmdlKFtcIiM5M2Y1MjJcIiwgXCIjZWFlOGViXCIsIFwiIzc3MDhiZFwiXSlcbiAgICAgICAgLmNsYW1wKHRydWUpO1xuICAgIC8vIER1ZSB0byBudW1lcmljYWwgZXJyb3IsIHdlIG5lZWQgdG8gc3BlY2lmeVxuICAgIC8vIGQzLnJhbmdlKDAsIGVuZCArIHNtYWxsX2Vwc2lsb24sIHN0ZXApXG4gICAgLy8gaW4gb3JkZXIgdG8gZ3VhcmFudGVlIHRoYXQgd2Ugd2lsbCBoYXZlIGVuZC9zdGVwIGVudHJpZXMgd2l0aFxuICAgIC8vIHRoZSBsYXN0IGVsZW1lbnQgYmVpbmcgZXF1YWwgdG8gZW5kLlxuICAgIGxldCBjb2xvcnMgPSBkMy5yYW5nZSgwLCAxICsgMUUtOSwgMSAvIE5VTV9TSEFERVMpLm1hcChhID0+IHtcbiAgICAgIHJldHVybiB0bXBTY2FsZShhKTtcbiAgICB9KTtcbiAgICB0aGlzLmNvbG9yID0gZDMuc2NhbGUucXVhbnRpemU8c3RyaW5nPigpXG4gICAgICAgICAgICAgICAgICAgICAuZG9tYWluKFstMSwgMV0pXG4gICAgICAgICAgICAgICAgICAgICAucmFuZ2UoY29sb3JzKTtcblxuICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lci5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5zdHlsZSh7XG4gICAgICAgIHdpZHRoOiBgJHt3aWR0aH1weGAsXG4gICAgICAgIGhlaWdodDogYCR7aGVpZ2h0fXB4YCxcbiAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIixcbiAgICAgICAgdG9wOiBgLSR7cGFkZGluZ31weGAsXG4gICAgICAgIGxlZnQ6IGAtJHtwYWRkaW5nfXB4YFxuICAgICAgfSk7XG4gICAgdGhpcy5jYW52YXMgPSBjb250YWluZXIuYXBwZW5kKFwiY2FudmFzXCIpXG4gICAgICAuYXR0cihcIndpZHRoXCIsIG51bVNhbXBsZXMpXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBudW1TYW1wbGVzKVxuICAgICAgLnN0eWxlKFwid2lkdGhcIiwgKHdpZHRoIC0gMiAqIHBhZGRpbmcpICsgXCJweFwiKVxuICAgICAgLnN0eWxlKFwiaGVpZ2h0XCIsIChoZWlnaHQgLSAyICogcGFkZGluZykgKyBcInB4XCIpXG4gICAgICAuc3R5bGUoXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIpXG4gICAgICAuc3R5bGUoXCJ0b3BcIiwgYCR7cGFkZGluZ31weGApXG4gICAgICAuc3R5bGUoXCJsZWZ0XCIsIGAke3BhZGRpbmd9cHhgKTtcblxuICAgIGlmICghdGhpcy5zZXR0aW5ncy5ub1N2Zykge1xuICAgICAgdGhpcy5zdmcgPSBjb250YWluZXIuYXBwZW5kKFwic3ZnXCIpLmF0dHIoe1xuICAgICAgICAgIFwid2lkdGhcIjogd2lkdGgsXG4gICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0XG4gICAgICB9KS5zdHlsZSh7XG4gICAgICAgIC8vIE92ZXJsYXkgdGhlIHN2ZyBvbiB0b3Agb2YgdGhlIGNhbnZhcy5cbiAgICAgICAgXCJwb3NpdGlvblwiOiBcImFic29sdXRlXCIsXG4gICAgICAgIFwibGVmdFwiOiBcIjBcIixcbiAgICAgICAgXCJ0b3BcIjogXCIwXCJcbiAgICAgIH0pLmFwcGVuZChcImdcIilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3BhZGRpbmd9LCR7cGFkZGluZ30pYCk7XG5cbiAgICAgIHRoaXMuc3ZnLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIFwidHJhaW5cIik7XG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBcInRlc3RcIik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd0F4ZXMpIHtcbiAgICAgIGxldCB4QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAgICAgLnNjYWxlKHRoaXMueFNjYWxlKVxuICAgICAgICAub3JpZW50KFwiYm90dG9tXCIpO1xuXG4gICAgICBsZXQgeUF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgICAgIC5zY2FsZSh0aGlzLnlTY2FsZSlcbiAgICAgICAgLm9yaWVudChcInJpZ2h0XCIpO1xuXG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ4IGF4aXNcIilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCR7aGVpZ2h0IC0gMiAqIHBhZGRpbmd9KWApXG4gICAgICAgIC5jYWxsKHhBeGlzKTtcblxuICAgICAgdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwieSBheGlzXCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKHdpZHRoIC0gMiAqIHBhZGRpbmcpICsgXCIsMClcIilcbiAgICAgICAgLmNhbGwoeUF4aXMpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVRlc3RQb2ludHMocG9pbnRzOiBFeGFtcGxlMkRbXSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLm5vU3ZnKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIkNhbid0IGFkZCBwb2ludHMgc2luY2Ugbm9Tdmc9dHJ1ZVwiKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVDaXJjbGVzKHRoaXMuc3ZnLnNlbGVjdChcImcudGVzdFwiKSwgcG9pbnRzKTtcbiAgfVxuXG4gIHVwZGF0ZVBvaW50cyhwb2ludHM6IEV4YW1wbGUyRFtdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3Mubm9TdmcpIHtcbiAgICAgIHRocm93IEVycm9yKFwiQ2FuJ3QgYWRkIHBvaW50cyBzaW5jZSBub1N2Zz10cnVlXCIpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZUNpcmNsZXModGhpcy5zdmcuc2VsZWN0KFwiZy50cmFpblwiKSwgcG9pbnRzKTtcbiAgfVxuXG4gIHVwZGF0ZUJhY2tncm91bmQoZGF0YTogbnVtYmVyW11bXSwgZGlzY3JldGl6ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGxldCBkeCA9IGRhdGFbMF0ubGVuZ3RoO1xuICAgIGxldCBkeSA9IGRhdGEubGVuZ3RoO1xuXG4gICAgaWYgKGR4ICE9PSB0aGlzLm51bVNhbXBsZXMgfHwgZHkgIT09IHRoaXMubnVtU2FtcGxlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwiVGhlIHByb3ZpZGVkIGRhdGEgbWF0cml4IG11c3QgYmUgb2Ygc2l6ZSBcIiArXG4gICAgICAgICAgXCJudW1TYW1wbGVzIFggbnVtU2FtcGxlc1wiKTtcbiAgICB9XG5cbiAgICAvLyBDb21wdXRlIHRoZSBwaXhlbCBjb2xvcnM7IHNjYWxlZCBieSBDU1MuXG4gICAgbGV0IGNvbnRleHQgPSAodGhpcy5jYW52YXMubm9kZSgpIGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgbGV0IGltYWdlID0gY29udGV4dC5jcmVhdGVJbWFnZURhdGEoZHgsIGR5KTtcblxuICAgIGZvciAobGV0IHkgPSAwLCBwID0gLTE7IHkgPCBkeTsgKyt5KSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGR4OyArK3gpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gZGF0YVt4XVt5XTtcbiAgICAgICAgaWYgKGRpc2NyZXRpemUpIHtcbiAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSA+PSAwID8gMSA6IC0xKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYyA9IGQzLnJnYih0aGlzLmNvbG9yKHZhbHVlKSk7XG4gICAgICAgIGltYWdlLmRhdGFbKytwXSA9IGMucjtcbiAgICAgICAgaW1hZ2UuZGF0YVsrK3BdID0gYy5nO1xuICAgICAgICBpbWFnZS5kYXRhWysrcF0gPSBjLmI7XG4gICAgICAgIGltYWdlLmRhdGFbKytwXSA9IDE2MDtcbiAgICAgIH1cbiAgICB9XG4gICAgY29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2UsIDAsIDApO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDaXJjbGVzKGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sIHBvaW50czogRXhhbXBsZTJEW10pIHtcbiAgICAvLyBLZWVwIG9ubHkgcG9pbnRzIHRoYXQgYXJlIGluc2lkZSB0aGUgYm91bmRzLlxuICAgIGxldCB4RG9tYWluID0gdGhpcy54U2NhbGUuZG9tYWluKCk7XG4gICAgbGV0IHlEb21haW4gPSB0aGlzLnlTY2FsZS5kb21haW4oKTtcbiAgICBwb2ludHMgPSBwb2ludHMuZmlsdGVyKHAgPT4ge1xuICAgICAgcmV0dXJuIHAueCA+PSB4RG9tYWluWzBdICYmIHAueCA8PSB4RG9tYWluWzFdXG4gICAgICAgICYmIHAueSA+PSB5RG9tYWluWzBdICYmIHAueSA8PSB5RG9tYWluWzFdO1xuICAgIH0pO1xuXG4gICAgLy8gQXR0YWNoIGRhdGEgdG8gaW5pdGlhbGx5IGVtcHR5IHNlbGVjdGlvbi5cbiAgICBsZXQgc2VsZWN0aW9uID0gY29udGFpbmVyLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKHBvaW50cyk7XG5cbiAgICAvLyBJbnNlcnQgZWxlbWVudHMgdG8gbWF0Y2ggbGVuZ3RoIG9mIHBvaW50cyBhcnJheS5cbiAgICBzZWxlY3Rpb24uZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIikuYXR0cihcInJcIiwgMyk7XG5cbiAgICAvLyBVcGRhdGUgcG9pbnRzIHRvIGJlIGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uLlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIoe1xuICAgICAgICBjeDogKGQ6IEV4YW1wbGUyRCkgPT4gdGhpcy54U2NhbGUoZC54KSxcbiAgICAgICAgY3k6IChkOiBFeGFtcGxlMkQpID0+IHRoaXMueVNjYWxlKGQueSksXG4gICAgICB9KVxuICAgICAgLnN0eWxlKFwiZmlsbFwiLCBkID0+IHRoaXMuY29sb3IoZC5sYWJlbCkpO1xuXG4gICAgLy8gUmVtb3ZlIHBvaW50cyBpZiB0aGUgbGVuZ3RoIGhhcyBnb25lIGRvd24uXG4gICAgc2VsZWN0aW9uLmV4aXQoKS5yZW1vdmUoKTtcbiAgfVxufSAgLy8gQ2xvc2UgY2xhc3MgSGVhdE1hcC5cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZU1hdHJpeChtYXRyaXg6IG51bWJlcltdW10sIGZhY3RvcjogbnVtYmVyKTogbnVtYmVyW11bXSB7XG4gIGlmIChtYXRyaXgubGVuZ3RoICE9PSBtYXRyaXhbMF0ubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHByb3ZpZGVkIG1hdHJpeCBtdXN0IGJlIGEgc3F1YXJlIG1hdHJpeFwiKTtcbiAgfVxuICBpZiAobWF0cml4Lmxlbmd0aCAlIGZhY3RvciAhPT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSB3aWR0aC9oZWlnaHQgb2YgdGhlIG1hdHJpeCBtdXN0IGJlIGRpdmlzaWJsZSBieSBcIiArXG4gICAgICAgIFwidGhlIHJlZHVjdGlvbiBmYWN0b3JcIik7XG4gIH1cbiAgbGV0IHJlc3VsdDogbnVtYmVyW11bXSA9IG5ldyBBcnJheShtYXRyaXgubGVuZ3RoIC8gZmFjdG9yKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgubGVuZ3RoOyBpICs9IGZhY3Rvcikge1xuICAgIHJlc3VsdFtpIC8gZmFjdG9yXSA9IG5ldyBBcnJheShtYXRyaXgubGVuZ3RoIC8gZmFjdG9yKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5sZW5ndGg7IGogKz0gZmFjdG9yKSB7XG4gICAgICBsZXQgYXZnID0gMDtcbiAgICAgIC8vIFN1bSBhbGwgdGhlIHZhbHVlcyBpbiB0aGUgbmVpZ2hib3Job29kLlxuICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBmYWN0b3I7IGsrKykge1xuICAgICAgICBmb3IgKGxldCBsID0gMDsgbCA8IGZhY3RvcjsgbCsrKSB7XG4gICAgICAgICAgYXZnICs9IG1hdHJpeFtpICsga11baiArIGxdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhdmcgLz0gKGZhY3RvciAqIGZhY3Rvcik7XG4gICAgICByZXN1bHRbaSAvIGZhY3Rvcl1baiAvIGZhY3Rvcl0gPSBhdmc7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG50eXBlIERhdGFQb2ludCA9IHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXJbXTtcbn07XG5cbi8qKlxuICogQSBtdWx0aS1zZXJpZXMgbGluZSBjaGFydCB0aGF0IGFsbG93cyB5b3UgdG8gYXBwZW5kIG5ldyBkYXRhIHBvaW50c1xuICogYXMgZGF0YSBiZWNvbWVzIGF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEFwcGVuZGluZ0xpbmVDaGFydCB7XG4gIHByaXZhdGUgbnVtTGluZXM6IG51bWJlcjtcbiAgcHJpdmF0ZSBkYXRhOiBEYXRhUG9pbnRbXSA9IFtdO1xuICBwcml2YXRlIHN2ZzogZDMuU2VsZWN0aW9uPGFueT47XG4gIHByaXZhdGUgeFNjYWxlOiBkMy5zY2FsZS5MaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xuICBwcml2YXRlIHlTY2FsZTogZDMuc2NhbGUuTGluZWFyPG51bWJlciwgbnVtYmVyPjtcbiAgcHJpdmF0ZSBwYXRoczogQXJyYXk8ZDMuU2VsZWN0aW9uPGFueT4+O1xuICBwcml2YXRlIGxpbmVDb2xvcnM6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgbWluWSA9IE51bWJlci5NQVhfVkFMVUU7XG4gIHByaXZhdGUgbWF4WSA9IE51bWJlci5NSU5fVkFMVUU7XG5cbiAgY29uc3RydWN0b3IoY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55PiwgbGluZUNvbG9yczogc3RyaW5nW10pIHtcbiAgICB0aGlzLmxpbmVDb2xvcnMgPSBsaW5lQ29sb3JzO1xuICAgIHRoaXMubnVtTGluZXMgPSBsaW5lQ29sb3JzLmxlbmd0aDtcbiAgICBsZXQgbm9kZSA9IGNvbnRhaW5lci5ub2RlKCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgbGV0IHRvdGFsV2lkdGggPSBub2RlLm9mZnNldFdpZHRoO1xuICAgIGxldCB0b3RhbEhlaWdodCA9IG5vZGUub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBtYXJnaW4gPSB7dG9wOiAyLCByaWdodDogMCwgYm90dG9tOiAyLCBsZWZ0OiAyfTtcbiAgICBsZXQgd2lkdGggPSB0b3RhbFdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG4gICAgbGV0IGhlaWdodCA9IHRvdGFsSGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cbiAgICB0aGlzLnhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCAwXSlcbiAgICAgIC5yYW5nZShbMCwgd2lkdGhdKTtcblxuICAgIHRoaXMueVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDBdKVxuICAgICAgLnJhbmdlKFtoZWlnaHQsIDBdKTtcblxuICAgIHRoaXMuc3ZnID0gY29udGFpbmVyLmFwcGVuZChcInN2Z1wiKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG4gICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7bWFyZ2luLmxlZnR9LCR7bWFyZ2luLnRvcH0pYCk7XG5cbiAgICB0aGlzLnBhdGhzID0gbmV3IEFycmF5KHRoaXMubnVtTGluZXMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1MaW5lczsgaSsrKSB7XG4gICAgICB0aGlzLnBhdGhzW2ldID0gdGhpcy5zdmcuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGluZVwiKVxuICAgICAgICAuc3R5bGUoe1xuICAgICAgICAgIFwiZmlsbFwiOiBcIm5vbmVcIixcbiAgICAgICAgICBcInN0cm9rZVwiOiBsaW5lQ29sb3JzW2ldLFxuICAgICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IFwiMS41cHhcIlxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLnJlZHJhdygpO1xuICAgIHRoaXMubWluWSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgdGhpcy5tYXhZID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgfVxuXG4gIGFkZERhdGFQb2ludChkYXRhUG9pbnQ6IG51bWJlcltdKSB7XG4gICAgaWYgKGRhdGFQb2ludC5sZW5ndGggIT09IHRoaXMubnVtTGluZXMpIHtcbiAgICAgIHRocm93IEVycm9yKFwiTGVuZ3RoIG9mIGRhdGFQb2ludCBtdXN0IGVxdWFsIG51bWJlciBvZiBsaW5lc1wiKTtcbiAgICB9XG4gICAgZGF0YVBvaW50LmZvckVhY2goeSA9PiB7XG4gICAgICB0aGlzLm1pblkgPSBNYXRoLm1pbih0aGlzLm1pblksIHkpO1xuICAgICAgdGhpcy5tYXhZID0gTWF0aC5tYXgodGhpcy5tYXhZLCB5KTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGF0YS5wdXNoKHt4OiB0aGlzLmRhdGEubGVuZ3RoICsgMSwgeTogZGF0YVBvaW50fSk7XG4gICAgdGhpcy5yZWRyYXcoKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVkcmF3KCkge1xuICAgIC8vIEFkanVzdCB0aGUgeCBhbmQgeSBkb21haW4uXG4gICAgdGhpcy54U2NhbGUuZG9tYWluKFsxLCB0aGlzLmRhdGEubGVuZ3RoXSk7XG4gICAgdGhpcy55U2NhbGUuZG9tYWluKFt0aGlzLm1pblksIHRoaXMubWF4WV0pO1xuICAgIC8vIEFkanVzdCBhbGwgdGhlIDxwYXRoPiBlbGVtZW50cyAobGluZXMpLlxuICAgIGxldCBnZXRQYXRoTWFwID0gKGxpbmVJbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICByZXR1cm4gZDMuc3ZnLmxpbmU8RGF0YVBvaW50PigpXG4gICAgICAueChkID0+IHRoaXMueFNjYWxlKGQueCkpXG4gICAgICAueShkID0+IHRoaXMueVNjYWxlKGQueVtsaW5lSW5kZXhdKSk7XG4gICAgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtTGluZXM7IGkrKykge1xuICAgICAgdGhpcy5wYXRoc1tpXS5kYXR1bSh0aGlzLmRhdGEpLmF0dHIoXCJkXCIsIGdldFBhdGhNYXAoaSkpO1xuICAgIH1cbiAgfVxufVxuIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4vKipcbiAqIEEgbm9kZSBpbiBhIG5ldXJhbCBuZXR3b3JrLiBFYWNoIG5vZGUgaGFzIGEgc3RhdGVcbiAqICh0b3RhbCBpbnB1dCwgb3V0cHV0LCBhbmQgdGhlaXIgcmVzcGVjdGl2ZWx5IGRlcml2YXRpdmVzKSB3aGljaCBjaGFuZ2VzXG4gKiBhZnRlciBldmVyeSBmb3J3YXJkIGFuZCBiYWNrIHByb3BhZ2F0aW9uIHJ1bi5cbiAqL1xuZXhwb3J0IGNsYXNzIE5vZGUge1xuICBpZDogc3RyaW5nO1xuICAvKiogTGlzdCBvZiBpbnB1dCBsaW5rcy4gKi9cbiAgaW5wdXRMaW5rczogTGlua1tdID0gW107XG4gIGJpYXMgPSAwLjE7XG4gIC8qKiBMaXN0IG9mIG91dHB1dCBsaW5rcy4gKi9cbiAgb3V0cHV0czogTGlua1tdID0gW107XG4gIHRvdGFsSW5wdXQ6IG51bWJlcjtcbiAgb3V0cHV0OiBudW1iZXI7XG4gIFxuICB0cnVlTGVhcm5pbmdSYXRlID0gMDtcbiAgLyoqIEVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIHRoaXMgbm9kZSdzIG91dHB1dC4gKi9cbiAgb3V0cHV0RGVyID0gMDtcbiAgLyoqIEVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIHRoaXMgbm9kZSdzIHRvdGFsIGlucHV0LiAqL1xuICBpbnB1dERlciA9IDA7XG4gIC8qKlxuICAgKiBBY2N1bXVsYXRlZCBlcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byB0aGlzIG5vZGUncyB0b3RhbCBpbnB1dCBzaW5jZVxuICAgKiB0aGUgbGFzdCB1cGRhdGUuIFRoaXMgZGVyaXZhdGl2ZSBlcXVhbHMgZEUvZGIgd2hlcmUgYiBpcyB0aGUgbm9kZSdzXG4gICAqIGJpYXMgdGVybS5cbiAgICovXG4gIGFjY0lucHV0RGVyID0gMDtcbiAgLyoqXG4gICAqIE51bWJlciBvZiBhY2N1bXVsYXRlZCBlcnIuIGRlcml2YXRpdmVzIHdpdGggcmVzcGVjdCB0byB0aGUgdG90YWwgaW5wdXRcbiAgICogc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKi9cbiAgbnVtQWNjdW11bGF0ZWREZXJzID0gMDtcbiAgLyoqIEFjdGl2YXRpb24gZnVuY3Rpb24gdGhhdCB0YWtlcyB0b3RhbCBpbnB1dCBhbmQgcmV0dXJucyBub2RlJ3Mgb3V0cHV0ICovXG4gIGFjdGl2YXRpb246IEFjdGl2YXRpb25GdW5jdGlvbjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBub2RlIHdpdGggdGhlIHByb3ZpZGVkIGlkIGFuZCBhY3RpdmF0aW9uIGZ1bmN0aW9uLlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgYWN0aXZhdGlvbjogQWN0aXZhdGlvbkZ1bmN0aW9uLCBpbml0WmVybz86IGJvb2xlYW4pIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5hY3RpdmF0aW9uID0gYWN0aXZhdGlvbjtcbiAgICBpZiAoaW5pdFplcm8pIHtcbiAgICAgIHRoaXMuYmlhcyA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlY29tcHV0ZXMgdGhlIG5vZGUncyBvdXRwdXQgYW5kIHJldHVybnMgaXQuICovXG4gIHVwZGF0ZU91dHB1dCgpOiBudW1iZXIge1xuICAgIC8vIFN0b3JlcyB0b3RhbCBpbnB1dCBpbnRvIHRoZSBub2RlLlxuICAgIHRoaXMudG90YWxJbnB1dCA9IHRoaXMuYmlhcztcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuICAgICAgbGV0IGxpbmsgPSB0aGlzLmlucHV0TGlua3Nbal07XG4gICAgICB0aGlzLnRvdGFsSW5wdXQgKz0gbGluay53ZWlnaHQgKiBsaW5rLnNvdXJjZS5vdXRwdXQ7XG4gICAgfVxuICAgIHRoaXMub3V0cHV0ID0gdGhpcy5hY3RpdmF0aW9uLm91dHB1dCh0aGlzLnRvdGFsSW5wdXQpO1xuICAgIHJldHVybiB0aGlzLm91dHB1dDtcbiAgfVxufVxuXG4vKipcbiAqIEFuIGVycm9yIGZ1bmN0aW9uIGFuZCBpdHMgZGVyaXZhdGl2ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFcnJvckZ1bmN0aW9uIHtcbiAgZXJyb3I6IChvdXRwdXQ6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpID0+IG51bWJlcjtcbiAgZGVyOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PiBudW1iZXI7XG59XG5cbi8qKiBBIG5vZGUncyBhY3RpdmF0aW9uIGZ1bmN0aW9uIGFuZCBpdHMgZGVyaXZhdGl2ZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWN0aXZhdGlvbkZ1bmN0aW9uIHtcbiAgb3V0cHV0OiAoaW5wdXQ6IG51bWJlcikgPT4gbnVtYmVyO1xuICBkZXI6IChpbnB1dDogbnVtYmVyKSA9PiBudW1iZXI7XG59XG5cbi8qKiBGdW5jdGlvbiB0aGF0IGNvbXB1dGVzIGEgcGVuYWx0eSBjb3N0IGZvciBhIGdpdmVuIHdlaWdodCBpbiB0aGUgbmV0d29yay4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVndWxhcml6YXRpb25GdW5jdGlvbiB7XG4gIG91dHB1dDogKHdlaWdodDogbnVtYmVyKSA9PiBudW1iZXI7XG4gIGRlcjogKHdlaWdodDogbnVtYmVyKSA9PiBudW1iZXI7XG59XG5cbi8qKiBCdWlsdC1pbiBlcnJvciBmdW5jdGlvbnMgKi9cbmV4cG9ydCBjbGFzcyBFcnJvcnMge1xuICBwdWJsaWMgc3RhdGljIFNRVUFSRTogRXJyb3JGdW5jdGlvbiA9IHtcbiAgICBlcnJvcjogKG91dHB1dDogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcikgPT5cbiAgICAgICAgICAgICAgIDAuNSAqIE1hdGgucG93KG91dHB1dCAtIHRhcmdldCwgMiksXG4gICAgZGVyOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PiBvdXRwdXQgLSB0YXJnZXRcbiAgfTtcbn1cblxuLyoqIFBvbHlmaWxsIGZvciBUQU5IICovXG4oTWF0aCBhcyBhbnkpLnRhbmggPSAoTWF0aCBhcyBhbnkpLnRhbmggfHwgZnVuY3Rpb24oeCkge1xuICBpZiAoeCA9PT0gSW5maW5pdHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIGlmICh4ID09PSAtSW5maW5pdHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGUyeCA9IE1hdGguZXhwKDIgKiB4KTtcbiAgICByZXR1cm4gKGUyeCAtIDEpIC8gKGUyeCArIDEpO1xuICB9XG59O1xuXG4vKiogQnVpbHQtaW4gYWN0aXZhdGlvbiBmdW5jdGlvbnMgKi9cbmV4cG9ydCBjbGFzcyBBY3RpdmF0aW9ucyB7XG4gIHB1YmxpYyBzdGF0aWMgVEFOSDogQWN0aXZhdGlvbkZ1bmN0aW9uID0ge1xuICAgIG91dHB1dDogeCA9PiAoTWF0aCBhcyBhbnkpLnRhbmgoeCksXG4gICAgZGVyOiB4ID0+IHtcbiAgICAgIGxldCBvdXRwdXQgPSBBY3RpdmF0aW9ucy5UQU5ILm91dHB1dCh4KTtcbiAgICAgIHJldHVybiAxIC0gb3V0cHV0ICogb3V0cHV0O1xuICAgIH1cbiAgfTtcbiAgcHVibGljIHN0YXRpYyBSRUxVOiBBY3RpdmF0aW9uRnVuY3Rpb24gPSB7XG4gICAgb3V0cHV0OiB4ID0+IE1hdGgubWF4KDAsIHgpLFxuICAgIGRlcjogeCA9PiB4IDw9IDAgPyAwIDogMVxuICB9O1xuICBwdWJsaWMgc3RhdGljIFNJR01PSUQ6IEFjdGl2YXRpb25GdW5jdGlvbiA9IHtcbiAgICBvdXRwdXQ6IHggPT4gMSAvICgxICsgTWF0aC5leHAoLXgpKSxcbiAgICBkZXI6IHggPT4ge1xuICAgICAgbGV0IG91dHB1dCA9IEFjdGl2YXRpb25zLlNJR01PSUQub3V0cHV0KHgpO1xuICAgICAgcmV0dXJuIG91dHB1dCAqICgxIC0gb3V0cHV0KTtcbiAgICB9XG4gIH07XG4gIHB1YmxpYyBzdGF0aWMgTElORUFSOiBBY3RpdmF0aW9uRnVuY3Rpb24gPSB7XG4gICAgb3V0cHV0OiB4ID0+IHgsXG4gICAgZGVyOiB4ID0+IDFcbiAgfTtcbiAgcHVibGljIHN0YXRpYyBTSU5YOiBBY3RpdmF0aW9uRnVuY3Rpb24gPSB7XG5cdCAgb3V0cHV0OiB4ID0+IE1hdGguc2luKHgpLFxuXHQgIGRlcjogeCA9PiBNYXRoLmNvcyh4KVxuICB9O1xufVxuXG4vKiogQnVpbGQtaW4gcmVndWxhcml6YXRpb24gZnVuY3Rpb25zICovXG5leHBvcnQgY2xhc3MgUmVndWxhcml6YXRpb25GdW5jdGlvbiB7XG4gIHB1YmxpYyBzdGF0aWMgTDE6IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24gPSB7XG4gICAgb3V0cHV0OiB3ID0+IE1hdGguYWJzKHcpLFxuICAgIGRlcjogdyA9PiB3IDwgMCA/IC0xIDogKHcgPiAwID8gMSA6IDApXG4gIH07XG4gIHB1YmxpYyBzdGF0aWMgTDI6IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24gPSB7XG4gICAgb3V0cHV0OiB3ID0+IDAuNSAqIHcgKiB3LFxuICAgIGRlcjogdyA9PiB3XG4gIH07XG59XG5cbi8qKlxuICogQSBsaW5rIGluIGEgbmV1cmFsIG5ldHdvcmsuIEVhY2ggbGluayBoYXMgYSB3ZWlnaHQgYW5kIGEgc291cmNlIGFuZFxuICogZGVzdGluYXRpb24gbm9kZS4gQWxzbyBpdCBoYXMgYW4gaW50ZXJuYWwgc3RhdGUgKGVycm9yIGRlcml2YXRpdmVcbiAqIHdpdGggcmVzcGVjdCB0byBhIHBhcnRpY3VsYXIgaW5wdXQpIHdoaWNoIGdldHMgdXBkYXRlZCBhZnRlclxuICogYSBydW4gb2YgYmFjayBwcm9wYWdhdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIExpbmsge1xuICBpZDogc3RyaW5nO1xuICBzb3VyY2U6IE5vZGU7XG4gIGRlc3Q6IE5vZGU7XG4gIHdlaWdodCA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gIGlzRGVhZCA9IGZhbHNlO1xuICAvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyB3ZWlnaHQuICovXG4gIGVycm9yRGVyID0gMDtcbiAgLyoqIEFjY3VtdWxhdGVkIGVycm9yIGRlcml2YXRpdmUgc2luY2UgdGhlIGxhc3QgdXBkYXRlLiAqL1xuICBhY2NFcnJvckRlciA9IDA7XG4gIC8qKiBOdW1iZXIgb2YgYWNjdW11bGF0ZWQgZGVyaXZhdGl2ZXMgc2luY2UgdGhlIGxhc3QgdXBkYXRlLiAqL1xuICBudW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuICByZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbjtcbiAgXG4gIHRydWVMZWFybmluZ1JhdGUgPSAwO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbGluayBpbiB0aGUgbmV1cmFsIG5ldHdvcmsgaW5pdGlhbGl6ZWQgd2l0aCByYW5kb20gd2VpZ2h0LlxuICAgKlxuICAgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2Ugbm9kZS5cbiAgICogQHBhcmFtIGRlc3QgVGhlIGRlc3RpbmF0aW9uIG5vZGUuXG4gICAqIEBwYXJhbSByZWd1bGFyaXphdGlvbiBUaGUgcmVndWxhcml6YXRpb24gZnVuY3Rpb24gdGhhdCBjb21wdXRlcyB0aGVcbiAgICogICAgIHBlbmFsdHkgZm9yIHRoaXMgd2VpZ2h0LiBJZiBudWxsLCB0aGVyZSB3aWxsIGJlIG5vIHJlZ3VsYXJpemF0aW9uLlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc291cmNlOiBOb2RlLCBkZXN0OiBOb2RlLFxuICAgICAgcmVndWxhcml6YXRpb246IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24sIGluaXRaZXJvPzogYm9vbGVhbikge1xuICAgIHRoaXMuaWQgPSBzb3VyY2UuaWQgKyBcIi1cIiArIGRlc3QuaWQ7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5kZXN0ID0gZGVzdDtcbiAgICB0aGlzLnJlZ3VsYXJpemF0aW9uID0gcmVndWxhcml6YXRpb247XG4gICAgaWYgKGluaXRaZXJvKSB7XG4gICAgICB0aGlzLndlaWdodCA9IDA7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQnVpbGRzIGEgbmV1cmFsIG5ldHdvcmsuXG4gKlxuICogQHBhcmFtIG5ldHdvcmtTaGFwZSBUaGUgc2hhcGUgb2YgdGhlIG5ldHdvcmsuIEUuZy4gWzEsIDIsIDMsIDFdIG1lYW5zXG4gKiAgIHRoZSBuZXR3b3JrIHdpbGwgaGF2ZSBvbmUgaW5wdXQgbm9kZSwgMiBub2RlcyBpbiBmaXJzdCBoaWRkZW4gbGF5ZXIsXG4gKiAgIDMgbm9kZXMgaW4gc2Vjb25kIGhpZGRlbiBsYXllciBhbmQgMSBvdXRwdXQgbm9kZS5cbiAqIEBwYXJhbSBhY3RpdmF0aW9uIFRoZSBhY3RpdmF0aW9uIGZ1bmN0aW9uIG9mIGV2ZXJ5IGhpZGRlbiBub2RlLlxuICogQHBhcmFtIG91dHB1dEFjdGl2YXRpb24gVGhlIGFjdGl2YXRpb24gZnVuY3Rpb24gZm9yIHRoZSBvdXRwdXQgbm9kZXMuXG4gKiBAcGFyYW0gcmVndWxhcml6YXRpb24gVGhlIHJlZ3VsYXJpemF0aW9uIGZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgYSBwZW5hbHR5XG4gKiAgICAgZm9yIGEgZ2l2ZW4gd2VpZ2h0IChwYXJhbWV0ZXIpIGluIHRoZSBuZXR3b3JrLiBJZiBudWxsLCB0aGVyZSB3aWxsIGJlXG4gKiAgICAgbm8gcmVndWxhcml6YXRpb24uXG4gKiBAcGFyYW0gaW5wdXRJZHMgTGlzdCBvZiBpZHMgZm9yIHRoZSBpbnB1dCBub2Rlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTmV0d29yayhcbiAgICBuZXR3b3JrU2hhcGU6IG51bWJlcltdLCBhY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb24sXG4gICAgb3V0cHV0QWN0aXZhdGlvbjogQWN0aXZhdGlvbkZ1bmN0aW9uLFxuICAgIHJlZ3VsYXJpemF0aW9uOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uLFxuICAgIGlucHV0SWRzOiBzdHJpbmdbXSwgaW5pdFplcm8/OiBib29sZWFuKTogTm9kZVtdW10ge1xuICBsZXQgbnVtTGF5ZXJzID0gbmV0d29ya1NoYXBlLmxlbmd0aDtcbiAgbGV0IGlkID0gMTtcbiAgLyoqIExpc3Qgb2YgbGF5ZXJzLCB3aXRoIGVhY2ggbGF5ZXIgYmVpbmcgYSBsaXN0IG9mIG5vZGVzLiAqL1xuICBsZXQgbmV0d29yazogTm9kZVtdW10gPSBbXTtcbiAgZm9yIChsZXQgbGF5ZXJJZHggPSAwOyBsYXllcklkeCA8IG51bUxheWVyczsgbGF5ZXJJZHgrKykge1xuICAgIGxldCBpc091dHB1dExheWVyID0gbGF5ZXJJZHggPT09IG51bUxheWVycyAtIDE7XG4gICAgbGV0IGlzSW5wdXRMYXllciA9IGxheWVySWR4ID09PSAwO1xuICAgIGxldCBjdXJyZW50TGF5ZXI6IE5vZGVbXSA9IFtdO1xuICAgIG5ldHdvcmsucHVzaChjdXJyZW50TGF5ZXIpO1xuICAgIGxldCBudW1Ob2RlcyA9IG5ldHdvcmtTaGFwZVtsYXllcklkeF07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Ob2RlczsgaSsrKSB7XG4gICAgICBsZXQgbm9kZUlkID0gaWQudG9TdHJpbmcoKTtcbiAgICAgIGlmIChpc0lucHV0TGF5ZXIpIHtcbiAgICAgICAgbm9kZUlkID0gaW5wdXRJZHNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZCsrO1xuICAgICAgfVxuICAgICAgbGV0IG5vZGUgPSBuZXcgTm9kZShub2RlSWQsXG4gICAgICAgICAgaXNPdXRwdXRMYXllciA/IG91dHB1dEFjdGl2YXRpb24gOiBhY3RpdmF0aW9uLCBpbml0WmVybyk7XG4gICAgICBjdXJyZW50TGF5ZXIucHVzaChub2RlKTtcbiAgICAgIGlmIChsYXllcklkeCA+PSAxKSB7XG4gICAgICAgIC8vIEFkZCBsaW5rcyBmcm9tIG5vZGVzIGluIHRoZSBwcmV2aW91cyBsYXllciB0byB0aGlzIG5vZGUuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbmV0d29ya1tsYXllcklkeCAtIDFdLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IHByZXZOb2RlID0gbmV0d29ya1tsYXllcklkeCAtIDFdW2pdO1xuICAgICAgICAgIGxldCBsaW5rID0gbmV3IExpbmsocHJldk5vZGUsIG5vZGUsIHJlZ3VsYXJpemF0aW9uLCBpbml0WmVybyk7XG4gICAgICAgICAgcHJldk5vZGUub3V0cHV0cy5wdXNoKGxpbmspO1xuICAgICAgICAgIG5vZGUuaW5wdXRMaW5rcy5wdXNoKGxpbmspO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXR3b3JrO1xufVxuXG4vKipcbiAqIFJ1bnMgYSBmb3J3YXJkIHByb3BhZ2F0aW9uIG9mIHRoZSBwcm92aWRlZCBpbnB1dCB0aHJvdWdoIHRoZSBwcm92aWRlZFxuICogbmV0d29yay4gVGhpcyBtZXRob2QgbW9kaWZpZXMgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBuZXR3b3JrIC0gdGhlXG4gKiB0b3RhbCBpbnB1dCBhbmQgb3V0cHV0IG9mIGVhY2ggbm9kZSBpbiB0aGUgbmV0d29yay5cbiAqXG4gKiBAcGFyYW0gbmV0d29yayBUaGUgbmV1cmFsIG5ldHdvcmsuXG4gKiBAcGFyYW0gaW5wdXRzIFRoZSBpbnB1dCBhcnJheS4gSXRzIGxlbmd0aCBzaG91bGQgbWF0Y2ggdGhlIG51bWJlciBvZiBpbnB1dFxuICogICAgIG5vZGVzIGluIHRoZSBuZXR3b3JrLlxuICogQHJldHVybiBUaGUgZmluYWwgb3V0cHV0IG9mIHRoZSBuZXR3b3JrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZFByb3AobmV0d29yazogTm9kZVtdW10sIGlucHV0czogbnVtYmVyW10pOiBudW1iZXIge1xuICBsZXQgaW5wdXRMYXllciA9IG5ldHdvcmtbMF07XG4gIGlmIChpbnB1dHMubGVuZ3RoICE9PSBpbnB1dExheWVyLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBudW1iZXIgb2YgaW5wdXRzIG11c3QgbWF0Y2ggdGhlIG51bWJlciBvZiBub2RlcyBpblwiICtcbiAgICAgICAgXCIgdGhlIGlucHV0IGxheWVyXCIpO1xuICB9XG4gIC8vIFVwZGF0ZSB0aGUgaW5wdXQgbGF5ZXIuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRMYXllci5sZW5ndGg7IGkrKykge1xuICAgIGxldCBub2RlID0gaW5wdXRMYXllcltpXTtcbiAgICBub2RlLm91dHB1dCA9IGlucHV0c1tpXTtcbiAgfVxuICBmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcbiAgICBsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG4gICAgLy8gVXBkYXRlIGFsbCB0aGUgbm9kZXMgaW4gdGhpcyBsYXllci5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG4gICAgICBub2RlLnVwZGF0ZU91dHB1dCgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV0d29ya1tuZXR3b3JrLmxlbmd0aCAtIDFdWzBdLm91dHB1dDtcbn1cblxuLyoqXG4gKiBSdW5zIGEgYmFja3dhcmQgcHJvcGFnYXRpb24gdXNpbmcgdGhlIHByb3ZpZGVkIHRhcmdldCBhbmQgdGhlXG4gKiBjb21wdXRlZCBvdXRwdXQgb2YgdGhlIHByZXZpb3VzIGNhbGwgdG8gZm9yd2FyZCBwcm9wYWdhdGlvbi5cbiAqIFRoaXMgbWV0aG9kIG1vZGlmaWVzIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgbmV0d29yayAtIHRoZSBlcnJvclxuICogZGVyaXZhdGl2ZXMgd2l0aCByZXNwZWN0IHRvIGVhY2ggbm9kZSwgYW5kIGVhY2ggd2VpZ2h0XG4gKiBpbiB0aGUgbmV0d29yay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJhY2tQcm9wKG5ldHdvcms6IE5vZGVbXVtdLCB0YXJnZXQ6IG51bWJlcixcbiAgICBlcnJvckZ1bmM6IEVycm9yRnVuY3Rpb24pOiB2b2lkIHtcbiAgLy8gVGhlIG91dHB1dCBub2RlIGlzIGEgc3BlY2lhbCBjYXNlLiBXZSB1c2UgdGhlIHVzZXItZGVmaW5lZCBlcnJvclxuICAvLyBmdW5jdGlvbiBmb3IgdGhlIGRlcml2YXRpdmUuXG4gIGxldCBvdXRwdXROb2RlID0gbmV0d29ya1tuZXR3b3JrLmxlbmd0aCAtIDFdWzBdO1xuICBvdXRwdXROb2RlLm91dHB1dERlciA9IGVycm9yRnVuYy5kZXIob3V0cHV0Tm9kZS5vdXRwdXQsIHRhcmdldCk7XG5cbiAgLy8gR28gdGhyb3VnaCB0aGUgbGF5ZXJzIGJhY2t3YXJkcy5cbiAgZm9yIChsZXQgbGF5ZXJJZHggPSBuZXR3b3JrLmxlbmd0aCAtIDE7IGxheWVySWR4ID49IDE7IGxheWVySWR4LS0pIHtcbiAgICBsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG4gICAgLy8gQ29tcHV0ZSB0aGUgZXJyb3IgZGVyaXZhdGl2ZSBvZiBlYWNoIG5vZGUgd2l0aCByZXNwZWN0IHRvOlxuICAgIC8vIDEpIGl0cyB0b3RhbCBpbnB1dFxuICAgIC8vIDIpIGVhY2ggb2YgaXRzIGlucHV0IHdlaWdodHMuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuICAgICAgbm9kZS5pbnB1dERlciA9IG5vZGUub3V0cHV0RGVyICogbm9kZS5hY3RpdmF0aW9uLmRlcihub2RlLnRvdGFsSW5wdXQpO1xuICAgICAgbm9kZS5hY2NJbnB1dERlciArPSBub2RlLmlucHV0RGVyO1xuICAgICAgbm9kZS5udW1BY2N1bXVsYXRlZERlcnMrKztcbiAgICB9XG5cbiAgICAvLyBFcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byBlYWNoIHdlaWdodCBjb21pbmcgaW50byB0aGUgbm9kZS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xuICAgICAgICBsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcbiAgICAgICAgaWYgKGxpbmsuaXNEZWFkKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbGluay5lcnJvckRlciA9IG5vZGUuaW5wdXREZXIgKiBsaW5rLnNvdXJjZS5vdXRwdXQ7XG4gICAgICAgIGxpbmsuYWNjRXJyb3JEZXIgKz0gbGluay5lcnJvckRlcjtcbiAgICAgICAgbGluay5udW1BY2N1bXVsYXRlZERlcnMrKztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGxheWVySWR4ID09PSAxKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgbGV0IHByZXZMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHggLSAxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZMYXllci5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG5vZGUgPSBwcmV2TGF5ZXJbaV07XG4gICAgICAvLyBDb21wdXRlIHRoZSBlcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byBlYWNoIG5vZGUncyBvdXRwdXQuXG4gICAgICBub2RlLm91dHB1dERlciA9IDA7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUub3V0cHV0cy5sZW5ndGg7IGorKykge1xuICAgICAgICBsZXQgb3V0cHV0ID0gbm9kZS5vdXRwdXRzW2pdO1xuICAgICAgICBub2RlLm91dHB1dERlciArPSBvdXRwdXQud2VpZ2h0ICogb3V0cHV0LmRlc3QuaW5wdXREZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgd2VpZ2h0cyBvZiB0aGUgbmV0d29yayB1c2luZyB0aGUgcHJldmlvdXNseSBhY2N1bXVsYXRlZCBlcnJvclxuICogZGVyaXZhdGl2ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVXZWlnaHRzKG5ldHdvcms6IE5vZGVbXVtdLCBsZWFybmluZ1JhdGU6IG51bWJlcixcbiAgICByZWd1bGFyaXphdGlvblJhdGU6IG51bWJlcikge1xuICBmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcbiAgICBsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuICAgICAgLy8gVXBkYXRlIHRoZSBub2RlJ3MgYmlhcy5cbiAgICAgIGlmIChub2RlLm51bUFjY3VtdWxhdGVkRGVycyA+IDApIHtcblx0XHRub2RlLnRydWVMZWFybmluZ1JhdGUgPSBub2RlLmFjY0lucHV0RGVyL25vZGUubnVtQWNjdW11bGF0ZWREZXJzO1xuICAgICAgICBub2RlLmJpYXMgLT0gbGVhcm5pbmdSYXRlICogbm9kZS50cnVlTGVhcm5pbmdSYXRlOyAvLyBub2RlLmFjY0lucHV0RGVyIC8gbm9kZS5udW1BY2N1bXVsYXRlZERlcnM7XG4gICAgICAgIG5vZGUuYWNjSW5wdXREZXIgPSAwO1xuICAgICAgICBub2RlLm51bUFjY3VtdWxhdGVkRGVycyA9IDA7XG4gICAgICB9XG4gICAgICAvLyBVcGRhdGUgdGhlIHdlaWdodHMgY29taW5nIGludG8gdGhpcyBub2RlLlxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBub2RlLmlucHV0TGlua3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbGV0IGxpbmsgPSBub2RlLmlucHV0TGlua3Nbal07XG4gICAgICAgIGlmIChsaW5rLmlzRGVhZCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZWd1bERlciA9IGxpbmsucmVndWxhcml6YXRpb24gP1xuICAgICAgICAgICAgbGluay5yZWd1bGFyaXphdGlvbi5kZXIobGluay53ZWlnaHQpIDogMDtcbiAgICAgICAgaWYgKGxpbmsubnVtQWNjdW11bGF0ZWREZXJzID4gMCkge1xuICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgd2VpZ2h0IGJhc2VkIG9uIGRFL2R3LlxuICAgICAgICAgIGxpbmsudHJ1ZUxlYXJuaW5nUmF0ZSA9IGxpbmsuYWNjRXJyb3JEZXIgLyBsaW5rLm51bUFjY3VtdWxhdGVkRGVycztcbiAgICAgICAgICBsaW5rLndlaWdodCA9IGxpbmsud2VpZ2h0IC0gbGVhcm5pbmdSYXRlICogbGluay50cnVlTGVhcm5pbmdSYXRlO1xuICAgICAgICAgICAgICAvLyBsZWFybmluZ1JhdGUgKiBsaW5rLmFjY0Vycm9yRGVyIC8gbGluay5udW1BY2N1bXVsYXRlZERlcnM7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgIC8vIEZ1cnRoZXIgdXBkYXRlIHRoZSB3ZWlnaHQgYmFzZWQgb24gcmVndWxhcml6YXRpb24uXG4gICAgICAgICAgbGV0IG5ld0xpbmtXZWlnaHQgPSBsaW5rLndlaWdodCAtXG4gICAgICAgICAgICAgIChsZWFybmluZ1JhdGUgKiByZWd1bGFyaXphdGlvblJhdGUpICogcmVndWxEZXI7XG4gICAgICAgICAgaWYgKGxpbmsucmVndWxhcml6YXRpb24gPT09IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24uTDEgJiZcbiAgICAgICAgICAgICAgbGluay53ZWlnaHQgKiBuZXdMaW5rV2VpZ2h0IDwgMCkge1xuICAgICAgICAgICAgLy8gVGhlIHdlaWdodCBjcm9zc2VkIDAgZHVlIHRvIHRoZSByZWd1bGFyaXphdGlvbiB0ZXJtLiBTZXQgaXQgdG8gMC5cbiAgICAgICAgICAgIGxpbmsud2VpZ2h0ID0gMDtcbiAgICAgICAgICAgIGxpbmsuaXNEZWFkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGluay53ZWlnaHQgPSBuZXdMaW5rV2VpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBsaW5rLmFjY0Vycm9yRGVyID0gMDtcbiAgICAgICAgICBsaW5rLm51bUFjY3VtdWxhdGVkRGVycyA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqIEl0ZXJhdGVzIG92ZXIgZXZlcnkgbm9kZSBpbiB0aGUgbmV0d29yay8gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoTm9kZShuZXR3b3JrOiBOb2RlW11bXSwgaWdub3JlSW5wdXRzOiBib29sZWFuLFxuICAgIGFjY2Vzc29yOiAobm9kZTogTm9kZSkgPT4gYW55KSB7XG4gIGZvciAobGV0IGxheWVySWR4ID0gaWdub3JlSW5wdXRzID8gMSA6IDA7XG4gICAgICBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoO1xuICAgICAgbGF5ZXJJZHgrKykge1xuICAgIGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG4gICAgICBhY2Nlc3Nvcihub2RlKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIFJldHVybnMgdGhlIG91dHB1dCBub2RlIGluIHRoZSBuZXR3b3JrLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE91dHB1dE5vZGUobmV0d29yazogTm9kZVtdW10pIHtcbiAgcmV0dXJuIG5ldHdvcmtbbmV0d29yay5sZW5ndGggLSAxXVswXTtcbn1cbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuaW1wb3J0ICogYXMgbm4gZnJvbSBcIi4vbm5cIjtcbmltcG9ydCB7SGVhdE1hcCwgcmVkdWNlTWF0cml4fSBmcm9tIFwiLi9oZWF0bWFwXCI7XG5pbXBvcnQge1xuICBTdGF0ZSxcbiAgZGF0YXNldHMsXG4gIHJlZ0RhdGFzZXRzLFxuICBhY3RpdmF0aW9ucyxcbiAgcHJvYmxlbXMsXG4gIHJlZ3VsYXJpemF0aW9ucyxcbiAgZ2V0S2V5RnJvbVZhbHVlLFxuICBQcm9ibGVtXG59IGZyb20gXCIuL3N0YXRlXCI7XG5pbXBvcnQge0V4YW1wbGUyRCwgc2h1ZmZsZX0gZnJvbSBcIi4vZGF0YXNldFwiO1xuaW1wb3J0IHtBcHBlbmRpbmdMaW5lQ2hhcnR9IGZyb20gXCIuL2xpbmVjaGFydFwiO1xuXG5sZXQgbWFpbldpZHRoO1xuXG5mdW5jdGlvbiBsb2cyKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiBNYXRoLmxvZyh4KS9NYXRoLmxvZygyKTtcbn1cblxuZnVuY3Rpb24gbG9nMTAoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIE1hdGgubG9nKHgpL01hdGgubG9nKDEwKTtcbn1cblxuZnVuY3Rpb24gc2lnbmFsT2YoeDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIGxvZzIoMStNYXRoLmFicyh4KSk7XG59XG5cbmZ1bmN0aW9uIFNOUih4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gMTAqbG9nMTAoeCk7XG59XG5cbi8vIE1vcmUgc2Nyb2xsaW5nXG5kMy5zZWxlY3QoXCIubW9yZSBidXR0b25cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgbGV0IHBvc2l0aW9uID0gODAwO1xuICBkMy50cmFuc2l0aW9uKClcbiAgICAuZHVyYXRpb24oMTAwMClcbiAgICAudHdlZW4oXCJzY3JvbGxcIiwgc2Nyb2xsVHdlZW4ocG9zaXRpb24pKTtcbn0pO1xuXG5mdW5jdGlvbiBzY3JvbGxUd2VlbihvZmZzZXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGxldCBpID0gZDMuaW50ZXJwb2xhdGVOdW1iZXIod2luZG93LnBhZ2VZT2Zmc2V0IHx8XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsIG9mZnNldCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHsgc2Nyb2xsVG8oMCwgaSh0KSk7IH07XG4gIH07XG59XG5cbmNvbnN0IFJFQ1RfU0laRSA9IDMwO1xuY29uc3QgQklBU19TSVpFID0gNTtcbmNvbnN0IE5VTV9TQU1QTEVTX0NMQVNTSUZZID0gNTAwO1xuY29uc3QgTlVNX1NBTVBMRVNfUkVHUkVTUyA9IDEyMDA7XG5jb25zdCBERU5TSVRZID0gMTAwO1xuXG5lbnVtIEhvdmVyVHlwZSB7XG4gIEJJQVMsIFdFSUdIVFxufVxuXG5pbnRlcmZhY2UgSW5wdXRGZWF0dXJlIHtcbiAgZjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXI7XG4gIGxhYmVsPzogc3RyaW5nO1xufVxuXG5sZXQgSU5QVVRTOiB7W25hbWU6IHN0cmluZ106IElucHV0RmVhdHVyZX0gPSB7XG4gIFwieFwiOiB7ZjogKHgsIHkpID0+IHgsIGxhYmVsOiBcIlhfMVwifSxcbiAgXCJ5XCI6IHtmOiAoeCwgeSkgPT4geSwgbGFiZWw6IFwiWF8yXCJ9LFxuICBcInhTcXVhcmVkXCI6IHtmOiAoeCwgeSkgPT4geCAqIHgsIGxhYmVsOiBcIlhfMV4yXCJ9LFxuICBcInlTcXVhcmVkXCI6IHtmOiAoeCwgeSkgPT4geSAqIHksICBsYWJlbDogXCJYXzJeMlwifSxcbiAgXCJ4VGltZXNZXCI6IHtmOiAoeCwgeSkgPT4geCAqIHksIGxhYmVsOiBcIlhfMVhfMlwifSxcbiAgXCJzaW5YXCI6IHtmOiAoeCwgeSkgPT4gTWF0aC5zaW4oeCksIGxhYmVsOiBcInNpbihYXzEpXCJ9LFxuICBcInNpbllcIjoge2Y6ICh4LCB5KSA9PiBNYXRoLnNpbih5KSwgbGFiZWw6IFwic2luKFhfMilcIn0sXG59O1xuXG5sZXQgSElEQUJMRV9DT05UUk9MUyA9IFtcbiAgW1wiU2hvdyB0ZXN0IGRhdGFcIiwgXCJzaG93VGVzdERhdGFcIl0sXG4gIFtcIkRpc2NyZXRpemUgb3V0cHV0XCIsIFwiZGlzY3JldGl6ZVwiXSxcbiAgW1wiUGxheSBidXR0b25cIiwgXCJwbGF5QnV0dG9uXCJdLFxuICBbXCJTdGVwIGJ1dHRvblwiLCBcInN0ZXBCdXR0b25cIl0sXG4gIFtcIlJlc2V0IGJ1dHRvblwiLCBcInJlc2V0QnV0dG9uXCJdLFxuICBbXCJSYXRlIHNjYWxlIGZhY3RvclwiLCBcImxlYXJuaW5nUmF0ZVwiXSxcbiAgW1wiTGVhcm5pbmcgcmF0ZVwiLCBcInRydWVMZWFybmluZ1JhdGVcIl0sXG4gIFtcIkFjdGl2YXRpb25cIiwgXCJhY3RpdmF0aW9uXCJdLFxuICBbXCJSZWd1bGFyaXphdGlvblwiLCBcInJlZ3VsYXJpemF0aW9uXCJdLFxuICBbXCJSZWd1bGFyaXphdGlvbiByYXRlXCIsIFwicmVndWxhcml6YXRpb25SYXRlXCJdLFxuICBbXCJQcm9ibGVtIHR5cGVcIiwgXCJwcm9ibGVtXCJdLFxuICBbXCJXaGljaCBkYXRhc2V0XCIsIFwiZGF0YXNldFwiXSxcbiAgW1wiUmF0aW8gdHJhaW4gZGF0YVwiLCBcInBlcmNUcmFpbkRhdGFcIl0sXG4gIFtcIk5vaXNlIGxldmVsXCIsIFwibm9pc2VcIl0sXG4gIFtcIkJhdGNoIHNpemVcIiwgXCJiYXRjaFNpemVcIl0sXG4gIFtcIiMgb2YgaGlkZGVuIGxheWVyc1wiLCBcIm51bUhpZGRlbkxheWVyc1wiXSxcbl07XG5cbmNsYXNzIFBsYXllciB7XG4gIHByaXZhdGUgdGltZXJJbmRleCA9IDA7XG4gIHByaXZhdGUgaXNQbGF5aW5nID0gZmFsc2U7XG4gIHByaXZhdGUgY2FsbGJhY2s6IChpc1BsYXlpbmc6IGJvb2xlYW4pID0+IHZvaWQgPSBudWxsO1xuXG4gIC8qKiBQbGF5cy9wYXVzZXMgdGhlIHBsYXllci4gKi9cbiAgcGxheU9yUGF1c2UoKSB7XG4gICAgaWYgKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICB0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5wYXVzZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlzUGxheWluZyA9IHRydWU7XG4gICAgICBpZiAoaXRlciA9PT0gMCkge1xuICAgICAgICBzaW11bGF0aW9uU3RhcnRlZCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgb25QbGF5UGF1c2UoY2FsbGJhY2s6IChpc1BsYXlpbmc6IGJvb2xlYW4pID0+IHZvaWQpIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICBwbGF5KCkge1xuICAgIHRoaXMucGF1c2UoKTtcbiAgICB0aGlzLmlzUGxheWluZyA9IHRydWU7XG4gICAgaWYgKHRoaXMuY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuY2FsbGJhY2sodGhpcy5pc1BsYXlpbmcpO1xuICAgIH1cbiAgICB0aGlzLnN0YXJ0KHRoaXMudGltZXJJbmRleCk7XG4gIH1cblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLnRpbWVySW5kZXgrKztcbiAgICB0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrKHRoaXMuaXNQbGF5aW5nKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0KGxvY2FsVGltZXJJbmRleDogbnVtYmVyKSB7XG4gICAgZDMudGltZXIoKCkgPT4ge1xuICAgICAgaWYgKGxvY2FsVGltZXJJbmRleCA8IHRoaXMudGltZXJJbmRleCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTsgIC8vIERvbmUuXG4gICAgICB9XG4gICAgICBvbmVTdGVwKCk7XG4gICAgICByZXR1cm4gZmFsc2U7ICAvLyBOb3QgZG9uZS5cbiAgICB9LCAwKTtcbiAgfVxufVxuXG5sZXQgc3RhdGUgPSBTdGF0ZS5kZXNlcmlhbGl6ZVN0YXRlKCk7XG5cbi8vIEZpbHRlciBvdXQgaW5wdXRzIHRoYXQgYXJlIGhpZGRlbi5cbnN0YXRlLmdldEhpZGRlblByb3BzKCkuZm9yRWFjaChwcm9wID0+IHtcbiAgaWYgKHByb3AgaW4gSU5QVVRTKSB7XG4gICAgZGVsZXRlIElOUFVUU1twcm9wXTtcbiAgfVxufSk7XG5cbmxldCBib3VuZGFyeToge1tpZDogc3RyaW5nXTogbnVtYmVyW11bXX0gPSB7fTtcbmxldCBzZWxlY3RlZE5vZGVJZDogc3RyaW5nID0gbnVsbDtcbi8vIFBsb3QgdGhlIGhlYXRtYXAuXG5sZXQgeERvbWFpbjogW251bWJlciwgbnVtYmVyXSA9IFstNiwgNl07XG5sZXQgaGVhdE1hcCA9XG4gICAgbmV3IEhlYXRNYXAoMzAwLCBERU5TSVRZLCB4RG9tYWluLCB4RG9tYWluLCBkMy5zZWxlY3QoXCIjaGVhdG1hcFwiKSxcbiAgICAgICAge3Nob3dBeGVzOiB0cnVlfSk7XG5sZXQgbGlua1dpZHRoU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAuZG9tYWluKFswLCA1XSlcbiAgLnJhbmdlKFsxLCAxMF0pXG4gIC5jbGFtcCh0cnVlKTtcbmxldCBjb2xvclNjYWxlID0gZDMuc2NhbGUubGluZWFyPHN0cmluZz4oKVxuICAgICAgICAgICAgICAgICAgICAgLmRvbWFpbihbLTEsIDAsIDFdKVxuICAgICAgICAgICAgICAgICAgICAgLnJhbmdlKFtcIiM5M2Y1MjJcIiwgXCIjZWFlOGViXCIsIFwiIzc3MDhiZFwiXSlcbiAgICAgICAgICAgICAgICAgICAgIC5jbGFtcCh0cnVlKTtcbmxldCBpdGVyID0gMDtcbmxldCB0cmFpbkRhdGE6IEV4YW1wbGUyRFtdID0gW107XG5sZXQgdGVzdERhdGE6IEV4YW1wbGUyRFtdID0gW107XG5sZXQgbmV0d29yazogbm4uTm9kZVtdW10gPSBudWxsO1xubGV0IGxvc3NUcmFpbiA9IDI7XG5sZXQgbG9zc1Rlc3QgPSAwO1xubGV0IHRydWVMZWFybmluZ1JhdGUgPSAwO1xubGV0IHRvdGFsQ2FwYWNpdHkgPSAwO1xubGV0IHJlcUNhcGFjaXR5ID0gMjtcbmxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG5sZXQgbGluZUNoYXJ0ID0gbmV3IEFwcGVuZGluZ0xpbmVDaGFydChkMy5zZWxlY3QoXCIjbGluZWNoYXJ0XCIpLFxuICAgIFtcIiM3NzdcIiwgXCJibGFja1wiXSk7XG5cbmZ1bmN0aW9uIG1ha2VHVUkoKSB7XG4gIGQzLnNlbGVjdChcIiNyZXNldC1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgcmVzZXQoKTtcbiAgICB1c2VySGFzSW50ZXJhY3RlZCgpO1xuICAgIGQzLnNlbGVjdChcIiNwbGF5LXBhdXNlLWJ1dHRvblwiKTtcbiAgfSk7XG5cbiAgZDMuc2VsZWN0KFwiI3BsYXktcGF1c2UtYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIC8vIENoYW5nZSB0aGUgYnV0dG9uJ3MgY29udGVudC5cbiAgICB1c2VySGFzSW50ZXJhY3RlZCgpO1xuICAgIHBsYXllci5wbGF5T3JQYXVzZSgpO1xuICB9KTtcblxuICBwbGF5ZXIub25QbGF5UGF1c2UoaXNQbGF5aW5nID0+IHtcbiAgICBkMy5zZWxlY3QoXCIjcGxheS1wYXVzZS1idXR0b25cIikuY2xhc3NlZChcInBsYXlpbmdcIiwgaXNQbGF5aW5nKTtcbiAgfSk7XG5cbiAgZDMuc2VsZWN0KFwiI25leHQtc3RlcC1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgcGxheWVyLnBhdXNlKCk7XG4gICAgdXNlckhhc0ludGVyYWN0ZWQoKTtcbiAgICBpZiAoaXRlciA9PT0gMCkge1xuICAgICAgc2ltdWxhdGlvblN0YXJ0ZWQoKTtcbiAgICB9XG4gICAgb25lU3RlcCgpO1xuICB9KTtcblxuICBkMy5zZWxlY3QoXCIjZGF0YS1yZWdlbi1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgZ2VuZXJhdGVEYXRhKCk7XG4gICAgcGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuICB9KTtcblxuICBsZXQgZGF0YVRodW1ibmFpbHMgPSBkMy5zZWxlY3RBbGwoXCJjYW52YXNbZGF0YS1kYXRhc2V0XVwiKTtcbiAgZGF0YVRodW1ibmFpbHMub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgbmV3RGF0YXNldCA9IGRhdGFzZXRzW3RoaXMuZGF0YXNldC5kYXRhc2V0XTtcbiAgICBpZiAobmV3RGF0YXNldCA9PT0gc3RhdGUuZGF0YXNldCkge1xuICAgICAgcmV0dXJuOyAvLyBOby1vcC5cbiAgICB9XG5cbiAgICBzdGF0ZS5kYXRhc2V0ID0gIG5ld0RhdGFzZXQ7XG4gICAgbGV0IGRhdGFzZXRLZXkgPSBnZXRLZXlGcm9tVmFsdWUoZGF0YXNldHMsIG5ld0RhdGFzZXQpO1xuICAgIGlmIChkYXRhc2V0S2V5ID09PSBcImNpcmNsZVwiICkgcmVxQ2FwYWNpdHkgPSAxMjtcbiAgICBpZiAoZGF0YXNldEtleSA9PT0gXCJ4b3JcIiApIHJlcUNhcGFjaXR5ID0gNDtcbiAgICBpZiAoZGF0YXNldEtleSA9PT0gXCJnYXVzc1wiICkgcmVxQ2FwYWNpdHkgPSAyO1xuICAgIGlmIChkYXRhc2V0S2V5ID09PSBcInNwaXJhbFwiICkgcmVxQ2FwYWNpdHkgPSAzMjA7XG4gICAgc3RhdGUucmVxQ2FwYWNpdHkgPSByZXFDYXBhY2l0eTtcbiAgICBkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JpdEJhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnJlcUNhcGFjaXR5KTtcbiAgICBkYXRhVGh1bWJuYWlscy5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgc3RhdGUubm9pc2UgPSAzNTtcbiAgICBnZW5lcmF0ZURhdGEoKTtcbiAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG4gICAgcmVzZXQoKTtcbiAgfSk7XG5cbiAgbGV0IGRhdGFzZXRLZXkgPSBnZXRLZXlGcm9tVmFsdWUoZGF0YXNldHMsIHN0YXRlLmRhdGFzZXQpO1xuICAvLyBTZWxlY3QgdGhlIGRhdGFzZXQgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxuICBkMy5zZWxlY3QoYGNhbnZhc1tkYXRhLWRhdGFzZXQ9JHtkYXRhc2V0S2V5fV1gKVxuICAgIC5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cbiAgbGV0IHJlZ0RhdGFUaHVtYm5haWxzID0gZDMuc2VsZWN0QWxsKFwiY2FudmFzW2RhdGEtcmVnRGF0YXNldF1cIik7XG4gIHJlZ0RhdGFUaHVtYm5haWxzLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgbGV0IG5ld0RhdGFzZXQgPSByZWdEYXRhc2V0c1t0aGlzLmRhdGFzZXQucmVnZGF0YXNldF07XG4gICAgaWYgKG5ld0RhdGFzZXQgPT09IHN0YXRlLnJlZ0RhdGFzZXQpIHtcbiAgICAgIHJldHVybjsgLy8gTm8tb3AuXG4gICAgfVxuICAgIHN0YXRlLnJlZ0RhdGFzZXQgPSAgbmV3RGF0YXNldDtcbiAgICByZWdEYXRhVGh1bWJuYWlscy5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgZ2VuZXJhdGVEYXRhKCk7XG4gICAgcGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuICAgIHJlc2V0KCk7XG4gIH0pO1xuXG4gIGxldCByZWdEYXRhc2V0S2V5ID0gZ2V0S2V5RnJvbVZhbHVlKHJlZ0RhdGFzZXRzLCBzdGF0ZS5yZWdEYXRhc2V0KTtcbiAgLy8gU2VsZWN0IHRoZSBkYXRhc2V0IGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS5cbiAgZDMuc2VsZWN0KGBjYW52YXNbZGF0YS1yZWdEYXRhc2V0PSR7cmVnRGF0YXNldEtleX1dYClcbiAgICAuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xuXG4gIGQzLnNlbGVjdChcIiNhZGQtbGF5ZXJzXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGlmIChzdGF0ZS5udW1IaWRkZW5MYXllcnMgPj0gNikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdGF0ZS5uZXR3b3JrU2hhcGVbc3RhdGUubnVtSGlkZGVuTGF5ZXJzXSA9IDI7XG4gICAgc3RhdGUubnVtSGlkZGVuTGF5ZXJzKys7XG4gICAgcGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuICAgIHJlc2V0KCk7XG4gIH0pO1xuXG4gIGQzLnNlbGVjdChcIiNyZW1vdmUtbGF5ZXJzXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGlmIChzdGF0ZS5udW1IaWRkZW5MYXllcnMgPD0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdGF0ZS5udW1IaWRkZW5MYXllcnMtLTtcbiAgICBzdGF0ZS5uZXR3b3JrU2hhcGUuc3BsaWNlKHN0YXRlLm51bUhpZGRlbkxheWVycyk7XG4gICAgcGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuICAgIHJlc2V0KCk7XG4gIH0pO1xuXG4gIGxldCBzaG93VGVzdERhdGEgPSBkMy5zZWxlY3QoXCIjc2hvdy10ZXN0LWRhdGFcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG4gICAgc3RhdGUuc2hvd1Rlc3REYXRhID0gdGhpcy5jaGVja2VkO1xuICAgIHN0YXRlLnNlcmlhbGl6ZSgpO1xuICAgIHVzZXJIYXNJbnRlcmFjdGVkKCk7XG4gICAgaGVhdE1hcC51cGRhdGVUZXN0UG9pbnRzKHN0YXRlLnNob3dUZXN0RGF0YSA/IHRlc3REYXRhIDogW10pO1xuICB9KTtcbiAgLy8gQ2hlY2svdW5jaGVjayB0aGUgY2hlY2tib3ggYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxuICBzaG93VGVzdERhdGEucHJvcGVydHkoXCJjaGVja2VkXCIsIHN0YXRlLnNob3dUZXN0RGF0YSk7XG5cbiAgbGV0IGRpc2NyZXRpemUgPSBkMy5zZWxlY3QoXCIjZGlzY3JldGl6ZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcbiAgICBzdGF0ZS5kaXNjcmV0aXplID0gdGhpcy5jaGVja2VkO1xuICAgIHN0YXRlLnNlcmlhbGl6ZSgpO1xuICAgIHVzZXJIYXNJbnRlcmFjdGVkKCk7XG4gICAgdXBkYXRlVUkoKTtcbiAgfSk7XG4gIC8vIENoZWNrL3VuY2hlY2sgdGhlIGNoZWNib3ggYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxuICBkaXNjcmV0aXplLnByb3BlcnR5KFwiY2hlY2tlZFwiLCBzdGF0ZS5kaXNjcmV0aXplKTtcblxuICBsZXQgcGVyY1RyYWluID0gZDMuc2VsZWN0KFwiI3BlcmNUcmFpbkRhdGFcIikub24oXCJpbnB1dFwiLCBmdW5jdGlvbigpIHtcbiAgICBzdGF0ZS5wZXJjVHJhaW5EYXRhID0gdGhpcy52YWx1ZTtcbiAgICBnZW5lcmF0ZURhdGEoKTtcbiAgICBkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3BlcmNUcmFpbkRhdGEnXSAudmFsdWVcIikudGV4dCh0aGlzLnZhbHVlKTtcbiAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG4gICAgcmVzZXQoKTtcbiAgfSk7XG4gIHBlcmNUcmFpbi5wcm9wZXJ0eShcInZhbHVlXCIsIHN0YXRlLnBlcmNUcmFpbkRhdGEpO1xuICBkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3BlcmNUcmFpbkRhdGEnXSAudmFsdWVcIikudGV4dChzdGF0ZS5wZXJjVHJhaW5EYXRhKTtcblxuICBmdW5jdGlvbiBodW1hblJlYWRhYmxlSW50KG46IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIG4udG9GaXhlZCgwKTtcbiAgfVxuXG4gIGxldCBub2lzZSA9IGQzLnNlbGVjdChcIiNub2lzZVwiKS5vbihcImlucHV0XCIsIGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLm5vaXNlID0gdGhpcy52YWx1ZTtcbiAgICBkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3RydWUtbm9pc2VTTlInXSAudmFsdWVcIikudGV4dCh0aGlzLnZhbHVlKTtcbiAgICBnZW5lcmF0ZURhdGEoKTtcbiAgICAvL34gZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdiaXRCYXRjaFNpemUnXSAudmFsdWVcIikudGV4dChodW1hblJlYWRhYmxlSW50KHN0YXRlLnJlcUNhcGFjaXR5KSk7XG4gICAgZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdiaXRCYXRjaFNpemUnXSAudmFsdWVcIikudGV4dChzdGF0ZS5yZXFDYXBhY2l0eSk7XG4gICAgcGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xuICAgIHJlc2V0KCk7XG4gIH0pO1xuICBcbiAgbm9pc2UucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5ub2lzZSk7XG4gIGQzLnNlbGVjdChcImxhYmVsW2Zvcj0ndHJ1ZS1ub2lzZVNOUiddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLm5vaXNlKTtcbiAgZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdiaXRCYXRjaFNpemUnXSAudmFsdWVcIikudGV4dChzdGF0ZS5yZXFDYXBhY2l0eSk7XG4gIFxuICBsZXQgYmF0Y2hTaXplID0gZDMuc2VsZWN0KFwiI2JhdGNoU2l6ZVwiKS5vbihcImlucHV0XCIsIGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLmJhdGNoU2l6ZSA9IHRoaXMudmFsdWU7XG4gICAgZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdiYXRjaFNpemUnXSAudmFsdWVcIikudGV4dCh0aGlzLnZhbHVlKTtcbiAgICBkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JpdEJhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnJlcUNhcGFjaXR5KTtcbiAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG4gICAgcmVzZXQoKTtcbiAgfSk7XG4gIGJhdGNoU2l6ZS5wcm9wZXJ0eShcInZhbHVlXCIsIHN0YXRlLmJhdGNoU2l6ZSk7XG4gIGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nYmF0Y2hTaXplJ10gLnZhbHVlXCIpLnRleHQoc3RhdGUuYmF0Y2hTaXplKTtcbiAgZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdiaXRCYXRjaFNpemUnXSAudmFsdWVcIikudGV4dChzdGF0ZS5yZXFDYXBhY2l0eSk7XG4gIFxuXG4gIGxldCBhY3RpdmF0aW9uRHJvcGRvd24gPSBkMy5zZWxlY3QoXCIjYWN0aXZhdGlvbnNcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG4gICAgc3RhdGUuYWN0aXZhdGlvbiA9IGFjdGl2YXRpb25zW3RoaXMudmFsdWVdO1xuICAgIHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcbiAgICByZXNldCgpO1xuICB9KTtcbiAgYWN0aXZhdGlvbkRyb3Bkb3duLnByb3BlcnR5KFwidmFsdWVcIixcbiAgICAgIGdldEtleUZyb21WYWx1ZShhY3RpdmF0aW9ucywgc3RhdGUuYWN0aXZhdGlvbikpO1xuXG4gIGxldCBsZWFybmluZ1JhdGUgPSBkMy5zZWxlY3QoXCIjbGVhcm5pbmdSYXRlXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLmxlYXJuaW5nUmF0ZSA9IHRoaXMudmFsdWU7XG4gICAgc3RhdGUuc2VyaWFsaXplKCk7XG4gICAgdXNlckhhc0ludGVyYWN0ZWQoKTtcbiAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG4gIH0pO1xuICBsZWFybmluZ1JhdGUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5sZWFybmluZ1JhdGUpO1xuICBcbiAgbGV0IHJlZ3VsYXJEcm9wZG93biA9IGQzLnNlbGVjdChcIiNyZWd1bGFyaXphdGlvbnNcIikub24oXCJjaGFuZ2VcIixcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLnJlZ3VsYXJpemF0aW9uID0gcmVndWxhcml6YXRpb25zW3RoaXMudmFsdWVdO1xuICAgIHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcbiAgICByZXNldCgpO1xuICB9KTtcbiAgcmVndWxhckRyb3Bkb3duLnByb3BlcnR5KFwidmFsdWVcIixcbiAgICAgIGdldEtleUZyb21WYWx1ZShyZWd1bGFyaXphdGlvbnMsIHN0YXRlLnJlZ3VsYXJpemF0aW9uKSk7XG5cbiAgbGV0IHJlZ3VsYXJSYXRlID0gZDMuc2VsZWN0KFwiI3JlZ3VsYXJSYXRlXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLnJlZ3VsYXJpemF0aW9uUmF0ZSA9ICt0aGlzLnZhbHVlO1xuICAgIHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcbiAgICByZXNldCgpO1xuICB9KTtcbiAgcmVndWxhclJhdGUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5yZWd1bGFyaXphdGlvblJhdGUpO1xuXG4gIGxldCBwcm9ibGVtID0gZDMuc2VsZWN0KFwiI3Byb2JsZW1cIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG4gICAgc3RhdGUucHJvYmxlbSA9IHByb2JsZW1zW3RoaXMudmFsdWVdO1xuICAgIGdlbmVyYXRlRGF0YSgpO1xuICAgIGRyYXdEYXRhc2V0VGh1bWJuYWlscygpO1xuICAgIHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcbiAgICByZXNldCgpO1xuICB9KTtcbiAgcHJvYmxlbS5wcm9wZXJ0eShcInZhbHVlXCIsIGdldEtleUZyb21WYWx1ZShwcm9ibGVtcywgc3RhdGUucHJvYmxlbSkpO1xuXG4gIC8vIEFkZCBzY2FsZSB0byB0aGUgZ3JhZGllbnQgY29sb3IgbWFwLlxuICBsZXQgeCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbLTEsIDFdKS5yYW5nZShbMCwgMTQ0XSk7XG4gIGxldCB4QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAuc2NhbGUoeClcbiAgICAub3JpZW50KFwiYm90dG9tXCIpXG4gICAgLnRpY2tWYWx1ZXMoWy0xLCAwLCAxXSlcbiAgICAudGlja0Zvcm1hdChkMy5mb3JtYXQoXCJkXCIpKTtcbiAgZDMuc2VsZWN0KFwiI2NvbG9ybWFwIGcuY29yZVwiKS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcInggYXhpc1wiKVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsMTApXCIpXG4gICAgLmNhbGwoeEF4aXMpO1xuXG4gIC8vIExpc3RlbiBmb3IgY3NzLXJlc3BvbnNpdmUgY2hhbmdlcyBhbmQgcmVkcmF3IHRoZSBzdmcgbmV0d29yay5cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XG4gICAgbGV0IG5ld1dpZHRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluLXBhcnRcIilcbiAgICAgICAgLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgIGlmIChuZXdXaWR0aCAhPT0gbWFpbldpZHRoKSB7XG4gICAgICBtYWluV2lkdGggPSBuZXdXaWR0aDtcbiAgICAgIGRyYXdOZXR3b3JrKG5ldHdvcmspO1xuICAgICAgdXBkYXRlVUkodHJ1ZSk7XG4gICAgfVxuICB9KTtcblxuICAvLyBIaWRlIHRoZSB0ZXh0IGJlbG93IHRoZSB2aXN1YWxpemF0aW9uIGRlcGVuZGluZyBvbiB0aGUgVVJMLlxuICBpZiAoc3RhdGUuaGlkZVRleHQpIHtcbiAgICBkMy5zZWxlY3QoXCIjYXJ0aWNsZS10ZXh0XCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgZDMuc2VsZWN0KFwiZGl2Lm1vcmVcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICBkMy5zZWxlY3QoXCJoZWFkZXJcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVCaWFzZXNVSShuZXR3b3JrOiBubi5Ob2RlW11bXSkge1xuICBubi5mb3JFYWNoTm9kZShuZXR3b3JrLCB0cnVlLCBub2RlID0+IHtcbiAgICBkMy5zZWxlY3QoYHJlY3QjYmlhcy0ke25vZGUuaWR9YCkuc3R5bGUoXCJmaWxsXCIsIGNvbG9yU2NhbGUobm9kZS5iaWFzKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVXZWlnaHRzVUkobmV0d29yazogbm4uTm9kZVtdW10sIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4pIHtcbiAgZm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG4gICAgbGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuICAgIC8vIFVwZGF0ZSBhbGwgdGhlIG5vZGVzIGluIHRoaXMgbGF5ZXIuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBub2RlLmlucHV0TGlua3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbGV0IGxpbmsgPSBub2RlLmlucHV0TGlua3Nbal07XG4gICAgICAgIGNvbnRhaW5lci5zZWxlY3QoYCNsaW5rJHtsaW5rLnNvdXJjZS5pZH0tJHtsaW5rLmRlc3QuaWR9YClcbiAgICAgICAgICAgIC5zdHlsZSh7XG4gICAgICAgICAgICAgIFwic3Ryb2tlLWRhc2hvZmZzZXRcIjogLWl0ZXIgLyAzLFxuICAgICAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiBsaW5rV2lkdGhTY2FsZShNYXRoLmFicyhsaW5rLndlaWdodCkpLFxuICAgICAgICAgICAgICBcInN0cm9rZVwiOiBjb2xvclNjYWxlKGxpbmsud2VpZ2h0KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5kYXR1bShsaW5rKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZHJhd05vZGUoY3g6IG51bWJlciwgY3k6IG51bWJlciwgbm9kZUlkOiBzdHJpbmcsIGlzSW5wdXQ6IGJvb2xlYW4sXG4gICAgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55Piwgbm9kZT86IG5uLk5vZGUpIHtcbiAgbGV0IHggPSBjeCAtIFJFQ1RfU0laRSAvIDI7XG4gIGxldCB5ID0gY3kgLSBSRUNUX1NJWkUgLyAyO1xuXG4gIGxldCBub2RlR3JvdXAgPSBjb250YWluZXIuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogXCJub2RlXCIsXG4gICAgICBcImlkXCI6IGBub2RlJHtub2RlSWR9YCxcbiAgICAgIFwidHJhbnNmb3JtXCI6IGB0cmFuc2xhdGUoJHt4fSwke3l9KWBcbiAgICB9KTtcblxuICAvLyBEcmF3IHRoZSBtYWluIHJlY3RhbmdsZS5cbiAgbm9kZUdyb3VwLmFwcGVuZChcInJlY3RcIilcbiAgICAuYXR0cih7XG4gICAgICB4OiAwLFxuICAgICAgeTogMCxcbiAgICAgIHdpZHRoOiBSRUNUX1NJWkUsXG4gICAgICBoZWlnaHQ6IFJFQ1RfU0laRSxcbiAgICB9KTtcbiAgbGV0IGFjdGl2ZU9yTm90Q2xhc3MgPSBzdGF0ZVtub2RlSWRdID8gXCJhY3RpdmVcIiA6IFwiaW5hY3RpdmVcIjtcbiAgaWYgKGlzSW5wdXQpIHtcbiAgICBsZXQgbGFiZWwgPSBJTlBVVFNbbm9kZUlkXS5sYWJlbCAhPSBudWxsID9cbiAgICAgICAgSU5QVVRTW25vZGVJZF0ubGFiZWwgOiBub2RlSWQ7XG4gICAgLy8gRHJhdyB0aGUgaW5wdXQgbGFiZWwuXG4gICAgbGV0IHRleHQgPSBub2RlR3JvdXAuYXBwZW5kKFwidGV4dFwiKS5hdHRyKHtcbiAgICAgIGNsYXNzOiBcIm1haW4tbGFiZWxcIixcbiAgICAgIHg6IC0xMCxcbiAgICAgIHk6IFJFQ1RfU0laRSAvIDIsIFwidGV4dC1hbmNob3JcIjogXCJlbmRcIlxuICAgIH0pO1xuICAgIGlmICgvW19eXS8udGVzdChsYWJlbCkpIHtcbiAgICAgIGxldCBteVJlID0gLyguKj8pKFtfXl0pKC4pL2c7XG4gICAgICBsZXQgbXlBcnJheTtcbiAgICAgIGxldCBsYXN0SW5kZXg7XG4gICAgICB3aGlsZSAoKG15QXJyYXkgPSBteVJlLmV4ZWMobGFiZWwpKSAhPSBudWxsKSB7XG4gICAgICAgIGxhc3RJbmRleCA9IG15UmUubGFzdEluZGV4O1xuICAgICAgICBsZXQgcHJlZml4ID0gbXlBcnJheVsxXTtcbiAgICAgICAgbGV0IHNlcCA9IG15QXJyYXlbMl07XG4gICAgICAgIGxldCBzdWZmaXggPSBteUFycmF5WzNdO1xuICAgICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgICAgdGV4dC5hcHBlbmQoXCJ0c3BhblwiKS50ZXh0KHByZWZpeCk7XG4gICAgICAgIH1cbiAgICAgICAgdGV4dC5hcHBlbmQoXCJ0c3BhblwiKVxuICAgICAgICAuYXR0cihcImJhc2VsaW5lLXNoaWZ0XCIsIHNlcCA9PT0gXCJfXCIgPyBcInN1YlwiIDogXCJzdXBlclwiKVxuICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgXCI5cHhcIilcbiAgICAgICAgLnRleHQoc3VmZml4KTtcbiAgICAgIH1cbiAgICAgIGlmIChsYWJlbC5zdWJzdHJpbmcobGFzdEluZGV4KSkge1xuICAgICAgICB0ZXh0LmFwcGVuZChcInRzcGFuXCIpLnRleHQobGFiZWwuc3Vic3RyaW5nKGxhc3RJbmRleCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0LmFwcGVuZChcInRzcGFuXCIpLnRleHQobGFiZWwpO1xuICAgIH1cbiAgICBub2RlR3JvdXAuY2xhc3NlZChhY3RpdmVPck5vdENsYXNzLCB0cnVlKTtcbiAgfVxuICBpZiAoIWlzSW5wdXQpIHtcbiAgICAvLyBEcmF3IHRoZSBub2RlJ3MgYmlhcy5cbiAgICBub2RlR3JvdXAuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBpZDogYGJpYXMtJHtub2RlSWR9YCxcbiAgICAgICAgeDogLUJJQVNfU0laRSAtIDIsXG4gICAgICAgIHk6IFJFQ1RfU0laRSAtIEJJQVNfU0laRSArIDMsXG4gICAgICAgIHdpZHRoOiBCSUFTX1NJWkUsXG4gICAgICAgIGhlaWdodDogQklBU19TSVpFLFxuICAgICAgfSkub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB1cGRhdGVIb3ZlckNhcmQoSG92ZXJUeXBlLkJJQVMsIG5vZGUsIGQzLm1vdXNlKGNvbnRhaW5lci5ub2RlKCkpKTtcbiAgICAgIH0pLm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdXBkYXRlSG92ZXJDYXJkKG51bGwpO1xuICAgICAgfSk7XG4gIH1cblxuICAvLyBEcmF3IHRoZSBub2RlJ3MgY2FudmFzLlxuICBsZXQgZGl2ID0gZDMuc2VsZWN0KFwiI25ldHdvcmtcIikuaW5zZXJ0KFwiZGl2XCIsIFwiOmZpcnN0LWNoaWxkXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJpZFwiOiBgY2FudmFzLSR7bm9kZUlkfWAsXG4gICAgICBcImNsYXNzXCI6IFwiY2FudmFzXCJcbiAgICB9KVxuICAgIC5zdHlsZSh7XG4gICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgICAgbGVmdDogYCR7eCArIDN9cHhgLFxuICAgICAgdG9wOiBgJHt5ICsgM31weGBcbiAgICB9KVxuICAgIC5vbihcIm1vdXNlZW50ZXJcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBzZWxlY3RlZE5vZGVJZCA9IG5vZGVJZDtcbiAgICAgIGRpdi5jbGFzc2VkKFwiaG92ZXJlZFwiLCB0cnVlKTtcbiAgICAgIG5vZGVHcm91cC5jbGFzc2VkKFwiaG92ZXJlZFwiLCB0cnVlKTtcbiAgICAgIHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmFsc2UpO1xuICAgICAgaGVhdE1hcC51cGRhdGVCYWNrZ3JvdW5kKGJvdW5kYXJ5W25vZGVJZF0sIHN0YXRlLmRpc2NyZXRpemUpO1xuICAgIH0pXG4gICAgLm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGVjdGVkTm9kZUlkID0gbnVsbDtcbiAgICAgIGRpdi5jbGFzc2VkKFwiaG92ZXJlZFwiLCBmYWxzZSk7XG4gICAgICBub2RlR3JvdXAuY2xhc3NlZChcImhvdmVyZWRcIiwgZmFsc2UpO1xuICAgICAgdXBkYXRlRGVjaXNpb25Cb3VuZGFyeShuZXR3b3JrLCBmYWxzZSk7XG4gICAgICBoZWF0TWFwLnVwZGF0ZUJhY2tncm91bmQoYm91bmRhcnlbbm4uZ2V0T3V0cHV0Tm9kZShuZXR3b3JrKS5pZF0sXG4gICAgICAgICAgc3RhdGUuZGlzY3JldGl6ZSk7XG4gICAgfSk7XG4gIGlmIChpc0lucHV0KSB7XG4gICAgZGl2Lm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBzdGF0ZVtub2RlSWRdID0gIXN0YXRlW25vZGVJZF07XG4gICAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG4gICAgICByZXNldCgpO1xuICAgIH0pO1xuICAgIGRpdi5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIik7XG4gIH1cbiAgaWYgKGlzSW5wdXQpIHtcbiAgICBkaXYuY2xhc3NlZChhY3RpdmVPck5vdENsYXNzLCB0cnVlKTtcbiAgfVxuICBsZXQgbm9kZUhlYXRNYXAgPSBuZXcgSGVhdE1hcChSRUNUX1NJWkUsIERFTlNJVFkgLyAxMCwgeERvbWFpbixcbiAgICAgIHhEb21haW4sIGRpdiwge25vU3ZnOiB0cnVlfSk7XG4gIGRpdi5kYXR1bSh7aGVhdG1hcDogbm9kZUhlYXRNYXAsIGlkOiBub2RlSWR9KTtcblxufVxuXG4vLyBEcmF3IG5ldHdvcmtcbmZ1bmN0aW9uIGRyYXdOZXR3b3JrKG5ldHdvcms6IG5uLk5vZGVbXVtdKTogdm9pZCB7XG4gIGxldCBzdmcgPSBkMy5zZWxlY3QoXCIjc3ZnXCIpO1xuICAvLyBSZW1vdmUgYWxsIHN2ZyBlbGVtZW50cy5cbiAgc3ZnLnNlbGVjdChcImcuY29yZVwiKS5yZW1vdmUoKTtcbiAgLy8gUmVtb3ZlIGFsbCBkaXYgZWxlbWVudHMuXG4gIGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLnNlbGVjdEFsbChcImRpdi5jYW52YXNcIikucmVtb3ZlKCk7XG4gIGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLnNlbGVjdEFsbChcImRpdi5wbHVzLW1pbnVzLW5ldXJvbnNcIikucmVtb3ZlKCk7XG5cbiAgLy8gR2V0IHRoZSB3aWR0aCBvZiB0aGUgc3ZnIGNvbnRhaW5lci5cbiAgbGV0IHBhZGRpbmcgPSAzO1xuICBsZXQgY28gPSBkMy5zZWxlY3QoXCIuY29sdW1uLm91dHB1dFwiKS5ub2RlKCkgYXMgSFRNTERpdkVsZW1lbnQ7XG4gIGxldCBjZiA9IGQzLnNlbGVjdChcIi5jb2x1bW4uZmVhdHVyZXNcIikubm9kZSgpIGFzIEhUTUxEaXZFbGVtZW50O1xuICBsZXQgd2lkdGggPSBjby5vZmZzZXRMZWZ0IC0gY2Yub2Zmc2V0TGVmdDtcbiAgc3ZnLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XG5cbiAgLy8gTWFwIG9mIGFsbCBub2RlIGNvb3JkaW5hdGVzLlxuICBsZXQgbm9kZTJjb29yZDoge1tpZDogc3RyaW5nXToge2N4OiBudW1iZXIsIGN5OiBudW1iZXJ9fSA9IHt9O1xuICBsZXQgY29udGFpbmVyID0gc3ZnLmFwcGVuZChcImdcIilcbiAgICAuY2xhc3NlZChcImNvcmVcIiwgdHJ1ZSlcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7cGFkZGluZ30sJHtwYWRkaW5nfSlgKTtcbiAgLy8gRHJhdyB0aGUgbmV0d29yayBsYXllciBieSBsYXllci5cbiAgbGV0IG51bUxheWVycyA9IG5ldHdvcmsubGVuZ3RoO1xuICBsZXQgZmVhdHVyZVdpZHRoID0gMTE4O1xuICBsZXQgbGF5ZXJTY2FsZSA9IGQzLnNjYWxlLm9yZGluYWw8bnVtYmVyLCBudW1iZXI+KClcbiAgICAgIC5kb21haW4oZDMucmFuZ2UoMSwgbnVtTGF5ZXJzIC0gMSkpXG4gICAgICAucmFuZ2VQb2ludHMoW2ZlYXR1cmVXaWR0aCwgd2lkdGggLSBSRUNUX1NJWkVdLCAwLjcpO1xuICBsZXQgbm9kZUluZGV4U2NhbGUgPSAobm9kZUluZGV4OiBudW1iZXIpID0+IG5vZGVJbmRleCAqIChSRUNUX1NJWkUgKyAyNSk7XG5cblxuICBsZXQgY2FsbG91dFRodW1iID0gZDMuc2VsZWN0KFwiLmNhbGxvdXQudGh1bWJuYWlsXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gIGxldCBjYWxsb3V0V2VpZ2h0cyA9IGQzLnNlbGVjdChcIi5jYWxsb3V0LndlaWdodHNcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgbGV0IGlkV2l0aENhbGxvdXQgPSBudWxsO1xuICBsZXQgdGFyZ2V0SWRXaXRoQ2FsbG91dCA9IG51bGw7XG5cbiAgLy8gRHJhdyB0aGUgaW5wdXQgbGF5ZXIgc2VwYXJhdGVseS5cbiAgbGV0IGN4ID0gUkVDVF9TSVpFIC8gMiArIDUwO1xuICBsZXQgbm9kZUlkcyA9IE9iamVjdC5rZXlzKElOUFVUUyk7XG4gIGxldCBtYXhZID0gbm9kZUluZGV4U2NhbGUobm9kZUlkcy5sZW5ndGgpO1xuICBub2RlSWRzLmZvckVhY2goKG5vZGVJZCwgaSkgPT4ge1xuICAgIGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKGkpICsgUkVDVF9TSVpFIC8gMjtcbiAgICBub2RlMmNvb3JkW25vZGVJZF0gPSB7Y3gsIGN5fTtcbiAgICBkcmF3Tm9kZShjeCwgY3ksIG5vZGVJZCwgdHJ1ZSwgY29udGFpbmVyKTtcbiAgfSk7XG5cbiAgLy8gRHJhdyB0aGUgaW50ZXJtZWRpYXRlIGxheWVycy5cbiAgZm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG51bUxheWVycyAtIDE7IGxheWVySWR4KyspIHtcbiAgICBsZXQgbnVtTm9kZXMgPSBuZXR3b3JrW2xheWVySWR4XS5sZW5ndGg7XG4gICAgbGV0IGN4ID0gbGF5ZXJTY2FsZShsYXllcklkeCkgKyBSRUNUX1NJWkUgLyAyO1xuICAgIG1heFkgPSBNYXRoLm1heChtYXhZLCBub2RlSW5kZXhTY2FsZShudW1Ob2RlcykpO1xuICAgIGFkZFBsdXNNaW51c0NvbnRyb2wobGF5ZXJTY2FsZShsYXllcklkeCksIGxheWVySWR4KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU5vZGVzOyBpKyspIHtcbiAgICAgIGxldCBub2RlID0gbmV0d29ya1tsYXllcklkeF1baV07XG4gICAgICBsZXQgY3kgPSBub2RlSW5kZXhTY2FsZShpKSArIFJFQ1RfU0laRSAvIDI7XG4gICAgICBub2RlMmNvb3JkW25vZGUuaWRdID0ge2N4LCBjeX07XG4gICAgICBkcmF3Tm9kZShjeCwgY3ksIG5vZGUuaWQsIGZhbHNlLCBjb250YWluZXIsIG5vZGUpO1xuXG4gICAgICAvLyBTaG93IGNhbGxvdXQgdG8gdGh1bWJuYWlscy5cbiAgICAgIGxldCBudW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHhdLmxlbmd0aDtcbiAgICAgIGxldCBuZXh0TnVtTm9kZXMgPSBuZXR3b3JrW2xheWVySWR4ICsgMV0ubGVuZ3RoO1xuICAgICAgaWYgKGlkV2l0aENhbGxvdXQgPT0gbnVsbCAmJlxuICAgICAgICAgIGkgPT09IG51bU5vZGVzIC0gMSAmJlxuICAgICAgICAgIG5leHROdW1Ob2RlcyA8PSBudW1Ob2Rlcykge1xuICAgICAgICBjYWxsb3V0VGh1bWIuc3R5bGUoe1xuICAgICAgICAgIGRpc3BsYXk6IG51bGwsXG4gICAgICAgICAgdG9wOiBgJHsyMCArIDMgKyBjeX1weGAsXG4gICAgICAgICAgbGVmdDogYCR7Y3h9cHhgXG4gICAgICAgIH0pO1xuICAgICAgICBpZFdpdGhDYWxsb3V0ID0gbm9kZS5pZDtcbiAgICAgIH1cblxuICAgICAgLy8gRHJhdyBsaW5rcy5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2pdO1xuICAgICAgICBsZXQgcGF0aDogU1ZHUGF0aEVsZW1lbnQgPSBkcmF3TGluayhsaW5rLCBub2RlMmNvb3JkLCBuZXR3b3JrLFxuICAgICAgICAgICAgY29udGFpbmVyLCBqID09PSAwLCBqLCBub2RlLmlucHV0TGlua3MubGVuZ3RoKS5ub2RlKCkgYXMgYW55O1xuICAgICAgICAvLyBTaG93IGNhbGxvdXQgdG8gd2VpZ2h0cy5cbiAgICAgICAgbGV0IHByZXZMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHggLSAxXTtcbiAgICAgICAgbGV0IGxhc3ROb2RlUHJldkxheWVyID0gcHJldkxheWVyW3ByZXZMYXllci5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKHRhcmdldElkV2l0aENhbGxvdXQgPT0gbnVsbCAmJlxuICAgICAgICAgICAgaSA9PT0gbnVtTm9kZXMgLSAxICYmXG4gICAgICAgICAgICBsaW5rLnNvdXJjZS5pZCA9PT0gbGFzdE5vZGVQcmV2TGF5ZXIuaWQgJiZcbiAgICAgICAgICAgIChsaW5rLnNvdXJjZS5pZCAhPT0gaWRXaXRoQ2FsbG91dCB8fCBudW1MYXllcnMgPD0gNSkgJiZcbiAgICAgICAgICAgIGxpbmsuZGVzdC5pZCAhPT0gaWRXaXRoQ2FsbG91dCAmJlxuICAgICAgICAgICAgcHJldkxheWVyLmxlbmd0aCA+PSBudW1Ob2Rlcykge1xuICAgICAgICAgIGxldCBtaWRQb2ludCA9IHBhdGguZ2V0UG9pbnRBdExlbmd0aChwYXRoLmdldFRvdGFsTGVuZ3RoKCkgKiAwLjcpO1xuICAgICAgICAgIGNhbGxvdXRXZWlnaHRzLnN0eWxlKHtcbiAgICAgICAgICAgIGRpc3BsYXk6IG51bGwsXG4gICAgICAgICAgICB0b3A6IGAke21pZFBvaW50LnkgKyA1fXB4YCxcbiAgICAgICAgICAgIGxlZnQ6IGAke21pZFBvaW50LnggKyAzfXB4YFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRhcmdldElkV2l0aENhbGxvdXQgPSBsaW5rLmRlc3QuaWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBEcmF3IHRoZSBvdXRwdXQgbm9kZSBzZXBhcmF0ZWx5LlxuICBjeCA9IHdpZHRoICsgUkVDVF9TSVpFIC8gMjtcbiAgbGV0IG5vZGUgPSBuZXR3b3JrW251bUxheWVycyAtIDFdWzBdO1xuICBsZXQgY3kgPSBub2RlSW5kZXhTY2FsZSgwKSArIFJFQ1RfU0laRSAvIDI7XG4gIG5vZGUyY29vcmRbbm9kZS5pZF0gPSB7Y3gsIGN5fTtcbiAgLy8gRHJhdyBsaW5rcy5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmlucHV0TGlua3MubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tpXTtcbiAgICBkcmF3TGluayhsaW5rLCBub2RlMmNvb3JkLCBuZXR3b3JrLCBjb250YWluZXIsIGkgPT09IDAsIGksXG4gICAgICAgIG5vZGUuaW5wdXRMaW5rcy5sZW5ndGgpO1xuICB9XG4gIC8vIEFkanVzdCB0aGUgaGVpZ2h0IG9mIHRoZSBzdmcuXG4gIHN2Zy5hdHRyKFwiaGVpZ2h0XCIsIG1heFkpO1xuXG4gIC8vIEFkanVzdCB0aGUgaGVpZ2h0IG9mIHRoZSBmZWF0dXJlcyBjb2x1bW4uXG4gIGxldCBoZWlnaHQgPSBNYXRoLm1heChcbiAgICBnZXRSZWxhdGl2ZUhlaWdodChjYWxsb3V0VGh1bWIpLFxuICAgIGdldFJlbGF0aXZlSGVpZ2h0KGNhbGxvdXRXZWlnaHRzKSxcbiAgICBnZXRSZWxhdGl2ZUhlaWdodChkMy5zZWxlY3QoXCIjbmV0d29ya1wiKSlcbiAgKTtcbiAgZDMuc2VsZWN0KFwiLmNvbHVtbi5mZWF0dXJlc1wiKS5zdHlsZShcImhlaWdodFwiLCBoZWlnaHQgKyBcInB4XCIpO1xufVxuXG5mdW5jdGlvbiBnZXRSZWxhdGl2ZUhlaWdodChzZWxlY3Rpb246IGQzLlNlbGVjdGlvbjxhbnk+KSB7XG4gIGxldCBub2RlID0gc2VsZWN0aW9uLm5vZGUoKSBhcyBIVE1MQW5jaG9yRWxlbWVudDtcbiAgcmV0dXJuIG5vZGUub2Zmc2V0SGVpZ2h0ICsgbm9kZS5vZmZzZXRUb3A7XG59XG5cbmZ1bmN0aW9uIGFkZFBsdXNNaW51c0NvbnRyb2woeDogbnVtYmVyLCBsYXllcklkeDogbnVtYmVyKSB7XG4gIGxldCBkaXYgPSBkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5hcHBlbmQoXCJkaXZcIilcbiAgICAuY2xhc3NlZChcInBsdXMtbWludXMtbmV1cm9uc1wiLCB0cnVlKVxuICAgIC5zdHlsZShcImxlZnRcIiwgYCR7eCAtIDEwfXB4YCk7XG5cbiAgbGV0IGkgPSBsYXllcklkeCAtIDE7XG4gIGxldCBmaXJzdFJvdyA9IGRpdi5hcHBlbmQoXCJkaXZcIikuYXR0cihcImNsYXNzXCIsIGB1aS1udW1Ob2RlcyR7bGF5ZXJJZHh9YCk7XG4gIGZpcnN0Um93LmFwcGVuZChcImJ1dHRvblwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1kbC1idXR0b24gbWRsLWpzLWJ1dHRvbiBtZGwtYnV0dG9uLS1pY29uXCIpXG4gICAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGxldCBudW1OZXVyb25zID0gc3RhdGUubmV0d29ya1NoYXBlW2ldO1xuICAgICAgICBpZiAobnVtTmV1cm9ucyA+PSA4KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlLm5ldHdvcmtTaGFwZVtpXSsrO1xuICAgICAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHJlc2V0KCk7XG4gICAgICB9KVxuICAgIC5hcHBlbmQoXCJpXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwibWF0ZXJpYWwtaWNvbnNcIilcbiAgICAgIC50ZXh0KFwiYWRkXCIpO1xuXG4gIGZpcnN0Um93LmFwcGVuZChcImJ1dHRvblwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1kbC1idXR0b24gbWRsLWpzLWJ1dHRvbiBtZGwtYnV0dG9uLS1pY29uXCIpXG4gICAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGxldCBudW1OZXVyb25zID0gc3RhdGUubmV0d29ya1NoYXBlW2ldO1xuICAgICAgICBpZiAobnVtTmV1cm9ucyA8PSAxKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlLm5ldHdvcmtTaGFwZVtpXS0tO1xuICAgICAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHJlc2V0KCk7XG4gICAgICB9KVxuICAgIC5hcHBlbmQoXCJpXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwibWF0ZXJpYWwtaWNvbnNcIilcbiAgICAgIC50ZXh0KFwicmVtb3ZlXCIpO1xuXG4gIGxldCBzdWZmaXggPSBzdGF0ZS5uZXR3b3JrU2hhcGVbaV0gPiAxID8gXCJzXCIgOiBcIlwiO1xuICBkaXYuYXBwZW5kKFwiZGl2XCIpLnRleHQoXG4gICAgc3RhdGUubmV0d29ya1NoYXBlW2ldICsgXCIgbmV1cm9uXCIgKyBzdWZmaXhcbiAgKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSG92ZXJDYXJkKHR5cGU6IEhvdmVyVHlwZSwgbm9kZU9yTGluaz86IG5uLk5vZGUgfCBubi5MaW5rLFxuICAgIGNvb3JkaW5hdGVzPzogW251bWJlciwgbnVtYmVyXSkge1xuICBsZXQgaG92ZXJjYXJkID0gZDMuc2VsZWN0KFwiI2hvdmVyY2FyZFwiKTtcbiAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgIGhvdmVyY2FyZC5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgIGQzLnNlbGVjdChcIiNzdmdcIikub24oXCJjbGlja1wiLCBudWxsKTtcbiAgICByZXR1cm47XG4gIH1cbiAgZDMuc2VsZWN0KFwiI3N2Z1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICBob3ZlcmNhcmQuc2VsZWN0KFwiLnZhbHVlXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgbGV0IGlucHV0ID0gaG92ZXJjYXJkLnNlbGVjdChcImlucHV0XCIpO1xuICAgIGlucHV0LnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKTtcbiAgICBpbnB1dC5vbihcImlucHV0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudmFsdWUgIT0gbnVsbCAmJiB0aGlzLnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICAgIGlmICh0eXBlID09PSBIb3ZlclR5cGUuV0VJR0hUKSB7XG4gICAgICAgICAgKG5vZGVPckxpbmsgYXMgbm4uTGluaykud2VpZ2h0ID0gK3RoaXMudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgKG5vZGVPckxpbmsgYXMgbm4uTm9kZSkuYmlhcyA9ICt0aGlzLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZVVJKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaW5wdXQub24oXCJrZXlwcmVzc1wiLCAoKSA9PiB7XG4gICAgICBpZiAoKGQzLmV2ZW50IGFzIGFueSkua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgdXBkYXRlSG92ZXJDYXJkKHR5cGUsIG5vZGVPckxpbmssIGNvb3JkaW5hdGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAoaW5wdXQubm9kZSgpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZvY3VzKCk7XG4gIH0pO1xuICBsZXQgdmFsdWUgPSAodHlwZSA9PT0gSG92ZXJUeXBlLldFSUdIVCkgP1xuICAgIChub2RlT3JMaW5rIGFzIG5uLkxpbmspLndlaWdodCA6XG4gICAgKG5vZGVPckxpbmsgYXMgbm4uTm9kZSkuYmlhcztcbiAgbGV0IG5hbWUgPSAodHlwZSA9PT0gSG92ZXJUeXBlLldFSUdIVCkgPyBcIldlaWdodFwiIDogXCJCaWFzXCI7XG4gIGhvdmVyY2FyZC5zdHlsZSh7XG4gICAgXCJsZWZ0XCI6IGAke2Nvb3JkaW5hdGVzWzBdICsgMjB9cHhgLFxuICAgIFwidG9wXCI6IGAke2Nvb3JkaW5hdGVzWzFdfXB4YCxcbiAgICBcImRpc3BsYXlcIjogXCJibG9ja1wiXG4gIH0pO1xuICBob3ZlcmNhcmQuc2VsZWN0KFwiLnR5cGVcIikudGV4dChuYW1lKTtcbiAgaG92ZXJjYXJkLnNlbGVjdChcIi52YWx1ZVwiKVxuICAgIC5zdHlsZShcImRpc3BsYXlcIiwgbnVsbClcbiAgICAudGV4dCh2YWx1ZS50b1ByZWNpc2lvbigyKSk7XG4gIGhvdmVyY2FyZC5zZWxlY3QoXCJpbnB1dFwiKVxuICAgIC5wcm9wZXJ0eShcInZhbHVlXCIsIHZhbHVlLnRvUHJlY2lzaW9uKDIpKVxuICAgIC5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xufVxuXG5mdW5jdGlvbiBkcmF3TGluayhcbiAgICBpbnB1dDogbm4uTGluaywgbm9kZTJjb29yZDoge1tpZDogc3RyaW5nXToge2N4OiBudW1iZXIsIGN5OiBudW1iZXJ9fSxcbiAgICBuZXR3b3JrOiBubi5Ob2RlW11bXSwgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55PixcbiAgICBpc0ZpcnN0OiBib29sZWFuLCBpbmRleDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcikge1xuICBsZXQgbGluZSA9IGNvbnRhaW5lci5pbnNlcnQoXCJwYXRoXCIsIFwiOmZpcnN0LWNoaWxkXCIpO1xuICBsZXQgc291cmNlID0gbm9kZTJjb29yZFtpbnB1dC5zb3VyY2UuaWRdO1xuICBsZXQgZGVzdCA9IG5vZGUyY29vcmRbaW5wdXQuZGVzdC5pZF07XG4gIGxldCBkYXR1bSA9IHtcbiAgICBzb3VyY2U6IHtcbiAgICAgIHk6IHNvdXJjZS5jeCArIFJFQ1RfU0laRSAvIDIgKyAyLFxuICAgICAgeDogc291cmNlLmN5XG4gICAgfSxcbiAgICB0YXJnZXQ6IHtcbiAgICAgIHk6IGRlc3QuY3ggLSBSRUNUX1NJWkUgLyAyLFxuICAgICAgeDogZGVzdC5jeSArICgoaW5kZXggLSAobGVuZ3RoIC0gMSkgLyAyKSAvIGxlbmd0aCkgKiAxMlxuICAgIH1cbiAgfTtcbiAgbGV0IGRpYWdvbmFsID0gZDMuc3ZnLmRpYWdvbmFsKCkucHJvamVjdGlvbihkID0+IFtkLnksIGQueF0pO1xuICBsaW5lLmF0dHIoe1xuICAgIFwibWFya2VyLXN0YXJ0XCI6IFwidXJsKCNtYXJrZXJBcnJvdylcIixcbiAgICBjbGFzczogXCJsaW5rXCIsXG4gICAgaWQ6IFwibGlua1wiICsgaW5wdXQuc291cmNlLmlkICsgXCItXCIgKyBpbnB1dC5kZXN0LmlkLFxuICAgIGQ6IGRpYWdvbmFsKGRhdHVtLCAwKVxuICB9KTtcblxuICAvLyBBZGQgYW4gaW52aXNpYmxlIHRoaWNrIGxpbmsgdGhhdCB3aWxsIGJlIHVzZWQgZm9yXG4gIC8vIHNob3dpbmcgdGhlIHdlaWdodCB2YWx1ZSBvbiBob3Zlci5cbiAgY29udGFpbmVyLmFwcGVuZChcInBhdGhcIilcbiAgICAuYXR0cihcImRcIiwgZGlhZ29uYWwoZGF0dW0sIDApKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5rLWhvdmVyXCIpXG4gICAgLm9uKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHVwZGF0ZUhvdmVyQ2FyZChIb3ZlclR5cGUuV0VJR0hULCBpbnB1dCwgZDMubW91c2UodGhpcykpO1xuICAgIH0pLm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHVwZGF0ZUhvdmVyQ2FyZChudWxsKTtcbiAgICB9KTtcbiAgcmV0dXJuIGxpbmU7XG59XG5cblxuXG4vKipcbiAqIEdpdmVuIGEgbmV1cmFsIG5ldHdvcmssIGl0IGFza3MgdGhlIG5ldHdvcmsgZm9yIHRoZSBvdXRwdXQgKHByZWRpY3Rpb24pXG4gKiBvZiBldmVyeSBub2RlIGluIHRoZSBuZXR3b3JrIHVzaW5nIGlucHV0cyBzYW1wbGVkIG9uIGEgc3F1YXJlIGdyaWQuXG4gKiBJdCByZXR1cm5zIGEgbWFwIHdoZXJlIGVhY2gga2V5IGlzIHRoZSBub2RlIElEIGFuZCB0aGUgdmFsdWUgaXMgYSBzcXVhcmVcbiAqIG1hdHJpeCBvZiB0aGUgb3V0cHV0cyBvZiB0aGUgbmV0d29yayBmb3IgZWFjaCBpbnB1dCBpbiB0aGUgZ3JpZCByZXNwZWN0aXZlbHkuXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yazogbm4uTm9kZVtdW10sIGZpcnN0VGltZTogYm9vbGVhbikge1xuICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgYm91bmRhcnkgPSB7fTtcbiAgICBubi5mb3JFYWNoTm9kZShuZXR3b3JrLCB0cnVlLCBub2RlID0+IHtcbiAgICAgIGJvdW5kYXJ5W25vZGUuaWRdID0gbmV3IEFycmF5KERFTlNJVFkpO1xuICAgIH0pO1xuICAgIC8vIEdvIHRocm91Z2ggYWxsIHByZWRlZmluZWQgaW5wdXRzLlxuICAgIGZvciAobGV0IG5vZGVJZCBpbiBJTlBVVFMpIHtcbiAgICAgIGJvdW5kYXJ5W25vZGVJZF0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XG4gICAgfVxuICB9XG4gIGxldCB4U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIERFTlNJVFkgLSAxXSkucmFuZ2UoeERvbWFpbik7XG4gIGxldCB5U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW0RFTlNJVFkgLSAxLCAwXSkucmFuZ2UoeERvbWFpbik7XG5cbiAgbGV0IGkgPSAwLCBqID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IERFTlNJVFk7IGkrKykge1xuICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgIG5uLmZvckVhY2hOb2RlKG5ldHdvcmssIHRydWUsIG5vZGUgPT4ge1xuICAgICAgICBib3VuZGFyeVtub2RlLmlkXVtpXSA9IG5ldyBBcnJheShERU5TSVRZKTtcbiAgICAgIH0pO1xuICAgICAgLy8gR28gdGhyb3VnaCBhbGwgcHJlZGVmaW5lZCBpbnB1dHMuXG4gICAgICBmb3IgKGxldCBub2RlSWQgaW4gSU5QVVRTKSB7XG4gICAgICAgIGJvdW5kYXJ5W25vZGVJZF1baV0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoaiA9IDA7IGogPCBERU5TSVRZOyBqKyspIHtcbiAgICAgIC8vIDEgZm9yIHBvaW50cyBpbnNpZGUgdGhlIGNpcmNsZSwgYW5kIDAgZm9yIHBvaW50cyBvdXRzaWRlIHRoZSBjaXJjbGUuXG4gICAgICBsZXQgeCA9IHhTY2FsZShpKTtcbiAgICAgIGxldCB5ID0geVNjYWxlKGopO1xuICAgICAgbGV0IGlucHV0ID0gY29uc3RydWN0SW5wdXQoeCwgeSk7XG4gICAgICBubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XG4gICAgICBubi5mb3JFYWNoTm9kZShuZXR3b3JrLCB0cnVlLCBub2RlID0+IHtcbiAgICAgICAgYm91bmRhcnlbbm9kZS5pZF1baV1bal0gPSBub2RlLm91dHB1dDtcbiAgICAgIH0pO1xuICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICAvLyBHbyB0aHJvdWdoIGFsbCBwcmVkZWZpbmVkIGlucHV0cy5cbiAgICAgICAgZm9yIChsZXQgbm9kZUlkIGluIElOUFVUUykge1xuICAgICAgICAgIGJvdW5kYXJ5W25vZGVJZF1baV1bal0gPSBJTlBVVFNbbm9kZUlkXS5mKHgsIHkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldExlYXJuaW5nUmF0ZSggbmV0d29yazogbm4uTm9kZVtdW10pOiBudW1iZXIge1xuICBsZXQgdHJ1ZUxlYXJuaW5nUmF0ZSA9IDA7XG5cbiAgZm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG4gICAgbGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuICAgIC8vIFVwZGF0ZSBhbGwgdGhlIG5vZGVzIGluIHRoaXMgbGF5ZXIuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuICAgICAgdHJ1ZUxlYXJuaW5nUmF0ZSArPSBub2RlLnRydWVMZWFybmluZ1JhdGU7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlTGVhcm5pbmdSYXRlOyAgXG59XG5cbmZ1bmN0aW9uIGdldFRvdGFsQ2FwYWNpdHkgKG5ldHdvcms6IG5uLk5vZGVbXVtdKTogbnVtYmVyIHtcbiAgbGV0IHRvdGFsQ2FwYWNpdHkgPSAxO1xuICBmb3IgKGxldCBsYXllcklkeCA9IDA7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcbiAgICAgIGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcbiAgICAgIGlmIChjdXJyZW50TGF5ZXIubGVuZ3RoID4gMSkge1xuXHQgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcblx0XHQgIHRvdGFsQ2FwYWNpdHkrKztcblx0ICAgICAgbGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XG5cdCAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG5cdFx0ICAgICAgdG90YWxDYXBhY2l0eSsrO1xuXHQgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIFxuICByZXR1cm4gdG90YWxDYXBhY2l0eTtcbn1cblxuZnVuY3Rpb24gZ2V0TG9zcyhuZXR3b3JrOiBubi5Ob2RlW11bXSwgZGF0YVBvaW50czogRXhhbXBsZTJEW10pOiBudW1iZXIge1xuICBsZXQgbG9zcyA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBkYXRhUG9pbnQgPSBkYXRhUG9pbnRzW2ldO1xuICAgIGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KGRhdGFQb2ludC54LCBkYXRhUG9pbnQueSk7XG4gICAgbGV0IG91dHB1dCA9IG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcbiAgICBsb3NzICs9IG5uLkVycm9ycy5TUVVBUkUuZXJyb3Iob3V0cHV0LCBkYXRhUG9pbnQubGFiZWwpO1xuICB9XG4gIHJldHVybiBsb3NzIC8gZGF0YVBvaW50cy5sZW5ndGggKiAxMDA7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVVJKGZpcnN0U3RlcCA9IGZhbHNlKSB7XG4gIC8vIFVwZGF0ZSB0aGUgbGlua3MgdmlzdWFsbHkuXG4gIHVwZGF0ZVdlaWdodHNVSShuZXR3b3JrLCBkMy5zZWxlY3QoXCJnLmNvcmVcIikpO1xuICAvLyBVcGRhdGUgdGhlIGJpYXMgdmFsdWVzIHZpc3VhbGx5LlxuICB1cGRhdGVCaWFzZXNVSShuZXR3b3JrKTtcbiAgLy8gR2V0IHRoZSBkZWNpc2lvbiBib3VuZGFyeSBvZiB0aGUgbmV0d29yay5cbiAgdXBkYXRlRGVjaXNpb25Cb3VuZGFyeShuZXR3b3JrLCBmaXJzdFN0ZXApO1xuICBsZXQgc2VsZWN0ZWRJZCA9IHNlbGVjdGVkTm9kZUlkICE9IG51bGwgP1xuICAgICAgc2VsZWN0ZWROb2RlSWQgOiBubi5nZXRPdXRwdXROb2RlKG5ldHdvcmspLmlkO1xuICBoZWF0TWFwLnVwZGF0ZUJhY2tncm91bmQoYm91bmRhcnlbc2VsZWN0ZWRJZF0sIHN0YXRlLmRpc2NyZXRpemUpO1xuXG4gIC8vIFVwZGF0ZSBhbGwgZGVjaXNpb24gYm91bmRhcmllcy5cbiAgZDMuc2VsZWN0KFwiI25ldHdvcmtcIikuc2VsZWN0QWxsKFwiZGl2LmNhbnZhc1wiKVxuICAgICAgLmVhY2goZnVuY3Rpb24oZGF0YToge2hlYXRtYXA6IEhlYXRNYXAsIGlkOiBzdHJpbmd9KSB7XG4gICAgZGF0YS5oZWF0bWFwLnVwZGF0ZUJhY2tncm91bmQocmVkdWNlTWF0cml4KGJvdW5kYXJ5W2RhdGEuaWRdLCAxMCksXG4gICAgICAgIHN0YXRlLmRpc2NyZXRpemUpO1xuICB9KTtcblxuICBmdW5jdGlvbiB6ZXJvUGFkKG46IG51bWJlcik6IHN0cmluZyB7XG4gICAgbGV0IHBhZCA9IFwiMDAwMDAwXCI7XG4gICAgcmV0dXJuIChwYWQgKyBuKS5zbGljZSgtcGFkLmxlbmd0aCk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRDb21tYXMoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIixcIik7XG4gIH1cblxuICBmdW5jdGlvbiBodW1hblJlYWRhYmxlKG46IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIG4udG9GaXhlZCg0KTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gaHVtYW5SZWFkYWJsZUludChuOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBuLnRvRml4ZWQoMCk7XG4gIH1cblxuICBmdW5jdGlvbiBzaWduYWxPZihuOiBudW1iZXIpOiBudW1iZXIge1xuXHQgIHJldHVybiBNYXRoLmxvZygxK01hdGguYWJzKG4pKTtcbiAgfVxuXG4gIC8vIFVwZGF0ZSB0cnVlIGxlYXJuaW5nIHJhdGUgbG9zcyBhbmQgaXRlcmF0aW9uIG51bWJlci5cbiAgLy8gVGhlc2UgYXJlIGFsbCBiaXQgcmF0ZXMsIGhlbmNlIHRoZXkgYXJlIGNoYW5uZWwgc2lnbmFsc1xuICAvLyBBbGZyZWRvLiBOb3cgaW4gYml0cyFcbiAgbGV0IGxvZzIgPSAxLjAvTWF0aC5sb2coMi4wKTtcblxuICBsZXQgYml0TG9zc1Rlc3QgPSBsb3NzVGVzdDtcbiAgbGV0IGJpdExvc3NUcmFpbiA9IGxvc3NUcmFpbjtcbiAgbGV0IGJpdFRydWVMZWFybmluZ1JhdGUgPSBzaWduYWxPZih0cnVlTGVhcm5pbmdSYXRlKSpsb2cyO1xuICBcblxuICBkMy5zZWxlY3QoXCIjbG9zcy10cmFpblwiKS50ZXh0KGh1bWFuUmVhZGFibGUoYml0TG9zc1RyYWluKSk7XG4gIGQzLnNlbGVjdChcIiNsb3NzLXRlc3RcIikudGV4dChodW1hblJlYWRhYmxlKGJpdExvc3NUZXN0KSk7XG4gIGQzLnNlbGVjdChcIiN0cnVlTGVhcm5pbmdSYXRlXCIpLnRleHQoaHVtYW5SZWFkYWJsZShiaXRUcnVlTGVhcm5pbmdSYXRlKSk7XG4gIGQzLnNlbGVjdChcIiNpdGVyLW51bWJlclwiKS50ZXh0KGFkZENvbW1hcyh6ZXJvUGFkKGl0ZXIpKSk7XG4gIGQzLnNlbGVjdChcIiN0b3RhbC1jYXBhY2l0eVwiKS50ZXh0KGh1bWFuUmVhZGFibGVJbnQodG90YWxDYXBhY2l0eSkpO1xuICBsaW5lQ2hhcnQuYWRkRGF0YVBvaW50KFtsb3NzVHJhaW4sIGxvc3NUZXN0XSk7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdElucHV0SWRzKCk6IHN0cmluZ1tdIHtcbiAgbGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChsZXQgaW5wdXROYW1lIGluIElOUFVUUykge1xuICAgIGlmIChzdGF0ZVtpbnB1dE5hbWVdKSB7XG4gICAgICByZXN1bHQucHVzaChpbnB1dE5hbWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RJbnB1dCh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlcltdIHtcbiAgbGV0IGlucHV0OiBudW1iZXJbXSA9IFtdO1xuICBmb3IgKGxldCBpbnB1dE5hbWUgaW4gSU5QVVRTKSB7XG4gICAgaWYgKHN0YXRlW2lucHV0TmFtZV0pIHtcbiAgICAgIGlucHV0LnB1c2goSU5QVVRTW2lucHV0TmFtZV0uZih4LCB5KSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gb25lU3RlcCgpOiB2b2lkIHtcbiAgaXRlcisrO1xuICB0cmFpbkRhdGEuZm9yRWFjaCgocG9pbnQsIGkpID0+IHtcbiAgICBsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dChwb2ludC54LCBwb2ludC55KTtcbiAgICBubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XG4gICAgbm4uYmFja1Byb3AobmV0d29yaywgcG9pbnQubGFiZWwsIG5uLkVycm9ycy5TUVVBUkUpO1xuICAgIGlmICgoaSArIDEpICUgc3RhdGUuYmF0Y2hTaXplID09PSAwKSB7XG4gICAgICBubi51cGRhdGVXZWlnaHRzKG5ldHdvcmssIHN0YXRlLmxlYXJuaW5nUmF0ZSwgc3RhdGUucmVndWxhcml6YXRpb25SYXRlKTtcbiAgICB9XG4gIH0pO1xuICBcbiAgLy8gQ29tcHV0ZSB0aGUgbG9zcy5cbiAgdHJ1ZUxlYXJuaW5nUmF0ZSA9IGdldExlYXJuaW5nUmF0ZShuZXR3b3JrKTtcbiAgdG90YWxDYXBhY2l0eSA9IGdldFRvdGFsQ2FwYWNpdHkobmV0d29yayk7XG4gIFxuICAvL34gc3RhdGUubG9zc0NhcGFjaXR5ID0gcmVxQ2FwYWNpdHk7XG4gIC8vfiBpZiAoKHJlcUNhcGFjaXR5KSA+IHRvdGFsQ2FwYWNpdHkpIHN0YXRlLmxvc3NDYXBhY2l0eSA9IHRvdGFsQ2FwYWNpdHk7XG4gICBcbiAgbG9zc1RyYWluID0gZ2V0TG9zcyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuICBsb3NzVGVzdCA9IGdldExvc3MobmV0d29yaywgdGVzdERhdGEpO1xuICAvL34gbG9zc1RyYWluID0gcmVxQ2FwYWNpdHkgLSBzaWduYWxPZihnZXRMb3NzKG5ldHdvcmssIHRyYWluRGF0YSkpKmxvZzI7XG4gIFxuICBcbiAgdXBkYXRlVUkoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE91dHB1dFdlaWdodHMobmV0d29yazogbm4uTm9kZVtdW10pOiBudW1iZXJbXSB7XG4gIGxldCB3ZWlnaHRzOiBudW1iZXJbXSA9IFtdO1xuICBmb3IgKGxldCBsYXllcklkeCA9IDA7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGggLSAxOyBsYXllcklkeCsrKSB7XG4gICAgbGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5vdXRwdXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCBvdXRwdXQgPSBub2RlLm91dHB1dHNbal07XG4gICAgICAgIHdlaWdodHMucHVzaChvdXRwdXQud2VpZ2h0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHdlaWdodHM7XG59XG5cbmZ1bmN0aW9uIHJlc2V0KG9uU3RhcnR1cD1mYWxzZSkge1xuICBsaW5lQ2hhcnQucmVzZXQoKTtcbiAgc3RhdGUuc2VyaWFsaXplKCk7XG4gIGlmICghb25TdGFydHVwKSB7XG4gICAgdXNlckhhc0ludGVyYWN0ZWQoKTtcbiAgfVxuICBwbGF5ZXIucGF1c2UoKTtcblxuICBsZXQgc3VmZml4ID0gc3RhdGUubnVtSGlkZGVuTGF5ZXJzICE9PSAxID8gXCJzXCIgOiBcIlwiO1xuICBkMy5zZWxlY3QoXCIjbGF5ZXJzLWxhYmVsXCIpLnRleHQoXCJIaWRkZW4gbGF5ZXJcIiArIHN1ZmZpeCk7XG4gIGQzLnNlbGVjdChcIiNudW0tbGF5ZXJzXCIpLnRleHQoc3RhdGUubnVtSGlkZGVuTGF5ZXJzKTtcblxuICAvLyBNYWtlIGEgc2ltcGxlIG5ldHdvcmsuXG4gIGl0ZXIgPSAwO1xuICBsZXQgbnVtSW5wdXRzID0gY29uc3RydWN0SW5wdXQoMCAsIDApLmxlbmd0aDtcbiAgbGV0IHNoYXBlID0gW251bUlucHV0c10uY29uY2F0KHN0YXRlLm5ldHdvcmtTaGFwZSkuY29uY2F0KFsxXSk7XG4gIGxldCBvdXRwdXRBY3RpdmF0aW9uID0gKHN0YXRlLnByb2JsZW0gPT09IFByb2JsZW0uUkVHUkVTU0lPTikgP1xuICBubi5BY3RpdmF0aW9ucy5MSU5FQVIgOiBubi5BY3RpdmF0aW9ucy5UQU5IO1xuICBuZXR3b3JrID0gbm4uYnVpbGROZXR3b3JrKHNoYXBlLCBzdGF0ZS5hY3RpdmF0aW9uLCBvdXRwdXRBY3RpdmF0aW9uLFxuICAgIHN0YXRlLnJlZ3VsYXJpemF0aW9uLCBjb25zdHJ1Y3RJbnB1dElkcygpLCBzdGF0ZS5pbml0WmVybyk7XG4gICAgdHJ1ZUxlYXJuaW5nUmF0ZSA9IGdldExlYXJuaW5nUmF0ZShuZXR3b3JrKTtcbiAgdG90YWxDYXBhY2l0eSA9IGdldFRvdGFsQ2FwYWNpdHkobmV0d29yayk7XG4gIGxvc3NUZXN0ID0gZ2V0TG9zcyhuZXR3b3JrLCB0ZXN0RGF0YSk7XG4gIC8vfiBzdGF0ZS5sb3NzQ2FwYWNpdHkgPSByZXFDYXBhY2l0eTtcbiAgLy9+IGlmICgocmVxQ2FwYWNpdHkpID4gdG90YWxDYXBhY2l0eSkgc3RhdGUubG9zc0NhcGFjaXR5ID0gdG90YWxDYXBhY2l0eTtcbiAgLy9+IGxvc3NUcmFpbiA9IHN0YXRlLmxvc3NDYXBhY2l0eSAtIHNpZ25hbE9mKGdldExvc3MobmV0d29yaywgdHJhaW5EYXRhKSkqbG9nMjtcbiAgbG9zc1RyYWluID0gZ2V0TG9zcyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xuICBcbiAgZHJhd05ldHdvcmsobmV0d29yayk7XG4gIHVwZGF0ZVVJKHRydWUpO1xufTtcblxuZnVuY3Rpb24gaW5pdFR1dG9yaWFsKCkge1xuICBpZiAoc3RhdGUudHV0b3JpYWwgPT0gbnVsbCB8fCBzdGF0ZS50dXRvcmlhbCA9PT0gJycgfHwgc3RhdGUuaGlkZVRleHQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gUmVtb3ZlIGFsbCBvdGhlciB0ZXh0LlxuICBkMy5zZWxlY3RBbGwoXCJhcnRpY2xlIGRpdi5sLS1ib2R5XCIpLnJlbW92ZSgpO1xuICBsZXQgdHV0b3JpYWwgPSBkMy5zZWxlY3QoXCJhcnRpY2xlXCIpLmFwcGVuZChcImRpdlwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsLS1ib2R5XCIpO1xuICAvLyBJbnNlcnQgdHV0b3JpYWwgdGV4dC5cbiAgZDMuaHRtbChgdHV0b3JpYWxzLyR7c3RhdGUudHV0b3JpYWx9Lmh0bWxgLCAoZXJyLCBodG1sRnJhZ21lbnQpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICAgIHR1dG9yaWFsLm5vZGUoKS5hcHBlbmRDaGlsZChodG1sRnJhZ21lbnQpO1xuICAgIC8vIElmIHRoZSB0dXRvcmlhbCBoYXMgYSA8dGl0bGU+IHRhZywgc2V0IHRoZSBwYWdlIHRpdGxlIHRvIHRoYXQuXG4gICAgbGV0IHRpdGxlID0gdHV0b3JpYWwuc2VsZWN0KFwidGl0bGVcIik7XG4gICAgaWYgKHRpdGxlLnNpemUoKSkge1xuICAgICAgZDMuc2VsZWN0KFwiaGVhZGVyIGgxXCIpLnN0eWxlKHtcbiAgICAgICAgXCJtYXJnaW4tdG9wXCI6IFwiMjBweFwiLFxuICAgICAgICBcIm1hcmdpbi1ib3R0b21cIjogXCIyMHB4XCIsXG4gICAgICB9KVxuICAgICAgLnRleHQodGl0bGUudGV4dCgpKTtcbiAgICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGUudGV4dCgpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRyYXdEYXRhc2V0VGh1bWJuYWlscygpIHtcbiAgZnVuY3Rpb24gcmVuZGVyVGh1bWJuYWlsKGNhbnZhcywgZGF0YUdlbmVyYXRvcikge1xuICAgIGxldCB3ID0gMTAwO1xuICAgIGxldCBoID0gMTAwO1xuICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCB3KTtcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIGgpO1xuICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICBsZXQgZGF0YSA9IGRhdGFHZW5lcmF0b3IoMjAwLCA1MCk7IC8vIE5QT0lOVFMsIE5PSVNFXG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3JTY2FsZShkLmxhYmVsKTtcbiAgICAgIGNvbnRleHQuZmlsbFJlY3QodyAqIChkLnggKyA2KSAvIDEyLCBoICogKC1kLnkgKyA2KSAvIDEyLCA0LCA0KTtcbiAgICB9KTtcbiAgICBkMy5zZWxlY3QoY2FudmFzLnBhcmVudE5vZGUpLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKTtcbiAgfVxuICBkMy5zZWxlY3RBbGwoXCIuZGF0YXNldFwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXG4gIGlmIChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OKSB7XG4gICAgZm9yIChsZXQgZGF0YXNldCBpbiBkYXRhc2V0cykge1xuICAgICAgbGV0IGNhbnZhczogYW55ID1cbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBjYW52YXNbZGF0YS1kYXRhc2V0PSR7ZGF0YXNldH1dYCk7XG4gICAgICBsZXQgZGF0YUdlbmVyYXRvciA9IGRhdGFzZXRzW2RhdGFzZXRdO1xuICAgICAgcmVuZGVyVGh1bWJuYWlsKGNhbnZhcywgZGF0YUdlbmVyYXRvcik7XG4gICAgfVxuICB9XG4gIGlmIChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLlJFR1JFU1NJT04pIHtcbiAgICBmb3IgKGxldCByZWdEYXRhc2V0IGluIHJlZ0RhdGFzZXRzKSB7XG4gICAgICBsZXQgY2FudmFzOiBhbnkgPVxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGNhbnZhc1tkYXRhLXJlZ0RhdGFzZXQ9JHtyZWdEYXRhc2V0fV1gKTtcbiAgICAgIGxldCBkYXRhR2VuZXJhdG9yID0gcmVnRGF0YXNldHNbcmVnRGF0YXNldF07XG4gICAgICByZW5kZXJUaHVtYm5haWwoY2FudmFzLCBkYXRhR2VuZXJhdG9yKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaGlkZUNvbnRyb2xzKCkge1xuICAvLyBTZXQgZGlzcGxheTpub25lIHRvIGFsbCB0aGUgVUkgZWxlbWVudHMgdGhhdCBhcmUgaGlkZGVuLlxuICBsZXQgaGlkZGVuUHJvcHMgPSBzdGF0ZS5nZXRIaWRkZW5Qcm9wcygpO1xuICBoaWRkZW5Qcm9wcy5mb3JFYWNoKHByb3AgPT4ge1xuICAgIGxldCBjb250cm9scyA9IGQzLnNlbGVjdEFsbChgLnVpLSR7cHJvcH1gKTtcbiAgICBpZiAoY29udHJvbHMuc2l6ZSgpID09PSAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oYDAgaHRtbCBlbGVtZW50cyBmb3VuZCB3aXRoIGNsYXNzIC51aS0ke3Byb3B9YCk7XG4gICAgfVxuICAgIGNvbnRyb2xzLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gIH0pO1xuXG4gIC8vIEFsc28gYWRkIGNoZWNrYm94IGZvciBlYWNoIGhpZGFibGUgY29udHJvbCBpbiB0aGUgXCJ1c2UgaXQgaW4gY2xhc3Nyb21cIlxuICAvLyBzZWN0aW9uLlxuICBsZXQgaGlkZUNvbnRyb2xzID0gZDMuc2VsZWN0KFwiLmhpZGUtY29udHJvbHNcIik7XG4gIEhJREFCTEVfQ09OVFJPTFMuZm9yRWFjaCgoW3RleHQsIGlkXSkgPT4ge1xuICAgIGxldCBsYWJlbCA9IGhpZGVDb250cm9scy5hcHBlbmQoXCJsYWJlbFwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1kbC1jaGVja2JveCBtZGwtanMtY2hlY2tib3ggbWRsLWpzLXJpcHBsZS1lZmZlY3RcIik7XG4gICAgbGV0IGlucHV0ID0gbGFiZWwuYXBwZW5kKFwiaW5wdXRcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxuICAgICAgICBjbGFzczogXCJtZGwtY2hlY2tib3hfX2lucHV0XCIsXG4gICAgICB9KTtcbiAgICBpZiAoaGlkZGVuUHJvcHMuaW5kZXhPZihpZCkgPT09IC0xKSB7XG4gICAgICBpbnB1dC5hdHRyKFwiY2hlY2tlZFwiLCBcInRydWVcIik7XG4gICAgfVxuICAgIGlucHV0Lm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3RhdGUuc2V0SGlkZVByb3BlcnR5KGlkLCAhdGhpcy5jaGVja2VkKTtcbiAgICAgIHN0YXRlLnNlcmlhbGl6ZSgpO1xuICAgICAgdXNlckhhc0ludGVyYWN0ZWQoKTtcbiAgICAgIGQzLnNlbGVjdChcIi5oaWRlLWNvbnRyb2xzLWxpbmtcIilcbiAgICAgICAgLmF0dHIoXCJocmVmXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICB9KTtcbiAgICBsYWJlbC5hcHBlbmQoXCJzcGFuXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwibWRsLWNoZWNrYm94X19sYWJlbCBsYWJlbFwiKVxuICAgICAgLnRleHQodGV4dCk7XG4gIH0pO1xuICBkMy5zZWxlY3QoXCIuaGlkZS1jb250cm9scy1saW5rXCIpXG4gICAgLmF0dHIoXCJocmVmXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVEYXRhKGZpcnN0VGltZSA9IGZhbHNlKSB7XG4gIGlmICghZmlyc3RUaW1lKSB7XG4gICAgLy8gQ2hhbmdlIHRoZSBzZWVkLlxuICAgIC8vfiBzdGF0ZS50cnVlTm9pc2UgPSAwO1xuICAgIHN0YXRlLnNlZWQgPSBNYXRoLnJhbmRvbSgpLnRvRml4ZWQoOCk7XG4gICAgc3RhdGUuc2VyaWFsaXplKCk7XG4gICAgdXNlckhhc0ludGVyYWN0ZWQoKTtcbiAgfVxuICBNYXRoLnNlZWRyYW5kb20oc3RhdGUuc2VlZCk7XG4gIGxldCBudW1TYW1wbGVzID0gKHN0YXRlLnByb2JsZW0gPT09IFByb2JsZW0uUkVHUkVTU0lPTikgP1xuICAgICAgTlVNX1NBTVBMRVNfUkVHUkVTUyA6IE5VTV9TQU1QTEVTX0NMQVNTSUZZO1xuICBsZXQgZ2VuZXJhdG9yID0gc3RhdGUucHJvYmxlbSA9PT0gUHJvYmxlbS5DTEFTU0lGSUNBVElPTiA/XG4gICAgICBzdGF0ZS5kYXRhc2V0IDogc3RhdGUucmVnRGF0YXNldDtcbiAgICAgIC8vIE5vaXNlIGlzIGluIFNOUmRCXG4gIGxldCBkYXRhID0gZ2VuZXJhdG9yKG51bVNhbXBsZXMsIHN0YXRlLm5vaXNlKTtcbiAgLy8gU2h1ZmZsZSB0aGUgZGF0YSBpbi1wbGFjZS5cbiAgc2h1ZmZsZShkYXRhKTtcbiAgLy8gU3BsaXQgaW50byB0cmFpbiBhbmQgdGVzdCBkYXRhLlxuICBsZXQgc3BsaXRJbmRleCA9IE1hdGguZmxvb3IoZGF0YS5sZW5ndGggKiBzdGF0ZS5wZXJjVHJhaW5EYXRhIC8gMTAwKTtcbiAgdHJhaW5EYXRhID0gZGF0YS5zbGljZSgwLCBzcGxpdEluZGV4KTtcbiAgdGVzdERhdGEgPSBkYXRhLnNsaWNlKHNwbGl0SW5kZXgpO1xuICBoZWF0TWFwLnVwZGF0ZVBvaW50cyh0cmFpbkRhdGEpO1xuICBoZWF0TWFwLnVwZGF0ZVRlc3RQb2ludHMoc3RhdGUuc2hvd1Rlc3REYXRhID8gdGVzdERhdGEgOiBbXSk7XG59XG5cbmxldCBmaXJzdEludGVyYWN0aW9uID0gdHJ1ZTtcbmxldCBwYXJhbWV0ZXJzQ2hhbmdlZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiB1c2VySGFzSW50ZXJhY3RlZCgpIHtcbiAgaWYgKCFmaXJzdEludGVyYWN0aW9uKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZpcnN0SW50ZXJhY3Rpb24gPSBmYWxzZTtcbiAgbGV0IHBhZ2UgPSAnaW5kZXgnO1xuICBpZiAoc3RhdGUudHV0b3JpYWwgIT0gbnVsbCAmJiBzdGF0ZS50dXRvcmlhbCAhPT0gJycpIHtcbiAgICBwYWdlID0gYC92L3R1dG9yaWFscy8ke3N0YXRlLnR1dG9yaWFsfWA7XG4gIH1cbiAgZ2EoJ3NldCcsICdwYWdlJywgcGFnZSk7XG4gIGdhKCdzZW5kJywgJ3BhZ2V2aWV3JywgeydzZXNzaW9uQ29udHJvbCc6ICdzdGFydCd9KTtcbn1cblxuZnVuY3Rpb24gc2ltdWxhdGlvblN0YXJ0ZWQoKSB7XG4gIGdhKCdzZW5kJywge1xuICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgZXZlbnRDYXRlZ29yeTogJ1N0YXJ0aW5nIFNpbXVsYXRpb24nLFxuICAgIGV2ZW50QWN0aW9uOiBwYXJhbWV0ZXJzQ2hhbmdlZCA/ICdjaGFuZ2VkJyA6ICd1bmNoYW5nZWQnLFxuICAgIGV2ZW50TGFiZWw6IHN0YXRlLnR1dG9yaWFsID09IG51bGwgPyAnJyA6IHN0YXRlLnR1dG9yaWFsXG4gIH0pO1xuICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IGZhbHNlO1xufVxuXG5kcmF3RGF0YXNldFRodW1ibmFpbHMoKTtcbmluaXRUdXRvcmlhbCgpO1xubWFrZUdVSSgpO1xuZ2VuZXJhdGVEYXRhKHRydWUpO1xucmVzZXQodHJ1ZSk7XG5oaWRlQ29udHJvbHMoKTtcbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuaW1wb3J0ICogYXMgbm4gZnJvbSBcIi4vbm5cIjtcbmltcG9ydCAqIGFzIGRhdGFzZXQgZnJvbSBcIi4vZGF0YXNldFwiO1xuXG4vKiogU3VmZml4IGFkZGVkIHRvIHRoZSBzdGF0ZSB3aGVuIHN0b3JpbmcgaWYgYSBjb250cm9sIGlzIGhpZGRlbiBvciBub3QuICovXG5jb25zdCBISURFX1NUQVRFX1NVRkZJWCA9IFwiX2hpZGVcIjtcblxuLyoqIEEgbWFwIGJldHdlZW4gbmFtZXMgYW5kIGFjdGl2YXRpb24gZnVuY3Rpb25zLiAqL1xuZXhwb3J0IGxldCBhY3RpdmF0aW9uczoge1trZXk6IHN0cmluZ106IG5uLkFjdGl2YXRpb25GdW5jdGlvbn0gPSB7XG4gIFwicmVsdVwiOiBubi5BY3RpdmF0aW9ucy5SRUxVLFxuICBcInRhbmhcIjogbm4uQWN0aXZhdGlvbnMuVEFOSCxcbiAgXCJzaWdtb2lkXCI6IG5uLkFjdGl2YXRpb25zLlNJR01PSUQsXG4gIFwibGluZWFyXCI6IG5uLkFjdGl2YXRpb25zLkxJTkVBUixcbiAgXCJzaW54XCIgOiBubi5BY3RpdmF0aW9ucy5TSU5YXG59O1xuXG4vKiogQSBtYXAgYmV0d2VlbiBuYW1lcyBhbmQgcmVndWxhcml6YXRpb24gZnVuY3Rpb25zLiAqL1xuZXhwb3J0IGxldCByZWd1bGFyaXphdGlvbnM6IHtba2V5OiBzdHJpbmddOiBubi5SZWd1bGFyaXphdGlvbkZ1bmN0aW9ufSA9IHtcbiAgXCJub25lXCI6IG51bGwsXG4gIFwiTDFcIjogbm4uUmVndWxhcml6YXRpb25GdW5jdGlvbi5MMSxcbiAgXCJMMlwiOiBubi5SZWd1bGFyaXphdGlvbkZ1bmN0aW9uLkwyXG59O1xuXG4vKiogQSBtYXAgYmV0d2VlbiBkYXRhc2V0IG5hbWVzIGFuZCBmdW5jdGlvbnMgdGhhdCBnZW5lcmF0ZSBjbGFzc2lmaWNhdGlvbiBkYXRhLiAqL1xuZXhwb3J0IGxldCBkYXRhc2V0czoge1trZXk6IHN0cmluZ106IGRhdGFzZXQuRGF0YUdlbmVyYXRvcn0gPSB7XG4gIFwiY2lyY2xlXCI6IGRhdGFzZXQuY2xhc3NpZnlDaXJjbGVEYXRhLFxuICBcInhvclwiOiBkYXRhc2V0LmNsYXNzaWZ5WE9SRGF0YSxcbiAgXCJnYXVzc1wiOiBkYXRhc2V0LmNsYXNzaWZ5VHdvR2F1c3NEYXRhLFxuICBcInNwaXJhbFwiOiBkYXRhc2V0LmNsYXNzaWZ5U3BpcmFsRGF0YSxcbn07XG5cbi8qKiBBIG1hcCBiZXR3ZWVuIGRhdGFzZXQgbmFtZXMgYW5kIGZ1bmN0aW9ucyB0aGF0IGdlbmVyYXRlIHJlZ3Jlc3Npb24gZGF0YS4gKi9cbmV4cG9ydCBsZXQgcmVnRGF0YXNldHM6IHtba2V5OiBzdHJpbmddOiBkYXRhc2V0LkRhdGFHZW5lcmF0b3J9ID0ge1xuICBcInJlZy1wbGFuZVwiOiBkYXRhc2V0LnJlZ3Jlc3NQbGFuZSxcbiAgXCJyZWctZ2F1c3NcIjogZGF0YXNldC5yZWdyZXNzR2F1c3NpYW5cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRLZXlGcm9tVmFsdWUob2JqOiBhbnksIHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKG9ialtrZXldID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZW5kc1dpdGgoczogc3RyaW5nLCBzdWZmaXg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gcy5zdWJzdHIoLXN1ZmZpeC5sZW5ndGgpID09PSBzdWZmaXg7XG59XG5cbmZ1bmN0aW9uIGdldEhpZGVQcm9wcyhvYmo6IGFueSk6IHN0cmluZ1tdIHtcbiAgbGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChsZXQgcHJvcCBpbiBvYmopIHtcbiAgICBpZiAoZW5kc1dpdGgocHJvcCwgSElERV9TVEFURV9TVUZGSVgpKSB7XG4gICAgICByZXN1bHQucHVzaChwcm9wKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgZGF0YSB0eXBlIG9mIGEgc3RhdGUgdmFyaWFibGUuIFVzZWQgZm9yIGRldGVybWluaW5nIHRoZVxuICogKGRlKXNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5leHBvcnQgZW51bSBUeXBlIHtcbiAgU1RSSU5HLFxuICBOVU1CRVIsXG4gIEFSUkFZX05VTUJFUixcbiAgQVJSQVlfU1RSSU5HLFxuICBCT09MRUFOLFxuICBPQkpFQ1Rcbn1cblxuZXhwb3J0IGVudW0gUHJvYmxlbSB7XG4gIENMQVNTSUZJQ0FUSU9OLFxuICBSRUdSRVNTSU9OXG59XG5cbmV4cG9ydCBsZXQgcHJvYmxlbXMgPSB7XG4gIFwiY2xhc3NpZmljYXRpb25cIjogUHJvYmxlbS5DTEFTU0lGSUNBVElPTixcbiAgXCJyZWdyZXNzaW9uXCI6IFByb2JsZW0uUkVHUkVTU0lPTlxufTtcblxuZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eSB7XG4gIG5hbWU6IHN0cmluZztcbiAgdHlwZTogVHlwZTtcbiAga2V5TWFwPzoge1trZXk6IHN0cmluZ106IGFueX07XG59O1xuXG4vLyBBZGQgdGhlIEdVSSBzdGF0ZS5cbmV4cG9ydCBjbGFzcyBTdGF0ZSB7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgUFJPUFM6IFByb3BlcnR5W10gPSBbXG4gICAge25hbWU6IFwiYWN0aXZhdGlvblwiLCB0eXBlOiBUeXBlLk9CSkVDVCwga2V5TWFwOiBhY3RpdmF0aW9uc30sXG4gICAge25hbWU6IFwicmVndWxhcml6YXRpb25cIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogcmVndWxhcml6YXRpb25zfSxcbiAgICB7bmFtZTogXCJiYXRjaFNpemVcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuICAgIHtuYW1lOiBcImRhdGFzZXRcIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogZGF0YXNldHN9LFxuICAgIHtuYW1lOiBcInJlZ0RhdGFzZXRcIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogcmVnRGF0YXNldHN9LFxuICAgIHtuYW1lOiBcImxlYXJuaW5nUmF0ZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sXG4gICAge25hbWU6IFwidHJ1ZUxlYXJuaW5nUmF0ZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sIC8vIFRoZSB0cnVlIGxlYXJuaW5nIHJhdGVcbiAgICB7bmFtZTogXCJyZWd1bGFyaXphdGlvblJhdGVcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuICAgIHtuYW1lOiBcIm5vaXNlXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcbiAgICB7bmFtZTogXCJuZXR3b3JrU2hhcGVcIiwgdHlwZTogVHlwZS5BUlJBWV9OVU1CRVJ9LFxuICAgIHtuYW1lOiBcInNlZWRcIiwgdHlwZTogVHlwZS5TVFJJTkd9LFxuICAgIHtuYW1lOiBcInNob3dUZXN0RGF0YVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuICAgIHtuYW1lOiBcImRpc2NyZXRpemVcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcbiAgICB7bmFtZTogXCJwZXJjVHJhaW5EYXRhXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcbiAgICB7bmFtZTogXCJ4XCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG4gICAge25hbWU6IFwieVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuICAgIHtuYW1lOiBcInhUaW1lc1lcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcbiAgICB7bmFtZTogXCJ4U3F1YXJlZFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuICAgIHtuYW1lOiBcInlTcXVhcmVkXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG4gICAge25hbWU6IFwiY29zWFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuICAgIHtuYW1lOiBcInNpblhcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcbiAgICB7bmFtZTogXCJjb3NZXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG4gICAge25hbWU6IFwic2luWVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuICAgIHtuYW1lOiBcImNvbGxlY3RTdGF0c1wiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuICAgIHtuYW1lOiBcInR1dG9yaWFsXCIsIHR5cGU6IFR5cGUuU1RSSU5HfSxcbiAgICB7bmFtZTogXCJwcm9ibGVtXCIsIHR5cGU6IFR5cGUuT0JKRUNULCBrZXlNYXA6IHByb2JsZW1zfSxcbiAgICB7bmFtZTogXCJpbml0WmVyb1wiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuICAgIHtuYW1lOiBcImhpZGVUZXh0XCIsIHR5cGU6IFR5cGUuQk9PTEVBTn1cbiAgXTtcblxuICBba2V5OiBzdHJpbmddOiBhbnk7XG4gIHRvdGFsQ2FwYWNpdHkgPSAwLjA7XG4gIHJlcUNhcGFjaXR5ID0gMjtcbiAgbG9zc0NhcGFjaXR5ID0gMDtcbiAgdHJ1ZUxlYXJuaW5nUmF0ZSA9IDAuMDtcbiAgbGVhcm5pbmdSYXRlID0gMS4wO1xuICByZWd1bGFyaXphdGlvblJhdGUgPSAwO1xuICBzaG93VGVzdERhdGEgPSBmYWxzZTtcbiAgbm9pc2UgPSAzNTsgLy8gU05SZEJcbiAgYmF0Y2hTaXplID0gMTA7XG4gIGRpc2NyZXRpemUgPSBmYWxzZTtcbiAgdHV0b3JpYWw6IHN0cmluZyA9IG51bGw7XG4gIHBlcmNUcmFpbkRhdGEgPSA1MDtcbiAgYWN0aXZhdGlvbiA9IG5uLkFjdGl2YXRpb25zLlNJR01PSUQ7XG4gIHJlZ3VsYXJpemF0aW9uOiBubi5SZWd1bGFyaXphdGlvbkZ1bmN0aW9uID0gbnVsbDtcbiAgcHJvYmxlbSA9IFByb2JsZW0uQ0xBU1NJRklDQVRJT047XG4gIGluaXRaZXJvID0gZmFsc2U7XG4gIGhpZGVUZXh0ID0gZmFsc2U7XG4gIGNvbGxlY3RTdGF0cyA9IGZhbHNlO1xuICBudW1IaWRkZW5MYXllcnMgPSAxO1xuICBoaWRkZW5MYXllckNvbnRyb2xzOiBhbnlbXSA9IFtdO1xuICBuZXR3b3JrU2hhcGU6IG51bWJlcltdID0gWzFdO1xuICB4ID0gdHJ1ZTtcbiAgeSA9IHRydWU7XG4gIHhUaW1lc1kgPSBmYWxzZTtcbiAgeFNxdWFyZWQgPSBmYWxzZTtcbiAgeVNxdWFyZWQgPSBmYWxzZTtcbiAgY29zWCA9IGZhbHNlO1xuICBzaW5YID0gZmFsc2U7XG4gIGNvc1kgPSBmYWxzZTtcbiAgc2luWSA9IGZhbHNlO1xuICBkYXRhc2V0OiBkYXRhc2V0LkRhdGFHZW5lcmF0b3IgPSBkYXRhc2V0LmNsYXNzaWZ5VHdvR2F1c3NEYXRhO1xuICByZWdEYXRhc2V0OiBkYXRhc2V0LkRhdGFHZW5lcmF0b3IgPSBkYXRhc2V0LnJlZ3Jlc3NQbGFuZTtcbiAgc2VlZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgdGhlIHN0YXRlIGZyb20gdGhlIHVybCBoYXNoLlxuICAgKi9cbiAgc3RhdGljIGRlc2VyaWFsaXplU3RhdGUoKTogU3RhdGUge1xuICAgIGxldCBtYXA6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gICAgZm9yIChsZXQga2V5dmFsdWUgb2Ygd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkuc3BsaXQoXCImXCIpKSB7XG4gICAgICBsZXQgW25hbWUsIHZhbHVlXSA9IGtleXZhbHVlLnNwbGl0KFwiPVwiKTtcbiAgICAgIG1hcFtuYW1lXSA9IHZhbHVlO1xuICAgIH1cbiAgICBsZXQgc3RhdGUgPSBuZXcgU3RhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGhhc0tleShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBuYW1lIGluIG1hcCAmJiBtYXBbbmFtZV0gIT0gbnVsbCAmJiBtYXBbbmFtZV0udHJpbSgpICE9PSBcIlwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlQXJyYXkodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICAgIHJldHVybiB2YWx1ZS50cmltKCkgPT09IFwiXCIgPyBbXSA6IHZhbHVlLnNwbGl0KFwiLFwiKTtcbiAgICB9XG5cbiAgICAvLyBEZXNlcmlhbGl6ZSByZWd1bGFyIHByb3BlcnRpZXMuXG4gICAgU3RhdGUuUFJPUFMuZm9yRWFjaCgoe25hbWUsIHR5cGUsIGtleU1hcH0pID0+IHtcbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFR5cGUuT0JKRUNUOlxuICAgICAgICAgIGlmIChrZXlNYXAgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJBIGtleS12YWx1ZSBtYXAgbXVzdCBiZSBwcm92aWRlZCBmb3Igc3RhdGUgXCIgK1xuICAgICAgICAgICAgICAgIFwidmFyaWFibGVzIG9mIHR5cGUgT2JqZWN0XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaGFzS2V5KG5hbWUpICYmIG1hcFtuYW1lXSBpbiBrZXlNYXApIHtcbiAgICAgICAgICAgIHN0YXRlW25hbWVdID0ga2V5TWFwW21hcFtuYW1lXV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFR5cGUuTlVNQkVSOlxuICAgICAgICAgIGlmIChoYXNLZXkobmFtZSkpIHtcbiAgICAgICAgICAgIC8vIFRoZSArIG9wZXJhdG9yIGlzIGZvciBjb252ZXJ0aW5nIGEgc3RyaW5nIHRvIGEgbnVtYmVyLlxuICAgICAgICAgICAgc3RhdGVbbmFtZV0gPSArbWFwW25hbWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBUeXBlLlNUUklORzpcbiAgICAgICAgICBpZiAoaGFzS2V5KG5hbWUpKSB7XG4gICAgICAgICAgICBzdGF0ZVtuYW1lXSA9IG1hcFtuYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVHlwZS5CT09MRUFOOlxuICAgICAgICAgIGlmIChoYXNLZXkobmFtZSkpIHtcbiAgICAgICAgICAgIHN0YXRlW25hbWVdID0gKG1hcFtuYW1lXSA9PT0gXCJmYWxzZVwiID8gZmFsc2UgOiB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVHlwZS5BUlJBWV9OVU1CRVI6XG4gICAgICAgICAgaWYgKG5hbWUgaW4gbWFwKSB7XG4gICAgICAgICAgICBzdGF0ZVtuYW1lXSA9IHBhcnNlQXJyYXkobWFwW25hbWVdKS5tYXAoTnVtYmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVHlwZS5BUlJBWV9TVFJJTkc6XG4gICAgICAgICAgaWYgKG5hbWUgaW4gbWFwKSB7XG4gICAgICAgICAgICBzdGF0ZVtuYW1lXSA9IHBhcnNlQXJyYXkobWFwW25hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgRXJyb3IoXCJFbmNvdW50ZXJlZCBhbiB1bmtub3duIHR5cGUgZm9yIGEgc3RhdGUgdmFyaWFibGVcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBEZXNlcmlhbGl6ZSBzdGF0ZSBwcm9wZXJ0aWVzIHRoYXQgY29ycmVzcG9uZCB0byBoaWRpbmcgVUkgY29udHJvbHMuXG4gICAgZ2V0SGlkZVByb3BzKG1hcCkuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIHN0YXRlW3Byb3BdID0gKG1hcFtwcm9wXSA9PT0gXCJ0cnVlXCIpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH0pO1xuICAgIHN0YXRlLm51bUhpZGRlbkxheWVycyA9IHN0YXRlLm5ldHdvcmtTaGFwZS5sZW5ndGg7XG4gICAgaWYgKHN0YXRlLnNlZWQgPT0gbnVsbCkge1xuICAgICAgc3RhdGUuc2VlZCA9IE1hdGgucmFuZG9tKCkudG9GaXhlZCg1KTtcbiAgICB9XG4gICAgTWF0aC5zZWVkcmFuZG9tKHN0YXRlLnNlZWQpO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBzdGF0ZSBpbnRvIHRoZSB1cmwgaGFzaC5cbiAgICovXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICAvLyBTZXJpYWxpemUgcmVndWxhciBwcm9wZXJ0aWVzLlxuICAgIGxldCBwcm9wczogc3RyaW5nW10gPSBbXTtcbiAgICBTdGF0ZS5QUk9QUy5mb3JFYWNoKCh7bmFtZSwgdHlwZSwga2V5TWFwfSkgPT4ge1xuICAgICAgbGV0IHZhbHVlID0gdGhpc1tuYW1lXTtcbiAgICAgIC8vIERvbid0IHNlcmlhbGl6ZSBtaXNzaW5nIHZhbHVlcy5cbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSBUeXBlLk9CSkVDVCkge1xuICAgICAgICB2YWx1ZSA9IGdldEtleUZyb21WYWx1ZShrZXlNYXAsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gVHlwZS5BUlJBWV9OVU1CRVIgfHxcbiAgICAgICAgICB0eXBlID09PSBUeXBlLkFSUkFZX1NUUklORykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLmpvaW4oXCIsXCIpO1xuICAgICAgfVxuICAgICAgcHJvcHMucHVzaChgJHtuYW1lfT0ke3ZhbHVlfWApO1xuICAgIH0pO1xuICAgIC8vIFNlcmlhbGl6ZSBwcm9wZXJ0aWVzIHRoYXQgY29ycmVzcG9uZCB0byBoaWRpbmcgVUkgY29udHJvbHMuXG4gICAgZ2V0SGlkZVByb3BzKHRoaXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBwcm9wcy5wdXNoKGAke3Byb3B9PSR7dGhpc1twcm9wXX1gKTtcbiAgICB9KTtcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHByb3BzLmpvaW4oXCImXCIpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYWxsIHRoZSBoaWRkZW4gcHJvcGVydGllcy4gKi9cbiAgZ2V0SGlkZGVuUHJvcHMoKTogc3RyaW5nW10ge1xuICAgIGxldCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgcHJvcCBpbiB0aGlzKSB7XG4gICAgICBpZiAoZW5kc1dpdGgocHJvcCwgSElERV9TVEFURV9TVUZGSVgpICYmIFN0cmluZyh0aGlzW3Byb3BdKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgcmVzdWx0LnB1c2gocHJvcC5yZXBsYWNlKEhJREVfU1RBVEVfU1VGRklYLCBcIlwiKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBzZXRIaWRlUHJvcGVydHkobmFtZTogc3RyaW5nLCBoaWRkZW46IGJvb2xlYW4pIHtcbiAgICB0aGlzW25hbWUgKyBISURFX1NUQVRFX1NVRkZJWF0gPSBoaWRkZW47XG4gIH1cbn1cbiJdfQ==
