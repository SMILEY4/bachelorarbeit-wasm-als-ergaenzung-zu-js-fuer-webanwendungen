#pragma once

#include "vector.cpp"


/*
 * Class holding data about the material of a surface and logic to calculate the interaction of that material with light
 */
class Material {

	public:
		// the "metalness" of the material. "0" = Dialectric, "1" = Metal. For real materials, it's either 0 or 1 
		float metalness;
		// the "roughness" of the material. "0" = completly smooth, "1" = completly rough
		float roughness;
		// the color of the material (albedo)
		Vector baseColor;

		// dummy material
		static Material NONE;

		static Material create(const float metalness, const float roughness, const Vector *baseColor) {
			Material material;
			material.metalness = metalness;
			material.roughness = roughness;
			material.baseColor = *baseColor;
			return material;
		}

		Vector shadeSimple(const float lightVisibility) const {
			return Vector::scale(&baseColor, lightVisibility);
		}

		Vector shade(const Vector *V, const Vector *N, const Vector *L, const Vector *lightColor, const Vector *reflectionColor, const Vector *ambientLight) const {
	        const Vector M = Vector::unitVector(&((const Vector &) Vector::mix(N, V, roughness)));
	        const Vector shading = calcShading(N, V, L, &M, lightColor, ambientLight, &baseColor, metalness, roughness);
	        const Vector reflection = calcReflection(V, &M, metalness, roughness, &baseColor, reflectionColor);
	        return Vector::add(&shading, &reflection);
		}

	private:

		// SOURCE FOR BRDF-Function(s)
		// https://github.com/SMILEY4/SoftwareRenderer/blob/3378c5a25a3777344aaf9ac115fed4f89dd8673b/src/shaderutils.c


		// Normal Distribution Function (NDF)

		float D_Blinn(const float NdotH, const float a) const {
		    return (1.0 / (M_PI*a*a)) * pow(NdotH, 2.0/(a*a) - 2.0);
		}

		float D_Beckmann(const float NdotH, const float a) const {
		    return (1.0 / (M_PI * a*a * NdotH*NdotH*NdotH*NdotH) ) * exp((NdotH*NdotH-1.0)/(a*a*NdotH*NdotH));
		}

		float D_GGX(const float NdotH, const float a) const {
		    float d = NdotH*NdotH * (a*a-1.0) + 1.0;
		    return (a*a) / (M_PI * d*d);
		}


		// Geometric Shadowing

		float G_Implicit(const float NdotL, const float NdotV) const {
		    return NdotL*NdotV;
		}

		float G_Neumann(const float NdotL, const float NdotV) const {
		    return (NdotL*NdotV) / fmax(NdotL,NdotV);
		}

		float G_CookTorrance(const float NdotL, const float NdotV, const float NdotH, const float VdotH) const {
		    return fmin(1.0, fmin((2.0*NdotH*NdotV)/VdotH, (2.0*NdotH*NdotL)/VdotH));
		}

		float G_Kelemen(const float NdotL, const float NdotV, const float VdotH) const {
		    return (NdotL*NdotV)/(VdotH*VdotH);
		}

		float Gs_Beckmann(const float NdotV, const float a) const {
		    float c = NdotV / (a*sqrt(1.0-NdotV*NdotV));
		    if(c < 1.6) {
		        return (3.535*c + 2.181*c*c)/(1.0+2.276*c+2.577*c*c);
		    } else {
		        return 1.0;
		    }
		}

		float Gs_GGX(const float NdotV, const float a) const {
		    return (2.0*NdotV) / ( NdotV + sqrt(a*a+(1.0-a*a)*NdotV*NdotV) );
		}

		float Gs_SchlickBeckmann(const float NdotV, const float a) const {
		    float k = a*sqrt(2.0/M_PI);
		    return NdotV * ( NdotV*(1.0-k)+k);
		}

		float Gs_SchlickGGX(const float NdotV, const float a) const {
		    float k = a/2.0;
		    return NdotV * ( NdotV*(1.0-k)+k);
		}

		float G_Smith(const float NdotL, const float NdotV, const float a) const {
		    return Gs_SchlickBeckmann(NdotL,a) * Gs_SchlickBeckmann(NdotV,a);
		}




		// Fresnel

		float F_Schlick(const float f0, const float u) const {
		    float a = 1.0-u;
		    return f0 + (1.0-f0) * a*a*a*a*a;
		}

		float F_Schlick2(const float f0, const float f90, const float u) const {
		    float a = 1.0-u;
		    return f0 + (f90 - f0) * a*a*a*a*a;
		}

		float F_CookTorrance(const float f0, const float u) const {
		    float sqrtF0 = sqrt(f0);
		    float n = (1.0+sqrtF0)/(1.0-sqrtF0);
		    float c = u;
		    float g = sqrt(n*n+c*c-1.0);
		    float d1 = (g-c)/(g+c);
		    float d2 = ((g+c)*c-1.0) / ((g-c)*c+1.0);
		    return 0.5 * d1*d1 * ( 1.0 + d2*d2 );
		}



