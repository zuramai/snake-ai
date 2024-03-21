import { randomNumberBetween } from "../utils"
import PVector from "../utils/PVector"

interface FoodOptions {
    color: string 
}

export class Food {
    pos: PVector
    size: number 
    options: FoodOptions

    constructor(size: number, options?: FoodOptions) {
        const x = size * Math.floor(randomNumberBetween(0, 24))
        const y = size * Math.floor(randomNumberBetween(0, 24))
        this.size = size 
        this.pos = new PVector(x,y)
        this.options = options || {
            color: "blue"
        }

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.options.color
        ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size)
    }

    clone() {
        const food = new Food(this.size, this.options)
        food.pos.x = this.pos.x
        food.pos.y = this.pos.y
        return food
    }
}