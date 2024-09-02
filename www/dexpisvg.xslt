<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns="http://www.w3.org/2000/svg"
    xmlns:math="urn:math"
    xmlns:color="urn:color"
>
    <xsl:output method="xml" indent="yes"/>

    <!-- Root template -->
    <xsl:template match="/PlantModel">
        <svg xmlns:svg="http://www.w3.org/2000/svg">
            <xsl:attribute name="width">
                <xsl:value-of select="2000"/>
            </xsl:attribute>
            <xsl:attribute name="viewBox">
                <xsl:text>0 0 </xsl:text>
                <xsl:value-of select="Drawing/Extent/Max/@X"/>
                <xsl:text> </xsl:text>
                <xsl:value-of select="Drawing/Extent/Max/@Y"/>
            </xsl:attribute>
            <xsl:variable name="height" select="Drawing/Extent/Max/@Y"/>
            <g>
                <rect x="0" y="0" fill="#ffffff" stroke="none">
                    <xsl:attribute name="width">
                        <xsl:value-of select="Drawing/Extent/Max/@X"/>
                    </xsl:attribute>
                    <xsl:attribute name="height">
                        <xsl:value-of select="$height"/>
                    </xsl:attribute>
                    </rect>
                <xsl:apply-templates>
                    <xsl:with-param name="height" select="$height" />
                </xsl:apply-templates>
            </g>
        </svg>
    </xsl:template>


    <!-- Matching piping network system -->
    <xsl:template match="PipingNetworkSystem">
        <xsl:param name="height"/>
        <g>
            <xsl:apply-templates>
                <xsl:with-param name="height" select="$height" />
            </xsl:apply-templates>
        </g>
    </xsl:template>


    <!-- Matching piping network system -->
    <xsl:template match="PipingNetworkSegment">
        <xsl:param name="height"/>
        <g>
            <xsl:apply-templates>
                <xsl:with-param name="height" select="$height" />
            </xsl:apply-templates>
        </g>
    </xsl:template>



    <!-- Matching piping lines -->
    <xsl:template match="CenterLine">
        <xsl:param name="height"/>
        <path fill="none" stroke-linecap="round" stroke-linejoin="round">
            <xsl:attribute name="d">
                <xsl:text>M </xsl:text>
                <xsl:for-each select="Coordinate">
                    <xsl:value-of select="@X"/>
                    <xsl:text> </xsl:text>
                    <xsl:value-of select="$height - @Y"/>
                    <xsl:if test="position() != last()">
                        <xsl:text> L </xsl:text>
                    </xsl:if>
                </xsl:for-each>
            </xsl:attribute>
            <xsl:attribute name="stroke">
                <xsl:value-of select="color:RgbToHex(Presentation/@R, Presentation/@G, Presentation/@B)"/>
            </xsl:attribute>
            <xsl:attribute name="stroke-width">
                <xsl:value-of select="Presentation/@LineWeight"/>
            </xsl:attribute>
        </path>
    </xsl:template>

    

  <!-- Template to calculate svg transform from proteus Position 
   For example, input       
   <Position>
        <Location X="144" Y="164" Z="0"/>
        <Axis X="0" Y="0" Z="1"/>
        <Reference X="1" Y="0" Z="0"/>
    </Position> 
    should become transform="translate(144, 75.323817) rotate(0)" -->
  <xsl:template name="Position">
    <xsl:param name="height"/>
    <xsl:param name="PositionNode"/>
    <xsl:param name="ScaleNode"/>
    
    <xsl:variable name="x" select="$PositionNode/Location/@X"/>
    <xsl:variable name="y" select="$PositionNode/Location/@Y"/>
    <xsl:variable name="axisX" select="$PositionNode/Axis/@X"/>
    <xsl:variable name="axisY" select="$PositionNode/Axis/@Y"/>
    <xsl:variable name="axisZ" select="$PositionNode/Axis/@Z"/>
    <xsl:variable name="refX" select="$PositionNode/Reference/@X"/>
    <xsl:variable name="refY" select="$PositionNode/Reference/@Y"/>
    <xsl:variable name="refZ" select="$PositionNode/Reference/@Z"/>
    
    <!-- Calculate the angle using the custom extension function -->
    <xsl:variable name="angle" select="math:CalculateAngle($axisX, $axisY, $axisZ, $refX, $refY, $refZ)"/>

    <!-- Output the SVG rotate and translate commands --> 
    <xsl:attribute name="transform">
        <xsl:if test="$angle != 0">
            <xsl:text>rotate(</xsl:text>
            <xsl:value-of select="$angle"/>
            <xsl:text>, </xsl:text>
            <xsl:value-of select="$x"/>
            <xsl:text>, </xsl:text>
            <xsl:value-of select="$height - $y"/>
            <xsl:text>) </xsl:text>
        </xsl:if>
        <xsl:text>translate(</xsl:text>
        <xsl:value-of select="$x"/>
        <xsl:text>, </xsl:text>
        <xsl:value-of select="$height - $y"/>
        <xsl:text>) </xsl:text>
        <xsl:if test="$ScaleNode">
            <xsl:text> scale</xsl:text>
            <xsl:value-of select="concat('(',$ScaleNode/@X  , ', ' ,  $ScaleNode/@Y , ')')" />
        </xsl:if>
      </xsl:attribute>
  </xsl:template>

    <!-- Template for labels-->
    <xsl:template match="Label">
        <xsl:param name="height"/>
        <xsl:variable name="id" select="../@ID"/>
        <a href="{concat('https://assetid.equinor.com/plantx#', $id)}">
        <text>
            <xsl:variable name="angleFromPosition">
                <xsl:choose>
                    <xsl:when test="Text/Position">
                        <xsl:variable name="axisX" select="Text/Position/Axis/@X"/>
                        <xsl:variable name="axisY" select="Text/Position/Axis/@Y"/>
                        <xsl:variable name="axisZ" select="Text/Position/Axis/@Z"/>
                        <xsl:variable name="refX" select="Text/Position/Reference/@X"/>
                        <xsl:variable name="refY" select="Text/Position/Reference/@Y"/>
                        <xsl:variable name="refZ" select="Text/Position/Reference/@Z"/>
                        <xsl:value-of select="math:CalculateAngle($axisX, $axisY, $axisZ, $refX, $refY, $refZ)"/>
                    </xsl:when>         
                    <xsl:otherwise>
                        <xsl:value-of select="0"/>
                    </xsl:otherwise>
                </xsl:choose>    
            </xsl:variable>
            <xsl:variable name="angle">
                <xsl:choose>
                    <xsl:when test="Text/@TextAngle">  
                        <xsl:value-of select="Text/@TextAngle + $angleFromPosition"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="$angleFromPosition"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:variable>
            <xsl:variable name="textlength" select = "string-length(Text/@String)"/>
            <xsl:attribute name="x">
                <xsl:value-of select="Text/Position/Location/@X"/>
            </xsl:attribute>
            <xsl:variable name="y" select = "$height - Text/Position/Location/@Y + Text/@Height div 2"/>
            <xsl:attribute name="y">
                <xsl:value-of select="$y"/>
            </xsl:attribute>
            <xsl:attribute name="font-size">
                <xsl:value-of select="concat(Text/@Height, 'px')"/>
            </xsl:attribute>
            <xsl:attribute name="fill">
                <xsl:text>#000000</xsl:text>
            </xsl:attribute>
            <xsl:attribute name="font-family">
                <xsl:value-of select="Text/@Font"/>
            </xsl:attribute>
            <xsl:attribute name="text-anchor">
                    <xsl:text>middle</xsl:text>
            </xsl:attribute>
            <xsl:attribute name="transform">
                <xsl:if test="$angle != 0">
                    <xsl:text>rotate(</xsl:text>
                    <xsl:value-of select="360 - $angle"/>
                    <xsl:text>, </xsl:text>
                    <xsl:value-of select="Text/Position/Location/@X"/>
                    <xsl:text>, </xsl:text>
                    <xsl:value-of select="$y"/>
                    <xsl:text>) </xsl:text>
                </xsl:if>
            </xsl:attribute>
            <xsl:value-of select="Text/@String"/>
        </text>
        </a>
    </xsl:template>
   
    <!-- Template for Equipment, Nozzle,  stuff-->
     <xsl:template match="*">
        <xsl:param name="height"/>
        <xsl:variable name="id" select="@ID"/>
        <xsl:if test="@ComponentName">
            <use>
                <xsl:attribute name="href">
                    <xsl:value-of select="concat('#', @ComponentName)"/>
                </xsl:attribute>
                <xsl:call-template name="Position">
                    <xsl:with-param name="height" select="$height"/>
                    <xsl:with-param name="PositionNode" select="Position"/>
                    <xsl:with-param name="ScaleNode" select="Scale"/>
                </xsl:call-template>
            </use>
        </xsl:if>
        <xsl:apply-templates>
            <xsl:with-param name="height" select="$height" />
        </xsl:apply-templates>
    </xsl:template> 

    <!-- Shape catalogue-->
    <xsl:template match="ShapeCatalogue">
        <defs>
            <xsl:for-each select="*">
                <symbol overflow="visible">
                    <xsl:attribute name="id">
                        <xsl:value-of select="@ComponentName"/>
                    </xsl:attribute>
                    <xsl:apply-templates/>
                </symbol>
            </xsl:for-each>
        </defs>
    </xsl:template>


    <!-- Template for curves-->
     <xsl:template match="TrimmedCurve">
        <xsl:variable name="radius" select="Circle/@Radius" />
        <xsl:variable name="endAngleRadians" select="@EndAngle * 0.0174532925"/> 
        <xsl:variable name="startAngleRadians" select="@StartAngle * 0.0174532925"/> 
        <xsl:variable name="deltax" select="Circle/Position/Location/@X"/>
        <xsl:variable name="deltay" select="Circle/Position/Location/@Y"/>
        <path fill="none" stroke-linecap="round" stroke-linejoin="round">
            <xsl:attribute name="stroke">
                <xsl:value-of select="color:RgbToHex(Circle/Presentation/@R, Circle/Presentation/@G, Circle/Presentation/@B)"/>
            </xsl:attribute>
            <xsl:attribute name="stroke-width">
                <xsl:value-of select="Circle/Presentation/@LineWeight"/>
            </xsl:attribute>
            <xsl:attribute name="d">
                <xsl:text>M </xsl:text>
                <xsl:value-of select="$radius * math:Cos($endAngleRadians) + $deltax"/>
                <xsl:text> </xsl:text>
                <xsl:value-of select="$radius * math:Sin($endAngleRadians) + $deltay"/>
                <xsl:text> A </xsl:text>
                <xsl:value-of select="$radius"/>
                <xsl:text> </xsl:text>
                <xsl:value-of select="$radius"/>
                <xsl:text> 0 0 0 </xsl:text>
                <xsl:value-of select="$radius * math:Cos($startAngleRadians) + $deltax"/>
                <xsl:text> </xsl:text>
                <xsl:value-of select="$radius * math:Sin($startAngleRadians) + $deltay"/>
            </xsl:attribute>
        </path>

     </xsl:template>

     <!-- Template for Circle elements -->
     <xsl:template match="Circle">
        <circle fill="none" vector-effect="non-scaling-stroke" >
            <xsl:attribute name="stroke">
                <xsl:value-of select="color:RgbToHex(Presentation/@R, Presentation/@G, Presentation/@B)"/>
            </xsl:attribute>
            <xsl:attribute name="r">
                <xsl:value-of select="@Radius"/>
            </xsl:attribute>
            <xsl:attribute name="cx">
                <xsl:value-of select="Position/Location/@X"/>
            </xsl:attribute>
            <xsl:attribute name="cy">
                <xsl:value-of select="Position/Location/@Y"/>
            </xsl:attribute>
            <xsl:attribute name="stroke-width">
                <xsl:value-of select="Presentation/@LineWeight"/>
            </xsl:attribute>
        </circle>
    </xsl:template>

   

    <!-- Template for PolyLine elements -->
    <xsl:template match="PolyLine">
        <path fill="none" stroke-linecap="round" stroke-linejoin="round">
            <xsl:attribute name="stroke-width">
                <xsl:value-of select="Presentation/@LineWeight"/>
            </xsl:attribute>
            <xsl:attribute name="stroke">
                <xsl:value-of select="color:RgbToHex(Presentation/@R, Presentation/@G, Presentation/@B)"/>
            </xsl:attribute>
            <xsl:attribute name="d">
                <xsl:text>M </xsl:text>
                <xsl:for-each select="Coordinate">
                    <xsl:value-of select="@X"/>
                    <xsl:text> </xsl:text>
                    <xsl:value-of select="-@Y"/>
                    <xsl:if test="position() != last()">
                        <xsl:text> L </xsl:text>
                    </xsl:if>
                </xsl:for-each>
            </xsl:attribute>
            <xsl:attribute name="stroke-width">
                <xsl:value-of select="Presentation/@LineWeight"/>
            </xsl:attribute>
        </path>
    </xsl:template>
</xsl:stylesheet>