import { Meteor } from 'meteor/meteor'
import updatedLessThanMinutes from './updated-recently'
import updateDatabase from './update-database'

const updateOnce = (period = 0, { manual = false } = {}) => {
  const goUpdate = ({ manual }) => {
    updateDatabase({ manual }, err => {
      if (err) {
        console.error(err.message || err)
        console.error('Will retry to update in 1 minute')
        Meteor.setTimeout(() => goUpdate({ manual }), 60000)
      }
    })
  }

  if (manual) {
    goUpdate({ manual })
  } else {
    const updatedRecently = updatedLessThanMinutes(period)
    if (!updatedRecently) {
      goUpdate({ manual })
    }
  }
}

const updateEvery = period => {
  updateOnce(period)
  Meteor.setInterval(() => updateOnce(period), period * 60 * 1000)
}

const UPDATE_PERIOD = parseInt(process.env.UPDATE_PERIOD) || 1440 // in minutes

Meteor.methods({
  updateDatabaseOnDemand() {
    // TODO: add option of update only current page
    updateOnce(undefined, { manual: true })
  }
})

export default function() {
  updateEvery(UPDATE_PERIOD)
}
