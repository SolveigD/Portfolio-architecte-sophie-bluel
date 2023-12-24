const formLogin = document.querySelector(".formulaire_login");
formLogin.addEventListener("submit", async function (event) {
    event.preventDefault();
    const utilisateur = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    };

    jsonUtilisateur = JSON.stringify(utilisateur);

    // window.localStorage.setItem('utilisateur',jsonUtilisateur);
    
    const chargeUtile = jsonUtilisateur;

    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonUtilisateur
    });

    const user = await response.json();
   
  

  // Utilisateur existe
    if (user.token) {
        window.localStorage.setItem('user', JSON.stringify(user));
        window.location.replace('./index.html');
        
    } else { // Utilisateur existe pas
        const errorElement = document.querySelector('.error');
        errorElement.classList.add('visible');
    }

});





