import React, { useState, useEffect } from 'react';
import './App.css';
import Cookies from 'js-cookie';
import './assets/fonts/font.css';
import { Button, notification, Modal as AntModal, Alert, Space } from 'antd';
import { googleLogout } from '@react-oauth/google';
import { GoogleProfile, LoginWrapper, Modal } from './components/login.style';
import Logo from './assets/logo';
import { GoogleAuth } from './pages/login/googleAuth';
import { Header } from './components/header.style';
import { Warning } from './components/warning.style';
import { fetchDomainData, fetchRateData, fetchSheetData } from './pages/login/googlesheet';
import { Loader } from './components/loading.style';
import { sheetDataToObject } from './utility/util';
import Invoice from './pages/invoice';
import { Layout, Timeline, Box } from './components/layout.style';
import SprintSheet from './pages/sprint/sprintTimeline';
import Theme from './utility/theme';
import ExportInvoice from './pages/export';
import RateTab from './pages/rates/ratecard';
import { Importer } from './pages/import';
import { FiDollarSign, FiPlay, FiRefreshCcw } from 'react-icons/fi';
import ExportFlatBillInvoice from './pages/export/flatbillInvoice';
import FlatBillTable from './pages/sprint/flatbill';
import SprintTable from './pages/sprint';

export const UserContext = React.createContext();
const defaultCurrency = process.env.REACT_APP_CURRENCY;

