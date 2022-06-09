import { Vector } from './vector.js';


/*
 * Class holding data about the material of a surface and logic to calculate the interaction of that material with light
 */
export class Material {

	static NONE = new Material(0, 0, Vector.ZERO);

	constructor(metalness, roughness, baseColor) {
        // the "metalness" of the material. "0" = Dialectric, "1" = Metal. For real materials, it's either 0 or 1 
		this.metalness = metalness;
        // the "roughness" of the material. "0" = completly smooth, "1" = completly rough
		this.roughness = roughness;
        // the color (vector) of the material (albedo)
		this.baseColor = baseColor;
	}

    /*
     * simplified shading, mainly use for debuggin 
     */
    shadeSimple(lightVisibility) {
        return Vector.scale(this.baseColor, Math.max(lightVisibility, 0.3));
    }

    /*
     * calculate the interactions with light / the color of a surface with this material 
     */
	shade(V, N, L, lightColor, reflectionColor, ambientLight) {
        const M = Vector.unitVector(Vector.mix(N, V, this.roughness));
        const shading = calcShading(N, V, L, M, lightColor, ambientLight, this.baseColor, this.metalness, this.roughness);
        const reflection = calcReflection(V, M, this.metalness, this.roughness, this.baseColor, reflectionColor);
        return Vector.add(shading, reflection);
    }

}




// SOURCE FOR BRDF-Function(s)
// https://github.com/SMILEY4/SoftwareRenderer/blob/3378c5a25a3777344aaf9ac115fed4f89dd8673b/src/shaderutils.c



// Normal Distribution Function (NDF)

function D_Blinn(NdotH, a) {
    return (1.0 / (Math.PI*a*a)) * Math.pow(NdotH, 2.0/(a*a) - 2.0);
}

function D_Beckmann(NdotH, a) {
    return (1.0 / (PI * a*a * NdotH*NdotH*NdotH*NdotH) ) * Math.exp((NdotH*NdotH-1.0)/(a*a*NdotH*NdotH));
}

function D_GGX(NdotH, a) {
    const d = NdotH*NdotH * (a*a-1.0) + 1.0;
    return (a*a) / (Math.PI * d*d);
}


// Geometric Shadowing

function G_Implicit(NdotL, NdotV) {
    return NdotL*NdotV;
}

function G_Neumann(NdotL, NdotV) {
    return (NdotL*NdotV) / Math.max(NdotL,NdotV);
}

function G_CookTorrance(NdotL, NdotV, NdotH, VdotH) {
    return min(1.0, Math.min((2.0*NdotH*NdotV)/VdotH, (2.0*NdotH*NdotL)/VdotH));
}

function G_Kelemen(NdotL, NdotV, VdotH) {
    return (NdotL*NdotV)/(VdotH*VdotH);
}

function Gs_Beckmann(NdotV, a) {
    const c = NdotV / (a*Math.sqrt(1.0-NdotV*NdotV));
    if(c < 1.6) {
        return (3.535*c + 2.181*c*c)/(1.0+2.276*c+2.577*c*c);
    } else {
        return 1.0;
    }
}

function Gs_GGX(NdotV, a) {
    return (2.0*NdotV) / ( NdotV + Math.sqrt(a*a+(1.0-a*a)*NdotV*NdotV) );
}

function Gs_SchlickBeckmann(NdotV, a) {
    const k = a*Math.sqrt(2.0/Math.PI);
    return NdotV * ( NdotV*(1.0-k)+k);
}

function Gs_SchlickGGX(NdotV, a) {
    const k = a/2.0;
    return NdotV * ( NdotV*(1.0-k)+k);
}

function G_Smith(NdotL, NdotV, a) {
    return Gs_SchlickBeckmann(NdotL,a)*Gs_SchlickBeckmann(NdotV,a);
}




// Fresnel

function F_Schlick(f0, u) {
    const a = 1.0-u;
    return f0 + (1.0-f0) * a*a*a*a*a;
}

function F_Schlick2(f0, f90, u) {
    const a = 1.0-u;
    return f0 + (f90 - f0) * a*a*a*a*a;
}

function F_CookTorrance(f0, u) {
    const sqrtF0 = Math.sqrt(f0);
    const n = (1.0+sqrtF0)/(1.0-sqrtF0);
    const c = u;
    const g = Math.sqrt(n*n+c*c-1.0);
    const d1 = (g-c)/(g+c);
    const d2 = ((g+c)*c-1.0) / ((g-c)*c+1.0);
    return 0.5 * d1*d1 * ( 1.0 + d2*d2 );
}



