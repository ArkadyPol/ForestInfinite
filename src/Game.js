import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
THREE.Object3D.DefaultUp.set(0, 0, 1)

class Game {
  canvas = document.querySelector('#c')
  renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
  scene = new THREE.Scene()
  gltfLoader = new GLTFLoader()
  camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100)
  controls = new OrbitControls(this.camera, this.canvas)
  framesCount = 0

  start() {
    this.camera.position.set(0, -10, 8)
    this.controls.update()
    this.addLight()
    this.loadHouse()
  }

  render(time) {
    this.resize()
    this.renderer.render(this.scene, this.camera)
    this.framesCount++
  }

  resize() {
    const canvas = this.renderer.domElement
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
      this.scene.add(root)
    })
  }
}

export default Game
