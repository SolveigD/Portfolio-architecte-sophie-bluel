const loginAccueil = document.querySelector('.login_accueil'); 
const logoutAccueil = document.querySelector('.logout_accueil');
const blackBand = document.querySelector('.blackband');
const myProjects = document.querySelector('.my_projects');
const gallery = document.querySelector(".gallery");
const zoneEdition = document.querySelector('.zone_edition');
const logOut = document.querySelector('.logout_accueil');
let user = window.localStorage.getItem('user');
let zoneFiltre = null;
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
const changePage2 = document.querySelector('.changer_page_2');
const changePage1 = document.querySelector('.back');
const sendImage = document.querySelector('.btn_send_img');
const validerForm = document.querySelector('#validerForm');
const formulaireTravaux = document.querySelector('.form_ajout_travaux');
const inputImage = document.querySelector('#inputImage');



formulaireTravaux.addEventListener('input', updaterBoutonValider);

validerForm.addEventListener('click', validateFormulaire);

// Fin Js pour le modal

async function init() {
    await getWorks();
    showWorks();
    await showFiltres();
    showWorksModal();
    showCategoryOptions();
    checkLoginStatus();
}

// partie works et filtre //

async function getWorks() {
    const reponse = await fetch("http://localhost:5678/api/works/");
    travaux = await reponse.json();
}

function showWorks() { 
    let i = 0
    for (i = 0; i < travaux.length; i++) {
        addWork(travaux[i].id, travaux[i].categoryId, travaux[i].imageUrl, travaux[i].title);
    }
}

function addWork(id, categoryId, imageUrl, title) {
    const figure = document.createElement("figure");
    figure.setAttribute('class', 'work');
    figure.setAttribute('data-category-id', categoryId);
    figure.setAttribute('data-work-id', id);

    const imageTravaux = document.createElement("img");
    imageTravaux.src = imageUrl;

    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = title;
    gallery.appendChild(figure);
    figure.appendChild(imageTravaux);
    figure.appendChild(figcaption);
}

