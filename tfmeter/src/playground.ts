/* Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
import {Link, Node} from "./nn";

declare var $: any;

import * as nn from "./nn";
import {HeatMap, reduceMatrix} from "./heatmap";
import {
	State,
	datasets,
	regDatasets,
	activations,
	problems,
	regularizations,
	getKeyFromValue,
	Problem
} from "./state";
import {Example2D, shuffle, DataGenerator} from "./dataset";
import {AppendingLineChart} from "./linechart";

let mainWidth;

type energyType = {
	eVal: number,
	label: number
};

function mtrunc(v: number) {
	v = +v;
	return (v - v % 1) || (!isFinite(v) || v === 0 ? v : v < 0 ? -0 : 0);
}

function log2(x: number): number {
	return Math.log(x) / Math.log(2);
}

function log10(x: number): number {
	return Math.log(x) / Math.log(10);
}

function signalOf(x: number): number {
	return log2(1 + Math.abs(x));
}

function SNR(x: number): number {
	return 10 * log10(x);
}

// More scrolling
d3.select(".more button").on("click", function () {
	let position = 800;
	d3.transition()
		.duration(1000)
		.tween("scroll", scrollTween(position));
});

function scrollTween(offset) {
	return function () {
		let i = d3.interpolateNumber(window.pageYOffset ||
			document.documentElement.scrollTop, offset);
		return function (t) {
			scrollTo(0, i(t));
		};
	};
}

const RECT_SIZE = 30;
const BIAS_SIZE = 5;
const NUM_SAMPLES_CLASSIFY = 500;
const NUM_SAMPLES_REGRESS = 1200;
const DENSITY = 100;

const MAX_NEURONS = 32;
const MAX_HLAYERS = 10;

// Rounding off of training data. Used by getReqCapacity
const REQ_CAP_ROUNDING = -1;

enum HoverType {
	BIAS, WEIGHT
}

interface InputFeature {
	f: (x: number, y: number) => number;
	label?: string;
}

let INPUTS: { [name: string]: InputFeature } = {
	"x": {f: (x, y) => x, label: "X_1"},
	"y": {f: (x, y) => y, label: "X_2"},
	"xSquared": {f: (x, y) => x * x, label: "X_1^2"},
	"ySquared": {f: (x, y) => y * y, label: "X_2^2"},
	"xTimesY": {f: (x, y) => x * y, label: "X_1X_2"},
	"sinX": {f: (x, y) => Math.sin(x), label: "sin(X_1)"},
	"sinY": {f: (x, y) => Math.sin(y), label: "sin(X_2)"},
};

let HIDABLE_CONTROLS =
	[
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

class Player {
	private timerIndex = 0;
	private isPlaying = false;
	private callback: (isPlaying: boolean) => void = null;

	/** Plays/pauses the player. */
	playOrPause() {
		if (this.isPlaying) {
			this.isPlaying = false;
			this.pause();
		} else {
			this.isPlaying = true;
			if (iter === 0) {
				simulationStarted();
			}
			this.play();
		}
	}

	onPlayPause(callback: (isPlaying: boolean) => void) {
		this.callback = callback;
	}

	play() {
		this.pause();
		this.isPlaying = true;
		if (this.callback) {
			this.callback(this.isPlaying);
		}
		this.start(this.timerIndex);
	}

	pause() {
		this.timerIndex++;
		this.isPlaying = false;
		if (this.callback) {
			this.callback(this.isPlaying);
		}
	}

	private start(localTimerIndex: number) {
		d3.timer(() => {
			if (localTimerIndex < this.timerIndex) {
				return true;  // Done.
			}
			oneStep();
			return false;  // Not done.
		}, 0);
	}
}

let state = State.deserializeState();

// Filter out inputs that are hidden.
state.getHiddenProps().forEach(prop => {
	if (prop in INPUTS) {
		delete INPUTS[prop];
	}
});

let boundary: { [id: string]: number[][] } = {};
let selectedNodeId: string = null;
// Plot the heatmap.
let xDomain: [number, number] = [-6, 6];
let heatMap =
	new HeatMap(300, DENSITY, xDomain, xDomain, d3.select("#heatmap"),
		{showAxes: true});
let linkWidthScale = d3.scale.linear()
	.domain([0, 5])
	.range([1, 10])
	.clamp(true);
let colorScale = d3.scale.linear<string>()
	.domain([-1, 0, 1])
	.range(["#0877bd", "#e8eaeb", "#f59322"])
	.clamp(true);
let iter = 0;
let trainData: Example2D[] = [];
let testData: Example2D[] = [];
let network: nn.Node[][] = null;
let lossTrain = 0;
let lossTest = 0;
let trueLearningRate = 0;
let totalCapacity = 0;
let generalization = 0;
let trainClassesAccuracy = [];
let testClassesAccuracy = [];
let player = new Player();
let lineChart = new AppendingLineChart(d3.select("#linechart"),
	["#777", "black"]);

let markedNode: nn.Node = null;
let markedDiv = null;

function getReqCapacity(points: Example2D[]): number[] {

	let rounding = REQ_CAP_ROUNDING;
	let energy: energyType[] = [];
	let numRows: number = points.length;
	let numCols: number = 2;
	let result: number = 0;
	let retval: number[] = [];
	let class1 = -666;
	let numclass1: number = 0;
	for (let i = 0; i < numRows; i++) {
		let result = 0; // y, xSquared, ySquared, xTimesY, sinX, sinY,
		if (network && network[0].length) {
			network[0].forEach((node: Node) => {
				result += INPUTS[node.id].f(points[i].x, points[i].y);
			});

		} else {
			return [Infinity, Infinity];
		}
		if (rounding != -1) {
			result = mtrunc(result * Math.pow(10, rounding)) / Math.pow(10, rounding);
		}
		let eVal: number = result;
		let label: number = points[i].label;
		energy.push({eVal, label});
		if (class1 == -666) {
			class1 = label;
		}
		if (label == class1) {
			numclass1++;
		}
	}


	energy.sort(
		function (a, b) {
			return a.eVal - b.eVal;
		}
	);

	let curLabel = energy[0].label;
	let changes = 0;

	for (let i = 0; i < energy.length; i++) {
		if (energy[i].label != curLabel) {
			changes++;
			curLabel = energy[i].label;
		}
	}

	let clusters: number = 0;
	clusters = changes + 1;

	let mincuts: number = 0;
	mincuts = Math.ceil(log2(clusters));

	let sugCapacity = mincuts * numCols;
	let maxCapacity = changes * (numCols + 1) + changes;

	retval.push(sugCapacity);
	retval.push(maxCapacity);


	return retval;
}


