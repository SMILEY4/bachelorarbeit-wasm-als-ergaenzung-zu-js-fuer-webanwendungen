import { Vector } from './vector';


/*
 * Class holding data about the material of a surface and logic to calculate the interaction of that material with light
 */
export class Material {

    // Dummy material
	static NONE: Material = new Material(0, 0, Vector.ZERO);

	constructor(
        // the "metalness" of the material. "0" = Dialectric, "1" = Metal. For real materials, it's either 0 or 1 
		public metalness: f32,
        // the "roughness" of the material. "0" = completly smooth, "1" = completly rough
		public roughness: f32,
        // the color of the material (albedo)
		public baseColor: Vector,
	) {}

    /*
     * simplified shading, mainly use for debugging
     */
    shadeSimple(lightVisibility: f32): Vector {
        return Vector.scale(this.baseColor, Mathf.max(lightVisibility, 0.3));
    }

    tmpM: Vector = Vector.ZERO.copy();

    /*
     * calculate the interactions with light / the color of a surface with this material 
     */
	shade(V: Vector, N: Vector, L: Vector, lightColor: Vector, reflectionColor: Vector, ambientLight: Vector): Vector {
        const M: Vector = this.tmpM.set(N).mix(V, this.roughness).normalize();
        const shading = calcShading(N, V, L, M, lightColor, ambientLight, this.baseColor, this.metalness, this.roughness);
        const reflection = calcReflection(V, M, this.metalness, this.roughness, this.baseColor, reflectionColor);
        return shading.add(reflection);
    }

}


// SOURCE FOR BRDF-Function(s)
// https://github.com/SMILEY4/SoftwareRenderer/blob/3378c5a25a3777344aaf9ac115fed4f89dd8673b/src/shaderutils.c



// Normal Distribution Function (NDF)

function D_Blinn(NdotH: f32, a: f32): f32 {
    return (1.0 / (Mathf.PI*a*a)) * Mathf.pow(NdotH, 2.0/(a*a) - 2.0);
}

function D_Beckmann(NdotH: f32, a: f32): f32 {
    return (1.0 / (PI * a*a * NdotH*NdotH*NdotH*NdotH) ) * Mathf.exp((NdotH*NdotH-1.0)/(a*a*NdotH*NdotH));
}

function D_GGX(NdotH: f32, a: f32): f32 {
	const d = NdotH*NdotH * (a*a-1.0) + 1.0;
    return (a*a) / (Mathf.PI * d*d);
}


// Geometric Shadowing

function G_Implicit(NdotL: f32, NdotV: f32): f32 {
    return NdotL*NdotV;
}

function G_Neumann(NdotL: f32, NdotV: f32): f32 {
    return (NdotL*NdotV) / Mathf.max(NdotL,NdotV);
}

function G_CookTorrance(NdotL: f32, NdotV: f32, NdotH: f32, VdotH: f32): f32 {
    return min(1.0, Mathf.min((2.0*NdotH*NdotV)/VdotH, (2.0*NdotH*NdotL)/VdotH));
}

function G_Kelemen(NdotL: f32, NdotV: f32, VdotH: f32): f32 {
    return (NdotL*NdotV)/(VdotH*VdotH);
}

function Gs_Beckmann(NdotV: f32, a: f32): f32 {
    const c = NdotV / (a*Mathf.sqrt(1.0-NdotV*NdotV));
    if(c < 1.6) {
        return (3.535*c + 2.181*c*c)/(1.0+2.276*c+2.577*c*c);
    } else {
        return 1.0;
    }
}

function Gs_GGX(NdotV: f32, a: f32): f32 {
    return (2.0*NdotV) / ( NdotV + Mathf.sqrt(a*a+(1.0-a*a)*NdotV*NdotV) );
}

function Gs_SchlickBeckmann(NdotV: f32, a: f32): f32 {
    const k = a*Mathf.sqrt(2.0/Mathf.PI);
    return NdotV * ( NdotV*(1.0-k)+k);
}

function Gs_SchlickGGX(NdotV: f32, a: f32): f32 {
    const k = a/2.0;
    return NdotV * ( NdotV*(1.0-k)+k);
}

function G_Smith(NdotL: f32, NdotV: f32, a: f32): f32 {
    return Gs_SchlickBeckmann(NdotL,a)*Gs_SchlickBeckmann(NdotV,a);
}




// Fresnel

function F_Schlick(f0: f32, u: f32): f32 {
	const a: f32 = 1.0-u;
    return f0 + (1.0-f0) * a*a*a*a*a;
}

function F_Schlick2(f0: f32, f90: f32, u: f32): f32 {
	const a = 1.0-u;
    return f0 + (f90 - f0) * a*a*a*a*a;
}

function F_CookTorrance(f0: f32, u: f32): f32 {
    const sqrtF0: f32 = Mathf.sqrt(f0);
    const n: f32 = (1.0+sqrtF0)/(1.0-sqrtF0);
    const c: f32 = u;
    const g: f32 = Mathf.sqrt(n*n+c*c-1.0);
    const d1 = (g-c)/(g+c);
    const d2 = ((g+c)*c-1.0) / ((g-c)*c+1.0);
    return 0.5 * d1*d1 * ( 1.0 + d2*d2 );
}



// Diffuse BRDF Functions

