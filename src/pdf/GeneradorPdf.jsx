import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
    color: "#7f8c8d",
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontWeight: "bold",
    color: "#34495e",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    color: "#2d3436",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: "auto",
    width: 100,
    height: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#7f8c8d",
  },
});

// Create Document Component
const Documentacion = ({ nombre, hora, fecha, eje, cilindro, esfera }) => (
  <Document>
    <Page style={styles.body}>
      <Text style={styles.header} fixed>
        ~ Documento generado por OptiClick ~
      </Text>
      <Text style={styles.title}>OptiClick</Text>
      <Text style={styles.author}>Puente Genil - Córdoba</Text>
      <Image style={styles.image} src="./logo.png" />
      <View style={styles.section}>
        <Text style={styles.subtitle}>
          Graduación realizada el {fecha} a las {hora}h
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>Nombre: {nombre}</Text>
        <Text style={styles.text}>Eje: {eje}</Text>
        <Text style={styles.text}>Cilindro: {cilindro}</Text>
        <Text style={styles.text}>Esfera: {esfera}</Text>
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

export default Documentacion;
