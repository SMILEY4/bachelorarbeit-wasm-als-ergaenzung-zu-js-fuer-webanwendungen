#include <stdint.h>
#include <stdlib.h>


struct color_t {
    uint8_t r;
    uint8_t g;
    uint8_t b;
};


float scaleCoordinate(int value, int maxValue, float minTarget, float maxTarget) {
    return (static_cast<float>(value) / static_cast<float>(maxValue)) * (maxTarget - minTarget) + minTarget;
}


float hue2rgb(float p, float q, float t0) {
    float t = t0;
    if(t < 0.0) {
        t = t + 1.0;
    }
    if(t > 1.0) {
        t = t - 1.0;
    }
    if(t < 1.0 / 6.0) {
        return p + (q - p) * 6.0 * t;
    }
    if(t < 1.0 / 2.0) {
        return q;
    }
    if(t < 2.0 / 3.0) {
        return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
    }
    return p;
}


color_t hsl2rgb(float h, float s, float l) {
    float r = 0;
    float g = 0;
    float b = 0;

    if(s == 0.0) {
        r = l;
        g = l;
        b = l;
    } else {
        float q = 0;
        if(l < 0.5) {
            q = l * (1.0 + s);
        } else {
            q = l + s - l * s;
        }
        float p = 2.0 * l - q;
        r = hue2rgb(p, q, h + 1.0 / 3.0);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1.0 / 3.0);
    }

    struct color_t clr = {
        static_cast<uint8_t>(r * 255),
        static_cast<uint8_t>(g * 255),
        static_cast<uint8_t>(b * 255)
    };
    return clr;
}

color_t getColor(int iterations, int maxIterations) {
    if(iterations == maxIterations) {
        struct color_t clr = {0,0,0};
        return clr;
    } else {
        return hsl2rgb( static_cast<float>(iterations) / static_cast<float>(maxIterations), 1.0, 0.5);
    }
}


void calculateMandelbrot(uint8_t* buffer, int width, int height, int maxIterations) {
    
    for(int px=0; px < width; px++) {
        for(int py=0; py < height; py++) {

            float x0 = scaleCoordinate(px, width, -2.00, 0.47);
            float y0 = scaleCoordinate(py, height, -1.12, 1.12);
            float x = 0;
            float y = 0;
            int iteration = 0;

            while( (x*x+y*y <= 2*2) && (iteration < maxIterations) ) {
                float xTemp = x*x - y*y + x0;
                y = 2.0 * x * y + y0;
                x = xTemp;
                iteration++;
            }

            color_t color = getColor(iteration, maxIterations);

            int index = (px + py * height) * 4;
            buffer[index + 0] = color.r;
            buffer[index + 1] = color.g;
            buffer[index + 2] = color.b;
            buffer[index + 3] = 255;

        }
    }

}


extern "C" {

    uint8_t* createBuffer(int width, int height) {
        return (uint8_t*) malloc(width * height * 4 * sizeof(uint8_t));
    }

    void destroyBuffer(uint8_t* buffer) {
        free(buffer);
    }

    void renderMandelbrot(uint8_t* buffer, int width, int height, int maxIterations) {
        calculateMandelbrot(buffer, width, height, maxIterations);
    }

}

