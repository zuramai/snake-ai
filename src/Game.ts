import Snake from "./snake/Snake";

const blockSize = 30
const hiddenNodes = 16
const hiddenLayers = 2
const fps = 50

const highscore = 0

const mutationRate = 0.5
let defaultMutation = mutationRate

const humanPlaying = false
const replayBest = true 
const seeVision = false 
const modelLoaded = false 

const evolution = []

export default class Game {
    snakes: Snake[] = []
    bestSnake: Snake
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    constructor(size: number, canvas: HTMLCanvasElement) {
        for (let i = 0; i < size; i++) {
            this.snakes.push(new Snake(hiddenLayers, {
                size: blockSize,
                canvas,
                nn: {
                    hiddenNodes
                },
                snake: {
                    color: '#8183fc'
                }
            }))
        }
        this.bestSnake = this.snakes[0]
        console.log(this.snakes)
        this.bestSnake.replay = true

        this.canvas = canvas 
        this.ctx = canvas.getContext('2d')!
    }

    isDone() {
        const allDead = this.snakes.every(snake => snake.dead === true)
        if(allDead) return true 

        if(this.bestSnake.dead) return true

        return false 
    }

    update() {
        if(!this.bestSnake.dead) {
            this.bestSnake.look()
            this.bestSnake.think()
            this.bestSnake.move()
        }
        this.snakes.forEach(snake => {
            snake.look()
            snake.think()
            snake.move()
        })
    }

    draw() {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)

        // draw the canvas
        this.ctx.strokeStyle = "white"
        this.ctx.lineWidth = 5
        this.ctx.strokeRect(0,0,this.canvas.width, this.canvas.height)

        // draw grid
        this.ctx.strokeStyle = "rgba(200,200,200,.2)"
        this.ctx.lineWidth = 1
        for(let i = 0; i < this.canvas.width; i+=blockSize) {
            for(let j = 0; j < this.canvas.height; j+=blockSize) {
                this.ctx.strokeRect(i,j,blockSize,blockSize)
            }
        }

        if(replayBest) {
            this.bestSnake.draw(this.ctx)
        } else {
            this.snakes.forEach(snake => {
                snake.draw(this.ctx)
            })
        }
    }

    render() {
        this.draw()
        this.update()
        requestAnimationFrame(() => this.render())
    }
}