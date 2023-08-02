precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;

varying vec2 fragTexCoord;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
   fragTexCoord = vec2(vertTexCoord.x, 1.0 - vertTexCoord.y);
   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}