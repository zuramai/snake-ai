import Game from './Game'
import './style.css'


globalThis.mutationRate = 0.05
let game: Game 

const wrapper = document.querySelector('.canvas-wrapper')! as HTMLElement

const setup = () => {
  game = new Game(1000, wrapper)
  game.render()

}

setup()