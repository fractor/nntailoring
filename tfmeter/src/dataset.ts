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

/**
 * A two dimensional example: x and y coordinates with the label.
 */
export type Example2D = {
	x: number,
	y: number,
	label: number
};

type Point = {
		x: number,
		y: number
	};

export type DataGenerator = (numSamples: number, noise: number) => Example2D[];

interface HTMLInputEvent extends Event {
	target: HTMLInputElement & EventTarget;
}

/********************************************************************************/

// CLASSIFICATION

/********************************************************************************/

/********************************************************************************/

// Bring Your Own Data

/********************************************************************************/

export function classifyBYOData(numSamples: number, noise: number): Example2D[] {
	let points: Example2D[] = [];
	// AWG Noise Variance = Signal / 10^(SNRdB/10)
	// ~ var dNoise = dSNR(noise);

	// ~ var data;

	// ~ var inputBYOD = d3.select("#inputFileBYOD");
	// ~ inputBYOD.on("change", function(e) //: Example2D[]
	// ~ {
	// ~ var reader = new FileReader();
	// ~ var name = this.files[0].name;
	// ~ reader.readAsText(this.files[0]);
	// ~ reader.onload = function(event)
	// ~ {
	// ~ var target: any = event.target;
	// ~ data = target.result;
	// ~ let s = data.split("\n");
	// ~ for (let i = 0; i < s.length; i++)
	// ~ {
	// ~ let ss = s[i].split(",");
	// ~ if (ss.length != 3) break;
	// ~ let x = ss[0];
	// ~ let y = ss[1];
	// ~ let label = ss[2];
	// ~ points.push({x,y,label});
	// ~ console.log(points[i].x+","+points[i].y+","+points[i].label);
	// ~ }
	// ~ console.log("81 dataset.ts: points.length = " + points.length);
	// ~ };
	// ~ console.log("83 dataset.ts: points.length = " + points.length);
	// ~ });
	// ~ console.log("85 filename: " + name);
	// ~ console.log("86 dataset.ts: points.length = " + points.length);
	return points;
}

/********************************************************************************/

// CLASSIFY GAUSSIAN CLUSTERS

/********************************************************************************/

export function classifyTwoGaussData(numSamples: number, noise: number): Example2D[] {
	let points: Example2D[] = [];
	let variance = 0.5;

	// AWG Noise Variance = Signal / 10^(SNRdB/10)
	let dNoise = dSNR(noise);

	function genGauss(cx: number, cy: number, label: number) {
		for (let i = 0; i < numSamples / 2; i++) {
			let noiseX = normalRandom(0, variance * dNoise);
			let noiseY = normalRandom(0, variance * dNoise);
			let signalX = normalRandom(cx, variance);
			let signalY = normalRandom(cy, variance);
			let x = signalX + noiseX;
			let y = signalY + noiseY;
			points.push({x, y, label});
		}
	}

	genGauss(2, 2, 1); // Gaussian with positive examples.
	genGauss(-2, -2, -1); // Gaussian with negative examples.
	return points;
}

/********************************************************************************/
// CLASSIFY SPIRAL
/********************************************************************************/

export function classifySpiralData(numSamples: number, noise: number): Example2D[] {

	// AWG Noise Variance = Signal / 10^(SNRdB/10)
	let dNoise = dSNR(noise);

	let points: Example2D[] = [];
	let n = numSamples / 2;

	function genSpiral(deltaT: number, label: number) {
		for (let i = 0; i < n; i++) {
			let r = i / n * 5;
			let r2 = r * r;
			let t = 1.75 * i / n * 2 * Math.PI + deltaT;
			let noiseX = normalRandom(0, r * dNoise);
			let noiseY = normalRandom(0, r * dNoise);
			let x = r * Math.sin(t) + noiseX;
			let y = r * Math.cos(t) + noiseY;
			points.push({x, y, label});
		}
	}

	genSpiral(0, 1); // Positive examples.
	genSpiral(Math.PI, -1); // Negative examples.
	return points;
}

/********************************************************************************/
// CLASSIFY CIRCLE
/********************************************************************************/
export function classifyCircleData(numSamples: number, noise: number): Example2D[] {
	// AWG Noise Variance = Signal / 10^(SNRdB/10)
	let dNoise = dSNR(noise);

	let points: Example2D[] = [];
	let radius = 5;

	// Generate positive points inside the circle.
	for (let i = 0; i < numSamples / 2; i++) {
		let r = randUniform(0, radius * 0.5);
		// We assume r^2 as the variance of the Signal
		let r2 = r * r;
		let angle = randUniform(0, 2 * Math.PI);
		let x = r * Math.sin(angle);
		let y = r * Math.cos(angle);
		let noiseX = normalRandom(0, 1 / radius * dNoise);
		let noiseY = normalRandom(0, 1 / radius * dNoise);
		x += noiseX;
		y += noiseY;
		let label = 1;
		points.push({x, y, label});
	}

	// Generate negative points outside the circle.
	for (let i = 0; i < numSamples / 2; i++) {
		let r = randUniform(radius * 0.7, radius);

		// We assume r^2 as the variance of the Signal
		let rr2 = r * r;
		let angle = randUniform(0, 2 * Math.PI);
		let x = r * Math.sin(angle);
		let y = r * Math.cos(angle);
		let noiseX = normalRandom(0, 1 / radius * dNoise);
		let noiseY = normalRandom(0, 1 / radius * dNoise);
		x += noiseX;
		y += noiseY;
		let label = -1;
		points.push({x, y, label});
	}
	return points;
}

