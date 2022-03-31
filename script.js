var r = document.querySelector(':root');
var rs = getComputedStyle(r)
const links = document.querySelector(".links").children
const link_underlines = document.querySelectorAll(".ud")
const link_to_pages = {
    'p1': 'home',
    'p2':'about_me',
    'p3': 'skills',
    'p4': 'projects',
    'p5': 'contact'
};


// delay
function timer(timeInMs) {
    const end_time = new Date().getTime() + timeInMs
    let current_time = new Date().getTime()
    while (current_time < end_time) {
        current_time = new Date().getTime()
    }
}

// Hamburger
const hamburger = document.querySelector('.hamburger')

hamburger.onclick = () => {
  for(let i = 0; i<links.length; i++){
    link_underlines[i].style.transform = "";
  }
    //hamburger animation
      document.querySelector('main').style.filter = document.querySelector('main').style.filter == '' ? "brightness(10%)" : '';
      hamburger.classList.toggle("toggle");
      $('.menu').toggleClass('mo')
      setTimeout(function() {
          $('.links').toggleClass('openul')
          for (const elm of document.querySelector('.links').children) {
              $(elm).toggleClass('ol')
          }
      }, 300)
}

// Fetch projects
async function fetch_repos(create_cards = false, elm = false) {
    let response = await fetch("https://api.github.com/users/Rahulvenkatashan/repos");
    let result = await response.json()

    // Loop through all projects
    try {
        for (let i = 0; i < result.length; i++) {
            // Local variables
            let sub_response = await fetch(`https://raw.githubusercontent.com/Rahulvenkatashan/${result[i].name}/main/README.md`)
            let sub_result = await sub_response.text()
            let temp_div = document.createElement('div')
            temp_div.innerHTML = sub_result
            let text = ([...temp_div.querySelectorAll('.upgrades, .quick_info, .summary')])

            if (!create_cards) { //create the cards
                const card_container = document.createElement('div')
                card_container.classList.add('card')
                card_container.style.backgroundImage = `url(${text[2].dataset.image})`
                card_container.innerHTML = `<div class="card-content"><ul class="projects-summary"><li class="first-point"><h2>${result[i].name}</h2></li><li class="second-point"><p>${text[2].dataset.summaryType}</p></li><li class="third-point"><button>More</button></li></ul></div>`
                document.querySelector(".card-container").appendChild(card_container);

            } else { //Update more info
                if (result[i].name.toString().trim() == create_cards.toString().trim()) {
                    // Update project title
                    document.querySelector('.project-title p').innerText = create_cards
                    // Update quick summary
                    document.querySelector('.project-summary p').innerText = (text.slice(0, 2).map(x => x.innerText)).join(' ')
                    // Update bg image
                    let excess = ((((document.querySelector('.project-summary').offsetHeight / 500) * 100) + 15 + 60) - 100) * -1
                    r.style.setProperty('--leftover_height', `${60 + excess}%`)
                    document.querySelector('.project-image .img').style.backgroundImage = elm.style.backgroundImage;
                }
            }
        }
    } catch {
        console.warn('The repo no longer exists ); ')
    }
}

//Open Projects
$(document).on('click', '.card-content', async function() {
    const card_overlays = document.querySelectorAll('.card-content');
    for (const elm of card_overlays) {
        if (elm != this) {
            $(elm).removeClass('card-container-active')
        }
    }
    $(this).toggleClass('card-container-active');
    await fetch_repos(this.parentElement.querySelector('.first-point').innerText, this.parentElement)

})

// Display more info
$(document).on('click', '.third-point', function() {
    $('.more_info').addClass('more_info_open');
    document.querySelector('.card-container').style.filter = "brightness(30%)";
    document.body.style.overflow = 'hidden';
})

