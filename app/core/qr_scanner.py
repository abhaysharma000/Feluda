import cv2
import numpy as np
from pyzbar.pyzbar import decode


class QRScanner:
    """Decodes QR codes from raw image bytes using OpenCV + pyzbar."""

    def scan_image(self, image_bytes: bytes) -> list | dict:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return {"error": "Could not decode image. Ensure it is a valid PNG/JPG file."}

        decoded_objects = decode(img)

        if not decoded_objects:
            return {"error": "No QR code found in the provided image."}

        results = []
        for obj in decoded_objects:
            results.append({
                "type": obj.type,
                "data": obj.data.decode('utf-8', errors='replace'),
                "rect": obj.rect._asdict(),
            })

        return results


qr_scanner = QRScanner()
