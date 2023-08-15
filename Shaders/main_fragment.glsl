precision mediump float;

varying vec4 fragTexCoord;

uniform sampler2D sampler_1;
uniform sampler2D sampler_2;
uniform vec2 topAndBottom;

uniform vec3 fadeTint;
uniform vec3 mainTint;
uniform float blurMod;
uniform float fullBlur;
uniform vec2 revealProgress;

mat4 brightnessMatrix(float brightness)
{
    return mat4( 1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 brightness, brightness, brightness, 1 );
}

mat4 contrastMatrix(float contrast)
{
	float t = ( 1.0 - contrast ) / 2.0;
    
    return mat4( contrast, 0, 0, 0,
                 0, contrast, 0, 0,
                 0, 0, contrast, 0,
                 t, t, t, 1 );
}

mat4 saturationMatrix(float saturation)
{
    vec3 luminance = vec3( 0.3086, 0.6094, 0.0820 );
    
    float oneMinusSat = 1.0 - saturation;
    
    vec3 red = vec3( luminance.x * oneMinusSat );
    red+= vec3( saturation, 0, 0 );
    
    vec3 green = vec3( luminance.y * oneMinusSat );
    green += vec3( 0, saturation, 0 );
    
    vec3 blue = vec3( luminance.z * oneMinusSat );
    blue += vec3( 0, 0, saturation );
    
    return mat4( red,     0,
                 green,   0,
                 blue,    0,
                 0, 0, 0, 1 );
}

const float brightness = 0.0;
const float contrast = 1.0;
const float saturation = 1.0;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() 
{
   float topHardness = 0.1361;
   float bottomHardness = 0.1361;
   float topInset = 0.1;
   float bottomInset = 0.1;

   float topBlurHardness = 0.01;
   float bottomBlurHardness = 0.01;
   float topBlurInset = 0.16;
   float bottomBlurInset = 0.16;

   
   vec2 v_UV = gl_FragCoord.xy / fragTexCoord.zw;
   vec2 u_UV = vec2(fragTexCoord.x,fragTexCoord.y);

   float fadeTop = 1.0 - smoothstep(topAndBottom.y - topInset, topAndBottom.y + topHardness, v_UV.y); // y and 1.0
   float fadeBottom = smoothstep(topAndBottom.x - bottomHardness, topAndBottom.x + bottomInset, v_UV.y); //0.0 and x
   //float fades = clamp(0.0, 1.0, (fadeTop * fadeBottom) + 0.0);
   float fades = clamp((fadeTop * fadeBottom) + 0.0, 0.0, 1.0);
   
   vec2 c_UV = u_UV * 2.0 - 1.0;
   c_UV.y *= 1.25;
   float reveal = length(c_UV);
   reveal = map(reveal,revealProgress.x,revealProgress.y,0.0,1.0);
   reveal = clamp(reveal,0.0,1.0);

   float blurTop = 1.0 - smoothstep(topAndBottom.y - topBlurInset, topAndBottom.y + topBlurHardness, v_UV.y); // y and 1.0
   float blurBottom = smoothstep(topAndBottom.x - bottomBlurHardness, topAndBottom.x + bottomBlurInset, v_UV.y); //0.0 and x
   //float blurMain = clamp(0.0, 1.0, (blurTop * blurBottom) + 0.0) * (1.0 - fullBlur);
   float blurMain = clamp(blurTop * blurBottom, 0.0, 1.0) * (1.0 - fullBlur);
   float blur = 1.0 - blurMain;
   blur = mix(blur,1.0,reveal);
   //blur = 1.0;

   vec4 tintColour_1 = vec4(fadeTop, fadeTop, fadeTop, 1.0);
   vec4 tintColour_2 = vec4(fadeBottom, fadeBottom, fadeBottom, 1.0);

   vec4 tintColour_3 = vec4(fades,fades,fades,1.0);

   vec4 img_1 = texture2D(sampler_1,v_UV);
   vec4 img_2 = texture2D(sampler_2,u_UV);




   const float Pi = 6.28318530718;

   const float Directions = 16.0;
   const float Quality = 4.0;

   float Radius = 0.025 * blur * 2.0 * blurMod;

   vec4 Color = vec4(0);

   if(blur <= 0.01)
   {
      Color = texture2D(sampler_1, u_UV);
   }
   else
   {
      for(float d = 0.0; d < Pi; d += Pi/Directions)
      {
         for(float i = 1.0 / Quality; i <= 1.001; i += 1.0 / Quality)
         {
            Color += texture2D(sampler_1, u_UV + vec2(cos(d),sin(d)) * Radius * i);		
         }
      }

      Color /= Quality * Directions + 1.0;
   }

   vec4 composite = mix(img_2, Color, blur) * vec4(mainTint,1.0);
   vec4 darkened = mix(vec4(fadeTint,1.0), composite, fades);

   

   // gl_FragColor = texture2D(sampler_1,u_UV); //darkened
   gl_FragColor = brightnessMatrix( brightness ) *
                  contrastMatrix( contrast ) * 
                  saturationMatrix( saturation ) *
                  darkened;

   //gl_FragColor = vec4(vec3(blur),1.0); //reveal

   //gl_FragColor =  darkened;

   //float stepf = smoothstep(0.995,0.995005,fragTexCoord.y);
   //gl_FragColor = vec4(stepf,stepf,stepf,1.0);
}