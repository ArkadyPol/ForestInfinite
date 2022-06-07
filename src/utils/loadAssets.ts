import { AnimationClip, Group, LoadingManager } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function loadAssets(urls: UrlsType) {
  const manager = new LoadingManager()
  const gltfLoader = new GLTFLoader(manager)
  const models = {} as ModelsType
  const animations = {} as AnimationsType

  for (let [name, url] of Object.entries(urls)) {
    gltfLoader.load(url, gltf => {
      models[name] = gltf.scene
      for (let clip of gltf.animations) {
        animations[clip.name] = clip
      }
    })
  }
  return { models, animations, manager }
}

export default loadAssets

type UrlsType = {
  [key: string]: string
}
export type AnimationsType = {
  [key: string]: AnimationClip
}
export type ModelsType = {
  [key: string]: Group
}
