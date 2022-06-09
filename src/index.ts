import Game from './Game'
import Stats from 'three/examples/jsm/libs/stats.module'
import './index.css'
import loadAssets from './utils/loadAssets'

const urls = {
  house: 'assets/models/house.gltf',
  arrow: 'assets/models/arrow.gltf',
  character: 'assets/models/character.gltf',
  tree: 'assets/models/tree.gltf',
  grass: 'assets/models/grass.gltf',
}

const { models, animations, manager } = loadAssets(urls)

const stats = Stats()

document.body.appendChild(stats.dom)

manager.onLoad = () => {
  const game = new Game(models, animations, 50)

  function animate(time: number) {
    stats.begin()
    game.render(time)
    stats.end()
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}
