import Matrix from "../utils/Matrix"

export default class NeuralNet {
    iNodes: number
    hNodes: number
    oNodes: number
    hLayers: number

    weights: Matrix[] = [];

    constructor(input: number, hidden: number, output: number, hiddenLayers: number) {
        this.iNodes = input 
        this.hNodes = hidden 
        this.oNodes = output 
        this.hLayers = hiddenLayers

        this.weights = new Array(hiddenLayers+1)
        this.weights[0] = new Matrix(this.hNodes, this.iNodes+1)

        for(let i = 1; i < this.hLayers; i++) {
            this.weights[i] = new Matrix(this.hNodes, this.hNodes+1)
        }

        this.weights[this.weights.length-1] = new Matrix(this.oNodes, this.hNodes+1)

        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i].randomize()
        }
    }
    
    mutate(mr: number) {
        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i].mutate(mr)
        }
    }

    output(inputsArr: number[]) {
        // Create new matrix with size [24, 1]
        const inputs = Matrix.singleColumnMatrixFromArray(inputsArr) as Matrix

        // Add the 25th row as 1
        let currLayerWithBias = inputs.addBias()
        
        for(let i = 0; i < this.hLayers; i++) {
            const hidden_ip = this.weights[i].dot(currLayerWithBias) 
            const hidden_op = hidden_ip.activate()
            currLayerWithBias = hidden_op.addBias()
        }

        const output_ip = this.weights[this.weights.length - 1].dot(currLayerWithBias)
        const output = output_ip.activate()

        return output.toArray()
    }

    draw(ctx: CanvasRenderingContext2D, decision: number[]) {
        const arcSize = 15
        const marginY = 25

        // Draw input layer nodes
        for (let i = 0; i < this.iNodes; i++) {
            ctx.beginPath();
            ctx.arc(arcSize, (arcSize) * i + (marginY * i) + 100, arcSize, 0, Math.PI * 2)
            ctx.fillStyle = decision[i] > 0.0 ? 'green' : "white"
            ctx.strokeStyle = decision[i] != 0 ? 'black' : "white"
            ctx.stroke()
            ctx.fill()
            ctx.closePath()
        }

        // Draw hidden layers nodes
        const gapHorizontal = 150
        for (let i = 0; i < this.hLayers; i++) {
            for (let j = 0; j < this.hNodes; j++) {
                ctx.beginPath();
                ctx.arc(gapHorizontal * (i+1), (arcSize) * j + (marginY * j) + 250, arcSize, 0, Math.PI * 2)
                ctx.fillStyle = "white"
                ctx.strokeStyle = "black"
                ctx.stroke()
                ctx.fill()
                ctx.closePath()
            }
        }

        // Draw output layers nodes
        const outputLabels = ['Up', 'Down', 'Left', 'Right']
        for (let i = 0; i < this.oNodes; i++) {
            const x = gapHorizontal * (this.hLayers + 1)
            const y = (arcSize) * i + (marginY * i) + 450
            ctx.beginPath();
            ctx.arc(x - arcSize, y + arcSize, arcSize, 0, Math.PI * 2)
            ctx.font = "16px Arial"
            ctx.fillText(outputLabels[i], x, y)
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.stroke()
            ctx.fill()
            ctx.closePath()
        }

    }

    crossover(partner: NeuralNet) {
        const child = new NeuralNet(this.iNodes, this.hNodes, this.oNodes, this.hLayers)
        for (let i = 0; i < this.weights.length; i++) {
            child.weights[i] = this.weights[i].crossover(partner.weights[i])
        }
        return child
    }

    clone() {
        const clone = new NeuralNet(this.iNodes,this.hNodes,this.oNodes,this.hLayers)
        for(let i = 0; i < this.weights.length; i++) {
            clone.weights[i] = this.weights[i].clone()
        }
        return clone
    }
    
    load(weights: Matrix[]) {
        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i] = weights[i]
        }
    }

    pull() {
        const model = this.weights
        return model
    }
}