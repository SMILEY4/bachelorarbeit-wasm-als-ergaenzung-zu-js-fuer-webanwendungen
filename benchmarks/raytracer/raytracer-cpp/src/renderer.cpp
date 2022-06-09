#pragma once

#include <math.h>
#include "vector.cpp"
#include "intersection.cpp"
#include "scene.cpp"
#include "sphere.cpp"
#include "ray.cpp"

/*
 * Class holding data about the current rendering process and provides the core rendering logic
 */
class Renderer {

	public:
		Vector eyeVector;
		Vector viewRight;
		Vector viewUp;
		float pixelWidth;
		float pixelHeight;
		float halfWidth;
		float halfHeight;
		Ray cameraRay;

		/*
		 * Create a new renderer for the given scene
		 */
		static Renderer create(const Scene *scene) {
			Renderer renderer;

			renderer.eyeVector = Vector::unitVector(&((const Vector &) Vector::sub(&scene->camera.lookat, &scene->camera.position)));
			renderer.viewRight = Vector::unitVector(&((const Vector &) Vector::cross(&renderer.eyeVector, &Vector::UP)));
			renderer.viewUp = Vector::unitVector(&((const Vector &) Vector::cross(&renderer.viewRight, &renderer.eyeVector)));
		
			const float fovRadians = (M_PI * (scene->camera.fov / 2.0f)) / 180.0f;
			const float heightWidthRatio = scene->height / scene->width;
			renderer.halfWidth = tan(fovRadians);
			renderer.halfHeight = heightWidthRatio * renderer.halfWidth;
			const float cameraWidth = renderer.halfWidth * 2.0f;
			const float cameraHeight = renderer.halfHeight * 2.0f;
			renderer.pixelWidth = cameraWidth / (scene->width - 1.0f);
			renderer.pixelHeight = cameraHeight / (scene->height - 1.0f);

			renderer.cameraRay = Ray::create(&scene->camera.position, &Vector::ZERO);

			return renderer;
		}

		/*
		 * Calculate the final color of the pixel at the given position
		 */
		Vector renderPixel(const Scene *scene, const int x, const int y) {
			cameraRay.direction = calcCameraRayDirection(x, y);
			return trace(scene, &cameraRay, 0);
		}


	private:

		/*
		 * Calculate the direction of the ray for the pixel at the given position
		 */
		Vector calcCameraRayDirection(const int x, const int y) const {
			const Vector xComp = Vector::scale(&viewRight, static_cast<float>(x) * pixelWidth - halfWidth);
			const Vector yComp = Vector::scale(&viewUp, static_cast<float>(y) * pixelHeight - halfHeight);
			return Vector::unitVector(&((const Vector &) Vector::add3(&eyeVector, &xComp, &yComp)));
		}

		/*
		 * Trace the ray(s) through the scene and return the resulting color 
		 */
		Vector trace(const Scene *scene, const Ray *ray, const int depth) const {
			if(depth > scene->maxDepth) {
				return scene->skyColor;
			}
			Intersection intersection = ray->intersectScene(scene);
			if(intersection.hitSth) {
				return surface(scene, ray, &intersection, depth);
			} else {
				return scene->skyColor;
			}
		}

		/*
		 * Calculate the color of the surface at the given intersection 
		 */
		Vector surface(const Scene *scene, const Ray *ray, const Intersection *intersection, const int depth) const {
			const bool simpleShading = false;
        
        	const Sphere object = intersection->object;
        	const Vector V = Vector::scale(&(ray->direction), -1.0f);
        	const Vector N = intersection->normal;
        	const Vector L = Vector::unitVector(&((const Vector &) Vector::sub(&(scene->lights[0]), &(intersection->position))));
	
        	float lightVisibility = 0.2f;
        	if (isLightvisible(scene, &(intersection->position), &L)) {
        	    lightVisibility = 1.0f;
        	}
        	if(simpleShading)  {
        		return object.material.shadeSimple(lightVisibility);
        	} else {
        	    const Vector reflection = getReflection(scene, ray, &intersection->position, &intersection->normal, depth);
        	    const Vector light = Vector::scale(&(scene->lightColor), lightVisibility);
        	    const Vector sky = Vector::scale(&(scene->skyColor), 0.1f);
        	    return object.material.shade(&V, &N, &L, &light, &reflection, &sky);
        	}
		}

		/*
		 * Check whether the light is visible from the given position
		 */
	    bool isLightvisible(const Scene *scene, const Vector *position, const Vector *lightDirection) const {
	        const Ray shadowRay = Ray::create(position, &((const Vector &)Vector::scale(lightDirection, -1.0f)));
	        const Intersection intersection = shadowRay.intersectScene(scene);
	        return intersection.distance > -0.005f;
	    }

		/*
		 * get the color of the reflection of the ray at the given position 
		 */
	    Vector getReflection(const Scene *scene, const Ray *ray, const Vector *position, const Vector *normal, const int depth) const {
			const Ray reflectedRay = ray->reflect(position, normal);
			return trace(scene, &reflectedRay, depth+1);
		}

};
