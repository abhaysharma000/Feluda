"""
QR Code Scanner — graceful import of pyzbar + Pillow.
pyzbar requires libzbar (C library). On Vercel Lambda this is unavailable,
so we degrade gracefully instead of crashing the entire app.
"""
try:
    from pyzbar import pyzbar as _pyzbar
    from PIL import Image
    import io
    PYZBAR_AVAILABLE = True
except (ImportError, Exception):
    PYZBAR_AVAILABLE = False


class QRScanner:

    def scan_image(self, image_bytes: bytes) -> list | dict:
        """
        Decode all QR codes in a raw image byte string.
        Returns a list of dicts with 'data' and 'type',
        or a dict with 'error' key on failure or unavailability.
        """
        if not PYZBAR_AVAILABLE:
            return {
                "error": "QR scanning is unavailable in this environment "
                         "(libzbar system library not installed). "
                         "Use the local desktop version to scan QR codes."
            }

        try:
            img = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            return {"error": f"Failed to decode image: {str(e)}"}

        try:
            decoded_objects = _pyzbar.decode(img)
        except Exception as e:
            return {"error": f"QR scan engine error: {str(e)}"}

        if not decoded_objects:
            return {"error": "No QR code found in the uploaded image."}

        results = []
        for obj in decoded_objects:
            try:
                data = obj.data.decode("utf-8")
            except UnicodeDecodeError:
                data = obj.data.decode("latin-1", errors="replace")
            results.append({
                "data": data,
                "type": obj.type,
            })

        return results


qr_scanner = QRScanner()
