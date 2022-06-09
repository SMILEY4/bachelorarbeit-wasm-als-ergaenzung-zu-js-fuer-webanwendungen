use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen::Clamped;
use web_sys::*;


const WIDTH: usize =  3000;
const HEIGHT: usize = 3000;
const MAX_ITERATIONS: i32 = 200;

static mut PIXEL_DATA: [u8; WIDTH*HEIGHT*4] = [0; WIDTH*HEIGHT*4];

#[wasm_bindgen]
pub fn render() {
    calculate();
    display();
}



fn calculate() {
    for px in 0..WIDTH {   
        for py in 0..HEIGHT {

            let x0 = scale_coordinate(px as f32, WIDTH as f32, -2.00, 0.47);
            let y0 = scale_coordinate(py as f32, HEIGHT as f32, -1.12, 1.12);
            let mut x = 0.0;
            let mut y = 0.0;
            let mut iteration: i32 = 0;

            while (x * x + y * y <= 2.0 * 2.0) && (iteration < MAX_ITERATIONS) {
                let x_temp = x * x - y * y + x0;
                y = 2.0 * x * y + y0;
                x = x_temp;
                iteration = iteration + 1;
            }
            
            let color: Color = get_color(iteration, MAX_ITERATIONS);

            let index: usize = (px + py * HEIGHT) * 4;
            unsafe {
                PIXEL_DATA[index + 0] = color.r;
                PIXEL_DATA[index + 1] = color.g;
                PIXEL_DATA[index + 2] = color.b;
                PIXEL_DATA[index + 3] = 255;
            }
        }
    }
}


fn scale_coordinate(value: f32, max_in_value: f32, min_target: f32, max_target: f32) -> f32 {
    return (value / max_in_value) * (max_target - min_target) + min_target;
}


struct Color {
    r: u8,
    g: u8,
    b: u8,
}


fn get_color(iterations: i32, max_iterations: i32) -> Color {
    if iterations == MAX_ITERATIONS {
        return Color {r: 0, g: 0, b: 0}
    } else {
        //return Color {r: 255, g: 0, b: 0}
        return hsl_to_rgb( (iterations as f32) / (max_iterations as f32), 1.0, 0.5);
    }
}

fn hsl_to_rgb(h: f32, s: f32, l: f32) -> Color {
    let r;
    let g;
    let b;

    if s == 0.0 {
        r = l;
        g = l;
        b = l;
    } else {
        let q;
        if l < 0.5 {
            q = l * (1.0 + s);
        } else {
            q = l + s - l * s;
        }
        let p = 2.0 * l - q;
        r = hue_to_rgb(p, q, h + 1.0 / 3.0);
        g = hue_to_rgb(p, q, h);
        b = hue_to_rgb(p, q, h - 1.0 / 3.0);
    }

    return Color {r: (r*255.0) as u8, g: (g*255.0) as u8, b: (b*255.0) as u8};
}


fn  hue_to_rgb(p: f32, q: f32, t0: f32) -> f32 {
    let mut t = t0;
    if t < 0.0 {
        t = t + 1.0;
    }
    if t > 1.0 {
        t = t - 1.0;
    }
    if t < 1.0 / 6.0 {
        return p + (q - p) * 6.0 * t;
    }
    if t < 1.0 / 2.0 {
        return q;
    }
    if t < 2.0 / 3.0 {
        return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
    }
    return p;
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