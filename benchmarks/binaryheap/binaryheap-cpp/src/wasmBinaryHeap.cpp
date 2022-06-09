#include <stdint.h>
#include <stdlib.h>
#include <vector>

#include <iostream>
#include <stdlib.h>

void sinkDown(std::vector<int>& heap) {

    int index = 0;
    int length = heap.size();
    int element = heap[0];

    while(true) {

        int indexLeftChild = 2 * index + 1;
        int indexRightChild = 2 * index + 2;

        int elemLeftChild = 0;
        int elemRightChild = 0;
        int indexSwap = -1;

        if(indexLeftChild < length) {
            elemLeftChild = heap[indexLeftChild];
            if(elemLeftChild > element) {
                indexSwap = indexLeftChild;
            }
        }

        if(indexRightChild < length) {
            elemRightChild = heap[indexRightChild];
            if(indexSwap == -1 && elemRightChild > element || indexSwap != -1 && elemRightChild > elemLeftChild) {
                indexSwap = indexRightChild;
            }
        }

        if(indexSwap == -1) {
            break;
        }

        heap[index] = heap[indexSwap];
        heap[indexSwap] = element;
        index = indexSwap;
    }

}


void pop(std::vector<int>& heap) {
    if(heap.size() > 0) {
        int removed = heap.back();
        heap.pop_back();
        if(heap.size() > 0) {
            heap[0] = removed;
            sinkDown(heap);
        }
    }
}


void bubbleUp(std::vector<int>& heap) {
    int index = heap.size() - 1;
    int element = heap[index];
    while(index > 0) {
        int indexParent = (index-1) / 2;
        int elemParent = heap[indexParent];
        if(element <= elemParent) {
            break;
        }
        heap[indexParent] = element;
        heap[index] = elemParent;
        index = indexParent;
    }
}


void push(std::vector<int>& heap, int value) {
    heap.push_back(value);
    bubbleUp(heap);
}


int randomNumber(int seed) {
    int a = 16843009;
    int c = 826366247;
    int modulus = 2147483647;
    return (a * seed + c) % modulus;
}


void calculate(int n1, int n2, int seedStart) {
    
    std::vector<int> heap = {};

    int n3 = (n1 - n2 + n1);
    int seed = seedStart;

    // add n1
    for(int i=0; i<n1; i++) {
        int value = randomNumber(seed);
        seed = value;
        push(heap, value);
    }

    // remove n2
    for(int i=0; i<n2; i++) {
        pop(heap);
    }

    // add n1
    for(int i=0; i<n1; i++) {
        int value = randomNumber(seed);
        seed = value;
        push(heap, value);
    }

    // remove all (n3)
    for(int i=0; i<n3; i++) {
        pop(heap);
    }

}



extern "C" {
    void calculateBinayHeap(int n1, int n2, int seed) {
        calculate(n1, n2, seed);
    }
}

