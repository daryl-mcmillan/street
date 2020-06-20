import Matrix from './Matrix.js';
import ShaderMaterial from './ShaderMaterial.js';

export default class Canvas {
	constructor(parentElement) {
		// set up html elements
		parentElement.style.overflow = "hidden";
		const width = parentElement.clientWidth;
		const height = parentElement.clientHeight;
		this._canvas = document.createElement( "canvas" );
		this._canvas.width = width;
		this._canvas.height = height;
		this._canvas.style.width = width;
		this._canvas.style.height = height;
		this._canvas.style.position = "absolute";
		this._canvas.style.left = "0";
		this._canvas.style.top = "0";
		parentElement.style.padding = "0";
		parentElement.style.margin = "0";
		parentElement.appendChild( this._canvas );
		const gl = this._canvas.getContext( "webgl" );
		this._gl = gl;
		gl.viewport(0, 0, width, height);

		this._projection = Matrix.project({
			width: width,
			height: height
		});

	}
	createShaderMaterial( opts ) {
		return ShaderMaterial.create( this._gl, opts );
	}
	setData( entities ) {
		this._setData( entities );
	}
	createDisplayList( drawType, itemCount, data ) {
		const gl = this._gl;
		const typeMap = {
			POINTS: gl.POINTS,
			TRIANGLES: gl.TRIANGLES
		};
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
		return {
			buffer: buffer,
			bufferLength: itemCount,
			drawType: typeMap[ drawType ]
		};
	}
	clear() {
		const gl = this._gl;
		gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
	}
	draw( t, shader, displayList ) {
		const gl = this._gl;

		const transform = this._projection.matrixMult( Matrix.translate( 0, 0, -10 ) );

		shader.use();

		gl.uniform1f(shader.uniforms.uTime, t);
		gl.uniformMatrix4fv(shader.uniforms.uProjection, false, transform.data );
		const angle = t / 2;
		const light = [
			0.707 * Math.sin( angle ),
			0.707 * Math.cos( angle ),
			0.707
		];
		gl.uniform3fv(shader.uniforms.uLight, light );

		gl.bindBuffer(gl.ARRAY_BUFFER, displayList.buffer);
		gl.vertexAttribPointer(shader.attributes.aPosition, 3, gl.FLOAT, false, 4*6, 0);
		gl.vertexAttribPointer(shader.attributes.aNormal, 3, gl.FLOAT, false, 4*6, 4*3);
		gl.drawArrays(displayList.drawType, 0, displayList.bufferLength);
	}
}