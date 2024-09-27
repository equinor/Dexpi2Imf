<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns:math="urn:math"
    xmlns:color="urn:color"
>
    <xsl:output method="xml" indent="yes" />

    <!-- Root template -->
    <xsl:template match="/PlantModel">
        <svg xmlns:svg="http://www.w3.org/2000/svg">
            <xsl:attribute name="width">
                <xsl:value-of select="2000" />
            </xsl:attribute>
            <xsl:attribute name="viewBox">
                <xsl:text>0 0 </xsl:text>
                <xsl:value-of select="Drawing/Extent/Max/@X" />
                <xsl:text> </xsl:text>
                <xsl:value-of
                    select="Drawing/Extent/Max/@Y" />
            </xsl:attribute>
            <xsl:variable name="height" select="Drawing/Extent/Max/@Y" />
            <g>
                <rect x="0" y="0" fill="#ffffff" stroke="none">
                    <xsl:attribute name="width">
                        <xsl:value-of select="Drawing/Extent/Max/@X" />
                    </xsl:attribute>
                    <xsl:attribute name="height">
                        <xsl:value-of select="$height" />
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
        <xsl:param name="height" />
        <g>
            <xsl:apply-templates>
                <xsl:with-param name="height" select="$height" />
            </xsl:apply-templates>
        </g>
    </xsl:template>


    <!-- Matching piping network system -->
    <xsl:template match="PipingNetworkSegment">
        <xsl:param name="height" />
        <g>
            <xsl:apply-templates>
                <xsl:with-param name="height" select="$height" />
            </xsl:apply-templates>
        </g>
    </xsl:template>


    <!-- Matching piping lines -->
    <xsl:template match="CenterLine">
        <xsl:param name="height" />
        <path fill="none" stroke-linecap="round" stroke-linejoin="round">
            <xsl:attribute name="d">
                <xsl:text>M </xsl:text>
                <xsl:for-each select="Coordinate">
                    <xsl:value-of select="@X" />
                    <xsl:text> </xsl:text>
                    <xsl:value-of
                        select="$height - @Y" />
                    <xsl:if test="position() != last()">
                        <xsl:text> L </xsl:text>
                    </xsl:if>
                </xsl:for-each>
            </xsl:attribute>
            <xsl:attribute name="stroke">
                <xsl:text>#000000</xsl:text>
            </xsl:attribute>
            <xsl:attribute name="stroke-width">
                <xsl:value-of select="Presentation/@LineWeight" />
            </xsl:attribute>
        </path>
    </xsl:template>

    <xsl:template name="Position">
        <xsl:param name="height" />
    <xsl:param name="PositionNode" />
    <xsl:param name="ScaleNode" />
    
    <xsl:variable
            name="x" select="$PositionNode/Location/@X" />
    <xsl:variable name="y"
            select="$PositionNode/Location/@Y" />
    <xsl:variable name="axisX"
            select="$PositionNode/Axis/@X" />
    <xsl:variable name="axisY"
            select="$PositionNode/Axis/@Y" />
    <xsl:variable name="axisZ"
            select="$PositionNode/Axis/@Z" />
    <xsl:variable name="refX"
            select="$PositionNode/Reference/@X" />
    <xsl:variable name="refY"
            select="$PositionNode/Reference/@Y" />
    <xsl:variable name="refZ"
            select="$PositionNode/Reference/@Z" />

        <!-- Calculate the angle using the custom extension function -->
    <xsl:variable name="angle"
            select="math:CalculateAngle($axisX, $axisY, $axisZ, $refX, $refY, $refZ)" />

        <!-- Output the SVG rotate and translate commands --> 
    <xsl:attribute
            name="transform">
            <xsl:if test="$angle != 0">
                <xsl:text>rotate(</xsl:text>
            <xsl:value-of select="$angle" />
            <xsl:text>, </xsl:text>
            <xsl:value-of
                    select="$x" />
            <xsl:text>, </xsl:text>
            <xsl:value-of select="$height - $y" />
            <xsl:text>) </xsl:text>
            </xsl:if>
        <xsl:text>translate(</xsl:text>
        <xsl:value-of
                select="$x" />
        <xsl:text>, </xsl:text>
        <xsl:value-of select="$height - $y" />
        <xsl:text>) </xsl:text>
        <xsl:if
                test="$ScaleNode">
                <xsl:text> scale</xsl:text>
            <xsl:value-of
                    select="concat('(',$ScaleNode/@X  , ', ' ,  $ScaleNode/@Y , ')')" />
            </xsl:if>
        </xsl:attribute>
    </xsl:template>


    <!-- Template for labels -->
    <xsl:template match="Label">
        <xsl:param name="height" />

        <xsl:variable name="IDX" select="../@ID" />
    <xsl:variable
            name="displayText"
            select="following-sibling::GenericAttributes/GenericAttribute[@Name='ObjectDisplayNameAssignmentClass' or @Name='LineDescriptionAssignmentClass']/@Value" />
    <xsl:if
            test="$displayText">
            <a id="{concat('https://assetid.equinor.com/plantx#', $IDX)}" class="node">
                <text>
                    <xsl:attribute name="x">
                        <xsl:value-of select="Position/Location/@X | Text/Position/Location/@X" />
                    </xsl:attribute>
                    <xsl:attribute name="y">
                        <xsl:value-of
                            select="$height - (Position/Location/@Y | Text/Position/Location/@Y)" />
                    </xsl:attribute>
                    <xsl:attribute name="font-size">3.3px</xsl:attribute>
                    <xsl:attribute name="font-family">Arial</xsl:attribute>
                    <xsl:attribute name="text-anchor">middle</xsl:attribute>
                    <xsl:attribute name="transform">
                        <xsl:variable name="refX"
                            select="Position/Reference/@X | Text/Position/Reference/@X" />
                    <xsl:variable
                            name="refY" select="Position/Reference/@Y | Text/Position/Reference/@Y" />
                        <!-- Assuming that a Reference of (1,0,0) means horizontal text, calculate
                        the rotation angle -->

                        <xsl:variable
                            name="posX" select="Position/Location/@X | Text/Position/Location/@X" />
    <xsl:variable
                            name="posY" select="Position/Location/@Y | Text/Position/Location/@Y" />
                    <xsl:variable
                            name="textRotationAngle">
                            <xsl:choose>
                                <xsl:when test="$refX = 0 and $refY = 1">270</xsl:when>
                                <xsl:when test="$refX = 1 and $refY = 0">0</xsl:when>
                                <xsl:otherwise>0</xsl:otherwise> <!-- Default rotation angle if not
                                horizontal or vertical -->
                            </xsl:choose>
                        </xsl:variable>
                    <xsl:value-of
                            select="concat('rotate(', $textRotationAngle, ' ', $posX, ' ', $height - $posY, ')')" />
                    </xsl:attribute>
                    <xsl:value-of select="$displayText" />
                </text>
            </a>
        </xsl:if>
    </xsl:template>

    <!-- Template for Equipment, Nozzle,  stuff-->
    <xsl:template match="*">
        <xsl:param name="height" />
        <xsl:variable name="id" select="../@ID" />
        <xsl:if
            test="@ComponentName">
            <use>
                <xsl:attribute name="href">
                    <xsl:value-of select="concat('#', @ComponentName)" />
                </xsl:attribute>
                <xsl:call-template name="Position">
                    <xsl:with-param name="height" select="$height" />
                    <xsl:with-param name="PositionNode" select="Position" />
                    <xsl:with-param name="ScaleNode" select="Scale" />
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
                <xsl:variable name="parentName" select="name()" />
                <xsl:variable
                    name="currentComponentName" select="@ComponentName" />
                <symbol overflow="visible">
                    <xsl:attribute name="id">
                        <xsl:value-of select="@ComponentName" />
                    </xsl:attribute>
                    <xsl:attribute name="shapeName">
                        <xsl:value-of select="GenericAttributes/GenericAttribute/@Value" />
                    </xsl:attribute>
                    <xsl:attribute name="path">
                        <xsl:value-of
                            select="concat('../../../../NOAKADEXPI/Symbols/Origo/',GenericAttributes/GenericAttribute/@Value,'_Origo.svg')" />
                    </xsl:attribute>

                    <xsl:variable name="matchedElement"
                        select="//*[name() = $parentName and @ComponentName = $currentComponentName]" />
                    <xsl:variable name="displayNameValue">
                        <xsl:choose>
                            <!-- First try to select the 'Value' attribute of the 'GenericAttribute'
                            with the specific 'Name' -->
                            <xsl:when
                                test="$matchedElement/GenericAttributes/GenericAttribute[@Name='ObjectDisplayNameAssignmentClass']/@Value">
                                <xsl:value-of
                                    select="$matchedElement/GenericAttributes/GenericAttribute[@Name='ObjectDisplayNameAssignmentClass']/@Value" />
                            </xsl:when>
                            <!-- Selects the text for the offpageconnectors -->
                            <xsl:when
                                test="$matchedElement/*/GenericAttributes/GenericAttribute[@Name='ReferencedDrawingNumberAssignmentClass']/@Value">
                                <xsl:value-of
                                    select="$matchedElement/*/GenericAttributes/GenericAttribute[@Name='ReferencedDrawingNumberAssignmentClass']/@Value" />
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of
                                    select="$matchedElement/GenericAttributes/GenericAttribute[@Name='TagTypeAssignmentClass']/@Value" />
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>

                    <xsl:variable name="IDXX" select="$matchedElement/@ID" />
                    <xsl:variable name="attributeValue"
                        select="GenericAttributes/GenericAttribute/@Value" />
                    <xsl:variable name="docPath"
                        select="concat('../../../../NOAKADEXPI/Symbols/Origo/', $attributeValue, '_Origo.svg')" />

                    <xsl:variable name="label"
                        select="GenericAttributes/GenericAttribute[@Name='ObjectDisplayNameAssignmentClass']/@Value" />

                    <xsl:if
                        test="not($docPath = '../../../../NOAKADEXPI/Symbols/Origo/BORDER_A1_Origo.svg')">

                        <xsl:variable name="doc" select="document($docPath)" />
						<xsl:apply-templates
                            select="$doc//svg:g/*">
                            <xsl:with-param name="testParam" select="$displayNameValue" />
                            <xsl:with-param name="idx" select="$IDXX" />
                        </xsl:apply-templates>
                    </xsl:if>
                    <xsl:apply-templates />
                </symbol>
            </xsl:for-each>
        </defs>
    </xsl:template>

    <xsl:template match="svg:text[@font-family='Helvetica'][1]">
        <xsl:param name="testParam" />
        <xsl:param name="idx" />
        <xsl:if
            test="string-length($testParam) > 0 and not(contains($idx, 'Nozzle'))">
            <a id="{concat('https://assetid.equinor.com/plantx#', $idx)}" class="node">
                <text>
                    <!-- Copy all attributes from the original text element, except for font-size
                    and fill -->
                    <xsl:apply-templates
                        select="@*[local-name() != 'font-size' and local-name() != 'fill']" />
                    <xsl:attribute name="font-size">25px</xsl:attribute>
                    <xsl:attribute name="fill">#000000</xsl:attribute>
                    <xsl:value-of select="$testParam" />
                </text>
            </a>
        </xsl:if>
    </xsl:template>

    <!-- Template to remove elements with a red or green stroke, excluding text elements -->
    <xsl:template match="*[not(self::text)][@stroke='#ff0000' or @stroke='#00ff00']" />

    <!-- Template to remove elements with a red or green fill, excluding text elements -->
    <xsl:template match="*[not(self::text)][@fill='#ff0000' or @fill='#00ff00']" />

    <!-- Generic template to copy all other elements as they are -->
    <xsl:template match="svg:*">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()" />
        </xsl:copy>
    </xsl:template>

    <!-- Generic template to copy attributes as they are -->
    <xsl:template match="@*">
        <xsl:copy />
    </xsl:template>

</xsl:stylesheet>