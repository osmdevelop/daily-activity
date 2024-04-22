// DocRender.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
// import { styles } from './reportStyles';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  details: {
    marginBottom: 20,
    fontSize: 12,
  },
  detailsItem: {
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tableColHeader: {
    backgroundColor: '#afb2b3',
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
    margin: {
    marginBottom: '10px',
  }
});

const formatDate = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};

// Create Document Component
const DocRender = ({ formData }) => {
  return (
    <Document>
      <Page size="Letter" style={styles.page}>
        <Text style={styles.title}>Daily Activity Report</Text>
        <View style={styles.details}>
          <Text style={styles.detailsItem}>Case Manager Name: {formData.caseManagerName}</Text>
          <Text style={styles.detailsItem}>Date: {formatDate(formData.date)}</Text> {/* Updated this line */}
          <Text style={styles.detailsItem}>Location: {formData.location}</Text>
        </View>
        <View style={styles.table}>
          {/* Table Headers */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Client Name</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Applications Filed</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Status (Filed, Additional Docs Needed)</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Other Services Provided</Text>
            </View>
          </View>
          {/* Table Content */}
          {formData.clients.map((client, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{client.fullName}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{client.applicationFiled.join(', ')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{client.status}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{client.otherServices}</Text>
              </View>
              <View style={{...styles.tableCol, ...styles.margin}}>
              <Text style={styles.tableCell}>Case Notes: {client.caseNotes}</Text>
              <br></br>
            </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default DocRender;
