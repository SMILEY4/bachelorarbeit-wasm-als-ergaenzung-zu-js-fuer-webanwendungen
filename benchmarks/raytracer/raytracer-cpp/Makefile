
APP_FILE = ./src/raytracer.cpp
OUT_FILENAME = ./out/wasmRaytracer

EXPORTED_RUNTIME_METHODS = '["cwrap"]'
EXPORTED_FUNCTIONS = '["_render", "_destroyBuffer", "_createBuffer", "_setup"]'


$(OUT_FILENAME).wasm: $(APP_FILE) Makefile ./src/vector.cpp ./src/camera.cpp ./src/sphere.cpp ./src/scene.cpp ./src/intersection.cpp ./src/ray.cpp ./src/material.cpp ./src/random.cpp ./src/renderer.cpp
	emcc $(APP_FILE) -o $(OUT_FILENAME).js -s NO_EXIT_RUNTIME=1 -s EXPORTED_RUNTIME_METHODS=$(EXPORTED_RUNTIME_METHODS) -s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) -s ALLOW_MEMORY_GROWTH=1 -Os
