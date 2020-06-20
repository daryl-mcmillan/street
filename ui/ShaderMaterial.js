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
	constructor( gl, shader, attributes, uniforms ) {
		this._gl = gl;
		this._shader = shader;
		this.attributes = attributes;
		this.uniforms = uniforms;
	}
	use() {
		this._gl.useProgram( this._shader );
	}
	static create( gl, opts ) {
		const vertexShader = opts.vertexShader;
		const fragmentShader = opts.fragmentShader;
		const attributeNames = opts.attributes || [];
		const uniformNames = opts.uniforms || [];

		const shaderProgram = gl.createProgram();
		gl.attachShader( shaderProgram, createShader( gl, gl.VERTEX_SHADER, vertexShader ) );
		gl.attachShader( shaderProgram, createShader( gl, gl.FRAGMENT_SHADER, fragmentShader ) );
		gl.linkProgram( shaderProgram );
		if( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
			throw new Error( "Could not initialise shaders" );
		}
		gl.useProgram( shaderProgram );
		const attributes = {};
		attributeNames.forEach( name => {
			const location = gl.getAttribLocation( shaderProgram, name );
			gl.enableVertexAttribArray( location );
			attributes[ name ] = location;
		} );
		const uniforms = {};
		uniformNames.forEach( name => {
			uniforms[ name ] = gl.getUniformLocation( shaderProgram, name );
		} );
		return new ShaderMaterial( gl, shaderProgram, attributes, uniforms );
	}
}