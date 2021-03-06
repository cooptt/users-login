






async function signOut(){
    const data =  await firebase.auth().signOut()
    isLoggedIn()
}






async function signInWithGoogle(){

    try{
        let googleAuthProvider = new firebase.auth.GoogleAuthProvider;
        const data = await  firebase.auth().signInWithPopup(googleAuthProvider)

        // info to send to the server
        const userId = data.user.uid;
        const name = data.user.displayName
        const response = await  fetch('/user/signin',{
            method: 'POST',
            headers: {
              'Accept':'application/json',
              'Content-Type' : 'application/json'
            },
            body : JSON.stringify({userId,name})
        });

        const responseJson = await response.json()

    }catch(error){
        console.log(error)
    }

}




async function getUserLoggedIn(id){
    let response = await  fetch(`/user/videogames/sell/${id}`,{
        method: 'GET',
        headers: {
          'Accept':'application/json',
          'Content-Type' : 'application/json'
        }
    });
    let responseJson = await response.json()

    let items = $('#sellVideoGamesItems')
    items.html("")
    responseJson.forEach( game => {
        items.append(`
            <tr>
                <td> ${game.name} </td>
                <td> ${game.price} </td>
            </tr>
        `)
    })




    response = await  fetch(`/user/videogames/buy/${id}`,{
        method: 'GET',
        headers: {
          'Accept':'application/json',
          'Content-Type' : 'application/json'
        }
    });
    responseJson = await response.json()

    items = $('#buyVideoGamesItems')
    items.html("")
    responseJson.forEach( game => {
        items.append(`
            <tr>
                <td> ${game.name} </td>
                <td> ${game.price} </td>
            </tr>
        `)
    })
}




function isLoggedIn(){
  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
        try{
            let signinButton = document.getElementById('signin-button')
            signinButton.style.display = "none"

            let logoutButton = document.getElementById('logout-button')
            logoutButton.style.display = "block"

            let divUser = document.getElementById('user-template')
            divUser.style.display = "block"
            getUserLoggedIn(user.uid)
      }catch(error){
            console.log(error)
      }


    } else {
        let signinButton = document.getElementById('signin-button')
        signinButton.style.display = "block"


        let divUser = document.getElementById('user-template')
        divUser.style.display = "none"

        let logoutButton = document.getElementById('logout-button')
        logoutButton.style.display = "none"
    }
  });
}


isLoggedIn()
