import * as THREE from 'three'
import Arrow from './Arrow'
import CameraControls from './CameraControls'
import Character from './Character'
import Sector from './Sector'
import { AnimationsType, ModelsType } from './utils/loadAssets'
THREE.Object3D.DefaultUp.set(0, 0, 1)

class Game {
  canvas = document.querySelector('#c') as HTMLCanvasElement
  renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
  scene = new THREE.Scene()
  raycaster = new THREE.Raycaster()
  framesCount = 0
  then = 0
  controls: CameraControls
  light!: THREE.DirectionalLight

  constructor(models: ModelsType, animations: AnimationsType, sectorSize = 40) {
    this.addLight()
    Sector.size = sectorSize
    Sector.tree = models.tree.getObjectByName('Tree') as THREE.Group
    Sector.grass = models.grass.getObjectByName('Grass') as THREE.Mesh
    new Sector(0, 0, this.scene, models.house)
    Arrow.meshSample = models.arrow.getObjectByName('Arrow') as THREE.Mesh
    Arrow.animationClip = animations.ArrowAction
    const character = new Character(
      2,
      models.character.getObjectByName('Character') as THREE.Object3D,
      animations.Walk
    )
    this.controls = new CameraControls(this.canvas)
    this.scene.add(character.container)
    this.canvas.addEventListener('click', this.onClick.bind(this))
  }

  render(time: number) {
    const now = time * 0.001
    const deltaTime = now - this.then
    this.then = now
    for (let arrow of Arrow.arrows) {
      arrow.update(deltaTime)
    }

    Character.character.update(deltaTime)

    this.resize()
    this.renderer.render(this.scene, Character.character.camera)
    this.framesCount++
  }

  resize() {
    const canvas = this.canvas
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      this.renderer.setSize(width, height, false)
      Character.character.camera.aspect =
        canvas.clientWidth / canvas.clientHeight
      Character.character.camera.updateProjectionMatrix()
    }
  }

  addLight() {
    this.light = new THREE.DirectionalLight(0xffffff, 1)
    this.light.position.set(10, 0, 30)
    this.light.target.position.set(-8, 0, 0)
    this.scene.add(this.light)
    this.scene.add(this.light.target)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    this.scene.add(ambientLight)
  }

  onClick(e: MouseEvent) {
    const pointer = new THREE.Vector2()
    pointer.x = (e.clientX / this.canvas.width) * 2 - 1
    pointer.y = -(e.clientY / this.canvas.height) * 2 + 1
    this.raycaster.setFromCamera(pointer, Character.character.camera)
    const intersects = this.raycaster.intersectObjects(Sector.planes)
    if (intersects.length > 0) {
      const { point, object } = intersects[0]
      const local = new THREE.Vector3().copy(point)
      object.worldToLocal(local)
      const sectorPos = new THREE.Vector3()
        .copy(object.parent!.position)
        .divideScalar(Sector.size)

      const border = Sector.size * 0.4
      const xDiff = Math.abs(local.x) - border
      const yDiff = Math.abs(local.y) - border

      if (xDiff >= 0) {
        Sector.create(sectorPos.x + Math.sign(local.x), sectorPos.y, this.scene)
      }

      if (yDiff >= 0) {
        Sector.create(sectorPos.x, sectorPos.y + Math.sign(local.y), this.scene)
      }

      if (xDiff >= 0 && yDiff >= 0) {
        Sector.create(
          sectorPos.x + Math.sign(local.x),
          sectorPos.y + Math.sign(local.y),
          this.scene
        )
      }

      this.createArrow(point)
      Character.character.startMove(point)
    }
  }

  createArrow(point: THREE.Vector3) {
    const arrow = new Arrow(point)
    this.scene.add(arrow.mesh)
  }
}

export default Game
