// write your code here
const ramenMenu = document.querySelector('div#ramen-menu')
const ramenDetail = document.querySelector('div#ramen-detail')
const ramenForm = document.querySelector('form#ramen-rating')

ramenMenu.addEventListener('click', getRamenDetail)
ramenForm.addEventListener('submit',getUpdatedRamenDataFromForm)

getAllRamen()
function getAllRamen(){
    fetch("http://localhost:3000/ramens")
    .then(res => res.json())
    .then(addRamenToDom)
}

function getOneRamen(ramenId){
    fetch(`http://localhost:3000/ramens/${ramenId}`)
    .then(res => res.json())
    .then(ramen => addSingleRamenToDom(ramen))
}

function updateRamenRatingInDb(updatedRamenObj, needUpdateRamenId){
    // debugger
    fetch(`http://localhost:3000/ramens/${needUpdateRamenId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(updatedRamenObj),
    })
    .then(res => res.json())
    .then(addSingleRamenToDom)
    
}

function addRamenToDom(allRamen){
    // console.log(allRamen)
    allRamen.forEach(ramen =>{
        ramenMenu.innerHTML += `
        <img data-id=${ramen.id} src=${ramen.image} alt=${ramen.name}>
        `
    })
}

function getRamenDetail(e){
    // console.log('hi')
    const ramenId = e.target.dataset.id 
    getOneRamen(ramenId)
}

function addSingleRamenToDom(ramen){
    // console.log('hi')
    ramenDetail.innerHTML = `
        <img class="detail-image" src="${ramen.image}" alt="${ramen.name}" />
        <h2 class="name">${ramen.name}</h2>
        <h3 class="restaurant">${ramen.restaurant}</h3>
    `
    // const formId = ramen.id
    ramenDetail.nextElementSibling.dataset.id = ramen.id
    ramenForm.innerHTML = `
            <label for="rating">Rating: </label>
            <input type="text" name="rating" id="rating" value="${ramen.rating}" />
            <label for="comment">Comment: </label>
            <textarea name="comment" id="comment">${ramen.comment}</textarea>
            <input type="submit" value="Update" />
    `
}

function getUpdatedRamenDataFromForm(e){
    // console.log('hi')
    e.preventDefault()
    const updatedRating = e.target.rating.value
    const updatedComment = e.target.comment.value
    // const needUpdateRamenId = e.target.dataset.id
    const needUpdateRamenId = parseInt(e.target.dataset.id)

    const updatedRamenObj = {
        rating: updatedRating,
        comment: updatedComment
    }
    // debugger
    updateRamenRatingInDb(updatedRamenObj, needUpdateRamenId)
}
