// ReportRender.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    margin: 10,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
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
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCell: {
    margin: 5,
  },
});

// Helper function to format Firestore timestamp to a readable date string
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  // Create a Date object from the Firestore timestamp
  const date = new Date(timestamp.seconds * 1000);
  // Format the date to a readable format, e.g., "MM/DD/YYYY"
  return date.toLocaleDateString();
};

// ReportRender component
const ReportRender = ({ reportData }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header} fixed>
        Generated with Selfreliance Association Admin
      </Text>
      <Text style={styles.title}>Daily Activity Report</Text>
      <Text style={styles.subTitle}>Case Manager: {reportData?.caseManagerName}</Text>
      <Text style={styles.subTitle}>Date: {formatDate(reportData?.date)}</Text>
      <Text style={styles.subTitle}>Location: {reportData?.location}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text>Client Name</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Applications Filed</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Status</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Other Services Provided</Text>
          </View>
        </View>
        {reportData?.clients.map((client, index) => (
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
          </View>
        ))}
      </View>
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export default ReportRender;
