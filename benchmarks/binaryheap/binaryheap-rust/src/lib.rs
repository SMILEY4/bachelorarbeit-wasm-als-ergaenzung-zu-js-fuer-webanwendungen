use wasm_bindgen::prelude::*;


#[wasm_bindgen]
pub fn run_binaryheap() {

    let mut seed: u32 = 123;
    let N1 = 2000000;
    let N2 = 1000000;
    
    let N3 = N1 - N2 + N1;

    let mut heap: Vec<u32> = Vec::new();

    // add N1
    for _i in 0..N1 {
        let value = random_number(seed);
        seed = value;
        push(&mut heap, value);
    }

    // remove N2
    for _i in 0..N2 {
        pop(&mut heap);
    }

    // add N1
   for _i in 0..N1 {
        let value = random_number(seed);
        seed = value;
        push(&mut heap, value);
    }

    // remove all (N3)
    for _i in 0..N3 {
        pop(&mut heap);
    }

}


// adds the given value to the heap
fn push(heap: &mut Vec<u32>, value: u32) {
    heap.push(value);
    bubble_up(heap);
}


fn bubble_up(heap: &mut Vec<u32>) {
    let mut index: usize = heap.len() - 1;
    let element = heap[index];
    while index > 0 {
        let index_parent: usize = (index - 1) / 2;
        let elem_parent = heap[index_parent];
        if element <= elem_parent {
            break;
        }
        heap[index_parent] = element;
        heap[index] = elem_parent;
        index = index_parent;
    }

}


// removes the last value
fn pop(heap: &mut Vec<u32>) {
    let removed: u32 = heap.pop().unwrap();
    if heap.len() > 0 {
        heap[0] = removed;
        sink_down(heap);
    }
}


fn sink_down(heap: &mut Vec<u32>) {

    let mut index: usize = 0;
    let length = heap.len();
    let element: u32 = heap[0];

    loop {

        let index_left_child: usize = 2 * index + 1;
        let index_right_child: usize = 2 * index + 2;

        let mut elem_left_child: u32 = 0;
        let mut elem_right_child: u32 = 0;
        let mut index_swap: usize = 0;
        let mut has_index_swap: bool = false;

        if index_left_child < length {
            elem_left_child = heap[index_left_child];
            if elem_left_child > element {
                has_index_swap = true;
                index_swap = index_left_child;
            }
        }


        if index_right_child < length {
            elem_right_child = heap[index_right_child];
            if (has_index_swap == true && elem_right_child > element) || (has_index_swap == false && elem_right_child > elem_left_child) {
                has_index_swap = true;
                index_swap = index_right_child;
            }
        }

        if has_index_swap == false {
            break;
        }

        heap[index] = heap[index_swap];
        heap[index_swap] = element;
        index = index_swap;
    }

}



const MAX_32BIT: u32 =  4294967196; // 2^32 - 100
const RNG_A: u32 = 16843009;
const RNG_C: u32 = 826366247;
const RNG_MODULUS: u32 = MAX_32BIT;

// https://en.wikipedia.org/wiki/Linear_congruential_generator
fn random_number(seed: u32) -> u32 {
    return (RNG_A * seed + RNG_C) % RNG_MODULUS
}
