<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:svg="http://www.w3.org/2000/svg">
    <xsl:output method="xml" indent="yes"/>

    <!-- Root template -->
    <xsl:template match="/PlantModel">
        <svg:svg xmlns:svg="http://www.w3.org/2000/svg">
            <xsl:attribute name="width">
                <xsl:value-of select="Drawing/Extent/Max/@X"/>
            </xsl:attribute>
            <xsl:attribute name="height">
                <xsl:value-of select="Drawing/Extent/Max/@Y"/>
            </xsl:attribute>
            <xsl:variable name="height" select="Drawing/Extent/Max/@Y"/>
            <svg:g>
                <svg:rect x="0" y="0" fill="#ffffff" stroke="none">
                    <xsl:attribute name="width">
                        <xsl:value-of select="Drawing/Extent/Max/@X"/>
                    </xsl:attribute>
                    <xsl:attribute name="height">
                        <xsl:value-of select="$height"/>
                    </xsl:attribute>
                    </svg:rect>
                <xsl:apply-templates>
                    <xsl:with-param name="height" select="$height" />
                </xsl:apply-templates>
            </svg:g>
        </svg:svg>
    </xsl:template>

    <!-- Template for labels-->
    <xsl:template match="Label">
        <xsl:param name="height"/>
        <svg:text>
            <xsl:variable name="angle" select="Text/@TextAngle"/>
            <xsl:variable name="textlength" select = "string-length(Text/@String)"/>
            
            <xsl:attribute name="x">
                <xsl:value-of select="Text/Position/Location/@X - $textlength"/>
            </xsl:attribute>
            <xsl:attribute name="y">
                <xsl:value-of select="$height - Text/Position/Location/@Y"/>
            </xsl:attribute>
            <xsl:attribute name="font-size">
                <xsl:value-of select="Text/@Height"/>
            </xsl:attribute>
            <xsl:attribute name="fill">
                <xsl:value-of select="concat('rgb(', @R*255, ',', @G*255, ',', @B*255, ')')"/>
            </xsl:attribute>
            <xsl:attribute name="font-family">
                <xsl:value-of select="Text/@Font"/>
            </xsl:attribute>
            <xsl:attribute name="text-anchor">
                <xsl:if test="Text/@Justification = 'CenterCenter'">
                    <xsl:value-of select="middle"/>
                </xsl:if>
            </xsl:attribute>
            <xsl:attribute name="transform">
                <xsl:value-of select="concat('rotate(', Text/@TextAngle, ' ', Text/Position/Location/@X, ' ', $height - Text/Position/Location/@Y, ')')"/>
            </xsl:attribute>
            <xsl:value-of select="Text/@String"/>
        </svg:text>
        
    </xsl:template>
   
    <!-- Template for Nozzle-->
     <!-- <xsl:template match="Nozzle">
        <xsl:param name="height"/>
        <svg:use>
            <xsl:attribute name="href">
                <xsl:value-of select="concat('#', @ComponentName)"/>
            </xsl:attribute>
            <xsl:attribute name="transform">
                <xsl:text>translate</xsl:text>
                <xsl:value-of select="concat('(',Position/Location/@X , ',' , $height - Position/Location/@Y , ')')" />
                <xsl:text> scale</xsl:text>
                <xsl:value-of select="concat('(',Scale/@X , ',' , Scale/@Y , ')')" />
            </xsl:attribute>
        </svg:use>
    </xsl:template>  -->



    <!-- Shape catalogue-->
    <xsl:template match="ShapeCatalogue">
        <svg:defs>
            <xsl:for-each select="*">
                <svg:symbol overflow="visible">
                    <xsl:attribute name="id">
                        <xsl:value-of select="@ComponentName"/>
                    </xsl:attribute>
                    <xsl:apply-templates/>
                </svg:symbol>
            </xsl:for-each>
        </svg:defs>
    </xsl:template>


     <!-- Template for Circle elements -->
     <xsl:template match="Circle">
        <svg:circle>
            <xsl:attribute name="r">
                <xsl:value-of select="@Radius"/>
            </xsl:attribute>
            <xsl:attribute name="cx">
                <xsl:value-of select="Position/Location/@X"/>
            </xsl:attribute>
            <xsl:attribute name="cy">
                <xsl:value-of select="Position/Location/@Y"/>
            </xsl:attribute>
            <xsl:attribute name="fill">
                <xsl:value-of select="concat('rgb(', @R*255, ',', @G*255, ',', @B*255, ')')"/>
            </xsl:attribute>
        </svg:circle>
    </xsl:template>

   

    <!-- Template for PolyLine elements -->
    <xsl:template match="PolyLine">
        <svg:path fill="none" stroke="#808000" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5">
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
        </svg:path>
    </xsl:template>
</xsl:stylesheet>