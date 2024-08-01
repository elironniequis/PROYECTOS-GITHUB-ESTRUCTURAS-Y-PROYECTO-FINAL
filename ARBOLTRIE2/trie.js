class NodoTrie {
    constructor() {
        this.hijos = {};
        this.esFinDePalabra = false;
    }
}

class Trie {
    constructor() {
        this.raiz = new NodoTrie();
    }

    insertar(palabra) {
        let nodo = this.raiz;
        for (let char of palabra) {
            if (!nodo.hijos[char]) {
                nodo.hijos[char] = new NodoTrie();
            }
            nodo = nodo.hijos[char];
        }
        nodo.esFinDePalabra = true;
    }

    palabrasConPrefijo(prefijo) {
        let nodo = this.raiz;
        for (let char of prefijo) {
            if (!nodo.hijos[char]) {
                return [];
            }
            nodo = nodo.hijos[char];
        }
        return this._recogerTodasLasPalabras(nodo, prefijo);
    }

    _recogerTodasLasPalabras(nodo, prefijo) {
        let palabras = [];
        if (nodo.esFinDePalabra) {
            palabras.push(prefijo);
        }
        for (let char in nodo.hijos) {
            palabras.push(...this._recogerTodasLasPalabras(nodo.hijos[char], prefijo + char));
        }
        return palabras;
    }
}
