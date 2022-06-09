use crate::vector::Vector;

/*
 * Struct holding data about the material of a surface and logic to calculate the interaction of that material with light
 */
 #[derive(Copy, Clone)]
pub struct Material {
     // the "metalness" of the material. "0" = Dialectric, "1" = Metal. For real materials, it's either 0 or 1 
     pub metalness: f32,
     // the "roughness" of the material. "0" = completly smooth, "1" = completly rough
     pub roughness: f32,
     // the color of the material (albedo)
     pub base_color: Vector,
}

impl Material {
    
    // Dummy material
    pub const NONE: Material = Material {
        metalness: 0.0,
        roughness: 0.0,
        base_color: Vector::ZERO,
    };

    /*
     * simplified shading, mainly use for debuggin 
     */
    pub fn shade_simple(self: &Self, light_visibility: f32) -> Vector {
        return Vector::scale(self.base_color, light_visibility);
    }

    /*
     * calculate the interactions with light / the color of a surface with self material 
     */
    pub fn shade(self: &Self, V: Vector, N: Vector, L: Vector, lightColor: Vector, reflectionColor: Vector, ambientLight: Vector) -> Vector {
        let M: Vector = Vector::unit_vector(Vector::mix(N, V, self.roughness));
        let shading = Material::calcShading(N, V, L, M, lightColor, ambientLight, self.base_color, self.metalness, self.roughness);
        let reflection = Material::calcReflection(V, M, self.metalness, self.roughness, self.base_color, reflectionColor);
        return Vector::add(shading, reflection);
    }


    // SOURCE FOR BRDF-fn(s)
    // https://github.com/SMILEY4/SoftwareRenderer/blob/3378c5a25a3777344aaf9ac115fed4f89dd8673b/src/shaderutils.c


    // Normal Distribution fn (NDF)

    fn D_Blinn(NdotH: f32, a: f32) -> f32 {
        return (1.0 / (std::f32::consts::PI*a*a)) * f32::powf(NdotH, 2.0/(a*a) - 2.0);
    }

    fn D_Beckmann(NdotH: f32, a: f32) -> f32 {
        return (1.0 / (std::f32::consts::PI * a*a * NdotH*NdotH*NdotH*NdotH) ) * f32::exp((NdotH*NdotH-1.0)/(a*a*NdotH*NdotH));
    }

    fn D_GGX(NdotH: f32, a: f32) -> f32 {
        let d = NdotH*NdotH * (a*a-1.0) + 1.0;
        return (a*a) / (std::f32::consts::PI * d*d);
    }


    // Geometric Shadowing

    fn G_Implicit(NdotL: f32, NdotV: f32) -> f32 {
        return NdotL*NdotV;
    }

    fn G_Neumann(NdotL: f32, NdotV: f32) -> f32 {
        return (NdotL*NdotV) / f32::max(NdotL,NdotV);
    }

    fn G_CookTorrance(NdotL: f32, NdotV: f32, NdotH: f32, VdotH: f32) -> f32 {
        return f32::min(1.0, f32::min((2.0*NdotH*NdotV)/VdotH, (2.0*NdotH*NdotL)/VdotH));
    }

    fn G_Kelemen(NdotL: f32, NdotV: f32, VdotH: f32) -> f32 {
        return (NdotL*NdotV)/(VdotH*VdotH);
    }

    fn Gs_Beckmann(NdotV: f32, a: f32) -> f32 {
        let c = NdotV / (a*f32::sqrt(1.0-NdotV*NdotV));
        if c < 1.6 {
            return (3.535*c + 2.181*c*c)/(1.0+2.276*c+2.577*c*c);
        } else {
            return 1.0;
        }
    }

    fn Gs_GGX(NdotV: f32, a: f32) -> f32 {
        return (2.0*NdotV) / ( NdotV + f32::sqrt(a*a+(1.0-a*a)*NdotV*NdotV) );
    }

    fn Gs_SchlickBeckmann(NdotV: f32, a: f32) -> f32 {
        let k = a*f32::sqrt(2.0/std::f32::consts::PI);
        return NdotV * ( NdotV*(1.0-k)+k);
    }

    fn Gs_SchlickGGX(NdotV: f32, a: f32) -> f32 {
        let k = a/2.0;
        return NdotV * ( NdotV*(1.0-k)+k);
    }

    fn G_Smith(NdotL: f32, NdotV: f32, a: f32) -> f32 {
        return Material::Gs_SchlickBeckmann(NdotL,a) * Material::Gs_SchlickBeckmann(NdotV,a);
    }




    // Fresnel

    fn F_Schlick(f0: f32, u: f32) -> f32 {
        let a: f32 = 1.0-u;
        return f0 + (1.0-f0) * a*a*a*a*a;
    }

    fn F_Schlick2(f0: f32, f90: f32, u: f32) -> f32 {
        let a = 1.0-u;
        return f0 + (f90 - f0) * a*a*a*a*a;
    }

    fn F_CookTorrance(f0: f32, u: f32) -> f32 {
        let sqrtF0: f32 = f32::sqrt(f0);
        let n: f32 = (1.0+sqrtF0)/(1.0-sqrtF0);
        let c: f32 = u;
        let g: f32 = f32::sqrt(n*n+c*c-1.0);
        let d1 = (g-c)/(g+c);
        let d2 = ((g+c)*c-1.0) / ((g-c)*c+1.0);
        return 0.5 * d1*d1 * ( 1.0 + d2*d2 );
    }



