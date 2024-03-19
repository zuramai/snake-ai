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
    
}