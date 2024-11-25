from .pixtral_large_node import ComfyUIPixtralLarge, MultiImagesInput, preview_text

NODE_CLASS_MAPPINGS = {
    "ComfyUIPixtralLarge": ComfyUIPixtralLarge,
    "MultiImagesInput": MultiImagesInput,
    "preview_text": preview_text,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ComfyUIPixtralLarge": "Pixtral Large",
    "MultiImagesInput": "Multi Images Input",
    "preview_text": "Preview Text",
}

WEB_DIRECTORY = "web"

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS']