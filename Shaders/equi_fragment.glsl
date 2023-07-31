precision mediump float;

varying vec2 fragTexCoord;

uniform sampler2D sampler_1;

void main() 
{ 
   gl_FragColor = texture2D(sampler_1, fragTexCoord);
}