<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:svg="http://www.w3.org/2000/svg"
                xmlns:math="urn:math">

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
    
    <!-- Matching piping lines -->
    <xsl:template match="CenterLine">
        <xsl:param name="height" />
        <path fill="none" stroke-linecap="round" stroke-linejoin="round"
              class="piping">
            <xsl:variable name="connectorId">
                <xsl:choose>
                    <xsl:when
                        test="../Connection/@ToID and not (following-sibling::PipingComponent or following-sibling::PropertyBreak)">
                        <xsl:value-of
                            select="concat(../Connection/@ToID,'-node', ../Connection/@ToNode)" />
                    </xsl:when>
                    <xsl:when test="preceding-sibling::PipingComponent">
                        <xsl:value-of
                            select="concat(preceding-sibling::PipingComponent[1]/@ID, '-node2')" />
                    </xsl:when>
                    <xsl:when test="../Connection/@FromID">
                        <xsl:value-of
                            select="concat(../Connection/@FromID,'-node', ../Connection/@FromNode)" />
                    </xsl:when>
                    <xsl:when test="../Connection/@ToID">
                        <xsl:value-of
                            select="concat(../Connection/@ToID,'-node', ../Connection/@ToNode)" />
                    </xsl:when>
                </xsl:choose>
            </xsl:variable>
            <xsl:attribute name="id">
                <xsl:value-of
                    select="concat('https://assetid.equinor.com/plantx#', $connectorId, '-connector')" />
            </xsl:attribute>
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
                <xsl:text>0.25</xsl:text>
            </xsl:attribute>
            <xsl:choose>
                <xsl:when test="parent::InformationFlow">
                    <xsl:attribute name="stroke-dasharray">
                        <xsl:text>1,4</xsl:text>
                    </xsl:attribute>
                </xsl:when>
                <xsl:when test="parent::PipingComponent"> </xsl:when>
            </xsl:choose>
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
        
        <!-- Calculate the angle using the custom extension function TODO: Find out if can be removed -->
