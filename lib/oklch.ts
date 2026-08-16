const EPS = 216 / 24389
const KAPPA = 24389 / 27
const WHITE_D50 = { x: 0.96422, y: 1.0, z: 0.82521 }
const BRADFORD = [
  [0.9555766, -0.0230393, 0.0631636],
  [-0.0282895, 1.0099416, 0.0210077],
  [0.0122982, -0.020483, 1.3299098],
]
const XYZ_TO_LINEAR_RGB = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.969266, 1.8760108, 0.041556],
  [0.0556434, -0.2040259, 1.0572252],
]

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}

function srgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function linearToSrgb(v: number) {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
}

function oklchToSrgb(L: number, C: number, H: number): [number, number, number] {
  const a = C * Math.cos(H)
  const b = C * Math.sin(H)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

function labToSrgb(L: number, a: number, b: number): [number, number, number] {
  const fy = (L + 16) / 116
  const fx = fy + a / 500
  const fz = fy - b / 200

  const xr = fx ** 3 > EPS ? fx ** 3 : (116 * fx - 16) / KAPPA
  const yr = L > KAPPA * EPS ? fy ** 3 : L / KAPPA
  const zr = fz ** 3 > EPS ? fz ** 3 : (116 * fz - 16) / KAPPA

  const X50 = xr * WHITE_D50.x
  const Y50 = yr * WHITE_D50.y
  const Z50 = zr * WHITE_D50.z

  const X = BRADFORD[0][0] * X50 + BRADFORD[0][1] * Y50 + BRADFORD[0][2] * Z50
  const Y = BRADFORD[1][0] * X50 + BRADFORD[1][1] * Y50 + BRADFORD[1][2] * Z50
  const Z = BRADFORD[2][0] * X50 + BRADFORD[2][1] * Y50 + BRADFORD[2][2] * Z50

  const r = XYZ_TO_LINEAR_RGB[0][0] * X + XYZ_TO_LINEAR_RGB[0][1] * Y + XYZ_TO_LINEAR_RGB[0][2] * Z
  const g = XYZ_TO_LINEAR_RGB[1][0] * X + XYZ_TO_LINEAR_RGB[1][1] * Y + XYZ_TO_LINEAR_RGB[1][2] * Z
  const b2 = XYZ_TO_LINEAR_RGB[2][0] * X + XYZ_TO_LINEAR_RGB[2][1] * Y + XYZ_TO_LINEAR_RGB[2][2] * Z

  return [linearToSrgb(r), linearToSrgb(g), linearToSrgb(b2)]
}

export function cssColorToHex(color: string): string | null {
  const c = color.trim().toLowerCase()
  if (!c) return null

  // hex
  const hex = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/)
  if (hex) {
    if (hex[1].length === 3) {
      return `#${hex[1].split("").map((x) => x + x).join("")}`
    }
    return `#${hex[1].slice(0, 6)}`
  }

  // rgb / rgba
  const rgb = c.match(/^rgba?\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+%?)\s*)?\)$/)
  if (rgb) {
    const toByte = (v: string) => (v.endsWith("%") ? (parseFloat(v) / 100) * 255 : parseFloat(v))
    return srgbToHex(toByte(rgb[1]), toByte(rgb[2]), toByte(rgb[3]))
  }

  // lab / lab(% % %)
  const lab = c.match(/^lab\(\s*([\d.]+)%?\s+([-+\d.]+)\s+([-+\d.]+)\s*\)$/)
  if (lab) {
    const [r, g, b] = labToSrgb(parseFloat(lab[1]), parseFloat(lab[2]), parseFloat(lab[3]))
    return srgbToHex(r, g, b)
  }

  // lch
  const lch = c.match(/^lch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)$/)
  if (lch) {
    const a = parseFloat(lch[2]) * Math.cos((parseFloat(lch[3]) * Math.PI) / 180)
    const b = parseFloat(lch[2]) * Math.sin((parseFloat(lch[3]) * Math.PI) / 180)
    const [r, g, b2] = labToSrgb(parseFloat(lch[1]), a, b)
    return srgbToHex(r, g, b2)
  }

  // oklab
  const oklab = c.match(/^oklab\(\s*([\d.]+)%?\s+([-+\d.]+)\s+([-+\d.]+)\s*\)$/)
  if (oklab) {
    const a = parseFloat(oklab[2])
    const b = parseFloat(oklab[3])
    const C = Math.sqrt(a * a + b * b)
    const H = Math.atan2(b, a)
    const [r, g, b2] = oklchToSrgb(parseFloat(oklab[1]), C, H)
    return srgbToHex(r, g, b2)
  }

  // oklch
  const oklch = c.match(/^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)$/)
  if (oklch) {
    const [r, g, b] = oklchToSrgb(parseFloat(oklch[1]), parseFloat(oklch[2]), (parseFloat(oklch[3]) * Math.PI) / 180)
    return srgbToHex(r, g, b)
  }

  return null
}

export function oklchToHex(oklch: string): string {
  return cssColorToHex(oklch) ?? "#888888"
}

let probe: HTMLSpanElement | null = null

function getProbe(): HTMLSpanElement {
  if (!probe) {
    probe = document.createElement("span")
    probe.style.display = "none"
    document.body.appendChild(probe)
  }
  return probe
}

export function themeColor(name: string): string {
  if (typeof window === "undefined") return "#888888"
  const probeEl = getProbe()
  probeEl.style.color = `var(${name})`
  const resolved = getComputedStyle(probeEl).color
  return cssColorToHex(resolved) ?? "#888888"
}
