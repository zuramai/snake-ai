import Game from './Game'
import './style.css'


globalThis.mutationRate = 2
let game: Game 

const wrapper = document.querySelector('.canvas-wrapper')! as HTMLElement

const setup = () => {
  game = new Game(2000, wrapper)
  game.render()

}

setup()