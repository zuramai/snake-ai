export default class PVector {
    x: number 
    y: number 
    
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    add(x: number, y: number) {
        this.x += x 
        this.y += y 
    }

    addVector(v: PVector) {
        this.x += v.x
        this.y += v.y
    }

    clone() {
        return new PVector(this.x, this.y)
    }
    
    distanceTo(v: PVector) {
        return Math.sqrt(Math.pow(Math.abs((v.x) - (this.x)),2) + Math.pow(Math.abs((v.y) - (this.y)),2))
    }
}