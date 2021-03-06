/*************************************************
 * Practica - Computación para Ciencias e Ingeniería
 * 
 * Evaluación de la Calidad de los Marcadores 
 * Antidopaje por Medio de Métodos de Monte Carlo
 *
 * Author: Francisco Javier Sánchez Carmona
 * Date: 28 Mayo 2014
 * 
 * **********************************************/

// Lib for Cloning objects in JS
var clone = require('clone');

// So we could have CSV with our results
fs = require("fs");

// Load and instantiate Chance
var Chance = require('chance');
	chance = new Chance();

// load math.js and create an instance
var mathjs = require('mathjs'),
    math = mathjs();

// Load and instantiate Hashmap
var HashMap = require('hashmap').HashMap;

// Construimos dos HashMap para nuestro caso de OFFhr
var mapHombres = new HashMap();
var mapMujeres = new HashMap();

//Construimos los mapas de resultado
var mapResHombres = new HashMap();
var mapResMujeres = new HashMap();

// Primera Columna TSL Hombres
mapHombres.set("H-1-10-TSL",100.1);
mapHombres.set("H-1-100-TSL",112.4);
mapHombres.set("H-1-1000-TSL",121.1);
mapHombres.set("H-1-10000-TSL",129.2);

// Segunda Columna WCSL Hombres
mapHombres.set("H-1-10-WCSL",104.6);
mapHombres.set("H-1-100-WCSL",116.7);
mapHombres.set("H-1-1000-WCSL",125.6);
mapHombres.set("H-1-10000-WCSL",133.2);

// Tercera Columna WCA Hombres
mapHombres.set("H-1-10-WCA",113.7);
mapHombres.set("H-1-100-WCA",125.3);
mapHombres.set("H-1-1000-WCA",134.0);
mapHombres.set("H-1-10000-WCA",141.3);

// Primera Columan TSL Mujeres
mapMujeres.set("M-1-10-TSL",86.1);
mapMujeres.set("M-1-100-TSL",98.7);
mapMujeres.set("M-1-1000-TSL",108.1);
mapMujeres.set("M-1-10000-TSL",116.1);

// Segunda Columna WCSL Mujeres
mapMujeres.set("M-1-10-WCSL",92.2);
mapMujeres.set("M-1-100-WCSL",104.4);
mapMujeres.set("M-1-1000-WCSL",113.5);
mapMujeres.set("M-1-10000-WCSL",121.4);

// Tercera Columna WCA Mujeres
mapMujeres.set("M-1-10-WCA",99.9);
mapMujeres.set("M-1-100-WCA",111.7);
mapMujeres.set("M-1-1000-WCA",120.5);
mapMujeres.set("M-1-10000-WCA",128.1);

/*
* Devuelve el OFFhr dados hb y ret
*/
function calculaOffScore(hb, ret) {
	var offhr = hb - 60*math.sqrt(ret);
	return offhr;
}

/**
* Immprime por pantalla un HashMap dado
**/
function mostrarResultados(hashMap,numIter) {
	hashMap.forEach(function(value, key){
		console.log("Escenario: "+key + " | " + " % Error: "+((value*100)/numIter)+"\n");
	});
}

function inicializaHashMap(hashMap) {
	hashMap.forEach(function(value, key) {
		hashMap.set(key,0);
	});
	return hashMap;
}

/**
* Dados unos valores aleatorios de hb y ret, un hashMap, 
* rellena el hashMap correspondiente
**/
function buscaPositivos(numEscenarios, hbMedia, hbStdDev, retMedia, retStdDev, map) {
	var offhr = 0;
	// Construimos el resultado para los positivos
	mapResultado = clone(map);
	//Ponemos a ceros todos los values de MapResultado
	mapResultado = inicializaHashMap(mapResultado);

	// Comenzamos la simulacion
	for (var i = 1; i <= numEscenarios; i++) {
		var hb = -1;
		var ret = -1;
		// Si se genera un numero negativo forzamos la generacion de otro
		while(hb < 0 || ret < 0) {
			hb = chance.normal({mean: hbMedia, dev: hbStdDev});
			ret = chance.normal({mean: retMedia, dev: retStdDev});
		}
		
		offhr = calculaOffScore(hb,ret);
		//Iteramos el mapa completo en busca de positivos
		map.forEach(function(value, key) {
			if(offhr > value) {
				var valorOriginal = mapResultado.get(key);
				mapResultado.set(key, ++valorOriginal);
			}
		});
	}	
	return mapResultado;
}

