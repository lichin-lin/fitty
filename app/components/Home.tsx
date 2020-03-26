import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  EuiRange,
  EuiForm,
  EuiPopover,
  EuiFlexGroup,
  EuiButton,
  EuiFlexItem,
  EuiFormRow,
  EuiFieldText,
} from '@elastic/eui';
import styles from './Home.css';

const Container = styled.div`
  position: relative;
  width: 100%;
  height:100%;

  h2 {
    font-size: 5rem;
  }
  a {
    font-size: 1.4rem;
  }
`;
const Overlay = styled.div`
  width: var(--overlay-width);
  height: var(--overlay-height);

  content: "";
  background-image: var(--overlay-image);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: var(--overlay-opacity);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
`;
const ControlPanel = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const StyledEuiPopover = styled(EuiPopover)`
  bottom: 10px;
  left: 10px;
  position: absolute;
  width: 360px;
  height: auto;
`;

export default function Home() {
  const projectId = '5d3961af5fd2632e5d62fc34';
  const [opacity, SetOpacity] = useState(50);
  const [token, SetToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicGVyc29uYWxfYWNjZXNzX3Rva2VuIiwiY2xpZW50X2lkIjoiNWU3YTAyYjA3NmNjMjA4YmU1NDljOWE1Iiwic2NvcGUiOiIiLCJpYXQiOjE1ODUwNTQzODQsImV4cCI6MTkwMDYyMzY0NCwiaXNzIjoiemVwbGluOmFwaS56ZXBsaW4uaW8iLCJzdWIiOiI1YzljMTg3NDE2ZDRlZDc3NmJiNTAzNTciLCJqdGkiOiJjZDQwZjFhNC05NzE0LTQzZTItYmNkMS02OTEzYTVjMTRjOWEifQ.3xLhOpEubiXO0GDM2Z6KJ2E9UxRpfjVlqa5Xerr9k5M');
  const [screenID, SetScreenID] = useState('5e55658227cd32677b1e6b77');
  const [showControlPanel, setShowControlPanel] = useState(false);
  useEffect(() => {
    fetch(`https://api.zeplin.dev/v1/projects/${projectId}/screens/${screenID}`, { 
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Accept': 'application/json',
      }
    }).then((res) => {
      return res.json()
    }).then((resJson) => {
      if(resJson.image && resJson.image.original_url) {
        console.log('set to background!', resJson.image);
        const h = 100 * resJson.image.height / resJson.image.width
        document.documentElement.style.setProperty('--overlay-image', `url('${resJson.image.original_url}')`);
        document.documentElement.style.setProperty('--overlay-width', `100%`);
        document.documentElement.style.setProperty('--overlay-height', `${h}vw`);
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [screenID])
  const ControlPanelButton = (
    <EuiButton
      iconSide="right"
      fill
      size="s"
      iconType="arrowDown"
      onClick={() => setShowControlPanel(!showControlPanel)}>
      Toggle ControlPanel
    </EuiButton>
  );
  return (
    <Container className={styles.container} data-tid="container">
      <Overlay />
      <StyledEuiPopover
        id="control-Popover"
        ownFocus
        button={ControlPanelButton}
        isOpen={showControlPanel}
        closePopover={() => setShowControlPanel(false)}
      >
        <ControlPanel>
          <EuiForm component="form">
            <EuiFlexGroup style={{ maxWidth: 600 }}>
              <EuiFlexItem id="overlay-opacity-control">
                {/* <EuiFormRow label="Scale" helpText="">
                    <EuiRange
                      id={'123'}
                      min={0}
                      max={100}
                      step={1}
                      value={opacity}
                      onChange={e => {
                        const newV = parseInt(e.target.value, 10)
                        SetOpacity(newV);
                        document.documentElement.style.setProperty('--overlay-opacity', `${newV / 100}`);
                      }}
                      showLabels
                  />
                </EuiFormRow> */}
                <EuiFormRow id="overlay-opacity-control" label="Opacity" helpText="">
                  <EuiRange
                    id={'123'}
                    min={0}
                    max={100}
                    step={1}
                    showInput
                    value={opacity}
                    onChange={e => {
                      const newV = parseInt(e.target.value, 10)
                      SetOpacity(newV);
                      document.documentElement.style.setProperty('--overlay-opacity', `${newV / 100}`);
                    }}
                    showLabels
                  />
                  </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup style={{ maxWidth: 600 }}>
              <EuiFlexItem>
                <EuiFormRow id="section-zeplin-projectID" label="Project ID" helpText="">
                  <EuiFieldText
                    compressed
                    placeholder="get it from the web"
                    value={projectId}
                    readOnly
                  />
                </EuiFormRow>

                <EuiFormRow id="section-zeplin-screenID" label="Screen ID">
                  <EuiFieldText
                    compressed
                    placeholder="get it from the web"
                    value={screenID}
                    onChange={(e) => SetScreenID(e.target.value)}
                  />
                </EuiFormRow>

                <EuiFormRow id="section-zeplin-token" label="Token" helpText="">
                  <EuiFieldText
                    compressed
                    placeholder="get it from the develop panel on zeplin"
                    value={token}
                    onChange={(e) => SetToken(e.target.value)}
                  />
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiForm>
        </ControlPanel>  
      </StyledEuiPopover>
    </Container>
  );
}
