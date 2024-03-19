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
        color: 'purple',
        seeVision: false,
    },
    size: 20
}

export default class Snake {
    score = 1
    life = 200 
    lifetime = 0 // amount if time the snake has been alive
    xVel: number = 0
    yVel: number = 0
    foodIterate = 0

    dead = false 
    replay = false 

    fitness = 0
    
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

    move() {
        if(!this.dead) {
            this.lifetime++
            this.life--
        }
        if(this.foodCollide(this.head.x, this.head.y)) {
            this.eat()
        }
        this.shiftBody()
        if(this.wallCollide(this.head.x, this.head.y) || 
            this.bodyCollide(this.head.x, this.head.y) || 
            this.life <= 0) {
            this.dead = true
        } 
    }

    eat() {
        let len = this.body.length - 1
        this.score++
        
        if(this.life < 500) {
            if(this.life > 400) {
                this.life = 500
            }else{
                this.life += 100
            }
        }

        if(len >= 0) {
            this.body.push(new PVector(this.body[len-1].x, this.body[len-1].y))
        }else {
            this.body.push(new PVector(this.head.x, this.head.y))
        }

        this.food = this.foodList[this.foodIterate]
        this.foodIterate++
    }

    shiftBody() {
        let tempx = this.head.x
        let tempy = this.head.y
        this.head.x += this.xVel
        this.head.y += this.yVel

        let temp2x;
        let temp2y;

        this.body.forEach((v,i) => {
            temp2x = v.x
            temp2y = v.y 
            this.body[i].x = tempx
            this.body[i].y = tempy 
            tempx = temp2x
            tempy = temp2y
        })
    }

    crossover(parent: Snake) {  //crossover the snake with another snake
        const child = new Snake(2);
        child.brain = this.brain.crossover(parent.brain);
        return child;
    }

    mutate() {
        this.brain.mutate(mutationRate)
    }

    calculateFitness() {
        if(this.score < 10) {
            this.fitness = Math.floor(this.lifetime * this.lifetime) * Math.pow(this.score, 2)
        } else {
            this.fitness = Math.floor(this.lifetime * this.lifetime)
            this.fitness *= Math.pow(10, 2)
            this.fitness *= this.score - 9
        } 
    }

    look() {
        const size = this.options.size
        this.vision = new Array(24)
        let temp = this.lookInDirection(new PVector(-size, 0))
        this.vision[0] = temp[0];
        this.vision[1] = temp[1];
        this.vision[2] = temp[2];
        temp = this.lookInDirection(new PVector(-size,-size));
        this.vision[3] = temp[0];
        this.vision[4] = temp[1];
        this.vision[5] = temp[2];
        temp = this.lookInDirection(new PVector(0,-size));
        this.vision[6] = temp[0];
        this.vision[7] = temp[1];
        this.vision[8] = temp[2];
        temp = this.lookInDirection(new PVector(size,-size));
        this.vision[9] = temp[0];
        this.vision[10] = temp[1];
        this.vision[11] = temp[2];
        temp = this.lookInDirection(new PVector(size,0));
        this.vision[12] = temp[0];
        this.vision[13] = temp[1];
        this.vision[14] = temp[2];
        temp = this.lookInDirection(new PVector(size,size));
        this.vision[15] = temp[0];
        this.vision[16] = temp[1];
        this.vision[17] = temp[2];
        temp = this.lookInDirection(new PVector(0,size));
        this.vision[18] = temp[0];
        this.vision[19] = temp[1];
        this.vision[20] = temp[2];
        temp = this.lookInDirection(new PVector(-size,size));
        this.vision[21] = temp[0];
        this.vision[22] = temp[1];
        this.vision[23] = temp[2];
    }

    lookInDirection(direction: PVector) {
        const look = []
        const pos = new PVector(this.head.x, this.head.y)
        let distance = 0

        let foodFound = false 
        let bodyFound = false

        pos.addVector(direction)
        distance++

        while(!this.wallCollide(pos.x, pos.y)) {
            if(!foodFound && this.foodCollide(pos.x, pos.y)) {
                foodFound = true 
                look[0] = 1
            }
            if(!bodyFound && this.bodyCollide(pos.x, pos.y)) {
                bodyFound = true 
                look[1] = 1
            }
            pos.addVector(direction)
            distance++
        }
        look[2] = 1/distance 
        return look
    }

    think() {
        this.decision = this.brain.output(this.vision)
        let maxIndex = 0
        let max = 0
        for(let i = 0; i < this.decision.length; i++) {
            if(this.decision[i] > max) {
                max = this.decision[i]
                maxIndex = i
            }
        }
        switch (maxIndex) {
            case 0:
                this.moveUp()
                break;
            case 1:
                this.moveDown()
                break;
            case 2:
                this.moveLeft()
                break;
            case 3:
                this.moveRight()
                break;
            default:
                break;
        }
    }

    moveUp() {
        if(this.yVel != this.options.size) {
            this.xVel = 0; this.yVel = -this.options.size
        }
    }
    moveDown() {
        if(this.yVel != -this.options.size) {
            this.xVel = 0; this.yVel = this.options.size
        }
    }
    moveLeft() {
        if(this.xVel != this.options.size) {
            this.xVel = -this.options.size; this.yVel = 0
        }
    }
    moveRight() {
        if(this.xVel != -this.options.size) {
            this.xVel = this.options.size; this.yVel = 0
        }
    }
    clone() {
        const clone = new Snake(globalThis.hiddenLayers)
        clone.brain = this.brain.clone()
        return clone
    }
    cloneForReplay() {
        const clone = new Snake(globalThis.hiddenLayers)
        clone.brain = this.brain.clone()
        return clone
    }
}