// Remove more info
$(document).on('click', '.close', function() {
    $('.more_info').removeClass('more_info_open');
    document.querySelector('.card-container').style.filter = ''
    document.body.style.overflow = '';
})
// Set link
function draw_line(master_elm = document.getElementById("p1") ){
    master_elm.style.color = "#ff5249cb"
    master_elm.querySelector(".ud").style.transform = getComputedStyle(document.querySelector('.device_type')).display == "block"? "scaleX(1)":""
}


// Smooth scroll

$('.links li').click(function() {
    // hamburger animation
    // Remove from all
    for(let i = 0; i<links.length; i++){
      links[i].style.color = "white"
      link_underlines[i].style.transform = "";
    }
    this.style.color = "#ff5249cb";
    this.querySelector('.ud').style.transform = getComputedStyle(document.querySelector('.device_type')).display != "none"?"scaleX(1)":""
    if(getComputedStyle(document.querySelector('.device_type')).display == "none"){
      document.querySelector('main').style.filter = document.querySelector('main').style.filter == '' ? "brightness(10%)" : '';
    }
    hamburger.classList.toggle("toggle");
    $('.menu').toggleClass('mo');
    setTimeout(function() {
        $('.links').toggleClass('openul');
        for (const elm of document.querySelector('.links').children) {
            $(elm).toggleClass('ol');
        }
    }, 300);
    window.scrollTo(0, document.getElementById(link_to_pages[this.id]).offsetTop);
})
draw_line()
// Load projects
fetch_repos();

// Load type writer
class Typewriter {
  constructor(elm, msg_array,speeds, pause) {
    this.elm = elm;
    this.msg_array = msg_array;
    this.t_count = 0;
    this.idx = 0;
    this.backspace = false;
    this.speeds = speeds
    this.current_speed = speeds[0]
    this.pause = pause
    this.time_elapesd = null
    this.paused = false

    let typeWrite=()=>{

      if(this.t_count + 1 > this.msg_array[this.idx].length && !this.paused|| this.backspace){
        this.current_speed = speeds[1]
        if(this.t_count == 0){
           this.backspace = false
           this.idx + 1 <= this.msg_array.length-1?this.idx++:this.idx = 0
           this.elm.innerHTML = ""
        }else if(this.t_count > 0){
           this.elm.innerHTML = this.msg_array[this.idx].substr(0,this.t_count)
           this.backspace = true
           this.t_count--
         }
      }else{
        this.current_speed = speeds[0]
        if(!this.paused){
          this.elm.innerHTML += this.msg_array[this.idx][this.t_count]
          this.t_count++
        }
        if(this.t_count == this.msg_array[this.idx].length){
          this.paused = true
          if(this.time_elapesd == null){
            this.time_elapesd = new Date().getTime()
          }else if(new Date().getTime() - this.time_elapesd > this.pause && this.paused && this.time_elapesd){
             this.paused = false
             this.time_elapesd = null
          }
        }
      }
      setTimeout(typeWrite, this.current_speed)

    }
    typeWrite()
  }

  cursor(){

  }
}

new Typewriter(document.querySelector(".type-write"),["Innovator", "Developer", "Engineer"],[100,75],2000) //Type writer effect
new Typewriter(document.querySelector(".type-write-2"),["Innovator", "Developer", "Engineer"],[100,75],2000) //Type writer effect

/*Skill section*/
const skill_slide = document.querySelector('.skill-frame')
$('.arrw').click(function(){
  if(this.classList[1] == "left"){
    if(skill_slide.style.right.replace("vw","")*1 - 75 >= 0){
      skill_slide.style.right = `${skill_slide.style.right.replace("vw","")*1 - 75}vw`
    }else{
      skill_slide.style.right = "150vw"
    }
  }else{
    if(skill_slide.style.right.replace("vw","")*1 + 75 <= 150){
      skill_slide.style.right = `${skill_slide.style.right.replace("vw","")*1 + 75}vw`
    }else{
      skill_slide.style.right = "0vw"
    }
  }
})