async function showFiltres() {
    const reponse = await fetch("http://localhost:5678/api/categories/");
    categories = await reponse.json();    

    zoneFiltre = document.createElement("div");
    zoneFiltre.className = 'zone_filtre';
    const emplacementZoneFiltre = document.querySelector('#portfolio h2');
    emplacementZoneFiltre.appendChild(zoneFiltre);

    const boutonTous = document.createElement("input");
    boutonTous.type = 'button';
    boutonTous.className = 'btn_filtre active';
    boutonTous.value = 'Tous';
    boutonTous.id = 0;
    zoneFiltre.appendChild(boutonTous);
    boutonTous.addEventListener("click", function() {
        filtreTravaux(0);
        const autresBoutons = document.querySelectorAll('.btn_filtre');
        autresBoutons.forEach(bouton => bouton.classList.remove('active'));
        boutonTous.classList.add('active');
	
    });

    for (let i = 0; i < categories.length; i++) {
        const boutonFiltre = document.createElement("input");
        boutonFiltre.type = 'button';
        boutonFiltre.className = 'btn_filtre';
        boutonFiltre.value = categories[i].name;
        boutonFiltre.id = categories[i].id;
        zoneFiltre.appendChild(boutonFiltre);
        boutonFiltre.addEventListener("click", function() {
            const autresBoutons = document.querySelectorAll('.btn_filtre');
            autresBoutons.forEach(bouton => bouton.classList.remove('active'));
            boutonFiltre.classList.add('active');
            filtreTravaux(categories[i].id);
        });

        if (boutonFiltre === document.activeElement) {
            boutonFiltre.classList.add('active');
        }
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

// partie login //

function checkLoginStatus(){
    if (user) {
        loginAccueil.classList.add('inactive');
        logoutAccueil.classList.remove('inactive');
        blackBand.classList.remove('inactive');
        zoneFiltre.classList.add('inactive');
        myProjects.classList.add('margin_bottom');
        zoneEdition.classList.remove('inactive');
    } else {
        logoutAccueil.classList.add('inactive');
        zoneEdition.classList.add('inactive');
    }
}

logOut.addEventListener('click', function(){
    window.localStorage.clear();
    window.location.replace('./login.html');
})
   
// partie modale//

// ouvrir et fermer modale //

function openModal() {
    const modale = document.getElementById('modale1');
    modale.classList.remove('hidden');
}

function closeModal() {
    const modale = document.getElementById('modale1');
    modale.classList.add('hidden');
    resetModal();
}

editButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

function changePage(pageNumber) {
    const modalPage1 = document.querySelector('.modalPage1');
    const modalPage2 = document.querySelector('.modalPage2');
    const arrowBack = document.querySelector('.back');

    if (pageNumber === 1) {
        // afficher page 1 et cacher page 2
        modalPage1.classList.remove('hidden');
        modalPage2.classList.add('hidden');
        arrowBack.classList.add('hide');
    } else if (pageNumber === 2) {
        // afficher page 2 et cacher page 1
        modalPage1.classList.add('hidden');
        modalPage2.classList.remove('hidden');
        arrowBack.classList.remove('hide');
    }
}


changePage2.addEventListener('click', function() {
    changePage(2);
});
changePage1.addEventListener('click', function() {
    changePage(1);
});


// ajouter travaux a modale//

function addWorkModal(id, imageUrl) {
    const gallery = document.querySelector('.modalGallery');

    const containerImage = document.createElement('div');
    containerImage.classList.add('container_image_modal');
    containerImage.setAttribute('data-work-id', id);

    const imageModal = document.createElement('img');
    imageModal.src = imageUrl;
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
        const reponse = await deleteWorkInApi(id);

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


function showWorksModal() {
    for (let i = 0; i < travaux.length; i++) {
        addWorkModal(travaux[i].id, travaux[i].imageUrl);
    }
}

// supprimer travaux modale //

async function deleteWorkInApi(id) {
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
 
// dl et preview image page 2 //

async function capturerImage() {
    const downloadImage = document.querySelector('.download_img');
    await downloadImage.click();

    downloadImage.addEventListener('change', function loaderImage() {
        image = downloadImage.files[0];
        downloadImage.removeEventListener('change', loaderImage);
        const tailleEnMo = 4;
        const tailleEnOctets = tailleEnMo * 1024 * 1024;
        if (image && image.size < tailleEnOctets ) {
            const noImage = document.querySelector('.noImage');
            const yesImage = document.querySelector('.yesImage');
            noImage.classList.add('hidden');
            yesImage.classList.remove('hidden');
            updaterBoutonValider();

            const imageContainer = document.querySelector('.yesImage img');
            const blob = new Blob([image], { type: image.type });
            newImage =  URL.createObjectURL(blob);
            imageContainer.src = newImage;
            formData.append('image', image);
        } else {
            alert('image trop grande');
        }
    });
}

sendImage.addEventListener('click', function (e){
    capturerImage();   
});

// montrer categories options formulaire //

async function showCategoryOptions (){
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

// valider le formulaire //

async function validateFormulaire() {
    const titreImage = document.querySelector('.label_titre');
    const titreImageValue = titreImage.value;
    const selectCategories = document.querySelector('.select_category');
    const selectedOption = selectCategories.selectedOptions[0];
    const categoryId = selectedOption.id;
        
    formData.append('title', titreImageValue);
    formData.append('category', Number(categoryId));
    
    user = JSON.parse(window.localStorage.getItem('user'));

    const reponse = await fetch('http://localhost:5678/api/works/', {
        method: 'POST',
        headers: { 
        
            "Authorization": `Bearer ${user.token}`
        },
        body: formData
    });

    if (reponse.ok) {
        const newWork = await reponse.json();
        
        addWork(newWork.id, newWork.categoryId, newWork.imageUrl, newWork.title);
        addWorkModal(newWork.id, newWork.imageUrl);
        
        resetModal();
    }
}

// reinitialiser modale //

function resetModal() {
    formData = new FormData();
    image = null;
    formulaireTravaux.reset();

    const noImage = document.querySelector('.noImage');
    const yesImage = document.querySelector('.yesImage');
    noImage.classList.remove('hidden');
    yesImage.classList.add('hidden');

    updaterBoutonValider();
    changePage(1);
    closeModal();
}

function updaterBoutonValider() {
    const titreImage = document.querySelector('.label_titre');
    const titreImageValue = titreImage.value;
    const selectCategories = document.querySelector('.select_category');
    const selectedOption = selectCategories.selectedOptions[0];
    const categoryId = selectedOption.id;
    
    const isFormValid = titreImageValue != "" && categoryId != "" && image;
    if (isFormValid) {
        validerForm.disabled = false;
    } else {
        validerForm.disabled = true;
    }
}

init();