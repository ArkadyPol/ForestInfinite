import * as THREE from 'three'

class Sector {
  x: number
  y: number
  plane!: THREE.Mesh
  sector: THREE.Object3D

  constructor(x: number, y: number, scene: THREE.Scene) {
    this.x = x
    this.y = y
    this.sector = new THREE.Object3D()
    this.sector.position.set(x * Sector.size, y * Sector.size, 0)
    this.addPlane()
    this.sector.add(this.plane)
    Sector.sectors.push(this)
    scene.add(this.sector)
  }

  addPlane() {
    const planeGeo = new THREE.PlaneGeometry(Sector.size, Sector.size)
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x4e9632 })
    this.plane = new THREE.Mesh(planeGeo, planeMat)
  }

  static size: number

  static sectors = [] as Sector[]

  static get planes() {
    return this.sectors.map(s => s.plane)
  }
}

export default Sector
