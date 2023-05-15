#include "lib/Compatibility.frag"

#define USE_VIEW_POSITION
#define USE_LIGHTS
#define USE_NORMAL

#define FEATURE_EMISSIVE_MAPPING
#define FEATURE_SORSKOOT

#define TEXTURED
#define ALPHA_MASKED

#define USE_TEXTURE_COORDS
#define USE_MATERIAL_ID

#ifdef EMISSIVE_MAPPING
#define USE_EMISSIVE_MAPPING
#endif

#if NUM_LIGHTS > 0
#define USE_POSITION_WORLD
#endif

#if NUM_SHADOWS > 0
#define USE_POSITION_VIEW
#endif

#include "lib/Inputs.frag"

#if NUM_LIGHTS > 0
#include "lib/Quaternion.glsl"
#include "lib/Lights.frag"
#endif

#include "lib/Textures.frag"
#include "lib/Surface.frag"
#include "lib/Materials.frag"


struct Material {
    mediump uint flatTexture;
    #ifdef EMISSIVE_MAPPING
    mediump uint emissiveTexture;
    #endif
};

Material decodeMaterial(uint matIndex) {
    {{decoder}}
    return mat;
}

float gaussianValue(vec2 B, float k) {
    float Ax = exp(-k * pow(B.x, 2.0)) + exp(-k * pow(B.x - 1.0, 2.0));
    float Ay = exp(-k * pow(B.y, 2.0)) + exp(-k * pow(B.y - 1.0, 2.0));
    float A = Ax * Ay;
    return A;
}

float fogFactorExp2(float dist, float density) {
    const float LOG2 = -1.442695;
    float d = density * dist;
    return 1.0 - clamp(exp2(d*d*LOG2), 0.0, 1.0);
}

mediump float phongDiffuseBrdf(mediump vec3 lightDir, mediump vec3 normal) {
    return max(0.0, dot(lightDir, normal));
}

void main() {
    // float pixelSize = 16.0;
    // vec2 uv = (floor(fragTextureCoords*pixelSize)+0.5)/pixelSize;

    // // alphaMask(fragMaterialId, uv);
    // Material mat = decodeMaterial(fragMaterialId);
    // outColor = textureAtlas(mat.flatTexture, uv);

     float pixelSize = 16.0;
    vec2 uv = fragTextureCoords * pixelSize;

    // Calculate smoothstep factors for the x and y directions.
    vec2 f = fract(uv);
    float smoothFactorX = smoothstep(0.49, 0.51, f.x);
    float smoothFactorY = smoothstep(0.49, 0.51, f.y);

    // Find the four closest texture coordinates.
    vec2 topLeftUV = (floor(uv) + 0.5) / pixelSize;
    vec2 topRightUV = (floor(uv) + vec2(1.5, 0.5)) / pixelSize;
    vec2 bottomLeftUV = (floor(uv) + vec2(0.5, 1.5)) / pixelSize;
    vec2 bottomRightUV = (floor(uv) + vec2(1.5, 1.5)) / pixelSize;

    Material mat = decodeMaterial(fragMaterialId);

    // // Sample the four closest texels.
    // vec4 topLeftColor = textureAtlas(mat.flatTexture, topLeftUV);
    // vec4 topRightColor = textureAtlas(mat.flatTexture,topRightUV);
    // vec4 bottomLeftColor = textureAtlas(mat.flatTexture,bottomLeftUV);
    // vec4 bottomRightColor = textureAtlas(mat.flatTexture,bottomRightUV);

    // // Linearly interpolate between horizontal pairs using smoothFactorX.
    // vec4 topColorBlend = mix(topLeftColor,topRightColor,smoothFactorX);
    // vec4 bottomColorBlend=mix(bottomLeftColor,bottomRightColor,smoothFactorX);

    // //Linearly interpolate between vertical pairs using smoothFactorY
    // outColor=mix(topColorBlend,bottomColorBlend,smoothFactorY);
  
    vec4 emissiveAmount = vec4(0.0);
    #ifdef EMISSIVE_MAPPING
        emissiveAmount = textureAtlas(mat.emissiveTexture, topLeftUV);
    #endif

    vec4 pixelated = textureAtlas(mat.flatTexture, topLeftUV);
    vec4 original = textureAtlas(mat.flatTexture, clamp(fragTextureCoords, 1.0/32.0, 1.0-1.0/32.0));
    
   

    vec4 finalColor = mix(pixelated,original,gaussianValue(fragTextureCoords, 64.0));

    float dist = gl_FragCoord.z/gl_FragCoord.w;
    float fogFactor = fogFactorExp2(dist, 0.1);
    vec4 theColor = mix(finalColor, vec4(0.,0.,0.,1.), fogFactor);
    
    SurfaceData surface = computeSurfaceData(fragNormal);
    mediump vec3 normal = surface.normal;
    outColor = vec4(0.0,0.0,0.0,1.0);
 #if NUM_LIGHTS > 0
        mediump vec3 viewDir = normalize(fragPositionWorld - viewPositionWorld);
        lowp uint i = 0u;
        for(; i < numPointLights; ++i) {
            mediump vec4 lightData = lightColors[i];
            /* dot product of mediump vec3 can be NaN for distances > 128 */
            highp vec3 lightPos = lightPositionsWorld[i];
            highp vec3 lightDirAccurate = lightPos - fragPositionWorld;
            mediump float distSq = dot(lightDirAccurate, lightDirAccurate);
            mediump float attenuation = distanceAttenuation(distSq, lightData.a);

            if(attenuation < 0.001)
                continue;
            
            mediump vec3 lightDir = lightDirAccurate;
            lightDir *= inversesqrt(distSq);

            /* Add diffuse color */
            mediump vec3 value = theColor.rgb*phongDiffuseBrdf(lightDir, normal);
            outColor.rgb += attenuation*value*lightData.rgb;
        }
    #endif

    
    //outColor.rgb = mix(theColor.rgb,finalColor.rgb,emissiveAmount.r);
    //outColor.a = finalColor.a; // Force alpha back in
}
