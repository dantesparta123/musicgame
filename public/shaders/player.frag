// player.frag
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;

  vec2 center = st - vec2(0.5);
  float r = length(center);

  float wave = 0.5 + 0.5 * sin(20.0 * r - u_time * 2.0);
  float mask = smoothstep(0.01, 0.005, abs(r - 0.2));

  vec3 color = vec3(1.0, wave, wave) * mask;

  gl_FragColor = vec4(color, 1.0);
}
