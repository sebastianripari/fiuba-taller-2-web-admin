/* Import Libs */
import React, { useEffect, useState, useCallback } from 'react'
import CircleLoader from 'react-spinners/CircleLoader'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Button from '@material-ui/core/Button'

/* Import Styled Components */
import { StatsWrapper } from '../styles/StatsStyled'
import { getStats } from '../webapi'

/* Import Constants */
import { COLOR_PRIMARY } from '../constants'

const Stats = () => {
  const start = new Date()
  start.setDate(start.getDate() - 5)

  const end = new Date()

  const [startDate, changeStartDate] = useState(start)
  const [endDate, changeEndDate] = useState(end)

  const toString = date => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  }

  const [loading, changeLoading] = useState(true)

  const [activeRecovery, changeActiveRecovery] = useState()
  const [activeSessions, changeActiveSessions] = useState()

  const [registeredAdminUsers, changeRegisteredAdminUsers] = useState()
  const [
    registeredAdminUsersActive,
    changeRegisteredAdminUsersActive
  ] = useState()
  const [
    registeredAdminUsersClosed,
    changeRegisteredAdminUsersClosed
  ] = useState()

  const [registeredUsers, changeRegisteredUsers] = useState()
  const [registeredUsersActive, changeRegisteredUsersActive] = useState()
  const [registeredUsersClosed, changeRegisteredUsersClosed] = useState()
  const [
    registeredAdminUsersLoginService,
    changeRegisteredAdminUsersLoginService
  ] = useState()

  const doGetStats = useCallback(() => {
    changeLoading(true)
    getStats(toString(startDate), toString(endDate))
      .then(response => {
        const { data } = response
        console.error(data)
        changeActiveRecovery(data.active_recovery)
        changeActiveSessions(data.active_sessions)

        changeRegisteredAdminUsers(data.registered_adminusers)
        changeRegisteredAdminUsersActive(data.registered_adminusers_active)
        changeRegisteredAdminUsersClosed(data.registered_adminusers_closed)

        changeRegisteredUsers(data.registered_users)
        changeRegisteredUsersActive(data.registered_users_active)
        changeRegisteredUsersClosed(data.registered_users_closed)
        changeRegisteredAdminUsersLoginService(
          data.registered_users_login_service
        )
        changeLoading(false)
      })
      .catch(_ => {
        console.error('Get Stats Error')
      })
  }, []) //eslint-disable-line

  useEffect(() => {
    doGetStats()
  }, [doGetStats])

  return (
    <StatsWrapper>
      <h2>Estadisticas</h2>
      {loading ? (
        <CircleLoader color={COLOR_PRIMARY} size={250} />
      ) : (
        <div className='stats'>
          <h2>Totales</h2>
          <div className='numerical'>
            <div className='stat'>
              <h3>Sessiones & Links</h3>
              <div>
                Sesiones Activas: <b>{activeSessions}</b>
              </div>
              <div>
                Links de Recuperar Contraseña Activos: <b>{activeRecovery}</b>
              </div>
            </div>

            <div className='stat'>
              <h3>Usuarios Admin</h3>
              <div>
                Registrados: <b>{registeredAdminUsers}</b>
              </div>
              <div>
                Registrados Activos: <b>{registeredAdminUsersActive}</b>
              </div>
              <div>
                Registrados Cerrados: <b>{registeredAdminUsersClosed}</b>
              </div>
            </div>

            <div className='stat'>
              <h3>Usuarios</h3>
              <div>
                Registrados: <b>{registeredUsers}</b>
              </div>
              <div>
                Registrados Activos: <b>{registeredUsersActive}</b>
              </div>
              <div>
                Registrados Cerrados: <b>{registeredUsersClosed}</b>
              </div>
              <div>
                Registrados con Login Service:{' '}
                <b>{registeredAdminUsersLoginService}</b>
              </div>
            </div>
          </div>

          <div className='time-range'>
            <div className='date'>
              <h4>Comienzo</h4>
              <DatePicker
                selected={startDate}
                onChange={changeStartDate}
                showTimeSelect
                dateFormat='yyyy/MM/dd HH:mm'
                timeFormat='HH:mm'
                timeIntervals={15}
                timeCaption='Time'
              />
            </div>

            <div className='date'>
              <h4>Final</h4>
              <DatePicker
                selected={endDate}
                onChange={changeEndDate}
                showTimeSelect
                dateFormat='yyyy/MM/dd HH:mm'
                timeFormat='HH:mm'
                timeIntervals={15}
                timeCaption='Time'
              />
            </div>

            <Button
              variant='contained'
              style={{ backgroundColor: COLOR_PRIMARY }}
              onClick={doGetStats}
            >
              Obtener
            </Button>
          </div>

          <div className='charts'>
            <h2>Graficos</h2>
          </div>
        </div>
      )}
    </StatsWrapper>
  )
}

export default Stats
