import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './index.css'

const canvas = document.querySelector('#c')
const renderer = new THREE.WebGLRenderer({ canvas })

const fov = 45
const aspect = 2
const near = 0.1
const far = 100
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 10, 20)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 5, 0)
controls.update()

const planeSize = 40

const scene = new THREE.Scene()

{
  //light
  const color = 0xffffff
  const intensity = 1
  const light = new THREE.SpotLight(color, intensity)
  light.position.set(0, 10, 0)
  scene.add(light)
  scene.add(light.target)
}

const loader = new THREE.TextureLoader()
const texture = loader.load('assets/images/checker.png')
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.magFilter = THREE.NearestFilter
const repeats = planeSize / 2
texture.repeat.set(repeats, repeats)

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
})
const mesh = new THREE.Mesh(planeGeo, planeMat)
mesh.rotation.x = Math.PI * -0.5
scene.add(mesh)

{
  const cubeSize = 4
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
  const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
  const mesh = new THREE.Mesh(cubeGeo, cubeMat)
  mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
  scene.add(mesh)
}
{
  const sphereRadius = 3
  const sphereWidthDivisions = 32
  const sphereHeightDivisions = 16
  const sphereGeo = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions
  )
  const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' })
  const mesh = new THREE.Mesh(sphereGeo, sphereMat)
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
  scene.add(mesh)
}

function render(time) {
  time *= 0.001

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }

  renderer.render(scene, camera)

  requestAnimationFrame(render)
}

requestAnimationFrame(render)

/**
 *
 * @param {THREE.WebGLRenderer} renderer
 * @returns {boolean}
 */
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}
