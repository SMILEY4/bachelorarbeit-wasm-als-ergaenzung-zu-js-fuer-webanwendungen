export function runBinaryHeap(seed, N1, N2) {

	const heap = [];

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
function push(heap, value) {
	heap.push(value);
	bubbleUp(heap)
}


function bubbleUp(heap) {
	let index = heap.length - 1;
	const element = heap[index];
	while (index > 0) {
		const indexParent = Math.floor((index - 1) / 2);
		const elemParent = heap[indexParent];
		if (element <= elemParent) {
			break;
		}
		heap[indexParent] = element;
		heap[index] = elemParent;
		index = indexParent;
	}
}


// removes the greates value (root)
function pop(heap) {
	const removed = heap.pop();
	if (heap.length > 0) {
		heap[0] = removed;
		sinkDown(heap);
	}
}


function sinkDown(heap) {

	let index = 0;
	const length = heap.length;
	const element = heap[0];

	while (true) {

		// Berechne Indexe der Kind-Elemente
		let indexLeftChild = 2 * index + 1;
		let indexRightChild = 2 * index + 2;

		let elemLeftChild = null;
		let elemRightChild = null;
		let indexSwap = null;

		// Wenn das linke Kind existiert...
		if(indexLeftChild < length) {
			elemLeftChild = heap[indexLeftChild];
			// Wenn das linke Kind kleiner als das aktuelle Element ist, muss getauscht werden 
			if(elemLeftChild > element) {
				indexSwap = indexLeftChild;
			}
		}

		// Wenn das rechte Kind existiert...
		if(indexRightChild < length) {
			elemRightChild = heap[indexRightChild];
			// Wenn das rechte Kind kleiner als das aktuelle bzw linke Element ist, muss getauscht werden 
			if(elemRightChild > (indexSwap === null ? element : elemLeftChild)) {
				indexSwap = indexRightChild;
			}
		}

		// Abbrechen, wenn das Element nicht getauscht werden muss
		if(indexSwap === null) {
			break;
		}

		// Element mit Kind tauschen
		heap[index] = heap[indexSwap];
		heap[indexSwap] = element;
		index = indexSwap;
	}

}


const MAX_32BIT = 4294967196; // 2^32 - 100

// https://en.wikipedia.org/wiki/Linear_congruential_generator !! not portable,  js uses 64-bit float for all numbers -> rounding errors even for integer-arithmetic !!
function randomNumber(seed, a = 16843009, c = 826366247, modulus = MAX_32BIT) {
	return (a * seed + c) % 1000//modulus;
}
