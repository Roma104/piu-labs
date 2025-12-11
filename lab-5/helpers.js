/**
 Generuje losowy kolor w formacie HSL.
 @returns {string} Losowy kolor HSL.
 */
export function randomColor() {
    const hue = Math.floor(Math.random() * 360);
    const lightness = Math.floor(Math.random() * 20) + 50;
    return `hsl(${hue}, 70%, ${lightness}%)`;
}

/**
 Generuje unikalny ID.
 @returns {string} Unikalny identyfikator.
 */
export function generateUniqueId() {
    return `shape-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .substring(2, 5)}`;
}
