// ReportRender.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { styles } from './reportStyles.jsx';
import moment from 'moment';

// Helper function to format Firestore timestamp to a readable date string
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  // Create a Date object from the Firestore timestamp
  const date = new Date(timestamp.seconds * 1000);
  // Format the date to a readable format, e.g., "MM/DD/YYYY"
  return date.toLocaleDateString();
};

// ReportRender component
const ReportRender = ({ reportData }) => {
    const formattedDate = reportData?.date ? moment(reportData.date, 'MM/DD/YYYY').format('MM/DD/YYYY') : 'Invalid Date';

  return (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header} fixed>
        Generated with SRA Generative AI
      </Text>
      <Text style={styles.title}>Daily Activity Report</Text>
      <View style={styles.details}>
        <Text style={styles.subTitle}>Case Manager: {reportData?.caseManagerName}</Text>
        <Text style={styles.subTitle}>Date: {formattedDate}</Text>
        <Text style={styles.subTitle}>Location: {reportData?.location}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Client Name</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Applications Filed</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Status</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Other Services Provided</Text>
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
            <View style={{...styles.tableCol, ...styles.margin}}>
              <Text style={styles.tableCell}>Case Notes: {client.caseNotes}</Text>
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
};

export default ReportRender;
