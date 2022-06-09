
APP_FILE = ./src/wasmBinaryHeap.cpp
OUT_FILENAME = ./out/wasmBinaryHeap

EXPORTED_RUNTIME_METHODS = '["cwrap"]'
EXPORTED_FUNCTIONS = '["_calculateBinayHeap"]'


$(OUT_FILENAME).wasm: $(APP_FILE) Makefile
	emcc $(APP_FILE) -o $(OUT_FILENAME).js -s NO_EXIT_RUNTIME=1 -s EXPORTED_RUNTIME_METHODS=$(EXPORTED_RUNTIME_METHODS) -s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) -s ALLOW_MEMORY_GROWTH=1 -O3 -flto -fno-rtti -fno-exceptions