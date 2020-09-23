function fetchJson(url) {
    return fetch(url).then(resposta => resposta.json());
}

/* -------- Cart and Local Storage ------*/

let movies = []

fetchJson("https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?language=pt-BR")
    .then(respostaJson => {
        for (let i = 0; i < 5; i++) {
            let movie = respostaJson.results[i]

            movies.push({
                title: movie.title,
                price: movie.price,
                popularity: movie.popularity,
                voteAverage: movie.vote_average,
                backgroundImage: movie.poster_path,
                genreIds: movie.genre_ids,
                id: movie.id
            })
        }
        createTopMovies()
        createEmpityCart()
    }).then(() => console.log(movies))

let genreList = []


fetchJson('https://tmdb-proxy-workers.vhfmag.workers.dev/3/genre/movie/list?language=pt-BR')
    .then(respostaJson => {
        for (let b = 0; b < respostaJson.genres.length; b++) {
            let gItem = respostaJson.genres[b]

            genreList.push({
                numberId: gItem.id,
                name: gItem.name
            })
        }
    })
console.log(genreList)
let moviesList = []

fetchJson("https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?language=pt-BR")
    .then(respostaJson => {
        for (let i = 0; i < 20; i++) {
            let movie = respostaJson.results[i]

            moviesList.push({
                title: movie.title,
                price: movie.price,
                popularity: movie.popularity,
                voteAverage: movie.vote_average,
                backgroundImage: movie.poster_path,
                genreIds: movie.genre_ids,
                id: movie.id
            })
        }
        createCategoryMovies()
        filteredButtonsValue()
        createCategoryButtons()

    }).then(() => console.log(filteredButtonsValuesArray))


// < -------------------   CREATE CARDS   -------------------- >


const createTopMovies = () => {

    let productSection = document.getElementById('products');
    productSection.innerHTML = "";
    movies.forEach(movie => {
        let card = document.createElement('div');
        card.className = 'card';
        //add the image to the card
        let img = document.createElement('img');
        img.alt = movie.title;
        img.src = movie.backgroundImage;
        card.appendChild(img);

        let rowInfo = document.createElement('div')
        let title = movie.title
        let voteAverage = movie.voteAverage
        rowInfo.className = 'row-info'
        rowInfo.innerHTML = `<pre>${title}  <i class="material-icons">star</i> ${voteAverage}</pre>`
        card.appendChild(rowInfo)

        // button
        let btn = document.createElement('button');
        btn.className = 'btn';

        btn.setAttribute('id', movie.id);
        btn.setAttribute('onclick', `addToLocalStorage(${movie.id})`)
        btn.addEventListener('click', () => {
            addItemToCart(movie)
        });
        card.appendChild(btn);
        //
        let btnRow = document.createElement('p')
        let cost = movie.price
        btnRow.id = `${cost}`
        btnRow.innerHTML = `<pre>  Sacola         R$${cost}  </pre>`
        btn.appendChild(btnRow)
        //


        //add the card to the section
        productSection.appendChild(card);
    })
}




const createCategoryMovies = () => {
    let productSection = document.getElementById('row-bottom');
    productSection.innerHTML = "";
    moviesList.forEach(movie => {
        let card = document.createElement('div');
        card.className = 'card';
        //add the image to the card
        let img = document.createElement('img');
        img.alt = movie.title;
        img.src = movie.backgroundImage;
        card.appendChild(img);

        let rowInfo = document.createElement('div')
        let title = movie.title
        let voteAverage = movie.voteAverage
        rowInfo.className = 'row-info'
        rowInfo.innerHTML = `<pre>${title}  <i class="material-icons">star</i> ${voteAverage}</pre>`
        card.appendChild(rowInfo)

        // button
        let btn = document.createElement('button');
        btn.className = 'btn';

        btn.setAttribute('id', movie.id);
        btn.addEventListener('click', () => {
            addItemToCart(movie)
        });
        card.appendChild(btn);
        //
        let btnRow = document.createElement('div')
        let cost = movie.price
        btnRow.id = `${cost}`
        btnRow.innerHTML = `<pre>  Sacola         R$${cost}  </pre>`
        btn.appendChild(btnRow)
        //


        //add the card to the section
        productSection.appendChild(card);
    })
}

let filteredButtonsValuesArray = []

const filteredButtonsValue = () => {
    for (let c = 0; c < 4; c++) {

        filteredButtonsValuesArray.push({
            filteredId: genreList[c].numberId,
            filteredName: genreList[c].name
        })
    }
}



const createCategoryButtons = () => {

    document.getElementById("category-button-group").innerHTML = filteredButtonsValuesArray.map(function (buttonItem) {
        return `
        <button class="buttons" type="submit" id="${buttonItem.filteredId}" onclick="submitSelectedButton()">${buttonItem.filteredName}</button>
        `
    }).join('')
}

