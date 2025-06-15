/**
 * Convierte una imagen en formato DataURL (base64) a un objeto Blob.
 * 
 * Esta función es útil para convertir imágenes pegadas desde el portapapeles 
 * o generadas por un canvas a un formato que pueda subirse como archivo.
 * 
 * @param dataUrl Cadena base64 del contenido (e.g. imagen).
 * @param callback Función que recibe el Blob resultante.
 */
export function dataURLtoBlob(dataUrl: string, callback: (blob: Blob) => void) {
    var req = new XMLHttpRequest;

    req.open('GET', dataUrl);
    req.responseType = 'arraybuffer'; // No se puede usar 'blob' directamente por https://crbug.com/412752

    req.onload = function fileLoaded(e) {
        // Si necesitas que el blob tenga el tipo MIME correcto
        var mime = this.getResponseHeader('content-type');
        callback(new Blob([this.response], { type: mime || undefined }));
    };

    req.send();
}
