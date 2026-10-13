import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import * as THREE from 'three'

export function OceanPearlScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
      canvas.dataset.fallback = 'true'
      return
    }

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch {
      canvas.dataset.fallback = 'true'
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 20)
    camera.position.z = 5
    const group = new THREE.Group()
    scene.add(group)
    const pearl = new THREE.Mesh(
      new THREE.SphereGeometry(0.82, 40, 28),
      new THREE.MeshPhysicalMaterial({ color: 0xeaf7f5, roughness: 0.12, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08 }),
    )
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.24, 0.085, 12, 96),
      new THREE.MeshPhysicalMaterial({ color: 0x80b7bf, roughness: 0.32, metalness: 0.28, clearcoat: 0.8 }),
    )
    innerRing.rotation.set(0.35, 0.65, -0.25)
    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.66, 0.018, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0xd9f3f4, transparent: true, opacity: 0.72 }),
    )
    outerRing.rotation.set(0.5, -0.35, 0.38)
    group.add(pearl, innerRing, outerRing)
    scene.add(new THREE.HemisphereLight(0xffffff, 0x316d81, 2.8))
    const key = new THREE.DirectionalLight(0xffffff, 3)
    key.position.set(-2, 3, 4)
    scene.add(key)
    const fill = new THREE.PointLight(0x67c9db, 2.2, 8)
    fill.position.set(2, -1, 3)
    scene.add(fill)

    const resize = () => {
      const width = canvas.clientWidth || 280
      const height = canvas.clientHeight || 280
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    observer?.observe(canvas)
    resize()
    let frame = 0
    let active = true
    const animate = (time: number) => {
      if (!active) return
      group.rotation.y = reducedMotion ? 0 : Math.sin(time * 0.00035) * 0.28
      group.rotation.z = reducedMotion ? 0 : Math.sin(time * 0.00023) * 0.06
      renderer.render(scene, camera)
      if (!reducedMotion && !document.hidden) frame = requestAnimationFrame(animate)
    }
    const onVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden) frame = requestAnimationFrame(animate)
    }
    document.addEventListener('visibilitychange', onVisibility)
    animate(0)
    return () => {
      active = false
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibility)
      observer?.disconnect()
      for (const mesh of [pearl, innerRing, outerRing]) {
        mesh.geometry.dispose()
        mesh.material.dispose()
      }
      renderer.dispose()
    }
  }, [reducedMotion])

  return <div className="ocean-pearl-scene" aria-hidden="true"><canvas ref={canvasRef} /><span className="ocean-pearl-fallback" /></div>
}
