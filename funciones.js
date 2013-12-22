String.prototype.endsWith = function(suffix) {
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
	$("#cajaTexto textarea").hide();
	$("#cajaTexto #procesado").css("display","inline-block");
	$("#cajaTexto #procesado").hide().fadeIn();
}

function cambiarNuevo(){
	$("#cajaTexto #procesado").hide();
	$("#cajaTexto textarea").hide().fadeIn();
}

function EncontrarOnKeyUp(evt){//cargar al dar enter en el buscador
    var e = window.event || evt; // for trans-browser compatibility
    var tecla = e.which || e.keyCode;
  if(tecla == 13){Encontrar();}
}
 
function Encontrar() {

	if($('#findWord').val().length > 0){

		var shortest = -1;
		var matchlev = null;
		var sm = " ";
		var i = 0;
		var count = 0;
			
		var pista = $('#findWord').val();
		var texto = $('#my_textarea').val();
		var salida = "";
		var coin = 0;//coincidencias
		var aprox = 0;//aproximaciones
		var saprox = "";
		var comit = ""; //caracter omitido
		var palabra = "";//palabra actual
		
		var palabras = texto.split(" ");
		for (var i=0; i <= palabras.length-1; i++) {
			comit = "";
			palabra = "";

			var temp = palabras[i];//necesito quitarle antes puntos y comas

			if(temp.endsWith(",") || temp.endsWith(".")){
				palabra = temp.substring(0,temp.length-1);
				comit = temp.substring(temp.length-1);
			}
			else
				palabra = temp;

			var lev = Levenshtein(palabra, pista);			

			if(lev ==0 ){
				matchlev = pista;
				shortest = 0;
				coin++;
				salida+="<div class='coincidencia'>" + palabra + "</div>" + comit + " ";
			}
			else
				salida+=palabra + comit + " ";

			if (lev <= shortest || shortest < 0) {
				matchlev = pista;
				shortest = lev;
				sm = palabra;
			}

			if(shortest == 0)
			    $("#aproximacion").text("patron exacto encontrado");
			else
				$("#aproximacion").text('Quizo decir "' + sm + '"?');
		}

		$("#cajaTexto #procesado").html(salida);
		$("#patron").text('"' + pista + '"');
		$("#cantidad").text(coin);

		cambiarProcesado();
	}
	else{
		$('#findWord').focus();
	}
}
 
function findWord() {
	var texts = [];
	var shortest = -1;
	var matchlev = null;
	var sm = " ";
	var i = 0;
	var count = 0;
		
		var A = $('#findWord').val();
		var long =jQuery('#my_textarea').val().length;
		var cadt = jQuery('#my_textarea').val();
		
		// take the position of the word in the text
		
		
		 $.each(cadt.split(/ /), function (i, name) {     
            // empty string check
            if(name != ""){
              texts.push(name);
             }        
			//   alert(JSON.stringify(texts));
          });
		  
		for (var i=0; i <= texts.length-1; i++) {
			console.log(texts[i]);
			var lev = Levenshtein(texts[i], A);			
				  
			if (lev ==0 ) {
				matchlev = A;
				shortest = 0;
				count ++;
				alert('Patron encontrado con exito:' + count);
				var posi = jQuery('#my_textarea').val().lastIndexOf(A);
				if (posi != -1) {
					var target = document.getElementById("my_textarea");
					//var l = target.value.length;
					// seleziono la parola
					target.focus();
								
					if (target.setSelectionRange)
						target.setSelectionRange(posi, posi+A.length);						
					else {
						var r = target.createTextRange();
						r.collapse(true);
						r.moveEnd('character',  posi+A);
						r.moveStart('character', posi);
						r.select();   
					} 
								
					var objDiv = document.getElementById("my_textarea");
					var sh = objDiv.scrollHeight; //height in pixel of the textarea
					var line_ht = jQuery('#my_textarea').css('line-height').replace('px',''); //height in pixel of each row
					var n_lines = sh/line_ht; // total amount of lines in the textarea
					var char_in_line = jQuery('#my_textarea').val().length / n_lines; // the total amount of chars in each row
					var height = Math.floor(posi/char_in_line); // height in number of rows of the searched word
					$('#my_textarea').scrollTop(height*line_ht); // scroll to the selected line containing the word
					//break; 
				} 					 
						 
						
			}
			if (lev <= shortest || shortest < 0) {				 
			    matchlev = A;
			    shortest = lev;
				sm = texts[i];
				//de aqui
				var posi = jQuery('#my_textarea').val().lastIndexOf(A);
				
				console.log(texts[i], matchlev, shortest);
				// alert ("Existe una aproximaciòn del patron" + texts[i]);
		    } 			 
		} 
                 
		if (shortest == 0) {
		    alert("Patrón Exacto Encontrado : " + matchlev);
		} else {
			alert("Usted Quesi Decir : "+ matchlev +" y la cadena más aproximada es dentro del texto es:  "+sm);
		} 
}

function nuevo(){
	$("#findWord").val("");
	$("#findWord").focus();
	cambiarNuevo();
}