function Diffuse_OrenNayar(roughness: f32, NdotV: f32, NdotL: f32, VdotH: f32): f32 {
    const a: f32 = roughness*roughness;
    const s: f32 = a; // (1.29f + 0.5f * a);
    const s2: f32 = s*s;
    const VdotL: f32 = 2.0 * VdotH *VdotH;
    const Cosri: f32 = VdotL - NdotV*NdotL;
    const c1: f32 = 1.0 - 0.5 * s2 / (s2+0.33);
    const c2: f32 = 0.45 * s2 / (s2+0.09) * Cosri * (Cosri >= 0.0 ? Mathf.max(NdotL,NdotV) : 1.0);
    return Mathf.max(0.0, 1.0/Mathf.PI * (c1+c2) * (1.0+roughness*0.5));
}

function Diffuse_Lambert(NdotV: f32): f32 {
    return Mathf.max(NdotV, 0.0);
}




// calculate shading

function calcSpecular(cNdotH: f32, NdotL: f32, NdotV: f32, cVdotM: f32, f0: f32, roughness: f32, V: Vector, N: Vector): f32 {

    // FRESNEL
    const F: f32 = Mathf.max(F_Schlick(f0, cVdotM), 0.0);

    // DISTRIBUTION
    const D: f32 = Mathf.max(D_GGX(cNdotH, roughness*roughness), 0.0);

    // GEOMETRIC
    const G: f32 = Mathf.max(G_Smith(NdotL, NdotV, roughness*roughness), 0.0);

    // FINAL
    return G*F*D;
}


let tmpH: Vector = Vector.ZERO.copy();
let tmpColorSpecular: Vector = Vector.ZERO.copy();
let tmpColorDiffuse: Vector = Vector.ZERO.copy();
let tmpColorAmbient: Vector = Vector.ZERO.copy();


function calcShading(N: Vector, V: Vector, L: Vector, M: Vector, lightColor: Vector, ambientLight: Vector, baseColor: Vector, metalness: f32, roughness: f32): Vector {

   	// VALUES
    const H: Vector = tmpH.set(V).add(L).normalize();

    const NdotL: f32 = Vector.dot(N, L);
    const NdotV: f32 = Vector.dot(N, V);
    const NdotH: f32 = Vector.dot(N, H);
    const VdotH: f32 = Vector.dot(V, H);
    const LdotH: f32 = Vector.dot(L, H);
    const VdotM: f32 = Vector.dot(V, M);

    const cNdotL: f32 = Mathf.max(0.0, NdotL);
    const cNdotV: f32 = Mathf.max(0.0, NdotV);
    const cNdotH: f32 = Mathf.max(0.0, NdotH);
    const cVdotH: f32 = Mathf.max(0.0, VdotH);
    const cLdotH: f32 = Mathf.max(0.0, LdotH);
    const cVdotM: f32 = Mathf.max(0.0, VdotM);

    const f0: f32 = mix(0.02, 0.6, metalness);

    // SPECULAR
    const specular: f32 = Mathf.max(calcSpecular(cNdotH, NdotL, NdotV, cVdotM, f0, roughness, V, N), 0.0) * (1.0 - roughness);
    const specularColor = tmpColorSpecular.setXYZ(
    	(specular * cNdotL * lightColor.x) * mix(1.0, Mathf.max(0.001, baseColor.x), metalness),
    	(specular * cNdotL * lightColor.y) * mix(1.0, Mathf.max(0.001, baseColor.y), metalness),
    	(specular * cNdotL * lightColor.z) * mix(1.0, Mathf.max(0.001, baseColor.z), metalness)
    );

    // DIFFUSE
    const diffuse: f32 = Mathf.max(Diffuse_OrenNayar(roughness, NdotV, NdotL, VdotH), 0.0);
    const diffuseColor = tmpColorDiffuse.setXYZ(
    	diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * baseColor.x * lightColor.x,
    	diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * baseColor.y * lightColor.y,
    	diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * baseColor.z * lightColor.z
    );

    // AMBIENT
    const ambientColor = tmpColorAmbient.set(ambientLight).mul(baseColor);

    return specularColor.add(diffuseColor).add(ambientColor);
}


let tmpColorReflection: Vector = Vector.ZERO.copy();

function calcReflection(V: Vector, M: Vector, metalness: f32, roughness: f32, baseColor: Vector, reflectionColor: Vector): Vector {

    const VdotM: f32 = Vector.dot(V, M);

    const f0: f32  = mix(0.02, 0.6, metalness);
    const f90: f32 = mix(0.65, 1.0, metalness);

    const envBRDF: f32 = f0 + (f90-f0) * (1.0-VdotM);

    tmpColorReflection.setXYZ(
        envBRDF * reflectionColor.x, //mix(1.0, baseColor.x, metalness) * envBRDF * reflectionColor.x * reflectionColor.x,
        envBRDF * reflectionColor.y, //mix(1.0, baseColor.y, metalness) * envBRDF * reflectionColor.y * reflectionColor.y,
        envBRDF * reflectionColor.z, //mix(1.0, baseColor.z, metalness) * envBRDF * reflectionColor.z * reflectionColor.z,
    );

    return tmpColorReflection;
}



// UTILS

function mix(a: f32, b: f32, t: f32): f32 {
	return a * (1 - t) + b * t;
}