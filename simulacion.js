// Load and instantiate Chance
var Chance = require('chance');
var chance = new Chance();

// Load and instantiate Hashmap
var HashMap = require('hashmap').HashMap;

//Numero de escenarios a simular
var escenarios = 250;

//Positivos en EPO
var positivos = 0;

// Construimos dos HashMap para nuestro caso de OFFhr
var mapHombres = new HashMap();
var mapMujeres = new HashMap();

// Primera Columna TSL Hombres
mapHombres.set("H-1-10-TSL","100,1");
mapHombres.set("H-1-100-TSL","112,4");
mapHombres.set("H-1-1000-TSL","121,1");
mapHombres.set("H-1-10000-TSL","129,2");

// Segunda Columna WCSL Hombres
mapHombres.set("H-1-10-WCSL","104,6");
mapHombres.set("H-1-100-WCSL","116,7");
mapHombres.set("H-1-1000-WCSL","125,6");
mapHombres.set("H-1-10000-WCSL","133,2");

// Tercera Columna WCA Hombres
mapHombres.set("H-1-10-WCA","113,7");
mapHombres.set("H-1-100-WCA","125,3");
mapHombres.set("H-1-1000-WCA","134,0");
mapHombres.set("H-1-10000-WCA","141,3");

// Primera Columan TSL Mujeres
mapMujeres.set("M-1-10-TSL","86,1");
mapMujeres.set("M-1-100-TSL","98,7");
mapMujeres.set("M-1-1000-TSL","108,1");
mapMujeres.set("M-1-10000-TSL","116,1");

// Segunda Columna WCSL Mujeres
mapMujeres.set("M-1-10-WCSL","92,2");
mapMujeres.set("M-1-100-WCSL","104,4");
mapMujeres.set("M-1-1000-WCSL","113,5");
mapMujeres.set("M-1-10000-WCSL","121,4");

// Tercera Columna WCA Mujeres
mapMujeres.set("M-1-10-WCA","99,9");
mapMujeres.set("M-1-100-WCA","111,7");
mapMujeres.set("M-1-1000-WCA","120,5");
mapMujeres.set("M-1-10000-WCA","128,1");


//Construimos el mapa de resultado
var mapResultado = new HashMap();

//Generamos para Hombres
function positivoEnHombres(offhr) {
	// Habria que generarlo acorde a la media y desv. tipica del conjunto de datos
	// Es decir, para mujeres tanto. Para hombres tanto.
	// chance.normal({mean: 100, dev: 10});
	var generado = chance.normal();
	//Iteramos el mapa completo en busca de positivos
	mapHombres.forEach(function(value, key) {
		if(generado > value) {
			positivos++;
			//No se si aqui sería necesario llevar la cuenta de que clave ha dado positivo
			//Es decir, bajo que escenario (TSL,WCSL,WCA)
			//Quiza en un mapa nuevo, como el de arriba: mapResultado
		}
	});
}


function simular() {

}

/*************************
* Empieza la simulacíon
*************************/

//Genera e imprime por consola
console.log(chance.normal());