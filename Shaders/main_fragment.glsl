precision mediump float;

varying vec4 fragTexCoord;

uniform sampler2D sampler_1;
uniform vec2 topAndBottom;

void main() 
{
   float topHardness = 0.1;
   float topInset = 0.0;
   float bottomHardness = 0.1;
   float bottomInset = 0.0;
   vec4 fadeTint = vec4(0.091,0.0,0.0,1.0);
   
   vec2 v_UV = gl_FragCoord.xy / fragTexCoord.zw;
   vec2 u_UV = vec2(fragTexCoord.x,1.0 - fragTexCoord.y);

   float fadeTop = 1.0 - smoothstep(topAndBottom.y - topInset, topAndBottom.y + topHardness, v_UV.y); // y and 1.0
   float fadeBottom = smoothstep(topAndBottom.x - bottomHardness, topAndBottom.x + bottomInset, v_UV.y); //0.0 and x
   float fades = clamp(0.0, 1.0, (fadeTop * fadeBottom) + 0.50); // + 0.0 REMOVE 0.5

   vec4 tintColour_1 = vec4(fadeTop, fadeTop, fadeTop, 1.0);
   vec4 tintColour_2 = vec4(fadeBottom, fadeBottom, fadeBottom, 1.0);

   vec4 tintColour_3 = vec4(fades,fades,fades,1.0);

   vec4 img = texture2D(sampler_1,u_UV);

   gl_FragColor = mix(fadeTint, img, fades);
   //gl_FragColor = texture2D(sampler_1,fragTexCoord.xy) * tintColour;
}