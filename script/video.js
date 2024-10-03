const loadFunction = () =>{
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(res => res.json())
    .then(data => displayFunction(data.categories))
    .catch(err => console.log(err))
}
const removeActive = () => {
 const buttons = document.getElementsByClassName("category-btn")
 for (let btn of buttons){
    btn.classList.remove("active")
 }
}
const loadCategoryVideos = (id) => {

fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(res => res.json())
    .then(data => {
        removeActive();
        const activeBtn= document.getElementById(`btn-${id}`)
        activeBtn.classList.add("active")
        displayVideos(data.category)
    })
    .catch(err => console.log(err))
}
const displayFunction = (data) =>{
    const categoryContainer = document.getElementById('categories')
    data.forEach((item) => {
        console.log(item)

        const buttonContainer = document.createElement("div")
        buttonContainer.innerHTML =`
        <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn">
        ${item.category}
        </button>
        `

        categoryContainer.append(buttonContainer)
    });
}
const loadVideosFunction = (searchText = "") =>{
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(res => res.json())
    .then(data => displayVideos(data.videos))
    .catch(err => console.log(err))
}

function getTimeAgo(time){
    const hour = parseInt(time/3600);
    let remainingSec = time%3600;
    const minute = parseInt(remainingSec/60);
     remainingSec = remainingSec % 60 
     return `${hour} hour ${minute} minute ${remainingSec} second ago`
}
const loadDetails = async(videoId) =>{
 const url=`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
 const res = await fetch(url)
 const data = await res.json()
 displayDetails(data.video);
}
const displayDetails = (data) =>{
 console.log(data)
 const modalContainer = document.getElementById('modal-contain')
 modalContainer.innerHTML = `
 <img src="${data.thumbnail}">
 <p>${data.description}</p>
 `
 document.getElementById('modalData').click()
}
const displayVideos = (data) =>{

    console.log(data)
    const VideoContainer = document.getElementById("videos")
    VideoContainer.innerHTML=""
    if(data.length ===0){
        VideoContainer.classList.remove("grid")
        VideoContainer.innerHTML=`
        <div class="min-h-[400px] w-full flex flex-col gap-5 justify-center items-center">
        <img src="./ph-tube-resources-main/Icon.png">
        <h2 class="text-center font-bold text-xl">
        No Content here in this category
        </h2>
        </div>
        `
    }else{
        VideoContainer.classList.add("grid")
    }
    data.forEach( video =>{
        console.log(video)
        const card = document.createElement("div")
        card.classList = "card card-compact "
        card.innerHTML = `
        <figure class="h-[200px] relative">
    <img class="h-full w-full object-cover"
      src=${video.thumbnail}
      alt="" />
      ${video.others.posted_date?.length == 0 ? "": `<span class="absolute text-sm right-2 bottom-2 bg-black rounded text-white p-1">
        ${getTimeAgo(video.others.posted_date)}
        </span>`}
   
  </figure>
  <div class="px-0 py-2 flex gap-2">
   <div>
   <img src=${video.authors[0].profile_picture} class="w-10 h-10 rounded-full object-cover"> 
   </div>
   <div>
   <h2 class="font-bold">${video.title}</h2>
   <div class="flex items-center gap-2">
   <p class="text-gray-400">${video.authors[0].profile_name}</P>
  ${video.authors[0].verified === true ? ` <img class="w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png">` : ""}
   </div>
   
   <p>
   <button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error">Details
   </button>
   </P>
   </div>
  </div>`
  VideoContainer.append(card)
    })
}

document.getElementById('search-input').addEventListener("keyup",(e)=>{
    loadVideosFunction(e.target.value)
})

loadFunction();
loadVideosFunction();