const loginAccueil = document.querySelector('.login_accueil'); 
const logoutAccueil = document.querySelector('.logout_accueil');
const bandeauNoir = document.querySelector('.bandeau');
const mesProjets = document.querySelector('.mes_projets');
const gallery = document.querySelector(".gallery");
const zoneEdition = document.querySelector('.zone_edition');
const user = window.localStorage.getItem('user');
let newImage = null;
let categories = null;
let travaux = null;
let titreImageValue = null;
let categoryId = null;
let optionCategories = null;

// Form Data
let formData = new FormData();
let image = null;

// Js pour le Modal
const editButton = document.getElementById('zoneEdit');
const closeButton = document.querySelector('.close');
const overlay = document.querySelector('.overlay');
const changerPage2 = document.querySelector('.changer_page_2');
const changerPage1 = document.querySelector('.back');
const envoyerImage = document.querySelector('.btn_envoyer_img');
const validerForm = document.querySelector('#validerForm');

editButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
changerPage2.addEventListener('click', function() {
    changerPage(2);
});
changerPage1.addEventListener('click', function() {
    changerPage(1);
});

envoyerImage.addEventListener('click', function (e){
    capturerImage();   
});

validerForm.addEventListener('click', validerFormulaire);

// Fin Js pour le modal

async function init() {
    await getTravaux();
    afficherTravaux();
    await afficherFiltres();
    afficherTravauxModal();
    afficherCategoriesOption();
}

async function getTravaux() {
    const reponse = await fetch("http://localhost:5678/api/works/");
    travaux = await reponse.json();
}

function afficherTravaux() {
    let i = 0
    for (i = 0; i < travaux.length; i++) {
       
        const figure = document.createElement("figure");
        figure.setAttribute('class', 'work');
        figure.setAttribute('data-category-id', travaux[i].categoryId);
        figure.setAttribute('data-work-id', travaux[i].id);

        const imageTravaux = document.createElement("img");
        imageTravaux.src = travaux[i].imageUrl;
  
        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = travaux[i].title;
        gallery.appendChild(figure);
        figure.appendChild(imageTravaux);
        figure.appendChild(figcaption);

    }
}

function afficherTravauxModal() {
    const gallery = document.querySelector('.modalGallery');
    
    for (let i = 0; i < travaux.length; i++) {
        const containerImage = document.createElement('div');
        containerImage.classList.add('container_image_modal');
        containerImage.setAttribute('data-work-id', travaux[i].id);

        const imageModal = document.createElement('img');
        imageModal.src = travaux[i].imageUrl;
        imageModal.classList.add('image_modal');

        const trashCan = document.createElement('img');
        trashCan.src = "./assets/icons/trash-can-solid.svg";
        trashCan.classList.add('trashcan')

        gallery.append(containerImage);
        containerImage.appendChild(imageModal)
        containerImage.appendChild(trashCan);
        
        trashCan.addEventListener('click', async function(event) {
            const container = event.target.parentElement;
            const id = Number(container.getAttribute('data-work-id'));
            const reponse = await supprimerTravailAPI(id);

            if (reponse) {
                //Deleter le travail dans le modal
                container.remove();

                // Deleter le travail sur la page
                const  travail = document.querySelector(`[data-work-id="${id}"]`);
                travail.remove();
            } else {
                alert('Erreur!');
            }
        })
    }
}

async function supprimerTravailAPI(id) {
    const user = JSON.parse(window.localStorage.getItem('user'));
    const response = await fetch("http://localhost:5678/api/works/" + id, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json", 
        "accept": "*/*",
        "Authorization": `Bearer ${user.token}`
    }
    });
    
    return response.ok;
}

async function afficherFiltres(){
    const reponse = await fetch("http://localhost:5678/api/categories/");
    categories = await reponse.json();    
    
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

    if (user) {
        loginAccueil.classList.add('inactive');
        logoutAccueil.classList.remove('inactive');
        bandeauNoir.classList.remove('inactive');
        zoneFiltre.classList.add('inactive');
        mesProjets.classList.add('margin_bottom');
    } else {
        logoutAccueil.classList.add('inactive');
        zoneEdition.classList.add('inactive');
    }
    
}

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

