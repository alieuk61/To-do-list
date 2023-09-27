'use strict'

console.log('i am working')

let body = document.querySelector('body');
const moon = document.querySelector('.moon')
const headerSec = document.querySelector('header-and-button');
const sun = document.querySelector('.sun')

document.querySelector('.light-button').addEventListener('click', () => {
  body.classList.remove('turn-bg-on');
  body.classList.add('turn-bg-off');
  moon.style.display = 'none';
  sun.style.display = 'block';

})

document.querySelector('.sun').addEventListener('click', () => {
  body.classList.remove('turn-bg-off');
  body.classList.add('turn-bg-on');
  sun.style.display = 'none';
  moon.style.display = 'block';
})

//make another one but for the night button
