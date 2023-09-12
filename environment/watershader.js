/* global AFRAME, THREE */

// Shader adapted from https://www.shadertoy.com/view/wdKXzd

var noiseFunctions = `
vec2 hash( vec2 x, float time) 
{
    float s = mod(x.x+x.y,2.)*2.-1.;   // flow noise checkered rotation direction
    s *= time;                         // same rotation speed at all scales
    const vec2 k = vec2( .3183099, .3678794 );
    x = x*k + k.yx + 5.;
    return ( -1. + 2.*fract( 16. * k*fract( x.x*x.y*(x.x+x.y)) ) ) 
        *  mat2(cos( s + vec4(0,33,11,0))); // rotating gradients. rot: https://www.shadertoy.com/view/XlsyWX
}

float noise( vec2 p, float time )
{
    vec2 i = floor( p ),
         f = fract( p ),
	     u = f*f*(3.-2.*f);

#define P(x,y) dot( hash( i + vec2(x,y), time ), f - vec2(x,y) )
    return mix( mix( P(0,0), P(1,0), u.x),
                mix( P(0,1), P(1,1), u.x), u.y);
}
`;

var shaderVariables = `
    uniform float time;
    varying float t;
    varying vec3 p;
    varying float distance;
`;

AFRAME.registerShader('water', {
  schema: {
    time:    { type: 'time', is: 'uniform'},
  },
  
  vertexShader: 
    shaderVariables + `
    void main()
    {
        t = time;
        p = position;  
        vec4 pos = modelViewMatrix * vec4(position, 1.0);
        distance = -pos.z;    
        gl_Position = projectionMatrix * pos;
    }
  `,
  
  fragmentShader: 
    noiseFunctions + 
    shaderVariables + `

    void main() {
        vec3 temp = vec3(1.0,1.0,1.0);
        float depth = max(0., (15.-distance)/15.);
        depth *= depth;
        
        float n1 = noise(vec2(p.xy*4.), t/1000.);
        float n2 = noise(vec2(p.xy*4.), t/1000. + 1.);
        float l1 = step(abs(n1),0.02);
        float l2 = step(abs(n2),0.02) * 0.5;
        float wl = n1;
        
        gl_FragColor = vec4(0.1+(l1+l2)*depth,0.6+(l1+l2)*depth,0.7+(l1+l2)*depth,1) * (1. - wl * depth);
    }
  `
});
