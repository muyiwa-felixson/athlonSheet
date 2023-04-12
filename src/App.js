import React, { useState, useEffect } from 'react';
import './App.css';
import Cookies from 'js-cookie';
import './assets/fonts/font.css';
import { Button, Modal as AntModal } from 'antd';
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
import { Layout, Timeline } from './components/layout.style';
import SprintSheet from './pages/sprint/sprintTimeline';
import Theme from './utility/theme';
import ExportInvoice from './pages/export';
import RateTab from './pages/rates/ratecard';

export const UserContext = React.createContext();

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
        excluded: { get: excluded, set: setExcluded }
      }}
    >
      {sheetDomains ? (
        <Layout showTimeline={showTimeline}>
          {/* Render app content if user is logged in */}
          {profile?.email ? (
            <>
              <div className="mainpanel">
                <Header>
                  <Logo className="topbrand" />
                  <Button size="large" style={{ borderRadius: Theme.primary.radius }} onClick={() => setRateModal(!rateModal)} disabled={invoice.customer ? false : true}>Rate Card</Button>
                  <GoogleProfile {...profile} logOut={logOut} />
                </Header>
                <div className='midpanel'>
                  <Invoice />
                  <Timeline>
                    <SprintSheet />
                  </Timeline>
                </div>
                <Header foot>
                  <div/>
                <Button size="large" style={{ borderRadius: Theme.primary.radius }} onClick={() => reset()}>Reset Sheet</Button>
                  <Button type="primary" size="large" style={{ borderRadius: Theme.primary.radius }} onClick={() => setModal(!modal)} disabled={invoice.customer ? false : true}>Generate Invoice</Button>
                </Header>
                <AntModal title={null} open={modal} footer={null} closable={false} destroyOnClose={true} bodyStyle={{ padding: Theme.dimensions.x1 }} width={1200}>
                  {modal && <ExportInvoice onClose={() => setModal(false)} />}
                </AntModal>
                <AntModal title={null} open={rateModal} footer={null} closable={true} onCancel={()=> setRateModal(false)} destroyOnClose={true} bodyStyle={{ padding: Theme.dimensions.x1 }} width={1200}>
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
                <LoginWrapper>
                  <Logo className="brand" />
                  <h2>Sign in with your athlon mail</h2>
                  <GoogleAuth />
                </LoginWrapper>
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




