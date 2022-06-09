use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen::Clamped;
use web_sys::*;
use std::sync::Mutex;
#[macro_use]
extern crate lazy_static;

mod camera;
mod intersection;
mod material;
mod random;
mod ray;
mod renderer;
mod scene;
mod vector;
mod sphere;

use scene::Scene;
use renderer::Renderer;
use vector::Vector;
use wasm_bindgen::JsValue;


const WIDTH: usize =  1000;
const HEIGHT: usize = 1000;
const MAX_DEPTH: usize = 5;

static mut PIXEL_DATA: [u8; WIDTH*HEIGHT*4] = [0; WIDTH*HEIGHT*4];



lazy_static! {
    static ref SCENE: Mutex<Scene> = Mutex::new(Scene::create_default(WIDTH as f32, HEIGHT as f32, MAX_DEPTH));
}


#[wasm_bindgen]
pub fn setup() {}


#[wasm_bindgen]
pub fn render() {
    let scene = SCENE.lock().unwrap().copy();
	let mut renderer: Renderer = Renderer::create(&scene);
    for y in 0..HEIGHT {
		for x in 0..WIDTH {
			let color = renderer.render_pixel(&scene, x, y);
			set_pixel(x, y, color);
		}
	}
    display();
}


fn set_pixel(x: usize, y: usize, color: Vector) {
	let index: usize = (x + y * HEIGHT) * 4;
    unsafe {
        PIXEL_DATA[index + 0] = f32::max(0.0, f32::min(color.x*255.0, 255.0)) as u8;
        PIXEL_DATA[index + 1] = f32::max(0.0, f32::min(color.y*255.0, 255.0)) as u8;
        PIXEL_DATA[index + 2] = f32::max(0.0, f32::min(color.z*255.0, 255.0)) as u8;
        PIXEL_DATA[index + 3] = 255;
    }
}


fn display() -> Result<(), JsValue> {

    let window = web_sys::window().unwrap();
    let document = window.document().unwrap();
    let element_canvas = document.get_element_by_id("canvas").unwrap();

    let canvas: web_sys::HtmlCanvasElement = element_canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();

    canvas.set_width(WIDTH as u32);
    canvas.set_height(HEIGHT as u32);

    let context = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap();

    unsafe {
        let imagedata = ImageData::new_with_u8_clamped_array_and_sh( 
            Clamped(&PIXEL_DATA),
            WIDTH as u32,
            HEIGHT as u32
        )?;
        context.put_image_data(&imagedata, 0.0, 0.0)?;
    }

    return Ok(());
}