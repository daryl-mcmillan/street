import GLCanvas from "./ui/GLCanvas.js";
import BufferBuilder from "./ui/BufferBuilder.js";

async function sleep( ms ) {
	return new Promise( resolve => setTimeout( resolve, ms ) );
}

function triangle( pt1, pt2, pt3 ) {
	const v1 = {
		x: pt1.x - pt3.x,
		y: pt1.y - pt3.y,
		z: pt1.z - pt3.z
	};
	const v2 = {
		x: pt1.x - pt2.x,
		y: pt1.y - pt2.y,
		z: pt1.z - pt2.z
	};
	const cross = {
		x: v1.y * v2.z - v1.z * v2.y,
		y: v1.z * v2.x - v1.x * v2.z,
		z: v1.x * v2.y - v1.y * v2.x
	};
	const length = Math.sqrt( cross.x * cross.x + cross.y * cross.y + cross.z * cross.z );
	const normal = {
		x: cross.x / length,
		y: cross.y / length,
		z: cross.z / length
	};
	
	function writePoint( pt, builder ) {
		builder.pushFloat32( pt.x );
		builder.pushFloat32( pt.y );
		builder.pushFloat32( pt.z );
		builder.pushFloat32( normal.x );
		builder.pushFloat32( normal.y );
		builder.pushFloat32( normal.z );
	}
	console.log( normal );
	return {
		write: function( bufferBuilder ) {
			writePoint( pt1, bufferBuilder );
			writePoint( pt2, bufferBuilder );
			writePoint( pt3, bufferBuilder );
		}
	};
}

async function run() {
	const canvas = new GLCanvas( document.body );
	const bufferBuilder = new BufferBuilder( 6 * 4 * 12 );
	triangle(
		{ x:5,  y:5, z:0 },
		{ x:-5, y:5, z:0 },
		{ x:0,  y:0, z:-5 }
	).write( bufferBuilder );
	triangle(
		{ x:0,  y:0, z:-5 },
		{ x:5, y:-5, z:0 },
		{ x:5,  y:5, z:0 }
	).write( bufferBuilder );
	triangle(
		{ x:0,  y:0, z:-5 },
		{ x:-5, y:-5, z:0 },
		{ x:5,  y:-5, z:0 }
	).write( bufferBuilder );
	triangle(
		{ x:0,  y:0, z:-5 },
		{ x:-5, y:5, z:0 },
		{ x:-5,  y:-5, z:0 }
	).write( bufferBuilder );
	
	const displayList = canvas.createDisplayList( 'TRIANGLES', 12, bufferBuilder.buffer );

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
