#include "scene.cpp"
#include "vector.cpp"
#include "renderer.cpp"

Scene scene = Scene::createDefault(100, 100, 1); 


void setPixel(uint8_t* buffer, const int x, const int y, const int height, const Vector *color) {
    const int index = (x + y * height) * 4;
    buffer[index + 0] = static_cast<uint8_t>( std::max(0.0f, std::min(color->x*255.0f, 255.0f)) );
    buffer[index + 1] = static_cast<uint8_t>( std::max(0.0f, std::min(color->y*255.0f, 255.0f)) );
    buffer[index + 2] = static_cast<uint8_t>( std::max(0.0f, std::min(color->z*255.0f, 255.0f)) );
    buffer[index + 3] = 255;
}

void renderImage(uint8_t* buffer) {
    Renderer renderer = Renderer::create(&scene);
    for(int x=0; x < scene.width; x++) {
        for(int y=0; y < scene.height; y++) {
            const Vector color = renderer.renderPixel(&scene, x, y);
            setPixel(buffer, x, y, scene.height, &color);
        }
    }
}

void setupScene(const int width, const int height, const int maxDepth) {
    scene.width = static_cast<float>(width);
    scene.height = static_cast<float>(height);
    scene.maxDepth = maxDepth;
    scene.addRandomObjects();
}


extern "C" {

    uint8_t* createBuffer(int width, int height) {
        return (uint8_t*) malloc(width * height * 4 * sizeof(uint8_t));
    }

    void setup(int width, int height, int maxDepth) {
        setupScene(width, height, maxDepth);
    }

    void destroyBuffer(uint8_t* buffer) {
        free(buffer);
    }

    void render(uint8_t* buffer) {
        renderImage(buffer);
    }

}