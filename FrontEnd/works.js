




async function afficherTravaux() {
    const reponse = await fetch("http://localhost:5678/api/works/");
    const travaux = await reponse.json();
    let i = 0
    const valeurTravaux = JSON.stringify(travaux);
    for (i = 0; i < valeurTravaux.length; i++){
    const gallery = document.querySelector(".gallery");
    const figure = document.createElement("figure");
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

async function filtrerTravaux(){
    const reponse = await fetch("http://localhost:5678/api/categories/");
    const categories = await reponse.json();
    console.log(categories);
    console.log(categories[0].name)
    let i = 0
    const valeurCategories = JSON.stringify(categories);
    const zoneFiltre = document.createElement("div");
    zoneFiltre.className = 'zone_filtre';
    
    const emplacementZoneFiltre = document.querySelector('#portfolio h2');
    emplacementZoneFiltre.appendChild(zoneFiltre);
    const boutonFiltre = document.createElement("input");
    boutonFiltre.type = 'button';
    boutonFiltre.className = 'btn_filtre';
    boutonFiltre.value = 'Tous';
    zoneFiltre.appendChild(boutonFiltre);
    boutonFiltre.addEventListener("click", function (){
       afficherTravaux(); 
    })
    for(i=0; i<valeurCategories.length; i++){
        const boutonFiltre = document.createElement("input");
        boutonFiltre.type = 'button';
        boutonFiltre.className = 'btn_filtre';
        boutonFiltre.value = categories[i].name;
        zoneFiltre.appendChild(boutonFiltre);
        boutonFiltre.addEventListener("click", function(){
            console.log("fonctionne");
            
        })

        
    }
    
    


}
filtrerTravaux();