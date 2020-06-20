function createShader( gl, type, script ) {
	const shader = gl.createShader( type );
	gl.shaderSource( shader, script );
	gl.compileShader( shader );
	if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
		throw new Error( "error in shader: " + gl.getShaderInfoLog( shader ) );
	}
	return shader;
}

export default class ShaderMaterial {
	constructor( gl, shader ) {
		this._gl = gl;
		this._shader = shader;
	}
	use() {
		this._gl.useProgram( this._shader );
	}
	enableAttribute( name ) {
		this._gl.enableVertexAttribArray(this.getAttribLocation(name));
	}
	getAttribLocation( name ) {
		return this._gl.getAttribLocation( this._shader, name );
	}
	getUniformLocation( name ) {
		return this._gl.getUniformLocation( this._shader, name );
	}
	static create( gl, vertexShader, fragmentShader ) {
		const shaderProgram = gl.createProgram();
		gl.attachShader( shaderProgram, createShader( gl, gl.VERTEX_SHADER, vertexShader ) );
		gl.attachShader( shaderProgram, createShader( gl, gl.FRAGMENT_SHADER, fragmentShader ) );
		gl.linkProgram( shaderProgram );
		if( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
			throw new Error( "Could not initialise shaders" );
		}
		return new ShaderMaterial( gl, shaderProgram );
	}
}