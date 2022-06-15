import * as THREE from 'three'
import { MathUtils, Scene, Vector3 } from 'three'
import GameEvent from './GameEvent'
import { createChunks, randomWithCustomDistribution } from './utils/random'

class Sector {
  x: number
  y: number
  plane!: THREE.Mesh
  sector: THREE.Group
  trees = [] as THREE.Group[]
  grass = [] as THREE.Mesh[]
  house?: THREE.Group
  boundingBoxes = [] as THREE.Box3[]
  active = true

  constructor(x: number, y: number, scene: THREE.Scene, house?: THREE.Group) {
    this.x = x
    this.y = y
    this.sector = new THREE.Group()
    this.sector.position.set(x * Sector.size, y * Sector.size, 0)
    this.addPlane()
    if (house) {
      const bbox = new THREE.Box3().setFromObject(house)
      this.boundingBoxes.push(bbox)
      this.house = house
      this.sector.add(house)
    }
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
    const [chunks, sum] = createChunks(3, 1.5, 0.5, 11)
    for (let i = 0; i < treeNumber; i++) {
      const tree = Sector.tree.clone()
      tree.rotateZ(MathUtils.randFloatSpread(Math.PI))
      tree.position.x = MathUtils.randFloatSpread(Sector.size)
      tree.position.y = MathUtils.randFloatSpread(Sector.size)
      const scaleFactor = randomWithCustomDistribution(1, 12, chunks, sum)
      tree.scale.multiplyScalar(scaleFactor)
      tree.position.z *= scaleFactor
      const bbox = new THREE.Box3().setFromObject(tree)
      let isIntersects = false
      for (let box of this.boundingBoxes) {
        if (bbox.intersectsBox(box)) {
          i--
          isIntersects = true
          break
        }
      }
      if (isIntersects) continue
      this.boundingBoxes.push(bbox)
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

  static current: Sector

  static parent: Scene

  static get planes() {
    return this.active.map(s => s.plane)
  }

  static get active() {
    return this.sectors.filter(s => s.active)
  }

  static isExist(x: number, y: number) {
    const index = this.sectors.findIndex(s => s.x === x && s.y === y)
    return index !== -1
  }

  static isActive(x: number, y: number) {
    const sector = this.sectors.find(s => s.x === x && s.y === y)
    if (!sector) return false
    return sector.active
  }

  static create(x: number, y: number, scene: THREE.Scene) {
    if (this.isExist(x, y)) return
    return new this(x, y, scene)
  }

  static setActive(x: number, y: number) {
    const sector = this.sectors.find(s => s.x === x && s.y === y)
    if (!sector) {
      this.create(x, y, this.parent)
      return
    }
    sector.active = true
    this.parent.add(sector.sector)
  }

  static setCurrent(x: number, y: number) {
    const sector = this.sectors.find(s => s.x === x && s.y === y)
    if (!sector) return
    this.current = sector
  }

  static checkBorder(position: Vector3) {
    const local = new THREE.Vector3().copy(position)
    this.current.plane.worldToLocal(local)
    const border = this.size * 0.4
    const xDiff = Math.abs(local.x) - border
    const yDiff = Math.abs(local.y) - border
    const event = {
      type: 'crossBorder',
      currentTarget: this.current,
      x: 0,
      y: 0,
    }
    if (xDiff >= 0) {
      event.x = this.current.x + Math.sign(local.x)
      event.y = this.current.y
      if (!this.isActive(event.x, event.y)) {
        GameEvent.event.dispatchEvent(event)
      }
    }

    if (yDiff >= 0) {
      event.x = this.current.x
      event.y = this.current.y + Math.sign(local.y)
      if (!this.isActive(event.x, event.y)) {
        GameEvent.event.dispatchEvent(event)
      }
    }

    if (xDiff >= 0 && yDiff >= 0) {
      event.x = this.current.x + Math.sign(local.x)
      event.y = this.current.y + Math.sign(local.y)
      if (!this.isActive(event.x, event.y)) {
        GameEvent.event.dispatchEvent(event)
      }
    }

    event.type = 'sectorLeave'

    if (xDiff > this.size * 0.1 && yDiff > this.size * 0.1) {
      event.x = this.current.x + Math.sign(local.x)
      event.y = this.current.y + Math.sign(local.y)
      GameEvent.event.dispatchEvent(event)
    } else if (xDiff > this.size * 0.1) {
      event.x = this.current.x + Math.sign(local.x)
      event.y = this.current.y
      GameEvent.event.dispatchEvent(event)
    } else if (yDiff > this.size * 0.1) {
      event.x = this.current.x
      event.y = this.current.y + Math.sign(local.y)
      GameEvent.event.dispatchEvent(event)
    }
  }

  static onSectorLeave(x: number, y: number) {
    this.setCurrent(x, y)
    for (let sector of this.active) {
      const xDiff = Math.abs(sector.x - this.current.x)
      const yDiff = Math.abs(sector.y - this.current.y)
      if (xDiff > 1 || yDiff > 1) {
        sector.active = false
        this.parent.remove(sector.sector)
      }
    }
  }
}

export default Sector
