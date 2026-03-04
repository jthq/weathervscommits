import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function Chart3D({ data }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !data) return

    // Setup Three.js scene
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0e1b)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(50, 50, 50)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Create axes
    const axesHelper = new THREE.AxesHelper(50)
    scene.add(axesHelper)

    // Calculate average commits per day
    const avgCommits = data.dates.map((date, idx) => {
      const studentKeys = Object.keys(data.students)
      const sum = studentKeys.reduce((acc, key) => acc + data.students[key][idx], 0)
      return sum / studentKeys.length
    })

    // Normalize data for visualization
    const maxTemp = Math.max(...data.temperature)
    const minTemp = Math.min(...data.temperature)
    const maxSnowfall = Math.max(...data.snowfall)
    const maxCommits = Math.max(...avgCommits)

    // Create points
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []

    data.dates.forEach((date, idx) => {
      const x = ((data.temperature[idx] - minTemp) / (maxTemp - minTemp)) * 50 - 25
      const y = (avgCommits[idx] / maxCommits) * 50
      const z = (data.snowfall[idx] / maxSnowfall) * 50 - 25

      positions.push(x, y, z)

      // Color based on commits (green-red gradient)
      const ratio = avgCommits[idx] / maxCommits
      colors.push(1 - ratio, ratio, 0.3)
    })

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Create line
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.3 })
    const line = new THREE.Line(lineGeometry, lineMaterial)
    scene.add(line)

    // Create grid planes
    const gridHelper = new THREE.GridHelper(50, 10, 0x00ff88, 0x004400)
    gridHelper.position.y = 0
    scene.add(gridHelper)

    // Add labels for axes
    const createTextSprite = (text, position, color) => {
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 64
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = color
      ctx.font = 'bold 40px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(text, 128, 40)

      const texture = new THREE.CanvasTexture(canvas)
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
      const geometry = new THREE.PlaneGeometry(10, 2.5)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.copy(position)
      mesh.position.z += 5
      return mesh
    }

    scene.add(createTextSprite('Temperature (°C)', new THREE.Vector3(0, -15, 0), '#00ff88'))
    scene.add(createTextSprite('Avg Commits', new THREE.Vector3(-30, 0, -30), '#00ff88'))
    scene.add(createTextSprite('Snowfall (mm)', new THREE.Vector3(0, -15, 0), '#00ff88'))

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x00ff88, 0.8)
    directionalLight.position.set(50, 50, 50)
    scene.add(directionalLight)

    // Mouse controls
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    const onMouseDown = (e) => {
      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e) => {
      if (!isDragging) return

      const deltaX = e.clientX - previousMousePosition.x
      const deltaY = e.clientY - previousMousePosition.y

      points.rotation.y += deltaX * 0.005
      points.rotation.x += deltaY * 0.005
      line.rotation.y += deltaX * 0.005
      line.rotation.x += deltaY * 0.005

      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    const onWheel = (e) => {
      e.preventDefault()
      camera.position.z += e.deltaY * 0.1
    }

    renderer.domElement.addEventListener('mousedown', onMouseDown)
    renderer.domElement.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('mouseup', onMouseUp)
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false })

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Auto-rotate slightly
      points.rotation.y += 0.0002
      line.rotation.y += 0.0002

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width
      const newHeight = containerRef.current?.clientHeight || height
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('mouseup', onMouseUp)
      renderer.domElement.removeEventListener('wheel', onWheel)
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      lineGeometry.dispose()
      material.dispose()
      lineMaterial.dispose()
      renderer.dispose()
    }
  }, [data])

  return (
    <div className="chart-section">
      <h2>3D Correlation Analysis</h2>
      <div ref={containerRef} className="chart-container" style={{ width: '100%', height: '100%', minHeight: '500px' }} />
      <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#00cc66' }}>
        Drag to rotate • Scroll to zoom • X: Temperature | Y: Average Commits | Z: Snowfall
      </p>
    </div>
  )
}

export default Chart3D
