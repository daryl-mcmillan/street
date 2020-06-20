export default class Matrix {

	constructor( values ) {
		this.data = values;
	}
	transpose() {
		const d = this.data;
		return new Matrix([
			d[0], d[4], d[8], d[12],
			d[1], d[5], d[9], d[13],
			d[2], d[6], d[10], d[14],
			d[3], d[7], d[11], d[15]
		]);
	}
	vectorMult( data ) {
		const v = data;
		const m = this.data;
		return [
			m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3],
			m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3],
			m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3],
			m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3]
		];
	}
	matrixMult( matrix ) {
		const l = this.data;
		const r = matrix.data;
		return new Matrix([
			l[0] * r[0]  + l[4] * r[1]  + l[8]  * r[2]  + l[12] * r[3],
			l[1] * r[0]  + l[5] * r[1]  + l[9]  * r[2]  + l[13] * r[3],
			l[2] * r[0]  + l[6] * r[1]  + l[10] * r[2]  + l[14] * r[3],
			l[3] * r[0]  + l[7] * r[1]  + l[11] * r[2]  + l[15] * r[3],

			l[0] * r[4]  + l[4] * r[5]  + l[8]  * r[6]  + l[12] * r[7],
			l[1] * r[4]  + l[5] * r[5]  + l[9]  * r[6]  + l[13] * r[7],
			l[2] * r[4]  + l[6] * r[5]  + l[10] * r[6]  + l[14] * r[7],
			l[3] * r[4]  + l[7] * r[5]  + l[11] * r[6]  + l[15] * r[7],

			l[0] * r[8]  + l[4] * r[9]  + l[8]  * r[10] + l[12] * r[11],
			l[1] * r[8]  + l[5] * r[9]  + l[9]  * r[10] + l[13] * r[11],
			l[2] * r[8]  + l[6] * r[9]  + l[10] * r[10] + l[14] * r[11],
			l[3] * r[8]  + l[7] * r[9]  + l[11] * r[10] + l[15] * r[11],

			l[0] * r[12] + l[4] * r[13] + l[8]  * r[14] + l[12] * r[15],
			l[1] * r[12] + l[5] * r[13] + l[9]  * r[14] + l[13] * r[15],
			l[2] * r[12] + l[6] * r[13] + l[10] * r[14] + l[14] * r[15],
			l[3] * r[12] + l[7] * r[13] + l[11] * r[14] + l[15] * r[15]
		]);
	}
	static translate(x, y, z) {
		return new Matrix([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			x, y, z, 1
		]);
	}
	static rotatez( angle ) {
		return new Matrix([
			Math.cos(angle), Math.sin(angle), 0, 0,
			-Math.sin(angle), Math.cos(angle), 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]);
	}
	static rotatex( angle ) {
		return new Matrix([
			1, 0, 0, 0,
			0, Math.cos(angle), Math.sin(angle), 0,
			0, -Math.sin(angle), Math.cos(angle), 0,
			0, 0, 0, 1
		]);
	}
	static rotatey( angle ) {
		return new Matrix([
			Math.cos(angle), 0, -Math.sin(angle), 0,
			0, 1, 0, 0,
			Math.sin(angle), 0, Math.cos(angle), 0,
			0, 0, 0, 1
		]);
	}
	static project(opts) {
		const width = opts.width | 1;
		const height = opts.height | 1;
		const near = opts.near ? opts.near : 1;
		const far = opts.far ? opts.far : 10000;
		const fov = opts.fov ? opts.fov : Math.PI/4;

		const aspect = width/height;
		const verticalSize = Math.tan( fov ) * near * 2;
		const horizontalSize = verticalSize * aspect;

		return new Matrix( [
			2 * near / ( horizontalSize ), 0,                       0,                              0,
			0,                             2 * near / verticalSize, 0,                              0,
			0,                             0,                       -(far + near) / (far - near),  -2 * far * near / (far - near),
			0,                             0,                       -1,                            0
		] );
	}
}