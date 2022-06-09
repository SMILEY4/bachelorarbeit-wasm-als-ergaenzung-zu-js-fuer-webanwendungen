#pragma once

#include <vector>
#include "vector.cpp"
#include "camera.cpp"
#include "sphere.cpp"
#include "random.cpp"

class Scene {

	public:
		// the width of the image
		float width;
		// the height of the image
		float height;
		// defines the max amount of bounces/reflections (0 = no reflections)
		int maxDepth;
		// the camera
		Camera camera;
		// the color of the "sky"
		Vector skyColor;
		// the color of the lights
		Vector lightColor;
		// the position of the lights
		std::vector<Vector> lights = {};
		// the objects in the scene
		std::vector<Sphere> objects = {};

		/*
		 * add the given object to this scene
		 */
		void addObject(const Sphere *object) {
			objects.push_back(*object);
		}

		/*
		 * create a new scene, including some fixed objects
		 */ 
		static Scene createDefault(const float width, const float height, const int maxDepth) {
			Scene scene;

			// basics
			scene.width = width;
			scene.height = height;
			scene.maxDepth = maxDepth;

			// camera
			const Vector camPos = Vector::create(-10.0f, 14.0f, 20.0f);
			const Vector camLookAt = Vector::create(0.0f,0.0f,0.0f);
			scene.camera = Camera::create(&camPos, &camLookAt, 60.0f);

			// lights
			const Vector light = Vector::create(0.0f, 10.0f, 20.0f);
			scene.lights.push_back(light);

			scene.skyColor = Vector::create(1.0f, 1.0f, 1.0f);
			scene.lightColor = Vector::create(1.5f, 1.5f, 1.5f);


			// default objects
			const Vector obj1Color = Vector::create(1.0f, 0.4f, 0.4f);
			const Material obj1Material = Material::create(1.0f, 0.0f, &obj1Color);
			const Vector obj1Center = Vector::create(0.0f, 7.0f, -8.0f);
			const Sphere obj1 = Sphere::create(&obj1Center, 3, &obj1Material);
			scene.addObject(&obj1);

			const Vector obj2Color = Vector::create(0.9f, 0.9f, 0.9f);
			const Material obj2Material = Material::create(0.0f, 0.1f, &obj2Color);
			const Vector obj2Center = Vector::create(0.0f, -30.0f, -8.0f);
			const Sphere obj2 = Sphere::create(&obj2Center, 30.0f, &obj2Material);
			scene.addObject(&obj2);

			return scene;
		}

		/*
		 * add "random" objects to the scene
		 */
		void addRandomObjects() {
			int indexRandom = 0;

			for (int i=0; i<30; i++) {
			    const Vector position = Vector::create(
			            RANDOM_VALUES[indexRandom+0] * 25.0f - 12.0f,
			            RANDOM_VALUES[indexRandom+1] * 20.0f - 10.0f,
			            RANDOM_VALUES[indexRandom+2] * 25.0f - 12.0f
			    );
			    const float radius = RANDOM_VALUES[indexRandom+3] * 2.0f + 0.4f;
			    const Vector color = Vector::create(
			            RANDOM_VALUES[indexRandom+6] * 0.7f + 0.3f,
			            RANDOM_VALUES[indexRandom+7] * 0.7f + 0.3f,
			            RANDOM_VALUES[indexRandom+8] * 0.7f + 0.3f
			    );
			    const Material material = Material::create(
			    	RANDOM_VALUES[indexRandom+4] < 0.5f ? 0.0f : 1.0f,
			    	RANDOM_VALUES[indexRandom+5],
			    	&color
			    );
			    const Sphere sphere = Sphere::create(&position, radius, &material);
			    addObject(&sphere);
			    indexRandom = indexRandom + 9;
			}

			for (int i=0; i<10; i++) {
			    const Vector position = Vector::create(
			            RANDOM_VALUES[indexRandom+0] * 14.0f - 7.0f,
			            0.0f,
			            RANDOM_VALUES[indexRandom+1] * 14.0f - 7.0f
			    );
			    const float radius = RANDOM_VALUES[indexRandom+2] * 2.0f + 0.4f;
			    const Vector color = Vector::create(
			            RANDOM_VALUES[indexRandom+5] * 0.7f + 0.3f,
			            RANDOM_VALUES[indexRandom+6] * 0.7f + 0.3f,
			            RANDOM_VALUES[indexRandom+7] * 0.7f + 0.3f
			    );
			    const Material material = Material::create(
			    	RANDOM_VALUES[indexRandom+3] < 0.5f ? 0.0f : 1.0f,
			    	RANDOM_VALUES[indexRandom+4],
			    	&color
			    );
			    const Sphere sphere = Sphere::create(&position, radius, &material);
			    addObject(&sphere);
			    indexRandom = indexRandom + 8;
			}

		}
};
