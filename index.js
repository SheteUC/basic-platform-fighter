// Description: Main file for the game
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Set canvas size
canvas.width = 1024;
canvas.height = 576;

// Set background color
c.fillRect(0, 0, canvas.width, canvas.height);