    // Diffuse BRDF fns

    fn Diffuse_OrenNayar(roughness: f32, NdotV: f32, NdotL: f32, VdotH: f32) -> f32 {
        let a: f32 = roughness*roughness;
        let s: f32 = a; // (1.29f + 0.5f * a);
        let s2: f32 = s*s;
        let VdotL: f32 = 2.0 * VdotH *VdotH;
        let Cosri: f32 = VdotL - NdotV*NdotL;
        let c1: f32 = 1.0 - 0.5 * s2 / (s2+0.33);
        let c2m: f32 = if Cosri > 0.0 { f32::max(NdotL,NdotV) } else { 1.0 };
        let c2: f32 = 0.45 * s2 / (s2+0.09) * Cosri * c2m;
        return f32::max(0.0, 1.0/std::f32::consts::PI * (c1+c2) * (1.0+roughness*0.5));
    }

    fn Diffuse_Lambert(NdotV: f32) -> f32 {
        return f32::max(NdotV, 0.0);
    }




    // calculate shading

    fn calcSpecular(cNdotH: f32, NdotL: f32, NdotV: f32, cVdotM: f32, f0: f32, roughness: f32, V: Vector, N: Vector) -> f32 {

        // FRESNEL
        let F: f32 = f32::max(Material::F_Schlick(f0, cVdotM), 0.0);

        // DISTRIBUTION
        let D: f32 = f32::max(Material::D_GGX(cNdotH, roughness*roughness), 0.0);

        // GEOMETRIC
        let G: f32 = f32::max(Material::G_Smith(NdotL, NdotV, roughness*roughness), 0.0);

        // FINAL
        return G*F*D;
    }


    fn calcShading(N: Vector, V: Vector, L: Vector, M: Vector, lightColor: Vector, ambientLight: Vector, base_color: Vector, metalness: f32, roughness: f32) -> Vector {

        // VALUES

        let H: Vector = Vector::unit_vector(Vector::add(V, L));

        let NdotL: f32 = Vector::dot(N, L);
        let NdotV: f32 = Vector::dot(N, V);
        let NdotH: f32 = Vector::dot(N, H);
        let VdotH: f32 = Vector::dot(V, H);
        let LdotH: f32 = Vector::dot(L, H);
        let VdotM: f32 = Vector::dot(V, M);

        let cNdotL: f32 = f32::max(0.0, NdotL);
        let cNdotV: f32 = f32::max(0.0, NdotV);
        let cNdotH: f32 = f32::max(0.0, NdotH);
        let cVdotH: f32 = f32::max(0.0, VdotH);
        let cLdotH: f32 = f32::max(0.0, LdotH);
        let cVdotM: f32 = f32::max(0.0, VdotM);

        let f0: f32 = Material::mix(0.02, 0.6, metalness);

        // SPECULAR

        let specular: f32 = f32::max(Material::calcSpecular(cNdotH, NdotL, NdotV, cVdotM, f0, roughness, V, N), 0.0) * (1.0 - roughness);

        let specularColor = Vector {
            x: (specular * cNdotL * lightColor.x) * Material::mix(1.0, f32::max(0.001, base_color.x), metalness),
            y: (specular * cNdotL * lightColor.y) * Material::mix(1.0, f32::max(0.001, base_color.y), metalness),
            z: (specular * cNdotL * lightColor.z) * Material::mix(1.0, f32::max(0.001, base_color.z), metalness)
        };

        // DIFFUSE
        let diffuse: f32 = f32::max(Material::Diffuse_OrenNayar(roughness, NdotV, NdotL, VdotH), 0.0);
        let diffuseColor = Vector {
            x: diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * base_color.x * lightColor.x,
            y: diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * base_color.y * lightColor.y,
            z: diffuse * (1.0-f0) * (1.0-metalness) * cNdotL * base_color.z * lightColor.z
        };

        // AMBIENT
        let ambientColor = Vector::mul(ambientLight, base_color);

        return Vector::add3(specularColor, diffuseColor, ambientColor);
    }



    fn calcReflection(V: Vector, M: Vector, metalness: f32, roughness: f32, base_color: Vector, reflectionColor: Vector) -> Vector {

        let VdotM: f32 = Vector::dot(V, M);

        let f0: f32  = Material::mix(0.02, 0.6, metalness);
        let f90: f32 = Material::mix(0.65, 1.0, metalness);

        let envBRDF: f32 = f0 + (f90-f0) * (1.0-VdotM);

        let color = Vector {
            x: envBRDF * reflectionColor.x, //mix(1.0, base_color.x, metalness) * envBRDF * reflectionColor.x * reflectionColor.x,
            y: envBRDF * reflectionColor.y, //mix(1.0, base_color.y, metalness) * envBRDF * reflectionColor.y * reflectionColor.y,
            z: envBRDF * reflectionColor.z, //mix(1.0, base_color.z, metalness) * envBRDF * reflectionColor.z * reflectionColor.z,
        };

        return color;
    }



    // UTILS

    fn mix(a: f32, b: f32, t: f32) -> f32 {
        return a * (1.0 - t) + b * t;
    }

}