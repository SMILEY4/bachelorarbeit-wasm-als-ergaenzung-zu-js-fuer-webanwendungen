import { Vector } from './vector.js';
import { Camera } from './camera.js';
import { Sphere } from './sphere.js';
import { Scene } from './scene.js';
import { Ray } from './ray.js';
import { Intersection } from './intersection.js';
import { Renderer } from './renderer.js';
import {printRayCount} from "./raycount.js"


let scene = null;
let pixelData = null;
let context = null;


export function setup(width, height, maxDepth, canvasId) {
	scene = Scene.createDefault(width, height, maxDepth);
	scene.addRandomObjects();

	pixelData = new Uint8ClampedArray(width * height * 4);

	const canvas = document.getElementById(canvasId);
	context = canvas.getContext("2d");
	canvas.width = width;
	canvas.height = height;
}


export function render() {
	const renderer = Renderer.create(scene);
	for(let y = 0; y < scene.height; y++) {
		for(let  x = 0; x < scene.width; x++) {
			const color = renderer.renderPixel(scene, x, y);
			setPixel(x, y, color);
		}
	}
	context.putImageData(new ImageData(pixelData, scene.width, scene.height), 0, 0);
}


function setPixel(x, y, color) {
	const index = ((x + y * scene.height) * 4);
	pixelData[index + 0] = Math.max(0, Math.min(255, color.x*255));
	pixelData[index + 1] = Math.max(0, Math.min(255, color.y*255));
	pixelData[index + 2] = Math.max(0, Math.min(255, color.z*255));
	pixelData[index + 3] = 255;
}