		// Diffuse BRDF Functions

		float Diffuse_OrenNayar(const float roughness, const float NdotV, const float NdotL, const float VdotH) const {
		    float a = roughness*roughness;
		    float s = a; // (1.29f + 0.5f * a);
		    float s2 = s*s;
		    float VdotL = 2.0 * VdotH *VdotH;
		    float Cosri = VdotL - NdotV*NdotL;
		    float c1 = 1.0 - 0.5 * s2 / (s2+0.33);
		    float c2 = 0.45 * s2 / (s2+0.09) * Cosri * (Cosri >= 0.0 ? fmax(NdotL,NdotV) : 1.0);
		    return fmax(0.0, 1.0/M_PI * (c1+c2) * (1.0+roughness*0.5));
		}

		float Diffuse_Lambert(const float NdotV) const {
		    return fmax(NdotV, 0.0);
		}



	// calculate shading

	float calcSpecular(const float cNdotH, const float NdotL, const float NdotV, const float cVdotM, const float f0, const float roughness, const Vector *V, const Vector *N) const {

	    // FRESNEL
	    float F = fmax(F_Schlick(f0, cVdotM), 0.0);

	    // DISTRIBUTION
	    float D = fmax(D_GGX(cNdotH, roughness*roughness), 0.0);

	    // GEOMETRIC
	    float G = fmax(G_Smith(NdotL, NdotV, roughness*roughness), 0.0);

	    // FINAL
	    return G*F*D;
	}


	Vector calcShading(const Vector *N, const Vector *V, const Vector *L, const Vector *M, const Vector *lightColor, const Vector *ambientLight, const Vector *baseColor, const float metalness, const float roughness) const {

	    // VALUES

	    const Vector H = Vector::unitVector(&((const Vector &) Vector::add(V, L)));

	    const float NdotL = Vector::dot(N, L);
	    const float NdotV = Vector::dot(N, V);
	    const float NdotH = Vector::dot(N, &H);
	    const float VdotH = Vector::dot(V, &H);
	    const float LdotH = Vector::dot(L, &H);
	    const float VdotM = Vector::dot(V, M);

	    const float cNdotL = fmax(0.0f, NdotL);
	    const float cNdotV = fmax(0.0f, NdotV);
	    const float cNdotH = fmax(0.0f, NdotH);
	    const float cVdotH = fmax(0.0f, VdotH);
	    const float cLdotH = fmax(0.0f, LdotH);
	    const float cVdotM = fmax(0.0f, VdotM);

	    const float f0 = mix(0.02, 0.6, metalness);

	    // SPECULAR

	    const float specular = fmax(calcSpecular(cNdotH, NdotL, NdotV, cVdotM, f0, roughness, V, N), 0.0) * (1.0 - roughness);

	    const Vector specularColor = Vector::create(
	        (specular * cNdotL * lightColor->x) * mix(1.0, fmax(0.001f, baseColor->x), metalness),
	        (specular * cNdotL * lightColor->y) * mix(1.0, fmax(0.001f, baseColor->y), metalness),
	        (specular * cNdotL * lightColor->z) * mix(1.0, fmax(0.001f, baseColor->z), metalness)
	    );

	    // DIFFUSE
	    const float diffuse = fmax(Diffuse_OrenNayar(roughness, NdotV, NdotL, VdotH), 0.0);
	    const Vector diffuseColor = Vector::create(
	        diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * baseColor->x * lightColor->x,
	        diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * baseColor->y * lightColor->y,
	        diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * baseColor->z * lightColor->z
	    );

	    // AMBIENT
	    const Vector ambientColor = Vector::mul(ambientLight, baseColor);

	    return Vector::add3(&specularColor, &diffuseColor, &ambientColor);
	}



	Vector calcReflection(const Vector *V, const Vector *M, const float metalness, const float roughness, const Vector *baseColor, const Vector *reflectionColor) const {

	    const float VdotM = Vector::dot(V, M);

	    const float f0  = mix(0.02, 0.6, metalness);
	    const float f90 = mix(0.65, 1.0, metalness);

	    const float envBRDF = f0 + (f90-f0) * (1.0-VdotM);

	    const Vector color = Vector::create(
	        envBRDF * reflectionColor->x, //mix(1.0, baseColor.x, metalness) * envBRDF * reflectionColor.x * reflectionColor.x,
	        envBRDF * reflectionColor->y, //mix(1.0, baseColor.y, metalness) * envBRDF * reflectionColor.y * reflectionColor.y,
	        envBRDF * reflectionColor->z //mix(1.0, baseColor.z, metalness) * envBRDF * reflectionColor.z * reflectionColor.z,
	    );

	    return color;
	}



	// UTILS

	float mix(const float a, const float b, const float t) const {
	    return a * (1.0f - t) + b * t;
	}


};

Material Material::NONE = Material::create(0.0f, 0.0f, &Vector::ZERO);



