import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import CircleLoader from 'react-spinners/CircleLoader'
import styled from 'styled-components'

const AppHeaderWrapper = styled.section`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: #61dafb;

  > table {
    width: 50%;
  }
`

function baseUrl () {
  if (process.env.NODE_ENV === 'production')
    return process.env.REACT_APP_MEDIA_SERVER
  return ''
}

const App = () => {
  const [files, changeFiles] = useState()
  useEffect(() => {
    axios
      .get(baseUrl() + '/list')
      .then(response => {
        changeFiles(response.data.videos)
      })
      .catch(_ => {
        console.error('Video list request fail')
      })
  }, [])

  return (
    <div className='App'>
      <AppHeaderWrapper>
        <h1>Web Admin</h1>
        <h2>Files</h2>
        {!files && <CircleLoader color='#61dafb' size={250} />}
        {files && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size (MB)</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {(files || []).map(file => {
                return (
                  <tr key={file.id}>
                    <td>
                      {file.name.split('/')[file.name.split('/').length - 1]}
                    </td>
                    <td>{(file.size / 1000 / 1000).toPrecision(3)}</td>
                    <td>
                      <a href={file.url}>Link</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </AppHeaderWrapper>
    </div>
  )
}

export default App