/********************************************************************************/
// CLASSIFY XOR
/********************************************************************************/
export function classifyXORData(numSamples: number, noise: number): Example2D[] {
	// AWG Noise Variance = Signal / 10^(SNRdB/10)
	let dNoise = dSNR(noise);

	// Standard deviation of the signal
	let stdSignal = 5;

	function getXORLabel(p: Point) {
		return p.x * p.y >= 0 ? 1 : -1;
	}

	let points: Example2D[] = [];
	for (let i = 0; i < numSamples; i++) {
		let x = randUniform(-stdSignal, stdSignal);
		let padding = 0.3;
		x += x > 0 ? padding : -padding;  // Padding.
		let y = randUniform(-stdSignal, stdSignal);
		y += y > 0 ? padding : -padding;

		let varianceSignal = stdSignal * stdSignal;
		let noiseX = normalRandom(0, varianceSignal * dNoise);
		let noiseY = normalRandom(0, varianceSignal * dNoise);
		let label = getXORLabel({x: x + noiseX, y: y + noiseY});
		points.push({x, y, label});
	}
	return points;
}

/********************************************************************************/
// REGRESSION
/********************************************************************************/

export function regressPlane(numSamples: number, noise: number): Example2D[] {
	let dNoise = dSNR(noise);
	let radius = 6;
	let r2 = radius * radius;
	let labelScale = d3.scale.linear()
		.domain([-10, 10])
		.range([-1, 1]);
	let getLabel = (x, y) => labelScale(x + y);

	let points: Example2D[] = [];
	for (let i = 0; i < numSamples; i++) {
		let x = randUniform(-radius, radius);
		let y = randUniform(-radius, radius);
		let noiseX = normalRandom(0, r2 * dNoise);
		let noiseY = normalRandom(0, r2 * dNoise);
		let label = getLabel(x + noiseX, y + noiseY);
		points.push({x, y, label});
	}
	return points;
}

export function regressGaussian(numSamples: number, noise: number): Example2D[] {
	let dNoise = dSNR(noise);

	let points: Example2D[] = [];
	let labelScale = d3.scale.linear()
		.domain([0, 2])
		.range([1, 0])
		.clamp(true);

	let gaussians =
		[
			[-4, 2.5, 1],
			[0, 2.5, -1],
			[4, 2.5, 1],
			[-4, -2.5, -1],
			[0, -2.5, 1],
			[4, -2.5, -1]
		];

	function getLabel(x, y) {
		// Choose the one that is maximum in abs value.
		let label = 0;
		gaussians.forEach(([cx, cy, sign]) => {
			let newLabel = sign * labelScale(dist({x, y}, {x: cx, y: cy}));
			if (Math.abs(newLabel) > Math.abs(label)) {
				label = newLabel;
			}
		});
		return label;
	}

	let radius = 6;
	let r2 = radius * radius;
	for (let i = 0; i < numSamples; i++) {
		let x = randUniform(-radius, radius);
		let y = randUniform(-radius, radius);
		let noiseX = normalRandom(0, r2 * dNoise);
		let noiseY = normalRandom(0, r2 * dNoise);
		let label = getLabel(x + noiseX, y + noiseY);
		points.push({x, y, label});
	}

	return points;
}

/********************************************************************************/
// ACCESSORY FUNCTIONS
/********************************************************************************/
/**
 * Shuffles the array using Fisher-Yates algorithm. Uses the seedrandom
 * library as the random generator.
 */
export function shuffle(array: any[]): void {
	let counter = array.length;
	let temp = 0;
	let index = 0;
	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		index = Math.floor(Math.random() * counter);
		// Decrease counter by 1
		counter--;
		// And swap the last element with it
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
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

function dSNR(x: number): number {
	return 1 / Math.pow(10, x / 10);
}

/**
 * Returns a sample from a uniform [a, b] distribution.
 * Uses the seedrandom library as the random generator.
 */
function randUniform(a: number, b: number) {
	return Math.random() * (b - a) + a;
}

/**
 * Samples from a normal distribution. Uses the seedrandom library as the
 * random generator.
 *
 * @param mean The mean. Default is 0.
 * @param variance The variance. Default is 1.
 */
function normalRandom(mean = 0, variance = 1): number {
	let v1: number, v2: number, s: number;
	do {
		v1 = 2 * Math.random() - 1;
		v2 = 2 * Math.random() - 1;
		s = v1 * v1 + v2 * v2;
	} while (s > 1);

	let result = Math.sqrt(-2 * Math.log(s) / s) * v1;
	return mean + Math.sqrt(variance) * result;
}

/** Returns the euclidean distance between two points in space. */
function dist(a: Point, b: Point): number {
	let dx = a.x - b.x;
	let dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}
