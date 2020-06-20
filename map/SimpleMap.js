import SimpleMapRoute from './SimpleMapRoute.js'

class SimpleMap {
	constructor() {
	}
	addLocation( coords ) {
	}
	getRoute( startLocation, endLocation ) {
		return new SimpleMapRoute( startLocation, endLocation );
	}
}