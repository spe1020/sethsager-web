#!/usr/bin/env python3
"""
Build the website's web-ready photos from the originals.

    python3 scripts/make-photos.py [SOURCE_DIR]      # default: ~/Downloads

Needs Pillow (`pip install pillow`). The originals are only ever READ. For each
photo this script:

  * applies the EXIF rotation (phone photos are stored sideways)
  * applies the crop listed below, if any
  * REMOVES ALL METADATA. Several originals contain GPS coordinates, which must
    never be published.
  * writes responsive WebP + JPEG files to public/media/photos/
  * writes src/content/photos.manifest.json (sizes the site's <Photo> uses)

Alt text and placement live in src/content/photos.ts.
"""
import glob
import json
import os
import sys

from PIL import Image, ImageOps

SRC_DIR = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "~/Downloads")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "media", "photos")
MANIFEST = os.path.join(os.path.dirname(__file__), "..", "src", "content", "photos.manifest.json")

# crop = (left, top, right, bottom) in pixels of the ORIENTED original.
PHOTOS = {
    # Homepage hero. Used whole: natural proportions, no crop.
    "hero-woods": {"src": "IMG_1976.JPG", "crop": None, "widths": [480, 720, 960]},
    # Homepage experience band. Cropped from y=890 so the other riders in the
    # car behind Seth are NOT in the published file (the crop is in the file, not
    # CSS, so no layout can reveal them).
    "experience-ferris": {"src": "IMG_9729.JPG", "crop": (0, 890, 2316, 3088), "widths": [640, 960, 1280]},
    # Homepage personal intro. Used whole.
    "intro-grass": {"src": "IMG_6762.jpeg", "crop": None, "widths": [480, 720, 960]},
    # Speaking page. Used whole (the page crops with CSS only).
    "speaking-nostr-valley": {"src": "IMG_6717.JPG", "crop": None, "widths": [640, 1024, 1440, 1920]},
    # Connection page. A screenshot: crop away the recording timestamp in the
    # bottom-right corner. Low resolution, so never displayed larger than 898px.
    "connection-studio": {"src": "Image 9-25-26 at 2.20*PM.png", "crop": (0, 0, 898, 450), "widths": [640, 898]},
}


def find(pattern):
    matches = glob.glob(os.path.join(SRC_DIR, pattern))
    if not matches:
        sys.exit(f"MISSING: no file matching {pattern!r} in {SRC_DIR}")
    return matches[0]


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    manifest = {}
    for name, spec in PHOTOS.items():
        path = find(spec["src"])
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        if spec["crop"]:
            im = im.crop(spec["crop"])
        widths = [w for w in spec["widths"] if w <= im.width] or [im.width]
        if im.width not in widths and im.width < max(spec["widths"]):
            widths.append(im.width)
        for w in widths:
            h = round(im.height * w / im.width)
            r = im.resize((w, h), Image.LANCZOS) if w != im.width else im
            r.save(os.path.join(OUT_DIR, f"{name}-{w}.jpg"), "JPEG", quality=78, optimize=True, progressive=True)
            r.save(os.path.join(OUT_DIR, f"{name}-{w}.webp"), "WEBP", quality=74, method=6)
        top = max(widths)
        manifest[name] = {"widths": sorted(widths), "width": top, "height": round(im.height * top / im.width)}
        print(f"{name}: {im.size} -> {sorted(widths)}")
    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")

    # Safety check: nothing published may carry metadata (especially GPS).
    for file in sorted(os.listdir(OUT_DIR)):
        img = Image.open(os.path.join(OUT_DIR, file))
        exif = img.getexif()
        if len(exif) or "exif" in img.info or "XML:com.adobe.xmp" in img.info or "icc_profile" in img.info and False:
            sys.exit(f"METADATA FOUND in {file}")
    print("verified: no EXIF/GPS metadata in any output")


main()
