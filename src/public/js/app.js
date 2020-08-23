/**
 * Client side JS script
 *
 * @author Johan Andersson
 * @version 1.0
 */

const io = window.io('/')

// Catch event 'event' emitted from the express backend
io.on('event', (event) => {
  // Create note if type is a new comment
  if (event.type === 'note') {
    createNote(event)

    // Otherwise create/update issue in list
  } else if (event.type === 'issue') {
    switch (event.action) {
      case 'open':
        createIssue(event)
        break
      case 'update':
        updateIssue(event)
        break
      case 'close':
        closeIssue(event)
        break
      case 'reopen':
        reopenIssue(event)
        break
    }
  }

  // Finally create notification
  createNotification(event)
})

/**
 * Create note.
 *
 * @author Johan Andersson
 * @param {Event} event the event
 */
function createNote (event) {
  update(event, 'New comment!')
}

/**
 * Create notification.
 *
 * @author Johan Andersson
 * @param {Event} event the event
 */
function createNotification (event) {
  const template = document.getElementById('notificationTemplate').cloneNode(true).content

  template.querySelector('.action').innerText = event.action
  template.querySelector('.notificationLink').setAttribute('href', event.data.url)
  template.querySelector('.notificationLink').innerText = '#' + event.data.iid + ' ' + event.data.title
  template.querySelector('.notificationDate').innerText = event.data.updatedAt
  template.querySelector('.avatarLink').setAttribute('href', event.data.authorUrl)
  template.querySelector('.notificationAvatar').setAttribute('src', event.data.authorAvatar)
  template.querySelector('.notificationAuthor').setAttribute('href', event.data.authorUrl)
  template.querySelector('.notificationAuthor').innerText = event.data.author
  template.querySelector('.text').innerText = event.data.description

  document.querySelector('.notifications').insertBefore(template, document.querySelector('.notifications').children[1])
}

/**
 * Create a new issue in the list.
 *
 * @author Johan Andersson
 * @param {Event} event the event
 */
function createIssue (event) {
  const template = document.getElementById('issueTemplate').cloneNode(true).content

  template.querySelector('.issue').id = event.data.id

  template.querySelector('.titleLink').setAttribute('href', event.data.url)
  template.querySelector('.titleLink').innerText = '#' + event.data.iid + ' ' + event.data.title
  template.querySelector('.openStatus').innerText = event.data.state

  template.querySelector('.author').setAttribute('href', event.data.authorUrl)

  const authorNode = document.createTextNode(event.data.author)
  template.querySelector('.author').insertBefore(authorNode, template.querySelector('.author').firstChild)
  template.querySelector('.avatar').setAttribute('src', event.data.authorAvatar)

  template.querySelector('.createdAt').innerText = event.data.createdAt
  template.querySelector('.updatedAt').innerText = event.data.updatedAt

  template.querySelector('.description').innerText = event.data.description

  document.querySelector('.issues').insertBefore(template, document.querySelector('.issues').children[1])
}

/**
 * Update issue.
 *
 * @author Johan Andersson
 * @param {Event} event the event
 */
function updateIssue (event) {
  update(event, 'Updated!')
}

/**
 * Close issue.
 *
 * @author Johan Andersson
 * @param {Event} event the event
 */
function closeIssue (event) {
  update(event, 'Closed!')
}

/**
 * Reopen issue.
 *
 * @author Johan Andersson
 * @param {Event} event the event
 */
function reopenIssue (event) {
  update(event, 'Reopened!')
}

/**
 * Update an issues content in the list.
 *
 * @author Johan Andersson
 * @param {Event} event the event
 * @param {string} state the type of update
 */
function update (event, state) {
  const issue = document.getElementById(event.data.id)

  issue.querySelector('.news').innerText = state
  issue.querySelector('.header').classList.add('update')
  issue.querySelector('.openStatus').innerText = event.data.state
  issue.querySelector('.updatedAt').innerText = event.data.updatedAt

  if (state === 'New comment!') {
    const commentCount = issue.querySelector('.commentCount').textContent
    issue.querySelector('.commentCount').innerText = parseInt(commentCount) + 1
  }

  if (state === 'Updated!') {
    issue.querySelector('.description').innerText = event.data.description
  }

  document.querySelector('.issues').insertBefore(issue, document.querySelector('.issues').children[1])
}
