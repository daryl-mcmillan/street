import GLCanvas from "./ui/GLCanvas.js";

async function sleep( ms ) {
	return new Promise( resolve => setTimeout( resolve, ms ) );
}

async function run() {
	const canvas = new GLCanvas( document.body );
	const displayList = canvas.createDisplayList([
		{
			position: { x:0.5, y:0.5 },
			velocity: { x:0.5, y:0.5 },
			lastUpdate: 0,
			color: { r:1, g:0, b:0 }
		},
		{
			position: { x:-0.5, y:0.5 },
			velocity: { x:0.5, y:0.5 },
			lastUpdate: 0,
			color: { r:1, g:0, b:0 }
		},
		{
			position: { x:-0.5, y:-0.5 },
			velocity: { x:0.5, y:0.5 },
			lastUpdate: 0,
			color: { r:1, g:0, b:0 }
		},
		{
			position: { x:0.5, y:-0.5 },
			velocity: { x:0.5, y:0.5 },
			lastUpdate: 0,
			color: { r:1, g:0, b:0 }
		}
	]);

	const shader = canvas.createShaderMaterial(
		`
			attribute vec2 aPosition;
			attribute vec2 aVelocity;
			attribute float aLastUpdate;
			attribute vec3 aColor;

			uniform float uTime;
			uniform mat4 uProjection;

			varying lowp vec3 vColor;

			void main(void) {
				gl_Position = uProjection * vec4( aPosition + aVelocity * (uTime - aLastUpdate), 0, 1.0 );
				gl_PointSize = 100.0 / gl_Position.w;
				vColor = aColor;
			}
		`,
		`
		varying lowp vec3 vColor;

		void main(void) {
			gl_FragColor = vec4(vColor, 1.0);
		}
		`
	);
	shader.enableAttribute("aPosition");
	shader.enableAttribute("aVelocity");
	shader.enableAttribute("aLastUpdate");
	shader.enableAttribute("aColor");
	
	const startTime = performance.now();
	function draw() {
		const time = ( performance.now() - startTime ) * 0.001;
		canvas.clear();
		canvas.draw( time, shader, displayList );
		requestAnimationFrame( draw );
	}
	draw();

	console.log( "test" );
}

run();
