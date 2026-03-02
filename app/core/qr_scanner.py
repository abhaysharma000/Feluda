"""
QR Code Scanner — uses pyzbar + Pillow (replaces heavy OpenCV dependency).
Pillow is ~5 MB vs opencv-python-headless which is ~200 MB.
"""
from pyzbar import pyzbar
from PIL import Image
import io


class QRScanner:

    def scan_image(self, image_bytes: bytes) -> list | dict:
        """
        Decode all QR codes in a raw image byte string.
        Returns a list of dicts with 'data' and 'type',
        or a dict with 'error' key on failure.
        """
        try:
            img = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            return {"error": f"Failed to decode image: {str(e)}"}

        try:
            decoded_objects = pyzbar.decode(img)
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
