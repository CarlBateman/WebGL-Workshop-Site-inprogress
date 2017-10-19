varying vec3 vPos;
varying vec3 vNormal;
uniform float radiusLimit;

void main() {
  vec3 sphere_pt = position;
  vec3 sphere_normal = normal;
  if (length(position) < radiusLimit) {
    sphere_pt = normalize(position) * radiusLimit;
    sphere_normal = normalize(position);
  }
  vPos = (modelMatrix * vec4(sphere_pt, 1.0)).xyz;

  vNormal = normalMatrix * sphere_normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(sphere_pt, 1.0);
}
