let url = "https://pokeapi.co/api/v2/pokemon/";
let todos = [];
const contenedor = document.getElementById("pokemon-container");
const botones = document.querySelectorAll(".btn-header");
const buscar = document.getElementById("buscador");
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

if(window.location.pathname.includes("favoritos.html")){
    mostrarpokemon(favoritos);
}else{
    const guardados = localStorage.getItem("pokemons");
    if (guardados) {
        todos = JSON.parse(guardados);
        mostrarpokemon(todos);
    }
    
}

if(window.location.pathname.includes("listado.html")){
    for (let i = 1; i <= 151; i++) {
        setTimeout(() => {
            fetch(url + i)
                .then(response => response.json())
                .then(data => {
                    todos.push(data);
                    imprimir(data);
                });
        }, i * 50); // se retrasa cada vez más
    }
}


if(window.location.pathname.includes("listado.html")){
    buscar.addEventListener("input", () => {
        const texto = buscar.value.toLowerCase();
        const filtrados = todos.filter(pokemon => pokemon.name.toLowerCase().includes(texto));
    
        contenedor.innerHTML = ""; // Limpiar el contenedor antes de mostrar los resultados
    
        mostrarpokemon(filtrados);
    });
    
    

}






function imprimir(data) {
    const carta = document.createElement("div");
    carta.classList.add(
        "card",
        "col-12",      // 1 por fila en pantallas muy pequeñas
        "col-sm-6",    // 2 por fila en pantallas pequeñas
        "col-md-4",    // 3 por fila en medianas
        "col-lg-3",    // 4 por fila en grandes
        "col-xl-2",    // 6 por fila en extra grandes
        "m-2",
        "mx-auto",     // Center the card on small screens
        "text-center",
        "bg-light",
        "border-danger",
        "rounded-3",
        "shadow-lg",
        "p-2"
    );
      
    carta.style.width = "12rem";

    const imagen = document.createElement("img");
    imagen.classList.add("card-img-top");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const id = document.createElement("p");

    const nombre = document.createElement("h5");
    nombre.classList.add("card-title");

    const div_texto = document.createElement("div");
    div_texto.classList.add("row");

    const div_tipo1 = document.createElement("div");
    div_tipo1.classList.add("col-6");
    const texto = document.createElement("p");
    const div_tipo2 = document.createElement("div");
    div_tipo2.classList.add("col-6");
    const texto2 = document.createElement("p");

    const div_3 = document.createElement("div");
    div_3.classList.add("col-12");
    const tipo_1 = document.createElement("p");
    tipo_1.classList.add("text-danger");
    const tipo_2 = document.createElement("p");
    tipo_2.classList.add("text-danger");

    const div_boton = document.createElement("div");
    div_boton.classList.add("row", "text-center", "mt-2");


    const boton_fav = document.createElement("button");
    boton_fav.classList.add("btn", "btn-danger", "btn-sm", "mt-2","col-12" ) ;

    const boton_ver = document.createElement("a"); // Cambiado a un enlace
    boton_ver.classList.add("btn", "btn-danger", "btn-sm", "mt-2", "col-12");
    boton_ver.textContent = "Ver Detalles";

    boton_ver.href = `detalles.html?id=${data.id}`;


    if(window.location.pathname.includes("favoritos.html")){
        boton_fav.textContent = "Eliminar de Favoritos";
        
    }else{
        boton_fav.textContent = "Agregar a Favoritos";
    }
    

    // imprimir

    imagen.src = data.sprites.front_default;
    imagen.alt = data.name;
    id.textContent = "ID:" + data.id;
    nombre.textContent = data.name;

    texto.textContent = "Poder: " + data.base_experience;
    texto2.textContent = "Peso: " + data.weight / 10 + " kg";

    tipo_1.textContent = data.types[0].type.name;
    if (data.types[1] != undefined) {
        tipo_2.textContent = data.types[1].type.name;
    } else {
        tipo_2.textContent = " ";
    }

    div_3.appendChild(tipo_1);
    div_3.appendChild(tipo_2);
    div_tipo1.appendChild(texto);
    div_tipo2.appendChild(texto2);
    div_texto.appendChild(div_tipo1);
    div_texto.appendChild(div_tipo2);
    div_texto.appendChild(div_3);
    cardBody.appendChild(id);
    cardBody.appendChild(nombre);
    cardBody.appendChild(div_texto);
    carta.appendChild(imagen);
    carta.appendChild(cardBody);

    const esfavorito = favoritos.some(fav => fav.id === data.id);

    if (boton_fav){
        div_boton.appendChild(boton_fav);
        carta.appendChild(div_boton);

        if(esfavorito){
            boton_fav.style.display = "none"; // Oculta el botón si ya es favorito
            if(window.location.pathname.includes("favoritos.html")){
                boton_fav.textContent = "Eliminar de Favoritos";
                boton_fav.style.display = "block"; // Muestra el botón en la página de favoritos
            }

        }

        boton_fav.addEventListener("click", () => {
            if(boton_fav.textContent === "Agregar a Favoritos"){
                agregarfavorito(data);
                boton_fav.style.display = "none"; // Oculta el botón después de agregar a favoritos
            }
            }
        );

        if(window.location.pathname.includes("favoritos.html")){
            boton_fav.addEventListener("click", () => eliminarfavorito(data));}
    }

    div_boton.appendChild(boton_ver);
    contenedor.appendChild(carta);
}

