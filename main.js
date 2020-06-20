import GLCanvas from "./ui/GLCanvas.js";

async function sleep( ms ) {
	return new Promise( resolve => setTimeout( resolve, ms ) );
}

async function run() {
	const canvas = new GLCanvas( document.body );
	const displayList = canvas.createDisplayList( 'TRIANGLES', 12, [
		5, 5, 0,  0, 0.707, -0.707,
		-5, 5, 0, 0, 0.707, -0.707,
		0, 0, -5, 0, 0.707, -0.707,
		
		0, 0, -5, 0.707, 0, -0.707,
		5, -5, 0, 0.707, 0, -0.707,
		5, 5, 0,  0.707, 0, -0.707,

		0, 0, -5,  0, -0.707, -0.707,
		-5, -5, 0, 0, -0.707, -0.707,
		5, -5, 0,  0, -0.707, -0.707,

		0, 0, -5,  -0.707, 0, -0.707,
		-5, 5, 0,  -0.707, 0, -0.707,
		-5, -5, 0, -0.707, 0, -0.707,
	]);

	const shader = canvas.createShaderMaterial({
		attributes: [ "aPosition", "aNormal" ],
		uniforms: [ "uTime", "uProjection", "uLight" ],
		vertexShader: `
			attribute mediump vec3 aPosition;
			attribute mediump vec3 aNormal;

			uniform float uTime;
			uniform vec3 uLight;
			uniform mat4 uProjection;

			varying lowp vec3 vColor;

			void main(void) {
				gl_Position = uProjection * vec4( aPosition, 1.0 );
				gl_PointSize = 100.0 / gl_Position.w;
				vColor = -dot(aNormal, uLight) * vec3( 1.0, 1.0, 1.0 );
			}
		`,
		fragmentShader: `

			varying lowp vec3 vColor;

			void main(void) {
				gl_FragColor = vec4(vColor, 1.0);
			}
		`
	});
	
	const startTime = performance.now();
	function draw() {
		const time = ( performance.now() - startTime ) * 0.001;
		canvas.clear();
		canvas.draw( time, shader, displayList );
		requestAnimationFrame( draw );
	}
	draw();

}

run();
