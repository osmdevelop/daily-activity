import React, { useState } from 'react';
import { Formik, Form, Field, useField, FieldArray, ErrorMessage } from 'formik';
import { PDFDownloadLink } from '@react-pdf/renderer';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import loadingGif from './assets/loading.gif';
import trashIcon from './assets/trash.svg';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { addReport } from './services/reportService'; // Adjust the path as needed
import DocRender from './DocRender.jsx';


//firebase:
import db from './firebase.js';





const DailyActivityReport = () => {
  const initialValues = {
    caseManagerName: '',
    date: '',
    location: '',
    clients: [{ fullName: '', applicationFiled: [], status: '', infoAndRef: [], services: [], caseNotes: '' }],
  };
  const navigate = useNavigate();
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
      // Format the date as a string in MM/DD/YYYY
      const formattedDate = new Date(values.date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });

      // Include the formatted date in the report data
      const reportData = {
        ...values,
        date: formattedDate, // Use the formatted date string instead of the Date object
      };

      // Save the report to Firestore
      const docRef = await addReport(reportData);
      console.log("Report added to Firestore with ID:", docRef.id);

      // Then, set formData for PDF generation
      setFormData(reportData);
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
    caseManagerName: Yup.string().required('Manager name is required'),
    date: Yup.date().required('Date is required'),
    location: Yup.string().required('Location is required'),
    clients: Yup.array().of(
      Yup.object().shape({
        fullName: Yup.string().required('Client full name is required'),
        status: Yup.string().required('Status is required'),
        infoAndRef: Yup.array().of(Yup.string()), // Validates an array of strings
        // otherServices: Yup.string().required('Other services provided is required'),
      })
    ),
  });

  return (
    <div className="container">
      <button onClick={() => navigate('/admin')} className="btn btn-secondary">
        Admin
      </button>
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
            <div className='manager-group'>
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
                <label>Other Manager:</label>
                <Field as="select" name="caseManagerName" className="form-control">
                  <option value="">Select Manager</option>
                  <option value="Nataliya Ponomaryova">Nataliya Ponomaryova</option>
                  <option value="Eva Sigaev">Eva Sigaev</option>
                  <option value="Angela Savenko">Angela Savenko</option>
                  <option value="Olha Lykova">Olha Lykova</option>
                  <option value="Inna Demianova">Inna Demianova</option>
                </Field>
                <ErrorMessage name="caseManagerName" component="div" className="field-error" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date of Activity:</label>
              <FormikDatePicker id="date" name="date" />
              {/* <ErrorMessage name="date" component="div" className="field-error" /> */}
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
                          <h4 className='client-num'>{client.fullName || `Client ${index + 1}`}</h4>
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

                        <div className="client-entry-applications">
                          <div className="form-group applications">
                            <label>Activity:</label>
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
                                Medicaid
                                <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="Medicaid" />
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

                          <div className="form-group services">
                            <label>Services:</label>
                            <div role="group" aria-labelledby="checkbox-group">
                              <label className="checkbox-label">
                                ESL Classes
                                <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="ESL Classes" />
                                <span className="checkmark"></span>
                              </label>
                              <label className="checkbox-label">
                                Resume Creation
                                <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="Resume Creation" />
                                <span className="checkmark"></span>
                              </label>
                              <label className="checkbox-label">
                                Interview Preparation
                                <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="Interview Preparation" />
                                <span className="checkmark"></span>
                              </label>
                              <label className="checkbox-label">
                                Job Placement
                                <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="Job Placement" />
                                <span className="checkmark"></span>
                              </label>
                              <label className="checkbox-label">
                                Medicare
                                <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="Medicare" />
                                <span className="checkmark"></span>
                              </label>
                              <label className="checkbox-label">
                                I-134A
                                <Field type="checkbox" name={`clients.${index}.applicationFiled`} value="I-134A" />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                          </div>

                          <div className="form-group case-notes">
                            <label>Case Notes:</label>
                            <Field
                              name={`clients.${index}.caseNotes`}
                              as="textarea"
                              placeholder="Enter case notes"
                              className="form-control case-notes-input"
                            />
                            <ErrorMessage name={`clients.${index}.caseNotes`} component="div" className="field-error" />
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
                            <option value="Picked up the envelope">Picked up the envelope</option>
                            <option value="Provided Service">Provided Service</option>
                          </Field>
                          <ErrorMessage name={`clients.${index}.status`} component="div" className="field-error" />
                        </div>

                        <div className="form-group">
                          <label>Information & Referral provided</label>
                          <div role="group" aria-labelledby="checkbox-group-additional-options" className='info-ref'>
                            <label>
                              <Field type="checkbox" name={`clients.${index}.infoAndRef`} value="IDHS Benefits" />
                              IDHS Benefits
                            </label>
                            <label>
                              <Field type="checkbox" name={`clients.${index}.infoAndRef`} value="Health Plans" />
                              Health Plans
                            </label>
                            <label>
                              <Field type="checkbox" name={`clients.${index}.infoAndRef`} value="Employment" />
                              Employment
                            </label>
                            <label>
                              <Field type="checkbox" name={`clients.${index}.infoAndRef`} value="ESL Classes" />
                              ESL Classes
                            </label>
                            <label>
                              <Field type="checkbox" name={`clients.${index}.infoAndRef`} value="SSN" />
                              SSN
                            </label>
                            <label>
                              <Field type="checkbox" name={`clients.${index}.infoAndRef`} value="Immigration Services" />
                              Immigration Services
                            </label>
                            <label>
                              <Field type="checkbox" name={`clients.${index}.infoAndRef`} value="Driver License/ID" />
                              Driver License/ID
                            </label>
                            <label>
                              <Field type="checkbox" name={`clients.${index}.infoAndRef`} value="Law&Rights" />
                              Law&Rights
                            </label>
                            <label>
                              <Field type="checkbox" name={`clients.${index}.infoAndRef`} value="Mental Health" />
                              Mental Health
                            </label>
                            <label>
                              <Field type="checkbox" name={`clients.${index}.infoAndRef`} value="Other IDHS" />
                              Other IDHS
                            </label>
                            <label>
                              <Field type="checkbox" name={`clients.${index}.infoAndRef`} value="Other non-IDHS" />
                              Other non-IDHS
                            </label>
                          </div>
                        </div>


                        {/* <div className="form-group">
                          <label>Other Services Provided (optional):</label>
                          <Field as="select" name={`clients.${index}.otherServices`} className="form-control">
                            <option value="">Select Service</option>
                            <option value="Translation and information">Translation and information</option>
                            <option value="Picked up the envelope">Picked up the envelope</option>
                            <option value="Other IDHS">Other IDHS</option>
                            <option value="Other non-IDHS">Other non-IDHS</option>
                            <option value="Preparation, Copies">Preparation, Copies</option>
                          </Field>
                          <ErrorMessage name={`clients.${index}.otherServices`} component="div" className="field-error" />
                        </div> */}
                      </div>
                    ))}
                  <button
                    type="button"
                    className="secondary add"
                    onClick={() => push({ fullName: '', applicationFiled: [], status: '', infoAndRef: [], services: [], })}
                  >
                    Add Next Client <span>+</span>
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
