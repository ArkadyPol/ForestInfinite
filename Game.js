import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class Game {
  canvas = document.querySelector('#c')
  renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
  scene = new THREE.Scene()
  loader = new THREE.TextureLoader()
  camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100)
  controls = new OrbitControls(this.camera, this.canvas)
  framesCount = 0

  start() {
    this.camera.position.set(0, 10, 20)
    this.controls.target.set(0, 5, 0)
    this.controls.update()
    this.addLight()
    this.addPlane()
    this.addCube()
    this.addSphere()
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
    const color = 0xffffff
    const intensity = 1
    this.light = new THREE.SpotLight(color, intensity)
    this.light.position.set(0, 20, 0)
    this.scene.add(this.light)
    this.scene.add(this.light.target)
  }

  addPlane() {
    const texture = this.loader.load('assets/images/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const planeSize = 40
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
    this.plane = new THREE.Mesh(planeGeo, planeMat)
    this.plane.rotation.x = Math.PI * -0.5
    this.scene.add(this.plane)
  }

  addCube() {
    const cubeSize = 4
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
    this.cube = new THREE.Mesh(cubeGeo, cubeMat)
    this.cube.position.set(cubeSize + 1, cubeSize / 2, 0)
    this.scene.add(this.cube)
  }

  addSphere() {
    const sphereRadius = 3
    const sphereWidthDivisions = 32
    const sphereHeightDivisions = 16
    const sphereGeo = new THREE.SphereGeometry(
      sphereRadius,
      sphereWidthDivisions,
      sphereHeightDivisions
    )
    const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' })
    this.sphere = new THREE.Mesh(sphereGeo, sphereMat)
    this.sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
    this.scene.add(this.sphere)
  }
}

export default Game
