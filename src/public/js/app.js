const io = window.io('/')

console.log('client test')

io.on('event', (event) => {
  // console.log('hallelujah')
  console.log(event)

  console.log('type', event.type)
  console.log('action', event.action)

  if (event.type === 'note') {
    createNote(event)
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
  createNotification(event)
})

/**
 * @param event
 */
function createNote (event) {
  update(event, 'New comment!')
}

/**
 * @param event
 */
function createNotification (event) {
  const template = document.getElementById('notificationTemplate').cloneNode(true).content
  console.log(template)
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
 * @param event
 */
function createIssue (event) {
  const template = document.getElementById('issueTemplate').cloneNode(true).content
  // console.log(template.querySelector('.issue'))
  console.log(template)
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
 * @param event
 */
function updateIssue (event) {
  update(event, 'Updated!')
}

/**
 * @param event
 */
function closeIssue (event) {
  update(event, 'Closed!')
}

/**
 * @param event
 */
function reopenIssue (event) {
  update(event, 'Reopened!')
}

/**
 * @param event
 * @param state
 */
function update (event, state) {
  const issue = document.getElementById(event.data.id)
  // const status = document.createElement('span')
  // status.classList.add('new')
  // status.innerText = state
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
