/* Import Libs */
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import CircleLoader from 'react-spinners/CircleLoader'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import _ from 'lodash'
import { Snackbar, SnackbarContent } from '@material-ui/core'

/* Import Components */
import DeleteModal from '../components/Modal'

/* Import Styled Components */
import { FilesWrapper } from '../styles/FilesStyled'
import { StyledTableCell, StyledTableRow } from '../styles/TableStyled'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

/* Import WebApi */
import { getVideos, removeVideo } from '../webapi'

/* Import Constants */
import { AUTH_LOGOUT, COLOR_ACTIONS, COLOR_PRIMARY } from '../constants'
import Tooltip from '@material-ui/core/Tooltip'

const Files = () => {
  const [files, changeFiles] = useState()
  const [selected, changeSelected] = useState({})
  const [modalOpen, changeModalOpen] = useState()
  const [informOpen, changeInformOpen] = useState()

  const dispatch = useDispatch()

  useEffect(() => {
    getVideos()
      .then(response => {
        const { data } = response
        changeFiles(data.data.map(video => video.media))
      })
      .catch(err => {
        console.error(err)
        if (err.response !== 500) {
          dispatch({
            type: AUTH_LOGOUT
          })
        }
      })
  }, [dispatch])

  function remove () {
    removeVideo(selected.video_id)
      .then(response => {
        changeFiles(_.without(files, selected))
        changeModalOpen(false)
        changeInformOpen(true)
      })
      .catch(err => {
        console.error(err)
        if (err.response !== 500) {
          dispatch({
            type: 'AUTH_LOGOUT'
          })
        }
      })
  }

  return (
    <FilesWrapper>
      <DeleteModal
        resource='video'
        name={selected.name}
        remove={remove}
        modalOpen={modalOpen}
        changeModalOpen={changeModalOpen}
      />
      <Snackbar
        open={informOpen}
        onClose={() => changeInformOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={6000}
      >
        <SnackbarContent
          message='Video borrado con éxito'
          style={{
            color: 'black',
            backgroundColor: COLOR_PRIMARY,
            fontSize: '14px'
          }}
        />
      </Snackbar>
      <h2>Archivos</h2>
      {files ? (
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Archivo</StyledTableCell>
              <StyledTableCell>Nombre</StyledTableCell>
              <StyledTableCell>Tamaño </StyledTableCell>
              <StyledTableCell>Formato</StyledTableCell>
              <StyledTableCell>Fecha de creación</StyledTableCell>
              <StyledTableCell>Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(files || []).map(file => {
              return (
                <StyledTableRow key={file.video_id}>
                  <StyledTableCell>
                    <Tooltip title='Haga click para mostrar el archivo'>
                      <a href={file.url}>
                        <img
                          alt='thumb'
                          width='80px'
                          height='40px'
                          src={file.thumb}
                        />
                      </a>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell>{file.name}</StyledTableCell>
                  <StyledTableCell>
                    {(file.size / 1024 / 1024).toPrecision(3)} MB
                  </StyledTableCell>
                  <StyledTableCell>{file.type}</StyledTableCell>
                  <StyledTableCell>{file.date_created}</StyledTableCell>
                  <StyledTableCell>
                    <DeleteForeverIcon
                      style={{ color: COLOR_ACTIONS }}
                      onClick={() => {
                        changeSelected(file)
                        changeModalOpen(true)
                      }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <CircleLoader color={COLOR_PRIMARY} size={250} />
      )}
    </FilesWrapper>
  )
}

export default Files
