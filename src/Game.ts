import Snake from "./snake/Snake";
import { randomNumberBetween } from "./utils";
import { createElement } from "./utils/dom";

const blockSize = 30
const hiddenNodes = 16
const hiddenLayers = 2

let highscore = 0
globalThis.hiddenLayers = hiddenLayers
let defaultMutation = globalThis.mutationRate

const humanPlaying = false
const replayBest = true 
const seeVision = false 
const modelLoaded = false 

const evolution = []

const fps = 30
let interval = 1000 / fps
let now = performance.now()
let elapsed 
let then = performance.now()

export default class Game {
    snakes: Snake[] = []
    bestSnake: Snake
    canvas: HTMLCanvasElement
    graphCanvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    ctxG: CanvasRenderingContext2D
    fitnessSum = 0
    bestSnakeScore = 0
    bestFitness = 0
    samebest = 0
    gen = 0

    constructor(size: number, el: HTMLElement) {
        // Create canvas element
        this.graphCanvas = createElement('canvas', { width: '720', height: '1000' }) as HTMLCanvasElement
        this.canvas = createElement('canvas', { width: '720', height: '720' }) as HTMLCanvasElement

        el.append(this.graphCanvas, this.canvas)

        for (let i = 0; i < size; i++) {
            this.snakes.push(new Snake(hiddenLayers, {
                size: blockSize,
                canvas: this.canvas,
                nn: {
                    hiddenNodes
                },
                snake: {
                    color: '#8183fc',
                    seeVision: false
                }
            }))
        }
        this.bestSnake = this.snakes[0]
        console.log(this.snakes)
        this.bestSnake.replay = true

        this.ctx = this.canvas.getContext('2d')!
        this.ctxG = this.graphCanvas.getContext('2d')!
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
            if(!snake.dead) {
                snake.look()
                snake.think()
                snake.move()
            }
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
            this.bestSnake.brain.draw(this.ctxG, this.bestSnake.decision, this.bestSnake.vision)
        } else {
            this.snakes.forEach(snake => {
                snake.draw(this.ctx)
            })
        }
    }

    render() {
        now = performance.now()

        elapsed = now - then 
        if(elapsed > interval) {
            this.drawGraph()
            if(this.isDone()) {
                highscore = this.bestSnake.score
                this.calculateFitness()
                this.naturalSelection()
            }else{
                this.draw()
                this.update()
            }
            then = performance.now()
        }
        requestAnimationFrame(() => this.render())
    }

    drawGraph() {
        this.ctxG.clearRect(0,0,this.graphCanvas.width, this.graphCanvas.height)
        this.ctxG.textBaseline = "top"
        this.ctxG.fillStyle = "white"
        this.ctxG.font = "32px Arial"
        this.ctxG.fillText("Gen: "+ this.gen, 200, 0)
        this.ctxG.fillText("Mutation Rate: "+ globalThis.mutationRate + '%', 400, 100)
        this.ctxG.fillText("Score: "+ this.bestSnake.score, 400, 50)
        this.ctxG.fillText("Lives: "+ this.bestSnake.life, 400, 200)
        this.ctxG.fillText("High Score: "+ highscore, 400, 0)
    }

    selectParent() {
        let rand = randomNumberBetween(0, this.fitnessSum);
        let summation = 0;
        for(let i = 0; i < this.snakes.length; i++) {
            summation += this.snakes[i].fitness;
            if(summation > rand) {
                return this.snakes[i];
            }
        }
        return this.snakes[0];
    }

    mutate() {
        this.snakes.forEach(snake => snake.mutate())
    }

    calculateFitness() {
        this.snakes.forEach(snake => snake.calculateFitness())
    }

    calculteFitnessSum() {
        this.fitnessSum = 0
        this.snakes.forEach(snake => this.fitnessSum += snake.fitness)
    }


    naturalSelection() {
        const newSnakes = []
        this.setBestSnake()
        this.calculteFitnessSum()
        // add the best snake of the prior generation
        newSnakes[0] = this.bestSnake.clone() 

        for(let i = 1; i < this.snakes.length; i++) {
            const child = this.selectParent().crossover(this.selectParent())
            child.mutate()
            newSnakes[i] = child.clone()
        }
        this.snakes = newSnakes
        evolution.push(this.bestSnakeScore)
        this.gen++
    }
    setBestSnake() {
        console.log('set best snake')
        let max = 0
        let maxIndex = 0
        this.snakes.forEach((snake, i) => {
            if(snake.fitness > max) {
                max = snake.fitness 
                maxIndex = i
            }
        })

        if(max > this.bestFitness) {
            this.bestFitness = max
            this.bestSnake = this.snakes[maxIndex].cloneForReplay()
            this.bestSnakeScore = this.snakes[maxIndex].score 
        } else {
            this.bestSnake = this.bestSnake.cloneForReplay()
            this.samebest++
            if(this.samebest > 2) {
                mutationRate *= 2
                this.samebest = 0
            }
        }

    }

    calculateFitnessSum() {
        this.fitnessSum = 0
        this.snakes.forEach(snake => {
            this.fitnessSum += snake.fitness
        })
    }

    
}