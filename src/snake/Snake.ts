import NeuralNet from "../nn/NeuralNet"
import PVector from "../utils/PVector"
import { Food } from "./Food"

const defaultOptions = {
    nn: {
        hiddenNodes: 16
    },
    canvas: {
        width: 800,
        height: 800
    },
    snake: {
        color: 'purple'
    },
    size: 20
}

export default class Snake {
    score = 1
    life = 200 
    lifetime = 0 // amount if time the snake has been alive
    xVel: number 
    yVel: number 
    foodIterate = 0

    dead = false 
    replay = false 
    
    vision: number[] // snake's vision
    decision: number[] // snake's decision 

    head: PVector

    body: PVector[]
    foodList: Food[]

    food: Food
    brain: NeuralNet

    options: typeof defaultOptions

    constructor(layers: number, options = defaultOptions) {
        this.head = new PVector(420, 420)
        this.food = new Food(options.size, {
            color: '#ffea5e'
        }) 

        this.body = []

        this.vision = new Array(24)
        this.decision = new Array(4)
        this.foodList = []
        this.brain = new NeuralNet(24, options.nn.hiddenNodes, 4, layers)

        this.body.push(new PVector(420, 420 + options.size))
        this.body.push(new PVector(420, 420 + options.size * 2))
        this.score += 2;
        this.options = options
    }

    bodyCollide(x: number, y: number) {
        for(let i = 0; i < this.body.length; i++) {
            if(x == this.body[i].x && y == this.body[i].y) {
                return true
            }
        }
        return false 
    }
    foodCollide(x: number, y: number) {
        if(x === this.food.pos.x && y == this.food.pos.y) {
            return true
        }
        return false 
    }
    
    wallCollide(x: number, y: number) {
        if(x >= this.options.canvas.width - this.options.size ||
            x < 0 || 
            y >= this.options.canvas.height - this.options.size || 
            y < 0) {
            return true
        }
        return false 
    }

    draw(ctx: CanvasRenderingContext2D) {
        // draw food
        this.food.draw(ctx)

        ctx.strokeStyle = "white"
        // draw the snake
        this.body.forEach(p => {
            ctx.fillStyle = this.options.snake.color
            ctx.rect(p.x, p.y, this.options.size, this.options.size)
            ctx.lineWidth = 1
            ctx.fill()
            ctx.stroke()
        })

    }

    render(ctx: CanvasRenderingContext2D) {

    }
}