export const generateUUID = (): string => {
    // Use crypto.randomUUID if available (modern browsers/Node)
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
        return (crypto as any).randomUUID();
    }
    // Fallback: generate UUID v4 using getRandomValues
    const getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues
        ? crypto.getRandomValues.bind(crypto)
        : undefined;
    if (getRandomValues) {
        const bytes = new Uint8Array(16);
        getRandomValues(bytes);
        // Set version (4) and variant (RFC 4122)
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
    // Very simple fallback (not truly unique)
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
