import { Vector } from './vector';
import { Camera } from './camera';
import { Sphere } from './sphere';
import { Scene } from './scene';
import { Ray } from './ray';
import { Intersection } from './intersection';
import { Renderer } from './renderer';



const WIDTH: usize = 100;
const HEIGHT: usize = 100;
const MAX_DEPTH: usize = 5;

const data = new Uint8Array((WIDTH * HEIGHT * 4) as i32);
const scene = Scene.createDefault(WIDTH as f32, HEIGHT as f32, MAX_DEPTH);



export function setup(): void {
	scene.addRandomObjects();
}


export function render(): void {
	const renderer: Renderer = Renderer.create(scene);
	for(let y: usize = 0; y < HEIGHT; y++) {
		for(let  x: usize = 0; x < WIDTH; x++) {
			const color = renderer.renderPixel(scene, x, y);
			setPixel(x, y, color);
		}
	}
}


@inline
function setPixel(x: usize, y: usize, color: Vector): void {
	const index: i32 = ((x + y * HEIGHT) * 4) as i32;
	data[index + 0] = Mathf.max(0, Mathf.min(255, color.x*255)) as u8;
	data[index + 1] = Mathf.max(0, Mathf.min(255, color.y*255)) as u8;
	data[index + 2] = Mathf.max(0, Mathf.min(255, color.z*255)) as u8;
	data[index + 3] = 255;
}


export function getDataBuffer(): ArrayBuffer {
	return <ArrayBuffer>(data.buffer);
}