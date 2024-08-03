import matplotlib.pyplot as plt
import numpy as np


class ColorService:
    def __init__(self, num_colors=80):
        self.num_colors = num_colors
        self.colors = self.generate_colors()

    def generate_colors(self):
        tab20 = plt.get_cmap('tab20').colors
        num_base_colors = len(tab20)
        extended_colors = []

        for i in range(self.num_colors):
            color_idx = (i+1) % num_base_colors
            variation = (i+1) // num_base_colors
            base_color = np.array(tab20[color_idx])
            varied_color = (base_color + np.array([variation * 0.1, 0, 0])) % 1.0
            hex_color = self.rgb_to_hex(varied_color)
            extended_colors.append(hex_color)

        return extended_colors

    def rgb_to_hex(self, rgb):
        return '#{:02x}{:02x}{:02x}'.format(int(rgb[0] * 255), int(rgb[1] * 255), int(rgb[2] * 255))

    def get_color(self, index):
        if index < 0 or index > self.num_colors:
            raise ValueError("Index out of range. Must be between 1 and 80.")
        return self.colors[int(index - 1)]
