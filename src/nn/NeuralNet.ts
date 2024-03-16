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
        const inputs = this.weights[0].singleColumnMatrixFromArray(inputsArr) as Matrix
        let curr_bias = inputs.addBias()
        
        for(let i = 0; i < this.hLayers; i++) {
            const hidden_ip = this.weights[i].dot(curr_bias) 
            const hidden_op = hidden_ip.activate()
            curr_bias = hidden_op.addBias()
        }

        const output_ip = this.weights[this.weights.length - 1].dot(curr_bias)
        const output = output_ip.activate()

        return output.toArray()
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