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
	createShaderMaterial( vertexScript, fragmentScript ) {
		return ShaderMaterial.create( this._gl, vertexScript, fragmentScript );
	}
	setData( entities ) {
		this._setData( entities );
	}
	createDisplayList( entities ) {
		const gl = this._gl;
		const data = [];
		var bufferLength = 0;
		entities.forEach( entity => {
			data.push( entity.position.x );
			data.push( entity.position.y );
			data.push( entity.velocity.x );
			data.push( entity.velocity.y );
			data.push( entity.lastUpdate );
			data.push( entity.color.r );
			data.push( entity.color.g );
			data.push( entity.color.b );
			bufferLength += 1;
		});
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
		return {
			buffer: buffer,
			bufferLength: bufferLength
		};
	}
	clear() {
		const gl = this._gl;
		gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
	draw( t, shader, displayList ) {
		const gl = this._gl;

		const transform = this._projection.matrixMult( Matrix.translate( 0, 0, -10 ) );

		shader.use();

		gl.uniform1f(shader.getUniformLocation("uTime"), t);
		gl.uniformMatrix4fv(shader.getUniformLocation("uProjection"), false, transform.data );

		gl.bindBuffer(gl.ARRAY_BUFFER, displayList.buffer);
		gl.vertexAttribPointer(shader.getAttribLocation("aPosition"), 2, gl.FLOAT, false, 4*8, 0);
		gl.vertexAttribPointer(shader.getAttribLocation("aVelocity"), 2, gl.FLOAT, false, 4*8, 4*2);
		gl.vertexAttribPointer(shader.getAttribLocation("aLastUpdate"), 1, gl.FLOAT, false, 4*8, 4*4);
		gl.vertexAttribPointer(shader.getAttribLocation("aColor"), 3, gl.FLOAT, false, 4*8, 4*5);
		gl.drawArrays(gl.POINTS, 0, displayList.bufferLength);
	}
}