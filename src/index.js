// write your code here
const ramenMenu = document.querySelector('div#ramen-menu')
const ramenDetail = document.querySelector('div#ramen-detail')
const ramenForm = document.querySelector('form#ramen-rating')
const newRamen = document.querySelector('form#new-ramen')

ramenMenu.addEventListener('click', handleClickOnRamenMenu)
ramenForm.addEventListener('submit',getUpdatedRamenDataFromForm)
newRamen.addEventListener('submit',createNewRamen)


getAllRamen()
function getAllRamen(){
    fetch("http://localhost:3000/ramens")
    .then(res => res.json())
    .then(addRamenToRamenMenu)
}

function getOneRamen(ramenId){
    fetch(`http://localhost:3000/ramens/${ramenId}`)
    .then(res => res.json())
    .then(ramen => addRamenDetailToDom(ramen))
}

getOneRamen(1)

function updateRamenRatingInDb(updatedRamenObj, needUpdateRamenId){
    // debugger
    fetch(`http://localhost:3000/ramens/${needUpdateRamenId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(updatedRamenObj),
    })
    .then(res => res.json())
    .then(addRamenDetailToDom)
}

function addNewRamenToDb(newRamenObj){
    fetch("http://localhost:3000/ramens", {
    method: 'POST',
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify(newRamenObj),
    })
    .then(res => res.json())
    .then(newRamenObj => addRamenToRamenMenu(newRamenObj),
        addRamenDetailToDom(newRamenObj));
}

function deleteRamenFromDb(ramenId){
    fetch(`http://localhost:3000/ramens/${ramenId}`, {
        method: 'DELETE'})
}
    


function addRamenToRamenMenu(allRamen){
    // console.log(allRamen)
    // add ramen on the menu
    if (allRamen.length > 1){
        allRamen.forEach(ramen =>{
        ramenMenu.innerHTML += `
        <div>
            <img data-id=${ramen.id} src=${ramen.image} alt=${ramen.name}>
            <button class="delete" data-id=${ramen.id}>X</button>
        </div>        
        `
        })
    } else if(allRamen.length > 0){
        // console.log('only one!')
        ramenMenu.innerHTML += `
        <div>
            <img data-id=${ramen.id} src=${ramen.image} alt=${ramen.name}>
            <button class="delete" data-id=${ramen.id}>X</button>
        </div>        
        `
    }
}

function handleClickOnRamenMenu(e){
    // console.log('hi')
    // debugger
    if (e.target.matches('img')){
        const ramenId = e.target.dataset.id 
        getOneRamen(ramenId)
    }else if(e.target.className === 'delete'){
        deleteRamenFromDom(e)
    }
}

function deleteRamenFromDom(e){
    // console.log('hi')
    const ramenId = e.target.dataset.id
    e.target.parentElement.remove()
    deleteRamenFromDb(ramenId)
}

function addRamenDetailToDom(ramen){
    // put the detail of Ramen on page
    // console.log('hi')
    ramenDetail.innerHTML = `
        <div>
            <img class="detail-image" src="${ramen.image}" alt="${ramen.name}" />
            <h2 class="name">${ramen.name}</h2>
            <h3 class="restaurant">${ramen.restaurant}</h3>
        </div>
       `
    ramenForm.dataset.id = ramen.id
    ramenForm.innerHTML = `
        <div>
            <label for="rating">Rating: </label>
            <input type="text" name="rating" id="rating" value="${ramen.rating}" />
            <label for="comment">Comment: </label>
            <textarea name="comment" id="comment">${ramen.comment}</textarea>
            <input type="submit" value="Update"/>
        </div>
        `
}

function getUpdatedRamenDataFromForm(e){
    // console.log('hi')
    e.preventDefault()
    const updatedRating = e.target.rating.value
    const updatedComment = e.target.comment.value
    const needUpdateRamenId = parseInt(e.target.dataset.id)

    const updatedRamenObj = {
        rating: updatedRating,
        comment: updatedComment
    }
    updateRamenRatingInDb(updatedRamenObj, needUpdateRamenId)
}

function createNewRamen(e){
    // console.log('hi')
    e.preventDefault()
    const newName = e.target.name.value
    const newRest = e.target.restaurant.value
    const newImg = e.target.image.value
    const newRating = e.target.rating.value
    const newComment = e.target.querySelector('#new-comment').value

    const newRamenObj = {
        name: newName,
        restaurant: newRest,
        image: newImg,
        rating: newRating,
        comment: newComment
    }
    newRamen.reset()
    addNewRamenToDb(newRamenObj)
}

