const littleEndian = new Uint8Array( new Uint16Array([1]).buffer )[0] === 1;

export default class BufferBuilder {
	constructor( bufferSize ) {
		this.buffer = new ArrayBuffer( bufferSize );
		this.length = 0;
		this._view = new DataView( this.buffer );
	}
	
	pushBigInt64( val ) {
		this._view.setBigInt64(this.length, val, littleEndian);
		this.length += 8;
	}
	pushBigUint64( val ) {
		this._view.setBigUint64(this.length, val, littleEndian);
		this.length += 8;
	}
	pushFloat32( val ) {
		this._view.setFloat32(this.length, val, littleEndian);
		this.length += 4;
	}
	pushFloat64( val ) {
		this._view.setFloat64(this.length, val, littleEndian);
		this.length += 8;
	}
	pushInt16( val ) {
		this._view.setInt16(this.length, val, littleEndian);
		this.length += 2;
	}
	pushInt32( val ) {
		this._view.setInt32(this.length, val, littleEndian);
		this.length += 4;
	}
	pushInt8( val ) {
		this._view.setInt8(this.length, val);
		this.length += 1;
	}
	pushUint16( val ) {
		this._view.setUint16(this.length, val, littleEndian);
		this.length += 2;
	}
	pushUint32( val ) {
		this._view.setUint32(this.length, val, littleEndian);
		this.length += 4;
	}
	pushUint8( val ) {
		this._view.setUint8(this.length, val);
		this.length += 1;
	}
}