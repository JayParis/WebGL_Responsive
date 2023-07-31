precision mediump float;

varying vec4 fragTexCoord;

uniform sampler2D sampler_1;
uniform sampler2D sampler_2;
uniform vec2 topAndBottom;

void main() 
{
   float topHardness = 0.1361;
   float bottomHardness = 0.1361;
   float topInset = 0.0;
   float bottomInset = 0.0;

   float topBlurHardness = 0.1;
   float bottomBlurHardness = 0.1;
   float topBlurInset = 0.1;
   float bottomBlurInset = 0.1;

   vec4 fadeTint = vec4(0.091,0.051,0.061,1.0);
   
   vec2 v_UV = gl_FragCoord.xy / fragTexCoord.zw;
   vec2 u_UV = vec2(fragTexCoord.x,fragTexCoord.y);

   float fadeTop = 1.0 - smoothstep(topAndBottom.y - topInset, topAndBottom.y + topHardness, v_UV.y); // y and 1.0
   float fadeBottom = smoothstep(topAndBottom.x - bottomHardness, topAndBottom.x + bottomInset, v_UV.y); //0.0 and x
   float fades = clamp(0.0, 1.0, (fadeTop * fadeBottom) + 0.0);
   
   float blurTop = 1.0 - smoothstep(topAndBottom.y - topBlurInset, topAndBottom.y + topBlurHardness, v_UV.y); // y and 1.0
   float blurBottom = smoothstep(topAndBottom.x - bottomBlurHardness, topAndBottom.x + bottomBlurInset, v_UV.y); //0.0 and x
   float blur = 1.0 - clamp(0.0, 1.0, (blurTop * blurBottom) + 0.0);

   vec4 tintColour_1 = vec4(fadeTop, fadeTop, fadeTop, 1.0);
   vec4 tintColour_2 = vec4(fadeBottom, fadeBottom, fadeBottom, 1.0);

   vec4 tintColour_3 = vec4(fades,fades,fades,1.0);

   vec4 img_1 = texture2D(sampler_1,v_UV);
   vec4 img_2 = texture2D(sampler_2,u_UV);




   const float Pi = 6.28318530718;

   const float Directions = 16.0;
   const float Quality = 4.0;

   float Radius = 0.025 * blur * 2.0;

   vec4 Color = vec4(0);

   if(blur <= 0.01)
   {
      Color = texture2D(sampler_1, v_UV);
   }
   else
   {
      for(float d = 0.0; d<Pi; d += Pi/Directions)
      {
         for(float i = 1.0 / Quality; i <= 1.001; i += 1.0 / Quality)
         {
            Color += texture2D(sampler_1, v_UV + vec2(cos(d),sin(d)) * Radius * i);		
         }
      }

      Color /= Quality * Directions + 1.0;
   }

   vec4 composite = mix(img_2, Color, blur);
   vec4 darkened = mix(fadeTint, composite, fades);

   gl_FragColor = darkened; //darkened

   //float stepf = smoothstep(0.995,0.995005,fragTexCoord.y);
   //gl_FragColor = vec4(stepf,stepf,stepf,1.0);
}