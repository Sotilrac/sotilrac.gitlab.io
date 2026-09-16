"""Interactive ROI picker and crop-window geometry, shared by the tools here.

Kept out of the scripts themselves because track.py, crop.py and trackgif.py all
need the same answer to "what rectangle does this drawn box actually produce".
"""

import cv2

KEY_HELP = "drag: box   a: aspect   r: reset   enter: confirm   esc: cancel"


def snap_to_aspect(box, frame_w, frame_h, lock=True):
    """Size the crop window from the drawn box, clamped to the frame.

    With lock set the window grows to the source aspect ratio, so the output is
    a crop of the shot rather than a differently shaped one. Works in whatever
    coordinate space it is given, which is how the picker previews it.
    """
    x, y, w, h = (float(v) for v in box)
    cx, cy = x + w / 2, y + h / 2

    if lock:
        aspect = frame_w / frame_h
        if w / h < aspect:
            w = h * aspect
        else:
            h = w / aspect

    scale = min(frame_w / w, frame_h / h, 1.0)
    w, h = w * scale, h * scale

    w = max(2, int(round(w / 2)) * 2)
    h = max(2, int(round(h / 2)) * 2)
    return w, h, cx, cy


def _rect(a, b):
    x, y = min(a[0], b[0]), min(a[1], b[1])
    return x, y, abs(b[0] - a[0]), abs(b[1] - a[1])


def _caption(img, text):
    h = img.shape[0]
    cv2.rectangle(img, (0, h - 26), (img.shape[1], h), (0, 0, 0), -1)
    cv2.putText(img, text, (8, h - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                (255, 255, 255), 1, cv2.LINE_AA)


def pick_roi(frame, aspect_lock):
    """Draw the ROI by hand, with a live preview of the crop it produces.

    Not cv2.selectROI: that runs its own event loop and returns only the
    rectangle you dragged, so it can neither show the aspect-locked window nor
    take a key to toggle it. Returns (box in source pixels, lock state), or
    (None, lock) if cancelled.
    """
    fh, fw = frame.shape[:2]
    scale = min(1.0, 1280 / fw)
    preview = cv2.resize(frame, None, fx=scale, fy=scale) if scale < 1 else frame.copy()
    ph, pw = preview.shape[:2]
    win = "roi"
    state = {"start": None, "box": None, "dragging": False}

    def on_mouse(event, x, y, flags, _):
        x, y = max(0, min(x, pw - 1)), max(0, min(y, ph - 1))
        if event == cv2.EVENT_LBUTTONDOWN:
            state.update(start=(x, y), box=None, dragging=True)
        elif state["dragging"] and event in (cv2.EVENT_MOUSEMOVE, cv2.EVENT_LBUTTONUP):
            state["box"] = _rect(state["start"], (x, y))
            state["dragging"] = event != cv2.EVENT_LBUTTONUP

    cv2.namedWindow(win, cv2.WINDOW_AUTOSIZE)
    cv2.setMouseCallback(win, on_mouse)
    mapped = False
    try:
        while True:
            canvas = preview.copy()
            box = state["box"]
            drawn = box and box[2] > 1 and box[3] > 1
            if drawn:
                x, y, w, h = box
                cv2.rectangle(canvas, (x, y), (x + w, y + h), (0, 255, 0), 1)
                cw, ch, cx, cy = snap_to_aspect(box, pw, ph, aspect_lock)
                cx = int(round(min(max(cx - cw / 2, 0), pw - cw)))
                cy = int(round(min(max(cy - ch / 2, 0), ph - ch)))
                cv2.rectangle(canvas, (cx, cy), (cx + cw, cy + ch), (0, 220, 255), 2)
            shape = "source" if aspect_lock else "free"
            _caption(canvas, f"{KEY_HELP}   [aspect: {shape}]")
            cv2.imshow(win, canvas)

            key = cv2.waitKey(20) & 0xFF
            if key in (13, 32) and drawn:
                break
            # The window reports itself invisible until the compositor maps it,
            # so it only counts as closed after it has been seen open.
            visible = cv2.getWindowProperty(win, cv2.WND_PROP_VISIBLE) >= 1
            mapped = mapped or visible
            if key in (27, ord("q")) or (mapped and not visible):
                return None, aspect_lock
            if key == ord("a"):
                aspect_lock = not aspect_lock
            elif key == ord("r"):
                state["box"] = None
    finally:
        cv2.destroyAllWindows()
        cv2.waitKey(1)

    return tuple(v / scale for v in state["box"]), aspect_lock
