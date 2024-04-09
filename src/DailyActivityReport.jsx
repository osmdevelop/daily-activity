import React, { useState } from 'react';
import { Formik, Form, Field, useField, FieldArray, ErrorMessage } from 'formik';
import { PDFDownloadLink } from '@react-pdf/renderer';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import loadingGif from './assets/loading.gif';
import trashIcon from './assets/trash.svg';
import logo from './logo.png';

import { addReport } from './services/reportService'; // Adjust the path as needed


//firebase:
import db from './firebase.js';


import DocRender from './DocRender.jsx';

const DailyActivityReport = () => {
  const initialValues = {
    caseManagerName: '',
    date: '',
    location: '',
    clients: [{ fullName: '', applicationFiled: [], status: '', otherServices: '' }],
  };

  const FormikDatePicker = ({ ...props }) => {
    // Use Formik's useField hook to tie the DatePicker to Formik's state and validation
    const [field, meta, helpers] = useField(props);
    return (
      <div className="form-group">
        <DatePicker
          {...field}
          {...props}
          selected={(field.value && new Date(field.value)) || null}
          onChange={value => helpers.setValue(value)}
          wrapperClassName="date-picker"
        />
        {meta.touched && meta.error ? (
          <div className="field-error">{meta.error}</div>
        ) : null}
      </div>
    );
  };

  const [formData, setFormData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

const handleSubmit = async (values) => {
  setLoading(true);
  try {
    // First, save the report to Firestore
    const docRef = await addReport(values);
    console.log("Report added to Firestore with ID:", docRef.id);
    
    // Then, set formData for PDF generation
    setFormData(values);
    setSubmitted(true); // This will make the PDFDownloadLink appear
  } catch (error) {
    console.error("Error:", error);
    // Handle the error appropriately (show an error message to the user, etc.)
  }
  setTimeout(() => {
      setLoading(false);
    }, 500);
};



  const validationSchema = Yup.object().shape({
    caseManagerName: Yup.string().required('Case manager name is required'),
    date: Yup.date().required('Date is required'),
    location: Yup.string().required('Location is required'),
    clients: Yup.array().of(
      Yup.object().shape({
        fullName: Yup.string().required('Client full name is required'),
        // applicationFiled: Yup.array().min(1, 'At least one application must be filed'),
        status: Yup.string().required('Status is required'),
        otherServices: Yup.string().required('Other services provided is required'),
      })
    ),
  });

  return (
    <div className="container">
      <div className='company-title'>
        <img src={logo} alt="logo" />
        <h3 className='company-name'>Selfreliance Association</h3>
      </div>
      <h1 className='form-title'>Daily Activity Report</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            <div className="form-group">
              <label>Case Manager Name:</label>
              <Field as="select" name="caseManagerName" className="form-control">
                <option value="">Select Case Manager</option>
                <option value="Olena Levko-Sendeha">Olena Levko-Sendeha</option>
                <option value="Nadiia Smolikevych">Nadiia Smolikevych</option>
                <option value="Natalya Zavizistup">Natalya Zavizistup</option>
                <option value="Darina Semenets">Darina Semenets</option>
                <option value="Inha Ruda">Inha Ruda</option>
                <option value="Iryna Hryniv">Iryna Hryniv</option>
                <option value="Dariia Mykhalko">Dariia Mykhalko</option>
              </Field>
              <ErrorMessage name="caseManagerName" component="div" className="field-error" />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date of Activity:</label>
              <FormikDatePicker id="date" name="date" />
              <ErrorMessage name="date" component="div" className="field-error" />
            </div>

            <div className="form-group">
              <label>Location:</label>
              <Field as="select" name="location" className="form-control">
                <option value="">Select Office Location</option>
                <option value="Main Office">Main Office</option>
                <option value="Cumberland">Cumberland</option>
                <option value="Wheeling">Wheeling</option>
                <option value="Palos Park">Palos Park</option>
                <option value="Bloomingdale">Bloomingdale</option>
                <option value="Palatine">Palatine</option>
              </Field>
              <ErrorMessage name="location" component="div" className="field-error" />
            </div>

            <FieldArray name="clients">
              {({ insert, remove, push }) => (
                <div>
                  {values.clients.length > 0 &&
                    values.clients.map((client, index) => (
                      <div className="client-entry" key={index}>
                        <hr />

                        <div className='remove-btn'>
                        <h4 className='client-num'>Client {index + 1}</h4>
                        <button
                          type="button"
                          className="secondary remove"
                          onClick={() => remove(index)}
                        >
                          <img src={trashIcon} alt="trash icon" />
                        </button>
                        </div>
                        <div className="form-group">
                          <label>Client Full Name:</label>
                          <Field name={`clients.${index}.fullName`} type="text" className="form-control" />
                          <ErrorMessage name={`clients.${index}.fullName`} component="div" className="field-error" />
                        </div>

                        <div className="form-group">
                          <label>Application Filed:</label>
                          <div role="group" aria-labelledby="checkbox-group">
                            <label className="checkbox-label">
                              TPS
                              <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="TPS" />
                              <span className="checkmark"></span>
                            </label>
                            <label className="checkbox-label">
                              EAD
                              <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="EAD" />
                              <span className="checkmark"></span>
                            </label>
                            <label className="checkbox-label">
                              Re-Parole
                              <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="Re-Parole" />
                              <span className="checkmark"></span>
                            </label>
                            <label className="checkbox-label">
                              SNAP
                              <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="SNAP" />
                              <span className="checkmark"></span>
                            </label>
                            <label className="checkbox-label">
                              Cash Assistance
                              <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="Cash Assistance" />
                              <span className="checkmark"></span>
                            </label>
                            <label className="checkbox-label">
                              M.A.
                              <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="M.A." />
                              <span className="checkmark"></span>
                            </label>
                            <label className="checkbox-label">
                              HFS
                              <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="HFS" />
                              <span className="checkmark"></span>
                            </label>
                            <label className="checkbox-label">
                              (Redetermination)
                              <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="(Redetermination)" />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                        </div>


                        <div className="form-group">
                          <label>Status:</label>
                          <Field as="select" name={`clients.${index}.status`} className="form-control">
                            <option value="">Select Status</option>
                            <option value="Filled out">Filled Out</option>
                            <option value="Took information to submit later">Took Information to submit later</option>
                            <option value="Additional documents needed">Additional Documents Needed</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Scanned">Scanned</option>
                          </Field>
                          <ErrorMessage name={`clients.${index}.status`} component="div" className="field-error" />
                        </div>

                        <div className="form-group">
                          <label>Other Services Provided:</label>
                          <Field as="select" name={`clients.${index}.otherServices`} className="form-control">
                            <option value="">Select Service</option>
                            <option value="Translation and information">Translation and information</option>
                            <option value="Picked up the envelope">Picked up the envelope</option>
                            <option value="Other IDHS">Other IDHS</option>
                            <option value="Other non-IDHS">Other non-IDHS</option>
                            <option value="Preparation, Copies">Preparation, Copies</option>
                          </Field>
                          <ErrorMessage name={`clients.${index}.otherServices`} component="div" className="field-error" />
                        </div>

                        
                      </div>
                    ))}
                  <button
                    type="button"
                    className="secondary add"
                    onClick={() => push({ fullName: '', applicationFiled: [], status: '', otherServices: '' })}
                  >
                    Add Another Client <span>+</span>
                  </button>
                </div>
              )}
            </FieldArray>

            <button type="submit" className="btn btn-primary">Submit</button>
          </Form>
        )}
      </Formik>

{submitted && formData && (
        <>
          {loading ? (
            <div className='top'><img className='loading-gif' src={loadingGif} alt="loading..." /></div> // You can replace this with a more sophisticated loading animation
          ) : (
            <PDFDownloadLink className='download'
              document={<DocRender formData={formData} />}
              fileName="daily_activity_report.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Preparing document...' : 'Download PDF'
              }
            </PDFDownloadLink>
          )}
        </>
      )}
    </div>
  );
};

export default DailyActivityReport;
