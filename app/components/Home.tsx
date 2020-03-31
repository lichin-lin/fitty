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
  EuiTabbedContent,
} from '@elastic/eui';
import styles from './Home.css';
const _w = 480;
const Container = styled.div`
  position: relative;
  width: 100%;
  height:100%;
  display: flex;
  justify-content: flex-start;

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
  min-width: var(--overlay-width);
  min-height: var(--overlay-height);
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
  /* position: absolute; */
  z-index: -1;
`;
const ControlPanel = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const StyledEuiPopover = styled(EuiPopover)`
  bottom: 16px;
  left: 16px;
  position: fixed;
  width: 480px;
  height: auto;
`;

export default function Home() {
  const [opacity, SetOpacity] = useState(50);
  const [scale, SetScale] = useState(100);
  const [currentTab, setCurrentTab] = useState('zeplin');
  // Zeplin
  const projectId = '5d3961af5fd2632e5d62fc34';
  const [token, SetToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicGVyc29uYWxfYWNjZXNzX3Rva2VuIiwiY2xpZW50X2lkIjoiNWU3YTAyYjA3NmNjMjA4YmU1NDljOWE1Iiwic2NvcGUiOiIiLCJpYXQiOjE1ODUwNTQzODQsImV4cCI6MTkwMDYyMzY0NCwiaXNzIjoiemVwbGluOmFwaS56ZXBsaW4uaW8iLCJzdWIiOiI1YzljMTg3NDE2ZDRlZDc3NmJiNTAzNTciLCJqdGkiOiJjZDQwZjFhNC05NzE0LTQzZTItYmNkMS02OTEzYTVjMTRjOWEifQ.3xLhOpEubiXO0GDM2Z6KJ2E9UxRpfjVlqa5Xerr9k5M');
  const [screenID, SetScreenID] = useState('5e55658227cd32677b1e6b77');
  // Figma
  const [figmaFileID, SetFigmaFileID] = useState('MtR6sYoPw9qnT9VHT6Pwlv');
  const [figmaToken, SetFigmaToken] = useState('39373-5d3aee3e-c57c-4f62-a29c-92af3084aa7f');
  const [figmaFrameID, SetFigmaFrameID] = useState('27:254');
  const [showControlPanel, setShowControlPanel] = useState(false);
  // image source
  const [imageSource, setImageSource] = useState({
    url: '',
    width: 1024,
    height: 768,
  });

  const handleZeplinStatic = () => {
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
        document.documentElement.style.setProperty('--overlay-width', `${resJson.image.width}px`);
        document.documentElement.style.setProperty('--overlay-height', `${resJson.image.height}px`);
        setImageSource({
          url: resJson.image.original_url,
          width: resJson.image.width,
          height: resJson.image.height,
        })
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  const handleFigmaStatic = () => {
    fetch(`https://api.figma.com/v1/files/${figmaFileID}/nodes?ids=${figmaFrameID}` , {
      method: 'GET',
      headers: {
          'X-Figma-Token': figmaToken
      }
    }).then((res) => {
      return res.json()
    }).then((resJson) => {
      let nodeInformation = resJson.nodes[figmaFrameID]
      if (nodeInformation) {
        const _w = nodeInformation.document.absoluteBoundingBox.width // 100vw
        const _h = nodeInformation.document.absoluteBoundingBox.height // `${100 * _h / _w}vw`
        document.documentElement.style.setProperty('--overlay-width', `${_w}px`);
        document.documentElement.style.setProperty('--overlay-height', `${_h}px`);
        setImageSource({
          ...imageSource,
          width: _w,
          height: _h,
        }) 
      }
    }).catch(error => console.log(error));

    fetch(`https://api.figma.com/v1/images/${figmaFileID}?format=svg&ids=${figmaFrameID}` , {
      method: 'GET',
      headers: {
          'X-Figma-Token': figmaToken
      }
    }).then((res) => {
      return res.json()
    }).then((resJson) => {
      if (resJson && resJson.err === null) {
        // successful get image
        if (resJson['images'][figmaFrameID]) {
          const url = resJson['images'][figmaFrameID]
          document.documentElement.style.setProperty('--overlay-image', `url('${url}')`);
          setImageSource({
            ...imageSource,
            url,
          }) 
        }
      }
    }).catch(error => console.log(error));
  }

  useEffect(() => {
    if (currentTab === 'Zeplin') {
      handleZeplinStatic()
    } else if (currentTab === 'Figma') {
      handleFigmaStatic()
    }
  }, [currentTab]);

  useEffect(() => {
    handleZeplinStatic()
  }, [screenID])

  useEffect(() => {
    handleFigmaStatic()
  }, [figmaFrameID])

  console.log(imageSource);
  
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
  const tabsContent = [
    {
      id: 'zeplin--id',
      name: 'Zeplin',
      content: (
        <EuiFlexGroup style={{ maxWidth: 600, marginTop: 8 }}>
          <EuiFlexItem>
            <EuiFormRow id="section-zeplin-projectID">
              <EuiFieldText
                compressed
                placeholder="get it from the web"
                value={projectId}
                prepend="Project ID"
                readOnly
              />
            </EuiFormRow>

            <EuiFormRow id="section-zeplin-screenID">
              <EuiFieldText
                compressed
                placeholder="get it from the web"
                value={screenID}
                prepend="Screen ID"
                onChange={(e) => SetScreenID(e.target.value)}
              />
            </EuiFormRow>

            <EuiFormRow id="section-zeplin-token">
              <EuiFieldText
                compressed
                placeholder="get it from the develop panel on zeplin"
                value={token}
                prepend="Token"
                onChange={(e) => SetToken(e.target.value)}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },
    {
      id: 'figma--id',
      name: 'Figma',
      // disabled: true,
      content: (
        <EuiFlexGroup style={{ maxWidth: 600, marginTop: 8 }}>
          <EuiFlexItem>
            <EuiFormRow id="section-figma-fileID">
              <EuiFieldText
                compressed
                placeholder="get it from the figma url"
                value={figmaFileID}
                prepend="File ID"
                readOnly
              />
            </EuiFormRow>

            <EuiFormRow id="section-figma-frameID">
              <EuiFieldText
                compressed
                placeholder="get it from the figma url"
                value={figmaFrameID}
                prepend="Frame ID"
                onChange={(e) => SetFigmaFrameID(e.target.value)}
              />
            </EuiFormRow>

            <EuiFormRow id="section-figma-token">
              <EuiFieldText
                compressed
                placeholder="get it from the develop panel on figma"
                value={figmaToken}
                prepend="Token"
                onChange={(e) => SetFigmaToken(e.target.value)}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },  
  ]
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
              <EuiFlexItem>
                <EuiFormRow id="overlay-opacity-control" label="Opacity" helpText="">
                  <EuiRange
                    id={'123'}
                    min={0}
                    max={100}
                    step={1}
                    showValue
                    value={opacity}
                    onChange={e => {
                      const newV = parseInt(e.target.value, 10)
                      SetOpacity(newV);
                      document.documentElement.style.setProperty('--overlay-opacity', `${newV / 100}`);
                    }}
                    showLabels
                  />
                  </EuiFormRow>

                  <EuiFormRow id="overlay-scale-control" label="Scale" helpText="">
                    <EuiRange
                      id={'scale'}
                      min={40}
                      max={160}
                      showValue
                      step={20}
                      value={scale}
                      onChange={e => {
                        const newScale = parseInt(e.target.value, 10)
                        SetScale(newScale);
                        const _scale = newScale / 100
                        document.documentElement.style.setProperty('--overlay-width', `${imageSource.width * _scale}px`);
                        document.documentElement.style.setProperty('--overlay-height', `${imageSource.height * _scale}px`);
                      }}
                      showLabels
                    />
                  </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
            {/* Tabs: Support: Zeplin, Figma */}
            <EuiFlexGroup style={{ maxWidth: 600 }}>
              <EuiFlexItem>
                <EuiFormRow id="data-control" label="Source" helpText="">
                  <EuiTabbedContent
                    size='s'
                    tabs={tabsContent}
                    initialSelectedTab={tabsContent[0]}
                    autoFocus="selected"
                    onTabClick={tab => {
                      console.log('clicked tab', tab);
                      setCurrentTab(tab.name);
                    }}
                    style={{
                      maxWidth: _w,
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
            {/* Tabs End */}
          </EuiForm>
        </ControlPanel>  
      </StyledEuiPopover>
    </Container>
  );
}
