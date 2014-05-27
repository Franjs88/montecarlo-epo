// Load and instantiate Chance
var Chance = require('chance');
	chance = new Chance();

// load math.js and create an instance
var mathjs = require('mathjs'),
    math = mathjs();

// Load and instantiate Hashmap
var HashMap = require('hashmap').HashMap;

//Numero de escenarios a simular
var escenarios = 250;

// Construimos dos HashMap para nuestro caso de OFFhr
var mapHombres = new HashMap();
var mapMujeres = new HashMap();

//Construimos el mapa de resultado
var mapResultado = new HashMap();

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

/*
* Devuelve el OFFhr dados hb y ret
*/
function calculaOffScore(hb, ret) {
	var offhr = hb - 60*math.sqrt(ret);
	console.log("hb vale = "+hb+"\n");
	console.log("ret vale = "+ret+"\n");
	console.log("offhr vale = "+offhr+"\n")
	return offhr;
}

/**
* Dados unos valores aleatorios de hb y ret, y el sexo de la muestra
* devuelve un valor entero actualizado con el número de positivos detectados.
**/
function buscaPositivos(hb, ret, sex) {
	// Numero de positivos encontrados en EPO
	var positivos = 0;
	var offhr = 0;
	//si los valores generados no son negativos, calculamos offhr
	if(ret > 0 && hb > 0) {
		 offhr = calculaOffScore(hb,ret);
		 console.log("Entra en buscaPositivos con sex = "+sex);

		if(sex === "H") {
			//console.log("Entra en Hombres\n");
			//Iteramos el mapa completo en busca de positivos
			mapHombres.forEach(function(value, key) {
				console.log("OFFhr vale = "+offhr);
				if(offhr > value) {
					positivos++;
					//No se si aqui sería necesario llevar la cuenta de que clave ha dado positivo
					//Es decir, bajo que escenario (TSL,WCSL,WCA)
					//Quiza en un mapa nuevo, como el de arriba: mapResultado
				}
			});
		}
		else if(sex === "M") {
			//console.log("Entra en Mujeres\n");
				mapMujeres.forEach(function(value, key) {
					console.log("OFFhr vale = "+offhr);
					if(offhr > value) {
						positivos++;
						//No se si aqui sería necesario llevar la cuenta de que clave ha dado positivo
						//Es decir, bajo que escenario (TSL,WCSL,WCA)
						//Quiza en un mapa nuevo, como el de arriba: mapResultado
					}
				});	
		}
	}
	
	return positivos;
}

/**
* Dado un numero de casos a simular (numEscenarios), genera valores aleatorios
* siguiendo una distribucion normal (gaussiana).
**/
function iniciarSimulacion(numEscenarios,sexo) {
	var positivosEnc = 0;
	for (var i = 1; i <= numEscenarios; i++) {
		// Habria que generarlo acorde a la media y desv. tipica del conjunto de datos
		// Es decir, para mujeres tanto. Para hombres tanto.
		// chance.normal({mean: 100, dev: 10});
		var hb = chance.normal();		
		var ret = chance.normal();
		positivosEnc = buscaPositivos(hb,ret,sexo);
	};
	return positivosEnc;
}

/*************************
* Empieza la simulacíon
*************************/

//Imprimimos el resultado de la simulacion
console.log("\nSe han encontrado"+iniciarSimulacion(3,"M")+" Positivos en EPO");