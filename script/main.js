var pre = document.getElementById('preload')
function myFunction(){
   pre.style.display = 'none' 
}




const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

navToggle.addEventListener('click', () => {
   navMenu.classList.add('show-menu')
})

navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu')
}) 


// login
const login = document.getElementById('login'),
      loginBtn = document.getElementById('nav_login'),
      loginClose = document.getElementById('login-close')

/* Login show */
loginBtn.addEventListener('click', () =>{
   login.classList.add('show-login')
})

/* Login hidden */
loginClose.addEventListener('click', () =>{
   login.classList.remove('show-login')
})




const signup = document.getElementById('sign_up'),
      signupBtn = document.getElementById('login_signup'),
      signupClose = document.getElementById('sign_up-close')
      changebtn = document.getElementById('return_login')

      signupBtn.addEventListener('click', () =>{
         signup.classList.add('show-signup')
         login.classList.remove('show-login')
      })

      signupClose.addEventListener('click', () =>{
         signup.classList.remove('show-signup')
         
      })

      changebtn.addEventListener('click',() =>{
         signup.classList.remove('show-signup')
         login.classList.add('show-login')
      })