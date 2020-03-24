import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react'
import { Slider } from '@material-ui/core';
import styles from './Home.css';
import { handleStringChange } from "@blueprintjs/docs-theme";

// import { Link } from 'react-router-dom';
// import routes from '../constants/routes.json';

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

const ControlPanel = styled.div`
  bottom: 10px;
  position: absolute;
  width: 100%;
  height: 48px;
  padding: 8px 48px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 24px;
`;
export default function Home() {
  // token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicGVyc29uYWxfYWNjZXNzX3Rva2VuIiwiY2xpZW50X2lkIjoiNWU3YTAyYjA3NmNjMjA4YmU1NDljOWE1Iiwic2NvcGUiOiIiLCJpYXQiOjE1ODUwNTQzODQsImV4cCI6MTkwMDYyMzY0NCwiaXNzIjoiemVwbGluOmFwaS56ZXBsaW4uaW8iLCJzdWIiOiI1YzljMTg3NDE2ZDRlZDc3NmJiNTAzNTciLCJqdGkiOiJjZDQwZjFhNC05NzE0LTQzZTItYmNkMS02OTEzYTVjMTRjOWEifQ.3xLhOpEubiXO0GDM2Z6KJ2E9UxRpfjVlqa5Xerr9k5M
  const projectId = '5d3961af5fd2632e5d62fc34';
  const [opacity, SetOpacity] = useState(50);
  const [token, SetToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicGVyc29uYWxfYWNjZXNzX3Rva2VuIiwiY2xpZW50X2lkIjoiNWU3YTAyYjA3NmNjMjA4YmU1NDljOWE1Iiwic2NvcGUiOiIiLCJpYXQiOjE1ODUwNTQzODQsImV4cCI6MTkwMDYyMzY0NCwiaXNzIjoiemVwbGluOmFwaS56ZXBsaW4uaW8iLCJzdWIiOiI1YzljMTg3NDE2ZDRlZDc3NmJiNTAzNTciLCJqdGkiOiJjZDQwZjFhNC05NzE0LTQzZTItYmNkMS02OTEzYTVjMTRjOWEifQ.3xLhOpEubiXO0GDM2Z6KJ2E9UxRpfjVlqa5Xerr9k5M');
  const [screenID, SetScreenID] = useState('5e55658227cd32677b1e6b77');
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
        console.log('set to background!', resJson.image.original_url);
        document.documentElement.style.setProperty('--overlay-image', `url('${resJson.image.original_url}')`);
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [screenID])
  return (
    <Container className={styles.container} data-tid="container">
      <ControlPanel>
          {/* <Slider value={opacity} color="#0AF" settings={{
              start: 50,
              min: 10,
              max: 100,
              step: 1,
              onChange: value => {
                SetOpacity(value);
                document.documentElement.style.setProperty('--overlay-opacity', `${value / 100}`);
              }
          }} /> */}
          {/* <input
            min={10}
            max={100}
            step={1}
            type="range" 
            value={opacity}
            onChange={(e) => {
              SetOpacity(e.target.value);
              document.documentElement.style.setProperty('--overlay-opacity', `${e.target.value / 100}`);
            }}
          /> */}
          <Slider
            defaultValue={50}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            min={10}
            max={100}
            onChange={(event: any, newValue: any) => {
              SetOpacity(newValue);
              document.documentElement.style.setProperty('--overlay-opacity', `${newValue / 100}`);
            }}
          />
          <Input
            size='small'
            value={screenID}
            onChange={handleStringChange((tagValue) => SetScreenID(tagValue))}
            placeholder='Enter screenID...'
          />
          <Input
            size='small'
            value={token}
            onChange={handleStringChange((tagValue) => SetToken(tagValue))}
            placeholder='Enter token...'
          />
          {/* <Slider
            value={opacity}
            initialValue={opacity}
            max={100}
            min={0}
            labelStepSize={20}
            onChange={(number) => {
              SetOpacity(number);
              document.documentElement.style.setProperty('--overlay-opacity', `${number / 100}`);
            }}
          /> */}
      </ControlPanel>
    </Container>
  );
}
