
APP_FILE = ./src/wasmMandelbrot.cpp
OUT_FILENAME = ./out/wasmMandelbrot

EXPORTED_RUNTIME_METHODS = '["cwrap"]'
EXPORTED_FUNCTIONS = '["_renderMandelbrot", "_destroyBuffer", "_createBuffer"]'


$(OUT_FILENAME).wasm: $(APP_FILE) Makefile
	emcc $(APP_FILE) -o $(OUT_FILENAME).js -s NO_EXIT_RUNTIME=1 -s EXPORTED_RUNTIME_METHODS=$(EXPORTED_RUNTIME_METHODS) -s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) -s ALLOW_MEMORY_GROWTH=1 -O3 -flto -fno-rtti -fno-exceptions