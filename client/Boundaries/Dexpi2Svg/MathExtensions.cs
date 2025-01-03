using System;
using System.Diagnostics;

public class MathExtensions
{
    public double Cos(double angle)
    {
        return Math.Cos(angle);
    }

    public double Sin(double angle)
    {
        return Math.Sin(angle);
    }
    public double Sqrt(double value)
    {
        return Math.Sqrt(value);
    }

    public double Pow(double x, double y)
    {
        return Math.Pow(x, y);
    }

    public double Acos(double value)
    {
        return Math.Acos(value);
    }

    public double pi()
    {
        return Math.PI;
    }
    /// <summary>
    /// See page 14 of Proteus P&Id file specification 3.3.3
    ///  
    /// </summary>
    /// <param name="axisX"></param>
    /// <param name="axisY"></param>
    /// <param name="axisZ"></param>
    /// <param name="refX"></param>
    /// <param name="refY"></param>
    /// <param name="refZ"></param>
    /// <returns></returns>
    public double CalculateAngle(double axisX, double axisY, double axisZ, double refX, double refY, double refZ)
    {
        var axisLength = Math.Sqrt(axisX * axisX + axisY * axisY + axisZ * axisZ);
        if (axisLength == 0)
        {
            throw new NotImplementedException("axisX, axisY and axisZ must not be all zero");
        }

        var rotDirection = Math.Sign(axisZ);
        double refAxisLength = Math.Sqrt(refX * refX + refY * refY + refZ * refZ);
        if (refAxisLength == 0)
        {
            throw new NotImplementedException("refX, refY and refZ must not be all zero");
        }

        var cosTheta = refX / refAxisLength;
        var sinTheta = refY / refAxisLength;
        var thetaFromCos = Math.Acos(cosTheta);
        var thetaFromSin = Math.Asin(sinTheta);
        var theta = thetaFromCos;
        if (sinTheta < 0)
        {
            if (cosTheta < 0)
            {
                theta = -thetaFromCos;
            }
            else
            {
                theta = thetaFromSin;
            }
        }
        return -rotDirection * theta * 180 / Math.PI;

    }
}