function logout() {
    window.localStorage.clear();
    window.location.replace('./login.html');
}

function openModal() {
    const modale = document.getElementById('modale1');
    modale.classList.remove('hidden');
}

function closeModal() {
    const modale = document.getElementById('modale1');
    modale.classList.add('hidden');
}

function changerPage(numeroDePage) {
    const modalPage1 = document.querySelector('.modalPage1');
    const modalPage2 = document.querySelector('.modalPage2');
    const arrowBack = document.querySelector('.back');

    if (numeroDePage === 1) {
        // afficher page 1 et cacher page 2
        modalPage1.classList.remove('hidden');
        modalPage2.classList.add('hidden');
        arrowBack.classList.add('hide');
    } else if (numeroDePage === 2) {
        // afficher page 2 et cacher page 1
        modalPage1.classList.add('hidden');
        modalPage2.classList.remove('hidden');
        arrowBack.classList.remove('hide');
    }
}

async function afficherCategoriesOption (){
    const selectCategories = document.querySelector(".select_category");

    for (let i = 0; i < categories.length; i++){
        const optionCategories = document.createElement("option");
        optionCategories.value = categories[i].name;
        optionCategories.id = categories[i].id;
        optionCategories.innerHTML = categories[i].name;
        optionCategories.classList.add('option_categorie')
        selectCategories.appendChild(optionCategories);
    }

}

async function capturerImage(){
    const telechargerImage = document.querySelector('.telecharger_img');
    await telechargerImage.click();

    telechargerImage.addEventListener('change', function loaderImage() {
        image = telechargerImage.files[0];   
        telechargerImage.removeEventListener('change', loaderImage);

        if (image) {
            const pasImage = document.querySelector('.pasImage');
            const ouiImage = document.querySelector('.ouiImage');
            pasImage.classList.add('hidden');
            ouiImage.classList.remove('hidden');

            const imageContainer = document.querySelector('.ouiImage img');
            const blob = new Blob([image], { type: image.type });
            newImage =  URL.createObjectURL(blob);
            imageContainer.src = newImage;
            formData.append('image', image);

           
        }
    });

}


async function validerFormulaire() {
     

    const titreImage = document.querySelector('.label_titre');
    const titreImageValue = titreImage.value;
    const selectCategories = document.querySelector('.select_category');
    const selectedOption = selectCategories.selectedOptions[0];
    const categoryId = selectedOption.id;
    
  
        
        formData.append('title', titreImageValue);
        formData.append('category', Number(categoryId));
        
        const user = JSON.parse(window.localStorage.getItem('user'));

        const answer = await fetch('http://localhost:5678/api/works/', {
            method: 'POST',
            headers: { 
            
                "Authorization": `Bearer ${user.token}`
            },
            body: formData
        });

      

       if (answer.ok) {
      //    addNewWork();
      const figure = document.createElement('figure');    
      const image = document.createElement('img');
      image.src = newImage;
      const titre = document.createElement('figcaption');
      titre.innerHTML = titreImageValue;
      figure.classList.add('work');
      figure.setAttribute('data-category-id', categoryId);
    

      gallery.appendChild(figure);
      figure.appendChild(image);
      figure.appendChild(titre);
      
      closeModal();
          
       }
        
}

function addNewWork() {
  
  //  const figure = document.createElement('figure');
   // const image = document.createElement('img');
    
 //   figure.setAttribute('data-category-id', Number(categoryId));
 
   
  //  image.src = newImage;
  // const titre = document.createElement('figcaption');
 //  titre.innerHTML = titreImageValue;
   
  // gallery.appendChild(figure);
  // figure.appendChild(image);
  // figure.appendChild(titre);

  

}  


init();