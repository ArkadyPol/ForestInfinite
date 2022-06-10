import * as THREE from 'three'
import { MathUtils } from 'three'
import { randomWithCustomDistribution } from './utils/random'

class Sector {
  x: number
  y: number
  plane!: THREE.Mesh
  sector: THREE.Group
  trees = [] as THREE.Group[]
  grass = [] as THREE.Mesh[]

  constructor(x: number, y: number, scene: THREE.Scene) {
    this.x = x
    this.y = y
    this.sector = new THREE.Group()
    this.sector.position.set(x * Sector.size, y * Sector.size, 0)
    this.addPlane()
    this.addTrees()
    this.addGrass()
    Sector.sectors.push(this)
    scene.add(this.sector)
  }
  addPlane() {
    const planeGeo = new THREE.PlaneGeometry(Sector.size, Sector.size)
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x4e9632 })
    this.plane = new THREE.Mesh(planeGeo, planeMat)
    this.sector.add(this.plane)
  }

  addTrees() {
    const minNumber = Math.floor((Sector.size * Sector.size) / 60)
    const treeNumber = MathUtils.randInt(minNumber, minNumber * 4)

    for (let i = 0; i < treeNumber; i++) {
      const tree = Sector.tree.clone()
      tree.rotateZ(MathUtils.randFloatSpread(Math.PI))
      tree.position.x = MathUtils.randFloatSpread(Sector.size)
      tree.position.y = MathUtils.randFloatSpread(Sector.size)
      const scaleFactor = randomWithCustomDistribution(1, 10, 3, 1.5, 0.5, 9)
      tree.scale.multiplyScalar(scaleFactor)
      tree.position.z *= scaleFactor
      this.trees.push(tree)
      this.sector.add(tree)
    }
  }

  addGrass() {
    const minNumber = Math.floor((Sector.size * Sector.size) / 40)
    const grassNumber = MathUtils.randInt(minNumber, minNumber * 3)
    for (let i = 0; i < grassNumber; i++) {
      const grass = Sector.grass.clone()
      grass.rotateZ(MathUtils.randFloatSpread(Math.PI))
      grass.position.x = MathUtils.randFloatSpread(Sector.size)
      grass.position.y = MathUtils.randFloatSpread(Sector.size)
      const scaleFactor = MathUtils.randFloat(0.8, 2)
      grass.scale.multiplyScalar(scaleFactor)
      grass.position.z *= scaleFactor
      this.grass.push(grass)
      this.sector.add(grass)
    }
  }

  static size: number

  static sectors = [] as Sector[]

  static tree: THREE.Group

  static grass: THREE.Mesh

  static get planes() {
    return this.sectors.map(s => s.plane)
  }

  static isExist(x: number, y: number) {
    const index = this.sectors.findIndex(s => s.x === x && s.y === y)
    return index !== -1
  }

  static create(x: number, y: number, scene: THREE.Scene) {
    if (this.isExist(x, y)) return
    return new this(x, y, scene)
  }
}

export default Sector
