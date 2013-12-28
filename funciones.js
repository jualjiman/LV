String.prototype.endsWith = function(suffix) {/*aqui estoy modificando el prototipo String, y le estoy agregando a todo objeto String la funcion endsWith*/
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function Levenshtein(a, b) {
	var n = a.length;
	var m = b.length;

	// matriz de cambios mínimos
	var d = [];

	// si una de las dos está vacía, la distancia es insertar todas las otras
	if(n == 0)
		return m;
	if(m == 0)
		return n;

	// inicializamos el peor caso (insertar todas)
	for(var i = 0; i <= n; i++)
		(d[i] = [])[0] = i;
	for(var j = 0; j <= m; j++)
		d[0][j] = j;

	// cada elemento de la matriz será la transición con menor coste
	for(var i = 1, I = 0; i <= n; i++, I++)
	  for(var j = 1, J = 0; j <= m; j++, J++)
	  	if(b[J] == a[I])	
	  		d[i][j] = d[I][J];
	  	else				
	  		d[i][j] = Math.min(d[I][j], d[i][J], d[I][J]) + 1;

	// el menor número de operaciones
	return d[n][m];
}

function cambiarProcesado(){
	$("#cajaTexto textarea").hide();/*desaparesco el textarea*/
	$("#cajaTexto #procesado").css("display","inline-block");/*le digo que el display de procesando ya no sea none ahora sea inline-block*/
	$("#cajaTexto #procesado").hide().fadeIn();/*aparesco el contenedor de texto procesado, el article*/
}

function cambiarNuevo(){
	$("#cajaTexto #procesado").hide();/*desaparesco el article con id procesado*/
	$("#cajaTexto textarea").hide().fadeIn();/*aparesco el text area*/
}

function EncontrarOnKeyUp(evt){//cargar al dar enter en el campo de texto de la pista
    var e = window.event || evt; // for trans-browser compatibility
    var tecla = e.which || e.keyCode;
  if(tecla == 13){Encontrar();}
}
 
function Encontrar() {

	if($('#findWord').val().length > 0){//si el campo de pista no esta vacio

		var shortest = -1;
		var matchlev = null;
		var sm = " ";
		var i = 0;
		var count = 0;
			
		var pista = $('#findWord').val();//obtengo la pista
		var texto = $('#my_textarea').val();//obtengo el texto en el textarea
		var salida = "";//aqui voy a poner el texto que luego colocare en el article
		var coin = 0;//coincidencias
		var aprox = 0;//aproximaciones
		var saprox = "";
		var comit = ""; //caracter omitido
		var palabra = "";//palabra actual
		
		var palabras = texto.split(" ");//convierto el texto del textarea en un arreglo de palabras que por cierto son String, y por esa razon todos tienen ya la funcion endsWith
		for (var i=0; i <= palabras.length-1; i++) {//hago un recorrido del arreglo de palabras
			comit = "";//caracter omitido
			palabra = "";//palabra actual

			var temp = palabras[i];//necesito quitarle antes puntos y comas

			if(temp.endsWith(",") || temp.endsWith(".")){//si la palabra temporal acaba en punto o coma, hay que quitarsela para procesar la palabra
				palabra = temp.substring(0,temp.length-1);//obtengo la palabra
				comit = temp.substring(temp.length-1);//extraigo y deposito aqui el caracter sobrante
			}
			else
				palabra = temp;//si no hay nada que le sobre a la palabra simplemente la deposito en la variable de palabra actual

			var lev = Levenshtein(palabra, pista);//utilizo el algoritmo

			if(lev ==0 ){//si la distancia es 0
				matchlev = pista;//martchlev es igual a pista
				shortest = 0;//pongo esta bandera en 0
				coin++;//le digo que hay una coincidencia mas
				salida+="<div class='coincidencia'>" + palabra + "</div>" + comit + " ";//y pongo en rojo la palabra antes de agregarla a la cadena de salida, y si existe algun caracter omitido que haya extraido lo concateno
			}
			else
				salida+=palabra + comit + " ";//si la distancia es diferente de 0, simplemente concateno la palabra sin estilo y concatenando el caracter omitido

			if (lev <= shortest || shortest < 0) {//bueno esto lo deje igual
				matchlev = pista;
				shortest = lev;
				sm = palabra;
			}

			if(shortest == 0)//si encontre la palabra exacta le digo que encontre el patron exacto
			    $("#aproximacion").text("patron exacto encontrado");
			else//sino le digo cual fue la que mas se parece
				$("#aproximacion").text('Quizo decir "' + sm + '"?');
		}

		$("#cajaTexto #procesado").html(salida);//para casi finalizar pongo todo el texto de salida con todo y los estilos, dentro de article procesado
		$("#patron").text('"' + pista + '"');//pongo en el area de informacion que el patron es la pista
		$("#cantidad").text(coin);//le digo cuantas veces coincidio la palabra...fijese que en la primera linea uso html, en las otras dos text
		//la diferencia es que html respeta el significado de las tags de html y el text lo agarra como si fuera texto simplemente
		//en la primera ocupo las tags, asi que conviene usar html

		cambiarProcesado();//desaparesco el text area y aparesco el article con todo y el contenido que acabo de hacer
	}
	else{//si no habia nada en el cambio de pista
		$('#findWord').focus();//mando el foco a el campo de pista
	}
}

function nuevo(){//este metodo es simplemente para borrar el contenido de el campo findword (en el que se pone la pista)
	$("#findWord").val("");
	$("#findWord").focus();//pongo el foco en el campo de la pista
	cambiarNuevo();//y desaparesco el article con el texto procesado, para aparecer el textarea
}