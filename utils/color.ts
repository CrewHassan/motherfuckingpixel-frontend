export function hexToRgb(hex: string): number[] {
    const components = hex.match(/[A-Za-z0-9]{2}/g);
    
    if (!components) return [0,0,0];

    return components.map((item) => parseInt(item, 16));
}

export function rgbToHex(rgb: number[]) {
    const a = rgb.map((item: number) => item.toString(16)).join("");

    return `#${a}`;
}