function App() {
  // State variables
  const [user, setUser] = useState(Cookies.get('userDetails') ? JSON.parse(Cookies.get('userDetails')) : null);
  const [profile, setProfile] = useState(Cookies.get('profile') ? JSON.parse(Cookies.get('profile')) : null);
  const [loginStatus, setLoginStatus] = useState(null);
  const [sheetMembers, setSheetMembers] = useState(null);
  const [sheetDomains, setSheetDomains] = useState(null);
  const [modal, setModal] = useState(false);
  const [rateModal, setRateModal] = useState(false);
  const [sheet, setSheet] = useState({});
  const [excluded, setExcluded] = useState(Cookies.get('excluded') && Cookies.get('excluded') !== 'undefined' ? JSON.parse(Cookies.get('excluded')) : {});
  const [sheetRates, setSheetRates] = useState(
    Cookies.get('sheetRates') && Cookies.get('sheetRates') !== 'undefined' ? JSON.parse(Cookies.get('sheetRates')) : null
  );
  const [invoice, setInvoice] = useState(Cookies.get('invoice') && Cookies.get('invoice') !== 'undefined' ? JSON.parse(Cookies.get('invoice')) : {});
  const [activity, setActivity] = useState({
    rates: false,
    members: false
  });
  const [showTimeline, setShowTimeline] = useState(true);

  // Logout function
  const logOut = () => {
    googleLogout();
    setProfile(null);
    setUser(null);
    Cookies.remove('userDetails');
    Cookies.remove('profile');
  };

  // Fetch acceptable domains and sheet data on mount
  useEffect(() => {
    fetchDomainData()
      .then((value) => {
        setSheetDomains(value.flat());
      })
      .catch((error) => console.log(error));
    getFullSheetData();

    return () => {
      // console.log('Component unmounted');
    };
  }, []);



  // Fetch sheet members and rate cards
  const getFullSheetData = () => {
    setActivity();
    fetchSheetData()
      .then((value) => {
        setSheetMembers(sheetDataToObject(value));
      })
      .catch((error) => console.log(error));

    if (!Cookies.get('sheetRates') || Cookies.get('sheetRates') === 'null') {
      fetchRateData()
        .then((value) => {
          setSheetRates(sheetDataToObject(value));
        })
        .catch((error) => console.log(error));
    } else {
      setSheetRates(JSON.parse(Cookies.get('sheetRates')));
    }
  };

  const nofityRequired = () => {
    let errors = []
    if (!invoice.customer?.name) {
      errors.push({ type: "error", message: <span>We need to start with a <strong>"Customer Name"</strong></span> });
    }

    if (invoice.project) {
      if (invoice.project.type === "sprint") {
        (invoice.project.sprints < 1) && errors.push({ type: "error", message: <span>What are we doing here? <stong>No Sprints?</stong></span> });
        (invoice.loading.length > 0 && invoice.loading?.filter(e => e.to === invoice.project.sprints).length < 1) && errors.push({ type: "warning", message: <span>Wait a minute! did your sprint loads cover all the sprints?</span> });
        (invoice.loading.length > 0 && invoice.loading?.filter(e => e.members.length === 0).length > 0) && errors.push({ type: "warning", message: <span>Except you don't like getting paid, some <strong>sprint load have no members</strong></span> });
      }

      if (invoice.project.type === "fixed") {
        // (invoice.project.sprints < 1) && errors.push({ type: "error", message: <span>What are we doing here? <stong>No Sprints?</stong></span> });
        (invoice.phases.length > 0 && invoice.phases?.filter(e => e.members.length === 0).length > 0) && errors.push({ type: "warning", message: <span>Except you don't like getting paid, some <strong>project phases have no members</strong></span> });
      }
    } else {
      errors.push({ type: "error", message: <span>Have you considered having a <strong>"Project Name"</strong>?</span> });
    }

    if (errors.filter(e => e.type === 'error').length > 0) {
      notification.open({
        message: 'Incomplete Fields',
        description: <Space direction="vertical">{errors.filter(e => e.type === 'error').map(e => <Alert key={`error_notice_${Date.now()}`} showIcon {...e} />)}</Space>,
        duration: 0,
      });
    } else {
      setModal(true);
    }

    if (errors.filter(e => e.type === 'warning').length > 0) {
      notification.open({
        message: 'Warnings!',
        description: <Space direction="vertical">{errors.filter(e => e.type === 'warning').map(e => <Alert key={`warning_notice_${Date.now()}`} showIcon {...e} />)}</Space>,
        duration: 10,
      });
    }
  }

  const reset = () => {
    Cookies.remove('invoice');
    Cookies.remove('data');
    Cookies.remove('sheet');
    Cookies.remove('excluded');
    Cookies.remove('project');
    window.location.reload(false);
  };

  return (
    <UserContext.Provider
      value={{
        user: { get: user, set: setUser },
        profile: { get: profile, set: setProfile },
        loginStatus: { get: loginStatus, set: setLoginStatus },
        domain: { get: sheetDomains, set: setSheetDomains },
        activity: { get: activity, set: setActivity },
        data: { members: { get: sheetMembers, set: setSheetMembers }, rateCard: { get: sheetRates, set: setSheetRates } },
        logOut: logOut,
        invoice: { get: invoice, set: setInvoice },
        timeline: { get: showTimeline, set: setShowTimeline },
        sheet: { get: sheet, set: setSheet },
        excluded: { get: excluded, set: setExcluded },
      }}
    >
      {sheetDomains ? (
        <Layout showTimeline={showTimeline}>
          {/* Render app content if user is logged in */}
          {profile?.email ? (
            <>
              <div className="mainpanel">
                <Header>
                  <div className='cage'>
                    <Logo className="topbrand" wide='true' />
                    <Button size="large" style={{ borderRadius: Theme.primary.radius }} onClick={() => setRateModal(!rateModal)} disabled={sheetRates ? false : true} icon={new Intl.NumberFormat('en-US', { style: 'currency', currency: defaultCurrency }).format('').replace(/\d/g, '').replace(".",'').trim()}> Rate Card</Button>
                    <GoogleProfile {...profile} logOut={logOut} />
                  </div>
                </Header>
                <div className='midpanel'>
                  <Invoice />

                  {invoice?.project && <Box invisible> {invoice.project.type === 'fixed' && invoice.phases && <FlatBillTable />} {invoice.project.type === 'sprint' && invoice.loading && <SprintTable />}</Box>}
                  {/* <Timeline><SprintSheet /></Timeline> */}
                  {(invoice?.project && invoice.project.type === 'sprint') && <Timeline><SprintSheet /></Timeline>}
                </div>
                <Header foot>
                  <div className='cage'>
                    <div><Importer /></div>

                    <Button size="large" style={{ borderRadius: Theme.primary.radius }} onClick={() => reset()} icon={<FiRefreshCcw />}>Reset Sheet</Button>

                    <Button type="primary" size="large" style={{ borderRadius: Theme.primary.radius }} onClick={() => nofityRequired()} disabled={invoice.customer ? false : true} icon={<FiPlay />}>Generate Invoice</Button>
                  </div>
                </Header>
                <AntModal title={null} open={modal} footer={null} closable={false} destroyOnClose={true} bodyStyle={{ padding: Theme.dimensions.x1 }} width={1200}>
                  {(modal && invoice.project && invoice.project.type === 'sprint') && <ExportInvoice onClose={() => setModal(false)} />}

                  {(modal && invoice.project && invoice.project.type === 'fixed') && <ExportFlatBillInvoice onClose={() => setModal(false)} />}
                </AntModal>
                <AntModal title={null} open={rateModal} footer={null} closable={true} onCancel={() => setRateModal(false)} destroyOnClose={true} bodyStyle={{ padding: Theme.dimensions.x1 }} width={1200}>
                  {rateModal && <RateTab />}
                </AntModal>
              </div>
            </>
          ) : (
            <>
              {/* Render login form if user is not logged in */}
              <Modal
                attache={
                  loginStatus === 'invalid domain' ? (
                    <Warning>We apologize, but the application is not accessible to email domains such as yours.</Warning>
                  ) : (
                    ''
                  )
                }
              >
                <div className='left'><LoginWrapper>

                  <Logo className="brand" wide />
                  <h2>Sign in with your <br />Athlon mail</h2>
                  <p className='info'>Athlon Sheet, an internal project for Athlon Studio © 2023</p>
                  <GoogleAuth />

                </LoginWrapper></div>
                <div className='right'><div className='brandy' /><div className='content'></div></div>
              </Modal>
            </>
          )}
        </Layout>
      ) : (
        // Render loader while sheet domains are being fetched
        <div>
          <Loader />
        </div>
      )}
    </UserContext.Provider>
  );
}

export default App;




