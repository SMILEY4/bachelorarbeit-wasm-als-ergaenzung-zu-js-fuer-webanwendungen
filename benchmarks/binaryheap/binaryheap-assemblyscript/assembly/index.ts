export function runBinaryHeap(seed: u32, N1: i32, N2: i32): void {

	const heap = new Array<u32>(0)

	const N3 = (N1 - N2 + N1)

	// add N1
	for(let i=0; i < N1; i++) {
		const value = randomNumber(seed);
		seed = value;
		push(heap, value);
	}

	// remove N2
	for(let i=0; i < N2; i++) {
		pop(heap);
	}

	// add N1
	for(let i=0; i < N1; i++) {
		const value = randomNumber(seed);
		seed = value;
		push(heap, value);
	}

	// remove all (N3)
	for(let i=0; i < N3; i++) {
		pop(heap);
	}
}


// adds the given value to the heap
function push(heap: Array<u32>, value: u32): void {
	heap.push(value);
	bubbleUp(heap)
}


function bubbleUp(heap: Array<u32>): void {
	let index = heap.length - 1;
	const element = unchecked(heap[index]);
	while (index > 0) {
		const indexParent = (index - 1) / 2;
		const elemParent = unchecked(heap[indexParent]);
		if (element <= elemParent) {
			break;
		}
		unchecked(heap[indexParent] = element);
		unchecked(heap[index] = elemParent);
		index = indexParent;
	}
}


// removes the first value
function pop(heap: Array<u32>): void {
	const removed: u32 = heap.pop();
	if (heap.length > 0) {
		unchecked(heap[0] = removed);
		sinkDown(heap);
	}
}


function sinkDown(heap: Array<u32>): void {

	let index: i32 = 0;
	const length = heap.length;
	const element: u32 = unchecked(heap[0]);

	while (true) {

		let indexLeftChild: i32 = 2 * index + 1;
		let indexRightChild: i32 = 2 * index + 2;

		let elemLeftChild: u32 = 0;
		let elemRightChild: u32 = 0;
		let indexSwap: i32 = -1;

		if(indexLeftChild < length) {
			elemLeftChild = unchecked(heap[indexLeftChild]);
			if(elemLeftChild > element) {
				indexSwap = indexLeftChild;
			}
		}


		if(indexRightChild < length) {
			elemRightChild = unchecked(heap[indexRightChild]);
			if(indexSwap === -1 && elemRightChild > element || indexSwap !== -1 && elemRightChild > elemLeftChild) {
				indexSwap = indexRightChild;
			}
		}

		if(indexSwap === -1) {
			break;
		}

		unchecked(heap[index] = heap[indexSwap]);
		unchecked(heap[indexSwap] = element);
		index = indexSwap;
	}

}


const MAX_32BIT: u32 = (4294967296-100) as u32;

// https://en.wikipedia.org/wiki/Linear_congruential_generator
function randomNumber(seed: u32, a: u32 = 16843009, c: u32 = 826366247, modulus: u32 = MAX_32BIT): u32 {
	return (a * seed + c) % modulus;
}