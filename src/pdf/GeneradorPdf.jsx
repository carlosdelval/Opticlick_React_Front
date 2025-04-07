import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Estilos
const styles = StyleSheet.create({
  body: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 40,
    backgroundColor: "#FFFFFF",
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
  },
  image: {
    width: 80,
    height: 80,
    marginVertical: 10,
    alignSelf: "center",
  },
  section: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 6,
  },
  table: {
    display: "table",
    width: "100%",
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#2c3e50",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
    color: "#2c3e50",
  },
  tableHeader: {
    backgroundColor: "#531CB3",
    color: "#FDFFF7",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#7f8c8d",
  },
  signature: {
    bottom: 50,
    marginTop: 50,
    textAlign: "right",
    fontSize: 12,
    fontStyle: "italic",
    color: "#2c3e50",
  },
});

const OpticaPDF = ({ nombre, fecha, hora, graduacion }) => (
  <Document>
    <Page style={styles.body} size="A4">
      {/* Encabezado */}
      <View style={styles.header}>
        <Image style={styles.image} src="/logo.png" />
        <Text style={styles.title}>OptiClick</Text>
        <Text style={styles.subtitle}>
          Puente Genil, Córdoba | Tel: 123-456-789
        </Text>
      </View>

      {/* Datos del paciente */}
      <View style={styles.section}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginTop: 10,
            color: "#2c3e50",
          }}
        >
          Paciente: {nombre}
        </Text>
        <Text style={{ fontSize: 12, marginTop: 5, color: "#2c3e50" }}>
          Consulta: {fecha} a las {hora}
        </Text>
      </View>

      {/* Tabla de graduación */}
      <View style={styles.section}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 5,
            color: "#2c3e50",
          }}
        >
          Graduación
        </Text>
        <View style={styles.table}>
          {/* Encabezados de tabla */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Esfera</Text>
            <Text style={styles.tableCell}>Cilindro</Text>
            <Text style={styles.tableCell}>Eje</Text>
          </View>
          {/* Datos */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{graduacion.esfera}</Text>
            <Text style={styles.tableCell}>{graduacion.cilindro}</Text>
            <Text style={styles.tableCell}>{graduacion.eje}</Text>
          </View>
        </View>
      </View>

      {/* Firma y pie de página */}
      <Text style={styles.signature}>
        ________________________ Firma del especialista
      </Text>
      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) =>
          `Documento generado digitalmente | Página ${pageNumber} de ${totalPages}`
        }
        fixed
      />
    </Page>
  </Document>
);

export default OpticaPDF;
