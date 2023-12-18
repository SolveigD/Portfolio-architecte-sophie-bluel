




async function afficherTravaux() {
    const reponse = await fetch("http://localhost:5678/api/works/");
    const travaux = await reponse.json();
    console.log(travaux);
    let i = 0
    for (i = 0; i < travaux.length; i++) {
        const gallery = document.querySelector(".gallery");
        const figure = document.createElement("figure");
        figure.setAttribute('class', 'work');
        figure.setAttribute('data-category-id', travaux[i].categoryId);
        const imageTravaux = document.createElement("img");
        imageTravaux.src = travaux[i].imageUrl;
  
        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = travaux[i].title;
        gallery.appendChild(figure);
        figure.appendChild(imageTravaux);
        figure.appendChild(figcaption);

    }
}
afficherTravaux();

async function afficherFiltres(){
    const reponse = await fetch("http://localhost:5678/api/categories/");
    const categories = await reponse.json();    
    
    // Ajout elements dans HTML
    const zoneFiltre = document.createElement("div");
    zoneFiltre.className = 'zone_filtre';
    const emplacementZoneFiltre = document.querySelector('#portfolio h2');
    emplacementZoneFiltre.appendChild(zoneFiltre);
    const boutonFiltre = document.createElement("input");
    boutonFiltre.type = 'button';
    boutonFiltre.className = 'btn_filtre';
    boutonFiltre.value = 'Tous';
    boutonFiltre.id = 0;
    zoneFiltre.appendChild(boutonFiltre);
    boutonFiltre.addEventListener("click", function() {
        filtreTravaux(0);
    })

    // JS logic
    for(let i = 0; i < categories.length; i++) {
        
        const boutonFiltre = document.createElement("input");
        boutonFiltre.type = 'button';
        boutonFiltre.className = 'btn_filtre';
        boutonFiltre.value = categories[i].name;
        boutonFiltre.id = categories[i].id;
        zoneFiltre.appendChild(boutonFiltre);
        boutonFiltre.addEventListener("click", function() {
            filtreTravaux(categories[i].id);
        })
    }
}
afficherFiltres();

function filtreTravaux(id) {
    const figures = document.querySelectorAll('.work');

    for (let i = 0; i < figures.length; i ++) {
        figures[i].classList.remove('inactive');
       
        if (id !== 0) {
            let categoryId = figures[i].getAttribute('data-category-id');
            categoryId = Number(categoryId);

            if (categoryId !== id) {
                figures[i].classList.add('inactive');
            }
        }
    }
}