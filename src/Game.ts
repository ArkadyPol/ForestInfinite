import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Arrow from './Arrow'
import Character from './Character'
import { AnimationsType, ModelsType } from './utils/loadAssets'
THREE.Object3D.DefaultUp.set(0, 0, 1)

class Game {
  canvas = document.querySelector('#c') as HTMLCanvasElement
  renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100)
  controls = new OrbitControls(this.camera, this.canvas)
  raycaster = new THREE.Raycaster()
  framesCount = 0
  then = 0
  light!: THREE.DirectionalLight
  plane!: THREE.Mesh

  constructor(models: ModelsType, animations: AnimationsType) {
    this.addLight()
    this.addPlane(50)
    this.scene.add(models.house)
    Arrow.meshSample = models.arrow.getObjectByName('Arrow') as THREE.Mesh
    Arrow.animationClip = animations.ArrowAction
    Arrow.scene = this.scene
    const character = new Character(
      2,
      models.character.getObjectByName('Character') as THREE.Mesh,
      animations.Walk
    )
    this.scene.add(character.mesh)
  }

  start() {
    this.camera.position.set(0, -10, 8)
    this.controls.update()
    this.canvas.addEventListener('click', this.onClick.bind(this))
  }

  render(time: number) {
    const now = time * 0.001
    const deltaTime = now - this.then
    this.then = now
    const arrows = Arrow.arrows
    for (let arrow of Arrow.arrows) {
      arrow.update(deltaTime)
    }

    Character.character.update(deltaTime)

    this.resize()
    this.renderer.render(this.scene, this.camera)
    this.framesCount++
  }

  resize() {
    const canvas = this.canvas
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      this.renderer.setSize(width, height, false)
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight
      this.camera.updateProjectionMatrix()
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

  addPlane(size: number) {
    const planeGeo = new THREE.PlaneGeometry(size, size)
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x4e9632 })
    this.plane = new THREE.Mesh(planeGeo, planeMat)
    this.scene.add(this.plane)
  }

  onClick(e: MouseEvent) {
    const pointer = new THREE.Vector2()
    pointer.x = (e.clientX / this.canvas.width) * 2 - 1
    pointer.y = -(e.clientY / this.canvas.height) * 2 + 1
    this.raycaster.setFromCamera(pointer, this.camera)
    const intersects = this.raycaster.intersectObjects([this.plane])
    if (intersects.length > 0) {
      const point = intersects[0].point
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