// 
const submitSelectedButton = () => {
    let categoryButtons = document.querySelectorAll('#category-button-group > *')

    for (const elementButton of categoryButtons) {
        elementButton.addEventListener('click', (event) => {
            let idParamURL = event.target.getAttribute('id')
            moviesList = []
            fetchJson(`https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?with_genres=${idParamURL}&language=pt-BR`)
                .then(respostaJson => {
                    for (let i = 0; i < 20; i++) {
                        let movie = respostaJson.results[i]

                        moviesList.push({
                            title: movie.title,
                            price: movie.price,
                            popularity: movie.popularity,
                            voteAverage: movie.vote_average,
                            backgroundImage: movie.poster_path,
                            genreIds: movie.genre_ids
                        })
                    }
                    createCategoryMovies()
                })

        })
    }
}



const createEmpityCart = () => {



    let cartSection = document.getElementById('cart');
    cartSection.innerHTML = `
    <div id="cart-container">
    <div id="cart-header">
    <i class="material-icons">shop</i>
    <span>Sacola</span>  
    </div>
    <div id="cart-center">
    <p class="center-title">Sua sacola está vazia</p>
    <p class="center-subtitle">Adicione filmes agora</p>
    <img src="assets/Group.svg" alt="empityCartLogo">
    </div>
    <div id="cart-bottom">
    <p class="bottom-text">Insira seu cupom</p>
    <input class="cupom-input" placeholder="Cupom de desconto">
    <i class="material-icons">local_offer</i>
    </input>
    </div>
    </div>
    `
}









const createCartWithItens = () => {
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    movieDivList = ''
    buttonTotalCart = ''

    cart.forEach( cartItem => {
        let cartItemPoster = cartItem.backgroundImage
        let cartItemTitle = cartItem.title; 
        let cartItemQtd = cartItem.qtd;
        let cartItemPrice = cartItem.price * cartItemQtd;
        
        
        movieDivList += `  
        <div id="cart-center-with-data">
        <img id="movie-avatar" src=${cartItemPoster}></img>
        <div id="title-price">
        <div id="movie-title">${cartItemTitle}</div>
        <div id="price-cart">R$${cartItemPrice}</div>
        </div>
        <button type="submit" class="cart-buttons" id="add-button" onclick="addItemToCart(cartItem)"> + </button>
        <div id="qtd-cart">${cartItemQtd}</div>
        <button type="submit" class="cart-buttons" id="decrement-button" onclick="decrementCart(${cartItem.id})"> - </div>
        </div>
        `;

        
    })


    
    

    let cartSection = document.getElementById('cart');
        cartSection.innerHTML = `
        <div id="cart-container">
            <div id="cart-header">
            <div>Sacola</div>
            </div>  
            `+movieDivList + `
            <div id="cart-bottom">
            <p class="bottom-text">Insira seu cupom</p>
            <input class="cupom-input" placeholder="Cupom de desconto" onsubmit="">
            <i class="material-icons">local_offer</i>
            </input>
            <button id="cart-total">Confirme seus dados </button> 
            </div>
        </div>
        `;
}

function getTotalCart () {
    

    let storage = localStorage.getItem('cart')
    let cart = (storage === null) ? [] : JSON.parse(storage)

    let totalValue = cart.reduce((acc, item) => acc + (item.price * item.qtd))
    let totalQuantity = cart.reduce((acc, item) => acc + item.qtd)


   console.log({totalQuantity, totalValue})

    
}


function addItemToCart (movie) {
    let storage = localStorage.getItem('cart')
    console.log(storage)
    let currentMovies = (storage === null) ? [] : JSON.parse(storage)

    let x = currentMovies.filter((value) => value.id ==  movie.id )[0]
    if (x) {
        currentMovies.filter((value) => value.id ==  movie.id )[0].qtd += 1
    } else {
        currentMovies.push({
            id: movie.id,
            title: movie.title,
            qtd: 1,
            price: movie.price,
            backgroundImage: movie.backgroundImage
        })
    }

    localStorage.setItem('cart', JSON.stringify(currentMovies))

    createCartWithItens()
}


function decrementCart(id) {
    if(localStorage.getItem('cart') === null ) return
    
    let cart = JSON.parse(localStorage.getItem('cart'))
    let indexToRemove = -1
    
    cart.forEach((value,index) => {
        if(value.id == id) {
            indexToRemove = index
            return
        }
    })

    if(indexToRemove != -1){
        let isSingle = cart[indexToRemove].qtd == 1
        if(isSingle){
            cart.splice(indexToRemove)
        } else {
            cart[indexToRemove].qtd --
        }
    }

    
    
    if(cart.length > 0){
        localStorage.setItem('cart', JSON.stringify(cart))
        createCartWithItens()
    } else {
        localStorage.removeItem('cart')
        createEmpityCart()
    }

}
