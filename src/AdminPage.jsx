// AdminPage.jsx
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from './firebase';
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportRender from './ReportRender';

const AdminPage = () => {
  const [caseManagers, setCaseManagers] = useState([]);
  const [selectedCaseManager, setSelectedCaseManager] = useState('');
  const [date, setDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchCaseManagers = async () => {
    try {
      // Fetch all reports
      const reportsSnapshot = await getDocs(collection(db, "reports"));
      
      // Create a Set to hold unique case manager names
      const managerNames = new Set();
      reportsSnapshot.forEach((doc) => {
        // Add case manager name to the Set
        const data = doc.data();
        if (data.caseManagerName) {
          managerNames.add(data.caseManagerName);
        }
      });

      // Convert Set to Array and setCaseManagers with this array
      setCaseManagers(Array.from(managerNames));
      console.log("Case Managers fetched: ", Array.from(managerNames));
    } catch (error) {
      console.error("Error fetching case managers: ", error);
    }
  };

  fetchCaseManagers();
}, []);

  const fetchReportData = async () => {
  if (!selectedCaseManager || !date) {
    alert('Please select a case manager and a date.');
    return;
  }

  setLoading(true);

  const selectedDate = new Date(date);
  const startOfSelectedDateUtc = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
  const endOfSelectedDateUtc = new Date(startOfSelectedDateUtc);
  endOfSelectedDateUtc.setUTCHours(23, 59, 59, 999);

  // Parse the selected date and subtract 5 hours to align with UTC−05:00
  const reportDate = new Date(date);
  // Adjust for the timezone offset
  reportDate.setHours(reportDate.getHours() - 5);

  const startOfDay = new Date(reportDate.setHours(0, 0, 0, 0)); // Start of day
  const endOfDay = new Date(reportDate.setHours(23, 59, 59, 999)); // End of day

  // Format the dates to match Firestore's timestamp format
 const startOfDayTimestamp = Timestamp.fromDate(startOfSelectedDateUtc);
  const endOfDayTimestamp = Timestamp.fromDate(endOfSelectedDateUtc);

  // Query Firestore for the report
  const reportsRef = collection(db, "reports");
  const q = query(
    reportsRef,
    where("caseManagerName", "==", selectedCaseManager),
    where("date", ">=", startOfDayTimestamp),
    where("date", "<=", endOfDayTimestamp)
  );

  try {
    const querySnapshot = await getDocs(q);
    const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (reports.length > 0) {
      // Process the data to fit the format expected by ReportRender
      // Assuming reports contain the field 'date' as a Firestore Timestamp
      const processedReports = reports.map(r => ({
        ...r,
        date: r.date.toDate() // Convert Firestore Timestamp to JavaScript Date object
      }));
      setReportData(processedReports[0]); // Assuming we only want the first report
    } else {
      alert('No reports found for the selected manager and date.');
      setReportData(null);
    }
  } catch (error) {
    console.error("Error fetching reports: ", error);
    alert('An error occurred while fetching the report.');
  }

  setLoading(false);
};

  return (
    <div>
      <h1>Admin Page</h1>
      <div>
        <label>Case Manager Name:</label>
        <select
  value={selectedCaseManager}
  onChange={e => setSelectedCaseManager(e.target.value)}
  disabled={loading}
>
  <option value="">Select Case Manager</option>
  {caseManagers.map((managerName, index) => (
    <option key={index} value={managerName}>
      {managerName}
    </option>
  ))}
</select>

      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          disabled={loading}
        />
      </div>
      <button onClick={fetchReportData} disabled={loading}>
        {loading ? 'Loading...' : 'Generate Report'}
      </button>

      {reportData && (
        <PDFDownloadLink
          document={<ReportRender reportData={reportData} />}
          fileName={`daily_activity_report_${selectedCaseManager}_${date}.pdf`}
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Preparing document...' : 'Download now'
          }
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default AdminPage;
