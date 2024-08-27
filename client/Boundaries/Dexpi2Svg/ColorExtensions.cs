using System;
using System.Globalization;

public class ColorExtensions
{
    public string RgbToHex(double r, double g, double b)
    {
        int red = (int)(r * 255);
        int green = (int)(g * 255);
        int blue = (int)(b * 255);
        return $"#{red:X2}{green:X2}{blue:X2}";
    }
}