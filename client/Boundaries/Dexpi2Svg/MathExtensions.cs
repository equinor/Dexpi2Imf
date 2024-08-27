using System;

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
            if (axisX != 0 || axisY != 0 || ! (axisZ == 1 || axisZ == -1) || refZ != 0)
            {
                throw new NotImplementedException("Only axisZ = 1 or axisZ = -1 is supported");                
            }
            switch ((refX, refY))
            {
                case (0, 1):
                    return axisZ * 90;
                case (1, 0):
                    return 0;
                case (0, -1):
                    return axisZ * -90;
                case (-1, 0):
                    return 180;
                default:
                    throw new NotImplementedException($"Combination of refX={refX} and refY={refY} is not supported");
            }
        }
}