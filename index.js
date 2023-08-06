// Description: Main file for the game
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Set canvas size
canvas.width = 1024
canvas.height = 576

// Set background color
c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7
class Sprite {
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {x: this.position.x, y: this.position.y},
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // Attack box
        if (this.isAttacking){
            c.fillStyle = 'yellow'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y 
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

const player = new Sprite({position: {x: 0, y: 0}, velocity: {x: 0, y: 10}, offset: {x: 0, y: 0}})


const enemy = new Sprite({position:{x: 400, y: 100}, velocity: {x: 0, y: 0}, color: 'blue', offset: {x: -50, y: 0}})


console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

function objectCollision({object1, object2}){
    return (
        object1.attackBox.position.x + object1.attackBox.width >= object2.position.x 
        && object1.attackBox.position.x <= object2.position.x + object2.width 
        && object1.attackBox.position.y + object1.attackBox.height >= object2.position.y 
        && object1.attackBox.position.y <= object2.position.y + object2.height
    )
}

function winner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        console.log('tie')
        document.querySelector('#displayText').innerHTML = 'TIE!'
    } else if (player.health > enemy.health) {
        console.log('player wins')
        document.querySelector('#displayText').innerHTML = 'PLAYER 1 WINS!'
    } else if (player.health < enemy.health) {
        console.log('enemy wins')
        document.querySelector('#displayText').innerHTML = 'PLAYER 2 WINS!'
    }
}

let timer = 60
let timerId
function countdown() {
    if (timer > 0) {
        timerId = setTimeout(countdown, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    } 
    if (timer === 0) {
        winner({player, enemy})
    }
}

countdown()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    
    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player 1 movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    // Player 2 movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    // Detect collision
    if (objectCollision({object1: player, object2: enemy}) && player.isAttacking) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width =  enemy.health + '%'
        console.log('player attack')
    }
    if (objectCollision({object1: enemy, object2: player}) && enemy.isAttacking) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width =  player.health + '%'    
        console.log('enemy attack')
    }

    // Detect winner
    if (player.health <= 0 || enemy.health <= 0) {
        winner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // Player 1
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        
        // Player 2
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break

        // Attack
        case ' ':
            player.attack()
            break
        case 'Enter':
            enemy.attack()
            break
        
    }
    console.log(event.key)
})

window.addEventListener('keyup', (event) => {
    // Player 1
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    // Player 2
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
    console.log(event.key)
})