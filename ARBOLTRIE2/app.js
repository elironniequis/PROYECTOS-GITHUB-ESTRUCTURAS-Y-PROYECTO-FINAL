// Lista de palabras reservadas de C++
const palabrasReservadasCPlusPlus = [
    "alignas", "alignof", "and", "and_eq", "asm", "auto", "bitand", "bitor", "bool", "break",
    "case", "catch", "char", "char16_t", "char32_t", "class", "compl", "const", "constexpr",
    "const_cast", "continue", "decltype", "default", "delete", "do", "double", "dynamic_cast",
    "else", "enum", "explicit", "export", "extern", "false", "float", "for", "friend", "goto",
    "if", "inline", "int", "long", "mutable", "namespace", "new", "noexcept", "not", "not_eq",
    "nullptr", "operator", "or", "or_eq", "private", "protected", "public", "register",
    "reinterpret_cast", "return", "short", "signed", "sizeof", "static", "static_assert",
    "static_cast", "struct", "switch", "template", "this", "thread_local", "throw", "true",
    "try", "typedef", "typeid", "typename", "union", "unsigned", "using", "virtual", "void",
    "volatile", "wchar_t", "while", "xor", "xor_eq"
];

// Crear una instancia del Trie y agregar las palabras reservadas de C++
let trie = new Trie();
palabrasReservadasCPlusPlus.forEach(palabra => trie.insertar(palabra));

function mostrarSugerencias() {
    const entrada = document.getElementById('buscador').value;
    const divSugerencias = document.getElementById('sugerencias');
    const divSimilitudes = document.getElementById('similitudes');
    divSugerencias.innerHTML = '';
    divSimilitudes.innerHTML = '';

    if (entrada.length === 0) {
        return;
    }

    const sugerencias = trie.palabrasConPrefijo(entrada);
    sugerencias.forEach(palabra => {
        const div = document.createElement('div');
        div.textContent = palabra;
        div.classList.add('item-sugerencia');
        div.addEventListener('click', () => {
            document.getElementById('buscador').value = palabra;
            divSugerencias.innerHTML = '';
            mostrarSimilitudes(entrada, palabra);
        });
        divSugerencias.appendChild(div);
    });

    mostrarSimilitudes(entrada, sugerencias);
}

function mostrarSimilitudes(prefijo, sugerencias) {
    const divSimilitudes = document.getElementById('similitudes');
    divSimilitudes.innerHTML = `<h3>Similitudes con "${prefijo}"</h3>`;
    
    sugerencias.forEach(palabra => {
        const porcentajeSimilitud = calcularSimilitud(prefijo, palabra);
        const div = document.createElement('div');
        div.classList.add('item-similitud');
        div.innerHTML = `
            <p>${palabra} (${porcentajeSimilitud.toFixed(2)}%)</p>
            <div class="progress-bar" style="width: ${porcentajeSimilitud}%;"></div>
        `;
        divSimilitudes.appendChild(div);
    });
}

function calcularSimilitud(prefijo, palabra) {
    let longitudMaxima = Math.max(prefijo.length, palabra.length);
    let coincidencias = 0;

    for (let i = 0; i < longitudMaxima; i++) {
        if (prefijo[i] === palabra[i]) {
            coincidencias++;
        }
    }

    return (coincidencias / longitudMaxima) * 100;
}