/**
* Dado un numero de casos a simular (numEscenarios), para un género dado (sexo)
* genera valores aleatorios siguiendo una distribucion normal (gaussiana).
**/
function simulacionBasica(numEscenarios,sexo) {
	var hbMedia = 0;
	var hbStdDev = 0;
	var retMedia = 0;
	var retStdDev = 0;
	// Si son hombres
	if(sexo === "H") {
		hbMedia = 153.0354839;
		hbStdDev = 10.2799068;
		retMedia = 1.07185484;
		retStdDev = 0.91594774;
		mapResHombres = buscaPositivos(numEscenarios,hbMedia,hbStdDev,
			retMedia, retStdDev, mapHombres);
	} // Si son mujeres
	else if (sexo === "M") {
		hbMedia = 138.1539683;
		hbStdDev = 11.0633002;
		retMedia = 1.30269841;
		retStdDev = 0.83675812;
		mapResMujeres = buscaPositivos(numEscenarios,hbMedia,hbStdDev,
			retMedia, retStdDev, mapMujeres);
	}
}

/**
* Dado un numero de casos a simular (numEscenarios), para un género dado (sexo)
* genera valores aleatorios siguiendo una distribucion normal (gaussiana).
* Extraido de datos proporcionados por New England Journal of Medicine.
**/
function simulacionAlternativa(numEscenarios,sexo) {
	var hbMedia = 0;
	var hbStdDev = 0;
	var retMedia = 0;
	var retStdDev = 0;
	// Si son hombres
	if(sexo === "H") {
		//Acorde a 3 Sigma
		hbMedia = 155.0;
		hbStdDev = (175 - 155)/3;
		retMedia = 1.1;
		retStdDev = (2.2 -1.1)/3;
		mapResHombres = buscaPositivos(numEscenarios,hbMedia,hbStdDev,
			retMedia, retStdDev, mapHombres);
	} // Si son mujeres
	else if (sexo === "M") {
		hbMedia = 140.0;
		hbStdDev = (160 - 140)/3;
		retMedia = 1.25;
		retStdDev = (2.2 - 1.25)/3;
		mapResMujeres = buscaPositivos(numEscenarios,hbMedia,hbStdDev,
			retMedia, retStdDev, mapMujeres);
	}
}

function escribeCsv(hashMap) {
	var cont = 0;
	var outData = "1-10-TSL, 1-100-TSL, 1-1000-TSL, 1-10000-TSL, 1-10-WCSL" +
				"1-100-WCSL,1-1000-WCSL,1-10000-WCSL,1-10-WCA,1-100-WCA,1-1000-WCA,1-10000-WCA\n";
	hashMap.forEach(function(value, key){
		outData += hashMap.get(key);
		if(cont < 11) {
			outData += ","
			++cont
		}
	});
	return outData;
}

/******************************
*
* Empieza la simulacíon
*
*******************************/
var numSimulaciones = 10000;
/*
* Simulacion basica Hombres
*/
var startTime = Date.now();
simulacionBasica(numSimulaciones,"H");
var endTime = Date.now();

//Mostramos resultados
console.log("\nLa simulacion basica para HOMBRES da como resultados: \n");
mostrarResultados(mapResHombres,numSimulaciones);
console.log("\n===== La simulacion tardó: " + (endTime - startTime) + " milisegundos");

//Volcamos datos a fichero csv
var outH = escribeCsv(mapResHombres);
fs.writeFile("results-basic-hombres-epo.csv", outH);

/*
* simulacion alternativa hombres
*/
startTime = Date.now();
simulacionAlternativa(numSimulaciones,"H");
endTime = Date.now();

//Mostramos resultados
console.log("\nLa simulacion alternativa para HOMBRES da como resultados: \n");
mostrarResultados(mapResHombres, numSimulaciones);
console.log("\n===== La simulacion tardó: " + (endTime - startTime) + " milisegundos");

//Volcamos datos a fichero csv
var outHa = escribeCsv(mapResHombres);
fs.writeFile("results-alt-hombres-epo.csv", outHa);

/*
* Simulacion basica mujeres
*/
startTime = Date.now();
simulacionBasica(numSimulaciones,"M")
endTime = Date.now();

//Mostramos resultados
console.log("\nLa simulacion basica para MUJERES da como resultados: \n");
mostrarResultados(mapResMujeres, numSimulaciones);
console.log("\n===== La simulacion tardó: " + (endTime - startTime) + " milisegundos");

//Volcamos datos a fichero csv
var outM = escribeCsv(mapResMujeres);
fs.writeFile("results-basic-mujeres-epo.csv", outM);

/*
* Simulacion alternativa mujeres
*/
startTime = Date.now();
simulacionAlternativa(numSimulaciones,"M")
endTime = Date.now();

//Mostramos resultados
console.log("\nLa simulacion alternativa para MUJERES da como resultados: \n");
mostrarResultados(mapResMujeres, numSimulaciones);
console.log("\n===== La simulacion tardó: " + (endTime - startTime) + " milisegundos");

//Volcamos datos a fichero csv
var outM = escribeCsv(mapResMujeres);
fs.writeFile("results-alt-mujeres-epo.csv", outM);