function mostrarpokemon(lista){
    contenedor.innerHTML = "";
    lista.forEach(pokemon => {
        imprimir(pokemon);
    })
}

botones.forEach((boton) => {
    boton.addEventListener("click", (e) =>{
        const tipo = e.currentTarget.dataset.id;
        if(tipo === "ver-todos"){
            mostrarpokemon(todos);
        }else{
            const filtrados = todos.filter(pokemon => pokemon.types.some(t => t.type.name === tipo));
            mostrarpokemon(filtrados);
        }
        
    })
})


function agregarfavorito(pokemon) {
    if (!favoritos.some(fav => fav.id === pokemon.id)){
        favoritos.push(pokemon);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }
};

function eliminarfavorito(pokemon) {
    const index = favoritos.findIndex(fav => fav.id === pokemon.id);
    if (index !== -1) {
        favoritos.splice(index, 1);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        alert(pokemon.name + " eliminado de Favoritos");
        mostrarpokemon(favoritos);
    }else{
        alert(pokemon.name + " no está en Favoritos");
    }
};


if (window.location.pathname.includes("detalles.html")) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
        fetch(url + id)
            .then(response => response.json())
            .then(data => {
                mostrarDetalle(data);
            });
    }
}

function mostrarDetalle(data) {
    const contenedorDetalle = document.getElementById("detalle-container");
    contenedorDetalle.innerHTML = ""; // Limpia cualquier contenido previo

    // Título
    const titulo = document.createElement("h1");
    titulo.classList.add("text-center", "text-capitalize", "mt-4", "mb-4", "text-danger");
    titulo.textContent = data.name;

    // Contenedor principal
    const contenedor = document.createElement("div");
    contenedor.classList.add("row", "justify-content-center", "align-items-start", "g-4");

    // Columna de imágenes
    const colImagenes = document.createElement("div");
    colImagenes.classList.add("col-md-5", "d-flex", "flex-column", "align-items-center");

    // Lista de imágenes a mostrar (ángulos distintos)
    const imagenes = [
        { src: data.sprites.front_default, alt: "Frontal" },
        { src: data.sprites.back_default, alt: "Trasera" },
        { src: data.sprites.front_shiny, alt: "Shiny Frontal" },
        { src: data.sprites.back_shiny, alt: "Shiny Trasera" }
    ];

    imagenes.forEach(img => {
        if (img.src) {
            const imagenEl = document.createElement("img");
            imagenEl.src = img.src;
            imagenEl.alt = img.alt;
            imagenEl.classList.add("img-fluid", "mb-3", "rounded");
            imagenEl.style.maxWidth = "80%"; // Tamaño más pequeño
            colImagenes.appendChild(imagenEl);
        }
    });

    // Columna de datos
    const colDatos = document.createElement("div");
    colDatos.classList.add("col-md-6");

    const id = document.createElement("p");
    id.textContent = "ID: " + data.id;

    const experiencia = document.createElement("p");
    experiencia.textContent = "Experiencia base: " + data.base_experience;

    const peso = document.createElement("p");
    peso.textContent = "Peso: " + data.weight / 10 + " kg";

    const altura = document.createElement("p");
    altura.textContent = "Altura: " + data.height / 10 + " m";

    const tipo1 = document.createElement("p");
    tipo1.textContent = "Tipo 1: " + data.types[0].type.name;

    const tipo2 = document.createElement("p");
    tipo2.textContent = "Tipo 2: " + (data.types[1] ? data.types[1].type.name : "Ninguno");

    // Habilidades
    const habilidades = document.createElement("p");
    habilidades.textContent = "Habilidades: " + data.abilities.map(a => a.ability.name).join(", ");

    // Estadísticas base
    const statsTitle = document.createElement("h4");
    statsTitle.textContent = "Estadísticas Base:";

    const statsList = document.createElement("ul");
    data.stats.forEach(stat => {
        const li = document.createElement("li");
        li.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        statsList.appendChild(li);
    });

    // Botón volver
    const volver = document.createElement("a");
    volver.href = "listado.html";
    volver.classList.add("btn", "btn-dark", "mt-4");
    volver.textContent = "Volver al Listado";

    // Agregar datos al contenedor
    colDatos.appendChild(id);
    colDatos.appendChild(experiencia);
    colDatos.appendChild(peso);
    colDatos.appendChild(altura);
    colDatos.appendChild(tipo1);
    colDatos.appendChild(tipo2);
    colDatos.appendChild(habilidades);
    colDatos.appendChild(statsTitle);
    colDatos.appendChild(statsList);
    colDatos.appendChild(volver);

    // Armar estructura final
    contenedor.appendChild(colImagenes);
    contenedor.appendChild(colDatos);
    contenedorDetalle.appendChild(titulo);
    contenedorDetalle.appendChild(contenedor);
}


 

