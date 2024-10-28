<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:imf="http://ns.imfid.org/imf#"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
                xmlns:dexpi="https://rdf.equinor.com/dexpi#"
>
    <xsl:output method="xml" indent="yes" />

    <!-- Root template -->
    <xsl:template match="/PlantModel">
    <rdf:RDF  xmlns:imf="http://ns.imfid.org/imf#"
              xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              xmlns:dexpi="https://rdf.equinor.com/dexpi#"
    >
    
            <xsl:apply-templates />
    </rdf:RDF>
        
    </xsl:template>
            
    <xsl:template match="PlantModel/Equipment" name="EquipmentBlockMap">
        <rdf:Description>
            <xsl:attribute name="rdf:about">
                <xsl:value-of select="concat('https://assetid.equinor.com/plantx#', @ID)" />
            </xsl:attribute>
            <rdf:type rdf:resource="imf:Block"/>
            <rdf:type rdf:resource="dexpi:Equipment"/>
            <rdfs:label>Equipment</rdfs:label>
            <imf:hasTerminal>
                    <xsl:attribute name="rdf:resource">
                        <xsl:value-of select="concat('https://assetid.equinor.com/plantx#', Nozzle/@ID)" />
                    </xsl:attribute>
            </imf:hasTerminal>
            <rdfs:label>
                <xsl:value-of select="GenericAttributes/GenericAttribute[@Name='TagNameAssignmentClass']/@Value" />
            </rdfs:label>
        </rdf:Description>  
    </xsl:template>
    
    
    <xsl:template name="PipingComponentTerminalMap" match="//PipingNetworkSegment/PipingComponent/ConnectionPoints/Node[@Type='process'] | //PipingNetworkSegment/PropertyBreak/ConnectionPoints/Node[@Type='process']">
        <rdf:Description>
            <xsl:attribute name="rdf:about">
                <xsl:value-of select="concat('https://assetid.equinor.com/plantx#', ../../@ID, '-node', count(preceding-sibling::*))" />
            </xsl:attribute>
            <rdf:type rdf:resource="imf:Terminal" />
            <rdfs:label>Piping Component Terminal</rdfs:label>
            <xsl:variable name="connectorId">
                <xsl:if test="count(preceding-sibling::*) = 1">
                    <xsl:if test="../../preceding-sibling::PipingComponent">
                       <xsl:value-of select="concat(../../preceding-sibling::PipingComponent[1]/@ID, '-node2-connector')" />
                    </xsl:if>
                    <xsl:if test="../../../Connection/@FromID">
                        <xsl:value-of select="concat(../../../Connection/@FromID, '-node',  ../../../Connection/@FromNode, '-connector')" />
                    </xsl:if>
                </xsl:if>
                <xsl:if test="count(preceding-sibling::*) = 2">
                    <xsl:choose>
                        <xsl:when test="../../following-sibling::PipingComponent or following-sibling::PropertyBreak">
                            <xsl:value-of select="concat(../../@ID , '-node2-connector')" />
                        </xsl:when>
                        <xsl:when test="../../../Connection/@ToID" >
                            <xsl:value-of select="concat(../../../Connection/@ToID, '-node', ../../../Connection/@ToNode, '-connector')" />
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat(../../@ID , '-node2-connector')" />
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:if>
            </xsl:variable>
            <imf:hasConnector>
                <xsl:attribute name="rdf:resource">
                    <xsl:value-of select="concat('https://assetid.equinor.com/plantx#', $connectorId)" />
                </xsl:attribute>
            </imf:hasConnector>
        </rdf:Description>
        <xsl:apply-templates />
    </xsl:template>
    
    
    <xsl:template match="//PipingNetworkSegment/PipingComponent | //PipingNetworkSegment/PropertyBreak" name="PipingComponentBlockMap">
        <rdf:Description>
            <xsl:attribute name="rdf:about">
                <xsl:value-of select="concat('https://assetid.equinor.com/plantx#', @ID)" />
            </xsl:attribute>
            <rdf:type rdf:resource="imf:Block"/>
            <rdf:type rdf:resource="dexpi:PipingComponent"/>
            <rdfs:label>Piping Component</rdfs:label>
            <imf:partOf>
                    <xsl:attribute name="rdf:resource">
                        <xsl:value-of select="concat('https://assetid.equinor.com/plantx#', ../@ID)" />
                    </xsl:attribute>
            </imf:partOf>
            <rdfs:label>
                <xsl:value-of select="GenericAttributes/GenericAttribute[@Name='ItemTagAssignmentClass']/@Value" />
            </rdfs:label>
            <imf:hasTerminal>
                <xsl:attribute name="rdf:resource">
                    <xsl:value-of select="concat('https://assetid.equinor.com/plantx#', @ID, '-node', count(preceding-sibling::*))" />                    
                </xsl:attribute>                

            </imf:hasTerminal>
        </rdf:Description>
        <xsl:apply-templates />

    </xsl:template>
    
</xsl:stylesheet>   