<!--        <xsl:variable name="angle"-->
<!--            select="math:CalculateAngle($axisX, $axisY, $axisZ, $refX, $refY, $refZ)" />-->
        
        <!-- Calculate the angle using some assumptions, probably wrong
        See Proteus "P&ID Profile file specification 3.3.3, page 14 -->
        <xsl:variable name="refangle">
            <xsl:choose>
                <xsl:when test="$refX = 0 and $refY = 1 and $refZ = 0">270</xsl:when>
                <xsl:when test="$refX = 1 and $refY = 0 and $refZ = 0">0</xsl:when>
                <xsl:when test="$refX = -1 and $refY = 0 and $refZ = 0">180</xsl:when>
                <xsl:when test="$refX = 0 and $refY = -1 and $refZ = 0">90</xsl:when>
                <xsl:otherwise>
                    <xsl:message terminate="yes">This combination of reference values is not handled:
                        X: <xsl:value-of select="$refX" />
                        Y: <xsl:value-of select="$refY" />
                        Z: <xsl:value-of select="$refZ" />
                    </xsl:message>
                </xsl:otherwise> 
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="angle">
            <xsl:choose>
                <xsl:when test="$axisX = 0 and $axisY= 0 and $axisZ = 1"><xsl:value-of select="$refangle" />
                </xsl:when>
                <xsl:when test="$axisX = 0 and $axisY= 0 and $axisZ = -1"><xsl:value-of select="- $refangle" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:message terminate="yes">This combination of reference values is not handled:
                        <xsl:value-of select="$axisX" />
                        <xsl:value-of select="$axisY" />
                        <xsl:value-of select="$axisZ" />
                    </xsl:message>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        
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
    
    <!-- Template for PipingNetworkSystem -->
    <xsl:template match="PipingNetworkSystem/Label">
        <xsl:param name="height" />
        
        <xsl:variable name="IDValue" select="../@ID" />
        <xsl:variable
            name="displayText"
            select="following-sibling::GenericAttributes/GenericAttribute[@Name='ObjectDisplayNameAssignmentClass' or @Name='LineDescriptionAssignmentClass']/@Value" />
        <xsl:if
            test="$displayText">
            <a id="{concat('https://assetid.equinor.com/plantx#', $IDValue)}" class="node">
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
    
    <!-- Template for * shapes except lines -->
    <xsl:template match="*">
        <xsl:param name="height" />
        <xsl:variable name="id" select="@ID" />
        <xsl:variable name="componentName" select="@ComponentName" />
        <xsl:variable name="componentClass" select="@ComponentClass" />
        <xsl:variable name="shapeId" select="concat($id, '-', $componentName)"/>
        <xsl:variable name="label">
            <xsl:choose>
                <xsl:when
                    test="GenericAttributes/GenericAttribute[@Name='ObjectDisplayNameAssignmentClass']/@Value">
                    <xsl:value-of
                        select="GenericAttributes/GenericAttribute[@Name='ObjectDisplayNameAssignmentClass']/@Value" />
                </xsl:when>
                <xsl:when
                    test="PipeOffPageConnectorReference/GenericAttributes/GenericAttribute[@Name='ReferencedDrawingNumberAssignmentClass']/@Value">
                    <xsl:value-of
                        select="PipeOffPageConnectorReference/GenericAttributes/GenericAttribute[@Name='ReferencedDrawingNumberAssignmentClass']/@Value" />
                </xsl:when>
                <xsl:when
                    test="SignalOffPageConnectorReference/GenericAttributes/GenericAttribute[@Name='ReferencedDrawingNumberAssignmentClass']/@Value">
                    <xsl:value-of
                        select="SignalOffPageConnectorReference/GenericAttributes/GenericAttribute[@Name='ReferencedDrawingNumberAssignmentClass']/@Value" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of
                        select="GenericAttributes/GenericAttribute[@Name='ItemTagAssignmentClass']/@Value" />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        
        <!-- Label index A, B, C, D and E for IM005B symbol. In the future, this will be generated for all symbols from the symbol excel file-->
        <xsl:variable name="labelA">
            <xsl:choose>
                <xsl:when test="$componentName = 'IM005B_SHAPE'">
                    <xsl:value-of select="concat(../../../../PlantStructureItem/GenericAttributes/GenericAttribute[@Name='ProcessPlantIdentificationCodeAssignmentClass']/@Value, '-', ../../../../PlantStructureItem/GenericAttributes/GenericAttribute[@Name='PlantSystemIdentificationCodeAssignmentClass']/@Value)" />
                </xsl:when>
                <xsl:otherwise/>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="labelB">
            <xsl:choose>
                <xsl:when test="$componentName = 'IM005B_SHAPE'">
                    <xsl:value-of select="../GenericAttributes/GenericAttribute[@Name='TagTypeAssignmentClass']/@Value" />
                </xsl:when>
                <xsl:otherwise/>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="labelC">
            <xsl:choose>
                <xsl:when test="$componentName = 'IM005B_SHAPE'">
                    <xsl:value-of select="concat(../GenericAttributes/GenericAttribute[@Name='SequenceAssignmentClass']/@Value, ../GenericAttributes/GenericAttribute[@Name='TagSuffixAssignmentClass']/@Value)" />
                </xsl:when>
                <xsl:otherwise/>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="labelD">
            <xsl:choose>
                <xsl:when test="$componentName = 'IM005B_SHAPE'">
                    <xsl:value-of select="../GenericAttributes/GenericAttribute[@Name='TypicalReferenceAssignmentClass']/@Value" />
                </xsl:when>
                <xsl:otherwise/>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="labelE">
            <xsl:choose>
                <xsl:when test="$componentName = 'IM005B_SHAPE'">
                    <xsl:value-of select="../GenericAttributes/GenericAttribute[@Name='SetPoint']/@Value" />
                </xsl:when>
                <xsl:otherwise/>
            </xsl:choose>
        </xsl:variable>
        
        <xsl:variable
            name="shapeValue"
            select="//ShapeCatalogue/*[@ComponentName=$componentName]/GenericAttributes/GenericAttribute/@Value" />
        <xsl:variable
            name="path"
            select="concat('../../NOAKADEXPI/Symbols/Origo/', $shapeValue, '_Origo.svg')" />
        <xsl:if
            test="not($path = '../../NOAKADEXPI/Symbols/Origo/BORDER_A1_Origo.svg')">
            <xsl:if test="$shapeValue">
                <a id="{concat('https://assetid.equinor.com/plantx#', $id)}" class="node">
                    <g>
                        <xsl:attribute name="id">
                            <xsl:value-of select="$shapeId" />
                        </xsl:attribute>
                        <xsl:attribute name="shapeName">
                            <xsl:value-of select="$shapeValue" />
                        </xsl:attribute>
                        <xsl:attribute name="path">
                            <xsl:value-of select="$path" />
                        </xsl:attribute>
                        
                        <xsl:call-template name="Position">
                            <xsl:with-param name="height" select="$height" />
                            <xsl:with-param name="PositionNode" select="Position" />
                        </xsl:call-template>
                        
                        <xsl:variable name="doc" select="document($path)" />
                        <xsl:apply-templates
                            select="$doc//svg:g">
                            <xsl:with-param name="labelParam" select="$label" />
                            <xsl:with-param name="id" select="$id" />
                            <xsl:with-param name="componentClass" select="$componentClass"/>
                            <xsl:with-param name="componentName" select="$componentName"/>
                            <xsl:with-param name="labelParamA" select="$labelA" />
                            <xsl:with-param name="labelParamB" select="$labelB" />
                            <xsl:with-param name="labelParamC" select="$labelC" />
                            <xsl:with-param name="labelParamD" select="$labelD" />
                            <xsl:with-param name="labelParamE" select="$labelE" />
                        </xsl:apply-templates>
                    </g> 
                </a>
            </xsl:if>
            <xsl:apply-templates>
                <xsl:with-param name="height" select="$height" />
            </xsl:apply-templates>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="svg:*">
        <xsl:param name="labelParam" />
        <xsl:param name="id" />
        <xsl:param name="componentClass"/>
        <xsl:param name="componentName"/>
        <xsl:param name="labelParamA" />
        <xsl:param name="labelParamB" />
        <xsl:param name="labelParamC" />
        <xsl:param name="labelParamD" />
        <xsl:param name="labelParamE" />
        <xsl:copy>
            <xsl:apply-templates select="@*|node()">
                <xsl:with-param name="labelParam" select="$labelParam" />
                <xsl:with-param name="id" select="$id" />
                <xsl:with-param name="componentClass" select="$componentClass" />
                <xsl:with-param name="componentName" select="$componentName"/>
                <xsl:with-param name="labelParamA" select="$labelParamA" />
                <xsl:with-param name="labelParamB" select="$labelParamB" />
                <xsl:with-param name="labelParamC" select="$labelParamC" />
                <xsl:with-param name="labelParamD" select="$labelParamD" />
                <xsl:with-param name="labelParamE" select="$labelParamE" />
            </xsl:apply-templates>
        </xsl:copy>
    </xsl:template>
    
    <!-- Shape catalogue, is kept empty so that no other template matches on shapecatalogue.-->
    <xsl:template match="ShapeCatalogue">
    </xsl:template>
    
    <xsl:template match="svg:text">
        <xsl:param name="labelParam"/>
        <xsl:param name="idValue" />
        <xsl:param name="componentClass" />
        <xsl:param name="componentName" />
        <xsl:param name="labelParamA"/>
        <xsl:param name="labelParamB"/>
        <xsl:param name="labelParamC"/>
        <xsl:param name="labelParamD"/>
        <xsl:param name="labelParamE"/>
        <xsl:choose>
            <xsl:when test="$componentName = 'IM005B_SHAPE'">
                <xsl:apply-templates select="." mode="im005bShape">
                    <xsl:with-param name="labelParamA" select="$labelParamA" />
                    <xsl:with-param name="labelParamB" select="$labelParamB" />
                    <xsl:with-param name="labelParamC" select="$labelParamC" />
                    <xsl:with-param name="labelParamD" select="$labelParamD" />
                    <xsl:with-param name="labelParamE" select="$labelParamE" />
                    <xsl:with-param name="idValue" select="$idValue" />
                    <xsl:with-param name="componentClass" select="$componentClass" />
                    <xsl:with-param name="componentName" select="$componentName" />
                </xsl:apply-templates>
            </xsl:when>
            <xsl:otherwise>
                <xsl:apply-templates select="." mode="default">
                    <xsl:with-param name="labelParam" select="$labelParam" />
                    <xsl:with-param name="idValue" select="$idValue" />
                    <xsl:with-param name="componentClass" select="$componentClass" />
                    <xsl:with-param name="componentName" select="$componentName" />
                </xsl:apply-templates>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="svg:text[not(preceding::svg:text)]" mode="default">
        <xsl:param name="labelParam"/>
        <xsl:param name="componentClass" />
        <xsl:param name="componentName" />
        <xsl:call-template name="svgText">
            <xsl:with-param name="labelParam" select="$labelParam" />
            <xsl:with-param name="componentClass" select="$componentClass" />
            <xsl:with-param name="componentName" select="$componentName" />
        </xsl:call-template>
    </xsl:template>
    
    <xsl:template match="svg:text[../../@data-LabelIndex='A']" mode="im005bShape">
        <xsl:param name="labelParamA"/>
        <xsl:param name="componentClass" />
        <xsl:param name="componentName" />
        <xsl:call-template name="svgText">
            <xsl:with-param name="labelParam" select="$labelParamA" />
            <xsl:with-param name="componentClass" select="$componentClass" />
            <xsl:with-param name="componentName" select="$componentName" />
        </xsl:call-template>
    </xsl:template>
    
    <xsl:template match="svg:text[../../@data-LabelIndex='B']" mode="im005bShape">
        <xsl:param name="labelParamB"/>
        <xsl:param name="componentClass" />
        <xsl:param name="componentName" />
        <xsl:call-template name="svgText">
            <xsl:with-param name="labelParam" select="$labelParamB" />
            <xsl:with-param name="componentClass" select="$componentClass" />
            <xsl:with-param name="componentName" select="$componentName" />
        </xsl:call-template>
    </xsl:template>
    
    <xsl:template match="svg:text[../../@data-LabelIndex='C']" mode="im005bShape">
        <xsl:param name="labelParamC"/>
        <xsl:param name="componentClass" />
        <xsl:param name="componentName" />
        <xsl:call-template name="svgText">
            <xsl:with-param name="labelParam" select="$labelParamC" />
            <xsl:with-param name="componentClass" select="$componentClass" />
            <xsl:with-param name="componentName" select="$componentName" />
        </xsl:call-template>
    </xsl:template>
    
    <xsl:template match="svg:text[../../@data-LabelIndex='D']" mode="im005bShape">
        <xsl:param name="labelParamD"/>
        <xsl:param name="componentClass" />
        <xsl:param name="componentName" />
        <xsl:call-template name="svgText">
            <xsl:with-param name="labelParam" select="$labelParamD" />
            <xsl:with-param name="componentClass" select="$componentClass" />
            <xsl:with-param name="componentName" select="$componentName" />
        </xsl:call-template>
    </xsl:template>
    
    <xsl:template match="svg:text[../../@data-LabelIndex='E']" mode="im005bShape">
        <xsl:param name="labelParamE"/>
        <xsl:param name="componentClass" />
        <xsl:param name="componentName" />
        <xsl:call-template name="svgText">
            <xsl:with-param name="labelParam" select="$labelParamE" />
            <xsl:with-param name="componentClass" select="$componentClass" />
            <xsl:with-param name="componentName" select="$componentName" />
        </xsl:call-template>
    </xsl:template>
    
    <xsl:template name="svgText">
        <xsl:param name="labelParam" />
        <xsl:param name="componentClass" />
        <xsl:param name="componentName" />
        <xsl:if test="string-length($labelParam) > 0 and not(contains($componentClass, 'Nozzle'))">
            <text fill="#000000" font-family="Helvetica" font-size="45px" y="{@y+15}" transform="{@transform}">
                <xsl:attribute name="x">
                    <xsl:choose>
                        <xsl:when test="$componentName = 'IM005B_SHAPE'">
                            <xsl:value-of select="@x" />
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="@x - 70" />
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:attribute>
                <xsl:attribute name="vector-effect">non-scaling-stroke</xsl:attribute>
                <xsl:attribute name="stroke-linecap">round</xsl:attribute>
                <xsl:attribute name="stroke-linejoin">round</xsl:attribute>
                <xsl:value-of select="$labelParam" />
            </text>
        </xsl:if>
    </xsl:template>
    
    <!-- Template for PolyLine elements -->
    <xsl:template match="PolyLine">
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
                <xsl:text>0.5</xsl:text>
            </xsl:attribute>
        </path>
    </xsl:template>
    
    <!-- Template for labels(only nozzles have labels in NOAKADEXPI) -->
    <xsl:template match="Nozzle/Label">
        <xsl:param name="height" />
        <xsl:variable
            name="displayText"
            select="following-sibling::GenericAttributes/GenericAttribute[@Name='ObjectDisplayNameAssignmentClass' or @Name='LineDescriptionAssignmentClass']/@Value" />
        <xsl:if
            test="$displayText">
            <text>
                <xsl:attribute name="x">
                    <xsl:value-of select="Position/Location/@X | Text/Position/Location/@X" />
                </xsl:attribute>
                <xsl:attribute name="y">
                    <xsl:value-of
                        select="$height - (Position/Location/@Y | Text/Position/Location/@Y)" />
                </xsl:attribute>
                <xsl:attribute name="font-size">
                    <xsl:value-of select="Text/@Height" />
                </xsl:attribute>
                <xsl:attribute name="font-family">
                    <xsl:value-of
                        select="Text/@Font" />
                </xsl:attribute>
                <xsl:attribute name="text-anchor">
                    <xsl:choose>
                        <xsl:when test="Text/@Justification = 'RightCenter'">
                            <xsl:text>End</xsl:text>
                        </xsl:when>
                        <xsl:when test="Text/@Justification = 'LeftCenter'">
                            <xsl:text>Start</xsl:text>
                        </xsl:when>
                        <xsl:when test="Text/@Justification = 'CenterCenter'">
                            <xsl:text>Middle</xsl:text>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:text>Middle</xsl:text>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:attribute>
                <xsl:attribute name="transform">
                    <!-- Assuming that a Reference of (1,0,0) means horizontal text, calculate
                         the rotation angle -->
                    <xsl:variable
                        name="posX" select="Text/Position/Location/@X" />
                    <xsl:variable
                        name="posY" select="Text/Position/Location/@Y" />
                    <xsl:variable
                        name="textRotationAngle">
                        <xsl:choose>
                            <xsl:when test="Text/@TextAngle">
                                <xsl:value-of select="Text/@TextAngle" />
                            </xsl:when>
                            <xsl:otherwise>
                                0
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>
                    <xsl:value-of
                        select="concat('rotate(', 360 - $textRotationAngle, ' ', $posX, ' ', $height - $posY, ')')" />
                </xsl:attribute>
                <xsl:value-of select="$displayText" />
            </text>
        </xsl:if>
    </xsl:template>
    
    
    <!-- Template to remove elements with a red or green stroke, excluding text elements -->
    <xsl:template match="*[not(self::text)][@stroke='#ff0000' or @stroke='#00ff00']" />
    
    <!-- Template to remove elements with a red or green fill, excluding text elements -->
    <xsl:template match="*[not(self::text)][@fill='#ff0000' or @fill='#00ff00']" />
    
    <!-- Generic template to copy attributes as they are -->
    <xsl:template match="@*">
        <xsl:copy />
    </xsl:template>

     <!-- Used to remove whitespaces and newlines-->
 <xsl:strip-space elements="*"/>
    
</xsl:stylesheet>