function numberOfUnique(dataset: Example2D[]) {
	let count: number = 0;
	let uniqueDict: { [key: string]: number } = {};
	dataset.forEach(point => {
		let key: string = "" + point.x + point.y + point.label;
		if (!(key in uniqueDict)) {
			count += 1;
			uniqueDict[key] = 1;
		}
	});
	return count;
}

/**
 * Scaling the points in {points} given a range {range}
 */
function minMaxScalePoints(points: Example2D[], range: [number, number]) {
	let points_x = points.map(p => p.x);
	let points_y = points.map(p => p.y);
	let x_min = Math.min(...points_x);
	let x_max = Math.max(...points_x);
	let y_min = Math.min(...points_y);
	let y_max = Math.max(...points_y);
	points.forEach(p => {
		p.x = ((p.x - x_min) / (x_max - x_min)) * (range[1] - range[0]) + range[0];
		p.y = ((p.y - y_min) / (y_max - y_min)) * (range[1] - range[0]) + range[0];
	});
	return points;
}

function makeGUI() {
	// Toolboxes
	$(function () {
		$("[data-toggle='popover']").popover({
			container: "body"
		});
	});
	$(".popover-dismiss").popover({
		trigger: "focus"
	});

	// Adding links between nodes
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


	d3.select("#reset-button").on("click", () => {
		reset();
		userHasInteracted();
		d3.select("#play-pause-button");
	});

	d3.select("#play-pause-button").on("click", function () {
		// Change the button's content.
		userHasInteracted();
		player.playOrPause();
	});

	player.onPlayPause(isPlaying => {
		d3.select("#play-pause-button").classed("playing", isPlaying);
	});

	d3.select("#next-step-button").on("click", () => {
		player.pause();
		userHasInteracted();
		if (iter === 0) {
			simulationStarted();
		}
		oneStep();
	});

	d3.select("#data-regen-button").on("click", () => {
		generateData();
		parametersChanged = true;
	});

	let dataThumbnails = d3.selectAll("canvas[data-dataset]");
	dataThumbnails.on("click", function () {
		let newDataset = datasets[this.dataset.dataset];
		let datasetKey = getKeyFromValue(datasets, newDataset);

		if (newDataset === state.dataset && datasetKey != "byod") {
			return; // No-op.
		}

		state.dataset = newDataset;


		if (datasetKey === "byod") {

			state.byod = true;
			d3.select("#inputFormBYOD").html("<input type='file' accept='.csv' id='inputFileBYOD'>");
			dataThumbnails.classed("selected", false);
			d3.select(this).classed("selected", true);
			$("#inputFileBYOD").click();

			// d3.select("#noise").value(state.noise);
			// ~ $("#noise").slider("disable");

			let inputBYOD = d3.select("#inputFileBYOD");
			inputBYOD.on("change", function (event) {
				let reader = new FileReader();
				let name = this.files[0].name;
				reader.onload = function (event) {
					let points: Example2D[] = [];
					let target: any = event.target;
					let data = target.result;
					let s = data.split("\n");
					for (let i = 0; i < s.length; i++) {
						let ss = s[i].split(",");
						if (ss.length != 3) break;
						let x = parseFloat(ss[0]);
						let y = parseFloat(ss[1]);
						let label = parseInt(ss[2]);
						points.push({x, y, label});
					}
					points = minMaxScalePoints(points, [-6, 6]);
					shuffle(points);
					// Split into train and test data.
					let splitIndex = Math.floor(points.length * state.percTrainData / 100);
					trainData = points.slice(0, splitIndex);
					testData = points.slice(splitIndex);

					heatMap.updatePoints(trainData);
					heatMap.updateTestPoints(state.showTestData ? testData : []);

					let classDist = getNumberOfEachClass(trainData).map((num) => num / trainData.length);
					state.sugCapacity = getReqCapacity(trainData)[0];
					state.maxCapacity = getReqCapacity(trainData)[1];

					d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
					d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
					d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
					d3.select("label[for='dataDistribution'] .value")
						.text(`${classDist[0].toFixed(3)}, ${classDist[1].toFixed(3)}`);
					//////////////////
					parametersChanged = true;
					reset();

					// Drawing thumbnail
					let canvas: any = document.querySelector(`canvas[data-dataset=byod]`);
					renderThumbnail(canvas, (numSamples: number, noise: number) => points);


				};

				reader.readAsText(this.files[0]);
			});


		} else {
			state.byod = false;
			// ~ d3.select("#inputFormBYOD").html("");
			// $("#noise").disabled = false;

			dataThumbnails.classed("selected", false);
			d3.select(this).classed("selected", true);
			state.noise = 35; // SNRdB


			generateData();

			let points: Example2D[] = [];
			for (let i = 0; i < trainData.length; i++) {
				points.push(trainData[i]);
			}
			for (let i = 0; i < testData.length; i++) {
				points.push(testData[i]);
			}

			let classDist = getNumberOfEachClass(trainData).map((num) => num / trainData.length);
			state.sugCapacity = getReqCapacity(trainData)[0];
			state.maxCapacity = getReqCapacity(trainData)[1];

			d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
			d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
			d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
			d3.select("label[for='dataDistribution'] .value")
				.text(`${classDist[0].toFixed(3)}, ${classDist[1].toFixed(3)}`);

			parametersChanged = true;

			// Resetting the BYOD thumbnail
			let canvas: any = document.querySelector(`canvas[data-dataset=byod]`);
			renderBYODThumbnail(canvas);
			reset();
		}

	});

	let datasetKey = getKeyFromValue(datasets, state.dataset);
	// Select the dataset according to the current state.
	d3.select(`canvas[data-dataset=${datasetKey}]`)
		.classed("selected", true);

	let regDataThumbnails = d3.selectAll("canvas[data-regDataset]");
	regDataThumbnails.on("click", function () {
		let newDataset = regDatasets[this.dataset.regdataset];
		if (newDataset === state.regDataset) {
			return; // No-op.
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

	let regDatasetKey = getKeyFromValue(regDatasets, state.regDataset);
	// Select the dataset according to the current state.
	d3.select(`canvas[data-regDataset=${regDatasetKey}]`)
		.classed("selected", true);


	d3.select("#add-layers").on("click", () => {
		if (state.numHiddenLayers >= MAX_HLAYERS) {
			return;
		}
		state.networkShape[state.numHiddenLayers] = 2;
		state.numHiddenLayers++;
		parametersChanged = true;
		reset();
	});

	d3.select("#remove-layers").on("click", () => {
		if (state.numHiddenLayers <= 0) {
			return;
		}
		state.numHiddenLayers--;
		state.networkShape.splice(state.numHiddenLayers);
		parametersChanged = true;
		reset();
	});

	let showTestData = d3.select("#show-test-data").on("change", function () {
		state.showTestData = this.checked;
		state.serialize();
		userHasInteracted();
		heatMap.updateTestPoints(state.showTestData ? testData : []);
	});

	// Check/uncheck the checkbox according to the current state.
	showTestData.property("checked", state.showTestData);

	let discretize = d3.select("#discretize").on("change", function () {
		state.discretize = this.checked;
		state.serialize();
		userHasInteracted();
		updateUI();
	});
	// Check/uncheck the checbox according to the current state.
	discretize.property("checked", state.discretize);

	let percTrain = d3.select("#percTrainData").on("input", function () {
		state.percTrainData = this.value;
		d3.select("label[for='percTrainData'] .value").text(this.value);
		generateData();

		let classDist = getNumberOfEachClass(trainData).map((num) => num / trainData.length);
		d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
		d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
		d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
		d3.select("label[for='dataDistribution'] .value")
			.text(`${classDist[0].toFixed(3)}, ${classDist[1].toFixed(3)}`);
		parametersChanged = true;
		reset();
	});
	percTrain.property("value", state.percTrainData);
	d3.select("label[for='percTrainData'] .value").text(state.percTrainData);

	function humanReadableInt(n: number): string {
		return n.toFixed(0);
	}

	let noise = d3.select("#noise").on("input", function () {
		state.noise = this.value;
		d3.select("label[for='true-noiseSNR'] .value").text(this.value);
		generateData();

		let classDist = getNumberOfEachClass(trainData).map((num) => num / trainData.length);
		d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
		d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
		d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
		d3.select("label[for='dataDistribution'] .value")
			.text(`${classDist[0].toFixed(3)}, ${classDist[1].toFixed(3)}`);

		parametersChanged = true;
		reset();
	});


	noise.property("value", state.noise);
	let classDist = getNumberOfEachClass(trainData).map((num) => num / trainData.length);
	d3.select("label[for='true-noiseSNR'] .value").text(state.noise);
	d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
	d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
	d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
	d3.select("label[for='dataDistribution'] .value")
		.text(`${classDist[0].toFixed(3)}, ${classDist[1].toFixed(3)}`);

	let batchSize = d3.select("#batchSize").on("input", function () {
		state.batchSize = this.value;

		let classDist = getNumberOfEachClass(trainData).map((num) => num / trainData.length);
		d3.select("label[for='batchSize'] .value").text(this.value);
		d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
		d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
		d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
		d3.select("label[for='dataDistribution'] .value")
			.text(`${classDist[0].toFixed(3)}, ${classDist[1].toFixed(3)}`);

		parametersChanged = true;
		reset();
	});

	batchSize.property("value", state.batchSize);
	d3.select("label[for='batchSize'] .value").text(state.batchSize);
	d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
	d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
	d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
	d3.select("label[for='dataDistribution'] .value")
		.text(`${classDist[0].toFixed(3)}, ${classDist[1].toFixed(3)}`);


	let activationDropdown = d3.select("#activations").on("change", function () {
		state.activation = activations[this.value];
		parametersChanged = true;
		reset();
	});
	activationDropdown.property("value", getKeyFromValue(activations, state.activation));

	let learningRate = d3.select("#learningRate").on("change", function () {
		state.learningRate = this.value;
		state.serialize();
		userHasInteracted();
		parametersChanged = true;
	});

	learningRate.property("value", state.learningRate);

	let regularDropdown = d3.select("#regularizations").on("change", function () {
		state.regularization = regularizations[this.value];
		parametersChanged = true;
		reset();
	});

	regularDropdown.property("value", getKeyFromValue(regularizations, state.regularization));

	let regularRate = d3.select("#regularRate").on("change", function () {
		state.regularizationRate = +this.value;
		parametersChanged = true;
		reset();
	});
	regularRate.property("value", state.regularizationRate);

	let problem = d3.select("#problem").on("change", function () {
		state.problem = problems[this.value];
		generateData();
		drawDatasetThumbnails();
		parametersChanged = true;
		reset();
	});
	problem.property("value", getKeyFromValue(problems, state.problem));

	// Add scale to the gradient color map.
	let x = d3.scale.linear().domain([-1, 1]).range([0, 144]);
	let xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickValues([-1, 0, 1])
		.tickFormat(d3.format("d"));
	d3.select("#colormap g.core").append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0,10)")
		.call(xAxis);

	// Listen for css-responsive changes and redraw the svg network.

	window.addEventListener("resize", () => {
		let newWidth = document.querySelector("#main-part")
			.getBoundingClientRect().width;
		if (newWidth !== mainWidth) {
			mainWidth = newWidth;
			drawNetwork(network);
			updateUI(true);
		}
	});

	// Hide the text below the visualization depending on the URL.
	if (state.hideText) {
		d3.select("#article-text").style("display", "none");
		d3.select("div.more").style("display", "none");
		d3.select("header").style("display", "none");
	}
}

function updateBiasesUI(network: nn.Node[][]) {
	nn.forEachNode(network, true, node => {
		d3.select(`rect#bias-${node.id}`).style("fill", colorScale(node.bias));
	});
}

function updateWeightsUI(network: nn.Node[][], container: d3.Selection<any>) {
	for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
		let currentLayer = network[layerIdx];
		// Update all the nodes in this layer.
		for (let i = 0; i < currentLayer.length; i++) {
			let node = currentLayer[i];
			for (let j = 0; j < node.inputLinks.length; j++) {
				let link = node.inputLinks[j];
				container.select(`#link${link.source.id}-${link.dest.id}`)
					.style(
						{
							"stroke-dashoffset": -iter / 3,
							"stroke-width": linkWidthScale(Math.abs(link.weight)),
							"stroke": colorScale(link.weight)
						})
					.datum(link);
			}
		}
	}
}

/**
 * Creating link between two nodes.
 * @param startNode: Starting node of link
 * @param endNode: End node of link
 */
function createLink(startNode: nn.Node, endNode: nn.Node) {
	if (startNode.layer >= endNode.layer - 1) {
		return;
	}

	let link = new Link(startNode, endNode, state.regularization, state.initZero);
	link.isResidual = true;
	startNode.outputs.push(link);
	endNode.inputLinks.push(link);
	drawNetwork(network);
	totalCapacity = getTotalCapacity(network);
	updateUI();
}

function drawNode(cx: number, cy: number, nodeId: string, isInput: boolean, container: d3.Selection<any>, node?: nn.Node) {
	let x = cx - RECT_SIZE / 2;
	let y = cy - RECT_SIZE / 2;

	let nodeGroup = container.append("g").attr(
		{
			"class": "node",
			"id": `node${nodeId}`,
			"transform": `translate(${x},${y})`
		});

	// Draw the main rectangle.
	nodeGroup.append("rect").attr(
		{
			x: 0,
			y: 0,
			width: RECT_SIZE,
			height: RECT_SIZE,
		});

	let activeOrNotClass = state[nodeId] ? "active" : "inactive";
	if (isInput) {
		let label = INPUTS[nodeId].label != null ? INPUTS[nodeId].label : nodeId;
		// Draw the input label.
		let text = nodeGroup.append("text").attr(
			{
				class: "main-label",
				x: -10,
				y: RECT_SIZE / 2, "text-anchor": "end"
			});
		if (/[_^]/.test(label)) {
			let myRe = /(.*?)([_^])(.)/g;
			let myArray;
			let lastIndex;
			while ((myArray = myRe.exec(label)) != null) {
				lastIndex = myRe.lastIndex;
				let prefix = myArray[1];
				let sep = myArray[2];
				let suffix = myArray[3];
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
		} else {
			text.append("tspan").text(label);
		}
		nodeGroup.classed(activeOrNotClass, true);
	}
	if (!isInput) {
		// Draw the node's bias.
		nodeGroup.append("rect").attr(
			{
				id: `bias-${nodeId}`,
				x: -BIAS_SIZE - 2,
				y: RECT_SIZE - BIAS_SIZE + 3,
				width: BIAS_SIZE,
				height: BIAS_SIZE,
			})
			.on("mouseenter", function () {
				updateHoverCard(HoverType.BIAS, node, d3.mouse(container.node()));
			})
			.on("mouseleave", function () {
				updateHoverCard(null);
			});
	}

	// Draw the node's canvas.
	let div = d3.select("#network").insert("div", ":first-child").attr(
		{
			"id": `canvas-${nodeId}`,
			"class": "canvas"
		})
		.style(
			{
				position: "absolute",
				left: `${x + 3}px`,
				top: `${y + 3}px`
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
				} else {
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
			} else {
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
	let nodeHeatMap = new HeatMap(RECT_SIZE, DENSITY / 10, xDomain, xDomain, div, {noSvg: true});
	div.datum({heatmap: nodeHeatMap, id: nodeId});
}

// Draw network
function drawNetwork(network: nn.Node[][]): void {
	let svg = d3.select("#svg");
	// Remove all svg elements.
	svg.select("g.core").remove();
	// Remove all div elements.
	d3.select("#network").selectAll("div.canvas").remove();
	d3.select("#network").selectAll("div.plus-minus-neurons").remove();

	// Get the width of the svg container.
	let padding = 3;
	let co = d3.select(".column.output").node() as HTMLDivElement;
	let cf = d3.select(".column.features").node() as HTMLDivElement;
	let width = co.offsetLeft - cf.offsetLeft;
	svg.attr("width", width);

	// Map of all node coordinates.
	let node2coord: { [id: string]: { cx: number, cy: number } } = {};
	let container = svg.append("g")
		.classed("core", true)
		.attr("transform", `translate(${padding},${padding})`);
	// Draw the network layer by layer.
	let numLayers = network.length;
	let featureWidth = 118;
	let layerScale = d3.scale.ordinal<number, number>()
		.domain(d3.range(1, numLayers - 1))
		.rangePoints([featureWidth, width - RECT_SIZE], 0.7);
	let nodeIndexScale = (nodeIndex: number) => nodeIndex * (RECT_SIZE + 25);


	let calloutThumb = d3.select(".callout.thumbnail").style("display", "none");
	let calloutWeights = d3.select(".callout.weights").style("display", "none");
	let idWithCallout = null;
	let targetIdWithCallout = null;

	// Draw the input layer separately.
	let cx = RECT_SIZE / 2 + 50;
	let nodeIds = Object.keys(INPUTS);
	let maxY = nodeIndexScale(nodeIds.length);
	let activeNodeIndices = network[0].reduce((obj, node, i) => {
		obj[node.id] = i;
		return obj;
	}, {});
	nodeIds.forEach((nodeId, i) => {
		let nodeIdx = activeNodeIndices[nodeId];
		let node = network[0][nodeIdx];
		let cy = nodeIndexScale(i) + RECT_SIZE / 2;
		node2coord[nodeId] = {cx, cy};
		drawNode(cx, cy, nodeId, true, container, node);
	});

	// Draw the intermediate layers.
	for (let layerIdx = 1; layerIdx < numLayers - 1; layerIdx++) {
		let numNodes = network[layerIdx].length;
		let cx = layerScale(layerIdx) + RECT_SIZE / 2;
		maxY = Math.max(maxY, nodeIndexScale(numNodes));
		addPlusMinusControl(layerScale(layerIdx), layerIdx);
		for (let i = 0; i < numNodes; i++) {
			let node = network[layerIdx][i];
			let cy = nodeIndexScale(i) + RECT_SIZE / 2;
			node2coord[node.id] = {cx, cy};
			drawNode(cx, cy, node.id, false, container, node);

			// Show callout to thumbnails.
			let numNodes = network[layerIdx].length;
			let nextNumNodes = network[layerIdx + 1].length;
			if (idWithCallout == null &&
				i === numNodes - 1 &&
				nextNumNodes <= numNodes) {
				calloutThumb.style(
					{
						display: null,
						top: `${20 + 3 + cy}px`,
						left: `${cx}px`
					});
				idWithCallout = node.id;
			}

			// Draw links.
			for (let j = 0; j < node.inputLinks.length; j++) {
				let link = node.inputLinks[j];
				let path: SVGPathElement = drawLink(link, node2coord, network,
					container, j === 0, j, node.inputLinks.length).node() as any;
				// Show callout to weights.
				let prevLayer = network[layerIdx - 1];
				let lastNodePrevLayer = prevLayer[prevLayer.length - 1];
				if (targetIdWithCallout == null &&
					i === numNodes - 1 &&
					link.source.id === lastNodePrevLayer.id &&
					(link.source.id !== idWithCallout || numLayers <= 5) &&
					link.dest.id !== idWithCallout &&
					prevLayer.length >= numNodes) {
					let midPoint = path.getPointAtLength(path.getTotalLength() * 0.7);
					calloutWeights.style(
						{
							display: null,
							top: `${midPoint.y + 5}px`,
							left: `${midPoint.x + 3}px`
						});
					targetIdWithCallout = link.dest.id;
				}
			}
		}
	}

	// Draw the output node separately.
	cx = width + RECT_SIZE / 2;
	let node = network[numLayers - 1][0];
	let cy = nodeIndexScale(0) + RECT_SIZE / 2;
	node2coord[node.id] = {cx, cy};
	// Draw links.
	for (let i = 0; i < node.inputLinks.length; i++) {
		let link = node.inputLinks[i];
		drawLink(link, node2coord, network, container, i === 0, i,
			node.inputLinks.length);
	}
	// Adjust the height of the svg.
	svg.attr("height", maxY);

	// Adjust the height of the features column.
	let height = Math.max(
		getRelativeHeight(calloutThumb),
		getRelativeHeight(calloutWeights),
		getRelativeHeight(d3.select("#network"))
	);
	d3.select(".column.features").style("height", height + "px");
}

function getRelativeHeight(selection: d3.Selection<any>) {
	let node = selection.node() as HTMLAnchorElement;
	return node.offsetHeight + node.offsetTop;
}

function addPlusMinusControl(x: number, layerIdx: number) {
	let div = d3.select("#network").append("div")
		.classed("plus-minus-neurons", true)
		.style("left", `${x - 10}px`);

	let i = layerIdx - 1;
	let firstRow = div.append("div").attr("class", `ui-numNodes${layerIdx}`);
	firstRow.append("button")
		.attr("class", "mdl-button mdl-js-button mdl-button--icon")
		.on("click", () => {
			let numNeurons = state.networkShape[i];
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
		.on("click", () => {
			let numNeurons = state.networkShape[i];
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

	let suffix = state.networkShape[i] > 1 ? "s" : "";
	div.append("div").text(state.networkShape[i] + " neuron" + suffix);
}

function updateHoverCard(type: HoverType, nodeOrLink?: nn.Node | nn.Link, coordinates?: [number, number]) {
	let hovercard = d3.select("#hovercard");
	if (type == null) {
		hovercard.style("display", "none");
		d3.select("#svg").on("click", null);
		return;
	}
	d3.select("#svg").on("click", () => {
		hovercard.select(".value").style("display", "none");
		let input = hovercard.select("input");
		input.style("display", null);
		input.on("input", function () {
			if (this.value != null && this.value !== "") {
				if (type === HoverType.WEIGHT) {
					(nodeOrLink as nn.Link).weight = +this.value;
				} else {
					(nodeOrLink as nn.Node).bias = +this.value;
				}
				updateUI();
			}
		});
		input.on("keypress", () => {
			if ((d3.event as any).keyCode === 13) {
				updateHoverCard(type, nodeOrLink, coordinates);
			}
		});
		(input.node() as HTMLInputElement).focus();
	});
	let value = (type === HoverType.WEIGHT) ?
		(nodeOrLink as nn.Link).weight :
		(nodeOrLink as nn.Node).bias;
	let name = (type === HoverType.WEIGHT) ? "Weight" : "Bias";
	hovercard.style(
		{
			"left": `${coordinates[0] + 20}px`,
			"top": `${coordinates[1]}px`,
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

function drawLink(
	input: nn.Link, node2coord: { [id: string]: { cx: number, cy: number } },
	network: nn.Node[][], container: d3.Selection<any>,
	isFirst: boolean, index: number, length: number) {
	let line = container.insert("path", ":first-child");
	let source = node2coord[input.source.id];
	let dest = node2coord[input.dest.id];
	let datum = {
		source:
			{
				y: source.cx + RECT_SIZE / 2 + 2,
				x: source.cy
			},
		target:
			{
				y: dest.cx - RECT_SIZE / 2,
				x: dest.cy + ((index - (length - 1) / 2) / length) * 12
			}
	};
	let diagonal = d3.svg.diagonal().projection(d => [d.y, d.x]);
	line.attr(
		{
			"marker-start": "url(#markerArrow)",
			class: "link",
			id: "link" + input.source.id + "-" + input.dest.id,
			d: diagonal(datum, 0)
		});

	// Add an invisible thick link that will be used for
	// showing the weight value on hover.
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

/**
 * Given a link, reactivates it if dead or sets it's weight to zero and kills it
 * @param link: A link in a neural network
 * @param coordinates: Mouse coordinates
 */
function deactivateActivateLink(link: nn.Link, coordinates?: [number, number]) {
	if (link.isDead) {
		link.weight = 1;
		link.isDead = false;
		updateHoverCard(HoverType.WEIGHT, link, coordinates);
		updateUI();
	} else {
		link.weight = 0;
		link.isDead = true;
		updateHoverCard(HoverType.WEIGHT, link, coordinates);
		totalCapacity = getTotalCapacity(network);
		updateUI();
	}
}

/**
 * Given a neural network, it asks the network for the output (prediction)
 * of every node in the network using inputs sampled on a square grid.
 * It returns a map where each key is the node ID and the value is a square
 * matrix of the outputs of the network for each input in the grid respectively.
 */

function updateDecisionBoundary(network: nn.Node[][], firstTime: boolean) {
	if (firstTime) {
		boundary = {};
		nn.forEachNode(network, true, node => {
			boundary[node.id] = new Array(DENSITY);
		});
		// Go through all predefined inputs.
		for (let nodeId in INPUTS) {
			boundary[nodeId] = new Array(DENSITY);
		}
	}
	let xScale = d3.scale.linear().domain([0, DENSITY - 1]).range(xDomain);
	let yScale = d3.scale.linear().domain([DENSITY - 1, 0]).range(xDomain);

	let i = 0, j = 0;
	for (i = 0; i < DENSITY; i++) {
		if (firstTime) {
			nn.forEachNode(network, true, node => {
				boundary[node.id][i] = new Array(DENSITY);
			});
			// Go through all predefined inputs.
			for (let nodeId in INPUTS) {
				boundary[nodeId][i] = new Array(DENSITY);
			}
		}
		for (j = 0; j < DENSITY; j++) {
			// 1 for points inside the circle, and 0 for points outside the circle.
			let x = xScale(i);
			let y = yScale(j);
			let input = constructInput(x, y);
			nn.forwardProp(network, input);
			nn.forEachNode(network, true, node => {
				boundary[node.id][i][j] = node.output;
			});
			if (firstTime) {
				// Go through all predefined inputs.
				for (let nodeId in INPUTS) {
					boundary[nodeId][i][j] = INPUTS[nodeId].f(x, y);
				}
			}
		}
	}
}

function anyAliveOutputLinks(node: Node): boolean {
	let link: Link;
	for (link of node.outputs) {
		if (!link.isDead && !link.isResidual) {
			return true;
		}
	}
	return false;
}

function anyAliveInputLinks(node: Node): boolean {
	let link: Link;
	for (link of node.inputLinks) {
		if (!link.isDead && !link.isResidual) {
			return true;
		}
	}
	return false;
}


function getUniqueInNodes(layer: nn.Node[], isOutputNode: boolean = false): nn.Node[] {
	let uniqueInNodes: nn.Node[] = [];
	for (let node of layer) {
		if (anyAliveOutputLinks(node) || isOutputNode) { // Node is alive and produces output
			let inLinks = node.inputLinks;
			let link: Link;
			for (link of inLinks) {
				if (!link.isResidual && !link.isDead && (link.source.layer === 0 || anyAliveInputLinks(link.source))) {
					let inNode: Node = link.source;
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
	for (let e of array) {
		if (e[0] == candidate[0] && e[1] == candidate[1]) {
			return true;
		}
	}
	return false;
}

function getTotalCapacity(network: nn.Node[][]): number {
	let totalCapacity: number = 0;
	let [propogatedInformation, aliveNodes] = getPropogatedInformation(network);
	let firstLayer = network[1];
	for (let i = 0; i < firstLayer.length; i++) {
		let node: Node = firstLayer[i];
		if (anyAliveOutputLinks(node) || 1 == network.length - 1) { // Node is alive and produces output
			totalCapacity += getUniqueInNodes([node], 1 === network.length - 1).length + 1;
		}
	}
	let usedResidualLayers = [];
	for (let layerIdx = 0; layerIdx < network.length; layerIdx++) {
		for (let node of network[layerIdx]) {
			let outputLinks: Link[] = node.outputs;
			const residualLinks: Link[] = outputLinks.filter(function (link) {
				return link.isResidual && !link.isDead;
			});
			residualLinks.sort((a, b) => a.dest.layer - b.dest.layer);
			for (let link of residualLinks) {
				if (isInArray([link.source, link.dest.layer], usedResidualLayers)) {
					continue;
				}
				let destIdx = link.dest.layer - 1;
				propogatedInformation[destIdx] += 1;
				for (let j = destIdx + 1; j < propogatedInformation.length; j++) {
					console.log(j, aliveNodes[j], propogatedInformation[j]);
					if (aliveNodes[j] > propogatedInformation[j]) {
						propogatedInformation[j] += 1;
					} else {
						break;
					}
				}
				usedResidualLayers.push([link.source, link.dest.layer]);
			}
		}
	}
	totalCapacity += propogatedInformation.slice(1).reduce((a, b) => a + b, 0);
	return totalCapacity;
}

function getPropogatedInformation(network: nn.Node[][]): number[][] {
	let propogatedInformation = [];
	let aliveNodes = [];
	for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
		let curLayerCapacity = 0;
		let currentLayer = network[layerIdx];
		if (1 === layerIdx) {
			for (let i = 0; i < currentLayer.length; i++) {
				let node: Node = currentLayer[i];
				if (anyAliveOutputLinks(node) || layerIdx == network.length - 1) { // Node is alive and produces output
					curLayerCapacity += 1;
				}
			}
			aliveNodes.push(curLayerCapacity);
			propogatedInformation.push(curLayerCapacity);
		} else {
			let uniqueInNodes: nn.Node[] = getUniqueInNodes(currentLayer, layerIdx === network.length - 1);
			let minLayer = uniqueInNodes.length;
			aliveNodes.push(minLayer);
			for (let i = 1; i < layerIdx; i++) {
				let uniqueInNodes: nn.Node[] = getUniqueInNodes(network[i], false);
				let tempMinLayer = uniqueInNodes.length;
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


function getLearningRate(network: nn.Node[][]): number {
	let trueLearningRate = 0;

	for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
		let curLayerCapacity = 0;
		let currentLayer = network[layerIdx];

		// Update all the nodes in this layer.
		for (let i = 0; i < currentLayer.length; i++) {
			let node = currentLayer[i];
			trueLearningRate += node.trueLearningRate;

		}
	}
	return trueLearningRate;
}

function getLoss(network: nn.Node[][], dataPoints: Example2D[]): number {
	let loss = 0;
	for (let i = 0; i < dataPoints.length; i++) {
		let dataPoint = dataPoints[i];
		let input = constructInput(dataPoint.x, dataPoint.y);
		let output = nn.forwardProp(network, input);
		loss += nn.Errors.SQUARE.error(output, dataPoint.label);
	}
	return loss / dataPoints.length * 100;
}

function getNumberOfCorrectClassifications(network: nn.Node[][], dataPoints: Example2D[]): number {
	let correctlyClassified = 0;
	for (let i = 0; i < dataPoints.length; i++) {
		let dataPoint = dataPoints[i];
		let input = constructInput(dataPoint.x, dataPoint.y);
		let output = nn.forwardProp(network, input);
		let prediction = (output > 0) ? 1 : -1;
		let correct = (prediction === dataPoint.label) ? 1 : 0;
		correctlyClassified += correct;
	}

	return correctlyClassified;
}

function getNumberOfEachClass(dataPoints: Example2D[]): number[] {
	let firstClass: number = 0;
	let secondClass: number = 0;
	for (let i = 0; i < dataPoints.length; i++) {
		let dataPoint = dataPoints[i];
		firstClass += (dataPoint.label === -1) ? 1 : 0;
		secondClass += (dataPoint.label === 1) ? 1 : 0;
	}
	return [firstClass, secondClass];
}

function getAccuracyForEachClass(network: nn.Node[][], dataPoints: Example2D[]): number[] {
	let firstClassCorrect: number = 0;
	let secondClassCorrect: number = 0;
	for (let i = 0; i < dataPoints.length; i++) {
		let dataPoint = dataPoints[i];
		let input = constructInput(dataPoint.x, dataPoint.y);
		let output = nn.forwardProp(network, input);
		let prediction = (output > 0) ? 1 : -1;
		let isCorrect = prediction === dataPoint.label;
		if (isCorrect) {
			if (dataPoint.label === -1) {
				firstClassCorrect += 1;
			} else {
				secondClassCorrect += 1;
			}
		}

	}
	let classesCount: number[] = getNumberOfEachClass(dataPoints);
	return [firstClassCorrect / classesCount[0], secondClassCorrect / classesCount[1]];
}


function updateUI(firstStep = false) {
	// Update the links visually.
	updateWeightsUI(network, d3.select("g.core"));
	// Update the bias values visually.
	updateBiasesUI(network);
	// Get the decision boundary of the network.
	updateDecisionBoundary(network, firstStep);
	let selectedId = selectedNodeId != null ?
		selectedNodeId : nn.getOutputNode(network).id;
	heatMap.updateBackground(boundary[selectedId], state.discretize);

	// Update all decision boundaries.
	d3.select("#network").selectAll("div.canvas")
		.each(function (data: { heatmap: HeatMap, id: string }) {
			data.heatmap.updateBackground(reduceMatrix(boundary[data.id], 10), state.discretize);
		});

	function zeroPad(n: number): string {
		let pad = "000000";
		return (pad + n).slice(-pad.length);
	}

	function addCommas(s: string): string {
		return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	function humanReadable(n: number, k = 4): string {
		return n.toFixed(k);
	}

	function humanReadableInt(n: number): string {
		return n.toFixed(0);
	}

	// Update true learning rate loss and iteration number.
	// These are all bit rates, hence they are channel signals
	let numberOfCorrectTrainClassifications: number = getNumberOfCorrectClassifications(network, trainData);
	let numberOfCorrectTestClassifications: number = getNumberOfCorrectClassifications(network, testData);
	generalization = (numberOfCorrectTrainClassifications + numberOfCorrectTestClassifications) / totalCapacity;

	let bitLossTest = lossTest;
	let bitLossTrain = lossTrain;
	let bitGeneralization = generalization;

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

function constructInputIds(): string[] {
	let result: string[] = [];
	for (let inputName in INPUTS) {
		if (state[inputName]) {
			result.push(inputName);
		}
	}
	return result;
}

function constructInput(x: number, y: number): number[] {
	let input: number[] = [];
	for (let inputName in INPUTS) {
		if (state[inputName]) {
			input.push(INPUTS[inputName].f(x, y));
		}
	}
	return input;
}

function oneStep(): void {
	iter++;
	trainData.forEach((point, i) => {
		let input = constructInput(point.x, point.y);
		nn.forwardProp(network, input);
		nn.backProp(network, point.label, nn.Errors.SQUARE);
		if ((i + 1) % state.batchSize === 0) {
			nn.updateWeights(network, state.learningRate, state.regularizationRate);
		}
	});

	// Compute the loss.
	trueLearningRate = getLearningRate(network);
	totalCapacity = getTotalCapacity(network);

	lossTrain = getLoss(network, trainData);
	lossTest = getLoss(network, testData);

	trainClassesAccuracy = getAccuracyForEachClass(network, trainData);
	testClassesAccuracy = getAccuracyForEachClass(network, testData);

	updateUI();
}

export function getOutputWeights(network: nn.Node[][]): number[] {
	let weights: number[] = [];
	for (let layerIdx = 0; layerIdx < network.length - 1; layerIdx++) {
		let currentLayer = network[layerIdx];
		for (let i = 0; i < currentLayer.length; i++) {
			let node = currentLayer[i];
			for (let j = 0; j < node.outputs.length; j++) {
				let output = node.outputs[j];
				weights.push(output.weight);
			}
		}
	}
	return weights;
}

function reset(onStartup = false) {
	lineChart.reset();
	state.serialize();
	if (!onStartup) {
		userHasInteracted();
	}
	player.pause();

	let suffix = state.numHiddenLayers !== 1 ? "s" : "";
	d3.select("#layers-label").text("Hidden layer" + suffix);
	d3.select("#num-layers").text(state.numHiddenLayers);


	// Make a simple network.
	iter = 0;
	let numInputs = constructInput(0, 0).length;
	let shape = [numInputs].concat(state.networkShape).concat([1]);
	let outputActivation = (state.problem === Problem.REGRESSION) ?
		nn.Activations.LINEAR : nn.Activations.TANH;
	network = nn.buildNetwork(shape, state.activation, outputActivation,
		state.regularization, constructInputIds(), state.initZero);
	trueLearningRate = getLearningRate(network);
	totalCapacity = getTotalCapacity(network);
	lossTest = getLoss(network, testData);
	lossTrain = getLoss(network, trainData);

	let numberOfCorrectTrainClassifications: number = getNumberOfCorrectClassifications(network, trainData);
	let numberOfCorrectTestClassifications: number = getNumberOfCorrectClassifications(network, testData);

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
	// Remove all other text.
	d3.selectAll("article div.l--body").remove();
	let tutorial = d3.select("article").append("div")
		.attr("class", "l--body");
	// Insert tutorial text.
	d3.html(`tutorials/${state.tutorial}.html`, (err, htmlFragment) => {
		if (err) {
			throw err;
		}
		tutorial.node().appendChild(htmlFragment);
		// If the tutorial has a <title> tag, set the page title to that.
		let title = tutorial.select("title");
		if (title.size()) {
			d3.select("header h1").style(
				{
					"margin-top": "20px",
					"margin-bottom": "20px",
				})
				.text(title.text());
			document.title = title.text();
		}
	});
}

function renderThumbnail(canvas, dataGenerator) {
	let w = 100;
	let h = 100;
	canvas.setAttribute("width", w);
	canvas.setAttribute("height", h);
	let context = canvas.getContext("2d");
	let data = dataGenerator(200, 50); // NPOINTS, NOISE

	data.forEach(
		function (d) {
			context.fillStyle = colorScale(d.label);
			context.fillRect(w * (d.x + 6) / 12, h * (-d.y + 6) / 12, 4, 4);
		});
	d3.select(canvas.parentNode).style("display", null);
}

function renderBYODThumbnail(canvas) {
	canvas.setAttribute("width", 100);
	canvas.setAttribute("height", 100);
	let context = canvas.getContext("2d");
	const plusSvg = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><title>add</title><path d=\"M18.984 12.984h-6v6h-1.969v-6h-6v-1.969h6v-6h1.969v6h6v1.969z\"></path></svg>";
	const img = new Image();
	const svg = new Blob([plusSvg], {type: "image/svg+xml"});
	const url = URL.createObjectURL(svg);

	img.src = url;

	img.onload = function (e) {
		context.drawImage(img, 25, 25, 50, 50);
		URL.revokeObjectURL(url);
	};
	d3.select(canvas.parentNode).style("display", null);
}

function drawDatasetThumbnails() {
	d3.selectAll(".dataset").style("display", "none");

	if (state.problem === Problem.CLASSIFICATION) {
		for (let dataset in datasets) {
			let canvas: any = document.querySelector(`canvas[data-dataset=${dataset}]`);
			let dataGenerator = datasets[dataset];

			if (dataset === "byod") {
				renderBYODThumbnail(canvas);
				continue;
			}
			renderThumbnail(canvas, dataGenerator);


		}
	}
	if (state.problem === Problem.REGRESSION) {
		for (let regDataset in regDatasets) {
			let canvas: any =
				document.querySelector(`canvas[data-regDataset=${regDataset}]`);
			let dataGenerator = regDatasets[regDataset];
			renderThumbnail(canvas, dataGenerator);
		}
	}
}

function hideControls() {
	// Set display:none to all the UI elements that are hidden.
	let hiddenProps = state.getHiddenProps();
	hiddenProps.forEach(prop => {
		let controls = d3.selectAll(`.ui-${prop}`);
		if (controls.size() === 0) {
			console.warn(`0 html elements found with class .ui-${prop}`);
		}
		controls.style("display", "none");
	});

	// Also add checkbox for each hidable control in the "use it in classrom"
	// section.
	let hideControls = d3.select(".hide-controls");
	HIDABLE_CONTROLS.forEach(([text, id]) => {
		let label = hideControls.append("label")
			.attr("class", "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect");
		let input = label.append("input")
			.attr(
				{
					type: "checkbox",
					class: "mdl-checkbox__input",
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

function generateData(firstTime = false) {
	if (!firstTime) {
		// Change the seed.
		state.seed = Math.random().toFixed(8);
		state.serialize();
		userHasInteracted();
	}
	Math.seedrandom(state.seed);
	let numSamples = (state.problem === Problem.REGRESSION) ?
		NUM_SAMPLES_REGRESS : NUM_SAMPLES_CLASSIFY;

	let generator;
	let data: Example2D[] = [];
	// tslint:disable-next-line:indent

	if (state.byod) {
		data = trainData.concat(testData);
	}

	if (!state.byod) {
		generator = state.problem === Problem.CLASSIFICATION ? state.dataset : state.regDataset;
		data = generator(numSamples, state.noise);
	}

	// Shuffle and split into train and test data.
	shuffle(data);
	let splitIndex = Math.floor(data.length * state.percTrainData / 100);
	trainData = data.slice(0, splitIndex);
	testData = data.slice(splitIndex);

	let classDist = getNumberOfEachClass(trainData).map((num) => num / trainData.length);
	state.sugCapacity = getReqCapacity(trainData)[0];
	state.maxCapacity = getReqCapacity(trainData)[1];

	d3.select("label[for='maxCapacity'] .value").text(state.maxCapacity);
	d3.select("label[for='sugCapacity'] .value").text(state.sugCapacity);
	d3.select("label[for='dataOverfit'] .value").text(numberOfUnique(trainData));
	d3.select("label[for='dataDistribution'] .value")
		.text(`${classDist[0].toFixed(3)}, ${classDist[1].toFixed(3)}`);

	heatMap.updatePoints(trainData);
	heatMap.updateTestPoints(state.showTestData ? testData : []);

}

let firstInteraction = true;
let parametersChanged = false;

function userHasInteracted() {
	if (!firstInteraction) {
		return;
	}
	firstInteraction = false;
	let page = "index";
	if (state.tutorial != null && state.tutorial !== "") {
		page = `/v/tutorials/${state.tutorial}`;
	}
	ga("set", "page", page);
	ga("send", "pageview", {"sessionControl": "start"});
}

function simulationStarted() {
	ga("send",
		{
			hitType: "event",
			eventCategory: "Starting Simulation",
			eventAction: parametersChanged ? "changed" : "unchanged",
			eventLabel: state.tutorial == null ? "" : state.tutorial
		});
	parametersChanged = false;
}

function simulateClick(elem /* Must be the element, not d3 selection */) {
	let evt = document.createEvent("MouseEvents");
	evt.initMouseEvent(
		"click", /* type */
		true, /* canBubble */
		true, /* cancelable */
		window, /* view */
		0, /* detail */
		0, /* screenX */
		0, /* screenY */
		0, /* clientX */
		0, /* clientY */
		false, /* ctrlKey */
		false, /* altKey */
		false, /* shiftKey */
		false, /* metaKey */
		0, /* button */
		null);
	/* relatedTarget */
	elem.dispatchEvent(evt);
}


drawDatasetThumbnails();
// initTutorial();
makeGUI();
generateData(true);
reset(true);
hideControls();
