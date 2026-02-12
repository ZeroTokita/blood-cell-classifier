import numpy as np
from PIL import Image

IMG_SIZE = 128  # cambia si usaste otro tamaño

def preprocess_image(image_bytes):
    image = Image.open(image_bytes).convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE))

    image = np.array(image) / 255.0  # normalización
    image = np.expand_dims(image, axis=0)

    return image