// Diffuse BRDF Functions

function Diffuse_OrenNayar(roughness, NdotV, NdotL, VdotH) {
    const a = roughness*roughness;
    const s = a; // (1.29f + 0.5f * a);
    const s2 = s*s;
    const VdotL = 2.0 * VdotH *VdotH;
    const Cosri = VdotL - NdotV*NdotL;
    const c1 = 1.0 - 0.5 * s2 / (s2+0.33);
    const c2 = 0.45 * s2 / (s2+0.09) * Cosri * (Cosri >= 0.0 ? Math.max(NdotL,NdotV) : 1.0);
    return Math.max(0.0, 1.0/Math.PI * (c1+c2) * (1.0+roughness*0.5));
}

function Diffuse_Lambert(NdotV) {
    return Math.max(NdotV, 0.0);
}




// calculate shading

function calcSpecular(cNdotH, NdotL, NdotV, cVdotM, f0, roughness, V, N) {

    // FRESNEL
    const F = Math.max(F_Schlick(f0, cVdotM), 0.0);

    // DISTRIBUTION
    const D = Math.max(D_GGX(cNdotH, roughness*roughness), 0.0);

    // GEOMETRIC
    const G = Math.max(G_Smith(NdotL, NdotV, roughness*roughness), 0.0);

    // FINAL
    return G*F*D;
}


function calcShading(N, V, L, M, lightColor, ambientLight, baseColor, metalness, roughness) {

    // VALUES

    const H = Vector.unitVector(Vector.add(V, L));

    const NdotL = Vector.dot(N, L);
    const NdotV = Vector.dot(N, V);
    const NdotH = Vector.dot(N, H);
    const VdotH = Vector.dot(V, H);
    const LdotH = Vector.dot(L, H);
    const VdotM = Vector.dot(V, M);

    const cNdotL = Math.max(0.0, NdotL);
    const cNdotV = Math.max(0.0, NdotV);
    const cNdotH = Math.max(0.0, NdotH);
    const cVdotH = Math.max(0.0, VdotH);
    const cLdotH = Math.max(0.0, LdotH);
    const cVdotM = Math.max(0.0, VdotM);

    const f0 = mix(0.02, 0.6, metalness);

    // SPECULAR

    const specular = Math.max(calcSpecular(cNdotH, NdotL, NdotV, cVdotM, f0, roughness, V, N), 0.0) * (1.0 - roughness);

    const specularColor = new Vector(
        (specular * cNdotL * lightColor.x) * mix(1.0, Math.max(0.001, baseColor.x), metalness),
        (specular * cNdotL * lightColor.y) * mix(1.0, Math.max(0.001, baseColor.y), metalness),
        (specular * cNdotL * lightColor.z) * mix(1.0, Math.max(0.001, baseColor.z), metalness)
    );

    // DIFFUSE
    const diffuse = Math.max(Diffuse_OrenNayar(roughness, NdotV, NdotL, VdotH), 0.0);
    const diffuseColor = new Vector(
        diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * baseColor.x * lightColor.x,
        diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * baseColor.y * lightColor.y,
        diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * baseColor.z * lightColor.z
    );

    // AMBIENT
    const ambientColor = Vector.mul(ambientLight, baseColor);

    return Vector.add3(specularColor, diffuseColor, ambientColor);
}



function calcReflection(V, M, metalness, roughness, baseColor, reflectionColor) {

    const VdotM = Vector.dot(V, M);

    const f0  = mix(0.02, 0.6, metalness);
    const f90 = mix(0.65, 1.0, metalness);

    const envBRDF = f0 + (f90-f0) * (1.0-VdotM);

    const color = new Vector(
        envBRDF * reflectionColor.x, //mix(1.0, baseColor.x, metalness) * envBRDF * reflectionColor.x * reflectionColor.x,
        envBRDF * reflectionColor.y, //mix(1.0, baseColor.y, metalness) * envBRDF * reflectionColor.y * reflectionColor.y,
        envBRDF * reflectionColor.z, //mix(1.0, baseColor.z, metalness) * envBRDF * reflectionColor.z * reflectionColor.z,
    )

    return color;
}



// UTILS

function mix(a, b, t) {
    return a * (1 - t) + b * t;
}