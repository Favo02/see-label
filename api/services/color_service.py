import matplotlib.pyplot as plt
import numpy as np


class ColorService:
    """
    A service class to generate and retrieve a specified number of distinct colors.

    Attributes
    ----------
    num_colors : int
        The number of distinct colors to generate.
    colors : list
        A list of generated color values in hexadecimal format.

    Methods
    -------
    generate_colors():
        Generates a list of distinct colors in hexadecimal format.
    rgb_to_hex(rgb):
        Converts an RGB color to hexadecimal format.
    get_color(index):
        Retrieves the color at the specified index.
    """

    def __init__(self, num_colors=80):
        """
        Constructs all the necessary attributes for the ColorService object.

        Parameters
        ----------
        num_colors : int, optional
            The number of distinct colors to generate (default is 80).
        """
        self.num_colors = num_colors
        self.colors = self.generate_colors()

    def generate_colors(self):
        """
        Generates a list of distinct colors using the tab20 colormap from matplotlib.

        Returns
        -------
        list
            A list of color values in hexadecimal format.
        """
        tab20 = plt.get_cmap('tab20').colors
        num_base_colors = len(tab20)
        extended_colors = []

        for i in range(self.num_colors):
            color_idx = (i + 1) % num_base_colors
            variation = (i + 1) // num_base_colors
            base_color = np.array(tab20[color_idx])
            varied_color = (base_color + np.array([variation * 0.1, 0, 0])) % 1.0
            hex_color = self.rgb_to_hex(varied_color)
            extended_colors.append(hex_color)

        return extended_colors

    def rgb_to_hex(self, rgb):
        """
        Converts an RGB color to hexadecimal format.

        Parameters
        ----------
        rgb : array-like
            An array-like object containing three float values representing an RGB color.

        Returns
        -------
        str
            The hexadecimal representation of the RGB color.
        """
        return '#{:02x}{:02x}{:02x}'.format(int(rgb[0] * 255), int(rgb[1] * 255), int(rgb[2] * 255))

    def get_color(self, index):
        """
        Retrieves the color at the specified index.

        Parameters
        ----------
        index : int
            The index of the color to retrieve (0-based).

        Returns
        -------
        str
            The hexadecimal representation of the color.

        Raises
        ------
        ValueError
            If the index is out of the valid range (0 to num_colors-1).
        """
        if index < 0 or index >= self.num_colors:
            raise ValueError("Index out of range. Must be between 0 and {}.".format(self.num_colors - 1))
        return self.colors[index]
