varying vec2 vUv;
vec2 uRadius;
void main() {
  vUv = uv;
  vec3 t = normalize(position);
  t *= 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( t, 1.0 );
}