// Clase NodoBK representa un nodo en el árbol BK
class NodoBK {
    constructor(valor) {
        this.valor = valor; // Valor almacenado en el nodo (en este caso, una cadena de síntomas)
        this.hijos = {};    // Diccionario para almacenar los hijos de este nodo
    }
}

// Clase ArbolBK representa el árbol BK en sí
class ArbolBK {
    constructor(funcionDistancia) {
        this.raiz = null;               // La raíz del árbol BK, inicialmente nula
        this.funcionDistancia = funcionDistancia; // Función para calcular la distancia entre dos nodos
    }

    // Método para insertar un valor en el árbol BK
    insertar(valor) {
        if (this.raiz === null) {
            this.raiz = new NodoBK(valor); // Si el árbol está vacío, el nuevo valor se convierte en la raíz
        } else {
            this._insertar(this.raiz, valor); // Si no está vacío, insertar recursivamente
        }
    }

    // Método recursivo para insertar un valor en el árbol BK
    _insertar(nodo, valor) {
        const distancia = this.funcionDistancia(nodo.valor, valor); // Calcula la distancia entre el nodo actual y el nuevo valor
        if (nodo.hijos[distancia]) {
            this._insertar(nodo.hijos[distancia], valor); // Si ya hay un hijo a esa distancia, continuar recursivamente
        } else {
            nodo.hijos[distancia] = new NodoBK(valor); // Si no hay hijo a esa distancia, crear un nuevo nodo
        }
    }

    // Método para buscar valores en el árbol BK dentro de un umbral de distancia
    buscar(valor, umbral) {
        if (!this.raiz) return []; // Si el árbol está vacío, devolver una lista vacía
        return this._buscar(this.raiz, valor, umbral); // Iniciar la búsqueda recursiva desde la raíz
    }

    // Método recursivo para buscar valores en el árbol BK
    _buscar(nodo, valor, umbral) {
        let resultados = []; // Lista para almacenar los resultados de la búsqueda
        const distancia = this.funcionDistancia(nodo.valor, valor); // Calcula la distancia entre el nodo actual y el valor buscado
        if (distancia <= umbral) {
            resultados.push(nodo.valor); // Si la distancia está dentro del umbral, añadir el valor del nodo a los resultados
        }
        for (let dist in nodo.hijos) { // Recorrer todos los hijos del nodo actual
            dist = parseInt(dist, 10);
            if (dist >= distancia - umbral && dist <= distancia + umbral) {
                resultados = resultados.concat(this._buscar(nodo.hijos[dist], valor, umbral)); // Si el hijo está dentro del rango de distancia, buscar recursivamente en ese hijo
            }
        }
        return resultados; // Devolver los resultados encontrados
    }
}

// Función para calcular la distancia de Hamming modificada entre dos cadenas de síntomas
function distanciaHamming(str1, str2) {
    const set1 = new Set(str1.split(',')); // Convertir la primera cadena en un conjunto de síntomas
    const set2 = new Set(str2.split(',')); // Convertir la segunda cadena en un conjunto de síntomas

    const unionSize = new Set([...set1, ...set2]).size; // Tamaño de la unión de ambos conjuntos
    const intersectionSize = new Set([...set1].filter(x => set2.has(x))).size; // Tamaño de la intersección de ambos conjuntos

    return unionSize - intersectionSize; // La distancia de Hamming es la diferencia entre el tamaño de la unión y el tamaño de la intersección
}

// Crear un árbol BK usando la distancia de Hamming modificada
const arbolBK = new ArbolBK(distanciaHamming);

// Diccionario de enfermedades y sus síntomas asociados
const enfermedades = {
    "fiebre,tos,dolor de cabeza": "Resfriado común",
    "fiebre,tos,dificultad para respirar": "COVID-19",
    "dolor de cabeza,fatiga,náusea": "Migraña",
    "dolor de garganta,fiebre,tos": "Amigdalitis",
    "fiebre,fatiga,dolor muscular": "Gripe",
    "náusea,fatiga": "Intoxicación alimentaria",
    "dolor en el pecho,dificultad para respirar,fatiga": "Enfermedad cardíaca",
    "fiebre,escalofríos,sudoración": "Malaria",
    "dolor de cabeza,mareo,escalofríos": "Infección de oído",
    "dolor abdominal,diarrea,fiebre": "Gastroenteritis",
    "congestión nasal,dolor de garganta,fiebre": "Sinusitis",
    "pérdida de olfato,pérdida de gusto,tos": "COVID-19"
};

// Insertar cada combinación de síntomas en el árbol BK
Object.keys(enfermedades).forEach(sintomas => arbolBK.insertar(sintomas));

// Función para buscar enfermedades basadas en los síntomas seleccionados
function buscarEnfermedades() {
    const opcionesSeleccionadas = Array.from(document.getElementById('symptoms').selectedOptions); // Obtener los síntomas seleccionados
    if (opcionesSeleccionadas.length > 3) {
        alert('Por favor, seleccione hasta tres síntomas.'); // Mostrar alerta si se seleccionan más de tres síntomas
        return;
    }

    const sintomasSeleccionados = opcionesSeleccionadas.map(opcion => opcion.value).join(','); // Crear una cadena con los síntomas seleccionados
    const umbral = 2; // Umbral de distancia para la búsqueda
    const resultados = arbolBK.buscar(sintomasSeleccionados, umbral); // Buscar enfermedades en el árbol BK
    const resultadosDiv = document.getElementById('results'); // Obtener el div donde se mostrarán los resultados
    if (resultados.length > 0) {
        resultadosDiv.innerHTML = `<h3>Posibles Enfermedades:</h3><ul class="list-group">${resultados.map(resultado => `<li class="list-group-item">${enfermedades[resultado]}</li>`).join('')}</ul>`; // Mostrar los resultados encontrados
    } else {
        resultadosDiv.innerHTML = `<h3>No se encontraron enfermedades</h3>`; // Mostrar mensaje si no se encuentran resultados
    }
}
