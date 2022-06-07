import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Arrow from './Arrow'
import Character from './Character'
THREE.Object3D.DefaultUp.set(0, 0, 1)

class Game {
  canvas = document.querySelector('#c')
  renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
  scene = new THREE.Scene()
  gltfLoader = new GLTFLoader()
  camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100)
  controls = new OrbitControls(this.camera, this.canvas)
  raycaster = new THREE.Raycaster()
  framesCount = 0
  then = 0
  arrows = []
  animations = {}

  start() {
    this.camera.position.set(0, -10, 8)
    this.controls.update()
    this.addLight()
    this.loadHouse()
    this.createCharacter()
    this.loadArrow()
    this.canvas.addEventListener('click', this.onClick.bind(this))
  }

  render(time) {
    const now = time * 0.001
    const deltaTime = now - this.then
    this.then = now
    for (let i = 0; i < this.arrows.length; i++) {
      const arrow = this.arrows[i]
      arrow.update(deltaTime)
      if (arrow.shouldDeleted) {
        arrow.delete()
        this.scene.remove(arrow.mesh)
        this.arrows.splice(i, 1)
        i--
      }
    }
    this.character.update(deltaTime)

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

  loadHouse() {
    const url = 'assets/models/house.gltf'
    this.gltfLoader.load(url, gltf => {
      const root = gltf.scene
      this.plane = root.getObjectByName('Field')
      this.scene.add(root)
    })
  }

  loadArrow() {
    const url = 'assets/models/arrow.gltf'
    this.gltfLoader.load(url, gltf => {
      const root = gltf.scene
      for (let clip of gltf.animations) {
        this.animations[clip.name] = clip
      }
      this.arrow = root.getObjectByName('Arrow')
    })
  }

  onClick(e) {
    const pointer = new THREE.Vector2()
    pointer.x = (e.clientX / this.canvas.width) * 2 - 1
    pointer.y = -(e.clientY / this.canvas.height) * 2 + 1
    this.raycaster.setFromCamera(pointer, this.camera)
    const intersects = this.raycaster.intersectObjects([this.plane])
    if (intersects.length > 0) {
      const point = intersects[0].point
      this.createArrow(point)
      this.character.startMove(point)
    }
  }

  createArrow(point) {
    const arrow = new Arrow(this.arrow, this.animations['ArrowAction'], point)
    this.scene.add(arrow.mesh)
    this.arrows.push(arrow)
  }

  createCharacter() {
    this.character = new Character(2, this.gltfLoader, this.scene)
  }
}

export default Game
