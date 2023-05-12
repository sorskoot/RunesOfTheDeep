using UnityEngine;

public static class MathExtensions
{
    public static float RoundToHalf(this float number)
    {
        float result = Mathf.RoundToInt(number * 2) / 2f;
        return result;
    }
}
